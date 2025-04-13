"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [minimumDisplayTimePassed, setMinimumDisplayTimePassed] = useState(false)

  useEffect(() => {
    const preloadImage = () => {
      const img = new Image()
      img.src = "/loading.gif"
      img.onload = () => {
        setIsImageLoaded(true)

        const timer = setTimeout(() => {
          setMinimumDisplayTimePassed(true)
        }, 5000)

        return () => clearTimeout(timer)
      }
      img.onerror = () => {
        console.error("Failed to load GIF")
        setIsImageLoaded(true)
        setMinimumDisplayTimePassed(true)
      }
    }

    preloadImage()

    if ("caches" in window) {
      caches.open("image-cache").then((cache) => {
        cache.add("/loading.gif").catch(err => {
          console.error("Failed to cache image:", err)
        })
      })
    }
  }, [])

  if (!isImageLoaded || !minimumDisplayTimePassed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
        <div
          className="w-full h-full"
          style={{
            opacity: isImageLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            backgroundImage: "url('/loading.gif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
      </div>
    )
  }

  return null
}