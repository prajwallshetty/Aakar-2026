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
  return (
    <>
      {/* 1 — diagonal stripes */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `repeating-linear-gradient(45deg,${P.yellow} 0px,${P.yellow} 18px,${P.yellow2} 18px,${P.yellow2} 36px)`,
        }}
      />

      {/* 2 — halftone dots */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: `radial-gradient(circle,rgba(0,0,0,0.18) 1.8px,transparent 1.8px)`,
          backgroundSize: "14px 14px",
        }}
      />

      {/* 3 — radial speed lines */}
      <svg
        aria-hidden
        style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:2,pointerEvents:"none",opacity:0.07 }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        {SPEED_LINES.map((pt, i) => (
          <line key={i} x1="50" y1="50" x2={pt.x2} y2={pt.y2} stroke={P.black} strokeWidth="0.3" />
        ))}
      </svg>

      {/* 4 — corner triangle blocks */}
      <svg aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:3,pointerEvents:"none" }}>
        <polygon points="0,0 180,0 0,160"                                           fill={P.magenta} opacity="0.28" />
        <polygon points="100%,0 calc(100% - 180px),0 100%,160"                      fill={P.cyan}    opacity="0.28" />
        <polygon points="0,100% 160,100% 0,calc(100% - 140px)"                      fill={P.hot}     opacity="0.26" />
        <polygon points="100%,100% calc(100% - 160px),100% 100%,calc(100% - 140px)" fill={P.magenta} opacity="0.26" />
      </svg>

      {/* 5 — corner starbursts */}
      <svg aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:4,pointerEvents:"none" }}>
        <path d={BURST_TL} fill={P.magenta} opacity="0.22" />
        <path d={BURST_TR} fill={P.cyan}    opacity="0.22" transform="translate(-9999,0)" />
        <path d={BURST_BL} fill={P.hot}     opacity="0.20" transform="translate(0,-9999)" />
        <path d={BURST_BR} fill={P.magenta} opacity="0.22" transform="translate(-9999,-9999)" />
      </svg>

      {/* 6 — floating shapes */}
      {([
        { top:"12%", left:"1.5%",  color:P.magenta, circle:true,  delay:"0s"   },
        { top:"30%", right:"1.5%", color:P.cyan,    circle:false, delay:"0.8s" },
        { top:"55%", left:"1.2%",  color:P.yellow,  circle:false, delay:"1.4s" },
        { top:"72%", right:"1.2%", color:P.hot,     circle:true,  delay:"2.0s" },
        { top:"42%", left:"1.8%",  color:P.cyan,    circle:true,  delay:"2.6s" },
        { top:"85%", right:"1.5%", color:P.magenta, circle:false, delay:"1.1s" },
      ] as const).map((s, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top: s.top,
            left:  (s as any).left,
            right: (s as any).right,
            width: 26, height: 26,
            borderRadius: s.circle ? "50%" : 4,
            transform: s.circle ? undefined : "rotate(45deg)",
            background: s.color,
            border: `2.5px solid ${P.black}`,
            boxShadow: `3px 3px 0 ${P.black}`,
            animation: `floatShape 4s ease-in-out infinite`,
            animationDelay: s.delay,
            opacity: 0.8, zIndex: 5, pointerEvents: "none",
          }}
        />
      ))}

      {/* 7 — comic word stamps */}
      {([
        { text:"POW!",  top:"9%",    left:"3%",   rot:-12, color:P.magenta },
        { text:"ZAP!",  top:"6%",    right:"4%",  rot: 10, color:P.cyan    },
        { text:"WOW!",  bottom:"8%", left:"4%",   rot: -8, color:P.hot     },
        { text:"BOOM!", bottom:"6%", right:"3%",  rot: 14, color:P.yellow  },
      ] as const).map((s, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top:    (s as any).top,
            bottom: (s as any).bottom,
            left:   (s as any).left,
            right:  (s as any).right,
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(1.6rem,4vw,2.8rem)",
            letterSpacing: "0.06em",
            color: s.color,
            WebkitTextStroke: `2px ${P.black}`,
            transform: `rotate(${s.rot}deg)`,
            animation: `stampWiggle 3s ease-in-out infinite`,
            "--r": `${s.rot}deg`,
            opacity: 0.5, zIndex: 5, pointerEvents: "none", userSelect: "none",
          } as React.CSSProperties}
        >
          {s.text}
        </div>
      ))}
    </>
  );
}