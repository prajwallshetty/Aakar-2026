"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { eventCategory } from "@prisma/client";
import { getEventsByCategory } from "@/backend/events";
import { ExtendedEvent } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { generateEventSlug, getEventImageCandidates } from "@/lib/utils";
import { 
  AnimeParticleField, 
  AnimeOrbField, 
  AnimeCardWrapper, 
  AnimeSectionHeading, 
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

/* ─── palette ────────────────────────────────────────────────────────── */
const P = {
  yellow:  "#ffff00",
  yellow2: "#fff500",
  magenta: "#ff00ff",
  cyan:    "#00ffff",
  hot:     "#ff0066",
  black:   "#0a0005",
  white:   "#ffffff",
};

/* ─── Anime Event Card ─────────────────────────────────────────── */
function AnimeEventCard({ event, index }: { event: ExtendedEvent; index: number }) {
  const accent = ACCENTS[index % ACCENTS.length];
  const imageCandidates = getEventImageCandidates(event.imageUrl, event.id);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [event.imageUrl, event.id]);

  const imageSrc = imageCandidates[imageIndex] ?? "";
  
  return (
    <AnimeCardWrapper 
      accentIndex={index} 
      className="anime-event-card"
      style={{
        aspectRatio: "1/1.414",
        width: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Link href={`/events/${generateEventSlug(event)}`} className="block w-full h-full">
        {/* Background Image */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: "#12030d",
            borderRadius: "inherit",
            zIndex: 1
          }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt={event.eventName}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
              onError={() => {
                setImageIndex((prev) => (prev < imageCandidates.length - 1 ? prev + 1 : prev));
              }}
            />
          )}
        </div>
        
        {/* Overlay Gradient */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${ANIME_COLORS.background} 0%, transparent 60%)`,
            zIndex: 2
          }}
        />
        
        {/* Content */}
        <div 
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "1.5rem",
            zIndex: 3,
            color: ANIME_COLORS.text
          }}
        >
          <h3 
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              letterSpacing: "0.05em",
              margin: "0 0 0.5rem 0",
              textShadow: `0 0 12px ${accent.primary}40`
            }}
          >
            {event.eventName}
          </h3>
          
          <div 
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
              opacity: 0.8,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <span 
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: accent.primary,
                boxShadow: `0 0 6px ${accent.primary}`
              }}
            />
            {event.venue || "TBD"}
          </div>
        </div>
      </Link>
    </AnimeCardWrapper>
  );
}

/* ─── skeleton card ──────────────────────────────────────────────────── */
function AnimeSkeletonCard() {
  return (
    <AnimeCardWrapper 
      accentIndex={0}
      style={{
        aspectRatio: "1/1.414",
        width: "100%",
      }}
    >
      <Skeleton className="w-full h-full" style={{ borderRadius: "inherit" }} />
    </AnimeCardWrapper>
  );
}

/* ─── floating shape ─────────────────────────────────────────────────── */
function FloatShape({ style, delay, isCircle, color }: {
  style: React.CSSProperties;
  delay: string;
  isCircle: boolean;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 28, height: 28,
        borderRadius: isCircle ? "50%" : 4,
        transform: isCircle ? undefined : "rotate(45deg)",
        background: color,
        border: `2.5px solid ${ANIME_COLORS.background}`,
        boxShadow: `3px 3px 0 ${ANIME_COLORS.background}`,
        animation: `floatShape 4s ease-in-out infinite`,
        animationDelay: delay,
        opacity: 0.85,
        zIndex: 3,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
const Eventpage = ({ eventCategory }: { eventCategory: eventCategory }) => {
  const [events, setEvents]   = useState<ExtendedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEventsByCategory(eventCategory);
        setEvents(data);

        // Cache event images
        const cache = await caches.open("event-image-cache");
        data.forEach(async (event) => {
          const imageSrc = getEventImageCandidates(event.imageUrl, event.id)[0] ?? "";
          if (!imageSrc) return;

          const cached = await cache.match(imageSrc);
          if (!cached) {
            const response = await fetch(imageSrc, { mode: "no-cors" });
            cache.put(imageSrc, response);
          }
        });
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [eventCategory]);

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
        @keyframes floatShape {
          0%, 100% { transform: translateY(0px)    rotate(0deg); }
          33%       { transform: translateY(-14px)  rotate(6deg); }
          66%       { transform: translateY(-6px)   rotate(-4deg); }
        }
        @keyframes stampWiggle {
          0%, 100% { transform: rotate(var(--r)) scale(1); }
          50%       { transform: rotate(calc(var(--r) * -0.6)) scale(1.06); }
        }
        @keyframes titleIn {
          0%   { opacity:0; transform: translateY(-20px) skewX(-6deg); }
          100% { opacity:1; transform: translateY(0)     skewX(-6deg); }
        }
        @keyframes animeCardReveal {
          0%   { opacity:0; transform: translateY(30px) scale(0.92); filter: blur(2px); }
          100% { opacity:1; transform: translateY(0)    scale(1); filter: blur(0px); }
        }
        .anime-event-card-anim {
          animation: animeCardReveal 0.6s ease both;
        }
        .stamp-text {
          animation: stampWiggle 3s ease-in-out infinite;
          font-family: 'Cinzel', serif;
          -webkit-text-stroke: 2px ${ANIME_COLORS.background};
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          letter-spacing: 0.06em;
          pointer-events: none;
          user-select: none;
          opacity: 0.55;
        }
      `}</style>

      {/* Anime Background Layers */}
      <AnimeOrbField />
      <AnimeParticleField />

      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background: ANIME_COLORS.background,
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        {/* ── LAYER 1: diagonal stripe base ── */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              ${ANIME_COLORS.background}  0px,
              ${ANIME_COLORS.background}  18px,
              ${ANIME_COLORS.background}  18px,
              ${ANIME_COLORS.background}  36px
            )`,
          }}
        />

        {/* ── LAYER 2: halftone dots ── */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.18) 1.8px, transparent 1.8px)`,
            backgroundSize: "14px 14px",
          }}
        />

        {/* ── main content (z:10+) ── */}
        <div
          style={{
            position: "relative", zIndex: 10,
            minHeight: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center",
            padding: "clamp(3rem,8vh,6rem) clamp(1rem,4vw,3rem) clamp(3rem,8vh,6rem)",
          }}
        >
          {/* page title */}
          <div style={{ marginBottom: "clamp(1.5rem,5vh,3.5rem)", textAlign: "center" }}>
            {/* label chip */}
            <div style={{
              display: "inline-block",
              background: ANIME_COLORS.background,
              color: ANIME_COLORS.primary,
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: "clamp(0.6rem,1.6vw,0.8rem)",
              letterSpacing: "0.4em",
              padding: "4px 18px",
              marginBottom: "0.6rem",
              border: `1px solid ${ANIME_COLORS.primary}`,
              boxShadow: `0 0 12px ${ANIME_COLORS.primary}40`,
              backdropFilter: "blur(8px)"
            }}>
              AAKAR 2026
            </div>

            <h1 style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "clamp(2.8rem,9vw,7rem)",
              lineHeight: 0.92,
              letterSpacing: "0.04em",
              color: ANIME_COLORS.text,
              margin: 0,
              transform: "skewX(-6deg)",
              animation: "titleIn 0.5s ease both",
              textShadow: `0 0 30px ${ANIME_COLORS.primary}45, -3px -3px 0 ${ANIME_COLORS.primary}, 3px 3px 0 ${ANIME_COLORS.secondary}`,
            }}>
              {eventCategory}
            </h1>

            <div style={{
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: "clamp(0.55rem,1.5vw,0.7rem)",
              letterSpacing: "0.3em",
              color: ANIME_COLORS.secondary,
              opacity: 0.8,
              marginTop: "0.5rem",
              textTransform: "uppercase",
            }}>
              ▲ BRAINS · GUTS · GLORY ▲
            </div>
          </div>

          {/* grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full md:max-w-5xl px-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <AnimeSkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full md:max-w-5xl md:px-4"
            >
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="anime-event-card-anim"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AnimeEventCard event={event} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Eventpage;