"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"

// Main component that combines all parts
export default function EventsPage() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden py-12 min-h-screen">
      <div className="text-center mb-8 md:mb-16 z-10 px-4">
        <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider">
          <span className="block mb-2">PICK YOUR PATH,</span>
          <span className="block">SHAPE YOUR FATE!</span>
        </h1>
      </div>

      {/* Card grid with integrated flip functionality */}
      <CardGrid />
    </div>
  )
}

// CardGrid component
function CardGrid() {
  const cards = [
    { id: 1, frontText: "CULTURAL", frontImage: "/eventcard.png?height=300&width=400", backImage: "/eventcardc.png" },
    { id: 2, frontText: "TECHNICAL", frontImage: "/eventcard.png?height=300&width=400", backImage: "/eventcardc.png" },
    { id: 3, frontText: "GAMING", frontImage: "/eventcard.png?height=300&width=400", backImage: "/eventcardc.png" },
    { id: 4, frontText: "SPECIAL", frontImage: "/eventcard.png?height=300&width=400", backImage: "/eventcardc.png" },
  ]

  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.3 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl px-4 mx-auto"
      style={{
        height: "min(70vh, 500px)",
        minHeight: "300px",
      }}
    >
      {cards.map((card, index) => (
        <FlipCard
          key={card.id}
          frontText={card.frontText}
          frontImage={card.frontImage}
          backImage={card.backImage}
          index={index}
          isVisible={isVisible}
          totalCards={cards.length}
        />
      ))}
    </div>
  )
}

// FlipCard component
type FlipCardProps = {
  frontText: string
  frontImage: string
  backImage: string
  index: number
  isVisible: boolean
  totalCards: number
}

function FlipCard({ frontText, frontImage, backImage, index, isVisible, totalCards }: FlipCardProps) {
  // Calculate position for the fan layout
  const calculateCardStyle = () => {
    // Adjust fan spread based on screen size
    const getSpreadFactor = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) return 0.6 // mobile
        if (window.innerWidth < 1024) return 0.8 // tablet
        return 1 // desktop
      }
      return 1
    }

    // Center position
    const centerX = 50

    // Calculate rotation angle between -20 and 20 degrees (adjusted for screen size)
    const maxRotation = 20 * getSpreadFactor()
    const rotationAngle = -maxRotation + ((maxRotation * 2) / (totalCards - 1)) * index

    // Calculate horizontal position based on index
    const spreadWidth = 70 * getSpreadFactor()
    const horizontalPosition = centerX - spreadWidth / 2 + (spreadWidth / (totalCards - 1)) * index

    return {
      position: "absolute",
      left: `${horizontalPosition}%`,
      transform: `translateX(-50%) rotate(${rotationAngle}deg)`,
      transformOrigin: "bottom center",
      zIndex: index + 1,
    } as React.CSSProperties
  }

  // Calculate card size based on screen size
  const getCardSize = () => {
    return {
      width: "min(220px, 80vw)",
      height: "min(300px, 60vh)",
    }
  }

  return (
    <div
      className="absolute cursor-pointer transition-transform duration-500"
      style={{
        ...calculateCardStyle(),
        ...getCardSize(),
        perspective: "1000px",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="w-full h-full relative transition-all duration-1000 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isVisible ? "rotateY(180deg)" : "rotateY(0deg)",
          transitionDelay: "300ms", // Add a slight delay for all cards to create a wave effect
        }}
      >
        {/* Front of card - showing the event card image */}
        <div
          className="absolute w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            src={frontImage || "/placeholder.svg"}
            alt={frontText}
            fill
            className="object-cover rounded"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 220px"
          />
        </div>

        {/* Back of card - showing the category card with text */}
        <div
          className="absolute w-full h-full rounded-lg flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: `url(${backImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="text-red-600 font-bold text-xl sm:text-2xl tracking-wider bg-opacity-50 px-4 py-2 rounded">
            {frontText}
          </span>
        </div>
      </div>
    </div>
  )
}