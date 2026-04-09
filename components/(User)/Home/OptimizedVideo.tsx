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

    // Play on mount
    video.play().catch(() => {});

    // Pause when out of view, resume when visible — saves GPU/CPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(video);

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
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
        preload="metadata"
        className="w-full h-full object-cover"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
