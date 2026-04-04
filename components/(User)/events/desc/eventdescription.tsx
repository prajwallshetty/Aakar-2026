"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Wallet, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedEvent } from "@/types";
import { ANIME_COLORS } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import { getEventImageCandidates } from "@/lib/utils";

// ─── Particle field ────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const COLORS = [ANIME_COLORS.primary, ANIME_COLORS.secondary, ANIME_COLORS.accent, ANIME_COLORS.purple, ANIME_COLORS.mint];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ─── Orbiting accent orbs ───────────────────────
function OrbField() {
  return (
    <div className="orb-container" aria-hidden>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
}

// ─── Glitch text ───────────────────────────────────────────────
function GlitchText({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <span className="glitch-root" data-text={text}>
      {children}
    </span>
  );
}

// ─── Custom UI Components ─────────────────────────────────────
function Card({ children, style, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={`cyber-card ${className}`} style={{
      background: "rgba(8,10,18,0.75)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1px solid rgba(0, 229, 255, 0.2)`,
      boxShadow: "0 10px 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(0, 229, 255, 0.05)",
      borderRadius: "12px",
      padding: "clamp(1.5rem, 3vw, 2.5rem)",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      {/* Decorative corners */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 15, height: 15, borderTop: `2px solid ${ANIME_COLORS.secondary}`, borderLeft: `2px solid ${ANIME_COLORS.secondary}` }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 15, height: 15, borderBottom: `2px solid ${ANIME_COLORS.primary}`, borderRight: `2px solid ${ANIME_COLORS.primary}` }} />
      {/* Subtle scanline overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "100% 4px", pointerEvents: "none", mixBlendMode: "overlay" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function SectionHeading({ children, color = ANIME_COLORS.secondary }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="section-head" style={{ marginBottom: "1.5rem" }}>
      <div className="head-line-left" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
        letterSpacing: "0.1em",
        color: ANIME_COLORS.text,
        textShadow: `0 0 15px ${color}80, 0 0 30px ${color}40`,
        margin: "0 15px",
        whiteSpace: "nowrap"
      }}>
        <span style={{ color: color, opacity: 0.7, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7em" }}>[ </span>
        {children}
        <span style={{ color: color, opacity: 0.7, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7em" }}> ]</span>
      </h2>
      <div className="head-line-right" style={{ background: `linear-gradient(-90deg, transparent, ${color})` }} />
    </div>
  );
}

function InfoRow({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 18px",
      background: "rgba(255,255,255,0.05)",
      border: `1px solid rgba(255,255,255,0.1)`,
      borderLeft: `3px solid ${color}`,
      boxShadow: `inset 20px 0 30px -20px ${color}30`,
      borderRadius: 6,
      transition: "all 0.3s ease",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = `inset 40px 0 40px -20px ${color}40, 0 0 15px ${color}20`;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = `inset 20px 0 30px -20px ${color}30`;
    }}
    >
      <span style={{ color, flexShrink: 0, filter: `drop-shadow(0 0 8px ${color})` }}>{icon}</span>
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
        color: ANIME_COLORS.text, fontWeight: 400,
        letterSpacing: "0.05em"
      }}>{label}</span>
    </div>
  );
}

function CoordinatorCard({ coordinator, accent }: { coordinator: { name: string; phone: string }; accent: string; }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid rgba(255,255,255,0.1)`,
      borderBottom: `2px solid ${accent}`,
      borderRadius: 8,
      padding: "1.2rem",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden"
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 20px rgba(0,0,0,0.5), 0 0 15px ${accent}30`;
      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.transform = "";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
    }}
    >
      <p style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "clamp(1.1rem, 2vw, 1.3rem)", fontWeight: 700,
        color: ANIME_COLORS.text, marginBottom: "0.5rem",
        letterSpacing: "0.05em",
        textShadow: `0 0 10px rgba(255,255,255,0.3)`
      }}>{coordinator.name}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Phone size={14} style={{ color: accent, flexShrink: 0 }} />
        <Link href={`tel:${coordinator.phone}`}
          style={{ color: "#aaa", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.95rem", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = accent}
          onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = "#aaa"}
        >{coordinator.phone}</Link>
      </div>
    </div>
  );
}

function CoordinatorSection({ title, coordinators, accent }: { title: string; coordinators: Array<{ name: string; phone: string }>; accent: string; }) {
  if (!coordinators.length) return null;
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        marginBottom: "1.2rem",
        borderLeft: `3px solid ${accent}`,
        padding: "4px 12px",
        background: "linear-gradient(90deg, rgba(255,255,255,0.05), transparent)"
      }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "clamp(0.85rem, 2vw, 1rem)",
          letterSpacing: "0.2em",
          color: accent,
          textTransform: "uppercase",
          textShadow: `0 0 8px ${accent}80`
        }}>{title}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {coordinators.map((c, i) => <CoordinatorCard key={i} coordinator={c} accent={accent} />)}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────
const EventDescriptionSkeleton = () => (
  <div style={{ position: "relative", zIndex: 10, padding: "clamp(3rem, 8vh, 6rem) clamp(1rem, 4vw, 3rem)" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
      <Card>
        <Skeleton className="h-12 w-2/3 rounded-lg mb-6 bg-zinc-800/50" />
        <Skeleton className="h-4 w-full rounded mb-3 bg-zinc-800/30" />
        <Skeleton className="h-4 w-5/6 rounded mb-3 bg-zinc-800/30" />
        <Skeleton className="h-4 w-4/5 rounded bg-zinc-800/30" />
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
        <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg bg-zinc-800/50" />)}
          <Skeleton className="h-12 w-40 rounded-lg mt-4 bg-zinc-800/50" />
        </Card>
        <Skeleton className="w-[300px] aspect-[4/5] rounded-2xl bg-zinc-800/50" />
      </div>
      <Card><Skeleton className="h-8 w-48 rounded mb-6 bg-zinc-800/50" /><Skeleton className="h-4 w-full rounded mb-3 bg-zinc-800/30" /><Skeleton className="h-4 w-5/6 rounded bg-zinc-800/30" /></Card>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
const EventDescription = ({
  eventData,
  isLoading = false,
}: {
  eventData?: ExtendedEvent | null;
  isLoading?: boolean;
}) => {
  const imageUrl = eventData?.imageUrl ?? "";
  const imageCandidates = getEventImageCandidates(imageUrl, eventData?.id);
  const [imageIndex, setImageIndex] = useState(0);
  const imageSrc = imageCandidates[imageIndex] ?? "";

  useEffect(() => {
    setImageIndex(0);
  }, [imageUrl, eventData?.id]);

  useEffect(() => {
    if (!imageSrc) return;
    (async () => {
      const cache = await caches.open("event-image-cache");
      const cached = await cache.match(imageSrc);
      if (!cached) {
        const response = await fetch(imageSrc, { mode: "no-cors" });
        cache.put(imageSrc, response);
      }
    })();
  }, [imageSrc]);

  const studentCoordinators = eventData?.studentCoordinators
    ? Array.isArray(eventData.studentCoordinators) ? eventData.studentCoordinators : [eventData.studentCoordinators]
    : [];
  const facultyCoordinators = eventData?.facultyCoordinators
    ? Array.isArray(eventData.facultyCoordinators) ? eventData.facultyCoordinators : [eventData.facultyCoordinators]
    : [];
  const hasCoordinators = studentCoordinators.length > 0 || facultyCoordinators.length > 0;
  const hasRules = Array.isArray(eventData?.rules) && eventData!.rules.length > 0;

  return (
    <>
      <style>{`
        /* ── Core animations & utilities ── */
        @keyframes contentIn {
          0%   { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes imageIn {
          0%   { opacity: 0; transform: scale(0.85) rotateY(15deg) rotateX(10deg); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) rotateY(0deg) rotateX(0deg); filter: blur(0px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .anim-in   { animation: contentIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .anim-img  { animation: imageIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; perspective: 1000px; }
        
        .section-head { display: flex; align-items: center; width: 100%; }
        .head-line-left, .head-line-right { flex: 1; height: 1px; }

        /* Orb background keyframes */
        @keyframes floatOrb1 { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
        @keyframes floatOrb2 { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-40px, 60px) scale(1.2); } 66% { transform: translate(25px, -30px) scale(0.8); } 100% { transform: translate(0, 0) scale(1); } }
        
        .orb-container { position: fixed; inset: 0; pointer-events: none; z-index: 0; isolation: isolate; }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; mix-blend-mode: screen; }
        .orb-1 { top: 10%; left: 10%; width: 50vw; height: 50vw; background: radial-gradient(circle, #00E5FF, transparent 70%); animation: floatOrb1 20s infinite ease-in-out; }
        .orb-2 { bottom: 10%; right: 5%; width: 40vw; height: 40vw; background: radial-gradient(circle, #FF4D00, transparent 70%); animation: floatOrb2 25s infinite ease-in-out alternate; }
        .orb-3 { top: 40%; left: 60%; width: 35vw; height: 35vw; background: radial-gradient(circle, #B026FF, transparent 70%); animation: floatOrb1 22s infinite ease-in-out reverse; opacity: 0.1; }
        .orb-4 { bottom: -10%; left: 20%; width: 45vw; height: 45vw; background: radial-gradient(circle, #FFD700, transparent 70%); animation: floatOrb2 28s infinite ease-in-out; opacity: 0.08; }

        /* Glitch text css */
        .glitch-root { position: relative; display: inline-block; }
        .glitch-root::before, .glitch-root::after {
          content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8;
        }
        .glitch-root::before { color: #00E5FF; z-index: -1; animation: glitchA 3s infinite linear alternate-reverse; }
        .glitch-root::after { color: #FF4D00; z-index: -2; animation: glitchB 2s infinite linear alternate-reverse; }
        
        @keyframes glitchA {
          0%,100%  { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 1px); }
          20%      { clip-path: inset(92% 0 1% 0);  transform: translate(1px, -2px); }
          40%      { clip-path: inset(43% 0 1% 0);  transform: translate(2px, 1px); }
          60%      { clip-path: inset(25% 0 58% 0); transform: translate(-1px, 2px); }
          80%      { clip-path: inset(54% 0 7% 0);  transform: translate(1px, 1px); }
        }
        @keyframes glitchB {
          0%,100%  { clip-path: inset(50% 0 30% 0); transform: translate(2px, -1px); }
          20%      { clip-path: inset(10% 0 85% 0); transform: translate(-2px, 1px); }
          40%      { clip-path: inset(60% 0 20% 0); transform: translate(1px, 2px); }
          60%      { clip-path: inset(85% 0 5% 0);  transform: translate(2px, -2px); }
          80%      { clip-path: inset(20% 0 50% 0); transform: translate(-1px, -1px); }
        }

        .cyber-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(1rem, 2vw, 1.2rem);
          letter-spacing: 0.15em;
          background: rgba(0, 229, 255, 0.1);
          color: #00E5FF;
          border: 1px solid #00E5FF;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.1);
          padding: 12px 36px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
        }
        .cyber-btn::before {
          content: "";
          position: absolute; top:0; left:-100%; width:50%; height:100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg);
          transition: 0.5s;
        }
        .cyber-btn:hover {
          background: rgba(0, 229, 255, 0.2);
          box-shadow: 0 0 25px rgba(0, 229, 255, 0.5), inset 0 0 15px rgba(0, 229, 255, 0.2);
          transform: translateY(-2px);
          color: #fff;
        }
        .cyber-btn:hover::before { left: 150%; }

        /* Card animations */
        .cyber-card {
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .cyber-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0, 229, 255, 0.15) !important;
          border-color: rgba(0, 229, 255, 0.4) !important;
        }

        /* Background layers */
        .event-bg-wrapper {
          position: fixed; inset: 0; z-index: -5; pointer-events: none;
        }
      `}</style>

      {/* Dynamic Background matching Team.tsx */}
      <div className="event-bg-wrapper">
        <OrbField />
        <ParticleField />
      </div>

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 10, paddingTop: "clamp(3rem, 8vh, 6rem)", paddingBottom: "14rem", paddingLeft: "clamp(1rem, 5vw, 4rem)", paddingRight: "clamp(1rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(1.5rem, 3vh, 2.5rem)" }}>

          {isLoading ? <EventDescriptionSkeleton /> : !eventData ? (
            <Card>
              <p style={{ textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: "1.2rem", color: ANIME_COLORS.secondary }}>
                [ ERROR: EVENT_DATA_NOT_FOUND ]
              </p>
            </Card>
          ) : (
            <>
              {/* ── HERO ROW ── */}
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "flex-start" }}>
                
                {/* left: info */}
                <div className="anim-in" style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Title */}
                  <div style={{ marginBottom: "0.5rem" }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", color: ANIME_COLORS.secondary, fontSize: "0.9rem", letterSpacing: "0.2em", marginBottom: 8 }}>
                      &gt; SYSTEM_OP // EVENT_ARCHIVE
                    </div>
                    <h1 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                      lineHeight: 0.9,
                      letterSpacing: "0.05em",
                      color: "#fff",
                      textShadow: `0 0 20px rgba(0,229,255,0.4), 0 0 40px rgba(255,77,0,0.2)`
                    }}>
                      <GlitchText text={eventData.eventName}>{eventData.eventName}</GlitchText>
                    </h1>
                  </div>

                  {/* Description */}
                  <Card>
                    <p style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.6,
                      fontWeight: 500,
                      letterSpacing: "0.02em"
                    }}>
                      {eventData.description || "Details rendering... standby."}
                    </p>
                  </Card>

                  {/* Quick Info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <InfoRow icon={<Calendar size={18} />} label={eventData.date ? new Date(eventData.date).toDateString() : "TBA"} color={ANIME_COLORS.secondary} />
                    <InfoRow icon={<Clock size={18} />} label={eventData.time || "TBA"} color={ANIME_COLORS.primary} />
                    <InfoRow icon={<Wallet size={18} />} label={eventData.fee ? `₹${eventData.fee}` : "TBA"} color={ANIME_COLORS.accent} />
                  </div>

                  {/* CTA */}
                  <div style={{ marginTop: 16 }}>
                    <Link href="/register">
                      <button className="cyber-btn">
                        INITIALIZE REGISTRATION //_
                      </button>
                    </Link>
                  </div>
                </div>

                {/* right: poster */}
                <div className="anim-img" style={{ flex: "0 0 clamp(260px, 35vw, 360px)", margin: "0 auto" }}>
                  <div style={{
                    width: "100%", aspectRatio: "4/5", position: "relative",
                    background: "rgba(0,0,0,0.5)", border: `1px solid ${ANIME_COLORS.secondary}`,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${ANIME_COLORS.secondary}40, inset 0 0 20px ${ANIME_COLORS.secondary}20`,
                    borderRadius: "16px", overflow: "hidden",
                  }}>
                    {imageSrc ? (
                      <>
                        <div style={{
                          position: "absolute", inset: 0,
                        }}>
                          <img
                            src={imageSrc}
                            alt={eventData.eventName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                              filter: "contrast(1.1) saturate(1.1)",
                            }}
                            onError={() => {
                              setImageIndex((prev) => (prev < imageCandidates.length - 1 ? prev + 1 : prev));
                            }}
                          />
                        </div>
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,229,255,0.1) 1px, transparent 1px)", backgroundSize: "100% 4px", pointerEvents: "none", mixBlendMode: "overlay" }} />
                        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)", pointerEvents: "none" }} />
                      </>
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                        <div style={{ width: 40, height: 40, border: `2px solid ${ANIME_COLORS.secondary}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", color: ANIME_COLORS.secondary, fontSize: "0.9rem", letterSpacing: "0.2em" }}>AWAITING_IMAGE</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
              {/* ── RULES ── */}
              <Card className="anim-in" style={{ animationDelay: "0.15s" }}>
                <SectionHeading color={ANIME_COLORS.primary}>SYSTEM DIRECTIVES_</SectionHeading>
                {hasRules ? (
                  <ul style={{ display: "flex", flexDirection: "column", gap: 12, margin: 0, padding: 0, listStyle: "none" }}>
                    {eventData.rules.map((rule, i) => (
                      <li key={i} style={{
                        display: "flex", gap: 16, alignItems: "flex-start",
                        padding: "12px 16px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "8px", transition: "background 0.3s"
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLLIElement).style.background = "rgba(255,255,255,0.06)"}
                      onMouseLeave={e => (e.currentTarget as HTMLLIElement).style.background = "rgba(255,255,255,0.03)"}
                      >
                        <span style={{
                          fontFamily: "'Share Tech Mono', monospace", fontSize: "1.1rem",
                          color: ANIME_COLORS.primary, textShadow: `0 0 10px ${ANIME_COLORS.primary}80`, flexShrink: 0, minWidth: 28,
                        }}>
                          [{String(i+1).padStart(2, "0")}]
                        </span>
                        <p style={{
                          fontFamily: "'Rajdhani', sans-serif", fontSize: "clamp(1rem, 1.6vw, 1.1rem)",
                          color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0, fontWeight: 500
                        }}>{rule}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", color: "rgba(255,255,255,0.5)", textAlign: "center", fontStyle: "italic", padding: "2rem 0" }}>
                    &gt; NO_DIRECTIVES_FOUND
                  </p>
                )}
              </Card>

              {/* ── COORDINATORS ── */}
              <Card className="anim-in" style={{ animationDelay: "0.3s" }}>
                <SectionHeading color={ANIME_COLORS.accent}>OPERATORS_</SectionHeading>
                {hasCoordinators ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 10 }}>
                    <CoordinatorSection title="STUDENT_LEADS" coordinators={studentCoordinators} accent={ANIME_COLORS.secondary} />
                    <CoordinatorSection title="FACULTY_OVERSEERS" coordinators={facultyCoordinators} accent={ANIME_COLORS.accent} />
                  </div>
                ) : (
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", color: "rgba(255,255,255,0.5)", textAlign: "center", fontStyle: "italic", padding: "2rem 0" }}>
                    &gt; WAITING_FOR_OPERATOR_ASSIGNMENT
                  </p>
                )}
              </Card>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EventDescription;