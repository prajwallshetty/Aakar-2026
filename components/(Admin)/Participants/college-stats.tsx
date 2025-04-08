"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { Participant } from "@prisma/client"
import { downloadCollegeData } from "@/app/(Admin)/Participants/utils"

interface CollegeStatsProps {
  participants: Participant[]
}

export function CollegeStats({ participants }: CollegeStatsProps) {
  const [collegeData, setCollegeData] = useState<{ name: string; value: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ]

  useEffect(() => {
    const processCollegeData = () => {
      try {
        setIsLoading(true)

        const collegeCounts: Record<string, number> = {}

        for (const participant of participants) {
          const college = participant.college
          if (!collegeCounts[college]) {
            collegeCounts[college] = 0
          }
          collegeCounts[college]++
        }

        let formattedData = Object.entries(collegeCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)

        if (formattedData.length > 10) {
          const topColleges = formattedData.slice(0, 9)
          const otherColleges = formattedData.slice(9)

          const otherCount = otherColleges.reduce((sum, college) => sum + college.value, 0)

          formattedData = [...topColleges, { name: "Others", value: otherCount }]
        }

        setCollegeData(formattedData)
      } catch (err) {
        console.error("Error processing college data:", err)
        setError("Failed to process college statistics")
      } finally {
        setIsLoading(false)
      }
    }

    if (participants.length > 0) {
      processCollegeData()
    }
  }, [participants])

  const handleDownloadCollegeData = async () => {
    try {
      await downloadCollegeData(participants)
    } catch (error) {
      console.error("Error downloading college data:", error)
      setError("Failed to download college data")
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading college statistics...</div>
  }

  if (error) {
    return <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
  }

  const totalParticipants = participants.length
  const totalColleges = Object.keys(
    participants.reduce(
      (acc, participant) => {
        acc[participant.college] = true
        return acc
      },
      {} as Record<string, boolean>,
    ),
  ).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">College Registration Statistics</h3>
        <Button onClick={handleDownloadCollegeData} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          Download College Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalColleges}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Participants per College</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalColleges ? (totalParticipants / totalColleges).toFixed(1) : "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top College</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{collegeData.length > 0 ? collegeData[0].name : "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {collegeData.length > 0 ? `${collegeData[0].value} participants` : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participants by College</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {collegeData.length === 0 ? (
              <div className="flex justify-center items-center h-full text-muted-foreground">
                No college data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collegeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {collegeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} participants`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

