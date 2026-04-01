"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import PopArtBackground, { P, POP_ART_KEYFRAMES } from "@/components/(User)/PopArtBackground";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

/* ─── palette ─────────────────────────────────────────────────── */
/* ─── white card panel ────────────────────────────────────────── */
function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{
      background:"rgba(255,255,255,0.96)",
      border:`3px solid ${P.black}`,
      boxShadow:`6px 6px 0 ${P.black}`,
      borderRadius:16,
      padding:"clamp(1.4rem,3.5vw,2.5rem)",
      position:"relative",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── pop-art section heading ─────────────────────────────────── */
function SectionHeading({ children, color = P.magenta, center = false }: {
  children: React.ReactNode; color?: string; center?: boolean;
}) {
  return (
    <h2 style={{
      fontFamily:"'Bebas Neue',sans-serif",
      fontSize:"clamp(1.8rem,5vw,3.2rem)",
      letterSpacing:"0.05em",
      lineHeight:0.95,
      color:P.black,
      textShadow:`0.08em 0.08em 0 ${color}`,
      WebkitTextStroke:`0.02em ${P.black}`,
      margin:"0 0 1.2rem",
      textAlign:center?"center":"left",
    }}>{children}</h2>
  );
}

/* ─── stat chip ───────────────────────────────────────────────── */
function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{
      display:"inline-flex",alignItems:"center",
      background:color,
      border:`2px solid ${P.black}`,
      boxShadow:`3px 3px 0 ${P.black}`,
      padding:"5px 18px",
      borderRadius:4,
      fontFamily:"'Bebas Neue',sans-serif",
      fontSize:"clamp(0.85rem,2vw,1.1rem)",
      letterSpacing:"0.12em",
      color:P.black,
    }}>{children}</div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <style>{`
        ${POP_ART_KEYFRAMES}
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes popIn {
          0%  { opacity:0; transform:scale(0.88) rotate(-2deg); }
          100%{ opacity:1; transform:scale(1)    rotate(0deg); }
        }
        @keyframes playPulse {
          0%,100%{ transform:scale(1); }
          50%    { transform:scale(1.18); }
        }
        .fade-up  { animation:fadeUp 0.5s ease both; }
        .pop-in   { animation:popIn  0.55s cubic-bezier(.23,1.5,.7,1) both; }
        .play-icon{ animation:playPulse 1.8s ease-in-out infinite; }
        .img-hover{ transition:transform 0.25s ease, box-shadow 0.25s ease; }
        .img-hover:hover{ transform:translate(-3px,-3px); box-shadow:11px 11px 0 ${P.black}, 15px 15px 0 ${P.cyan} !important; }
      `}</style>

      <PopArtBackground />

      <main style={{position:"relative",zIndex:10,padding:"clamp(3rem,8vh,6rem) clamp(1rem,5vw,3rem) clamp(3rem,8vh,5rem)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",gap:"clamp(2rem,4vh,3rem)"}}>

          {/* ── PAGE TITLE ── */}
          <div className="fade-up" style={{textAlign:"center"}}>
            <div style={{
              display:"inline-block",
              background:P.black,color:P.yellow,
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(0.6rem,1.6vw,0.8rem)",
              letterSpacing:"0.4em",
              padding:"4px 20px",
              border:`2px solid ${P.black}`,
              boxShadow:`3px 3px 0 ${P.magenta}`,
              marginBottom:"0.7rem",
            }}>AAKAR 2026</div>
            <div style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(3rem,10vw,7rem)",
              lineHeight:0.88,
              letterSpacing:"0.04em",
              color:P.black,
              textShadow:`0.05em 0.05em 0 ${P.magenta}, 0.1em 0.1em 0 ${P.cyan}`,
              WebkitTextStroke:`0.02em ${P.black}`,
            }}>ABOUT</div>
          </div>

          {/* ── INSTITUTION CARD ── */}
          <Card style={{animationDelay:"0.05s"}} className="fade-up" >
            <SectionHeading color={P.hot}>About Our Institution</SectionHeading>

            <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(1.2rem,3vw,2.5rem)",alignItems:"flex-start"}}>

              {/* video thumbnail */}
              <div
                className="img-hover pop-in"
                style={{
                  flex:"0 0 clamp(240px,42%,480px)",
                  position:"relative",
                  borderRadius:12,
                  overflow:"hidden",
                  border:`3px solid ${P.black}`,
                  boxShadow:`8px 8px 0 ${P.black}, 12px 12px 0 ${P.hot}`,
                  cursor:"pointer",
                  animationDelay:"0.15s",
                }}
                onClick={()=>setIsModalOpen(true)}
              >
                <Image
                  src="/college2.png"
                  width={600} height={400}
                  alt="AJ Institute of Engineering and Technology"
                  style={{width:"100%",height:"auto",display:"block"}}
                />
                {/* play overlay */}
                <div style={{
                  position:"absolute",inset:0,
                  background:"rgba(10,0,5,0.35)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"background 0.25s",
                }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="rgba(10,0,5,0.55)"}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background="rgba(10,0,5,0.35)"}
                >
                  <div className="play-icon" style={{
                    width:60,height:60,borderRadius:"50%",
                    background:P.yellow,
                    border:`3px solid ${P.black}`,
                    boxShadow:`4px 4px 0 ${P.black}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    <FaPlay style={{color:P.black,fontSize:22,marginLeft:3}}/>
                  </div>
                </div>
              </div>

              {/* text */}
              <div style={{flex:"1 1 280px",display:"flex",flexDirection:"column",gap:16}}>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"clamp(1.2rem,3vw,1.8rem)",
                  letterSpacing:"0.04em",
                  color:P.black,
                  lineHeight:1.1,
                }}>AJ Institute of Engineering and Technology</div>

                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  <Chip color={P.yellow}>Est. 2016</Chip>
                  <Chip color={P.cyan}>Kottara, Mangaluru</Chip>
                  <Chip color={P.magenta}>VTU Affiliated</Chip>
                  <Chip color={P.hot}>AICTE Recognised</Chip>
                </div>

                <div className={montserrat.className} style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    "Affiliated to Visvesvaraya Technological University, Belagavi",
                    "Promoted by Laxmi Memorial Education Trust, registered 1991",
                    "Students are at the heart of our institution — every staff member aligns their activities to meet their needs.",
                  ].map((line,i)=>(
                    <p key={i} style={{
                      fontSize:"clamp(0.82rem,1.5vw,0.95rem)",
                      color:"#1a1a2e",
                      lineHeight:1.7,
                      margin:0,
                      paddingLeft:12,
                      borderLeft:`3px solid ${[P.magenta,P.cyan,P.hot][i]}`,
                    }}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* full-width body text */}
            <div className={montserrat.className} style={{
              marginTop:"1.8rem",
              paddingTop:"1.5rem",
              borderTop:`2px dashed rgba(0,0,0,0.12)`,
              display:"flex",flexDirection:"column",gap:14,
            }}>
              {[
                "A J Institute of Engineering & Technology is promoted by Laxmi Memorial Education Trust which was registered in the year 1991 in memory of Late Laxmi Shetty, mother of Dr. A. J. Shetty.",
                "The main objective is to impart high quality theoretical knowledge supported by practical experience to shape students into highly competent professionals and exemplary human beings.",
              ].map((para,i)=>(
                <p key={i} style={{fontSize:"clamp(0.85rem,1.5vw,1rem)",color:"#1a1a2e",lineHeight:1.75,margin:0}}>{para}</p>
              ))}
            </div>
          </Card>

          {/* ── ABOUT AAKAR CARD ── */}
          <Card className="fade-up" style={{animationDelay:"0.12s"}}>
            <SectionHeading color={P.cyan} center>About AAKAR</SectionHeading>

            {/* date + venue chips */}
            <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:"1.8rem"}}>
              <Chip color={P.yellow}>May 20 · 21 · 22, 2025</Chip>
              <Chip color={P.magenta}>AJ Institute, Kottarachowki, Mangaluru</Chip>
            </div>

            <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(1.2rem,3vw,2.5rem)",alignItems:"center"}}>

              {/* body copy */}
              <div style={{flex:"1 1 300px"}}>
                <p className={montserrat.className} style={{
                  fontSize:"clamp(0.85rem,1.5vw,1rem)",
                  color:"#1a1a2e",
                  lineHeight:1.8,
                  margin:0,
                }}>
                  Aakar is a state-level techno-cultural fest that brings together innovation,
                  creativity, and entertainment under one roof. The event aims to push the
                  boundaries of technology and culture, providing a platform for students,
                  professionals, and enthusiasts to showcase their skills and talent. With an
                  exciting mix of technical competitions, cultural performances and interactive
                  sessions.
                </p>

                {/* BRAINS · GUTS · GLORY strip */}
                <div style={{
                  marginTop:"1.4rem",
                  display:"inline-flex",alignItems:"center",gap:10,
                  background:P.black,color:P.yellow,
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"clamp(0.7rem,1.8vw,1rem)",
                  letterSpacing:"0.32em",
                  padding:"6px 20px",
                  border:`2px solid ${P.black}`,
                  boxShadow:`4px 4px 0 ${P.magenta}`,
                }}>▲ BRAINS · GUTS · GLORY ▲</div>
              </div>

              {/* image */}
              <div
                className="img-hover pop-in"
                style={{
                  flex:"0 0 clamp(200px,38%,400px)",
                  borderRadius:12,
                  overflow:"hidden",
                  border:`3px solid ${P.black}`,
                  boxShadow:`8px 8px 0 ${P.black}, 12px 12px 0 ${P.magenta}`,
                  animationDelay:"0.2s",
                }}
              >
                <Image
                  src="/2024.png"
                  width={600} height={400}
                  alt="AAKAR Event"
                  style={{width:"100%",height:"auto",display:"block"}}
                />
              </div>
            </div>
          </Card>

        </div>
      </main>

      {/* ── VIDEO MODAL ── */}
      {isModalOpen && (
        <div
          style={{
            position:"fixed",inset:0,
            background:"rgba(10,0,5,0.88)",
            zIndex:9999,
            display:"flex",alignItems:"center",justifyContent:"center",
            padding:"1rem",
          }}
          onClick={()=>setIsModalOpen(false)}
        >
          <div
            style={{
              background:P.black,
              border:`4px solid ${P.black}`,
              boxShadow:`10px 10px 0 ${P.magenta}`,
              borderRadius:16,
              overflow:"hidden",
              width:"100%",
              maxWidth:860,
            }}
            onClick={e=>e.stopPropagation()}
          >
            {/* modal top bar */}
            <div style={{
              background:P.yellow,
              borderBottom:`3px solid ${P.black}`,
              padding:"6px 16px",
              display:"flex",justifyContent:"space-between",alignItems:"center",
            }}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:"0.12em",color:P.black}}>
                AJ INSTITUTE — CAMPUS TOUR
              </span>
              <button
                onClick={()=>setIsModalOpen(false)}
                style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"0.9rem",letterSpacing:"0.1em",
                  background:"transparent",border:"none",
                  color:P.black,cursor:"pointer",padding:"2px 8px",
                }}
              >CLOSE ✖</button>
            </div>
            <div style={{aspectRatio:"16/9",width:"100%"}}>
              <iframe
                style={{width:"100%",height:"100%",display:"block",border:"none"}}
                src="https://www.youtube.com/embed/3rVNKn6h-Hk?autoplay=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}