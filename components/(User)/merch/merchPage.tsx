"use client";

import { Suspense } from "react";
import Link from "next/link";
import { cinzelFont } from "@/lib/font";
import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { defaultMerchVariantKey, getMerchVariant, merchVariants } from "@/lib/merchVariants";
import {
  AnimeParticleField,
  AnimeOrbField,
  AnimeCardWrapper,
  AnimeSectionHeading,
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

function TshirtModel({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
  const centeredScene = scene.clone(true);

  return (
    <group rotation={[0.02, -0.32, 0]}>
      <Center>
        <primitive object={centeredScene} scale={0.9} position={[0, 0, 0]} />
      </Center>
    </group>
  );
}

export default function MerchPage() {
  const [selectedVariantKey, setSelectedVariantKey] = useState(defaultMerchVariantKey);
  const selectedVariant = useMemo(() => getMerchVariant(selectedVariantKey), [selectedVariantKey]);
  const merchModelUrl = selectedVariant.modelUrl;

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        /* ── STREET-ART BANNER ───────────────────────── */
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
        @keyframes featSlash {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        @keyframes featIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes orbDrift {
          0%,100% { transform: translate(0,0) scale(1); opacity: .18; }
          33%      { transform: translate(18px,-12px) scale(1.05); opacity: .28; }
          66%      { transform: translate(-10px, 8px) scale(.96); opacity: .22; }
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
        .banner-ruby::after {
          content: '◆';
          font-size: 0.35rem;
          opacity: 0.7;
        }
        .banner-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.05em;
          line-height: 0.9;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 0 20px ${ANIME_COLORS.primary}75, 0 0 45px ${ANIME_COLORS.primary}35;
          animation: bannerGlitch 8s ease-in-out infinite;
          position: relative;
        }
        .banner-line-1 {
          font-size: clamp(3rem, 9vw, 7.2rem);
          display: block;
        }
        .banner-line-2 {
          font-size: clamp(1.5rem, 4.8vw, 4rem);
          display: block;
          letter-spacing: 0.28em;
        }
        .banner-line-2 .stroke-word {
          -webkit-text-stroke: 1.5px ${ANIME_COLORS.primary};
          color: transparent;
          filter: drop-shadow(0 0 8px ${ANIME_COLORS.primary}cc);
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
          width: 72px;
          height: 2px;
          margin: 0.8rem auto 0;
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.primary}cc, transparent);
          animation: rubyPulse 2.8s ease-in-out infinite;
        }

        /* ── MODEL PANE ──────────────────────────────── */
        .model-pane {
          position: relative;
          z-index: 1;
        }
        .model-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(55px);
          animation: orbDrift 10s ease-in-out infinite;
        }
        .floor-shadow {
          position: absolute;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 14px;
          background: radial-gradient(ellipse at center, rgba(0,0,0,.75) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .drag-hint {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          margin: 0.6rem auto 0;
          width: fit-content;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.38em;
          color: ${ANIME_COLORS.text}88;
          text-transform: uppercase;
          border: 1px solid ${ANIME_COLORS.primary}44;
          padding: 0.38rem 1.1rem;
          border-radius: 99px;
          background: rgba(0,0,0,.45);
          backdrop-filter: blur(6px);
        }
        .drag-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: ${ANIME_COLORS.accent};
          animation: rubyPulse 1.7s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* ── VARIANT PILLS ───────────────────────────── */
        .variant-rail {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.3rem;
        }
        .variant-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 4px;
          border: 1.5px solid ${ANIME_COLORS.primary}55;
          background: transparent;
          color: ${ANIME_COLORS.text}88;
          cursor: pointer;
          transition: all .16s ease;
          position: relative;
          overflow: hidden;
        }
        .variant-pill:hover {
          border-color: ${ANIME_COLORS.primary}cc;
          color: ${ANIME_COLORS.text};
          transform: translateY(-1px);
          box-shadow: 0 0 14px ${ANIME_COLORS.primary}35;
        }
        .variant-pill.active {
          border-color: ${ANIME_COLORS.accent};
          background: ${ANIME_COLORS.accent}20;
          color: ${ANIME_COLORS.text};
          box-shadow: 0 0 18px ${ANIME_COLORS.accent}50;
        }

        /* ── INFO PANE ───────────────────────────────── */
        .info-pane { position: relative; z-index: 1; }
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
          max-width: 40ch;
        }

        /* ── FEATURES GRID ───────────────────────────── */
        .feat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
          margin-top: 1.8rem;
        }
        @media (max-width: 520px) { .feat-grid { grid-template-columns: 1fr; } }

        .feat-card {
          position: relative;
          padding: 0.7rem 0.9rem 0.75rem;
          border: 1px solid ${ANIME_COLORS.primary}40;
          background: linear-gradient(135deg, ${ANIME_COLORS.primary}0c 0%, transparent 70%);
          border-radius: 6px;
          overflow: hidden;
          animation: featIn .35s ease both;
        }
        .feat-card:nth-child(1) { animation-delay: .06s; }
        .feat-card:nth-child(2) { animation-delay: .14s; }
        .feat-card:nth-child(3) { animation-delay: .22s; }
        .feat-card:nth-child(4) { animation-delay: .30s; }
        .feat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, ${ANIME_COLORS.primary}00, ${ANIME_COLORS.primary}80, ${ANIME_COLORS.primary}00);
          transform-origin: left;
          animation: featSlash .55s cubic-bezier(.22,1,.36,1) both;
          animation-delay: inherit;
        }
        .feat-pill-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.3em;
          color: ${ANIME_COLORS.accent};
          display: block;
          margin-bottom: 0.3rem;
        }
        .feat-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.76rem;
          letter-spacing: 0.04em;
          color: ${ANIME_COLORS.text};
          line-height: 1.35;
        }
        .feat-glyph {
          position: absolute;
          top: 0.55rem; right: 0.65rem;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: ${ANIME_COLORS.accent};
          opacity: 0.45;
          animation: rubyPulse 2.5s ease-in-out infinite;
        }
        .feat-card:nth-child(2) .feat-glyph { animation-delay: .6s; }
        .feat-card:nth-child(3) .feat-glyph { animation-delay: 1.2s; }
        .feat-card:nth-child(4) .feat-glyph { animation-delay: 1.8s; }

        /* ── PRICE / BUY ─────────────────────────────── */
        .price-row {
          margin-top: 2rem;
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
          padding: 1.3rem 1.6rem;
          box-shadow: 0 0 24px ${ANIME_COLORS.accent}28, inset 0 0 14px ${ANIME_COLORS.accent}0e;
        }
        .price-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.54rem;
          letter-spacing: 0.44em;
          color: ${ANIME_COLORS.secondary};
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.28rem;
        }
        .price-val {
          font-size: 2.6rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1;
          animation: priceIn .4s ease both;
        }
        .buy-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 0.78rem 1.8rem;
          border: 1.5px solid ${ANIME_COLORS.primary};
          background: linear-gradient(135deg, ${ANIME_COLORS.primary}55, ${ANIME_COLORS.primary}30);
          color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 22px ${ANIME_COLORS.primary}50, inset 0 1px 0 ${ANIME_COLORS.primary}70;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
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

        /* ── DIVIDER ─────────────────────────────────── */
        .pane-divider {
          display: none;
        }
        @media (min-width: 1024px) {
          .pane-divider {
            display: block;
            position: absolute;
            top: 5%;
            bottom: 5%;
            left: 50%;
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

        /* ── MOBILE RESPONSIVE ───────────────────────── */
        @media (max-width: 640px) {
          .street-banner { padding: 1.6rem 0.9rem 1.4rem; }
          .banner-ruby { font-size: 0.5rem; letter-spacing: 0.3em; padding: 0.2rem 0.8rem; }
          .banner-sub { font-size: 0.5rem; letter-spacing: 0.3em; }
          .banner-deco { width: 48px; }

          .model-pane { padding: 1.2rem 1rem; }
          .info-pane  { padding: 1.2rem 1rem; }

          .drag-hint { font-size: 0.52rem; letter-spacing: 0.28em; padding: 0.32rem 0.8rem; }

          .variant-rail { gap: 0.4rem; margin-top: 1rem; }
          .variant-pill { font-size: 0.55rem; padding: 0.36rem 0.75rem; letter-spacing: 0.15em; }

          .info-tag { font-size: 0.5rem; letter-spacing: 0.38em; }
          .info-desc { font-size: 0.74rem; max-width: 100%; padding-left: 0.75rem; }

          .feat-grid { grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1.2rem; }
          .feat-card { padding: 0.6rem 0.7rem; }
          .feat-pill-num { font-size: 0.45rem; }
          .feat-text { font-size: 0.68rem; }

          .price-row { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.1rem 1.2rem; margin-top: 1.4rem; }
          .price-val { font-size: 2rem; }
          .buy-btn { width: 100%; text-align: center; padding: 0.75rem 1rem; font-size: 0.65rem; }
        }

        @media (max-width: 400px) {
          .feat-grid { grid-template-columns: 1fr; }
          .banner-line-1 { font-size: clamp(2.4rem, 11vw, 3rem); }
          .banner-line-2 { font-size: clamp(1.1rem, 5.5vw, 1.5rem); }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .model-pane { padding: 2rem; }
          .info-pane  { padding: 2rem; }
          .info-desc  { max-width: 100%; }
          .feat-grid  { grid-template-columns: 1fr 1fr; }
          .price-row  { flex-direction: row; }
        }
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
              <span className="banner-ruby">Limited Drop · Fest Collection</span>
              <h2 className={`banner-title ${cinzelFont.className}`}>
                <span className="banner-line-1">AAKAR</span>
                <span className="banner-line-2"><span className="stroke-word">STREETWEAR</span>&nbsp;DROP</span>
              </h2>
              <p className="banner-sub">wear the story &nbsp;·&nbsp; own the night &nbsp;·&nbsp; live the arc</p>
              <div className="banner-deco" />
            </div>

            {/* ── PRODUCT CARD ───────────────────────── */}
            <section className="merch-card overflow-hidden rounded-[1.5rem] relative">
              <div className="scan-line" />
              <div className="pane-divider" />
              <div className="grid lg:grid-cols-[1fr_1fr]">

                {/* LEFT — 3D MODEL */}
                <div className="model-pane p-6 lg:p-10 border-b border-[rgba(255,100,0,0.18)] lg:border-b-0">
                  <div className="model-orb w-60 h-60 -top-16 -left-14"
                    style={{ background: `${ANIME_COLORS.secondary}22` }} />
                  <div className="model-orb w-44 h-44 bottom-4 right-4"
                    style={{ background: `${ANIME_COLORS.primary}1c`, animationDelay: '3.5s' }} />

                  <div className="relative mx-auto flex h-[380px] md:h-[500px] w-full max-w-[500px] items-center justify-center">
                    <div className="w-full flex justify-center">
                      {merchModelUrl ? (
                        <div className="h-[340px] md:h-[450px] w-full max-w-[400px] overflow-hidden">
                          <Canvas camera={{ position: [0, 0, 6.6], fov: 34 }} dpr={[1, 1.5]}>
                            <ambientLight intensity={0.9} />
                            <hemisphereLight intensity={0.95} groundColor="#cdd6ff" />
                            <directionalLight position={[4, 8, 5]} intensity={1.35} />
                            <Suspense fallback={null}>
                              <Bounds fit clip observe margin={5.8}>
                                <TshirtModel modelUrl={merchModelUrl} />
                              </Bounds>
                              <Environment preset="studio" frames={1} />
                            </Suspense>
                            <OrbitControls
                              enablePan={false}
                              minDistance={3.6}
                              maxDistance={8}
                              minPolarAngle={Math.PI / 2.7}
                              maxPolarAngle={Math.PI / 1.85}
                              autoRotate
                              autoRotateSpeed={0.95}
                            />
                          </Canvas>
                        </div>
                      ) : (
                        <div className="flex h-[450px] w-[320px] items-center justify-center text-center">
                          <p className="info-tag px-6 text-xs uppercase">3D model not configured</p>
                        </div>
                      )}
                    </div>
                    <div className="floor-shadow" />
                  </div>

                  <div className="drag-hint">
                    <span className="drag-dot" />
                    drag model to rotate
                  </div>

                  <div className="variant-rail">
                    {merchVariants.map((variant) => {
                      const active = variant.key === selectedVariantKey;
                      return (
                        <button
                          key={variant.key}
                          type="button"
                          onClick={() => setSelectedVariantKey(variant.key)}
                          className={`variant-pill${active ? " active" : ""}`}
                        >
                          {variant.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT — PRODUCT INFO */}
                <div className="info-pane p-6 lg:p-10">
                  <p className="info-tag">{selectedVariant.tag}</p>
                  <h1 className={`info-title text-[clamp(2.2rem,5.5vw,4.2rem)] ${cinzelFont.className}`}>
                    {selectedVariant.title}
                  </h1>

                  <p className="info-desc">{selectedVariant.description}</p>

                  {/* FEATURES — 2×2 grid */}
                  <div className="feat-grid">
                    {selectedVariant.features.map((item, index) => (
                      <div key={item} className="feat-card">
                        <div className="feat-glyph" />
                        <span className="feat-pill-num">/ {String(index + 1).padStart(2, "0")}</span>
                        <span className="feat-text">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* PRICE + BUY */}
                  <div className="price-row">
                    <div>
                      <span className="price-label">Selected Price</span>
                      <span className="price-val">₹{selectedVariant.price}</span>
                    </div>
                    <Link
                      href={`/merch/buy?variant=${selectedVariant.key}`}
                      className="buy-btn"
                    >
                      Buy Now
                    </Link>
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