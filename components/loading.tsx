"use client";

import { useEffect, useRef, useState, useMemo, memo } from "react";
import Image from "next/image";
import { 
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

/* ─── types ───────────────────────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
}

/* ─── helpers ─────────────────────────────────────────────────── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const LINES = [
  "INITIALIZING SYSTEM…",
  "LOADING PARTICLE FIELD…",
  "CALIBRATING ORBS…",
  "SYNCHRONIZING DATA…",
  "ACTIVATING INTERFACE…",
];

/* ─── Static Components ────────────────────────────────────────── */
const DecorativeRings = memo(() => (
  <svg style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(90vw,700px)",height:"min(90vw,700px)",zIndex:2,pointerEvents:"none",opacity:0.12,animation:"rotateSlow 30s linear infinite"}}>
    <circle cx="50%" cy="50%" r="47%" fill="none" stroke={ANIME_COLORS.primary} strokeWidth="1" strokeDasharray="4 12"/>
    <circle cx="50%" cy="50%" r="42%" fill="none" stroke={ANIME_COLORS.secondary} strokeWidth="1" strokeDasharray="8 6"/>
    <circle cx="50%" cy="50%" r="37%" fill="none" stroke={ANIME_COLORS.accent} strokeWidth="1" strokeDasharray="2 18"/>
  </svg>
));
DecorativeRings.displayName = "DecorativeRings";

const RegistrationMarks = memo(() => (
  <>
    {([
      {top:20,left:20},  {top:20,right:20},
      {bottom:20,left:20},{bottom:20,right:20}
    ] as React.CSSProperties[]).map((pos,i)=>(
      <svg key={i} style={{position:"absolute",width:24,height:24,zIndex:9,...pos,opacity:0.5}}>
        <circle cx="12" cy="12" r="5" fill="none" stroke={ANIME_COLORS.text} strokeWidth="1"/>
        <line x1="12" y1="0" x2="12" y2="8" stroke={ANIME_COLORS.text} strokeWidth="1"/>
        <line x1="12" y1="16" x2="12" y2="24" stroke={ANIME_COLORS.text} strokeWidth="1"/>
        <line x1="0" y1="12" x2="8" y2="12" stroke={ANIME_COLORS.text} strokeWidth="1"/>
        <line x1="16" y1="12" x2="24" y2="12" stroke={ANIME_COLORS.text} strokeWidth="1"/>
      </svg>
    ))}
  </>
));
RegistrationMarks.displayName = "RegistrationMarks";

/* ═══════════════════════════════════════════════════════════════ */
export default function AakarLoader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress]   = useState(0);
  const [lineIdx, setLineIdx]     = useState(0);
  const [phase, setPhase]         = useState<"loading" | "done" | "exit">("loading");
  const [glitch, setGlitch]       = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickerRaf = useRef<number>(0);
  const particlesRaf = useRef<number>(0);

  /* Progress calculation memoized */
  const pct = useMemo(() => Math.floor(progress), [progress]);

  /* progress ticker */
  useEffect(() => {
    let val = 0;
    const tick = () => {
      val = Math.min(val + rand(0.4, 1.8), 100);
      setProgress(val);
      if (val < 100) tickerRaf.current = requestAnimationFrame(tick);
      else {
        setPhase("done");
        const t1 = setTimeout(() => { 
          setPhase("exit"); 
          const t2 = setTimeout(() => onComplete?.(), 700);
          return () => clearTimeout(t2);
        }, 1100);
        return () => clearTimeout(t1);
      }
    };
    tickerRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(tickerRaf.current);
  }, [onComplete]);

  /* Canvas Particle system */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    let particles: Particle[] = [];
    const colors = [ANIME_COLORS.primary, ANIME_COLORS.secondary, ANIME_COLORS.accent, ANIME_COLORS.purple, ANIME_COLORS.mint];

    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: rand(4, 20),
      color: pick(colors),
      life: 0,
      maxLife: rand(60, 100),
      vx: rand(-0.5, 0.5),
      vy: rand(-0.5, 0.5),
    });

    // Initial particles
    particles = Array.from({ length: 40 }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Spawn new particles occasionally
      if (particles.length < 80 && Math.random() < 0.1) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.3;
        
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }
      
      particlesRaf.current = requestAnimationFrame(animate);
    };

    particlesRaf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(particlesRaf.current);
    };
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

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        /* ── keyframes ── */
        @keyframes chromaTitle {
          0%,100% { text-shadow:
            0 0 20px ${ANIME_COLORS.primary}45,
           -3px  0   0 ${ANIME_COLORS.secondary},
            3px  0   0 ${ANIME_COLORS.accent};
          }
          25% { text-shadow:
           -4px  2px 0 ${ANIME_COLORS.purple},
            4px -2px 0 ${ANIME_COLORS.primary},
            0    4px 0 ${ANIME_COLORS.secondary};
          }
          50% { text-shadow:
            5px  0   0 ${ANIME_COLORS.accent},
           -5px  0   0 ${ANIME_COLORS.mint},
            0   -3px 0 ${ANIME_COLORS.primary};
          }
          75% { text-shadow:
           -3px -3px 0 ${ANIME_COLORS.secondary},
            3px  3px 0 ${ANIME_COLORS.purple},
            2px -2px 0 ${ANIME_COLORS.accent};
          }
        }
        @keyframes logoChroma {
          0%,100% { filter: drop-shadow(0 0 0 ${ANIME_COLORS.primary}) drop-shadow(3px 3px 0 ${ANIME_COLORS.secondary}); }
          33%     { filter: drop-shadow(0 0 0 ${ANIME_COLORS.secondary}) drop-shadow(-3px 3px 0 ${ANIME_COLORS.accent}); }
          66%     { filter: drop-shadow(0 0 0 ${ANIME_COLORS.accent}) drop-shadow(3px -3px 0 ${ANIME_COLORS.purple}); }
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
        @keyframes barGlow {
          0%,100% { box-shadow: 0 0 20px ${ANIME_COLORS.primary}40; }
          33%     { box-shadow: 0 0 30px ${ANIME_COLORS.secondary}60; }
          66%     { box-shadow: 0 0 25px ${ANIME_COLORS.accent}50; }
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
          background: ANIME_COLORS.background,
          overflow: "hidden",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >

        {/* ── particle canvas field ── */}
        <canvas
          ref={canvasRef}
          style={{ 
            position:"absolute", inset:0, pointerEvents:"none", 
            zIndex:1, mixBlendMode: "screen"
          }} 
        />

        {/* ── scan line ── */}
        <div style={{
          position: "absolute", left:0, right:0, height:"2px", zIndex:8,
          background: `linear-gradient(90deg,transparent,${ANIME_COLORS.primary},${ANIME_COLORS.secondary},transparent)`,
          opacity: 0.6,
          animation: "scanH 2.2s linear infinite",
        }} />

        {/* ── grid overlay ── */}
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.04,zIndex:2,pointerEvents:"none"}}>
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0L0 0 0 32" fill="none" stroke={ANIME_COLORS.text} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        <DecorativeRings />
        <RegistrationMarks />

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
            {!logoLoaded && (
              <div style={{
                position:"absolute",inset:0,borderRadius:"50%",
                border:`3px dashed ${ANIME_COLORS.primary}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"clamp(0.5rem,1.5vw,0.7rem)",
                color:ANIME_COLORS.primary,letterSpacing:"0.2em",
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

          <div style={{ position:"relative", lineHeight:1, userSelect:"none" }}>
            <div style={{
              position:"absolute",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(4.5rem,16vw,11rem)",
              lineHeight:1, letterSpacing:"0.04em",
              color:"transparent",
              WebkitTextStroke:`0.02em ${ANIME_COLORS.secondary}`,
              top:"4px", left:"-5px",
              opacity:0.7,
              mixBlendMode:"screen",
              pointerEvents:"none",
            }}>AAKAR</div>
            <div style={{
              position:"absolute",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(4.5rem,16vw,11rem)",
              lineHeight:1, letterSpacing:"0.04em",
              color:"transparent",
              WebkitTextStroke:`0.02em ${ANIME_COLORS.accent}`,
              top:"-3px", left:"5px",
              opacity:0.7,
              mixBlendMode:"screen",
              pointerEvents:"none",
            }}>AAKAR</div>
            <h1 className="title-chroma" style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(4.5rem,16vw,11rem)",
              lineHeight:1, letterSpacing:"0.04em",
              color: ANIME_COLORS.text,
              margin:0, padding:0,
              position:"relative", zIndex:2,
            }}>AAKAR</h1>

            {glitch && (
              <h1 className="glitch-layer" style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"clamp(4.5rem,16vw,11rem)",
                lineHeight:1, letterSpacing:"0.04em",
                color: ANIME_COLORS.purple,
                margin:0,padding:0,
                position:"absolute",top:0,left:0,zIndex:3,
                mixBlendMode:"screen",
              }}>AAKAR</h1>
            )}
          </div>

          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(2rem,7vw,5rem)",
            color: ANIME_COLORS.accent,
            letterSpacing:"0.18em",
            lineHeight:1,
            marginTop:"-0.4em",
            textShadow:`0 0 0.5em ${ANIME_COLORS.accent}, 0.08em 0 0 ${ANIME_COLORS.primary}`,
            animation:"subIn 0.6s 0.2s ease both",
            opacity:0,
            animationFillMode:"forwards",
          }}>2026</div>

          <div style={{
            fontSize:"clamp(0.5rem,1.6vw,0.72rem)",
            letterSpacing:"0.3em",
            color:"rgba(255,255,255,0.5)",
            textTransform:"uppercase",
            borderTop:`1px solid ${ANIME_COLORS.primary}30`,
            borderBottom:`1px solid ${ANIME_COLORS.secondary}30`,
            padding:"6px 20px",
            animation:"subIn 0.6s 0.5s ease both",
            opacity:0,
            animationFillMode:"forwards",
          }}>BRAINS · GUTS · GLORY</div>

          <div style={{
            width:"min(380px,82vw)", marginTop:"0.5rem",
            display:"flex", flexDirection:"column", gap:"6px",
          }}>
            <div style={{
              width:"100%", height:"10px",
              background:"rgba(255,255,255,0.06)",
              border:`1px solid ${ANIME_COLORS.primary}30`,
              overflow:"hidden", position:"relative",
            }}>
              <div style={{
                position:"absolute",top:0,left:0,bottom:0,
                width:`${pct}%`,
                background: `repeating-linear-gradient(
                  90deg,
                  ${ANIME_COLORS.primary}  0px,   ${ANIME_COLORS.primary}  14px,
                  ${ANIME_COLORS.secondary} 14px,  ${ANIME_COLORS.secondary} 28px,
                  ${ANIME_COLORS.accent}   28px,  ${ANIME_COLORS.accent}   42px,
                  ${ANIME_COLORS.purple}   42px,  ${ANIME_COLORS.purple}   56px
                )`,
                transition:"width 0.1s linear",
                animation:"barGlow 2s ease-in-out infinite",
              }}/>
            </div>

            <div style={{
              display:"flex", justifyContent:"space-between",
              fontSize:"clamp(0.42rem,1.2vw,0.6rem)",
              letterSpacing:"0.12em", color:"rgba(255,255,255,0.35)",
            }}>
              <span>▮▮▮▮ SYSTEM INITIALIZATION</span>
              <span style={{color: pct>70?ANIME_COLORS.accent:ANIME_COLORS.secondary}}>
                {pct.toString().padStart(3,"0")}%
              </span>
            </div>
          </div>

          <div style={{
            fontSize:"clamp(0.48rem,1.4vw,0.65rem)",
            letterSpacing:"0.28em",
            textTransform:"uppercase",
            color: ANIME_COLORS.primary,
            height:"1em", overflow:"hidden",
            perspective:"300px",
          }}>
            <div key={lineIdx} className="line-flip">
              {phase==="done" ? "▶ SYSTEM READY" : LINES[lineIdx]}
            </div>
          </div>

        </div>

        <div style={{
          position:"absolute", bottom:0, left:0, right:0, zIndex:12,
          height:"clamp(22px,3.5vh,34px)",
          background: ANIME_COLORS.accent,
          borderTop:`3px solid ${ANIME_COLORS.background}`,
          overflow:"hidden", display:"flex", alignItems:"center",
        }}>
          <div style={{
            display:"flex", whiteSpace:"nowrap",
            animation:"tickerScroll 12s linear infinite",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(0.7rem,2vw,1rem)",
            letterSpacing:"0.15em",
            color: ANIME_COLORS.background,
          }}>
            {Array(6).fill(null).map((_,i) => (
              <span key={i} style={{paddingRight:"4rem"}}>
                AAKAR 2026 &nbsp;★&nbsp; BRAINS · GUTS · GLORY &nbsp;★&nbsp;
                APRIL 2026 &nbsp;★&nbsp; REGISTER NOW &nbsp;★&nbsp;
              </span>
            ))}
          </div>
        </div>

        {phase === "done" && (
          <div style={{
            position:"absolute",inset:0,zIndex:20,
            background: ANIME_COLORS.primary,
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