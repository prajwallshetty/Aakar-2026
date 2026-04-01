"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PopArtBackground from "@/components/(User)/PopArtBackground";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
    yellow: "#ffff00",
    magenta: "#ff00ff",
    cyan: "#00ffff",
    pink: "#ff0066",
    black: "#000",
    white: "#fff",
};
const popFont = "'Arial Black', Impact, sans-serif";
const monoFont = "'Courier New', 'Space Mono', monospace";
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
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }

                /* ── background ── */
                .sr-bg {
                    position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
                    background: repeating-linear-gradient(45deg,
                        #ffff00 0px, #ffff00 18px, #fff500 18px, #fff500 20px);
                }
                .sr-dots {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(circle, #00000020 1.8px, transparent 1.8px);
                    background-size: 18px 18px;
                }
                .sr-tri-tl { position:absolute; top:0; left:0;  width:180px; height:180px; background:#ff00ff; opacity:.16; clip-path:polygon(0 0,100% 0,0 100%); }
                .sr-tri-tr { position:absolute; top:0; right:0; width:180px; height:180px; background:#00ffff; opacity:.16; clip-path:polygon(0 0,100% 0,100% 100%); }
                .sr-tri-bl { position:absolute; bottom:0; left:0;  width:180px; height:180px; background:#ff0066; opacity:.16; clip-path:polygon(0 0,0 100%,100% 100%); }
                .sr-tri-br { position:absolute; bottom:0; right:0; width:180px; height:180px; background:#ff00ff; opacity:.16; clip-path:polygon(100% 0,100% 100%,0 100%); }

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

                /* ── floaters ── */
                @keyframes floatShape {
                    from { transform: translateY(0) rotate(0deg); }
                    to   { transform: translateY(-16px) rotate(10deg); }
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
                    transition: transform 0.1s, box-shadow 0.1s;
                    cursor: pointer;
                }
                .btn-pop:hover {
                    transform: translate(3px, 3px);
                    box-shadow: 0 0 0 #000 !important;
                }
                .btn-pop:active {
                    transform: translate(5px, 5px);
                }
            `}</style>

            {/* ── Background ────────────────────────────────────────────── */}
            <PopArtBackground />

            {/* ── Confetti (only after mount to avoid hydration diff) ────── */}
            {mounted && CONFETTI.map((c, i) => (
                <div key={i} className="confetti-piece"
                    style={{
                        left: c.left,
                        width: c.size, height: c.size,
                        background: c.color,
                        border: `2px solid ${C.black}`,
                        transform: `rotate(${c.rotate}deg)`,
                        animationDelay: c.delay,
                        borderRadius: i % 3 === 0 ? "50%" : 0,
                    }}
                />
            ))}

            {/* ── Main card ─────────────────────────────────────────────── */}
            <div className="card-popin" style={{
                position: "relative", zIndex: 10,
                background: C.white,
                border: `4px solid ${C.black}`,
                boxShadow: `10px 10px 0 ${C.black}, 14px 14px 0 ${C.magenta}`,
                maxWidth: 560,
                width: "100%",
                overflow: "hidden",
            }}>

                {/* Top colour bar */}
                <div style={{
                    background: C.magenta,
                    borderBottom: `4px solid ${C.black}`,
                    padding: "6px 0",
                    display: "flex",
                    overflow: "hidden",
                }}>
                    <div style={{
                        whiteSpace: "nowrap",
                        fontFamily: popFont,
                        fontSize: 10, fontWeight: 900, letterSpacing: 5, color: C.black,
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
                        background: C.cyan,
                        border: `4px solid ${C.black}`,
                        boxShadow: `6px 6px 0 ${C.black}`,
                        padding: "10px 28px",
                        display: "inline-flex", alignItems: "center", gap: 10,
                    }}>
                        <span style={{ fontSize: 28 }}>✅</span>
                        <span style={{
                            fontFamily: popFont, fontSize: 18, fontWeight: 900,
                            letterSpacing: 4, color: C.black, textTransform: "uppercase",
                        }}>
                            YOU&apos;RE IN!
                        </span>
                    </div>

                    {/* Big heading */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            fontFamily: displayFont,
                            fontSize: "clamp(42px, 8vw, 80px)",
                            letterSpacing: 6, lineHeight: 0.9,
                            color: C.black,
                        }}>
                            REGISTRATION
                        </div>
                        <div style={{
                            fontFamily: displayFont,
                            fontSize: "clamp(42px, 8vw, 80px)",
                            letterSpacing: 6, lineHeight: 0.9,
                            color: C.magenta,
                            WebkitTextStroke: `0.05em ${C.black}`,
                        }}>
                            CONFIRMED!
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                        width: "100%", height: 4,
                        background: "repeating-linear-gradient(90deg,#ff00ff 0,#ff00ff 14px,#00ffff 14px,#00ffff 28px,#ff0066 28px,#ff0066 42px,#000 42px,#000 56px)",
                    }} />

                    {/* Message */}
                    <div style={{
                        background: C.yellow,
                        border: `3px solid ${C.black}`,
                        boxShadow: `4px 4px 0 ${C.black}`,
                        padding: "16px 20px",
                        width: "100%",
                    }}>
                        <p style={{
                            fontFamily: monoFont, fontSize: 13, fontWeight: 700,
                            color: C.black, lineHeight: 1.7, margin: 0,
                            textAlign: "center",
                        }}>
                            Your spot at <strong>AAKAR 2026</strong> is locked in! 🎉<br />
                            Check your email for a confirmation ticket.<br />
                            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>
                                📅 MAY 21–22, 2026 · AJIET, MANGALORE
                            </span>
                        </p>
                    </div>

                    {/* What's next pills */}
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { icon: "📧", text: "Confirmation email sent to your inbox", color: C.cyan },
                            { icon: "🎟️", text: "Show your ticket at the venue on event day", color: C.pink },
                            { icon: "📱", text: "Follow us on Instagram for updates", color: C.magenta },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                background: item.color,
                                border: `3px solid ${C.black}`,
                                boxShadow: `3px 3px 0 ${C.black}`,
                                padding: "10px 14px",
                            }}>
                                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                                <span style={{
                                    fontFamily: monoFont, fontSize: 11, fontWeight: 700,
                                    letterSpacing: 1, color: C.black, textTransform: "uppercase",
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
                            background: C.black, color: C.yellow,
                            border: `3px solid ${C.black}`,
                            boxShadow: `5px 5px 0 ${C.magenta}`,
                            padding: "12px 24px",
                            fontFamily: popFont, fontSize: 12, fontWeight: 900,
                            letterSpacing: 3, textTransform: "uppercase",
                            textDecoration: "none",
                        }}>
                            🏠 BACK TO HOME
                        </Link>

                        <Link href="/events" className="btn-pop" style={{
                            display: "inline-block",
                            background: C.pink, color: C.white,
                            border: `3px solid ${C.black}`,
                            boxShadow: `5px 5px 0 ${C.black}`,
                            padding: "12px 24px",
                            fontFamily: popFont, fontSize: 12, fontWeight: 900,
                            letterSpacing: 3, textTransform: "uppercase",
                            textDecoration: "none",
                        }}>
                            🎪 EXPLORE EVENTS
                        </Link>
                    </div>
                </div>

                {/* Bottom ticket stub */}
                <div style={{
                    background: C.black,
                    borderTop: `4px dashed ${C.magenta}`,
                    padding: "12px 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    flexWrap: "wrap", gap: 8,
                }}>
                    <div>
                        <div style={{
                            fontFamily: monoFont, fontSize: 9, fontWeight: 700,
                            letterSpacing: 4, color: "#666", textTransform: "uppercase",
                            marginBottom: 2,
                        }}>
                            EVENT
                        </div>
                        <div style={{
                            fontFamily: popFont, fontSize: 14, fontWeight: 900,
                            letterSpacing: 3, color: C.yellow,
                        }}>
                            AAKAR 2026
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{
                            fontFamily: monoFont, fontSize: 9, fontWeight: 700,
                            letterSpacing: 4, color: "#666", textTransform: "uppercase",
                            marginBottom: 2,
                        }}>
                            STATUS
                        </div>
                        <div className="wiggle" style={{
                            display: "inline-block",
                            background: C.cyan,
                            border: `2px solid ${C.black}`,
                            padding: "3px 12px",
                            fontFamily: popFont, fontSize: 11, fontWeight: 900,
                            letterSpacing: 3, color: C.black,
                        }}>
                            ✓ CONFIRMED
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bouncing emoji row ────────────────────────────────────── */}
            <div style={{
                position: "relative", zIndex: 10,
                marginTop: 28, display: "flex", gap: 18,
            }}>
                {["🎉", "🎊", "🏆", "🎊", "🎉"].map((e, i) => (
                    <span key={i} className="bounce" style={{
                        fontSize: 28,
                        animationDelay: `${i * 0.15}s`,
                        filter: "drop-shadow(2px 2px 0 #000)",
                    }}>
                        {e}
                    </span>
                ))}
            </div>
        </div>
    );
}