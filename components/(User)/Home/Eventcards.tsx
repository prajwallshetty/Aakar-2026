"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "@/components/(User)/PopArtBackground";

/* ─── card data ─────────────────────────────────────────────── */
const CARDS = [
  {
    id: 1,
    label: "CULTURAL",
    sub: "STAGE · DANCE · MUSIC",
    href: "/events/cultural",
    accent: P.magenta,
    shadow: P.cyan,
    image: "/events/9.png",
  },
  {
    id: 2,
    label: "TECHNICAL",
    sub: "CODE · BUILD · HACK",
    href: "/events/technical",
    accent: P.cyan,
    shadow: P.hot,
    image: "/events/12.png",
  },
  {
    id: 3,
    label: "GAMING",
    sub: "COMPETE · PLAY · WIN",
    href: "/events/gaming",
    accent: P.hot,
    shadow: P.magenta,
    image: "/events/13.png",
  },
  {
    id: 4,
    label: "SPECIAL",
    sub: "UNIQUE · RARE · EPIC",
    href: "/events/special",
    accent: P.magenta,
    shadow: P.cyan,
    image: "/events/11.png",
  },
];

const N = CARDS.length;

/* ─── smooth spring lerp helper ───────────────────────────────── */
function useSpringValue(target: number, stiffness = 0.12) {
  const [val, setVal] = useState(target);
  const ref = useRef(target);
  const raf = useRef<number>(0);

  useEffect(() => {
    function tick() {
      ref.current += (target - ref.current) * stiffness;
      if (Math.abs(ref.current - target) > 0.001) {
        setVal(ref.current);
        raf.current = requestAnimationFrame(tick);
      } else {
        ref.current = target;
        setVal(target);
      }
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, stiffness]);

  return val;
}

/* ═══════════════════════════════════════════════════════════════ */
export default function EventCards() {
  const [active, setActive]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const autoRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── auto-advance ─── */
  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setActive(a => (a + 1) % N), 3600);
  }, []);

  useEffect(() => { resetAuto(); return () => { if (autoRef.current) clearInterval(autoRef.current); }; }, [resetAuto]);

  function go(dir: 1 | -1) { setActive(a => (a + dir + N) % N); resetAuto(); }

  /* ── drag / swipe ─── */
  function onPointerDown(x: number) { setDragging(true); dragStart.current = x; }
  function onPointerUp(x: number) {
    if (!dragging) return;
    setDragging(false);
    const d = dragStart.current - x;
    if (Math.abs(d) > 44) go(d > 0 ? 1 : -1);
  }

  /* ── spring-smoothed active index (fractional) ─── */
  const springActive = useSpringValue(active, 0.1);

  const activeCard = CARDS[active];

  return (
    <>
      <style>{`
        ${POP_ART_KEYFRAMES}

        @keyframes ecReveal {
          from { opacity:0; transform:translateY(24px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes ecLabelIn {
          from { opacity:0; transform:skewX(-6deg) translateX(-16px); }
          to   { opacity:1; transform:skewX(-6deg) translateX(0);     }
        }
        @keyframes ecShimmer {
          from { transform:translateX(-130%); }
          to   { transform:translateX(220%);  }
        }
        @keyframes ecFloat {
          0%,100% { transform:translateY(0px);   }
          50%     { transform:translateY(-8px);   }
        }
        @keyframes ecBarGrow {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }

        .ec-card {
          will-change: transform, opacity;
          cursor: pointer;
          outline: none;
        }
        .ec-card-face {
          transition:
            box-shadow   0.28s cubic-bezier(.25,.8,.25,1),
            transform    0.28s cubic-bezier(.25,.8,.25,1),
            border-color 0.28s ease;
        }
        .ec-card:hover .ec-card-face {
          transform: translate(-8px,-8px) !important;
        }
        .ec-shimmer {
          position:absolute; inset:0; pointer-events:none; overflow:hidden;
        }
        .ec-shimmer::after {
          content:'';
          position:absolute; top:0; left:0;
          width:50%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transform:translateX(-130%);
        }
        .ec-card:hover .ec-shimmer::after {
          animation: ecShimmer 0.6s cubic-bezier(.4,0,.2,1) forwards;
        }
      `}</style>

      <section
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          padding: "clamp(3.5rem,9vh,6rem) 0 clamp(4rem,10vh,7rem)",
        }}
      >
        <PopArtBackground />

        {/* ══════════ HEADING ══════════ */}
        <div style={{
          position: "relative", zIndex: 6,
          textAlign: "center",
          marginBottom: "clamp(2rem,5vh,3.5rem)",
          animation: "ecReveal 0.6s ease both",
        }}>
          {/* dashes */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:32, height:4, background:P.black, boxShadow:`2px 2px 0 ${P.magenta}` }}/>
            <span style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(0.6rem,1.3vw,0.75rem)",
              letterSpacing:"0.42em",
              color:P.black,
            }}>AAKAR 2026</span>
            <div style={{ width:32, height:4, background:P.black, boxShadow:`2px 2px 0 ${P.cyan}` }}/>
          </div>

          <h2 style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(3rem,9vw,7rem)",
            lineHeight:0.9,
            letterSpacing:"0.06em",
            color:P.black,
            WebkitTextStroke:`1px ${P.black}`,
            /* hard offset shadow — pop-art signature */
            textShadow:`4px 4px 0 ${P.magenta}, 8px 8px 0 ${P.cyan}`,
            margin:0,
          }}>
            PICK YOUR<br/>BATTLEGROUND
          </h2>
        </div>

        {/* ══════════ CAROUSEL ══════════ */}
        <div
          style={{
            position: "relative", zIndex: 6,
            width: "100%",
            height: "clamp(280px,46vh,440px)",
            perspective: "900px",
            perspectiveOrigin: "50% 50%",
            userSelect: "none",
            touchAction: "pan-y",
          }}
          onMouseDown={e  => onPointerDown(e.clientX)}
          onMouseUp={e    => onPointerUp(e.clientX)}
          onMouseLeave={e => onPointerUp(e.clientX)}
          onTouchStart={e => onPointerDown(e.touches[0].clientX)}
          onTouchEnd={e   => onPointerUp(e.changedTouches[0].clientX)}
        >
          {/* ring pivot */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: 0, height: 0,
            transformStyle: "preserve-3d",
          }}>
            {CARDS.map((card, idx) => {
              /* smooth fractional angle */
              const angleDeg = ((idx - springActive + N) % N) * (360 / N);
              const rad      = (angleDeg * Math.PI) / 180;
              const RX = 300, RZ = 70;
              const tx  = RX * Math.sin(rad);
              const tz  = RZ * Math.cos(rad) - RZ;
              const cos = (Math.cos(rad) + 1) / 2;
              const sc  = 0.52 + 0.48 * cos;
              const op  = 0.28 + 0.72 * cos;
              const zi  = Math.round(50 + 50 * Math.cos(rad));
              const isActive = idx === active;
              const CARD_W = 240;

              return (
                <Link
                  key={card.id}
                  href={card.href}
                  tabIndex={isActive ? 0 : -1}
                  className="ec-card"
                  style={{
                    position: "absolute",
                    left: -CARD_W / 2,
                    top: 0,
                    width: CARD_W,
                    zIndex: zi,
                    opacity: op,
                    transform: `translateX(${tx}px) translateZ(${tz}px) scale(${sc}) translateY(-50%)`,
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <div
                    className="ec-card-face"
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      background: P.black,
                      border: `3px solid ${isActive ? card.accent : P.black}`,
                      boxShadow: isActive
                        ? `6px 6px 0 ${P.black}, 10px 10px 0 ${card.shadow}`
                        : `4px 4px 0 ${P.black}`,
                      position: "relative",
                      overflow: "hidden",
                      transform: isActive ? "translate(-4px,-4px)" : "translate(0,0)",
                    }}
                  >
                    {/* image */}
                    <Image
                      src={card.image}
                      alt={card.label}
                      fill
                      sizes="200px"
                      style={{
                        objectFit: "cover",
                        opacity: isActive ? 0.88 : 0.45,
                        transition: "opacity 0.5s ease",
                        filter: isActive ? "saturate(1.15)" : "saturate(0.6)",
                      }}
                    />

                    {/* bottom gradient */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: `linear-gradient(to top, ${P.black}EE 0%, ${P.black}88 45%, transparent 100%)`,
                    }}/>

                    {/* top accent stripe */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 5,
                      background: `repeating-linear-gradient(90deg,
                        ${card.accent} 0, ${card.accent} 10px,
                        ${P.black}     10px, ${P.black}     14px
                      )`,
                      transformOrigin: "left",
                      animation: isActive ? "ecBarGrow 0.4s cubic-bezier(.25,.8,.25,1) both" : "none",
                    }}/>

                    {/* label area - background matches accent now */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "16px 14px 14px",
                      background: isActive ? card.accent : "rgba(0,0,0,0.85)",
                      borderTop: `2px solid ${isActive ? P.black : "rgba(255,255,255,0.1)"}`,
                      transition: "background 0.3s ease, border-color 0.3s ease",
                    }}>
                      <div style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: "clamp(1.2rem,2.5vw,1.6rem)",
                        letterSpacing: "0.1em",
                        color: isActive ? P.black : "rgba(255,255,255,0.7)",
                        textShadow: isActive ? `0 0 0 transparent` : "none",
                        transition: "color 0.3s ease",
                        lineHeight: 1,
                        display: "block",
                      }}>{card.label}</div>
                      <div style={{
                        fontFamily: "'Share Tech Mono',monospace",
                        fontSize: "clamp(0.42rem,0.9vw,0.55rem)",
                        letterSpacing: "0.18em",
                        color: isActive ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.35)",
                        marginTop: 4,
                        textTransform: "uppercase",
                      }}>{card.sub}</div>
                    </div>

                    {/* number badge */}
                    <div style={{
                      position: "absolute", top: 12, left: 12,
                      width: 28, height: 28,
                      background: isActive ? card.accent : P.black,
                      border: `2px solid ${isActive ? P.black : "rgba(255,255,255,0.2)"}`,
                      boxShadow: isActive ? `2px 2px 0 ${P.black}` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: "0.85rem",
                      letterSpacing: "0.05em",
                      color: isActive ? P.black : "rgba(255,255,255,0.4)",
                      transition: "background 0.3s, color 0.3s, border-color 0.3s",
                    }}>0{card.id}</div>

                    {/* shimmer on hover */}
                    <div className="ec-shimmer"/>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ══════════ LABEL + CONTROLS ══════════ */}
        <div style={{
          position: "relative", zIndex: 6,
          display: "flex", flexDirection: "column",
          alignItems: "center",
          gap: "clamp(12px,2.2vh,20px)",
          marginTop: "clamp(1.8rem,4vh,3rem)",
        }}>

          {/* active label */}
          <div
            key={`lbl-${active}`}
            style={{
              display: "inline-block",
              animation: "ecLabelIn 0.38s cubic-bezier(.25,.8,.25,1) both",
            }}
          >
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(2rem,6vw,4.5rem)",
              letterSpacing: "0.12em",
              color: P.black,
              textShadow: `3px 3px 0 ${activeCard.accent}, 6px 6px 0 ${activeCard.shadow}`,
              transform: "skewX(-6deg)",
              display: "inline-block",
              lineHeight: 1,
            }}>{activeCard.label}</div>
            {/* underline bar */}
            <div style={{
              height: 4,
              background: activeCard.accent,
              border: `1.5px solid ${P.black}`,
              boxShadow: `3px 3px 0 ${P.black}`,
              marginTop: 4,
              animation: "ecBarGrow 0.38s cubic-bezier(.25,.8,.25,1) both",
              transformOrigin: "left",
            }}/>
          </div>

          {/* dot nav + arrows */}
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>

            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              style={{
                width: 40, height: 40,
                background: P.black,
                border: `3px solid ${P.black}`,
                boxShadow: `3px 3px 0 ${activeCard.accent}`,
                color: P.white,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "1.1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.12s, box-shadow 0.12s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = `5px 5px 0 ${activeCard.accent}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = `3px 3px 0 ${activeCard.accent}`;
              }}
            >←</button>

            {/* dots */}
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {CARDS.map((card, i) => (
                <button
                  key={card.id}
                  onClick={() => { setActive(i); resetAuto(); }}
                  aria-label={card.label}
                  style={{
                    padding: 0,
                    width: i === active ? 32 : 10,
                    height: 10,
                    background: i === active ? P.black : "rgba(0,0,0,0.3)",
                    border: `2px solid ${P.black}`,
                    boxShadow: i === active ? `2px 2px 0 ${card.accent}` : "none",
                    cursor: "pointer",
                    transition: "width 0.35s cubic-bezier(.25,.8,.25,1), background 0.2s, box-shadow 0.2s",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              aria-label="Next"
              style={{
                width: 40, height: 40,
                background: P.black,
                border: `3px solid ${P.black}`,
                boxShadow: `3px 3px 0 ${activeCard.accent}`,
                color: P.white,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "1.1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.12s, box-shadow 0.12s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = `5px 5px 0 ${activeCard.accent}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = `3px 3px 0 ${activeCard.accent}`;
              }}
            >→</button>
          </div>

          {/* CTA */}
          <Link
            key={`cta-${active}`}
            href={activeCard.href}
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: P.black,
              color: activeCard.accent,
              border: `3px solid ${P.black}`,
              boxShadow: `5px 5px 0 ${P.black}, 9px 9px 0 ${activeCard.accent}`,
              padding: "11px clamp(24px,4vw,44px)",
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(0.9rem,2vw,1.2rem)",
              letterSpacing: "0.22em",
              textDecoration: "none",
              animation: "ecReveal 0.38s cubic-bezier(.25,.8,.25,1) both",
              transition: "transform 0.14s, box-shadow 0.14s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translate(-3px,-3px)";
              (e.currentTarget as HTMLElement).style.boxShadow = `8px 8px 0 ${P.black}, 14px 14px 0 ${activeCard.accent}`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = `5px 5px 0 ${P.black}, 9px 9px 0 ${activeCard.accent}`;
            }}
          >
            VIEW {activeCard.label} EVENTS
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: activeCard.accent,
              color: P.black,
              width: "1.5em", height: "1.5em",
              fontSize: "0.85em",
            }}>→</span>
          </Link>

        </div>
      </section>
    </>
  );
}