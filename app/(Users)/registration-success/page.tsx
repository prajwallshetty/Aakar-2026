"use client";

import { useEffect, useState } from "react";
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

// ─── Anime Design tokens ────────────────────────────────────────────────────────────
const C = {
    yellow: ANIME_COLORS.accent,
    magenta: ANIME_COLORS.primary,
    cyan: ANIME_COLORS.secondary,
    pink: ANIME_COLORS.purple,
    black: ANIME_COLORS.background,
    white: ANIME_COLORS.text,
};
const popFont = "'Bebas Neue', Impact, sans-serif";
const monoFont = "'Share Tech Mono', monospace";
const displayFont = "'Bebas Neue', Impact, sans-serif";

// ─── Confetti pieces (static positions, CSS animates them) ────────────────────
const CONFETTI = [
    { left: "8%", color: C.magenta, delay: "0s", size: 14, rotate: 20 },
    { left: "15%", color: C.cyan, delay: "0.3s", size: 10, rotate: -30 },
    { left: "22%", color: C.pink, delay: "0.1s", size: 16, rotate: 45 },
    { left: "30%", color: C.yellow, delay: "0.5s", size: 12, rotate: -15 },
    { left: "38%", color: C.magenta, delay: "0.2s", size: 18, rotate: 60 },
    { left: "48%", color: C.cyan, delay: "0.4s", size: 10, rotate: -45 },
    { left: "55%", color: C.pink, delay: "0s", size: 14, rotate: 30 },
    { left: "63%", color: C.yellow, delay: "0.6s", size: 12, rotate: -20 },
    { left: "70%", color: C.magenta, delay: "0.15s", size: 16, rotate: 10 },
    { left: "78%", color: C.cyan, delay: "0.35s", size: 10, rotate: -60 },
    { left: "85%", color: C.pink, delay: "0.25s", size: 18, rotate: 40 },
    { left: "92%", color: C.yellow, delay: "0.45s", size: 12, rotate: -35 },
];

// ─── Float animations handled by the unified PopArtBackground ─────────

export default function RegistrationSuccess() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // small delay so the pop-in animation fires after paint
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 16px 80px",
        }}>
            <style>{`
                ${ANIME_GLOBAL_STYLES}
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }

                /* ── confetti drop ── */
                @keyframes confettiFall {
                    0%   { transform: translateY(-40px) rotate(0deg);   opacity: 1; }
                    80%  { opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .confetti-piece {
                    position: fixed; top: -20px; z-index: 50;
                    animation: confettiFall 3.2s ease-in forwards;
                }

                /* ── card pop-in ── */
                @keyframes popInBig {
                    0%   { transform: scale(0) rotate(-8deg); opacity: 0; }
                    65%  { transform: scale(1.06) rotate(2deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0); opacity: 1; }
                }
                .card-popin {
                    animation: popInBig 0.8s cubic-bezier(.175,.885,.32,1.275) both;
                }

                /* ── stamp ── */
                @keyframes stampIn {
                    0%   { transform: scale(3) rotate(-25deg); opacity: 0; }
                    60%  { transform: scale(0.92) rotate(3deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0); opacity: 1; }
                }
                .stamp { animation: stampIn 0.7s cubic-bezier(.175,.885,.32,1.275) 0.5s both; }

                /* ── wiggle ── */
                @keyframes wiggle {
                    from { transform: rotate(-3deg) scale(1); }
                    to   { transform: rotate(3deg) scale(1.05); }
                }
                .wiggle { animation: wiggle 1.8s ease-in-out infinite alternate; }

                /* ── bounce ── */
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-8px); }
                }
                .bounce { animation: bounce 1.2s ease-in-out infinite; }

                /* ── button pop ── */
                .btn-pop {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .btn-pop:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 20px ${ANIME_COLORS.primary}60;
                }
            `}</style>

            {/* ── Background ────────────────────────────────────────────── */}
            <AnimeOrbField />
            <AnimeParticleField />

            {/* ── Confetti (only after mount to avoid hydration diff) ────── */}
            {mounted && CONFETTI.map((c, i) => (
                <div key={i} className="confetti-piece"
                    style={{
                        left: c.left,
                        width: c.size, height: c.size,
                        background: `${c.color}80`,
                        border: `1px solid ${c.color}`,
                        boxShadow: `0 0 12px ${c.color}40`,
                        transform: `rotate(${c.rotate}deg)`,
                        animationDelay: c.delay,
                        borderRadius: i % 3 === 0 ? "50%" : 6,
                        backdropFilter: "blur(4px)"
                    }}
                />
            ))}

            {/* ── Main card ─────────────────────────────────────────────── */}
            <AnimeCardWrapper accentIndex={0} className="card-popin" style={{
                position: "relative", zIndex: 10,
                maxWidth: 560,
                width: "100%",
                overflow: "hidden",
            }}>

                {/* Top colour bar */}
                <div style={{
                    background: `${ANIME_COLORS.primary}80`,
                    borderBottom: `1px solid ${ANIME_COLORS.primary}`,
                    padding: "6px 0",
                    display: "flex",
                    overflow: "hidden",
                    backdropFilter: "blur(4px)"
                }}>
                    <div style={{
                        whiteSpace: "nowrap",
                        fontFamily: popFont,
                        fontSize: 10, fontWeight: 900, letterSpacing: 5, color: ANIME_COLORS.text,
                        animation: "marquee 10s linear infinite",
                    }}>
                        {Array(12).fill("★ REGISTRATION SUCCESS ★ AAKAR 2026 ★ AJIET ★ ").join("")}
                    </div>
                    <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
                </div>

                {/* Body */}
                <div style={{ padding: "36px 32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

                    {/* REGISTERED stamp */}
                    <div className="stamp" style={{
                        background: `${ANIME_COLORS.secondary}80`,
                        border: `1px solid ${ANIME_COLORS.secondary}`,
                        boxShadow: `0 0 12px ${ANIME_COLORS.secondary}40`,
                        padding: "10px 28px",
                        display: "inline-flex", alignItems: "center", gap: 10,
                        borderRadius: 6,
                        backdropFilter: "blur(4px)"
                    }}>
                        <span style={{
                            fontFamily: popFont, fontSize: 18, fontWeight: 900,
                            letterSpacing: 4, color: ANIME_COLORS.text, textTransform: "uppercase",
                        }}>
                            YOU'RE IN!
                        </span>
                    </div>

                    {/* Big heading */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            fontFamily: displayFont,
                            fontSize: "clamp(42px, 8vw, 80px)",
                            letterSpacing: 6, lineHeight: 0.9,
                            color: ANIME_COLORS.text,
                        }}>
                            <AnimeGlitchText text="REGISTRATION">
                                REGISTRATION
                            </AnimeGlitchText>
                        </div>
                        <div style={{
                            fontFamily: displayFont,
                            fontSize: "clamp(42px, 8vw, 80px)",
                            letterSpacing: 6, lineHeight: 0.9,
                            color: ANIME_COLORS.primary,
                            textShadow: `0 0 30px ${ANIME_COLORS.primary}45, -3px -3px 0 ${ANIME_COLORS.secondary}, 3px 3px 0 ${ANIME_COLORS.accent}`,
                        }}>
                            <AnimeGlitchText text="CONFIRMED!">
                                CONFIRMED!
                            </AnimeGlitchText>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                        width: "100%", height: 4,
                        background: `linear-gradient(90deg, ${ANIME_COLORS.primary} 0%, ${ANIME_COLORS.secondary} 50%, ${ANIME_COLORS.accent} 100%)`,
                        borderRadius: 2,
                    }} />

                    {/* Message */}
                    <div style={{
                        background: `${ANIME_COLORS.accent}40`,
                        border: `1px solid ${ANIME_COLORS.accent}`,
                        boxShadow: `0 0 12px ${ANIME_COLORS.accent}40`,
                        padding: "16px 20px",
                        width: "100%",
                        borderRadius: 6,
                        backdropFilter: "blur(4px)"
                    }}>
                        <p style={{
                            fontFamily: monoFont, fontSize: 13, fontWeight: 700,
                            color: ANIME_COLORS.text, lineHeight: 1.7, margin: 0,
                            textAlign: "center",
                        }}>
                            Your spot at <strong>AAKAR 2026</strong> is locked in!<br />
                            Check your email for a confirmation ticket.<br />
                            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>
                                MAY 21–22, 2026 · AJIET, MANGALORE
                            </span>
                        </p>
                    </div>

                    {/* What's next pills */}
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { text: "Confirmation email sent to your inbox", color: ANIME_COLORS.secondary },
                            { text: "Show your ticket at the venue on event day", color: ANIME_COLORS.purple },
                            { text: "Follow us on Instagram for updates", color: ANIME_COLORS.primary },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                background: `${item.color}40`,
                                border: `1px solid ${item.color}`,
                                boxShadow: `0 0 12px ${item.color}40`,
                                padding: "10px 14px",
                                borderRadius: 6,
                                backdropFilter: "blur(4px)"
                            }}>
                                <span style={{
                                    fontFamily: monoFont, fontSize: 11, fontWeight: 700,
                                    letterSpacing: 1, color: ANIME_COLORS.text, textTransform: "uppercase",
                                }}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div style={{
                        display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
                        marginTop: 8, width: "100%",
                    }}>
                        <Link href="/" className="btn-pop" style={{
                            display: "inline-block",
                            background: `${ANIME_COLORS.background}40`,
                            color: ANIME_COLORS.accent,
                            border: `1px solid ${ANIME_COLORS.accent}`,
                            boxShadow: `0 0 8px ${ANIME_COLORS.accent}40`,
                            padding: "12px 24px",
                            fontFamily: popFont, fontSize: 12, fontWeight: 900,
                            letterSpacing: 3, textTransform: "uppercase",
                            textDecoration: "none",
                            borderRadius: 6,
                            backdropFilter: "blur(4px)"
                        }}>
                            BACK TO HOME
                        </Link>

                        <Link href="/events" className="btn-pop" style={{
                            display: "inline-block",
                            background: `${ANIME_COLORS.purple}40`,
                            color: ANIME_COLORS.text,
                            border: `1px solid ${ANIME_COLORS.purple}`,
                            boxShadow: `0 0 8px ${ANIME_COLORS.purple}40`,
                            padding: "12px 24px",
                            fontFamily: popFont, fontSize: 12, fontWeight: 900,
                            letterSpacing: 3, textTransform: "uppercase",
                            textDecoration: "none",
                            borderRadius: 6,
                            backdropFilter: "blur(4px)"
                        }}>
                            EXPLORE EVENTS
                        </Link>
                    </div>
                </div>

                {/* Bottom ticket stub */}
                <div style={{
                    background: `${ANIME_COLORS.background}80`,
                    borderTop: `1px dashed ${ANIME_COLORS.primary}`,
                    padding: "12px 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    flexWrap: "wrap", gap: 8,
                    backdropFilter: "blur(4px)"
                }}>
                    <div>
                        <div style={{
                            fontFamily: monoFont, fontSize: 9, fontWeight: 700,
                            letterSpacing: 4, color: ANIME_COLORS.subtext, textTransform: "uppercase",
                            marginBottom: 2,
                        }}>
                            EVENT
                        </div>
                        <div style={{
                            fontFamily: popFont, fontSize: 14, fontWeight: 900,
                            letterSpacing: 3, color: ANIME_COLORS.accent,
                        }}>
                            AAKAR 2026
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{
                            fontFamily: monoFont, fontSize: 9, fontWeight: 700,
                            letterSpacing: 4, color: ANIME_COLORS.subtext, textTransform: "uppercase",
                            marginBottom: 2,
                        }}>
                            STATUS
                        </div>
                        <div className="wiggle" style={{
                            display: "inline-block",
                            background: `${ANIME_COLORS.secondary}80`,
                            border: `1px solid ${ANIME_COLORS.secondary}`,
                            padding: "3px 12px",
                            fontFamily: popFont, fontSize: 11, fontWeight: 900,
                            letterSpacing: 3, color: ANIME_COLORS.text,
                            borderRadius: 4,
                            boxShadow: `0 0 8px ${ANIME_COLORS.secondary}40`,
                            backdropFilter: "blur(4px)"
                        }}>
                            CONFIRMED
                        </div>
                    </div>
                </div>
            </AnimeCardWrapper>
        </div>
    );
}
