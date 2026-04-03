"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// HeroLanding — AAKAR 2026
// landingbg.png  →  epic fire panorama (full parallax BG)
// landingch.png  →  anime character pinned bottom-right, deep parallax
// aklogo.png     →  AAKAR 2026 logo, dramatic centre reveal
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroLanding() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Scroll parallax ───────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%",   "28%"]);
  const charY     = useTransform(scrollYProgress, [0, 1], ["0%",   "14%"]);
  const charScale = useTransform(scrollYProgress, [0, 1], [1,      0.92]);
  const logoY     = useTransform(scrollYProgress, [0, 1], ["0%",  "-10%"]);
  const overlayOp = useTransform(scrollYProgress, [0, 0.6], [0.55, 0.82]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%",   "22%"]);

  // ── Mouse parallax ────────────────────────────────────────────────────────
  const rawMX   = useMotionValue(0);
  const rawMY   = useMotionValue(0);
  const rawBgX  = useMotionValue(0);
  const rawBgY  = useMotionValue(0);
  const rawChX  = useMotionValue(0);
  const rawChY  = useMotionValue(0);

  const mX  = useSpring(rawMX,  { stiffness: 50, damping: 20 });
  const mY  = useSpring(rawMY,  { stiffness: 50, damping: 20 });
  const bgX = useSpring(rawBgX, { stiffness: 18, damping: 28 });
  const bgYm = useSpring(rawBgY, { stiffness: 18, damping: 28 });
  const chX = useSpring(rawChX, { stiffness: 30, damping: 22 });
  const chY = useSpring(rawChY, { stiffness: 30, damping: 22 });

  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / cx;
      const ny = (e.clientY - cy) / cy;
      rawMX.set(nx * 14);
      rawMY.set(ny * 10);
      rawBgX.set(nx * -18);
      rawBgY.set(ny * -10);
      rawChX.set(nx * -22);
      rawChY.set(ny * -12);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [isMobile, rawMX, rawMY, rawBgX, rawBgY, rawChX, rawChY]);

  // ── Ember particle canvas ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Ember = {
      x: number; y: number; vx: number; vy: number;
      r: number; opacity: number; life: number; maxLife: number;
      hue: number;
    };

    const embers: Ember[] = [];
    for (let i = 0; i < 110; i++) {
      embers.push(spawn(canvas.width, canvas.height));
    }

    function spawn(w: number, h: number): Ember {
      return {
        x: Math.random() * w,
        y: h + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -(Math.random() * 1.8 + 0.5),
        r: Math.random() * 2.2 + 0.4,
        opacity: Math.random() * 0.7 + 0.2,
        life: 0,
        maxLife: 140 + Math.random() * 120,
        hue: 10 + Math.random() * 40, // orange to yellow
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach((e, i) => {
        e.x += e.vx + Math.sin(e.life * 0.04) * 0.35;
        e.y += e.vy;
        e.life++;
        if (e.life > e.maxLife || e.y < -10) {
          embers[i] = spawn(canvas.width, canvas.height);
          return;
        }
        const t = e.life / e.maxLife;
        const fade = Math.sin(t * Math.PI);
        ctx.save();
        ctx.globalAlpha = e.opacity * fade;
        // glow
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3);
        g.addColorStop(0, `hsla(${e.hue}, 100%, 80%, 1)`);
        g.addColorStop(0.4, `hsla(${e.hue}, 100%, 55%, 0.7)`);
        g.addColorStop(1, `hsla(${e.hue}, 100%, 40%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Staggered text reveal ─────────────────────────────────────────────────
  const chars = "A NEW ERA BEGINS".split("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;700&family=Noto+Serif+JP:wght@200;300&display=swap');

        .hl * { box-sizing: border-box; }

        /* Ink wash scanlines */
        .hl-scan {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent 3px,
            rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px
          );
        }

        /* Noise grain overlay */
        .hl-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px 180px;
          mix-blend-mode: overlay;
        }

        /* Character bloom */
        @keyframes hl-char-float {
          0%,100% { transform: translateY(0px);   }
          50%      { transform: translateY(-10px); }
        }
        .hl-char-float { animation: hl-char-float 6s ease-in-out infinite; }

        /* Logo glow pulse */
        @keyframes hl-logo-glow {
          0%,100% {
            filter: drop-shadow(0 0 20px rgba(255,120,30,0.45))
                    drop-shadow(0 0 55px rgba(255,60,10,0.20));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(255,160,50,0.75))
                    drop-shadow(0 0 90px rgba(255,80,10,0.38));
          }
        }
        .hl-logo-glow { animation: hl-logo-glow 3.5s ease-in-out infinite; }

        /* Badge shimmer */
        @keyframes hl-badge {
          0%  { background-position: -200% center; }
          100%{ background-position:  200% center; }
        }
        .hl-badge {
          background: linear-gradient(105deg,
            rgba(255,255,255,0.03) 0%,
            rgba(255,200,100,0.18) 40%,
            rgba(255,255,255,0.03) 60%,
            rgba(255,255,255,0.01) 100%
          );
          background-size: 200% auto;
          animation: hl-badge 4s linear infinite;
        }

        /* Char reveal */
        .hl-tc {
          display: inline-block;
          opacity: 0;
          transform: translateY(22px) rotate(2deg);
          animation: hl-cu 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes hl-cu { to { opacity:1; transform:translateY(0) rotate(0deg); } }

        /* Horizontal rule sweep */
        @keyframes hl-line {
          0%   { transform: scaleX(0); transform-origin: left;  }
          100% { transform: scaleX(1); transform-origin: left;  }
        }
        .hl-line { animation: hl-line 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s both; }

        /* Vignette breathe */
        @keyframes hl-vp { 0%,100%{opacity:1} 50%{opacity:0.88} }
        .hl-vp { animation: hl-vp 8s ease-in-out infinite; }

        /* Fire flicker on overlay */
        @keyframes hl-flicker {
          0%,100%{ opacity: 0.55 }
          30%    { opacity: 0.50 }
          60%    { opacity: 0.58 }
          80%    { opacity: 0.52 }
        }
        .hl-flicker { animation: hl-flicker 5s ease-in-out infinite; }

        /* Scroll cue bounce */
        @keyframes hl-bounce {
          0%,100%{ transform: translateY(0);   opacity: 0.4; }
          50%    { transform: translateY(7px);  opacity: 0.9; }
        }
        .hl-bounce { animation: hl-bounce 2s ease-in-out infinite; }

        /* Side label */
        .hl-side {
          writing-mode: vertical-rl;
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 0.55em;
          text-transform: uppercase;
          color: rgba(255,200,120,0.22);
        }

        /* Red diagonal slash — decorative */
        @keyframes hl-slash {
          0%  { clip-path: inset(0 100% 0 0); }
          100%{ clip-path: inset(0 0% 0 0);   }
        }
        .hl-slash { animation: hl-slash 1s cubic-bezier(0.22,1,0.36,1) 1.8s both; }
      `}</style>

      <section
        ref={sectionRef}
        className="hl relative w-full h-screen min-h-[640px] overflow-hidden bg-black"
        style={{ fontFamily: "'Cinzel', serif" }}
      >

        {/* ════════════════════════════ BG IMAGE — fire panorama ══ */}
        <motion.div
          className="absolute z-0"
          style={
            !isMobile
              ? { inset: "-80px", y: bgY, x: bgX }
              : { inset: "-30px" }
          }
        >
          <motion.div
            className="absolute inset-0"
            style={!isMobile ? { y: bgYm } : undefined}
          >
            <Image
              src="/landingbg.jpg"
              alt=""
              fill
              priority
              quality={95}
              sizes="120vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
          </motion.div>
        </motion.div>

        {/* ── Ember particles ─────────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ mixBlendMode: "screen", opacity: 0.75 }}
        />

        {/* ── Ink-wash scanlines ───────────────────────────────────── */}
        <div className="hl-scan absolute inset-0 z-10 pointer-events-none" />

        {/* ── Noise grain ──────────────────────────────────────────── */}
        <div className="hl-grain absolute inset-0 z-10 pointer-events-none" />

        {/* ── Multi-layer fire gradient overlay ───────────────────── */}
        <motion.div
          className="hl-vp absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: overlayOp }}
        >
          {/* Bottom darkness — pulls eye to text */}
          <div style={{
            position: "absolute", inset: 0,
            background: [
              "radial-gradient(ellipse 120% 80% at 50% 115%, #0a0000 0%, transparent 55%)",
              "linear-gradient(to top, rgba(5,0,0,0.97) 0%, rgba(8,2,0,0.65) 30%, rgba(10,2,0,0.15) 60%, transparent 100%)",
              "linear-gradient(to bottom, rgba(4,0,0,0.60) 0%, transparent 30%)",
              "linear-gradient(to right, rgba(3,0,0,0.55) 0%, transparent 40%)",
            ].join(", "),
          }} />
        </motion.div>

        {/* ── Diagonal red accent — top-left corner ───────────────── */}
        <div className="hl-flicker absolute top-0 left-0 z-20 pointer-events-none" style={{
          width: "35vw", height: "35vw", maxWidth: 320, maxHeight: 320,
          background: "radial-gradient(ellipse at 0% 0%, rgba(180,30,0,0.28) 0%, transparent 65%)",
        }} />

        {/* ── Right fire bloom behind character ───────────────────── */}
        <div className="absolute right-0 bottom-0 z-10 pointer-events-none" style={{
          width: "55vw", height: "90vh",
          background: "radial-gradient(ellipse 80% 100% at 100% 100%, rgba(200,60,0,0.22) 0%, transparent 60%)",
        }} />

        {/* ════════════════════════════ CHARACTER ══ */}
        <motion.div
          className={!isMobile ? "hl-char-float" : ""}
          style={
            !isMobile
              ? {
                  position: "absolute",
                  right: "-2vw",
                  bottom: 0,
                  zIndex: 25,
                  y: charY,
                  x: chX,
                  scale: charScale,
                }
              : {
                  position: "absolute",
                  right: "-8vw",
                  bottom: 0,
                  zIndex: 25,
                  opacity: 0.35,
                }
          }
        >
          {/* Rim glow under character */}
          <div style={{
            position: "absolute",
            bottom: 0, left: "10%", right: "10%",
            height: "40%",
            background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(220,70,10,0.45) 0%, transparent 70%)",
            filter: "blur(18px)",
            zIndex: -1,
          }} />
          <motion.div
            initial={{ opacity: 0, x: 80, filter: "blur(16px)" }}
            animate={{ opacity: 1, x: 0,  filter: "blur(0px)"  }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={!isMobile ? { y: chY } : undefined}
          >
            <img
              src="/kuko.png"
              alt="AAKAR character"
              style={{
                display: "block",
                objectFit: "contain",
                height: "clamp(420px, 90vh, 820px)",
                width: "auto",
                filter: "drop-shadow(-4px 0 30px rgba(220,80,10,0.55)) drop-shadow(0 0 60px rgba(180,40,0,0.30))",
              }}
            />
          </motion.div>
        </motion.div>

        {/* ════════════════════════════ CENTER CONTENT ══ */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-start justify-center"
          style={!isMobile ? { paddingLeft: "clamp(28px, 7vw, 100px)", y: textY, x: mX } : { paddingLeft: "24px" }}
        >

          {/* ── Top eyebrow ─────────────────────────────────────────── */}
          <motion.div
            className="flex items-center gap-3 mb-5 md:mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Red slash accent */}
            <div style={{
              width: 3, height: 28,
              background: "linear-gradient(to bottom, rgba(255,80,20,0.9), rgba(255,40,0,0.4))",
              borderRadius: 2,
            }} />
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(8px, 1.3vw, 11px)",
              letterSpacing: "0.55em",
              color: "rgba(255,160,80,0.70)",
              textTransform: "uppercase",
            }}>
              A J Institute of Engineering &amp; Technology
            </span>
          </motion.div>

          {/* ── AAKAR logo ──────────────────────────────────────────── */}
          <motion.div
            style={!isMobile ? { y: logoY } : undefined}
            initial={{ opacity: 0, scale: 0.88, filter: "blur(22px)" }}
            animate={{ opacity: 1, scale: 1,    filter: "blur(0px)"  }}
            transition={{ duration: 1.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/aklogo.png"
              alt="AAKAR 2026"
              width={620}
              height={240}
              priority
              className="hl-logo-glow"
              style={{
                objectFit: "contain",
                width: "clamp(240px, 52vw, 620px)",
                height: "auto",
                filter: "invert(1) drop-shadow(0 0 30px rgba(255,120,30,0.5))",
              }}
            />
          </motion.div>

          {/* ── "A NEW ERA BEGINS" char reveal ──────────────────────── */}
          <div className="overflow-hidden mt-4 md:mt-5">
            <p style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 300,
              fontSize: "clamp(0.75rem, 2.6vw, 1.5rem)",
              letterSpacing: "clamp(0.2em, 1.2vw, 0.38em)",
              color: "#fff",
              whiteSpace: "nowrap",
            }}>
              {chars.map((ch, i) => (
                <span
                  key={i}
                  className="hl-tc"
                  style={{
                    animationDelay: `${1.0 + i * 0.04}s`,
                    whiteSpace: ch === " " ? "pre" : undefined,
                  }}
                >
                  {ch}
                </span>
              ))}
            </p>
          </div>

          {/* ── Japanese subtitle ───────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1.2 }}
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 200,
              fontSize: "clamp(9px, 1.2vw, 13px)",
              letterSpacing: "0.48em",
              color: "rgba(255,180,100,0.38)",
              marginTop: "10px",
            }}
          >
            新たな時代の幕開け
          </motion.p>

          {/* ── Divider line ────────────────────────────────────────── */}
          <div className="mt-6 md:mt-8" style={{ width: "clamp(140px, 30vw, 280px)", height: 1, background: "linear-gradient(to right, rgba(255,100,30,0.7), rgba(255,200,100,0.4), transparent)", }} />

          {/* ── Badge + CTA row ─────────────────────────────────────── */}
          <motion.div
            className="flex items-center gap-4 md:gap-6 mt-6 md:mt-7"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <span
              className="hl-badge border border-white/15 uppercase"
              style={{
                backdropFilter: "blur(8px)",
                borderRadius: "2px",
                padding: "6px 14px",
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(7px, 1vw, 9.5px)",
                letterSpacing: "0.40em",
                color: "rgba(255,200,120,0.72)",
                whiteSpace: "nowrap",
              }}
            >
              Techno-Cultural Fest
            </span>

            {/* CTA button */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(255,80,10,0.5)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(7px, 1vw, 9.5px)",
                letterSpacing: "0.40em",
                textTransform: "uppercase",
                color: "#fff",
                background: "linear-gradient(135deg, rgba(200,50,0,0.85) 0%, rgba(255,90,10,0.75) 100%)",
                border: "1px solid rgba(255,120,40,0.45)",
                borderRadius: "2px",
                padding: "6px 18px",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "box-shadow 0.3s",
              }}
            >
              Explore ›
            </motion.button>
          </motion.div>

          {/* ── Date pill ───────────────────────────────────────────── */}
          <motion.div
            className="flex items-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,80,20,0.8)", boxShadow: "0 0 8px rgba(255,60,0,0.7)" }} />
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(8px, 1vw, 10px)", letterSpacing: "0.35em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>
              Mangaluru · 2026
            </span>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════ SIDE LABELS ══ */}
        <motion.div
          className="absolute left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.9 }}
        >
          <div className="h-14 w-px" style={{ background: "rgba(255,160,80,0.12)" }} />
          <span className="hl-side">Aakar 2026</span>
          <div className="h-14 w-px" style={{ background: "rgba(255,160,80,0.12)" }} />
        </motion.div>

        <motion.div
          className="absolute right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.9 }}
        >
          <div className="h-14 w-px" style={{ background: "rgba(255,160,80,0.12)" }} />
          <span className="hl-side" style={{ transform: "rotate(180deg)" }}>AJIET · Mangaluru</span>
          <div className="h-14 w-px" style={{ background: "rgba(255,160,80,0.12)" }} />
        </motion.div>

        {/* ════════════════════════════ BOTTOM BAR ══ */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-40 flex items-end justify-between px-6 md:px-12 pb-5 md:pb-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          {/* Left — flavour text */}
          <span className="hidden md:block" style={{ fontFamily: "'Cinzel', serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.14)" }}>
            Where Technology Meets Culture
          </span>

          {/* Centre — scroll cue */}
          <div className="flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2 bottom-5">
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "8px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>Scroll</span>
            <svg className="hl-bounce" width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v12M1 9l4 4 4-4" stroke="rgba(255,160,80,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Right — contact */}
          <a
            href="mailto:prajwal@ajiet.edu.in"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,200,100,0.75)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
          >
            prajwal@ajiet.edu.in
          </a>
        </motion.div>

      </section>
    </>
  );
}