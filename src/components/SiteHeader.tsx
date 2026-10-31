import { config, headerCta, headerPages, href, orderedPages, type PageKey } from "@/config";
import { content } from "@/content";
import { SiteHeaderBar } from "./SiteHeaderBar";

const item = (key: PageKey) => ({ href: href(key), label: content.pages[key].navLabel });

/** Builds the menus from navigation.config.ts on the server; only plain strings reach the client. */
export function SiteHeader() {
  const cta = headerCta();
  const menu = orderedPages().map(item);
  if (cta && !menu.some((m) => m.href === href(cta))) menu.push(item(cta));
  return (
    <SiteHeaderBar
      brand={{ name: config.site.name, local: config.site.localName.text, lang: config.site.localName.lang }}
      items={headerPages().map(item)}
      cta={cta ? item(cta) : null}
      menu={[item("home"), ...menu]}
      labels={{ open: content.ui.menuOpen, close: content.ui.menuClose, nav: content.ui.sectionsNav }}
      motion={{ enabled: config.theme.motion.enabled, speed: config.theme.motion.speed }}
    />
  );
}
