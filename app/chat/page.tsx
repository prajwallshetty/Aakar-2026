import Link from "next/link";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "../../components/(User)/PopArtBackground";

export default function ChatPage() {
  return (
    <>
      <style>{`
        ${POP_ART_KEYFRAMES}
        @keyframes panelIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          padding: "clamp(2rem, 5vw, 4rem)",
        }}
      >
        <PopArtBackground />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 760,
            margin: "0 auto",
            minHeight: "calc(100vh - 8rem)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <section
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.97)",
              border: `4px solid ${P.black}`,
              borderRadius: 24,
              boxShadow: `10px 10px 0 ${P.black}, 18px 18px 0 ${P.cyan}`,
              padding: "clamp(1.5rem, 4vw, 3rem)",
              textAlign: "center",
              animation: "panelIn 0.35s ease both",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: P.black,
                color: P.yellow,
                border: `2px solid ${P.black}`,
                boxShadow: `4px 4px 0 ${P.magenta}`,
                padding: "0.35rem 1rem",
                fontFamily: "'Bebas Neue',sans-serif",
                letterSpacing: "0.2em",
                marginBottom: "1rem",
              }}
            >
              AAKAR 2026 CHAT
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                lineHeight: 0.9,
                color: P.black,
                textShadow: `5px 5px 0 ${P.magenta}, 10px 10px 0 ${P.cyan}`,
              }}
            >
              Chat page is ready
            </h1>

            <p
              style={{
                margin: "1rem auto 0",
                maxWidth: 520,
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: P.black,
              }}
            >
              This route is now live for your AAKAR assistant. If you want, I can build the actual chat UI here next.
            </p>

            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "0.8rem", flexWrap: "wrap" }}>
              <Link
                href="/team"
                style={{
                  background: P.yellow,
                  color: P.black,
                  border: `3px solid ${P.black}`,
                  boxShadow: `5px 5px 0 ${P.black}`,
                  padding: "0.8rem 1rem",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontFamily: "'Bebas Neue',sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                Back to Team
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
