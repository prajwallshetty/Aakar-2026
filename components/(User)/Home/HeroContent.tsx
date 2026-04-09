"use client";

import { motion, MotionValue } from "framer-motion";
import Image from "next/image";

interface HeroContentProps {
  isMobile: boolean;
  logoY: MotionValue<string>;
  textY: MotionValue<string>;
  textMX: MotionValue<number>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HeroContent({ isMobile, logoY, textY, textMX }: HeroContentProps) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col justify-end md:justify-start md:pt-[12vh]"
      style={!isMobile
        ? { paddingLeft: "clamp(28px,7vw,100px)", paddingBottom: "clamp(60px,12vh,120px)", y: textY, x: textMX }
        : { paddingLeft: "20px", paddingRight: "20px", paddingTop: "12vh", paddingBottom: "80px", justifyContent: "flex-start", alignItems: "center" }}
    >
      {/* ── LOGO ── */}
      <motion.div
        style={!isMobile ? { y: logoY, marginLeft: "-7vw" } : { width: "clamp(280px,90vw,520px)", marginBottom: "16px" }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
        className="relative"
      >
        {/* Glow — static opacity, no blur animation, no animate-pulse */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(234,88,12,0.15) 0%, transparent 70%)",
          }}
        />

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

      {/* ── TAGLINE ── */}
      <div className="flex flex-col items-center md:items-start">
        <motion.div
          className="overflow-hidden mt-2"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.8}
        >
          <p className="font-light text-[clamp(0.7rem,3vw,1.4rem)] tracking-[0.3em] text-white/95 whitespace-nowrap">
            A NEW ERA BEGINS
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.2}
          className="font-extralight text-[clamp(8px,2vw,12px)] tracking-[0.4em] text-white/40 mt-2 uppercase"
          style={{ fontFamily: "'Noto Serif JP', serif" }}
        >
          新たな時代の幕開け
        </motion.p>

        {/* ── CTA ── */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mt-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.4}
        >
          <span className="hidden md:inline-block border border-white/20 bg-black/30 px-4 py-1.5 rounded-sm text-[10px] tracking-[0.3em] text-white/80 uppercase">
            Techno-Cultural Fest
          </span>
          <span className="text-[10px] tracking-[0.3em] text-orange-400/80 border-l border-orange-500/20 pl-3 uppercase">
            2026
          </span>
          <a
            href="/rulebook.pdf"
            download
            className="bg-gradient-to-br from-neutral-900/90 to-orange-950/80 border border-white/20 px-5 py-2 rounded-sm text-[10px] tracking-[0.2em] text-white uppercase hover:shadow-[0_0_20px_rgba(255,100,0,0.2)] transition-shadow active:scale-95 no-underline"
          >
            📕 Rulebook
          </a>
          <a
            href="/Aakar_2025_brochure.pdf"
            download
            className="bg-gradient-to-br from-neutral-900/90 to-purple-950/80 border border-white/20 px-5 py-2 rounded-sm text-[10px] tracking-[0.2em] text-white uppercase hover:shadow-[0_0_20px_rgba(99,68,245,0.25)] transition-shadow active:scale-95 no-underline"
          >
            📄 Brochure
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

