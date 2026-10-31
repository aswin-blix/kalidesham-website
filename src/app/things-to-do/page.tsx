import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Figure, NextPageLink, Section } from "@/components/blocks";
import { href, isPageEnabled } from "@/config";
import { content } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";
import styles from "./things-to-do.module.css";

export const metadata = pageMetadata("thingsToDo");

export default function ThingsToDoPage() {
  requirePage("thingsToDo");
  const { activities, trekTeaser } = content.thingsToDo;
  return (
    <>
      <PageHero page="thingsToDo" />
      <Section id="activities">
        <ul className={styles.list}>
          {activities.map((a) => (
            <li key={a.id} className={styles.item} data-has-photo={a.image ? "true" : undefined}>
              <div className={styles.text}>
                <h2>{a.name}</h2>
                <p>{a.body}</p>
                {a.link && isPageEnabled(a.link) && (
                  <Link href={href(a.link)} className={styles.more}>
                    {content.pages[a.link].navLabel}
                  </Link>
                )}
              </div>
              {a.image && <Figure id={a.image} sizes="(max-width: 56rem) 92vw, 26rem" aspect="3 / 2" />}
            </li>
          ))}
        </ul>
      </Section>
      {isPageEnabled("trek") && (
        <Section id="trek" tone="dark" defer>
          <div className={styles.teaser}>
            <h2>{trekTeaser.title}</h2>
            <p>{trekTeaser.body}</p>
            <Link className="button button-primary" href={href("trek")}>
              {trekTeaser.cta}
            </Link>
          </div>
        </Section>
      )}
      <NextPageLink current="thingsToDo" />
    </>
  );
}
