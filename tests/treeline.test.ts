import { describe, expect, it } from "vitest";
import { TREELINE_HEIGHT, TREELINE_WIDTH, treeline } from "@/lib/treeline";

const numbers = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

/**
 * Highest point (smallest y) of each upward arc in a path, using the SVG
 * endpoint-to-centre conversion (SVG 1.1 implementation notes, F.6.5) with
 * out-of-range radii scaled up as browsers do. Rotation is always 0 here.
 */
function arcTops(d: string): number[] {
  const tops: number[] = [];
  let x0 = 0;
  let y0 = 0;
  for (const m of d.matchAll(/([MLA])\s*([^MLAZ]*)/g)) {
    const n = m[2].trim().split(/[\s,]+/).map(Number);
    if (m[1] !== "A") {
      [x0, y0] = n;
      continue;
    }
    let [rx, ry] = n;
    const [, , , large, sweep, x1, y1] = n;
    const dx = (x0 - x1) / 2;
    const dy = (y0 - y1) / 2;
    const lambda = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
    if (lambda > 1) {
      rx *= Math.sqrt(lambda);
      ry *= Math.sqrt(lambda);
    }
    const num = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx;
    const den = rx * rx * dy * dy + ry * ry * dx * dx;
    const coef = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
    const cy = coef * -((ry * dx) / rx) + (y0 + y1) / 2;
    tops.push(Math.round((cy - ry) * 100) / 100);
    [x0, y0] = [x1, y1];
  }
  return tops;
}

describe("treeline", () => {
  it("is deterministic, so server and client markup match", () => {
    expect(treeline(7, 62, 26, 58)).toBe(treeline(7, 62, 26, 58));
    expect(treeline(7, 62, 26, 58)).not.toBe(treeline(8, 62, 26, 58));
  });

  it("is a closed shape standing on the bottom edge", () => {
    const d = treeline(19, 84, 20, 44);
    expect(d.startsWith(`M -44 ${TREELINE_HEIGHT} L -44 84`)).toBe(true);
    expect(d.endsWith(`${TREELINE_HEIGHT} Z`)).toBe(true);
  });

  it("covers the full width with crowns of the requested size", () => {
    const d = treeline(31, 104, 14, 30);
    const arcs = [...d.matchAll(/A (\d+) (\d+) 0 0 1 (-?\d+) (-?\d+)/g)];
    expect(arcs.length).toBeGreaterThan(TREELINE_WIDTH / (2 * 30));
    for (const [, , ry] of arcs) {
      expect(Number(ry)).toBeGreaterThanOrEqual(14);
      expect(Number(ry)).toBeLessThanOrEqual(30);
    }
    expect(Math.max(...numbers(d))).toBeGreaterThanOrEqual(TREELINE_WIDTH);
  });

  it("keeps the tops of the crowns inside the drawing box", () => {
    for (const [seed, base, min, max] of [
      [7, 62, 26, 58],
      [19, 84, 20, 44],
      [31, 104, 14, 30],
    ]) {
      const tops = arcTops(treeline(seed, base, min, max));
      expect(tops.length).toBeGreaterThan(0);
      expect(Math.min(...tops), `seed ${seed}`).toBeGreaterThan(0);
    }
  });

  it("measures arc tops correctly (guards the helper above)", () => {
    // A semicircle of radius 10 from (0,50) to (20,50), bulging up, peaks at y = 40.
    expect(arcTops("M 0 50 A 10 10 0 0 1 20 50")).toEqual([40]);
    // A shallower arc: its centre sits 6 below the chord, so it peaks at 56 - 10 = 46.
    expect(arcTops("M 0 50 A 10 10 0 0 1 16 50")).toEqual([46]);
  });
});
