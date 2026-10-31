import { FieldGuide } from "@/components/FieldGuide";
import { PageHero } from "@/components/PageHero";
import { Photo, PhotoCredit } from "@/components/Photo";
import { BulletList, NextPageLink, Prose, Section, Split } from "@/components/blocks";
import { anchors, config } from "@/config";
import { content } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";
import styles from "./wildlife.module.css";

export const metadata = pageMetadata("wildlife");

export default function WildlifePage() {
  requirePage("wildlife");
  const { guide, alsoRecorded, discoveries, ethics } = content.wildlife;
  const { motion } = config.theme;
  const entries = guide.species.map(({ image, ...s }) => ({
    ...s,
    photo: <Photo id={image} cover sizes="(max-width: 56rem) 92vw, 44rem" />,
    credit: <PhotoCredit id={image} />,
  }));

  return (
    <>
      <PageHero page="wildlife" />
      <Section id={anchors.fieldGuide} title={guide.title} intro={guide.intro}>
        <FieldGuide
          species={entries}
          label={guide.tabsLabel}
          animate={motion.enabled && motion.fieldGuide}
          speed={motion.speed}
        />
        <div className={styles.also}>
          <h3>{alsoRecorded.title}</h3>
          <ul>
            {alsoRecorded.items.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </Section>
      <Section id="discoveries" tone="dark" defer>
        <Split>
          <div>
            <h2 className={styles.heading}>{discoveries.title}</h2>
            <Prose paragraphs={discoveries.body} />
          </div>
          <BulletList title={ethics.title} items={ethics.items} level={2} />
        </Split>
      </Section>
      <NextPageLink current="wildlife" />
    </>
  );
}
