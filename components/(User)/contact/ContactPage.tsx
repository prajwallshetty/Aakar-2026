import Link from "next/link";
import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import {
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

export default function ContactPage() {
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
        .contact-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(0.85rem,2vw,1rem);
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }
        .contact-link:hover { 
          border-bottom-color: ${ANIME_COLORS.primary}; 
          color: #ffffff; 
        }
      `}</style>

      <main style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#050505" }}>
<div style={{
          position: "relative", zIndex: 6,
          maxWidth: 960,
          margin: "0 auto",
          padding: "clamp(4rem, 10vh, 7rem) clamp(1rem, 5vw, 3rem) clamp(3rem, 8vh, 5rem)",
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
              GET IN
              <br />
              <span style={{ color: ANIME_COLORS.primary }}>TOUCH</span>
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
              WE'RE HERE TO HELP. REACH OUT TO US FOR ANY QUERIES.
            </p>
          </div>

          {/* ── responsive grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(1.2rem, 3vw, 2rem)",
            marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
          }}>

            {/* general info card */}
            <div className="animate-item" style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              animationDelay: "0.1s"
            }}>
              <h2 style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                letterSpacing: "0.05em",
                color: "#ffffff",
                margin: "0 0 24px 0",
                fontWeight: 600,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                paddingBottom: "12px"
              }}>
                CONTACT INFO
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {[
                  { icon: <FaEnvelope size={18} />, label: "EMAIL", href: "mailto:aakar2026@ajiet.edu.in", text: "aakar2026@ajiet.edu.in", color: ANIME_COLORS.primary },
                  { icon: <FaPhone size={18} />, label: "PHONE", href: "tel:+919611829800", text: "+91 96118 29800", color: ANIME_COLORS.secondary },
                  { icon: <FaInstagram size={18} />, label: "INSTAGRAM", href: "https://www.instagram.com/aakar__2026/", text: "@aakar_26", color: ANIME_COLORS.accent },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <div style={{
                      width: "42px", height: "42px", flexShrink: 0,
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: item.color,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                        color: "rgba(255, 255, 255, 0.4)",
                        marginBottom: "4px"
                      }}>
                        {item.label}
                      </div>
                      <Link href={item.href} className="contact-link" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {item.text}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* address card */}
            <div className="animate-item" style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              animationDelay: "0.15s"
            }}>
              <h2 style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                letterSpacing: "0.05em",
                color: "#ffffff",
                margin: "0 0 24px 0",
                fontWeight: 600,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                paddingBottom: "12px"
              }}>
                LOCATION
              </h2>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{
                  width: "42px", height: "42px", flexShrink: 0,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: ANIME_COLORS.accent,
                }}>
                  <FaMapMarkerAlt size={18} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <p style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                    color: "#ffffff",
                    margin: 0,
                    lineHeight: 1.5,
                    fontWeight: 500
                  }}>
                    AJ Institute of Engineering<br />and Technology
                  </p>
                  <p style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                    color: "rgba(255, 255, 255, 0.6)",
                    margin: 0,
                    lineHeight: 1.6,
                    letterSpacing: "0.03em"
                  }}>
                    NH66, Kottara Chowki<br />Mangaluru, Karnataka — 575006
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                    <div style={{
                      width: "24px", height: "24px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "6px",
                      color: "rgba(255,255,255,0.8)"
                    }}>
                      <FaPhone size={10} />
                    </div>
                    <Link href="tel:+918242224477" className="contact-link" style={{ fontSize: "0.85rem" }}>
                      +91 824 222 4477
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── map ── */}
          <div className="animate-item" style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            overflow: "hidden",
            animationDelay: "0.2s"
          }}>
            <div style={{
              padding: "clamp(1.2rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 2.5rem)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
            }}>
              <h2 style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
                letterSpacing: "0.05em",
                color: "#ffffff",
                margin: 0,
                fontWeight: 600,
              }}>
                FIND US ON MAP
              </h2>
            </div>

            <div style={{ position: "relative", width: "100%", height: "400px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.963363458579!2d74.82941331519004!3d12.91579839089306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35b1e29f2d89b%3A0x2d662ae00671be23!2sAJ%20Institute%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1700000000000"
                style={{ width: "100%", height: "100%", border: "none" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AJIET Location"
              />
            </div>
          </div>

        </div>
      </main>
    </>
  );
}