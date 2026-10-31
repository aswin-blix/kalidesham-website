import { PageHero } from "@/components/PageHero";
import { BulletList, FactList, Figure, NextPageLink, Prose, Section, Split } from "@/components/blocks";
import { config } from "@/config";
import { content } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";
import styles from "./trek.module.css";

export const metadata = pageMetadata("trek");

export default function TrekPage() {
  requirePage("trek");
  const t = content.trek;
  return (
    <>
      <PageHero page="trek" />
      <Section id="route" title={t.route.title}>
        <Split>
          <Prose paragraphs={t.route.body} />
          <FactList facts={t.facts} />
        </Split>
      </Section>
      <Section id="highlights" tone="deep" defer>
        <Split>
          <BulletList title={t.highlights.title} items={t.highlights.items} level={2} />
          <Figure id={t.highlights.image} sizes="(max-width: 56rem) 92vw, 30rem" aspect="3 / 2" />
        </Split>
      </Section>
      <Section id="prepare" defer>
        <div className={styles.grid}>
          <BulletList title={t.included.title} items={t.included.items} level={2} />
          <BulletList title={t.excluded.title} items={t.excluded.items} level={2} />
          <BulletList title={t.packing.title} items={t.packing.items} level={2} />
          <BulletList title={t.rules.title} items={t.rules.items} level={2} />
        </div>
      </Section>
      <Section id="booking" tone="dark" defer>
        <div className={styles.booking}>
          <h2>{t.booking.title}</h2>
          <p>{t.booking.body}</p>
          <a className="button button-primary" href={config.site.links.trekBooking} target="_blank" rel="noopener">
            {t.booking.cta}
          </a>
          <p className={styles.note}>{content.ui.checkBeforeYouGo}</p>
        </div>
      </Section>
      <NextPageLink current="trek" />
    </>
  );
}
