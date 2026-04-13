"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { Play, X, ChevronRight } from "lucide-react";
import { cinzelFont } from "@/lib/font";

const FEATURED_ACTS = [
  {
    id: "dj",
    title: "DJ Lineup",
    subtitle: "DJ EVE",
    image: "/night/DJ.png",
    video: "/night/DJ.mp4",
    tag: "Pro-Nite",
    accent: "#22d3ee",    // cyan
    number: "01",
  },
  {
    id: "concert",
    title: "Live Concert",
    subtitle: "The Midnight Echoes",
    image: "/night/vortex.png",
    video: "/night/vortex.mp4",
    tag: "Headliner",
    accent: "#a78bfa",    // violet
    number: "02",
  },
  {
    id: "secret",
    title: "Mystery Act",
    subtitle: "Revealed on Day 2 Night",
    image: "/night/my.png",
    video: null,
    tag: "Day 2 Night",
    accent: "#fb923c",    // amber
    number: "03",
  },
];

/* ── Tilt card hook ── */
function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-1, 1], [strength, -strength]);
  const rotateY = useTransform(x, [-1, 1], [-strength, strength]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }
  function onLeave() { x.set(0); y.set(0); }

  return { ref, rotateX, rotateY, onMove, onLeave };
}

/* ── Single Act Card ── */
function ActCard({
  act,
  index,
  onPlay,
}: {
  act: (typeof FEATURED_ACTS)[number];
  index: number;
  onPlay: (video: string | null) => void;
}) {
  const tilt = useTilt(8);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={tilt.ref}
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: "preserve-3d",
          boxShadow: hovered
            ? `0 30px 80px -10px ${act.accent}40, 0 0 0 1px ${act.accent}30`
            : "0 8px 40px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          transition: "box-shadow 0.4s ease",
        }}
        onMouseMove={tilt.onMove}
        onMouseLeave={() => { tilt.onLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        onClick={() => { if (act.video) onPlay(act.video); }}
        className={`relative aspect-[3/4] rounded-2xl overflow-hidden select-none ${act.video ? "cursor-pointer" : "cursor-default"}`}
      >
        {/* BG Image */}
        <Image
          src={act.image}
          alt={act.title}
          fill
          className="object-cover"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            filter: hovered ? "brightness(0.9)" : "brightness(0.55)",
            transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease",
          }}
        />

        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{
            opacity: hovered ? 0.25 : 0,
            background: `radial-gradient(ellipse at 50% 120%, ${act.accent} 0%, transparent 70%)`,
          }}
        />

        {/* Number watermark */}
        <div
          className={`${cinzelFont.className} absolute top-4 right-5 text-7xl font-bold leading-none select-none pointer-events-none`}
          style={{
            color: act.accent,
            opacity: hovered ? 0.18 : 0.08,
            transition: "opacity 0.4s ease",
          }}
        >
          {act.number}
        </div>

        {/* Tag badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full"
            style={{
              background: `${act.accent}20`,
              color: act.accent,
              border: `1px solid ${act.accent}40`,
              backdropFilter: "blur(8px)",
            }}
          >
            {act.tag}
          </span>
        </div>

        {/* Play button — only for acts with a video */}
        {act.video ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `${act.accent}25`,
                border: `1.5px solid ${act.accent}80`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 40px ${act.accent}50`,
              }}
            >
              <Play className="w-7 h-7 ml-1" style={{ color: act.accent }} fill="currentColor" />
            </div>
          </motion.div>
        ) : (
          /* Mystery lock overlay */
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-3"
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: `${act.accent}20`,
                border: `1.5px solid ${act.accent}60`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 40px ${act.accent}40`,
              }}
            >
              🔒
            </div>
            <p className="text-xs font-mono tracking-widest uppercase" style={{ color: act.accent }}>
              Stay tuned
            </p>
          </motion.div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 w-full p-6">
          {/* Animated divider */}
          <motion.div
            className="h-px mb-4"
            style={{ background: `linear-gradient(to right, ${act.accent}80, transparent)` }}
            animate={{ scaleX: hovered ? 1 : 0, originX: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          <p className="text-[11px] font-mono tracking-[0.3em] uppercase mb-2" style={{ color: act.accent }}>
            {act.tag}
          </p>
          <h3 className={`${cinzelFont.className} text-2xl font-bold text-white leading-tight mb-1.5`}>
            {act.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-white/55 text-sm font-light tracking-wide">{act.subtitle}</p>
            <motion.div
              animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-3.5 h-3.5" style={{ color: act.accent }} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Section ── */
export default function FeaturedActs() {
  const [selectedAct, setSelectedAct] = useState<(typeof FEATURED_ACTS)[number] | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedAct(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className="relative py-28 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 mb-20 text-center px-4"
      >
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10 bg-white/20" />
          <p className="text-white/40 tracking-[0.4em] text-xs uppercase font-mono">Performing Live</p>
          <div className="h-px w-10 bg-white/20" />
        </div>

        <h2 className={`${cinzelFont.className} text-4xl md:text-6xl font-bold text-white tracking-widest uppercase`}>
          Featured Acts
        </h2>

        {/* Underline accent */}
        <motion.div
          className="mx-auto mt-4 h-px w-24"
          style={{ background: "linear-gradient(to right, transparent, #22d3ee, transparent)" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        <p className="mt-5 text-white/30 tracking-[0.3em] text-xs uppercase">Click a card to preview</p>
      </motion.div>

      {/* Cards Grid */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-14 w-full max-w-6xl">
        {FEATURED_ACTS.map((act, i) => (
          <ActCard key={act.id} act={act} index={i} onPlay={() => setSelectedAct(act)} />
        ))}
      </div>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {selectedAct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12"
            style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(24px)" }}
            onClick={() => setSelectedAct(null)}
          >
            {/* Glow behind modal */}
            <div
              className="absolute w-[600px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: selectedAct.accent }}
            />

            {/* Close */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.15 }}
              onClick={() => setSelectedAct(null)}
              className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <X className="text-white/80 w-5 h-5" />
            </motion.button>

            {/* Modal card */}
            <motion.div
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 30, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <span
                    className="text-[10px] font-mono tracking-[0.3em] uppercase"
                    style={{ color: selectedAct.accent }}
                  >
                    {selectedAct.tag}
                  </span>
                  <h3 className={`${cinzelFont.className} text-xl font-bold text-white mt-0.5`}>
                    {selectedAct.title} — {selectedAct.subtitle}
                  </h3>
                </div>
              </div>

              {/* Video wrapper */}
              <div
                className="aspect-video rounded-xl overflow-hidden"
                style={{
                  border: `1px solid ${selectedAct.accent}30`,
                  boxShadow: `0 0 80px ${selectedAct.accent}25`,
                }}
              >
                <video
                  src={selectedAct.video ?? undefined}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}