"use client";

import { motion, MotionValue } from "framer-motion";

interface HeroOverlaysProps {
  opacity: MotionValue<number>;
}

export default function HeroOverlays({ opacity }: HeroOverlaysProps) {
  return (
    <>
      {/* Base dim — single flat layer, zero GPU cost */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none" 
        style={{ background: "rgba(0,0,0,0.4)" }} 
      />

      {/* Animated cinematic vignette — ONE layer, scroll-driven opacity */}
      <motion.div 
        className="absolute inset-0 z-[3] pointer-events-none" 
        style={{ opacity }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 130% 88% at 50% 120%, #060000 0%, transparent 55%)",
              "linear-gradient(to top, rgba(4,0,0,0.95) 0%, rgba(7,1,0,0.6) 25%, transparent 60%)",
              "linear-gradient(to bottom, rgba(3,0,0,0.6) 0%, transparent 30%)",
            ].join(", "),
          }} 
        />
      </motion.div>
    </>
  );
}
