import Link from "next/link";
import { content } from "@/content";
import styles from "./not-found.module.css";

export default function NotFound() {
  const { ui } = content;
  return (
    <section className={`on-dark ${styles.wrap}`}>
      <div className="wrap">
        <h1>{ui.notFoundTitle}</h1>
        <p>{ui.notFoundBody}</p>
        <Link className="button button-primary" href="/">
          {ui.notFoundCta}
        </Link>
      </div>
    </section>
  );
}
