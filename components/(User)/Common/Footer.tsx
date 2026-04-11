"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";
import CharacterDecoration from "@/components/(User)/Common/CharacterDecoration";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

/* ── Ember canvas particle system ── */
function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Ember = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      wobble: number;
      wobbleSpeed: number;
    };

    const embers: Ember[] = [];
    const COLORS = [
      "#18ccfc",
      "#6344f5",
      "#ae48ff",
      "#60a5fa",
      "#c084fc",
      "#818cf8",
    ];

    const spawn = (): Ember => {
      const x = Math.random() * canvas.width;
      const maxLife = 90 + Math.random() * 120;
      return {
        x,
        y: canvas.height + 4,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.6 + Math.random() * 1.4),
        life: maxLife,
        maxLife,
        size: 1 + Math.random() * 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.04,
      };
    };

    // Seed initial embers staggered across canvas
    for (let i = 0; i < 60; i++) {
      const e = spawn();
      e.y = canvas.height - Math.random() * canvas.height;
      e.life = Math.random() * e.maxLife;
      embers.push(e);
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new embers
      if (Math.random() < 0.6) embers.push(spawn());

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life--;

        if (e.life <= 0) {
          embers.splice(i, 1);
          continue;
        }

        const progress = e.life / e.maxLife; // 1 → 0 as it ages
        const fadeIn = progress > 0.9 ? (1 - progress) * 10 : 1; // quick fade-in
        const alpha = progress * fadeIn * 0.85;

        e.wobble += e.wobbleSpeed;
        e.x += e.vx + Math.sin(e.wobble) * 0.35;
        e.y += e.vy;

        const r = e.size * (0.5 + progress * 0.5);

        // Glow
        const grd = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r * 4);
        grd.addColorStop(
          0,
          e.color +
            Math.round(alpha * 160)
              .toString(16)
              .padStart(2, "0"),
        );
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(e.x, e.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

/* ── Footer ── */
export default function Footer() {
  return (
    <footer
      className={`relative overflow-hidden text-white ${montserrat.className}`}
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(10,1,24,0.8) 40%, #08001a 100%)",
      }}
    >
      {/* Ember particles */}
      <div className="absolute inset-0 z-0">
        <EmberCanvas />
      </div>

      <CharacterDecoration 
        image="/character3.png" 
        position={{ bottom: "-15%", left: "12%" }}
        mobilePosition={{ bottom: "0%", left: "50%" }}
        width="75%"
        height="100%"
        opacity={0.10}
        mobileOpacity={0.06}
        mobileSize="280px"
        style={{ transform: "translateX(-50%)" }}
      />

      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #6344F5 30%, #18CCFC 50%, #6344F5 70%, transparent 100%)",
          boxShadow:
            "0 0 20px 3px rgba(99,68,245,0.5), 0 0 60px 8px rgba(24,204,252,0.2)",
        }}
      />

      {/* Vignette from bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(8,0,26,0.9) 0%, transparent 100%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-10">
        {/* Logo / Title row */}
        <div className="mb-12 flex flex-col items-center text-center">
          <p
            className="text-4xl font-black tracking-[0.3em] uppercase"
            style={{
              background: "linear-gradient(135deg, #ffffff 30%, #18CCFC 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 18px rgba(24,204,252,0.4))",
            }}
          >
            AAKAR
          </p>
          <p className="text-xs tracking-[0.5em] text-purple-400 uppercase mt-1">
            A New Era Begins · 新たな時代の幕開け
          </p>
          <div
            className="mt-5 w-24 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #6344F5, transparent)",
              boxShadow: "0 0 8px #6344F5",
            }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Explore */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-purple-400 mb-5 font-semibold">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Our Team", href: "/team" },
                { label: "Merch", href: "/merch" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-white text-sm tracking-wide transition-colors duration-200 hover:pl-2 inline-block"
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <span className="text-purple-400 mr-2 opacity-60">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-purple-400 mb-5 font-semibold">
              Events
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Cultural", href: "/events/cultural" },
                { label: "Technical", href: "/events/technical" },
                { label: "Gaming", href: "/events/gaming" },
                { label: "Special", href: "/events/special" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-white text-sm tracking-wide transition-colors duration-200 hover:pl-2 inline-block"
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <span className="text-purple-400 mr-2 opacity-60">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-purple-400 mb-5 font-semibold">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://www.instagram.com/aakar_2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-500 hover:text-white text-sm transition-colors duration-200 group"
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 border border-purple-900/40 group-hover:border-cyan-500 transition-colors duration-200"
                    style={{
                      clipPath:
                        "polygon(3px 0%,100% 0%,calc(100% - 3px) 100%,0% 100%)",
                    }}
                  >
                    <FaInstagram className="text-xs text-purple-400 group-hover:text-cyan-400" />
                  </span>
                  @aakar_2026
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+916282759863"
                  className="flex items-center gap-3 text-gray-500 hover:text-white text-sm transition-colors duration-200 group"
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 border border-purple-900/40 group-hover:border-cyan-500 transition-colors duration-200"
                    style={{
                      clipPath:
                        "polygon(3px 0%,100% 0%,calc(100% - 3px) 100%,0% 100%)",
                    }}
                  >
                    <FaPhone className="text-xs text-purple-400 group-hover:text-cyan-400" />
                  </span>
                  +91 62827 59863
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:aakaar2026@ajiet.edu.in"
                  className="flex items-center gap-3 text-gray-500 hover:text-white text-sm transition-colors duration-200 group"
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 border border-purple-900/40 group-hover:border-cyan-500 transition-colors duration-200"
                    style={{
                      clipPath:
                        "polygon(3px 0%,100% 0%,calc(100% - 3px) 100%,0% 100%)",
                    }}
                  >
                    <FaEnvelope className="text-xs text-purple-400 group-hover:text-cyan-400" />
                  </span>
                  aakar2026@ajiet.edu.in
                </Link>
              </li>
            </ul>
          </div>

          {/* Address + Legal */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-purple-400 mb-5 font-semibold">
              Address
            </h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              NH66, Kottara Chowki,
              <br />
              Mangaluru, Karnataka — 575006
            </p>

            <h4 className="text-xs tracking-[0.3em] uppercase text-purple-400 mb-4 font-semibold">
              Legal
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "FAQ", href: "/faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-600 hover:text-gray-300 text-xs tracking-wide transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(99,68,245,0.2)" }}
        >
          <p className="text-gray-700 text-xs tracking-widest uppercase text-center md:text-left">
            © 2026 Aakar · AJIET · All rights reserved
          </p>
          <p className="text-gray-700 text-xs tracking-wide text-center md:text-right">
            Designed &amp; developed by the Aakar Technical Committee
          </p>
        </div>
      </div>
    </footer>
  );
}
