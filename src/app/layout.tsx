import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeStyle } from "@/components/ThemeStyle";
import { config } from "@/config";
import { selectedFontKeys } from "@/config/theme-css";
import { content } from "@/content";
import { fontRegistry, type FontKey } from "@/fonts";
import "./globals.css";

const { site, theme } = config;
const home = content.pages.home;

// Attach only the fonts the theme uses, so unused registry entries are never preloaded.
const fontClasses = selectedFontKeys(theme)
  .map((key) => fontRegistry[key as FontKey].font.variable)
  .join(" ");

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: { default: home.metaTitle ?? home.title, template: site.seo.titleTemplate },
  description: home.description,
  keywords: content.seo.keywords,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: content.locale.replace("-", "_"),
  },
  twitter: {
    card: "summary_large_image",
    ...(site.seo.twitterHandle ? { site: site.seo.twitterHandle } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: theme.colors.dark,
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={content.locale} className={fontClasses} data-motion={theme.motion.enabled ? undefined : "off"}>
      <body>
        <ThemeStyle />
        <a className="skip-link" href="#main">
          {content.ui.skipLink}
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
