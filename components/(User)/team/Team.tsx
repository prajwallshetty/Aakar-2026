"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";

/* ─── data ────────────────────────────────────────────────────── */
interface TeamMember { name: string; role: string; image: string; }
interface TeamCategory { name: string; members: TeamMember[]; }

const teamData: TeamCategory[] = [
  {
    name: "Mentorship Panel",
    members: [
      { name: "Mr. Vinod T Dsouza", role: "Chief Co-ordinator", image: "/Team/lecturer/vinod.png" },
      { name: "Dr. Suhandas", role: "Faculty Co-ordinator", image: "/Team/lecturer/suhan.png" },
      { name: "Ms. Disha C Shetty", role: "Faculty Co-ordinator", image: "/Team/lecturer/disha.jpg" },
      { name: "Mrs. Sharanya P S", role: "Faculty Co-ordinator", image: "/Team/lecturer/sharanya.png" },
    ],
  },
  {
    name: "Core Committee",
    members: [
      { name: "Aman Hasan", role: "Event Head", image: "/Team/Core-Committee/aman.jpg" },
      { name: "Ankitha", role: "Sponsorship & finance Head", image: "/Team/Core-Committee/ankitha.jpeg" },
      { name: "Rishitha", role: "Public Relation(PR) Head", image: "/Team/Core-Committee/rishitha.jpg" },
      { name: "Ayisha", role: "Designs & Creatives Head", image: "/Team/Core-Committee/Ayisha.jpg" },
      { name: "Pratham", role: "Operations Manager", image: "/Team/Core-Committee/pratham.jpg" },
      { name: "Rahul", role: "Social Media manager", image: "/Team/Core-Committee/rahul.PNG" },
      { name: "Monith", role: "Event Coordinator", image: "/Team/Core-Committee/monith.png" },
      { name: "Dhyan", role: "Content & Media Head", image: "/Team/Core-Committee/dhyan.jpeg" },
      { name: "Rithvik", role: "Merchandise Lead", image: "/Team/Core-Committee/rithvik.jpg" },
      { name: "Pooja", role: "Marketing & Promotions Head", image: "/Team/Core-Committee/pooja.jpg" },
      { name: "Niresh", role: "Technical Head", image: "/Team/Core-Committee/niresh.png" },
      { name: "sudheeksha", role: "Registration & Help Desk Head", image: "/Team/Core-Committee/sudeeksha.jpg" },
      { name: "Surakshith", role: "Logistics & Venue Head", image: "/Team/Core-Committee/surakshith.jpg" },
    ],
  },
];

/* accent color cycle per card index */
const accents = ["#FF5500", "#00FFFF", "#FFD700", "#B026FF", "#00FF66"];

/* ─── 3D card hook ────────────────────────────────────────────── */
function use3DCard() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * 20}deg) rotateY(${x * 20}deg) scale3d(1.05,1.05,1.05)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }, []);
  return { ref, onMove, onLeave };
}

/* ─── member card ─────────────────────────────────────────────── */
function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const { ref, onMove, onLeave } = use3DCard();
  const accent = accents[index % accents.length];

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="member-card group relative"
      style={{
        "--accent": accent,
        background: "rgba(15, 20, 30, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        transformStyle: "preserve-3d",
        transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        willChange: "transform",
        animationDelay: `var(--delay)`,
      } as React.CSSProperties}
    >
      {/* Anime styling: top bright bar */}
      <div style={{ height: 4, background: accent, width: "100%", boxShadow: `0 0 15px ${accent}` }} />

      {/* Tech corner decoration marks */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-[3px] border-l-[3px] opacity-70 z-10 transition-colors duration-300" style={{ borderColor: accent }} />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-[3px] border-r-[3px] opacity-70 z-10 transition-colors duration-300" style={{ borderColor: accent }} />

      {/* photo container */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1.05", overflow: "hidden", clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
          className="group-hover:scale-110"
        />
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-50" style={{ background: "linear-gradient(to top, rgba(15,20,30,1) 0%, transparent 60%)" }} />
        {/* Subtle scanline effect built-in to photo container */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      {/* name + role area */}
      <div className="relative p-5 pt-0 z-10 text-center flex flex-col items-center justify-end" style={{ transform: "translateZ(40px)", minHeight: "105px" }}>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(1.2rem, 3cqw, 1.6rem)",
          letterSpacing: "0.08em",
          color: "#fff",
          textShadow: `0 0 8px rgba(0,0,0,0.8)`,
          margin: "0 0 10px",
          lineHeight: 1.1,
          textTransform: "uppercase",
          transition: "text-shadow 0.3s ease",
        }} className="group-hover:text-shadow-glow">{member.name}</p>

        <div style={{
          background: `rgba(0,0,0,0.5)`,
          border: `1px solid ${accent}`,
          color: accent,
          padding: "5px 16px",
          borderRadius: "6px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "clamp(0.6rem, 2cqw, 0.75rem)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          boxShadow: `inset 0 0 10px ${accent}20`,
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(4px)"
        }}>
          {/* Glint effect on role badge */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[glint_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
          <span className="relative z-10 font-bold">{member.role}</span>
        </div>
      </div>

      {/* Dynamic lighting on hover based on cursor position */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen z-20"
        style={{
          background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), ${accent}25 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}

/* ─── section heading ─────────────────────────────────────────── */
function SectionHeading({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "3.5rem", width: "100%", justifyContent: "center" }}>
      <div className="flex-1 max-w-[120px] h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(2rem, 5vw, 3.2rem)",
        letterSpacing: "0.15em",
        color: "#fff",
        textShadow: `0 0 15px ${color}80, 0 0 25px ${color}40`,
        margin: 0,
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span style={{ color, opacity: 0.8 }}>/</span>/ {children}
      </h2>
      <div className="flex-1 max-w-[120px] h-[3px]" style={{ background: `linear-gradient(-90deg, transparent, ${color})` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
const Team = () => (
  <>
    <style>{`
      @keyframes cardIn {
        0%   { opacity: 0; transform: translateY(40px) scale(0.9) skewY(2deg); }
        100% { opacity: 1; transform: translateY(0) scale(1) skewY(0deg); }
      }
      @keyframes glint {
        0%   { transform: translateX(-100%) skewX(-20deg); }
        100% { transform: translateX(200%) skewX(-20deg); }
      }
      .member-card {
        animation: cardIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        container-type: inline-size;
      }
      .member-card:hover {
        border-color: var(--accent) !important;
        box-shadow: 0 0 25px color-mix(in srgb, var(--accent) 35%, transparent), inset 0 0 15px color-mix(in srgb, var(--accent) 15%, transparent) !important;
      }
      .group-hover\\:text-shadow-glow {
        text-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent) !important;
      }
      /* Diagonal sliding highlight overlay for the card */
      .member-card::before {
        content: '';
        position: absolute;
        top: 0; left: -150%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        transform: skewX(-25deg);
        transition: left 0.7s ease;
        z-index: 15;
        pointer-events: none;
      }
      .member-card:hover::before {
        left: 150%;
      }
      @keyframes gridPan {
        0% { background-position: 0px 0px; }
        100% { background-position: 60px 60px; }
      }
      .grid-animate {
        animation: gridPan 3s linear infinite;
      }
    `}</style>

    {/* Background Image Setup */}
    <div className="fixed inset-0 z-[-1]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/bg.jpg)", transform: "scale(1.02)" /* slight scale to avoid edge artifacting */ }}
      />
      {/* Dark gradient mapping overlay for cinematic feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[4px]" />

      {/* Cyber/Anime Tech grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] grid-animate pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
    </div>

    <main style={{
      position: "relative", zIndex: 10,
      minHeight: "100vh",
      padding: "clamp(5rem, 12vh, 8rem) clamp(1rem, 5vw, 3rem)",
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(4rem, 10vh, 6rem)" }}>

        {/* Page Title Node */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 20 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            color: "#00FFFF",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
            letterSpacing: "0.2em",
            padding: "6px 24px",
            border: "1px solid #00FFFF",
            borderRadius: "30px",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1)",
            marginBottom: "1.5rem",
          }}>
            <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse" />
            SYSTEM_OP // AAKAR_2026
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 9vw, 5.5rem)",
            lineHeight: 0.85,
            letterSpacing: "0.06em",
            color: "#FFF",
            textShadow: "0 0 25px rgba(255,85,0,0.5), -3px -3px 0 #FF5500, 3px 3px 0 #00FFFF",
            transform: "skewX(-6deg)",
            margin: 0
          }}>
            MEET THE <span style={{ color: "transparent", WebkitTextStroke: "2px #FF5500", textShadow: "0 0 30px rgba(255,85,0,0.7)" }}>SQUAD</span>
          </h1>

          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
            letterSpacing: "0.3em",
            color: "#00FFFF",
            marginTop: "1.8rem",
            textTransform: "uppercase",
            textShadow: "0 0 10px #00FFFF"
          }}>
            &gt; WARNING: HIGH POWER LEVELS DETECTED _
          </p>
        </div>

        {/* Members Categories */}
        {teamData.map((category, catIdx) => (
          <div key={category.name} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

            <SectionHeading color={catIdx === 0 ? "#FF5500" : "#00FFFF"}>
              {category.name}
            </SectionHeading>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "clamp(1rem, 3vw, 2rem)",
              width: "100%",
              perspective: "1200px",
            }}>
              {category.members.map((member, i) => (
                <div key={i} style={{ "--delay": `${i * 0.08}s`, width: "clamp(150px, 35vw, 260px)" } as React.CSSProperties}>
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
