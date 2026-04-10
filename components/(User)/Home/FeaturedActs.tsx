"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { cinzelFont } from "@/lib/font";

const FEATURED_ACTS = [
  {
    id: "dj",
    title: "DJ Lineup",
    subtitle: "Ravi & The Beats",
    image: "/video/poster.webp", // Replace with your DJ image later
    video: "/video/aakarlandingvideo.mp4", // Replace with your DJ video later
    tag: "Pro-Nite",
  },
  {
    id: "concert",
    title: "Live Concert",
    subtitle: "The Midnight Echoes",
    image: "/video/poster.webp", // Replace with your Concert image later
    video: "/video/aakarlandingvideo.mp4", // Replace with your Concert video later
    tag: "Headliner",
  },
  {
    id: "secret",
    title: "Mystery Act",
    subtitle: "To Be Revealed",
    image: "/video/poster.webp", // Replace with Mystery image later
    video: "/video/aakarlandingvideo.mp4", // Replace with Mystery video later
    tag: "Exclusive",
  },
];

export default function FeaturedActs() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Close modal on Escape key
  if (typeof window !== "undefined") {
    window.onkeydown = (e) => {
      if (e.key === "Escape" && selectedVideo) {
        setSelectedVideo(null);
      }
    };
  }

  return (
    <section className="relative py-24 overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* Section Header */}
      <div className="z-10 mb-16 text-center px-4">
        <h2 className={`${cinzelFont.className} text-3xl md:text-5xl font-bold text-white mb-4 tracking-widest uppercase`}>
          Featured Acts
        </h2>
        <p className="text-white/40 tracking-[0.3em] text-sm uppercase">Tap to preview performances</p>
      </div>

      {/* Grid of Cards */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 w-full max-w-6xl">
        {FEATURED_ACTS.map((act) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onClick={() => setSelectedVideo(act.video)}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-zinc-900 shadow-2xl"
          >
            {/* Background Image */}
            <Image
              src={act.image}
              alt={act.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
            />

            {/* Gradient Overlay (Spotify Style) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Hover Play Button (Centered) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <Play className="text-cyan-300 w-6 h-6 ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Card Content (Bottom) */}
            <div className="absolute bottom-0 w-full p-6 flex flex-col justify-end">
              <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
                {act.tag}
              </span>
              <h3 className={`${cinzelFont.className} text-2xl font-bold text-white leading-tight mb-1`}>
                {act.title}
              </h3>
              <p className="text-white/60 text-sm font-light tracking-wide">
                {act.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-12"
            onClick={() => setSelectedVideo(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-8 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="text-white w-6 h-6" />
            </button>

            {/* Video Player wrapper (stops propagation so clicking it doesn't close modal) */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedVideo}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
