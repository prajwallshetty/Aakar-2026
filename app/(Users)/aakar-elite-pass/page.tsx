"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cinzelFont } from "@/lib/font";
import {
  AnimeParticleField,
  AnimeOrbField,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

export default function AakarElitePage() {
  const currentPrice = 299;

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        /* ── SHARED ANIMATIONS ───────────────────────── */
        @keyframes bannerGlitch {
          0%,92%,100% {
            transform: none;
            text-shadow: 0 0 18px ${ANIME_COLORS.secondary}80, 0 0 40px ${ANIME_COLORS.secondary}40;
          }
          93% { transform: translate(-3px, 0) skewX(-2deg); text-shadow: -4px 0 ${ANIME_COLORS.accent}, 4px 0 ${ANIME_COLORS.secondary}; }
          95% { transform: translate(3px, 0) skewX(2deg);  text-shadow: 4px 0 ${ANIME_COLORS.accent}, -4px 0 ${ANIME_COLORS.secondary}; }
          97% { transform: none; }
        }
        @keyframes scanLine {
          0%   { top: -4px; opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes rubyPulse {
          0%,100% { opacity: 0.65; transform: scaleX(1); }
          50%      { opacity: 1;    transform: scaleX(1.03); }
        }
        @keyframes tagFlicker {
          0%,100% { opacity: 1; }
          91% { opacity: 1; }
          93% { opacity: 0.25; }
          95% { opacity: 1; }
          97% { opacity: 0.4; }
        }
        @keyframes merchPanelIn {
          from { opacity: 0; transform: translateY(20px) scale(0.975); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes neonBreath {
          0%,100% { box-shadow: 0 0 28px ${ANIME_COLORS.secondary}50, inset 0 0 16px ${ANIME_COLORS.secondary}18; }
          50%      { box-shadow: 0 0 44px ${ANIME_COLORS.secondary}65, inset 0 0 22px ${ANIME_COLORS.secondary}28; }
        }
        @keyframes hologramPulse {
          0%,100% { opacity: 0.7; filter: hue-rotate(0deg); }
          50% { opacity: 1; filter: hue-rotate(25deg); box-shadow: 0 0 40px ${ANIME_COLORS.accent}; }
        }
        @keyframes crtScan {
          from { background-position: 0 0; }
          to   { background-position: 0 80px; }
        }
        @keyframes priceIn {
          from { letter-spacing: 0.18em; opacity: 0.4; }
          to   { letter-spacing: 0.04em; opacity: 1; }
        }
        @keyframes shimmerBtn {
          0%   { left: -100%; }
          100% { left: 140%; }
        }
        @keyframes featIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── SHELL ───────────────────────────────────── */
        .merch-shell { animation: merchPanelIn .5s cubic-bezier(.22,1,.36,1) both; }

        /* ── CARD SKIN (shared) ───────────────────────── */
        .merch-card {
          background: linear-gradient(155deg,
            rgba(8,3,18,.97) 0%,
            rgba(12,5,24,.95) 55%,
            rgba(9,3,18,.98) 100%
          );
          border: 1.5px solid ${ANIME_COLORS.secondary}80;
          animation: neonBreath 5s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        .merch-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            ${ANIME_COLORS.secondary}07 3px,
            ${ANIME_COLORS.secondary}07 4px
          );
          pointer-events: none;
          z-index: 0;
          animation: crtScan 7s linear infinite;
        }
        .scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.secondary}55, transparent);
          animation: scanLine 5s linear infinite;
          pointer-events: none;
          z-index: 5;
        }

        /* ── STREET BANNER ───────────────────────────── */
        .street-banner {
          text-align: center;
          padding: 2.4rem 1rem 2rem;
          border-bottom: 1.5px solid ${ANIME_COLORS.secondary}44;
          position: relative;
          z-index: 1;
        }
        .street-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 72% 90% at 50% 115%, ${ANIME_COLORS.secondary}1e 0%, transparent 70%),
            radial-gradient(ellipse 38% 55% at 18% 50%, ${ANIME_COLORS.accent}12 0%, transparent 60%);
          pointer-events: none;
        }
        .banner-ruby {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.45em;
          color: ${ANIME_COLORS.accent};
          text-transform: uppercase;
          padding: 0.22rem 1.1rem;
          border: 1px solid ${ANIME_COLORS.accent}80;
          background: ${ANIME_COLORS.accent}16;
          clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%);
          animation: rubyPulse 3s ease-in-out infinite;
          margin-bottom: 1rem;
        }
        .banner-ruby::before,
        .banner-ruby::after { content: '◆'; font-size: 0.35rem; opacity: 0.7; }
        .banner-title {
          display: block;
          font-size: clamp(2.8rem, 7.5vw, 3.8rem);
          line-height: 0.88;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 0 20px ${ANIME_COLORS.secondary}75, 0 0 45px ${ANIME_COLORS.secondary}35;
          animation: bannerGlitch 8s ease-in-out infinite;
        }
        .banner-title .stroke-word {
          -webkit-text-stroke: 2px ${ANIME_COLORS.secondary};
          color: transparent;
          filter: drop-shadow(0 0 10px ${ANIME_COLORS.secondary}cc);
        }
        .banner-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.5em;
          color: ${ANIME_COLORS.secondary}bb;
          margin-top: 0.9rem;
          text-transform: uppercase;
        }
        .banner-deco {
          width: 72px; height: 2px;
          margin: 0.8rem auto 0;
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.secondary}cc, transparent);
          animation: rubyPulse 2.8s ease-in-out infinite;
        }

        /* ── DIVIDER ────────────────────────────────── */
        .pane-divider { display: none; }
        @media (min-width: 1024px) {
          .pane-divider {
            display: block;
            position: absolute;
            top: 5%; bottom: 5%; left: 50%;
            width: 1.5px;
            background: linear-gradient(180deg,
              transparent 0%,
              ${ANIME_COLORS.secondary}55 20%,
              ${ANIME_COLORS.secondary}55 80%,
              transparent 100%
            );
            pointer-events: none;
          }
        }

        /* ── STRIPPED HOLOGRAM CSS ───────────────────────── */
        .hologram-pass {
          position: relative;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          animation: hologramPulse 4s infinite alternate ease-in-out;
        }

        /* ── SUMMARY RIGHT PANE ─────────────────────── */
        .info-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.57rem;
          letter-spacing: 0.5em;
          color: ${ANIME_COLORS.secondary};
          text-transform: uppercase;
          animation: tagFlicker 9s ease-in-out infinite;
        }
        .info-title {
          letter-spacing: 0.04em;
          color: #fff;
          line-height: 0.9;
          margin-top: 0.4rem;
          text-transform: uppercase;
          text-shadow: 0 0 30px ${ANIME_COLORS.secondary}50;
        }
        .info-desc {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.8;
          color: ${ANIME_COLORS.text}cc;
          margin-top: 1.2rem;
          padding-left: 1.1rem;
          border-left: 2px solid ${ANIME_COLORS.accent};
          letter-spacing: 0.02em;
        }

        .summary-pane {
          position: relative;
          z-index: 1;
          border-top: 1.5px solid ${ANIME_COLORS.secondary}44;
          background: linear-gradient(135deg,
            ${ANIME_COLORS.secondary}0d 0%,
            rgba(8,3,18,.6) 60%,
            ${ANIME_COLORS.secondary}09 100%
          );
        }
        @media (min-width: 1024px) {
          .summary-pane {
            border-top: none;
            border-left: 1.5px solid ${ANIME_COLORS.secondary}44;
          }
        }
        .summary-card {
          border: 1.5px solid ${ANIME_COLORS.secondary}55;
          background: linear-gradient(155deg, rgba(8,3,18,.95), rgba(12,5,24,.92));
          border-radius: 1rem;
          padding: 1.6rem;
          position: relative;
          overflow: hidden;
          animation: neonBreath 5s ease-in-out infinite;
        }
        .summary-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            ${ANIME_COLORS.secondary}06 3px, ${ANIME_COLORS.secondary}06 4px
          );
          pointer-events: none;
          animation: crtScan 7s linear infinite;
        }
        
        .price-section {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border: 1.5px solid ${ANIME_COLORS.accent}80;
          background: linear-gradient(135deg,
            ${ANIME_COLORS.accent}18 0%,
            rgba(8,3,18,.9) 55%,
            ${ANIME_COLORS.accent}0e 100%
          );
          border-radius: 10px;
          padding: 1.1rem 1.4rem;
          box-shadow: 0 0 24px ${ANIME_COLORS.accent}28, inset 0 0 14px ${ANIME_COLORS.accent}0e;
          flex: 1;
        }
        .price-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.54rem;
          letter-spacing: 0.44em;
          color: ${ANIME_COLORS.secondary};
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.24rem;
        }
        .price-val {
          font-size: 2.2rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1;
          animation: priceIn .4s ease both;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid ${ANIME_COLORS.secondary}28;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.76rem;
          letter-spacing: 0.04em;
          color: ${ANIME_COLORS.text}cc;
        }
        .summary-row:last-child { border-bottom: none; }
        .summary-row span:last-child { color: ${ANIME_COLORS.secondary}; font-weight: 700; }

        .feat-card {
          position: relative;
          padding: 0.7rem 0.9rem 0.75rem;
          border: 1px solid ${ANIME_COLORS.secondary}40;
          background: linear-gradient(135deg, ${ANIME_COLORS.secondary}0c 0%, transparent 70%);
          border-radius: 6px;
          overflow: hidden;
          animation: featIn .35s ease both;
        }
        .feat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, ${ANIME_COLORS.secondary}00, ${ANIME_COLORS.secondary}80, ${ANIME_COLORS.secondary}00);
          transform-origin: left;
        }
        .feat-pill-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.3em;
          color: ${ANIME_COLORS.accent};
          display: block;
          margin-bottom: 0.2rem;
        }
        .feat-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.74rem;
          letter-spacing: 0.04em;
          color: ${ANIME_COLORS.text};
        }

        .buy-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 0.9rem 2rem;
          margin-top: 1.5rem;
          display: inline-block;
          width: 100%;
          text-align: center;
          border: 1.5px solid ${ANIME_COLORS.secondary};
          background: linear-gradient(135deg, ${ANIME_COLORS.secondary}55, ${ANIME_COLORS.secondary}30);
          color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 22px ${ANIME_COLORS.secondary}50, inset 0 1px 0 ${ANIME_COLORS.secondary}70;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform .16s ease, box-shadow .16s ease;
        }
        .buy-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 80%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
          animation: shimmerBtn 3.5s ease-in-out infinite;
        }
        .buy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 34px ${ANIME_COLORS.secondary}75, inset 0 1px 0 ${ANIME_COLORS.secondary};
        }
        .buy-btn:active { transform: translateY(0); }

      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-transparent">
        <AnimeOrbField />
        <AnimeParticleField />
        <div className="absolute inset-0 -z-0 bg-black/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="merch-shell space-y-5">

            {/* ── STREET BANNER ──────────────────────── */}
            <div className="merch-card street-banner rounded-[1.5rem]">
              <div className="scan-line" />
              <span className="banner-ruby">S-Class Clearance</span>
              <h2 className={`banner-title ${cinzelFont.className}`}>
                AAKAR&nbsp;<span className="stroke-word">ELITE PASS</span>
              </h2>
              <p className="banner-sub">solo quests unlocked &nbsp;·&nbsp; concert access</p>
              <div className="banner-deco" />
            </div>

            {/* ── MAIN CARD ──────────────────────────── */}
            <section className="merch-card overflow-hidden rounded-[1.5rem] relative">
              <div className="scan-line" />
              <div className="pane-divider" />
              <div className="grid lg:grid-cols-2">

                {/* LEFT PANE — PASS */}
                <div className="p-6 lg:p-10 border-b border-[rgba(0,229,255,0.18)] lg:border-b-0 lg:border-r flex items-center justify-center relative z-10">
                    <div style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "320px",
                        padding: "2rem 1.5rem",
                        background: `linear-gradient(145deg, ${ANIME_COLORS.secondary}15 0%, rgba(8,10,18,0.6) 100%)`,
                        border: `1.5px solid ${ANIME_COLORS.secondary}40`,
                        borderRadius: "16px",
                        boxShadow: `0 0 30px ${ANIME_COLORS.secondary}20, inset 0 0 20px ${ANIME_COLORS.secondary}10`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }} className="hologram-pass">
                        <img src="/elitepass.png" alt="Aakar Elite Pass" className="w-full object-contain drop-shadow-[0_0_20px_rgba(0,229,255,0.5)]" />
                    </div>
                </div>

                {/* RIGHT PANE — DETAILS & ORDER SUMMARY */}
                <div className="summary-pane p-6 lg:p-10">
                  <div className="summary-card">
                    <div className="scan-line" />
                    <p className="info-tag relative z-10">Clearance: Granted</p>
                    <p className="relative z-10 font-mono text-[0.57rem] tracking-[0.44em] uppercase mt-1"
                      style={{ color: `${ANIME_COLORS.secondary}99` }}>
                      Premium Level
                    </p>
                    <h2 className={`info-title text-[clamp(1.8rem,4vw,2.8rem)] relative z-10 ${cinzelFont.className}`}>
                      Elite Clearance
                    </h2>
                    
                    <p className="info-desc relative z-10">
                        AAKAR ELITE unlocks your entire solo-quest roster in one move, plus a VIP seat at the ultimate boss-level concert night. Made for the protagonist who wants the full arc — no grinding through individual registrations.
                    </p>

                    <div className="mt-5 relative z-10 space-y-0">
                      <div className="summary-row">
                        <span>Solo Quests</span>
                        <span>Unlimited</span>
                      </div>
                      <div className="summary-row">
                        <span>Boss Battle Concert</span>
                        <span>Access Granted</span>
                      </div>
                    </div>

                    <div className="price-section relative z-10">
                        <div className="price-row">
                            <div>
                                <span className="price-label">Cost</span>
                                <div className="flex items-baseline gap-3">
                                    <span className="price-val">₹{currentPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/aakar-elite-pass/buy" className="buy-btn relative z-10">
                        Equip Elite Pass
                    </Link>
                  </div>

                  {/* MINI FEATURE CARDS */}
                  <div className="mt-5 grid grid-cols-2 gap-3 relative z-10">
                    {[
                      ["/ 01", "Solo Quests Unlocked"],
                      ["/ 02", "Boss Battle Access"],
                    ].map(([num, text], i) => (
                      <div
                        key={num}
                        className="feat-card"
                        style={{ animationDelay: `${i * 0.08 + 0.06}s` }}
                      >
                        <span className="feat-pill-num">{num}</span>
                        <span className="feat-text">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}
