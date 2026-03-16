"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── palette ─────────────────────────────────────────────────── */
const C = {
  magenta: "#ff00ff",
  cyan:    "#00ffff",
  yellow:  "#ffff00",
  hot:     "#ff0066",
  black:   "#0a0005",
  white:   "#fff8f0",
} as const;

/* ─── types ───────────────────────────────────────────────────── */
interface Dot { id: number; x: number; y: number; size: number; color: string; delay: number; }

/* ─── helpers ─────────────────────────────────────────────────── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const LINES = [
  "INKING THE PLATES…",
  "BURNING THE SCREENS…",
  "FLOODING THE ROLLERS…",
  "PULLING THE SQUEEGEE…",
  "PEELING THE PROOF…",
];

/* ═══════════════════════════════════════════════════════════════ */
export default function AakarLoader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress]   = useState(0);
  const [dots, setDots]           = useState<Dot[]>([]);
  const [lineIdx, setLineIdx]     = useState(0);
  const [phase, setPhase]         = useState<"printing" | "done" | "exit">("printing");
  const [glitch, setGlitch]       = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const raf = useRef<number>(0);

  /* progress ticker */
  useEffect(() => {
    let val = 0;
    const tick = () => {
      val = Math.min(val + rand(0.4, 1.8), 100);
      setProgress(val);
      if (val < 100) raf.current = requestAnimationFrame(tick);
      else {
        setPhase("done");
        setTimeout(() => { setPhase("exit"); setTimeout(() => onComplete?.(), 700); }, 1100);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [onComplete]);

  /* halftone dot spawner */
  useEffect(() => {
    const id = setInterval(() => {
      setDots(prev => {
        if (prev.length > 120) return prev.slice(-110);
        const n: Dot = {
          id: Date.now() + Math.random(),
          x: rand(0, 100),
          y: rand(0, 100),
          size: rand(4, 22),
          color: pick([C.magenta, C.cyan, C.yellow, C.hot, "#ffffff"]),
          delay: rand(0, 0.3),
        };
        return [...prev, n];
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  /* line cycling */
  useEffect(() => {
    const id = setInterval(() => setLineIdx(p => (p + 1) % LINES.length), 1200);
    return () => clearInterval(id);
  }, []);

  /* random glitch burst */
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 80);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const pct = Math.floor(progress);

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');

        :root {
          --mg: #ff00ff;
          --cy: #00ffff;
          --ye: #ffff00;
          --ho: #ff0066;
          --bk: #0a0005;
          --wh: #fff8f0;
        }

        /* ── keyframes ── */
        @keyframes dotPrint {
          0%   { opacity:0; transform:scale(0); }
          60%  { opacity:0.9; transform:scale(1.3); }
          100% { opacity:0.18; transform:scale(1); }
        }
        @keyframes chromaTitle {
          0%,100% { text-shadow:
            3px  0   0 var(--cy),
           -3px  0   0 var(--mg),
            0    3px 0 var(--ye);
          }
          25% { text-shadow:
           -4px  2px 0 var(--ho),
            4px -2px 0 var(--cy),
            0    4px 0 var(--mg);
          }
          50% { text-shadow:
            5px  0   0 var(--mg),
           -5px  0   0 var(--ye),
            0   -3px 0 var(--cy);
          }
          75% { text-shadow:
           -3px -3px 0 var(--cy),
            3px  3px 0 var(--ho),
            2px -2px 0 var(--ye);
          }
        }
        @keyframes logoChroma {
          0%,100% { filter: drop-shadow(0 0 0 var(--mg)) drop-shadow(3px 3px 0 var(--cy)); }
          33%     { filter: drop-shadow(0 0 0 var(--cy)) drop-shadow(-3px 3px 0 var(--ye)); }
          66%     { filter: drop-shadow(0 0 0 var(--ye)) drop-shadow(3px -3px 0 var(--ho)); }
        }
        @keyframes logoPulse {
          0%,100% { transform: scale(1) rotate(-1deg); }
          50%     { transform: scale(1.06) rotate(1.5deg); }
        }
        @keyframes glitchShift {
          0%  { clip-path: inset(0 0 100% 0); transform: translate(0,0); }
          20% { clip-path: inset(20% 0 50% 0); transform: translate(-6px, 2px); }
          40% { clip-path: inset(60% 0 10% 0); transform: translate(6px,-3px); }
          60% { clip-path: inset(5% 0 80% 0);  transform: translate(-4px, 4px); }
          80% { clip-path: inset(40% 0 30% 0); transform: translate(5px,-1px); }
          100%{ clip-path: inset(0 0 0 0);     transform: translate(0,0); }
        }
        @keyframes lineFlip {
          0%   { opacity:0; transform:translateY(12px) skewX(-4deg); }
          20%,80% { opacity:1; transform:translateY(0)  skewX(-4deg); }
          100% { opacity:0; transform:translateY(-12px) skewX(-4deg); }
        }
        @keyframes fillBar {
          from { transform: scaleX(0); }
        }
        @keyframes barGlow {
          0%,100% { box-shadow: 0 0 8px 2px var(--mg); }
          33%     { box-shadow: 0 0 8px 2px var(--cy); }
          66%     { box-shadow: 0 0 8px 2px var(--ye); }
        }
        @keyframes tickerScroll {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes exitSlam {
          0%  { transform:scaleY(1); opacity:1; }
          40% { transform:scaleY(0.02); opacity:1; }
          100%{ transform:scaleY(0); opacity:0; }
        }
        @keyframes doneFlash {
          0%,100%{ opacity:1; }
          50%{ opacity:0.4; }
        }
        @keyframes rotateSlow {
          to { transform: rotate(360deg); }
        }
        @keyframes scanH {
          0%  { top: -4px; }
          100%{ top: 100%; }
        }
        @keyframes subIn {
          0% { opacity:0; letter-spacing:0.6em; }
          100%{ opacity:1; letter-spacing:0.3em; }
        }

        .title-chroma { animation: chromaTitle 3s ease-in-out infinite; }
        .logo-anim    { animation: logoPulse 2.5s ease-in-out infinite, logoChroma 3s ease-in-out infinite; }
        .glitch-layer { animation: glitchShift 0.08s steps(1) 3; }
        .line-flip    { animation: lineFlip 1.2s ease-in-out; }
        .exit-anim    { animation: exitSlam 0.7s cubic-bezier(.86,0,.07,1) forwards; transform-origin: top; }
      `}</style>

      <div
        className={phase === "exit" ? "exit-anim" : ""}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: C.black,
          overflow: "hidden",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >

        {/* ── halftone dot field ── */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1 }}>
          {dots.map(d => (
            <div key={d.id} style={{
              position: "absolute",
              left: `${d.x}%`, top: `${d.y}%`,
              width: d.size, height: d.size,
              borderRadius: "50%",
              background: d.color,
              opacity: 0,
              mixBlendMode: "screen",
              animation: `dotPrint 1.4s ${d.delay}s ease-out forwards`,
            }} />
          ))}
        </div>

        {/* ── scan line ── */}
        <div style={{
          position: "absolute", left:0, right:0, height:"2px", zIndex:8,
          background: `linear-gradient(90deg,transparent,${C.cyan},${C.magenta},transparent)`,
          opacity: 0.6,
          animation: "scanH 2.2s linear infinite",
        }} />

        {/* ── CMYK grid overlay ── */}
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.04,zIndex:2,pointerEvents:"none"}}>
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0L0 0 0 32" fill="none" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        {/* ── rotating ring decoration ── */}
        <svg style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(90vw,700px)",height:"min(90vw,700px)",zIndex:2,pointerEvents:"none",opacity:0.12,animation:"rotateSlow 30s linear infinite"}}>
          <circle cx="50%" cy="50%" r="47%" fill="none" stroke={C.magenta} strokeWidth="1" strokeDasharray="4 12"/>
          <circle cx="50%" cy="50%" r="42%" fill="none" stroke={C.cyan}    strokeWidth="1" strokeDasharray="8 6"/>
          <circle cx="50%" cy="50%" r="37%" fill="none" stroke={C.yellow}  strokeWidth="1" strokeDasharray="2 18"/>
        </svg>

        {/* ── corner registration marks ── */}
        {([
          {top:20,left:20},  {top:20,right:20},
          {bottom:20,left:20},{bottom:20,right:20}
        ] as React.CSSProperties[]).map((pos,i)=>(
          <svg key={i} style={{position:"absolute",width:24,height:24,zIndex:9,...pos,opacity:0.5}}>
            <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="1"/>
            <line x1="12" y1="0" x2="12" y2="8" stroke="#fff" strokeWidth="1"/>
            <line x1="12" y1="16" x2="12" y2="24" stroke="#fff" strokeWidth="1"/>
            <line x1="0" y1="12" x2="8" y2="12" stroke="#fff" strokeWidth="1"/>
            <line x1="16" y1="12" x2="24" y2="12" stroke="#fff" strokeWidth="1"/>
          </svg>
        ))}

        {/* ── main stage ── */}
        <div style={{
          position: "absolute", inset:0, zIndex:10,
          display: "flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          gap: "clamp(10px,2.5vh,24px)",
          padding: "2rem",
        }}>

          {/* logo */}
          <div className="logo-anim" style={{
            position: "relative",
            width: "clamp(90px,18vw,180px)",
            height: "clamp(90px,18vw,180px)",
          }}>
            {/* placeholder ring shown until logo loads */}
            {!logoLoaded && (
              <div style={{
                position:"absolute",inset:0,borderRadius:"50%",
                border:`3px dashed ${C.magenta}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"clamp(0.5rem,1.5vw,0.7rem)",
                color:C.magenta,letterSpacing:"0.2em",
                animation:"rotateSlow 4s linear infinite",
              }}>LOGO</div>
            )}
            <Image
              src="/ak26-logo.png"
              alt="AAKAR logo"
              fill
              style={{ objectFit:"contain" }}
              onLoad={() => setLogoLoaded(true)}
            />
          </div>

          {/* AAKAR title — color-separated layers */}
          <div style={{ position:"relative", lineHeight:1, userSelect:"none" }}>
            {/* layer 1 — cyan offset */}
            <div style={{
              position:"absolute",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(4.5rem,16vw,11rem)",
              lineHeight:1, letterSpacing:"0.04em",
              color:"transparent",
              WebkitTextStroke:`0.02em ${C.cyan}`,
              top:"4px", left:"-5px",
              opacity:0.7,
              mixBlendMode:"screen",
              pointerEvents:"none",
            }}>AAKAR</div>
            {/* layer 2 — magenta offset */}
            <div style={{
              position:"absolute",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(4.5rem,16vw,11rem)",
              lineHeight:1, letterSpacing:"0.04em",
              color:"transparent",
              WebkitTextStroke:`0.02em ${C.magenta}`,
              top:"-3px", left:"5px",
              opacity:0.7,
              mixBlendMode:"screen",
              pointerEvents:"none",
            }}>AAKAR</div>
            {/* primary */}
            <h1 className="title-chroma" style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(4.5rem,16vw,11rem)",
              lineHeight:1, letterSpacing:"0.04em",
              color: C.white,
              margin:0, padding:0,
              position:"relative", zIndex:2,
            }}>AAKAR</h1>

            {/* glitch duplicate */}
            {glitch && (
              <h1 className="glitch-layer" style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"clamp(4.5rem,16vw,11rem)",
                lineHeight:1, letterSpacing:"0.04em",
                color: C.hot,
                margin:0,padding:0,
                position:"absolute",top:0,left:0,zIndex:3,
                mixBlendMode:"screen",
              }}>AAKAR</h1>
            )}
          </div>

          {/* 2026 — hot pink stamp */}
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(2rem,7vw,5rem)",
            color: C.hot,
            letterSpacing:"0.18em",
            lineHeight:1,
            marginTop:"-0.4em",
            textShadow:`0 0 0.5em ${C.hot}, 0.08em 0 0 ${C.yellow}`,
            animation:"subIn 0.6s 0.2s ease both",
            opacity:0,
            animationFillMode:"forwards",
          }}>2026</div>

          {/* subtitle strip */}
          <div style={{
            fontSize:"clamp(0.5rem,1.6vw,0.72rem)",
            letterSpacing:"0.3em",
            color:"rgba(255,248,240,0.5)",
            textTransform:"uppercase",
            borderTop:`1px solid rgba(255,0,255,0.3)`,
            borderBottom:`1px solid rgba(0,255,255,0.3)`,
            padding:"6px 20px",
            animation:"subIn 0.6s 0.5s ease both",
            opacity:0,
            animationFillMode:"forwards",
          }}>BRAINS · GUTS · GLORY</div>

          {/* progress bar */}
          <div style={{
            width:"min(380px,82vw)", marginTop:"0.5rem",
            display:"flex", flexDirection:"column", gap:"6px",
          }}>
            {/* track */}
            <div style={{
              width:"100%", height:"10px",
              background:"rgba(255,255,255,0.06)",
              border:`1px solid rgba(255,0,255,0.3)`,
              overflow:"hidden", position:"relative",
            }}>
              {/* fill — segmented like a film strip */}
              <div style={{
                position:"absolute",top:0,left:0,bottom:0,
                width:`${pct}%`,
                background: `repeating-linear-gradient(
                  90deg,
                  ${C.magenta}  0px,   ${C.magenta}  14px,
                  ${C.cyan}     14px,  ${C.cyan}     28px,
                  ${C.yellow}   28px,  ${C.yellow}   42px,
                  ${C.hot}      42px,  ${C.hot}       56px
                )`,
                transition:"width 0.1s linear",
                animation:"barGlow 2s ease-in-out infinite",
              }}/>
            </div>

            {/* labels */}
            <div style={{
              display:"flex", justifyContent:"space-between",
              fontSize:"clamp(0.42rem,1.2vw,0.6rem)",
              letterSpacing:"0.12em", color:"rgba(255,248,240,0.35)",
            }}>
              <span>▮▮▮▮ PRINT RUN</span>
              <span style={{color: pct>70?C.yellow:C.cyan}}>
                {pct.toString().padStart(3,"0")}%
              </span>
            </div>
          </div>

          {/* status line */}
          <div style={{
            fontSize:"clamp(0.48rem,1.4vw,0.65rem)",
            letterSpacing:"0.28em",
            textTransform:"uppercase",
            color: C.magenta,
            height:"1em", overflow:"hidden",
            perspective:"300px",
          }}>
            <div key={lineIdx} className="line-flip">
              {phase==="done" ? "▶ PRESS READY" : LINES[lineIdx]}
            </div>
          </div>

        </div>

        {/* ── bottom ticker tape ── */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, zIndex:12,
          height:"clamp(22px,3.5vh,34px)",
          background: C.yellow,
          borderTop:`3px solid ${C.black}`,
          overflow:"hidden", display:"flex", alignItems:"center",
        }}>
          <div style={{
            display:"flex", whiteSpace:"nowrap",
            animation:"tickerScroll 12s linear infinite",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(0.7rem,2vw,1rem)",
            letterSpacing:"0.15em",
            color: C.black,
          }}>
            {Array(6).fill(null).map((_,i) => (
              <span key={i} style={{paddingRight:"4rem"}}>
                AAKAR 2026 &nbsp;★&nbsp; BRAINS · GUTS · GLORY &nbsp;★&nbsp;
                APRIL 2026 &nbsp;★&nbsp; REGISTER NOW &nbsp;★&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── done flash overlay ── */}
        {phase === "done" && (
          <div style={{
            position:"absolute",inset:0,zIndex:20,
            background: C.magenta,
            animation:"doneFlash 0.15s steps(1) 4",
            pointerEvents:"none",
            mixBlendMode:"screen",
            opacity:0,
            animationFillMode:"forwards",
          }}/>
        )}

      </div>
    </>
  );
}