"use client";

import Link from "next/link";
import PopArtBackground from "@/components/(User)/PopArtBackground";

const C = {
    yellow: "#ffff00",
    magenta: "#ff00ff",
    cyan: "#00ffff",
    pink: "#ff0066",
    hot: "#ff0066",
    black: "#000",
    white: "#fff",
};

const displayFont = "'Bebas Neue', Impact, sans-serif";
const monoFont = "'Courier New', 'Space Mono', monospace";
const popFont = "'Arial Black', Impact, sans-serif";

function PopButton({ children, href, bg, fg }: { children: React.ReactNode; href: string; bg: string; fg: string }) {
    return (
        <Link href={href} style={{ textDecoration: "none" }}>
            <div style={{ background: bg, color: fg, border: `3px solid ${C.black}`, boxShadow: `5px 5px 0 ${C.black}`, fontFamily: popFont, fontSize: 12, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", padding: "12px 28px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {children}
            </div>
        </Link>
    );
}

export default function ElitePassSuccessPage() {
    return (
        <div style={{ minHeight: "100vh", position: "relative", padding: "clamp(3rem,8vh,6rem) clamp(1rem,5vw,3rem)" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }
            `}</style>
            <PopArtBackground />
            <main style={{ position: "relative", zIndex: 10, maxWidth: 920, margin: "0 auto" }}>
                <div style={{ background: C.white, border: `3px solid ${C.black}`, boxShadow: `6px 6px 0 ${C.black}`, borderRadius: 16, padding: "clamp(1.5rem,4vw,2.5rem)", textAlign: "center" }}>
                    <div style={{ display: "inline-block", background: C.black, color: C.yellow, fontFamily: displayFont, fontSize: "clamp(0.8rem,2vw,1rem)", letterSpacing: "0.35em", padding: "4px 18px", border: `2px solid ${C.black}`, boxShadow: `3px 3px 0 ${C.magenta}`, marginBottom: 16 }}>
                        PURCHASE SUCCESS
                    </div>
                    <div style={{ fontFamily: displayFont, fontSize: "clamp(2.8rem,8vw,5.8rem)", letterSpacing: 4, lineHeight: 0.9, color: C.black, textShadow: `0.06em 0.06em 0 ${C.cyan}, 0.12em 0.12em 0 ${C.magenta}`, WebkitTextStroke: `0.02em ${C.black}`, marginBottom: 12 }}>
                        ELITE PASS BOOKED
                    </div>
                    <p style={{ fontFamily: monoFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#1a1a2e", lineHeight: 1.8, maxWidth: 760, margin: "0 auto 24px" }}>
                        Your Elite Pass details and payment screenshot have been submitted successfully.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 24 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", background: C.yellow, border: `2px solid ${C.black}`, boxShadow: `3px 3px 0 ${C.black}`, padding: "5px 18px", borderRadius: 4, fontFamily: displayFont, fontSize: "clamp(0.85rem,2vw,1.1rem)", letterSpacing: "0.12em", color: C.black }}>ALL SOLO EVENTS</div>
                        <div style={{ display: "inline-flex", alignItems: "center", background: C.cyan, border: `2px solid ${C.black}`, boxShadow: `3px 3px 0 ${C.black}`, padding: "5px 18px", borderRadius: 4, fontFamily: displayFont, fontSize: "clamp(0.85rem,2vw,1.1rem)", letterSpacing: "0.12em", color: C.black }}>DJ NIGHT</div>
                        <div style={{ display: "inline-flex", alignItems: "center", background: C.magenta, border: `2px solid ${C.black}`, boxShadow: `3px 3px 0 ${C.black}`, padding: "5px 18px", borderRadius: 4, fontFamily: displayFont, fontSize: "clamp(0.85rem,2vw,1.1rem)", letterSpacing: "0.12em", color: C.black }}>CONCERT</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
                        <PopButton href="/aakar-elite-pass" bg={C.yellow} fg={C.black}>VIEW PASS</PopButton>
                        <PopButton href="/" bg={C.cyan} fg={C.black}>GO HOME</PopButton>
                    </div>
                </div>
            </main>
        </div>
    );
}
