// Every page on the site and its URL. The URL must match the folder under
// src/app (for example "/things-to-do" is src/app/things-to-do/page.tsx), so
// renaming a URL means renaming that folder too.
export const routes = {
  home: "/",
  about: "/about",
  temple: "/temple",
  wildlife: "/wildlife",
  people: "/people",
  thingsToDo: "/things-to-do",
  trek: "/trek",
  nearby: "/nearby",
  visit: "/visit",
  faq: "/faq",
  gallery: "/gallery",
  credits: "/credits",
} as const;

export type PageKey = keyof typeof routes;

/** Section ids that other pages link to. Change them here so links and targets stay in step. */
export const anchors = {
  /** The road-in journey on /about (home hero button). */
  journey: "journey",
  /** The field guide on /wildlife (home wildlife cards). */
  fieldGuide: "guide",
} as const;

export const pageKeys = Object.keys(routes) as PageKey[];
