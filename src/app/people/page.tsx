import { PageHero } from "@/components/PageHero";
import { BulletList, FactList, Figure, NextPageLink, Prose, Section, Split } from "@/components/blocks";
import { content } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";
import styles from "./people.module.css";

export const metadata = pageMetadata("people");

export default function PeoplePage() {
  requirePage("people");
  const { who, knowledge, archive, dance, respect } = content.people;
  return (
    <>
      <PageHero page="people" />
      <Section id="who" title={who.title}>
        <Split>
          <Prose paragraphs={who.body} />
          <div className={styles.side}>
            <FactList facts={who.facts} />
            <div className={styles.archive}>
              <Figure id={archive.image} sizes="12rem" caption={archive.caption} aspect="2 / 3" />
            </div>
          </div>
        </Split>
      </Section>
      <Section id="knowledge" title={knowledge.title} tone="dark" defer>
        <Split>
          <Prose paragraphs={knowledge.body} />
          <Figure id={dance.image} sizes="(max-width: 56rem) 92vw, 28rem" caption={dance.caption} aspect="3 / 4" />
        </Split>
      </Section>
      <Section id="respect" tone="deep" defer>
        <BulletList title={respect.title} items={respect.items} level={2} />
      </Section>
      <NextPageLink current="people" />
    </>
  );
}
