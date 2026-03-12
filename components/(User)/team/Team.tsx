"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";

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

/* ─── data ────────────────────────────────────────────────────── */
interface TeamMember   { name: string; role: string; image: string; }
interface TeamCategory { name: string; members: TeamMember[]; }

const teamData: TeamCategory[] = [
  {
    name: "Mentorship Panel",
    members: [
      { name: "Mr. Vinod T Dsouza", role: "Chief Co-ordinator",   image: "/Team/lecturer/vinod.png"     },
      { name: "Dr. Suhandas",       role: "Faculty Co-ordinator",  image: "/Team/lecturer/suhan.png"     },
      { name: "Ms. Disha C Shetty", role: "Faculty Co-ordinator",  image: "/Team/lecturer/disha.jpg"     },
      { name: "Mrs. Sharanya P S",  role: "Faculty Co-ordinator",  image: "/Team/lecturer/sharanya.png"  },
    ],
  },
  {
    name: "Core Committee",
    members: [
      { name: "Ayan A Thonse",      role: "President",          image: "/Team/Core-Committee/ayan.jpg"      },
      { name: "Aawan Shaikh",       role: "Vice President",     image: "/Team/Core-Committee/aawan.jpg"     },
      { name: "Anaum Fathima",      role: "Secretary",          image: "/Team/Core-Committee/anaum.jpg"     },
      { name: "Shreya Dk",          role: "Cultural Lead",      image: "/Team/Core-Committee/shreya.jpg"    },
      { name: "Thashvy S Suvarna",  role: "Creative Lead",      image: "/Team/Core-Committee/thashvy.jpg"  },
      { name: "Manya Shetty",       role: "Management Lead",    image: "/Team/Core-Committee/manya.jpg"    },
      { name: "Sahana",             role: "Media Lead",         image: "/Team/Core-Committee/sahana.jpg"   },
      { name: "Gauresh G Pai",      role: "Technical Lead",     image: "/Team/Core-Committee/gauresh.png"  },
      { name: "Monith K",           role: "Design Lead",        image: "/Team/Core-Committee/monith.jpg"   },
      { name: "Jnanesh",            role: "Web Lead",           image: "/Team/Core-Committee/Jnanesh.jpg"  },
      { name: "Nishanth Shetty B",  role: "Executive Member",   image: "/Team/Core-Committee/nishant.jpg"  },
      { name: "Thanisha Devadiga",  role: "Executive Member",   image: "/Team/Core-Committee/thanisha.jpg" },
      { name: "Farhan",             role: "Executive Member",   image: "/Team/Core-Committee/farhan.jpg"   },
    ],
  },
];

/* accent color cycle per card index */
const accents = [P.magenta, P.cyan, P.hot, P.yellow];
const shadows  = [P.cyan,    P.hot,  P.magenta, P.magenta];

/* ─── starburst path (pure string — no runtime Math calls in render) ── */
function buildStarburstPath(cx: number, cy: number, outerR: number, innerR: number, spikes = 18) {
  let d = "";
  for (let i = 0; i < spikes * 2; i++) {
    const r   = i % 2 === 0 ? outerR : innerR;
    const ang = (Math.PI / spikes) * i - Math.PI / 2;
    // round to 4 dp so server and client produce identical strings
    const x   = Math.round((cx + r * Math.cos(ang)) * 1e4) / 1e4;
    const y   = Math.round((cy + r * Math.sin(ang)) * 1e4) / 1e4;
    d += (i === 0 ? "M" : "L") + `${x},${y}`;
  }
  return d + "Z";
}

/* pre-compute at module level — same value on server and client */
const BURST_TL = buildStarburstPath(0,    0,    130, 80,  18);
const BURST_TR = buildStarburstPath(9999, 0,    110, 70,  18);
const BURST_BL = buildStarburstPath(0,    9999, 120, 75,  18);
const BURST_BR = buildStarburstPath(9999, 9999, 130, 82,  18);

const SPEED_LINES = Array.from({ length: 48 }, (_, i) => {
  const angle = (360 / 48) * i;
  const r     = (angle * Math.PI) / 180;
  return {
    x2: Math.round((50 + 80 * Math.cos(r)) * 1e4) / 1e4,
    y2: Math.round((50 + 80 * Math.sin(r)) * 1e4) / 1e4,
  };
});

/* ─── pop-art background ──────────────────────────────────────── */
function PopArtBackground() {
  return (
    <>
      <div aria-hidden style={{ position:"fixed",inset:0,zIndex:0, backgroundImage:`repeating-linear-gradient(45deg,${P.yellow} 0px,${P.yellow} 18px,${P.yellow2} 18px,${P.yellow2} 36px)` }}/>
      <div aria-hidden style={{ position:"fixed",inset:0,zIndex:1, backgroundImage:`radial-gradient(circle,rgba(0,0,0,0.18) 1.8px,transparent 1.8px)`, backgroundSize:"14px 14px" }}/>
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:2,pointerEvents:"none",opacity:0.07}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
        {SPEED_LINES.map((pt, i) => (
          <line key={i} x1="50" y1="50" x2={pt.x2} y2={pt.y2} stroke={P.black} strokeWidth="0.3"/>
        ))}
      </svg>
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:3,pointerEvents:"none"}}>
        <polygon points="0,0 180,0 0,160"       fill={P.magenta} opacity="0.28"/>
        <polygon points="100%,0 calc(100% - 180px),0 100%,160" fill={P.cyan} opacity="0.28"/>
        <polygon points="0,100% 160,100% 0,calc(100% - 140px)" fill={P.hot} opacity="0.26"/>
        <polygon points="100%,100% calc(100% - 160px),100% 100%,calc(100% - 140px)" fill={P.magenta} opacity="0.26"/>
      </svg>
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:4,pointerEvents:"none"}}>
        <path d={BURST_TL} fill={P.magenta} opacity="0.22"/>
        <path d={BURST_TR} fill={P.cyan}    opacity="0.22" transform="translate(-9999,0)"/>
        <path d={BURST_BL} fill={P.hot}     opacity="0.20" transform="translate(0,-9999)"/>
        <path d={BURST_BR} fill={P.magenta} opacity="0.22" transform="translate(-9999,-9999)"/>
      </svg>
      {[
        {top:"12%",left:"1.5%", color:P.magenta,circle:true, delay:"0s"},
        {top:"30%",right:"1.5%",color:P.cyan,   circle:false,delay:"0.8s"},
        {top:"55%",left:"1.2%", color:P.yellow, circle:false,delay:"1.4s"},
        {top:"72%",right:"1.2%",color:P.hot,    circle:true, delay:"2.0s"},
        {top:"42%",left:"1.8%", color:P.cyan,   circle:true, delay:"2.6s"},
        {top:"85%",right:"1.5%",color:P.magenta,circle:false,delay:"1.1s"},
      ].map((s,i)=>(
        <div key={i} aria-hidden style={{position:"fixed",top:s.top,left:(s as any).left,right:(s as any).right,width:26,height:26,borderRadius:s.circle?"50%":4,transform:s.circle?undefined:"rotate(45deg)",background:s.color,border:`2.5px solid ${P.black}`,boxShadow:`3px 3px 0 ${P.black}`,animation:`floatShape 4s ease-in-out infinite`,animationDelay:s.delay,opacity:0.8,zIndex:5,pointerEvents:"none"}}/>
      ))}
      {[
        {text:"POW!", top:"9%",   left:"3%",  rot:-12,color:P.magenta},
        {text:"ZAP!", top:"6%",   right:"4%", rot:10, color:P.cyan},
        {text:"WOW!", bottom:"8%",left:"4%",  rot:-8, color:P.hot},
        {text:"BOOM!",bottom:"6%",right:"3%", rot:14, color:P.yellow},
      ].map((s,i)=>(
        <div key={i} aria-hidden style={{position:"fixed",top:(s as any).top,bottom:(s as any).bottom,left:(s as any).left,right:(s as any).right,fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.6rem,4vw,2.8rem)",letterSpacing:"0.06em",color:s.color,WebkitTextStroke:`2px ${P.black}`,transform:`rotate(${s.rot}deg)`,animation:`stampWiggle 3s ease-in-out infinite`,opacity:0.5,zIndex:5,pointerEvents:"none",userSelect:"none","--r":`${s.rot}deg`} as React.CSSProperties}>{s.text}</div>
      ))}
    </>
  );
}

/* ─── 3D card hook ────────────────────────────────────────────── */
function use3DCard() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y*16}deg) rotateY(${x*16}deg) scale3d(1.04,1.04,1.04)`;
    el.style.setProperty("--mx", `${(x+0.5)*100}%`);
    el.style.setProperty("--my", `${(y+0.5)*100}%`);
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);
  return { ref, onMove, onLeave };
}

/* ─── member card ─────────────────────────────────────────────── */
function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const { ref, onMove, onLeave } = use3DCard();
  const accent = accents[index % 4];
  const shadow = shadows[index % 4];

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="member-card group"
      style={{
        position:"relative",
        background:"rgba(255,255,255,0.97)",
        border:`3px solid ${P.black}`,
        boxShadow:`6px 6px 0 ${P.black}, 10px 10px 0 ${shadow}`,
        borderRadius:16,
        overflow:"hidden",
        cursor:"pointer",
        transformStyle:"preserve-3d",
        transition:"transform 0.12s ease, box-shadow 0.12s ease",
        willChange:"transform",
        animationDelay:`var(--delay)`,
      }}
    >
      {/* accent top bar */}
      <div style={{height:5,background:accent,borderBottom:`2px solid ${P.black}`}}/>

      {/* photo */}
      <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden",borderBottom:`2px solid ${P.black}`}}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          style={{objectFit:"cover",transition:"transform 0.35s ease"}}
          className="group-hover:scale-105"
        />
        {/* spotlight */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{background:`radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,0.18) 0%,transparent 65%)`}}
        />
        {/* halftone on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{backgroundImage:`radial-gradient(circle,${P.black} 1.2px,transparent 1.2px)`,backgroundSize:"7px 7px"}}
        />
      </div>

      {/* name + role */}
      <div style={{padding:"12px 14px 14px",textAlign:"center"}}>
        <p style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(1rem,2.2vw,1.2rem)",
          letterSpacing:"0.06em",
          color:P.black,
          margin:"0 0 4px",
          lineHeight:1,
        }}>{member.name}</p>
        <div style={{
          display:"inline-block",
          background:accent,
          border:`1.5px solid ${P.black}`,
          boxShadow:`2px 2px 0 ${P.black}`,
          padding:"2px 10px",
          borderRadius:3,
          fontFamily:"'Share Tech Mono',monospace",
          fontSize:"clamp(0.55rem,1.2vw,0.68rem)",
          letterSpacing:"0.12em",
          color:P.black,
          textTransform:"uppercase",
        }}>{member.role}</div>
      </div>

      {/* shimmer */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
        style={{width:"200%",background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.14) 50%,transparent 100%)"}}
      />
    </div>
  );
}

/* ─── section heading ─────────────────────────────────────────── */
function SectionHeading({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{
      display:"inline-flex",alignItems:"center",gap:12,
      marginBottom:"2.5rem",
    }}>
      <div style={{height:3,width:40,background:color,border:`1px solid ${P.black}`}}/>
      <h2 style={{
        fontFamily:"'Bebas Neue',sans-serif",
        fontSize:"clamp(1.6rem,4vw,2.6rem)",
        letterSpacing:"0.08em",
        color:P.black,
        textShadow:`3px 3px 0 ${color}`,
        WebkitTextStroke:`1px ${P.black}`,
        margin:0,
      }}>{children}</h2>
      <div style={{height:3,width:40,background:color,border:`1px solid ${P.black}`}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
const Team = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');
      @keyframes floatShape {
        0%,100%{ transform:translateY(0) rotate(0deg); }
        33%    { transform:translateY(-14px) rotate(6deg); }
        66%    { transform:translateY(-6px)  rotate(-4deg); }
      }
      @keyframes stampWiggle {
        0%,100%{ transform:rotate(var(--r)) scale(1); }
        50%    { transform:rotate(calc(var(--r)*-0.6)) scale(1.06); }
      }
      @keyframes cardReveal {
        0%  { opacity:0; transform:translateY(32px) scale(0.93); }
        100%{ opacity:1; transform:translateY(0)    scale(1); }
      }
      @keyframes titleIn {
        0%  { opacity:0; transform:skewX(-6deg) translateY(-20px); }
        100%{ opacity:1; transform:skewX(-6deg) translateY(0); }
      }
      .member-card { animation: cardReveal 0.45s ease both; }
    `}</style>

    <PopArtBackground />

    <main style={{
      position:"relative", zIndex:10,
      minHeight:"100vh",
      padding:"clamp(3rem,8vh,6rem) clamp(1rem,5vw,3rem) clamp(3rem,6vh,5rem)",
    }}>
      <div style={{maxWidth:1200, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:"clamp(3rem,6vh,5rem)"}}>

        {/* page title */}
        <div style={{textAlign:"center"}}>
          <div style={{
            display:"inline-block",
            background:P.black, color:P.yellow,
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(0.6rem,1.6vw,0.8rem)",
            letterSpacing:"0.4em",
            padding:"4px 20px",
            border:`2px solid ${P.black}`,
            boxShadow:`3px 3px 0 ${P.magenta}`,
            marginBottom:"0.7rem",
          }}>AAKAR 2026</div>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(3.5rem,12vw,8rem)",
            lineHeight:0.88,
            letterSpacing:"0.04em",
            color:P.black,
            textShadow:`5px 5px 0 ${P.magenta}, 10px 10px 0 ${P.cyan}`,
            WebkitTextStroke:`2px ${P.black}`,
            animation:"titleIn 0.5s ease both",
            transform:"skewX(-6deg)",
          }}>OUR TEAM</div>
          <div style={{
            fontFamily:"'Share Tech Mono',monospace",
            fontSize:"clamp(0.55rem,1.5vw,0.7rem)",
            letterSpacing:"0.3em",
            color:P.black, opacity:0.55,
            marginTop:"0.6rem",
            textTransform:"uppercase",
          }}>BRAINS · GUTS · GLORY</div>
        </div>

        {/* categories */}
        {teamData.map((category, catIdx) => (
          <div key={category.name} style={{width:"100%", display:"flex", flexDirection:"column", alignItems:"center"}}>

            <SectionHeading color={catIdx === 0 ? P.hot : P.cyan}>
              {category.name}
            </SectionHeading>

            <div style={{
              display:"flex",
              flexWrap:"wrap",
              justifyContent:"center",
              gap:"clamp(1rem,2.5vw,1.8rem)",
              width:"100%",
              perspective:"1200px",
            }}>
              {category.members.map((member, i) => (
                <div key={i} style={{"--delay":`${i * 0.06}s`, width:"clamp(160px,22vw,220px)"} as React.CSSProperties}>
                  <MemberCard member={member} index={i} />
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </main>
  </>
);

export default Team;