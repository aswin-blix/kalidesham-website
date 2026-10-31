import { TREELINE_HEIGHT, TREELINE_WIDTH, treeline } from "@/lib/treeline";
import styles from "./Canopy.module.css";

// Back to front: lighter, taller crowns behind; the front layer matches the section colour.
const layers = [
  { d: treeline(7, 62, 26, 58), className: styles.back },
  { d: treeline(19, 84, 20, 44), className: styles.mid },
  { d: treeline(31, 104, 14, 30), className: styles.front },
];

/**
 * Forest edge drawn where a dark forest section meets a light one.
 * "top" rises above the section; "bottom" hangs below it. Purely decorative.
 */
export function Canopy({ edge = "top" }: { edge?: "top" | "bottom" }) {
  return (
    <svg
      className={styles.canopy}
      data-edge={edge}
      viewBox={`0 0 ${TREELINE_WIDTH} ${TREELINE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {layers.map((layer) => (
        <path key={layer.className} d={layer.d} className={layer.className} />
      ))}
    </svg>
  );
}
