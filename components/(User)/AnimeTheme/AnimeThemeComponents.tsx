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
  background: "rgba(8, 10, 18, 0.92)",
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
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let animFrame: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    
    // Fewer particles for performance
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const COLORS = Object.values(ACCENTS).map(a => a.primary);
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            r: Math.random() * 1.2 + 0.4,
            alpha: Math.random() * 0.4 + 0.1,
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
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
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
    el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`; // Reduced tilt amount
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
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
export function AnimeSectionHeading({ children, index, style, className }: { children: React.ReactNode; index: number; style?: React.CSSProperties; className?: string }) {
  const colors = [ANIME_COLORS.primary, ANIME_COLORS.secondary];
  const c = colors[index % colors.length];
  return (
    <div className={`anime-section-head ${className || ""}`} style={style}>
      <div className="anime-head-line-left" style={{ background: `linear-gradient(90deg, transparent, ${c})` }} />
      <h2 className={`anime-head-title ${cinzelFont.className}`}>
        {children}
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

      {/* Cursor-tracking shine */}
      <div className="anime-shine" />

      {children}
    </div>
  );
}

/* ─── Global Styles ───────────────────────────────────────────────── */
export const ANIME_GLOBAL_STYLES = `
  /* Keyframes */
  @keyframes animeCardEnter {
    from { opacity:0; transform: translateY(20px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes animeGlitchA {
    0%,100%  { clip-path: inset(40% 0 61% 0); transform: translate(-1px, 1px); }
    50%      { clip-path: inset(43% 0 1% 0);  transform: translate(1px, 1px); }
  }
  @keyframes animeGlitchB {
    0%,100%  { clip-path: inset(50% 0 30% 0); transform: translate(1px, -1px); }
    50%      { clip-path: inset(30% 0 40% 0); transform: translate(1px, -1px); }
  }
  @keyframes animeOrbFloat {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-10px); }
  }
  @keyframes animeHoloShift {
    0%   { background-position: 0% 50%;   opacity: 0; }
    50%  { background-position: 100% 50%; opacity: 0.2; }
    100% { background-position: 0% 50%;   opacity: 0; }
  }

  /* Glitch text */
  .anime-glitch-root { position: relative; display: inline-block; }
  .anime-glitch-root::before, .anime-glitch-root::after {
    content: attr(data-text); position: absolute; inset: 0; display: inline-block;
  }
  .anime-glitch-root:hover::before {
    animation: animeGlitchA 0.3s steps(2, end) infinite;
    color: #00E5FF; text-shadow: 1px 0 #00E5FF;
  }
  .anime-glitch-root:hover::after {
    animation: animeGlitchB 0.3s steps(2, end) infinite;
    color: #FF4D00; text-shadow: -1px 0 #FF4D00;
  }

  /* Orbs — optimized with radial gradients, less blur */
  .anime-orb-container { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
  .anime-orb { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.05; will-change: transform; transition: opacity 1s; }
  .anime-orb.orb-1 {
    width: 600px; height: 600px; top: -100px; left: -100px;
    background: radial-gradient(circle, #FF4D00, transparent 75%);
    animation: animeOrbFloat 15s ease-in-out infinite;
  }
  .anime-orb.orb-2 {
    width: 500px; height: 500px; bottom: 10%; right: -50px;
    background: radial-gradient(circle, #00E5FF, transparent 75%);
    animation: animeOrbFloat 20s ease-in-out infinite reverse;
  }
  .anime-orb.orb-3 {
    width: 400px; height: 400px; top: 40%; left: 15%;
    background: radial-gradient(circle, #B026FF, transparent 75%);
    animation: animeOrbFloat 12s ease-in-out infinite 2s;
  }

  /* Anime Card — Removed backdrop-filter to save GPU */
  .anime-card {
    position: relative;
    background: #080a12;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.2s ease-out, border-color 0.3s ease, box-shadow 0.3s ease;
    animation: animeCardEnter 0.5s ease-out both;
  }
  .anime-card:hover {
    border-color: var(--accent);
    box-shadow: 0 0 20px var(--glow);
  }

  /* Holo foil border */
  .anime-holo-border {
    position: absolute; inset: 0; border-radius: 12px; pointer-events: none; z-index: 30;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
    background-size: 200% 200%; opacity: 0;
  }
  .anime-card:hover .anime-holo-border {
    opacity: 1; animation: animeHoloShift 3s linear infinite;
  }

  /* Hover shine */
  .anime-shine {
    position: absolute; inset: 0; z-index: 25; pointer-events: none;
    background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.04) 0%, transparent 50%);
    opacity: 0; transition: opacity 0.2s;
  }
  .anime-card:hover .anime-shine { opacity: 1; }

  /* Section heading */
  .anime-section-head { display: flex; align-items: center; gap: 20px; justify-content: center; width: 100%; margin: 2rem 0; }
  .anime-head-line-left, .anime-head-line-right { flex: 1; max-width: 100px; height: 1px; opacity: 0.3; }
  .anime-head-title {
    font-size: clamp(1rem, 3vw, 2rem); letter-spacing: 0.2em; color: #fff; margin: 0; text-transform: uppercase; text-align: center;
  }
`;
