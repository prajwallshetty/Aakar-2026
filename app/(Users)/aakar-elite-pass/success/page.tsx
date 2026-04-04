"use client";

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
    hot: ANIME_COLORS.purple,
    black: ANIME_COLORS.background,
    white: ANIME_COLORS.text,
};

const displayFont = "'Bebas Neue', Impact, sans-serif";
const monoFont = "'Share Tech Mono', monospace";
const popFont = "'Bebas Neue', Impact, sans-serif";

function AnimeButton({ children, href, bg, fg }: { children: React.ReactNode; href: string; bg: string; fg: string }) {
    return (
        <Link href={href} style={{ textDecoration: "none" }}>
            <div style={{ 
                background: `${bg}40`, 
                color: fg, 
                border: `1px solid ${bg}`, 
                boxShadow: `0 0 8px ${bg}40`, 
                fontFamily: popFont, 
                fontSize: 12, 
                fontWeight: 900, 
                letterSpacing: 3, 
                textTransform: "uppercase", 
                padding: "12px 28px", 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center",
                borderRadius: 6,
                backdropFilter: "blur(4px)",
                transition: "all 0.3s ease"
            }}>
                {children}
            </div>
        </Link>
    );
}

export default function ElitePassSuccessPage() {
    return (
        <div style={{ minHeight: "100vh", position: "relative", padding: "clamp(3rem,8vh,6rem) clamp(1rem,5vw,3rem)" }}>
            <style>{`
                ${ANIME_GLOBAL_STYLES}
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }
            `}</style>
            <AnimeOrbField />
            <AnimeParticleField />
            <main style={{ position: "relative", zIndex: 10, maxWidth: 920, margin: "0 auto" }}>
                <AnimeCardWrapper accentIndex={0} style={{ textAlign: "center", padding: "clamp(1.5rem,4vw,2.5rem)" }}>
                    <div style={{ display: "inline-block", background: `${ANIME_COLORS.background}80`, color: ANIME_COLORS.accent, fontFamily: displayFont, fontSize: "clamp(0.8rem,2vw,1rem)", letterSpacing: "0.35em", padding: "4px 18px", border: `1px solid ${ANIME_COLORS.accent}`, boxShadow: `0 0 12px ${ANIME_COLORS.accent}40`, marginBottom: 16, backdropFilter: "blur(4px)" }}>
                        PURCHASE SUCCESS
                    </div>
                    <div style={{ fontFamily: displayFont, fontSize: "clamp(2.8rem,8vw,5.8rem)", letterSpacing: 4, lineHeight: 0.9, color: ANIME_COLORS.text, textShadow: `0 0 30px ${ANIME_COLORS.primary}45, -3px -3px 0 ${ANIME_COLORS.secondary}, 3px 3px 0 ${ANIME_COLORS.accent}`, marginBottom: 12 }}>
                        <AnimeGlitchText text="ELITE PASS BOOKED">
                            ELITE PASS BOOKED
                        </AnimeGlitchText>
                    </div>
                    <p style={{ fontFamily: monoFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: ANIME_COLORS.subtext, lineHeight: 1.8, maxWidth: 760, margin: "0 auto 24px" }}>
                        Your Elite Pass details and payment screenshot have been submitted successfully.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 24 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", background: `${ANIME_COLORS.accent}40`, border: `1px solid ${ANIME_COLORS.accent}`, boxShadow: `0 0 12px ${ANIME_COLORS.accent}40`, padding: "5px 18px", borderRadius: 6, fontFamily: displayFont, fontSize: "clamp(0.85rem,2vw,1.1rem)", letterSpacing: "0.12em", color: ANIME_COLORS.text, backdropFilter: "blur(4px)" }}>ALL SOLO EVENTS</div>
                        <div style={{ display: "inline-flex", alignItems: "center", background: `${ANIME_COLORS.secondary}40`, border: `1px solid ${ANIME_COLORS.secondary}`, boxShadow: `0 0 12px ${ANIME_COLORS.secondary}40`, padding: "5px 18px", borderRadius: 6, fontFamily: displayFont, fontSize: "clamp(0.85rem,2vw,1.1rem)", letterSpacing: "0.12em", color: ANIME_COLORS.text, backdropFilter: "blur(4px)" }}>DJ NIGHT</div>
                        <div style={{ display: "inline-flex", alignItems: "center", background: `${ANIME_COLORS.primary}40`, border: `1px solid ${ANIME_COLORS.primary}`, boxShadow: `0 0 12px ${ANIME_COLORS.primary}40`, padding: "5px 18px", borderRadius: 6, fontFamily: displayFont, fontSize: "clamp(0.85rem,2vw,1.1rem)", letterSpacing: "0.12em", color: ANIME_COLORS.text, backdropFilter: "blur(4px)" }}>CONCERT</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
                        <AnimeButton href="/aakar-elite-pass" bg={ANIME_COLORS.accent} fg={ANIME_COLORS.text}>VIEW PASS</AnimeButton>
                        <AnimeButton href="/" bg={ANIME_COLORS.secondary} fg={ANIME_COLORS.text}>GO HOME</AnimeButton>
                    </div>
                </AnimeCardWrapper>
            </main>
        </div>
    );
}
