"use client"

import { useEffect, useState, useRef } from "react"

export default function Loading() {
    const [isAssetLoaded, setIsAssetLoaded] = useState(false)
    const [minimumDisplayTimePassed, setMinimumDisplayTimePassed] = useState(false)
    const [pageLoaded, setPageLoaded] = useState(false)
    const [readyToHide, setReadyToHide] = useState(false)
    const [videoLoadingProgress, setVideoLoadingProgress] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)
    const progressCheckTimerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const handleLoad = () => {
            setPageLoaded(true)
        }

        if (document.readyState === "complete") {
            setPageLoaded(true)
        } else {
            window.addEventListener("load", handleLoad)
        }

        setIsAssetLoaded(true)

        const timer = setTimeout(() => {
            setMinimumDisplayTimePassed(true)
        }, 5000)

        // Set a timer to check video loading progress after 5 seconds
        progressCheckTimerRef.current = setTimeout(() => {
            if (videoLoadingProgress < 0.5) { // Less than 50% loaded
                setReadyToHide(true)
                console.log("Video loading too slow, hiding loading screen")
            }
        }, 5000)

        if ("caches" in window) {
            caches.open("asset-cache").then((cache) => {
                const assetPath = "/loading2.mp4"
                cache.add(assetPath).catch((err) => {
                    console.error(`Failed to cache video`)
                })
            })
        }

        return () => {
            window.removeEventListener("load", handleLoad)
            clearTimeout(timer)
            if (progressCheckTimerRef.current) {
                clearTimeout(progressCheckTimerRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (!videoRef.current) return

        const handleVideoEnded = () => {
            if (pageLoaded && minimumDisplayTimePassed) {
                setReadyToHide(true)
            } else {
                videoRef.current!.currentTime = 0
                videoRef.current!.play().catch((e) => console.error("Video playback failed:", e))
            }
        }

        const handleProgress = () => {
            if (!videoRef.current) return
            
            const video = videoRef.current
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1)
                const duration = video.duration
                const progress = bufferedEnd / duration
                setVideoLoadingProgress(progress)
                console.log(`Video loading progress: ${Math.round(progress * 100)}%`)
            }
        }

        const video = videoRef.current
        video.addEventListener("ended", handleVideoEnded)
        video.addEventListener("progress", handleProgress)

        return () => {
            video.removeEventListener("ended", handleVideoEnded)
            video.removeEventListener("progress", handleProgress)
        }
    }, [pageLoaded, minimumDisplayTimePassed])

    if (!readyToHide) {
        return (
            <div className="fixed inset-0 flex items-center min-h-screen min-w-screen justify-center bg-black z-[100]">
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
        )
    }

    return null
}
