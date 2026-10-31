import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { NextPageLink, Section } from "@/components/blocks";
import { href, isPageEnabled } from "@/config";
import { content } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";
import styles from "./faq.module.css";

export const metadata = pageMetadata("faq");

export default function FaqPage() {
  requirePage("faq");
  const { items } = content.faq;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <PageHero page="faq" />
      <Section id="questions">
        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary>{item.q}</summary>
              <div className={styles.answer}>
                <p>{item.a}</p>
                {item.link && isPageEnabled(item.link) && (
                  <Link href={href(item.link)}>{content.pages[item.link].navLabel}</Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </Section>
      <NextPageLink current="faq" />
    </>
  );
}
