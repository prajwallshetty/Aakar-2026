"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { cinzelFont } from "@/lib/font";

/* ─── Anime Theme Color Palette ─────────────────────────────────── */
export const ANIME_COLORS = {
  primary: "#FF4D00",
  secondary: "#00E5FF", 
  accent: "#FFD700",
  purple: "#B026FF",
  mint: "#00FF9D",
  background: "rgba(8, 10, 18, 0.82)",
  text: "#ffffff",
  subtext: "rgba(255,255,255,0.7)"
} as const;

/* ─── Accent Variations for Cards ─────────────────────────────────── */
export const ACCENTS = [
  { primary: "#FF4D00", glow: "#FF4D0060", secondary: "#FFB347" },
  { primary: "#00E5FF", glow: "#00E5FF60", secondary: "#7B61FF" },
  { primary: "#FFD700", glow: "#FFD70060", secondary: "#FF6B6B" },
  { primary: "#B026FF", glow: "#B026FF60", secondary: "#00E5FF" },
  { primary: "#00FF9D", glow: "#00FF9D60", secondary: "#FFD700" },
];

/* ─── Particle Field Component ───────────────────────────────────── */
export function AnimeParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const COLORS = Object.values(ACCENTS).map(a => a.primary);
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      suppressHydrationWarning={true}
    />
  );
}

/* ─── Orb Field Component ────────────────────────────────────────── */
export function AnimeOrbField() {
  return (
    <div className="anime-orb-container" aria-hidden>
      <div className="anime-orb orb-1" />
      <div className="anime-orb orb-2" />
      <div className="anime-orb orb-3" />
      <div className="anime-orb orb-4" />
    </div>
  );
}

/* ─── 3D Tilt Hook ───────────────────────────────────────────────── */
export function useAnimeTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale3d(1.02,1.02,1.02)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);
  return { ref, onMove, onLeave };
}

/* ─── Glitch Text Component ─────────────────────────────────────── */
export function AnimeGlitchText({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <span className="anime-glitch-root" data-text={text}>
      {children}
    </span>
  );
}

/* ─── Section Heading Component ─────────────────────────────────── */
export function AnimeSectionHeading({ children, index }: { children: React.ReactNode; index: number }) {
  const colors = [ANIME_COLORS.primary, ANIME_COLORS.secondary];
  const c = colors[index % colors.length];
  return (
    <div className="anime-section-head">
      <div className="anime-head-line-left" style={{ background: `linear-gradient(90deg, transparent, ${c})` }} />
      <h2 className={`anime-head-title ${cinzelFont.className}`}>
        <span style={{ color: c, opacity: 0.7, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7em" }}>[ </span>
        {children}
        <span style={{ color: c, opacity: 0.7, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7em" }}> ]</span>
      </h2>
      <div className="anime-head-line-right" style={{ background: `linear-gradient(-90deg, transparent, ${c})` }} />
    </div>
  );
}

/* ─── Anime Card Wrapper Component ───────────────────────────────── */
export function AnimeCardWrapper({ 
  children, 
  accentIndex = 0,
  className = "",
  style = {}
}: { 
  children: React.ReactNode; 
  accentIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, onMove, onLeave } = useAnimeTilt();
  const accent = ACCENTS[accentIndex % ACCENTS.length];

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`anime-card ${className}`}
      style={{
        "--accent": accent.primary,
        "--glow": accent.glow,
        "--secondary": accent.secondary,
        ...style
      } as React.CSSProperties}
    >
      {/* Holographic foil border overlay */}
      <div className="anime-holo-border" />
      
      {/* Corner brackets */}
      <div className="anime-bracket tl" />
      <div className="anime-bracket tr" />
      <div className="anime-bracket bl" />
      <div className="anime-bracket br" />

      {/* Cursor-tracking shine */}
      <div className="anime-shine" />
      
      {children}
    </div>
  );
}

/* ─── Global Styles ───────────────────────────────────────────────── */
export const ANIME_GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap');

  /* ── Keyframes ── */
  @keyframes animeCardEnter {
    from { opacity:0; transform: translateY(30px) scale(0.92); filter: blur(2px); }
    to   { opacity:1; transform: translateY(0) scale(1); filter: blur(0px); }
  }
  @keyframes animeGlitchA {
    0%,100%  { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 1px); }
    20%      { clip-path: inset(92% 0 1% 0);  transform: translate(1px, -2px); }
    40%      { clip-path: inset(43% 0 1% 0);  transform: translate(2px, 1px); }
    60%      { clip-path: inset(25% 0 58% 0); transform: translate(-1px, 2px); }
    80%      { clip-path: inset(54% 0 7% 0);  transform: translate(1px, 1px); }
  }
  @keyframes animeGlitchB {
    0%,100%  { clip-path: inset(50% 0 30% 0); transform: translate(2px, -1px); }
    20%      { clip-path: inset(10% 0 85% 0); transform: translate(-2px, 1px); }
    40%      { clip-path: inset(75% 0 5% 0);  transform: translate(1px, -2px); }
    60%      { clip-path: inset(5% 0 70% 0);  transform: translate(-1px, 1px); }
    80%      { clip-path: inset(30% 0 40% 0); transform: translate(2px, -1px); }
  }
  @keyframes animeLedPulse {
    0%,100% { opacity:1; }
    50%     { opacity:0.6; }
  }
  @keyframes animeOrbFloat {
    0%,100% { transform: translateY(0) scale(1); }
    50%     { transform: translateY(-20px) scale(1.05); }
  }
  @keyframes animeOrbFloat2 {
    0%,100% { transform: translateX(0) scale(1); }
    50%     { transform: translateX(20px) scale(0.95); }
  }
  @keyframes animeHoloShift {
    0%   { background-position: 0% 50%;   opacity: 0; }
    50%  { background-position: 100% 50%; opacity: 0.4; }
    100% { background-position: 0% 50%;   opacity: 0; }
  }

  /* ── Glitch text ── */
  .anime-glitch-root {
    position: relative;
    display: inline-block;
  }
  .anime-glitch-root::before,
  .anime-glitch-root::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    display: inline-block;
  }
  .anime-glitch-root:hover::before {
    animation: animeGlitchA 0.4s steps(2, end) infinite;
    color: #00E5FF;
    text-shadow: 2px 0 #00E5FF;
  }
  .anime-glitch-root:hover::after {
    animation: animeGlitchB 0.4s steps(2, end) infinite;
    color: #FF4D00;
    text-shadow: -2px 0 #FF4D00;
  }

  /* ── Orbs ── */
  .anime-orb-container {
    position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden;
  }
  .anime-orb {
    position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.08;
  }
  .anime-orb.orb-1 {
    width: 500px; height: 500px; top: -120px; left: -120px;
    background: radial-gradient(circle, #FF4D00, transparent 70%);
    animation: animeOrbFloat 12s ease-in-out infinite;
  }
  .anime-orb.orb-2 {
    width: 400px; height: 400px; top: 30%; right: -80px;
    background: radial-gradient(circle, #00E5FF, transparent 70%);
    animation: animeOrbFloat2 15s ease-in-out infinite 2s;
  }
  .anime-orb.orb-3 {
    width: 350px; height: 350px; bottom: 10%; left: 20%;
    background: radial-gradient(circle, #B026FF, transparent 70%);
    animation: animeOrbFloat 18s ease-in-out infinite 4s;
  }
  .anime-orb.orb-4 {
    width: 300px; height: 300px; bottom: 30%; right: 25%;
    background: radial-gradient(circle, #FFD700, transparent 70%);
    animation: animeOrbFloat2 10s ease-in-out infinite 1s;
  }

  /* ── Anime Card ── */
  .anime-card {
    position: relative;
    background: rgba(8, 10, 18, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
    animation: animeCardEnter 0.6s cubic-bezier(0.2,0.8,0.2,1) both;
  }
  .anime-card:hover {
    border-color: var(--accent);
    box-shadow:
      0 0 25px var(--glow),
      0 0 50px color-mix(in srgb, var(--accent) 15%, transparent),
      inset 0 0 15px color-mix(in srgb, var(--accent) 8%, transparent);
  }

  /* ── Holo foil border ── */
  .anime-holo-border {
    position: absolute; inset: 0; border-radius: 12px; pointer-events: none; z-index: 30;
    background: linear-gradient(135deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.1) 25%,
      rgba(255,255,255,0) 50%,
      rgba(255,255,255,0.06) 75%,
      rgba(255,255,255,0) 100%
    );
    background-size: 300% 300%;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .anime-card:hover .anime-holo-border {
    opacity: 1;
    animation: animeHoloShift 2s ease infinite;
  }

  /* ── Corner brackets ── */
  .anime-bracket {
    position: absolute; width: 12px; height: 12px; z-index: 20;
    transition: border-color 0.3s, width 0.3s, height 0.3s;
    opacity: 0.5;
  }
  .anime-bracket.tl { top: 8px; left: 8px; border-top: 2px solid var(--accent); border-left: 2px solid var(--accent); border-radius: 2px 0 0 0; }
  .anime-bracket.tr { top: 8px; right: 8px; border-top: 2px solid var(--accent); border-right: 2px solid var(--accent); border-radius: 0 2px 0 0; }
  .anime-bracket.bl { bottom: 8px; left: 8px; border-bottom: 2px solid var(--accent); border-left: 2px solid var(--accent); border-radius: 0 0 0 2px; }
  .anime-bracket.br { bottom: 8px; right: 8px; border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent); border-radius: 0 0 2px 0; }
  .anime-card:hover .anime-bracket { width: 16px; height: 16px; opacity: 1; }

  /* ── Hover shine ── */
  .anime-shine {
    position: absolute; inset: 0; z-index: 25; pointer-events: none;
    background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.06) 0%, transparent 55%);
    opacity: 0; transition: opacity 0.3s;
  }
  .anime-card:hover .anime-shine { opacity: 1; }

  /* ── Section heading ── */
  .anime-section-head {
    display: flex; align-items: center; gap: 20px;
    justify-content: center; width: 100%;
    margin-bottom: 2.5rem;
  }
  .anime-head-line-left, .anime-head-line-right {
    flex: 1; max-width: 120px; height: 2px; border-radius: 2px;
  }
  .anime-head-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    letter-spacing: 0.15em;
    color: #fff;
    margin: 0;
    text-transform: uppercase;
    white-space: nowrap;
    display: flex; align-items: center; gap: 8px;
  }
`;
