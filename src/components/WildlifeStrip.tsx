import Link from "next/link";
import { anchors, href } from "@/config";
import { content } from "@/content";
import { Photo } from "./Photo";
import styles from "./WildlifeStrip.module.css";

/** Home page: the field-guide animals as photo cards, each linking to the wildlife page. */
export function WildlifeStrip() {
  const { title, intro, cta } = content.home.wildlife;
  const { species } = content.wildlife.guide;
  const guideHref = `${href("wildlife")}#${anchors.fieldGuide}`;

  return (
    <section id="wildlife" className={`section defer-render ${styles.section}`} aria-labelledby="wildlife-title">
      <div className="wrap">
        <header className={`section-head ${styles.head}`}>
          <h2 id="wildlife-title">{title}</h2>
          <p>{intro}</p>
        </header>
        <ul className={styles.cards}>
          {species.map((s) => (
            <li key={s.id} className={styles.item}>
              <Link href={guideHref} className={styles.card}>
                <span className={styles.photo} aria-hidden="true">
                  <Photo id={s.image} cover alt="" sizes="(max-width: 40rem) 70vw, (max-width: 64rem) 32vw, 12rem" />
                </span>
                <span className={styles.caption}>
                  <span className={styles.name}>{s.name}</span>
                  <span className={styles.scientific}>{s.scientific}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link className={`button button-quiet ${styles.cta}`} href={guideHref}>
          {cta}
        </Link>
      </div>
    </section>
  );
}
