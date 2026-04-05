"use client";

import React, { useState } from "react";
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

export const ElitePassCard: React.FC = () => {
    const [hov, setHov] = useState(false);

    return (
        <Link href="/aakar-elite-pass" style={{ textDecoration: "none" }}>
            <div
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <AnimeCardWrapper accentIndex={0} style={{
                    padding: "24px",
                    cursor: "pointer",
                    transform: hov ? "translate(-4px, -4px)" : "none",
                }}>
                <div
                    style={{
                        position: "absolute",
                        top: -70,
                        right: -80,
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${ANIME_COLORS.secondary}55 0%, ${ANIME_COLORS.accent}30 55%, transparent 100%)`,
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
                        background: `radial-gradient(circle, ${ANIME_COLORS.primary}45 0%, ${ANIME_COLORS.purple}28 55%, transparent 100%)`,
                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                        <AnimeCardWrapper accentIndex={1} style={{
                            padding: "7px 14px",
                            display: "inline-block",
                            background: `${ANIME_COLORS.primary}40`,
                            border: `1px solid ${ANIME_COLORS.primary}`,
                        }}>
                            <span style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: 10,
                                fontWeight: 900,
                                letterSpacing: 2,
                                textTransform: "uppercase",
                                color: ANIME_COLORS.text,
                            }}>
                                ⚡ ELITE PASS
                            </span>
                        </AnimeCardWrapper>

                        <AnimeCardWrapper accentIndex={2} style={{
                            padding: "4px 10px",
                            display: "inline-block",
                        }}>
                            <span style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: 14,
                                letterSpacing: 1,
                                color: ANIME_COLORS.text,
                                lineHeight: 1,
                            }}>
                                ₹999
                            </span>
                        </AnimeCardWrapper>
                    </div>

                    <h3
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(22px, 3.1vw, 30px)",
                            letterSpacing: 3,
                            color: ANIME_COLORS.text,
                            margin: "0 0 6px 0",
                            lineHeight: 0.95,
                            textShadow: `0 0 12px ${ANIME_COLORS.secondary}40`,
                        }}
                    >
                        AAKAR ELITE
                    </h3>

                    <div
                        style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: 10,
                            fontWeight: 700,
                            color: ANIME_COLORS.secondary,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            marginBottom: 10,
                        }}
                    >
                        Pass • All Solo Events
                    </div>

                    <p
                        style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: 11,
                            color: ANIME_COLORS.text,
                            lineHeight: 1.5,
                            margin: "0 0 14px 0",
                        }}
                    >
                        Access every solo competition with one pass, then continue to payment from the details page.
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                        {["Solo Events", "Fast Entry", "One Payment"].map((chip, index) => (
                            <AnimeCardWrapper key={chip} accentIndex={index} style={{
                                padding: "3px 8px",
                                display: "inline-block",
                            }}>
                                <span
                                    style={{
                                        fontFamily: "'Share Tech Mono', monospace",
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: 1,
                                        textTransform: "uppercase",
                                        color: ANIME_COLORS.text,
                                    }}
                                >
                                    {chip}
                                </span>
                            </AnimeCardWrapper>
                        ))}
                    </div>

                    <AnimeCardWrapper accentIndex={0} style={{
                        padding: "11px 12px",
                        marginBottom: 12,
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: 1.3,
                        textAlign: "center",
                        color: ANIME_COLORS.text,
                        transition: "all 0.15s",
                        cursor: "pointer",
                    }}>
                        VIEW DETAILS & PURCHASE →
                    </AnimeCardWrapper>

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: 12,
                            borderTop: `1px dashed ${ANIME_COLORS.primary}`,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: 4,
                            }}
                        >
                            {[ANIME_COLORS.secondary, ANIME_COLORS.purple, ANIME_COLORS.accent].map((color, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: color,
                                        border: `1px solid ${ANIME_COLORS.primary}`,
                                        borderRadius: 2,
                                    }}
                                />
                            ))}
                        </div>
                        <span
                            style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: 12,
                                fontWeight: 900,
                                color: ANIME_COLORS.text,
                                letterSpacing: 1,
                            }}
                        >
                            ALL SOLO EVENTS
                        </span>
                    </div>
                </div>
            </AnimeCardWrapper>
            </div>
        </Link>
    );
};
