# Deploying to Vercel

A step-by-step plan for the first deployment and the routine after it. Vercel facts below were checked against Vercel's documentation on 2026-10-31; limits change, so re-check the linked pages before deciding.

## Decide first

These four choices change what you set up. Nothing in the code needs to change for the defaults to work.

### 1. Hobby or Pro plan

Vercel's Hobby plan is free but **limited to non-commercial, personal use** ([Hobby plan](https://vercel.com/docs/plans/hobby)). If this site is client work or will carry bookings, ads or a business's name, use Pro.

Hobby limits that matter for this site, per month:

| Resource | Hobby includes | This site |
| --- | --- | --- |
| Fast Data Transfer | 100 GB | Pages are static; photos dominate. |
| Image transformations | 5,000 | See decision 3. |
| Image cache reads / writes | 300,000 / 100,000 | |
| Deployments per day | 100 | |

On Hobby, going over the image limit does not cost money, but **new photo sizes stop being optimised and fail with a 402 error**; already-cached ones keep working ([image limits](https://vercel.com/docs/image-optimization/limits-and-pricing)). Other Hobby limits pause the feature until 30 days have passed.

### 2. Node.js version

Vercel currently offers Node **22.x, 24.x and 26.x (default)**. Node 20 was deprecated on Vercel on 2026-10-01 ([Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)).

`package.json` says `"engines": { "node": ">=20.9.0" }`, which Vercel resolves to the **latest 26.x**. To build on the same major version you use locally, pick one:

- Set it in Vercel: Project → Settings → Build and Deployment → Node.js Version, **or**
- Pin it in `package.json`, e.g. `"node": "24.x"` (this overrides the dashboard setting), and update README → Getting started to match.

Run `node -v` on your machine and choose that major version if Vercel offers it.

### 3. How long optimised photos are cached

Each photo is served in several widths and two formats (AVIF and WebP). Vercel bills one **transformation** each time a size is created or refreshed after its cache expires. The cache lifetime is the larger of Next's `images.minimumCacheTTL` (default 4 hours in Next 16) and the photo's own `Cache-Control` header, which `next.config.ts` sets to 1 day for `/images/*`.

- Worst case with the current settings: 28 photos × up to 14 widths × 2 formats, roughly 800 variants, each re-created at most once a day. A busy month could pass 5,000 transformations; a quiet one will not.
- Lower-risk option, recommended by Vercel for images that rarely change: add `minimumCacheTTL: 2678400` (31 days) under `images` in `next.config.ts` ([Vercel guide](https://vercel.com/kb/guide/reduce-image-optimization-costs-on-vercel)). That caps re-creation at about once a month per variant. The trade-off: an overwritten photo can stay stale for up to 31 days, so swap photos by giving them a new id (HANDOFF.md → Working notes).
- Dropping AVIF would halve the variants but make photos heavier, so it is not recommended for this site.

If you change `next.config.ts`, run `npm run check` and `npm run test:e2e` before committing, and note it in CHANGELOG.md.

### 4. Domain

Decide whether the site launches on the free `*.vercel.app` address or a custom domain. The domain sets `NEXT_PUBLIC_SITE_URL` (step 4).

## Steps

### Step 1. Verify locally

```bash
npm run check          # lint → typecheck → unit tests → build
npm run test:e2e       # needs: npx playwright install chromium
```

Both must pass. Bump `package.json` to `0.2.0` to match CHANGELOG.md.

### Step 2. First commit

The repository has no commits yet. Make sure these are included, because the Vercel build should not depend on Wikimedia:

- `public/images/*.jpg` (28 photos)
- `src/content/image-meta.json`
- `src/app/opengraph-image.jpg` and `opengraph-image.alt.txt`

`.env*` files are ignored, except `.env.example`. Then:

```bash
git add -A
git status             # review: no .env, no .next, no node_modules
git commit -m "Kalikesam visitor site 0.2.0"
```

### Step 3. Push to GitHub

Create an empty repository on GitHub (no README, so histories don't clash), then:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

### Step 4. Import into Vercel

1. vercel.com → Add New → Project → import the GitHub repository.
2. Framework preset: **Next.js** (detected). Leave Build Command (`npm run build`), Install Command and Output Directory on their defaults. `npm run build` runs `prebuild`, which sees all photos already present and downloads nothing.
3. Node.js version: as decided above.
4. Environment variables: add `NEXT_PUBLIC_SITE_URL` = `https://<your-domain>` for **Production only**.
   - Leave it unset for Preview. Preview builds then fall back to Vercel's production URL (`VERCEL_PROJECT_PRODUCTION_URL`, set automatically), so their canonical links point at production rather than at the preview address.
   - If you launch on `*.vercel.app` only, you can skip this variable; the production URL is picked up automatically.
5. Deploy.

### Step 5. Custom domain (optional)

Project → Settings → Domains → add the domain and create the DNS records Vercel shows. Make `NEXT_PUBLIC_SITE_URL` match the primary domain exactly (with or without `www`), then redeploy so canonical links, the sitemap and Open Graph URLs use it.

### Step 6. Check the live site

| Check | How |
| --- | --- |
| All 12 pages load | Click through the header, footer and "Next" links. |
| Canonical and Open Graph URLs use the real domain | View source on any page; search for `canonical` and `og:url`. |
| Sitemap and robots | `/sitemap.xml` lists 12 URLs on the real domain; `/robots.txt` points to it. |
| Social card | Paste a page URL into a link-preview checker (e.g. the LinkedIn Post Inspector). |
| Structured data | Run the home page and `/faq` through Google's Rich Results Test. |
| Performance | Lighthouse (mobile and desktop) on `/`, `/about`, `/wildlife`, `/gallery`. Compare with HANDOFF.md. |
| Photos | Gallery lightbox opens; no broken images. In Vercel → Usage, image transformations rise and then level off. |

Then submit `/sitemap.xml` in Google Search Console.

## After launch

- **Every push to `main`** deploys to production; every other branch or pull request gets a preview URL. Run `npm run check` before pushing.
- **Roll back** from the Vercel dashboard: Deployments → pick the last good one → Promote to Production (Instant Rollback).
- **Watch usage** in Vercel → Usage, especially image transformations on Hobby.
- **Optional CI.** A GitHub Actions workflow running `npm ci && npm run check` (and `npx playwright install --with-deps chromium && npm run test:e2e`) on pull requests would stop a broken build reaching preview. Not set up yet.
- **Seasonal content check.** Re-verify hours and fees against the official sites (README → Content accuracy) before each season and redeploy.
