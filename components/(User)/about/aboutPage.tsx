"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { 
  AnimeCardWrapper, 
  AnimeSectionHeading, 
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS,
  AnimeOrbField,
  AnimeParticleField 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import CharacterDecoration from "@/components/(User)/Common/CharacterDecoration";

import { cinzelFont } from "@/lib/font";
const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

/* ─── palette ─────────────────────────────────────────────────── */
/* ─── Anime Card Component ─────────────────────────────────── */
function AnimeAboutCard({ children, accentIndex = 1, style, className, idLabel }: { 
  children: React.ReactNode; 
  accentIndex?: number;
  style?: React.CSSProperties; 
  className?: string;
  idLabel?: string;
}) {
  return (
    <AnimeCardWrapper 
      accentIndex={accentIndex} 
      className={`anime-about-card ${className || ''}`}
      style={{
        padding: "clamp(1.4rem,3.5vw,2.5rem)",
        margin: "0",
        position: "relative",
        ...style
      }}
    >
      {/* Corner Brackets */}
      <div className="about-bracket tl" />
      <div className="about-bracket tr" />
      <div className="about-bracket bl" />
      <div className="about-bracket br" />
      
      {idLabel && <div className="about-id-tag">{idLabel}</div>}

      <div style={{
        position: "relative",
        zIndex: 10,
        color: ANIME_COLORS.text
      }}>
        {children}
      </div>
    </AnimeCardWrapper>
  );
}

/* ─── Anime Section Heading ─────────────────────────────────── */
function AnimeAboutSectionHeading({ children, center = false, index = 1 }: {
  children: React.ReactNode; center?: boolean; index?: number;
}) {
  return (
    <AnimeSectionHeading index={index}>
      {children}
    </AnimeSectionHeading>
  );
}

/* ─── Anime Stat Chip ──────────────────────────────────────────── */
function AnimeChip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{
      display:"inline-flex",alignItems:"center",
      background:color + "20",
      border:`1px solid ${color}`,
      boxShadow:`0 0 12px ${color}40, inset 0 0 8px ${color}20`,
      padding:"4px 16px",
      borderRadius:6,
      fontFamily:"'Share Tech Mono',monospace",
      fontSize:"clamp(0.75rem,1.8vw,0.9rem)",
      letterSpacing:"0.1em",
      color:color,
      textTransform:"uppercase",
      backdropFilter:"blur(4px)"
    }}>
      <span style={{
        width:"4px",height:"4px",borderRadius:"50%",
        background:color,
        marginRight:"8px",
        boxShadow:`0 0 6px ${color}`
      }} />
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}
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
        .anime-about-text strong {
          color: ${ANIME_COLORS.secondary};
        }

        /* Atmospheric Decorative Elements */
        .hero-side-label {
          writing-mode: vertical-rl;
          font-family: 'Cinzel', serif;
          font-size: 8px;
          letter-spacing: 0.6em;
          text-transform: uppercase;
          color: #ffffff;
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          pointer-events: none;
        }

        .scan-line {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px);
          animation: scanMove 8s linear infinite; z-index: 5;
        }
        @keyframes scanMove { from { background-position: 0 0; } to { background-position: 0 100%; } }

        .about-bracket {
          position: absolute; width: 15px; height: 15px; z-index: 20;
          opacity: 0.4; transition: opacity 0.3s, scale 0.3s;
        }
        .about-bracket.tl { top: 12px; left: 12px; border-top: 1.5px solid ${ANIME_COLORS.secondary}; border-left: 1.5px solid ${ANIME_COLORS.secondary}; }
        .about-bracket.tr { top: 12px; right: 12px; border-top: 1.5px solid ${ANIME_COLORS.secondary}; border-right: 1.5px solid ${ANIME_COLORS.secondary}; }
        .about-bracket.bl { bottom: 12px; left: 12px; border-bottom: 1.5px solid ${ANIME_COLORS.secondary}; border-left: 1.5px solid ${ANIME_COLORS.secondary}; }
        .about-bracket.br { bottom: 12px; right: 12px; border-bottom: 1.5px solid ${ANIME_COLORS.secondary}; border-right: 1.5px solid ${ANIME_COLORS.secondary}; }
        
        .anime-about-card:hover .about-bracket { opacity: 1; scale: 1.1; }

        .about-id-tag {
          position: absolute; top: 12px; right: 40px; z-index: 20;
          font-family: 'Share Tech Mono', monospace; font-size: 8px;
          color: ${ANIME_COLORS.secondary}bb; background: rgba(0,0,0,0.4);
          border: 1px solid ${ANIME_COLORS.secondary}40; padding: 2px 6px;
          border-radius: 4px; letter-spacing: 0.15em;
        }
      `}</style>



      <main className="text-white" style={{
        position:"relative", 
        zIndex:10, 
        padding:"clamp(3rem,8vh,6rem) clamp(1rem,5vw,3rem) clamp(3rem,8vh,5rem)",
        minHeight: "100vh",
        background: "transparent"
      }}>
        <AnimeOrbField />
        <AnimeParticleField />
        <CharacterDecoration 
          image="/character6.png" 
          position={{ bottom: "-2%", left: "-3%" }}
          mobilePosition={{ bottom: "0%", left: "-10%" }}
          opacity={0.16}
          mobileOpacity={0.12}
          size="clamp(200px, 30vw, 500px)"
          mobileSize="180px"
        />
        <div className="scan-line" />
        <div style={{ position: "absolute", inset: 0, zIndex: -1, background: "rgba(0,0,0,0.15)" }} />

        {/* Global Side Labels - Desktop Only */}
        <div className="hidden xl:block">
          <span className="hero-side-label left-8">Aakar 2026</span>
          <span className="hero-side-label right-8 rotate-180">AJIET · Mangaluru</span>
        </div>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",gap:"clamp(2rem,4vh,3rem)"}}>

          {/* ── PAGE TITLE ── */}
          <div className="fade-up" style={{textAlign:"center"}}>
            <div className={cinzelFont.className} style={{
              fontSize: "clamp(2.5rem, 10vw, 6.5rem)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              background: "linear-gradient(135deg, #fff 0%, #ccc 40%, #AE48FF 70%, #00E5FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              lineHeight: 1.1,
              filter: "drop-shadow(0 0 20px rgba(174,72,255,0.2))",
            }}>
              ABOUT
            </div>
          </div>

          {/* ── INSTITUTION CARD ── */}
          <AnimeAboutCard accentIndex={0} style={{animationDelay:"0.05s"}} className="fade-up" idLabel="DATA_01">
            <AnimeAboutSectionHeading index={0}>About Our Institution</AnimeAboutSectionHeading>

            <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(1.2rem,3vw,2.5rem)",alignItems:"flex-start"}}>

              {/* video thumbnail */}
              <div
                className="img-hover pop-in"
                style={{
                  flex:"0 0 clamp(240px,42%,480px)",
                  position:"relative",
                  borderRadius:12,
                  overflow:"hidden",
                  border:`3px solid ${ANIME_COLORS.secondary}`,
                  boxShadow:`8px 8px 0 ${ANIME_COLORS.secondary}, 12px 12px 0 ${ANIME_COLORS.purple}60`,
                  cursor:"pointer",
                  animationDelay:"0.15s",
                }}
                onClick={()=>setIsModalOpen(true)}
              >
                <Image
                  src="/about.jpg"
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
                    background:ANIME_COLORS.secondary + "40",
                    border:`3px solid ${ANIME_COLORS.secondary}`,
                    boxShadow:`4px 4px 0 ${ANIME_COLORS.secondary}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    backdropFilter:"blur(8px)"
                  }}>
                    <FaPlay style={{color:ANIME_COLORS.secondary,fontSize:22,marginLeft:3}}/>
                  </div>
                </div>
              </div>

              {/* text */}
              <div style={{flex:"1 1 280px",display:"flex",flexDirection:"column",gap:16}}>
                <div style={{
                  fontFamily:"'Cinzel',serif",
                  fontSize:"clamp(1.2rem,3vw,1.8rem)",
                  letterSpacing:"0.04em",
                  color:ANIME_COLORS.text,
                  lineHeight:1.1,
                }}>AJ Institute of Engineering and Technology</div>

                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  <AnimeChip color={ANIME_COLORS.accent}>Est. 2016</AnimeChip>
                  <AnimeChip color={ANIME_COLORS.secondary}>Kottara, Mangaluru</AnimeChip>
                  <AnimeChip color={ANIME_COLORS.purple}>VTU Affiliated</AnimeChip>
                  <AnimeChip color={ANIME_COLORS.primary}>AICTE Recognised</AnimeChip>
                </div>

                <div className={montserrat.className} style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    "Affiliated to Visvesvaraya Technological University, Belagavi",
                    "Promoted by Laxmi Memorial Education Trust, registered 1991",
                    "Students are at the heart of our institution — every staff member aligns their activities to meet their needs.",
                  ].map((line,i)=>(
                    <p key={i} className="anime-about-text" style={{
                      fontSize:"clamp(0.82rem,1.5vw,0.95rem)",
                      lineHeight:1.7,
                      margin:0,
                      paddingLeft:12,
                      borderLeft:`3px solid ${[ANIME_COLORS.purple,ANIME_COLORS.secondary,ANIME_COLORS.primary][i]}`,
                    }}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* full-width body text */}
            <div className={montserrat.className} style={{
              marginTop:"1.8rem",
              paddingTop:"1.5rem",
              borderTop:`1px solid rgba(255,255,255,0.12)`,
              display:"flex",flexDirection:"column",gap:14,
            }}>
              {[
                "A J Institute of Engineering & Technology is promoted by Laxmi Memorial Education Trust which was registered in the year 1991 in memory of Late Laxmi Shetty, mother of Dr. A. J. Shetty.",
                "The main objective is to impart high quality theoretical knowledge supported by practical experience to shape students into highly competent professionals and exemplary human beings.",
              ].map((para,i)=>(
                <p key={i} className="anime-about-text" style={{fontSize:"clamp(0.85rem,1.5vw,1rem)",lineHeight:1.75,margin:0}}>{para}</p>
              ))}
            </div>
          </AnimeAboutCard>

          {/* ── ABOUT AAKAR CARD ── */}
          <AnimeAboutCard accentIndex={3} className="fade-up" style={{animationDelay:"0.12s"}} idLabel="DATA_02">
            <AnimeAboutSectionHeading index={3} center>About AAKAR</AnimeAboutSectionHeading>

            {/* date + venue chips */}
            <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:"1.8rem"}}>
              <AnimeChip color={ANIME_COLORS.accent}>APRIL 24,25 2026</AnimeChip>
              <AnimeChip color={ANIME_COLORS.purple}>AJ Institute, Kottarachowki, Mangaluru</AnimeChip>
            </div>

            <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(1.2rem,3vw,2.5rem)",alignItems:"center"}}>

              {/* body copy */}
              <div style={{flex:"1 1 300px"}}>
                <p className={montserrat.className} style={{
                  fontSize:"clamp(0.85rem,1.5vw,1rem)",
                  lineHeight:1.8,
                  margin:0,
                }}>
                  <span className="anime-about-text">
                    Aakar is a <strong>state-level techno-cultural fest</strong> that brings together innovation,
                    creativity, and entertainment under one roof. The event aims to push the
                    boundaries of technology and culture, providing a platform for students,
                    professionals, and enthusiasts to showcase their skills and talent. With an
                    exciting mix of technical competitions, cultural performances and interactive
                    sessions.
                  </span>
                </p>
              </div>

              {/* image */}
              <div
                className="img-hover pop-in"
                style={{
                  flex:"0 0 clamp(200px,38%,400px)",
                  borderRadius:12,
                  overflow:"hidden",
                  border:`2px solid ${ANIME_COLORS.purple}`,
                  boxShadow:`0 0 20px ${ANIME_COLORS.purple}40`,
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
          </AnimeAboutCard>

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
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{
                borderRadius:16,
                overflow:"hidden",
                width:"100%",
                maxWidth:860,
                background: `${ANIME_COLORS.background}40`,
                border: `1px solid ${ANIME_COLORS.secondary}`,
                boxShadow: `0 0 20px ${ANIME_COLORS.secondary}40`,
              }}
            >
              {/* modal top bar */}
              <div style={{
                background:`${ANIME_COLORS.secondary}20`,
                borderBottom:`1px solid ${ANIME_COLORS.secondary}`,
                padding:"6px 16px",
                display:"flex",justifyContent:"space-between",alignItems:"center",
              }}>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:"1rem",letterSpacing:"0.12em",color:ANIME_COLORS.text}}>
                  AJ INSTITUTE — CAMPUS TOUR
                </span>
                <button
                  onClick={()=>setIsModalOpen(false)}
                  style={{
                    fontFamily:"'Cinzel',serif",
                    fontSize:"0.9rem",letterSpacing:"0.1em",
                    background:"transparent",border:"none",
                    color:ANIME_COLORS.text,cursor:"pointer",padding:"2px 8px",
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