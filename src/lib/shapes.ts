/**
 * Material 3 Expressive-style shapes (cookie / clover / sunny), generated as
 * SVG paths in a 0..1 box so they can be used as objectBoundingBox clip paths
 * or scaled with a viewBox of "0 0 1 1".
 */
export type ShapeName = "cookie12" | "cookie9" | "clover4" | "sunny8";

const SPECS: Record<ShapeName, { lobes: number; amp: number }> = {
  cookie12: { lobes: 12, amp: 0.035 },
  cookie9: { lobes: 9, amp: 0.05 },
  clover4: { lobes: 4, amp: 0.1 },
  sunny8: { lobes: 8, amp: 0.045 },
};

function scallop(lobes: number, amp: number, steps = 240): string {
  const r0 = 0.5 - amp;
  let d = "";
  for (let i = 0; i < steps; i++) {
    const th = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const r = r0 + amp * Math.cos(lobes * (th + Math.PI / 2));
    const x = 0.5 + r * Math.cos(th);
    const y = 0.5 + r * Math.sin(th);
    d += `${i ? "L" : "M"}${x.toFixed(4)} ${y.toFixed(4)}`;
  }
  return `${d}Z`;
}

export const SHAPE_PATHS: Record<ShapeName, string> = Object.fromEntries(
  (Object.keys(SPECS) as ShapeName[]).map((k) => [
    k,
    scallop(SPECS[k].lobes, SPECS[k].amp),
  ]),
) as Record<ShapeName, string>;

/** CSS value for `clip-path` once <ShapeDefs /> is mounted. */
export const clipShape = (name: ShapeName) => `url(#shape-${name})`;
