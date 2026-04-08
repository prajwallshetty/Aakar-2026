"use client";

import Image from "next/image";
import { useRef, useCallback, useEffect, useState } from "react";

/* ─── data ────────────────────────────────────────────────────── */
interface TeamMember { name: string; role: string; image: string; github?: string;}
interface TeamCategory { name: string; members: TeamMember[]; }

const teamData: TeamCategory[] = [
  {
    name: "Sensei Council",
    members: [
      { name: "Dr. Chanchal Antony", role: "Chief Co-ordinator", image: "/Team/lecturer/chanchalantony.jpg" },
      { name: "Mrs. Anusha Anchan", role: "Faculty Co-ordinator", image: "/Team/lecturer/anusha.jpg" },
      { name: "Mr. Harold D'Souza", role: "Faculty Co-ordinator", image: "/Team/lecturer/harold.jpg" },
      { name: "Dr. Jennifer Charlotte", role: "Faculty Co-ordinator", image: "/Team/lecturer/jennifer.jpg" },
      { name: "Mrs. Nydile", role: "Faculty Co-ordinator", image: "/Team/lecturer/nydile.jpg" },
    ],
  },
  {
    name: "Guild Masters",
    members: [
      { name: "Aman Hasan", role: "Event Head", image: "/Team/Core-Committee/aman.jpg" },
      { name: "Ankitha", role: "Sponsorship & Finance Head", image: "/Team/Core-Committee/ankitha.jpeg" },
      { name: "Rishitha", role: "Public Relation Head", image: "/Team/Core-Committee/rishitha.jpg" },
      { name: "Ayisha", role: "Designs & Creatives Head", image: "/Team/Core-Committee/Ayisha.jpg" },
      { name: "Pratham", role: "Operations Manager", image: "/Team/Core-Committee/pratham.png" },
      { name: "Rahul", role: "Social Media Manager", image: "/Team/Core-Committee/rahul.PNG" },
      { name: "Monith", role: "Event Coordinator", image: "/Team/Core-Committee/Mona.png" },
      { name: "Dhyan", role: "Content & Media Head", image: "/Team/Core-Committee/dhyan.jpeg" },
      { name: "Rithvik", role: "Merchandise Lead", image: "/Team/Core-Committee/rithvik.jpg" },
      { name: "Pooja", role: "Marketing & Promotions Head", image: "/Team/Core-Committee/Pooja.jpg" },
      { name: "Niresh", role: "Technical Head", image: "/Team/Core-Committee/niresh.png" },
      { name: "Sudheeksha", role: "Registration & Help Desk Head", image: "/Team/Core-Committee/sudeeksha.jpg" },
      { name: "Surakshith", role: "Logistics & Venue Head", image: "/Team/Core-Committee/Surakshith.jpg" },
    ],
  },
  {
  name: "Code Ninjas",
  members: [
    {
      name: "Prajwal Shetty",
      role: "Full Stack Developer",
      image: "/Team/web/prajwal.png",
      github: "https://github.com/prajwallshetty"
    },
    {
      name: "Kishan Bhandary",
      role: "Full Stack Developer",
      image: "/Team/web/pahima.jpeg",
      github: "https://github.com/kishanBhandary"
    },
    {
      name: "Pahima R Uchil",
      role: "Full Stack Developer",
      image: "/Team/web/pahima.jpeg",
      github: "https://github.com/pahimauchil"
    }
  ]
}
];

/* ─── accent palette per card — iridescent cycle ─────────────── */
const ACCENTS = [
  { primary: "#FF4D00", glow: "#FF4D0060", secondary: "#FFB347" },
  { primary: "#00E5FF", glow: "#00E5FF60", secondary: "#7B61FF" },
  { primary: "#FFD700", glow: "#FFD70060", secondary: "#FF6B6B" },
  { primary: "#B026FF", glow: "#B026FF60", secondary: "#00E5FF" },
  { primary: "#00FF9D", glow: "#00FF9D60", secondary: "#FFD700" },
];

/* ─── Particle field ──────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const COLORS = ["#FF4D00", "#00E5FF", "#FFD700", "#B026FF", "#00FF9D"];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

/* ─── 3D tilt card hook ───────────────────────────────────────── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale3d(1.04,1.04,1.04)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);
  return { ref, onMove, onLeave };
}

/* ─── Glitch text removed ─────────────────────────────────────────────── */

/* ─── Member card ─────────────────────────────────────────────── */
function MemberCard({ member, index, category }: { member: TeamMember; index: number; category: string }) {
  const { ref, onMove, onLeave } = useTilt();
  const accent = ACCENTS[index % ACCENTS.length];
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="team-card"
      style={{
        "--accent": accent.primary,
        "--glow": accent.glow,
        "--secondary": accent.secondary,
        "--delay": `${(index % 7) * 0.07}s`,
      } as React.CSSProperties}
    >
      {/* Holographic foil border overlay */}
      <div className="holo-border" />

      {/* Top LED stripe */}
      <div className="led-stripe" style={{ background: `linear-gradient(90deg, ${accent.secondary}, ${accent.primary}, ${accent.secondary})` }} />

      {/* Corner brackets */}
      <div className="bracket tl" />
      <div className="bracket tr" />
      <div className="bracket bl" />
      <div className="bracket br" />

      {/* Photo */}
      <div className="photo-wrap">
        <div className={`photo-inner ${loaded ? "loaded" : ""}`}>
          <Image
            src={member.image}
            alt={member.name}
            fill
            style={{ objectFit: "cover" }}
            onLoad={() => setLoaded(true)}
          />
        </div>
        {/* Photo overlay gradient */}
        <div className="photo-grad" />
        {/* Scanline texture */}
        <div className="scanlines" />
        {/* ID tag overlay top-right */}
        <div className="id-tag">
          #{String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Info section */}
      <div className="card-info" style={{ transform: "translateZ(30px)" }}>
  <div className="name-line">
    {member.name}
  </div>

  <div
    className="role-badge"
    style={{
      borderColor: accent.primary,
      color: accent.primary,
      boxShadow: `0 0 12px ${accent.glow}, inset 0 0 8px ${accent.glow}`,
    }}
  >
    <span
      className="role-dot"
      style={{
        background: accent.primary,
        boxShadow: `0 0 6px ${accent.primary}`,
      }}
    />
    {member.role}
  </div>

  {/* 🔥 GITHUB LINK */}
  {category === "Code Ninjas" && member.github && (
  <a
    href={member.github}
    target="_blank"
    className="github-btn"
  >
    <span className="github-glow" />
    
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="github-icon"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.54-1.37-1.32-1.74-1.32-1.74-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.06 1.83 2.8 1.3 3.48.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.3.47-2.36 1.23-3.2-.12-.3-.54-1.5.12-3.13 0 0 1-.32 3.3 1.22a11.5 11.5 0 013 0c2.3-1.54 3.3-1.22 3.3-1.22.66 1.63.24 2.83.12 3.13.77.84 1.23 1.9 1.23 3.2 0 4.6-2.8 5.63-5.47 5.93.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
    </svg>

    <span className="github-text">GITHUB</span>
  </a>
)}
</div>

      {/* Cursor-tracking shine */}
      <div className="shine" />
    </div>
  );
}

/* ─── Section heading ─────────────────────────────────────────── */
function SectionHeading({ children, index }: { children: React.ReactNode; index: number }) {
  const colors = ["#FF4D00", "#00E5FF"];
  const c = colors[index % colors.length];
  return (
    <div className="section-head">
      <div className="head-line-left" style={{ background: `linear-gradient(90deg, transparent, ${c})` }} />
      <h2 className="head-title" style={{ textShadow: `0 0 20px ${c}80, 0 0 40px ${c}30` }}>
        <span style={{ color: c, opacity: 0.7, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7em" }}>[ </span>
        {children}
        <span style={{ color: c, opacity: 0.7, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7em" }}> ]</span>
      </h2>
      <div className="head-line-right" style={{ background: `linear-gradient(-90deg, transparent, ${c})` }} />
    </div>
  );
}

/* ─── Orbiting accent orbs in background ─────────────────────── */
function OrbField() {
  return (
    <div className="orb-container" aria-hidden>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
const Team = () => (
  <>
    {/* ── Global styles ─────────────────────────────────────── */}
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap');

      /* ── Keyframes ── */
      @keyframes cardEnter {
        from { opacity:0; transform: translateY(50px) scale(0.88) rotateX(8deg); filter: blur(4px); }
        to   { opacity:1; transform: translateY(0) scale(1) rotateX(0deg); filter: blur(0px); }
      }
      /* ── Glitch text styles removed ── */
      @keyframes ledPulse {
        0%,100% { opacity:1; }
        50%     { opacity:0.5; }
      }
      @keyframes orbFloat {
        0%,100% { transform: translateY(0) scale(1); }
        50%     { transform: translateY(-30px) scale(1.05); }
      }
      @keyframes orbFloat2 {
        0%,100% { transform: translateX(0) scale(1); }
        50%     { transform: translateX(25px) scale(0.95); }
      }
      @keyframes holoShift {
        0%   { background-position: 0% 50%;   opacity: 0; }
        50%  { background-position: 100% 50%; opacity: 0.5; }
        100% { background-position: 0% 50%;   opacity: 0; }
      }
      @keyframes badgePulse {
        0%,100% { box-shadow: 0 0 8px var(--glow, #00E5FF60); }
        50%     { box-shadow: 0 0 20px var(--glow, #00E5FF60), 0 0 40px var(--glow, #00E5FF60); }
      }
      @keyframes scanMove {
        from { background-position: 0 0; }
        to   { background-position: 0 8px; }
      }
      @keyframes titleReveal {
        from { opacity:0; transform: skewX(-6deg) translateY(30px); }
        to   { opacity:1; transform: skewX(-6deg) translateY(0); }
      }
      @keyframes subtitleReveal {
        from { opacity:0; letter-spacing: 0.5em; }
        to   { opacity:1; letter-spacing: 0.3em; }
      }

      /* ── Orbs ── */
      .orb-container {
        position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden;
      }
      .orb {
        position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12;
      }
      .orb-1 {
        width: 600px; height: 600px; top: -150px; left: -150px;
        background: radial-gradient(circle, #FF4D00, transparent 70%);
        animation: orbFloat 12s ease-in-out infinite;
      }
      .orb-2 {
        width: 500px; height: 500px; top: 30%; right: -100px;
        background: radial-gradient(circle, #00E5FF, transparent 70%);
        animation: orbFloat2 15s ease-in-out infinite 2s;
      }
      .orb-3 {
        width: 400px; height: 400px; bottom: 10%; left: 20%;
        background: radial-gradient(circle, #B026FF, transparent 70%);
        animation: orbFloat 18s ease-in-out infinite 4s;
      }
      .orb-4 {
        width: 350px; height: 350px; bottom: 30%; right: 25%;
        background: radial-gradient(circle, #FFD700, transparent 70%);
        animation: orbFloat2 10s ease-in-out infinite 1s;
      }

      /* ── Team card ── */
      .team-card {
        position: relative;
        width: clamp(155px, 32vw, 250px);
        background: rgba(8, 10, 18, 0.82);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        overflow: hidden;
        cursor: pointer;
        transform-style: preserve-3d;
        transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    box-shadow 0.3s ease,
                    border-color 0.3s ease;
        animation: cardEnter 0.65s cubic-bezier(0.2,0.8,0.2,1) var(--delay, 0s) both;
        container-type: inline-size;
      }
      .team-card:hover {
        border-color: var(--accent);
        box-shadow:
          0 0 30px var(--glow),
          0 0 60px color-mix(in srgb, var(--accent) 15%, transparent),
          inset 0 0 20px color-mix(in srgb, var(--accent) 8%, transparent);
      }

      /* ── Holo foil border ── */
      .holo-border {
        position: absolute; inset: 0; border-radius: 14px; pointer-events: none; z-index: 30;
        background: linear-gradient(135deg,
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,0.12) 25%,
          rgba(255,255,255,0) 50%,
          rgba(255,255,255,0.08) 75%,
          rgba(255,255,255,0) 100%
        );
        background-size: 300% 300%;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .team-card:hover .holo-border {
        opacity: 1;
        animation: holoShift 2s ease infinite;
      }

      /* ── LED top stripe ── */
      .led-stripe {
        height: 3px;
        width: 100%;
        animation: ledPulse 2.5s ease-in-out infinite;
      }

      /* ── Corner brackets ── */
      .bracket {
        position: absolute; width: 14px; height: 14px; z-index: 20;
        transition: border-color 0.3s, width 0.3s, height 0.3s;
        opacity: 0.6;
      }
      .bracket.tl { top: 10px; left: 10px; border-top: 2px solid var(--accent); border-left: 2px solid var(--accent); border-radius: 3px 0 0 0; }
      .bracket.tr { top: 10px; right: 10px; border-top: 2px solid var(--accent); border-right: 2px solid var(--accent); border-radius: 0 3px 0 0; }
      .bracket.bl { bottom: 10px; left: 10px; border-bottom: 2px solid var(--accent); border-left: 2px solid var(--accent); border-radius: 0 0 0 3px; }
      .bracket.br { bottom: 10px; right: 10px; border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent); border-radius: 0 0 3px 0; }
      .team-card:hover .bracket { width: 18px; height: 18px; opacity: 1; }

      /* ── Photo ── */
      .photo-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1.05;
        overflow: hidden;
        clip-path: polygon(0 0, 100% 0, 100% 87%, 5% 100%, 0 95%);
      }
      .photo-inner {
        position: absolute; inset: 0;
        opacity: 0; transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.2,0.8,0.2,1);
      }
      .photo-inner.loaded { opacity: 1; }
      .team-card:hover .photo-inner { transform: scale(1.08); }

      /* ── Photo overlays ── */
      .photo-grad {
        position: absolute; inset: 0; pointer-events: none;
        background: linear-gradient(to top, rgba(8,10,18,0.95) 0%, rgba(8,10,18,0.3) 45%, transparent 70%);
        transition: opacity 0.3s;
      }
      .scanlines {
        position: absolute; inset: 0; pointer-events: none; opacity: 0.07;
        background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 4px);
        animation: scanMove 0.5s steps(1) infinite;
      }

      /* ── ID tag ── */
      .id-tag {
        position: absolute; top: 12px; right: 12px; z-index: 10;
        font-family: 'Share Tech Mono', monospace;
        font-size: clamp(0.55rem, 2cqw, 0.7rem);
        color: var(--accent);
        background: rgba(0,0,0,0.6);
        border: 1px solid var(--accent);
        padding: 2px 7px;
        border-radius: 4px;
        letter-spacing: 0.1em;
        box-shadow: 0 0 8px var(--glow);
      }

      /* ── Card info ── */
      .card-info {
        position: relative; z-index: 10;
        padding: clamp(8px, 3cqw, 14px) clamp(10px, 3cqw, 16px) clamp(12px, 3.5cqw, 18px);
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        text-align: center;
        margin-top: -2px;
      }

      /* ── Name ── */
      .name-line {
        font-family: 'Cinzel', serif;
        font-size: clamp(1.05rem, 5cqw, 1.5rem);
        letter-spacing: 0.07em;
        color: #fff;
        line-height: 1.1;
        text-transform: uppercase;
        transition: color 0.3s, text-shadow 0.3s;
      }
      .team-card:hover .name-line {
        color: #fff;
        text-shadow: 0 0 12px var(--accent), 0 0 24px color-mix(in srgb, var(--accent) 50%, transparent);
      }

      /* ── Role badge ── */
      .role-badge {
        display: flex; align-items: center; gap: 6px;
        padding: 4px 12px;
        border: 1px solid;
        border-radius: 5px;
        font-family: 'Share Tech Mono', monospace;
        font-size: clamp(0.52rem, 2.5cqw, 0.68rem);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        background: rgba(0,0,0,0.4);
        backdrop-filter: blur(4px);
        animation: badgePulse 3s ease-in-out infinite;
        max-width: 100%;
        text-align: center;
      }
      .role-dot {
        width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
        animation: ledPulse 1.5s ease-in-out infinite;
      }

      /* ── Hover shine ── */
      .shine {
        position: absolute; inset: 0; z-index: 25; pointer-events: none;
        background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.08) 0%, transparent 55%);
        opacity: 0; transition: opacity 0.3s;
      }
      .team-card:hover .shine { opacity: 1; }

      /* ── Section heading ── */
      .section-head {
        display: flex; align-items: center; gap: 20px;
        justify-content: center; width: 100%;
        margin-bottom: clamp(2rem, 5vh, 3.5rem);
      }
      .head-line-left, .head-line-right {
        flex: 1; max-width: 130px; height: 2px; border-radius: 2px;
      }
      .head-title {
        font-family: 'Cinzel', serif;
        font-size: clamp(1.8rem, 5vw, 3rem);
        letter-spacing: 0.15em;
        color: #fff;
        margin: 0;
        text-transform: uppercase;
        white-space: nowrap;
        display: flex; align-items: center; gap: 8px;
      }

      
      .main-title {
        font-family: 'Cinzel', serif;
        font-size: clamp(3rem, 10vw, 6.5rem);
        line-height: 0.85;
        letter-spacing: 0.05em;
        color: #fff;
        text-shadow: 0 0 30px rgba(255,77,0,0.45), -3px -3px 0 #FF4D00, 3px 3px 0 #00E5FF;
        transform: skewX(-6deg);
        margin: 0;
        animation: titleReveal 1s cubic-bezier(0.2,0.8,0.2,1) 0.1s both;
      }
      .main-title-accent {
        color: #ffffff;
        -webkit-text-stroke: 0;
        text-shadow: 0 0 35px rgba(255,255,255,0.4);
      }

      /* ── Grid divider line ── */
      .grid-divider {
        width: 1px;
        background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent);
        display: none;
      }


      /* ── Card hover slide shine (::before) ── */
      .team-card::before {
        content: '';
        position: absolute; top:0; left:-160%; width:100%; height:100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        transform: skewX(-25deg);
        transition: left 0.75s ease;
        z-index: 28; pointer-events: none;
      }
      .team-card:hover::before { left: 160%; }
      .github-btn {
  position: relative;
  margin-top: 10px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #00E5FF;
  border: 1px solid rgba(0,229,255,0.4);
  border-radius: 6px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  overflow: hidden;
  transition: all 0.3s ease;
}

.github-icon {
  width: 14px;
  height: 14px;
}

.github-text {
  position: relative;
  z-index: 2;
}

/* 🔥 glow layer */
.github-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0,229,255,0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* ✨ hover effects */
.github-btn:hover {
  color: #fff;
  border-color: #00E5FF;
  box-shadow:
    0 0 10px #00E5FF,
    0 0 25px #00E5FF,
    inset 0 0 10px rgba(0,229,255,0.3);
  transform: translateY(-2px) scale(1.05);
}

.github-btn:hover .github-glow {
  opacity: 1;
}

/* ⚡ scanline flicker */
.github-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255,255,255,0.15),
    transparent
  );
  transform: translateX(-100%);
}

.github-btn:hover::after {
  animation: github-scan 0.8s linear;
}

@keyframes github-scan {
  to {
    transform: translateX(100%);
  }
}
    `}</style>

    {/* Background layers */}
    <OrbField />
    <ParticleField />

    <main style={{ position: "relative", zIndex: 10, minHeight: "100vh", padding: "clamp(5rem, 12vh, 8rem) clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(4rem, 10vh, 7rem)" }}>

        {/* ── Page header ────────────────────────────────────── */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 20 }}>
          

          <h1 className="main-title">
            MEET THE{" "}
            <span className="main-title-accent">SQUAD</span>
          </h1>


          {/* Decorative horizontal rule */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginTop: "2.5rem" }}>
            <div style={{ flex: 1, maxWidth: 180, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,77,0,0.5))" }} />
            <div style={{ width: 6, height: 6, background: "#FF4D00", borderRadius: "50%", boxShadow: "0 0 10px #FF4D00" }} />
            <div style={{ width: 4, height: 4, background: "#00E5FF", borderRadius: "50%", boxShadow: "0 0 8px #00E5FF" }} />
            <div style={{ width: 6, height: 6, background: "#FF4D00", borderRadius: "50%", boxShadow: "0 0 10px #FF4D00" }} />
            <div style={{ flex: 1, maxWidth: 180, height: 1, background: "linear-gradient(-90deg, transparent, rgba(255,77,0,0.5))" }} />
          </div>
        </div>

        {/* ── Categories ─────────────────────────────────────── */}
        {teamData.map((category, catIdx) => (
          <div key={category.name} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <SectionHeading index={catIdx}>{category.name}</SectionHeading>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "clamp(1rem, 2.5vw, 1.8rem)",
              width: "100%",
              perspective: "1400px",
            }}>
              {category.members.map((member, i) => (
                <MemberCard key={i} member={member} index={i} category={category.name}/>
              ))}
            </div>
          </div>
        ))}

        {/* ── Footer row ─────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            textTransform: "uppercase"
          }}>
            &lt;/&gt; AAKAR_2026 // TEAM_DATA_LOADED // {teamData.reduce((a, c) => a + c.members.length, 0)}_MEMBERS_ACTIVE
          </p>
        </div>

      </div>
    </main>
  </>
);

export default Team;