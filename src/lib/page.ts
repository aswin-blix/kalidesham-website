import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { config, href, isPageEnabled, type PageKey } from "@/config";
import { content, imageText } from "@/content";
import { getImage } from "@/content/images";

/**
 * <title>, description, canonical and social tags for a page, from its content entry.
 * Next merges `openGraph` shallowly, so the site-wide fields are repeated here.
 * Absolute URLs (canonical, og:url, og:image) are only emitted when the site URL is
 * configured; otherwise Next would resolve them against localhost.
 */
export function pageMetadata(key: PageKey): Metadata {
  const { site } = config;
  const page = content.pages[key];
  const title = page.metaTitle ?? page.title;
  const imageId = key === "home" ? undefined : (page.heroImage ?? page.thumbImage);
  const image = imageId ? getImage(imageId) : null;
  const images =
    site.url && image
      ? [{ url: image.localSrc, width: image.width, height: image.height, alt: imageText(image.id).alt }]
      : undefined;
  return {
    // The home page title is already complete; other pages get the site name appended by the template.
    title: key === "home" ? { absolute: title } : title,
    description: page.description,
    ...(site.url ? { alternates: { canonical: href(key) } } : {}),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: content.locale.replace("-", "_"),
      title,
      description: page.description,
      ...(site.url ? { url: href(key) } : {}),
      // Home uses the generated social card (app/opengraph-image.jpg).
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
      ...(site.seo.twitterHandle ? { site: site.seo.twitterHandle } : {}),
      ...(images ? { images } : {}),
    },
  };
}

/** Disabled pages (features.config.ts) render the 404 page. */
export function requirePage(key: PageKey) {
  if (!isPageEnabled(key)) notFound();
}
