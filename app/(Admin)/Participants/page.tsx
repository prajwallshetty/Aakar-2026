"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DownloadCloud, Filter, Search, Calendar, School, FileSpreadsheet } from "lucide-react"
import type { Participant } from "@prisma/client"
import { getParticipants } from "@/backend/participant"
import { downloadParticipantData } from "@/components/(Admin)/Participants/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { EventStats } from "@/components/(Admin)/Participants/event-stats"
import { CollegeStats } from "@/components/(Admin)/Participants/college-stats"


export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollege, setSelectedCollege] = useState<string>("")
  const [colleges, setColleges] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setIsLoading(true)
        const response = await getParticipants()

        if (response.error) {
          setError(typeof response.error === "string" ? response.error : "Failed to fetch participants")
          return
        }

        if (response.data) {
          setParticipants(response.data)
          setFilteredParticipants(response.data)

          // Extract unique colleges
          const uniqueColleges = Array.from(new Set(response.data.map((p: Participant) => p.college))) as string[]
          setColleges(uniqueColleges)
        }
      } catch (err) {
        setError("An error occurred while fetching participants")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchParticipants()
  }, [])

  useEffect(() => {
    let result = [...participants]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query) ||
          p.phone.includes(query) ||
          p.college.toLowerCase().includes(query),
      )
    }


    // Apply college filter
    if (selectedCollege) {
      result = result.filter((p) => p.college === selectedCollege)
    }

    setFilteredParticipants(result)
  }, [searchQuery, selectedCollege, participants])

  const handleDownloadAll = async () => {
    try {
      await downloadParticipantData(filteredParticipants)
    } catch (error) {
      console.error("Error downloading data:", error)
      setError("Failed to download participant data")
    }
  }

  const handleDownloadByCollege = async () => {
    try {
      await downloadParticipantData(filteredParticipants, true)
    } catch (error) {
      console.error("Error downloading data by college:", error)
      setError("Failed to download participant data by college")
    }
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCollege("")
    setFilteredParticipants(participants)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Participant Management</CardTitle>
          <CardDescription>View and manage all participant registrations for your event</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="participants">
            <TabsList className="mb-4">
              <TabsTrigger value="participants" className="cursor-pointer">
                Participants
              </TabsTrigger>
              <TabsTrigger value="events" className="cursor-pointer">
                Event Statistics
              </TabsTrigger>
              <TabsTrigger value="colleges" className="cursor-pointer">
                College Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participants">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search participants..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                      <SelectTrigger className="w-full sm:w-[180px] cursor-pointer">
                        <SelectValue placeholder="College" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">
                          All Colleges
                        </SelectItem>
                        {colleges.map((college) => (
                          <SelectItem key={college} value={college} className="cursor-pointer">
                            {college}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={resetFilters} className="cursor-pointer">
                      <Filter className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{filteredParticipants.length} participants</Badge>
                    {selectedCollege && (
                      <Badge variant="secondary">
                        <School className="mr-1 h-3 w-3" />
                        {selectedCollege}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleDownloadAll} className="cursor-pointer">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Download Data
                    </Button>
                    <Button variant="outline" onClick={handleDownloadByCollege} className="cursor-pointer">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Download by College
                    </Button>
                  </div>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Registered On</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            Loading participants...
                          </TableCell>
                        </TableRow>
                      ) : filteredParticipants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            No participants found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredParticipants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell>{participant.email}</TableCell>
                            <TableCell>{participant.phone}</TableCell>
                            <TableCell>{participant.college}</TableCell>
                            <TableCell>{participant.department || "N/A"}</TableCell>
                            <TableCell>{participant.year}</TableCell>
                            <TableCell>{new Date(participant.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => (window.location.href = `/admin/participants/${participant.id}`)}
                                className="cursor-pointer"
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <EventStats participants={participants} />
            </TabsContent>

            <TabsContent value="colleges">
              <CollegeStats participants={participants} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}