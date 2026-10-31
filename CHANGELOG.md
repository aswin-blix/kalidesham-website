# Changelog

## Unreleased

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
