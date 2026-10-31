// Menus. Items are page keys from routes.ts; labels come from the content
// files (content.pages[key].navLabel) so menus translate with the content.
import type { PageKey } from "./routes";

export type FooterGroupKey = "discover" | "experience" | "plan";

export type NavigationConfig = {
  /** Links in the desktop header, left to right. */
  header: PageKey[];
  /** Highlighted button at the end of the header. Null for none. */
  headerCta: PageKey | null;
  /** Footer link columns. Group titles come from content.ui.footerGroups. */
  footer: { group: FooterGroupKey; pages: PageKey[] }[];
  /** Reading order: drives the home page index and each page's "Next" link. */
  pageOrder: PageKey[];
};

export const navigation: NavigationConfig = {
  header: ["about", "temple", "wildlife", "thingsToDo", "nearby"],
  headerCta: "visit",
  footer: [
    { group: "discover", pages: ["about", "temple", "wildlife", "people"] },
    { group: "experience", pages: ["thingsToDo", "trek", "nearby", "gallery"] },
    { group: "plan", pages: ["visit", "faq", "credits"] },
  ],
  pageOrder: ["about", "temple", "wildlife", "people", "thingsToDo", "trek", "nearby", "gallery", "visit", "faq"],
};
