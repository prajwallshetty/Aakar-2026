"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Montserrat } from "next/font/google";
import { Button } from "@/components/ui/button";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const eventCategories = [
  { id: 1, name: "CULTURAL",  href: "/events/cultural"  },
  { id: 2, name: "TECHNICAL", href: "/events/technical" },
  { id: 3, name: "GAMING",    href: "/events/gaming"    },
  { id: 4, name: "SPECIAL",   href: "/events/special"   },
];

export default function Navbar() {
  const [sidebarOpen,          setSidebarOpen]          = useState(false);
  const [eventsDropdownOpen,   setEventsDropdownOpen]   = useState(false);
  const [mobileEventsExpanded, setMobileEventsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [sidebarOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && e.target instanceof Node && !dropdownRef.current.contains(e.target))
        setEventsDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        /* nav link underline */
        .nb-link {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          position: relative;
          transition: color 0.15s;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
        }
        .nb-link::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          width: 0; height: 2px;
          background: #FF00CC;
          transition: width 0.2s;
        }
        .nb-link:hover { color: #FF00CC; }
        .nb-link:hover::after { width: 100%; }

        /* events button */
        .nb-evts {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          color: rgba(255,255,255,0.8);
          font-family: inherit; font-size: inherit; font-weight: inherit;
          padding: 0;
          position: relative;
          transition: color 0.15s;
        }
        .nb-evts::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          width: 0; height: 2px;
          background: #FF00CC;
          transition: width 0.2s;
        }
        .nb-evts:hover { color: #FF00CC; }
        .nb-evts:hover::after { width: 100%; }

        /* sidebar link */
        .nb-sb-link {
          display: block;
          padding: 8px 0;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: color 0.15s, transform 0.2s, padding-left 0.2s;
        }
        .nb-sb-link:hover {
          color: #FF00CC;
          padding-left: 8px;
        }

        @media (min-width: 768px) {
          .md-flex   { display: flex   !important; }
          .md-block  { display: block  !important; }
          .md-hidden { display: none   !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className={montserrat.className}
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", zIndex: 40,
          /* solid black — no glass/blur */
          background: "#000000",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 clamp(16px,4vw,32px)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          height: 96,
        }}>

          {/* logo */}
          <Link href="/" style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
            <Image src="/aj.png" alt="Logo" width={480} height={120}
              style={{ maxWidth:"80%", display:"block" }}
            />
          </Link>

          {/* desktop links */}
          <ul style={{
            display: "none", gap: "clamp(2rem,4vw,4rem)",
            listStyle: "none", margin: 0, padding: 0, alignItems: "center",
          }} className="md-flex">
            {[{l:"Home",h:"/"},{l:"About",h:"/about"},{l:"Team",h:"/team"}].map(i => (
              <li key={i.h}>
                <Link href={i.h} className="nb-link" style={{ fontSize:18, letterSpacing:"0.02em" }}>{i.l}</Link>
              </li>
            ))}

            {/* events dropdown */}
            <li ref={dropdownRef} style={{ position:"relative" }}
              onMouseEnter={() => setEventsDropdownOpen(true)}
              onMouseLeave={() => setEventsDropdownOpen(false)}
            >
              <button
                className="nb-evts"
                style={{ fontSize:18, letterSpacing:"0.02em" }}
                onClick={() => setEventsDropdownOpen(o => !o)}
              >
                Events
                <FaChevronDown style={{
                  fontSize:10,
                  transition:"transform 0.2s",
                  transform: eventsDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                }}/>
              </button>

              <div style={{
                position:"absolute", top:"calc(100% + 12px)", left:0,
                width:190,
                background:"#111",
                border:"1px solid rgba(255,255,255,0.12)",
                boxShadow:"0 8px 32px rgba(0,0,0,0.7)",
                opacity: eventsDropdownOpen ? 1 : 0,
                pointerEvents: eventsDropdownOpen ? "auto" : "none",
                transform: eventsDropdownOpen ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.96)",
                transition:"opacity 0.18s, transform 0.18s cubic-bezier(.175,.885,.32,1.275)",
                zIndex: 50, overflow:"hidden",
              }}>
                {/* neon top line */}
                <div style={{ height:2, background:"linear-gradient(90deg,#FF00CC,#00F5FF,#FF2D6B)" }}/>
                {eventCategories.map(cat => (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    onClick={() => setEventsDropdownOpen(false)}
                    style={{
                      display:"block",
                      padding:"11px 16px",
                      fontSize:13,
                      letterSpacing:"0.12em",
                      fontWeight:700,
                      color:"rgba(255,255,255,0.75)",
                      textDecoration:"none",
                      borderBottom:"1px solid rgba(255,255,255,0.06)",
                      transition:"background 0.12s, color 0.12s, padding-left 0.12s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,0,204,0.1)";
                      (e.currentTarget as HTMLElement).style.color = "#FF00CC";
                      (e.currentTarget as HTMLElement).style.paddingLeft = "22px";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                      (e.currentTarget as HTMLElement).style.paddingLeft = "16px";
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </li>
          </ul>

          {/* register button */}
          <div style={{ display:"none" }} className="md-block">
            <Link
              href="/register"
              style={{
                display:"inline-block",
                padding:"9px 26px",
                background:"#FF2D6B",
                color:"#fff",
                fontFamily:"inherit",
                fontSize:14,
                fontWeight:700,
                letterSpacing:"0.1em",
                textDecoration:"none",
                border:"2px solid #FF2D6B",
                transition:"background 0.15s, color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#FF00CC";
                (e.currentTarget as HTMLElement).style.borderColor = "#FF00CC";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "#FF2D6B";
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.borderColor = "#FF2D6B";
              }}
            >
              REGISTER
            </Link>
          </div>

          {/* hamburger */}
          <button
            className="md-hidden"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              display:"flex",
              background:"none", border:"none", cursor:"pointer",
              color:"rgba(255,255,255,0.8)",
              fontSize:22, padding:4,
            }}
          >
            {sidebarOpen ? <FaTimes/> : <FaBars/>}
          </button>
        </div>
      </nav>

      {/* ── BACKDROP ── */}
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          position:"fixed", inset:0,
          background:"rgba(0,0,0,0.6)",
          zIndex:30,
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition:"opacity 0.3s",
        }}
      />

      {/* ── SIDEBAR ── */}
      <div
        className={montserrat.className}
        style={{
          position:"fixed", top:0, right:0,
          height:"100%", width:264,
          background:"#0a0a0a",
          borderLeft:"1px solid rgba(255,255,255,0.1)",
          zIndex:40,
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition:"transform 0.3s cubic-bezier(.175,.885,.32,1.275)",
          display:"flex", flexDirection:"column",
        }}
      >
        {/* top accent line */}
        <div style={{ height:3, background:"linear-gradient(90deg,#FF00CC,#00F5FF,#FF2D6B)" }}/>

        {/* header */}
        <div style={{
          padding:"16px 20px",
          borderBottom:"1px solid rgba(255,255,255,0.08)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexShrink:0,
        }}>
          <span style={{ fontSize:11, letterSpacing:"0.35em", color:"rgba(255,255,255,0.4)" }}>
            AAKAR 2026
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.6)", fontSize:18, display:"flex" }}
          >
            <FaTimes/>
          </button>
        </div>

        {/* links */}
        <div style={{ flex:1, overflowY:"auto", padding:"8px 20px 20px" }}>
          {[{l:"Home",h:"/"},{l:"About",h:"/about"},{l:"Team",h:"/team"}].map(item => (
            <Link
              key={item.h}
              href={item.h}
              className="nb-sb-link"
              onClick={() => setSidebarOpen(false)}
              style={{
                fontSize:16, fontWeight:700, letterSpacing:"0.06em",
                borderBottom:"1px solid rgba(255,255,255,0.07)",
              }}
            >{item.l}</Link>
          ))}

          {/* events accordion */}
          <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={() => setMobileEventsExpanded(o => !o)}
              style={{
                width:"100%", background:"none", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"10px 0",
                color:"rgba(255,255,255,0.8)",
                fontSize:16, fontWeight:700, letterSpacing:"0.06em",
                fontFamily:"inherit",
                transition:"color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color="#FF00CC")}
              onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.8)")}
            >
              Events
              {mobileEventsExpanded
                ? <FaChevronDown  style={{ fontSize:11, color:"#FF00CC" }}/>
                : <FaChevronRight style={{ fontSize:11, color:"#FF00CC" }}/>
              }
            </button>
            <div style={{
              maxHeight: mobileEventsExpanded ? 260 : 0,
              overflow:"hidden",
              transition:"max-height 0.3s ease",
            }}>
              {eventCategories.map(cat => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display:"block",
                    padding:"9px 0 9px 14px",
                    fontSize:13, fontWeight:700, letterSpacing:"0.1em",
                    color:"rgba(255,255,255,0.6)",
                    textDecoration:"none",
                    borderLeft:"3px solid rgba(255,0,204,0.3)",
                    marginBottom:6,
                    transition:"color 0.15s, border-color 0.15s, padding-left 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color="#FF00CC";
                    (e.currentTarget as HTMLElement).style.borderLeftColor="#FF00CC";
                    (e.currentTarget as HTMLElement).style.paddingLeft="20px";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.6)";
                    (e.currentTarget as HTMLElement).style.borderLeftColor="rgba(255,0,204,0.3)";
                    (e.currentTarget as HTMLElement).style.paddingLeft="14px";
                  }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ padding:"16px 20px 24px", borderTop:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }}>
          <Link
            href="/register"
            onClick={() => setSidebarOpen(false)}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              width:"100%", padding:"13px 0",
              background:"#FF2D6B", color:"#fff",
              fontFamily:"inherit", fontSize:14, fontWeight:700,
              letterSpacing:"0.1em",
              textDecoration:"none", textTransform:"uppercase",
              border:"2px solid #FF2D6B",
              transition:"background 0.15s, color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background="transparent";
              (e.currentTarget as HTMLElement).style.color="#FF00CC";
              (e.currentTarget as HTMLElement).style.borderColor="#FF00CC";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background="#FF2D6B";
              (e.currentTarget as HTMLElement).style.color="#fff";
              (e.currentTarget as HTMLElement).style.borderColor="#FF2D6B";
            }}
          >
            REGISTER NOW
          </Link>
        </div>
      </div>

      {/* spacer */}
      <div style={{ height: 96 }}/>
    </>
  );
}