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
  mobilePosition?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
  size?: string;
  mobileSize?: string;
  width?: string;
  height?: string;
  opacity?: number;
  mobileOpacity?: number;
  filter?: string;
  zIndex?: number;
  delay?: number;
  style?: React.CSSProperties;
  hideOnMobile?: boolean;
}

export default function CharacterDecoration({
  image,
  position = { bottom: 0, right: 0 },
  mobilePosition,
  size,
  mobileSize,
  width,
  height,
  opacity = 0.15,
  mobileOpacity,
  filter = "grayscale(100%) contrast(1.2) brightness(0.8)",
  zIndex = 1,
  delay = 0,
  style = {},
  hideOnMobile = false,
}: CharacterDecorationProps) {
  // Desktop defaults
  const finalWidth = width || size || "clamp(300px, 40vw, 500px)";
  const finalHeight = height || size || "clamp(300px, 40vw, 500px)";

  // Random ID for style scoping
  const id = React.useId().replace(/:/g, "");

  return (
    <>
      <style>{`
        .char-deco-${id} {
          width: ${finalWidth};
          height: ${finalHeight};
          top: ${position.top ?? "auto"};
          bottom: ${position.bottom ?? "auto"};
          left: ${position.left ?? "auto"};
          right: ${position.right ?? "auto"};
          opacity: ${opacity};
          display: block;
        }

        @media (max-width: 768px) {
          .char-deco-${id} {
            ${hideOnMobile ? "display: none !important;" : ""}
            ${mobileSize ? `width: ${mobileSize} !important; height: ${mobileSize} !important;` : ""}
            ${mobilePosition?.top !== undefined ? `top: ${mobilePosition.top} !important;` : ""}
            ${mobilePosition?.bottom !== undefined ? `bottom: ${mobilePosition.bottom} !important;` : ""}
            ${mobilePosition?.left !== undefined ? `left: ${mobilePosition.left} !important;` : ""}
            ${mobilePosition?.right !== undefined ? `right: ${mobilePosition.right} !important;` : ""}
            ${mobileOpacity !== undefined ? `opacity: ${mobileOpacity} !important;` : ""}
          }
        }
      `}</style>
      <motion.div
        className={`char-deco-${id}`}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
        style={{
          position: "absolute",
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
    </>
  );
}
