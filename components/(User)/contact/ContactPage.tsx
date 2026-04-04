import Link from "next/link";
import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
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

export default function ContactPage() {
  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
        @keyframes cpIn {
          from { opacity:0; transform:translateY(22px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes cpBarGrow {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        .cp-card {
          animation: cpIn 0.45s cubic-bezier(.25,.8,.25,1) both;
        }
        .cp-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(0.75rem,1.6vw,0.9rem);
          letter-spacing: 0.06em;
          color: ${ANIME_COLORS.text};
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.15s, color 0.15s;
        }
        .cp-link:hover { border-bottom-color: ${ANIME_COLORS.primary}; color: ${ANIME_COLORS.secondary}; }
      `}</style>

      {/* Anime Background Layers */}
      <AnimeOrbField />
      <AnimeParticleField />

      <main style={{ position:"relative", minHeight:"100vh", overflow:"hidden" }}>

        <div style={{
          position: "relative", zIndex: 6,
          maxWidth: 860,
          margin: "0 auto",
          padding: "clamp(4rem,10vh,7rem) clamp(1rem,4vw,2.5rem) clamp(3rem,8vh,5rem)",
        }}>

          {/* ── heading ── */}
          <div style={{ textAlign:"center", marginBottom:"clamp(2.5rem,6vh,4rem)" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:28, height:2, background:ANIME_COLORS.primary, boxShadow:`0 0 8px ${ANIME_COLORS.primary}40` }}/>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"clamp(0.55rem,1.2vw,0.7rem)", letterSpacing:"0.4em", color:ANIME_COLORS.secondary }}>AAKAR 2026</span>
              <div style={{ width:28, height:2, background:ANIME_COLORS.secondary, boxShadow:`0 0 8px ${ANIME_COLORS.secondary}40` }}/>
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(3rem,9vw,6.5rem)",
              lineHeight: 0.9, letterSpacing: "0.06em",
              color: ANIME_COLORS.text,
              textShadow: `0 0 30px ${ANIME_COLORS.primary}45, -3px -3px 0 ${ANIME_COLORS.primary}, 3px 3px 0 ${ANIME_COLORS.secondary}`,
              margin: 0,
            }}>
              <AnimeGlitchText text="CONTACT">
                CONTACT
              </AnimeGlitchText><br/>
              <AnimeGlitchText text="US">
                US
              </AnimeGlitchText>
            </h1>

            <div style={{
              height: 2, background: `linear-gradient(90deg, ${ANIME_COLORS.primary}, ${ANIME_COLORS.secondary})`,
              boxShadow: `0 0 12px ${ANIME_COLORS.primary}40`,
              margin: "14px auto 0",
              width: "clamp(60px,14vw,120px)",
              animation: "cpBarGrow 0.5s ease both",
              transformOrigin: "center",
            }}/>
          </div>

          {/* ── grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(1rem,2.5vw,1.8rem)",
            marginBottom: "clamp(1.8rem,4vh,2.8rem)",
          }}>

            {/* general info card */}
            <AnimeCardWrapper 
              accentIndex={0}
              className="cp-card"
              style={{
                animationDelay: "0.05s",
                padding: "clamp(1.2rem,3vw,2rem)",
              }}
            >
              {/* top bar */}
              <div style={{ height:2, background:`linear-gradient(90deg,${ANIME_COLORS.primary}, ${ANIME_COLORS.secondary})`, marginBottom:16, animation:"cpBarGrow 0.4s ease both", transformOrigin:"left" }}/>

              <AnimeSectionHeading index={0}>GENERAL INFO</AnimeSectionHeading>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { icon:<FaEnvelope size={16}/>, label:"Email", href:"mailto:aakar2025@ajiet.edu.in", text:"aakar2025@ajiet.edu.in", accent:ANIME_COLORS.primary },
                  { icon:<FaPhone size={16}/>,    label:"Phone", href:"tel:+919611829800",           text:" +91 96118 29800",        accent:ANIME_COLORS.secondary },
                  { icon:<FaInstagram size={16}/>,label:"Instagram", href:"https://www.instagram.com/aakar__2025/", text:"@aakar_25", accent:ANIME_COLORS.accent },
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{
                      width:36, height:36, flexShrink:0,
                      background:item.accent + "20",
                      border:`1px solid ${item.accent}`,
                      boxShadow:`0 0 8px ${item.accent}40, inset 0 0 4px ${item.accent}20`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:item.accent,
                      borderRadius: 6,
                      backdropFilter: "blur(4px)"
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"0.75rem", letterSpacing:"0.2em", color:"rgba(255,255,255,0.6)", marginBottom:1 }}>{item.label}</div>
                      <Link href={item.href} className="cp-link" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {item.text}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </AnimeCardWrapper>

            {/* address card */}
            <AnimeCardWrapper 
              accentIndex={1}
              className="cp-card"
              style={{
                animationDelay: "0.12s",
                padding: "clamp(1.2rem,3vw,2rem)",
              }}
            >
              <div style={{ height:2, background:`linear-gradient(90deg,${ANIME_COLORS.secondary}, ${ANIME_COLORS.purple})`, marginBottom:16, animation:"cpBarGrow 0.4s 0.1s ease both", transformOrigin:"left" }}/>

              <AnimeSectionHeading index={1}>COLLEGE ADDRESS</AnimeSectionHeading>

              <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <div style={{
                  width:36, height:36, flexShrink:0,
                  background:ANIME_COLORS.accent + "20",
                  border:`1px solid ${ANIME_COLORS.accent}`,
                  boxShadow:`0 0 8px ${ANIME_COLORS.accent}40, inset 0 0 4px ${ANIME_COLORS.accent}20`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:ANIME_COLORS.accent,
                  borderRadius: 6,
                  backdropFilter: "blur(4px)"
                }}><FaMapMarkerAlt size={16}/></div>

                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(0.95rem,2vw,1.15rem)", letterSpacing:"0.06em", color:ANIME_COLORS.text, margin:0, lineHeight:1.3 }}>
                    AJ INSTITUTE OF ENGINEERING<br/>AND TECHNOLOGY
                  </p>
                  <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"clamp(0.68rem,1.4vw,0.8rem)", color:"rgba(255,255,255,0.7)", margin:0, lineHeight:1.6, letterSpacing:"0.03em" }}>
                    NH66, Kottara Chowki<br/>Mangaluru, Karnataka — 575006
                  </p>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:22, height:22, background:ANIME_COLORS.primary + "20", border:`1px solid ${ANIME_COLORS.primary}`, display:"flex", alignItems:"center", justifyContent:"center", borderRadius: 4, color:ANIME_COLORS.primary }}>
                      <FaPhone size={10}/>
                    </div>
                    <Link href="tel:+918242224477" className="cp-link">+91 824 222 4477</Link>
                  </div>
                </div>
              </div>
            </AnimeCardWrapper>
          </div>

          {/* ── map ── */}
          <AnimeCardWrapper 
            accentIndex={2}
            className="cp-card"
            style={{
              animationDelay: "0.2s",
            }}
          >
            <div style={{ padding:"clamp(1rem,2.5vw,1.5rem) clamp(1.2rem,3vw,2rem) 0" }}>
              <div style={{ height:2, background:`linear-gradient(90deg,${ANIME_COLORS.accent}, ${ANIME_COLORS.mint})`, marginBottom:14, animation:"cpBarGrow 0.4s 0.18s ease both", transformOrigin:"left" }}/>
              <AnimeSectionHeading index={2}>FIND US ON MAP</AnimeSectionHeading>
            </div>

            <div style={{ position:"relative", overflow:"hidden" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.963363458579!2d74.82941331519004!3d12.91579839089306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35b1e29f2d89b%3A0x2d662ae00671be23!2sAJ%20Institute%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="380"
                style={{ display:"block", border:"none", borderTop:`1px solid ${ANIME_COLORS.accent}` }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AJIET Location"
              />
              {/* anime corner tag */}
              <div style={{
                position:"absolute", top:12, left:12,
                background:ANIME_COLORS.secondary + "80",
                border:`1px solid ${ANIME_COLORS.secondary}`,
                boxShadow:`0 0 8px ${ANIME_COLORS.secondary}40`,
                padding:"3px 12px",
                fontFamily:"'Share Tech Mono',monospace",
                fontSize:"0.7rem", letterSpacing:"0.2em",
                color:ANIME_COLORS.text,
                pointerEvents:"none",
                backdropFilter: "blur(4px)",
                borderRadius: 4
              }}>AJIET · MANGALURU</div>
            </div>
          </AnimeCardWrapper>

        </div>
      </main>
    </>
  );
}