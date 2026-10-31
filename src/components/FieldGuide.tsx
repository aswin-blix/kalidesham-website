"use client";

import { AnimatePresence, LazyMotion, MotionConfig, m } from "framer-motion";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Species } from "@/content/types";
import styles from "./FieldGuide.module.css";

type Entry = Pick<Species, "id" | "name" | "scientific" | "note"> & {
  /** Server-rendered <Photo>, so the image manifest never ships to the browser. */
  photo: ReactNode;
  credit: ReactNode;
};

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/** Tabbed field guide: choose an animal, its photo and notes swap in place. */
type FieldGuideProps = {
  species: Entry[];
  /** Accessible name of the list of animals. */
  label: string;
  /** theme.motion.fieldGuide: animate the swap between animals. */
  animate: boolean;
  /** theme.motion.speed */
  speed: number;
};

export function FieldGuide({ species, label, animate, speed }: FieldGuideProps) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const current = species[active];

  const focusTab = (index: number) => {
    const next = (index + species.length) % species.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: species.length - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      focusTab(keys[event.key]);
    }
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={animate ? "user" : "always"}>
        <div className={styles.guide}>
          <div role="tablist" aria-label={label} aria-orientation="vertical" className={styles.list}>
            {species.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${s.id}`}
                aria-selected={i === active}
                aria-controls={`${baseId}-panel`}
                tabIndex={i === active ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(i)}
                onKeyDown={(event) => onKeyDown(event, i)}
              >
                <span className={styles.tabName}>{s.name}</span>
                <span className={styles.tabLatin}>{s.scientific}</span>
              </button>
            ))}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${current.id}`}
            className={styles.panel}
          >
            <div className={styles.frame}>
              <AnimatePresence initial={false} mode="popLayout">
                <m.div
                  key={current.id}
                  className={styles.photo}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 * speed, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.photo}
                </m.div>
              </AnimatePresence>
            </div>
            <AnimatePresence initial={false} mode="wait">
              <m.div
                key={current.id}
                className={styles.copy}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 * speed }}
              >
                <h3>{current.name}</h3>
                <p>{current.note}</p>
                {current.credit}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
