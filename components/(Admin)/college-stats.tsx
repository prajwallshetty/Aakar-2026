"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Building2, Users, TrendingUp, Trophy } from "lucide-react"
import { downloadCollegeData } from "@/app/(Admin)/Participants/utils"
import { ExtendedParticipant } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

interface CollegeStatsProps {
  participants: ExtendedParticipant[]
}

const COLORS = [
  "#18181b", "#3f3f46", "#71717a", "#a1a1aa",
  "#2563eb", "#7c3aed", "#db2777", "#dc2626",
  "#d97706", "#16a34a", "#0891b2", "#0d9488",
  "#4f46e5", "#9333ea", "#c026d3", "#e11d48",
  "#ea580c", "#ca8a04", "#65a30d", "#059669",
]

const HOST_COLLEGE = "A J Institute of Engineering and Technology, Mangalore"

const StatCard = ({
  title,
  value,
  icon: Icon,
  sub,
  loading,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  sub?: string
  loading?: boolean
}) => (
  <Card className="border border-zinc-200 shadow-none">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-20 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-zinc-900 tracking-tight truncate">{value}</p>
          )}
          {sub && !loading && <p className="text-xs text-zinc-400 mt-0.5 truncate">{sub}</p>}
        </div>
        <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 ml-3">
          <Icon size={15} className="text-zinc-500" />
        </div>
      </div>
    </CardContent>
  </Card>
)

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs font-semibold text-zinc-800 max-w-[200px] leading-snug">{payload[0].name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{payload[0].value} participants · {(payload[0].payload.percent * 100).toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export function CollegeStats({ participants }: CollegeStatsProps) {
  const [collegeData, setCollegeData] = useState<{ name: string; value: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (participants.length > 0) {
      try {
        setIsLoading(true)
        const counts: Record<string, number> = {}
        for (const p of participants) {
          counts[p.college] = (counts[p.college] || 0) + 1
        }
        const formatted = Object.entries(counts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
        setCollegeData(formatted)
      } catch {
        setError("Failed to process college statistics")
      } finally {
        setIsLoading(false)
      }
    }
  }, [participants])

  const handleDownload = async () => {
    try {
      await downloadCollegeData(participants)
    } catch {
      setError("Failed to download college data")
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
        {error}
      </div>
    )
  }

  const totalParticipants = participants.length
  const totalColleges = new Set(participants.map(p => p.college)).size
  const nonHostData = collegeData.filter(e => e.name !== HOST_COLLEGE)
  const nonHostCount = nonHostData.reduce((s, c) => s + c.value, 0)
  const topCollege = nonHostData[0]
  const avgPerCollege = totalColleges ? (totalParticipants / totalColleges).toFixed(1) : "0"

  const pieData = nonHostData.slice(0, 20)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">College Statistics</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Registration breakdown by institution</p>
        </div>
        <Button
          size="sm"
          onClick={handleDownload}
          className="h-8 gap-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white w-fit"
        >
          <Download size={13} />
          Export Data
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total Colleges" value={isLoading ? "-" : totalColleges} icon={Building2} loading={isLoading} />
        <StatCard title="Total Registrations" value={isLoading ? "-" : totalParticipants} icon={Users} loading={isLoading} />
        <StatCard title="Non-Host Registrations" value={isLoading ? "-" : nonHostCount} icon={TrendingUp} loading={isLoading} sub="Excluding AJIET" />
        <StatCard
          title="Top External College"
          value={isLoading ? "-" : (topCollege?.name?.split(",")[0] || "—")}
          icon={Trophy}
          sub={topCollege ? `${topCollege.value} participants` : undefined}
          loading={isLoading}
        />
      </div>

      {/* Avg badge */}
      {!isLoading && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-zinc-200 text-zinc-500">
            Avg {avgPerCollege} registrations / college
          </Badge>
          <Badge variant="outline" className="text-xs border-zinc-200 text-zinc-500">
            {totalColleges} institutions represented
          </Badge>
        </div>
      )}

      {/* Pie Chart */}
      <Card className="border border-zinc-200 shadow-none hidden md:block">
        <CardHeader className="px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-zinc-900">Registrations by College</CardTitle>
            <Badge variant="outline" className="text-[10px] border-zinc-200 text-zinc-400">Excluding host college</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-80">
              <Skeleton className="h-64 w-64 rounded-full" />
            </div>
          ) : pieData.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-sm text-zinc-400">
              No college data available
            </div>
          ) : (
            <div className="h-[480px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    outerRadius={170}
                    innerRadius={60}
                    dataKey="value"
                    labelLine={false}
                    label={({ percent, value }) =>
                      percent > 0.04 ? `${value} (${(percent * 100).toFixed(0)}%)` : ""
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-zinc-600">
                        {value.length > 30 ? value.slice(0, 30) + "…" : value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table for top colleges */}
      {!isLoading && nonHostData.length > 0 && (
        <Card className="border border-zinc-200 shadow-none">
          <CardHeader className="px-6 py-5 border-b border-zinc-100">
            <CardTitle className="text-sm font-semibold text-zinc-900">Top External Colleges</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {nonHostData.slice(0, 10).map((college, i) => (
                <div key={college.name} className="flex items-center justify-between px-6 py-3 hover:bg-zinc-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-300 w-4">{i + 1}</span>
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-sm text-zinc-700 truncate max-w-xs">{college.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-24 hidden sm:block">
                      <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-zinc-800"
                          style={{ width: `${(college.value / nonHostData[0].value) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs border-zinc-200 font-mono">
                      {college.value}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}