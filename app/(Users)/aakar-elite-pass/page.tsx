"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllEvents } from "@/backend/events";
import { ExtendedEvent } from "@/types";
import PopArtBackground from "@/components/(User)/PopArtBackground";

// ─── Design tokens matching theme ────────────────────────────────────────────
const C = {
    yellow: "#ffff00",
    magenta: "#ff00ff",
    cyan: "#00ffff",
    pink: "#ff0066",
    hot: "#ff0066",
    black: "#000",
    white: "#fff",
};

const popFont = "'Arial Black', Impact, sans-serif";
const monoFont = "'Courier New', 'Space Mono', monospace";
const displayFont = "'Bebas Neue', Impact, sans-serif";

function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
    return (
        <div
            className={className}
            style={{
                background: "rgba(255,255,255,0.96)",
                border: `3px solid ${C.black}`,
                boxShadow: `6px 6px 0 ${C.black}`,
                borderRadius: 16,
                padding: "clamp(1.4rem,3.5vw,2.5rem)",
                position: "relative",
                ...style,
            }}
        >
            {children}
        </div>
    );
}

function SectionHeading({ children, color = C.magenta, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) {
    return (
        <h2
            style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(1.8rem,5vw,3.2rem)",
                letterSpacing: "0.05em",
                lineHeight: 0.95,
                color: C.black,
                textShadow: `0.08em 0.08em 0 ${color}`,
                WebkitTextStroke: `0.02em ${C.black}`,
                margin: "0 0 1.2rem",
                textAlign: center ? "center" : "left",
            }}
        >
            {children}
        </h2>
    );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                background: color,
                border: `2px solid ${C.black}`,
                boxShadow: `3px 3px 0 ${C.black}`,
                padding: "5px 18px",
                borderRadius: 4,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(0.85rem,2vw,1.1rem)",
                letterSpacing: "0.12em",
                color: C.black,
            }}
        >
            {children}
        </div>
    );
}

// ─── Reusable components ──────────────────────────────────────────────────────

const PopButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    bg?: string;
    fg?: string;
}> = ({ children, onClick, href, disabled, bg = C.pink, fg = C.white }) => {
    const [hov, setHov] = useState(false);

    if (href) {
        return (
            <Link href={href}>
                <button
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                        background: bg,
                        color: fg,
                        border: `3px solid ${C.black}`,
                        boxShadow: hov ? "0 0 0 #000" : `5px 5px 0 ${C.black}`,
                        fontFamily: popFont,
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        padding: "12px 28px",
                        cursor: "pointer",
                        transform: hov ? "translate(3px,3px)" : "none",
                        transition: "transform 0.1s, box-shadow 0.1s",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: "center",
                        borderRadius: 0,
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
                background: disabled ? "#ccc" : bg,
                color: disabled ? "#888" : fg,
                border: `3px solid ${C.black}`,
                boxShadow: hov && !disabled ? "0 0 0 #000" : `5px 5px 0 ${C.black}`,
                fontFamily: popFont,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
                padding: "12px 28px",
                cursor: disabled ? "not-allowed" : "pointer",
                transform: hov && !disabled ? "translate(3px,3px)" : "none",
                transition: "transform 0.1s, box-shadow 0.1s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                borderRadius: 0,
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
                <PopArtBackground />
                <div
                    style={{
                        background: C.white,
                        border: `3px solid ${C.black}`,
                        boxShadow: `6px 6px 0 ${C.black}`,
                        padding: "32px",
                        borderRadius: 0,
                        textAlign: "center",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            fontFamily: displayFont,
                            fontSize: 24,
                            letterSpacing: 4,
                            color: C.black,
                        }}
                    >
                        Loading Elite Pass...
                    </div>
                </div>
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
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
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

            <PopArtBackground />

            <main style={{ position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(2rem,4vh,3rem)" }}>
                    <div className="fade-up" style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-block", background: C.black, color: C.yellow, fontFamily: displayFont, fontSize: "clamp(0.7rem,1.6vw,0.9rem)", letterSpacing: "0.4em", padding: "4px 20px", border: `2px solid ${C.black}`, boxShadow: `3px 3px 0 ${C.magenta}`, marginBottom: "0.7rem" }}>
                            AAKAR 2026
                        </div>
                        <div style={{ fontFamily: displayFont, fontSize: "clamp(3rem,10vw,7rem)", lineHeight: 0.88, letterSpacing: "0.04em", color: C.black, textShadow: `0.05em 0.05em 0 ${C.magenta}, 0.1em 0.1em 0 ${C.cyan}`, WebkitTextStroke: `0.02em ${C.black}` }}>
                            ELITE PASS
                        </div>
                    </div>

                    <Card className="fade-up" style={{ animationDelay: "0.05s" }}>
                        <SectionHeading color={C.hot}>Pass Overview</SectionHeading>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.2rem,3vw,2.5rem)", alignItems: "flex-start" }}>
                            <div style={{ flex: "0 0 clamp(240px,42%,480px)", position: "relative", borderRadius: 12, overflow: "hidden", border: `3px solid ${C.black}`, boxShadow: `8px 8px 0 ${C.black}, 12px 12px 0 ${C.hot}` }}>
                                <div style={{ background: `linear-gradient(135deg, ${C.magenta} 0%, ${C.cyan} 50%, ${C.yellow} 100%)`, minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 24, textAlign: "center" }}>
                                    <div style={{ position: "absolute", inset: 0, opacity: 0.14, backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "18px 18px" }} />
                                    <div style={{ position: "relative", zIndex: 1 }}>
                                        <div style={{ fontFamily: displayFont, fontSize: "clamp(2.5rem,8vw,5rem)", color: C.black, textShadow: `3px 3px 0 ${C.white}` }}>ALL</div>
                                        <div style={{ fontFamily: displayFont, fontSize: "clamp(2.5rem,8vw,5rem)", color: C.white, textShadow: `3px 3px 0 ${C.black}` }}>SOLO</div>
                                        <div style={{ fontFamily: displayFont, fontSize: "clamp(2.1rem,7vw,4.2rem)", color: C.black, textShadow: `3px 3px 0 ${C.yellow}` }}>EVENTS</div>
                                        <div style={{ marginTop: 16, fontFamily: monoFont, fontSize: 11, letterSpacing: 3, color: C.black, textTransform: "uppercase", fontWeight: 700 }}>
                                            Plus featured entertainment nights
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ fontFamily: displayFont, fontSize: "clamp(1.2rem,3vw,1.8rem)", letterSpacing: "0.04em", color: C.black, lineHeight: 1.1 }}>
                                    AAKAR ELITE gives one-pass access to the complete solo-event lineup, plus the high-energy show nights that define the fest.
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    <Chip color={C.yellow}>Solo Events</Chip>
                                    <Chip color={C.cyan}>DJ Night</Chip>
                                    <Chip color={C.magenta}>Concert</Chip>
                                    <Chip color={C.hot}>Special Shows</Chip>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {[
                                        "Unlock every solo event across technical, cultural, gaming, and special categories.",
                                        "Enjoy direct access to DJ night, concert experiences, and featured stage moments.",
                                        "Designed for students who want the full Aakar experience without selecting each event individually.",
                                    ].map((line, i) => (
                                        <p key={i} style={{ fontFamily: monoFont, fontSize: "clamp(0.82rem,1.5vw,0.95rem)", color: "#1a1a2e", lineHeight: 1.7, margin: 0, paddingLeft: 12, borderLeft: `3px solid ${[C.magenta, C.cyan, C.hot][i]}` }}>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "1.8rem", paddingTop: "1.5rem", borderTop: `2px dashed rgba(0,0,0,0.12)`, display: "flex", flexDirection: "column", gap: 14 }}>
                            <p style={{ fontFamily: monoFont, fontSize: "clamp(0.85rem,1.5vw,1rem)", color: "#1a1a2e", lineHeight: 1.75, margin: 0 }}>
                                This pass page is styled to feel like the About section, but focused on the Elite Pass experience and the events it unlocks.
                            </p>
                        </div>
                    </Card>

                    <Card className="fade-up" style={{ animationDelay: "0.12s" }}>
                        <SectionHeading color={C.cyan} center>What&apos;s Included</SectionHeading>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: "1.6rem" }}>
                            <Chip color={C.yellow}>{soloEvents.length} Solo Events</Chip>
                            <Chip color={C.magenta}>{featuredEvents.length} Featured Nights</Chip>
                            <Chip color={C.cyan}>One Pass</Chip>
                            <Chip color={C.hot}>Full Access</Chip>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                            {[
                                ["Solo lineup", "Technical, cultural, gaming, and special solo events all in one pass."],
                                ["Show nights", "DJ night, concert, and other featured performances are part of the experience."],
                                ["Simple entry", "One clear pass page instead of checking each event separately."],
                                ["Festival feel", "Styled to match the rest of the Aakar visual identity."],
                            ].map(([title, text], index) => (
                                <div key={title} style={{ background: [C.yellow, C.cyan, C.magenta, C.hot][index], border: `3px solid ${C.black}`, boxShadow: `4px 4px 0 ${C.black}`, padding: 18 }}>
                                    <div style={{ fontFamily: displayFont, fontSize: 20, letterSpacing: 1, marginBottom: 8, color: C.black }}>{title}</div>
                                    <div style={{ fontFamily: monoFont, fontSize: 11, lineHeight: 1.7, color: C.black }}>{text}</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="fade-up" style={{ animationDelay: "0.18s" }}>
                        <SectionHeading color={C.magenta}>Solo Event Lineup</SectionHeading>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                            {soloEvents.map((event, index) => (
                                <div key={event.id} style={{ background: C.white, border: `3px solid ${C.black}`, boxShadow: `5px 5px 0 ${C.black}` }}>
                                    <div style={{ height: 150, background: `linear-gradient(135deg, ${[C.cyan, C.magenta, C.yellow, C.hot][index % 4]} 0%, ${[C.hot, C.yellow, C.cyan, C.magenta][index % 4]} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                                        <div style={{ position: "absolute", inset: 0, opacity: 0.16, backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                                        <div style={{ position: "relative", zIndex: 1, fontFamily: displayFont, fontSize: "clamp(1.6rem,4vw,2.6rem)", color: C.white, textShadow: `3px 3px 0 ${C.black}`, textAlign: "center", padding: "0 12px" }}>
                                            {event.eventName}
                                        </div>
                                    </div>
                                    <div style={{ padding: 16 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 10 }}>
                                            <Chip color={[C.yellow, C.cyan, C.magenta, C.hot][index % 4]}>{event.eventCategory}</Chip>
                                            <span style={{ fontFamily: displayFont, fontSize: 18, color: C.black }}>₹{event.fee}</span>
                                        </div>
                                        <p style={{ fontFamily: monoFont, fontSize: 11, color: "#1a1a2e", lineHeight: 1.7, margin: 0 }}>
                                            {event.description.substring(0, 110)}...
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {featuredEvents.length > 0 && (
                        <Card className="fade-up" style={{ animationDelay: "0.22s" }}>
                            <SectionHeading color={C.yellow} center>
                                Featured Nights
                            </SectionHeading>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                                {featuredEvents.map((event, index) => (
                                    <div key={event.id} style={{ background: [C.black, C.magenta, C.cyan][index % 3], border: `3px solid ${C.black}`, boxShadow: `4px 4px 0 ${C.black}`, padding: 18 }}>
                                        <div style={{ fontFamily: displayFont, fontSize: 28, letterSpacing: 2, color: [C.yellow, C.white, C.black][index % 3], marginBottom: 8 }}>
                                            {event.eventName}
                                        </div>
                                        <div style={{ fontFamily: monoFont, fontSize: 11, lineHeight: 1.7, color: [C.yellow, C.black, C.black][index % 3] }}>
                                            {event.description.substring(0, 140)}...
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card className="fade-up" style={{ animationDelay: "0.28s", background: `linear-gradient(135deg, rgba(0,0,0,0.96) 0%, rgba(25,25,25,0.96) 100%)`, color: C.white, borderRadius: 20 }}>
                        <SectionHeading color={C.cyan} center>Ready To Join?</SectionHeading>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                            <div style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem,4vw,3rem)", letterSpacing: 3, color: C.yellow, textAlign: "center" }}>
                                One Pass. Full Festival.
                            </div>
                            <p style={{ fontFamily: monoFont, fontSize: 12, letterSpacing: 2, color: C.cyan, margin: 0, textAlign: "center", lineHeight: 1.7, maxWidth: 760 }}>
                                Access the solo-event lineup, DJ night, concert moments, and the entire Aakar Elite experience from a single pass page.
                            </p>
                            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                                <PopButton href="/aakar-elite-pass/buy" bg={C.yellow} fg={C.black}>
                                    🎟️ GET ELITE PASS
                                </PopButton>
                                <PopButton href="/events" bg={C.cyan} fg={C.black}>
                                    ← VIEW EVENTS
                                </PopButton>
                            </div>
                        </div>
                    </Card>

                    <div style={{ textAlign: "center", fontFamily: monoFont, fontSize: 11, letterSpacing: 2, color: "#666", textTransform: "uppercase" }}>
                        Aakar 2026 • Elite Experience Awaits
                    </div>
                </div>
            </main>
        </div>
    );
}
