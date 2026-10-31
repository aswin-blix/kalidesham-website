import type { MetadataRoute } from "next";
import { config } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(config.site.url ? { sitemap: new URL("/sitemap.xml", config.site.url).toString() } : {}),
  };
}
