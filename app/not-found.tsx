"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cinzelFont } from "@/lib/font";
import { BackgroundBeams } from "@/components/ui/background-beams";

/* ─── funny slangs that rotate ────────────────────────────────── */
const SLANGS = [
  "Bro really typed a URL like it's a cheat code 💀",
  "This page said 'aight imma head out' 🚪",
  "You got ratio'd by the server fr fr",
  "No cap, this page doesn't exist",
  "It's giving... 404 energy ✨",
  "This page ghosted you harder than your crush 👻",
  "Skill issue tbh 🎮",
  "L + bozo + page not found + touch grass 🌿",
  "POV: you clicked the wrong link again",
  "Not even ctrl+z can save you now 😭",
  "Sir, this is a Wendy's... not a valid URL 🍔",
  "This page went to get milk and never came back 🥛",
];

const EMOJIS = ["💀", "😭", "🤡", "👻", "🫠", "😵‍💫", "🥴", "🤯"];

/* ═══════════════════════════════════════════════════════════════ */
export default function NotFound() {
  const [sloganIdx, setSloganIdx] = useState(0);
  const [emojiIdx, setEmojiIdx] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  /* rotate slangs */
  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIdx((p) => (p + 1) % SLANGS.length);
      setEmojiIdx((p) => (p + 1) % EMOJIS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  /* periodic glitch burst */
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        /* ── keyframes ── */
        @keyframes float404 {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-18px); }
        }
        @keyframes glitch404 {
          0%   { clip-path: inset(40% 0 30% 0); transform: translate(-6px, 2px) skewX(-2deg); }
          20%  { clip-path: inset(10% 0 75% 0); transform: translate(5px, -3px) skewX(1deg); }
          40%  { clip-path: inset(70% 0 5% 0);  transform: translate(-4px, 4px) skewX(-1deg); }
          60%  { clip-path: inset(20% 0 50% 0);  transform: translate(6px, -1px) skewX(2deg); }
          80%  { clip-path: inset(55% 0 15% 0);  transform: translate(-3px, 3px) skewX(-1deg); }
          100% { clip-path: inset(30% 0 40% 0);  transform: translate(4px, -2px) skewX(1deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sloganSwap {
          0%   { opacity: 0; transform: translateY(12px) scale(0.96); filter: blur(4px); }
          15%  { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          85%  { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateY(-12px) scale(0.96); filter: blur(4px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(99,68,245,0.3), 0 0 60px rgba(99,68,245,0.1); }
          50%      { box-shadow: 0 0 35px rgba(99,68,245,0.5), 0 0 80px rgba(174,72,255,0.2); }
        }
        @keyframes shimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(99,68,245,0.4); }
          50%      { border-color: rgba(174,72,255,0.6); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.8; }
        }
        @keyframes spinSlow {
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes scanLine {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes emojiFloat {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25%      { transform: scale(1.2) rotate(-8deg); }
          50%      { transform: scale(1) rotate(0deg); }
          75%      { transform: scale(1.2) rotate(8deg); }
        }

        /* ── the number ── */
        .num-404 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(8rem, 28vw, 18rem);
          line-height: 0.82;
          letter-spacing: 0.04em;
          color: transparent;
          background: linear-gradient(180deg, #c4b5fd 0%, #6344F5 40%, #AE48FF 70%, #18CCFC 100%);
          -webkit-background-clip: text;
          background-clip: text;
          position: relative;
          z-index: 2;
          animation: float404 4s ease-in-out infinite;
          filter: drop-shadow(0 0 40px rgba(99,68,245,0.4)) drop-shadow(0 0 80px rgba(174,72,255,0.2));
          margin: 0;
          user-select: none;
        }

        /* glitch clones */
        .glitch-layer {
          position: absolute; inset: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(8rem, 28vw, 18rem);
          line-height: 0.82;
          letter-spacing: 0.04em;
          pointer-events: none;
          user-select: none;
          opacity: 0;
        }
        .glitch-active .glitch-layer {
          animation: glitch404 0.4s steps(3) both;
          opacity: 0.7;
        }
        .glitch-layer.cyan  { color: #18CCFC; mix-blend-mode: screen; }
        .glitch-layer.pink  { color: #AE48FF; mix-blend-mode: screen; }

        /* ── card ── */
        .nf-card {
          position: relative;
          max-width: 560px;
          width: 100%;
          background: linear-gradient(155deg,
            rgba(15,8,40,0.85) 0%,
            rgba(20,12,50,0.80) 50%,
            rgba(12,6,35,0.88) 100%
          );
          border: 1.5px solid rgba(99,68,245,0.35);
          border-radius: 20px;
          padding: clamp(1.6rem, 4vw, 2.6rem) clamp(1.8rem, 5vw, 3rem);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: hidden;
          animation: pulseGlow 5s ease-in-out infinite, borderGlow 4s ease-in-out infinite;
        }
        .nf-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,68,245,0.6), rgba(174,72,255,0.4), transparent);
        }

        /* scan line across card */
        .nf-scan {
          position: absolute; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, rgba(99,68,245,0.4), rgba(24,204,252,0.3), transparent);
          animation: scanLine 3.5s linear infinite;
          pointer-events: none; z-index: 5;
        }

        /* ── slogan area ── */
        .slogan-box {
          min-height: 3.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slogan-text {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.82rem, 2.2vw, 1.05rem);
          color: #c4b5fd;
          text-align: center;
          line-height: 1.6;
          animation: sloganSwap 3.5s ease-in-out infinite;
          padding: 0 0.5rem;
        }

        /* ── status badge ── */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(196,181,253,0.7);
          padding: 0.3rem 1rem;
          border: 1px solid rgba(99,68,245,0.3);
          border-radius: 999px;
          background: rgba(99,68,245,0.08);
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #AE48FF;
          box-shadow: 0 0 8px #AE48FF;
          animation: breathe 2s ease-in-out infinite;
        }

        /* ── CTA button ── */
        .nf-btn {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.9rem 2.4rem;
          background: linear-gradient(135deg, #6344F5 0%, #AE48FF 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: inline-block;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(99,68,245,0.35), 0 0 0 1px rgba(174,72,255,0.2);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nf-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }
        .nf-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 36px rgba(99,68,245,0.55), 0 0 0 1px rgba(174,72,255,0.4);
        }
        .nf-btn:active { transform: translateY(0) scale(0.98); }

        /* ── ghost button ── */
        .nf-btn-ghost {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.9rem 2.4rem;
          background: transparent;
          color: #c4b5fd;
          border: 1.5px solid rgba(99,68,245,0.4);
          border-radius: 10px;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s ease;
        }
        .nf-btn-ghost:hover {
          border-color: #AE48FF;
          color: #fff;
          background: rgba(99,68,245,0.12);
          box-shadow: 0 0 24px rgba(174,72,255,0.2);
          transform: translateY(-2px);
        }

        /* ── terminal log ── */
        .terminal-log {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: rgba(196,181,253,0.35);
          letter-spacing: 0.08em;
          text-align: center;
          line-height: 2;
        }
        .terminal-log span {
          color: rgba(24,204,252,0.5);
        }

        /* ── emoji ── */
        .float-emoji {
          font-size: 2.5rem;
          animation: emojiFloat 3s ease-in-out infinite;
          filter: drop-shadow(0 0 12px rgba(174,72,255,0.4));
        }

        /* ── fade utils ── */
        .fu-1 { animation: fadeUp 0.6s 0.1s ease both; }
        .fu-2 { animation: fadeUp 0.6s 0.25s ease both; }
        .fu-3 { animation: fadeUp 0.6s 0.4s ease both; }
        .fu-4 { animation: fadeUp 0.6s 0.55s ease both; }
        .fu-5 { animation: fadeIn 0.8s 0.7s ease both; }

        /* ── divider ── */
        .nf-divider {
          width: 80px;
          height: 2px;
          margin: 0 auto;
          background: linear-gradient(90deg, transparent, #6344F5, #AE48FF, transparent);
          border-radius: 2px;
          animation: breathe 3s ease-in-out infinite;
        }

        /* ── corner decorations ── */
        .corner-deco {
          position: absolute;
          width: 18px; height: 18px;
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .nf-card:hover .corner-deco { opacity: 0.6; }
        .corner-deco.tl { top: 12px; left: 12px; border-top: 2px solid #6344F5; border-left: 2px solid #6344F5; border-radius: 3px 0 0 0; }
        .corner-deco.tr { top: 12px; right: 12px; border-top: 2px solid #AE48FF; border-right: 2px solid #AE48FF; border-radius: 0 3px 0 0; }
        .corner-deco.bl { bottom: 12px; left: 12px; border-bottom: 2px solid #AE48FF; border-left: 2px solid #AE48FF; border-radius: 0 0 0 3px; }
        .corner-deco.br { bottom: 12px; right: 12px; border-bottom: 2px solid #18CCFC; border-right: 2px solid #18CCFC; border-radius: 0 0 3px 0; }

        /* responsive */
        @media (max-width: 480px) {
          .btn-row { flex-direction: column; align-items: stretch; }
          .nf-btn, .nf-btn-ghost { width: 100%; text-align: center; }
        }
      `}</style>

      {/* ── Background ── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0118 0%, #0d0526 30%, #10082e 60%, #08001a 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,1,20,0.8) 0%, rgba(10,3,30,0.6) 50%, rgba(8,0,22,0.95) 100%)" }} />
        <BackgroundBeams className="absolute inset-0 opacity-70" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
      </div>

      {/* ── Slow spinning ring deco ── */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        width: "clamp(300px, 55vw, 600px)",
        height: "clamp(300px, 55vw, 600px)",
        zIndex: 1, pointerEvents: "none",
        animation: "spinSlow 60s linear infinite",
        transform: "translate(-50%,-50%)",
      }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ opacity: 0.06 }}>
          <circle cx="100" cy="100" r="95" fill="none" stroke="#6344F5" strokeWidth="0.5" strokeDasharray="6 8" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="#AE48FF" strokeWidth="0.3" strokeDasharray="3 12" />
          <circle cx="100" cy="100" r="65" fill="none" stroke="#18CCFC" strokeWidth="0.3" strokeDasharray="2 16" />
        </svg>
      </div>

      <main style={{
        position: "relative", zIndex: 10,
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem 1.5rem",
        gap: "clamp(0.8rem, 2.5vh, 1.6rem)",
        textAlign: "center",
      }}>

        {/* ── Status badge ── */}
        <div className="fu-1">
          <div className="status-badge">
            <span className="status-dot" />
            Error 404 · Page Not Found
          </div>
        </div>

        {/* ── Giant 404 ── */}
        <div style={{ position: "relative", zIndex: 2 }} className={`fu-1 ${glitchActive ? "glitch-active" : ""}`}>
          <div className="glitch-layer cyan" aria-hidden>404</div>
          <div className="glitch-layer pink" aria-hidden>404</div>
          <h1 className="num-404">404</h1>
        </div>

        {/* ── Floating emoji ── */}
        <div className="fu-2 float-emoji" aria-hidden>
          {EMOJIS[emojiIdx]}
        </div>

        {/* ── Card ── */}
        <div className="nf-card fu-3">
          <div className="nf-scan" />

          {/* Corner brackets */}
          <div className="corner-deco tl" />
          <div className="corner-deco tr" />
          <div className="corner-deco bl" />
          <div className="corner-deco br" />

          <h2 className={cinzelFont.className} style={{
            fontSize: "clamp(1.3rem, 4vw, 2rem)",
            color: "#fff",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textShadow: "0 0 30px rgba(99,68,245,0.4)",
            margin: "0 0 0.8rem",
            position: "relative", zIndex: 1,
          }}>
            Yikes. Dead End, Bestie.
          </h2>

          <div className="nf-divider" style={{ marginBottom: "1.2rem" }} />

          {/* Rotating slangs */}
          <div className="slogan-box" style={{ position: "relative", zIndex: 1 }}>
            <p className="slogan-text" key={sloganIdx}>
              {SLANGS[sloganIdx]}
            </p>
          </div>

          <div className="nf-divider" style={{ marginTop: "1rem" }} />
        </div>

        {/* ── Action buttons ── */}
        <div className="fu-4 btn-row" style={{
          display: "flex", gap: "1rem", flexWrap: "wrap",
          justifyContent: "center",
          position: "relative", zIndex: 2,
        }}>
          <Link href="/" className="nf-btn">← Take Me Home</Link>
          <Link href="/events/cultural" className="nf-btn-ghost">Browse Events →</Link>
        </div>

        {/* ── Terminal log ── */}
        <div className="fu-5 terminal-log">
          <span>$</span> curl aakar.dev/this-page<br />
          <span>→</span> 404: nah fam, that ain&apos;t here<br />
          <span>→</span> suggestion: go touch some grass 🌿
        </div>

      </main>
    </>
  );
}