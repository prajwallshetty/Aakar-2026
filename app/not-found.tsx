"use client";

import Link from "next/link";

/* ─── palette ─────────────────────────────────────────────────── */
const P = {
  yellow:  "#ffff00",
  yellow2: "#fff500",
  magenta: "#ff00ff",
  cyan:    "#00ffff",
  hot:     "#ff0066",
  black:   "#0a0005",
  white:   "#ffffff",
};

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

const BURST_TL  = buildStarburstPath(0,    0,    130, 80,  18);
const BURST_TR  = buildStarburstPath(9999, 0,    110, 70,  18);
const BURST_BL  = buildStarburstPath(0,    9999, 120, 75,  18);
const BURST_BR  = buildStarburstPath(9999, 9999, 130, 82,  18);
const BURST_CTR = buildStarburstPath(0,    0,    260, 160, 24);  /* giant center burst */

const SPEED_LINES = Array.from({ length: 48 }, (_, i) => {
  const r = ((360 / 48) * i * Math.PI) / 180;
  return {
    x2: Math.round((50 + 80 * Math.cos(r)) * 1e4) / 1e4,
    y2: Math.round((50 + 80 * Math.sin(r)) * 1e4) / 1e4,
  };
});

/* ─── background ──────────────────────────────────────────────── */
function PopArtBackground() {
  return (
    <>
      {/* stripes */}
      <div aria-hidden style={{ position:"fixed",inset:0,zIndex:0,backgroundImage:`repeating-linear-gradient(45deg,${P.yellow} 0px,${P.yellow} 18px,${P.yellow2} 18px,${P.yellow2} 36px)` }}/>
      {/* halftone */}
      <div aria-hidden style={{ position:"fixed",inset:0,zIndex:1,backgroundImage:`radial-gradient(circle,rgba(0,0,0,0.18) 1.8px,transparent 1.8px)`,backgroundSize:"14px 14px" }}/>
      {/* speed lines */}
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:2,pointerEvents:"none",opacity:0.07}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
        {SPEED_LINES.map((pt,i) => <line key={i} x1="50" y1="50" x2={pt.x2} y2={pt.y2} stroke={P.black} strokeWidth="0.3"/>)}
      </svg>
      {/* corner triangles */}
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:3,pointerEvents:"none"}}>
        <polygon points="0,0 180,0 0,160"                                               fill={P.magenta} opacity="0.28"/>
        <polygon points="100%,0 calc(100% - 180px),0 100%,160"                          fill={P.cyan}    opacity="0.28"/>
        <polygon points="0,100% 160,100% 0,calc(100% - 140px)"                          fill={P.hot}     opacity="0.26"/>
        <polygon points="100%,100% calc(100% - 160px),100% 100%,calc(100% - 140px)"     fill={P.magenta} opacity="0.26"/>
      </svg>
      {/* corner starbursts */}
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:4,pointerEvents:"none"}}>
        <path d={BURST_TL} fill={P.magenta} opacity="0.22"/>
        <path d={BURST_TR} fill={P.cyan}    opacity="0.22" transform="translate(-9999,0)"/>
        <path d={BURST_BL} fill={P.hot}     opacity="0.20" transform="translate(0,-9999)"/>
        <path d={BURST_BR} fill={P.magenta} opacity="0.22" transform="translate(-9999,-9999)"/>
      </svg>
      {/* floating shapes */}
      {([
        {top:"12%", left:"1.5%",  color:P.magenta, circle:true,  delay:"0s"  },
        {top:"30%", right:"1.5%", color:P.cyan,    circle:false, delay:"0.8s"},
        {top:"55%", left:"1.2%",  color:P.yellow,  circle:false, delay:"1.4s"},
        {top:"72%", right:"1.2%", color:P.hot,     circle:true,  delay:"2.0s"},
        {top:"42%", left:"1.8%",  color:P.cyan,    circle:true,  delay:"2.6s"},
        {top:"85%", right:"1.5%", color:P.magenta, circle:false, delay:"1.1s"},
      ] as const).map((s,i) => (
        <div key={i} aria-hidden style={{
          position:"fixed", top:s.top,
          left:(s as any).left, right:(s as any).right,
          width:26, height:26,
          borderRadius:s.circle ? "50%" : 4,
          transform:s.circle ? undefined : "rotate(45deg)",
          background:s.color,
          border:`2.5px solid ${P.black}`,
          boxShadow:`3px 3px 0 ${P.black}`,
          animation:`floatShape 4s ease-in-out infinite`,
          animationDelay:s.delay,
          opacity:0.8, zIndex:5, pointerEvents:"none",
        }}/>
      ))}
      {/* word stamps */}
      {([
        {text:"POW!", top:"9%",    left:"3%",   rot:-12, color:P.magenta},
        {text:"ZAP!", top:"6%",    right:"4%",  rot:10,  color:P.cyan   },
        {text:"WOW!", bottom:"8%", left:"4%",   rot:-8,  color:P.hot    },
        {text:"BOOM!",bottom:"6%", right:"3%",  rot:14,  color:P.yellow },
      ] as const).map((s,i) => (
        <div key={i} aria-hidden style={{
          position:"fixed",
          top:(s as any).top, bottom:(s as any).bottom,
          left:(s as any).left, right:(s as any).right,
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(1.6rem,4vw,2.8rem)",
          letterSpacing:"0.06em",
          color:s.color,
          WebkitTextStroke:`2px ${P.black}`,
          transform:`rotate(${s.rot}deg)`,
          animation:`stampWiggle 3s ease-in-out infinite`,
          "--r":`${s.rot}deg`,
          opacity:0.5, zIndex:5, pointerEvents:"none", userSelect:"none",
        } as React.CSSProperties}>{s.text}</div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');

        @keyframes floatShape {
          0%,100% { transform:translateY(0) rotate(0deg); }
          33%     { transform:translateY(-14px) rotate(6deg); }
          66%     { transform:translateY(-6px)  rotate(-4deg); }
        }
        @keyframes stampWiggle {
          0%,100% { transform:rotate(var(--r)) scale(1); }
          50%     { transform:rotate(calc(var(--r)*-0.6)) scale(1.06); }
        }
        @keyframes burstSpin {
          to { transform:translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes glitchNum {
          0%,90%,100% { clip-path:none; transform:translate(0,0); }
          91%  { clip-path:inset(20% 0 50% 0); transform:translate(-6px, 2px); color: ${P.cyan}; }
          93%  { clip-path:inset(55% 0 10% 0); transform:translate( 6px,-3px); color: ${P.magenta}; }
          95%  { clip-path:inset( 5% 0 80% 0); transform:translate(-4px, 4px); color: ${P.hot}; }
          97%  { clip-path:inset(40% 0 30% 0); transform:translate( 5px,-1px); color: ${P.cyan}; }
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
          0%,100% { box-shadow: 5px 5px 0 ${P.black}, 8px 8px 0 ${P.magenta}; }
          50%     { box-shadow: 5px 5px 0 ${P.black}, 8px 8px 0 ${P.cyan}; }
        }

        .glitch-404  { animation: glitchNum   4s ease-in-out infinite; }
        .subtitle-in { animation: subtitleIn  0.5s 0.15s ease both; }
        .card-in     { animation: cardIn      0.5s 0.25s ease both; }
        .btn-pulse   { animation: btnPulse    2s   ease-in-out infinite; }

        .go-home:hover {
          transform: translate(-3px,-3px) !important;
        }
      `}</style>

      <PopArtBackground />

      <main style={{
        position:"relative", zIndex:10,
        minHeight:"100vh",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"2rem",
        gap:"clamp(1rem,2.5vh,2rem)",
        textAlign:"center",
      }}>

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
            <path d={BURST_CTR} fill={P.yellow} opacity="0.35" stroke={P.black} strokeWidth="1.5"/>
          </svg>
        </div>

        {/* ── 404 number ── */}
        <div style={{position:"relative", zIndex:2}}>
          {/* cyan riso ghost */}
          <div style={{
            position:"absolute",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(8rem,28vw,18rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:"transparent",
            WebkitTextStroke:`4px ${P.cyan}`,
            top:"6px", left:"-8px",
            opacity:0.5, pointerEvents:"none",
          }}>404</div>
          {/* magenta riso ghost */}
          <div style={{
            position:"absolute",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(8rem,28vw,18rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:"transparent",
            WebkitTextStroke:`4px ${P.magenta}`,
            top:"-5px", left:"8px",
            opacity:0.4, pointerEvents:"none",
          }}>404</div>
          {/* primary */}
          <h1 className="glitch-404" style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(8rem,28vw,18rem)",
            lineHeight:0.85, letterSpacing:"0.02em",
            color:P.black,
            WebkitTextStroke:`3px ${P.black}`,
            textShadow:`6px 6px 0 ${P.black}`,
            margin:0, position:"relative", zIndex:2,
          }}>404</h1>
        </div>

        {/* ── headline card ── */}
        <div className="card-in" style={{
          position:"relative", zIndex:2,
          background:"rgba(255,255,255,0.96)",
          border:`3px solid ${P.black}`,
          boxShadow:`6px 6px 0 ${P.black}, 10px 10px 0 ${P.hot}`,
          borderRadius:16,
          padding:"clamp(1.2rem,3vw,2rem) clamp(1.6rem,4vw,3rem)",
          maxWidth:520,
        }}>
          {/* top accent bar */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:5,
            background:`repeating-linear-gradient(90deg,${P.magenta} 0,${P.magenta} 20px,${P.cyan} 20px,${P.cyan} 40px,${P.hot} 40px,${P.hot} 60px,${P.yellow} 60px,${P.yellow} 80px)`,
            borderRadius:"13px 13px 0 0",
            borderBottom:`2px solid ${P.black}`,
          }}/>

          <p style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(1.4rem,4vw,2.2rem)",
            letterSpacing:"0.06em",
            color:P.black,
            textShadow:`3px 3px 0 ${P.magenta}`,
            margin:"0 0 0.5rem",
          }}>PAGE NOT FOUND</p>

          <p style={{
            fontFamily:"'Share Tech Mono',monospace",
            fontSize:"clamp(0.72rem,1.6vw,0.88rem)",
            letterSpacing:"0.12em",
            color:"#333",
            margin:0,
            lineHeight:1.6,
          }}>
            Looks like this page got lost in the chaos.<br/>
            It doesn&apos;t exist — or maybe it never did.
          </p>
        </div>

        {/* ── AAKAR label ── */}
        <div className="subtitle-in" style={{
          position:"relative", zIndex:2,
          display:"inline-flex", alignItems:"center", gap:10,
          background:P.black, color:P.yellow,
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(0.65rem,1.6vw,0.85rem)",
          letterSpacing:"0.38em",
          padding:"5px 20px",
          border:`2px solid ${P.black}`,
          boxShadow:`3px 3px 0 ${P.magenta}`,
        }}>▲ AAKAR 2026 · BRAINS · GUTS · GLORY ▲</div>

        {/* ── CTA button ── */}
        <Link href="/" style={{position:"relative", zIndex:2, textDecoration:"none"}}>
          <button
            className="go-home btn-pulse"
            style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(1rem,2.2vw,1.3rem)",
              letterSpacing:"0.14em",
              background:P.black,
              color:P.yellow,
              border:`3px solid ${P.black}`,
              padding:"12px 36px",
              cursor:"pointer",
              borderRadius:4,
              transition:"transform 0.1s",
            }}
          >
            ← GO BACK HOME
          </button>
        </Link>

      </main>
    </>
  );
}