# Kalikesam

Visitor website for **Kalikesam (காளிகேசம்)**, the Kali shrine and forest river inside Kanyakumari Wildlife Sanctuary, Tamil Nadu.

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Framer Motion, GSAP + ScrollTrigger, CSS Modules. Every page is prerendered as static HTML.

## Pages

| URL | Page | Highlights |
| --- | --- | --- |
| `/` | Home | Tamil name hero, what the name means, index of every page (photo preview follows the pointer), at-a-glance facts |
| `/about` | The place | Where it is, the road in (GSAP river line linking five stops), the forest around it |
| `/temple` | Kali shrine & history | The shrine, visiting respectfully, timeline from the Kani to today |
| `/wildlife` | Wildlife | Field guide with six animals (Framer Motion), species list, discoveries, wildlife etiquette |
| `/people` | The Kani | Who they are, forest knowledge, archive photo, visiting respectfully |
| `/things-to-do` | Things to do | Seven activities, trek teaser |
| `/trek` | Maramalai trek | Route, facts, what's included, packing, rules, booking |
| `/nearby` | Nearby | Six places with distances, facts and map links |
| `/visit` | Plan your visit | Hours, fees, routes, distances, season, facilities, rules, stays |
| `/faq` | FAQ | 13 questions (with FAQPage structured data) |
| `/gallery` | Gallery | Filterable photo grid with a keyboard-friendly lightbox |
| `/credits` | Photo credits | Author and licence for all 28 photos, plus the fact sources |

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

**First run downloads the photos.** `npm run dev` and `npm run build` run `scripts/fetch-images.mjs` first. It downloads every photo listed in `src/content/images.json` from Wikimedia Commons into `public/images/`, recompresses it, and records its size and blur placeholder in `src/content/image-meta.json`. Files already on disk are skipped. **Commit `public/images/`, `src/content/image-meta.json` and `src/app/opengraph-image.*`** so deployments don't depend on Wikimedia.

If a download fails, the command stops and lists what is missing; run `npm run images` again. To build without photos (offline CI), set `IMAGES_OPTIONAL=1`: `IMAGES_OPTIONAL=1 npm run build` in bash, or `$env:IMAGES_OPTIONAL=1; npm run build` in PowerShell.

## Customising the site

Almost everything is set in typed files under `src/config/` and `src/content/`. TypeScript flags a typo, and `validateConfig()` stops the build with a readable message if the settings contradict each other.

| I want to… | Edit |
| --- | --- |
| Change colours | `src/config/theme.config.ts` → `colors` |
| Change fonts | `theme.config.ts` → `fonts` (pick from `src/fonts/index.ts`) |
| Change text sizes, page width, spacing, corner radius | `theme.config.ts` → `type`, `layout` |
| Turn animations off, or speed them up or slow them down | `theme.config.ts` → `motion` (`enabled`, `speed`, and one switch per effect) |
| Change photo compression | `theme.config.ts` → `images` |
| Change the name, local-script name, URL, phone, email, social links | `src/config/site.config.ts` |
| Change booking links, opening hours, search keywords, schema type | `site.config.ts` → `links`, `openingHours`, `seo`, `schemaType` |
| Hide a page, a home section, breadcrumbs, "Next" links, photo credits, structured data | `src/config/features.config.ts` |
| Change the header links, header button, footer columns, reading order | `src/config/navigation.config.ts` |
| Edit any text | `src/content/en/<page>.ts` (one file per page; `ui.ts` for interface wording) |
| Change a page's title, menu label, search description or hero photo | `src/content/en/pages.ts` |
| Add or swap a photo | `src/content/images.json`, then `npm run images` |
| Add a font | Put the `.woff2` in `src/fonts/`, add an entry to `src/fonts/index.ts`, select it in `theme.config.ts` |
| Change a page's URL | `src/config/routes.ts` **and** rename the matching folder in `src/app/` (a test checks they match) |

Theme values become CSS variables (`--color-*`, `--font-*`, `--text-*`, `--page`, `--gutter`, `--section-y`, `--radius`, `--motion-speed`). Every stylesheet reads them, so a change applies site-wide. A unit test checks every text and background pairing against WCAG AA, so `npm test` tells you if a new colour is too faint to read.

**Hiding a page** (`features.pages.gallery = false`) returns a 404 for its URL and removes it from the header, footer, home index, "Next" links, in-page links and the sitemap.

**Photo credits** are required by the photos' Creative Commons licences. You can turn off the small inline credits, but then the credits page must stay on; the build enforces this.

### Adding a page

1. Add its key and URL to `src/config/routes.ts`, and a flag to `features.config.ts`.
2. Add its copy to `src/content/en/pages.ts` (and a content file if it needs one).
3. Create `src/app/<url>/page.tsx`, following any existing page: `pageMetadata("key")`, `requirePage("key")`, `<PageHero page="key" />`, `<NextPageLink current="key" />`.
4. List it in `navigation.config.ts`.

### Adding Tamil (or another language)

The content is already separated from the code. To add Tamil:

1. Copy `src/content/en/` to `src/content/ta/` and translate the strings. TypeScript checks that nothing is missing.
2. Add `alt` overrides for photos if needed; alt text currently lives in `images.json`.
3. Add a `[lang]` route segment and choose `en` or `ta` in `src/content/index.ts`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Fetch missing photos, then start the dev server |
| `npm run build` | Fetch missing photos, then make a production build |
| `npm start` | Serve the production build |
| `npm run images` | Fetch missing photos (`-- --force` re-downloads all) |
| `npm run lint` | ESLint (Next 16 removed `next lint`) |
| `npm run typecheck` | Generate Next route types, then run TypeScript (no emit) |
| `npm test` | Unit tests (Vitest): config validation, theme contrast, content integrity, image pipeline, river geometry |
| `npm run test:e2e` | Browser tests (Playwright) against the production build |
| `npm run check` | lint → typecheck → unit tests → build |

The browser tests need a build and a browser: run `npm run build` and `npx playwright install chromium` once.

## Project structure

```
scripts/                 Photo download + optimisation (runs before dev/build)
src/
  config/                Everything configurable (see "Customising")
  fonts/                 Self-hosted font files + registry (OFL licences included)
  content/
    types.ts             The shape of all visitor-facing text
    en/                  English content, one file per page
    images.json          Photo manifest: Commons URL, alt text, author, licence, category
    images.ts            Typed access to the manifest
  components/            Shared components (header, footer, page hero, blocks, interactive islands)
  lib/                   Page metadata helper, river geometry, lazy motion features
  app/                   One folder per page, plus sitemap.ts and robots.ts
tests/                   Vitest unit tests
e2e/                     Playwright tests
```

## How the motion is built, and what it costs

| Effect | Tool | Loading |
| --- | --- | --- |
| Hero letters rising, page titles fading in | CSS keyframes | No JavaScript; visible before hydration |
| Hero parallax, header state, mobile menu | Framer Motion | `LazyMotion` + `m`; the animation engine loads on demand |
| Field guide, gallery lightbox, home index preview | Framer Motion | Same lazy features |
| River line on `/about` | GSAP ScrollTrigger | Imported only when the journey is a quarter-screen away |

All motion respects the visitor's reduce-motion setting and `theme.motion`.

> Framer Motion is now also published as `motion` (`import { … } from "motion/react"`). This project uses the `framer-motion` package as requested. Switching later only means changing the imports.

## Performance

- Static HTML for every page. The CSS (~21 KB, ~5 KB gzipped) is inlined, so there are no render-blocking stylesheet requests.
- Self-hosted photos served as AVIF/WebP at responsive sizes with blur placeholders. Each page's hero photo loads eagerly at high priority and lighter quality (it sits under a gradient); everything else lazy-loads.
- Self-hosted fonts (four files); the Tamil file is restricted to the Tamil `unicode-range`.
- Header links prefetch on hover, focus or touch rather than on load. GSAP never loads on pages without the river.
- Below-the-fold sections use `content-visibility: auto`. Layout shift (CLS) is 0 on every page.

Lighthouse on the production build:

- **Desktop:** Performance 95–100 on every page; Accessibility, Best Practices and SEO 100 everywhere.
- **Mobile (simulated mid-range phone on slow 4G):** Accessibility, Best Practices and SEO 100 everywhere. Performance is 88–99 on pages that open with text, and 74–97 on pages that open with a full-bleed photo; scores vary several points run to run. The gap is React and Next's own JavaScript sharing the simulated slow connection with the hero photo. Measured unthrottled, the largest paint is under 0.25 s.

## Deploying

Works on Vercel or any Node host (`npm run build && npm start`). Set `NEXT_PUBLIC_SITE_URL` to the public URL (see `.env.example`). Canonical links, Open Graph URLs, structured data and the sitemap use it. Without it they are left out rather than pointing at localhost, and Next warns during the build. On Vercel, the production URL is picked up automatically.

## Content accuracy

Every fact comes from a source listed on `/credits` (and in `src/content/en/sources.ts`). No reliable published source gives the temple's festival calendar or legend, so the site says so rather than inventing one. Forest Department fees and hours change, so re-check them against [Tamil Nadu Tourism](https://tamilnadutourism.tn.gov.in/destinations/kalikesam) and the [district site](https://kanniyakumari.nic.in/kalikesam/) before each season.

## Licences

- Photos: Wikimedia Commons contributors under CC BY-SA / CC BY / public domain. See `/credits`.
- Fonts: Arima and Hind Madurai, SIL Open Font License (`src/fonts/OFL-*.txt`).
