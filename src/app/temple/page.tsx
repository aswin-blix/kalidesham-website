import { PageHero } from "@/components/PageHero";
import { Timeline } from "@/components/Timeline";
import { BulletList, Figure, NextPageLink, Prose, Section, Split } from "@/components/blocks";
import { content } from "@/content";
import { pageMetadata, requirePage } from "@/lib/page";

export const metadata = pageMetadata("temple");

export default function TemplePage() {
  requirePage("temple");
  const { shrine, visiting, history } = content.temple;
  return (
    <>
      <PageHero page="temple" />
      <Section id="shrine" title={shrine.title}>
        <Split>
          <Prose paragraphs={shrine.body} />
          <Figure id={shrine.image} sizes="(max-width: 56rem) 92vw, 30rem" aspect="4 / 5" />
        </Split>
      </Section>
      <Section id="visiting" tone="dark" defer>
        <Split reverse>
          <BulletList title={visiting.title} items={visiting.items} level={2} />
          <Figure id={visiting.image} sizes="(max-width: 56rem) 92vw, 30rem" aspect="4 / 3" />
        </Split>
      </Section>
      <Section id="history" title={history.title} intro={history.intro}>
        <Timeline entries={history.timeline} />
      </Section>
      <NextPageLink current="temple" />
    </>
  );
}
