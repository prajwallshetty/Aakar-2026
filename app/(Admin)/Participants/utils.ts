import type { Participant, Event } from "@prisma/client"
import JSZip from "jszip"

type ExtendedParticipant1 = Participant & {
  events?: Event[]
}

function objectsToCsv(data: any) {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])

  const headerRow = headers.join(",")

  const rows = data.map((obj: any) => {
    return headers
      .map((header) => {
        let value = obj[header]

        if (value === null || value === undefined) {
          value = ""
        } else if (typeof value === "string") {
          value = `"${value.replace(/"/g, '""')}"`
        } else {
          value = String(value)
        }

        return value
      })
      .join(",")
  })

  return [headerRow, ...rows].join("\n")
}

export async function downloadParticipantData(participants: ExtendedParticipant1[], groupByCollege = false) {
  if (groupByCollege) {
    const collegeGroups: Record<string, ExtendedParticipant1[]> = {}

    participants.forEach((participant) => {
      if (!collegeGroups[participant.college]) {
        collegeGroups[participant.college] = []
      }
      collegeGroups[participant.college].push(participant)
    })

    const zip = new JSZip()

    for (const [college, collegeParticipants] of Object.entries(collegeGroups)) {
      const wsData = collegeParticipants.map((p) => ({
        ID: p.id,
        Name: p.name,
        USN: p.usn,
        Email: p.email,
        Phone: p.phone,
        Department: p.department || "N/A",
        Year: p.year,
        "Registered On": new Date(p.createdAt).toLocaleString(),
        "Amount Paid": p.amount,
        "Transaction ID": p.transaction_ids.join(", ") || "N/A",
        Events: p.events ? p.events.map((e) => e.eventName).join(", ") : "None",
      }))

      const csvContent = objectsToCsv(wsData)
      const filename = `${college.replace(/[^a-zA-Z0-9]/g, "_")}.csv`
      zip.file(filename, csvContent)
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = "participants_by_college.zip"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  } else {
    const wsData = participants.map((p) => ({
      ID: p.id,
      Name: p.name,
      USN: p.usn,
      Email: p.email,
      Phone: p.phone,
      College: p.college,
      Department: p.department || "N/A",
      Year: p.year,
      "Registered On": new Date(p.createdAt).toLocaleString(),
      "Amount Paid": p.amount,
      "Transaction ID": p.transaction_ids.join(", ") || "N/A",
      Events: p.events ? p.events.map((e) => e.eventName).join(", ") : "None",
    }))

    const csvContent = objectsToCsv(wsData)

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "all_participants.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export async function downloadEventData(eventData: { name: string; count: number; category: string }[]) {
  const wsData = eventData.map((event) => ({
    "Event Name": event.name,
    Category: event.category,
    Registrations: event.count,
  }))

  const csvContent = objectsToCsv(wsData)

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "event_data.csv"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadCollegeData(participants: ExtendedParticipant1[]) {
  const collegeGroups: Record<string, ExtendedParticipant1[]> = {}

  participants.forEach((participant) => {
    if (!collegeGroups[participant.college]) {
      collegeGroups[participant.college] = []
    }
    collegeGroups[participant.college].push(participant)
  })

  const collegeStats = Object.entries(collegeGroups).map(([college, participants]) => ({
    "College Name": college,
    Participants: participants.length,
    "Total Amount": participants.reduce((sum, p) => sum + p.amount, 0),
  }))

  collegeStats.sort((a, b) => b.Participants - a.Participants)

  const csvContent = objectsToCsv(collegeStats)

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "college_statistics.csv"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadParticipantDetail(participant: ExtendedParticipant1) {
  if ((participant.events && participant.events.length > 0) || participant.groupMembersData) {
    const zip = new JSZip()

    const participantData = [
      {
        ID: participant.id,
        Name: participant.name,
        USN: participant.usn,
        Email: participant.email,
        Phone: participant.phone,
        College: participant.college,
        Department: participant.department || "N/A",
        Year: participant.year,
        "Registered On": new Date(participant.createdAt).toLocaleString(),
        "Amount Paid": participant.amount,
        "Transaction ID": participant.transaction_ids.join(", ") || "N/A",
      },
    ]

    zip.file("participant_details.csv", objectsToCsv(participantData))

    if (participant.events && participant.events.length > 0) {
      const eventsData = participant.events.map((event) => ({
        "Event Name": event.eventName,
        Category: event.eventCategory,
        Type: event.eventType,
        Date: new Date(event.date).toLocaleDateString(),
        Time: event.time,
        Venue: event.venue,
        Fee: event.fee,
      }))

      zip.file("registered_events.csv", objectsToCsv(eventsData))
    }

    if (participant.groupMembersData) {
      try {
        const groupMembers =
          typeof participant.groupMembersData === "string"
            ? JSON.parse(participant.groupMembersData)
            : participant.groupMembersData

        if (Array.isArray(groupMembers) && groupMembers.length > 0) {
          zip.file("group_members.csv", objectsToCsv(groupMembers))
        }
      } catch (error) {
        console.error("Error parsing group members data:", error)
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = `participant_${participant.id}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  } else {
    const participantData = [
      {
        ID: participant.id,
        Name: participant.name,
        USN: participant.usn,
        Email: participant.email,
        Phone: participant.phone,
        College: participant.college,
        Department: participant.department || "N/A",
        Year: participant.year,
        "Registered On": new Date(participant.createdAt).toLocaleString(),
        "Amount Paid": participant.amount,
        "Transaction ID": participant.transaction_ids.join(", ") || "N/A",
      },
    ]

    const csvContent = objectsToCsv(participantData)

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `participant_${participant.id}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}