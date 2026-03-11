"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";

const EVENT_CATEGORIES = [
    { id: 1, name: "CULTURAL",  href: "/events/cultural",  color: "#ff00ff" },
    { id: 2, name: "TECHNICAL", href: "/events/technical", color: "#00ffff" },
    { id: 3, name: "GAMING",    href: "/events/gaming",    color: "#ff0066" },
    { id: 4, name: "SPECIAL",   href: "/events/special",   color: "#ffff00" },
];

export default function Navbar() {
    const [sidebarOpen,          setSidebarOpen]          = useState(false);
    const [eventsDropdownOpen,   setEventsDropdownOpen]   = useState(false);
    const [mobileEventsExpanded, setMobileEventsExpanded] = useState(false);
    const [scrolled,             setScrolled]             = useState(false);
    const dropdownRef = useRef<HTMLLIElement | null>(null);

    // Scroll detection — add border + slight bg on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [sidebarOpen]);

    // Click outside dropdown
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setEventsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@700&display=swap');

                @keyframes marqueeScroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes popIn {
                    0%   { transform: scale(0) rotate(-6deg); opacity: 0; }
                    70%  { transform: scale(1.04) rotate(1deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes wiggle {
                    0%,100% { transform: rotate(-2deg); }
                    50%     { transform: rotate(2deg); }
                }

                .nav-link {
                    font-family: 'Arial Black', Impact, sans-serif;
                    font-size: 13px;
                    font-weight: 900;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #000;
                    text-decoration: none;
                    padding: 6px 2px;
                    position: relative;
                    transition: color 0.15s;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0;
                    width: 0; height: 3px;
                    background: #ff00ff;
                    transition: width 0.2s;
                }
                .nav-link:hover { color: #ff00ff; }
                .nav-link:hover::after { width: 100%; }

                .register-btn {
                    font-family: 'Arial Black', Impact, sans-serif;
                    font-size: 12px; font-weight: 900;
                    letter-spacing: 3px; text-transform: uppercase;
                    background: #ff0066; color: #fff;
                    border: 3px solid #000;
                    box-shadow: 4px 4px 0 #000;
                    padding: 9px 22px;
                    text-decoration: none;
                    display: inline-block;
                    transition: transform 0.1s, box-shadow 0.1s;
                    cursor: pointer;
                }
                .register-btn:hover  { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #000; color: #fff; }
                .register-btn:active { transform: translate(2px,2px);   box-shadow: 2px 2px 0 #000; }

                .dropdown-item {
                    display: block;
                    font-family: 'Arial Black', Impact, sans-serif;
                    font-size: 11px; font-weight: 900;
                    letter-spacing: 3px; text-transform: uppercase;
                    padding: 10px 16px;
                    text-decoration: none;
                    color: #000;
                    border-bottom: 2px solid #000;
                    transition: background 0.12s, padding-left 0.12s;
                }
                .dropdown-item:last-child { border-bottom: none; }
                .dropdown-item:hover { padding-left: 22px; }

                .sidebar-link {
                    display: block;
                    font-family: 'Arial Black', Impact, sans-serif;
                    font-size: 15px; font-weight: 900;
                    letter-spacing: 3px; text-transform: uppercase;
                    color: #000;
                    text-decoration: none;
                    padding: 12px 0;
                    border-bottom: 3px solid #000;
                    transition: padding-left 0.15s, color 0.15s;
                }
                .sidebar-link:hover { padding-left: 10px; color: #ff00ff; }

                .hamburger-btn {
                    background: #ffff00;
                    border: 3px solid #000;
                    box-shadow: 3px 3px 0 #000;
                    width: 40px; height: 40px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: transform 0.1s, box-shadow 0.1s;
                }
                .hamburger-btn:hover  { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #000; }
                .hamburger-btn:active { transform: translate(1px,1px);   box-shadow: 1px 1px 0 #000; }
            `}</style>

            {/* ── MAIN NAV ─────────────────────────────────────────────────── */}
            <nav
                style={{
                    position: "fixed", top: 0, left: 0, width: "100%", zIndex: 40,
                    background: scrolled ? "#ffff00" : "#ffff00ee",
                    borderBottom: scrolled ? "4px solid #000" : "4px solid #000",
                    boxShadow: scrolled ? "0 4px 0 #000" : "none",
                    transition: "box-shadow 0.3s",
                    backdropFilter: "blur(4px)",
                }}
            >
                {/* ── Top halftone strip ─────────────────────────────────── */}
                <div style={{
                    height: 6,
                    background: "#000",
                    backgroundImage: "repeating-linear-gradient(90deg, #ff00ff 0, #ff00ff 10px, #00ffff 10px, #00ffff 20px, #ffff00 20px, #ffff00 30px, #ff0066 30px, #ff0066 40px, #000 40px, #000 50px)",
                }}/>

                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ background: "#fff", border: "3px solid #000", boxShadow: "3px 3px 0 #000", padding: "4px 10px", display: "inline-block" }}>
                            <Image src="/aj.png" alt="AJIET Logo" width={200} height={50} style={{ maxHeight: 36, width: "auto", display: "block" }} />
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <ul style={{ display: "none", gap: 36, listStyle: "none", margin: 0, padding: 0, alignItems: "center" }} className="md-flex">
                        <li><Link href="/" className="nav-link">Home</Link></li>
                        <li><Link href="/about" className="nav-link">About</Link></li>
                        <li><Link href="/team" className="nav-link">Team</Link></li>

                        {/* Events dropdown */}
                        <li
                            ref={dropdownRef}
                            style={{ position: "relative" }}
                            onMouseEnter={() => setEventsDropdownOpen(true)}
                            onMouseLeave={() => setEventsDropdownOpen(false)}
                        >
                            <button
                                onClick={() => setEventsDropdownOpen(o => !o)}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    display: "flex", alignItems: "center", gap: 6,
                                    fontFamily: "'Arial Black', Impact, sans-serif",
                                    fontSize: 13, fontWeight: 900, letterSpacing: 3,
                                    textTransform: "uppercase", color: "#000",
                                    padding: "6px 2px",
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#ff00ff")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#000")}
                            >
                                Events <FaChevronDown style={{ fontSize: 10, transition: "transform 0.2s", transform: eventsDropdownOpen ? "rotate(180deg)" : "rotate(0)" }} />
                            </button>

                            {/* Dropdown panel */}
                            <div style={{
                                position: "absolute", top: "calc(100% + 8px)", left: 0,
                                width: 190,
                                background: "#ffff00",
                                border: "3px solid #000",
                                boxShadow: "6px 6px 0 #000",
                                transform: eventsDropdownOpen ? "scale(1)" : "scale(0.9)",
                                opacity: eventsDropdownOpen ? 1 : 0,
                                pointerEvents: eventsDropdownOpen ? "auto" : "none",
                                transition: "transform 0.18s cubic-bezier(.175,.885,.32,1.275), opacity 0.15s",
                                transformOrigin: "top left",
                                zIndex: 50,
                                overflow: "hidden",
                            }}>
                                {EVENT_CATEGORIES.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={cat.href}
                                        className="dropdown-item"
                                        onClick={() => setEventsDropdownOpen(false)}
                                        style={{ background: "#ffff00" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = cat.color; e.currentTarget.style.color = cat.color === "#ffff00" ? "#000" : cat.color === "#00ffff" ? "#000" : "#fff"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "#ffff00"; e.currentTarget.style.color = "#000"; }}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    </ul>

                    {/* Desktop CTA */}
                    <div style={{ display: "none" }} className="md-block">
                        <Link href="/register" className="register-btn">
                            🎟 Register
                        </Link>
                    </div>

                    {/* Hamburger */}
                    <button
                        className="hamburger-btn md-hidden"
                        onClick={() => setSidebarOpen(o => !o)}
                        aria-label="Toggle menu"
                        style={{ display: "flex" }}
                    >
                        {sidebarOpen
                            ? <FaTimes  style={{ color: "#000", fontSize: 18 }} />
                            : <FaBars   style={{ color: "#000", fontSize: 18 }} />
                        }
                    </button>
                </div>

                {/* ── Bottom color stripe ─────────────────────────────────── */}
                <div style={{
                    height: 5,
                    background: "repeating-linear-gradient(90deg, #ff00ff 0, #ff00ff 25%, #00ffff 25%, #00ffff 50%, #ff0066 50%, #ff0066 75%, #000 75%, #000 100%)",
                }}/>
            </nav>

            {/* ── Responsive helpers via real CSS ──────────────────────────── */}
            <style>{`
                @media (min-width: 768px) {
                    .md-flex  { display: flex !important; }
                    .md-block { display: block !important; }
                    .md-hidden { display: none !important; }
                }
            `}</style>

            {/* ── SIDEBAR BACKDROP ─────────────────────────────────────────── */}
            <div
                onClick={() => setSidebarOpen(false)}
                style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                    zIndex: 30, opacity: sidebarOpen ? 1 : 0,
                    pointerEvents: sidebarOpen ? "auto" : "none",
                    transition: "opacity 0.3s",
                }}
            />

            {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
            <div
                style={{
                    position: "fixed", top: 0, right: 0,
                    height: "100%", width: 280,
                    background: "#ffff00",
                    borderLeft: "4px solid #000",
                    boxShadow: sidebarOpen ? "-8px 0 0 #000" : "none",
                    zIndex: 40,
                    transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.3s cubic-bezier(.175,.885,.32,1.275)",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* Sidebar top stripe */}
                <div style={{ height: 8, background: "repeating-linear-gradient(90deg, #ff00ff 0, #ff00ff 20%, #00ffff 20%, #00ffff 40%, #ff0066 40%, #ff0066 60%, #ffff00 60%, #ffff00 80%, #000 80%, #000 100%)", flexShrink: 0 }}/>

                {/* Sidebar header */}
                <div style={{ padding: "16px 20px 12px", borderBottom: "3px solid #000", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div style={{ background: "#ff00ff", border: "2px solid #000", boxShadow: "3px 3px 0 #000", padding: "4px 12px" }}>
                        <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 11, fontWeight: 900, letterSpacing: 4, color: "#000" }}>AAKAR 2026</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{ background: "#ff0066", border: "2px solid #000", boxShadow: "2px 2px 0 #000", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                        <FaTimes style={{ color: "#fff", fontSize: 16 }} />
                    </button>
                </div>

                {/* Nav links */}
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px" }}>
                    {[
                        { label: "Home",  href: "/",      color: "#ff00ff" },
                        { label: "About", href: "/about", color: "#00ffff" },
                        { label: "Team",  href: "/team",  color: "#ff0066" },
                    ].map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="sidebar-link"
                            onClick={() => setSidebarOpen(false)}
                            onMouseEnter={e => { e.currentTarget.style.color = item.color; e.currentTarget.style.borderBottomColor = item.color; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "#000"; e.currentTarget.style.borderBottomColor = "#000"; }}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Events accordion */}
                    <div style={{ borderBottom: "3px solid #000" }}>
                        <button
                            onClick={() => setMobileEventsExpanded(o => !o)}
                            style={{
                                width: "100%", background: "none", border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                fontFamily: "'Arial Black', Impact, sans-serif",
                                fontSize: 15, fontWeight: 900, letterSpacing: 3,
                                textTransform: "uppercase", color: "#000",
                                padding: "12px 0",
                                transition: "color 0.15s",
                            }}
                        >
                            Events
                            {mobileEventsExpanded
                                ? <FaChevronDown style={{ fontSize: 12 }} />
                                : <FaChevronRight style={{ fontSize: 12 }} />
                            }
                        </button>

                        <div style={{
                            maxHeight: mobileEventsExpanded ? 280 : 0,
                            overflow: "hidden",
                            transition: "max-height 0.3s ease",
                        }}>
                            {EVENT_CATEGORIES.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={cat.href}
                                    onClick={() => setSidebarOpen(false)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "10px 8px",
                                        fontFamily: "'Arial Black', Impact, sans-serif",
                                        fontSize: 12, fontWeight: 900, letterSpacing: 3,
                                        textTransform: "uppercase",
                                        color: "#000", textDecoration: "none",
                                        borderLeft: `4px solid ${cat.color}`,
                                        marginBottom: 6,
                                        background: "#fff",
                                        boxShadow: "3px 3px 0 #000",
                                        transition: "padding-left 0.15s, background 0.15s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = cat.color; e.currentTarget.style.paddingLeft = "14px"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.paddingLeft = "8px"; }}
                                >
                                    <div style={{ width: 10, height: 10, background: cat.color, border: "2px solid #000", flexShrink: 0 }}/>
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar footer CTA */}
                <div style={{ padding: 20, borderTop: "3px solid #000", flexShrink: 0 }}>
                    <Link
                        href="/register"
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "100%", padding: "14px 0",
                            background: "#ff0066", color: "#fff",
                            border: "3px solid #000", boxShadow: "5px 5px 0 #000",
                            fontFamily: "'Arial Black', Impact, sans-serif",
                            fontSize: 13, fontWeight: 900, letterSpacing: 3,
                            textTransform: "uppercase", textDecoration: "none",
                            transition: "transform 0.1s, box-shadow 0.1s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform="translate(-2px,-2px)"; e.currentTarget.style.boxShadow="7px 7px 0 #000"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="5px 5px 0 #000"; }}
                    >
                        🎟 REGISTER NOW
                    </Link>

                    {/* Bottom color bar */}
                    <div style={{ height: 6, background: "repeating-linear-gradient(90deg,#ff00ff 0,#ff00ff 25%,#00ffff 25%,#00ffff 50%,#ff0066 50%,#ff0066 75%,#000 75%,#000 100%)", marginTop: 16, border: "2px solid #000" }}/>
                </div>
            </div>

            {/* Spacer — same height as nav (6px stripe + 64px bar + 5px stripe) */}
            <div style={{ height: 75 }} />
        </>
    );
}