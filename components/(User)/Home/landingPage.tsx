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
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted,  setIsMuted]  = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // ── Visibility Detection ──────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Audio ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.45;
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    audioRef.current.muted = next;
    if (!next) audioRef.current.play().catch(() => {});
  };

  // ── Mobile detection ─────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Scroll transforms ────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const logoY     = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const overlayOp = useTransform(scrollYProgress, [0, 0.6], [0.50, 0.82]);

  // ── Mouse parallax — text only ───────────────────────────────────────────
  const textMX = useSpring(useMotionValue(0), { stiffness: 30, damping: 28, mass: 1.0 });

  useEffect(() => {
    if (isMobile) { textMX.set(0); return; }
    let ticking = false;
    const handler = (e: MouseEvent) => {
      const nx = Math.max(-1, Math.min(1, (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)));
      textMX.set(nx * 10);
    };
    const throttled = (e: MouseEvent) => {
      if (!ticking) { requestAnimationFrame(() => { handler(e); ticking = false; }); ticking = true; }
    };
    window.addEventListener("mousemove", throttled, { passive: true });
    return () => window.removeEventListener("mousemove", throttled);
  }, [isMobile, textMX]);

  // ── Video: fast-start optimisation ───────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    const onCanPlay = () => isVisible && video.play().catch(() => {});
    video.addEventListener("canplaythrough", onCanPlay, { once: true });
    return () => video.removeEventListener("canplaythrough", onCanPlay);
  }, [isVisible]);



  const chars = "A NEW ERA BEGINS".split("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;700&family=Noto+Serif+JP:wght@200;300&display=swap');
        .hl*{box-sizing:border-box}

        .hl-scan{background-image:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.032) 3px,rgba(0,0,0,0.032) 4px)}
        .hl-grain{background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");background-repeat:repeat;background-size:180px;mix-blend-mode:overlay}

        @keyframes hl-breathe{0%,100%{opacity:.48;transform:scaleX(1)}50%{opacity:.74;transform:scaleX(1.13)}}
        .hl-breathe{animation:hl-breathe 6s ease-in-out infinite}

        @keyframes hl-logo-glow{
          0%,100%{filter:drop-shadow(0 0 22px rgba(255,115,25,.52)) drop-shadow(0 0 62px rgba(255,55,8,.24))}
          50%{filter:drop-shadow(0 0 46px rgba(255,165,50,.88)) drop-shadow(0 0 105px rgba(255,75,8,.44))}
        }
        .hl-logo-glow{animation:hl-logo-glow 3.8s ease-in-out infinite}
        @keyframes hl-logo-glow-m{
          0%,100%{filter:drop-shadow(0 0 20px rgba(255,255,255,.22)) drop-shadow(0 0 46px rgba(255,195,90,.18))}
          50%{filter:drop-shadow(0 0 38px rgba(255,255,255,.42)) drop-shadow(0 0 75px rgba(255,195,90,.32))}
        }
        .hl-logo-glow-m{animation:hl-logo-glow-m 3.8s ease-in-out infinite}

        @keyframes hl-badge{0%{background-position:-220% center}100%{background-position:220% center}}
        .hl-badge{background:linear-gradient(105deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.22) 40%,rgba(255,255,255,.04) 60%,rgba(255,255,255,.01) 100%);background-size:220% auto;animation:hl-badge 4.5s linear infinite}

        .hl-tc{display:inline-block;opacity:0;transform:translateY(20px) rotate(1.5deg);animation:hl-cu .65s cubic-bezier(.22,1,.36,1) forwards}
        @keyframes hl-cu{to{opacity:1;transform:translateY(0) rotate(0deg)}}

        @keyframes hl-vp{0%,100%{opacity:1}50%{opacity:.90}}
        .hl-vp{animation:hl-vp 9s ease-in-out infinite}
        @keyframes hl-flicker{0%,100%{opacity:.55}40%{opacity:.44}70%{opacity:.60}}
        .hl-flicker{animation:hl-flicker 5.5s ease-in-out infinite}
        @keyframes hl-bounce{0%,100%{transform:translateY(0);opacity:.32}50%{transform:translateY(8px);opacity:.95}}
        .hl-bounce{animation:hl-bounce 2.2s ease-in-out infinite}

        .hl-side{writing-mode:vertical-rl;font-family:'Cinzel',serif;font-size:9px;letter-spacing:.55em;text-transform:uppercase;color:rgba(255,255,255,.20)}

        .hl-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center}

        .hl-cta{transition:box-shadow .3s,transform .18s;cursor:pointer}
        .hl-cta:hover{box-shadow:0 0 30px rgba(255,255,255,.20);transform:scale(1.05)}
        .hl-cta:active{transform:scale(.97)}

        @keyframes hl-rule{0%,100%{opacity:.55}50%{opacity:.92}}
        .hl-rule{animation:hl-rule 5.2s ease-in-out infinite}
        @keyframes hl-date-pulse{0%,100%{opacity:.68}50%{opacity:1}}
        .hl-date{animation:hl-date-pulse 4.2s ease-in-out infinite}

        .hl-pulse{position:relative}
        .hl-pulse::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:1.5px solid rgba(255,255,255,.36);animation:hl-ring 2.2s cubic-bezier(0,0,.2,1) infinite}
        @keyframes hl-ring{0%{transform:scale(1);opacity:.72}100%{transform:scale(1.9);opacity:0}}
      `}</style>

      <audio ref={audioRef} src="/landing.mp3" loop muted={isMuted} playsInline autoPlay />

      <section
        ref={sectionRef}
        className="hl gpu-accelerate relative w-full h-screen min-h-[640px] overflow-hidden bg-black"
        style={{ fontFamily: "'Cinzel',serif" }}
      >

        {/* ── VIDEO: optimised for fast load ── */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster="/video-poster.jpg"
            preload="auto"
            // @ts-ignore – fetchPriority is a valid HTML attribute not yet in React types
            fetchPriority="high"
            className="hl-video"
          >
            {/* Optimized for screen size: Only loads one based on media query */}
            <source src="/aakarlandingvideo-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
            <source src="/aakarlandingvideo.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── OVERLAY 1: base dim ── */}
        <div className="absolute inset-0 z-[2]" style={{ background: "rgba(0,0,0,0.36)" }} />

        {/* ── OVERLAY 2: animated cinematic vignette ── */}
        <motion.div className="hl-vp absolute inset-0 z-[3] pointer-events-none" style={{ opacity: overlayOp }}>
          <div style={{
            position: "absolute", inset: 0,
            background: [
              "radial-gradient(ellipse 130% 88% at 50% 120%, #060000 0%, transparent 52%)",
              "linear-gradient(to top, rgba(4,0,0,.98) 0%, rgba(7,1,0,.66) 27%, rgba(8,1,0,.12) 56%, transparent 100%)",
              "linear-gradient(to bottom, rgba(3,0,0,.65) 0%, transparent 28%)",
              "linear-gradient(to right,  rgba(2,0,0,.70) 0%, transparent 42%)",
              "linear-gradient(to left,   rgba(2,0,0,.40) 0%, transparent 36%)",
            ].join(", "),
          }} />
        </motion.div>



        {/* ── OVERLAY 4: texture ── */}
        <div className="hl-scan absolute inset-0 z-[5] pointer-events-none" />
        <div className="hl-grain absolute inset-0 z-[5] pointer-events-none" />

        {/* ── OVERLAY 5: corner flares ── */}
        <div className="hl-flicker absolute top-0 left-0 z-[6] pointer-events-none" style={{ width: "38vw", height: "38vw", maxWidth: 340, maxHeight: 340, background: "radial-gradient(ellipse at 0% 0%, rgba(205,40,0,.26) 0%, transparent 62%)" }} />
        <div className="absolute top-0 right-0 z-[6] pointer-events-none" style={{ width: "26vw", height: "26vw", maxWidth: 240, maxHeight: 240, background: "radial-gradient(ellipse at 100% 0%, rgba(160,20,0,.13) 0%, transparent 60%)", opacity: 0.65 }} />

        {/* ══════════ CONTENT ══════════ */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col justify-end md:justify-start md:pt-[10vh]"
          style={!isMobile
            ? { paddingLeft: "clamp(28px,7vw,100px)", y: textY, x: textMX }
            : { paddingLeft: "20px", paddingRight: "20px", paddingTop: "clamp(80px,10vh,50px)", justifyContent: "flex-start", alignItems: "center" }}
        >

          {/* ── DESKTOP LOGO ── */}
          {!isMobile && (
            <motion.div
              style={{ y: logoY, marginLeft: "-7vw" }}
              initial={{ opacity: 0, scale: .88, filter: "blur(22px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: .45, ease: [.22, 1, .36, 1] }}
            >
              <Image
                src="/aklogo.png"
                alt="AAKAR 2026"
                width={620}
                height={240}
                priority
                className="hl-logo-glow"
                style={{ objectFit: "contain", width: "clamp(240px,52vw,620px)", height: "auto", filter: "invert(1) drop-shadow(0 0 36px rgba(255,128,34,.58))" }}
              />
            </motion.div>
          )}

          {/* ── MOBILE LOGO ── */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: .85, filter: "blur(18px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.4, delay: .7, ease: [.22, 1, .36, 1] }}
              style={{ width: "clamp(200px,80vw,420px)", marginBottom: "16px" }}
            >
              <Image
                src="/aklogo.png"
                alt="AAKAR 2026"
                width={610}
                height={220}
                priority
                className="hl-logo-glow-m"
                style={{ objectFit: "contain", width: "100%", height: "auto" }}
              />
            </motion.div>
          )}

          {/* ── MOBILE TEXT BLOCK ── */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.0, ease: [.22, 1, .36, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
            >
              <div className="overflow-hidden" style={{ marginBottom: "4px" }}>
                <p style={{ fontFamily: "'Cinzel',serif", fontWeight: 300, fontSize: "clamp(.65rem,3.8vw,.95rem)", letterSpacing: "clamp(.18em,1.4vw,.30em)", color: "rgba(255,255,255,0.96)", whiteSpace: "nowrap", textAlign: "center", textShadow: "0 1px 14px rgba(0,0,0,0.65)" }}>
                  {chars.map((ch, i) => (
                    <span key={i} className="hl-tc" style={{ animationDelay: `${1.0 + i * .04}s`, whiteSpace: ch === " " ? "pre" : undefined }}>{ch}</span>
                  ))}
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1.2 }}
                style={{ fontFamily: "'Noto Serif JP',serif", fontWeight: 200, fontSize: "clamp(8px,2.2vw,10px)", letterSpacing: ".42em", color: "rgba(255,255,255,.52)", marginTop: "5px", textAlign: "center", textShadow: "0 1px 8px rgba(0,0,0,0.48)" }}
              >
                新たな時代の幕開け
              </motion.p>

              <div className="hl-rule" style={{ width: "clamp(90px,40vw,180px)", height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,.60), rgba(255,255,255,.32), transparent)", margin: "12px auto" }} />

              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: .9, ease: [.22, 1, .36, 1] }}
                style={{ justifyContent: "center" }}
              >
                <span className="hl-badge" style={{ border: "1px solid rgba(255,255,255,0.24)", backdropFilter: "blur(10px)", borderRadius: "2px", padding: "5px 11px", fontFamily: "'Cinzel',serif", fontSize: "clamp(6px,2.4vw,8px)", letterSpacing: ".35em", color: "rgba(255,255,255,.88)", whiteSpace: "nowrap", textTransform: "uppercase", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                  Techno-Cultural Fest
                </span>
                <button className="hl-cta" style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(6px,2.4vw,8px)", letterSpacing: ".35em", textTransform: "uppercase", color: "#fff", background: "linear-gradient(135deg, rgba(8,3,0,.92) 0%, rgba(38,10,0,.88) 100%)", border: "1px solid rgba(255,255,255,.26)", borderRadius: "2px", padding: "5px 14px", backdropFilter: "blur(10px)" }}>
                  Explore ›
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── DESKTOP TAGLINE + BUTTONS ── */}
          {!isMobile && (
            <>
              <div className="overflow-hidden -mt-4 md:-mt-10">
                <p style={{ fontFamily: "'Cinzel',serif", fontWeight: 300, fontSize: "clamp(.75rem,2.6vw,1.5rem)", letterSpacing: "clamp(.2em,1.2vw,.38em)", color: "rgba(255,255,255,0.96)", whiteSpace: "nowrap", textShadow: "0 2px 22px rgba(0,0,0,0.58)" }}>
                  {chars.map((ch, i) => (
                    <span key={i} className="hl-tc" style={{ animationDelay: `${1.0 + i * .04}s`, whiteSpace: ch === " " ? "pre" : undefined }}>{ch}</span>
                  ))}
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1.2 }}
                style={{ fontFamily: "'Noto Serif JP',serif", fontWeight: 200, fontSize: "clamp(9px,1.2vw,13px)", letterSpacing: ".48em", color: "rgba(255,255,255,.40)", marginTop: "10px", textShadow: "0 1px 12px rgba(0,0,0,0.48)" }}
              >
                新たな時代の幕開け
              </motion.p>

              <div className="hl-rule mt-6 md:mt-8" style={{ width: "clamp(140px,30vw,280px)", height: 1, background: "linear-gradient(to right, rgba(255,255,255,.72), rgba(255,255,255,.36), transparent)" }} />

              <motion.div
                className="flex items-center gap-5 md:gap-7 mt-6 md:mt-7"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: .9, ease: [.22, 1, .36, 1] }}
              >
                <span className="hl-badge" style={{ border: "1px solid rgba(255,255,255,0.20)", backdropFilter: "blur(10px)", borderRadius: "2px", padding: "6px 14px", fontFamily: "'Cinzel',serif", fontSize: "clamp(7px,1vw,9.5px)", letterSpacing: ".40em", color: "rgba(255,255,255,.82)", whiteSpace: "nowrap", textTransform: "uppercase" }}>
                  Techno-Cultural Fest
                </span>
                <span className="hl-date" style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7px,1vw,9.5px)", letterSpacing: ".32em", color: "rgba(255,198,118,.76)", textTransform: "uppercase", borderLeft: "1px solid rgba(255,158,58,.28)", paddingLeft: "16px" }}>
                  2026
                </span>
                <button className="hl-cta" style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7px,1vw,9.5px)", letterSpacing: ".40em", textTransform: "uppercase", color: "#fff", background: "linear-gradient(135deg, rgba(8,3,0,.94) 0%, rgba(42,12,0,.90) 100%)", border: "1px solid rgba(255,255,255,.24)", borderRadius: "2px", padding: "7px 22px", backdropFilter: "blur(10px)" }}>
                  Explore ›
                </button>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* ══════════ SIDE LABELS ══════════ */}
        <motion.div
          className="absolute left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: .9 }}
        >
          <div className="h-14 w-px" style={{ background: "rgba(255,255,255,.10)" }} />
          <span className="hl-side">Aakar 2026</span>
          <div className="h-14 w-px" style={{ background: "rgba(255,255,255,.10)" }} />
        </motion.div>
        <motion.div
          className="absolute right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: .9 }}
        >
          <div className="h-14 w-px" style={{ background: "rgba(255,255,255,.10)" }} />
          <span className="hl-side" style={{ transform: "rotate(180deg)" }}>AJIET · Mangaluru</span>
          <div className="h-14 w-px" style={{ background: "rgba(255,255,255,.10)" }} />
        </motion.div>

        {/* ══════════ BOTTOM BAR ══════════ */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-40 flex items-end justify-between px-6 md:px-12 pb-5 md:pb-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <span className="hidden md:block" style={{ fontFamily: "'Cinzel',serif", fontSize: "9px", letterSpacing: ".35em", textTransform: "uppercase", color: "rgba(255,255,255,.15)" }}>
            Where Technology Meets Culture
          </span>
          <div className="flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2 bottom-5">
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "8px", letterSpacing: ".4em", color: "rgba(255,255,255,.20)", textTransform: "uppercase" }}>Scroll</span>
            <svg className="hl-bounce" width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v12M1 9l4 4 4-4" stroke="rgba(255,255,255,.40)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>

        {/* ══════════ AUDIO TOGGLE ══════════ */}
        <motion.div
          className="fixed bottom-6 right-6 z-[100]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <button
            onClick={toggleMute}
            className={isMuted ? "" : "hl-pulse"}
            style={{ width: 48, height: 48, borderRadius: "50%", cursor: "pointer", backdropFilter: "blur(14px)", background: isMuted ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .3s, transform .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.10)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
        </motion.div>
      </section>
    </>
  );
}