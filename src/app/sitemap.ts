import type { MetadataRoute } from "next";
import { config, enabledPages, href } from "@/config";

/** Every enabled page. Empty until NEXT_PUBLIC_SITE_URL is set, since sitemaps need absolute URLs. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.site.url;
  if (!base) return [];
  return enabledPages().map((key) => ({
    url: new URL(href(key), base).toString(),
    changeFrequency: key === "visit" ? "monthly" : "yearly",
    priority: key === "home" ? 1 : key === "visit" ? 0.9 : 0.7,
  }));
}
