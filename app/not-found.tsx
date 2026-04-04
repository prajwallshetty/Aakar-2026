"use client";

import Link from "next/link";
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

/* ─── pre-computed math (no hydration mismatch) ──────────────── */
function buildStarburstPath(cx: number, cy: number, outerR: number, innerR: number, spikes = 18) {
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

const BURST_CTR = buildStarburstPath(0, 0, 260, 160, 24);

/* ═══════════════════════════════════════════════════════════════ */
export default function NotFound() {
  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        @keyframes burstSpin {
          to { transform:translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes glitchNum {
          0%,90%,100% { clip-path:none; transform:translate(0,0); }
          91%  { clip-path:inset(20% 0 50% 0); transform:translate(-6px, 2px); color: ${ANIME_COLORS.secondary}; }
          93%  { clip-path:inset(55% 0 10% 0); transform:translate( 6px,-3px); color: ${ANIME_COLORS.accent}; }
          95%  { clip-path:inset( 5% 0 80% 0); transform:translate(-4px, 4px); color: ${ANIME_COLORS.primary}; }
          97%  { clip-path:inset(40% 0 30% 0); transform:translate( 5px,-1px); color: ${ANIME_COLORS.secondary}; }
        }
        @keyframes subtitleIn {
          0%  { opacity:0; transform:translateY(16px) skewX(-4deg); }
          100%{ opacity:1; transform:translateY(0)    skewX(-4deg); }
        }
        @keyframes cardIn {
          0%  { opacity:0; transform:translateY(30px) scale(0.94); }
          100%{ opacity:1; transform:translateY(0)    scale(1); }
        }
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 0 20px ${ANIME_COLORS.primary}40, inset 0 0 10px ${ANIME_COLORS.primary}20; }
          50%     { box-shadow: 0 0 30px ${ANIME_COLORS.secondary}60, inset 0 0 15px ${ANIME_COLORS.secondary}30; }
        }

        .glitch-404  { animation: glitchNum   4s ease-in-out infinite; }
        .subtitle-in { animation: subtitleIn  0.5s 0.15s ease both; }
        .card-in     { animation: cardIn      0.5s 0.25s ease both; }
        .btn-pulse   { animation: btnPulse    2s   ease-in-out infinite; }

        .go-home:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 0 30px ${ANIME_COLORS.primary}60, inset 0 0 15px ${ANIME_COLORS.primary}30 !important;
        }
      `}</style>

      {/* Anime Background */}
      <AnimeParticleField />

      <main suppressHydrationWarning={true} style={{
        position:"relative", zIndex:10,
        minHeight:"100vh",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"2rem",
        gap:"clamp(1rem,2.5vh,2rem)",
        textAlign:"center",
      }}>
        {/* Full anime background like other pages */}
        <div style={{
          position:"fixed",
          top:0,
          left:0,
          right:0,
          bottom:0,
          background: `linear-gradient(135deg, ${ANIME_COLORS.background}95, ${ANIME_COLORS.background}90)`,
          zIndex:1
        }} />

        {/* ── giant spinning starburst behind 404 ── */}
        <div style={{
          position:"absolute",
          top:"50%", left:"50%",
          width:"clamp(320px,60vw,640px)",
          height:"clamp(320px,60vw,640px)",
          zIndex:0,
          pointerEvents:"none",
          animation:"burstSpin 30s linear infinite",
          transform:"translate(-50%,-50%)",
        }}>
          <svg viewBox="-260 -260 520 520" width="100%" height="100%">
            <path d={BURST_CTR} fill={ANIME_COLORS.accent} opacity="0.35" stroke={ANIME_COLORS.primary} strokeWidth="1.5"/>
          </svg>
        </div>

        {/* ── 404 number ── */}
        <div style={{position:"relative", zIndex:2}}>
          {/* secondary riso ghost */}
          <div style={{
            position:"absolute",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(8rem,28vw,18rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:"transparent",
            WebkitTextStroke:`0.04em ${ANIME_COLORS.secondary}`,
            top:"6px", left:"-8px",
            opacity:0.5, pointerEvents:"none",
          }}>404</div>
          {/* accent riso ghost */}
          <div style={{
            position:"absolute",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(8rem,28vw,18rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:"transparent",
            WebkitTextStroke:`0.04em ${ANIME_COLORS.accent}`,
            top:"-5px", left:"8px",
            opacity:0.4, pointerEvents:"none",
          }}>404</div>
          {/* primary */}
          <h1 className="glitch-404" style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(8rem,28vw,18rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:ANIME_COLORS.text,
            WebkitTextStroke:`0.03em ${ANIME_COLORS.primary}`,
            textShadow:`0 0 30px ${ANIME_COLORS.primary}45, -3px -3px 0 ${ANIME_COLORS.primary}, 3px 3px 0 ${ANIME_COLORS.secondary}`,
            margin:0, position:"relative", zIndex:2,
          }}>404</h1>
        </div>

        {/* ── headline card ── */}
        <AnimeCardWrapper accentIndex={0} className="card-in" style={{
          position:"relative", zIndex:2,
          padding:"clamp(1.2rem,3vw,2rem) clamp(1.6rem,4vw,3rem)",
          maxWidth:520,
        }}>
          <AnimeSectionHeading index={0}>SYSTEM_ERROR_404</AnimeSectionHeading>

          <p style={{
            fontFamily:"'Rajdhani',sans-serif",
            fontSize:"clamp(0.9rem,1.6vw,1.1rem)",
            letterSpacing:"0.02em",
            color:"rgba(255,255,255,0.85)",
            margin:"1rem 0",
            lineHeight:1.6,
          }}>
            Looks like this page got lost in the digital void.<br/>
            It doesn&apos;t exist — or maybe it never did.
          </p>
        </AnimeCardWrapper>

        {/* ── AAKAR label ── */}
        <div className="subtitle-in" style={{
          position:"relative", zIndex:2,
          display:"inline-flex", alignItems:"center", gap:10,
          background:ANIME_COLORS.background, color:ANIME_COLORS.accent,
          fontFamily:"'Share Tech Mono',monospace",
          fontSize:"clamp(0.65rem,1.6vw,0.85rem)",
          letterSpacing:"0.38em",
          padding:"5px 20px",
          border:`1px solid ${ANIME_COLORS.accent}`,
          boxShadow:`0 0 12px ${ANIME_COLORS.accent}40`,
          backdropFilter:"blur(8px)"
        }}>▲ AAKAR 2026 · BRAINS · GUTS · GLORY ▲</div>

        {/* ── CTA button ── */}
        <Link href="/" style={{position:"relative", zIndex:2, textDecoration:"none"}}>
          <button
            className="go-home btn-pulse"
            style={{
              fontFamily:"'Share Tech Mono',monospace",
              fontSize:"clamp(1rem,2.2vw,1.3rem)",
              letterSpacing:"0.14em",
              background:`rgba(0, 229, 255, 0.1)`,
              color:ANIME_COLORS.primary,
              border:`1px solid ${ANIME_COLORS.primary}`,
              boxShadow:`0 0 15px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.1)`,
              padding:"12px 36px",
              cursor:"pointer",
              borderRadius:4,
              transition:"all 0.3s ease",
              textTransform:"uppercase",
            }}
          >
            ← RETURN_TO_HOME
          </button>
        </Link>

      </main>
    </>
  );
}