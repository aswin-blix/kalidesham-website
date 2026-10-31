import Link from "next/link";
import { ExploreIndex } from "@/components/ExploreIndex";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { NameNote } from "@/components/NameNote";
import { Photo } from "@/components/Photo";
import { FactList, Section } from "@/components/blocks";
import { config, href, isPageEnabled, orderedPages } from "@/config";
import { content } from "@/content";
import { pageMetadata } from "@/lib/page";
import styles from "./home.module.css";

export const metadata = pageMetadata("home");

const { site, features, theme } = config;

const structuredData = {
  "@context": "https://schema.org",
  "@type": site.schema.type,
  name: site.name,
  alternateName: [site.localName.text, ...site.alternateNames],
  description: content.home.summary,
  ...(site.url ? { url: site.url } : {}),
  isAccessibleForFree: site.schema.isAccessibleForFree,
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: site.openingHours.days,
    opens: site.openingHours.opens,
    closes: site.openingHours.closes,
  },
  ...(site.schema.containedInPlace ? { containedInPlace: { "@type": "Place", name: site.schema.containedInPlace } } : {}),
};

export default function Home() {
  const exploreItems = orderedPages().map((key) => {
    const page = content.pages[key];
    const image = page.heroImage ?? page.thumbImage;
    return {
      key,
      href: href(key),
      label: page.navLabel,
      description: page.description,
      preview: image ? <Photo id={image} cover sizes="17rem" alt="" /> : null,
      thumb: image ? <Photo id={image} cover sizes="5rem" alt="" /> : null,
    };
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <Hero />
      {features.home.nameNote && <NameNote />}
      {features.home.explore && (
        <Section id="explore" title={content.home.explore.title} intro={content.home.explore.intro} defer>
          <ExploreIndex items={exploreItems} hoverPreview={theme.motion.enabled && theme.motion.exploreHover} />
        </Section>
      )}
      {features.home.atAGlance && (
        <Section id="glance" title={content.home.glance.title} tone="dark" defer>
          <div className={styles.glance}>
            <FactList facts={content.home.glance.facts} />
            {isPageEnabled("visit") && (
              <Link className="button button-primary" href={href("visit")}>
                {content.home.glance.cta}
              </Link>
            )}
          </div>
        </Section>
      )}
    </>
  );
}
