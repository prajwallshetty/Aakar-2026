"use client";

import Image from "next/image";
import { useState } from "react";
import { 
  AnimeParticleField, 
  AnimeOrbField, 
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const faqs = [
  { question: "What is Aakar?", answer: "Aakar is a state-level techno-cultural fest that celebrates innovation, creativity, and talent through a wide array of technical quests, cultural showcases, workshops, and boss battles." },
  { question: "Who can join the saga?", answer: "Aakar is open to students from all colleges and disciplines across the state and beyond. Whether you're into coding, design, dance, music, or art—there's a quest for everyone!" },
  { question: "Is there any registration fee?", answer: "Yes, all events at Aakar have a registration fee. Detailed pricing and event-specific fees can be found on the event page." },
  { question: "Can I take on multiple quests?", answer: "Absolutely! You can register for multiple quests, provided there's no clash in timings between them." },
  { question: "Will I earn a reward for participating?", answer: "Yes, all registered participants will receive digital certificates of participation. Winners will level up with special trophies and exciting loot!" },
  { question: "What happens if I miss my quest?", answer: "Missing a registered quest may lead to disqualification from that particular event. We recommend checking the schedule thoroughly and arriving on time." },
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
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes expandDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .animate-item {
          animation: fadeSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .faq-answer-anim {
          animation: expandDown 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
      `}</style>

      <main style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#050505", // deep dark base
      }}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <Image
            src="/bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center", opacity: 0.35 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(5, 5, 5, 0.55) 0%, rgba(5, 5, 5, 0.72) 100%)",
            }}
          />
        </div>
        <AnimeOrbField />
        <AnimeParticleField />

        <div style={{
          position: "relative", zIndex: 6,
          maxWidth: 860,
          margin: "0 auto",
          padding: "clamp(4rem, 10vh, 7rem) clamp(1rem, 5vw, 2.5rem) clamp(3rem, 8vh, 5rem)",
        }}>

          {/* ── clean heading ── */}
          <div style={{ textAlign: "center", marginBottom: "clamp(3rem, 8vh, 5rem)" }} className="animate-item">
            <h1 style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              lineHeight: 1.1,
              letterSpacing: "0.08em",
              color: "#ffffff",
              margin: "0 0 16px 0",
              fontWeight: 400
            }}>
              FREQUENTLY ASKED
              <br/>
              <span style={{ color: ANIME_COLORS.primary }}>QUESTIONS</span>
            </h1>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "clamp(0.8rem, 2vw, 1rem)",
              color: "rgba(255, 255, 255, 0.6)",
              letterSpacing: "0.1em",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.6
            }}>
              EVERYTHING YOU NEED TO KNOW ABOUT YOUR AAKAR ARC.
            </p>
          </div>

          {/* ── redesigned accordion ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="animate-item"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <div
                    onClick={() => setOpen(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      background: isOpen ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      padding: "clamp(1rem, 3vw, 1.5rem) clamp(1.2rem, 4vw, 2rem)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "20px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                    onMouseEnter={(e: React.MouseEvent) => {
                       if(!isOpen) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e: React.MouseEvent) => {
                       if(!isOpen) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <span style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                      letterSpacing: "0.05em",
                      color: isOpen ? ANIME_COLORS.primary : "#ffffff",
                      flex: 1,
                      lineHeight: 1.4,
                      transition: "color 0.3s",
                    }}>
                      {faq.question}
                    </span>

                    <div style={{
                      width: "36px", height: "36px", flexShrink: 0,
                      background: isOpen ? ANIME_COLORS.primary : "transparent",
                      border: `1px solid ${isOpen ? ANIME_COLORS.primary : "rgba(255,255,255,0.2)"}`,
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isOpen ? "#000" : "#fff",
                      transition: "all 0.3s ease",
                      fontSize: "1.4rem",
                      fontWeight: 300,
                    }}>
                      {isOpen ? "−" : "+"}
                    </div>
                  </div>

                  {/* clear answer section */}
                  {isOpen && (
                    <div className="faq-answer-anim" style={{
                      padding: "clamp(1rem, 3vw, 1.5rem) clamp(1.2rem, 4vw, 2rem)",
                      marginTop: "8px",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      backdropFilter: "blur(8px)",
                    }}>
                      <p style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                        letterSpacing: "0.02em",
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.85)",
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