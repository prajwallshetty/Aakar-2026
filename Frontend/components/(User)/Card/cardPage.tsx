"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

// Main component that combines all parts
export default function EventsPage() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden py-12 ">

      {/* Heading component */}
      <div className="text-center mb-16 z-10">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider">
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

  const [visibleCards, setVisibleCards] = useState<number[]>([])

  const addVisibleCard = (cardId: number) => {
    setVisibleCards(prev => (!prev.includes(cardId) ? [...prev, cardId] : prev))
  }

  const removeVisibleCard = (cardId: number) => {
    setVisibleCards(prev => prev.filter(id => id !== cardId))
  }

  // Use a container div instead of grid for fan layout
  return (
    <div className="relative max-w-6xl w-full h-64 md:h-80 px-4">
      {cards.map((card, index) => (
        <FlipCard 
          key={card.id} 
          frontText={card.frontText} 
          frontImage={card.frontImage}
          backImage={card.backImage} 
          index={index} 
          addVisibleCard={() => addVisibleCard(card.id)} 
          removeVisibleCard={() => removeVisibleCard(card.id)} 
          visibleCards={visibleCards} 
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
  addVisibleCard: () => void
  removeVisibleCard: () => void
  visibleCards: number[]
  totalCards: number
}

function FlipCard({
  frontText,
  frontImage,
  backImage,
  index,
  addVisibleCard,
  removeVisibleCard,
  visibleCards,
  totalCards
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          addVisibleCard()
        } else {
          removeVisibleCard()
          setIsFlipped(false)
        }
      },
      { threshold: 0.5 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [addVisibleCard, removeVisibleCard])

  useEffect(() => {
    if (visibleCards.length > 0) {
      const timer = setTimeout(() => {
        setIsFlipped(true)
      }, 300 * index)

      return () => clearTimeout(timer)
    }
  }, [visibleCards, index])

  // Calculate position for the fan layout
  const calculateCardStyle = () => {
    // Center position
    const centerX = 50;
    
    // Calculate rotation angle between -15 and 15 degrees
    const rotationAngle = -15 + (30 / (totalCards - 1)) * index;
    
    // Calculate horizontal position based on index
    const horizontalPosition = centerX - 40 + (80 / (totalCards - 1)) * index;
    
    return {
      position: "absolute",
      left: `${horizontalPosition}%`,
      transform: `rotate(${rotationAngle}deg)`,
      transformOrigin: "bottom center",
      zIndex: index
    };
  };

  return (
    <div
      ref={cardRef}
      className="relative h-[300px] cursor-pointer"
      style={{ 
        ...calculateCardStyle(), 
        width: "220px",
        perspective: "1000px" 
      }}
    >
      <div
        className="w-full h-full relative transition-all duration-1000 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        {/* Front of card - showing the event card image */}
        <div
          className="absolute w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden"
          }}
        >
          <Image
            src={frontImage}
            alt={frontText}
            fill
            className="object-cover rounded"
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
            backgroundPosition: "center"
          }}
        >
          <span className="text-red-600 font-bold text-2xl tracking-wider bg-opacity-50 px-4 py-2 rounded">
            {frontText}
          </span>
        </div>
      </div>
    </div>
  )
}