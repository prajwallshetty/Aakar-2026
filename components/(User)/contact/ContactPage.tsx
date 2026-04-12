"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import CharacterDecoration from "@/components/(User)/Common/CharacterDecoration";
import { ANIME_COLORS } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

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
    const animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
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

export default function ContactPage() {
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
          width: 550px; height: 550px; top: -150px; right: -150px;
          background: radial-gradient(circle, #FF4D00, transparent 70%);
          animation: orbFloat 14s ease-in-out infinite;
        }
        .orb-2 {
          width: 450px; height: 450px; top: 30%; left: -100px;
          background: radial-gradient(circle, #00E5FF, transparent 70%);
          animation: orbFloat2 12s ease-in-out infinite 2s;
        }
        .orb-3 {
          width: 400px; height: 400px; bottom: 5%; right: 20%;
          background: radial-gradient(circle, #B026FF, transparent 70%);
          animation: orbFloat 18s ease-in-out infinite 4s;
        }

        .main-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          line-height: 0.9;
          letter-spacing: 0.05em;
          color: #fff;
          text-shadow: 0 0 30px rgba(255,120,0,0.45), -2px -2px 0 #FF4D00, 2px 2px 0 #00E5FF;
          transform: skewX(-6deg);
          margin: 0;
          animation: titleReveal 1s cubic-bezier(0.2,0.8,0.2,1) 0.1s both;
        }
        .main-title-accent {
          color: #ffffff;
          -webkit-text-stroke: 0;
          text-shadow: 0 0 35px rgba(255,255,255,0.4);
        }

        .contact-card {
          background: rgba(8, 10, 18, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: clamp(1.5rem, 4vw, 2.5rem);
          position: relative;
          animation: fadeSlideUp 0.65s cubic-bezier(0.2,0.8,0.2,1) both;
          transition: all 0.3s ease;
        }
        .contact-card:hover {
          border-color: #FF4D00;
          box-shadow: 0 0 30px rgba(255, 77, 0, 0.15);
        }

        .bracket {
          position: absolute; width: 14px; height: 14px; z-index: 20;
          transition: all 0.3s ease;
          opacity: 0.5;
        }
        .bracket.tl { top: 12px; left: 12px; border-top: 2px solid #FF4D00; border-left: 2px solid #FF4D00; border-radius: 4px 0 0 0; }
        .bracket.tr { top: 12px; right: 12px; border-top: 2px solid #FF4D00; border-right: 2px solid #FF4D00; border-radius: 0 4px 0 0; }
        .bracket.bl { bottom: 12px; left: 12px; border-bottom: 2px solid #FF4D00; border-left: 2px solid #FF4D00; border-radius: 0 0 0 4px; }
        .bracket.br { bottom: 12px; right: 12px; border-bottom: 2px solid #FF4D00; border-right: 2px solid #FF4D00; border-radius: 0 0 4px 0; }
        .contact-card:hover .bracket { opacity: 1; width: 20px; height: 20px; }

        .contact-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .contact-link:hover {
          color: #FF4D00;
          text-shadow: 0 0 10px rgba(255,77,0,0.5);
          transform: translateX(4px);
        }

        .map-container {
          width: 100%;
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          margin-top: 1.5rem;
          position: relative;
        }
        .map-container::after {
          content: "";
          position: absolute; inset: 0;
          pointer-events: none;
          border: 1px solid rgba(255,77,0,0.3);
          border-radius: 12px;
          mix-blend-mode: overlay;
        }
      `}</style>

      <OrbField />
      <ParticleField />

      <main style={{ position: "relative", zIndex: 10, minHeight: "100vh", background: "transparent" }}>
        <CharacterDecoration 
          image="/character4.png" 
          position={{ bottom: "0%", left: "-8%" }}
          mobilePosition={{ bottom: "5%", left: "-12%" }}
          opacity={0.15}
          mobileOpacity={0.08}
          size="clamp(400px, 45vw, 650px)"
          mobileSize="240px"
        />

        <div style={{ 
          maxWidth: 960, 
          margin: "0 auto", 
          padding: "clamp(5rem, 12vh, 8rem) clamp(1.5rem, 5vw, 3rem) clamp(3rem, 8vh, 5rem)" ,
          display: "flex",
          flexDirection: "column",
          gap: "clamp(3rem, 7vh, 5rem)"
        }}>
          
          {/* ── Header ────────────────────────────────────────── */}
          <div style={{ textAlign: "center", position: "relative" }}>
            <h1 className="main-title">
              ESTABLISH <span className="main-title-accent">CONTACT</span>
            </h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginTop: "2.5rem" }}>
              <div style={{ flex: 1, maxWidth: 150, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,77,0,0.5))" }} />
              <div style={{ width: 6, height: 6, background: "#FF4D00", borderRadius: "50%", boxShadow: "0 0 10px #FF4D00" }} />
              <div style={{ width: 4, height: 4, background: "#00E5FF", borderRadius: "50%", boxShadow: "0 0 8px #00E5FF" }} />
              <div style={{ width: 6, height: 6, background: "#FF4D00", borderRadius: "50%", boxShadow: "0 0 10px #FF4D00" }} />
              <div style={{ flex: 1, maxWidth: 150, height: 1, background: "linear-gradient(-90deg, transparent, rgba(255,77,0,0.5))" }} />
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {/* ── Contact Info Card ────────────────────────── */}
            <div className="contact-card" style={{ animationDelay: "0.1s" }}>
              <div className="bracket tl" />
              <div className="bracket tr" />
              <div className="bracket bl" />
              <div className="bracket br" />

              <h2 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.4rem",
                color: "#fff",
                letterSpacing: "0.1em",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{ width: "8px", height: "8px", background: "#FF4D00", borderRadius: "50%" }} />
                COMM_LINKS
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {[
                  { icon: <FaEnvelope size={18} />, label: "EMAIL", href: "mailto:aakarofficial2026@gmail.com", text: "aakarofficial2026@gmail.com", color: "#FF4D00" },
                  { icon: <FaPhone size={18} />, label: "PHONE", href: "tel:+919741152696", text: "+91 97411 52696", color: "#00E5FF" },
                  { icon: <FaInstagram size={18} />, label: "INSTAGRAM", href: "https://www.instagram.com/aakar__2026/", text: "@aakar_26", color: "#FFD700" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <div style={{
                      width: "42px", height: "42px", flexShrink: 0,
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: item.color,
                      boxShadow: `inset 0 0 10px ${item.color}20`
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                        color: "rgba(255, 255, 255, 0.4)",
                        marginBottom: "4px"
                      }}>
                        {item.label}
                      </div>
                      <Link href={item.href} className="contact-link" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {item.text}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Location Card ────────────────────────────── */}
            <div className="contact-card" style={{ animationDelay: "0.2s" }}>
              <div className="bracket tl" />
              <div className="bracket tr" />
              <div className="bracket bl" />
              <div className="bracket br" />

              <h2 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.4rem",
                color: "#fff",
                letterSpacing: "0.1em",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{ width: "8px", height: "8px", background: "#00E5FF", borderRadius: "50%" }} />
                SECTOR_LOC
              </h2>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{
                   width: "42px", height: "42px", flexShrink: 0,
                   background: "rgba(255, 255, 255, 0.05)",
                   border: "1px solid rgba(255,255,255,0.1)",
                   borderRadius: "10px",
                   display: "flex", alignItems: "center", justifyContent: "center",
                   color: "#FF4D00"
                }}>
                  <FaMapMarkerAlt size={18} />
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1.1rem",
                    color: "#fff",
                    margin: "0 0 8px 0",
                    lineHeight: 1.4
                  }}>
                    AJ Institute of Engineering<br />and Technology
                  </p>
                  <p style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    margin: 0,
                    lineHeight: 1.6
                  }}>
                    NH66, Kottara Chowki<br />Mangaluru, Karnataka — 575006
                  </p>
                </div>
              </div>

              <div className="map-container">
                 <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.963363458579!2d74.82941331519004!3d12.91579839089306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35b1e29f2d89b%3A0x2d662ae00671be23!2sAJ%20Institute%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1700000000000"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AJIET Location"
                />
              </div>
            </div>
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
              &lt;/&gt; AAKAR_2026 // COMM_CHANNEL_ESTABLISHED // v2.0
            </p>
          </div>
        </div>
      </main>
    </>
  );
}