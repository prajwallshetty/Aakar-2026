"use client";

import { Suspense } from "react";
import Link from "next/link";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "@/components/(User)/PopArtBackground";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";

const features = [
  "100% Premium Cotton Blend",
  "Comfortable fit and durable",
  "Available in 8 sizes (XS - 4XL)",
  "Vibrant AAKAR branding",
];

const merchModelUrl ="/merch-tshirt.glb";

function TshirtModel({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
  const centeredScene = scene.clone(true);

  return (
    <group rotation={[0.02, -0.32, 0]}>
      <Center>
        <primitive object={centeredScene} scale={1} position={[0, 0, 0]} />
      </Center>
    </group>
  );
}

export default function MerchPage() {
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
                  className="relative mx-auto flex h-[520px] w-full max-w-[430px] items-center justify-center [perspective:1100px]"
                >
                  <div>
                    {merchModelUrl ? (
                      <div className="h-[450px] w-[320px] overflow-hidden">
                        <Canvas camera={{ position: [0, 0, 5.8], fov: 30 }} dpr={[1, 2]}>
                          <ambientLight intensity={0.9} />
                          <hemisphereLight intensity={0.95} groundColor="#cdd6ff" />
                          <directionalLight position={[4, 8, 5]} intensity={1.35} />
                          <Suspense fallback={null}>
                            <Bounds fit clip observe margin={3.5}>
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

                <div className="mx-auto mt-2 flex w-fit items-center gap-3 rounded-full border-2 border-black/80 bg-white/85 px-4 py-3 text-xs uppercase tracking-[0.35em] text-black/70 shadow-[3px_3px_0_#0a0005]">
                  <span className="merch-hint inline-block text-fuchsia-600">O</span>
                  drag model to rotate
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