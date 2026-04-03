import Link from "next/link";
import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "@/components/(User)/PopArtBackground";

export default function ContactPage() {
  return (
    <>
      <style>{`
        ${POP_ART_KEYFRAMES}
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
          transition: transform 0.14s, box-shadow 0.14s;
        }
        .cp-card:hover {
          transform: translate(-3px,-3px);
        }
        .cp-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(0.75rem,1.6vw,0.9rem);
          letter-spacing: 0.06em;
          color: ${P.black};
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: border-color 0.15s, color 0.15s;
        }
        .cp-link:hover { border-bottom-color: ${P.magenta}; color: ${P.hot}; }
      `}</style>

      <main style={{ position:"relative", minHeight:"100vh", overflow:"hidden" }}>
        <PopArtBackground />

        <div style={{
          position: "relative", zIndex: 6,
          maxWidth: 860,
          margin: "0 auto",
          padding: "clamp(4rem,10vh,7rem) clamp(1rem,4vw,2.5rem) clamp(3rem,8vh,5rem)",
        }}>

          {/* ── heading ── */}
          <div style={{ textAlign:"center", marginBottom:"clamp(2.5rem,6vh,4rem)" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:28, height:4, background:P.black, boxShadow:`2px 2px 0 ${P.hot}` }}/>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"clamp(0.55rem,1.2vw,0.7rem)", letterSpacing:"0.4em", color:P.black }}>AAKAR 2026</span>
              <div style={{ width:28, height:4, background:P.black, boxShadow:`2px 2px 0 ${P.cyan}` }}/>
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(3rem,9vw,6.5rem)",
              lineHeight: 0.9, letterSpacing: "0.06em",
              color: P.black,
              textShadow: `0.05em 0.05em 0 ${P.cyan}, 0.1em 0.1em 0 ${P.hot}`,
              margin: 0,
            }}>CONTACT<br/>US</h1>

            <div style={{
              height: 5, background: P.black,
              boxShadow: `4px 4px 0 ${P.magenta}`,
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
            <div
              className="cp-card"
              style={{
                animationDelay: "0.05s",
                background: P.white,
                border: `3px solid ${P.black}`,
                boxShadow: `6px 6px 0 ${P.black}, 10px 10px 0 ${P.magenta}`,
                padding: "clamp(1.2rem,3vw,2rem)",
              }}
            >
              {/* top bar */}
              <div style={{ height:4, background:`repeating-linear-gradient(90deg,${P.magenta} 0,${P.magenta} 10px,${P.black} 10px,${P.black} 14px)`, marginBottom:16, animation:"cpBarGrow 0.4s ease both", transformOrigin:"left" }}/>

              <h2 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(1.3rem,2.8vw,1.8rem)",
                letterSpacing: "0.1em",
                color: P.black,
                textShadow: `0.08em 0.08em 0 ${P.magenta}`,
                margin: "0 0 18px",
              }}>GENERAL INFO</h2>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { icon:<FaEnvelope size={16}/>, label:"Email", href:"mailto:aakar2025@ajiet.edu.in", text:"aakar2025@ajiet.edu.in", accent:P.magenta },
                  { icon:<FaPhone size={16}/>,    label:"Phone", href:"tel:+919611829800",           text:"+91 96118 29800",        accent:P.cyan  },
                  { icon:<FaInstagram size={16}/>,label:"Instagram", href:"https://www.instagram.com/aakar__2025/", text:"@aakar_25", accent:P.hot },
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{
                      width:36, height:36, flexShrink:0,
                      background:item.accent,
                      border:`2.5px solid ${P.black}`,
                      boxShadow:`2px 2px 0 ${P.black}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:P.black,
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"0.75rem", letterSpacing:"0.2em", color:"rgba(0,0,0,0.45)", marginBottom:1 }}>{item.label}</div>
                      <Link href={item.href} className="cp-link" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {item.text}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* address card */}
            <div
              className="cp-card"
              style={{
                animationDelay: "0.12s",
                background: P.white,
                border: `3px solid ${P.black}`,
                boxShadow: `6px 6px 0 ${P.black}, 10px 10px 0 ${P.cyan}`,
                padding: "clamp(1.2rem,3vw,2rem)",
              }}
            >
              <div style={{ height:4, background:`repeating-linear-gradient(90deg,${P.cyan} 0,${P.cyan} 10px,${P.black} 10px,${P.black} 14px)`, marginBottom:16, animation:"cpBarGrow 0.4s 0.1s ease both", transformOrigin:"left" }}/>

              <h2 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(1.3rem,2.8vw,1.8rem)",
                letterSpacing: "0.1em",
                color: P.black,
                textShadow: `0.08em 0.08em 0 ${P.cyan}`,
                margin: "0 0 18px",
              }}>COLLEGE ADDRESS</h2>

              <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <div style={{
                  width:36, height:36, flexShrink:0,
                  background:P.hot,
                  border:`2.5px solid ${P.black}`,
                  boxShadow:`2px 2px 0 ${P.black}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:P.black,
                }}><FaMapMarkerAlt size={16}/></div>

                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(0.95rem,2vw,1.15rem)", letterSpacing:"0.06em", color:P.black, margin:0, lineHeight:1.3 }}>
                    AJ INSTITUTE OF ENGINEERING<br/>AND TECHNOLOGY
                  </p>
                  <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"clamp(0.68rem,1.4vw,0.8rem)", color:"#333", margin:0, lineHeight:1.6, letterSpacing:"0.03em" }}>
                    NH66, Kottara Chowki<br/>Mangaluru, Karnataka — 575006
                  </p>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:22, height:22, background:P.magenta, border:`2px solid ${P.black}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <FaPhone size={10} color={P.black}/>
                    </div>
                    <Link href="tel:+918242224477" className="cp-link">+91 824 222 4477</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── map ── */}
          <div
            className="cp-card"
            style={{
              animationDelay: "0.2s",
              background: P.white,
              border: `3px solid ${P.black}`,
              boxShadow: `6px 6px 0 ${P.black}, 10px 10px 0 ${P.hot}`,
            }}
          >
            <div style={{ padding:"clamp(1rem,2.5vw,1.5rem) clamp(1.2rem,3vw,2rem) 0" }}>
              <div style={{ height:4, background:`repeating-linear-gradient(90deg,${P.hot} 0,${P.hot} 10px,${P.black} 10px,${P.black} 14px)`, marginBottom:14, animation:"cpBarGrow 0.4s 0.18s ease both", transformOrigin:"left" }}/>
              <h2 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(1.3rem,2.8vw,1.8rem)",
                letterSpacing: "0.1em",
                color: P.black,
                textShadow: `0.08em 0.08em 0 ${P.hot}`,
                margin: "0 0 14px",
              }}>FIND US ON MAP</h2>
            </div>

            <div style={{ position:"relative", overflow:"hidden" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.963363458579!2d74.82941331519004!3d12.91579839089306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35b1e29f2d89b%3A0x2d662ae00671be23!2sAJ%20Institute%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="380"
                style={{ display:"block", border:"none", borderTop:`3px solid ${P.black}` }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AJIET Location"
              />
              {/* pop-art corner tag */}
              <div style={{
                position:"absolute", top:12, left:12,
                background:P.cyan,
                border:`2px solid ${P.black}`,
                boxShadow:`3px 3px 0 ${P.black}`,
                padding:"3px 12px",
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"0.75rem", letterSpacing:"0.2em",
                color:P.black,
                pointerEvents:"none",
              }}>AJIET · MANGALURU</div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}