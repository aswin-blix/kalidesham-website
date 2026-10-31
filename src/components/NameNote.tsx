import { config } from "@/config";
import { content } from "@/content";
import styles from "./NameNote.module.css";

/** What the name means, set large: the quiet beat after the hero. */
export function NameNote() {
  const note = content.home.nameNote;
  return (
    <section className={`section ${styles.note}`} aria-labelledby="name-title">
      <div className="wrap">
        <h2 id="name-title" className="visually-hidden">
          {note.heading}
        </h2>
        <div className={styles.grid}>
          <p className={styles.split} lang={config.site.localName.lang} aria-hidden="true">
            <span>{note.split[0]}</span>
            <span className={styles.plus}>+</span>
            <span>{note.split[1]}</span>
          </p>
          <div>
            <p className={styles.lead}>{note.lead}</p>
            <p className={styles.body}>{note.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
