import { afterEach, describe, expect, it, vi } from "vitest";
import { features } from "@/config/features.config";
import { navigation } from "@/config/navigation.config";
import { buildThemeCss, contrastPairs, contrastRatio, selectedFontKeys } from "@/config/theme-css";
import { theme } from "@/config/theme.config";
import { pageKeys } from "@/config/routes";
import { siteConfig } from "@/config/site.config";

const fonts = {
  arima: { cssVar: "--font-arima", fallback: "Georgia, serif" },
  arimaTamil: { cssVar: "--font-arima-tamil", fallback: "sans-serif" },
  hindMadurai: { cssVar: "--font-hind-madurai", fallback: "system-ui, sans-serif" },
};

// The config index validates on import, so a broken config fails this import.
const loadConfig = () => import("@/config");

describe("theme → CSS variables", () => {
  const css = buildThemeCss(theme, fonts);

  it("emits every colour as --color-<name>", () => {
    for (const [key, value] of Object.entries(theme.colors)) {
      const name = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      expect(css).toContain(`--color-${name}:${value}`);
    }
  });

  it("builds font stacks with the script fallback in between", () => {
    expect(css).toContain("--font-display:var(--font-arima), var(--font-arima-tamil), Georgia, serif");
    expect(css).toContain("--font-body:var(--font-hind-madurai), var(--font-arima-tamil), system-ui, sans-serif");
  });

  it("omits the script font when none is chosen", () => {
    const out = buildThemeCss({ ...theme, fonts: { ...theme.fonts, script: null } }, fonts);
    expect(out).toContain("--font-display:var(--font-arima), Georgia, serif");
  });

  it("emits type, layout and motion values", () => {
    expect(css).toContain(`--text-hero:${theme.type.hero}`);
    expect(css).toContain(`--line-height:${theme.type.lineHeight}`);
    expect(css).toContain(`--page:${theme.layout.pageWidth}`);
    expect(css).toContain(`--header-height:${theme.layout.headerHeight}`);
    expect(css).toContain(`--motion-speed:${theme.motion.speed}`);
  });

  it("sets motion speed to 0 when motion is switched off", () => {
    const out = buildThemeCss({ ...theme, motion: { ...theme.motion, enabled: false } }, fonts);
    expect(out).toContain("--motion-speed:0");
  });

  it("refuses values that could escape the style block", () => {
    const evil = { ...theme, colors: { ...theme.colors, dark: "red;}</style><script>" } };
    expect(() => buildThemeCss(evil, fonts)).toThrow(/forbidden character/);
  });

  it("refuses fonts that are not registered", () => {
    const bad = { ...theme, fonts: { ...theme.fonts, display: "comicSans" as never } };
    expect(() => buildThemeCss(bad, fonts)).toThrow(/not in the font registry/);
  });

  it("lists each selected font once", () => {
    expect(selectedFontKeys(theme)).toEqual(["arima", "hindMadurai", "arimaTamil"]);
    expect(selectedFontKeys({ ...theme, fonts: { display: "arima", body: "arima", script: null } })).toEqual(["arima"]);
  });
});

describe("site configuration", () => {
  it("is valid as shipped", async () => {
    await expect(loadConfig()).resolves.toBeDefined();
  });

  it("has a feature flag for every page except home", () => {
    expect(Object.keys(features.pages).sort()).toEqual(pageKeys.filter((k) => k !== "home").sort());
  });

  it("gives a dialable phone number", () => {
    if (siteConfig.contact.phone) expect(siteConfig.contact.phone.tel).toMatch(/^\+?\d{8,15}$/);
  });

  it("never falls back to localhost for the public URL", () => {
    expect(siteConfig.url ?? "").not.toMatch(/localhost/);
  });
});

describe("validateConfig", () => {
  it("rejects unknown pages in navigation", async () => {
    const { validateConfig } = await loadConfig();
    const bad = { navigation: { ...navigation, header: [...navigation.header, "blog" as never] }, features, theme };
    expect(() => validateConfig(bad)).toThrow(/unknown page "blog"/);
  });

  it("rejects a page listed twice in the reading order", async () => {
    const { validateConfig } = await loadConfig();
    const bad = { navigation: { ...navigation, pageOrder: ["about", "about"] as never }, features, theme };
    expect(() => validateConfig(bad)).toThrow(/twice/);
  });

  it("requires photo credits to appear somewhere", async () => {
    const { validateConfig } = await loadConfig();
    const bad = {
      navigation,
      theme,
      features: { ...features, inlinePhotoCredits: false, pages: { ...features.pages, credits: false } },
    };
    expect(() => validateConfig(bad)).toThrow(/photo credits/);
  });

  it("keeps the credits page while home shows photos without inline credits", async () => {
    const { validateConfig } = await loadConfig();
    const noCreditsPage = { ...features.pages, credits: false };
    const bad = { navigation, theme, features: { ...features, pages: noCreditsPage } };
    expect(() => validateConfig(bad)).toThrow(/uncredited photos/);
    // Without the index and the wildlife cards, inline credits alone are enough.
    const home = { ...features.home, explore: false, wildlife: false };
    expect(() => validateConfig({ navigation, theme, features: { ...features, home, pages: noCreditsPage } })).not.toThrow();
  });

  it("rejects a non-positive motion speed", async () => {
    const { validateConfig } = await loadConfig();
    expect(() => validateConfig({ navigation, features, theme: { ...theme, motion: { ...theme.motion, speed: 0 } } })).toThrow(
      /speed/,
    );
  });
});

describe("navigation helpers", () => {
  it("follow the reading order and resolve URLs", async () => {
    const mod = await loadConfig();
    const order = mod.orderedPages();
    expect(order).toEqual(navigation.pageOrder);
    expect(mod.nextPage(order[0])).toBe(order[1]);
    expect(mod.nextPage(order.at(-1)!)).toBeNull();
    expect(mod.href("thingsToDo")).toBe("/things-to-do");
    expect(mod.enabledPages()).toContain("home");
  });

  it("find each page's footer group for the home forest path signposts", async () => {
    const mod = await loadConfig();
    for (const { group, pages } of navigation.footer) {
      for (const key of pages) expect(mod.pageGroup(key)).toBe(group);
    }
    // Pages in no footer column (home) have no signpost.
    expect(mod.pageGroup("home")).toBeNull();
  });

  it("drop a disabled page from menus, the reading order and the sitemap", async () => {
    vi.resetModules();
    vi.doMock("@/config/features.config", () => ({
      features: { ...features, pages: { ...features.pages, temple: false } },
    }));
    try {
      const mod = await import("@/config");
      expect(mod.isPageEnabled("temple")).toBe(false);
      expect(mod.headerPages()).not.toContain("temple");
      expect(mod.footerGroups().flatMap((g) => g.pages)).not.toContain("temple");
      expect(mod.orderedPages()).not.toContain("temple");
      // The page before it now points past it.
      expect(mod.nextPage("about")).toBe("wildlife");
      expect(mod.enabledPages()).not.toContain("temple");
    } finally {
      vi.doUnmock("@/config/features.config");
      vi.resetModules();
    }
  });
});

describe("sitemap and robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("are empty of absolute URLs until the site URL is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.resetModules();
    const sitemap = (await import("@/app/sitemap")).default;
    const robots = (await import("@/app/robots")).default;
    expect(sitemap()).toEqual([]);
    expect(robots().sitemap).toBeUndefined();
  });

  it("list every enabled page with absolute URLs once it is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kalikesam.example");
    vi.resetModules();
    const sitemap = (await import("@/app/sitemap")).default;
    const robots = (await import("@/app/robots")).default;
    const { enabledPages } = await import("@/config");
    const urls = sitemap().map((e) => e.url);
    expect(urls).toHaveLength(enabledPages().length);
    expect(urls).toContain("https://kalikesam.example/visit");
    expect(robots().sitemap).toBe("https://kalikesam.example/sitemap.xml");
  });
});

describe("theme colours stay accessible", () => {
  it("computes WCAG contrast", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
    expect(() => contrastRatio("red", "#fff")).toThrow(/#rrggbb/);
  });

  // If you change theme.config.ts colours and this fails, the named pairing is too low-contrast to read.
  it.each(contrastPairs(theme.colors).map((p) => [p.use, p] as const))("%s meets WCAG AA", (_use, pair) => {
    expect(contrastRatio(pair.fg, pair.bg)).toBeGreaterThanOrEqual(pair.min);
  });

  it("allows both image qualities in next.config", async () => {
    const nextConfig = (await import("../next.config")).default;
    expect(nextConfig.images?.qualities).toEqual(expect.arrayContaining([theme.images.quality, theme.images.heroQuality]));
  });
});
