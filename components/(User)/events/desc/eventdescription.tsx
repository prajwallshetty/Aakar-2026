"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Wallet, Phone, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedEvent } from "@/types";
import {
  AnimeParticleField,
  AnimeOrbField,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import { getEventImageCandidates } from "@/lib/utils";

/* ─── site-wide accents (purple/cyan matching footer + navbar) ── */
const SITE = {
  purple: "#6344F5",
  cyan: "#18CCFC",
  purpleGlow: "rgba(99,68,245,0.35)",
  cyanGlow: "rgba(24,204,252,0.25)",
  bg: "#08001a",
};

/* ─── per-category accent (used only for subtle highlights) ───── */
const CATEGORY_ACCENT: Record<string, string> = {
  Cultural: "#C77DFF",
  Gaming: "#FF4D00",
  Technical: "#DC2626",
  Special: "#38BDF8",
  ComboPass: "#FFD700",
};

/* ─── InfoRow ──────────────────────────────────────────────────── */
function InfoRow({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div
      className="ed-info-row"
      style={{ "--row-accent": color } as React.CSSProperties}
    >
      <span className="ed-info-icon">{icon}</span>
      <span className="ed-info-label">{label}</span>
    </div>
  );
}

/* ─── CoordinatorCard ──────────────────────────────────────────── */
function CoordinatorCard({ coordinator, accent }: { coordinator: { name: string; phone: string }; accent: string }) {
  return (
    <div className="ed-coord-card" style={{ "--coord-accent": accent } as React.CSSProperties}>
      <p className="ed-coord-name">{coordinator.name}</p>
      <div className="ed-coord-phone-row">
        <Phone size={14} />
        <Link href={`tel:${coordinator.phone}`} className="ed-coord-phone">
          {coordinator.phone}
        </Link>
      </div>
    </div>
  );
}

/* ─── Coordinator Section ──────────────────────────────────────── */
function CoordinatorSection({ title, coordinators, accent }: { title: string; coordinators: Array<{ name: string; phone: string }>; accent: string }) {
  if (!coordinators.length) return null;
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div className="ed-coord-title-bar" style={{ "--coord-accent": accent } as React.CSSProperties}>
        <span className="ed-coord-title">{title}</span>
      </div>
      <div className="ed-coord-grid">
        {coordinators.map((c, i) => <CoordinatorCard key={i} coordinator={c} accent={accent} />)}
      </div>
    </div>
  );
}

/* ─── Section Heading ──────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="ed-section-head">
      <div className="ed-head-line" style={{ background: `linear-gradient(90deg, transparent, ${SITE.purple})` }} />
      <h2 className="ed-head-title">{children}</h2>
      <div className="ed-head-line" style={{ background: `linear-gradient(-90deg, transparent, ${SITE.purple})` }} />
    </div>
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

  const catKey = eventData?.eventCategory ?? "Technical";
  const catAccent = CATEGORY_ACCENT[catKey] ?? SITE.purple;

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        /* ── keyframes ── */
        @keyframes edFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes edPosterIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes edTitleIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes edShimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── page wrapper ── */
        .ed-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: transparent;
        }

        /* ── main content container ── */
        .ed-main-content {
          position: relative;
          z-index: 10;
          padding: clamp(4rem, 10vh, 7rem) clamp(1rem, 5vw, 4rem) 8rem;
        }
        .ed-layout {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: clamp(1.5rem, 3vh, 2.5rem);
        }

        /* ── hero row ── */
        .ed-hero-row {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1.5rem, 4vw, 3rem);
          align-items: flex-start;
        }
        .ed-hero-left {
          flex: 1 1 340px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: edFadeUp 0.6s cubic-bezier(0.2,0.8,0.2,1) both;
        }
        .ed-hero-right {
          flex: 0 0 clamp(260px, 32vw, 360px);
          margin: 0 auto;
          animation: edPosterIn 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.15s both;
        }

        /* ── category badge ── */
        .ed-category-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Montserrat', 'Rajdhani', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${SITE.cyan};
          padding: 4px 12px;
          border: 1px solid rgba(24,204,252,0.3);
          border-radius: 3px;
          background: rgba(24,204,252,0.06);
          width: fit-content;
        }

        /* ── title ── */
        .ed-title {
          font-family: "GameOfSquids", Impact, "Arial Black", sans-serif;
          font-size: clamp(2.6rem, 7.5vw, 4.5rem);
          font-weight: normal;
          line-height: 0.95;
          letter-spacing: 0.03em;
          color: #fff;
          margin: 0;
          animation: edTitleIn 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.08s both;
          text-shadow: 0 2px 20px rgba(0,0,0,0.6);
        }

        /* ── card style ── */
        .ed-card {
          background: rgba(8, 2, 24, 0.65);
          border: 1px solid rgba(99,68,245,0.12);
          border-radius: 12px;
          padding: clamp(1.2rem, 3vw, 2rem);
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          animation: edFadeUp 0.5s cubic-bezier(0.2,0.8,0.2,1) both;
        }
        .ed-card:hover {
          border-color: rgba(99,68,245,0.3);
          box-shadow: 0 4px 24px rgba(99,68,245,0.1);
        }

        /* ── description text ── */
        .ed-description {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: rgba(255,255,255,0.8);
          line-height: 1.75;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        /* ── info rows ── */
        .ed-info-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 18px;
          background: rgba(99,68,245,0.04);
          border: 1px solid rgba(99,68,245,0.1);
          border-left: 3px solid var(--row-accent);
          border-radius: 8px;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .ed-info-row:hover {
          background: rgba(99,68,245,0.08);
          transform: translateX(3px);
        }
        .ed-info-icon {
          color: var(--row-accent);
          flex-shrink: 0;
          opacity: 0.85;
        }
        .ed-info-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: rgba(255,255,255,0.85);
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* ── CTA button (matches footer gradient: purple → cyan) ── */
        .ed-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Montserrat', 'Rajdhani', sans-serif;
          font-size: clamp(0.85rem, 1.6vw, 0.95rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, ${SITE.purple}, ${SITE.cyan});
          border: none;
          border-radius: 6px;
          padding: 13px 28px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 4px 18px ${SITE.purpleGlow};
          text-decoration: none;
        }
        .ed-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px ${SITE.purpleGlow}, 0 0 30px ${SITE.cyanGlow};
        }
        .ed-cta-btn:active {
          transform: translateY(1px);
        }
        .ed-cta-btn::after {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-20deg);
          animation: edShimmer 3.5s ease-in-out infinite;
        }

        /* ── poster frame ── */
        .ed-poster-frame {
          width: 100%;
          aspect-ratio: 4/5;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(99,68,245,0.2);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${SITE.purpleGlow};
          background: ${SITE.bg};
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .ed-poster-frame:hover {
          border-color: rgba(99,68,245,0.4);
          box-shadow: 0 16px 50px rgba(0,0,0,0.6), 0 0 30px ${SITE.purpleGlow};
        }
        .ed-poster-frame img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
        }
        .ed-poster-vignette {
          position: absolute; inset: 0;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
          pointer-events: none; z-index: 2;
        }
        .ed-poster-grad {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 25%;
          background: linear-gradient(transparent, rgba(8,0,26,0.4));
          pointer-events: none; z-index: 2;
        }
        .ed-poster-placeholder {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
        }
        .ed-poster-spinner {
          width: 32px; height: 32px;
          border: 2px solid ${SITE.purple};
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* ── section heading ── */
        .ed-section-head {
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 1.5rem;
        }
        .ed-head-line { flex: 1; height: 1px; opacity: 0.4; }
        .ed-head-title {
          font-family: "GameOfSquids", Impact, "Arial Black", sans-serif;
          font-size: clamp(1.1rem, 2.5vw, 1.6rem);
          letter-spacing: 0.06em;
          color: #fff;
          margin: 0 16px;
          white-space: nowrap;
        }

        /* ── rules list ── */
        .ed-rule-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 12px 16px;
          background: rgba(99,68,245,0.03);
          border: 1px solid rgba(99,68,245,0.06);
          border-radius: 8px;
          transition: background 0.25s, transform 0.25s;
        }
        .ed-rule-item:hover {
          background: rgba(99,68,245,0.07);
          transform: translateX(3px);
        }
        .ed-rule-num {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: ${SITE.purple};
          flex-shrink: 0;
          min-width: 26px;
          opacity: 0.8;
        }
        .ed-rule-text {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(0.95rem, 1.6vw, 1.08rem);
          color: rgba(255,255,255,0.8);
          line-height: 1.65;
          font-weight: 500;
          margin: 0;
        }
        .ed-no-data {
          font-family: 'Rajdhani', sans-serif;
          color: rgba(255,255,255,0.35);
          text-align: center;
          font-style: italic;
          padding: 2rem 0;
          font-size: 1rem;
        }

        /* ── coordinator cards ── */
        .ed-coord-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }
        .ed-coord-card {
          background: rgba(99,68,245,0.04);
          border: 1px solid rgba(99,68,245,0.1);
          border-bottom: 2px solid var(--coord-accent);
          border-radius: 8px;
          padding: 1.1rem;
          transition: all 0.25s ease;
        }
        .ed-coord-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
          background: rgba(99,68,245,0.07);
        }
        .ed-coord-name {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(1.05rem, 2vw, 1.2rem);
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.3rem 0;
          letter-spacing: 0.02em;
        }
        .ed-coord-phone-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--coord-accent);
        }
        .ed-coord-phone {
          color: rgba(255,255,255,0.55);
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 600;
        }
        .ed-coord-phone:hover { color: var(--coord-accent); }
        .ed-coord-title-bar {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1rem;
          border-left: 2px solid var(--coord-accent);
          padding: 3px 12px;
          background: linear-gradient(90deg, rgba(99,68,245,0.05), transparent);
        }
        .ed-coord-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(0.8rem, 1.8vw, 0.95rem);
          letter-spacing: 0.12em;
          color: var(--coord-accent);
          text-transform: uppercase;
          font-weight: 700;
        }

        /* ── poster skeleton ── */
        .ed-poster-skel {
          width: clamp(260px, 32vw, 360px);
          aspect-ratio: 4/5;
          border-radius: 12px;
          margin: 0 auto;
        }

        /* ── responsive ── */
        @media (max-width: 768px) {
          .ed-hero-row { flex-direction: column; }
          .ed-hero-right { flex: 1 1 auto; width: 100%; max-width: 360px; }
          .ed-poster-frame { aspect-ratio: 3/4; }
        }
        @media (max-width: 480px) {
          .ed-main-content {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .ed-card { padding: 1rem; }
          .ed-coord-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Background layers — same as other pages */}
      <AnimeOrbField />
      <AnimeParticleField />

      <div className="ed-page">
        <div className="ed-main-content">
          <div className="ed-layout">
            {isLoading ? <EventDescriptionSkeleton /> : !eventData ? (
              <div className="ed-card">
                <p className="ed-no-data">Event not found.</p>
              </div>
            ) : (
              <>
                {/* ── HERO ROW ── */}
                <div className="ed-hero-row">

                  {/* left: info */}
                  <div className="ed-hero-left">
                    <div className="ed-category-badge">◆ {catKey} Event</div>

                    <h1 className="ed-title">{eventData.eventName}</h1>

                    {/* Description */}
                    <div className="ed-card" style={{ animationDelay: "0.1s" }}>
                      <p className="ed-description">
                        {eventData.description || "Details coming soon..."}
                      </p>
                    </div>

                    {/* Quick Info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <InfoRow icon={<Calendar size={17} />} label={eventData.date ? new Date(eventData.date).toDateString() : "TBA"} color={SITE.cyan} />
                      <InfoRow icon={<Clock size={17} />} label={eventData.time || "TBA"} color={SITE.purple} />
                      <InfoRow icon={<Wallet size={17} />} label={eventData.fee ? `₹${eventData.fee}` : "TBA"} color={catAccent} />
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: 8 }}>
                      <Link href="/register" className="ed-cta-btn">
                        Register Now <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* right: poster */}
                  <div className="ed-hero-right">
                    <div className="ed-poster-frame">
                      {imageSrc ? (
                        <>
                          <img
                            src={imageSrc}
                            alt={eventData.eventName}
                            onError={() => {
                              setImageIndex((prev) => (prev < imageCandidates.length - 1 ? prev + 1 : prev));
                            }}
                          />
                          <div className="ed-poster-vignette" />
                          <div className="ed-poster-grad" />
                        </>
                      ) : (
                        <div className="ed-poster-placeholder">
                          <div className="ed-poster-spinner" />
                          <span style={{ fontFamily: "'Rajdhani', sans-serif", color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 600 }}>Loading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── RULES ── */}
                <div className="ed-card" style={{ animationDelay: "0.15s" }}>
                  <SectionHeading>Rules</SectionHeading>
                  {hasRules ? (
                    <ul style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                      {eventData.rules.map((rule, i) => (
                        <li key={i} className="ed-rule-item">
                          <span className="ed-rule-num">{String(i + 1).padStart(2, "0")}</span>
                          <p className="ed-rule-text">{rule}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ed-no-data">No rules specified yet.</p>
                  )}
                </div>

                {/* ── COORDINATORS ── */}
                <div className="ed-card" style={{ animationDelay: "0.25s" }}>
                  <SectionHeading>Coordinators</SectionHeading>
                  {hasCoordinators ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 6 }}>
                      <CoordinatorSection title="Student Leads" coordinators={studentCoordinators} accent={SITE.cyan} />
                      <CoordinatorSection title="Faculty Coordinators" coordinators={facultyCoordinators} accent={SITE.purple} />
                    </div>
                  ) : (
                    <p className="ed-no-data">Coordinators to be announced.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDescription;