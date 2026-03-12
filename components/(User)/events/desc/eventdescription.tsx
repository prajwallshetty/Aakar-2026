"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Wallet, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

/* ─── palette ────────────────────────────────────────────────────────── */
const P = {
  yellow:  "#ffff00",
  yellow2: "#fff500",
  magenta: "#ff00ff",
  cyan:    "#00ffff",
  hot:     "#ff0066",
  black:   "#0a0005",
  white:   "#ffffff",
};

/* ─── starburst path ─────────────────────────────────────────────────── */
function starburstPath(cx: number, cy: number, outerR: number, innerR: number, spikes = 18) {
  let d = "";
  for (let i = 0; i < spikes * 2; i++) {
    const r   = i % 2 === 0 ? outerR : innerR;
    const ang = (Math.PI / spikes) * i - Math.PI / 2;
    const x   = cx + r * Math.cos(ang);
    const y   = cy + r * Math.sin(ang);
    d += (i === 0 ? "M" : "L") + `${x},${y}`;
  }
  return d + "Z";
}

/* ─── shared pop-art background ─────────────────────────────────────── */
function PopArtBackground() {
  const speedLines = Array.from({ length: 48 }, (_, i) => (360 / 48) * i);

  return (
    <>
      {/* diagonal stripes */}
      <div aria-hidden style={{
        position:"fixed", inset:0, zIndex:0,
        backgroundImage:`repeating-linear-gradient(45deg,${P.yellow} 0px,${P.yellow} 18px,${P.yellow2} 18px,${P.yellow2} 36px)`,
      }}/>
      {/* halftone dots */}
      <div aria-hidden style={{
        position:"fixed", inset:0, zIndex:1,
        backgroundImage:`radial-gradient(circle,rgba(0,0,0,0.18) 1.8px,transparent 1.8px)`,
        backgroundSize:"14px 14px",
      }}/>
      {/* radial speed lines */}
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:2,pointerEvents:"none",opacity:0.07}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
        {speedLines.map((angle,i) => {
          const rad = (angle * Math.PI) / 180;
          return <line key={i} x1="50" y1="50" x2={50+80*Math.cos(rad)} y2={50+80*Math.sin(rad)} stroke={P.black} strokeWidth="0.3"/>;
        })}
      </svg>
      {/* corner triangle blocks */}
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:3,pointerEvents:"none"}}>
        <polygon points="0,0 180,0 0,160"    fill={P.magenta} opacity="0.28"/>
        <polygon points="100%,0 calc(100% - 180px),0 100%,160" fill={P.cyan} opacity="0.28"/>
        <polygon points="0,100% 160,100% 0,calc(100% - 140px)" fill={P.hot} opacity="0.26"/>
        <polygon points="100%,100% calc(100% - 160px),100% 100%,calc(100% - 140px)" fill={P.magenta} opacity="0.26"/>
      </svg>
      {/* corner starbursts */}
      <svg aria-hidden style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:4,pointerEvents:"none"}}>
        <path d={starburstPath(0,    0,    130, 80, 18)} fill={P.magenta} opacity="0.22"/>
        <path d={starburstPath(9999, 0,    110, 70, 18)} fill={P.cyan}    opacity="0.22" transform="translate(-9999,0)"/>
        <path d={starburstPath(0,    9999, 120, 75, 18)} fill={P.hot}     opacity="0.20" transform="translate(0,-9999)"/>
        <path d={starburstPath(9999, 9999, 130, 82, 18)} fill={P.magenta} opacity="0.22" transform="translate(-9999,-9999)"/>
      </svg>
      {/* floating shapes */}
      {[
        {top:"12%",left:"1.5%", color:P.magenta, circle:true,  delay:"0s"},
        {top:"28%",right:"1.5%",color:P.cyan,    circle:false, delay:"0.8s"},
        {top:"55%",left:"1.2%", color:P.yellow,  circle:false, delay:"1.4s"},
        {top:"72%",right:"1.2%",color:P.hot,     circle:true,  delay:"2.0s"},
        {top:"42%",left:"1.8%", color:P.cyan,    circle:true,  delay:"2.6s"},
        {top:"85%",right:"1.5%",color:P.magenta, circle:false, delay:"1.1s"},
      ].map((s,i) => (
        <div key={i} aria-hidden style={{
          position:"fixed",
          top:s.top, left:(s as any).left, right:(s as any).right,
          width:26, height:26,
          borderRadius:s.circle?"50%":4,
          transform:s.circle?undefined:"rotate(45deg)",
          background:s.color,
          border:`2.5px solid ${P.black}`,
          boxShadow:`3px 3px 0 ${P.black}`,
          animation:`floatShape 4s ease-in-out infinite`,
          animationDelay:s.delay,
          opacity:0.8, zIndex:5, pointerEvents:"none",
        }}/>
      ))}
      {/* word stamps */}
      {[
        {text:"POW!", top:"9%",  left:"3%",   rot:-12, color:P.magenta},
        {text:"ZAP!", top:"6%",  right:"4%",  rot:10,  color:P.cyan},
        {text:"WOW!", bottom:"8%",left:"4%",  rot:-8,  color:P.hot},
        {text:"BOOM!",bottom:"6%",right:"3%", rot:14,  color:P.yellow},
      ].map((s,i) => (
        <div key={i} aria-hidden style={{
          position:"fixed",
          top:(s as any).top, bottom:(s as any).bottom,
          left:(s as any).left, right:(s as any).right,
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(1.6rem,4vw,2.8rem)",
          letterSpacing:"0.06em",
          color:s.color,
          WebkitTextStroke:`2px ${P.black}`,
          transform:`rotate(${s.rot}deg)`,
          animation:`stampWiggle 3s ease-in-out infinite`,
          opacity:0.5, zIndex:5, pointerEvents:"none", userSelect:"none",
          "--r":`${s.rot}deg`,
        } as React.CSSProperties}>{s.text}</div>
      ))}
    </>
  );
}

/* ─── section card wrapper (white 96% card) ─────────────────────────── */
function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{
      background:"rgba(255,255,255,0.96)",
      border:`3px solid ${P.black}`,
      boxShadow:`6px 6px 0 ${P.black}`,
      borderRadius:16,
      padding:"clamp(1.2rem,3vw,2rem)",
      position:"relative",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── pop-art section heading ────────────────────────────────────────── */
function SectionHeading({ children, color = P.magenta }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      display:"inline-block",
      fontFamily:"'Bebas Neue',sans-serif",
      fontSize:"clamp(1.4rem,3.5vw,2.2rem)",
      letterSpacing:"0.08em",
      color:P.black,
      textShadow:`3px 3px 0 ${color}`,
      WebkitTextStroke:`1px ${P.black}`,
      marginBottom:"1rem",
    }}>{children}</div>
  );
}

/* ─── info row ───────────────────────────────────────────────────────── */
function InfoRow({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:14,
      padding:"10px 16px",
      background:P.white,
      border:`2px solid ${P.black}`,
      boxShadow:`3px 3px 0 ${color}`,
      borderRadius:8,
    }}>
      <span style={{color, flexShrink:0}}>{icon}</span>
      <span className={montserrat.className} style={{
        fontSize:"clamp(0.85rem,1.8vw,1.05rem)",
        color:P.black, fontWeight:600,
      }}>{label}</span>
    </div>
  );
}

/* ─── coordinator card ───────────────────────────────────────────────── */
function CoordinatorCard({ coordinator, accent }: {
  coordinator: { name: string; phone: string };
  accent: string;
}) {
  return (
    <div style={{
      background:P.white,
      border:`2.5px solid ${P.black}`,
      boxShadow:`4px 4px 0 ${accent}`,
      borderRadius:12,
      padding:"1rem 1.2rem",
      transition:"transform 0.15s, box-shadow 0.15s",
    }}
    onMouseEnter={e=>{
      (e.currentTarget as HTMLDivElement).style.transform="translate(-2px,-2px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow=`6px 6px 0 ${accent}`;
    }}
    onMouseLeave={e=>{
      (e.currentTarget as HTMLDivElement).style.transform="";
      (e.currentTarget as HTMLDivElement).style.boxShadow=`4px 4px 0 ${accent}`;
    }}
    >
      {/* accent top bar */}
      <div style={{height:4,background:accent,borderRadius:"4px 4px 0 0",margin:"-1rem -1.2rem 0.8rem",borderBottom:`2px solid ${P.black}`}}/>
      <p className={montserrat.className} style={{
        fontSize:"clamp(1rem,2vw,1.15rem)", fontWeight:700,
        color:P.black, marginBottom:"0.5rem",
      }}>{coordinator.name}</p>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <Phone size={16} style={{color:accent,flexShrink:0}}/>
        <Link href={`tel:${coordinator.phone}`}
          style={{color:P.black, fontFamily:"'Share Tech Mono',monospace", fontSize:"0.9rem", textDecoration:"none"}}
          className="hover:underline"
        >{coordinator.phone}</Link>
      </div>
    </div>
  );
}

function CoordinatorSection({ title, coordinators, accent }: {
  title: string;
  coordinators: Array<{ name: string; phone: string }>;
  accent: string;
}) {
  if (!coordinators.length) return null;
  return (
    <div>
      <div style={{
        display:"inline-flex", alignItems:"center", gap:10,
        marginBottom:"1rem",
        background:accent,
        border:`2px solid ${P.black}`,
        boxShadow:`3px 3px 0 ${P.black}`,
        padding:"4px 16px",
        borderRadius:4,
      }}>
        <span style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(0.9rem,2.2vw,1.2rem)",
          letterSpacing:"0.12em",
          color:P.black,
        }}>{title}</span>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14}}>
        {coordinators.map((c,i) => <CoordinatorCard key={i} coordinator={c} accent={accent}/>)}
      </div>
    </div>
  );
}

/* ─── skeleton ───────────────────────────────────────────────────────── */
const EventDescriptionSkeleton = () => (
  <div style={{position:"relative",zIndex:10,minHeight:"100vh",padding:"clamp(3rem,8vh,6rem) clamp(1rem,4vw,3rem)"}}>
    <div style={{maxWidth:1100, margin:"0 auto", display:"flex", flexDirection:"column", gap:32}}>
      <Card>
        <Skeleton className="h-10 w-2/3 rounded-lg mb-6"/>
        <Skeleton className="h-5 w-full rounded mb-2"/>
        <Skeleton className="h-5 w-5/6 rounded mb-2"/>
        <Skeleton className="h-5 w-4/5 rounded"/>
      </Card>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:24, alignItems:"start"}}>
        <Card style={{display:"flex",flexDirection:"column",gap:16}}>
          {[1,2,3].map(i=><Skeleton key={i} className="h-12 w-full rounded-lg"/>)}
          <Skeleton className="h-12 w-36 rounded-lg mt-2"/>
        </Card>
        <Skeleton className="w-56 aspect-[4/5] rounded-2xl"/>
      </div>
      <Card><Skeleton className="h-8 w-40 rounded mb-4"/><Skeleton className="h-4 w-full rounded mb-2"/><Skeleton className="h-4 w-5/6 rounded"/></Card>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════ */
const EventDescription = ({
  eventData,
  isLoading = false,
}: {
  eventData?: ExtendedEvent | null;
  isLoading?: boolean;
}) => {

  useEffect(() => {
    if (!eventData?.imageUrl) return;
    (async () => {
      const cache = await caches.open("event-image-cache");
      const cached = await cache.match(eventData.imageUrl);
      if (!cached) {
        const response = await fetch(eventData.imageUrl, { mode: "no-cors" });
        cache.put(eventData.imageUrl, response);
      }
    })();
  }, [eventData?.imageUrl]);

  const studentCoordinators = eventData?.studentCoordinators
    ? Array.isArray(eventData.studentCoordinators) ? eventData.studentCoordinators : [eventData.studentCoordinators]
    : [];
  const facultyCoordinators = eventData?.facultyCoordinators
    ? Array.isArray(eventData.facultyCoordinators) ? eventData.facultyCoordinators : [eventData.facultyCoordinators]
    : [];
  const hasCoordinators = studentCoordinators.length > 0 || facultyCoordinators.length > 0;
  const hasRules = Array.isArray(eventData?.rules) && eventData!.rules.length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');
        @keyframes floatShape {
          0%,100% { transform:translateY(0) rotate(0deg); }
          33%      { transform:translateY(-14px) rotate(6deg); }
          66%      { transform:translateY(-6px)  rotate(-4deg); }
        }
        @keyframes stampWiggle {
          0%,100% { transform:rotate(var(--r)) scale(1); }
          50%      { transform:rotate(calc(var(--r)*-0.6)) scale(1.06); }
        }
        @keyframes contentIn {
          0%   { opacity:0; transform:translateY(24px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes imageIn {
          0%   { opacity:0; transform:scale(0.92) rotate(-2deg); }
          100% { opacity:1; transform:scale(1) rotate(0deg); }
        }
        .anim-in   { animation: contentIn 0.5s ease both; }
        .anim-img  { animation: imageIn  0.55s cubic-bezier(.23,1.5,.7,1) both; }
      `}</style>

      {/* fixed bg layers */}
      <PopArtBackground />

      {/* scrollable content above bg */}
      <div style={{position:"relative", zIndex:10, minHeight:"100vh", padding:"clamp(3rem,8vh,6rem) clamp(1rem,5vw,4rem) clamp(3rem,8vh,6rem)"}}>
        <div style={{maxWidth:1100, margin:"0 auto", display:"flex", flexDirection:"column", gap:"clamp(1.5rem,3vh,2.5rem)"}}>

          {isLoading ? <EventDescriptionSkeleton/> : !eventData ? (
            <Card>
              <p style={{textAlign:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:P.black}}>
                Event not found. Please try again later.
              </p>
            </Card>
          ) : (
            <>
              {/* ── HERO ROW ── */}
              <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"clamp(1.2rem,3vw,2rem)", alignItems:"flex-start"}}>

                {/* left: info */}
                <div className="anim-in" style={{flex:"1 1 320px", display:"flex", flexDirection:"column", gap:16}}>

                  {/* event name stamp */}
                  <div style={{
                    fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:"clamp(2.2rem,6vw,4rem)",
                    lineHeight:0.92,
                    letterSpacing:"0.04em",
                    color:P.black,
                    textShadow:`4px 4px 0 ${P.magenta}, 8px 8px 0 ${P.cyan}`,
                    WebkitTextStroke:`1.5px ${P.black}`,
                    marginBottom:"0.3rem",
                  }}>
                    {eventData.eventName}
                  </div>

                  {/* description card */}
                  <Card>
                    <p className={montserrat.className} style={{
                      fontSize:"clamp(0.85rem,1.6vw,1rem)",
                      color:"#1a1a2e",
                      lineHeight:1.75,
                    }}>
                      {eventData.description || "Details revealing soon!"}
                    </p>
                  </Card>

                  {/* info rows */}
                  <div style={{display:"flex", flexDirection:"column", gap:10}}>
                    <InfoRow
                      icon={<Calendar size={20}/>}
                      label={eventData.date ? new Date(eventData.date).toDateString() : "Date revealing soon!"}
                      color={P.hot}
                    />
                    <InfoRow
                      icon={<Clock size={20}/>}
                      label={eventData.time || "Time revealing soon!"}
                      color={P.cyan}
                    />
                    <InfoRow
                      icon={<Wallet size={20}/>}
                      label={eventData.fee ? `₹${eventData.fee}` : "Fee revealing soon!"}
                      color={P.magenta}
                    />
                  </div>

                  {/* CTA */}
                  <div style={{marginTop:8}}>
                    <Link href="/register">
                      <button style={{
                        fontFamily:"'Bebas Neue',sans-serif",
                        fontSize:"clamp(1rem,2vw,1.2rem)",
                        letterSpacing:"0.12em",
                        background:P.black,
                        color:P.yellow,
                        border:`3px solid ${P.black}`,
                        boxShadow:`5px 5px 0 ${P.magenta}`,
                        padding:"10px 32px",
                        cursor:"pointer",
                        borderRadius:4,
                        transition:"transform 0.1s, box-shadow 0.1s",
                      }}
                      onMouseEnter={e=>{
                        (e.currentTarget as HTMLButtonElement).style.transform="translate(-2px,-2px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow=`7px 7px 0 ${P.magenta}`;
                      }}
                      onMouseLeave={e=>{
                        (e.currentTarget as HTMLButtonElement).style.transform="";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow=`5px 5px 0 ${P.magenta}`;
                      }}
                      >
                        ▶ REGISTER NOW
                      </button>
                    </Link>
                  </div>
                </div>

                {/* right: event image */}
                <div className="anim-img" style={{flex:"0 0 clamp(200px,30vw,300px)"}}>
                  <div style={{
                    width:"100%",
                    aspectRatio:"4/5",
                    position:"relative",
                    border:`4px solid ${P.black}`,
                    boxShadow:`8px 8px 0 ${P.black}, 12px 12px 0 ${P.cyan}`,
                    borderRadius:16,
                    overflow:"hidden",
                    background:"#eee",
                  }}>

                    {eventData.imageUrl ? (
                      <div
                        style={{
                          position:"absolute", inset:0,
                          backgroundImage:`url('/events/${eventData.imageUrl}.png')`,
                          backgroundSize:"cover",
                          backgroundPosition:"center",
                        }}
                      />
                    ) : (
                      <div style={{
                        position:"absolute",inset:0,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontFamily:"'Bebas Neue',sans-serif",
                        fontSize:"1.2rem",letterSpacing:"0.1em",color:"#999",
                      }}>EVENT IMAGE</div>
                    )}
                  </div>
                </div>

              </div>

              {/* ── RULES ── */}
              <Card className="anim-in" style={{animationDelay:"0.1s"}}>
                <SectionHeading color={P.hot}>Event Rules</SectionHeading>
                {hasRules ? (
                  <ul style={{display:"flex",flexDirection:"column",gap:10,margin:0,padding:0,listStyle:"none"}}>
                    {eventData.rules.map((rule, i) => (
                      <li key={i} style={{
                        display:"flex",gap:12,alignItems:"flex-start",
                        padding:"8px 12px",
                        background:"rgba(0,0,0,0.03)",
                        borderRadius:6,
                      }}>
                        <span style={{
                          fontFamily:"'Bebas Neue',sans-serif",
                          fontSize:"1rem",color:P.black,opacity:0.4,
                          flexShrink:0,minWidth:24,
                        }}>{String(i+1).padStart(2,"0")}</span>
                        <p className={montserrat.className} style={{
                          fontSize:"clamp(0.82rem,1.5vw,0.95rem)",
                          color:"#1a1a2e",lineHeight:1.6,margin:0,
                        }}>{rule}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={montserrat.className} style={{color:"#888",fontStyle:"italic",textAlign:"center"}}>
                    Rules will be available soon
                  </p>
                )}
              </Card>

              {/* ── COORDINATORS ── */}
              <Card className="anim-in" style={{animationDelay:"0.2s"}}>
                <SectionHeading color={P.cyan}>Coordinators</SectionHeading>
                {hasCoordinators ? (
                  <div style={{display:"flex",flexDirection:"column",gap:24}}>
                    <CoordinatorSection title="Student Coordinators" coordinators={studentCoordinators} accent={P.magenta}/>
                    <CoordinatorSection title="Faculty Coordinators"  coordinators={facultyCoordinators}  accent={P.cyan}/>
                  </div>
                ) : (
                  <p className={montserrat.className} style={{color:"#888",fontStyle:"italic",textAlign:"center"}}>
                    Coordinator information is not available yet
                  </p>
                )}
              </Card>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EventDescription;