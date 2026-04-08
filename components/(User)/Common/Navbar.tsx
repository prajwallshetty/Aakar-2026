"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Montserrat } from "next/font/google";
import { Button } from "@/components/ui/button";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [mobileEventsExpanded, setMobileEventsExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  const eventCategories = [
    { id: 1, name: "CULTURAL", href: "/events/cultural" },
    { id: 2, name: "TECHNICAL", href: "/events/technical" },
    { id: 3, name: "GAMING", href: "/events/gaming" },
    { id: 4, name: "SPECIAL", href: "/events/special" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setEventsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
                @keyframes flicker {
                    0%, 100% { opacity: 1; }
                    92% { opacity: 1; }
                    93% { opacity: 0.85; }
                    94% { opacity: 1; }
                    96% { opacity: 0.9; }
                    97% { opacity: 1; }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes sidebarIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .nav-glow-border::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, #dc2626 20%, #ef4444 50%, #dc2626 80%, transparent 100%);
                    box-shadow: 0 0 12px 2px #dc262680, 0 0 30px 4px #dc262640;
                    animation: flicker 4s infinite;
                }
                .nav-link-underline {
                    position: relative;
                }
                .nav-link-underline::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 0;
                    height: 1.5px;
                    background: linear-gradient(90deg, #dc2626, #ef4444);
                    box-shadow: 0 0 8px #dc2626;
                    transition: width 0.3s ease;
                }
                .nav-link-underline:hover::after {
                    width: 100%;
                }
                .register-btn {
                    position: relative;
                    overflow: hidden;
                    border: 1px solid #dc2626;
                    color: white;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    padding: 8px 28px;
                    transition: all 0.3s ease;
                    background: transparent;
                    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
                }
                .register-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: #dc2626;
                    transform: translateX(-101%);
                    transition: transform 0.3s ease;
                    z-index: 0;
                }
                .register-btn:hover::before {
                    transform: translateX(0);
                }
                .register-btn:hover {
                    box-shadow: 0 0 20px #dc262660, 0 0 40px #dc262630;
                }
                .register-btn span {
                    position: relative;
                    z-index: 1;
                }
                .dropdown-item {
                    position: relative;
                    padding: 10px 20px;
                    color: #9ca3af;
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    transition: all 0.2s ease;
                    border-left: 2px solid transparent;
                }
                .dropdown-item:hover {
                    color: white;
                    background: rgba(220, 38, 38, 0.08);
                    border-left-color: #dc2626;
                    padding-left: 24px;
                }
                .sidebar-link {
                    display: block;
                    padding: 10px 0;
                    color: #9ca3af;
                    font-size: 1rem;
                    letter-spacing: 0.06em;
                    border-bottom: 1px solid rgba(220, 38, 38, 0.08);
                    transition: all 0.25s ease;
                    padding-left: 0;
                }
                .sidebar-link:hover {
                    color: white;
                    padding-left: 12px;
                    border-bottom-color: rgba(220, 38, 38, 0.3);
                }
                .hamburger-btn {
                    width: 36px;
                    height: 36px;
                    border: 1px solid rgba(220, 38, 38, 0.3);
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
                }
                .hamburger-btn:hover {
                    border-color: #dc2626;
                    box-shadow: 0 0 12px #dc262640;
                    background: rgba(220, 38, 38, 0.05);
                }
            `}</style>

      <nav
        className={`
                fixed top-0 left-0 w-full z-40 transition-all duration-500
                ${
                  scrolled
                    ? "bg-black/90 backdrop-blur-md nav-glow-border"
                    : "bg-black"
                }
                ${montserrat.className}
            `}
        style={{ position: "fixed" }}
      >
        <div className="container mx-auto flex items-center justify-between max-w-7xl px-6 py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center max-h-5 relative z-10">
            <Image
              src="/aj.png"
              alt="Logo"
              width={480}
              height={120}
              className="max-w-[80%]"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center space-x-10 lg:space-x-14 text-white text-sm font-semibold tracking-widest uppercase">
            {["Home", "About", "Team", "Merch"].map((item) => (
              <li key={item}>
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="nav-link-underline text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}

            {/* Events Dropdown */}
            <li ref={dropdownRef} className="relative">
              <button
                className={`flex items-center gap-1.5 nav-link-underline text-gray-300 hover:text-white transition-colors duration-200 text-sm font-semibold tracking-widest uppercase cursor-pointer focus:outline-none ${montserrat.className}`}
                onClick={() => setEventsDropdownOpen(!eventsDropdownOpen)}
                onMouseEnter={() => setEventsDropdownOpen(true)}
              >
                Events
                <FaChevronDown
                  className={`text-xs text-red-500 transition-transform duration-300 ${eventsDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`absolute left-0 mt-4 w-44 overflow-hidden transition-all duration-200 origin-top ${eventsDropdownOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}
                style={{
                  background: "rgba(5,5,5,0.97)",
                  border: "1px solid rgba(220,38,38,0.25)",
                  borderTop: "2px solid #dc2626",
                  boxShadow:
                    "0 0 30px rgba(220,38,38,0.15), 0 20px 40px rgba(0,0,0,0.8)",
                  animation: eventsDropdownOpen
                    ? "slideDown 0.2s ease"
                    : "none",
                }}
                onMouseLeave={() => setEventsDropdownOpen(false)}
              >
                {eventCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className="dropdown-item block"
                    onClick={() => setEventsDropdownOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </li>
          </ul>

          {/* Register CTA */}
          <div className="hidden md:block">
            <Link
              href="/register"
              className="register-btn inline-flex items-center text-sm tracking-widest uppercase"
            >
              <span>Join Now</span>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center hamburger-btn z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 md:hidden ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full"} ${montserrat.className}`}
        style={{
          background: "linear-gradient(160deg, #0a0a0a 0%, #0f0303 100%)",
          borderLeft: "1px solid rgba(220,38,38,0.2)",
          boxShadow: "-20px 0 60px rgba(220,38,38,0.08)",
        }}
      >
        <button
          className="absolute top-4 right-4 z-50 h-10 w-10 flex items-center justify-center rounded-md border border-red-700 bg-black/70 text-white hover:border-red-500 hover:bg-black/90 transition-colors duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <FaTimes size={16} />
        </button>

        {/* Sidebar top accent */}
        <div
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #dc2626, transparent)",
            boxShadow: "0 0 12px #dc2626",
          }}
        />

        <div className="flex flex-col h-full">
          <div className="grow overflow-y-auto px-8 pt-20 pb-8">
            <p className="text-red-700 text-xs tracking-[0.3em] uppercase mb-8 font-medium">
              Navigation
            </p>
            <ul className="space-y-1">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Team", href: "/team" },
                { label: "Merch", href: "/merch" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="sidebar-link"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  className={`sidebar-link w-full flex items-center justify-between cursor-pointer focus:outline-none bg-transparent text-sm font-semibold tracking-widest uppercase ${montserrat.className}`}
                  onClick={() => setMobileEventsExpanded(!mobileEventsExpanded)}
                >
                  <span>Events</span>
                  {mobileEventsExpanded ? (
                    <FaChevronDown className="text-red-500 text-xs" />
                  ) : (
                    <FaChevronRight className="text-red-500 text-xs" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${mobileEventsExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="ml-4 mt-1 space-y-1 border-l border-red-900/40 pl-4">
                    {eventCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        className="block py-2 text-xs tracking-widest text-gray-500 hover:text-red-400 transition-colors duration-200"
                        onClick={() => setSidebarOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div
            className="px-8 py-8"
            style={{ borderTop: "1px solid rgba(220,38,38,0.1)" }}
          >
            <Link
              href="/register"
              className="register-btn flex items-center justify-center w-full py-3 text-sm tracking-widest uppercase"
              onClick={() => setSidebarOpen(false)}
            >
              <span>Join the Guild</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-18" />
    </>
  );
}
