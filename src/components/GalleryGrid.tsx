"use client";

import { AnimatePresence, LazyMotion, MotionConfig, m } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./GalleryGrid.module.css";

export type GalleryItem = {
  id: string;
  category: string;
  title: string;
  /** Server-rendered thumbnail <Photo>. */
  thumb: ReactNode;
  /** Server-rendered large <Photo> for the lightbox (only mounted when opened). */
  full: ReactNode;
  credit: ReactNode;
};

type Labels = {
  filter: string;
  all: string;
  categories: Record<string, string>;
  close: string;
  previous: string;
  next: string;
  /** Template with {n} and {total}. */
  counter: string;
};

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/** Filterable photo grid with a keyboard-friendly lightbox built on the native <dialog>. */
type GalleryGridProps = {
  items: GalleryItem[];
  labels: Labels;
  /** theme.motion.gallery */
  animate: boolean;
  /** theme.motion.speed */
  speed: number;
};

export function GalleryGrid({ items, labels, animate, speed }: GalleryGridProps) {
  const titleId = useId();
  const [filter, setFilter] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);

  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);
  const categories = Object.keys(labels.categories).filter((c) => items.some((i) => i.category === c));
  const current = openIndex === null ? null : visible[openIndex];

  const open = (index: number, trigger: HTMLButtonElement) => {
    returnFocus.current = trigger;
    setDirection(0);
    setOpenIndex(index);
    dialogRef.current?.showModal();
  };

  const step = (delta: number) => {
    if (openIndex === null) return;
    setDirection(delta);
    setOpenIndex((openIndex + delta + visible.length) % visible.length);
  };

  // Escape and backdrop close via the native dialog; sync our state and restore focus.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpenIndex(null);
      returnFocus.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      // Leaving the page (Next keeps it hidden, not unmounted) must not leave a modal open on top.
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={animate ? "user" : "always"}>
        <div className={styles.filters} role="group" aria-label={labels.filter}>
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              className={styles.chip}
              onClick={() => setFilter(c)}
            >
              {c === "all" ? labels.all : labels.categories[c]}
            </button>
          ))}
        </div>

        <ul className={styles.grid}>
          {visible.map((item, index) => (
            <li key={item.id} className={styles.cell}>
              <button type="button" className={styles.open} onClick={(e) => open(index, e.currentTarget)}>
                {item.thumb}
                <span className="visually-hidden">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>

        <dialog
          ref={dialogRef}
          className={styles.dialog}
          aria-labelledby={titleId}
          onClick={(e) => {
            if (e.target === dialogRef.current) dialogRef.current.close();
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          {/* Always rendered so the dialog has its name the moment it opens. */}
          <p id={titleId} className="visually-hidden">
            {current?.title ?? labels.all}
          </p>
          {current && (
            <div className={styles.viewer}>
              <div className={styles.stage}>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <m.div
                    key={current.id}
                    className={styles.slide}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.3 * speed, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {current.full}
                  </m.div>
                </AnimatePresence>
              </div>
              <div className={styles.bar}>
                <div>
                  <p className={styles.title} aria-hidden="true">
                    {current.title}
                  </p>
                  {current.credit}
                </div>
                <p className={styles.counter}>{labels.counter.replace("{n}", String(openIndex! + 1)).replace("{total}", String(visible.length))}</p>
                <div className={styles.controls}>
                  <button type="button" onClick={() => step(-1)} aria-label={labels.previous}>
                    ‹
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label={labels.next}>
                    ›
                  </button>
                  <button type="button" onClick={() => dialogRef.current?.close()} autoFocus>
                    {labels.close}
                  </button>
                </div>
              </div>
            </div>
          )}
        </dialog>
      </MotionConfig>
    </LazyMotion>
  );
}
