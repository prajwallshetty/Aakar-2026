import React from "react";

/* ─── palette ─────────────────────────────────────────────────── */
export const P = {
  yellow:  "#ffff00",
  yellow2: "#fff500",
  magenta: "#ff00ff",
  cyan:    "#00ffff",
  hot:     "#ff0066",
  black:   "#0a0005",
  white:   "#ffffff",
} as const;

/* ─── pre-computed math (identical on server + client) ────────── */
function buildStarburstPath(
  cx: number, cy: number,
  outerR: number, innerR: number,
  spikes = 18,
): string {
  let d = "";
  for (let i = 0; i < spikes * 2; i++) {
    const r   = i % 2 === 0 ? outerR : innerR;
    const ang = (Math.PI / spikes) * i - Math.PI / 2;
    const x   = Math.round((cx + r * Math.cos(ang)) * 1e4) / 1e4;
    const y   = Math.round((cy + r * Math.sin(ang)) * 1e4) / 1e4;
    d += (i === 0 ? "M" : "L") + `${x},${y}`;
  }
  return d + "Z";
}

export const BURST_TL  = buildStarburstPath(0,    0,    130, 80,  18);
export const BURST_TR  = buildStarburstPath(9999, 0,    110, 70,  18);
export const BURST_BL  = buildStarburstPath(0,    9999, 120, 75,  18);
export const BURST_BR  = buildStarburstPath(9999, 9999, 130, 82,  18);
export const BURST_CTR = buildStarburstPath(0,    0,    260, 160, 24);

export const SPEED_LINES = Array.from({ length: 48 }, (_, i) => {
  const r = ((360 / 48) * i * Math.PI) / 180;
  return {
    x2: Math.round((50 + 80 * Math.cos(r)) * 1e4) / 1e4,
    y2: Math.round((50 + 80 * Math.sin(r)) * 1e4) / 1e4,
  };
});

/* ─── keyframes (import once in your global CSS instead if preferred) ── */
export const POP_ART_KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');
  @keyframes floatShape {
    0%,100% { transform:translateY(0) rotate(0deg); }
    33%     { transform:translateY(-14px) rotate(6deg); }
    66%     { transform:translateY(-6px)  rotate(-4deg); }
  }
  @keyframes stampWiggle {
    0%,100% { transform:rotate(var(--r)) scale(1); }
    50%     { transform:rotate(calc(var(--r)*-0.6)) scale(1.06); }
  }
`;

/* ═══════════════════════════════════════════════════════════════ */
export default function PopArtBackground() {
  return null;
}