import { getEventsOfAllUsers, getEventsOfUser } from "@/backend/events"
import { ExtendedParticipant } from "@/types"
import JSZip from "jszip"

function objectsToCsv(data: any[]): string {
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

function downloadFile(content: Blob, filename: string): void {
  try {
    const url = URL.createObjectURL(content)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading file:", error)
    alert("Failed to download file. Please try again.")
  }
}

export async function downloadParticipantData(
  participants: ExtendedParticipant[],
  groupByCollege = false
): Promise<void> {
  try {
    const events = await getEventsOfAllUsers()
    const processedUSNs = new Set<string>()

    function processMainParticipants(allParticipants: any[], participant: ExtendedParticipant) {
      if (!processedUSNs.has(participant.usn)) {
        processedUSNs.add(participant.usn)
        allParticipants.push({
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
          "Transaction ID": participant.transaction_ids?.join(", ") || "N/A",
          Events: events[participant.id] ? events[participant.id].map((e) => e.eventName).join(", ") : "None",
          "Member Type": "Registered Participant"
        })
      }
    }

    function processGroupMembers(allParticipants: any[], participant: ExtendedParticipant) {
      if (!participant.groupMembersData) return

      Object.values(participant.groupMembersData).forEach(group => {
        if (group?.members?.length > 0) {
          group.members.forEach((member, idx) => {
            if (!processedUSNs.has(member.usn)) {
              processedUSNs.add(member.usn)
              allParticipants.push({
                ID: `${participant.id}-${idx}`,
                Name: member.name,
                USN: member.usn,
                Email: member.email || "N/A",
                Phone: "N/A",
                College: participant.college,
                Department: "N/A",
                Year: "N/A",
                "Registered On": new Date(participant.createdAt).toLocaleString(),
                "Amount Paid": 0,
                "Transaction ID": "N/A",
                Events: events[participant.id] ? events[participant.id].map((e) => e.eventName).join(", ") : "None",
                "Member Type": "Team Member"
              })
            }
          })
        }
      })
    }

    if (groupByCollege) {
      const collegeGroups: Record<string, any[]> = {}

      participants.forEach((participant) => {
        if (!collegeGroups[participant.college]) {
          collegeGroups[participant.college] = []
        }
        processMainParticipants(collegeGroups[participant.college], participant)
      })

      participants.forEach((participant) => {
        if (collegeGroups[participant.college]) {
          processGroupMembers(collegeGroups[participant.college], participant)
        }
      })

      const zip = new JSZip()
      for (const [college, collegeParticipants] of Object.entries(collegeGroups)) {
        const csvContent = objectsToCsv(collegeParticipants)
        const filename = `${college.replace(/[^a-zA-Z0-9]/g, "_")}.csv`
        zip.file(filename, csvContent)
      }

      const content = await zip.generateAsync({ type: "blob" })
      downloadFile(content, "participants_by_college.zip")
    } else {
      const allParticipantsData: any[] = []

      participants.forEach(participant => {
        processMainParticipants(allParticipantsData, participant)
      })

      participants.forEach(participant => {
        processGroupMembers(allParticipantsData, participant)
      })

      const csvContent = objectsToCsv(allParticipantsData)
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      downloadFile(blob, "all_participants.csv")
    }
  } catch (error) {
    console.error("Error downloading participant data:", error)
    alert("Failed to download participant data. Please try again.")
  }
}

export async function downloadParticipantDataByEvents(
  participants: ExtendedParticipant[],
  eventIds?: number[]
): Promise<void> {
  try {
    const events = await getEventsOfAllUsers()

    const eventGroups: Record<string, any[]> = {}
    const processedUSNsByEvent: Record<string, Set<string>> = {}

    const eventNameMap: Record<string, string> = {}
    Object.values(events).forEach(userEvents => {
      userEvents.forEach(event => {
        eventNameMap[event.id.toString()] = event.eventName
      })
    })

    const filteredEventIds = eventIds
      ? eventIds.map(id => id.toString())
      : Object.keys(eventNameMap)

    function processMainParticipant(eventId: string, participant: ExtendedParticipant) {
      if (!filteredEventIds.includes(eventId)) {
        return
      }

      if (!eventGroups[eventId]) {
        eventGroups[eventId] = []
        processedUSNsByEvent[eventId] = new Set<string>()
      }

      const isTeamEvent = participant.groupMembersData && participant.groupMembersData[eventId]
      const teamId = isTeamEvent ? `TEAM-${participant.id}-${eventId}` : "N/A"

      if (!processedUSNsByEvent[eventId].has(participant.usn)) {
        processedUSNsByEvent[eventId].add(participant.usn)
        eventGroups[eventId].push({
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
          "Transaction ID": participant.transaction_ids?.join(", ") || "N/A",
          Event: eventNameMap[eventId] || `Event ${eventId}`,
          "Member Type": isTeamEvent ? "Team Leader" : "Individual Participant",
          "Team ID": teamId
        })
      }
    }

    function processGroupMembers(eventId: string, participant: ExtendedParticipant) {
      if (!filteredEventIds.includes(eventId) ||
        !participant.groupMembersData ||
        !participant.groupMembersData[eventId]) {
        return
      }

      if (!eventGroups[eventId]) {
        eventGroups[eventId] = []
        processedUSNsByEvent[eventId] = new Set<string>()
      }

      const group = participant.groupMembersData[eventId]
      const teamName = `Team of ${participant.name}`
      const teamId = `TEAM-${participant.id}-${eventId}`

      if (group?.members?.length > 0) {
        group.members.forEach((member, idx) => {
          if (!processedUSNsByEvent[eventId].has(member.usn)) {
            processedUSNsByEvent[eventId].add(member.usn)
            eventGroups[eventId].push({
              ID: `${participant.id}-${idx}`,
              Name: member.name,
              USN: member.usn,
              Email: member.email || "N/A",
              Phone: "N/A",
              College: participant.college,
              Department: "N/A",
              Year: "N/A",
              "Registered On": new Date(participant.createdAt).toLocaleString(),
              "Amount Paid": 0,
              "Transaction ID": "N/A",
              Event: eventNameMap[eventId] || `Event ${eventId}`,
              "Member Type": "Team Member",
              "Team Leader": participant.name,
              "Team Name": teamName,
              "Team ID": teamId
            })
          }
        })
      }
    }

    participants.forEach(participant => {
      if (events[participant.id]) {
        events[participant.id].forEach(event => {
          const eventId = event.id.toString()
          processMainParticipant(eventId, participant)
          processGroupMembers(eventId, participant)
        })
      }
    })

    participants.forEach(participant => {
      if (participant.groupMembersData) {
        Object.keys(participant.groupMembersData).forEach(eventId => {
          processGroupMembers(eventId, participant)
        })
      }
    })

    if (Object.keys(eventGroups).length === 0) {
      alert("No participant data found for the selected events.")
      return
    }

    const zip = new JSZip()

    const eventSummary = Object.entries(eventGroups).map(([eventId, participants]) => {
      const uniqueTeams = new Set()
      participants.forEach(p => {
        if (p["Team ID"] !== "N/A") {
          uniqueTeams.add(p["Team ID"])
        }
      })

      return {
        "Event ID": eventId,
        "Event Name": eventNameMap[eventId] || `Event ${eventId}`,
        "Total Participants": participants.length,
        "Individual Participants": participants.filter(p => p["Member Type"] === "Individual Participant").length,
        "Teams": uniqueTeams.size,
        "Team Leaders": participants.filter(p => p["Member Type"] === "Team Leader").length,
        "Team Members": participants.filter(p => p["Member Type"] === "Team Member").length
      }
    })

    if (eventSummary.length > 0) {
      zip.file("_event_summary.csv", objectsToCsv(eventSummary))
    }

    for (const [eventId, eventParticipants] of Object.entries(eventGroups)) {
      if (eventParticipants.length > 0) {
        const eventName = eventNameMap[eventId] || `Event ${eventId}`
        const safeEventName = eventName.replace(/[^a-zA-Z0-9]/g, "_")

        zip.file(`${safeEventName}.csv`, objectsToCsv(eventParticipants))

        const hasTeams = eventParticipants.some(p =>
          p["Member Type"] === "Team Leader" || p["Member Type"] === "Team Member")

        if (hasTeams) {
          const teamMap = new Map<string, any>()

          eventParticipants.forEach(p => {
            if (p["Member Type"] === "Team Leader" && p["Team ID"] !== "N/A") {
              teamMap.set(p["Team ID"], {
                "Team ID": p["Team ID"],
                "Team Name": p["Team Name"] || `Team of ${p.Name}`,
                "Team Leader": p.Name,
                "Leader USN": p.USN,
                "Leader Email": p.Email,
                "Leader Phone": p.Phone,
                "Leader College": p.College,
                "Registration Date": p["Registered On"],
                "Amount Paid": p["Amount Paid"],
                "Transaction ID": p["Transaction ID"],
                "Members": []
              })
            }
          })

          eventParticipants.forEach(p => {
            if (p["Member Type"] === "Team Member" && p["Team ID"] !== "N/A") {
              const team = teamMap.get(p["Team ID"])
              if (team) {
                team.Members.push({
                  "Name": p.Name,
                  "USN": p.USN,
                  "Email": p.Email,
                  "Phone": p.Phone,
                  "College": p.College
                })
              }
            }
          })

          const teamSummaries = Array.from(teamMap.values()).map(team => {
            const membersList = team.Members.map((m: any, i: number) =>
              `Member ${i + 1}: ${m.Name} (${m.USN}${m.College !== team["Leader College"] ? `, ${m.College}` : ''})`
            ).join("; ")

            return {
              "Team ID": team["Team ID"],
              "Team Name": team["Team Name"],
              "Team Leader": team["Team Leader"],
              "Leader USN": team["Leader USN"],
              "Leader Contact": `${team["Leader Email"]} / ${team["Leader Phone"]}`,
              "College": team["Leader College"],
              "Registration Date": team["Registration Date"],
              "Amount Paid": team["Amount Paid"],
              "Transaction ID": team["Transaction ID"],
              "Team Size": team.Members.length + 1,
              "Team Members": membersList
            }
          })

          if (teamSummaries.length > 0) {
            zip.file(`${safeEventName}_Teams.csv`, objectsToCsv(teamSummaries))
          }
        }
      }
    }

    const zipFilename = eventIds && eventIds.length > 0
      ? "selected_events_participants.zip"
      : "all_events_participants.zip"

    const content = await zip.generateAsync({ type: "blob" })
    downloadFile(content, zipFilename)
  } catch (error) {
    console.error("Error downloading event participant data:", error)
    alert("Failed to download event participant data. Please try again.")
  }
}

export async function downloadEventData(
  eventData: { name: string; count: number; category: string, participantCount: number }[]
): Promise<void> {
  try {
    const wsData = eventData.map((event) => ({
      "Event Name": event.name,
      Category: event.category,
      Registrations: event.count,
      "Participant Count": event.participantCount
    }))

    const csvContent = objectsToCsv(wsData)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    downloadFile(blob, "event_data.csv")
  } catch (error) {
    console.error("Error downloading event data:", error)
    alert("Failed to download event data. Please try again.")
  }
}

export async function downloadCollegeData(participants: ExtendedParticipant[]): Promise<void> {
  try {
    const collegeGroups: Record<string, ExtendedParticipant[]> = {}
    const collegeUniqueUSNs: Record<string, Set<string>> = {}

    participants.forEach((participant) => {
      if (!collegeGroups[participant.college]) {
        collegeGroups[participant.college] = []
        collegeUniqueUSNs[participant.college] = new Set<string>()
      }
      collegeGroups[participant.college].push(participant)
      collegeUniqueUSNs[participant.college].add(participant.usn)
    })

    participants.forEach((participant) => {
      if (!participant.groupMembersData) return

      Object.values(participant.groupMembersData).forEach(groupData => {
        if (groupData?.members?.length > 0) {
          groupData.members.forEach(member => {
            if (collegeUniqueUSNs[participant.college] && !collegeUniqueUSNs[participant.college].has(member.usn)) {
              collegeUniqueUSNs[participant.college].add(member.usn)
            }
          })
        }
      })
    })

    const collegeStats = Object.entries(collegeGroups).map(([college, collegeParticipants]) => ({
      "College Name": college,
      "Registered Participants": collegeParticipants.length,
      "Total Participants": collegeUniqueUSNs[college]?.size || 0,
      "Total Amount": collegeParticipants.reduce((sum, p) => sum + (p.amount || 0), 0),
    }))

    collegeStats.sort((a, b) => b["Total Participants"] - a["Total Participants"])

    const csvContent = objectsToCsv(collegeStats)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    downloadFile(blob, "college_statistics.csv")
  } catch (error) {
    console.error("Error downloading college data:", error)
    alert("Failed to download college data. Please try again.")
  }
}

export async function downloadParticipantDetail(participant: ExtendedParticipant): Promise<void> {
  try {
    const events = await getEventsOfUser(participant.id)
    const hasData = (events && events.length > 0) || participant.groupMembersData

    const participantData = [{
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
      "Transaction ID": participant.transaction_ids?.join(", ") || "N/A",
    }]

    if (hasData) {
      const zip = new JSZip()

      zip.file("participant_details.csv", objectsToCsv(participantData))

      if (events && events.length > 0) {
        const eventsData = events.map((event) => ({
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
          Object.entries(participant.groupMembersData).forEach(([eventId, groupData]) => {
            if (groupData?.members?.length > 0) {
              const membersData = groupData.members.map((member, idx) => ({
                "Member ID": participant.id + "-"+idx + 1,
                "Event ID": eventId,
                "Event Name": events?.find(e => e.id.toString() === eventId)?.eventName || `Event ${eventId}`,
                "Member Name": member.name,
                "Member USN": member.usn,
                "Member Email": member.email || "N/A",
                "Team Name": `Team of ${participant.name}`
              }))

              zip.file(`group_members_event_${eventId}.csv`, objectsToCsv(membersData))
            }
          })

          const allMembersData: any[] = []
          Object.entries(participant.groupMembersData).forEach(([eventId, groupData]) => {
            if (groupData?.members?.length > 0) {
              const eventName = events?.find(e => e.id.toString() === eventId)?.eventName || `Event ${eventId}`

              groupData.members.forEach((member, idx) => {
                allMembersData.push({
                  "Member ID": `${participant.id}-${idx + 1}`,
                  "Event": eventName,
                  "Name": member.name,
                  "USN": member.usn,
                  "Email": member.email || "N/A",
                  "Team Name": `Team of ${participant.name}`
                })
              })
            }
          })

          if (allMembersData.length > 0) {
            zip.file("all_group_members.csv", objectsToCsv(allMembersData))
          }
        } catch (error) {
          console.error("Error processing group members data:", error)
          zip.file("error_group_members.txt", "Error processing group members data: " + String(error))
        }
      }

      const content = await zip.generateAsync({ type: "blob" })
      downloadFile(content, `participant_${participant.id}.zip`)
    } else {
      const csvContent = objectsToCsv(participantData)
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      downloadFile(blob, `participant_${participant.id}.csv`)
    }
  } catch (error) {
    console.error("Error downloading participant details:", error)
    alert("Failed to download participant details. Please try again.")
  }
}