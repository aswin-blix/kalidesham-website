import { describe, expect, it } from "vitest";
import { buildRiverPath } from "@/lib/river-path";

const commands = (d: string) => d.match(/[MC]/g) ?? [];

describe("buildRiverPath", () => {
  it("returns an empty path when there are no stops", () => {
    expect(buildRiverPath([], 0, 100, 20)).toBe("");
  });

  it("starts at the top, passes through every stop, and ends at the bottom", () => {
    const points = [
      { x: 100, y: 50 },
      { x: 100, y: 300 },
      { x: 100, y: 600 },
    ];
    const d = buildRiverPath(points, 0, 800, 40);
    expect(d.startsWith("M 100 0")).toBe(true);
    // One curve per segment: top -> 3 stops -> bottom = 4 curves.
    expect(commands(d)).toEqual(["M", "C", "C", "C", "C"]);
    for (const p of points) expect(d).toContain(`${p.x} ${p.y}`);
    expect(d.endsWith("100 800")).toBe(true);
  });

  it("alternates the swing direction so the line meanders", () => {
    const d = buildRiverPath(
      [
        { x: 0, y: 100 },
        { x: 0, y: 200 },
      ],
      0,
      300,
      30,
    );
    const firstControlXs = [...d.matchAll(/C (-?[\d.]+)/g)].map((m) => Number(m[1]));
    expect(firstControlXs).toEqual([-30, 30, -30]);
  });

  it("rounds coordinates to keep the markup small", () => {
    const d = buildRiverPath([{ x: 10.123456, y: 20.987654 }], 0, 40, 5);
    expect(d).not.toMatch(/\d\.\d{2,}/);
  });
});
