import { PageHero } from "@/components/PageHero";
import { BulletList, FactList, Figure, NextPageLink, Section } from "@/components/blocks";
import { config, mapsUrl } from "@/config";
import { content, fill } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";
import styles from "./visit.module.css";

export const metadata = pageMetadata("visit");

export default function VisitPage() {
  requirePage("visit");
  const v = content.visit;
  const { site } = config;
  return (
    <>
      <PageHero page="visit" />
      <Section id="essentials">
        <p className={styles.notice}>{content.ui.checkBeforeYouGo}</p>
        <div className={styles.grid}>
          <div className={styles.block}>
            <h2>{v.hours.title}</h2>
            <FactList facts={v.hours.facts} />
            {site.contact.phone && (
              <p className={styles.small}>
                {v.helpline}:{" "}
                <a href={`tel:${site.contact.phone.tel}`} className={styles.strong}>
                  {site.contact.phone.display}
                </a>
              </p>
            )}
            {site.contact.email && (
              <p className={styles.small}>
                <a href={`mailto:${site.contact.email}`} className={styles.strong}>
                  {site.contact.email}
                </a>
              </p>
            )}
          </div>

          <div className={styles.block}>
            <h2>{v.reach.title}</h2>
            <ul className={styles.reach}>
              {v.reach.items.map((r) => (
                <li key={r.title}>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </li>
              ))}
            </ul>
            <a className="button button-primary" href={mapsUrl} target="_blank" rel="noopener">
              {content.ui.getDirections}
            </a>
            <p className={styles.small}>
              {fill(content.ui.coordinates, { lat: site.geo.lat.toFixed(4), lng: site.geo.lng.toFixed(4) })}
            </p>
          </div>

          <div className={styles.block}>
            <h2>{v.distances.title}</h2>
            <FactList facts={v.distances.items} />
          </div>

          <div className={styles.block}>
            <h2>{v.season.title}</h2>
            <p className={styles.body}>{v.season.body}</p>
            <BulletList title={v.facilities.title} items={v.facilities.items} />
          </div>
        </div>
      </Section>

      <Section id="rules" tone="dark" defer>
        <div className={styles.rules}>
          <BulletList title={v.rules.title} items={v.rules.items} level={2} />
          <Figure id={v.rules.image} sizes="(max-width: 56rem) 92vw, 26rem" aspect="3 / 4" />
        </div>
      </Section>

      <Section id="stay" title={v.stay.title} defer>
        <ul className={styles.stay}>
          {v.stay.items.map((item) => (
            <li key={item.link}>
              <a href={site.links[item.link]} target="_blank" rel="noopener">
                {item.label}
              </a>
              <span>{item.note}</span>
            </li>
          ))}
        </ul>
      </Section>
      <NextPageLink current="visit" />
    </>
  );
}
