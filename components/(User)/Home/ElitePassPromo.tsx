"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimeGlitchText } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import CharacterDecoration from "@/components/(User)/Common/CharacterDecoration";

export default function ElitePassPromo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        padding: "clamp(3rem, 8vh, 6rem) clamp(1rem, 4vw, 3rem)",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <CharacterDecoration 
        image="/character5.png" 
        position={{ bottom: "-10%", left: "-20%" }}
        mobilePosition={{ bottom: "-5%", left: "-15%" }}
        opacity={0.2}
        mobileOpacity={0.12}
        size="clamp(450px, 60vw, 850px)"
        mobileSize="280px"
      />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: "1100px",
          position: "relative",
          borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(20,8,45,0.8) 0%, rgba(10,5,25,0.95) 100%)",
          border: "1px solid rgba(99,68,245,0.4)",
          boxShadow: "0 0 40px rgba(99,68,245,0.2), inset 0 0 20px rgba(24,204,252,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)",
          textAlign: "center",
        }}
      >
        {/* CRT Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            backgroundSize: "100% 4px",
            zIndex: 1,
          }}
        />

        {/* Glow Spheres */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(24,204,252,0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(99,68,245,0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.4em",
              color: "#18CCFC",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Access The Inner Circle
          </p>
          
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#fff",
              margin: 0,
              marginBottom: "1.5rem",
              textShadow: "0 0 20px rgba(99,68,245,0.5)",
              lineHeight: 1.2,
            }}
          >
            Aakar <span style={{ color: "#AE48FF" }}>Elite</span> Pass
          </h2>
          
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            Skip the lines. Unlock premium concert zones. Get exclusive festival merchandise. Elevate your Aakar experience to the highest tier.
          </p>

          <Link href="/aakar-elite-pass" style={{ textDecoration: "none", display: "inline-block" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: "relative",
                padding: "16px 48px",
                background: "transparent",
                border: "2px solid #18CCFC",
                color: "#18CCFC",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "1.1rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 0 15px rgba(24,204,252,0.3)",
              }}
            >
              {/* Button shine effect */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent, rgba(24,204,252,0.4), transparent)",
                  transform: "skewX(-20deg)",
                  zIndex: 0,
                }}
              />
              <span style={{ position: "relative", zIndex: 2 }}>
                <AnimeGlitchText text="UPGRADE TO ELITE">UPGRADE TO ELITE</AnimeGlitchText>
              </span>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
