"use client";

import React, { useRef, useEffect } from "react";
import CharacterDecoration from "@/components/(User)/Common/CharacterDecoration";

const termsSections = [
  { title: "", content: "Welcome to Aakar! These terms and conditions outline the rules and regulations for the use of our website and participation in the fest." },
  { title: "Acceptance of Terms", content: "By accessing this website and registering for events, you agree to be bound by these terms and all applicable laws and regulations." },
  { title: "Event Participation", content: "Participants must provide accurate information while registering. The organizing team reserves the right to disqualify entries for misrepresentation or inappropriate behavior." },
  { title: "Intellectual Property", content: "All content, including logos, graphics, and event names, are the intellectual property of Aakar and may not be reproduced without permission." },
  { title: "Changes to Events", content: "The organizers reserve the right to modify or cancel events without prior notice due to unforeseen circumstances." },
  { title: "Code of Conduct", content: "All attendees are expected to maintain respectful behavior throughout the fest. Harassment or misconduct of any form will not be tolerated." },
  { title: "Liability", content: "Aakar is not responsible for any loss, damage, or injury incurred during the event, whether on campus or online." },
];

/* ─── Particle field (from Team.tsx for consistency) ──────────────── */
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

/* ─── Orbiting accent orbs ───────────────────────────────────── */
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

export default function TermsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap');

        @keyframes titleReveal {
          from { opacity:0; transform: skewX(-6deg) translateY(30px); }
          to   { opacity:1; transform: skewX(-6deg) translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%     { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translateX(0) scale(1); }
          50%     { transform: translateX(25px) scale(0.95); }
        }

        .orb-container {
          position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden;
        }
        .orb {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12;
        }
        .orb-1 {
          width: 550px; height: 550px; top: -100px; right: -100px;
          background: radial-gradient(circle, #FF4D00, transparent 70%);
          animation: orbFloat 14s ease-in-out infinite;
        }
        .orb-2 {
          width: 450px; height: 450px; top: 40%; left: -80px;
          background: radial-gradient(circle, #00E5FF, transparent 70%);
          animation: orbFloat2 12s ease-in-out infinite 1s;
        }
        .orb-3 {
          width: 380px; height: 380px; bottom: 5%; right: 15%;
          background: radial-gradient(circle, #B026FF, transparent 70%);
          animation: orbFloat 16s ease-in-out infinite 3s;
        }
        .orb-4 {
          width: 300px; height: 300px; bottom: 25%; left: 20%;
          background: radial-gradient(circle, #FFD700, transparent 70%);
          animation: orbFloat2 10s ease-in-out infinite 2s;
        }

        .main-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          line-height: 0.9;
          letter-spacing: 0.05em;
          color: #fff;
          text-shadow: 0 0 30px rgba(255,77,0,0.45), -2px -2px 0 #FF4D00, 2px 2px 0 #00E5FF;
          transform: skewX(-6deg);
          margin: 0;
          animation: titleReveal 1s cubic-bezier(0.2,0.8,0.2,1) 0.1s both;
        }
        .main-title-accent {
          color: #ffffff;
          -webkit-text-stroke: 0;
          text-shadow: 0 0 35px rgba(255,255,255,0.4);
        }

        .terms-card {
          background: rgba(8, 10, 18, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 2rem;
          position: relative;
          animation: fadeSlideUp 0.65s cubic-bezier(0.2,0.8,0.2,1) both;
          transition: all 0.3s ease;
        }
        .terms-card:hover {
          border-color: #FF4D00;
          box-shadow: 0 0 30px rgba(255, 77, 0, 0.15);
          transform: translateY(-2px);
        }

        .bracket {
          position: absolute; width: 14px; height: 14px; z-index: 20;
          transition: border-color 0.3s, width 0.3s, height 0.3s;
          opacity: 0.6;
        }
        .bracket.tl { top: 10px; left: 10px; border-top: 2px solid #FF4D00; border-left: 2px solid #FF4D00; border-radius: 3px 0 0 0; }
        .bracket.tr { top: 10px; right: 10px; border-top: 2px solid #FF4D00; border-right: 2px solid #FF4D00; border-radius: 0 3px 0 0; }
        .bracket.bl { bottom: 10px; left: 10px; border-bottom: 2px solid #FF4D00; border-left: 2px solid #FF4D00; border-radius: 0 0 0 3px; }
        .bracket.br { bottom: 10px; right: 10px; border-bottom: 2px solid #FF4D00; border-right: 2px solid #FF4D00; border-radius: 0 0 3px 0; }
        .terms-card:hover .bracket { width: 18px; height: 18px; opacity: 1; }

        .rules-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #FF4D00;
          background: rgba(0,0,0,0.6);
          border: 1px solid #FF4D00;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          display: inline-block;
        }
      `}</style>

      <OrbField />
      <ParticleField />

      <main style={{ position: "relative", zIndex: 10, minHeight: "100vh", background: "transparent" }}>
        <CharacterDecoration 
          image="/character2.png" 
          position={{ bottom: "0%", left: "-5%" }}
          mobilePosition={{ bottom: "5%", left: "-10%" }}
          opacity={0.12}
          mobileOpacity={0.08}
          size="clamp(400px, 45vw, 650px)"
          mobileSize="240px"
        />

        <div style={{ 
          maxWidth: 900, 
          margin: "0 auto", 
          padding: "clamp(5rem, 12vh, 8rem) clamp(1.5rem, 5vw, 3rem) clamp(3rem, 8vh, 5rem)" ,
          display: "flex",
          flexDirection: "column",
          gap: "clamp(3rem, 7vh, 5rem)"
        }}>
          
          {/* ── Header ────────────────────────────────────────── */}
          <div style={{ textAlign: "center", position: "relative" }}>
            <h1 className="main-title">
              TERMS & <span className="main-title-accent">CONDITIONS</span>
            </h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginTop: "2.5rem" }}>
              <div style={{ flex: 1, maxWidth: 150, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,77,0,0.5))" }} />
              <div style={{ width: 6, height: 6, background: "#FF4D00", borderRadius: "50%", boxShadow: "0 0 10px #FF4D00" }} />
              <div style={{ width: 4, height: 4, background: "#00E5FF", borderRadius: "50%", boxShadow: "0 0 8px #00E5FF" }} />
              <div style={{ width: 6, height: 6, background: "#FF4D00", borderRadius: "50%", boxShadow: "0 0 10px #FF4D00" }} />
              <div style={{ flex: 1, maxWidth: 150, height: 1, background: "linear-gradient(-90deg, transparent, rgba(255,77,0,0.5))" }} />
            </div>
          </div>

          {/* ── Content ───────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {termsSections.map((item, i) => (
              <div key={i} className="terms-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="bracket tl" />
                <div className="bracket tr" />
                <div className="bracket bl" />
                <div className="bracket br" />
                
                {i > 0 && <div className="rules-tag">RULE_{String(i).padStart(2, "0")}</div>}
                
                {item.title && (
                  <h2 style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                    color: "#fff",
                    marginBottom: "1rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase"
                  }}>
                    {item.title}
                  </h2>
                )}
                
                <p style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                  lineHeight: 1.7,
                  color: "rgba(255, 255, 255, 0.75)",
                  margin: 0
                }}>
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          {/* ── Footer ────────────────────────────────────────── */}
          <div style={{ textAlign: "center", paddingTop: "2rem" }}>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.2em",
              textTransform: "uppercase"
            }}>
              &lt;/&gt; AAKAR_2026 // PROTOCOL_ESTABLISHED // v2.0
            </p>
          </div>
        </div>
      </main>
    </>
  );
}