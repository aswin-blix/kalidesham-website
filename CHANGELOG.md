# Changelog

## Unreleased

- Home page redesigned to feel like walking into the forest:
  - A treeline edge leads into a dense-forest section with the sanctuary in numbers (area, forest types, rivers, rainfall, all from cited sources) and a five-photo mosaic whose smaller photos drift as you scroll.
  - "Explore Kalikesam" is now a winding forest path: a numbered stop with a photo for every page, signposts where the path enters Discover, Experience and Plan, and the path drawn by GSAP as you scroll (the river line from `/about`, in a new `trail` style). The previous compact list is still available with `features.home.exploreStyle = "list"`.
  - Wildlife photo cards linking to the field guide, and "At a glance" over a photo.
  - New switches: `features.home.forest`, `exploreStyle`, `wildlife`; `theme.motion.trail`, `mosaicDrift`.
- The river line no longer measures the page during hydration; it waits for the first layout.
- Section ids that other pages link to (`#journey`, `#guide`) now live in `routes.ts` → `anchors`.
- The build now requires the credits page while the home page shows uncredited photos (index, wildlife cards).
- Reduced motion: the hero opening no longer waits for the first animation frame at zero opacity.
- Tests: treeline geometry (including the true top of every crown), signpost groups, forest numbers traced to the about-page copy, the credits-page rule, the forest path drawing and lighting its stops, clicking a stop's photo, wildlife cards reaching the field guide. New e2e tests skip themselves when their feature is switched off. Three new colour pairs in the contrast test.
- Docs: `docs/HANDOFF.md` (status, decisions, open items, how to resume) and `docs/DEPLOYMENT.md` (Vercel plan). README's customisation table now names the real `site.config.ts` keys (`seo`, `schema`).

## 0.2.0 (2026-10-31)

The site is now multi-page and configurable.

- Twelve pages instead of one: home, about, temple and history, wildlife, the Kani people, things to do, Maramalai trek, nearby, plan your visit, FAQ, gallery and photo credits. Each page has its own metadata, breadcrumbs and a "Next" link following the reading order.
- New content, all sourced: a temple history timeline (Pechiparai dam, Travancore, rubber and clove, the sanctuary), the Kani people's population, settlements and the arogyapacha benefit-sharing story, Thirparappu falls, the Thirunanthikarai cave temple, an Asian elephant in the field guide, 13 FAQs, and nine new photos.
- Configuration layer in `src/config/`: theme (colours, fonts, type scale, layout, image quality, motion switches) rendered as CSS variables; site identity, contact and links; feature toggles for every page and home section; navigation menus and reading order. The build validates it.
- Content layer in `src/content/` with a typed `Content` interface, so a Tamil translation can be added without touching components.
- Home page index with a photo preview that follows the pointer; filterable gallery with a native `<dialog>` lightbox; FAQ with FAQPage structured data; sitemap and robots.
- Performance: hero photos load eagerly at high priority instead of via preload; header links prefetch on intent; one font file fewer; GSAP loads only near the river.
- Accessibility: a darker brand colour for text on light backgrounds, readable photo credits, and a unit test that checks every theme colour pairing against WCAG AA.

## 0.1.0 (2026-10-31)

First version of the Kalikesam visitor site.

- Home page sections: hero, name meaning, journey along the road (GSAP river line), wildlife field guide (Framer Motion), people and history timeline, things to do with the Maramalai trek, nearby places, and visit planning.
- Photo credits page covering all 19 Wikimedia Commons images.
- Image pipeline (`npm run images`) that downloads, recompresses and measures the photos and generates blur placeholders and the social card.
- Self-hosted Arima (Latin and Tamil) and Hind Madurai fonts.
- TouristAttraction structured data, Open Graph and Twitter metadata.
- Unit tests (Vitest) and end-to-end tests (Playwright).
- Accessibility: ink focus ring on light surfaces and turmeric on dark ones, Escape returns focus to the menu button, the credits table keeps its labels on phones, and reduced motion removes animation delays and the parallax.
