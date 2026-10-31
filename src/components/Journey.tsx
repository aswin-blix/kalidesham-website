import { config } from "@/config";
import { content } from "@/content";
import { Photo, PhotoCredit } from "./Photo";
import { RiverLine } from "./RiverLine";
import styles from "./Journey.module.css";

/** The stops along the road in, linked by the GSAP river line. */
export function Journey() {
  const { title, intro, stops } = content.about.journey;
  const { motion } = config.theme;
  const animated = motion.enabled && motion.riverLine;

  return (
    <section id="journey" className="section section-dark" aria-labelledby="journey-title">
      <div className="wrap">
        <header className="section-head">
          <h2 id="journey-title">{title}</h2>
          <p>{intro}</p>
        </header>

        <div className={styles.route} data-river-route data-static={animated ? undefined : "true"}>
          <RiverLine animated={animated} />
          <ol className={styles.stops}>
            {stops.map((stop, index) => (
              <li
                key={stop.id}
                className={styles.stop}
                data-side={index % 2 === 0 ? "left" : "right"}
                data-sacred={stop.sacred ? "true" : undefined}
              >
                <span className={styles.marker} data-river-marker aria-hidden="true" />
                <div className={styles.text}>
                  <p className={styles.count}>{content.ui.stopCount(index + 1, stops.length)}</p>
                  <h3>{stop.title}</h3>
                  <p>{stop.body}</p>
                </div>
                <figure className={styles.figure}>
                  <div className={styles.frame}>
                    <Photo id={stop.image} cover sizes="(max-width: 56rem) 90vw, 34rem" />
                  </div>
                  <figcaption>
                    <PhotoCredit id={stop.image} />
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
