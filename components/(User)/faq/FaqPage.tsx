"use client";

import { useState } from "react";
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

const faqs = [
  { question: "What is Aakar?", answer: "Aakar is a state-level techno-cultural fest that celebrates innovation, creativity, and talent through a wide array of technical events, cultural showcases, workshops, and competitions." },
  { question: "Who can participate?", answer: "Aakar is open to students from all colleges and disciplines across the state and beyond. Whether you're into coding, design, dance, music, or art—there's something for everyone!" },
  { question: "Is there any registration fee?", answer: "Yes, all events at Aakar have a registration fee. Detailed pricing and event-specific fees can be found on the event page." },
  { question: "Can I participate in multiple events?", answer: "Absolutely! Participants are welcome to register for multiple events, provided there's no clash in timings between them." },
  { question: "Will I receive a certificate for participating?", answer: "Yes, all registered participants will receive digital certificates of participation. Winners and runners-up will receive special certificates, trophies, and exciting prizes!" },
  { question: "What happens if I miss my event?", answer: "Missing a registered event may lead to disqualification from that particular event. We recommend checking the schedule thoroughly and arriving on time." },
  { question: "Will there be food and accommodation for participants?", answer: "Yes. Food stalls and arrangements will be available at the venue. For outstation participants, accommodation can be arranged on prior request—please contact the coordinators for details." },
  { question: "Can I bring my own laptop or project materials?", answer: "Yes, participants are encouraged to bring their own laptops, tools, or materials as per event requirements. Ensure you comply with the guidelines provided for each event." },
  { question: "How will I be notified about updates?", answer: "Participants will receive updates via email, WhatsApp, and SMS. You can also stay informed by following our official Instagram page: @aakar__2025." },
  { question: "Who should I contact for support?", answer: "For any queries or assistance, please contact us at: Email: aakarofficial2025@gmail.com | Phone: +91 9741152696" },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
        @keyframes faqIn {
          from { opacity:0; transform:translateY(20px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes faqOpen {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes faqBarGrow {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        .faq-item {
          animation: faqIn 0.45s cubic-bezier(.25,.8,.25,1) both;
        }
        .faq-answer {
          animation: faqOpen 0.3s cubic-bezier(.25,.8,.25,1) both;
        }
        .faq-row:hover .faq-q {
          color: ${ANIME_COLORS.text} !important;
        }
      `}</style>

      <main style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
      }}>
        <AnimeOrbField />
        <AnimeParticleField />

        <div style={{
          position: "relative", zIndex: 6,
          maxWidth: 780,
          margin: "0 auto",
          padding: "clamp(4rem,10vh,7rem) clamp(1rem,4vw,2.5rem) clamp(3rem,8vh,5rem)",
        }}>

          {/* ── heading ── */}
          <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem,6vh,4rem)" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              marginBottom: 10,
            }}>
              <div style={{ width: 28, height: 4, background: ANIME_COLORS.primary, boxShadow: `0 0 8px ${ANIME_COLORS.primary}40` }}/>
              <span style={{
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: "clamp(0.55rem,1.2vw,0.7rem)",
                letterSpacing: "0.4em",
                color: ANIME_COLORS.secondary,
                textTransform: "uppercase",
              }}>AAKAR 2026</span>
              <div style={{ width: 28, height: 4, background: ANIME_COLORS.secondary, boxShadow: `0 0 8px ${ANIME_COLORS.secondary}40` }}/>
            </div>

            <AnimeCardWrapper accentIndex={0} style={{ display: "inline-block" }}>
              <h2 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(3rem,9vw,6.5rem)",
                lineHeight: 0.9,
                letterSpacing: "0.06em",
                color: ANIME_COLORS.text,
                textShadow: `0.05em 0.05em 0 ${ANIME_COLORS.primary}, 0.1em 0.1em 0 ${ANIME_COLORS.secondary}`,
                margin: 0,
              }}>
                <AnimeGlitchText text="FREQUENTLY ASKED QUESTIONS">
                  FREQUENTLY ASKED QUESTIONS
                </AnimeGlitchText>
              </h2>
            </AnimeCardWrapper>

            {/* underline */}
            <div style={{
              height: 5,
              background: ANIME_COLORS.primary,
              boxShadow: `0 0 12px ${ANIME_COLORS.primary}40`,
              margin: "14px auto 0",
              width: "clamp(80px,18vw,160px)",
              animation: "faqBarGrow 0.5s ease both",
              transformOrigin: "center",
            }}/>
          </div>

          {/* ── accordion ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {faqs.map((faq, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="faq-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    style={{
                      width: "100%",
                      background: isOpen ? `${ANIME_COLORS.background}40` : `${ANIME_COLORS.background}20`,
                      border: `1px solid ${ANIME_COLORS.primary}`,
                      boxShadow: isOpen
                        ? `0 0 16px ${typeof accent === 'string' ? accent : accent.primary}60`
                        : `0 0 8px ${ANIME_COLORS.primary}40`,
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.22s, box-shadow 0.22s, transform 0.14s",
                      transform: isOpen ? "translate(-2px,-2px)" : "translate(0,0)",
                    }}
                    onMouseEnter={(e: React.MouseEvent) => {
                      if (!isOpen) {
                        (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${typeof accent === 'string' ? accent : accent.primary}60`;
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent) => {
                      if (!isOpen) {
                        (e.currentTarget as HTMLElement).style.transform = "translate(0,0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 8px ${ANIME_COLORS.primary}40`;
                      }
                    }}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {/* left accent dot */}
                    <div style={{
                      width: 12, height: 12, flexShrink: 0,
                      background: typeof accent === 'string' ? accent : accent.primary,
                      border: `1px solid ${ANIME_COLORS.primary}`,
                      boxShadow: isOpen ? `0 0 8px ${typeof accent === 'string' ? accent : accent.primary}40` : "none",
                      transition: "box-shadow 0.2s",
                    }}/>

                    <span
                      className="faq-q"
                      style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: "clamp(1rem,2.4vw,1.3rem)",
                        letterSpacing: "0.08em",
                        color: isOpen ? (typeof accent === 'string' ? accent : accent.primary) : ANIME_COLORS.text,
                        flex: 1,
                        lineHeight: 1.2,
                        transition: "color 0.2s",
                      }}
                    >
                      {faq.question}
                    </span>

                    {/* +/– toggle */}
                    <div style={{
                      width: 28, height: 28, flexShrink: 0,
                      background: isOpen ? (typeof accent === 'string' ? accent : accent.primary) : ANIME_COLORS.primary,
                      border: `1px solid ${ANIME_COLORS.primary}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: "1.2rem",
                      color: isOpen ? ANIME_COLORS.background : ANIME_COLORS.text,
                      transition: "background 0.22s, color 0.22s",
                      boxShadow: isOpen ? `0 0 8px ${typeof accent === 'string' ? accent : accent.primary}40` : "none",
                      flexDirection: "column",
                      lineHeight: 1,
                    }}>
                      {isOpen ? "−" : "+"}
                    </div>
                  </div>

                  {/* answer */}
                  {isOpen && (
                    <div
                      className="faq-answer"
                      style={{
                        background: `${ANIME_COLORS.background}40`,
                        borderLeft: `1px solid ${accent}`,
                        borderRight: `1px solid ${ANIME_COLORS.primary}`,
                        borderBottom: `1px solid ${ANIME_COLORS.primary}`,
                        padding: "16px 20px 18px 24px",
                        boxShadow: `0 0 8px ${ANIME_COLORS.primary}40`,
                        marginTop: -1,
                      }}
                    >
                      {/* accent bar top */}
                      <div style={{
                        height: 3, marginBottom: 12,
                        background: `repeating-linear-gradient(90deg, ${accent} 0, ${accent} 8px, transparent 8px, transparent 12px)`,
                        animation: "faqBarGrow 0.3s ease both",
                        transformOrigin: "left",
                      }}/>
                      <p style={{
                        fontFamily: "'Share Tech Mono',monospace",
                        fontSize: "clamp(0.72rem,1.5vw,0.88rem)",
                        letterSpacing: "0.04em",
                        lineHeight: 1.7,
                        color: ANIME_COLORS.text,
                        margin: 0,
                      }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}