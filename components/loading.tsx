"use client";

import { useEffect, useState, useRef } from "react";

export default function Loading() {
    const [isAssetLoaded, setIsAssetLoaded] = useState(false);
    const [minimumDisplayTimePassed, setMinimumDisplayTimePassed] =
        useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [readyToHide, setReadyToHide] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const handleLoad = () => {
            setPageLoaded(true);
        };

        if (document.readyState === "complete") {
            setPageLoaded(true);
        } else {
            window.addEventListener("load", handleLoad);
        }

        setIsAssetLoaded(true);

        const timer = setTimeout(() => {
            setMinimumDisplayTimePassed(true);
        }, 5000);

        if ("caches" in window) {
            caches.open("asset-cache").then((cache) => {
                const assetPath = "/loading2.mp4";
                cache.add(assetPath).catch((err) => {
                    console.error(`Failed to cache video`);
                });
            });
        }

        return () => {
            window.removeEventListener("load", handleLoad);
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;

        const handleVideoEnded = () => {
            if (pageLoaded && minimumDisplayTimePassed) {
                setReadyToHide(true);
            } else {
                videoRef.current!.currentTime = 0;
                videoRef
                    .current!.play()
                    .catch((e) => console.error("Video playback failed:", e));
            }
        };

        const video = videoRef.current;
        video.addEventListener("ended", handleVideoEnded);

        return () => {
            video.removeEventListener("ended", handleVideoEnded);
        };
    }, [pageLoaded, minimumDisplayTimePassed]);

    if (!readyToHide) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
                <video
                    ref={videoRef}
                    className="max-w-xl w-full h-auto object-cover"
                    src="/loading2.mp4"
                    autoPlay
                    muted
                    playsInline
                    style={{
                        opacity: isAssetLoaded ? 1 : 0,
                        transition: "opacity 0.5s ease-in-out",
                    }}
                    controls={false}
                    poster="/loading2.jpg"
                />
            </div>
        );
    }

    return null;
}
