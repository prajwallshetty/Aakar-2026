"use server"

import type { Participant, Event } from "@prisma/client"
import * as XLSX from "xlsx"

type ExtendedParticipant = Participant & {
  events?: Event[]
}

export async function downloadParticipantData(participants: ExtendedParticipant[], groupByCollege = false) {
  // Create workbook
  const wb = XLSX.utils.book_new()

  if (groupByCollege) {
    // Group participants by college
    const collegeGroups: Record<string, ExtendedParticipant[]> = {}

    participants.forEach((participant) => {
      if (!collegeGroups[participant.college]) {
        collegeGroups[participant.college] = []
      }
      collegeGroups[participant.college].push(participant)
    })

    // Create a worksheet for each college
    Object.entries(collegeGroups).forEach(([college, collegeParticipants]) => {
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

      const ws = XLSX.utils.json_to_sheet(wsData)
      XLSX.utils.book_append_sheet(wb, ws, college.substring(0, 31)) // Excel sheet names limited to 31 chars
    })
  } else {
    // Create a single worksheet with all participants
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

    const ws = XLSX.utils.json_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, "All Participants")
  }

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

  return excelBuffer
}

export async function downloadEventData(eventData: { name: string; count: number; category: string }[]) {
  // Create workbook
  const wb = XLSX.utils.book_new()

  // Create worksheet for event data
  const wsData = eventData.map((event) => ({
    "Event Name": event.name,
    Category: event.category,
    Registrations: event.count,
  }))

  const ws = XLSX.utils.json_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, "Event Statistics")

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

  return excelBuffer
}

export async function downloadCollegeData(participants: ExtendedParticipant[]) {
  // Create workbook
  const wb = XLSX.utils.book_new()

  // Group participants by college
  const collegeGroups: Record<string, ExtendedParticipant[]> = {}

  participants.forEach((participant) => {
    if (!collegeGroups[participant.college]) {
      collegeGroups[participant.college] = []
    }
    collegeGroups[participant.college].push(participant)
  })

  // Create worksheet for college statistics
  const collegeStats = Object.entries(collegeGroups).map(([college, participants]) => ({
    "College Name": college,
    Participants: participants.length,
    "Total Amount": participants.reduce((sum, p) => sum + p.amount, 0),
  }))

  // Sort by number of participants (descending)
  collegeStats.sort((a, b) => b.Participants - a.Participants)

  const ws = XLSX.utils.json_to_sheet(collegeStats)
  XLSX.utils.book_append_sheet(wb, ws, "College Statistics")

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

  return excelBuffer
}

export async function downloadParticipantDetail(participant: ExtendedParticipant) {
  // Create workbook
  const wb = XLSX.utils.book_new()

  // Create worksheet for participant details
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

  const participantWs = XLSX.utils.json_to_sheet(participantData)
  XLSX.utils.book_append_sheet(wb, participantWs, "Participant Details")

  // Create worksheet for events
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

    const eventsWs = XLSX.utils.json_to_sheet(eventsData)
    XLSX.utils.book_append_sheet(wb, eventsWs, "Registered Events")
  }

  // Create worksheet for group members if available
  if (participant.groupMembersData) {
    try {
      const groupMembers =
        typeof participant.groupMembersData === "string"
          ? JSON.parse(participant.groupMembersData)
          : participant.groupMembersData

      if (Array.isArray(groupMembers) && groupMembers.length > 0) {
        const groupMembersWs = XLSX.utils.json_to_sheet(groupMembers)
        XLSX.utils.book_append_sheet(wb, groupMembersWs, "Group Members")
      }
    } catch (error) {
      console.error("Error parsing group members data:", error)
    }
  }

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

  return excelBuffer
}