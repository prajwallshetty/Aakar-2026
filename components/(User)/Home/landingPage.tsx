"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const C = {
  yellow: "#FFE600",
  magenta: "#FF00CC",
  cyan: "#00F5FF",
  hot: "#FF2D6B",
  lime: "#BCFF00",
  black: "#05000E",
  white: "#FFFFFF",
};

/* ── SSR-safe geometry ──────────────────────────────────────── */
function makeBurst(cx: number, cy: number, R: number, r: number, n: number) {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / n) * i - Math.PI / 2;
    const x = Math.round((cx + rad * Math.cos(a)) * 1e4) / 1e4;
    const y = Math.round((cy + rad * Math.sin(a)) * 1e4) / 1e4;
    d += (i === 0 ? "M" : "L") + `${x},${y}`;
  }
  return d + "Z";
}

const BA = makeBurst(50, 50, 47, 30, 22);
const BB = makeBurst(50, 50, 34, 22, 16);
const BC = makeBurst(50, 50, 26, 16, 12);

const LINES = Array.from({ length: 18 }, (_, i) => {
  const a = ((360 / 18) * i * Math.PI) / 180;
  return {
    x2: Math.round((50 + 86 * Math.cos(a)) * 1e4) / 1e4,
    y2: Math.round((50 + 86 * Math.sin(a)) * 1e4) / 1e4,
  };
});

/* ═══════════════════════════════════════════════════════════ */
export default function LandingHero() {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const sp = { stiffness: 45, damping: 18, mass: 1 };
  const mx = useSpring(rawX, sp);
  const my = useSpring(rawY, sp);

  const d0x = useTransform(mx, [0, 1], [-25, 25]);
  const d0y = useTransform(my, [0, 1], [-15, 15]);
  const d1x = useTransform(mx, [0, 1], [-45, 45]);
  const d1y = useTransform(my, [0, 1], [-25, 25]);
  const d2x = useTransform(mx, [0, 1], [-18, 18]);
  const d2y = useTransform(my, [0, 1], [-12, 12]);
  const dTitleX = useTransform(mx, [0, 1], [25, -25]);
  const dTitleY = useTransform(my, [0, 1], [15, -15]);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width);
    rawY.set((e.clientY - r.top) / r.height);
  }
  function onLeave() { rawX.set(0.5); rawY.set(0.5); }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');

        /* scanlines */
        .hl-root::after {
          content:""; position:absolute; inset:0; pointer-events:none; z-index:99;
          background:repeating-linear-gradient(
            0deg, transparent 0, transparent 3px,
            rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px
          );
        }

        @keyframes sCW     { to{ transform:rotate(360deg);  } }
        @keyframes sCCW    { to{ transform:rotate(-360deg); } }
        @keyframes sTick   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes sFloat  {
          0%,100%{ transform:translateY(0) scale(1) rotate(0deg); }
          50%    { transform:translateY(-18px) scale(1.02) rotate(1.5deg); }
        }
        @keyframes sAurora {
          0%,100%{ opacity:.55; transform:translate(-50%,-50%) scale(1)    rotate(0deg);  }
          33%    { opacity:.72; transform:translate(-50%,-50%) scale(1.08)  rotate(3deg); }
          66%    { opacity:.58; transform:translate(-50%,-50%) scale(0.95)  rotate(-2deg);}
        }
        @keyframes sPulse  {
          0%  { transform:translate(-50%,-50%) scale(0.85); opacity:.5; }
          100%{ transform:translate(-50%,-50%) scale(1.38); opacity:0;  }
        }
        @keyframes sChroma {
          0%,100%{
            filter:brightness(1.22) saturate(1.4) contrast(1.1)
              drop-shadow(0 0 28px ${C.cyan}AA) drop-shadow(0 0 12px ${C.magenta}88);
          }
          50%{
            filter:brightness(1.26) saturate(1.45) contrast(1.14)
              drop-shadow(0 0 40px ${C.magenta}CC) drop-shadow(0 0 16px ${C.cyan}66);
          }
        }
        @keyframes sStamp  {
          0%  { opacity:0; transform:scale(2.2) rotate(-20deg); }
          65% { opacity:1; transform:scale(0.93) rotate(4deg);  }
          100%{ opacity:1; transform:scale(1) rotate(0deg);     }
        }
        @keyframes sDiamond {
          0%,100%{ transform:rotate(45deg) translateY(0);     }
          50%    { transform:rotate(45deg) translateY(-10px); }
        }
        @keyframes sBadge  {
          0%,100%{ box-shadow:4px 4px 0 ${C.black},0 0 0 ${C.hot};     }
          50%    { box-shadow:4px 4px 0 ${C.black},0 0 20px ${C.hot}99; }
        }
        @keyframes sFlare  {
          0%,100%{ opacity:.12; transform:translate(-50%,-50%) scale(1);    }
          50%    { opacity:.22; transform:translate(-50%,-50%) scale(1.14); }
        }
        @keyframes sGridMove {
          from{ background-position:0 0;       }
          to  { background-position:64px 64px; }
        }
        @keyframes sLogoFloat {
          0%,100%{ transform:translateY(0) rotate(-1deg);  }
          50%    { transform:translateY(-8px) rotate(1deg); }
        }

        /* ── AAKAR title glitch ── */
        @keyframes sTitleGlitch {
          0%,78%,100% {
            text-shadow: 8px 8px 0 ${C.black}, 14px 14px 0 ${C.hot};
            transform: skewX(0deg) translate(0,0);
          }
          79% {
            text-shadow: -15px 0 0 ${C.cyan}, 15px 0 0 ${C.magenta}, 8px 8px 0 ${C.black};
            transform: skewX(-15deg) translate(-15px, 0);
            clip-path: inset(15% 0 60% 0);
          }
          80% {
            text-shadow: 20px 0 0 ${C.magenta}, -20px 0 0 ${C.cyan}, 8px 8px 0 ${C.black};
            transform: skewX(10deg) translate(20px, 5px);
            clip-path: inset(55% 0 8% 0);
          }
          81% {
            text-shadow: -10px 0 0 ${C.hot}, 10px 0 0 ${C.cyan}, 8px 8px 0 ${C.black};
            transform: skewX(-10deg) translate(-10px, -5px);
            clip-path: inset(30% 0 38% 0);
          }
          82%,83% {
            text-shadow: 8px 8px 0 ${C.black}, 14px 14px 0 ${C.hot};
            transform: skewX(0deg) translate(0,0);
            clip-path: none;
            filter: brightness(2);
          }
          84% {
            text-shadow: 25px 0 0 ${C.cyan}, -25px 0 0 ${C.magenta}, 8px 8px 0 ${C.black};
            transform: skewX(15deg) translate(25px, 0);
            clip-path: inset(0 0 72% 0);
          }
          85%,86% {
            text-shadow: 8px 8px 0 ${C.black}, 14px 14px 0 ${C.hot};
            transform: skewX(0deg) translate(0,0);
            clip-path: none;
            filter: brightness(1);
          }
        }
        @keyframes sTitleTop {
          0%,78%,87%,100%{ opacity:0; }
          79%{ opacity:1; clip-path:inset(0 0 72% 0); transform:translate(30px,0); filter:hue-rotate(90deg) brightness(2); color:${C.cyan}; }
          80%{ opacity:1; clip-path:inset(2% 0 68% 0); transform:translate(-25px,0); color:${C.magenta}; filter:brightness(1.5); }
          81%,82%{ opacity:0; }
          84%{ opacity:1; clip-path:inset(0 0 65% 0); transform:translate(35px,-5px); filter:brightness(2.5); color:${C.hot}; }
          85%,86%{ opacity:0; }
        }
        @keyframes sTitleBot {
          0%,78%,87%,100%{ opacity:0; }
          79%{ opacity:1; clip-path:inset(68% 0 0 0); transform:translate(-30px,0); filter:hue-rotate(-90deg) brightness(2); color:${C.magenta}; }
          80%{ opacity:1; clip-path:inset(65% 0 2% 0); transform:translate(25px,0); color:${C.cyan}; filter:brightness(1.5); }
          81%,82%{ opacity:0; }
          84%{ opacity:1; clip-path:inset(70% 0 0 0); transform:translate(-35px,5px); filter:brightness(2.5); color:${C.yellow}; }
          85%,86%{ opacity:0; }
        }
        @keyframes sTitleIn {
          0%  { opacity:0; transform:skewX(-8deg) translateY(-30px) scale(0.9); }
          100%{ opacity:1; transform:skewX(0deg)  translateY(0)      scale(1);  }
        }

        .title-glitch     { animation: sTitleGlitch 5s ease-in-out infinite; }
        .title-clone-top  { animation: sTitleTop    5s ease-in-out infinite; }
        .title-clone-bot  { animation: sTitleBot    5s ease-in-out infinite; }

        /* ── glitch animation for side logo ── */
        @keyframes sGlitch {
          0%,82%,100% {
            clip-path: none;
            transform: translate(0,0) skewX(0deg);
            filter: drop-shadow(0 0 10px ${C.cyan}88);
          }
          83% {
            clip-path: inset(12% 0 65% 0);
            transform: translate(-6px, 0) skewX(-4deg);
            filter: drop-shadow(4px 0 0 ${C.cyan}) drop-shadow(-4px 0 0 ${C.magenta});
          }
          85% {
            clip-path: inset(55% 0 10% 0);
            transform: translate(7px, 0) skewX(3deg);
            filter: drop-shadow(-4px 0 0 ${C.cyan}) drop-shadow(4px 0 0 ${C.hot});
          }
          87% {
            clip-path: inset(28% 0 42% 0);
            transform: translate(-4px, 2px) skewX(-2deg);
            filter: drop-shadow(4px 0 0 ${C.magenta}) drop-shadow(-3px 0 0 ${C.cyan});
          }
          89% {
            clip-path: inset(70% 0 5% 0);
            transform: translate(5px, -2px) skewX(4deg);
            filter: drop-shadow(-5px 0 0 ${C.hot}) drop-shadow(3px 0 0 ${C.cyan});
          }
          91% {
            clip-path: inset(5% 0 80% 0);
            transform: translate(-3px, 1px) skewX(-1deg);
            filter: drop-shadow(3px 0 0 ${C.yellow}) drop-shadow(-3px 0 0 ${C.magenta});
          }
          93%,94% {
            clip-path: none;
            transform: translate(0,0) skewX(0deg);
            filter: drop-shadow(0 0 18px ${C.magenta}CC) brightness(1.4);
          }
          95% {
            clip-path: inset(40% 0 35% 0);
            transform: translate(8px, 0) skewX(5deg);
            filter: drop-shadow(-6px 0 0 ${C.cyan}) drop-shadow(4px 0 0 ${C.hot});
          }
          97% {
            clip-path: none;
            transform: translate(0,0) skewX(0deg);
            filter: drop-shadow(0 0 10px ${C.cyan}88);
          }
        }

        /* ghost layers for the glitch clones */
        @keyframes sGlitchTop {
          0%,82%,100%{ opacity:0; }
          83%{ opacity:1; clip-path:inset(0 0 75% 0); transform:translate(8px,0); filter:hue-rotate(90deg) brightness(1.5); }
          85%{ opacity:1; clip-path:inset(5% 0 70% 0); transform:translate(-6px,0); }
          87%,88%{ opacity:0; }
          89%{ opacity:1; clip-path:inset(2% 0 72% 0); transform:translate(10px,1px); filter:hue-rotate(180deg); }
          91%{ opacity:0; }
          95%{ opacity:1; clip-path:inset(0 0 68% 0); transform:translate(-8px,-1px); filter:brightness(1.6); }
          97%{ opacity:0; }
        }
        @keyframes sGlitchBot {
          0%,82%,100%{ opacity:0; }
          83%{ opacity:1; clip-path:inset(70% 0 0 0); transform:translate(-8px,0); filter:hue-rotate(-90deg) brightness(1.5); }
          85%{ opacity:1; clip-path:inset(65% 0 2% 0); transform:translate(6px,0); }
          87%,88%{ opacity:0; }
          89%{ opacity:1; clip-path:inset(72% 0 0 0); transform:translate(-10px,1px); }
          91%{ opacity:0; }
          95%{ opacity:1; clip-path:inset(68% 0 0 0); transform:translate(8px,-1px); filter:brightness(1.6); }
          97%{ opacity:0; }
        }
        @keyframes sGlitchScan {
          0%,82%,100%{ opacity:0; }
          83%,97%{ opacity:1; background:linear-gradient(90deg,transparent,${C.cyan}22,transparent); transform:translateY(-100%); animation-timing-function:linear; }
          93%{ transform:translateY(200%); }
          94%,96%{ opacity:0; }
        }

        .logo-glitch       { animation: sGlitch    4.5s ease-in-out infinite; }
        .logo-glitch-top   { animation: sGlitchTop 4.5s ease-in-out infinite; }
        .logo-glitch-bot   { animation: sGlitchBot 4.5s ease-in-out infinite; }

        .cw    { animation:sCW   26s linear infinite; }
        .cw2   { animation:sCW   40s linear infinite; }
        .ccw   { animation:sCCW  19s linear infinite; }
        .chroma{ animation:sChroma 4s ease-in-out infinite; }
        .floatMe{ animation:sFloat 4.5s ease-in-out infinite; }
        .stamp { animation:sStamp 0.6s cubic-bezier(.23,1.5,.6,1) both; }

        @media (hover:none) {
          .parallax-layer { transform:none !important; }
        }

        @media (max-width:480px) {
          .stamps-hide { display:none; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
          .char-responsive { width: clamp(300px, 85vw, 500px) !important; }
          .cta-responsive { margin-top: clamp(-60px, -8vh, -40px) !important; transform: scale(0.85); }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
          .char-responsive { width: clamp(200px, 45vw, 500px); }
          .cta-responsive { margin-top: clamp(-45px, -5vh, -25px); }
        }
      `}</style>

      <section
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="hl-root"
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          minHeight: 600,
          overflow: "hidden",
          background: C.black,
          cursor: "crosshair",
          isolation: "isolate",
        }}
      >

        {/* ═══════════ Z:1 DEEP BACKGROUND ═══════════ */}
        <motion.div aria-hidden className="parallax-layer"
          style={{ x: d0x, y: d0y, position: "absolute", inset: "-4%", zIndex: 1, pointerEvents: "none" }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse 120% 100% at 50% 50%, #200048 0%, ${C.black} 62%),
              radial-gradient(ellipse 55% 42% at 15% 25%, ${C.magenta}45 0%, transparent 52%),
              radial-gradient(ellipse 50% 55% at 85% 68%, ${C.cyan}40 0%, transparent 50%),
              radial-gradient(ellipse 45% 38% at 60% 92%, ${C.hot}2E 0%, transparent 46%),
              radial-gradient(ellipse 38% 32% at 28% 82%, #6600BB44 0%, transparent 48%)
            `,
          }} />
          {/* animated moving grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.07,
            backgroundImage: `
              linear-gradient(${C.cyan}66 1px, transparent 1px),
              linear-gradient(90deg, ${C.cyan}66 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            animation: "sGridMove 8s linear infinite",
          }} />
          {/* diagonal golden streaks */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.07,
            backgroundImage: `repeating-linear-gradient(
              -52deg, ${C.yellow} 0, ${C.yellow} 1px, transparent 1px, transparent 56px
            )`,
          }} />
          {/* floor glow */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
            background: `linear-gradient(to top, ${C.magenta}32 0%, ${C.cyan}14 38%, transparent 100%)`,
          }} />
          {/* horizontal scan lines */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.07,
            backgroundImage: `repeating-linear-gradient(
              180deg, transparent 0, transparent 40px, ${C.cyan}22 40px, ${C.cyan}22 41px
            )`,
          }} />
        </motion.div>

        {/* ═══════════ Z:2 AURORA BLOBS ═══════════ */}
        <motion.div aria-hidden className="parallax-layer"
          style={{ x: d1x, y: d1y, position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
        >
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: "min(120vw,1000px)", height: "min(88vw,720px)",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.magenta}34 0%, ${C.cyan}1C 38%, transparent 65%)`,
            filter: "blur(52px)",
            animation: "sAurora 7s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: "72%", left: "50%",
            width: "min(80vw,640px)", height: "min(40vw,340px)",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.hot}28 0%, ${C.magenta}14 45%, transparent 70%)`,
            filter: "blur(40px)",
            animation: "sFlare 5s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: "18%", left: "50%",
            width: "min(60vw,520px)", height: "min(30vw,260px)",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.cyan}20 0%, transparent 65%)`,
            filter: "blur(32px)",
            animation: "sFlare 6s ease-in-out infinite",
            animationDelay: "2s",
          }} />
        </motion.div>

        {/* ═══════════ Z:3 SPEED LINES ═══════════ */}
        <motion.div aria-hidden className="parallax-layer"
          style={{
            x: d1x, y: d1y, position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <div style={{ width: "min(100vw,900px)", height: "min(100vw,900px)", flexShrink: 0 }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: 0.12 }}>
              {LINES.map((l, i) => (
                <line key={i} x1="50" y1="50" x2={l.x2} y2={l.y2}
                  stroke={i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.magenta : C.yellow}
                  strokeWidth="0.4" />
              ))}
            </svg>
          </div>
        </motion.div>

        {/* ═══════════ Z:4 STARBURST RINGS ═══════════ */}
        <motion.div aria-hidden className="parallax-layer"
          style={{
            x: d1x, y: d1y, position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <div style={{ position: "relative", width: "min(92vw,820px)", height: "min(92vw,820px)", flexShrink: 0 }}>
            <div className="cw2" style={{ position: "absolute", inset: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <path d={BA} fill="none" stroke={C.yellow} strokeWidth="0.35" opacity="0.25" />
              </svg>
            </div>
            <div className="ccw" style={{ position: "absolute", inset: "14%" }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <path d={BB} fill={C.magenta} opacity="0.07" />
                <path d={BB} fill="none" stroke={C.cyan} strokeWidth="0.5" opacity="0.3" />
              </svg>
            </div>
            <div className="cw" style={{ position: "absolute", inset: "29%" }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <path d={BC} fill="none" stroke={C.hot} strokeWidth="0.55" opacity="0.22" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* ═══════════ Z:5 PULSE RINGS ═══════════ */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
          {[C.cyan, C.magenta, C.yellow].map((col, i) => (
            <div key={i} style={{
              position: "absolute", top: "50%", left: "50%",
              width: "min(68vw,580px)", height: "min(68vw,580px)",
              borderRadius: "50%",
              border: `1.5px solid ${col}`,
              opacity: 0,
              animation: `sPulse 3.8s ease-out infinite`,
              animationDelay: `${i * 1.26}s`,
            }} />
          ))}
        </div>

        {/* ═══════════ Z:6 HALFTONE HALO ═══════════ */}
        <motion.div aria-hidden className="parallax-layer"
          style={{
            x: d1x, y: d1y, position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <div style={{
            width: "min(70vw,620px)", height: "min(70vw,620px)", flexShrink: 0,
            borderRadius: "50%",
            backgroundImage: `radial-gradient(circle, ${C.yellow}3A 1.4px, transparent 1.4px)`,
            backgroundSize: "18px 18px",
            maskImage: "radial-gradient(circle, transparent 28%, black 44%, transparent 76%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 28%, black 44%, transparent 76%)",
          }} />
        </motion.div>

        {/* ═══════════ Z:7 CORNER DECOR + STAMPS ═══════════ */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none" }}>
          {/* corner brackets */}
          {[
            { t: 20, l: 20, rot: 0, col: C.cyan },
            { t: 20, r: 20, rot: 90, col: C.magenta },
            { b: 24, l: 20, rot: 270, col: C.hot },
            { b: 24, r: 20, rot: 180, col: C.yellow },
          ].map((c, i) => (
            <svg key={i} width="44" height="44" viewBox="0 0 44 44" style={{
              position: "absolute",
              top: (c as any).t, bottom: (c as any).b,
              left: (c as any).l, right: (c as any).r,
              transform: `rotate(${c.rot}deg)`, opacity: 0.65,
            }}>
              <polyline points="0,28 0,0 28,0" fill="none"
                stroke={c.col} strokeWidth="2.5" strokeLinecap="square" />
            </svg>
          ))}

          {/* floating diamonds */}
          {[
            { top: "20%", left: "6%", s: 11, col: C.lime, d: "0s" },
            { top: "24%", right: "7%", s: 8, col: C.magenta, d: "0.7s" },
            { top: "50%", left: "3%", s: 7, col: C.hot, d: "1.4s" },
            { top: "56%", right: "4%", s: 9, col: C.cyan, d: "2.1s" },
            { bottom: "26%", left: "7%", s: 10, col: C.yellow, d: "1.0s" },
            { bottom: "20%", right: "6%", s: 12, col: C.lime, d: "1.7s" },
          ].map((s, i) => (
            <div key={i} style={{
              position: "absolute",
              top: (s as any).top, bottom: (s as any).bottom,
              left: (s as any).left, right: (s as any).right,
              width: s.s, height: s.s,
              background: s.col,
              border: `1.5px solid ${C.black}`,
              boxShadow: `2px 2px 0 ${C.black}`,
              animation: `sDiamond 3.5s ease-in-out infinite`,
              animationDelay: s.d,
            }} />
          ))}

          {/* word stamps — hidden on very small screens */}
          <div className="stamps-hide">
            {[
              { text: "POW!", top: "9%", left: "5%", rot: -13, col: C.hot },
              { text: "ZAP!", top: "7%", right: "5%", rot: 11, col: C.cyan },
              { text: "EPIC!", bottom: "14%", left: "5%", rot: -7, col: C.lime },
              { text: "WOW!", bottom: "12%", right: "5%", rot: 9, col: C.magenta },
            ].map((s, i) => (
              <div key={i} className="stamp" style={{
                position: "absolute",
                top: (s as any).top, bottom: (s as any).bottom,
                left: (s as any).left, right: (s as any).right,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(1rem,2.5vw,1.8rem)",
                letterSpacing: "0.06em",
                color: s.col,
                WebkitTextStroke: `1.5px ${C.black}`,
                textShadow: `3px 3px 0 ${C.black}`,
                transform: `rotate(${s.rot}deg)`,
                animationDelay: `${0.3 + i * 0.15}s`,
                opacity: 0.6, userSelect: "none",
              }}>{s.text}</div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            Z:20  MAIN CONTENT  (logo · char · cta)
            All stacked in one flex column, centered
        ═══════════════════════════════════════════ */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          paddingTop: "clamp(0px,2vh,20px)",
          paddingBottom: "clamp(40px,7vh,60px)", /* leave room for ticker */
          gap: 0,
          pointerEvents: "none",
        }}>

          {/* ── CHARACTER ── */}
          <motion.div
            className="floatMe parallax-layer"
            style={{
              x: d2x, y: d2y,
              marginTop: 0,
              pointerEvents: "auto",
            }}
            initial={{ opacity: 0, scale: 0.86, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1.2, 0.5, 1], delay: 0.18 }}
          >
            <div style={{ position: "relative" }}>
              {/* halo */}
              <div style={{
                position: "absolute", inset: "-30% -30%",
                borderRadius: "50%",
                background: `radial-gradient(ellipse, ${C.magenta}25 0%, ${C.cyan}1A 40%, transparent 70%)`,
                filter: "blur(20px)",
                pointerEvents: "none",
              }} />

              <div className="chroma char-responsive" style={{
                position: "relative",
                aspectRatio: "1/1",
                marginBottom: 0,
                filter: `drop-shadow(0 0 20px ${C.magenta}66)`
              }}>
                {/* Mobile-only background logo */}
                <div className="mobile-only" style={{
                  position: "absolute",
                  top: "3%", left: "50%",
                  width: "140%",
                  aspectRatio: "1/1",
                  zIndex: -1,
                  opacity: 0.6,
                  pointerEvents: "none"
                }}>
                  <div style={{ width: "100%", height: "100%", transform: "translate(-50%, -50%)" }}>
                    <div className="logo-glitch" style={{ width: "100%", height: "100%", position: "relative" }}>
                      <Image
                        src="/ak26-logo.png"
                        alt=""
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </div>

                <Image
                  src="/ak26.png"
                  alt="AAKAR 2026 mascot"
                  fill priority
                  style={{ objectFit: "contain", objectPosition: "center bottom" }}
                />
              </div>
            </div>
          </motion.div>

          {/* ── CTA — TWO SEPARATE ELEMENTS ── */}
          <motion.div
            className="cta-responsive"
            style={{
              pointerEvents: "auto",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 10,
              position: "relative",
              zIndex: 30,
            }}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.6 }}
          >
            {/* date badge — standalone, no shared border with button */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: C.hot,
              border: `3px solid ${C.black}`,
              boxShadow: `5px 5px 0 ${C.black}`,
              padding: "8px 28px",
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(0.9rem,1.9vw,1.1rem)",
              letterSpacing: "0.28em",
              color: C.white,
              animation: "sBadge 2.5s ease-in-out infinite",
              whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: "0.7em", opacity: 0.8 }}>★</span>
              APR 24,25,26, 2026
              <span style={{ fontSize: "0.7em", opacity: 0.8 }}>★</span>
            </div>

            {/* CTA button — fully independent element */}
            <motion.a
              href="/events"
              whileHover={{
                y: -6,
                boxShadow: `10px 10px 0 ${C.black}, 18px 18px 0 ${C.magenta}`,
              }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background: C.yellow,
                border: `3px solid ${C.black}`,
                boxShadow: `8px 8px 0 ${C.black}, 14px 14px 0 ${C.magenta}`,
                padding: "clamp(14px,2.5vh,20px) clamp(36px,6vw,64px)",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(1.2rem,2.8vw,1.6rem)",
                letterSpacing: "0.22em",
                color: C.black,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.14s ease",
                whiteSpace: "nowrap",
              }}
            >
              EXPLORE EVENTS
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: C.black, color: C.yellow,
                width: "1.8em", height: "1.8em",
                fontSize: "0.9em",
                marginLeft: 6,
              }}>→</span>
            </motion.a>
          </motion.div>

        </div>

        {/* ═══════════ Z:19 BACKGROUND GLITCH TITLE ═══════════ */}
        <div className="desktop-only" style={{
          position: "absolute",
          top: "28%", left: 0, right: 0,
          transform: "translateY(-50%)",
          zIndex: 19,
          pointerEvents: "none",
        }}>
          <motion.div
            className="parallax-layer"
            style={{ x: dTitleX, y: dTitleY, display: "flex", justifyContent: "center" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.23, 1.3, 0.5, 1] }}
          >
            {/* wrapper so clones sit on top */}
            <div style={{ position: "relative", display: "inline-block", lineHeight: 1 }}>

              {/* clone TOP */}
              <div className="title-clone-top" style={{
                position: "absolute", inset: 0,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(6rem, 20vw, 18rem)",
                letterSpacing: "0.06em",
                color: C.cyan,
                WebkitTextStroke: `2px ${C.black}`,
                whiteSpace: "nowrap",
                opacity: 0,
                userSelect: "none",
              }}>AAKAR</div>

              {/* clone BOT */}
              <div className="title-clone-bot" style={{
                position: "absolute", inset: 0,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(6rem, 20vw, 18rem)",
                letterSpacing: "0.06em",
                color: C.magenta,
                WebkitTextStroke: `2px ${C.black}`,
                whiteSpace: "nowrap",
                opacity: 0,
                userSelect: "none",
              }}>AAKAR</div>

              {/* BASE title */}
              <h1 className="title-glitch" style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(6rem, 20vw, 18rem)",
                letterSpacing: "0.06em",
                color: C.yellow,
                WebkitTextStroke: `4px ${C.black}`,
                textShadow: `8px 8px 0 ${C.black}, 14px 14px 0 ${C.hot}`,
                margin: 0,
                whiteSpace: "nowrap",
                position: "relative", zIndex: 2,
              }}>AAKAR</h1>

            </div>
          </motion.div>
        </div>

        {/* ═══════════ Z:25 LEFT-SIDE LOGO ═══════════ */}
        <motion.div
          className="desktop-only"
          style={{
            position: "absolute",
            left: "clamp(100px, 16vw, 200px)",
            top: "50%",
            zIndex: 25,
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.23, 1.3, 0.5, 1] }}
        >
          {/* outer container — vertical orientation */}
          <div style={{
            position: "relative",
            width: "clamp(150px, 14vw, 160px)",
            transform: "translateY(-50%)",
          }}>

            {/* subtle neon frame behind logo */}
            <div style={{
              position: "absolute",
              inset: "-6px",
              border: `1.5px solid ${C.cyan}44`,
              boxShadow: `0 0 12px ${C.cyan}33, inset 0 0 8px ${C.magenta}22`,
            }} />

            {/* scan-line sweep over the logo */}
            <div style={{
              position: "absolute", inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 3,
            }}>
              <div style={{
                position: "absolute", left: 0, right: 0, height: "30%",
                background: `linear-gradient(180deg, transparent, ${C.cyan}18, transparent)`,
                animation: "sGlitchScan 4.5s ease-in-out infinite",
              }} />
            </div>

            {/* BASE logo */}
            <div
              className="logo-glitch"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1/1",
                zIndex: 2,
              }}
            >
              <Image
                src="/ak26-logo.png"
                alt="Aakar 2026"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* TOP glitch clone */}
            <div
              className="logo-glitch-top"
              style={{
                position: "absolute", inset: 0,
                width: "100%", aspectRatio: "1/1",
                zIndex: 4, pointerEvents: "none",
                opacity: 0,
              }}
            >
              <Image
                src="/ak26-logo.png"
                alt=""
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* BOTTOM glitch clone */}
            <div
              className="logo-glitch-bot"
              style={{
                position: "absolute", inset: 0,
                width: "100%", aspectRatio: "1/1",
                zIndex: 4, pointerEvents: "none",
                opacity: 0,
              }}
            >
              <Image
                src="/ak26-logo.png"
                alt=""
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* label below */}
            <div style={{
              marginTop: 6,
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: "clamp(0.38rem, 0.7vw, 0.52rem)",
              letterSpacing: "0.22em",
              color: C.cyan,
              textAlign: "center",
              opacity: 0.7,
              textTransform: "uppercase",
            }}>AAKAR&nbsp;'26</div>

          </div>
        </motion.div>

        {/* ═══════════ Z:35 SCROLL DOWN INDICATOR ═══════════ */}
        <div style={{
          position: "absolute",
          bottom: "100px",
          left: 0,
          right: 0,
          zIndex: 35,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}>
          <motion.div
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              color: C.cyan,
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
              pointerEvents: "auto",
              opacity: 0.8,
              textShadow: `0 0 10px ${C.cyan}88`,
            }}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <span>SCROLL</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.div>
        </div>

        {/* ═══════════ Z:40 TICKER ═══════════ */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          zIndex: 40, height: 48,
          background: C.magenta,
          borderTop: `4px solid ${C.black}`,
          overflow: "hidden",
          display: "flex", alignItems: "center",
        }}>
          <div style={{
            display: "flex", whiteSpace: "nowrap",
            animation: "sTick 16s linear infinite",
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "1.25rem", letterSpacing: "0.28em", color: C.black,
          }}>
            {[0, 1].map(i => (
              <span key={i} style={{ paddingRight: "2rem", paddingTop: "4px" }}>
                {"★ AAKAR 2026  ·  BRAINS  ·  GUTS  ·  GLORY  ·  MGIT MANGALURU  ·  AURORAS OF ADVENTURE  ·  ".repeat(6)}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════ Z:90 VIGNETTE ═══════════ */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 90, pointerEvents: "none",
          background: `radial-gradient(ellipse 88% 88% at 50% 50%, transparent 36%, ${C.black}C4 100%)`,
        }} />

      </section>
    </>
  );
}