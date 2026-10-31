@AGENTS.md

# Project context: Kalikesam website

Multi-page visitor site for Kalikesam (காளிகேசம்), a Kali shrine and forest river in Kanyakumari Wildlife Sanctuary, Tamil Nadu. Read docs/HANDOFF.md first (status, decisions, open items), then README.md for setup, the customisation table and structure. Deployment plan: docs/DEPLOYMENT.md.

## Conventions

- **Config, not constants.** Colours, fonts, sizes, motion and image quality: `src/config/theme.config.ts`. Identity, contact and links: `site.config.ts`. Toggles: `features.config.ts`. Menus and reading order: `navigation.config.ts`. URLs: `routes.ts` (must match `src/app/` folders). Never hard-code these in components.
- **Content, not strings.** Every visitor-facing word lives in `src/content/en/*` (typed by `src/content/types.ts`) so a Tamil version can be added. Components import `content` from `@/content`, never from `./en` directly.
- **Facts need sources.** Every claim must trace to `src/content/en/sources.ts`. Don't add dates, festivals, legends or species without one.
- **Disabled pages must vanish.** Any new link to a page goes through `isPageEnabled(key)` and `href(key)`.
- **Images:** list them in `src/content/images.json` (with category and credit) and render them with `<Photo>`, `<Figure>` or `<PhotoCredit>`. Only a page's LCP image gets `priority`. Never hotlink Wikimedia.
- **Server first.** Client islands: `SiteHeaderBar`, `HeroBackdrop`, `ExploreIndex`, `FieldGuide`, `GalleryGrid`, `RiverLine`. Pass server-rendered `<Photo>` nodes and plain strings into them, never the content module or functions.
- **Motion budget.** Framer Motion only via `LazyMotion` + `m` (strict, `domAnimation`; `layoutId` needs `domMax`, so avoid it). GSAP only via dynamic import. Honour `prefers-reduced-motion` and `theme.motion`.
- **Next 16 specifics:** `cacheComponents` is on, so no `new Date()`/`Math.random()` in server render. `images.qualities` must list every quality used (next.config reads `theme.images`). `next lint` is gone. Header links prefetch on intent, not in the viewport.
- **Colour contrast** is unit-tested (`contrastPairs` in `theme-css.ts`). Add a pair there when you introduce a new text/background combination.

## Before committing

Run `npm run check` (lint, typecheck, unit tests, build) and `npm run test:e2e` (needs a build and `npx playwright install chromium`). Update README.md and CHANGELOG.md when behaviour changes.
