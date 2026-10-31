import type { NextConfig } from "next";
import { theme } from "./src/config/theme.config";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: {
    // All CSS is ~21 KB (~5 KB gzipped). Inlining removes the render-blocking stylesheet
    // request for first-time visitors; the cost is a duplicate copy in the RSC payload.
    inlineCss: true,
  },
  images: {
    // AVIF first (smallest), WebP fallback. Photos are self-hosted in /public/images.
    formats: ["image/avif", "image/webp"],
    // Next 16 only serves qualities listed here; keep in sync with theme.images.
    qualities: [...new Set([theme.images.quality, theme.images.heroQuality])].sort((a, b) => a - b),
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        // File names are not content-hashed, so keep this short enough for a swapped photo to show up.
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
