"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { eventCategory } from "@prisma/client";
import { getEventsByCategory } from "@/backend/events";
import { ExtendedEvent } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { generateEventSlug, getEventImageCandidates } from "@/lib/utils";
import {
  AnimeCardWrapper,
  AnimeSectionHeading,
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import CharacterDecoration from "@/components/(User)/Common/CharacterDecoration";

/* ─── palette ────────────────────────────────────────────────────────── */
const P = {
  yellow: "#ffff00",
  yellow2: "#fff500",
  magenta: "#ff00ff",
  cyan: "#00ffff",
  hot: "#ff0066",
  black: "#0a0005",
  white: "#ffffff",
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
    <div className="group cursor-pointer">
      <AnimeCardWrapper
        accentIndex={index}
        className="anime-event-card transition-transform duration-500 group-hover:-translate-y-2"
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
                className="transition-transform duration-700 group-hover:scale-110"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                onError={() => {
                  setImageIndex((prev) => (prev < imageCandidates.length - 1 ? prev + 1 : prev));
                }}
              />
            )}
            
            {/* Gradient Overlay */}
            <div 
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(8,10,18,0.8) 0%, transparent 60%)",
                zIndex: 2,
                opacity: 0.8
              }}
            />
          </div>
        </Link>
      </AnimeCardWrapper>

      {/* Event Name Below Card */}
      <div className="mt-4 px-2">
        <div 
          className="text-center transition-all duration-300 transform group-hover:scale-105"
          style={{ position: "relative" }}
        >
          <div 
             className="mono uppercase"
             style={{ 
               fontSize: "10px", 
               color: accent.primary, 
               letterSpacing: "4px",
               marginBottom: "4px",
               opacity: 0.7
             }}
          >
            EVENTID//00{event.id}
          </div>
          <h3 
            className="orbitron font-black uppercase"
            style={{ 
              fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)",
              color: "#fff",
              letterSpacing: "2px",
              lineHeight: 1.2,
              textShadow: `0 0 10px ${accent.glow}`
            }}
          >
            {event.eventName}
          </h3>
          
          <div 
            className="mt-2 mx-auto transition-all duration-500"
            style={{ 
              height: "2px", 
              width: "0%", 
              background: `linear-gradient(90deg, transparent, ${accent.primary}, transparent)`,
            }}
          />
          <style>{`
            .group:hover .mt-2 {
              width: 80%;
            }
          `}</style>
        </div>
      </div>
    </div>
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
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
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
<div
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background: "transparent",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >

        {/* ── LAYER 2: Aceternity Background Beams ── */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 1,
          }}
        >
          <CharacterDecoration 
            image="/character7.png" 
            position={{ top: "-2%", left: "-8%" }}
            opacity={0.1}
            size="clamp(200px, 30vw, 500px)"
          />
          <CharacterDecoration 
            image="/character4.png" 
            position={{ top: "15%", right: "-10%" }}
            opacity={0.1}
            size="clamp(400px, 50vw, 700px)"
          />
          {events.length >= 9 && (
            <CharacterDecoration 
              image="/character2.png" 
              position={{ bottom: "0%", right: "-10%" }}
              opacity={0.1}
              size="clamp(400px, 50vw, 750px)"
            />
          )}
          <BackgroundBeams className="absolute inset-0 opacity-50" />
        </div>

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