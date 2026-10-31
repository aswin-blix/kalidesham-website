import { config } from "@/config";
import { content } from "@/content";
import { Canopy } from "./Canopy";
import { Photo, PhotoCredit } from "./Photo";
import styles from "./ForestMosaic.module.css";

/** Home page: where the forest begins. A treeline edge, the sanctuary in numbers, and a photo mosaic. */
export function ForestMosaic() {
  const { title, intro, stats, images } = content.home.forest;
  const { motion } = config.theme;
  const drift = motion.enabled && motion.mosaicDrift;

  return (
    <section
      id="forest"
      className={`section section-dark ${styles.forest}`}
      aria-labelledby="forest-title"
      data-drift={drift ? undefined : "off"}
    >
      <Canopy edge="top" />
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <header className="section-head">
            <h2 id="forest-title">{title}</h2>
            <p>{intro}</p>
          </header>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.mosaic}>
          {images.map((id, index) => (
            <figure key={id} className={styles.tile} data-tile={index}>
              <Photo id={id} cover sizes="(max-width: 56rem) 46vw, 22rem" />
            </figure>
          ))}
        </div>
      </div>
      {config.features.inlinePhotoCredits && (
        <div className={`wrap ${styles.credits}`}>
          {images.map((id) => (
            <PhotoCredit key={id} id={id} />
          ))}
        </div>
      )}
    </section>
  );
}
