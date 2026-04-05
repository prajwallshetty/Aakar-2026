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

export default function HeroLanding() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
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
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const bgScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const charScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const charScrollX = useTransform(scrollYProgress, [0, 1], ["0px", "50px"]);
  const charOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.9, 0]);
  const charScale = useTransform(scrollYProgress, [0, 1], [1, 0.90]);
  const logoY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const overlayOp = useTransform(scrollYProgress, [0, 0.6], [0.52, 0.80]);

  // ── Mouse motion values ───────────────────────────────────────────────────
  const bgMX = useSpring(useMotionValue(0), { stiffness: 8, damping: 30, mass: 1.8 });
  const bgMY = useSpring(useMotionValue(0), { stiffness: 8, damping: 30, mass: 1.8 });

  const chTX = useSpring(useMotionValue(0), { stiffness: 20, damping: 25, mass: 1.2 });
  const chTY = useSpring(useMotionValue(0), { stiffness: 20, damping: 25, mass: 1.2 });

  const chRX = useSpring(useMotionValue(0), { stiffness: 45, damping: 22, mass: 0.7 });
  const chRY = useSpring(useMotionValue(0), { stiffness: 45, damping: 22, mass: 0.7 });

  const textMX = useSpring(useMotionValue(0), { stiffness: 30, damping: 28, mass: 1.0 });

  useEffect(() => {
    if (isMobile) {
      bgMX.set(0); bgMY.set(0);
      chTX.set(0); chTY.set(0);
      chRX.set(0); chRY.set(0);
      textMX.set(0);
      return;
    }

    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / cx));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / cy));

      bgMX.set(nx * -20);
      bgMY.set(ny * -11);

      chTX.set(nx * -36);
      chTY.set(ny * -20);

      chRY.set(nx * 9);
      chRX.set(ny * -5);

      textMX.set(nx * 12);
    };

    let ticking = false;
    const throttledHandler = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handler(e);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", throttledHandler, { passive: true });
    return () => window.removeEventListener("mousemove", throttledHandler);
  }, [isMobile, bgMX, bgMY, chTX, chTY, chRX, chRY, textMX]);

  // ── Ember canvas ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spriteCanvas = document.createElement("canvas");
    const spriteSize = 20;
    spriteCanvas.width = spriteSize;
    spriteCanvas.height = spriteSize;
    const sCtx = spriteCanvas.getContext("2d");

    const createParticleSprite = (hue: number) => {
      if (!sCtx) return spriteCanvas;
      sCtx.clearRect(0, 0, spriteSize, spriteSize);
      const g = sCtx.createRadialGradient(
        spriteSize / 2, spriteSize / 2, 0,
        spriteSize / 2, spriteSize / 2, spriteSize / 2
      );
      g.addColorStop(0, `hsla(${hue},100%,82%,1)`);
      g.addColorStop(0.4, `hsla(${hue},100%,55%,0.7)`);
      g.addColorStop(1, `hsla(${hue},100%,40%,0)`);
      sCtx.fillStyle = g;
      sCtx.beginPath();
      sCtx.arc(spriteSize / 2, spriteSize / 2, spriteSize / 2, 0, Math.PI * 2);
      sCtx.fill();
      return spriteCanvas;
    };

    const particleSprite = createParticleSprite(30);

    type E = {
      x: number; y: number; vx: number; vy: number;
      r: number; op: number; life: number; max: number;
    };
    const spawn = (w: number, h: number): E => ({
      x: Math.random() * w,
      y: h + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.5 + 0.4),
      r: Math.random() * 2.0 + 0.4,
      op: Math.random() * 0.6 + 0.2,
      life: 0,
      max: 140 + Math.random() * 120,
    });

    const em: E[] = Array.from({ length: 60 }, () => spawn(canvas.width, canvas.height));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < em.length; i++) {
        const e = em[i];
        e.x += e.vx + Math.sin(e.life * 0.04) * 0.3;
        e.y += e.vy;
        e.life++;

        if (e.life > e.max || e.y < -20) {
          em[i] = spawn(canvas.width, canvas.height);
          continue;
        }

        const fade = Math.sin((e.life / e.max) * Math.PI);
        const size = e.r * 6 * fade;

        ctx.globalAlpha = e.op;
        ctx.drawImage(particleSprite, e.x - size / 2, e.y - size / 2, size, size);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const chars = "A NEW ERA BEGINS".split("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;700&family=Noto+Serif+JP:wght@200;300&display=swap');
        .hl * { box-sizing:border-box; }

        .hl-scan { background-image:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px); }
        .hl-grain { background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E"); background-repeat:repeat; background-size:180px 180px; mix-blend-mode:overlay; }

        @keyframes hl-float {
          0%,100%{ transform:translateY(0px);   }
          35%    { transform:translateY(-11px);  }
          70%    { transform:translateY(-5px);   }
        }
        .hl-float { animation:hl-float 7s ease-in-out infinite; }

        @keyframes hl-float-mobile {
          0%,100%{ transform:translateY(0px) translateX(0px); }
          30%    { transform:translateY(-8px) translateX(3px); }
          65%    { transform:translateY(-4px) translateX(-2px); }
        }
        .hl-float-mobile { animation:hl-float-mobile 9s ease-in-out infinite; }

        @keyframes hl-sway {
          0%,100%{ transform:rotate(0deg) skewX(0deg);    }
          25%    { transform:rotate(0.45deg) skewX(0.3deg);  }
          75%    { transform:rotate(-0.35deg) skewX(-0.2deg); }
        }
        .hl-sway { animation:hl-sway 4.8s ease-in-out infinite; transform-origin:bottom center; }

        @keyframes hl-glow-breathe {
          0%,100%{ opacity:0.5; transform:scaleX(1);    }
          50%    { opacity:0.7; transform:scaleX(1.10); }
        }
        .hl-glow-breathe { animation:hl-glow-breathe 6s ease-in-out infinite; }

        @keyframes hl-logo-glow {
          0%,100%{ filter:drop-shadow(0 0 20px rgba(255,120,30,.45)) drop-shadow(0 0 55px rgba(255,60,10,.20)); }
          50%    { filter:drop-shadow(0 0 40px rgba(255,160,50,.75)) drop-shadow(0 0 90px rgba(255,80,10,.38)); }
        }
        .hl-logo-glow { animation:hl-logo-glow 3.5s ease-in-out infinite; }

        /* Mobile logo — original colors, no invert, subtle glow only */
        @keyframes hl-logo-glow-mobile {
          0%,100%{ filter:drop-shadow(0 0 18px rgba(255,255,255,.20)) drop-shadow(0 0 40px rgba(255,200,100,.15)); }
          50%    { filter:drop-shadow(0 0 30px rgba(255,255,255,.35)) drop-shadow(0 0 65px rgba(255,200,100,.25)); }
        }
        .hl-logo-glow-mobile { animation:hl-logo-glow-mobile 3.5s ease-in-out infinite; }

        @keyframes hl-badge { 0%{background-position:-200% center} 100%{background-position:200% center} }

        /* Badge — white shimmer since bg is already orange */
        .hl-badge {
          background:linear-gradient(105deg,rgba(255,255,255,.05) 0%,rgba(255,255,255,.22) 40%,rgba(255,255,255,.05) 60%,rgba(255,255,255,.02) 100%);
          background-size:200% auto;
          animation:hl-badge 4s linear infinite;
        }

        .hl-tc { display:inline-block; opacity:0; transform:translateY(22px) rotate(2deg); animation:hl-cu .7s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes hl-cu { to{ opacity:1; transform:translateY(0) rotate(0deg); } }

        @keyframes hl-vp { 0%,100%{opacity:1} 50%{opacity:.88} }
        .hl-vp { animation:hl-vp 8s ease-in-out infinite; }

        @keyframes hl-flicker { 0%,100%{opacity:.55} 30%{opacity:.50} 60%{opacity:.58} 80%{opacity:.52} }
        .hl-flicker { animation:hl-flicker 5s ease-in-out infinite; }

        @keyframes hl-bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(7px);opacity:.9} }
        .hl-bounce { animation:hl-bounce 2s ease-in-out infinite; }

        .hl-side { writing-mode:vertical-rl; font-family:'Cinzel',serif; font-size:9px; letter-spacing:.55em; text-transform:uppercase; color:rgba(255,255,255,.22); }

        .hl-persp { perspective:1000px; perspective-origin:50% 40%; }
      `}</style>

      <section ref={sectionRef} className="hl relative w-full h-screen min-h-[640px] overflow-hidden bg-black" style={{ fontFamily: "'Cinzel',serif" }}>

        {/* BG */}
        <motion.div className="absolute z-0" style={{ inset: !isMobile ? "-90px" : "-30px", y: bgScrollY, x: !isMobile ? bgMX : undefined }}>
          <motion.div className="absolute inset-0" style={{ y: !isMobile ? bgMY : undefined }}>
            <Image src="/landingbg.jpg" alt="" fill priority quality={95} sizes="130vw" style={{ objectFit: "cover", objectPosition: "center 40%" }} />
          </motion.div>
        </motion.div>

        <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" style={{ mixBlendMode: "screen", opacity: .75 }} />
        <div className="hl-scan absolute inset-0 z-10 pointer-events-none" />
        <div className="hl-grain absolute inset-0 z-10 pointer-events-none" />

        <motion.div className="hl-vp absolute inset-0 z-10 pointer-events-none" style={{ opacity: overlayOp }}>
          <div style={{ position: "absolute", inset: 0, background: ["radial-gradient(ellipse 120% 80% at 50% 115%, #0a0000 0%, transparent 55%)", "linear-gradient(to top, rgba(5,0,0,.97) 0%, rgba(8,2,0,.65) 30%, rgba(10,2,0,.15) 60%, transparent 100%)", "linear-gradient(to bottom, rgba(4,0,0,.60) 0%, transparent 30%)", "linear-gradient(to right, rgba(3,0,0,.60) 0%, transparent 45%)"].join(", ") }} />
        </motion.div>

        <div className="hl-flicker absolute top-0 left-0 z-20 pointer-events-none" style={{ width: "35vw", height: "35vw", maxWidth: 320, maxHeight: 320, background: "radial-gradient(ellipse at 0% 0%, rgba(180,30,0,.28) 0%, transparent 65%)" }} />

        {/* ════════════ DESKTOP CHARACTER ════════════ */}
        {!isMobile && (
          <motion.div
            className="hl-persp absolute"
            style={{
              right: "10vw", bottom: "-8vh", zIndex: 25,
              y: charScrollY,
              x: charScrollX,
              opacity: charOpacity,
              scale: charScale,
            }}
          >
            <motion.div style={{ x: chTX, y: chTY }}>
              <motion.div style={{ rotateX: chRX, rotateY: chRY, transformStyle: "preserve-3d" }}>
                <div className="hl-float">
                  <div style={{
                    position: "absolute", inset: "-15% -20%",
                    background: "radial-gradient(ellipse 55% 70% at 55% 75%, rgba(220,75,10,.48) 0%, rgba(160,30,0,.20) 40%, transparent 70%)",
                    filter: "blur(28px)", zIndex: -1, pointerEvents: "none",
                    borderRadius: "50%",
                  }} />
                  <div className="hl-glow-breathe" style={{
                    position: "absolute", bottom: "1%", left: "10%", right: "10%", height: "6%",
                    background: "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(190,45,0,.60) 0%, transparent 70%)",
                    filter: "blur(16px)", zIndex: -1,
                  }} />
                  <div className="hl-sway">
                    <motion.div
                      initial={{ opacity: 0, x: 100, filter: "blur(20px)", scale: .96 }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
                      transition={{ duration: 1.6, delay: .5, ease: [.22, 1, .36, 1] }}
                    >
                      <img src="/kuko.png" alt="AAKAR character" style={{
                        display: "block", objectFit: "contain",
                        height: "clamp(440px, 92vh, 870px)", width: "auto",
                        filter: "drop-shadow(-8px 0 40px rgba(235,95,10,.65)) drop-shadow(0 24px 55px rgba(180,40,0,.38)) drop-shadow(0 0 90px rgba(140,25,0,.22))",
                      }} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* ════════════ MOBILE: stacked layout ════════════
            Stack order (bottom → top):
              z-0  ambient glow
              z-1  character (centered, takes lower ~65% of screen)
              z-2  logo (above character head, ~35% from top)
        */}
        {isMobile && (
          <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 25,
            pointerEvents: "none",
          }}>
            {/* Ambient ground glow */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "90vw",
              height: "60vw",
              background: "radial-gradient(ellipse 60% 70% at 50% 85%, rgba(220,75,10,.35) 0%, rgba(160,30,0,.12) 50%, transparent 70%)",
              filter: "blur(32px)",
              zIndex: 0,
              borderRadius: "50%",
            }} />

            {/* Character — centered horizontally, sits in lower 65% */}
            <div
              className="hl-float-mobile"
              style={{
                position: "absolute",
                bottom: "-120px",
                left: "0%",
                transform: "translateX(-50%)",
                zIndex: 1,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {/* Ground shadow */}
              <div className="hl-glow-breathe" style={{
                position: "absolute", bottom: "2%", left: "10%", right: "10%", height: "5%",
                background: "rgba(0,0,0,0.45)", borderRadius: "50%", filter: "blur(8px)",
              }} />

              <div style={{ position: "relative" }}>
                <Image
                  src="/kuko.png"
                  alt="Aakar Character"
                  width={600}
                  height={800}
                  priority
                  style={{
                    display: "block",
                    objectFit: "contain",
                    height: "clamp(340px, 70vh, 560px)",
                    width: "auto",
                    maxWidth: "88vw",
                    filter: "drop-shadow(-6px 0 28px rgba(235,95,10,.60)) drop-shadow(0 18px 44px rgba(180,40,0,.35)) drop-shadow(0 0 70px rgba(140,25,0,.20))",
                  }}
                />
              </div>
            </div>

            {/* Logo — above character's head area, original colors, no tint */}
            <motion.div
              initial={{ opacity: 0, scale: .85, filter: "blur(18px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.4, delay: .7, ease: [.22, 1, .36, 1] }}
              style={{
                position: "absolute",
                top: "clamp(200px, 26vh, 410px)",
                left: "-10%",
                transform: "translateX(-50%)",
                zIndex: 2,
                width: "clamp(180px, 120vw, 810px)",
              }}
            >
              <Image
                src="/aklogo.png"
                alt="AAKAR 2026"
                width={610}
                height={220}
                priority
                className="hl-logo-glow-mobile"
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                  /* No invert — keep logo's original colors */
                }}
              />
            </motion.div>
          </div>
        )}

        {/* ── Content ───────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col justify-end md:justify-center"
          style={!isMobile ? {
            paddingLeft: "clamp(28px,7vw,100px)",
            y: textY,
            x: textMX,
          } : {
            /* Mobile: text+CTA pinned to top, above everything */
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "clamp(170px, 12vh, 90px)",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >

          {/* ── Desktop logo ─────────────────────────────────────── */}
          {!isMobile && (
            <motion.div
              style={{ y: logoY, marginLeft: "-7vw" }}
              initial={{ opacity: 0, scale: .88, filter: "blur(22px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: .45, ease: [.22, 1, .36, 1] }}
            >
              <Image src="/aklogo.png" alt="AAKAR 2026" width={620} height={240} priority className="hl-logo-glow"
                style={{ objectFit: "contain", width: "clamp(240px,52vw,620px)", height: "auto", filter: "invert(1) drop-shadow(0 0 30px rgba(255,120,30,.5))" }} />
            </motion.div>
          )}

          {/* ── Mobile: CTA + text at the very top ──────────────── */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.0, ease: [.22, 1, .36, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
            >
              {/* Tagline */}
              <div className="overflow-hidden" style={{ marginBottom: "4px" }}>
                <p style={{
                  fontFamily: "'Cinzel',serif",
                  fontWeight: 300,
                  fontSize: "clamp(.65rem,3.8vw,.95rem)",
                  letterSpacing: "clamp(.18em,1.4vw,.30em)",
                  /* White text — high contrast against orange bg */
                  color: "rgba(255,255,255,0.95)",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  textShadow: "0 1px 12px rgba(0,0,0,0.6)",
                }}>
                  {chars.map((ch, i) => (
                    <span key={i} className="hl-tc" style={{ animationDelay: `${1.0 + i * .04}s`, whiteSpace: ch === " " ? "pre" : undefined }}>{ch}</span>
                  ))}
                </p>
              </div>

              {/* Japanese subtitle */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1.2 }}
                style={{
                  fontFamily: "'Noto Serif JP',serif",
                  fontWeight: 200,
                  fontSize: "clamp(8px,2.2vw,10px)",
                  letterSpacing: ".42em",
                  /* Soft white-cream — readable on orange without blending */
                  color: "rgba(255,255,255,.50)",
                  marginTop: "5px",
                  textAlign: "center",
                  textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                }}
              >
                新たな時代の幕開け
              </motion.p>

              {/* Divider */}
              <div style={{
                width: "clamp(90px,40vw,180px)",
                height: 1,
                background: "linear-gradient(to right, transparent, rgba(255,255,255,.55), rgba(255,255,255,.30), transparent)",
                margin: "12px auto",
              }} />

              {/* Buttons */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: .9, ease: [.22, 1, .36, 1] }}
                style={{ justifyContent: "center" }}
              >
                {/* Badge — white border/text on orange bg */}
                <span className="hl-badge" style={{
                  border: "1px solid rgba(255,255,255,0.28)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "2px",
                  padding: "5px 11px",
                  fontFamily: "'Cinzel',serif",
                  fontSize: "clamp(6px,2.4vw,8px)",
                  letterSpacing: ".35em",
                  color: "rgba(255,255,255,.85)",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  textShadow: "0 1px 6px rgba(0,0,0,0.3)",
                }}>
                  Techno-Cultural Fest
                </span>

                {/* CTA button — deep dark on orange for maximum contrast */}
                <motion.button
                  whileTap={{ scale: .95 }}
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: "clamp(6px,2.4vw,8px)",
                    letterSpacing: ".35em",
                    textTransform: "uppercase",
                    color: "#fff",
                    background: "linear-gradient(135deg, rgba(10,4,0,.90) 0%, rgba(40,12,0,.85) 100%)",
                    border: "1px solid rgba(255,255,255,.30)",
                    borderRadius: "2px",
                    padding: "5px 14px",
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                    pointerEvents: "all",
                  }}
                >
                  Explore ›
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Desktop tagline + buttons ────────────────────────── */}
          {!isMobile && (
            <>
              <div className="overflow-hidden -mt-4 md:-mt-10">
                <p style={{
                  fontFamily: "'Cinzel',serif",
                  fontWeight: 300,
                  fontSize: "clamp(.75rem,2.6vw,1.5rem)",
                  letterSpacing: "clamp(.2em,1.2vw,.38em)",
                  /* White for desktop — pops against dark overlay on orange bg */
                  color: "rgba(255,255,255,0.95)",
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 18px rgba(0,0,0,0.5)",
                }}>
                  {chars.map((ch, i) => (
                    <span key={i} className="hl-tc" style={{ animationDelay: `${1.0 + i * .04}s`, whiteSpace: ch === " " ? "pre" : undefined }}>{ch}</span>
                  ))}
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1.2 }}
                style={{
                  fontFamily: "'Noto Serif JP',serif",
                  fontWeight: 200,
                  fontSize: "clamp(9px,1.2vw,13px)",
                  letterSpacing: ".48em",
                  /* Soft white-cream instead of orange/amber */
                  color: "rgba(255,255,255,.42)",
                  marginTop: "10px",
                  textShadow: "0 1px 10px rgba(0,0,0,0.4)",
                }}
              >
                新たな時代の幕開け
              </motion.p>

              <div className="mt-6 md:mt-8" style={{
                width: "clamp(140px,30vw,280px)",
                height: 1,
                /* White divider instead of orange */
                background: "linear-gradient(to right, rgba(255,255,255,.65), rgba(255,255,255,.35), transparent)",
              }} />

              <motion.div
                className="flex items-center gap-4 md:gap-6 mt-6 md:mt-7"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: .9, ease: [.22, 1, .36, 1] }}
              >
                {/* Badge — white shimmer border */}
                <span className="hl-badge" style={{
                  border: "1px solid rgba(255,255,255,0.22)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "2px",
                  padding: "6px 14px",
                  fontFamily: "'Cinzel',serif",
                  fontSize: "clamp(7px,1vw,9.5px)",
                  letterSpacing: ".40em",
                  color: "rgba(255,255,255,.80)",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                }}>
                  Techno-Cultural Fest
                </span>

                {/* CTA — dark background for max contrast on orange */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(255,255,255,.25)" }}
                  whileTap={{ scale: .97 }}
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: "clamp(7px,1vw,9.5px)",
                    letterSpacing: ".40em",
                    textTransform: "uppercase",
                    color: "#fff",
                    background: "linear-gradient(135deg, rgba(10,4,0,.92) 0%, rgba(45,14,0,.88) 100%)",
                    border: "1px solid rgba(255,255,255,.28)",
                    borderRadius: "2px",
                    padding: "6px 18px",
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                    transition: "box-shadow .3s",
                  }}
                >
                  Explore ›
                </motion.button>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Side labels — desktop only */}
        <motion.div
          className="absolute left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: .9 }}
        >
          <div className="h-14 w-px" style={{ background: "rgba(255,255,255,.12)" }} />
          <span className="hl-side">Aakar 2026</span>
          <div className="h-14 w-px" style={{ background: "rgba(255,255,255,.12)" }} />
        </motion.div>
        <motion.div
          className="absolute right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: .9 }}
        >
          <div className="h-14 w-px" style={{ background: "rgba(255,255,255,.12)" }} />
          <span className="hl-side" style={{ transform: "rotate(180deg)" }}>AJIET · Mangaluru</span>
          <div className="h-14 w-px" style={{ background: "rgba(255,255,255,.12)" }} />
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-40 flex items-end justify-between px-6 md:px-12 pb-5 md:pb-7"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}
        >
          <span className="hidden md:block" style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "9px",
            letterSpacing: ".35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,.18)",
          }}>
            Where Technology Meets Culture
          </span>
          <div className="flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2 bottom-5">
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "8px", letterSpacing: ".4em", color: "rgba(255,255,255,.22)", textTransform: "uppercase" }}>Scroll</span>
            <svg className="hl-bounce" width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v12M1 9l4 4 4-4" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      </section>
    </>
  );
}