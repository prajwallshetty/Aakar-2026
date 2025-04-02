"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function FlipCardsComponent() {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden py-12">
      {/* Neon border effect */}
      <div className="absolute left-0 top-0 h-full w-2 bg-red-600 shadow-[0_0_15px_5px_rgba(239,68,68,0.7)]"></div>
      <div className="absolute right-0 top-0 h-full w-2 bg-red-600 shadow-[0_0_15px_5px_rgba(239,68,68,0.7)]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-600 shadow-[0_0_15px_5px_rgba(239,68,68,0.7)]"></div>

      {/* Heading component */}
      <HeadingComponent />

      {/* Cards component */}
      <CardGridComponent />
    </div>
  )
}

function HeadingComponent() {
  return (
    <div className="text-center mb-16 z-10">
      <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider">
        <span className="block mb-2">PICK YOUR PATH,</span>
        <span className="block">SHAPE YOUR FATE!</span>
      </h1>
    </div>
  )
}

function CardGridComponent() {
  const cards = [
    { id: 1, frontText: "CULTURAL", backImage: "/placeholder.svg?height=400&width=250" },
    { id: 2, frontText: "TECHNICAL", backImage: "/placeholder.svg?height=400&width=250" },
    { id: 3, frontText: "GAMING", backImage: "/placeholder.svg?height=400&width=250" },
    { id: 4, frontText: "SPECIAL", backImage: "/placeholder.svg?height=400&width=250" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 max-w-6xl w-full">
      {cards.map((card) => (
        <FlipCard key={card.id} frontText={card.frontText} backImage={card.backImage} />
      ))}
    </div>
  )
}

interface FlipCardProps {
  frontText: string
  backImage: string
}

function FlipCard({ frontText, backImage }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="relative h-[300px] w-full perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden rounded-lg bg-[#d4b483] flex items-center justify-center transform-style-3d">
          <span className="text-red-600 font-bold text-2xl tracking-wider">{frontText}</span>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rounded-lg bg-gray-800 flex items-center justify-center rotate-y-180 transform-style-3d overflow-hidden">
          <img
            src={backImage || "/placeholder.svg"}
            alt={`${frontText} image`}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  )
}

