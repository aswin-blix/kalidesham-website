export type Point = { x: number; y: number };

/**
 * SVG path for a meandering river that starts at `top`, passes through every
 * point in order, and ends at `bottom`. Each segment is a cubic Bézier whose
 * control points swing left/right by `amplitude`, alternating, so the line
 * bends like water instead of running straight.
 */
export function buildRiverPath(points: Point[], top: number, bottom: number, amplitude: number): string {
  if (points.length === 0) return "";
  const route: Point[] = [{ x: points[0].x, y: top }, ...points, { x: points[points.length - 1].x, y: bottom }];

  const round = (n: number) => Math.round(n * 10) / 10;
  let d = `M ${round(route[0].x)} ${round(route[0].y)}`;
  for (let i = 1; i < route.length; i++) {
    const from = route[i - 1];
    const to = route[i];
    const dy = to.y - from.y;
    const swing = (i % 2 === 0 ? 1 : -1) * amplitude;
    const c1 = { x: from.x + swing, y: from.y + dy / 3 };
    const c2 = { x: to.x - swing, y: from.y + (2 * dy) / 3 };
    d += ` C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(to.x)} ${round(to.y)}`;
  }
  return d;
}
