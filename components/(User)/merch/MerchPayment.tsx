"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createMerchOrder } from "@/backend/merch";
import { cinzelFont } from "@/lib/font";
import { getMerchVariant } from "@/lib/merchVariants";
import { 
  AnimeParticleField, 
  AnimeOrbField, 
  AnimeCardWrapper, 
  AnimeSectionHeading, 
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const merchUpiId = "aakar2026@upi";
const merchQrImageUrl ="/merch-qr.jpeg";

export default function MerchPayment() {
  const params = useSearchParams();
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const order = useMemo(() => ({
    name: params.get("name") || "",
    usn: params.get("usn") || "",
    email: params.get("email") || "",
    phone: params.get("phone") || "",
    size: params.get("size") || "M",
    variant: getMerchVariant(params.get("variant")),
  }), [params]);

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
      usn: order.usn,
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
        .merch-pay-shell {
          border: 2px solid ${ANIME_COLORS.primary};
          box-shadow: 0 0 30px ${ANIME_COLORS.primary}60, inset 0 0 20px ${ANIME_COLORS.primary}30;
          background: linear-gradient(135deg, ${ANIME_COLORS.background}95, ${ANIME_COLORS.background}90);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }
        .merch-pay-shell::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.primary}20, transparent);
          animation: merchScan 3s ease-in-out infinite;
        }
        @keyframes merchScan {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
        .merch-pay-heading {
          letter-spacing: 0.08em;
          color: ${ANIME_COLORS.text};
        }
        .merch-pay-copy {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.02em;
          color: ${ANIME_COLORS.text};
          text-shadow: 0 0 6px ${ANIME_COLORS.text}30;
        }
        .merch-pay-label {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${ANIME_COLORS.secondary};
          font-size: 10px;
          font-weight: 700;
        }
        .merch-pay-input {
          border: 2px solid ${ANIME_COLORS.primary};
          box-shadow: 0 0 15px ${ANIME_COLORS.primary}30, inset 0 0 8px ${ANIME_COLORS.primary}20;
          background: linear-gradient(135deg, ${ANIME_COLORS.background}85, ${ANIME_COLORS.background}75);
          color: ${ANIME_COLORS.text};
          font-family: 'Share Tech Mono', monospace;
          padding: 12px 14px;
          outline: none;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .merch-pay-input:focus {
          border-color: ${ANIME_COLORS.accent};
          box-shadow: 0 0 25px ${ANIME_COLORS.accent}50, inset 0 0 12px ${ANIME_COLORS.accent}30;
        }
        .merch-pay-input[type="file"]::file-selector-button {
          background: linear-gradient(135deg, ${ANIME_COLORS.primary}60, ${ANIME_COLORS.primary}50);
          color: ${ANIME_COLORS.text};
          border: 2px solid ${ANIME_COLORS.primary};
          padding: 8px 12px;
          margin-right: 12px;
          border-radius: 4px;
          font-family: 'Share Tech Mono', monospace;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 12px ${ANIME_COLORS.primary}40;
        }
        .merch-pay-input[type="file"]::file-selector-button:hover {
          background: linear-gradient(135deg, ${ANIME_COLORS.primary}70, ${ANIME_COLORS.primary}60);
          box-shadow: 0 0 18px ${ANIME_COLORS.primary}60;
        }
      `}</style>
      <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <AnimeOrbField />
        <AnimeParticleField />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="merch-pay-shell overflow-hidden rounded-[2rem]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b-2 border-black/20 bg-[#ffea8a] p-6 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-10" style={{ background: `linear-gradient(135deg, ${ANIME_COLORS.accent}30, ${ANIME_COLORS.accent}20)`, borderColor: ANIME_COLORS.accent }}>
                <p className="merch-pay-copy text-xs uppercase tracking-[0.4em]">Step 2 · Payment</p>
                <h1 className={`merch-pay-heading mt-2 text-[clamp(2.4rem,6vw,4.8rem)] uppercase leading-[0.95] ${cinzelFont.className}`}>
                    Scan QR
                </h1>
                <p className="merch-pay-copy mt-4 text-base leading-8">
                  Pay the merch amount using the scanner, then enter the transaction ID below to confirm your order.
                </p>

                <div className="mt-8 rounded-[1.75rem] border-2 p-8 shadow-[6px_6px_0_#000]" style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.background}92, ${ANIME_COLORS.background}85)`, boxShadow: `0 0 15px ${ANIME_COLORS.primary}40` }}>
                  <div className="flex flex-col items-center gap-4 text-center">
                    {merchQrImageUrl ? (
                      <img src={merchQrImageUrl} alt="Merch payment scanner" className="h-72 w-72 border-2 p-3 object-cover" style={{ borderColor: ANIME_COLORS.primary, background: ANIME_COLORS.background }} />
                    ) : (
                      <div className="flex h-72 w-72 items-center justify-center border-2 p-3 text-center text-sm font-bold uppercase tracking-[0.12em]" style={{ borderColor: ANIME_COLORS.primary, background: ANIME_COLORS.background, color: ANIME_COLORS.text }}>
                        QR not configured
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="merch-pay-label">UPI ID</p>
                      <p className="merch-pay-copy text-sm font-bold">{merchUpiId}</p>
                      <p className="merch-pay-copy text-sm">Amount: ₹{order.variant.price}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border-2 px-5 py-4 shadow-[4px_4px_0_#000] text-left" style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.background}92, ${ANIME_COLORS.background}85)`, boxShadow: `0 0 15px ${ANIME_COLORS.primary}40` }}>
                  <p className="merch-pay-copy text-sm">
                    Variant: <span className="font-bold uppercase">{order.variant.title}</span>
                  </p>
                  <p className="merch-pay-copy text-sm">
                    Order for <span className="font-bold uppercase">{order.name || "—"}</span>, USN <span className="font-bold uppercase">{order.usn || "—"}</span>, size <span className="font-bold uppercase">{order.size}</span>.
                  </p>
                  <p className="merch-pay-copy text-sm">
                    Email: <span className="font-bold uppercase">{order.email || "—"}</span>
                  </p>
                  <p className="merch-pay-copy text-sm">
                    Phone: <span className="font-bold uppercase">{order.phone || "—"}</span>
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/merch/buy" className="rounded-lg border-2 px-5 py-3 font-bold uppercase tracking-[0.18em] shadow-[4px_4px_0_#0a0005]" style={{ border: `2px solid ${ANIME_COLORS.secondary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.background}90, ${ANIME_COLORS.background}80)`, color: ANIME_COLORS.text, boxShadow: `0 0 15px ${ANIME_COLORS.secondary}50` }}>
                    Back
                  </Link>
                  <Link href="/merch" className="rounded-lg border-2 px-5 py-3 font-bold uppercase tracking-[0.18em] shadow-[4px_4px_0_#0a0005]" style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.primary}60, ${ANIME_COLORS.primary}50)`, color: ANIME_COLORS.text, boxShadow: `0 0 20px ${ANIME_COLORS.primary}60` }}>
                    Merch Home
                  </Link>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                {submitted ? (
                  <div className="flex h-full min-h-[520px] flex-col justify-center rounded-[1.75rem] border-2 border-black bg-[#00ffff] p-8 text-center shadow-[6px_6px_0_#000]" style={{ border: `1px solid ${ANIME_COLORS.secondary}`, background: `${ANIME_COLORS.secondary}40`, boxShadow: `0 0 16px ${ANIME_COLORS.secondary}40` }}>
                    <p className="merch-pay-copy text-xs uppercase tracking-[0.4em]">Order Submitted</p>
                    <h2 className={`merch-pay-heading mt-2 text-[clamp(2.2rem,5vw,4rem)] uppercase leading-none ${cinzelFont.className}`}>
                        Order placed successfully
                    </h2>
                    <div className="mt-6 rounded-2xl border-2 px-5 py-4 shadow-[4px_4px_0_#000] text-left" style={{ border: `1px solid ${ANIME_COLORS.primary}`, background: `${ANIME_COLORS.background}40`, boxShadow: `0 0 8px ${ANIME_COLORS.primary}40` }}>
                      <p className="merch-pay-copy text-sm"><span className="font-bold uppercase">USN:</span> {order.usn}</p>
                      <p className="merch-pay-copy text-sm"><span className="font-bold uppercase">Size:</span> {order.size}</p>
                      <p className="merch-pay-copy text-sm"><span className="font-bold uppercase">Transaction ID:</span> {transactionId}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border-2 p-5 shadow-[6px_6px_0_#000]" style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.background}92, ${ANIME_COLORS.background}85)`, boxShadow: `0 0 15px ${ANIME_COLORS.primary}40` }}>
                    <p className="merch-pay-label">Confirm Payment</p>
                    <h2 className={`merch-pay-heading mt-2 text-4xl uppercase leading-none ${cinzelFont.className}`}>
                        Transaction ID
                    </h2>
                    <p className="merch-pay-copy mt-3 text-base leading-8">
                      Enter the UPI transaction ID after payment. This will be sent to the admin panel for verification.
                    </p>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                      <label className="block space-y-2">
                        <span className="merch-pay-label">Transaction ID</span>
                        <input
                          className="merch-pay-input w-full"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Enter transaction reference"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="merch-pay-label">Payment Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="merch-pay-input w-full cursor-pointer file:mr-3 file:py-2 file:px-3 file:border-0 file:border-r-2 file:rounded-none file:font-bold file:uppercase file:text-xs"
                        />
                      </label>

                      {screenshotPreview && (
                        <div className="rounded-lg border-2 p-3" style={{ border: `1px solid ${ANIME_COLORS.primary}`, background: `${ANIME_COLORS.background}40` }}>
                          <p className="merch-pay-label mb-2">Preview</p>
                          <img src={screenshotPreview} alt="Screenshot preview" className="h-40 w-full object-cover border-2 rounded" style={{ borderColor: ANIME_COLORS.primary }} />
                        </div>
                      )}

                      {error && (
                        <div className="border-2 px-4 py-3 font-bold shadow-[4px_4px_0_#000]" style={{ border: `1px solid ${ANIME_COLORS.purple}`, background: `${ANIME_COLORS.purple}40`, color: ANIME_COLORS.text, boxShadow: `0 0 12px ${ANIME_COLORS.purple}40` }}>
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg border-2 px-6 py-3 font-bold uppercase tracking-[0.18em] shadow-[4px_4px_0_#0a0005] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                        style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.primary}60, ${ANIME_COLORS.primary}50)`, color: ANIME_COLORS.text, boxShadow: `0 0 20px ${ANIME_COLORS.primary}60` }}
                      >
                        {loading ? "Uploading..." : "Submit Order"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}