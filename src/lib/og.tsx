/* Shared layout for Open Graph images (rendered by next/og at build time).
   Satori can't read CSS variables, so this uses literal colours from the coral theme. */

export const OG_SIZE = { width: 1200, height: 630 };

const CHIP_COLORS = ["#ffd9dc", "#d6f08a", "#cfe5ff", "#ffb68f"];

export function OgCard({ eyebrow, title, subtitle, chips }: { eyebrow: string; title: string; subtitle: string; chips: string[] }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "linear-gradient(135deg, #fff1ec 0%, #ffe2cc 45%, #ffd9dc 100%)",
        color: "#241915",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: "linear-gradient(135deg, #ffb07a, #ff6f7d)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 800,
            color: "#2e0d00",
          }}
        >
          +
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>MINI TOOLS</div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            padding: "10px 22px",
            borderRadius: 999,
            background: "#2c2523",
            color: "#fcede8",
            fontSize: 24,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>{title}</div>
        <div style={{ fontSize: 32, color: "#574239", lineHeight: 1.35, maxWidth: 980 }}>{subtitle}</div>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {chips.map((c, i) => (
          <div
            key={c}
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: 999,
              background: CHIP_COLORS[i % CHIP_COLORS.length],
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
