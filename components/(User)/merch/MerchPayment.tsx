"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createMerchOrder } from "@/backend/merch";
import { cinzelFont } from "@/lib/font";
import { getMerchVariant } from "@/lib/merchVariants";
import { 
  AnimeCardWrapper, 
  AnimeSectionHeading, 
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS,
  AnimeOrbField,
  AnimeParticleField
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const merchUpiId = "amankm@slc";
const fixedMerchPrice = 399;
const merchPayeeName = "Aakar Merch";

import { Suspense } from "react";


function MerchPaymentContent() {
  const params = useSearchParams();
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const order = useMemo(() => ({
    name: params.get("name") || "",
    email: params.get("email") || "",
    phone: params.get("phone") || "",
    size: params.get("size") || "M",
    variant: getMerchVariant(params.get("variant")),
  }), [params]);

  const upiPaymentUrl = useMemo(() => {
    const amount = fixedMerchPrice.toFixed(2);
    const note = `${order.variant.title} (${order.size})`;
    return `upi://pay?pa=${encodeURIComponent(merchUpiId)}&pn=${encodeURIComponent(merchPayeeName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
  }, [order.size, order.variant.title]);

  const generatedQrImageUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiPaymentUrl)}`;
  }, [upiPaymentUrl]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshotPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!transactionId.trim()) {
      setError("Transaction ID is required");
      return;
    }

    if (!screenshotFile) {
      setError("Screenshot is required");
      return;
    }

    setLoading(true);

    let screenshotUrl: string | null = null;
    try {
      const formData = new FormData();
      formData.append("file", screenshotFile);

      const uploadResponse = await fetch("/api/merch/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult?.url) {
        setError(uploadResult?.error || "Failed to upload screenshot. Please try again.");
        setLoading(false);
        return;
      }

      screenshotUrl = uploadResult.url;
      if (!screenshotUrl) {
        setError("Failed to upload screenshot. Please try again.");
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Error uploading screenshot. Please try again.");
      setLoading(false);
      return;
    }

    const response = await createMerchOrder({
      name: order.name,
      email: order.email,
      phone: order.phone,
      merchVariant: order.variant.key,
      transactionId: transactionId.trim(),
      size: order.size as "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "XXXXL",
      paymentScreenshotUrl: screenshotUrl,
    });
    setLoading(false);

    if (response.error) {
      setError(typeof response.error === "string" ? response.error : Object.values(response.error)[0] || "Failed to save order");
      return;
    }

    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
        /* ── SHARED CARD SKIN (mirrors MerchPage .merch-card) ─── */
        @keyframes neonBreath {
          0%,100% { box-shadow: 0 0 28px ${ANIME_COLORS.purple}50, inset 0 0 16px ${ANIME_COLORS.purple}18; }
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
            text-shadow: 0 0 18px ${ANIME_COLORS.purple}80, 0 0 40px ${ANIME_COLORS.purple}40;
          }
          93% { transform: translate(-3px, 0) skewX(-2deg); text-shadow: -4px 0 ${ANIME_COLORS.purple}, 4px 0 ${ANIME_COLORS.secondary}; }
          95% { transform: translate(3px, 0) skewX(2deg);  text-shadow: 4px 0 ${ANIME_COLORS.secondary}, -4px 0 ${ANIME_COLORS.purple}; }
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
        @keyframes inputGlow {
          0%,100% { box-shadow: 0 0 12px ${ANIME_COLORS.purple}30, inset 0 0 6px ${ANIME_COLORS.purple}15; }
          50%      { box-shadow: 0 0 20px ${ANIME_COLORS.purple}50, inset 0 0 10px ${ANIME_COLORS.purple}25; }
        }

        .merch-shell { animation: merchPanelIn .5s cubic-bezier(.22,1,.36,1) both; }

        /* ── CARD BASE ──────────────────────────────── */
        .merch-card {
          background: linear-gradient(155deg, rgba(8,3,18,.97) 0%, rgba(15,5,30,.95) 55%, rgba(8,3,18,.98) 100%);
          border: 1.5px solid ${ANIME_COLORS.purple}80;
          animation: neonBreath 5s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        .merch-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, ${ANIME_COLORS.purple}07 3px, ${ANIME_COLORS.purple}07 4px);
          pointer-events: none;
          z-index: 0;
          animation: crtScan 7s linear infinite;
        }
        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.purple}55, transparent);
          animation: scanLine 5s linear infinite; pointer-events: none; z-index: 5;
        }

        /* ── STREET BANNER ─────────────────────────── */
        .street-banner { text-align: center; padding: 2.4rem 1rem 2rem; border-bottom: 1.5px solid ${ANIME_COLORS.purple}44; position: relative; z-index: 1; }
        .street-banner::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 72% 90% at 50% 115%, ${ANIME_COLORS.purple}1e 0%, transparent 70%),
                      radial-gradient(ellipse 38% 55% at 18% 50%, ${ANIME_COLORS.accent}12 0%, transparent 60%);
        }
        .banner-ruby {
          display: inline-flex; align-items: center; gap: 0.6rem; font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.45em; color: ${ANIME_COLORS.accent}; text-transform: uppercase; padding: 0.22rem 1.1rem; border: 1px solid ${ANIME_COLORS.accent}80; background: ${ANIME_COLORS.accent}16; clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%); animation: rubyPulse 3s ease-in-out infinite; margin-bottom: 1rem;
        }
        .banner-ruby::before, .banner-ruby::after { content: '◆'; font-size: 0.35rem; opacity: 0.7; }
        .banner-title {
          display: block;
          font-size: clamp(2.2rem, 8vw, 3.8rem);
          line-height: 0.9;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 0 20px ${ANIME_COLORS.purple}75, 0 0 45px ${ANIME_COLORS.purple}35;
          animation: bannerGlitch 8s ease-in-out infinite;
          position: relative;
        }
        .banner-title .stroke-word {
          -webkit-text-stroke: 2px ${ANIME_COLORS.purple};
          color: transparent;
          filter: drop-shadow(0 0 10px ${ANIME_COLORS.purple}cc);
        }
        .banner-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.5em; color: ${ANIME_COLORS.secondary}; margin-top: 0.9rem; text-transform: uppercase; }
        .banner-deco { width: 72px; height: 2px; margin: 0.8rem auto 0; background: linear-gradient(90deg, transparent, ${ANIME_COLORS.purple}cc, transparent); animation: rubyPulse 2.8s ease-in-out infinite; }


        /* ── FORM PANE ──────────────────────────────── */
        .form-pane { position: relative; z-index: 1; }
        .info-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.57rem; letter-spacing: 0.5em; color: ${ANIME_COLORS.secondary}; text-transform: uppercase; animation: tagFlicker 9s ease-in-out infinite; }
        .info-title { letter-spacing: 0.04em; color: #fff; line-height: 0.9; margin-top: 0.4rem; text-transform: uppercase; text-shadow: 0 0 30px ${ANIME_COLORS.purple}50; }
        .info-desc { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; line-height: 1.8; color: ${ANIME_COLORS.text}; margin-top: 1.2rem; padding-left: 1.1rem; border-left: 2px solid ${ANIME_COLORS.accent}; letter-spacing: 0.02em; max-width: 44ch; }
        .field-label { font-family: 'Share Tech Mono', monospace; font-size: 0.54rem; letter-spacing: 0.44em; color: ${ANIME_COLORS.secondary}; text-transform: uppercase; display: block; margin-bottom: 0.4rem; }

        /* ── INPUTS ────────────────────────── */
        .merch-input { width: 100%; background: linear-gradient(135deg, rgba(8,3,18,.92), rgba(12,5,24,.88)); border: 1.5px solid ${ANIME_COLORS.purple}70; color: ${ANIME_COLORS.text}; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; letter-spacing: 0.04em; padding: 0.72rem 1rem; border-radius: 6px; outline: none; transition: border-color .18s ease, box-shadow .18s ease; animation: inputGlow 5s ease-in-out infinite; }
        .merch-input::placeholder { color: ${ANIME_COLORS.text}90; letter-spacing: 0.04em; }
        .merch-input:focus { border-color: ${ANIME_COLORS.accent}; box-shadow: 0 0 22px ${ANIME_COLORS.accent}45, inset 0 0 10px ${ANIME_COLORS.accent}20; animation: none; }
        .merch-input[type="file"]::file-selector-button { background: linear-gradient(135deg, ${ANIME_COLORS.purple}40, ${ANIME_COLORS.purple}20); color: ${ANIME_COLORS.text}; border: 1px solid ${ANIME_COLORS.purple}; padding: 6px 10px; margin-right: 12px; border-radius: 4px; font-family: 'Share Tech Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; }
        .merch-input[type="file"]::file-selector-button:hover { background: linear-gradient(135deg, ${ANIME_COLORS.purple}50, ${ANIME_COLORS.purple}30); box-shadow: 0 0 12px ${ANIME_COLORS.purple}60; }

        .error-box { border: 1.5px solid ${ANIME_COLORS.accent}90; background: ${ANIME_COLORS.accent}18; color: ${ANIME_COLORS.text}; font-family: 'Share Tech Mono', monospace; font-size: 0.78rem; letter-spacing: 0.06em; padding: 0.7rem 1rem; border-radius: 6px; box-shadow: 0 0 14px ${ANIME_COLORS.accent}35; }

        /* ── BUTTONS ────────────────────────────────── */
        .buy-btn { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.28em; text-transform: uppercase; padding: 0.78rem 1.8rem; border: 1.5px solid ${ANIME_COLORS.purple}; background: linear-gradient(135deg, ${ANIME_COLORS.purple}55, ${ANIME_COLORS.purple}30); color: #fff; border-radius: 5px; box-shadow: 0 0 22px ${ANIME_COLORS.purple}50, inset 0 1px 0 ${ANIME_COLORS.purple}70; white-space: nowrap; cursor: pointer; position: relative; overflow: hidden; transition: transform .16s ease, box-shadow .16s ease; }
        .buy-btn::after { content: ''; position: absolute; top: 0; left: -120%; width: 80%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent); animation: shimmerBtn 3.5s ease-in-out infinite; }
        .buy-btn:hover { transform: translateY(-2px); box-shadow: 0 0 34px ${ANIME_COLORS.purple}75, inset 0 1px 0 ${ANIME_COLORS.purple}; }
        .buy-btn:active { transform: translateY(0); }
        .buy-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .back-btn { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.28em; text-transform: uppercase; padding: 0.78rem 1.6rem; border: 1.5px solid ${ANIME_COLORS.secondary}80; background: transparent; color: ${ANIME_COLORS.text}bb; border-radius: 5px; transition: all .16s ease; text-decoration: none; display: inline-block; }
        .back-btn:hover { border-color: ${ANIME_COLORS.secondary}; color: ${ANIME_COLORS.text}; box-shadow: 0 0 16px ${ANIME_COLORS.secondary}35; transform: translateY(-1px); }

        /* ── ORDER SUMMARY PANE ─────────────────────── */
        .summary-pane { position: relative; z-index: 1; border-top: 1.5px solid ${ANIME_COLORS.purple}44; background: linear-gradient(135deg, ${ANIME_COLORS.purple}0d 0%, rgba(15,5,30,.6) 60%, ${ANIME_COLORS.secondary}09 100%); }
        @media (min-width: 1024px) { .summary-pane { border-top: none; } }
        .summary-card { border: 1.5px solid ${ANIME_COLORS.purple}55; background: linear-gradient(155deg, rgba(8,3,18,.95), rgba(15,5,30,.92)); border-radius: 1rem; padding: 1.6rem; position: relative; overflow: hidden; animation: neonBreath 5s ease-in-out infinite; }
        .summary-card::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 3px, ${ANIME_COLORS.purple}06 3px, ${ANIME_COLORS.purple}06 4px); pointer-events: none; animation: crtScan 7s linear infinite; }
        .summary-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.6rem 0; border-bottom: 1px solid ${ANIME_COLORS.purple}28; font-family: 'Share Tech Mono', monospace; font-size: 0.76rem; letter-spacing: 0.04em; color: ${ANIME_COLORS.text}; }
        .summary-row:last-child { border-bottom: none; }
        .summary-row span:last-child { color: ${ANIME_COLORS.text}; font-weight: 700; }
        .step-badge { display: inline-flex; align-items: center; gap: 0.6rem; font-family: 'Share Tech Mono', monospace; font-size: 0.56rem; letter-spacing: 0.42em; color: ${ANIME_COLORS.secondary}; text-transform: uppercase; padding: 0.2rem 0.9rem; border: 1px solid ${ANIME_COLORS.secondary}60; background: ${ANIME_COLORS.secondary}12; border-radius: 2px; margin-bottom: 0.9rem; }

        /* ── MOBILE RESPONSIVE ───────────────────────── */
        @media (max-width: 640px) {
          .street-banner { padding: 1.6rem 0.9rem 1.4rem; }
          .banner-title { font-size: 1.8rem !important; letter-spacing: 0.04em; }
          .banner-ruby { font-size: 0.5rem; letter-spacing: 0.3em; padding: 0.2rem 0.8rem; }
          .banner-sub { font-size: 0.5rem; letter-spacing: 0.3em; margin-top: 0.5rem; }
          .banner-deco { width: 48px; }

          .form-pane { padding: 1.2rem 1rem; }
          .summary-pane { padding: 1.2rem 1rem; }

          .info-title { font-size: 2.2rem !important; }
          .info-desc { font-size: 0.74rem; max-width: 100%; padding-left: 0.75rem; }
          
          .grid { grid-template-columns: 1fr; }

          .buy-btn, .back-btn { width: 100%; text-align: center; font-size: 0.65rem; padding: 0.75rem 1rem; }
          .merch-input { font-size: 0.75rem; padding: 0.6rem 0.8rem; }
          .summary-card { padding: 1.2rem; }
        }
        @media (min-width: 641px) and (max-width: 1023px) {
          .form-pane { padding: 2rem; }
          .summary-pane  { padding: 2rem; }
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-transparent text-white">
        <AnimeOrbField />
        <AnimeParticleField />
        <div style={{ position: "absolute", inset: 0, zIndex: -1, background: "rgba(0,0,0,0.14)" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="merch-shell space-y-5">
            
            {/* ── STREET BANNER ──────────────────────── */}
            <div className="merch-card street-banner rounded-[1.5rem]">
              <div className="scan-line" />
              <span className="banner-ruby">Step 2 of 2 · Forge the Seal</span>
              <h2 className={`banner-title ${cinzelFont.className}`}>
                AAKAR <span className="stroke-word">STREETWEAR</span> DROP
              </h2>
              <p className="banner-sub">scan qr &nbsp;·&nbsp; enter id &nbsp;·&nbsp; secure the loot</p>
              <div className="banner-deco" />
            </div>

            {/* ── MAIN CARD ──────────────────────────── */}
            <section className="merch-card overflow-hidden rounded-[1.5rem] relative">
              <div className="scan-line" />
              <div className="grid lg:grid-cols-[1fr_1fr]">

                {submitted ? (
                  <div className="lg:col-span-2 p-6 lg:p-14 text-center">
                      <p className="info-tag relative z-10 mb-4">Loot Secured</p>
                      <h2 className={`info-title text-[clamp(2.2rem,5vw,4rem)] mb-8 ${cinzelFont.className}`}>
                          Quest Item: Claimed!
                      </h2>
                      <div className="max-w-md mx-auto summary-card">
                        <div className="scan-line" />
                        <div className="summary-row">
                          <span>Variant</span>
                          <span>{order.variant.title}</span>
                        </div>
                        <div className="summary-row">
                          <span>Size</span>
                          <span>{order.size}</span>
                        </div>
                        <div className="summary-row">
                          <span>Transaction ID</span>
                          <span style={{ wordBreak: 'break-all', textAlign: 'right', paddingLeft: '1rem' }}>{transactionId}</span>
                        </div>
                      </div>
                      <div className="mt-8 flex justify-center gap-3 relative z-10">
                         <Link href="/merch" className="back-btn">
                            ← Return to Armory
                         </Link>
                      </div>
                  </div>
                ) : (
                  <>
                  {/* LEFT — QR AND SUMMARY */}
                  <div className="form-pane p-6 lg:p-10 border-b border-[rgba(176,38,255,0.18)] lg:border-b-0">
                    <span className="step-badge">/ 02 &nbsp; Payment</span>
                    <p className="info-tag">Scan to Pay</p>
                    <h1 className={`info-title text-[clamp(2.2rem,5.5vw,3.8rem)] ${cinzelFont.className}`}>
                      Tribute
                    </h1>
                    <p className="info-desc mb-6">
                      Scan the QR below to pay a fixed amount of ₹{fixedMerchPrice}
                    </p>

                    <div className="flex justify-center my-8 relative z-10">
                       <div className="summary-card w-full max-w-sm flex flex-col items-center">
                         <img src={generatedQrImageUrl} alt="Merchant QR" className="h-48 w-48 border-2 mb-4 p-2 rounded-xl object-contain bg-white relative z-10" style={{ borderColor: ANIME_COLORS.purple }} />
                         <div className="text-center font-mono text-[#00E5FF] text-sm tracking-widest uppercase relative z-10 mb-2">Amount: ₹{fixedMerchPrice}</div>
                         <div className="text-center font-mono text-[#00E5FF] text-sm tracking-widest uppercase relative z-10">UPI ID: {merchUpiId}</div>
                       </div>
                    </div>

                    <div className="summary-card mt-6">
                       <p className="info-tag relative z-10 mb-2">Order Details</p>
                       <div className="summary-row relative z-10">
                         <span>Variant</span>
                         <span>{order.variant.title}</span>
                       </div>
                       <div className="summary-row relative z-10">
                         <span>Buyer</span>
                         <span>{order.name || "—"}</span>
                       </div>
                       <div className="summary-row relative z-10">
                         <span>Size</span>
                         <span>{order.size || "—"}</span>
                       </div>
                       <div className="summary-row relative z-10">
                         <span>Payable</span>
                         <span>₹{fixedMerchPrice}</span>
                       </div>
                    </div>
                  </div>

                  {/* RIGHT — FORM */}
                  <div className="summary-pane p-6 lg:p-10">
                    <p className="info-tag relative z-10">Verification</p>
                    <h1 className={`info-title text-[clamp(1.8rem,4.5vw,2.8rem)] mb-8 relative z-10 ${cinzelFont.className}`}>
                      Forge Seal
                    </h1>

                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                      <label className="block space-y-2 relative z-10">
                        <span className="field-label">Transaction ID</span>
                        <input
                          className="merch-input"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="tx ID tracking ref"
                        />
                      </label>

                      <label className="block space-y-2 relative z-10">
                        <span className="field-label">Payment Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="merch-input cursor-pointer"
                        />
                      </label>

                      {screenshotPreview && (
                        <div className="mt-4 border border-[#00E5FF]/30 rounded-lg p-2 bg-black/40 relative z-10">
                          <span className="field-label mb-2">Preview</span>
                          <img src={screenshotPreview} alt="Preview" className="h-32 w-[90%] mx-auto object-cover rounded opacity-90 border-[1px] border-[#00E5FF]/50" />
                        </div>
                      )}

                      {error && (
                        <div className="error-box relative z-10">
                          ⚠ &nbsp;{error}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-4 relative z-10">
                        <button type="submit" disabled={loading} className="buy-btn">
                          {loading ? "Forging..." : "Lock in Order"}
                        </button>
                        <Link href="/merch/buy" className="back-btn">
                          ← Back
                        </Link>
                      </div>
                    </form>

                  </div>
                  </>
                )}

              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default function MerchPayment() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center font-mono text-[#B026FF] tracking-[0.2em] uppercase text-sm">
        Initializing Secure Terminal...
      </div>
    }>
      <MerchPaymentContent />
    </Suspense>
  );
}