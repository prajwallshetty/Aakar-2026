"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cinzelFont } from "@/lib/font";
import { getMerchVariant } from "@/lib/merchVariants";
import {
  AnimeParticleField,
  AnimeOrbField,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

import { Suspense } from "react";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"] as const;

function MerchBuyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedVariant = useMemo(
    () => getMerchVariant(searchParams.get("variant")),
    [searchParams]
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    size: "M",
  });
  const [error, setError] = useState("");

  const summary = useMemo(() => ({
    title: selectedVariant.title,
    price: `₹${selectedVariant.price}`,
    tag: selectedVariant.tag,
  }), [selectedVariant]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Name is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (!formData.phone.trim()) return setError("Phone number is required");

    const params = new URLSearchParams({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      size: formData.size,
      variant: selectedVariant.key,
    });

    router.push(`/merch/payment?${params.toString()}`);
  };

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        /* ── SHARED CARD SKIN (mirrors MerchPage .merch-card) ─── */
        @keyframes neonBreath {
          0%,100% { box-shadow: 0 0 28px ${ANIME_COLORS.primary}50, inset 0 0 16px ${ANIME_COLORS.primary}18; }
          50%      { box-shadow: 0 0 44px ${ANIME_COLORS.secondary}65, inset 0 0 22px ${ANIME_COLORS.secondary}28; }
        }
        @keyframes scanLine {
          0%   { top: -4px; opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes crtScan {
          from { background-position: 0 0; }
          to   { background-position: 0 80px; }
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
        @keyframes bannerGlitch {
          0%,92%,100% {
            transform: none;
            text-shadow: 0 0 18px ${ANIME_COLORS.primary}80, 0 0 40px ${ANIME_COLORS.primary}40;
          }
          93% { transform: translate(-3px, 0) skewX(-2deg); text-shadow: -4px 0 ${ANIME_COLORS.accent}, 4px 0 ${ANIME_COLORS.secondary}; }
          95% { transform: translate(3px, 0) skewX(2deg);  text-shadow: 4px 0 ${ANIME_COLORS.accent}, -4px 0 ${ANIME_COLORS.secondary}; }
          97% { transform: none; }
        }
        @keyframes shimmerBtn {
          0%   { left: -100%; }
          100% { left: 140%; }
        }
        @keyframes merchPanelIn {
          from { opacity: 0; transform: translateY(20px) scale(0.975); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes featIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes featSlash {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        @keyframes priceIn {
          from { letter-spacing: 0.18em; opacity: 0.4; }
          to   { letter-spacing: 0.04em; opacity: 1; }
        }
        @keyframes inputGlow {
          0%,100% { box-shadow: 0 0 12px ${ANIME_COLORS.primary}30, inset 0 0 6px ${ANIME_COLORS.primary}15; }
          50%      { box-shadow: 0 0 20px ${ANIME_COLORS.primary}50, inset 0 0 10px ${ANIME_COLORS.primary}25; }
        }

        .merch-shell { animation: merchPanelIn .5s cubic-bezier(.22,1,.36,1) both; }

        /* ── CARD BASE ──────────────────────────────── */
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

        /* ── STREET BANNER ─────────────────────────── */
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

        /* ── FORM PANE ──────────────────────────────── */
        .form-pane { position: relative; z-index: 1; }

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
          max-width: 44ch;
        }

        /* ── FIELD LABELS ───────────────────────────── */
        .field-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.54rem;
          letter-spacing: 0.44em;
          color: ${ANIME_COLORS.secondary};
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.4rem;
        }

        /* ── INPUTS / SELECT ────────────────────────── */
        .merch-input, .merch-select {
          width: 100%;
          background: linear-gradient(135deg, rgba(8,3,18,.92), rgba(12,5,24,.88));
          border: 1.5px solid ${ANIME_COLORS.primary}70;
          color: ${ANIME_COLORS.text};
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          padding: 0.72rem 1rem;
          border-radius: 6px;
          outline: none;
          transition: border-color .18s ease, box-shadow .18s ease;
          animation: inputGlow 5s ease-in-out infinite;
        }
        .merch-input::placeholder { color: ${ANIME_COLORS.text}44; letter-spacing: 0.04em; }
        .merch-input:focus, .merch-select:focus {
          border-color: ${ANIME_COLORS.accent};
          box-shadow: 0 0 22px ${ANIME_COLORS.accent}45, inset 0 0 10px ${ANIME_COLORS.accent}20;
          animation: none;
        }
        .merch-select option {
          background: #0a0314;
          color: ${ANIME_COLORS.text};
        }

        /* ── SIZE PILL GRID ─────────────────────────── */
        .size-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-top: 0.6rem;
        }
        .size-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 0.38rem 0.85rem;
          border-radius: 4px;
          border: 1.5px solid ${ANIME_COLORS.primary}55;
          background: transparent;
          color: ${ANIME_COLORS.text}88;
          cursor: pointer;
          transition: all .16s ease;
        }
        .size-pill:hover {
          border-color: ${ANIME_COLORS.primary}cc;
          color: ${ANIME_COLORS.text};
          transform: translateY(-1px);
          box-shadow: 0 0 14px ${ANIME_COLORS.primary}35;
        }
        .size-pill.active {
          border-color: ${ANIME_COLORS.accent};
          background: ${ANIME_COLORS.accent}20;
          color: ${ANIME_COLORS.text};
          box-shadow: 0 0 18px ${ANIME_COLORS.accent}50;
        }

        /* ── ERROR BOX ──────────────────────────────── */
        .error-box {
          border: 1.5px solid ${ANIME_COLORS.accent}90;
          background: ${ANIME_COLORS.accent}18;
          color: ${ANIME_COLORS.text};
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          padding: 0.7rem 1rem;
          border-radius: 6px;
          box-shadow: 0 0 14px ${ANIME_COLORS.accent}35;
        }

        /* ── BUTTONS ────────────────────────────────── */
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

        .back-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 0.78rem 1.6rem;
          border: 1.5px solid ${ANIME_COLORS.secondary}80;
          background: transparent;
          color: ${ANIME_COLORS.text}bb;
          border-radius: 5px;
          transition: all .16s ease;
          text-decoration: none;
          display: inline-block;
        }
        .back-btn:hover {
          border-color: ${ANIME_COLORS.secondary};
          color: ${ANIME_COLORS.text};
          box-shadow: 0 0 16px ${ANIME_COLORS.secondary}35;
          transform: translateY(-1px);
        }

        /* ── ORDER SUMMARY PANE ─────────────────────── */
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

        /* ── SUMMARY INNER CARD ─────────────────────── */
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

        /* ── PRICE ROW ──────────────────────────────── */
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
          margin-top: 1.4rem;
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
          font-size: 2.4rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1;
          animation: priceIn .4s ease both;
        }

        /* ── SUMMARY ROWS ───────────────────────────── */
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
        .summary-row span:last-child { color: ${ANIME_COLORS.text}; font-weight: 700; }

        /* ── FEAT CARD (step indicators) ───────────────── */
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
          animation: featSlash .55s cubic-bezier(.22,1,.36,1) both;
          animation-delay: inherit;
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
        .feat-glyph {
          position: absolute;
          top: 0.55rem; right: 0.65rem;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: ${ANIME_COLORS.accent};
          opacity: 0.45;
          animation: rubyPulse 2.5s ease-in-out infinite;
        }

        /* ── STEP BADGE ─────────────────────────────── */
        .step-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.56rem;
          letter-spacing: 0.42em;
          color: ${ANIME_COLORS.secondary};
          text-transform: uppercase;
          padding: 0.2rem 0.9rem;
          border: 1px solid ${ANIME_COLORS.secondary}60;
          background: ${ANIME_COLORS.secondary}12;
          border-radius: 2px;
          margin-bottom: 0.9rem;
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
              <span className="banner-ruby">Step 1 of 2 · Armor Up</span>
              <h2 className={`banner-title ${cinzelFont.className}`}>
                AAKAR&nbsp;<span className="stroke-word">ARMOR CLASS</span>
              </h2>
              <p className="banner-sub">add details &nbsp;·&nbsp; lock the size &nbsp;·&nbsp; proceed to payment</p>
              <div className="banner-deco" />
            </div>

            {/* ── MAIN CARD ──────────────────────────── */}
            <section className="merch-card overflow-hidden rounded-[1.5rem] relative">
              <div className="scan-line" />
              <div className="pane-divider" />
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

                {/* LEFT — FORM */}
                <div className="form-pane p-6 lg:p-10 border-b border-[rgba(255,100,0,0.18)] lg:border-b-0">
                  <span className="step-badge">/ 01 &nbsp; Add Details</span>
                  <p className="info-tag">Merch Purchase</p>
                  <h1 className={`info-title text-[clamp(2.2rem,5.5vw,3.8rem)] ${cinzelFont.className}`}>
                    Armor Class
                  </h1>
                  <p className="info-desc">
                    Add your size, email, and phone number. After this, you'll be taken to the payment.
                  </p>

                  <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-0">
                        <span className="field-label">Name</span>
                        <input
                          className="merch-input"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Your full name"
                        />
                      </label>
                      <label className="space-y-0">
                        <span className="field-label">Email</span>
                        <input
                          className="merch-input"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="name@example.com"
                        />
                      </label>
                      <label className="space-y-0 md:col-span-2">
                        <span className="field-label">Phone</span>
                        <input
                          className="merch-input"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="10-digit phone number"
                        />
                      </label>
                    </div>

                    {/* SIZE PILLS */}
                    <div>
                      <span className="field-label">Size</span>
                      <div className="size-grid">
                        {sizeOptions.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, size }))}
                            className={`size-pill${formData.size === size ? " active" : ""}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="error-box">
                        ⚠ &nbsp;{error}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button type="submit" className="buy-btn">
                        Continue to Payment
                      </button>
                      <Link href="/merch" className="back-btn">
                        ← Back
                      </Link>
                    </div>
                  </form>
                </div>

                {/* RIGHT — ORDER SUMMARY */}
                <div className="summary-pane p-6 lg:p-10">
                  <div className="summary-card">
                    <div className="scan-line" />
                    <p className="info-tag relative z-10">Order Summary</p>
                    <p className="relative z-10 font-mono text-[0.57rem] tracking-[0.44em] uppercase mt-1"
                      style={{ color: `${ANIME_COLORS.secondary}99` }}>
                      {summary.tag}
                    </p>
                    <h2 className={`info-title text-[clamp(1.8rem,4vw,2.8rem)] relative z-10 ${cinzelFont.className}`}>
                      {summary.title}
                    </h2>

                    <div className="mt-5 relative z-10 space-y-0">
                      <div className="summary-row">
                        <span>Price</span>
                        <span>{summary.price}</span>
                      </div>
                      <div className="summary-row">
                        <span>Sizes Available</span>
                        <span>XS → 4XL</span>
                      </div>
                      <div className="summary-row">
                        <span>Payment Method</span>
                        <span>UPI Scanner</span>
                      </div>
                    </div>

                    <div className="price-row relative z-10">
                      <div>
                        <span className="price-label">Total</span>
                        <span className="price-val">{summary.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* MINI FEATURE CARDS */}
                  <div className="mt-5 grid grid-cols-2 gap-3 relative z-10">
                    {[
                      ["/ 01", "Limited Drop"],
                      ["/ 02", "Premium Fabric"],
                      ["/ 03", "Secure UPI"],
                      ["/ 04", "Pickup At Fest"],
                    ].map(([num, text], i) => (
                      <div
                        key={num}
                        className="feat-card"
                        style={{ animationDelay: `${i * 0.08 + 0.06}s` }}
                      >
                        <div className="feat-glyph" style={{ animationDelay: `${i * 0.6}s` }} />
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

export default function MerchBuy() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center font-mono text-[#00E5FF] tracking-[0.2em] uppercase text-sm">
        Loading Armory...
      </div>
    }>
      <MerchBuyContent />
    </Suspense>
  );
}