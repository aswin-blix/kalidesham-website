import { Journey } from "@/components/Journey";
import { PageHero } from "@/components/PageHero";
import { BulletList, FactList, NextPageLink, Prose, Section, Split } from "@/components/blocks";
import { content } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  requirePage("about");
  const { where, landscape } = content.about;
  return (
    <>
      <PageHero page="about" />
      <Section id="where" title={where.title}>
        <Split>
          <Prose paragraphs={where.body} />
          <FactList facts={where.facts} />
        </Split>
      </Section>
      <Journey />
      <Section id="landscape" title={landscape.title} tone="deep" defer>
        <Split>
          <Prose paragraphs={landscape.body} />
          <BulletList title={landscape.forestTypes.title} items={landscape.forestTypes.items} />
        </Split>
      </Section>
      <NextPageLink current="about" />
    </>
  );
}
