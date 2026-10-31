// Switch pages and page sections on or off without touching components.
// A disabled page returns 404 and disappears from menus, the sitemap and
// "next page" links.
import type { PageKey } from "./routes";

export type FeaturesConfig = {
  pages: Record<Exclude<PageKey, "home">, boolean>;
  home: {
    nameNote: boolean;
    explore: boolean;
    atAGlance: boolean;
  };
  /** Small "Photo: author, licence" line under each photo. If off, keep the credits page on (licence requirement). */
  inlinePhotoCredits: boolean;
  breadcrumbs: boolean;
  /** "Next: …" link at the bottom of each page, following navigation.pageOrder. */
  nextPageLink: boolean;
  /** JSON-LD for search engines. */
  structuredData: boolean;
};

export const features: FeaturesConfig = {
  pages: {
    about: true,
    temple: true,
    wildlife: true,
    people: true,
    thingsToDo: true,
    trek: true,
    nearby: true,
    visit: true,
    faq: true,
    gallery: true,
    credits: true,
  },
  home: {
    nameNote: true,
    explore: true,
    atAGlance: true,
  },
  inlinePhotoCredits: true,
  breadcrumbs: true,
  nextPageLink: true,
  structuredData: true,
};
