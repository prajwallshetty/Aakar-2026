"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "@/components/(User)/PopArtBackground";
import { createMerchOrder } from "@/backend/merch";
import { uploadFile } from "@/backend/supabase";

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
      screenshotUrl = await uploadFile(screenshotFile, "paymentscreenshots");
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
      ...order,
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
        ${POP_ART_KEYFRAMES}
        .merch-pay-shell {
          border: 3px solid ${P.black};
          box-shadow: 8px 8px 0 ${P.black}, 14px 14px 0 ${P.cyan};
          background: rgba(255,255,255,0.97);
        }
        .merch-pay-heading {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.08em;
          color: ${P.black};
          text-shadow: 0.05em 0.05em 0 ${P.magenta}, 0.1em 0.1em 0 ${P.cyan};
          -webkit-text-stroke: 0.015em ${P.black};
        }
        .merch-pay-copy {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.02em;
          color: rgba(10,0,5,0.9);
        }
        .merch-pay-label {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${P.black};
          font-size: 10px;
          font-weight: 700;
        }
        .merch-pay-input {
          border: 3px solid ${P.black};
          box-shadow: 3px 3px 0 ${P.black};
          background: #fff;
          color: ${P.black};
          font-family: 'Share Tech Mono', monospace;
          padding: 12px 14px;
          outline: none;
        }
      `}</style>
      <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PopArtBackground />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="merch-pay-shell overflow-hidden rounded-[2rem]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b-2 border-black/20 bg-[#ffea8a] p-6 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-10">
                <p className="merch-pay-copy text-xs uppercase tracking-[0.4em]">Step 2 · Payment</p>
                <h1 className="merch-pay-heading mt-2 text-[clamp(2.4rem,6vw,4.8rem)] uppercase leading-[0.95]">Scan QR</h1>
                <p className="merch-pay-copy mt-4 text-base leading-8">
                  Pay the merch amount using the scanner, then enter the transaction ID below to confirm your order.
                </p>

                <div className="mt-8 rounded-[1.75rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_#000]">
                  <div className="flex flex-col items-center gap-4 text-center">
                    {merchQrImageUrl ? (
                      <img src={merchQrImageUrl} alt="Merch payment scanner" className="h-64 w-64 border-2 border-black bg-white p-2 object-cover" />
                    ) : (
                      <div className="flex h-64 w-64 items-center justify-center border-2 border-black bg-white p-2 text-center text-sm font-bold uppercase tracking-[0.12em] text-black">
                        QR not configured
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="merch-pay-label">UPI ID</p>
                      <p className="merch-pay-copy text-sm font-bold">{merchUpiId}</p>
                      <p className="merch-pay-copy text-sm">Amount: ₹499</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border-2 border-black bg-white px-5 py-4 shadow-[4px_4px_0_#000]">
                  <p className="merch-pay-copy text-sm leading-7">
                    Order for <span className="font-bold uppercase">{order.name || "—"}</span>, USN <span className="font-bold uppercase">{order.usn || "—"}</span>, size <span className="font-bold uppercase">{order.size}</span>.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/merch/buy" className="rounded-lg border-2 border-black bg-white px-5 py-3 font-bold uppercase tracking-[0.18em] text-black shadow-[4px_4px_0_#0a0005]">
                    Back
                  </Link>
                  <Link href="/merch" className="rounded-lg border-2 border-black bg-black px-5 py-3 font-bold uppercase tracking-[0.18em] text-white shadow-[4px_4px_0_#0a0005]">
                    Merch Home
                  </Link>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                {submitted ? (
                  <div className="flex h-full min-h-[520px] flex-col justify-center rounded-[1.75rem] border-2 border-black bg-[#00ffff] p-8 text-center shadow-[6px_6px_0_#000]">
                    <p className="merch-pay-copy text-xs uppercase tracking-[0.4em]">Order Submitted</p>
                    <h2 className="merch-pay-heading mt-2 text-[clamp(2.2rem,5vw,4rem)] uppercase leading-none">Order placed successfully</h2>
                    <div className="mt-6 rounded-2xl border-2 border-black bg-white px-5 py-4 shadow-[4px_4px_0_#000] text-left">
                      <p className="merch-pay-copy text-sm"><span className="font-bold uppercase">USN:</span> {order.usn}</p>
                      <p className="merch-pay-copy text-sm"><span className="font-bold uppercase">Size:</span> {order.size}</p>
                      <p className="merch-pay-copy text-sm"><span className="font-bold uppercase">Transaction ID:</span> {transactionId}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]">
                    <p className="merch-pay-label">Confirm Payment</p>
                    <h2 className="merch-pay-heading mt-2 text-4xl uppercase leading-none">Transaction ID</h2>
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
                          className="merch-pay-input w-full cursor-pointer file:mr-3 file:py-2 file:px-3 file:border-0 file:border-r-2 file:border-black file:bg-gray-100 file:rounded-none file:font-bold file:uppercase file:text-xs"
                        />
                      </label>

                      {screenshotPreview && (
                        <div className="rounded-lg border-2 border-black bg-white p-3">
                          <p className="merch-pay-label mb-2">Preview</p>
                          <img src={screenshotPreview} alt="Screenshot preview" className="h-40 w-full object-cover border-2 border-black rounded" />
                        </div>
                      )}

                      {error && (
                        <div className="border-2 border-black bg-[#ff0066] px-4 py-3 font-bold text-white shadow-[4px_4px_0_#000]">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg border-2 border-black bg-black px-6 py-3 font-bold uppercase tracking-[0.18em] text-white shadow-[4px_4px_0_#0a0005] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#1a1a1a] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
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