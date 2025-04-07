"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { downloadEventData } from "./actions"
import { getParticipantEvents } from "@/backend/new"
import { Participant } from "@prisma/client"

interface EventStatsProps {
  participants: Participant[]
}

type EventData = {
  name: string
  count: number
  category: string
}

export function EventStats({ participants }: EventStatsProps) {
  const [eventData, setEventData] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a4de6c",
    "#d0ed57",
  ]

  useEffect(() => {
    const processEventData = async () => {
      try {
        setIsLoading(true)

        // Get events for each participant
        const eventCounts: Record<string, { count: number; category: string }> = {}

        // Process each participant's events
        for (const participant of participants) {
          // Fetch events for this participant
          const events = await getParticipantEvents(participant.id)

          if (events && Array.isArray(events)) {
            for (const event of events) {
              const eventName = event.eventName
              if (!eventCounts[eventName]) {
                eventCounts[eventName] = {
                  count: 0,
                  category: event.eventCategory,
                }
              }
              eventCounts[eventName].count++
            }
          }
        }

        // Convert to array format for chart
        const formattedData = Object.entries(eventCounts).map(([name, data]) => ({
          name,
          count: data.count,
          category: data.category,
        }))

        // Sort by count (descending)
        formattedData.sort((a, b) => b.count - a.count)

        setEventData(formattedData)
      } catch (err) {
        console.error("Error processing event data:", err)
        setError("Failed to process event statistics")
      } finally {
        setIsLoading(false)
      }
    }

    if (participants.length > 0) {
      processEventData()
    }
  }, [participants])

  const handleDownloadEventData = async () => {
    try {
      await downloadEventData(eventData)
    } catch (error) {
      console.error("Error downloading event data:", error)
      setError("Failed to download event data")
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading event statistics...</div>
  }

  if (error) {
    return <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Event Registration Statistics</h3>
        <Button onClick={handleDownloadEventData} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          Download Event Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrations by Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {eventData.length === 0 ? (
              <div className="flex justify-center items-center h-full text-muted-foreground">
                No event data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => {
                      return [`${value} registrations`, props.payload.name]
                    }}
                    labelFormatter={(label) => `Event: ${label}`}
                  />
                  <Bar dataKey="count" name="Registrations">
                    {eventData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Technical", "Cultural", "Gaming", "Special"].map((category) => {
          const categoryEvents = eventData.filter((event) => event.category.toLowerCase() === category.toLowerCase())
          const totalRegistrations = categoryEvents.reduce((sum, event) => sum + event.count, 0)

          return (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{category} Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categoryEvents.length}</div>
                <p className="text-xs text-muted-foreground">{totalRegistrations} total registrations</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}