"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Wallet, Phone, ArrowRight, User, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedEvent } from "@/types";
import {
  AnimeParticleField,
  AnimeOrbField,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  AnimeCardWrapper,
  AnimeSectionHeading,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import { getEventImageCandidates } from "@/lib/utils";
import { cinzelFont } from "@/lib/font";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/* ─── site-wide accents (purple/cyan matching footer + navbar) ── */
/* ─── per-category accent (used only for subtle highlights) ───── */
const CATEGORY_ACCENT: Record<string, string> = {
  Cultural: "#C77DFF",
  Gaming: "#FF4D00",
  Technical: "#00E5FF",
  Special: "#38BDF8",
  ComboPass: "#FFD700",
};

/* ─── Anime Stat Chip (Reusing pattern from AboutPage) ──────────────── */
function AnimeStatChip({ icon: Icon, children, color }: { icon?: any; children: React.ReactNode; color: string }) {
  return (
    <div style={{
      display:"inline-flex",alignItems:"center",gap: "8px",
      background:color + "15",
      border:`1px solid ${color}40`,
      boxShadow:`0 0 15px ${color}20, inset 0 0 10px ${color}10`,
      padding:"6px 16px",
      borderRadius:8,
      fontFamily:"'Share Tech Mono',monospace",
      fontSize:"clamp(0.8rem,1.8vw,0.95rem)",
      letterSpacing:"0.08em",
      color:color,
      textTransform:"uppercase",
      backdropFilter:"blur(8px)",
    }}>
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </div>
  );
}

/* ─── CoordinatorCard ──────────────────────────────────────────── */
function CoordinatorCard({ coordinator, accent, icon: Icon }: { coordinator: { name: string; phone: string }; accent: string; icon: any }) {
  return (
    <div className="ed-coord-card" style={{ "--coord-accent": accent } as React.CSSProperties}>
      <div className="flex items-center gap-3 mb-2">
        <div style={{
          background: `${accent}20`,
          padding: "8px",
          borderRadius: "8px",
          color: accent
        }}>
          <Icon size={18} />
        </div>
        <p className="ed-coord-name">{coordinator.name}</p>
      </div>
      <div className="ed-coord-phone-row pl-11">
        <Phone size={14} />
        <Link href={`tel:${coordinator.phone}`} className="ed-coord-phone">
          {coordinator.phone}
        </Link>
      </div>
    </div>
  );
}

/* ─── Coordinator Section ──────────────────────────────────────── */
function CoordinatorSection({ title, coordinators, accent, icon }: { title: string; coordinators: Array<{ name: string; phone: string }>; accent: string; icon: any }) {
  if (!coordinators.length) return null;
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div className="ed-coord-title-bar" style={{ "--coord-accent": accent } as React.CSSProperties}>
        <span className="ed-coord-title">{title}</span>
      </div>
      <div className="ed-coord-grid">
        {coordinators.map((c, i) => <CoordinatorCard key={i} coordinator={c} accent={accent} icon={icon} />)}
      </div>
    </div>
  );
}

/* ─── Section Heading ──────────────────────────────────────────── */
function SectionTitle({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <AnimeSectionHeading index={index} style={{ margin: "1.5rem 0 2.5rem" }}>
      {children}
    </AnimeSectionHeading>
  );
}

/* ─── Skeleton ─────────────────────────────────────────────────── */
const EventDescriptionSkeleton = () => (
  <div className="ed-main-content">
    <div className="ed-layout">
      <div className="ed-card" style={{ animationDelay: "0s" }}>
        <Skeleton className="h-12 w-2/3 rounded-lg mb-6 bg-zinc-800/50" />
        <Skeleton className="h-4 w-full rounded mb-3 bg-zinc-800/30" />
        <Skeleton className="h-4 w-5/6 rounded mb-3 bg-zinc-800/30" />
        <Skeleton className="h-4 w-4/5 rounded bg-zinc-800/30" />
      </div>
      <div className="ed-hero-row">
        <div className="ed-card ed-info-col" style={{ animationDelay: "0.1s" }}>
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg bg-zinc-800/50" />)}
          <Skeleton className="h-12 w-40 rounded-lg mt-4 bg-zinc-800/50" />
        </div>
        <Skeleton className="ed-poster-skel bg-zinc-800/50" />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
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

  const catKey = (eventData?.eventCategory ?? "Technical") as keyof typeof CATEGORY_ACCENT;
  const catAccent = CATEGORY_ACCENT[catKey] ?? ANIME_COLORS.purple;

  return (
    <>
      <style>{`
        /* ── page wrapper ── */
        .ed-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: transparent;
        }

        /* Atmospheric Decorative Elements */
        .hero-side-label {
          writing-mode: vertical-rl;
          font-family: 'Cinzel', serif;
          font-size: 8px;
          letter-spacing: 0.6em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.2);
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          pointer-events: none;
        }

        .scan-line {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px);
          animation: scanMove 12s linear infinite; z-index: 5;
        }
        @keyframes scanMove { from { background-position: 0 0; } to { background-position: 0 100%; } }

        /* Brackets */
        .ed-bracket {
          position: absolute; width: 15px; height: 15px; z-index: 20;
          opacity: 0.4; transition: opacity 0.3s, scale 0.3s;
        }
        .ed-bracket.tl { top: 12px; left: 12px; border-top: 1.5px solid var(--accent); border-left: 1.5px solid var(--accent); }
        .ed-bracket.tr { top: 12px; right: 12px; border-top: 1.5px solid var(--accent); border-right: 1.5px solid var(--accent); }
        .ed-bracket.bl { bottom: 12px; left: 12px; border-bottom: 1.5px solid var(--accent); border-left: 1.5px solid var(--accent); }
        .ed-bracket.br { bottom: 12px; right: 12px; border-bottom: 1.5px solid var(--accent); border-right: 1.5px solid var(--accent); }

        /* ── main content container ── */
        .ed-main-content {
          position: relative;
          z-index: 10;
          padding: clamp(5rem, 12vh, 8rem) clamp(1rem, 5vw, 4rem) 8rem;
        }
        .ed-layout {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: clamp(2rem, 5vh, 4rem);
        }

        /* ── hero row ── */
        .ed-hero-row {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: flex-start;
        }
        .ed-hero-left {
          flex: 1 1 400px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .ed-hero-right {
          flex: 0 0 clamp(280px, 35vw, 400px);
          margin: 0 auto;
        }

        /* ── category badge ── */
        .ed-category-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          padding: 6px 14px;
          border: 1px solid var(--accent);
          border-radius: 4px;
          background: var(--accent) 10;
          width: fit-content;
          box-shadow: 0 0 15px var(--accent) 20;
        }

        /* ── title ── */
        .ed-title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.02em;
          color: #fff;
          margin: 0;
          text-shadow: 0 0 30px rgba(0,0,0,0.5);
        }

        /* ── description text ── */
        .ed-description {
          font-family: ${montserrat.style.fontFamily};
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: rgba(255,255,255,0.75);
          line-height: 1.8;
          font-weight: 400;
        }

        /* ── CTA button ── */
        .ed-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #000;
          background: var(--accent);
          border: none;
          border-radius: 4px;
          padding: 16px 40px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 0 20px var(--accent) 40;
          text-decoration: none;
          width: fit-content;
        }
        .ed-cta-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 30px var(--accent) 60;
          letter-spacing: 0.2em;
        }

        /* ── poster frame ── */
        .ed-poster-frame {
          width: 100%;
          aspect-ratio: 4/5;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--accent) 40;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px var(--accent) 20;
          background: #000;
        }
        .ed-poster-frame img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
        }

        /* ── rules list ── */
        .ed-rule-item {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .ed-rule-item:hover {
          background: rgba(255,255,255,0.06);
          border-color: var(--accent) 40;
          transform: translateX(8px);
        }
        .ed-rule-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent);
          background: var(--accent) 15;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          flex-shrink: 0;
        }
        .ed-rule-text {
          font-family: ${montserrat.style.fontFamily};
          font-size: 1.05rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.6;
          margin: 0;
        }

        /* ── coordinator cards ── */
        .ed-coord-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .ed-coord-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        .ed-coord-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.05);
          border-color: var(--coord-accent) 40;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .ed-coord-name {
          font-family: 'Cinzel', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
          letter-spacing: 0.05em;
        }
        .ed-coord-phone-row {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--coord-accent);
        }
        .ed-coord-phone {
          color: rgba(255,255,255,0.5);
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ed-coord-phone:hover { color: var(--coord-accent); }
        .ed-coord-title-bar {
          margin-bottom: 1.5rem;
          padding-left: 1rem;
          border-left: 3px solid var(--coord-accent);
        }
        .ed-coord-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          letter-spacing: 0.15em;
          color: var(--coord-accent);
          text-transform: uppercase;
          font-weight: 700;
        }

        /* ── responsive ── */
        @media (max-width: 768px) {
          .ed-hero-row { flex-direction: column-reverse; }
          .ed-hero-right { width: 100%; max-width: 400px; }
          .ed-main-content { padding-top: 6rem; }
        }
      `}</style>

      <AnimeOrbField />
      <AnimeParticleField />
      <div className="scan-line" />
      
      <div className="hidden xl:block">
        <span className="hero-side-label left-8">Aakar 2026</span>
        <span className="hero-side-label right-8 rotate-180">AJIET · Mangaluru</span>
      </div>

      <div className="ed-page">
        <div className="ed-main-content">
          <div className="ed-layout">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EventDescriptionSkeleton />
                </motion.div>
              ) : !eventData ? (
                <motion.div
                  key="no-data"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <AnimeCardWrapper accentIndex={0} style={{ padding: "3rem", textAlign: "center" }}>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", color: "rgba(255,255,255,0.4)" }}>
                      ERROR: EVENT_NOT_FOUND
                    </p>
                  </AnimeCardWrapper>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* ── HERO ROW ── */}
                  <div className="ed-hero-row mb-12">
                    {/* Left: Info */}
                    <div className="ed-hero-left">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="ed-category-badge" style={{ "--accent": catAccent } as any}>
                          ◆ {catKey} Event
                        </div>
                      </motion.div>

                      <motion.h1
                        className={`ed-title ${cinzelFont.className}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {eventData.eventName}
                      </motion.h1>

                      {/* Description */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <AnimeCardWrapper accentIndex={1} style={{ padding: "1.5rem 2rem" }}>
                          <div className="ed-bracket tl" style={{ "--accent": ANIME_COLORS.secondary } as any} />
                          <div className="ed-bracket tr" style={{ "--accent": ANIME_COLORS.secondary } as any} />
                          <div className="ed-bracket bl" style={{ "--accent": ANIME_COLORS.secondary } as any} />
                          <div className="ed-bracket br" style={{ "--accent": ANIME_COLORS.secondary } as any} />
                          
                          <div className="scan-line" style={{ opacity: 0.05 }} />
                          
                          <p className="ed-description relative z-10">
                            {eventData.description || "The digital archives for this event are currently being updated. Details will be broadcasted shortly."}
                          </p>
                        </AnimeCardWrapper>
                      </motion.div>

                      {/* Quick Info Chips */}
                      <motion.div
                        className="flex flex-wrap gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <AnimeStatChip icon={Calendar} color={ANIME_COLORS.secondary}>
                          {eventData.date ? new Date(eventData.date).toDateString() : "TBA / 2026"}
                        </AnimeStatChip>
                        <AnimeStatChip icon={Clock} color={ANIME_COLORS.purple}>
                          {eventData.time || "CHRONO_TBA"}
                        </AnimeStatChip>
                        <AnimeStatChip icon={Wallet} color={catAccent}>
                          {eventData.fee ? `CREDITS: ₹${eventData.fee}` : "FEE_TBA"}
                        </AnimeStatChip>
                      </motion.div>

                      {/* CTA */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Link href="/register" className="ed-cta-btn" style={{ "--accent": catAccent } as any}>
                          Initialize Registration <ArrowRight size={20} />
                        </Link>
                      </motion.div>
                    </div>

                    {/* Right: Poster */}
                    <motion.div
                      className="ed-hero-right"
                      initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    >
                      <div className="ed-poster-frame" style={{ "--accent": catAccent } as any}>
                        <div className="ed-bracket tl" style={{ "--accent": catAccent } as any} />
                        <div className="ed-bracket tr" style={{ "--accent": catAccent } as any} />
                        <div className="ed-bracket bl" style={{ "--accent": catAccent } as any} />
                        <div className="ed-bracket br" style={{ "--accent": catAccent } as any} />
                        
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={eventData.eventName}
                            onError={() => {
                              setImageIndex((prev) => (prev < imageCandidates.length - 1 ? prev + 1 : prev));
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
                            <Skeleton className="w-16 h-16 rounded-full bg-white/5" />
                            <span className="font-mono text-xs tracking-widest">LOADING_POSTER...</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* ── RULES SECTION ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <SectionTitle index={0}>Operational Protocols</SectionTitle>
                    <AnimeCardWrapper accentIndex={3} style={{ padding: "2rem" }}>
                      <div className="ed-bracket tl" style={{ "--accent": ANIME_COLORS.purple } as any} />
                      <div className="ed-bracket tr" style={{ "--accent": ANIME_COLORS.purple } as any} />
                      <div className="ed-bracket bl" style={{ "--accent": ANIME_COLORS.purple } as any} />
                      <div className="ed-bracket br" style={{ "--accent": ANIME_COLORS.purple } as any} />
                      
                      {hasRules ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {eventData.rules.map((rule, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              className="ed-rule-item"
                              style={{ "--accent": ANIME_COLORS.purple } as any}
                            >
                              <span className="ed-rule-num">{String(i + 1).padStart(2, "0")}</span>
                              <p className="ed-rule-text">{rule}</p>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic", fontFamily: "'Share Tech Mono', monospace" }}>
                          NO_PROTOCOLS_DEFINED_YET
                        </p>
                      )}
                    </AnimeCardWrapper>
                  </motion.div>

                  {/* ── COORDINATORS SECTION ── */}
                  <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <SectionTitle index={1}>Command & Control</SectionTitle>
                    <AnimeCardWrapper accentIndex={1} style={{ padding: "2.5rem" }}>
                      <div className="ed-bracket tl" style={{ "--accent": ANIME_COLORS.secondary } as any} />
                      <div className="ed-bracket tr" style={{ "--accent": ANIME_COLORS.secondary } as any} />
                      <div className="ed-bracket bl" style={{ "--accent": ANIME_COLORS.secondary } as any} />
                      <div className="ed-bracket br" style={{ "--accent": ANIME_COLORS.secondary } as any} />
                      
                      {hasCoordinators ? (
                        <div className="space-y-4">
                          <CoordinatorSection 
                            title="Field Operatives (Students)" 
                            coordinators={studentCoordinators} 
                            accent={ANIME_COLORS.secondary}
                            icon={User}
                          />
                          <CoordinatorSection 
                            title="Commanding Officers (Faculty)" 
                            coordinators={facultyCoordinators} 
                            accent={ANIME_COLORS.purple}
                            icon={ShieldCheck}
                          />
                        </div>
                      ) : (
                        <p style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic", fontFamily: "'Share Tech Mono', monospace" }}>
                          PERSONNEL_TO_BE_ASSIGNED
                        </p>
                      )}
                    </AnimeCardWrapper>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDescription;