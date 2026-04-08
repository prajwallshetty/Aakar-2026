"use client";

import { motion, MotionValue, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface HeroContentProps {
  isMobile: boolean;
  logoY: MotionValue<string>;
  textY: MotionValue<string>;
  textMX: MotionValue<number>;
}

export default function HeroContent({ isMobile, logoY, textY, textMX }: HeroContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const chars = "A NEW ERA BEGINS".split("");

  const logoInitial = { opacity: 0, scale: 0.9, y: 20 };
  const logoAnimate = { opacity: 1, scale: 1, y: 0 };
  const logoTransition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.2 };

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col justify-end md:justify-start md:pt-[12vh]"
      style={!isMobile
        ? { paddingLeft: "clamp(28px,7vw,100px)", y: textY, x: textMX }
        : { paddingLeft: "20px", paddingRight: "20px", paddingTop: "12vh", justifyContent: "flex-start", alignItems: "center" }}
    >
      {/* ── LOGO SECTION ── */}
      <motion.div
        style={!isMobile ? { y: logoY, marginLeft: "-7vw" } : { width: "clamp(200px,80vw,420px)", marginBottom: "16px" }}
        initial={logoInitial}
        animate={logoAnimate}
        transition={logoTransition}
        className="relative"
      >
        {/* Optimized Glow: Using a background blurred div instead of expensive drop-shadow filter on the image */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 bg-orange-600/20 blur-[60px] rounded-full pointer-events-none animate-pulse" />
        )}
        
        <Image
          src="/aklogo.png"
          alt="AAKAR 2026"
          width={620}
          height={240}
          priority
          className="relative z-10"
          style={{ 
            objectFit: "contain", 
            width: isMobile ? "100%" : "clamp(240px,52vw,620px)", 
            height: "auto"
          }}
        />
      </motion.div>

      {/* ── TAGLINE SECTION ── */}
      <div className="flex flex-col items-center md:items-start">
        <div className="overflow-hidden mt-2">
          <p className="font-light text-[clamp(0.7rem,3vw,1.4rem)] tracking-[0.3em] text-white/95 whitespace-nowrap">
            {chars.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.03, duration: 0.5 }}
                className="inline-block"
                style={{ whiteSpace: ch === " " ? "pre" : undefined }}
              >
                {ch}
              </motion.span>
            ))}
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="font-extralight text-[clamp(8px,2vw,12px)] tracking-[0.4em] text-white/40 mt-2 uppercase"
          style={{ fontFamily: "'Noto Serif JP', serif" }}
        >
          新たな時代の幕開け
        </motion.p>

        {/* ── CTA SECTION ── */}
        <motion.div
          className="flex items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
           <span className="hidden md:inline-block border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-sm text-[10px] tracking-[0.3em] text-white/80 uppercase">
            Techno-Cultural Fest
          </span>
          <span className="text-[10px] tracking-[0.3em] text-orange-400/80 border-l border-orange-500/20 pl-4 uppercase">
            2026
          </span>
          <button className="bg-gradient-to-br from-neutral-900/90 to-orange-950/80 border border-white/20 px-6 py-2 rounded-sm text-[10px] tracking-[0.3em] text-white uppercase hover:shadow-[0_0_20px_rgba(255,100,0,0.2)] transition-all active:scale-95">
            Explore ›
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
