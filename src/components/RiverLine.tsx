"use client";

import { useEffect, useRef, useState } from "react";
import { buildRiverPath } from "@/lib/river-path";
import styles from "./RiverLine.module.css";

type Geometry = { width: number; height: number; d: string };

/**
 * The river that links the journey stops. It is measured from the stop markers,
 * drawn by GSAP as the reader scrolls, and lights each marker as it arrives.
 * GSAP is imported only when the journey nears the viewport, so it never weighs on first load.
 */
export function RiverLine({ animated = true }: { animated?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drawnRef = useRef<SVGPathElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  // Measure the route and rebuild the path whenever its layout changes.
  useEffect(() => {
    const svg = svgRef.current;
    const route = svg?.closest<HTMLElement>("[data-river-route]");
    if (!svg || !route) return;

    const measure = () => {
      const box = route.getBoundingClientRect();
      const markers = route.querySelectorAll<HTMLElement>("[data-river-marker]");
      const points = Array.from(markers, (marker) => {
        const r = marker.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
      });
      const narrow = box.width < 56 * 16 * 0.9;
      const amplitude = narrow ? 10 : Math.min(90, box.width * 0.07);
      const next = { width: box.width, height: box.height, d: buildRiverPath(points, 0, box.height, amplitude) };
      // Keep the same object when nothing moved, so GSAP is not torn down and rebuilt needlessly.
      setGeometry((prev) =>
        prev && prev.width === next.width && prev.height === next.height && prev.d === next.d ? prev : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(route);
    return () => observer.disconnect();
  }, []);

  // Scroll-driven drawing. Re-runs when the path changes (e.g. on resize).
  useEffect(() => {
    const path = drawnRef.current;
    const route = svgRef.current?.closest<HTMLElement>("[data-river-route]");
    if (!geometry || !path || !route) return;
    if (!animated) {
      // Motion switched off in the theme: show the whole river at once.
      path.dataset.ready = "true";
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const markers = Array.from(route.querySelectorAll<HTMLElement>("[data-river-marker]"));
      const length = path.getTotalLength();
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
          path.dataset.ready = "true";
          if (context.conditions?.reduce) {
            gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
            markers.forEach((m) => (m.dataset.reached = "true"));
            return;
          }

          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: route, start: "top 65%", end: "bottom 65%", scrub: 0.6 },
          });

          markers.forEach((marker) => {
            ScrollTrigger.create({
              trigger: marker,
              start: "center 65%",
              onEnter: () => (marker.dataset.reached = "true"),
              onLeaveBack: () => (marker.dataset.reached = "false"),
            });
          });

          // On revert (resize, page hidden by navigation), unlight the stops along with the river.
          return () => markers.forEach((marker) => delete marker.dataset.reached);
        },
      );

      cleanup = () => mm.revert();
    };

    // Fetch GSAP only once the journey is a quarter-screen away, keeping it off the initial load.
    const nearby = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          nearby.disconnect();
          void start();
        }
      },
      { rootMargin: "25% 0px" },
    );
    nearby.observe(route);

    return () => {
      cancelled = true;
      nearby.disconnect();
      cleanup?.();
      delete path.dataset.ready;
    };
  }, [geometry, animated]);

  return (
    <svg
      ref={svgRef}
      className={styles.river}
      width={geometry?.width ?? 0}
      height={geometry?.height ?? 0}
      viewBox={geometry ? `0 0 ${geometry.width} ${geometry.height}` : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {geometry && (
        <>
          <path className={styles.bed} d={geometry.d} />
          <path ref={drawnRef} className={styles.water} d={geometry.d} />
        </>
      )}
    </svg>
  );
}
