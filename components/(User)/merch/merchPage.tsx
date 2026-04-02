"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "@/components/(User)/PopArtBackground";

const features = [
  "100% Premium Cotton Blend",
  "Comfortable fit and durable",
  "Available in 8 sizes (XS - 4XL)",
  "Vibrant AAKAR branding",
];

export default function MerchPage() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [rotationX, setRotationX] = useState(-4);
  const [rotationY, setRotationY] = useState(-8);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointer, setLastPointer] = useState({ x: 0, y: 0 });

  const shirtTransform = useMemo(() => {
    return `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  }, [rotationX, rotationY]);

  function rotateFromPointer(clientX: number, clientY: number) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const ratioX = (clientX - rect.left) / rect.width;
    const ratioY = (clientY - rect.top) / rect.height;
    const mappedY = (ratioX - 0.5) * 76;
    const mappedX = (0.5 - ratioY) * 34;
    setRotationY(mappedY);
    setRotationX(Math.max(-22, Math.min(22, mappedX)));
  }

  return (
    <>
      <style>{`
        ${POP_ART_KEYFRAMES}
        @keyframes merchPanelIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes merchPulse {
          0%, 100% { opacity: .35; transform: translateY(0); }
          50% { opacity: .7; transform: translateY(-6px); }
        }
        @keyframes merchSpinHint {
          0% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          100% { transform: translateX(-2px); }
        }
        @keyframes merchAutoSpin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        .merch-shell {
          animation: merchPanelIn .45s ease both;
        }
        .merch-section {
          background: rgba(255,255,255,0.96);
          border: 3px solid ${P.black};
          box-shadow: 8px 8px 0 ${P.black}, 14px 14px 0 ${P.cyan};
        }
        .merch-spot {
          animation: merchPulse 4s ease-in-out infinite;
        }
        .merch-hint {
          animation: merchSpinHint 1.6s ease-in-out infinite;
        }
        .merch-auto-spin {
          animation: merchAutoSpin 9s linear infinite;
          transform-style: preserve-3d;
        }
        .merch-auto-spin.paused {
          animation-play-state: paused;
        }
        @keyframes merchNeon {
          0%, 100% { text-shadow: 0 0 0 rgba(0,0,0,0), 0 0 14px rgba(0,245,255,0.12); }
          50% { text-shadow: 0 0 6px rgba(255,0,255,0.4), 0 0 22px rgba(0,245,255,0.28); }
        }
        .merch-theme-heading {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.06em;
          color: ${P.black};
          text-shadow: 0.05em 0.05em 0 ${P.magenta}, 0.1em 0.1em 0 ${P.cyan};
          -webkit-text-stroke: 0.015em ${P.black};
        }
        .merch-title-like-about {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.045em;
          color: ${P.black};
          text-shadow: -0.02em 0 0 ${P.magenta}, 0.055em 0.055em 0 ${P.cyan};
          -webkit-text-stroke: 0.01em ${P.black};
        }
        .merch-theme-meta {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.22em;
          color: ${P.black};
        }
        .merch-theme-copy {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.02em;
          color: rgba(10,0,5,0.9);
        }
        .merch-shirt-text {
          font-family: 'Bebas Neue', sans-serif;
          animation: merchNeon 2.8s ease-in-out infinite;
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden">
        <PopArtBackground />

        <div className="absolute inset-0 -z-0 bg-white/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <section className="merch-shell merch-section overflow-hidden rounded-[2rem]">
            <div className="grid lg:grid-cols-[1fr_1fr]">
              <div className="relative border-b-2 border-black/20 p-6 lg:border-b-0 lg:border-r-2 lg:border-black/20 lg:p-10">
                <div className="pointer-events-none absolute inset-x-14 top-6 h-24 rounded-full bg-cyan-300/45 blur-3xl merch-spot" />

                <div
                  ref={stageRef}
                  className="relative mx-auto flex h-[520px] w-full max-w-[430px] items-center justify-center [perspective:1100px]"
                  onMouseMove={(e) => {
                    if (isDragging) {
                      const dx = e.clientX - lastPointer.x;
                      const dy = e.clientY - lastPointer.y;
                      setLastPointer({ x: e.clientX, y: e.clientY });
                      setRotationY((prev) => prev + dx * 0.45);
                      setRotationX((prev) => Math.max(-25, Math.min(25, prev - dy * 0.18)));
                      return;
                    }
                    rotateFromPointer(e.clientX, e.clientY);
                  }}
                  onMouseDown={(e) => {
                    setIsDragging(true);
                    setLastPointer({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onTouchStart={(e) => {
                    const x = e.touches[0].clientX;
                    const y = e.touches[0].clientY;
                    setIsDragging(true);
                    setLastPointer({ x, y });
                  }}
                  onTouchMove={(e) => {
                    if (!isDragging) return;
                    const x = e.touches[0].clientX;
                    const y = e.touches[0].clientY;
                    const dx = x - lastPointer.x;
                    const dy = y - lastPointer.y;
                    setLastPointer({ x, y });
                    setRotationY((prev) => prev + dx * 0.4);
                    setRotationX((prev) => Math.max(-25, Math.min(25, prev - dy * 0.16)));
                  }}
                  onTouchEnd={() => setIsDragging(false)}
                >
                  {isDragging && (
                    <div className="absolute inset-0 z-20" />
                  )}

                  <div className={`merch-auto-spin ${isDragging ? "paused" : ""}`}>
                    <div
                      className="relative h-[430px] w-[290px] [transform-style:preserve-3d] transition-transform duration-150"
                      style={{ transform: shirtTransform }}
                    >
                      <div className="absolute left-1/2 top-0 h-8 w-24 -translate-x-1/2 rounded-t-full bg-[#c4c4c6] shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
                      <div className="absolute left-1/2 top-4 h-[390px] w-[250px] -translate-x-1/2 rounded-[2.5rem] bg-gradient-to-b from-[#1b1930] via-[#111528] to-[#0a0f1f] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06),0_28px_40px_rgba(0,0,0,0.75)]" />
                      <div className="absolute left-[6px] top-[78px] h-[90px] w-[74px] -rotate-12 rounded-[1.4rem] bg-gradient-to-b from-[#181a2b] to-[#101424] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
                      <div className="absolute right-[6px] top-[78px] h-[90px] w-[74px] rotate-12 rounded-[1.4rem] bg-gradient-to-b from-[#181a2b] to-[#101424] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />

                      <div className="absolute left-1/2 top-[98px] h-[190px] w-[190px] -translate-x-1/2 rounded-full border border-fuchsia-400/75 bg-[radial-gradient(circle_at_center,rgba(226,160,255,0.85),rgba(145,73,198,0.45)_42%,rgba(38,27,61,0.8)_66%,rgba(14,18,29,0.95)_100%)] shadow-[0_0_0_6px_rgba(129,53,182,0.16),0_0_45px_rgba(170,97,255,0.38)]" />
                      <div className="absolute left-1/2 top-[130px] h-[128px] w-[128px] -translate-x-1/2 rounded-full border border-black/50 bg-[radial-gradient(circle_at_38%_40%,#272c47_0%,#0a0d16_54%,#000_100%)]" />
                      <div className="absolute left-1/2 top-[140px] h-[105px] w-[105px] -translate-x-1/2 rounded-full border border-white/20" />

                      <div className="absolute left-1/2 top-[301px] w-[220px] -translate-x-1/2 text-center">
                        <p className="merch-shirt-text text-[0.95rem] font-bold uppercase tracking-[0.18em] text-cyan-100/95">AAKAR</p>
                        <p className="merch-theme-meta mt-1 text-[0.5rem] font-semibold uppercase text-cyan-100/80">DIMENSIONAL DRIFT</p>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute bottom-4 h-14 w-64 rounded-full bg-black/35 blur-xl" />
                </div>

                <div className="mx-auto mt-2 flex w-fit items-center gap-3 rounded-full border-2 border-black/80 bg-white/85 px-4 py-3 text-xs uppercase tracking-[0.35em] text-black/70 shadow-[3px_3px_0_#0a0005]">
                  <span className="merch-hint inline-block text-fuchsia-600">O</span>
                  drag to rotate
                </div>
              </div>

              <div className="p-6 lg:p-10">
                <p className="merch-theme-meta text-xs uppercase">DIMENSIONAL DRIFT</p>
                <h1 className="merch-title-like-about mt-2 text-[clamp(2.3rem,6vw,4.6rem)] uppercase leading-[0.95]">AAKAR T-SHIRT</h1>

                <p className="merch-theme-copy mt-4 max-w-xl border-l-2 border-fuchsia-500/70 pl-4 text-base leading-8">
                  Premium quality AAKAR event t-shirt. Made with comfortable cotton blend fabric. Perfect memorabilia from your event experience.
                </p>

                <div className="mt-8 space-y-2">
                  {features.map((item, index) => (
                    <div key={item} className="flex items-center gap-4 rounded-lg border-2 border-black/80 bg-white px-3 py-3 shadow-[3px_3px_0_#00ffff]">
                      <span className="merch-theme-meta w-8 text-xs text-fuchsia-700">{`0${index + 1}`}</span>
                      <span className="merch-theme-copy text-lg leading-none">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 rounded-2xl border-2 border-black/85 bg-[#ffea8a] p-7 shadow-[6px_6px_0_#0a0005]">
                  <div className="flex justify-center">
                    <Link
                      href="/merch/buy"
                      className="rounded-lg border-2 border-black bg-black px-6 py-3 font-bold uppercase tracking-[0.18em] text-white shadow-[4px_4px_0_#0a0005] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#1a1a1a] active:translate-y-0"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}