"use client";

import { motion } from "framer-motion";
import { cinzelFont } from "@/lib/font";

export default function MarqueeStrip() {
  const text = "REGISTER NOW • THE ARENA AWAITS • AAKAR 2026 • ";
  
  return (
    <div 
      style={{
        position: "relative",
        width: "100%",
        height: "40px",
        background: "rgba(10, 8, 22, 0.8)",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        zIndex: 20,
        borderTop: "1px solid rgba(174,72,255,0.3)",
        borderBottom: "1px solid rgba(174,72,255,0.3)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          width: "fit-content",
        }}
      >
        <span 
          className={cinzelFont.className}
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#AE48FF",
            textShadow: "0 0 10px rgba(174,72,255,0.4)",
            letterSpacing: "0.2em",
            paddingRight: "25px",
          }}
        >
          {text.repeat(10)}
        </span>
      </motion.div>
    </div>
  );
}
