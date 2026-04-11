"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { IconMenu2, IconX, IconCalendarEvent } from "@tabler/icons-react";
import { AnimeGlitchText } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const eventCategories = [
  { name: "Cultural", href: "/events/cultural" },
  { name: "Technical", href: "/events/technical" },
  { name: "Gaming", href: "/events/gaming" },
  { name: "Special", href: "/events/special" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [visible, setVisible] = useState<boolean>(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

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
      <motion.div
        className="fixed inset-x-0 top-0 z-40 w-full"
      >
        {/* ═══════════ Desktop Navigation ═══════════ */}
        <motion.div
          animate={{
            boxShadow: visible
              ? "0 0 24px rgba(99, 68, 245, 0.12), 0 1px 1px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(99, 68, 245, 0.1)"
              : "none",
            width: visible ? "75%" : "100%",
            y: visible ? 20 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 50,
          }}
          className={cn(
            "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-6 py-2 lg:flex transition-colors duration-300",
            visible && "bg-[#0a0118]/95 border border-[#6344F5]/30 backdrop-blur-md shadow-lg"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="relative z-20 mr-4 flex items-center px-2 py-1 shrink-0 transition-transform duration-500 origin-left"
            style={{ 
              transform: visible ? "scale(0.85)" : "scale(1.15) translateY(4px)",
            }}
          >
            <Image
              src="/aj.png"
              alt="AAKAR 2026"
              width={600}
              height={150}
              className="h-auto transition-all duration-300"
              style={{ maxWidth: visible ? "120px" : "180px" }}
              priority
            />
          </Link>

          {/* ── Center Nav Links ── */}
          <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
               "absolute inset-0 hidden flex-1 flex-row items-center justify-center text-sm font-medium lg:flex transition-all duration-300",
               visible ? "lg:space-x-1" : "lg:space-x-4 ml-12"
            )}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`nav-${idx}`}
                href={item.link}
                onMouseEnter={() => setHovered(idx)}
                className={cn(
                  "relative px-4 py-2 transition-all duration-300 whitespace-nowrap",
                  visible ? "text-neutral-400 hover:text-white text-[13px]" : "text-white hover:text-[#18CCFC] text-[15px] font-semibold tracking-wide"
                )}
              >
                {hovered === idx && (
                  <motion.div
                    layoutId="hovered"
                    className="absolute inset-0 h-full w-full rounded-full bg-[#6344F5]/15"
                  />
                )}
                <span className="relative z-20">{item.name}</span>
              </Link>
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
                  "relative px-4 py-2 transition-all duration-300 flex items-center gap-1.5 cursor-pointer focus:outline-none whitespace-nowrap",
                  visible ? "text-neutral-400 hover:text-white text-[13px]" : "text-white hover:text-[#18CCFC] text-[15px] font-semibold tracking-wide"
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
                  className={`relative z-20 text-[10px] text-[#18CCFC] transition-transform duration-300 ${eventsOpen ? "rotate-180" : ""}`}
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
                      background: "rgba(8, 1, 24, 0.95)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(99, 68, 245, 0.3)",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                    }}
                  >
                    {/* Top accent line */}
                    <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #6344F5, #18CCFC, transparent)" }} />

                    {eventCategories.map((cat, i) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setEventsOpen(false)}
                        className="block px-5 py-3 text-sm text-neutral-400 hover:text-white hover:bg-[#6344F5]/15 transition-all duration-200 border-l-2 border-transparent hover:border-[#18CCFC] hover:pl-6 tracking-wide"
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

          {/* CTA Desktop */}
          <div className="flex items-center gap-3 ml-auto z-20">
            {/* Schedule Download Button */}
            <motion.a
              href="/event_schedule.pdf"
              download="event_schedule.pdf"
              initial="initial"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center justify-center rounded-md border border-[#18CCFC]/50 bg-transparent text-[#18CCFC] transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(24,204,252,0.1)] hover:shadow-[0_0_15px_rgba(24,204,252,0.3)] hover:border-[#18CCFC] overflow-hidden whitespace-nowrap",
                visible ? "px-2.5 py-2" : "px-3 py-2.5"
              )}
            >
              <IconCalendarEvent className={visible ? "w-4 h-4 shrink-0" : "w-5 h-5 shrink-0"} />
              <motion.span
                variants={{
                  initial: { width: 0, opacity: 0, marginLeft: 0 },
                  hover: { width: "auto", opacity: 1, marginLeft: 10 }
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-[11px] font-mono font-bold uppercase tracking-widest overflow-hidden"
              >
                Schedule
              </motion.span>
            </motion.a>

            <Link href="/register" style={{ textDecoration: "none" }}>
              <motion.button
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative group overflow-hidden rounded-md border border-[#6344F5]/50 bg-transparent text-white font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(99,68,245,0.1)] hover:shadow-[0_0_20px_rgba(99,68,245,0.4)] hover:border-[#6344F5]",
                  visible ? "px-4 py-2 text-[13px]" : "px-5 py-2.5 text-[15px]"
                )}
              >
                {/* Fill effect layer */}
                <motion.div
                  variants={{
                    initial: { x: "-100%" },
                    hover: { x: "0%" }
                  }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                  className="absolute inset-0 bg-[#6344F5] z-[0]"
                />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Register</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* ═══════════ Mobile Navigation ═══════════ */}
        <motion.div
           animate={{
            boxShadow: visible
              ? "0 0 24px rgba(99, 68, 245, 0.12), 0 1px 1px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(99, 68, 245, 0.1)"
              : "none",
            width: visible ? "calc(100% - 2rem)" : "100%",
            borderRadius: visible ? "8px" : "0px",
            y: visible ? 10 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 50,
          }}
          className={cn(
            "relative z-50 mx-auto w-full flex-col items-center justify-between bg-transparent px-4 py-3 flex lg:hidden transition-all duration-300",
            visible && "bg-[#0a0118]/95 border border-[#6344F5]/30 backdrop-blur-md shadow-lg"
          )}
        >
          <div className="flex w-full flex-row items-center justify-between z-20">
            <Link
              href="/"
              className="flex items-center shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/aj.png"
                alt="AAKAR 2026"
                width={400}
                height={100}
                className="h-auto transition-all duration-300"
                style={{ maxWidth: visible ? "110px" : "140px" }}
                priority
              />
            </Link>
            <button className="p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <IconX className="text-white" /> : <IconMenu2 className="text-white" />}
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full overflow-hidden"
              >
                <div className={cn(
                  "flex w-full flex-col items-start justify-start gap-1 pt-6 pb-4",
                  !visible && "px-2"
                )}>
                  {navItems.map((item, idx) => (
                    <Link
                      key={`mobile-link-${idx}`}
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative text-neutral-300 hover:text-white hover:bg-[#6344F5]/20 w-full py-3.5 px-4 rounded-md transition-all border-l-2 border-transparent hover:border-[#18CCFC]"
                    >
                      <span className="block text-sm font-semibold tracking-widest uppercase font-mono">
                        {item.name}
                      </span>
                    </Link>
                  ))}

                  {/* Events expandable */}
                  <div className="w-full mt-1">
                    <button
                      onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                      className="flex items-center justify-between w-full py-3.5 px-4 text-sm font-semibold tracking-widest uppercase font-mono text-neutral-300 hover:text-white transition-all cursor-pointer focus:outline-none bg-transparent hover:bg-[#6344F5]/20 rounded-md border-l-2 border-transparent hover:border-[#18CCFC]"
                    >
                      <span>Events</span>
                      <FaChevronDown
                        className={`text-[12px] text-[#18CCFC] transition-transform duration-300 ${mobileEventsOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ${mobileEventsOpen ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                      <div className="ml-4 space-y-1 mb-2 border-l border-[#6344F5]/30 pl-4 py-2">
                        {eventCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-2.5 px-2 text-[11px] font-mono tracking-widest text-neutral-400 hover:text-[#18CCFC] hover:bg-[#6344F5]/10 transition-colors duration-200 rounded-sm"
                          >
                            {cat.name.toUpperCase()}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-2 mt-5 px-1">
                    <motion.a
                      href="/event_schedule.pdf"
                      download="event_schedule.pdf"
                      initial="initial"
                      animate="hover"
                      whileTap={{ scale: 0.95 }}
                      className="relative flex items-center justify-center p-3 rounded-md border border-[#18CCFC]/50 bg-transparent text-[#18CCFC] cursor-pointer shadow-[0_0_10px_rgba(24,204,252,0.1)] hover:shadow-[0_0_15px_rgba(24,204,252,0.3)] hover:border-[#18CCFC] transition-all duration-300 overflow-hidden whitespace-nowrap"
                    >
                      <IconCalendarEvent className="w-5 h-5 shrink-0" />
                      <motion.span
                        variants={{
                          initial: { width: 0, opacity: 0, marginLeft: 0 },
                          hover: { 
                            width: "auto", 
                            opacity: 1, 
                            marginLeft: 8,
                            transition: { delay: 0.5, duration: 0.4, ease: "easeOut" }
                          }
                        }}
                        className="text-[10px] font-mono font-bold uppercase tracking-wider overflow-hidden"
                      >
                        Schedule
                      </motion.span>
                    </motion.a>
                    <Link href="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <motion.button
                        initial="initial"
                        whileHover="hover"
                        whileTap={{ scale: 0.95 }}
                        className="relative group overflow-hidden w-full text-center justify-center flex py-3 rounded-md border border-[#6344F5]/50 bg-transparent text-white font-semibold tracking-wide cursor-pointer shadow-[0_0_15px_rgba(99,68,245,0.1)] hover:shadow-[0_0_20px_rgba(99,68,245,0.4)] hover:border-[#6344F5] transition-all duration-300"
                      >
                         {/* Fill effect layer */}
                         <motion.div
                          variants={{
                            initial: { x: "-100%" },
                            hover: { x: "0%" }
                          }}
                          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                          className="absolute inset-0 bg-[#6344F5] z-[0]"
                        />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">Register</span>
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Spacer for fixed navbar (Hidden on landing page) */}
      {pathname !== "/" && <div className="pt-24" />}
    </div>
  );
}
