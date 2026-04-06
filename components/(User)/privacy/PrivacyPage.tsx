"use client";

import Image from "next/image";

import { 
  AnimeParticleField, 
  AnimeOrbField, 
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const privacy = [
  { title: "", content: "At Aakar, we are committed to protecting your privacy. This policy explains how your personal information is collected, used, and safeguarded." },
  { title: "Information We Collect", content: "We may collect personal information such as your name, email address, phone number, college name, and selected events during registration." },
  { title: "Use of Information", content: "Your data will be used only for fest-related communication, verification, and updates. We will never sell or share your information with third parties." },
  { title: "Data Security", content: "We take appropriate measures to protect your data from unauthorized access, alteration, or disclosure." },
  { title: "Third-Party Links", content: "Our website may contain links to external websites. We are not responsible for their privacy practices or content." },
  { title: "Consent", content: "By using our website and registering for Aakar, you consent to our privacy policy." },
  { title: "Changes to This Policy", content: "We may update this privacy policy occasionally. All changes will be reflected on this page with the updated date." },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .animate-item {
          animation: fadeSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
      `}</style>

      <main style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#050505" }}>
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
              PRIVACY
              <br/>
              <span style={{ color: ANIME_COLORS.secondary }}>POLICY</span>
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
              PROTECTING YOUR DATA AT AAKAR 2026.
            </p>
          </div>

          {/* ── intro card ── */}
          <div className="animate-item" style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            marginBottom: "2rem",
            animationDelay: "0.1s"
          }}>
            <p style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              lineHeight: 1.8,
              color: "rgba(255, 255, 255, 0.85)",
              margin: 0,
            }}>
              {privacy[0].content}
            </p>
          </div>

          {/* ── sections ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {privacy.slice(1).map((item, i) => {
              return (
                <div
                  key={i}
                  className="animate-item"
                  style={{
                    animationDelay: `${0.15 + i * 0.05}s`,
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderLeft: `3px solid ${ANIME_COLORS.secondary}`,
                    borderRadius: "12px",
                    padding: "clamp(1.2rem, 3.5vw, 2rem)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    transition: "transform 0.3s ease, background 0.3s ease",
                  }}
                  onMouseEnter={(e: React.MouseEvent) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.05)";
                  }}
                  onMouseLeave={(e: React.MouseEvent) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.03)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "clamp(1rem, 2vw, 1.2rem)",
                      color: ANIME_COLORS.secondary,
                      opacity: 0.8
                    }}>
                      0{i + 1}
                    </div>
                    <h2 style={{
                      fontFamily: "'Cinzel',serif",
                      fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                      letterSpacing: "0.05em",
                      color: "#ffffff",
                      margin: 0,
                      fontWeight: 600,
                    }}>
                      {item.title}
                    </h2>
                  </div>

                  <p style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                    lineHeight: 1.8,
                    color: "rgba(255, 255, 255, 0.75)",
                    margin: 0,
                    paddingLeft: "clamp(2rem, 4vw, 2.5rem)"
                  }}>
                    {item.content}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}