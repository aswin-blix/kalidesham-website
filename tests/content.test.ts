import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { pageKeys, routes } from "@/config/routes";
import { siteConfig } from "@/config/site.config";
import { content } from "@/content";
import { getImage, images, type ImageId } from "@/content/images";

const root = path.resolve(import.meta.dirname, "..");

/** Every image id referenced anywhere in content or in source files. */
function referencedImageIds(): Set<string> {
  const ids = new Set<string>();
  const walk = (value: unknown) => {
    if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") {
      for (const [key, v] of Object.entries(value)) {
        if (["image", "heroImage", "thumbImage"].includes(key) && typeof v === "string") ids.add(v);
        else if (key === "images" && Array.isArray(v)) v.forEach((id) => ids.add(id));
        else walk(v);
      }
    }
  };
  walk(content);
  const scan = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const file = path.join(dir, name);
      if (statSync(file).isDirectory()) scan(file);
      else if (file.endsWith(".tsx")) {
        const source = readFileSync(file, "utf8");
        for (const m of source.matchAll(/<(?:Photo|Figure|PhotoCredit)\b[^>]*?\bid="([a-z0-9-]+)"/g)) ids.add(m[1]);
      }
    }
  };
  scan(path.join(root, "src"));
  return ids;
}

describe("image manifest", () => {
  it("has unique ids", () => {
    const ids = images.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(images.map((i) => [i.id, i] as const))("%s carries complete attribution", (_id, image) => {
    expect(image.alt.length).toBeGreaterThan(10);
    expect(image.title).toBeTruthy();
    expect(image.author).toBeTruthy();
    expect(image.license).toBeTruthy();
    expect(["place", "temple", "wildlife", "people", "nearby"]).toContain(image.category);
    expect(image.page).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    expect(image.src).toMatch(/^https:\/\/(upload|thumb)\.wikimedia\.org\//);
    expect(image.src).not.toContain("utm_");
    if (image.license !== "Public domain") expect(image.licenseUrl).toMatch(/^https?:\/\/creativecommons\.org\//);
  });

  it("resolves to a self-hosted path", () => {
    expect(getImage("hero-stream").localSrc).toBe("/images/hero-stream.jpg");
  });

  it("throws for unknown ids instead of rendering a broken image", () => {
    expect(() => getImage("does-not-exist" as ImageId)).toThrow(/Unknown image id/);
  });

  it("references only images that exist", () => {
    const known = new Set(images.map((i) => i.id));
    const missing = [...referencedImageIds()].filter((id) => !known.has(id));
    expect(missing).toEqual([]);
  });

  it("uses every photo somewhere", () => {
    const used = referencedImageIds();
    const galleryShown = images.filter((i) => i.inGallery).map((i) => i.id);
    const unused = images.map((i) => i.id).filter((id) => !used.has(id) && !galleryShown.includes(id));
    expect(unused).toEqual([]);
  });
});

describe("content", () => {
  it("has copy for every page", () => {
    for (const key of pageKeys) {
      const page = content.pages[key];
      expect(page.navLabel, key).toBeTruthy();
      expect(page.title, key).toBeTruthy();
      expect(page.description.length, key).toBeGreaterThan(40);
      expect(page.description.length, `${key} description too long for search results`).toBeLessThanOrEqual(170);
    }
  });

  it("fills the home forest mosaic with distinct photos and sourced numbers", () => {
    const { images: mosaic, stats } = content.home.forest;
    // The mosaic pattern has five tiles.
    expect(mosaic.length).toBeGreaterThanOrEqual(5);
    expect(new Set(mosaic).size).toBe(mosaic.length);
    // Every number must already appear in the sourced about-page copy.
    const about = JSON.stringify(content.about);
    const words: Record<string, string> = { "14": "fourteen", "7": "seven" };
    const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const { value } of stats) {
      const number = value.replace(/\s*(km²|mm)$/, "");
      const pattern = [number, words[number]].filter(Boolean).map((t) => `\\b${escape(t!)}\\b`).join("|");
      expect(about, value).toMatch(new RegExp(pattern, "i"));
    }
  });

  it("ends the journey at the shrine, the one sacred stop", () => {
    const stops = content.about.journey.stops;
    expect(stops.filter((s) => s.sacred).map((s) => s.id)).toEqual(["temple"]);
    expect(stops.at(-1)?.sacred).toBe(true);
  });

  it("runs the history from the Kani to today, with no blank entries", () => {
    const timeline = content.temple.history.timeline;
    for (const entry of timeline) expect(entry.title && entry.body && entry.when).toBeTruthy();
    expect(timeline[0].title).toMatch(/Kani/);
    expect(timeline.at(-1)?.when).toBe("Today");
  });

  it("links activities and FAQ answers only to real pages", () => {
    const keys = new Set(pageKeys);
    for (const a of content.thingsToDo.activities) if (a.link) expect(keys.has(a.link)).toBe(true);
    for (const f of content.faq.items) if (f.link) expect(keys.has(f.link)).toBe(true);
  });

  it("points stay links at configured booking URLs", () => {
    for (const item of content.visit.stay.items) expect(siteConfig.links[item.link]).toMatch(/^https:\/\//);
  });

  it("cites only https sources, without duplicates", () => {
    const hrefs = content.sources.map((s) => s.href);
    for (const href of hrefs) expect(href).toMatch(/^https:\/\//);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("formats interface strings", () => {
    expect(content.ui.photoCredit("A", "CC BY 4.0")).toBe("Photo: A, CC BY 4.0");
    expect(content.ui.stopCount(2, 5)).toBe("Stop 2 of 5");
    expect(content.gallery.counter).toMatch(/\{n\}.*\{total\}/);
  });

  it("keeps every route folder in sync with routes.ts", () => {
    for (const [key, route] of Object.entries(routes)) {
      const file = route === "/" ? "src/app/page.tsx" : `src/app${route}/page.tsx`;
      expect(() => statSync(path.join(root, file)), `${key} → ${file}`).not.toThrow();
    }
  });
});
