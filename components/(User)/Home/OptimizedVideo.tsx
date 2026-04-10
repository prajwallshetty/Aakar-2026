"use client";

import { useEffect, useRef } from "react";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function OptimizedVideo({
  src,
  poster = "",
  className = "",
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS Safari specific fixes: forcefully re-affirm muted policy
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

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
        src={src}
        muted={true}
        loop
        playsInline
        autoPlay
        poster={poster}
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="w-full h-full object-cover"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
