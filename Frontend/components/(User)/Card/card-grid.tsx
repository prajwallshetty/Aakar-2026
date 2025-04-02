import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface CardItem {
  id: number
  title: string
  imageUrl: string
  description: string
}

export function CardGrid() {
  // Sample data - in a real application, this would likely come from props or an API
  const cards: CardItem[] = [
    {
      id: 1,
      title: "Mountain Retreat",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "Peaceful getaway surrounded by nature",
    },
    {
      id: 2,
      title: "Ocean View",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "Stunning coastal landscapes and sunsets",
    },
    {
      id: 3,
      title: "Urban Adventure",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "Explore the vibrant city life",
    },
    {
      id: 4,
      title: "Desert Oasis",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "Tranquil beauty in the heart of the desert",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image src={card.imageUrl || "/placeholder.svg"} alt={card.title} fill className="object-cover" />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

