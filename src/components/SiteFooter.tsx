import Link from "next/link";
import { config, footerGroups, href, isPageEnabled } from "@/config";
import type { SocialKey } from "@/config/site.config";
import { content } from "@/content";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const { site } = config;
  const socials = Object.entries(site.social).filter(([, url]) => url) as [SocialKey, string][];
  return (
    <footer className={`on-dark ${styles.footer}`}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.about}>
          <p className={styles.brand}>
            <span lang={site.localName.lang}>{site.localName.text}</span> {site.name}
          </p>
          <p className={styles.note}>{content.ui.footerDisclaimer}</p>
          {site.contact.phone && (
            <p className={styles.note}>
              {content.ui.footerContact}:{" "}
              <a href={`tel:${site.contact.phone.tel}`} className={styles.strong}>
                {site.contact.phone.display}
              </a>
            </p>
          )}
          {site.contact.email && (
            <p className={styles.note}>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </p>
          )}
          {socials.length > 0 && (
            <ul className={styles.social}>
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a href={url} rel="noopener me" target="_blank">
                    {content.ui.social[key]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {footerGroups().map((group) => (
          <nav key={group.group} aria-label={content.ui.footerGroups[group.group]}>
            <h2 className={styles.heading}>{content.ui.footerGroups[group.group]}</h2>
            <ul className={styles.links}>
              {group.pages.map((key) => (
                <li key={key}>
                  <Link href={href(key)} prefetch={false}>
                    {content.pages[key].navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={`wrap ${styles.base}`}>
        <p>{content.ui.footerPhotos}</p>
        {isPageEnabled("credits") && (
          <Link href={href("credits")} prefetch={false}>
            {content.ui.footerSeeCredits}
          </Link>
        )}
      </div>
    </footer>
  );
}
