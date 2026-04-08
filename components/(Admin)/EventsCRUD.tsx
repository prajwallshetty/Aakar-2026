"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Trash2, Pencil, AlertCircle, Plus, Clock, MapPin,
  Download, Calendar, MapPinned, LayoutGrid, Search, X, Users,
} from "lucide-react"
import { getAllEvents, createEvent, updateEvent, deleteEvent } from "@/backend/events"
import { uploadFile, deleteFiles } from "@/backend/supabase"
import type { eventCategory, eventType } from "@prisma/client"
import type { ExtendedEvent } from "@/types"
import { downloadParticipantDataByEvents } from "@/app/(Admin)/Participants/utils"
import { getParticipants } from "@/backend/participant"
import { cn, getEventImageCandidates } from "@/lib/utils"

interface Coordinator { name: string; phone: string }
interface FormData {
  eventName: string; eventType: eventType; eventCategory: eventCategory
  description: string; fee: number; date: Date; time: string; venue: string
  studentCoordinators: Coordinator[]; facultyCoordinators: Coordinator[]
  rules: string[]; imageUrl: string; minMembers: number; maxMembers: number
}

type GroupingOption = "none" | "venue" | "date" | "category"

const isValidDate = (date: Date) => !Number.isNaN(date.getTime())

const toSafeDate = (value: unknown, fallback: Date) => {
  const parsed = value instanceof Date ? value : new Date(String(value ?? ""))
  return isValidDate(parsed) ? parsed : fallback
}

const isRemoteImageUrl = (value: string) => /^https?:\/\//i.test(value.trim())

const normalizeImageInput = (value: string) => {
  const raw = value.trim()
  if (!raw) return ""
  if (isRemoteImageUrl(raw)) return raw

  const withoutPrefix = raw
    .replace(/^\.\//, "")
    .replace(/^\//, "")
    .replace(/^events\//i, "")

  return withoutPrefix.replace(/\.(PNG|JPG|JPEG|WEBP|GIF|AVIF|SVG)$/, m => m.toLowerCase())
}

const CATEGORY_COLORS: Record<string, string> = {
  Technical: "bg-blue-50 text-blue-700 border-blue-100",
  Cultural: "bg-purple-50 text-purple-700 border-purple-100",
  Gaming: "bg-green-50 text-green-700 border-green-100",
  Special: "bg-amber-50 text-amber-700 border-amber-100",
}

const TYPE_COLORS: Record<string, string> = {
  Solo: "bg-zinc-100 text-zinc-600",
  Team: "bg-indigo-50 text-indigo-600",
}

const CoordinatorList = ({
  label,
  coordinators,
  newEntry,
  setNewEntry,
  onAdd,
  onRemove,
}: {
  label: string
  coordinators: Coordinator[]
  newEntry: Coordinator
  setNewEntry: (c: Coordinator) => void
  onAdd: () => void
  onRemove: (i: number) => void
}) => (
  <div className="space-y-2">
    <Label className="text-xs font-medium text-zinc-700">{label}</Label>
    {coordinators.length > 0 && (
      <div className="space-y-1.5">
        {coordinators.map((c, i) => (
          <div key={i} className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-md px-3 py-2">
            <span className="text-xs font-medium text-zinc-700 flex-1">{c.name}</span>
            <span className="text-xs text-zinc-400">{c.phone}</span>
            <button type="button" onClick={() => onRemove(i)} className="text-zinc-300 hover:text-red-400 ml-1">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    )}
    <div className="flex gap-2">
      <Input placeholder="Name" value={newEntry.name} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} className="h-8 text-xs border-zinc-200" />
      <Input placeholder="Phone" value={newEntry.phone} onChange={e => setNewEntry({ ...newEntry, phone: e.target.value })} className="h-8 text-xs border-zinc-200 w-32" />
      <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-zinc-200 shrink-0" onClick={onAdd}>Add</Button>
    </div>
  </div>
)

const EventsCRUD = () => {
  const [events, setEvents] = useState<ExtendedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [sortField, setSortField] = useState("fee")
  const [sortDirection, setSortDirection] = useState("desc")
  const [groupingOption, setGroupingOption] = useState<GroupingOption>("none")
  const [newStudentCoord, setNewStudentCoord] = useState<Coordinator>({ name: "", phone: "" })
  const [newFacultyCoord, setNewFacultyCoord] = useState<Coordinator>({ name: "", phone: "" })
  const [newRule, setNewRule] = useState("")
  const [uploadProgress, setUploadProgress] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<number[]>([])
  const [downloading, setDownloading] = useState(false)
  const [imagePreviewSrc, setImagePreviewSrc] = useState("")
  const [imagePreviewStatus, setImagePreviewStatus] = useState<"idle" | "loading" | "found" | "missing">("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const defaultForm: FormData = {
    eventName: "", eventType: "Solo", eventCategory: "Cultural",
    description: "", fee: 0, date: new Date("2026-04-24"), time: "", venue: "",
    studentCoordinators: [], facultyCoordinators: [], rules: [], imageUrl: "",
    minMembers: 1, maxMembers: 1,
  }
  const [formData, setFormData] = useState<FormData>(defaultForm)

  const dateOptions = [
    { value: new Date("2026-04-24"), label: "Apr 24, 2026" },
    { value: new Date("2026-04-25"), label: "Apr 25, 2026" },
  ]

  useEffect(() => { fetchEvents() }, [])

  useEffect(() => {
    const source = normalizeImageInput(formData.imageUrl)
    if (!source) {
      setImagePreviewSrc("")
      setImagePreviewStatus("idle")
      return
    }

    const candidates = getEventImageCandidates(source)
    if (candidates.length === 0) {
      setImagePreviewSrc("")
      setImagePreviewStatus("missing")
      return
    }

    let cancelled = false
    setImagePreviewStatus("loading")

    const tryNext = (index: number) => {
      if (cancelled) return
      if (index >= candidates.length) {
        setImagePreviewSrc("")
        setImagePreviewStatus("missing")
        return
      }

      const img = new Image()
      img.onload = () => {
        if (cancelled) return
        setImagePreviewSrc(candidates[index])
        setImagePreviewStatus("found")
      }
      img.onerror = () => {
        tryNext(index + 1)
      }
      img.src = candidates[index]
    }

    tryNext(0)

    return () => {
      cancelled = true
    }
  }, [formData.imageUrl])

  const safeParseCoordinators = (value: any): Coordinator[] => {
    try {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") return JSON.parse(value) || [];
      return [];
    } catch {
      return [];
    }
  }

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await getAllEvents()
      if (data) {
        const formatted = data.map(e => ({
          ...e, date: toSafeDate(e.date, dateOptions[0].value),
          studentCoordinators: safeParseCoordinators(e.studentCoordinators),
          facultyCoordinators: safeParseCoordinators(e.facultyCoordinators),
        }))
        setEvents(sortEvents(formatted, sortField, sortDirection))
      }
    } catch { setError("Could not fetch events.") }
    finally { setLoading(false) }
  }

  const sortEvents = (list: any[], field: string, dir: string) =>
    [...list].sort((a, b) => field === "fee" ? (dir === "desc" ? b.fee - a.fee : a.fee - b.fee) : 0)

  const toggleSort = (field: string) => {
    const newDir = field === sortField && sortDirection === "desc" ? "asc" : "desc"
    setSortField(field); setSortDirection(newDir)
    setEvents(sortEvents(events, field, newDir))
  }

  const getGrouped = (): Record<string, ExtendedEvent[]> => {
    if (groupingOption === "none") return { "All Events": events }
    const grouped: Record<string, ExtendedEvent[]> = {}
    const sorted = groupingOption === "date"
      ? [...events].sort((a, b) => a.date.getTime() - b.date.getTime())
      : [...events]
    sorted.forEach(e => {
      const key = groupingOption === "venue" ? (e.venue || "No Venue")
        : groupingOption === "date" ? e.date.toDateString()
          : e.eventCategory
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(e)
    })
    return grouped
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: ["fee", "minMembers", "maxMembers"].includes(name) ? parseInt(value) || 0 : value }))
  }

  const resetForm = () => {
    setFormData(defaultForm); setIsEditing(false); setCurrentId(null)
    setNewStudentCoord({ name: "", phone: "" }); setNewFacultyCoord({ name: "", phone: "" }); setNewRule("")
    setSelectedFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setUploadProgress(true)
    try {
      let finalImageUrl = normalizeImageInput(formData.imageUrl)

      // If a file is selected, upload it first
      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile, "eventimages")
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl
        } else {
          throw new Error("Failed to upload image")
        }
      }

      const studentCoordinators = [...formData.studentCoordinators]
      if (newStudentCoord.name.trim() && newStudentCoord.phone.trim()) {
        studentCoordinators.push({ ...newStudentCoord })
      }

      const facultyCoordinators = [...formData.facultyCoordinators]
      if (newFacultyCoord.name.trim() && newFacultyCoord.phone.trim()) {
        facultyCoordinators.push({ ...newFacultyCoord })
      }

      const rules = [...formData.rules]
      if (newRule.trim()) {
        rules.push(newRule.trim())
      }

      const payload: any = {
        ...formData,
        imageUrl: finalImageUrl,
        studentCoordinators,
        facultyCoordinators,
        rules,
      }

      if (isEditing && currentId) {
        await updateEvent(currentId, payload)
      } else {
        await createEvent(payload)
      }
      fetchEvents(); resetForm(); setOpenDialog(false)
    } catch (err: any) { 
      console.error("Submit error:", err)
      setError(err.message || "Could not save event. Please try again.") 
    }
    finally { setUploadProgress(false) }
  }

  const handleEdit = (event: ExtendedEvent) => {
    setFormData({
      eventName: event.eventName, eventType: event.eventType, eventCategory: event.eventCategory,
      description: event.description, fee: event.fee, date: toSafeDate(event.date, dateOptions[0].value),
      time: event.time, venue: event.venue, studentCoordinators: safeParseCoordinators(event.studentCoordinators) || [],
      facultyCoordinators: safeParseCoordinators(event.facultyCoordinators) || [], rules: event.rules || [],
      imageUrl: event.imageUrl, minMembers: event.minMembers, maxMembers: event.maxMembers,
    })
    setNewStudentCoord({ name: "", phone: "" })
    setNewFacultyCoord({ name: "", phone: "" })
    setNewRule("")
    setCurrentId(event.id); setIsEditing(true); setOpenDialog(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const ev = events.find(e => e.id === id)
      await deleteEvent(id)
      if (ev?.imageUrl && isRemoteImageUrl(ev.imageUrl)) await deleteFiles([ev.imageUrl])
      fetchEvents()
    } catch { setError("Could not delete event.") }
  }

  const toggleEventSelect = (id: number) =>
    setSelectedEvents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const toggleGroupSelect = (groupEvents: ExtendedEvent[], checked: boolean) => {
    const ids = groupEvents.map(e => e.id)
    setSelectedEvents(prev => checked ? [...new Set([...prev, ...ids])] : prev.filter(id => !ids.includes(id)))
  }

  const groupedEvents = getGrouped()
  const selectedDateValue = isValidDate(formData.date)
    ? formData.date.toISOString()
    : dateOptions[0].value.toISOString()

  const renderGroup = (groupTitle: string, groupEvents: ExtendedEvent[]) => {
    const filtered = groupEvents.filter(e => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return e.id.toString().includes(q) || e.eventName.toLowerCase().includes(q)
    })
    const allSelected = groupEvents.every(e => selectedEvents.includes(e.id))

    return (
      <Card key={groupTitle} className="border border-zinc-200 shadow-none mb-4">
        <CardHeader className="px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={e => toggleGroupSelect(groupEvents, e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
              />
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900">{groupTitle}</CardTitle>
                <CardDescription className="text-[11px] mt-0.5">
                  {filtered.length} event{filtered.length !== 1 ? "s" : ""}
                  {filtered.length !== groupEvents.length && ` of ${groupEvents.length}`}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-100 hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-6 py-3 w-48">Event</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-3">Type</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-3">Category</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-3">Date & Time</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-3">Venue</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-3">Fee</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-3 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-zinc-400">No events match your search</TableCell>
                </TableRow>
              ) : filtered.map(event => (
                <TableRow key={event.id} className={cn("border-zinc-100 hover:bg-zinc-50/80 transition-colors", selectedEvents.includes(event.id) && "bg-zinc-50")}>
                  <TableCell className="px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => toggleEventSelect(event.id)}
                        className="h-3.5 w-3.5 rounded border-zinc-300 accent-zinc-900 cursor-pointer shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-zinc-800">{event.eventName}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">#{event.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", TYPE_COLORS[event.eventType] || "bg-zinc-100 text-zinc-600")}>
                      {event.eventType}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border", CATEGORY_COLORS[event.eventCategory] || "bg-zinc-50 text-zinc-600 border-zinc-100")}>
                      {event.eventCategory}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="text-xs text-zinc-700">{event.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />{event.time}
                    </p>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs text-zinc-600 flex items-center gap-1">
                      <MapPin size={11} className="text-zinc-400 shrink-0" />
                      <span className="truncate max-w-[120px]">{event.venue}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm font-semibold text-zinc-800">₹{event.fee}</span>
                  </TableCell>
                  <TableCell className="py-3 pr-6">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100" onClick={() => handleEdit(event)}>
                        <Pencil size={13} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-red-500 hover:bg-red-50">
                            <Trash2 size={13} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base">Delete event?</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs">
                              This will permanently delete "{event.eventName}" and all its registration data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="h-8 text-xs border-zinc-200">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="h-8 text-xs bg-red-600 hover:bg-red-700" onClick={() => handleDelete(event.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Events Management</h1>
            <p className="text-sm text-zinc-500 mt-1">Create, edit, and manage all fest events</p>
          </div>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white"
            onClick={() => { resetForm(); setOpenDialog(true) }}
          >
            <Plus size={13} /> Add Event
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            <AlertCircle size={13} /> {error}
          </div>
        )}

        {/* Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Group by */}
          <div className="flex items-center gap-1.5 border border-zinc-200 rounded-md p-0.5 bg-white">
            {([
              { val: "none", label: "All", icon: LayoutGrid },
              { val: "category", label: "Category", icon: LayoutGrid },
              { val: "date", label: "Date", icon: Calendar },
              { val: "venue", label: "Venue", icon: MapPinned },
            ] as const).map(({ val, label, icon: Icon }) => (
              <button
                key={val}
                onClick={() => setGroupingOption(val)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors",
                  groupingOption === val
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:text-zinc-800"
                )}
              >
                <Icon size={12} />{label}
              </button>
            ))}
          </div>

          {/* Sort fee */}
          <button
            onClick={() => toggleSort("fee")}
            className={cn(
              "flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border transition-colors font-medium",
              sortField === "fee"
                ? "bg-zinc-900 text-white border-zinc-900"
                : "border-zinc-200 text-zinc-500 hover:text-zinc-800 bg-white"
            )}
          >
            Fee {sortField === "fee" && (sortDirection === "desc" ? "↓" : "↑")}
          </button>

          {/* Search */}
          <div className="relative ml-auto">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search by name or ID…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs w-52 border-zinc-200 bg-white"
            />
          </div>

          {/* Bulk download */}
          {selectedEvents.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs border-zinc-200"
              disabled={downloading}
              onClick={async () => {
                setDownloading(true)
                await downloadParticipantDataByEvents((await getParticipants()).data || [], selectedEvents)
                setDownloading(false)
              }}
            >
              <Download size={13} />
              {downloading ? "Downloading…" : `Export ${selectedEvents.length} selected`}
            </Button>
          )}
        </div>

        {/* Events Table */}
        {loading ? (
          <Card className="border border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-md" />)}
            </CardContent>
          </Card>
        ) : events.length === 0 ? (
          <Card className="border border-zinc-200 shadow-none">
            <CardContent className="py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center">
                  <Calendar size={20} className="text-zinc-400" />
                </div>
                <p className="text-sm text-zinc-500">No events yet</p>
                <Button size="sm" className="h-8 text-xs gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white mt-1"
                  onClick={() => { resetForm(); setOpenDialog(true) }}>
                  <Plus size={13} /> Create your first event
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedEvents).map(([title, evs]) => renderGroup(title, evs))
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={openDialog} onOpenChange={open => { setOpenDialog(open); if (!open) resetForm() }}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">{isEditing ? "Edit Event" : "Create Event"}</DialogTitle>
              <DialogDescription className="text-xs">
                {isEditing ? "Update event details below." : "Fill in the details for the new event."}
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">

              {/* Basic info */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Event Name</Label>
                <Input name="eventName" placeholder="e.g. Robo Wars" value={formData.eventName} onChange={handleInput} required className="h-9 text-sm border-zinc-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-700">Type</Label>
                  <Select value={formData.eventType} onValueChange={(v: eventType) => setFormData(p => ({ ...p, eventType: v }))}>
                    <SelectTrigger className="h-9 text-sm border-zinc-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Solo", "Team"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-700">Category</Label>
                  <Select value={formData.eventCategory} onValueChange={(v: eventCategory) => setFormData(p => ({ ...p, eventCategory: v }))}>
                    <SelectTrigger className="h-9 text-sm border-zinc-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Technical", "Cultural", "Gaming", "Special"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.eventType === "Team" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700">Min Members</Label>
                    <Input name="minMembers" type="number" min="1" value={formData.minMembers} onChange={handleInput} className="h-9 text-sm border-zinc-200" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700">Max Members</Label>
                    <Input name="maxMembers" type="number" min={formData.minMembers} value={formData.maxMembers} onChange={handleInput} className="h-9 text-sm border-zinc-200" required />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-700">Fee (₹)</Label>
                  <Input name="fee" type="number" min="0" value={formData.fee} onChange={handleInput} className="h-9 text-sm border-zinc-200" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-700">Event Image</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                       <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="h-9 text-xs border-zinc-200 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-50 file:text-zinc-700 hover:file:bg-zinc-100 cursor-pointer" 
                      />
                      <span className="text-zinc-400 py-2 text-xs">OR</span>
                      <Input name="imageUrl" value={formData.imageUrl} onChange={handleInput} placeholder="ID or URL" className="h-9 text-sm border-zinc-200" />
                    </div>
                    
                    <div className="text-[11px] text-zinc-500 min-h-4">
                      {selectedFile ? (
                        <span className="text-green-600 font-medium">Ready to upload: {selectedFile.name}</span>
                      ) : (
                        <>
                          {imagePreviewStatus === "idle" && "Enter a number like 25 or filename like 25.png"}
                          {imagePreviewStatus === "loading" && "Checking image..."}
                          {imagePreviewStatus === "found" && `Found: ${imagePreviewSrc}`}
                          {imagePreviewStatus === "missing" && "No matching file found /public/events"}
                        </>
                      )}
                      {error && error.includes("upload") && (
                        <div className="text-red-500 mt-1 font-semibold flex items-center gap-1">
                          <AlertCircle size={10} /> {error}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {(imagePreviewSrc || selectedFile) && (
                    <div className="h-24 w-20 overflow-hidden rounded border border-zinc-200 bg-zinc-100 mt-1">
                      <img
                        src={selectedFile ? URL.createObjectURL(selectedFile) : imagePreviewSrc}
                        alt="Event preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleInput} rows={3} placeholder="Describe the event…" className="text-sm border-zinc-200 resize-none" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-700">Date</Label>
                  <Select value={selectedDateValue} onValueChange={v => setFormData(p => ({ ...p, date: toSafeDate(v, dateOptions[0].value) }))}>
                    <SelectTrigger className="h-9 text-sm border-zinc-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {dateOptions.map((d, i) => <SelectItem key={i} value={d.value.toISOString()}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-700">Time</Label>
                  <Input name="time" value={formData.time} onChange={handleInput} placeholder="e.g. 10:00 AM – 1:00 PM" className="h-9 text-sm border-zinc-200" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Venue</Label>
                <Input name="venue" value={formData.venue} onChange={handleInput} placeholder="e.g. Main Auditorium" className="h-9 text-sm border-zinc-200" required />
              </div>

              <Separator className="bg-zinc-100" />

              <CoordinatorList
                label="Student Coordinators"
                coordinators={formData.studentCoordinators}
                newEntry={newStudentCoord}
                setNewEntry={setNewStudentCoord}
                onAdd={() => {
                  if (newStudentCoord.name && newStudentCoord.phone) {
                    setFormData(p => ({ ...p, studentCoordinators: [...p.studentCoordinators, { ...newStudentCoord }] }))
                    setNewStudentCoord({ name: "", phone: "" })
                  }
                }}
                onRemove={i => setFormData(p => ({ ...p, studentCoordinators: p.studentCoordinators.filter((_, j) => j !== i) }))}
              />

              <CoordinatorList
                label="Faculty Coordinators"
                coordinators={formData.facultyCoordinators}
                newEntry={newFacultyCoord}
                setNewEntry={setNewFacultyCoord}
                onAdd={() => {
                  if (newFacultyCoord.name && newFacultyCoord.phone) {
                    setFormData(p => ({ ...p, facultyCoordinators: [...p.facultyCoordinators, { ...newFacultyCoord }] }))
                    setNewFacultyCoord({ name: "", phone: "" })
                  }
                }}
                onRemove={i => setFormData(p => ({ ...p, facultyCoordinators: p.facultyCoordinators.filter((_, j) => j !== i) }))}
              />

              <Separator className="bg-zinc-100" />

              {/* Rules */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Event Rules</Label>
                {formData.rules.length > 0 && (
                  <div className="space-y-1.5">
                    {formData.rules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-md px-3 py-2">
                        <span className="text-[10px] font-mono text-zinc-400 w-4">{i + 1}.</span>
                        <span className="text-xs text-zinc-700 flex-1">{rule}</span>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, rules: p.rules.filter((_, j) => j !== i) }))} className="text-zinc-300 hover:text-red-400">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input placeholder="Add a rule…" value={newRule} onChange={e => setNewRule(e.target.value)} className="h-8 text-xs border-zinc-200" />
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-zinc-200 shrink-0"
                    onClick={() => { if (newRule) { setFormData(p => ({ ...p, rules: [...p.rules, newRule] })); setNewRule("") } }}>
                    Add
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  <AlertCircle size={13} /> {error}
                </div>
              )}

              <DialogFooter className="gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-zinc-200" onClick={() => { resetForm(); setOpenDialog(false) }}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs bg-zinc-900 hover:bg-zinc-800" disabled={uploadProgress}>
                  {uploadProgress ? "Saving…" : isEditing ? "Update Event" : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default EventsCRUD