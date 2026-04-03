"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "@/components/(User)/PopArtBackground";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"] as const;

export default function MerchBuy() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    email: "",
    phone: "",
    size: "M",
  });
  const [error, setError] = useState("");

  const summary = useMemo(() => ({
    title: "AAKAR T-SHIRT",
    price: "₹499",
  }), []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Name is required");
    if (!formData.usn.trim()) return setError("USN is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (!formData.phone.trim()) return setError("Phone number is required");

    const params = new URLSearchParams({
      name: formData.name.trim(),
      usn: formData.usn.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      size: formData.size,
    });

    router.push(`/merch/payment?${params.toString()}`);
  };

  return (
    <>
      <style>{`
        ${POP_ART_KEYFRAMES}
        .merch-buy-shell {
          border: 3px solid ${P.black};
          box-shadow: 8px 8px 0 ${P.black}, 14px 14px 0 ${P.magenta};
          background: rgba(255,255,255,0.97);
        }
        .merch-buy-heading {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.08em;
          color: ${P.black};
          text-shadow: 0.05em 0.05em 0 ${P.magenta}, 0.1em 0.1em 0 ${P.cyan};
          -webkit-text-stroke: 0.015em ${P.black};
        }
        .merch-buy-copy {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.02em;
          color: rgba(10,0,5,0.9);
        }
        .merch-buy-label {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${P.black};
          font-size: 10px;
          font-weight: 700;
        }
        .merch-buy-input, .merch-buy-select {
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
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="merch-buy-shell rounded-[2rem] overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="merch-buy-copy text-xs uppercase tracking-[0.4em]">Step 1 · Add Details</p>
                <h1 className="merch-buy-heading mt-2 text-[clamp(2.4rem,6vw,4.8rem)] uppercase leading-[0.95]">Select Size</h1>
                <p className="merch-buy-copy mt-4 max-w-xl text-base leading-8">
                  Add your size, USN, email, and phone number. After this, you’ll be taken to the payment page with the scanner.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="merch-buy-label">Name</span>
                      <input
                        className="merch-buy-input w-full"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="merch-buy-label">USN</span>
                      <input
                        className="merch-buy-input w-full uppercase"
                        value={formData.usn}
                        onChange={(e) => setFormData((prev) => ({ ...prev, usn: e.target.value.toUpperCase() }))}
                        placeholder="1AJ25CS001"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="merch-buy-label">Email</span>
                      <input
                        className="merch-buy-input w-full"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="name@example.com"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="merch-buy-label">Phone</span>
                      <input
                        className="merch-buy-input w-full"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="10-digit phone number"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="merch-buy-label">Size</span>
                    <select
                      className="merch-buy-select w-full"
                      value={formData.size}
                      onChange={(e) => setFormData((prev) => ({ ...prev, size: e.target.value }))}
                    >
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>

                  {error && (
                    <div className="border-2 border-black bg-[#ff0066] px-4 py-3 font-bold text-white shadow-[4px_4px_0_#000]">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="rounded-lg border-2 border-black bg-black px-6 py-3 font-bold uppercase tracking-[0.18em] text-white shadow-[4px_4px_0_#0a0005] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#1a1a1a] active:translate-y-0"
                    >
                      Continue to Payment
                    </button>
                    <Link
                      href="/merch"
                      className="rounded-lg border-2 border-black bg-white px-6 py-3 font-bold uppercase tracking-[0.18em] text-black shadow-[4px_4px_0_#0a0005]"
                    >
                      Back
                    </Link>
                  </div>
                </form>
              </div>

              <div className="border-t-2 border-black/20 bg-[#ffea8a] p-6 sm:p-8 lg:border-l-2 lg:border-t-0 lg:p-10">
                <div className="rounded-[1.75rem] border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]">
                  <p className="merch-buy-label">Order Summary</p>
                  <h2 className="merch-buy-heading mt-2 text-4xl uppercase leading-none">{summary.title}</h2>
                  <div className="mt-5 space-y-3 merch-buy-copy text-sm leading-7">
                    <div className="flex justify-between gap-4 border-b border-black/15 pb-2">
                      <span>Price</span>
                      <span className="font-bold">{summary.price}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-black/15 pb-2">
                      <span>Sizes</span>
                      <span className="font-bold">XS to 4XL</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-black/15 pb-2">
                      <span>Payment</span>
                      <span className="font-bold">UPI scanner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}