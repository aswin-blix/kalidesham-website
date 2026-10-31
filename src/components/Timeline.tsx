import type { TimelineEntry } from "@/content/types";
import styles from "./Timeline.module.css";

/** A dated sequence, oldest first, on a single vertical line. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className={styles.timeline}>
      {entries.map((entry) => (
        <li key={entry.title} className={styles.entry}>
          <p className={styles.when}>{entry.when}</p>
          <div>
            <h3>{entry.title}</h3>
            <p>{entry.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
