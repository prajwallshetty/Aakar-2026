"use client";

import React, { useRef, useEffect, useState } from "react";
import CharacterDecoration from "@/components/(User)/Common/CharacterDecoration";

const faqs = [
  { question: "What is Aakar?", answer: "Aakar is a state-level techno-cultural fest that celebrates innovation, creativity, and talent through a wide array of technical quests, cultural showcases, workshops, and boss battles." },
  { question: "Who can join the saga?", answer: "Aakar is open to students from all colleges and disciplines across the state and beyond. Whether you're into coding, design, dance, music, or art—there's a quest for everyone!" },
  { question: "Is there any registration fee?", answer: "Yes, all events at Aakar have a registration fee. Detailed pricing and event-specific fees can be found on the event page." },
  { question: "Can I take on multiple quests?", answer: "Absolutely! You can register for multiple quests, provided there's no clash in timings between them." },
  { question: "Will I earn a reward for participating?", answer: "Yes, all registered participants will receive digital certificates of participation. Winners will level up with special trophies and exciting loot!" },
  { question: "What happens if I miss my quest?", answer: "Missing a registered quest may lead to disqualification from that particular event. We recommend checking the schedule thoroughly and arriving on time." },
  { question: "Will there be food and accommodation for participants?", answer: "Yes. Food stalls and arrangements will be available at the venue. For outstation participants, accommodation can be arranged on prior request—please contact the coordinators for details." },
  { question: "Can I bring my own laptop or project materials?", answer: "Yes, participants are encouraged to bring their own laptops, tools, or materials as per event requirements. Ensure you comply with the guidelines provided for each event." },
  { question: "How will I be notified about updates?", answer: "Participants will receive updates via email, WhatsApp, and SMS. You can also stay informed by following our official Instagram page: @aakar__2026." },
  { question: "Who should I contact for support?", answer: "For any queries or assistance, please contact us at: Email: aakarofficial2026@gmail.com | Phone: +91 9741152696" },
];

/* ─── Particle field ────────────────────────────────────────── */
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

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

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
        @keyframes expandDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .orb-container {
          position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden;
        }
        .orb {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12;
        }
        .orb-1 {
          width: 500px; height: 500px; top: -100px; left: -100px;
          background: radial-gradient(circle, #FF4D00, transparent 70%);
          animation: orbFloat 12s ease-in-out infinite;
        }
        .orb-2 {
          width: 450px; height: 450px; bottom: -50px; right: -50px;
          background: radial-gradient(circle, #00E5FF, transparent 70%);
          animation: orbFloat2 15s ease-in-out infinite 2s;
        }
        .orb-3 {
          width: 350px; height: 3500px; top: 20%; right: 10%;
          background: radial-gradient(circle, #B026FF, transparent 70%);
          animation: orbFloat 18s ease-in-out infinite 4s;
        }

        .main-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          line-height: 0.9;
          letter-spacing: 0.05em;
          color: #fff;
          text-shadow: 0 0 30px rgba(0,229,255,0.45), -2px -2px 0 #00E5FF, 2px 2px 0 #FF4D00;
          transform: skewX(-6deg);
          margin: 0;
          animation: titleReveal 1s cubic-bezier(0.2,0.8,0.2,1) 0.1s both;
        }
        .main-title-accent {
          color: #ffffff;
          -webkit-text-stroke: 0;
          text-shadow: 0 0 35px rgba(255,255,255,0.4);
        }

        .faq-card {
          background: rgba(8, 10, 18, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          animation: fadeSlideUp 0.65s cubic-bezier(0.2,0.8,0.2,1) both;
        }
        .faq-card:hover {
          border-color: #00E5FF;
          box-shadow: 0 0 25px rgba(0, 229, 255, 0.15);
        }
        .faq-card.open {
          border-color: #FF4D00;
          background: rgba(8, 10, 18, 0.9);
        }

        .bracket {
          position: absolute; width: 12px; height: 12px; z-index: 20;
          transition: all 0.3s ease;
          opacity: 0.5;
        }
        .bracket.tl { top: 10px; left: 10px; border-top: 2px solid var(--accent, #00E5FF); border-left: 2px solid var(--accent, #00E5FF); border-radius: 3px 0 0 0; }
        .bracket.tr { top: 10px; right: 10px; border-top: 2px solid var(--accent, #00E5FF); border-right: 2px solid var(--accent, #00E5FF); border-radius: 0 3px 0 0; }
        .bracket.bl { bottom: 10px; left: 10px; border-bottom: 2px solid var(--accent, #00E5FF); border-left: 2px solid var(--accent, #00E5FF); border-radius: 0 0 0 3px; }
        .bracket.br { bottom: 10px; right: 10px; border-bottom: 2px solid var(--accent, #00E5FF); border-right: 2px solid var(--accent, #00E5FF); border-radius: 0 0 3px 0; }
        .faq-card:hover .bracket { opacity: 1; width: 16px; height: 16px; }

        .faq-answer-anim {
          animation: expandDown 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .toggle-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          transition: all 0.3s ease;
          font-weight: 300;
          font-size: 1.2rem;
          background: rgba(255,255,255,0.05);
        }
        .open .toggle-icon {
          background: #FF4D00;
          border-color: #FF4D00;
          color: #000;
          transform: rotate(180deg);
        }
      `}</style>

      <OrbField />
      <ParticleField />

      <main style={{ position: "relative", zIndex: 10, minHeight: "100vh", background: "transparent" }}>
        <CharacterDecoration 
          image="/character1.png" 
          position={{ bottom: "0%", right: "-5%" }}
          mobilePosition={{ bottom: "5%", right: "-8%" }}
          opacity={0.14}
          mobileOpacity={0.08}
          size="clamp(400px, 45vw, 650px)"
          mobileSize="220px"
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
              QUEST <span className="main-title-accent">INTEL (FAQ)</span>
            </h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginTop: "2.5rem" }}>
              <div style={{ flex: 1, maxWidth: 150, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.5))" }} />
              <div style={{ width: 6, height: 6, background: "#00E5FF", borderRadius: "50%", boxShadow: "0 0 10px #00E5FF" }} />
              <div style={{ width: 4, height: 4, background: "#FF4D00", borderRadius: "50%", boxShadow: "0 0 8px #FF4D00" }} />
              <div style={{ width: 6, height: 6, background: "#00E5FF", borderRadius: "50%", boxShadow: "0 0 10px #00E5FF" }} />
              <div style={{ flex: 1, maxWidth: 150, height: 1, background: "linear-gradient(-90deg, transparent, rgba(0,229,255,0.5))" }} />
            </div>
          </div>

          {/* ── Accordion ─────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={`faq-card ${isOpen ? "open" : ""}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ 
                    animationDelay: `${i * 0.05}s`,
                    "--accent": isOpen ? "#FF4D00" : "#00E5FF",
                  } as any}
                >
                  <div className="bracket tl" />
                  <div className="bracket tr" />
                  <div className="bracket bl" />
                  <div className="bracket br" />

                  <div style={{
                    padding: "clamp(1.2rem, 3vw, 1.8rem) clamp(1.5rem, 4vw, 2.5rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px"
                  }}>
                    <span style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                      letterSpacing: "0.05em",
                      color: isOpen ? "#FF4D00" : "#fff",
                      transition: "color 0.3s",
                      lineHeight: 1.4,
                      flex: 1
                    }}>
                      {faq.question}
                    </span>
                    <div className="toggle-icon">
                      {isOpen ? "−" : "+"}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="faq-answer-anim" style={{
                      padding: "0 clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 2.5rem)",
                      marginTop: "-8px"
                    }}>
                      <div style={{ 
                        height: "1px", 
                        background: "linear-gradient(90deg, #FF4D00 0%, transparent 80%)" ,
                        marginBottom: "1.5rem",
                        opacity: 0.3
                      }} />
                      <p style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.85)",
                        margin: 0
                      }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
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
              &lt;/&gt; AAKAR_2026 // KNOWLEDGE_BASE_SYNCED // v2.0
            </p>
          </div>
        </div>
      </main>
    </>
  );
}