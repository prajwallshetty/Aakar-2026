"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle2, Ticket, Home, ArrowRight, Instagram, Mail, CalendarDays } from "lucide-react";
import { cinzelFont } from "@/lib/font";
import {
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const monoFont = "'Share Tech Mono', monospace";

// ─── Variants ──────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const checkmarkVariants: Variants = {
  hidden: { scale: 0, rotate: -20, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

/* ─── Info Chip Component ───────────────────────────────────────── */
function InfoChip({ icon: Icon, text, color }: { icon: any; text: string; color: string }) {
  return (
    <motion.div
      variants={itemVariants}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: `${color}15`,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 15px ${color}15`,
        padding: "12px 20px",
        borderRadius: "12px",
        fontFamily: monoFont,
        fontSize: "0.85rem",
        color: "#fff",
        letterSpacing: "0.05em",
      }}
    >
      <div style={{ color: color }}>
        <Icon size={18} />
      </div>
      <span>{text}</span>
    </motion.div>
  );
}

export default function RegistrationSuccess() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main style={{
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      paddingTop: "120px",
      paddingBottom: "80px",
      background: "#080a12", // Original background
    }}>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
        
        @keyframes scanMove { from { background-position: 0 0; } to { background-position: 0 100%; } }
        
        .scan-line {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px);
          animation: scanMove 12s linear infinite; z-index: 5;
        }

        .rs-glitch-text {
          position: relative;
          color: #fff;
          text-shadow: 0 0 20px ${ANIME_COLORS.primary}80;
        }

        /* ── Action Button ── */
        .rs-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 8px;
          font-family: ${monoFont};
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          text-decoration: none;
        }

        .rs-btn-primary {
          background: ${ANIME_COLORS.primary};
          color: #000;
          box-shadow: 0 0 20px ${ANIME_COLORS.primary}40;
        }
        .rs-btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 30px ${ANIME_COLORS.primary}60;
        }

        .rs-btn-ghost {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
        }
        .rs-btn-ghost:hover {
          background: rgba(255,255,255,0.05);
          border-color: ${ANIME_COLORS.secondary};
          color: #fff;
          box-shadow: 0 0 20px ${ANIME_COLORS.secondary}30;
        }

        /* ── Pass Decoration ── */
        .pass-bracket {
          position: absolute; width: 12px; height: 12px;
          opacity: 0.5;
        }
        .pass-bracket.tl { top: 12px; left: 12px; border-top: 2px solid var(--accent); border-left: 2px solid var(--accent); }
        .pass-bracket.tr { top: 12px; right: 12px; border-top: 2px solid var(--accent); border-right: 2px solid var(--accent); }
        .pass-bracket.bl { bottom: 12px; left: 12px; border-bottom: 2px solid var(--accent); border-left: 2px solid var(--accent); }
        .pass-bracket.br { bottom: 12px; right: 12px; border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent); }

      `}</style>

      <div className="scan-line" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ── HERO SECTION ── */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <motion.div variants={checkmarkVariants}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: `${ANIME_COLORS.primary}20`,
              border: `2px solid ${ANIME_COLORS.primary}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 30px ${ANIME_COLORS.primary}40, inset 0 0 15px ${ANIME_COLORS.primary}20`,
              color: ANIME_COLORS.primary,
            }}>
              <CheckCircle2 size={42} strokeWidth={2} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className={cinzelFont.className} style={{
              fontSize: "1.2rem",
              letterSpacing: "0.3em",
              color: ANIME_COLORS.secondary,
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Target Secured
            </h2>
            <h1 className={`${cinzelFont.className} rs-glitch-text`} style={{
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "0.05em",
              lineHeight: 1,
              textTransform: "uppercase",
            }}>
              Registration <br /> Complete!
            </h1>
          </motion.div>
        </div>

        {/* ── INTERACTIVE PASS ── */}
        <motion.div variants={itemVariants} style={{ width: "100%" }}>
          <div style={{ 
            padding: "0", 
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
          }}>
            <div className="pass-bracket tl" style={{ "--accent": ANIME_COLORS.secondary } as any} />
            <div className="pass-bracket tr" style={{ "--accent": ANIME_COLORS.secondary } as any} />
            <div className="pass-bracket bl" style={{ "--accent": ANIME_COLORS.secondary } as any} />
            <div className="pass-bracket br" style={{ "--accent": ANIME_COLORS.secondary } as any} />

            <div style={{
              padding: "32px 32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}>
              {/* Pass Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{
                    fontFamily: monoFont,
                    fontSize: "0.65rem",
                    letterSpacing: "0.4em",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}>Access Code</p>
                  <p style={{
                    fontFamily: monoFont,
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: ANIME_COLORS.accent,
                    letterSpacing: "0.1em",
                  }}>#AAKAR-2026-XQ</p>
                </div>
                <div style={{
                  padding: "6px 14px",
                  borderRadius: "4px",
                  background: `${ANIME_COLORS.secondary}20`,
                  border: `1px solid ${ANIME_COLORS.secondary}`,
                  color: ANIME_COLORS.secondary,
                  fontFamily: monoFont,
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}>
                  Confirmed
                </div>
              </div>

              {/* Pass Body */}
              <div>
                <p style={{
                  fontFamily: cinzelFont.style.fontFamily,
                  fontSize: "0.9rem",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>Event Entry Pass</p>
                <div style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  borderLeft: `3px solid ${ANIME_COLORS.primary}`,
                  borderRadius: "4px",
                }}>
                  <p style={{
                    fontFamily: cinzelFont.style.fontFamily,
                    fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}>
                    Aakar 2026 Festival
                  </p>
                  <p style={{
                    fontFamily: monoFont,
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: "4px",
                    letterSpacing: "0.1em",
                  }}>
                    April 24 – 25, 2026 • AJIET, Mangaluru
                  </p>
                </div>
              </div>

              {/* Pass Footer */}
              <div style={{
                marginTop: "12px",
                paddingTop: "24px",
                borderTop: "1px dashed rgba(255,255,255,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div>
                    <p style={{ fontFamily: monoFont, fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Type</p>
                    <p style={{ fontFamily: monoFont, fontSize: "0.8rem", color: "#fff" }}>ALL_ACCESS</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: monoFont, fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Zone</p>
                    <p style={{ fontFamily: monoFont, fontSize: "0.8rem", color: "#fff" }}>MAIN_HUB</p>
                  </div>
                </div>
                <div style={{ opacity: 0.6 }}>
                   <Ticket size={32} strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── NEXT STEPS ── */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <motion.p
            variants={itemVariants}
            style={{
              fontFamily: cinzelFont.style.fontFamily,
              fontSize: "0.85rem",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Encryption Initialized
          </motion.p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <InfoChip icon={Mail} text="Quest pass sent to your visual interface (Email)" color={ANIME_COLORS.secondary} />
            <InfoChip icon={Home} text="Present this digital signature at the gate" color={ANIME_COLORS.purple} />
            <InfoChip icon={Instagram} text="Follow the official broadcast for updates" color={ANIME_COLORS.primary} />
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Link href="/events/technical" className="rs-action-btn rs-btn-primary">
            Browse Quests <ArrowRight size={18} />
          </Link>
          <Link href="/" className="rs-action-btn rs-btn-ghost">
            Return to Base
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
