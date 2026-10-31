import Link from "next/link";
import { config, href, isPageEnabled } from "@/config";
import { content } from "@/content";
import { HeroBackdrop } from "./HeroBackdrop";
import { Photo, PhotoCredit } from "./Photo";
import styles from "./Hero.module.css";

/** Split into user-perceived characters so vowel signs stay attached to their letters. */
function graphemes(text: string, lang: string) {
  const segmenter = new Intl.Segmenter(lang, { granularity: "grapheme" });
  return Array.from(segmenter.segment(text), (s) => s.segment);
}

/** Home page opening: the local-script name set huge over the hero photo. */
export function Hero() {
  const { site, theme } = config;
  const { home, pages } = content;
  const letters = graphemes(site.localName.text, site.localName.lang);
  const image = pages.home.heroImage;
  const parallax = theme.motion.enabled && theme.motion.heroParallax;
  const photo = image ? <Photo id={image} cover priority sizes="100vw" objectPosition="50% 60%" /> : null;

  return (
    <section
      className={`on-dark ${styles.hero}`}
      aria-labelledby="hero-title"
      data-letters={theme.motion.heroLetters ? undefined : "off"}
    >
      {parallax ? (
        <HeroBackdrop>{photo}</HeroBackdrop>
      ) : (
        <div className={styles.backdrop}>
          <div className={styles.backdropInner}>{photo}</div>
        </div>
      )}
      <div className={`wrap ${styles.content}`}>
        <h1 id="hero-title" className={styles.title}>
          {/* The opening reveal is pure CSS: visible even before JavaScript loads. */}
          <span lang={site.localName.lang} className={styles.local}>
            <span className="visually-hidden">{site.localName.text}</span>
            {letters.map((letter, i) => (
              <span key={i} aria-hidden="true" style={{ "--i": i } as React.CSSProperties}>
                {letter}
              </span>
            ))}
          </span>
          <span className={styles.latin}>{site.name}</span>
        </h1>
        <p className={styles.summary}>{home.summary}</p>
        <div className={styles.actions}>
          {isPageEnabled("visit") && (
            <Link className="button button-primary" href={href("visit")}>
              {home.primaryCta}
            </Link>
          )}
          {isPageEnabled("about") && (
            <Link className="button button-quiet" href={`${href("about")}#journey`}>
              {home.secondaryCta}
            </Link>
          )}
        </div>
      </div>
      {image && <PhotoCredit id={image} className={styles.credit} />}
    </section>
  );
}
