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
  AnimeCardWrapper, 
  AnimeSectionHeading, 
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"] as const;

export default function MerchBuy() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedVariant = useMemo(
    () => getMerchVariant(searchParams.get("variant")),
    [searchParams]
  );
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
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
    if (!formData.usn.trim()) return setError("USN is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (!formData.phone.trim()) return setError("Phone number is required");

    const params = new URLSearchParams({
      name: formData.name.trim(),
      usn: formData.usn.trim(),
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
        .merch-buy-shell {
          border: 2px solid ${ANIME_COLORS.primary};
          box-shadow: 0 0 30px ${ANIME_COLORS.primary}60, inset 0 0 20px ${ANIME_COLORS.primary}30;
          background: linear-gradient(135deg, ${ANIME_COLORS.background}95, ${ANIME_COLORS.background}90);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }
        .merch-buy-shell::before {
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
        .merch-buy-heading {
          letter-spacing: 0.08em;
          color: ${ANIME_COLORS.text};
        }
        .merch-buy-copy {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.02em;
          color: ${ANIME_COLORS.text};
          text-shadow: 0 0 6px ${ANIME_COLORS.text}30;
        }
        .merch-buy-label {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${ANIME_COLORS.secondary};
          font-size: 10px;
          font-weight: 700;
        }
        .merch-buy-input, .merch-buy-select {
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
        .merch-buy-input:focus, .merch-buy-select:focus {
          border-color: ${ANIME_COLORS.accent};
          box-shadow: 0 0 25px ${ANIME_COLORS.accent}50, inset 0 0 12px ${ANIME_COLORS.accent}30;
        }
        .merch-buy-select option {
          background: ${ANIME_COLORS.background};
          color: ${ANIME_COLORS.text};
        }
        .merch-buy-select option:checked {
          background: ${ANIME_COLORS.primary};
          color: ${ANIME_COLORS.background};
        }
      `}</style>
      <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <AnimeOrbField />
        <AnimeParticleField />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="merch-buy-shell rounded-[2rem] overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="merch-buy-copy text-xs uppercase tracking-[0.4em]">Step 1 · Add Details</p>
                <h1 className={`merch-buy-heading mt-2 text-[clamp(2.4rem,6vw,4.8rem)] uppercase leading-[0.95] ${cinzelFont.className}`}>
                    Select Size
                </h1>
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
                    <div className="border-2 px-4 py-3 font-bold shadow-[4px_4px_0_#000]" style={{ border: `1px solid ${ANIME_COLORS.purple}`, background: `${ANIME_COLORS.purple}40`, color: ANIME_COLORS.text, boxShadow: `0 0 12px ${ANIME_COLORS.purple}40` }}>
                      {error}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="rounded-lg border-2 px-6 py-3 font-bold uppercase tracking-[0.18em] shadow-[4px_4px_0_#0a0005] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
                      style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.primary}60, ${ANIME_COLORS.primary}50)`, color: ANIME_COLORS.text, boxShadow: `0 0 20px ${ANIME_COLORS.primary}60` }}
                    >
                      Continue to Payment
                    </button>
                    <Link
                      href="/merch"
                      className="rounded-lg border-2 px-6 py-3 font-bold uppercase tracking-[0.18em] shadow-[4px_4px_0_#0a0005]"
                      style={{ border: `2px solid ${ANIME_COLORS.secondary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.background}90, ${ANIME_COLORS.background}80)`, color: ANIME_COLORS.text, boxShadow: `0 0 15px ${ANIME_COLORS.secondary}50` }}
                    >
                      Back
                    </Link>
                  </div>
                </form>
              </div>

              <div className="border-t-2 border-black/20 bg-[#ffea8a] p-6 sm:p-8 lg:border-l-2 lg:border-t-0 lg:p-10" style={{ background: `linear-gradient(135deg, ${ANIME_COLORS.accent}30, ${ANIME_COLORS.accent}20)`, borderColor: ANIME_COLORS.accent }}>
                <div className="rounded-[1.75rem] border-2 p-6 shadow-[6px_6px_0_#000]" style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.background}92, ${ANIME_COLORS.background}85)`, boxShadow: `0 0 15px ${ANIME_COLORS.primary}40` }}>
                  <p className="merch-buy-label">Order Summary</p>
                    <p className="merch-buy-copy mt-1 text-xs uppercase tracking-[0.22em]">{summary.tag}</p>
                  <h2 className={`merch-buy-heading mt-2 text-4xl uppercase leading-none ${cinzelFont.className}`}>
                      {summary.title}
                  </h2>
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