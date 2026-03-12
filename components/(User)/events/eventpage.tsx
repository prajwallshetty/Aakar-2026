"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { eventCategory } from "@prisma/client";
import { getEventsByCategory } from "@/backend/events";
import { ExtendedEvent } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

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

/* ─── starburst SVG path ─────────────────────────────────────────────── */
function starburstPath(cx: number, cy: number, outerR: number, innerR: number, spikes = 18) {
  let d = "";
  for (let i = 0; i < spikes * 2; i++) {
    const r   = i % 2 === 0 ? outerR : innerR;
    const ang = (Math.PI / spikes) * i - Math.PI / 2;
    const x   = cx + r * Math.cos(ang);
    const y   = cy + r * Math.sin(ang);
    d += (i === 0 ? "M" : "L") + `${x},${y}`;
  }
  return d + "Z";
}

/* ─── 3-D card hook ──────────────────────────────────────────────────── */
function use3DCard() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;   // -0.5 → 0.5
    const y = (e.clientY - top)  / height - 0.5;
    el.style.transform = `
      perspective(700px)
      rotateX(${-y * 18}deg)
      rotateY(${x  * 18}deg)
      scale3d(1.04,1.04,1.04)
    `;
    // dynamic spotlight
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  return { ref, onMove, onLeave };
}

/* ─── skeleton card ──────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="relative aspect-[1/1.414] w-full overflow-hidden"
      style={{
        borderRadius: 24,
        border: `3px solid ${P.black}`,
        boxShadow: `6px 6px 0 ${P.black}`,
        background: "#e8e8e8",
      }}
    >
      <Skeleton className="w-full h-full" />
    </div>
  );
}

/* ─── event card ─────────────────────────────────────────────────────── */
function EventCard({ event, index }: { event: ExtendedEvent; index: number }) {
  const { ref, onMove, onLeave } = use3DCard();
  const accent = [P.magenta, P.cyan, P.hot, P.yellow][index % 4];
  const shadow = [P.cyan, P.hot, P.magenta, P.magenta][index % 4];

  return (
    <Link href={`/events/${event.id}`} className="block w-full" style={{ perspective: "700px" }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative aspect-[1/1.414] w-full cursor-pointer group"
        style={{
          borderRadius: 24,
          border: `3px solid ${P.black}`,
          /* hard pop-art offset shadow in theme color */
          boxShadow: `8px 8px 0 ${P.black}, 12px 12px 0 ${shadow}`,
          backgroundImage: `url('${event.id}.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
          transition: "transform 0.12s ease, box-shadow 0.12s ease",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* ── spotlight overlay (follows cursor via CSS vars) ── */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.18) 0%, transparent 65%)`,
            borderRadius: "inherit",
          }}
        />

        {/* ── halftone dot overlay ── */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${P.black} 1.5px, transparent 1.5px)`,
            backgroundSize: "8px 8px",
            borderRadius: "inherit",
          }}
        />

        {/* ── color tint layer ── */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{ background: accent, mixBlendMode: "screen", borderRadius: "inherit" }}
        />

        {/* ── floating sparkles ── */}
        {[
          { top: "22%", left: "20%", delay: "100ms" },
          { top: "35%", right: "25%", delay: "300ms" },
          { bottom: "30%", left: "45%", delay: "500ms" },
          { bottom: "22%", right: "20%", delay: "700ms" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-80 transition-opacity"
            style={{
              ...pos,
              background: [P.yellow, P.cyan, P.magenta, P.hot][i],
              border: `1.5px solid ${P.black}`,
              animationDelay: pos.delay,
              boxShadow: `0 0 6px 2px ${[P.yellow, P.cyan, P.magenta, P.hot][i]}`,
            }}
          />
        ))}

        {/* ── top edge color bar ── */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 opacity-90"
          style={{ background: accent }}
        />

        {/* ── shimmer sweep ── */}
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
          style={{
            width: "200%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
          }}
        />
      </div>
    </Link>
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
        border: `2.5px solid ${P.black}`,
        boxShadow: `3px 3px 0 ${P.black}`,
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
          const cached = await cache.match(event.imageUrl);
          if (!cached) {
            const response = await fetch(event.imageUrl, { mode: "no-cors" });
            cache.put(event.imageUrl, response);
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

  /* ── speed lines (48 radial lines from center) ── */
  const speedLines = Array.from({ length: 48 }, (_, i) => {
    const angle  = (360 / 48) * i;
    const length = 55; // vw/vh %
    return { angle, length };
  });

  const floatShapes = [
    { top: "12%",  left: "6%",  color: P.magenta, circle: true,  delay: "0s"    },
    { top: "18%",  right: "8%", color: P.cyan,    circle: false, delay: "0.6s"  },
    { top: "55%",  left: "4%",  color: P.yellow,  circle: false, delay: "1.1s"  },
    { top: "70%",  right: "5%", color: P.hot,     circle: true,  delay: "1.7s"  },
    { top: "40%",  left: "7%",  color: P.cyan,    circle: true,  delay: "2.2s"  },
    { top: "30%",  right: "9%", color: P.yellow,  circle: true,  delay: "0.3s"  },
    { top: "82%",  left: "9%",  color: P.magenta, circle: false, delay: "1.4s"  },
    { top: "88%",  right: "7%", color: P.cyan,    circle: false, delay: "2.8s"  },
  ];

  const stamps = [
    { text: "POW!",  top: "9%",  left: "3%",  rot: -12, color: P.magenta },
    { text: "ZAP!",  top: "6%",  right: "4%", rot: 10,  color: P.cyan   },
    { text: "WOW!",  bottom:"8%",left: "4%",  rot: -8,  color: P.hot    },
    { text: "BOOM!", bottom:"6%",right:"3%",  rot: 14,  color: P.yellow  },
  ];

  /* starburst positions: corners + top center */
  const bursts = [
    { cx: 0,    cy: 0,    r: 130, color: P.magenta, op: 0.22 },
    { cx: "100%", cy: 0,  r: 110, color: P.cyan,    op: 0.22 },
    { cx: 0,    cy: "100%", r: 120, color: P.hot,   op: 0.20 },
    { cx: "100%",cy:"100%",r: 130, color: P.magenta,op: 0.22 },
    { cx: "50%", cy: 0,   r:  90, color: P.yellow,  op: 0.18 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');

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
        @keyframes cardReveal {
          0%   { opacity:0; transform: translateY(30px) scale(0.94); }
          100% { opacity:1; transform: translateY(0)    scale(1); }
        }
        .event-card-anim {
          animation: cardReveal 0.45s ease both;
        }
        .stamp-text {
          animation: stampWiggle 3s ease-in-out infinite;
          font-family: 'Bebas Neue', sans-serif;
          -webkit-text-stroke: 2px ${P.black};
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          letter-spacing: 0.06em;
          pointer-events: none;
          user-select: none;
          opacity: 0.55;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background: P.yellow,
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
              ${P.yellow}  0px,
              ${P.yellow}  18px,
              ${P.yellow2} 18px,
              ${P.yellow2} 36px
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

        {/* ── LAYER 3: radial speed lines ── */}
        <svg
          aria-hidden
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:2, pointerEvents:"none", opacity:0.07 }}
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 100 100"
        >
          {speedLines.map(({ angle }, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="50" y1="50"
                x2={50 + 80 * Math.cos(rad)}
                y2={50 + 80 * Math.sin(rad)}
                stroke={P.black}
                strokeWidth="0.3"
              />
            );
          })}
        </svg>

        {/* ── LAYER 4: corner triangle blocks ── */}
        <svg aria-hidden style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:3,pointerEvents:"none"}}>
          {/* top-left magenta */}
          <polygon points="0,0 180,0 0,160"    fill={P.magenta} opacity="0.28"/>
          {/* top-right cyan */}
          <polygon points="100%,0 calc(100%-180px),0 100%,160" fill={P.cyan} opacity="0.28"
            style={{transform:"none"}}
          />
          {/* bottom-left hot */}
          <polygon points="0,100% 160,100% 0,calc(100%-140px)" fill={P.hot} opacity="0.26"/>
          {/* bottom-right magenta */}
          <polygon points="100%,100% calc(100%-160px),100% 100%,calc(100%-140px)" fill={P.magenta} opacity="0.26"/>
        </svg>

        {/* ── LAYER 5: corner starbursts ── */}
        <svg aria-hidden style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:4,pointerEvents:"none"}}>
          <path d={starburstPath(0,   0,   130, 80, 18)} fill={P.magenta} opacity="0.22"/>
          <path d={starburstPath(9999,0,   110, 70, 18)} fill={P.cyan}    opacity="0.22"
            transform={`translate(-9999,0)`}/>
          <path d={starburstPath(0,   9999,120, 75, 18)} fill={P.hot}     opacity="0.20"
            transform={`translate(0,-9999)`}/>
          <path d={starburstPath(9999,9999,130, 82, 18)} fill={P.magenta} opacity="0.22"
            transform={`translate(-9999,-9999)`}/>
          {/* top center */}
          <path
            d={starburstPath(0, -70, 90, 55, 16)}
            fill={P.yellow2}
            opacity="0.28"
            style={{ transform: "translateX(50vw)" }}
          />
        </svg>

        {/* ── LAYER 6: floating shapes ── */}
        {floatShapes.map((s, i) => (
          <FloatShape
            key={i}
            color={s.color}
            isCircle={s.circle}
            delay={s.delay}
            style={{
              top:    s.top    ?? undefined,
              bottom: (s as any).bottom ?? undefined,
              left:   s.left   ?? undefined,
              right:  (s as any).right ?? undefined,
            }}
          />
        ))}

        {/* ── LAYER 7: comic word stamps ── */}
        {stamps.map((s, i) => (
          <div
            key={i}
            className="stamp-text"
            style={{
              position: "absolute",
              top:    s.top    ?? undefined,
              bottom: (s as any).bottom ?? undefined,
              left:   s.left   ?? undefined,
              right:  (s as any).right ?? undefined,
              color:  s.color,
              "--r":  `${s.rot}deg`,
              transform: `rotate(${s.rot}deg)`,
              zIndex: 5,
            } as React.CSSProperties}
          >
            {s.text}
          </div>
        ))}

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
              background: P.black,
              color: P.yellow,
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(0.6rem,1.6vw,0.8rem)",
              letterSpacing: "0.4em",
              padding: "4px 18px",
              marginBottom: "0.6rem",
              border: `2px solid ${P.black}`,
              boxShadow: `3px 3px 0 ${P.magenta}`,
            }}>
              AAKAR 2026
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(2.8rem,9vw,7rem)",
              lineHeight: 0.92,
              letterSpacing: "0.04em",
              color: P.black,
              margin: 0,
              transform: "skewX(-6deg)",
              animation: "titleIn 0.5s ease both",
              textShadow: `4px 4px 0 ${P.magenta}, 8px 8px 0 ${P.cyan}`,
              WebkitTextStroke: `2px ${P.black}`,
            }}>
              {eventCategory}
            </h1>

            <div style={{
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: "clamp(0.55rem,1.5vw,0.7rem)",
              letterSpacing: "0.3em",
              color: P.black,
              opacity: 0.6,
              marginTop: "0.5rem",
              textTransform: "uppercase",
            }}>
              BRAINS · GUTS · GLORY
            </div>
          </div>

          {/* grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full md:max-w-5xl px-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full md:max-w-5xl md:px-4"
            >
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="event-card-anim"
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <EventCard event={event} index={index} />
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