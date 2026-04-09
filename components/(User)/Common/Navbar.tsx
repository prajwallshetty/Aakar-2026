"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import {
  Navbar as NavbarWrapper,
  NavBody,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { motion, AnimatePresence } from "motion/react";

const eventCategories = [
  { name: "Cultural", href: "/events/cultural" },
  { name: "Technical", href: "/events/technical" },
  { name: "Gaming", href: "/events/gaming" },
  { name: "Special", href: "/events/special" },
];

export default function Navbar({ visible }: { visible?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Team", link: "/team" },
    { name: "Merch", link: "/merch" },
    { name: "Elite Pass", link: "/aakar-elite-pass" },
  ];

  /* close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && e.target instanceof Node && !dropdownRef.current.contains(e.target)) {
        setEventsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <NavbarWrapper>
        {/* ═══════════ Desktop Navigation ═══════════ */}
        <NavBody>
          {/* Logo — Scales based on scroll state */}
          <Link
            href="/"
            className="relative z-20 mr-4 flex items-center px-2 py-1 shrink-0 transition-transform duration-500 origin-left"
            style={{ 
              transform: visible ? "scale(0.8)" : "scale(1.2) translateY(4px)",
            }}
          >
            <Image
              src="/aj.png"
              alt="AAKAR 2026"
              width={600}
              height={150}
              className="h-auto transition-all duration-300"
              style={{ maxWidth: visible ? "120px" : "220px" }}
              priority
            />
          </Link>

          {/* ── Center Nav Links ── */}
          <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
               "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-1 text-sm font-medium lg:flex transition-all duration-300",
               visible ? "lg:space-x-1" : "lg:space-x-4 ml-12"
            )}
          >
            {navItems.map((item, idx) => (
              <a
                key={`nav-${idx}`}
                href={item.link}
                onMouseEnter={() => setHovered(idx)}
                className={cn(
                  "relative px-4 py-2 transition-all duration-300",
                  visible ? "text-neutral-400 hover:text-white text-[13px]" : "text-white hover:text-[#AE48FF] text-[15px] font-semibold"
                )}
              >
                {hovered === idx && (
                  <motion.div
                    layoutId="hovered"
                    className="absolute inset-0 h-full w-full rounded-full bg-[#6344F5]/15"
                  />
                )}
                <span className="relative z-20">{item.name}</span>
              </a>
            ))}

            {/* Events with dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => { setHovered(navItems.length); setEventsOpen(true); }}
              onMouseLeave={() => { setHovered(null); setEventsOpen(false); }}
            >
              <button
                className={cn(
                  "relative px-4 py-2 transition-all duration-300 flex items-center gap-1.5 cursor-pointer focus:outline-none",
                  visible ? "text-neutral-400 hover:text-white text-[13px]" : "text-white hover:text-[#AE48FF] text-[15px] font-semibold"
                )}
                onClick={() => setEventsOpen(!eventsOpen)}
              >
                {hovered === navItems.length && (
                  <motion.div
                    layoutId="hovered"
                    className="absolute inset-0 h-full w-full rounded-full bg-[#6344F5]/15"
                  />
                )}
                <span className="relative z-20">Events</span>
                <FaChevronDown
                  className={`relative z-20 text-[10px] text-[#AE48FF] transition-transform duration-300 ${eventsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {eventsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
                    style={{
                      background: "rgba(8, 1, 24, 0.98)", // More opaque, no blur for performance
                      border: "1px solid rgba(99, 68, 245, 0.25)",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                    }}
                  >
                    {/* Top accent line */}
                    <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #6344F5, #AE48FF, transparent)" }} />

                    {eventCategories.map((cat, i) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setEventsOpen(false)}
                        className="block px-5 py-3 text-sm text-neutral-400 hover:text-white hover:bg-[#6344F5]/15 transition-all duration-200 border-l-2 border-transparent hover:border-[#AE48FF] hover:pl-6"
                        style={{
                          letterSpacing: "0.06em",
                          borderBottom: i < eventCategories.length - 1 ? "1px solid rgba(99, 68, 245, 0.08)" : "none",
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <NavbarButton href="/register" variant="gradient">
              Register Events
            </NavbarButton>
          </div>
        </NavBody>

        {/* ═══════════ Mobile Navigation ═══════════ */}
        <MobileNav>
          <MobileNavHeader>
            <Link
              href="/"
              className="relative z-20 flex items-center px-2 py-1"
            >
              <Image
                src="/aj.png"
                alt="AAKAR 2026"
                width={400}
                height={100}
                className="h-auto"
                style={{ maxWidth: "160px" }}
              />
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-300 hover:text-white transition-colors w-full py-1"
              >
                <span className="block text-sm font-medium tracking-wide">
                  {item.name}
                </span>
              </a>
            ))}

            {/* Events expandable */}
            <div className="w-full">
              <button
                onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                className="flex items-center justify-between w-full py-1 text-sm font-medium tracking-wide text-neutral-300 hover:text-white transition-colors cursor-pointer focus:outline-none bg-transparent"
              >
                <span>Events</span>
                <FaChevronDown
                  className={`text-[10px] text-[#AE48FF] transition-transform duration-300 ${mobileEventsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${mobileEventsOpen ? "max-h-52 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                <div className="ml-3 space-y-1 border-l border-[#6344F5]/30 pl-4">
                  {eventCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-xs tracking-widest text-neutral-400 hover:text-[#AE48FF] transition-colors duration-200"
                    >
                      {cat.name.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 mt-3">
              <NavbarButton
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="gradient"
                className="w-full"
              >
                Register Events
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarWrapper>

      {/* Spacer for fixed navbar */}
      <div className="pt-16" />
    </div>
  );
}
