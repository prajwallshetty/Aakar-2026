"use client";

import Link from "next/link";
import { cinzelFont } from "@/lib/font";
import {
  AnimeParticleField,
  AnimeOrbField,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

export default function AakarElitePage() {
  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        /* ── SHARED ANIMATIONS ───────────────────────── */
        @keyframes bannerGlitch {
          0%,92%,100% {
            transform: none;
            text-shadow: 0 0 18px ${ANIME_COLORS.primary}80, 0 0 40px ${ANIME_COLORS.primary}40;
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
          0%,100% { box-shadow: 0 0 28px ${ANIME_COLORS.primary}50, inset 0 0 16px ${ANIME_COLORS.primary}18; }
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
          border: 1.5px solid ${ANIME_COLORS.primary}80;
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
            ${ANIME_COLORS.primary}07 3px,
            ${ANIME_COLORS.primary}07 4px
          );
          pointer-events: none;
          z-index: 0;
          animation: crtScan 7s linear infinite;
        }
        .scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.primary}55, transparent);
          animation: scanLine 5s linear infinite;
          pointer-events: none;
          z-index: 5;
        }

        /* ── STREET BANNER ───────────────────────────── */
        .street-banner {
          text-align: center;
          padding: 2.4rem 1rem 2rem;
          border-bottom: 1.5px solid ${ANIME_COLORS.primary}44;
          position: relative;
          z-index: 1;
        }
        .street-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 72% 90% at 50% 115%, ${ANIME_COLORS.primary}1e 0%, transparent 70%),
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
          text-shadow: 0 0 20px ${ANIME_COLORS.primary}75, 0 0 45px ${ANIME_COLORS.primary}35;
          animation: bannerGlitch 8s ease-in-out infinite;
        }
        .banner-title .stroke-word {
          -webkit-text-stroke: 2px ${ANIME_COLORS.primary};
          color: transparent;
          filter: drop-shadow(0 0 10px ${ANIME_COLORS.primary}cc);
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
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.primary}cc, transparent);
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
              ${ANIME_COLORS.primary}55 20%,
              ${ANIME_COLORS.primary}55 80%,
              transparent 100%
            );
            pointer-events: none;
          }
        }

        /* ── HOLOGRAPHIC PASS CARD (Left Pane) ────────────────── */
        .hologram-pass {
          position: relative;
          width: 100%;
          max-width: 320px;
          aspect-ratio: 0.6 / 1;
          margin: 0 auto;
          background: linear-gradient(145deg, ${ANIME_COLORS.primary}20 0%, ${ANIME_COLORS.purple}20 100%);
          border: 2px solid ${ANIME_COLORS.accent};
          border-radius: 12px;
          box-shadow: 0 0 20px ${ANIME_COLORS.accent}50, inset 0 0 30px ${ANIME_COLORS.accent}20;
          overflow: hidden;
          animation: hologramPulse 4s infinite alternate ease-in-out;
        }
        .hologram-header {
          background: ${ANIME_COLORS.accent}30;
          padding: 1rem;
          text-align: center;
          border-bottom: 2px solid ${ANIME_COLORS.accent}80;
        }
        .hologram-title {
          font-family: 'Cinzel', serif;
          font-size: 1.8rem;
          font-weight: bold;
          color: #fff;
          text-transform: uppercase;
          text-shadow: 0 0 10px ${ANIME_COLORS.accent};
          letter-spacing: 0.1em;
        }
        .hologram-level {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.4em;
          color: ${ANIME_COLORS.secondary};
        }
        .hologram-body {
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .hologram-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 1.5px solid ${ANIME_COLORS.accent};
          background: radial-gradient(circle, ${ANIME_COLORS.accent}20 0%, transparent 60%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          color: #fff;
          text-shadow: 0 0 10px ${ANIME_COLORS.accent};
          animation: spin 10s linear infinite;
        }
        .hologram-icon::after {
            content: 'AAKAR 2026';
            font-size: 0.8rem;
            letter-spacing: 0.1em;
            animation: spin 10s linear infinite reverse;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .hologram-barcode {
          width: 100%;
          height: 45px;
          background: repeating-linear-gradient(
            90deg,
            ${ANIME_COLORS.accent}80,
            ${ANIME_COLORS.accent}80 2px,
            transparent 2px,
            transparent 4px,
            ${ANIME_COLORS.accent}a0 4px,
            ${ANIME_COLORS.accent}a0 7px,
            transparent 7px,
            transparent 10px
          );
          opacity: 0.8;
        }
        .hologram-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: ${ANIME_COLORS.background}90;
          padding: 0.8rem;
          text-align: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: ${ANIME_COLORS.secondary};
          border-top: 1px solid ${ANIME_COLORS.accent}50;
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
          text-shadow: 0 0 30px ${ANIME_COLORS.primary}50;
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
          border-top: 1.5px solid ${ANIME_COLORS.primary}44;
          background: linear-gradient(135deg,
            ${ANIME_COLORS.primary}0d 0%,
            rgba(8,3,18,.6) 60%,
            ${ANIME_COLORS.secondary}09 100%
          );
        }
        @media (min-width: 1024px) {
          .summary-pane {
            border-top: none;
            border-left: 1.5px solid ${ANIME_COLORS.primary}44;
          }
        }
        .summary-card {
          border: 1.5px solid ${ANIME_COLORS.primary}55;
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
            ${ANIME_COLORS.primary}06 3px, ${ANIME_COLORS.primary}06 4px
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
        .price-old {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.2rem;
          color: ${ANIME_COLORS.text}50;
          text-decoration: line-through;
          letter-spacing: 0.1em;
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
        .limited-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: ${ANIME_COLORS.accent};
          background: ${ANIME_COLORS.accent}20;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          border: 1px solid ${ANIME_COLORS.accent};
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          display: inline-block;
          animation: rubyPulse 2s infinite;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid ${ANIME_COLORS.primary}28;
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
          border: 1px solid ${ANIME_COLORS.primary}40;
          background: linear-gradient(135deg, ${ANIME_COLORS.primary}0c 0%, transparent 70%);
          border-radius: 6px;
          overflow: hidden;
          animation: featIn .35s ease both;
        }
        .feat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, ${ANIME_COLORS.primary}00, ${ANIME_COLORS.primary}80, ${ANIME_COLORS.primary}00);
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
          border: 1.5px solid ${ANIME_COLORS.primary};
          background: linear-gradient(135deg, ${ANIME_COLORS.primary}55, ${ANIME_COLORS.primary}30);
          color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 22px ${ANIME_COLORS.primary}50, inset 0 1px 0 ${ANIME_COLORS.primary}70;
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
          box-shadow: 0 0 34px ${ANIME_COLORS.primary}75, inset 0 1px 0 ${ANIME_COLORS.primary};
        }
        .buy-btn:active { transform: translateY(0); }

      `}</style>

      <main className="relative min-h-screen overflow-hidden">
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

                {/* LEFT PANE — HOLOGRAPHIC PASS */}
                <div className="p-6 lg:p-10 border-b border-[rgba(255,77,0,0.18)] lg:border-b-0 lg:border-r border-[rgba(255,77,0,0.18)] flex items-center justify-center relative z-10">
                    <div className="hologram-pass">
                        <div className="hologram-header">
                            <div className="hologram-title">Aakar 2026</div>
                            <div className="hologram-level">S-CLASS CLEARANCE</div>
                        </div>
                        <div className="hologram-body">
                            <div className="hologram-icon"></div>
                            <div className="hologram-barcode"></div>
                            <div style={{fontFamily: "'Share Tech Mono', monospace", color: "#fff", fontSize: "1rem", letterSpacing: "0.2em", textShadow: `0 0 10px ${ANIME_COLORS.accent}`}}>ELITE ACCESS</div>
                        </div>
                        <div className="hologram-bottom">
                            ID: AKR-2026-X19
                        </div>
                    </div>
                </div>

                {/* RIGHT PANE — DETAILS & ORDER SUMMARY */}
                <div className="summary-pane p-6 lg:p-10">
                  <div className="summary-card">
                    <div className="scan-line" />
                    <p className="info-tag relative z-10">Access Granted</p>
                    <p className="relative z-10 font-mono text-[0.57rem] tracking-[0.44em] uppercase mt-1"
                      style={{ color: `${ANIME_COLORS.secondary}99` }}>
                      Premium Level
                    </p>
                    <h2 className={`info-title text-[clamp(1.8rem,4vw,2.8rem)] relative z-10 ${cinzelFont.className}`}>
                      Elite Clearance
                    </h2>
                    
                    <p className="info-desc relative z-10">
                        AAKAR ELITE gives one-pass access to the complete solo-event lineup, plus the high-energy show nights that define the fest. Designed for students who want the full Aakar experience without selecting each event individually.
                    </p>

                    <div className="mt-5 relative z-10 space-y-0">
                      <div className="summary-row">
                        <span>Solo Events</span>
                        <span>Unlimited</span>
                      </div>
                      <div className="summary-row">
                        <span>Concert</span>
                        <span>Entry Included</span>
                      </div>
                    </div>

                    <div className="price-section relative z-10">
                        <div className="price-row">
                            <div>
                                <span className="limited-tag">Limited Offer till 15th!</span>
                                <span className="price-label">Cost</span>
                                <div className="flex items-center gap-3">
                                    <span className="price-old">₹499</span>
                                    <span className="price-val">₹399</span>
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
                      ["/ 01", "Solo Events Unlocked"],
                      ["/ 02", "Concert Access"],
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
