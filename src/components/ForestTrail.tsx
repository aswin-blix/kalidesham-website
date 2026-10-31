import Link from "next/link";
import { config, href, orderedPages, pageGroup } from "@/config";
import { content } from "@/content";
import { Canopy } from "./Canopy";
import { Photo } from "./Photo";
import { RiverLine } from "./RiverLine";
import styles from "./ForestTrail.module.css";

/**
 * Home page index drawn as a forest path: one stop per page in reading order,
 * with a signpost wherever the path enters a new group (Discover, Experience, Plan).
 * The path is the same GSAP line as the river on /about, in its "trail" style.
 */
export function ForestTrail() {
  const { title, intro, start, cta, end } = content.home.explore;
  const { motion } = config.theme;
  const animated = motion.enabled && motion.trail;
  const pages = orderedPages();

  const stops = pages.map((key, index) => {
    const group = pageGroup(key);
    // A signpost wherever the group changes from the previous stop.
    const signpost = group && (index === 0 || pageGroup(pages[index - 1]) !== group) ? content.ui.footerGroups[group] : null;
    const page = content.pages[key];
    return { key, index, signpost, page, image: page.heroImage ?? page.thumbImage };
  });

  return (
    <section id="explore" className={`section section-dark ${styles.forest}`} aria-labelledby="explore-title">
      <div className="wrap">
        <header className="section-head">
          <h2 id="explore-title">{title}</h2>
          <p>{intro}</p>
        </header>

        <div className={styles.route} data-river-route data-static={animated ? undefined : "true"}>
          <RiverLine animated={animated} variant="trail" />
          <p className={styles.trailhead}>{start}</p>
          <ol className={styles.stops}>
            {stops.map(({ key, index, signpost, page, image }) => (
              <li key={key}>
                {signpost && (
                  <p className={styles.signpost}>
                    <span>{signpost}</span>
                  </p>
                )}
                <article className={styles.stop} data-side={index % 2 === 0 ? "left" : "right"}>
                  <span className={styles.marker} data-river-marker aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {image && (
                    <span className={styles.photo} aria-hidden="true">
                      <Photo id={image} cover alt="" sizes="(max-width: 56rem) 80vw, 24rem" />
                    </span>
                  )}
                  <div className={styles.text}>
                    <h3>
                      <Link href={href(key)} className={styles.link}>
                        {page.navLabel}
                      </Link>
                    </h3>
                    <p>{page.description}</p>
                    <span className={styles.cta} aria-hidden="true">
                      {cta} <span className={styles.arrow}>→</span>
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          <p className={styles.end}>{end}</p>
        </div>
      </div>
      {/* The canopy hangs over the top of the next section (so this section is never
          content-visibility deferred: paint containment would clip it). */}
      <Canopy edge="bottom" />
    </section>
  );
}
