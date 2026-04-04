"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllEvents } from "@/backend/events";
import { ExtendedEvent } from "@/types";
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
    hot: ANIME_COLORS.purple,
    black: ANIME_COLORS.background,
    white: ANIME_COLORS.text,
};

const popFont = "'Bebas Neue', Impact, sans-serif";
const monoFont = "'Share Tech Mono', monospace";
const displayFont = "'Bebas Neue', Impact, sans-serif";

function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
    return (
        <AnimeCardWrapper accentIndex={0} className={className} style={{
            padding: "clamp(1.4rem,3.5vw,2.5rem)",
            position: "relative",
            ...style,
        }}>
            {children}
        </AnimeCardWrapper>
    );
}

function SectionHeading({ children, color = ANIME_COLORS.primary, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) {
    const accentIndex = color === ANIME_COLORS.primary ? 0 : color === ANIME_COLORS.secondary ? 1 : color === ANIME_COLORS.accent ? 2 : 3;
    return (
        <AnimeSectionHeading index={accentIndex} style={{
            textAlign: center ? "center" : "left",
        }}>
            {children}
        </AnimeSectionHeading>
    );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                background: `${color}40`,
                border: `1px solid ${color}`,
                boxShadow: `0 0 12px ${color}40`,
                padding: "6px 16px",
                borderRadius: 6,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(0.85rem,2vw,1.1rem)",
                letterSpacing: "0.12em",
                color: ANIME_COLORS.text,
                backdropFilter: "blur(4px)"
            }}
        >
            {children}
        </div>
    );
}

// ─── Reusable components ──────────────────────────────────────────────────────

const AnimeButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    bg?: string;
    fg?: string;
}> = ({ children, onClick, href, disabled, bg = ANIME_COLORS.primary, fg = ANIME_COLORS.text }) => {
    const [hov, setHov] = useState(false);

    if (href) {
        return (
            <Link href={href}>
                <button
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                        background: disabled ? `${ANIME_COLORS.background}40` : `${bg}20`,
                        color: disabled ? `${ANIME_COLORS.text}40` : fg,
                        border: `1px solid ${bg}`,
                        boxShadow: hov && !disabled ? `0 0 20px ${bg}60` : `0 0 8px ${bg}40`,
                        fontFamily: popFont,
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        padding: "12px 28px",
                        cursor: "pointer",
                        transform: hov && !disabled ? "translateY(-2px)" : "none",
                        transition: "all 0.3s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: "center",
                        borderRadius: 6,
                        backdropFilter: "blur(4px)"
                    }}
                >
                    {children}
                </button>
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: disabled ? `${ANIME_COLORS.background}40` : `${bg}20`,
                color: disabled ? `${ANIME_COLORS.text}40` : fg,
                border: `1px solid ${bg}`,
                boxShadow: hov && !disabled ? `0 0 20px ${bg}60` : `0 0 8px ${bg}40`,
                fontFamily: popFont,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
                padding: "12px 28px",
                cursor: disabled ? "not-allowed" : "pointer",
                transform: hov && !disabled ? "translateY(-2px)" : "none",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                borderRadius: 6,
                backdropFilter: "blur(4px)"
            }}
        >
            {children}
        </button>
    );
};


// ─── Main Elite Pass Page ──────────────────────────────────────────────────────

export default function AakarElitePage() {
    const [soloEvents, setSoloEvents] = useState<ExtendedEvent[]>([]);
    const [featuredEvents, setFeaturedEvents] = useState<ExtendedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalFee, setTotalFee] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const events = await getAllEvents();
                const solo = events.filter((e) => e.eventType === "Solo");
                const featured = events.filter((e) => e.eventCategory === "Special");
                setSoloEvents(solo);
                setFeaturedEvents(featured);
                const total = solo.reduce((sum, e) => sum + e.fee, 0);
                setTotalFee(total);
            } catch (error) {
                console.error("Error loading events:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <AnimeOrbField />
                <AnimeParticleField />
                <AnimeCardWrapper accentIndex={0} style={{
                    padding: "32px",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                }}>
                    <div style={{
                        fontFamily: displayFont,
                        fontSize: 24,
                        letterSpacing: 4,
                        color: ANIME_COLORS.text,
                    }}>
                        <AnimeGlitchText text="Loading Elite Pass...">
                            Loading Elite Pass...
                        </AnimeGlitchText>
                    </div>
                </AnimeCardWrapper>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                padding: "clamp(3rem,8vh,6rem) clamp(1rem,5vw,3rem) clamp(3rem,8vh,5rem)",
            }}
        >
            <style>{`
                ${ANIME_GLOBAL_STYLES}
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(28px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes popIn {
                    0%  { opacity:0; transform:scale(0.88) rotate(-2deg); }
                    100%{ opacity:1; transform:scale(1) rotate(0deg); }
                }
                .fade-up { animation: fadeUp 0.5s ease both; }
                .pop-in { animation: popIn 0.55s cubic-bezier(.23,1.5,.7,1) both; }
            `}</style>

            <AnimeOrbField />
            <AnimeParticleField />

            <main style={{ position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(2rem,4vh,3rem)" }}>
                    <div className="fade-up" style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-block", background: `${ANIME_COLORS.background}80`, color: ANIME_COLORS.accent, fontFamily: displayFont, fontSize: "clamp(0.7rem,1.6vw,0.9rem)", letterSpacing: "0.4em", padding: "4px 20px", border: `1px solid ${ANIME_COLORS.accent}`, boxShadow: `0 0 12px ${ANIME_COLORS.accent}40`, marginBottom: "0.7rem", backdropFilter: "blur(4px)" }}>
                            AAKAR 2026
                        </div>
                        <div style={{ fontFamily: displayFont, fontSize: "clamp(3rem,10vw,7rem)", lineHeight: 0.88, letterSpacing: "0.04em", color: ANIME_COLORS.text, textShadow: `0 0 30px ${ANIME_COLORS.primary}45, -3px -3px 0 ${ANIME_COLORS.primary}, 3px 3px 0 ${ANIME_COLORS.secondary}` }}>
                            <AnimeGlitchText text="ELITE PASS">
                                ELITE PASS
                            </AnimeGlitchText>
                        </div>
                    </div>

                    <Card className="fade-up" style={{ animationDelay: "0.05s" }}>
                        <SectionHeading color={ANIME_COLORS.purple}>Pass Overview</SectionHeading>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.2rem,3vw,2.5rem)", alignItems: "flex-start" }}>
                            <div style={{ flex: "0 0 clamp(240px,42%,480px)", position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${ANIME_COLORS.primary}`, boxShadow: `0 0 20px ${ANIME_COLORS.primary}60` }}>
                                <div style={{ background: `linear-gradient(135deg, ${ANIME_COLORS.primary} 0%, ${ANIME_COLORS.secondary} 50%, ${ANIME_COLORS.accent} 100%)`, minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 24, textAlign: "center" }}>
                                    <div style={{ position: "absolute", inset: 0, opacity: 0.14, backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "18px 18px" }} />
                                    <div style={{ position: "relative", zIndex: 1 }}>
                                        <div style={{ fontFamily: displayFont, fontSize: "clamp(2.5rem,8vw,5rem)", color: ANIME_COLORS.text, textShadow: `3px 3px 0 ${ANIME_COLORS.background}` }}>ALL</div>
                                        <div style={{ fontFamily: displayFont, fontSize: "clamp(2.5rem,8vw,5rem)", color: ANIME_COLORS.text, textShadow: `3px 3px 0 ${ANIME_COLORS.background}` }}>SOLO</div>
                                        <div style={{ fontFamily: displayFont, fontSize: "clamp(2.1rem,7vw,4.2rem)", color: ANIME_COLORS.text, textShadow: `3px 3px 0 ${ANIME_COLORS.background}` }}>EVENTS</div>
                                        <div style={{ marginTop: 16, fontFamily: monoFont, fontSize: 11, letterSpacing: 3, color: ANIME_COLORS.text, textTransform: "uppercase", fontWeight: 700 }}>
                                            Plus featured entertainment nights
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ fontFamily: displayFont, fontSize: "clamp(1.2rem,3vw,1.8rem)", letterSpacing: "0.04em", color: ANIME_COLORS.text, lineHeight: 1.1 }}>
                                    AAKAR ELITE gives one-pass access to the complete solo-event lineup, plus the high-energy show nights that define the fest.
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    <Chip color={ANIME_COLORS.accent}>Solo Events</Chip>
                                    <Chip color={ANIME_COLORS.secondary}>DJ Night</Chip>
                                    <Chip color={ANIME_COLORS.primary}>Concert</Chip>
                                    <Chip color={ANIME_COLORS.purple}>Special Shows</Chip>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {[
                                        "Unlock every solo event across technical, cultural, gaming, and special categories.",
                                        "Enjoy direct access to DJ night, concert experiences, and featured stage moments.",
                                        "Designed for students who want the full Aakar experience without selecting each event individually.",
                                    ].map((line, i) => (
                                        <p key={i} style={{ fontFamily: monoFont, fontSize: "clamp(0.82rem,1.5vw,0.95rem)", color: ANIME_COLORS.subtext, lineHeight: 1.7, margin: 0, paddingLeft: 12, borderLeft: `3px solid ${[ANIME_COLORS.primary, ANIME_COLORS.secondary, ANIME_COLORS.purple][i]}` }}>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "1.8rem", paddingTop: "1.5rem", borderTop: `1px dashed ${ANIME_COLORS.primary}40`, display: "flex", flexDirection: "column", gap: 14 }}>
                            <p style={{ fontFamily: monoFont, fontSize: "clamp(0.85rem,1.5vw,1rem)", color: ANIME_COLORS.subtext, lineHeight: 1.75, margin: 0 }}>
                                This pass page is styled to feel like the About section, but focused on the Elite Pass experience and the events it unlocks.
                            </p>
                        </div>
                    </Card>

                    <Card className="fade-up" style={{ animationDelay: "0.12s" }}>
                        <SectionHeading color={ANIME_COLORS.secondary} center>What&apos;s Included</SectionHeading>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: "1.6rem" }}>
                            <Chip color={ANIME_COLORS.accent}>{soloEvents.length} Solo Events</Chip>
                            <Chip color={ANIME_COLORS.primary}>{featuredEvents.length} Featured Nights</Chip>
                            <Chip color={ANIME_COLORS.secondary}>One Pass</Chip>
                            <Chip color={ANIME_COLORS.purple}>Full Access</Chip>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                            {[
                                ["Solo lineup", "Technical, cultural, gaming, and special solo events all in one pass."],
                                ["Show nights", "DJ night, concert, and other featured performances are part of the experience."],
                                ["Simple entry", "One clear pass page instead of checking each event separately."],
                                ["Festival feel", "Styled to match the rest of the Aakar visual identity."],
                            ].map(([title, text], index) => (
                                <div key={title} style={{ background: `${[ANIME_COLORS.accent, ANIME_COLORS.secondary, ANIME_COLORS.primary, ANIME_COLORS.purple][index]}40`, border: `1px solid ${[ANIME_COLORS.accent, ANIME_COLORS.secondary, ANIME_COLORS.primary, ANIME_COLORS.purple][index]}`, boxShadow: `0 0 12px ${[ANIME_COLORS.accent, ANIME_COLORS.secondary, ANIME_COLORS.primary, ANIME_COLORS.purple][index]}40`, padding: 18, borderRadius: 8 }}>
                                    <div style={{ fontFamily: displayFont, fontSize: 20, letterSpacing: 1, marginBottom: 8, color: ANIME_COLORS.text }}>{title}</div>
                                    <div style={{ fontFamily: monoFont, fontSize: 11, lineHeight: 1.7, color: ANIME_COLORS.subtext }}>{text}</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="fade-up" style={{ animationDelay: "0.18s" }}>
                        <SectionHeading color={ANIME_COLORS.primary}>Solo Event Lineup</SectionHeading>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                            {soloEvents.map((event, index) => (
                                <div key={event.id} style={{ background: `${ANIME_COLORS.background}80`, border: `1px solid ${ANIME_COLORS.primary}`, boxShadow: `0 0 12px ${ANIME_COLORS.primary}40`, borderRadius: 8 }}>
                                    <div style={{ height: 150, background: `linear-gradient(135deg, ${[ANIME_COLORS.secondary, ANIME_COLORS.primary, ANIME_COLORS.accent, ANIME_COLORS.purple][index % 4]} 0%, ${[ANIME_COLORS.purple, ANIME_COLORS.accent, ANIME_COLORS.secondary, ANIME_COLORS.primary][index % 4]} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                        <div style={{ position: "absolute", inset: 0, opacity: 0.16, backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                                        <div style={{ position: "relative", zIndex: 1, fontFamily: displayFont, fontSize: "clamp(1.6rem,4vw,2.6rem)", color: ANIME_COLORS.text, textShadow: `3px 3px 0 ${ANIME_COLORS.background}`, textAlign: "center", padding: "0 12px" }}>
                                            {event.eventName}
                                        </div>
                                    </div>
                                    <div style={{ padding: 16 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 10 }}>
                                            <Chip color={[ANIME_COLORS.accent, ANIME_COLORS.secondary, ANIME_COLORS.primary, ANIME_COLORS.purple][index % 4]}>{event.eventCategory}</Chip>
                                            <span style={{ fontFamily: displayFont, fontSize: 18, color: ANIME_COLORS.text }}>₹{event.fee}</span>
                                        </div>
                                        <p style={{ fontFamily: monoFont, fontSize: 11, color: ANIME_COLORS.subtext, lineHeight: 1.7, margin: 0 }}>
                                            {event.description.substring(0, 110)}...
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {featuredEvents.length > 0 && (
                        <Card className="fade-up" style={{ animationDelay: "0.22s" }}>
                            <SectionHeading color={ANIME_COLORS.accent} center>
                                Featured Nights
                            </SectionHeading>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                                {featuredEvents.map((event, index) => (
                                    <div key={event.id} style={{ background: `${[ANIME_COLORS.background, ANIME_COLORS.primary, ANIME_COLORS.secondary][index % 3]}80`, border: `1px solid ${[ANIME_COLORS.primary, ANIME_COLORS.secondary, ANIME_COLORS.accent][index % 3]}`, boxShadow: `0 0 12px ${[ANIME_COLORS.primary, ANIME_COLORS.secondary, ANIME_COLORS.accent][index % 3]}40`, padding: 18, borderRadius: 8 }}>
                                        <div style={{ fontFamily: displayFont, fontSize: 28, letterSpacing: 2, color: [ANIME_COLORS.accent, ANIME_COLORS.text, ANIME_COLORS.text][index % 3], marginBottom: 8 }}>
                                            {event.eventName}
                                        </div>
                                        <div style={{ fontFamily: monoFont, fontSize: 11, lineHeight: 1.7, color: [ANIME_COLORS.subtext, ANIME_COLORS.subtext, ANIME_COLORS.subtext][index % 3] }}>
                                            {event.description.substring(0, 140)}...
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card className="fade-up" style={{ animationDelay: "0.28s" }}>
                        <SectionHeading color={ANIME_COLORS.secondary} center>Ready To Join?</SectionHeading>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                            <div style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem,4vw,3rem)", letterSpacing: 3, color: ANIME_COLORS.accent, textAlign: "center" }}>
                                One Pass. Full Festival.
                            </div>
                            <p style={{ fontFamily: monoFont, fontSize: 12, letterSpacing: 2, color: ANIME_COLORS.subtext, margin: 0, textAlign: "center", lineHeight: 1.7, maxWidth: 760 }}>
                                Access the solo-event lineup, DJ night, concert moments, and the entire Aakar Elite experience from a single pass page.
                            </p>
                            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                                <AnimeButton href="/aakar-elite-pass/buy" bg={ANIME_COLORS.accent} fg={ANIME_COLORS.text}>
                                    🎟️ GET ELITE PASS
                                </AnimeButton>
                                <AnimeButton href="/events" bg={ANIME_COLORS.secondary} fg={ANIME_COLORS.text}>
                                    ← VIEW EVENTS
                                </AnimeButton>
                            </div>
                        </div>
                    </Card>

                    <div style={{ textAlign: "center", fontFamily: monoFont, fontSize: 11, letterSpacing: 2, color: ANIME_COLORS.subtext, textTransform: "uppercase" }}>
                        Aakar 2026 • Elite Experience Awaits
                    </div>
                </div>
            </main>
        </div>
    );
}
