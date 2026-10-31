// One import for everything configurable: `import { config, href, isPageEnabled } from "@/config"`.
import { features } from "./features.config";
import { navigation } from "./navigation.config";
import { pageKeys, routes, type PageKey } from "./routes";
import { siteConfig } from "./site.config";
import { theme } from "./theme.config";

export { mapsUrl } from "./site.config";
export type { PageKey } from "./routes";

export const config = { site: siteConfig, theme, features, navigation, routes } as const;

export function isPageEnabled(key: PageKey): boolean {
  return key === "home" || features.pages[key];
}

export function href(key: PageKey): string {
  return routes[key];
}

const enabled = (keys: PageKey[]) => keys.filter(isPageEnabled);

export const headerPages = () => enabled(navigation.header);

export const headerCta = () =>
  navigation.headerCta && isPageEnabled(navigation.headerCta) ? navigation.headerCta : null;

export const footerGroups = () =>
  navigation.footer.map((g) => ({ ...g, pages: enabled(g.pages) })).filter((g) => g.pages.length > 0);

export const orderedPages = () => enabled(navigation.pageOrder);

/** The page after `key` in the reading order, skipping disabled pages. */
export function nextPage(key: PageKey): PageKey | null {
  const order = orderedPages();
  const index = order.indexOf(key);
  return index >= 0 && index < order.length - 1 ? order[index + 1] : null;
}

/** All enabled pages, for the sitemap. */
export const enabledPages = () => pageKeys.filter(isPageEnabled);

/** Catch configuration mistakes at build time instead of in production. */
export function validateConfig(c: { navigation: typeof navigation; features: typeof features; theme: typeof theme } = config) {
  const problems: string[] = [];
  const known = new Set<string>(pageKeys);
  const navKeys = [
    ...c.navigation.header,
    ...(c.navigation.headerCta ? [c.navigation.headerCta] : []),
    ...c.navigation.footer.flatMap((g) => g.pages),
    ...c.navigation.pageOrder,
  ];
  for (const key of navKeys) if (!known.has(key)) problems.push(`navigation refers to unknown page "${key}"`);
  if (new Set(c.navigation.pageOrder).size !== c.navigation.pageOrder.length) {
    problems.push("navigation.pageOrder lists a page twice");
  }
  if (!c.features.inlinePhotoCredits && !c.features.pages.credits) {
    problems.push("photo credits must be shown somewhere: enable features.inlinePhotoCredits or the credits page");
  }
  if (!(c.theme.motion.speed > 0)) problems.push("theme.motion.speed must be greater than 0");
  if (problems.length) throw new Error(`Invalid site configuration:\n- ${problems.join("\n- ")}`);
}

validateConfig();
