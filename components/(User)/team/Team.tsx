"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "../PopArtBackground";

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
      ${POP_ART_KEYFRAMES}
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