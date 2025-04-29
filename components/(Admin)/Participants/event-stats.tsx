"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { downloadEventData } from "@/app/(Admin)/Participants/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { getEventsOfUser } from "@/backend/events"
import { ExtendedParticipant } from "@/types"

interface EventStatsProps {
  participants: ExtendedParticipant[]
}

type EventData = {
  name: string
  count: number
  category: string
  participantCount: number
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
        setIsLoading(true);

        const eventCounts: Record<string, { count: number; category: string; participantCount: number }> = {};
        const processedUSNs: Record<string, Set<string>> = {};

        for (const participant of participants) {
          const events = await getEventsOfUser(participant.id);

          if (events && Array.isArray(events)) {
            for (const event of events) {
              const eventName = event.eventName;

              if (!eventCounts[eventName]) {
                eventCounts[eventName] = {
                  count: 0,
                  category: event.eventCategory,
                  participantCount: 0
                };
                processedUSNs[eventName] = new Set<string>();
              }

              eventCounts[eventName].count++;

              if (!processedUSNs[eventName].has(participant.usn)) {
                processedUSNs[eventName].add(participant.usn);
                eventCounts[eventName].participantCount++;
              }

              if (participant.groupMembersData && participant.groupMembersData[event.id]) {
                const groupData = participant.groupMembersData[event.id];

                if (groupData.members && Array.isArray(groupData.members)) {
                  groupData.members.forEach(member => {
                    if (!processedUSNs[eventName].has(member.usn)) {
                      processedUSNs[eventName].add(member.usn);
                      eventCounts[eventName].participantCount++;
                    }
                  });
                }
              }
            }
          }
        }

        const formattedData = Object.entries(eventCounts).map(([name, data]) => ({
          name,
          count: data.count,
          participantCount: data.participantCount,
          category: data.category,
        }));

        formattedData.sort((a, b) => b.count - a.count);

        setEventData(formattedData);
      } catch (err) {
        console.error("Error processing event data:", err);
        setError("Failed to process event statistics");
      } finally {
        setIsLoading(false);
      }
    };

    if (participants.length > 0) {
      processEventData();
    }
  }, [participants]);

  const handleDownloadEventData = async () => {
    try {
      await downloadEventData(eventData)
    } catch (error) {
      console.error("Error downloading event data:", error)
      setError("Failed to download event data")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>

        <div className="rounded-lg border p-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>

        <div className="rounded-lg border">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
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
        {["Technical", "Cultural", "Gaming", "Special","ComboPass"].map((category) => {
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