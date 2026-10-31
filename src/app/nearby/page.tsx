import { PageHero } from "@/components/PageHero";
import { FactList, Figure, NextPageLink, Section } from "@/components/blocks";
import { content } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";
import styles from "./nearby.module.css";

export const metadata = pageMetadata("nearby");

const mapLink = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function NearbyPage() {
  requirePage("nearby");
  const { places, mapLabel } = content.nearby;
  return (
    <>
      <PageHero page="nearby" />
      <Section id="places">
        <ol className={styles.list}>
          {places.map((place, index) => (
            <li key={place.id} className={styles.place} data-side={index % 2 ? "right" : "left"}>
              <Figure id={place.image} sizes="(max-width: 56rem) 92vw, 34rem" aspect="4 / 3" />
              <div className={styles.text}>
                <p className={styles.distance}>{place.distance}</p>
                <h2>{place.name}</h2>
                {place.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {place.facts && <FactList facts={place.facts} className={styles.facts} />}
                <a href={mapLink(place.mapQuery)} target="_blank" rel="noopener" className={styles.map}>
                  {mapLabel}
                  <span className="visually-hidden">: {place.name}</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </Section>
      <NextPageLink current="nearby" />
    </>
  );
}
