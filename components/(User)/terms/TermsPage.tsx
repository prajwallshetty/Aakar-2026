"use client";

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

const termsSections = [
  { title: "", content: "Welcome to Aakar! These terms and conditions outline the rules and regulations for the use of our website and participation in the fest." },
  { title: "1. Acceptance of Terms", content: "By accessing this website and registering for events, you agree to be bound by these terms and all applicable laws and regulations." },
  { title: "2. Event Participation", content: "Participants must provide accurate information while registering. The organizing team reserves the right to disqualify entries for misrepresentation or inappropriate behavior." },
  { title: "3. Intellectual Property", content: "All content, including logos, graphics, and event names, are the intellectual property of Aakar and may not be reproduced without permission." },
  { title: "4. Changes to Events", content: "The organizers reserve the right to modify or cancel events without prior notice due to unforeseen circumstances." },
  { title: "5. Code of Conduct", content: "All attendees are expected to maintain respectful behavior throughout the fest. Harassment or misconduct of any form will not be tolerated." },
  { title: "6. Liability", content: "Aakar is not responsible for any loss, damage, or injury incurred during the event, whether on campus or online." },
];

const ACCENT_COLORS = [ANIME_COLORS.accent, ANIME_COLORS.primary, ANIME_COLORS.secondary, ANIME_COLORS.accent, ANIME_COLORS.primary, ANIME_COLORS.secondary, ANIME_COLORS.accent];

export default function TermsPage() {
  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
        @keyframes tpBarGrow {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        .tp-item {
          animation: tpIn 0.45s cubic-bezier(.25,.8,.25,1) both;
        }
        .tp-answer {
          animation: tpOpen 0.3s cubic-bezier(.25,.8,.25,1) both;
        }
      `}</style>

      <main style={{ position:"relative", minHeight:"100vh", overflow:"hidden" }}>
        <AnimeOrbField />
        <AnimeParticleField />

        <div style={{
          position: "relative", zIndex: 6,
          maxWidth: 760,
          margin: "0 auto",
          padding: "clamp(4rem,10vh,7rem) clamp(1rem,4vw,2.5rem) clamp(3rem,8vh,5rem)",
        }}>

          {/* ── heading ── */}
          <div style={{ textAlign:"center", marginBottom:"clamp(2.5rem,6vh,4rem)" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:28, height:4, background:ANIME_COLORS.primary, boxShadow:`0 0 8px ${ANIME_COLORS.primary}40` }}/>
              <span style={{
                fontFamily:"'Share Tech Mono',monospace",
                fontSize:"clamp(0.55rem,1.2vw,0.7rem)",
                letterSpacing:"0.4em",
                color:ANIME_COLORS.secondary,
              }}>AAKAR 2026</span>
              <div style={{ width:28, height:4, background:ANIME_COLORS.secondary, boxShadow:`0 0 8px ${ANIME_COLORS.secondary}40` }}/>
            </div>

            <AnimeCardWrapper accentIndex={0} style={{ display: "inline-block" }}>
              <h1 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize:"clamp(3rem,9vw,6.5rem)",
                lineHeight:0.9,
                letterSpacing:"0.06em",
                color:ANIME_COLORS.text,
                textShadow:`0.05em 0.05em 0 ${ANIME_COLORS.primary}, 0.1em 0.1em 0 ${ANIME_COLORS.secondary}`,
                margin:0,
              }}>
                <AnimeGlitchText text="TERMS & CONDITIONS">
                  TERMS &<br/>CONDITIONS
                </AnimeGlitchText>
              </h1>
            </AnimeCardWrapper>

            <div style={{
              height:5,
              background:ANIME_COLORS.primary,
              boxShadow:`0 0 12px ${ANIME_COLORS.primary}40`,
              margin:"14px auto 0",
              width:"clamp(80px,18vw,160px)",
              animation:"tpBarGrow 0.4s ease both",
              transformOrigin:"center",
            }}/>
          </div>

          {/* ── intro card ── */}
          <AnimeCardWrapper accentIndex={1} style={{
            background: `${ANIME_COLORS.background}40`,
            border: `1px solid ${ANIME_COLORS.primary}`,
            boxShadow: `0 0 16px ${ANIME_COLORS.primary}40`,
            padding: "clamp(1.2rem,3vw,2rem)",
            marginBottom: "clamp(1.8rem,4vh,3rem)",
          }}>
            <div style={{
              height:4,
              background:`repeating-linear-gradient(90deg,${ANIME_COLORS.primary} 0,${ANIME_COLORS.primary} 12px,${ANIME_COLORS.secondary} 12px,${ANIME_COLORS.secondary} 16px)`,
              marginBottom:16,
              animation:"tpBarGrow 0.4s ease both",
              transformOrigin:"left",
            }}/>
            <p style={{
              fontFamily:"'Share Tech Mono',monospace",
              fontSize:"clamp(0.75rem,1.6vw,0.9rem)",
              lineHeight:1.8,
              color:ANIME_COLORS.text,
              margin:0,
              letterSpacing:"0.03em",
            }}>{termsSections[0].content}</p>
          </AnimeCardWrapper>

          {/* ── sections ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {termsSections.slice(1).map((item, i) => {
              const accent = ACCENT_COLORS[(i + 1) % ACCENT_COLORS.length];
              return (
                <div
                  key={i}
                  className="tp-section"
                >
                  <div
                    style={{
                      animationDelay:`${i * 0.06}s`,
                      background: `${ANIME_COLORS.background}40`,
                      border: `1px solid ${ANIME_COLORS.primary}`,
                      borderLeft: `3px solid ${accent}`,
                      boxShadow: `0 0 12px ${ANIME_COLORS.primary}40`,
                      padding: "clamp(1rem,2.5vw,1.6rem) clamp(1.2rem,3vw,2rem)",
                      position: "relative",
                      transition: "transform 0.14s, box-shadow 0.14s",
                    }}
                    onMouseEnter={(e: React.MouseEvent) => {
                      (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${accent}60`;
                    }}
                    onMouseLeave={(e: React.MouseEvent) => {
                      (e.currentTarget as HTMLElement).style.transform = "";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${ANIME_COLORS.primary}40`;
                    }}
                  >
                    <AnimeCardWrapper accentIndex={i} style={{
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                      padding: 0,
                    }}>
                      {/* number badge */}
                      <div style={{
                        position:"absolute", top:-3, right:16,
                        background: accent,
                        border: `1px solid ${ANIME_COLORS.primary}`,
                        boxShadow: `0 0 8px ${accent}40`,
                        padding:"2px 10px",
                        fontFamily:"'Bebas Neue',sans-serif",
                        fontSize:"0.8rem",
                        letterSpacing:"0.15em",
                        color:ANIME_COLORS.background,
                      }}>0{i + 1}</div>

                      <h2 style={{
                        fontFamily:"'Bebas Neue',sans-serif",
                        fontSize:"clamp(1.1rem,2.5vw,1.5rem)",
                        letterSpacing:"0.08em",
                        color:ANIME_COLORS.text,
                        textShadow:`0.08em 0.08em 0 ${accent}`,
                        margin:"0 0 10px",
                        lineHeight:1.1,
                      }}>{item.title}</h2>

                      <p style={{
                        fontFamily:"'Share Tech Mono',monospace",
                        fontSize:"clamp(0.72rem,1.5vw,0.86rem)",
                        lineHeight:1.75,
                        letterSpacing:"0.03em",
                        color:ANIME_COLORS.text,
                        margin:0,
                      }}>{item.content}</p>
                    </AnimeCardWrapper>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}