"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cinzelFont } from "@/lib/font";
import {
  AnimeParticleField,
  AnimeOrbField,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const monoFont = "'Share Tech Mono', monospace";

// ─── Confetti config ──────────────────────────────────────────────────────────
const CONFETTI = [
  { left: "5%",  color: ANIME_COLORS.primary,   delay: "0s",    size: 10, shape: "circle" },
  { left: "12%", color: ANIME_COLORS.accent,    delay: "0.4s",  size: 14, shape: "square" },
  { left: "20%", color: ANIME_COLORS.secondary, delay: "0.1s",  size: 8,  shape: "diamond" },
  { left: "28%", color: ANIME_COLORS.purple,    delay: "0.6s",  size: 12, shape: "circle" },
  { left: "36%", color: ANIME_COLORS.primary,   delay: "0.2s",  size: 16, shape: "square" },
  { left: "44%", color: ANIME_COLORS.accent,    delay: "0.8s",  size: 10, shape: "diamond" },
  { left: "52%", color: ANIME_COLORS.secondary, delay: "0.35s", size: 14, shape: "circle" },
  { left: "60%", color: ANIME_COLORS.purple,    delay: "0s",    size: 8,  shape: "square" },
  { left: "68%", color: ANIME_COLORS.primary,   delay: "0.5s",  size: 12, shape: "diamond" },
  { left: "76%", color: ANIME_COLORS.accent,    delay: "0.15s", size: 16, shape: "circle" },
  { left: "84%", color: ANIME_COLORS.secondary, delay: "0.7s",  size: 10, shape: "square" },
  { left: "92%", color: ANIME_COLORS.purple,    delay: "0.25s", size: 14, shape: "diamond" },
  // second wave
  { left: "9%",  color: ANIME_COLORS.accent,    delay: "1.6s",  size: 8,  shape: "circle" },
  { left: "18%", color: ANIME_COLORS.primary,   delay: "1.9s",  size: 12, shape: "diamond" },
  { left: "33%", color: ANIME_COLORS.secondary, delay: "1.4s",  size: 10, shape: "square" },
  { left: "50%", color: ANIME_COLORS.purple,    delay: "2.0s",  size: 14, shape: "circle" },
  { left: "65%", color: ANIME_COLORS.primary,   delay: "1.7s",  size: 8,  shape: "diamond" },
  { left: "80%", color: ANIME_COLORS.accent,    delay: "1.5s",  size: 12, shape: "square" },
];

export default function RegistrationSuccess() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 16px 80px",
    }}>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        /* ── confetti ── */
        @keyframes confettiFall {
          0%   { transform: translateY(-30px) rotateZ(0deg) rotateX(0deg); opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(105vh) rotateZ(540deg) rotateX(180deg); opacity: 0; }
        }
        .conf {
          position: fixed; top: -24px; z-index: 60; pointer-events: none;
          animation: confettiFall 3.8s ease-in infinite;
        }

        /* ── neon card ── */
        @keyframes neonBreath {
          0%,100% { box-shadow: 0 0 40px ${ANIME_COLORS.primary}90, inset 0 0 24px ${ANIME_COLORS.primary}35; }
          50%      { box-shadow: 0 0 65px ${ANIME_COLORS.secondary}99, inset 0 0 32px ${ANIME_COLORS.secondary}50; }
        }
        @keyframes crtScan {
          from { background-position: 0 0; }
          to   { background-position: 0 80px; }
        }
        @keyframes scanLine {
          0%   { top: -4px; opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rubyPulse {
          0%,100% { opacity: 0.65; transform: scaleX(1); }
          50%      { opacity: 1;    transform: scaleX(1.04); }
        }
        @keyframes bannerGlitch {
          0%,90%,100% { transform: none; text-shadow: 0 0 18px ${ANIME_COLORS.primary}80, 0 0 40px ${ANIME_COLORS.primary}40; }
          91% { transform: translate(-3px,0) skewX(-2deg); text-shadow: -4px 0 ${ANIME_COLORS.accent}, 4px 0 ${ANIME_COLORS.secondary}; }
          93% { transform: translate(3px,0) skewX(2deg);  text-shadow: 4px 0 ${ANIME_COLORS.accent}, -4px 0 ${ANIME_COLORS.secondary}; }
          95% { transform: none; }
        }
        @keyframes shimmerBtn {
          0%   { left: -120%; }
          100% { left: 140%; }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes wiggle {
          from { transform: rotate(-3deg) scale(1); }
          to   { transform: rotate(3deg) scale(1.06); }
        }

        .rs-card {
          background: linear-gradient(155deg, rgba(15,5,32,.96) 0%, rgba(20,7,40,.93) 55%, rgba(14,5,30,.97) 100%);
          border: 2px solid ${ANIME_COLORS.primary}cc;
          border-radius: 1.5rem;
          overflow: hidden;
          position: relative;
          animation: neonBreath 5s ease-in-out infinite, panelIn .6s cubic-bezier(.22,1,.36,1) both;
        }
        .rs-card::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg,transparent,transparent 3px,${ANIME_COLORS.primary}15 3px,${ANIME_COLORS.primary}15 4px);
          pointer-events: none; z-index: 0; animation: crtScan 7s linear infinite;
        }
        .rs-scan {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,transparent,${ANIME_COLORS.primary}cc,transparent);
          animation: scanLine 5s linear infinite; pointer-events: none; z-index: 5;
        }
        .rs-ruby {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: 'Share Tech Mono',monospace; font-size: 0.58rem; letter-spacing: 0.45em;
          color: ${ANIME_COLORS.accent}; text-transform: uppercase; padding: 0.22rem 1.1rem;
          border: 1.5px solid ${ANIME_COLORS.accent}; background: ${ANIME_COLORS.accent}30;
          box-shadow: 0 0 14px ${ANIME_COLORS.accent}50;
          clip-path: polygon(10px 0%,calc(100% - 10px) 0%,100% 50%,calc(100% - 10px) 100%,10px 100%,0% 50%);
          animation: rubyPulse 3s ease-in-out infinite; margin-bottom: 1rem;
        }
        .rs-ruby::before,.rs-ruby::after { content: '◆'; font-size: 0.35rem; opacity: 0.7; }
        .rs-deco {
          width: 72px; height: 2px; margin: 0.8rem auto 0;
          background: linear-gradient(90deg,transparent,${ANIME_COLORS.primary}cc,transparent);
          animation: rubyPulse 2.8s ease-in-out infinite;
        }
        .rs-check {
          animation: checkPop 0.7s cubic-bezier(.175,.885,.32,1.275) 0.35s both;
        }
        .rs-btn {
          font-family: 'Share Tech Mono',monospace; font-size: 0.65rem; letter-spacing: 0.28em;
          text-transform: uppercase; padding: 0.75rem 1.6rem; border-radius: 5px;
          text-decoration: none; display: inline-block; position: relative; overflow: hidden;
          transition: transform .16s ease, box-shadow .16s ease; cursor: pointer;
        }
        .rs-btn::after {
          content: ''; position: absolute; top: 0; left: -120%; width: 80%; height: 100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);
          animation: shimmerBtn 3.5s ease-in-out infinite;
        }
        .rs-btn:hover { transform: translateY(-2px); }
        .rs-btn-primary {
          border: 1.5px solid ${ANIME_COLORS.primary};
          background: linear-gradient(135deg,${ANIME_COLORS.primary}55,${ANIME_COLORS.primary}30);
          color: #fff;
          box-shadow: 0 0 22px ${ANIME_COLORS.primary}50, inset 0 1px 0 ${ANIME_COLORS.primary}70;
        }
        .rs-btn-primary:hover { box-shadow: 0 0 34px ${ANIME_COLORS.primary}75; }
        .rs-btn-ghost {
          border: 1.5px solid ${ANIME_COLORS.secondary}80;
          background: transparent; color: ${ANIME_COLORS.text}bb;
        }
        .rs-btn-ghost:hover { border-color: ${ANIME_COLORS.secondary}; color: ${ANIME_COLORS.text}; box-shadow: 0 0 16px ${ANIME_COLORS.secondary}35; }
        .rs-pill {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Share Tech Mono',monospace; font-size: 0.72rem;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 0.65rem 1rem; border-radius: 6px;
          color: #fff;
        }
        .rs-status {
          animation: wiggle 1.8s ease-in-out infinite alternate;
          display: inline-block;
        }
      `}</style>

      {/* Background */}
      <AnimeOrbField />
      <AnimeParticleField />
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.08)", pointerEvents: "none", zIndex: 0 }} />

      {/* Confetti */}
      {mounted && CONFETTI.map((c, i) => (
        <div key={i} className="conf" style={{
          left: c.left,
          width: c.size, height: c.size,
          background: `${c.color}cc`,
          border: `1.5px solid ${c.color}`,
          boxShadow: `0 0 16px ${c.color}99`,
          animationDelay: c.delay,
          borderRadius:
            c.shape === "circle" ? "50%" :
            c.shape === "diamond" ? "2px" : "3px",
          transform: c.shape === "diamond" ? "rotate(45deg)" : undefined,
        }} />
      ))}

      {/* Card */}
      <div className="rs-card" style={{ position: "relative", zIndex: 10, maxWidth: 540, width: "100%" }}>
        <div className="rs-scan" />

        {/* Marquee top bar */}
        <div style={{
          background: `${ANIME_COLORS.primary}bb`,
          borderBottom: `1.5px solid ${ANIME_COLORS.primary}cc`,
          padding: "6px 0",
          overflow: "hidden",
          position: "relative", zIndex: 2,
        }}>
          <div style={{
            whiteSpace: "nowrap",
            fontFamily: monoFont,
            fontSize: 9, letterSpacing: 5, color: ANIME_COLORS.text,
            animation: "marquee 12s linear infinite",
          }}>
            {Array(14).fill("★ QUEST ACCEPTED ★ AAKAR 2026 ★ AJIET ★ ").join("")}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "36px 32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>

          {/* Ruby badge */}
          <span className="rs-ruby">Registration · Quest Confirmed</span>

          {/* Check icon */}
          <div className="rs-check" style={{
            width: 64, height: 64, borderRadius: "50%",
            background: `linear-gradient(135deg, ${ANIME_COLORS.secondary}70, ${ANIME_COLORS.primary}55)`,
            border: `2px solid ${ANIME_COLORS.secondary}`,
            boxShadow: `0 0 40px ${ANIME_COLORS.secondary}90, 0 0 80px ${ANIME_COLORS.secondary}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke={ANIME_COLORS.secondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Main heading */}
          <div style={{ textAlign: "center" }}>
            <div className={cinzelFont.className} style={{
              fontSize: "clamp(1.1rem, 5vw, 1.5rem)",
              letterSpacing: "0.25em", lineHeight: 1.2,
              color: `${ANIME_COLORS.text}ee`,
              textTransform: "uppercase",
            }}>
              Registration
            </div>
            <div className={cinzelFont.className} style={{
              fontSize: "clamp(2.2rem, 8vw, 3rem)",
              letterSpacing: "0.1em", lineHeight: 1,
              color: "#fff",
              textTransform: "uppercase",
              textShadow: `0 0 20px ${ANIME_COLORS.primary}80, 0 0 40px ${ANIME_COLORS.primary}40`,
              animation: "bannerGlitch 9s ease-in-out infinite",
            }}>
              Confirmed!
            </div>
          </div>

          <div className="rs-deco" />

          {/* Info box */}
          <div style={{
            border: `1.5px solid ${ANIME_COLORS.accent}cc`,
            background: `${ANIME_COLORS.accent}28`,
            boxShadow: `0 0 24px ${ANIME_COLORS.accent}55`,
            padding: "14px 20px", width: "100%", borderRadius: 8,
          }}>
            <p style={{
              fontFamily: monoFont, fontSize: "0.8rem",
              color: `${ANIME_COLORS.text}ee`, lineHeight: 1.8, margin: 0, textAlign: "center",
            }}>
              Your spot at <strong style={{ color: ANIME_COLORS.text }}>AAKAR 2026</strong> is locked in!<br />
              Check your inbox for your quest pass.<br />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${ANIME_COLORS.secondary}bb` }}>
                April 24–25, 2026 · AJIET, Mangalore
              </span>
            </p>
          </div>

          {/* What's next pills */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { text: "Quest pass sent to your inbox", color: ANIME_COLORS.secondary,  icon: "📩" },
              { text: "Show your pass at the arena gate", color: ANIME_COLORS.purple,  icon: "🎫" },
              { text: "Follow us on Instagram for updates", color: ANIME_COLORS.primary, icon: "📸" },
            ].map((item, i) => (
              <div key={i} className="rs-pill" style={{
                background: `${item.color}30`,
                border: `1.5px solid ${item.color}bb`,
                boxShadow: `0 0 18px ${item.color}55`,
              }}>
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 4, width: "100%" }}>
            <Link href="/events/cultural" className="rs-btn rs-btn-primary">Browse Quests</Link>
            <Link href="/" className="rs-btn rs-btn-ghost">← Return to Base</Link>
          </div>
        </div>

        {/* Bottom ticket stub */}
        <div style={{
          background: `rgba(8,3,18,0.85)`,
          borderTop: `1px dashed ${ANIME_COLORS.primary}55`,
          padding: "12px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
          position: "relative", zIndex: 2,
        }}>
          <div>
            <div style={{ fontFamily: monoFont, fontSize: "0.5rem", letterSpacing: "0.4em", color: `${ANIME_COLORS.text}55`, textTransform: "uppercase", marginBottom: 3 }}>
              Event
            </div>
            <div className={cinzelFont.className} style={{ fontSize: "0.9rem", letterSpacing: "0.15em", color: ANIME_COLORS.accent }}>
              AAKAR 2026
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: monoFont, fontSize: "0.5rem", letterSpacing: "0.4em", color: `${ANIME_COLORS.text}55`, textTransform: "uppercase", marginBottom: 3 }}>
              Status
            </div>
            <div className="rs-status" style={{
              display: "inline-block",
              background: `${ANIME_COLORS.secondary}30`,
              border: `1px solid ${ANIME_COLORS.secondary}`,
              padding: "3px 14px", borderRadius: 4,
              fontFamily: monoFont, fontSize: "0.65rem", letterSpacing: "0.3em",
              color: ANIME_COLORS.secondary, textTransform: "uppercase",
              boxShadow: `0 0 12px ${ANIME_COLORS.secondary}40`,
            }}>
              Confirmed
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
