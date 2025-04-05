"use client"
import { useState, useEffect, useRef } from "react"
import React from "react"
import Image from "next/image"

export default function Eventcards() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden md:py-12">
      <div className="text-center mb-8 md:mb-0 z-10 px-4">
        <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider">
          <span className="block mb-2">PICK YOUR PATH,</span>
          <span className="block">SHAPE YOUR FATE!</span>
        </h1>
      </div>
      <CardGrid />
    </div>
  )
}

function CardGrid() {
  const cards = [
    { id: 1, frontText: "CULTURAL", frontImage: "/eventcard.png?height=300&width=400", backImage: "/eventcardc.png" },
    { id: 2, frontText: "TECHNICAL", frontImage: "/eventcard.png?height=300&width=400", backImage: "/eventcardc.png" },
    { id: 3, frontText: "GAMING", frontImage: "/eventcard.png?height=300&width=400", backImage: "/eventcardc.png" },
    { id: 4, frontText: "SPECIAL", frontImage: "/eventcard.png?height=300&width=400", backImage: "/eventcardc.png" },
  ]

  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isMobile) {
          entries.forEach(entry => {
            const cardId = parseInt(entry.target.getAttribute('data-id') || '0')

            if (entry.isIntersecting) {
              setVisibleCards(prev => {
                if (!prev.includes(cardId)) {
                  return [...prev, cardId]
                }
                return prev
              })
            } else {
              setVisibleCards(prev => prev.filter(id => id !== cardId))
            }
          })
        } else {
          const [entry] = entries
          if (entry.isIntersecting) {
            setVisibleCards([1, 2, 3, 4])
          } else {
            setVisibleCards([])
          }
        }
      },
      { threshold: isMobile ? 0.6 : 0.3 },
    )

    if (isMobile) {
      cardRefs.current.forEach(card => {
        if (card) observer.observe(card)
      })
    } else {
      if (containerRef.current) {
        observer.observe(containerRef.current)
      }
    }

    return () => {
      if (isMobile) {
        cardRefs.current.forEach(card => {
          if (card) observer.unobserve(card)
        })
      } else if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [isMobile])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl px-4 mx-auto"
      style={{
        height: isMobile ? "auto" : "min(70vh, 500px)",
        minHeight: isMobile ? "auto" : "300px",
      }}
    >
      {cards.map((card, index) => (
        <FlipCard
          key={card.id}
          frontText={card.frontText}
          frontImage={card.frontImage}
          backImage={card.backImage}
          index={index}
          isVisible={visibleCards.includes(card.id)}
          totalCards={cards.length}
          isMobile={isMobile}
          ref={el => {
            cardRefs.current[index] = el;
          }}
          id={card.id}
        />
      ))}
    </div>
  )
}

type FlipCardProps = {
  frontText: string
  frontImage: string
  backImage: string
  index: number
  isVisible: boolean
  totalCards: number
  isMobile: boolean
  id: number
}

const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(
  ({ frontText, frontImage, backImage, index, isVisible, totalCards, isMobile, id }, ref) => {
    const calculateCardStyle = () => {
      if (isMobile) {
        return {
          position: "relative",
          marginBottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
        } as React.CSSProperties
      } else {
        const centerX = 50;
        const normalizedPosition = index / (totalCards - 1);
        const spreadWidth = 60;
        const horizontalPosition = centerX - (spreadWidth / 2) + spreadWidth * normalizedPosition;
        const verticalOffset = Math.sin(Math.PI * normalizedPosition) * 20;
        const baseRotation = -20;
        const rotationRange = 40;
        const rotationAngle = baseRotation + (rotationRange * normalizedPosition);
        const zIndexBase = 10;
        const zIndexFactor = Math.sin(Math.PI * normalizedPosition) * 10;
        const zIndex = Math.floor(zIndexBase + zIndexFactor);

        return {
          position: "absolute",
          left: `${horizontalPosition}%`,
          bottom: `${verticalOffset}px`,
          transform: `translateX(-50%) rotate(${rotationAngle}deg)`,
          transformOrigin: "bottom center",
          zIndex: zIndex,
        } as React.CSSProperties
      }
    }

    const getCardSize = () => {
      if (isMobile) {
        return {
          width: "min(280px, 90vw)",
          height: "min(380px, 65vh)",
        }
      }
      return {
        width: "min(220px, 80vw)",
        height: "min(300px, 60vh)",
      }
    }

    return (
      <div
        ref={ref}
        data-id={id}
        className={`transition-transform duration-500 ${isMobile ? "" : "absolute"}`}
        style={{
          ...calculateCardStyle(),
          ...getCardSize(),
          perspective: "1000px",
          transitionDelay: isMobile ? "0ms" : `${index * 100}ms`,
        }}
      >
        <div
          className="w-full h-full relative transition-all duration-1000 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isVisible ? "rotateY(180deg)" : "rotateY(0deg)",
            transitionDelay: isMobile ? "0ms" : "300ms",
          }}
        >
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
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 220px"
            />
          </div>

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
)

FlipCard.displayName = "FlipCard"