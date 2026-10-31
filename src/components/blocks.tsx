// Small building blocks shared by the inner pages.
import Link from "next/link";
import type { ReactNode } from "react";
import { config, href, nextPage, type PageKey } from "@/config";
import { content } from "@/content";
import type { ImageId } from "@/content/images";
import type { Fact, Paragraphs } from "@/content/types";
import { Photo, PhotoCredit } from "./Photo";
import styles from "./blocks.module.css";

type SectionProps = {
  id?: string;
  title?: string;
  intro?: string;
  tone?: "light" | "deep" | "dark";
  /** Skip layout/paint until near the viewport. Use for sections below the fold. */
  defer?: boolean;
  children: ReactNode;
};

export function Section({ id, title, intro, tone = "light", defer, children }: SectionProps) {
  const headingId = id && title ? `${id}-title` : undefined;
  const classes = ["section", styles[tone], tone === "dark" ? "section-dark" : "", defer ? "defer-render" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={classes} aria-labelledby={headingId}>
      <div className="wrap">
        {title && (
          <header className="section-head">
            <h2 id={headingId}>{title}</h2>
            {intro && <p>{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function Prose({ paragraphs, className }: { paragraphs: Paragraphs; className?: string }) {
  return (
    <div className={className ? `${styles.prose} ${className}` : styles.prose}>
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

export function FactList({ facts, className }: { facts: Fact[]; className?: string }) {
  return (
    <dl className={className ? `${styles.facts} ${className}` : styles.facts}>
      {facts.map((f) => (
        <div key={f.label}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** List with an optional heading. Use level 2 when it opens a section that has no other heading. */
export function BulletList({ items, title, level = 3 }: { items: string[]; title?: string; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className={styles.bullets}>
      {title && <Heading className={styles.bulletsTitle}>{title}</Heading>}
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Two columns on wide screens, stacked on small ones. */
export function Split({ children, reverse }: { children: ReactNode; reverse?: boolean }) {
  return (
    <div className={styles.split} data-reverse={reverse ? "true" : undefined}>
      {children}
    </div>
  );
}

/** "Next: …" link at the end of a page, following navigation.pageOrder. */
export function NextPageLink({ current }: { current: PageKey }) {
  const next = nextPage(current);
  if (!config.features.nextPageLink || !next) return null;
  const page = content.pages[next];
  return (
    <nav className={`on-dark ${styles.next}`} aria-label={content.ui.next}>
      <Link href={href(next)} className={`wrap ${styles.nextLink}`}>
        <span className={styles.nextLabel}>{content.ui.next}</span>
        <span className={styles.nextTitle}>{page.navLabel}</span>
        <span className={styles.nextDesc}>{page.description}</span>
      </Link>
    </nav>
  );
}

type FigureProps = {
  id: ImageId;
  sizes: string;
  caption?: string;
  /** CSS aspect-ratio of the frame, e.g. "4 / 3". */
  aspect?: string;
};

/** Photo in a fixed-ratio frame with optional caption and the licence credit. */
export function Figure({ id, sizes, caption, aspect = "4 / 3" }: FigureProps) {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame} style={{ aspectRatio: aspect }}>
        <Photo id={id} cover sizes={sizes} />
      </div>
      {(caption || config.features.inlinePhotoCredits) && (
        <figcaption>
          {caption && <span>{caption}</span>}
          <PhotoCredit id={id} />
        </figcaption>
      )}
    </figure>
  );
}
