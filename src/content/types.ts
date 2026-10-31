// The shape of all visitor-facing text. English lives in ./en; a Tamil version
// would be a ./ta folder exporting the same `Content` object (see README).
import type { FooterGroupKey } from "@/config/navigation.config";
import type { PageKey } from "@/config/routes";
import type { SiteConfig, SocialKey } from "@/config/site.config";
import type { ImageCategory, ImageId } from "./images";

export type Paragraphs = string[];

export type Fact = { label: string; value: string };

export type Source = { title: string; href: string };

export type PageCopy = {
  /** Label in menus and breadcrumbs. */
  navLabel: string;
  /** Page heading (h1). */
  title: string;
  /** Browser tab / search result title. Defaults to `title`. */
  metaTitle?: string;
  /** Search result snippet and the line under the link on the home page index. */
  description: string;
  /** Lead paragraph under the heading. */
  intro?: string;
  /** Photo behind the page heading. */
  heroImage?: ImageId;
  /** Photo for links to this page (home page index) when it has no hero photo. */
  thumbImage?: ImageId;
  /** Optional heading in the local script, shown above the title. */
  localTitle?: string;
};

export type Ui = {
  skipLink: string;
  menuOpen: string;
  menuClose: string;
  sectionsNav: string;
  breadcrumb: string;
  home: string;
  next: string;
  photoCredit: (author: string, license: string) => string;
  stopCount: (n: number, total: number) => string;
  footerGroups: Record<FooterGroupKey, string>;
  footerDisclaimer: string;
  footerPhotos: string;
  footerSeeCredits: string;
  footerContact: string;
  getDirections: string;
  /** "{lat}" and "{lng}" are replaced. */
  coordinates: string;
  social: Record<SocialKey, string>;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
  /** "Last checked" note shown with time-sensitive facts. */
  checkBeforeYouGo: string;
};

export type JourneyStop = { id: string; title: string; body: string; image: ImageId; sacred?: boolean };

export type Species = { id: string; name: string; scientific: string; image: ImageId; note: string };

export type TimelineEntry = { when: string; title: string; body: string };

export type Activity = { id: string; name: string; body: string; image?: ImageId; link?: PageKey };

export type NearbyPlace = {
  id: string;
  name: string;
  image: ImageId;
  distance: string;
  body: Paragraphs;
  facts?: Fact[];
  mapQuery: string;
};

export type FaqItem = { q: string; a: string; link?: PageKey };

export type Content = {
  /** BCP 47 language tag of this content, e.g. "en-IN". Sets <html lang> and og:locale. */
  locale: string;
  seo: { keywords: string[] };
  /** Per-language alt text and titles for photos; falls back to images.json. */
  imageText?: Partial<Record<ImageId, { alt?: string; title?: string }>>;
  ui: Ui;
  pages: Record<PageKey, PageCopy>;
  home: {
    summary: string;
    primaryCta: string;
    secondaryCta: string;
    nameNote: { heading: string; lead: string; body: string; split: [string, string] };
    /** Dense-forest section: big numbers over a photo mosaic. Facts must be sourced (see about.ts). */
    forest: { title: string; intro: string; stats: Fact[]; images: ImageId[] };
    explore: {
      title: string;
      intro: string;
      /** Marker at the top of the forest path (trail style). */
      start: string;
      /** Link text on each stop of the forest path. */
      cta: string;
      /** Marker at the bottom of the forest path. */
      end: string;
    };
    wildlife: { title: string; intro: string; cta: string };
    glance: { title: string; facts: Fact[]; cta: string; image?: ImageId };
  };
  about: {
    where: { title: string; body: Paragraphs; facts: Fact[] };
    journey: { title: string; intro: string; stops: JourneyStop[] };
    landscape: { title: string; body: Paragraphs; forestTypes: { title: string; items: string[] } };
  };
  temple: {
    shrine: { title: string; body: Paragraphs; image: ImageId };
    visiting: { title: string; items: string[]; image: ImageId };
    history: { title: string; intro: string; timeline: TimelineEntry[] };
  };
  wildlife: {
    guide: { title: string; intro: string; tabsLabel: string; species: Species[] };
    alsoRecorded: { title: string; items: string[] };
    discoveries: { title: string; body: Paragraphs };
    ethics: { title: string; items: string[] };
  };
  people: {
    who: { title: string; body: Paragraphs; facts: Fact[] };
    knowledge: { title: string; body: Paragraphs };
    archive: { caption: string; image: ImageId };
    dance: { caption: string; image: ImageId };
    respect: { title: string; items: string[] };
  };
  thingsToDo: { activities: Activity[]; trekTeaser: { title: string; body: string; cta: string } };
  trek: {
    facts: Fact[];
    route: { title: string; body: Paragraphs };
    highlights: { title: string; items: string[]; image: ImageId };
    included: { title: string; items: string[] };
    excluded: { title: string; items: string[] };
    packing: { title: string; items: string[] };
    rules: { title: string; items: string[] };
    booking: { title: string; body: string; cta: string };
  };
  nearby: { places: NearbyPlace[]; mapLabel: string };
  visit: {
    hours: { title: string; facts: Fact[] };
    reach: { title: string; items: { title: string; body: string }[] };
    distances: { title: string; items: Fact[] };
    season: { title: string; body: string };
    facilities: { title: string; items: string[] };
    rules: { title: string; items: string[]; image: ImageId };
    stay: { title: string; items: { label: string; link: keyof SiteConfig["links"]; note: string }[] };
    helpline: string;
  };
  faq: { items: FaqItem[] };
  gallery: { filterLabel: string; all: string; categories: Record<ImageCategory, string>; close: string; previous: string; next: string; /** "{n}" and "{total}" are replaced. */ counter: string };
  credits: {
    intro: string;
    columns: { photo: string; author: string; licence: string };
    /** "{fonts}" is replaced with the typefaces in use and their licences. */
    fonts: string;
    sourcesTitle: string;
  };
  sources: Source[];
};
