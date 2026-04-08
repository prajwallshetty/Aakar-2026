"use client";

import { useEffect, useRef } from "react";

interface OptimizedVideoProps {
  src: string;
  className?: string;
}

export default function OptimizedVideo({
  src,
  className = "",
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Aggressive play on mount
    const playVideo = () => {
      video.play().catch((err) => {
        console.warn("Autoplay failed, trying again on interaction:", err);
      });
    };

    playVideo();

    // Ensure it plays when it becomes visible (no opacity tricks)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.001 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="w-full h-full object-cover"
        style={{ 
          transform: "translateZ(0)", // Force hardware acceleration
          backfaceVisibility: "hidden",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
