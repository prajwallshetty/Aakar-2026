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
  ACCENTS 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const merchModelUrl ="/aakar1.glb";

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

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
        @keyframes merchPanelIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes merchPulse {
          0%, 100% { opacity: .25; transform: translateY(0); }
          50% { opacity: .6; transform: translateY(-8px); }
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
        @keyframes merchGlow {
          0%, 100% { box-shadow: 0 0 30px ${ANIME_COLORS.primary}60, inset 0 0 20px ${ANIME_COLORS.primary}30; }
          50% { box-shadow: 0 0 40px ${ANIME_COLORS.secondary}80, inset 0 0 25px ${ANIME_COLORS.secondary}40; }
        }
        @keyframes merchFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .merch-shell {
          animation: merchPanelIn .45s ease both;
        }
        .merch-section {
          background: linear-gradient(135deg, ${ANIME_COLORS.background}95, ${ANIME_COLORS.background}90);
          border: 2px solid ${ANIME_COLORS.primary};
          box-shadow: 0 0 30px ${ANIME_COLORS.primary}60, inset 0 0 20px ${ANIME_COLORS.primary}30;
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }
        .merch-section::before {
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
        .merch-spot {
          animation: merchPulse 4s ease-in-out infinite, merchFloat 6s ease-in-out infinite;
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
          letter-spacing: 0.08em;
          color: ${ANIME_COLORS.text};
        }
        .merch-title-like-about {
          letter-spacing: 0.05em;
          color: ${ANIME_COLORS.text};
        }
        .merch-theme-meta {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.22em;
          color: ${ANIME_COLORS.secondary};
        }
        .merch-theme-copy {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.02em;
          color: ${ANIME_COLORS.text};
        }
        .merch-shirt-text {
          animation: merchNeon 2.8s ease-in-out infinite, merchGlow 4s ease-in-out infinite;
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden">
        <AnimeOrbField />
        <AnimeParticleField />

        <div className="absolute inset-0 -z-0 bg-black/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <section className="merch-shell merch-section overflow-hidden rounded-[2rem]">
            <div className="grid lg:grid-cols-[1fr_1fr]">
              <div className="relative border-b-2 border-black/20 p-6 lg:border-b-0 lg:border-r-2 lg:border-black/20 lg:p-10">
                <div className="pointer-events-none absolute inset-x-14 top-6 h-24 rounded-full bg-cyan-300/45 blur-3xl merch-spot" style={{ background: `${ANIME_COLORS.secondary}45` }} />

                <div
                  className="relative mx-auto flex h-[520px] w-full max-w-[520px] items-center justify-center [perspective:1100px]"
                >
                  <div>
                    {merchModelUrl ? (
                      <div className="h-[470px] w-[420px] max-w-[90vw] overflow-hidden">
                        <Canvas camera={{ position: [0, 0, 6.6], fov: 34 }} dpr={[1, 2]}>
                          <ambientLight intensity={0.9} />
                          <hemisphereLight intensity={0.95} groundColor="#cdd6ff" />
                          <directionalLight position={[4, 8, 5]} intensity={1.35} />
                          <Suspense fallback={null}>
                            <Bounds fit clip observe margin={5.8}>
                              <TshirtModel modelUrl={merchModelUrl} />
                            </Bounds>
                            <Environment preset="studio" />
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
                        <p className="merch-theme-meta px-6 text-xs uppercase">3D model not configured</p>
                      </div>
                    )}
                  </div>

                  <div className="pointer-events-none absolute bottom-4 h-14 w-64 rounded-full bg-black/35 blur-xl" />
                </div>

                <div className="mx-auto mt-2 flex w-fit items-center gap-3 rounded-full border-2 px-4 py-3 text-xs uppercase tracking-[0.35em] shadow-[3px_3px_0_#0a0005]" style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.background}90, ${ANIME_COLORS.background}80)`, color: ANIME_COLORS.text, boxShadow: `0 0 15px ${ANIME_COLORS.primary}50` }}>
                  <span className="merch-hint inline-block" style={{ color: ANIME_COLORS.accent }}>O</span>
                  drag model to rotate
                </div>

                <div className="mx-auto mt-5 flex max-w-[520px] flex-wrap justify-center gap-3">
                  {merchVariants.map((variant) => {
                    const active = variant.key === selectedVariantKey;
                    return (
                      <button
                        key={variant.key}
                        type="button"
                        onClick={() => setSelectedVariantKey(variant.key)}
                        className="rounded-lg border-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-transform duration-150 hover:-translate-y-0.5"
                        style={{
                          borderColor: active ? ANIME_COLORS.accent : ANIME_COLORS.primary,
                          background: active
                            ? `linear-gradient(135deg, ${ANIME_COLORS.accent}35, ${ANIME_COLORS.accent}20)`
                            : `linear-gradient(135deg, ${ANIME_COLORS.background}90, ${ANIME_COLORS.background}80)`,
                          color: ANIME_COLORS.text,
                          boxShadow: active
                            ? `0 0 18px ${ANIME_COLORS.accent}55`
                            : `0 0 12px ${ANIME_COLORS.primary}40`,
                        }}
                      >
                        {variant.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 lg:p-10">
                <p className="merch-theme-meta text-xs uppercase">{selectedVariant.tag}</p>
                <h1 className={`merch-title-like-about mt-2 text-[clamp(2.3rem,6vw,4.6rem)] uppercase leading-[0.95] ${cinzelFont.className}`}>
                    {selectedVariant.title}
                </h1>

                <p className="merch-theme-copy mt-4 max-w-xl border-l-2 border-fuchsia-500/70 pl-4 text-base leading-8" style={{ borderLeftColor: ANIME_COLORS.accent }}>
                  {selectedVariant.description}
                </p>

                <div className="mt-8 space-y-2">
                  {selectedVariant.features.map((item, index) => (
                    <div key={item} className="flex items-center gap-4 rounded-lg border-2 px-3 py-3 shadow-[3px_3px_0_#00ffff]" style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.background}92, ${ANIME_COLORS.background}85)`, boxShadow: `0 0 15px ${ANIME_COLORS.primary}40` }}>
                      <span className="merch-theme-meta w-8 text-xs" style={{ color: ANIME_COLORS.accent }}>{`0${index + 1}`}</span>
                      <span className="merch-theme-copy text-lg leading-none">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 rounded-2xl border-2 border-black/85 bg-[#ffea8a] p-7 shadow-[6px_6px_0_#0a0005]" style={{ border: `2px solid ${ANIME_COLORS.accent}`, background: `linear-gradient(135deg, ${ANIME_COLORS.accent}30, ${ANIME_COLORS.accent}20)`, boxShadow: `0 0 20px ${ANIME_COLORS.accent}50` }}>
                  <div className="mb-5 text-center">
                    <p className="merch-theme-meta text-[10px] uppercase">Selected Price</p>
                    <p className="mt-1 text-3xl font-bold" style={{ color: ANIME_COLORS.text }}>₹{selectedVariant.price}</p>
                  </div>
                  <div className="flex justify-center">
                    <Link
                      href={`/merch/buy?variant=${selectedVariant.key}`}
                      className="rounded-lg border-2 px-6 py-3 font-bold uppercase tracking-[0.18em] shadow-[4px_4px_0_#0a0005] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
                      style={{ border: `2px solid ${ANIME_COLORS.primary}`, background: `linear-gradient(135deg, ${ANIME_COLORS.primary}60, ${ANIME_COLORS.primary}50)`, color: ANIME_COLORS.text, boxShadow: `0 0 20px ${ANIME_COLORS.primary}60` }}
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