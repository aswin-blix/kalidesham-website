import Link from "next/link";
import { config, href, type PageKey } from "@/config";
import { content } from "@/content";
import { JsonLd } from "./JsonLd";
import { Photo, PhotoCredit } from "./Photo";
import styles from "./PageHero.module.css";

/** Heading band for every page except home: photo (optional), breadcrumb, title, intro. */
export function PageHero({ page }: { page: PageKey }) {
  const copy = content.pages[page];
  const crumbs = [
    { label: content.ui.home, path: href("home") },
    { label: copy.navLabel, path: href(page) },
  ];

  return (
    <header className={`on-dark ${styles.hero}`} data-has-photo={copy.heroImage ? "true" : undefined}>
      {copy.heroImage && (
        <div className={styles.photo}>
          <Photo id={copy.heroImage} cover priority sizes="100vw" />
        </div>
      )}
      <div className={`wrap ${styles.content}`}>
        {config.features.breadcrumbs && (
          <>
            <nav aria-label={content.ui.breadcrumb} className={styles.crumbs}>
              <ol>
                <li>
                  <Link href={crumbs[0].path} prefetch={false}>
                    {crumbs[0].label}
                  </Link>
                </li>
                <li aria-current="page">{crumbs[1].label}</li>
              </ol>
            </nav>
            {config.site.url && (
              <JsonLd
                data={{
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: crumbs.map((c, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: c.label,
                    item: new URL(c.path, config.site.url).toString(),
                  })),
                }}
              />
            )}
          </>
        )}
        {copy.localTitle && (
          <p className={styles.local} lang={config.site.localName.lang}>
            {copy.localTitle}
          </p>
        )}
        <h1 className={styles.title}>{copy.title}</h1>
        {copy.intro && <p className={styles.intro}>{copy.intro}</p>}
      </div>
      {copy.heroImage && <PhotoCredit id={copy.heroImage} className={styles.credit} />}
    </header>
  );
}
