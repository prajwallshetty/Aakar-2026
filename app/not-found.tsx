"use client";

import Link from "next/link";
import {
  AnimeParticleField,
  AnimeOrbField,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import { cinzelFont } from "@/lib/font";
import { BackgroundBeams } from "@/components/ui/background-beams";

/* ─── pre-computed starburst path (no hydration mismatch) ──── */
function buildStarburstPath(cx: number, cy: number, outerR: number, innerR: number, spikes = 24) {
  let d = "";
  for (let i = 0; i < spikes * 2; i++) {
    const r   = i % 2 === 0 ? outerR : innerR;
    const ang = (Math.PI / spikes) * i - Math.PI / 2;
    const x   = Math.round((cx + r * Math.cos(ang)) * 1e4) / 1e4;
    const y   = Math.round((cy + r * Math.sin(ang)) * 1e4) / 1e4;
    d += (i === 0 ? "M" : "L") + `${x},${y}`;
  }
  return d + "Z";
}

const BURST = buildStarburstPath(0, 0, 280, 170, 24);

/* ═══════════════════════════════════════════════════════════ */
export default function NotFound() {
  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        /* ── fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');

        /* ── keyframes ── */
        @keyframes burstSpin {
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes glitch404 {
          0%,88%,100% { clip-path:none; transform:translate(0,0); }
          89% { clip-path:inset(18% 0 54% 0); transform:translate(-8px, 3px); color:${ANIME_COLORS.secondary}; }
          91% { clip-path:inset(56% 0  8% 0); transform:translate( 8px,-4px); color:${ANIME_COLORS.accent}; }
          93% { clip-path:inset( 4% 0 78% 0); transform:translate(-5px, 5px); color:${ANIME_COLORS.primary}; }
          95% { clip-path:inset(42% 0 28% 0); transform:translate( 5px,-2px); color:${ANIME_COLORS.secondary}; }
          97% { clip-path:none; transform:translate(0,0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scanLine404 {
          0%   { top: -3px; opacity:0.7; }
          90%  { opacity:0.7; }
          100% { top:100%; opacity:0; }
        }
        @keyframes neonBreath404 {
          0%,100% { box-shadow: 0 0 28px ${ANIME_COLORS.primary}50, inset 0 0 16px ${ANIME_COLORS.primary}18; }
          50%     { box-shadow: 0 0 44px ${ANIME_COLORS.secondary}65, inset 0 0 22px ${ANIME_COLORS.secondary}28; }
        }
        @keyframes rubyPulse404 {
          0%,100% { opacity:0.65; transform:scaleX(1); }
          50%     { opacity:1;    transform:scaleX(1.03); }
        }
        @keyframes shimmerBtn404 {
          0%   { left:-100%; }
          100% { left:140%; }
        }
        @keyframes tagFlicker404 {
          0%,100% { opacity:1; }
          91% { opacity:1; }
          93% { opacity:0.2; }
          95% { opacity:1; }
          97% { opacity:0.35; }
        }

        /* ── 404 number ── */
        .nf-num { animation: glitch404 5s ease-in-out infinite; }

        /* ── card shell ── */
        .nf-card {
          position: relative;
          background: linear-gradient(155deg,
            rgba(8,3,18,.97) 0%,
            rgba(12,5,24,.95) 55%,
            rgba(9,3,18,.98) 100%
          );
          border: 1.5px solid ${ANIME_COLORS.primary}80;
          border-radius: 1.5rem;
          overflow: hidden;
          animation: neonBreath404 5s ease-in-out infinite;
        }
        .nf-card::after {
          content:'';
          position:absolute; inset:0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            ${ANIME_COLORS.primary}07 3px,
            ${ANIME_COLORS.primary}07 4px
          );
          pointer-events:none; z-index:0;
        }
        .nf-scan {
          position:absolute; left:0; right:0;
          height:2px;
          background:linear-gradient(90deg,transparent,${ANIME_COLORS.primary}55,transparent);
          animation:scanLine404 4s linear infinite;
          pointer-events:none; z-index:5;
        }

        /* ── ruby badge ── */
        .nf-ruby {
          display:inline-flex; align-items:center; gap:0.6rem;
          font-family:'Share Tech Mono',monospace;
          font-size:0.58rem; letter-spacing:0.45em;
          color:${ANIME_COLORS.accent};
          text-transform:uppercase;
          padding:0.22rem 1.1rem;
          border:1px solid ${ANIME_COLORS.accent}80;
          background:${ANIME_COLORS.accent}16;
          clip-path:polygon(10px 0%,calc(100% - 10px) 0%,100% 50%,calc(100% - 10px) 100%,10px 100%,0% 50%);
          animation:rubyPulse404 3s ease-in-out infinite;
        }
        .nf-ruby::before,.nf-ruby::after { content:'◆'; font-size:0.35rem; opacity:0.7; }

        /* ── tags / labels ── */
        .nf-tag {
          font-family:'Share Tech Mono',monospace;
          font-size:0.57rem; letter-spacing:0.5em;
          color:${ANIME_COLORS.secondary};
          text-transform:uppercase;
          animation:tagFlicker404 9s ease-in-out infinite;
        }

        /* ── body copy ── */
        .nf-desc {
          font-family:'Share Tech Mono',monospace;
          font-size:0.82rem; line-height:1.9;
          color:${ANIME_COLORS.text}cc;
          padding-left:1rem;
          border-left:2px solid ${ANIME_COLORS.accent};
          letter-spacing:0.02em;
        }

        /* ── CTA button ── */
        .nf-btn {
          font-family:'Share Tech Mono',monospace;
          font-size:0.72rem; letter-spacing:0.28em;
          text-transform:uppercase;
          padding:0.85rem 2.2rem;
          border:1.5px solid ${ANIME_COLORS.primary};
          background:linear-gradient(135deg,${ANIME_COLORS.primary}55,${ANIME_COLORS.primary}30);
          color:#fff;
          border-radius:5px;
          box-shadow:0 0 22px ${ANIME_COLORS.primary}50,inset 0 1px 0 ${ANIME_COLORS.primary}70;
          cursor:pointer; display:inline-block;
          text-decoration:none;
          position:relative; overflow:hidden;
          transition:transform .16s ease,box-shadow .16s ease;
        }
        .nf-btn::after {
          content:'';
          position:absolute; top:0; left:-120%;
          width:80%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);
          animation:shimmerBtn404 3.2s ease-in-out infinite;
        }
        .nf-btn:hover {
          transform:translateY(-3px);
          box-shadow:0 0 36px ${ANIME_COLORS.primary}75,inset 0 1px 0 ${ANIME_COLORS.primary};
        }
        .nf-btn:active { transform:translateY(0); }

        /* ── secondary ghost btn ── */
        .nf-btn-ghost {
          font-family:'Share Tech Mono',monospace;
          font-size:0.72rem; letter-spacing:0.28em;
          text-transform:uppercase;
          padding:0.85rem 2.2rem;
          border:1.5px solid ${ANIME_COLORS.secondary}80;
          background:transparent;
          color:${ANIME_COLORS.text}bb;
          border-radius:5px;
          text-decoration:none; display:inline-block;
          transition:all .16s ease;
        }
        .nf-btn-ghost:hover {
          border-color:${ANIME_COLORS.secondary};
          color:${ANIME_COLORS.text};
          box-shadow:0 0 18px ${ANIME_COLORS.secondary}35;
          transform:translateY(-2px);
        }

        /* ── deco divider ── */
        .nf-deco {
          width:72px; height:2px; margin:0.9rem auto;
          background:linear-gradient(90deg,transparent,${ANIME_COLORS.primary}cc,transparent);
          animation:rubyPulse404 2.8s ease-in-out infinite;
        }

        /* ── fade-up utility ── */
        .fu-1 { animation:fadeUp .5s .10s ease both; }
        .fu-2 { animation:fadeUp .5s .22s ease both; }
        .fu-3 { animation:fadeUp .5s .36s ease both; }
        .fu-4 { animation:fadeUp .5s .50s ease both; }
      `}</style>

      {/* ── Background ── */}
      <div className="fixed inset-0 z-0">
        {/* Base dark indigo background */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0118 0%, #0d0526 30%, #10082e 60%, #08001a 100%)" }} />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,1,20,0.8) 0%, rgba(10,3,30,0.6) 50%, rgba(8,0,22,0.95) 100%)" }} />

        {/* Aceternity Background Beams */}
        <BackgroundBeams className="absolute inset-0 opacity-60" />

        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
      </div>

      <AnimeOrbField />
      <AnimeParticleField />

      <main style={{
        position:"relative", zIndex:10,
        minHeight:"100vh",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"2rem",
        gap:"clamp(0.8rem,2vh,1.6rem)",
        textAlign:"center",
      }}>

        {/* spinning starburst (layered between bg and content) */}
        <div style={{
          position:"fixed",
          top:"50%", left:"50%",
          width:"clamp(340px,65vw,680px)",
          height:"clamp(340px,65vw,680px)",
          zIndex:1, pointerEvents:"none",
          animation:"burstSpin 40s linear infinite",
          transform:"translate(-50%,-50%)",
        }}>
          <svg viewBox="-280 -280 560 560" width="100%" height="100%">
            <path d={BURST} fill={ANIME_COLORS.primary} opacity="0.06"
              stroke={ANIME_COLORS.primary} strokeWidth="1"/>
            <path d={BURST} fill="none"
              stroke={ANIME_COLORS.secondary} strokeWidth="0.6" opacity="0.12"
              transform="rotate(7.5)"/>
          </svg>
        </div>

        {/* ── ruby overline badge ── */}
        <span className="nf-ruby fu-1">Quest Not Found · Error 404</span>

        {/* ── giant 404 ── */}
        <div style={{position:"relative", zIndex:2}} className="fu-1">
          {/* ghost layers */}
          <div style={{
            position:"absolute",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(7rem,26vw,17rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:"transparent",
            WebkitTextStroke:`0.04em ${ANIME_COLORS.secondary}`,
            top:"7px", left:"-9px",
            opacity:0.35, pointerEvents:"none", userSelect:"none",
          }}>404</div>
          <div style={{
            position:"absolute",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(7rem,26vw,17rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:"transparent",
            WebkitTextStroke:`0.04em ${ANIME_COLORS.accent}`,
            top:"-6px", left:"9px",
            opacity:0.3, pointerEvents:"none", userSelect:"none",
          }}>404</div>
          {/* primary glitch layer */}
          <h1 className="nf-num" style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(7rem,26vw,17rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:ANIME_COLORS.text,
            WebkitTextStroke:`0.025em ${ANIME_COLORS.primary}`,
            textShadow:`0 0 35px ${ANIME_COLORS.primary}50, -3px -3px 0 ${ANIME_COLORS.primary}, 3px 3px 0 ${ANIME_COLORS.secondary}`,
            margin:0, position:"relative", zIndex:2,
          }}>404</h1>
        </div>

        {/* ── main card ── */}
        <div className="nf-card fu-2" style={{
          position:"relative", zIndex:2,
          maxWidth:520, width:"100%",
          padding:"clamp(1.4rem,3vw,2.2rem) clamp(1.6rem,4vw,2.8rem)",
        }}>
          <div className="nf-scan" />

          <p className="nf-tag" style={{position:"relative", zIndex:1}}>
            System Alert · Route Unavailable
          </p>

          <h2 className={`${cinzelFont.className}`} style={{
            fontSize:"clamp(1.4rem,4vw,2.2rem)",
            color:"#fff",
            letterSpacing:"0.06em",
            textTransform:"uppercase",
            textShadow:`0 0 24px ${ANIME_COLORS.primary}55`,
            margin:"0.6rem 0 1rem",
            position:"relative", zIndex:1,
          }}>
            This Quest Doesn't Exist
          </h2>

          <p className="nf-desc" style={{position:"relative", zIndex:1}}>
            The page you're looking for got lost in the void.<br/>
            It never spawned — or was already defeated.<br/>
            <span style={{
              fontSize:"0.72rem", letterSpacing:"0.3em",
              color:`${ANIME_COLORS.accent}bb`, textTransform:"uppercase",
            }}>
              No checkpoints here, hero.
            </span>
          </p>

          <div className="nf-deco" style={{position:"relative", zIndex:1}} />
        </div>

        {/* ── action row ── */}
        <div className="fu-3" style={{
          display:"flex", gap:"1rem", flexWrap:"wrap",
          justifyContent:"center",
          position:"relative", zIndex:2,
        }}>
          <Link href="/" className="nf-btn">← Return to Base</Link>
          <Link href="/events/cultural" className="nf-btn-ghost">Browse Quests →</Link>
        </div>

      </main>
    </>
  );
}