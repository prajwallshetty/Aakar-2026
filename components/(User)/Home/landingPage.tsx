"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import OptimizedVideo from "./OptimizedVideo";
import HeroOverlays from "./HeroOverlays";
import HeroContent from "./HeroContent";

export default function HeroLanding() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Device Detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Audio Logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.4;
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    audioRef.current.muted = next;
    if (!next) audioRef.current.play().catch(() => {});
  };

  // ── Scroll & Parallax ─────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const logoY     = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOp = useTransform(scrollYProgress, [0, 0.6], [0.5, 0.85]);

  const textMXRaw = useMotionValue(0);
  const textMX = useSpring(textMXRaw, { stiffness: 40, damping: 30 });

  useEffect(() => {
    if (isMobile) { textMXRaw.set(0); return; }
    
    const handler = (e: MouseEvent) => {
      const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      textMXRaw.set(nx * 12);
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [isMobile, textMXRaw]);

  return (
    <>
      <style>{`
        .hero-side-label {
          writing-mode: vertical-rl;
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.2);
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(8px); opacity: 0.8; }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2.5s ease-in-out infinite; }
      `}</style>

      <audio ref={audioRef} src="/landing.mp3" loop muted={isMuted} playsInline autoPlay />

      <section
        ref={sectionRef}
        className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black select-none"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {/* ── VIDEO LAYER ── */}
        <div className="absolute inset-0 z-0">
          <OptimizedVideo src="/aakarlandingvideo.mp4" poster="/video-poster.png" />
        </div>

        {/* ── OVERLAYS ── */}
        <HeroOverlays opacity={overlayOp} />

        {/* ── CONTENT ── */}
        <HeroContent 
          isMobile={isMobile} 
          logoY={logoY} 
          textY={textY} 
          textMX={textMX} 
        />

        {/* ── DECORATIVE ELEMENTS ── */}
        <SideLabels />
        <BottomBar />

        {/* ── AUDIO CONTROL ── */}
        <AudioControl isMuted={isMuted} onToggle={toggleMute} />
      </section>
    </>
  );
}

function SideLabels() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ delay: 2, duration: 1 }}
      className="hidden xl:contents"
    >
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4">
        <div className="h-16 w-px bg-white/10" />
        <span className="hero-side-label">Aakar 2026</span>
        <div className="h-16 w-px bg-white/10" />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4">
        <div className="h-16 w-px bg-white/10" />
        <span className="hero-side-label rotate-180">AJIET · Mangaluru</span>
        <div className="h-16 w-px bg-white/10" />
      </div>
    </motion.div>
  );
}

function BottomBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-0 left-0 right-0 z-40 flex items-end justify-between px-8 pb-8"
    >
      <span className="hidden md:block text-[9px] tracking-[0.4em] text-white/20 uppercase">
        Where Technology Meets Culture
      </span>
      <div className="flex flex-col items-center gap-2 absolute left-1/2 -translate-x-1/2 bottom-8">
        <span className="text-[8px] tracking-[0.5em] text-white/30 uppercase">Scroll</span>
        <svg className="animate-bounce-subtle" width="12" height="16" viewBox="0 0 10 14" fill="none">
          <path d="M5 1v12M1 9l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  );
}

function AudioControl({ isMuted, onToggle }: { isMuted: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      className={`fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-full flex items-center justify-center border transition-colors duration-300 ${
        isMuted ? "bg-black/60 border-white/20" : "bg-white/15 border-white/40"
      }`}
    >
      {isMuted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      )}
    </motion.button>
  );
}