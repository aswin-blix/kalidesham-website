"use client";

import { LazyMotion, m, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import styles from "./ExploreIndex.module.css";

export type ExploreItem = {
  key: string;
  href: string;
  label: string;
  description: string;
  /** Server-rendered <Photo> for the floating preview (wide screens). */
  preview: ReactNode;
  /** Server-rendered small <Photo> shown inline on touch screens. */
  thumb: ReactNode;
};

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * Index of every page. On screens with a mouse, a photo of the page under the
 * pointer glides alongside it in the right-hand column; keyboard focus shows it
 * too. Touch screens get an inline thumbnail instead.
 */
export function ExploreIndex({ items, hoverPreview }: { items: ExploreItem[]; hoverPreview: boolean }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  const onPointerMove = (event: PointerEvent) => {
    const box = listRef.current?.getBoundingClientRect();
    if (event.pointerType === "mouse" && box) y.set(event.clientY - box.top);
  };

  const onFocus = (key: string) => (event: FocusEvent<HTMLAnchorElement>) => {
    const row = event.currentTarget.getBoundingClientRect();
    const box = listRef.current?.getBoundingClientRect();
    if (box) y.jump(row.top - box.top + row.height / 2);
    setActive(key);
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className={styles.wrap} data-preview={hoverPreview ? "on" : "off"}>
        <ul
          ref={listRef}
          className={styles.list}
          onPointerMove={hoverPreview ? onPointerMove : undefined}
          onPointerLeave={() => setActive(null)}
        >
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className={styles.row}
                data-active={active === item.key ? "true" : undefined}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setActive(item.key);
                }}
                onFocus={onFocus(item.key)}
                onBlur={() => setActive(null)}
              >
                <span className={styles.thumb} aria-hidden="true">
                  {item.thumb}
                </span>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.description}>{item.description}</span>
              </Link>
            </li>
          ))}
          {hoverPreview && (
            <m.li
              aria-hidden="true"
              className={styles.preview}
              style={{ y: springY }}
              data-visible={active ? "true" : undefined}
            >
              {items.map((item) => (
                <span key={item.key} className={styles.previewPhoto} data-active={active === item.key ? "true" : undefined}>
                  {item.preview}
                </span>
              ))}
            </m.li>
          )}
        </ul>
      </div>
    </LazyMotion>
  );
}
