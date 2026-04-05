"use client";

import { useEffect, useState, useRef } from "react";

export default function SharinganLoader({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "spinning" | "done">("closed");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const DURATION = 3200; // total loading ms

  useEffect(() => {
    // Start opening eyelid after brief pause
    const t1 = setTimeout(() => setPhase("opening"), 400);
    const t2 = setTimeout(() => setPhase("spinning"), 1200);

    // Progress bar
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setPhase("done");
          setTimeout(() => onComplete?.(), 600);
        }, 200);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes irisRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pupilPulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.1); } }
        @keyframes outerPulse { 0%,100%{ opacity:0.3; } 50%{ opacity:0.65; } }
      `}</style>
      {/* Kanji rain */}
      <KanjiRain />

      {/* Center stack */}
      <div style={styles.center}>
        {/* Logo above eye */}
        <div style={{ ...styles.logoWrap, opacity: phase === "spinning" ? 1 : 0 }}>
          <img src="/aklogo.png" alt="Aakar" style={styles.logo} />
        </div>

        {/* Sharingan eye SVG */}
        <div style={styles.eyeWrap}>
          <SharinganSVG phase={phase} />
        </div>

        {/* Progress bar */}
        <div style={styles.barTrack}>
          <div style={{ ...styles.barFill, width: `${progress}%` }} />
          <div style={{ ...styles.barGlow, width: `${progress}%` }} />
        </div>
      </div>

      {/* Vignette */}
      <div style={styles.vignette} />
    </div>
  );
}

/* ---- Sharingan SVG ---- */
function SharinganSVG({ phase }: { phase: string }) {
  const spinning = phase === "spinning";
  const opening = phase === "opening" || spinning;

  return (
    <svg viewBox="0 0 500 500" style={styles.svg} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="irisG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7b0d0d" />
          <stop offset="45%" stopColor="#c0392b" />
          <stop offset="100%" stopColor="#1a0000" />
        </radialGradient>
        <radialGradient id="pupilG" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1a0000" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <radialGradient id="glowG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff2d2d" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff2d2d" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="bigGlow">
          <feGaussianBlur stdDeviation="22" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/*
          Eye shape path:
          Starts at left corner (22,250), curves UP to top arc peak (250,108),
          then curves to right corner (478,250),
          then curves DOWN along bottom arc back to left corner.
          Top arc is fuller/higher, bottom arc is slightly flatter — like a real eye.
        */}
        <clipPath id="eyeClip">
          <path d="
            M 22,250
            C 80,140 170,108 250,108
            C 330,108 420,140 478,250
            C 420,355 330,385 250,385
            C 170,385 80,355 22,250
            Z
          " />
        </clipPath>
      </defs>

      {/* Ambient outer glow */}
      <ellipse cx="250" cy="250" rx="240" ry="200"
        fill="url(#glowG)" filter="url(#bigGlow)"
        style={{ animation: spinning ? "outerPulse 2.8s ease-in-out infinite" : "none" }} />

      {/* Eye sclera — same eye path */}
      <path
        d="M 22,250 C 80,140 170,108 250,108 C 330,108 420,140 478,250 C 420,355 330,385 250,385 C 170,385 80,355 22,250 Z"
        fill="#0d0000"
      />

      <g clipPath="url(#eyeClip)">
        {/* Iris */}
        <circle cx="250" cy="250" r="138" fill="url(#irisG)" />

        {/* Iris ring details — spinning when active */}
        <g style={{
          transformOrigin: "250px 250px",
          animation: spinning ? "irisRotate 7s linear infinite" : "none"
        }}>
          <circle cx="250" cy="250" r="132" fill="none" stroke="#e74c3c" strokeWidth="1" strokeDasharray="7 5" opacity="0.5" />
          <circle cx="250" cy="250" r="118" fill="none" stroke="#c0392b" strokeWidth="1.5" strokeDasharray="12 7" opacity="0.35" />
          {[0, 45, 90, 135].map(deg => (
            <line key={deg}
              x1="250" y1="112" x2="250" y2="388"
              stroke="#7b0d0d" strokeWidth="0.6" opacity="0.35"
              style={{ transformOrigin: "250px 250px", transform: `rotate(${deg}deg)` }} />
          ))}
        </g>

        {/* Inner fill ring */}
        <circle cx="250" cy="250" r="92" fill="#8a0000" opacity="0.45" />
        <circle cx="250" cy="250" r="88" fill="none" stroke="#ff2d2d" strokeWidth="1.5" opacity="0.7" filter="url(#glow)" />

        {/* 3 Tomoe — orbit when spinning */}
        <g style={{
          transformOrigin: "250px 250px",
          animation: spinning ? "irisRotate 7s linear infinite" : "none"
        }}>
          <Tomoe angle={-90} />
          <Tomoe angle={30} />
          <Tomoe angle={150} />
        </g>

        {/* Orbit track */}
        <circle cx="250" cy="250" r="88" fill="none" stroke="#c0392b" strokeWidth="0.5" opacity="0.25" />

        {/* Pupil */}
        <circle cx="250" cy="250" r="50" fill="url(#pupilG)"
          style={{ animation: spinning ? "pupilPulse 2s ease-in-out infinite" : "none", transformOrigin: "250px 250px" }} />
        {/* Shine */}
        <ellipse cx="234" cy="234" rx="11" ry="7" fill="rgba(255,255,255,0.12)" transform="rotate(-20,234,234)" />
        {/* Center */}
        <circle cx="250" cy="250" r="7" fill="#000" filter="url(#glow)" />
      </g>

      {/* Eye outline border — same path, glowing */}
      <path
        d="M 22,250 C 80,140 170,108 250,108 C 330,108 420,140 478,250 C 420,355 330,385 250,385 C 170,385 80,355 22,250 Z"
        fill="none" stroke="#c0392b" strokeWidth="2.5" filter="url(#glow)"
      />

      {/* Eyelash accent lines at corners */}
      <path d="M22,250 C10,240 4,250 12,262" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      <path d="M478,250 C490,240 496,250 488,262" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>

      {/* Outer decorative ring */}
      <circle cx="250" cy="250" r="244" fill="none" stroke="#3a0000" strokeWidth="1" strokeDasharray="3 9" opacity="0.4"
        style={{ transformOrigin: "250px 250px", animation: spinning ? "irisRotate 25s linear infinite reverse" : "none" }} />

      {/* EYELIDS — shaped as eye path halves, slide away on open */}

      {/* Top lid: covers upper half of eye, slides up */}
      <path
        d="M 22,250 C 80,140 170,108 250,108 C 330,108 420,140 478,250 L 500,0 L 0,0 Z"
        fill="#000"
        style={{
          transformOrigin: "250px 250px",
          transition: "transform 0.95s cubic-bezier(0.4,0,0.2,1)",
          transform: opening ? "translateY(-100%)" : "translateY(0%)",
        }}
      />
      {/* Bottom lid: covers lower half of eye, slides down */}
      <path
        d="M 22,250 C 80,355 170,385 250,385 C 330,385 420,355 478,250 L 500,500 L 0,500 Z"
        fill="#000"
        style={{
          transformOrigin: "250px 250px",
          transition: "transform 0.95s cubic-bezier(0.4,0,0.2,1)",
          transform: opening ? "translateY(100%)" : "translateY(0%)",
        }}
      />

    </svg>
  );
}

/* ---- Single Tomoe ---- */
function Tomoe({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const r = 88;
  const cx = 250 + r * Math.cos(rad);
  const cy = 250 + r * Math.sin(rad);
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle + 90})`}>
      <circle r="16" fill="#0a0000" stroke="#c0392b" strokeWidth="1.5" />
      <path d="M0,-9 Q11,0 0,20 Q-11,0 0,-9Z" fill="#c0392b" transform="rotate(180)" />
      <circle r="7" fill="#c0392b" cy="-2" />
    </g>
  );
}

/* ---- Kanji Rain ---- */
const KANJI = "忍術幻術血輪眼写輪眼輪廻眼うちはサスケカカシイタチ暁鬼鮫柱間マダラナルト火影里";

type KanjiColData = { duration: number; delay: number; chars: string };

function KanjiRain() {
  const [cols, setCols] = useState<KanjiColData[]>([]);

  useEffect(() => {
    const count = Math.ceil(window.innerWidth / 36);
    setCols(
      Array.from({ length: count }, () => ({
        duration: 8 + Math.random() * 10,
        delay: -Math.random() * 14,
        chars: Array.from({ length: 28 }, () =>
          KANJI[Math.floor(Math.random() * KANJI.length)]
        ).join("\n"),
      }))
    );
  }, []);

  return (
    <div style={styles.kanjiLayer}>
      <style>{`@keyframes kanjiFall { from { transform: translateY(-100%); } to { transform: translateY(100vh); } }`}</style>
      {cols.map((col, i) => (
        <div
          key={i}
          style={{
            ...styles.kanjiCol,
            left: i * 36,
            animationDuration: `${col.duration}s`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {col.chars}
        </div>
      ))}
    </div>
  );
}

/* ---- Styles ---- */
const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "radial-gradient(ellipse at center, #1a0000 0%, #0a0000 40%, #000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, transparent 40%, #000 100%)",
    pointerEvents: "none",
  },
  kanjiLayer: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    opacity: 0.22,
    pointerEvents: "none",
  },
  kanjiCol: {
    position: "absolute",
    top: 0,
    fontFamily: "'Noto Serif JP', serif",
    fontSize: "1.3rem",
    color: "#e74c3c",
    whiteSpace: "pre",
    lineHeight: "2",
    animation: "kanjiFall linear infinite",
  },
  center: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  logoWrap: {
    transition: "opacity 0.8s ease",
  },
  logo: {
    height: 240,
    objectFit: "contain",
    filter: "drop-shadow(0 0 30px rgba(192,57,43,0.7))",
  },
  eyeWrap: {
    width: "min(420px, 80vw)",
    height: "min(420px, 80vw)",
  },
  svg: {
    width: "100%",
    height: "100%",
  },
  barTrack: {
    position: "relative",
    width: "min(320px, 70vw)",
    height: 2,
    background: "rgba(192,57,43,0.15)",
  },
  barFill: {
    position: "absolute",
    top: 0, left: 0, bottom: 0,
    background: "linear-gradient(to right, #7b0d0d, #e74c3c)",
    transition: "width 0.05s linear",
  },
  barGlow: {
    position: "absolute",
    top: -3, left: 0,
    height: 8,
    background: "linear-gradient(to right, transparent, rgba(231,76,60,0.5))",
    filter: "blur(4px)",
    transition: "width 0.05s linear",
  },
};