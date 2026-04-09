"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = React.memo(
  ({ className }: { className?: string }) => {
    // Reduced from 50 to 8 paths — still looks great, 84% less GPU work
    const paths = [
      "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
      "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
      "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
      "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
      "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
      "M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635",
      "M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587",
      "M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539",
    ];

    return (
      <div
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center [mask-repeat:no-repeat] [mask-size:40px]",
          className,
        )}
      >
        <svg
          className="pointer-events-none absolute z-0 h-full w-full"
          width="100%"
          height="100%"
          viewBox="0 0 696 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Static grid lines — no animation cost */}
          <path
            d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539"
            stroke="url(#paint0_radial_242_278)"
            strokeOpacity="0.05"
            strokeWidth="0.5"
          />

          {/* Only 8 animated beams instead of 50 */}
          {paths.map((path, index) => (
            <motion.path
              key={`path-` + index}
              d={path}
              stroke={`url(#linearGradient-${index})`}
              strokeOpacity="0.4"
              strokeWidth="0.5"
            />
          ))}
          <defs>
            {paths.map((_path, index) => (
              <motion.linearGradient
                id={`linearGradient-${index}`}
                key={`gradient-${index}`}
                initial={{
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["0%", "95%"],
                  y1: ["0%", "100%"],
                  y2: ["0%", `${93 + Math.random() * 8}%`],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              >
                <stop stopColor="#18CCFC" stopOpacity="0" />
                <stop stopColor="#18CCFC" />
                <stop offset="32.5%" stopColor="#6344F5" />
                <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
              </motion.linearGradient>
            ))}

            <radialGradient
              id="paint0_radial_242_278"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
            >
              <stop offset="0.0666667" stopColor="#d4d4d4" />
              <stop offset="0.243243" stopColor="#d4d4d4" />
              <stop offset="0.43594" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  },
);

BackgroundBeams.displayName = "BackgroundBeams";
