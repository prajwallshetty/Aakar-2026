"use client";

import React, { useState } from "react";
import Link from "next/link";

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

export const ElitePassCard: React.FC = () => {
    const [hov, setHov] = useState(false);

    return (
        <Link href="/aakar-elite-pass" style={{ textDecoration: "none" }}>
            <div
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    background: `linear-gradient(160deg, ${C.white} 0%, #fffef1 100%)`,
                    border: `3px solid ${C.black}`,
                    boxShadow: hov
                        ? `12px 12px 0 ${C.black}, 16px 16px 0 ${C.magenta}, 20px 20px 0 ${C.cyan}`
                        : `8px 8px 0 ${C.black}, 12px 12px 0 ${C.magenta}`,
                    padding: "24px",
                    borderRadius: 14,
                    cursor: "pointer",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    transform: hov ? "translate(-4px, -4px)" : "none",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: -70,
                        right: -80,
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${C.cyan}55 0%, ${C.yellow}30 55%, transparent 100%)`,
                        zIndex: 0,
                        pointerEvents: "none",
                        transform: hov ? "scale(1.08)" : "scale(1)",
                        transition: "transform 0.25s",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        bottom: -48,
                        left: -52,
                        width: 170,
                        height: 170,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${C.magenta}45 0%, ${C.pink}28 55%, transparent 100%)`,
                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                        <div
                            style={{
                                background: C.magenta,
                                border: `3px solid ${C.black}`,
                                boxShadow: `3px 3px 0 ${C.black}`,
                                padding: "7px 14px",
                                fontFamily: popFont,
                                fontSize: 10,
                                fontWeight: 900,
                                letterSpacing: 2,
                                textTransform: "uppercase",
                                color: C.white,
                                display: "inline-block",
                            }}
                        >
                            ⚡ ELITE PASS
                        </div>

                        <div
                            style={{
                                background: C.yellow,
                                border: `2px solid ${C.black}`,
                                boxShadow: `2px 2px 0 ${C.black}`,
                                padding: "4px 10px",
                                fontFamily: displayFont,
                                fontSize: 14,
                                letterSpacing: 1,
                                color: C.black,
                                lineHeight: 1,
                            }}
                        >
                            ₹999
                        </div>
                    </div>

                    <h3
                        style={{
                            fontFamily: displayFont,
                            fontSize: "clamp(22px, 3.1vw, 30px)",
                            letterSpacing: 3,
                            color: C.black,
                            margin: "0 0 6px 0",
                            lineHeight: 0.95,
                            textShadow: `2px 2px 0 ${C.cyan}`,
                        }}
                    >
                        AAKAR ELITE
                    </h3>

                    <div
                        style={{
                            fontFamily: monoFont,
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#333",
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            marginBottom: 10,
                        }}
                    >
                        Pass • All Solo Events
                    </div>

                    <p
                        style={{
                            fontFamily: monoFont,
                            fontSize: 11,
                            color: "#3f3f3f",
                            lineHeight: 1.5,
                            margin: "0 0 14px 0",
                        }}
                    >
                        Access every solo competition with one pass, then continue to payment from the details page.
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                        {["Solo Events", "Fast Entry", "One Payment"].map((chip, index) => (
                            <span
                                key={chip}
                                style={{
                                    background: [C.cyan, C.yellow, C.magenta][index],
                                    color: index === 2 ? C.white : C.black,
                                    border: `2px solid ${C.black}`,
                                    padding: "3px 8px",
                                    fontFamily: monoFont,
                                    fontSize: 9,
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                    textTransform: "uppercase",
                                }}
                            >
                                {chip}
                            </span>
                        ))}
                    </div>

                    <div
                        style={{
                            background: hov ? C.black : C.yellow,
                            border: `3px solid ${C.black}`,
                            boxShadow: hov ? `0 0 0 ${C.black}` : `3px 3px 0 ${C.black}`,
                            padding: "11px 12px",
                            marginBottom: 12,
                            fontFamily: monoFont,
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 1.3,
                            textAlign: "center",
                            color: hov ? C.yellow : C.black,
                            transition: "all 0.15s",
                        }}
                    >
                        VIEW DETAILS & PURCHASE →
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: 12,
                            borderTop: `2px dashed ${C.black}`,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: 4,
                            }}
                        >
                            {[C.cyan, C.pink, C.yellow].map((color, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: color,
                                        border: `2px solid ${C.black}`,
                                    }}
                                />
                            ))}
                        </div>
                        <span
                            style={{
                                fontFamily: popFont,
                                fontSize: 12,
                                fontWeight: 900,
                                color: C.black,
                                letterSpacing: 1,
                            }}
                        >
                            ALL SOLO EVENTS
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
