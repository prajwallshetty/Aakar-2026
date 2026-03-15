"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";

const EVENT_CATEGORIES = [
  { id:1, name:"CULTURAL",  href:"/events/cultural",  color:"#FF00CC" },
  { id:2, name:"TECHNICAL", href:"/events/technical", color:"#00F5FF" },
  { id:3, name:"GAMING",    href:"/events/gaming",    color:"#FF2D6B" },
  { id:4, name:"SPECIAL",   href:"/events/special",   color:"#BCFF00" },
];

export default function Navbar() {
  const [sidebarOpen,          setSidebarOpen]          = useState(false);
  const [eventsDropdownOpen,   setEventsDropdownOpen]   = useState(false);
  const [mobileEventsExpanded, setMobileEventsExpanded] = useState(false);
  const [scrolled,             setScrolled]             = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [sidebarOpen]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setEventsDropdownOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');

        /* ── register button pulse ── */
        @keyframes nbRegPulse {
          0%,100% { box-shadow:4px 4px 0 #FFE600, 0 0 0   #FF00CC; }
          50%     { box-shadow:4px 4px 0 #FFE600, 0 0 16px #FF00CC88; }
        }

        /* ── dropdown scan shimmer ── */
        @keyframes nbScan {
          from { transform:translateX(-120%); }
          to   { transform:translateX(220%);  }
        }

        /* ── sidebar slide ── */
        @keyframes nbSbIn {
          from { transform:translateX(100%); }
          to   { transform:translateX(0);    }
        }

        /* ── neon underline ── */
        .nb-link, .nb-evts-btn {
          font-family:'Bebas Neue',sans-serif;
          font-size:15px;
          letter-spacing:3px;
          text-transform:uppercase;
          color:rgba(255,255,255,0.72);
          text-decoration:none;
          background:none; border:none; cursor:pointer;
          padding:6px 2px;
          position:relative;
          transition:color 0.15s;
          display:flex; align-items:center; gap:6px;
        }
        .nb-link::after, .nb-evts-btn::after {
          content:'';
          position:absolute; bottom:-2px; left:0;
          width:0; height:3px;
          transition:width 0.22s;
        }
        .nb-link:hover       { color:#FFE600; }
        .nb-link:hover::after { width:100%; background:#FFE600; }

        .nb-evts-btn:hover       { color:#FF00CC; }
        .nb-evts-btn:hover::after { width:100%; background:#FF00CC; }

        /* ── register button ── */
        .nb-reg {
          font-family:'Bebas Neue',sans-serif;
          font-size:13px; letter-spacing:3px; text-transform:uppercase;
          background:#FFE600; color:#000;
          border:2.5px solid #FFE600;
          box-shadow:4px 4px 0 #FFE600;
          padding:9px 24px;
          text-decoration:none; display:inline-block; cursor:pointer;
          animation:nbRegPulse 3s ease-in-out infinite;
          transition:transform 0.1s, box-shadow 0.1s, background 0.1s;
        }
        .nb-reg:hover  {
          background:#000; color:#FFE600;
          transform:translate(-2px,-2px);
          box-shadow:6px 6px 0 #FFE600;
        }
        .nb-reg:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #FFE600; }

        /* ── dropdown item ── */
        .nb-dd-item {
          display:flex; align-items:center; gap:10px;
          font-family:'Bebas Neue',sans-serif;
          font-size:12px; letter-spacing:3px; text-transform:uppercase;
          padding:11px 18px;
          text-decoration:none;
          color:rgba(255,255,255,0.75);
          border-bottom:1px solid rgba(255,255,255,0.06);
          position:relative; overflow:hidden;
          transition:padding-left 0.15s, color 0.12s;
        }
        .nb-dd-item:last-child { border-bottom:none; }
        .nb-dd-item:hover { padding-left:26px; }
        .nb-dd-item::before {
          content:'';
          position:absolute; left:0; top:0; bottom:0; width:3px;
          transform:scaleY(0); transform-origin:center;
          transition:transform 0.15s;
          background:var(--cc,#FF00CC);
        }
        .nb-dd-item:hover::before { transform:scaleY(1); }
        .nb-dd-item::after {
          content:'';
          position:absolute; top:0; left:0;
          width:35%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent);
          transform:translateX(-120%);
        }
        .nb-dd-item:hover::after { animation:nbScan 0.45s ease forwards; }

        /* ── sidebar link ── */
        .nb-sb-link {
          display:block;
          font-family:'Bebas Neue',sans-serif;
          font-size:17px; letter-spacing:3px; text-transform:uppercase;
          color:rgba(255,255,255,0.75); text-decoration:none;
          padding:13px 0;
          border-bottom:1px solid rgba(255,255,255,0.1);
          transition:padding-left 0.15s, color 0.15s;
        }
        .nb-sb-link:hover { padding-left:10px; color:#FFE600; }

        /* ── hamburger ── */
        .nb-ham {
          background:transparent;
          border:2px solid rgba(255,255,255,0.25);
          width:40px; height:40px;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; border-radius:2px;
          transition:border-color 0.15s, background 0.15s;
        }
        .nb-ham:hover {
          border-color:#FFE600;
          background:rgba(255,230,0,0.08);
        }

        @media (min-width:768px) {
          .md-flex   { display:flex  !important; }
          .md-block  { display:block !important; }
          .md-hidden { display:none  !important; }
        }
      `}</style>

      {/* ════════════════════ NAV ════════════════════ */}
      <nav style={{
        position:"fixed", top:0, left:0, width:"100%", zIndex:100,
        background: scrolled ? "#0A0010" : "rgba(5,0,14,0.65)",
        backdropFilter:"blur(14px)",
        WebkitBackdropFilter:"blur(14px)",
        transition:"background 0.35s, box-shadow 0.35s",
        boxShadow: scrolled
          ? "0 2px 0 rgba(255,0,204,0.4), 0 6px 32px rgba(0,0,0,0.8)"
          : "none",
      }}>

        {/* ── top neon stripe — hard pop-art halftone band ── */}
        <div style={{
          height:4,
          background:"repeating-linear-gradient(90deg, #FF00CC 0,#FF00CC 12%, #00F5FF 12%,#00F5FF 24%, #FFE600 24%,#FFE600 36%, #FF2D6B 36%,#FF2D6B 48%, #BCFF00 48%,#BCFF00 60%, #FF00CC 60%,#FF00CC 72%, #00F5FF 72%,#00F5FF 84%, #000 84%,#000 100%)",
          opacity:0.9,
        }}/>

        <div style={{
          maxWidth:1280, margin:"0 auto",
          padding:"0 clamp(16px,4vw,32px)",
          display:"flex", alignItems:"center",
          justifyContent:"space-between",
          height:64,
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display:"flex", alignItems:"center", flexShrink:0, textDecoration:"none" }}>
            <div style={{
              position:"relative",
              border:"2px solid rgba(255,255,255,0.1)",
              padding:"3px 10px",
              background:"rgba(255,255,255,0.03)",
            }}>
              {/* left accent — yellow */}
              <div style={{
                position:"absolute", left:0, top:0, bottom:0, width:3,
                background:"#FFE600",
              }}/>
              <Image
                src="/aj.png"
                alt="AJIET"
                width={200} height={50}
                style={{
                  maxHeight:34, width:"auto", display:"block",
                  filter:"brightness(0) invert(1)",
                }}
              />
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <ul style={{
            display:"none", gap:34,
            listStyle:"none", margin:0, padding:0, alignItems:"center",
          }} className="md-flex">

            {[{l:"Home",h:"/"},{l:"About",h:"/about"},{l:"Team",h:"/team"}].map(i=>(
              <li key={i.h}>
                <Link href={i.h} className="nb-link">{i.l}</Link>
              </li>
            ))}

            {/* ── Events dropdown ── */}
            <li
              ref={dropdownRef}
              style={{position:"relative"}}
              onMouseEnter={()=>setEventsDropdownOpen(true)}
              onMouseLeave={()=>setEventsDropdownOpen(false)}
            >
              <button
                className="nb-evts-btn"
                onClick={()=>setEventsDropdownOpen(o=>!o)}
              >
                Events
                <FaChevronDown style={{
                  fontSize:9,
                  transition:"transform 0.2s",
                  transform:eventsDropdownOpen?"rotate(180deg)":"rotate(0)",
                }}/>
              </button>

              <div style={{
                position:"absolute", top:"calc(100% + 14px)", left:"50%",
                transform: eventsDropdownOpen
                  ? "translateX(-50%) scale(1) translateY(0)"
                  : "translateX(-50%) scale(0.94) translateY(-6px)",
                width:210,
                background:"#0C001E",
                border:"2px solid rgba(255,255,255,0.1)",
                /* hard pop-art outer glow instead of solid shadow */
                boxShadow:`0 0 0 1px #FF00CC44, 4px 4px 0 #FF00CC, 8px 8px 0 rgba(0,245,255,0.25)`,
                opacity:eventsDropdownOpen ? 1 : 0,
                pointerEvents:eventsDropdownOpen ? "auto" : "none",
                transition:"transform 0.18s cubic-bezier(.175,.885,.32,1.275), opacity 0.15s",
                transformOrigin:"top center",
                zIndex:200, overflow:"hidden",
              }}>
                {/* neon top line */}
                <div style={{
                  height:3,
                  background:"repeating-linear-gradient(90deg,#FF00CC 0,#FF00CC 25%,#00F5FF 25%,#00F5FF 50%,#FFE600 50%,#FFE600 75%,#FF2D6B 75%,#FF2D6B 100%)",
                }}/>
                {EVENT_CATEGORIES.map(cat=>(
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className="nb-dd-item"
                    onClick={()=>setEventsDropdownOpen(false)}
                    style={{"--cc":cat.color} as React.CSSProperties}
                    onMouseEnter={e=>{ e.currentTarget.style.color=cat.color; }}
                    onMouseLeave={e=>{ e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}
                  >
                    {/* coloured square dot — pop-art */}
                    <div style={{
                      width:8, height:8, flexShrink:0,
                      background:cat.color,
                      border:"1.5px solid rgba(0,0,0,0.4)",
                      boxShadow:`2px 2px 0 rgba(0,0,0,0.6), 0 0 8px ${cat.color}88`,
                    }}/>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </li>
          </ul>

          {/* ── Register ── */}
          <div style={{display:"none"}} className="md-block">
            <Link href="/register" className="nb-reg">🎟 Register</Link>
          </div>

          {/* ── Hamburger ── */}
          <button
            className="nb-ham md-hidden"
            onClick={()=>setSidebarOpen(o=>!o)}
            aria-label="Toggle menu"
            style={{display:"flex"}}
          >
            {sidebarOpen
              ? <FaTimes style={{color:"#FF2D6B",fontSize:18}}/>
              : <FaBars  style={{color:"rgba(255,255,255,0.8)",fontSize:18}}/>
            }
          </button>
        </div>

        {/* ── bottom thin neon hairline ── */}
        <div style={{
          height:1,
          background:`linear-gradient(90deg,transparent 0%,#FF00CC44 20%,#00F5FF66 50%,#FFE60044 80%,transparent 100%)`,
        }}/>
      </nav>

      {/* ════════════════════ BACKDROP ════════════════════ */}
      <div
        onClick={()=>setSidebarOpen(false)}
        style={{
          position:"fixed", inset:0,
          background:"rgba(0,0,0,0.7)",
          backdropFilter:"blur(4px)",
          zIndex:150,
          opacity:sidebarOpen?1:0,
          pointerEvents:sidebarOpen?"auto":"none",
          transition:"opacity 0.3s",
        }}
      />

      {/* ════════════════════ SIDEBAR ════════════════════ */}
      <div style={{
        position:"fixed", top:0, right:0,
        height:"100%", width:288,
        background:"#080015",
        zIndex:160,
        transform:sidebarOpen?"translateX(0)":"translateX(100%)",
        transition:"transform 0.3s cubic-bezier(.175,.885,.32,1.275)",
        display:"flex", flexDirection:"column",
        overflow:"hidden",
        /* pop-art hard left border */
        borderLeft:"3px solid #FF00CC",
        boxShadow:sidebarOpen?"-4px 0 0 #00F5FF88, -8px 0 40px rgba(0,0,0,0.9)":"none",
      }}>

        {/* top stripe */}
        <div style={{
          height:6, flexShrink:0,
          background:"repeating-linear-gradient(90deg,#FF00CC 0,#FF00CC 20%,#00F5FF 20%,#00F5FF 40%,#FFE600 40%,#FFE600 60%,#FF2D6B 60%,#FF2D6B 80%,#BCFF00 80%,#BCFF00 100%)",
        }}/>

        {/* header */}
        <div style={{
          padding:"14px 20px 12px",
          borderBottom:"1px solid rgba(255,255,255,0.08)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexShrink:0,
        }}>
          <div>
            <div style={{
              display:"inline-block",
              background:"#FF00CC",
              padding:"3px 12px",
              border:"2px solid #FF00CC",
              boxShadow:"3px 3px 0 #FFE600",
            }}>
              <span style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:12, letterSpacing:"0.35em", color:"#000",
              }}>AAKAR 2026</span>
            </div>
            <div style={{
              fontFamily:"'Share Tech Mono',monospace",
              fontSize:"0.5rem", letterSpacing:"0.22em",
              color:"rgba(255,255,255,0.3)", marginTop:3,
            }}>AURORAS OF ADVENTURE</div>
          </div>
          <button
            onClick={()=>setSidebarOpen(false)}
            style={{
              background:"rgba(255,45,107,0.12)",
              border:"1.5px solid #FF2D6B",
              boxShadow:"2px 2px 0 #FF2D6B",
              width:34, height:34,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer",
              transition:"background 0.15s",
            }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,45,107,0.28)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,45,107,0.12)")}
          >
            <FaTimes style={{color:"#FF2D6B",fontSize:15}}/>
          </button>
        </div>

        {/* links */}
        <div style={{flex:1, overflowY:"auto", padding:"4px 22px 20px"}}>
          {[
            {label:"Home",  href:"/",      color:"#FF00CC"},
            {label:"About", href:"/about", color:"#00F5FF"},
            {label:"Team",  href:"/team",  color:"#FF2D6B"},
          ].map(item=>(
            <Link
              key={item.href}
              href={item.href}
              className="nb-sb-link"
              onClick={()=>setSidebarOpen(false)}
              onMouseEnter={e=>{e.currentTarget.style.color=item.color;}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.75)";}}
            >{item.label}</Link>
          ))}

          {/* events accordion */}
          <div style={{borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
            <button
              onClick={()=>setMobileEventsExpanded(o=>!o)}
              style={{
                width:"100%", background:"none", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"space-between",
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:17, letterSpacing:3, textTransform:"uppercase",
                color:"rgba(255,255,255,0.75)", padding:"13px 0",
              }}
              onMouseEnter={e=>(e.currentTarget.style.color="#FFE600")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.75)")}
            >
              Events
              {mobileEventsExpanded
                ? <FaChevronDown  style={{fontSize:11,color:"#FF00CC"}}/>
                : <FaChevronRight style={{fontSize:11,color:"#FF00CC"}}/>
              }
            </button>
            <div style={{maxHeight:mobileEventsExpanded?300:0,overflow:"hidden",transition:"max-height 0.3s ease"}}>
              {EVENT_CATEGORIES.map(cat=>(
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={()=>setSidebarOpen(false)}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"10px 10px",
                    fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:12, letterSpacing:3, textTransform:"uppercase",
                    color:"rgba(255,255,255,0.7)", textDecoration:"none",
                    borderLeft:`3px solid ${cat.color}`,
                    marginBottom:6,
                    background:"rgba(255,255,255,0.03)",
                    boxShadow:`2px 2px 0 ${cat.color}44`,
                    transition:"padding-left 0.15s, background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e=>{
                    e.currentTarget.style.background=`${cat.color}18`;
                    e.currentTarget.style.paddingLeft="16px";
                    e.currentTarget.style.color=cat.color;
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.background="rgba(255,255,255,0.03)";
                    e.currentTarget.style.paddingLeft="10px";
                    e.currentTarget.style.color="rgba(255,255,255,0.7)";
                  }}
                >
                  <div style={{
                    width:8, height:8, background:cat.color, flexShrink:0,
                    boxShadow:`0 0 6px ${cat.color}`,
                    border:"1px solid rgba(0,0,0,0.5)",
                  }}/>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{padding:"16px 20px 20px", borderTop:"1px solid rgba(255,255,255,0.08)", flexShrink:0}}>
          <Link
            href="/register"
            onClick={()=>setSidebarOpen(false)}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              width:"100%", padding:"13px 0",
              background:"#FFE600", color:"#000",
              border:"2.5px solid #FFE600",
              boxShadow:"4px 4px 0 #FFE600, 7px 7px 0 #FF00CC",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:13, letterSpacing:"0.22em", textTransform:"uppercase", textDecoration:"none",
              transition:"transform 0.1s, box-shadow 0.1s, background 0.1s, color 0.1s",
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background="#000";
              e.currentTarget.style.color="#FFE600";
              e.currentTarget.style.transform="translate(-2px,-2px)";
              e.currentTarget.style.boxShadow="6px 6px 0 #FFE600, 10px 10px 0 #FF00CC";
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background="#FFE600";
              e.currentTarget.style.color="#000";
              e.currentTarget.style.transform="";
              e.currentTarget.style.boxShadow="4px 4px 0 #FFE600, 7px 7px 0 #FF00CC";
            }}
          >
            🎟 REGISTER NOW
          </Link>
          <div style={{
            height:3, marginTop:14,
            background:"repeating-linear-gradient(90deg,#FF00CC 0,#FF00CC 25%,#00F5FF 25%,#00F5FF 50%,#FFE600 50%,#FFE600 75%,#FF2D6B 75%,#FF2D6B 100%)",
            opacity:0.6,
          }}/>
        </div>
      </div>

      {/* spacer: 4px strip + 64px bar + 1px = 69px */}
      <div style={{height:69}}/>
    </>
  );
}