"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { AnimeGlitchText } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

/* ─── Countdown target: April 24, 2026 09:00 AM IST ─────────── */
const TARGET_DATE = new Date("2026-04-24T09:00:00+05:30").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = Math.max(0, TARGET_DATE - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* ─── Flip Number Cell ───────────────────────────────────────── */
function FlipCell({ value, label, isMounted }: { value: number; label: string; isMounted: boolean }) {
  const display = isMounted ? String(value).padStart(2, "0") : "00";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          position: "relative",
          width: "clamp(60px, 14vw, 100px)",
          height: "clamp(70px, 16vw, 110px)",
          borderRadius: "12px",
          background: "linear-gradient(180deg, rgba(18,20,32,0.95) 0%, rgba(10,12,22,0.98) 50%, rgba(14,16,28,0.95) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Center divider line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background: "rgba(0,0,0,0.4)",
            zIndex: 2,
          }}
        />
        {/* Number */}
        <motion.span
          key={display}
          initial={{ opacity: 0.6, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.05em",
            position: "relative",
            zIndex: 1,
            textShadow: "0 0 20px rgba(99,68,245,0.2)",
          }}
        >
          {display}
        </motion.span>

        {/* Subtle glow at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20%",
            right: "20%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(99,68,245,0.3), transparent)",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "clamp(0.55rem, 1.5vw, 0.7rem)",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Separator ──────────────────────────────────────────────── */
function Separator() {
  return (
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
        paddingBottom: "28px",
      }}
    >
      <div
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#6344F5",
          boxShadow: "0 0 6px rgba(99,68,245,0.5)",
        }}
      />
      <div
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#6344F5",
          boxShadow: "0 0 6px rgba(99,68,245,0.5)",
        }}
      />
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function CountdownRegister() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        padding: "clamp(3rem, 8vh, 6rem) clamp(1rem, 4vw, 3rem) clamp(4rem, 10vh, 8rem)",
        overflow: "hidden",
      }}
    >
      {/* Radial glow backgrounds */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(99,68,245,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Anime Character Background */}
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "-5%",
          width: "450px",
          height: "450px",
          backgroundImage: "url(/character.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom right",
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 1,
          filter: "grayscale(100%) contrast(1.2)",
        }}
      />

      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          textAlign: "center",
          marginBottom: "clamp(2rem, 5vh, 3.5rem)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.5em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            marginBottom: "0.8rem",
          }}
        >
          April 24–25, 2026
        </p>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(1.5rem, 5vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            background: "linear-gradient(135deg, #fff 0%, #A855F7 60%, #6344F5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          THE COUNTDOWN BEGINS
        </h2>
        {/* Decorative line */}
        <div style={{
          width: "60px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #6344F5, transparent)",
          margin: "12px auto 0",
          borderRadius: "2px",
          boxShadow: "0 0 8px rgba(99,68,245,0.4)",
        }} />
      </motion.div>

      {/* Countdown grid */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(8px, 2vw, 20px)",
          marginBottom: "clamp(2rem, 5vh, 3.5rem)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <FlipCell value={timeLeft.days} label="Days" isMounted={isMounted} />
        <Separator />
        <FlipCell value={timeLeft.hours} label="Hours" isMounted={isMounted} />
        <Separator />
        <FlipCell value={timeLeft.minutes} label="Minutes" isMounted={isMounted} />
        <Separator />
        <FlipCell value={timeLeft.seconds} label="Seconds" isMounted={isMounted} />
      </motion.div>

      {/* Register CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2rem",
          position: "relative",
          zIndex: 5,
        }}
      >
        <Link href="/register" style={{ textDecoration: "none", position: "relative" }}>
          {/* Outer glowing border for the slanted button */}
          <div style={{
            position: "absolute",
            inset: "-2px",
            background: "linear-gradient(135deg, #6344F5, #00E5FF)",
            clipPath: "polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)",
            zIndex: 0,
            filter: "blur(4px)",
            opacity: 0.6,
          }} />
          <motion.button
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 8px rgba(255,255,255,0.8)",
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              position: "relative",
              padding: "16px 60px",
              border: "none",
              background: "linear-gradient(135deg, rgba(99,68,245,0.9) 0%, rgba(24,204,252,0.9) 100%)",
              color: "#fff",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "transform 0.2s",
              overflow: "hidden",
              clipPath: "polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)",
              zIndex: 1,
            }}
          >
            {/* Scanlines on button */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                pointerEvents: "none",
              }}
            />
            {/* Shine sweep */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
            <span style={{ position: "relative", zIndex: 2 }}>
              <AnimeGlitchText text="LOGIN TO SYSTEM">LOGIN TO ARENA</AnimeGlitchText>
            </span>
          </motion.button>
        </Link>

        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}
        >
          Don&apos;t miss the arena — Secure your spot
        </p>
      </motion.div>
    </section>
  );
}
