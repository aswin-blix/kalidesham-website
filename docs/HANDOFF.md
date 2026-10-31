# Handoff: where the project stands

Last updated 2026-10-31 (after the home page redesign). Read this first when picking the project up again, then README.md (setup, customisation, structure) and CLAUDE.md (coding conventions).

## Status

- **Version 0.2.0 plus an unreleased home page redesign** (see CHANGELOG.md → Unreleased): a 12-page visitor guide for Kalikesam, built and verified. The home page has a dense-forest section, a forest-path index (one photo stop per page) and wildlife cards.
- **Git:** committed on `main`. The first commit is pushed to GitHub (`aswin-blix/kalidesham-website`); run `git status` to see whether later commits are pushed.
- All 28 photos, `src/content/image-meta.json` and `src/app/opengraph-image.jpg` are the real Wikimedia Commons photos and are committed, so Vercel builds never need Wikimedia.
- Not deployed yet. The plan is in [DEPLOYMENT.md](DEPLOYMENT.md).

## Last verified results

Run on the production build before this handoff:

| Check | Result |
| --- | --- |
| `npm run lint` | Clean |
| `npm run typecheck` | Clean |
| `npm test` (Vitest) | 111 passed |
| `npm run build` | All 12 pages prerendered as static HTML |
| `npm run test:e2e` (Playwright, desktop + Pixel 7) | 67 passed, 5 skipped. The skips are deliberate: those tests only apply to one of the two viewports. |
| Lighthouse, desktop | Performance 95–100; Accessibility, Best Practices, SEO 100 |
| Lighthouse, mobile (slow 4G) | Performance 88–99 on text-led pages, 74–97 on photo-led pages (home after the redesign: 88–95; desktop 100); the rest 100 |

The first Lighthouse runs used stand-ins for the nine photos added in 0.2.0 (the sandbox could not reach Wikimedia); the redesigned home page was measured with all real photos. Re-run every page on the first Vercel preview (DEPLOYMENT.md, step 6).

## Resume in five minutes

```bash
cd D:\AswinBlix\Projects\others\kalidesham-website
npm install
npm run dev            # http://localhost:3000 (photos already present, so no downloads)
npm run check          # lint → typecheck → unit tests → build
npx playwright install chromium   # once
npm run test:e2e       # browser tests against the build
```

## Key decisions

| Decision | Why |
| --- | --- |
| Next.js 16 App Router, every page static | Fastest possible first paint; nothing needs a server at request time. |
| Typed config in `src/config/` (theme, site, features, navigation, routes) | "Fully customisable" was a requirement. TypeScript catches typos and `validateConfig()` stops a build with contradictory settings. |
| All visitor-facing text in `src/content/en/` behind a typed `Content` interface | English now, Tamil later without touching components. |
| Photos downloaded once into `public/images/`, never hotlinked | Performance, and the site keeps working if Wikimedia is slow or blocked. |
| Framer Motion through `LazyMotion` + `m`; GSAP only by dynamic import near the river line | Keeps the JavaScript on first load small. |
| Header links prefetch on hover/focus/touch, not on load | Prefetching every link on load added blocking time on phones. |
| Hero photo uses `fetchPriority="high"` + eager loading instead of `preload` | `preload` was producing a low-priority request. |
| Facts without a credible source are not invented | No reliable source gives the temple's festivals or legend; the site says so. |
| Home index is a forest path, reusing the `/about` river line (`RiverLine variant="trail"`) | Asked for a richer, "dense forest" home with a timeline feel; reusing the GSAP line keeps one implementation. The old list remains as `exploreStyle: "list"`. |
| Scroll reveals and mosaic drift are CSS scroll-driven animations | No JavaScript cost; markers never move, because the path is measured from them. Text never fades, so it is always readable. |

## Open items

1. **Temple facts.** Festival calendar and legend are marked as unverified. Add them only with a source in `src/content/en/sources.ts`.
2. **Opening hours live in three places:** `site.config.ts` → `openingHours` (search engines), `src/content/en/home.ts` and `src/content/en/visit.ts` (visitor text). Change all three together. Re-check hours and fees against the official sites before each season (links in README → Content accuracy).
3. **Tamil translation.** The content layer is ready; the `[lang]` route and translated files are not built. Steps are in README → Adding Tamil.
4. **Deployment decisions** listed at the top of DEPLOYMENT.md (Vercel plan, Node version, image cache lifetime, domain).

## Working notes

- Next 16 differs from older versions: read `node_modules/next/dist/docs/` before changing framework code (AGENTS.md says the same).
- `npm run typecheck` runs `next typegen` first because `LayoutProps` is a generated type; plain `tsc` on a fresh clone fails without it.
- If photos look stale in dev after replacing a file, delete `.next/cache/images`.
- To swap a photo, give it a **new id** in `src/content/images.json` rather than overwriting the old file. Optimised copies are cached by URL, so a new name guarantees visitors see the new photo.
