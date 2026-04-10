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
      className="absolute inset-0 z-30 flex flex-col justify-end md:justify-start md:pt-[10vh]"
      style={!isMobile
        ? { paddingLeft: "clamp(28px,7vw,100px)", paddingBottom: "clamp(60px,12vh,120px)", y: textY, x: textMX }
        : { paddingLeft: "10px", paddingRight: "10px", paddingTop: "12vh", paddingBottom: "80px", justifyContent: "flex-start", alignItems: "center" }}
    >
      {/* ── LOGO ── */}
      <motion.div
        style={!isMobile ? { y: logoY, marginLeft: "calc(-7vw - 40px)", top: "90px" } : { width: "clamp(320px,95vw,600px)", marginBottom: "16px" }}
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
            TECHNO-CULTURE EVENT
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
          テクノ文化イベント
        </motion.p>

        {/* ── CTA ── */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mt-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.4}
        >
          <a
            href="/Aakar%202k26%20RuleBook.pdf"
            download="Aakar_2026_Rulebook.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-md text-sm font-medium tracking-wide text-white/90 hover:text-white transition-all backdrop-blur-sm active:scale-95 no-underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 group-hover:opacity-100 transition-opacity">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
            Download Rulebook
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
