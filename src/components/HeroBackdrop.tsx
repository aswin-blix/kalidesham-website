"use client";

import { LazyMotion, m, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import styles from "./Hero.module.css";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/** Hero photo (rendered on the server, passed in) drifting slower than the page on scroll. */
export function HeroBackdrop({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);

  return (
    <LazyMotion features={loadFeatures} strict>
      <div ref={ref} className={styles.backdrop}>
        {/* Reduced motion is handled in CSS, so server and client render identical markup. */}
        <m.div className={styles.backdropInner} style={{ y, scale }}>
          {children}
        </m.div>
      </div>
    </LazyMotion>
  );
}
