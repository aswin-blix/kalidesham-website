import { expect, test, type Page } from "@playwright/test";
import { anchors, config, enabledPages, href, isPageEnabled, nextPage, orderedPages, pageGroup } from "@/config";
import { siteConfig } from "@/config/site.config";
import { content, imageText } from "@/content";
import { images } from "@/content/images";

// Expectations come from the config and content, so these tests keep working after
// the site is customised or translated.
const { ui, pages: copy } = content;
const pages = enabledPages().map((key) => ({
  path: href(key),
  // The home h1 combines the local-script and Latin names.
  h1: key === "home" ? new RegExp(siteConfig.name) : copy[key].title,
}));

const collectErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
};

test.describe("every page", () => {
  for (const { path, h1 } of pages) {
    test(`${path} renders cleanly`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      // Every meaningful image has alt text; only decorative previews (inside aria-hidden) may be empty.
      const unlabeled = await page.evaluate(
        () =>
          [...document.querySelectorAll("main img")].filter(
            (img) => !img.getAttribute("alt")?.trim() && !img.closest('[aria-hidden="true"]'),
          ).length,
      );
      expect(unlabeled).toBe(0);
      // At most one image (the LCP photo) jumps the queue; everything else lazy-loads.
      expect(await page.locator('img[fetchpriority="high"]').count()).toBeLessThanOrEqual(1);
      await expect(page.locator('img[fetchpriority="high"]:not([loading="eager"])')).toHaveCount(0);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test("unknown URLs get the 404 page", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: ui.notFoundCta })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("header links reach their pages and mark the current one", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop header");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: ui.sectionsNav });
    const label = copy.wildlife.navLabel;
    await nav.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${href("wildlife")}$`));
    await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
  });

  test("each inner page ends with a link to the next one", async ({ page }) => {
    const first = orderedPages()[0];
    const following = nextPage(first)!;
    await page.goto(href(first));
    const next = page.getByRole("navigation", { name: ui.next }).getByRole("link");
    await expect(next).toContainText(copy[following].navLabel);
    await next.click();
    await expect(page).toHaveURL(new RegExp(`${href(following)}$`));
  });

  test("breadcrumbs lead home", async ({ page }) => {
    await page.goto("/trek");
    await page.getByRole("navigation", { name: ui.breadcrumb }).getByRole("link", { name: ui.home }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("mobile menu opens, navigates, and closes on arrival", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu button only shows on small screens");
    await page.goto("/");
    await page.getByRole("button", { name: ui.menuOpen }).click();
    await page.getByRole("navigation", { name: ui.sectionsNav }).getByRole("link", { name: copy.visit.navLabel }).click();
    await expect(page).toHaveURL(/\/visit$/);
    await expect(page.getByRole("button", { name: ui.menuOpen })).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the mobile menu and returns focus to its button", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu button only shows on small screens");
    await page.goto("/");
    await page.getByRole("button", { name: ui.menuOpen }).click();
    await page.getByRole("navigation", { name: ui.sectionsNav }).getByRole("link", { name: copy.wildlife.navLabel }).focus();
    await page.keyboard.press("Escape");
    const button = page.getByRole("button", { name: ui.menuOpen });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("skip link moves focus into the main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard flow checked on desktop");
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: ui.skipLink });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("main"))).toBe(true);
  });

  test("the home index links to every page in reading order", async ({ page }) => {
    await page.goto("/");
    // One link per stop, whichever style (forest path or list) the home page uses.
    const links = page.locator("#explore li a");
    await expect(links).toHaveCount(orderedPages().length);
    await expect(links.first()).toHaveAttribute("href", href(orderedPages()[0]));
  });
});

test.describe("interactions", () => {
  test("field guide switches animals by click and arrow keys", async ({ page }) => {
    const { tabsLabel, species } = content.wildlife.guide;
    await page.goto("/wildlife");
    const tabs = page.getByRole("tablist", { name: tabsLabel }).getByRole("tab");
    await expect(tabs).toHaveCount(species.length);
    const panel = page.getByRole("tabpanel");
    await tabs.nth(1).click();
    await expect(panel.getByRole("heading", { name: species[1].name })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(2)).toBeFocused();
    await expect(panel.getByRole("heading", { name: species[2].name })).toBeVisible();
    await page.keyboard.press("End");
    await page.keyboard.press("ArrowRight"); // wraps to the first
    await expect(panel.getByRole("heading", { name: species[0].name })).toBeVisible();
  });

  test("gallery filters, opens a lightbox, steps with arrows and restores focus", async ({ page }) => {
    const g = content.gallery;
    await page.goto("/gallery");
    const filters = page.getByRole("group", { name: g.filterLabel });
    const cells = page.locator("main ul li button");
    const total = await cells.count();
    expect(total).toBe(images.filter((i) => i.inGallery).length);
    const wildlifeChip = filters.getByRole("button", { name: g.categories.wildlife });
    await wildlifeChip.click();
    await expect(wildlifeChip).toHaveAttribute("aria-pressed", "true");
    const wildlife = await cells.count();
    expect(wildlife).toBeGreaterThan(0);
    expect(wildlife).toBeLessThan(total);

    const first = cells.first();
    await first.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const counter = (n: number) => g.counter.replace("{n}", String(n)).replace("{total}", String(wildlife));
    await expect(dialog).toContainText(counter(1));
    await expect(dialog).toHaveAccessibleName(/\S/);
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText(counter(2));
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();
  });

  test("FAQ answers open and close", async ({ page }) => {
    await page.goto("/faq");
    const item = page.locator("details").first();
    await item.locator("summary").click();
    await expect(item).toHaveAttribute("open", "");
    await expect(item.getByText(content.faq.items[0].a)).toBeVisible();
  });

  test("the river draws and lights the stops on the about page", async ({ page }) => {
    await page.goto("/about");
    const markers = page.locator("[data-river-marker]");
    await expect(markers).toHaveCount(5);
    await page.locator("#journey").scrollIntoViewIfNeeded();
    await expect(page.locator('#journey svg path[data-ready="true"]')).toHaveCount(1);
    // Scroll past the end of the journey so every marker has crossed the trigger line.
    await page.evaluate(() => {
      const box = document.getElementById("journey")!.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + box.bottom - window.innerHeight * 0.3);
    });
    await expect(markers.first()).toHaveAttribute("data-reached", "true");
    await expect(markers.last()).toHaveAttribute("data-reached", "true");
  });

  test("the forest path draws and lights its stops on the home page", async ({ page }) => {
    const { home } = config.features;
    const { motion } = config.theme;
    test.skip(!home.explore || home.exploreStyle !== "trail", "home index is not the forest path");
    test.skip(!motion.enabled || !motion.trail, "path animation switched off in the theme");
    await page.goto("/");
    const trail = page.locator("#explore");
    const markers = trail.locator("[data-river-marker]");
    await expect(markers).toHaveCount(orderedPages().length);
    // A signpost wherever the path enters a new group of pages.
    const groups = orderedPages()
      .map(pageGroup)
      .filter((g, i, all) => g && g !== all[i - 1]);
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) await expect(trail.getByText(ui.footerGroups[group!], { exact: true })).toHaveCount(1);
    await trail.scrollIntoViewIfNeeded();
    await expect(trail.locator('svg path[data-ready="true"]')).toHaveCount(1);
    await page.evaluate(() => {
      const box = document.getElementById("explore")!.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + box.bottom - window.innerHeight * 0.3);
    });
    await expect(markers.first()).toHaveAttribute("data-reached", "true");
    await expect(markers.last()).toHaveAttribute("data-reached", "true");
  });

  test("a forest path stop opens its page from the photo as well as the title", async ({ page }) => {
    const { home } = config.features;
    test.skip(!home.explore || home.exploreStyle !== "trail", "home index is not the forest path");
    await page.goto("/");
    const stop = page.locator("#explore article").nth(1);
    await stop.scrollIntoViewIfNeeded();
    // Let the scroll-driven rise finish, then click the middle of the photo.
    await page.waitForTimeout(300);
    const photo = stop.locator("[aria-hidden] img").first();
    const box = (await photo.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page).toHaveURL(new RegExp(`${href(orderedPages()[1])}$`));
  });

  test("home wildlife cards lead to the field guide", async ({ page }) => {
    test.skip(!config.features.home.wildlife || !isPageEnabled("wildlife"), "wildlife cards switched off");
    await page.goto("/");
    const cards = page.locator("#wildlife li a");
    await expect(cards).toHaveCount(content.wildlife.guide.species.length);
    await cards.first().click();
    await expect(page).toHaveURL(new RegExp(`${href("wildlife")}#${anchors.fieldGuide}$`));
    await expect(page.locator(`#${anchors.fieldGuide}`)).toBeInViewport();
  });

  test("the home hero links straight to the journey", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: content.home.secondaryCta }).click();
    await expect(page).toHaveURL(/\/about#journey$/);
    await expect(page.locator("#journey")).toBeInViewport();
  });
});

test.describe("performance guards", () => {
  test("GSAP stays off the initial load and arrives when the journey approaches", async ({ page }) => {
    // Collect body reads as promises so assertions never race the response handler.
    const reads: Promise<boolean>[] = [];
    page.on("response", (res) => {
      if (res.url().includes("/_next/static/chunks/") && res.url().endsWith(".js")) {
        // "_gsap" appears only in GSAP's own code, not in chunk manifests that merely name it.
        reads.push(res.text().then((body) => body.includes("_gsap"), () => false));
      }
    });
    const gsapLoaded = async () => (await Promise.all(reads)).some(Boolean);

    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    const journeyTop = await page.evaluate(() => document.getElementById("journey")!.getBoundingClientRect().top);
    expect(journeyTop).toBeGreaterThan(page.viewportSize()!.height * 1.25); // beyond the 25% preload margin
    expect(await gsapLoaded()).toBe(false);

    await page.locator("#journey").scrollIntoViewIfNeeded();
    await expect.poll(gsapLoaded).toBe(true);
  });

  test("pages without GSAP effects never load it", async ({ page }) => {
    const reads: Promise<boolean>[] = [];
    page.on("response", (res) => {
      if (res.url().includes("/_next/static/chunks/") && res.url().endsWith(".js")) {
        reads.push(res.text().then((body) => body.includes("_gsap"), () => false));
      }
    });
    await page.goto("/visit");
    await page.mouse.wheel(0, 5000);
    await page.waitForLoadState("networkidle");
    expect((await Promise.all(reads)).some(Boolean)).toBe(false);
  });

  test("robots and sitemap respond (contents are unit-tested with and without a site URL)", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Allow: /");
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
  });
});

test.describe("structured data", () => {
  test("home describes the place; FAQ is marked up as FAQPage", async ({ page }) => {
    await page.goto("/");
    const home = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}");
    expect(home["@type"]).toBe(siteConfig.schema.type);
    expect(home.geo.latitude).toBeCloseTo(8.411, 2);

    await page.goto("/faq");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((b) => JSON.parse(b)["@type"]);
    expect(types).toContain("FAQPage");
    // Breadcrumb data needs absolute URLs, so it only appears once the site URL is set.
    expect(types.includes("BreadcrumbList")).toBe(Boolean(siteConfig.url));
  });
});

test.describe("credits", () => {
  test("lists every photo with author and licence", async ({ page }) => {
    await page.goto("/credits");
    await expect(page.locator("tbody tr")).toHaveCount(images.length);
    await expect(page.getByRole("link", { name: imageText(images[0].id).title })).toHaveAttribute(
      "href",
      /commons\.wikimedia\.org/,
    );
  });

  test("keeps column labels on small screens", async ({ page, isMobile }) => {
    test.skip(!isMobile, "labels only replace headers on phones");
    await page.goto("/credits");
    const label = await page.locator("tbody td").nth(1).evaluate((td) => getComputedStyle(td, "::before").content);
    expect(label).toBe(`"${content.credits.columns.author}"`);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the river is drawn at once and all stops are lit", async ({ page }) => {
    await page.goto("/about");
    await page.locator("#journey").scrollIntoViewIfNeeded();
    await expect(page.locator('[data-river-marker][data-reached="true"]')).toHaveCount(5);
  });

  test("hero content is visible immediately and the photo does not move", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section[aria-labelledby='hero-title']");
    // Checked mid-animation: with reduced motion the button must already be fully shown.
    await expect(hero.getByRole("link", { name: content.home.primaryCta })).toBeVisible();
    expect(await hero.getByRole("link", { name: content.home.primaryCta }).evaluate((el) => getComputedStyle(el.parentElement!).opacity)).toBe("1");
    await page.mouse.wheel(0, 500);
    const transform = await page
      .locator("section[aria-labelledby='hero-title'] img")
      .evaluate((img) => getComputedStyle(img.parentElement as HTMLElement).transform);
    expect(transform).toBe("none");
  });
});
