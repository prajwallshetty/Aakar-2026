"use client";

import React from "react";
import { motion } from "framer-motion";

interface CharacterDecorationProps {
  image: string;
  position?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
  size?: string;
  width?: string;
  height?: string;
  opacity?: number;
  filter?: string;
  zIndex?: number;
  delay?: number;
  style?: React.CSSProperties;
}

export default function CharacterDecoration({
  image,
  position = { bottom: 0, right: 0 },
  size,
  width,
  height,
  opacity = 0.15,
  filter = "grayscale(100%) contrast(1.2) brightness(0.8)",
  zIndex = 1,
  delay = 0,
  style = {},
}: CharacterDecorationProps) {
  // Use size as default for both if neither width nor height is provided
  const finalWidth = width || size || "clamp(300px, 40vw, 500px)";
  const finalHeight = height || size || "clamp(300px, 40vw, 500px)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: opacity, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      style={{
        position: "absolute",
        ...position,
        width: finalWidth,
        height: finalHeight,
        backgroundImage: `url(${image})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        pointerEvents: "none",
        zIndex: zIndex,
        filter: filter,
        ...style,
      }}
    />
  );
}
