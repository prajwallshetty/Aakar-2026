"use client";

import { motion, MotionValue } from "framer-motion";

interface HeroOverlaysProps {
  opacity: MotionValue<number>;
}

export default function HeroOverlays({ opacity }: HeroOverlaysProps) {
  return (
    <>
      {/* ── OVERLAY 1: Base Dim ── */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none" 
        style={{ background: "rgba(0,0,0,0.4)" }} 
      />

      {/* ── OVERLAY 2: Animated Cinematic Vignette ── */}
      <motion.div 
        className="absolute inset-0 z-[3] pointer-events-none will-change-opacity" 
        style={{ opacity }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 130% 88% at 50% 120%, #060000 0%, transparent 55%)",
              "linear-gradient(to top, rgba(4,0,0,0.95) 0%, rgba(7,1,0,0.6) 25%, transparent 60%)",
              "linear-gradient(to bottom, rgba(3,0,0,0.6) 0%, transparent 30%)",
              "linear-gradient(to right, rgba(2,0,0,0.6) 0%, transparent 40%)",
            ].join(", "),
          }} 
        />
      </motion.div>

      {/* ── OVERLAY 3: Scanlines (Lightweight) ── */}
      <div 
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
          backgroundSize: "100% 4px"
        }}
      />

      {/* ── OVERLAY 4: Texture/Grain (Optimized Base64) ── */}
      <div 
        className="absolute inset-0 z-[5] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAAD9tt+XAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAA1BMVEUAAP77vKofAAAAAXRSTlMAQObYZgAAAA1JREFUCNdjYBgF6AIAAnAAAfoAlvUAAAAASUVORK5CYII=")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay"
        }}
      />

      {/* ── OVERLAY 5: Flare Effects (Static) ── */}
      <div 
        className="absolute top-0 left-0 z-[6] pointer-events-none overflow-hidden" 
        style={{ 
          width: "40vw", 
          height: "40vw", 
          background: "radial-gradient(circle at 0% 0%, rgba(255,50,0,0.1) 0%, transparent 70%)" 
        }} 
      />
    </>
  );
}
