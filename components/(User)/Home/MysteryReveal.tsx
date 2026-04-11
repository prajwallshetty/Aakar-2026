"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimeCardWrapper, AnimeGlitchText } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import CharacterDecoration from "@/components/(User)/Common/CharacterDecoration";

/* ─── Mystery Reveal: DJ Night (Day 1) + Concert (Day 2) ───────── */

const MYSTERY_PANELS = [
  {
    day: "DAY 1",
    title: "PULSE NIGHT",
    subtitle: "DJ Night",
    accent: "#AE48FF",
    accentGlow: "rgba(174,72,255,0.4)",
    accentSoft: "rgba(174,72,255,0.08)",
    icon: "🎧",
    hint: "Bass drops incoming...",
    bgImage: "/dj.png",
  },
  {
    day: "DAY 2",
    title: "THE HARMONIC VIBES",
    subtitle: "Live Concert",
    accent: "#00E5FF",
    accentGlow: "rgba(0,229,255,0.4)",
    accentSoft: "rgba(0,229,255,0.08)",
    icon: "🎸",
    hint: "Strings of destiny...",
    bgImage: "/Concert.png",
  },
];

/* ─── Floating Particle Canvas ───────────────────────────────── */
function MysteryParticles({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
}

/* ─── Animated Question Mark ─────────────────────────────────── */
function AnimatedQuestionMark({ accent, accentGlow }: { accent: string; accentGlow: string }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow ring */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      {/* Second ring */}
      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{
          position: "absolute",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          border: `1px solid ${accent}30`,
        }}
      />
      {/* The ? */}
      <motion.span
        animate={{
          textShadow: [
            `0 0 20px ${accentGlow}, 0 0 40px ${accentGlow}, 0 0 60px ${accent}20`,
            `0 0 40px ${accentGlow}, 0 0 80px ${accentGlow}, 0 0 100px ${accent}40`,
            `0 0 20px ${accentGlow}, 0 0 40px ${accentGlow}, 0 0 60px ${accent}20`,
          ],
          y: [0, -6, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontSize: "clamp(6rem, 15vw, 10rem)",
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          color: accent,
          position: "relative",
          zIndex: 2,
          lineHeight: 1,
        }}
      >
        ?
      </motion.span>
    </div>
  );
}

/* ─── Single Mystery Panel ───────────────────────────────────── */
function MysteryPanel({
  panel,
  index,
}: {
  panel: (typeof MYSTERY_PANELS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: "0 0 auto",
        width: "clamp(260px, 38vw, 420px)",
      }}
    >
      <AnimeCardWrapper 
        accentIndex={index === 0 ? 0 : 1}
        style={{
          position: "relative",
          borderRadius: "20px",
          padding: "clamp(1.2rem, 3vw, 2rem) clamp(1rem, 2.5vw, 1.8rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          cursor: "default",
          height: "380px",
          overflow: "hidden",
        }}
      >
        {/* Background Image with blur and dark tint so the identity is hidden but texture is visible */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${panel.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px) brightness(0.3) grayscale(50%)",
            opacity: 0.8,
            zIndex: 0,
            transition: "filter 0.4s",
          }}
        />
        
        {/* Particles */}
        <MysteryParticles accent={panel.accent} />

        {/* CRT scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
          backgroundSize: "100% 4px",
          borderRadius: "20px",
        }}
      />

      {/* Corner accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60px",
          height: "60px",
          borderTop: `2px solid ${panel.accent}40`,
          borderLeft: `2px solid ${panel.accent}40`,
          borderRadius: "20px 0 0 0",
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "60px",
          height: "60px",
          borderBottom: `2px solid ${panel.accent}40`,
          borderRight: `2px solid ${panel.accent}40`,
          borderRadius: "0 0 20px 0",
          zIndex: 3,
        }}
      />

      {/* Day badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 5,
          padding: "6px 20px",
          borderRadius: "20px",
          border: `1px solid ${panel.accent}50`,
          background: `${panel.accent}12`,
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          color: panel.accent,
          fontFamily: "'Share Tech Mono', monospace",
          textTransform: "uppercase",
        }}
      >
        {panel.day}
      </motion.div>

      {/* Icon */}
      <span style={{ fontSize: "2rem", position: "relative", zIndex: 5 }}>{panel.icon}</span>

      {/* Subtitle */}
      <p
        style={{
          position: "relative",
          zIndex: 5,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {panel.subtitle}
      </p>

      {/* Animated ? */}
      <div style={{ position: "relative", zIndex: 5, margin: "1rem 0" }}>
        <AnimatedQuestionMark accent={panel.accent} accentGlow={panel.accentGlow} />
      </div>

      {/* Title */}
      <h3
        style={{
          position: "relative",
          zIndex: 5,
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#fff",
          margin: 0,
          textAlign: "center",
          textShadow: `0 0 20px ${panel.accentGlow}`,
        }}
      >
        {panel.title}
      </h3>

      {/* Hint text */}
      <p
        style={{
          position: "relative",
          zIndex: 5,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.4)",
          fontStyle: "italic",
          margin: 0,
        }}
      >
        {panel.hint}
      </p>

      {/* Coming Soon badge */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "0.5rem",
          padding: "8px 24px",
          borderRadius: "6px",
          background: `linear-gradient(135deg, ${panel.accent}20, transparent)`,
          borderLeft: `2px solid ${panel.accent}`,
          fontSize: "0.6rem",
          letterSpacing: "0.35em",
          color: panel.accent,
          fontFamily: "'Share Tech Mono', monospace",
          textTransform: "uppercase",
        }}
      >
        <AnimeGlitchText text="Identity Revealed Soon">
          Identity Revealed Soon
        </AnimeGlitchText>
      </motion.div>
      </AnimeCardWrapper>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function MysteryReveal() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        padding: "clamp(3rem, 8vh, 6rem) clamp(1rem, 4vw, 3rem)",
        overflow: "hidden",
      }}
    >
      <CharacterDecoration 
        image="/character2.png" 
        position={{ top: "10%", right: "-8%" }}
        mobilePosition={{ top: "15%", right: "-12%" }}
        opacity={0.2}
        mobileOpacity={0.12}
        size="clamp(250px, 45vw, 650px)"
        mobileSize="150px"
      />
      {/* Section heading */}
      <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vh, 4rem)", position: "relative", zIndex: 5 }}>
        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.5em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Who&apos;s Performing?
        </p>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(1.6rem, 6vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            background: "linear-gradient(135deg, #fff 0%, #ccc 40%, #AE48FF 70%, #00E5FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
            lineHeight: 1.1,
            filter: "drop-shadow(0 0 20px rgba(174,72,255,0.1))",
          }}
        >
          MYSTERY HEADLINERS
        </h2>
        {/* Decorative line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "1rem",
          }}
        >
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, #AE48FF)" }} />
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#AE48FF",
              boxShadow: "0 0 8px rgba(174,72,255,0.6)",
            }}
          />
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(-90deg, transparent, #00E5FF)" }} />
        </div>
      </div>

      {/* Panels container */}
      <div
        style={{
          display: "flex",
          gap: "clamp(1rem, 3vw, 2rem)",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          maxWidth: "920px",
          margin: "0 auto",
          position: "relative",
          zIndex: 5,
        }}
      >
        {MYSTERY_PANELS.map((panel, i) => (
          <MysteryPanel key={panel.day} panel={panel} index={i} />
        ))}
      </div>

      {/* VS divider (visible on wider screens) */}
      
    </section>
  );
}
