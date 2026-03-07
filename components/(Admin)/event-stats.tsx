"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Filter, Loader2, Gamepad2, Music2, Cpu, Star } from "lucide-react"
import { downloadEventData } from "@/app/(Admin)/Participants/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { getEventsOfUser } from "@/backend/events"
import type { ExtendedParticipant } from "@/types"

interface EventStatsProps {
  participants: ExtendedParticipant[]
}

type EventData = {
  name: string
  count: number
  category: string
  participantCount: number
  ajietCount: number
  nonAjietCount: number
}

const COLORS = ["#18181b", "#3f3f46", "#71717a", "#2563eb", "#7c3aed", "#db2777", "#dc2626", "#d97706", "#16a34a", "#0891b2"]

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Technical: Cpu,
  Cultural: Music2,
  Gaming: Gamepad2,
  Special: Star,
}

const AJIET = "A J Institute of Engineering and Technology, Mangalore"

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs font-semibold text-zinc-800 max-w-[180px] leading-snug">{payload[0].payload.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{payload[0].value} registrations</p>
        {payload[0].payload.category && (
          <p className="text-[10px] text-zinc-400">{payload[0].payload.category}</p>
        )}
      </div>
    )
  }
  return null
}

const BarChartCard = ({ title, data }: { title: string; data: { name: string; value: number; category: string }[] }) => (
  <Card className="border border-zinc-200 shadow-none">
    <CardHeader className="px-5 py-4 border-b border-zinc-100">
      <CardTitle className="text-sm font-semibold text-zinc-900">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-4">
      <div className="h-[300px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-zinc-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 90, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f4f4f5" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={88}
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickFormatter={(v) => (v.length > 12 ? `${v.slice(0, 12)}…` : v)}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f4f4f5" }} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={18}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </CardContent>
  </Card>
)

export function EventStats({ participants }: EventStatsProps) {
  const [eventData, setEventData] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(50)
  const [processedCount, setProcessedCount] = useState(0)
  const [totalToProcess, setTotalToProcess] = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    const process = async () => {
      abortRef.current?.abort()
      abortRef.current = new AbortController()
      setIsLoading(true)
      setProcessedCount(0)
      setTotalToProcess(participants.length)

      try {
        const eventCounts: Record<string, { count: number; category: string; participantCount: number; ajietCount: number; nonAjietCount: number }> = {}
        const usns: Record<string, { all: Set<string>; ajiet: Set<string>; nonAjiet: Set<string> }> = {}

        for (let i = 0; i < participants.length; i += 10) {
          if (abortRef.current?.signal.aborted) return
          const batch = participants.slice(i, i + 10)

          for (const p of batch) {
            const events = await getEventsOfUser(p.id)
            const isAjiet = p.college?.includes(AJIET) || false

            if (events && Array.isArray(events)) {
              for (const event of events) {
                const n = event.eventName
                if (!eventCounts[n]) {
                  eventCounts[n] = { count: 0, category: event.eventCategory, participantCount: 0, ajietCount: 0, nonAjietCount: 0 }
                  usns[n] = { all: new Set(), ajiet: new Set(), nonAjiet: new Set() }
                }
                eventCounts[n].count++
                if (!usns[n].all.has(p.usn)) {
                  usns[n].all.add(p.usn)
                  eventCounts[n].participantCount++
                  if (isAjiet) { usns[n].ajiet.add(p.usn); eventCounts[n].ajietCount++ }
                  else { usns[n].nonAjiet.add(p.usn); eventCounts[n].nonAjietCount++ }
                }
              }
            }
            setProcessedCount(prev => prev + 1)
          }

          const partial = Object.entries(eventCounts).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.count - a.count)
          setEventData(partial)
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError("Failed to process event statistics")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (participants.length > 0) process()
  }, [participants])

  const prepareBarData = (type: "all" | "ajiet" | "nonAjiet") =>
    eventData.slice(0, displayCount)
      .map(e => ({
        name: e.name,
        value: type === "all" ? e.participantCount : type === "ajiet" ? e.ajietCount : e.nonAjietCount,
        category: e.category,
      }))
      .filter(e => e.value > 0)
      .sort((a, b) => b.value - a.value)

  const getCategoryData = (type: "all" | "ajiet" | "nonAjiet") => {
    const map: Record<string, number> = {}
    eventData.forEach(e => {
      const count = type === "all" ? e.participantCount : type === "ajiet" ? e.ajietCount : e.nonAjietCount
      if (count > 0) map[e.category] = (map[e.category] || 0) + count
    })
    return Object.entries(map).map(([name, value]) => ({ name, value, category: name })).sort((a, b) => b.value - a.value)
  }

  if (error) {
    return <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>
  }

  const categories = ["Technical", "Cultural", "Gaming", "Special"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Event Statistics</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Registration breakdown by event and category</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-zinc-400" />
            <Select value={displayCount.toString()} onValueChange={v => setDisplayCount(parseInt(v))}>
              <SelectTrigger className="h-8 text-xs w-36 border-zinc-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">All events</SelectItem>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="15">Top 15</SelectItem>
                <SelectItem value="20">Top 20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white" onClick={() => downloadEventData(eventData)}>
            <Download size={13} /> All Data
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs border-zinc-200" onClick={() => downloadEventData(eventData.map(e => ({ ...e, count: e.ajietCount, participantCount: e.ajietCount, nonAjietCount: 0 })).filter(e => e.ajietCount > 0))}>
            <Download size={13} /> AJIET
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs border-zinc-200" onClick={() => downloadEventData(eventData.map(e => ({ ...e, count: e.nonAjietCount, participantCount: e.nonAjietCount, ajietCount: 0 })).filter(e => e.nonAjietCount > 0))}>
            <Download size={13} /> Non-AJIET
          </Button>
        </div>
      </div>

      {/* Progress */}
      {isLoading && (
        <Card className="border border-zinc-200 shadow-none">
          <CardContent className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 size={13} className="animate-spin text-zinc-400" />
              <p className="text-xs text-zinc-500">
                Processing {processedCount} of {totalToProcess} participants…
              </p>
              <span className="ml-auto text-xs font-mono text-zinc-400">
                {totalToProcess > 0 ? Math.round((processedCount / totalToProcess) * 100) : 0}%
              </span>
            </div>
            <Progress value={totalToProcess > 0 ? (processedCount / totalToProcess) * 100 : 0} className="h-1.5" />
          </CardContent>
        </Card>
      )}

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map(cat => {
          const Icon = CATEGORY_ICONS[cat] || Star
          const catEvents = eventData.filter(e => e.category.toLowerCase() === cat.toLowerCase())
          const total = catEvents.reduce((s, e) => s + e.count, 0)

          return (
            <Card key={cat} className="border border-zinc-200 shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">{cat}</p>
                    {isLoading && eventData.length === 0 ? (
                      <Skeleton className="h-7 w-12" />
                    ) : (
                      <p className="text-2xl font-bold text-zinc-900">{catEvents.length}</p>
                    )}
                    <p className="text-xs text-zinc-400 mt-0.5">{total} registrations</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-zinc-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="all" className="hidden md:block">
        <TabsList className="h-8 bg-zinc-100 border border-zinc-200 p-0.5">
          {["all", "ajiet", "nonAjiet"].map(tab => (
            <TabsTrigger key={tab} value={tab} className="text-xs h-7 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {tab === "all" ? "All" : tab === "ajiet" ? "AJIET" : "Non-AJIET"}
            </TabsTrigger>
          ))}
        </TabsList>

        {(["all", "ajiet", "nonAjiet"] as const).map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BarChartCard
                title={`Top Events · ${tab === "all" ? "All" : tab === "ajiet" ? "AJIET" : "Non-AJIET"}`}
                data={prepareBarData(tab)}
              />
              <BarChartCard
                title={`By Category · ${tab === "all" ? "All" : tab === "ajiet" ? "AJIET" : "Non-AJIET"}`}
                data={getCategoryData(tab)}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}