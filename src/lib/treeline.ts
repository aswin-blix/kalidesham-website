/** The path is drawn in a fixed box and stretched to fit with preserveAspectRatio="none". */
export const TREELINE_WIDTH = 1440;
export const TREELINE_HEIGHT = 120;

/**
 * A treeline silhouette: a row of overlapping crowns along a wavy base line.
 * Deterministic (seeded) so server and client render the same markup, and so
 * cacheComponents never sees Math.random during prerender.
 */
export function treeline(seed: number, baseY: number, minR: number, maxR: number): string {
  let state = seed;
  const next = () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };

  let x = -maxR;
  let y = baseY;
  let d = `M ${x} ${TREELINE_HEIGHT} L ${x} ${y}`;
  while (x < TREELINE_WIDTH + maxR) {
    const r = minR + next() * (maxR - minR);
    const nextY = baseY + (next() - 0.5) * maxR * 0.8;
    x += 2 * r;
    // Radius a little larger than half the chord, so uneven crowns still join smoothly.
    d += ` A ${Math.round(r * 1.05)} ${Math.round(r)} 0 0 1 ${Math.round(x)} ${Math.round(nextY)}`;
    y = nextY;
  }
  return `${d} L ${Math.round(x)} ${TREELINE_HEIGHT} Z`;
}
