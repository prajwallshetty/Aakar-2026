import { getEventsOfAllUsers, getEventsOfUser } from "@/backend/events"
import { ExtendedParticipant } from "@/types"
import JSZip from "jszip"

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

export async function downloadParticipantData(participants: ExtendedParticipant[], groupByCollege = false) {
  const events = await getEventsOfAllUsers();

  const processedUSNs = new Set<string>();

  function processMainParticipants(allParticipants: any[], participant: ExtendedParticipant) {
    if (!processedUSNs.has(participant.usn)) {
      processedUSNs.add(participant.usn);
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
        "Transaction ID": participant.transaction_ids.join(", ") || "N/A",
        Events: events[participant.id] ? events[participant.id].map((e) => e.eventName).join(", ") : "None",
        "Member Type": "Registered Participant"
      });
    }
  }

  function processGroupMembers(allParticipants: any[], participant: ExtendedParticipant) {
    if (participant.groupMembersData) {
      Object.values(participant.groupMembersData).forEach(group => {
        if (group && group.members && group.members.length > 0) {
          group.members.forEach((member, idx) => {
            if (!processedUSNs.has(member.usn)) {
              processedUSNs.add(member.usn);
              allParticipants.push({
                ID: participant.id + "-" + idx,
                Name: member.name,
                USN: member.usn,
                Email: member.email,
                Phone: "N/A",
                College: participant.college,
                Department: "N/A",
                Year: 0,
                "Registered On": new Date(participant.createdAt).toLocaleString(),
                "Amount Paid": 0,
                "Transaction ID": "N/A",
                Events: events[participant.id] ? events[participant.id].map((e) => e.eventName).join(", ") : "None",
                "Member Type": "Team Member"
              });
            }
          });
        }
      });
    }
  }

  if (groupByCollege) {
    const collegeGroups: Record<string, any[]> = {};

    participants.forEach((participant) => {
      if (!collegeGroups[participant.college]) {
        collegeGroups[participant.college] = [];
      }

      processMainParticipants(collegeGroups[participant.college], participant);
    });

    participants.forEach((participant) => {
      if (collegeGroups[participant.college]) {
        processGroupMembers(collegeGroups[participant.college], participant);
      }
    });

    const zip = new JSZip();
    for (const [college, collegeParticipants] of Object.entries(collegeGroups)) {
      const csvContent = objectsToCsv(collegeParticipants);
      const filename = `${college.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
      zip.file(filename, csvContent);
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "participants_by_college.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  } else {
    const allParticipantsData: any[] = [];
    participants.forEach(participant => {
      processMainParticipants(allParticipantsData, participant);
    });

    participants.forEach(participant => {
      processGroupMembers(allParticipantsData, participant);
    });

    const csvContent = objectsToCsv(allParticipantsData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all_participants.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export async function downloadParticipantDataByEvents(participants: ExtendedParticipant[]) {
  const events = await getEventsOfAllUsers();

  // Create a mapping of eventId -> array of participants
  const eventGroups: Record<string, any[]> = {};
  const processedUSNsByEvent: Record<string, Set<string>> = {};

  // Helper function to process main participants
  function processMainParticipant(eventId: string, eventName: string, participant: ExtendedParticipant) {
    // Initialize event group and processed USNs set if they don't exist
    if (!eventGroups[eventId]) {
      eventGroups[eventId] = [];
      processedUSNsByEvent[eventId] = new Set<string>();
    }

    // Only add if this USN hasn't been processed for this event
    if (!processedUSNsByEvent[eventId].has(participant.usn)) {
      processedUSNsByEvent[eventId].add(participant.usn);
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
        "Transaction ID": participant.transaction_ids.join(", ") || "N/A",
        Event: eventName,
        "Member Type": "Registered Participant"
      });
    }
  }

  // Helper function to process group members
  function processGroupMembers(eventId: string, eventName: string, participant: ExtendedParticipant) {
    // Initialize event group and processed USNs set if they don't exist
    if (!eventGroups[eventId]) {
      eventGroups[eventId] = [];
      processedUSNsByEvent[eventId] = new Set<string>();
    }

    if (participant.groupMembersData && participant.groupMembersData[eventId]) {
      const group = participant.groupMembersData[eventId];
      if (group && group.members && group.members.length > 0) {
        group.members.forEach((member, idx) => {
          if (!processedUSNsByEvent[eventId].has(member.usn)) {
            processedUSNsByEvent[eventId].add(member.usn);
            eventGroups[eventId].push({
              ID: `${participant.id}-${idx}`,
              Name: member.name,
              USN: member.usn,
              Email: member.email || "N/A",
              Phone: "N/A",
              College: participant.college,
              Department: "N/A",
              Year: 0,
              "Registered On": new Date(participant.createdAt).toLocaleString(),
              "Amount Paid": 0,
              "Transaction ID": "N/A",
              Event: eventName,
              "Member Type": "Team Member"
            });
          }
        });
      }
    }
  }

  // Process all participants and their events
  participants.forEach(participant => {
    if (events[participant.id]) {
      events[participant.id].forEach(event => {
        const eventId = event.id.toString();
        const eventName = event.eventName;

        // Add the main participant
        processMainParticipant(eventId, eventName, participant);

        // Process team members if any
        processGroupMembers(eventId, eventName, participant);
      });
    }
  });

  // Generate ZIP file with a CSV for each event
  const zip = new JSZip();

  // Add event overview file with counts
  const eventSummary = Object.entries(eventGroups).map(([eventId, participants]) => {
    const eventName = events[parseInt(Object.keys(events)[0])]?.find(e => e.id.toString() === eventId)?.eventName || `Event ${eventId}`;
    return {
      "Event ID": eventId,
      "Event Name": eventName,
      "Total Participants": participants.length,
      "Registered Participants": participants.filter(p => p["Member Type"] === "Registered Participant").length,
      "Team Members": participants.filter(p => p["Member Type"] === "Team Member").length
    };
  });

  if (eventSummary.length > 0) {
    zip.file("_event_summary.csv", objectsToCsv(eventSummary));
  }

  // Add individual event files
  for (const [eventId, eventParticipants] of Object.entries(eventGroups)) {
    if (eventParticipants.length > 0) {
      const eventName = events[parseInt(Object.keys(events)[0])]?.find(e => e.id.toString() === eventId)?.eventName || `Event ${eventId}`;
      const safeEventName = eventName.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${safeEventName}_event_${eventId}.csv`;
      zip.file(filename, objectsToCsv(eventParticipants));
    }
  }

  // Generate and download the ZIP file
  zip.generateAsync({ type: "blob" }).then((content) => {
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants_by_events.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}


export async function downloadEventData(eventData: { name: string; count: number; category: string, participantCount: number }[]) {
  const wsData = eventData.map((event) => ({
    "Event Name": event.name,
    Category: event.category,
    Registrations: event.count,
    "Participant Count": event.participantCount
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

export async function downloadCollegeData(participants: ExtendedParticipant[]) {
  const collegeGroups: Record<string, ExtendedParticipant[]> = {};
  const collegeUniqueUSNs: Record<string, Set<string>> = {};

  participants.forEach((participant) => {
    if (!collegeGroups[participant.college]) {
      collegeGroups[participant.college] = [];
      collegeUniqueUSNs[participant.college] = new Set<string>();
    }
    collegeGroups[participant.college].push(participant);
    collegeUniqueUSNs[participant.college].add(participant.usn);
  });

  participants.forEach((participant) => {
    if (participant.groupMembersData) {
      Object.values(participant.groupMembersData).forEach(groupData => {
        if (groupData && groupData.members && Array.isArray(groupData.members)) {
          groupData.members.forEach(member => {
            if (!collegeUniqueUSNs[participant.college].has(member.usn)) {
              collegeUniqueUSNs[participant.college].add(member.usn);
            }
          });
        }
      });
    }
  });

  const collegeStats = Object.entries(collegeGroups).map(([college, collegeParticipants]) => ({
    "College Name": college,
    "Registered Participants": collegeParticipants.length,
    "Total Participants": collegeUniqueUSNs[college].size,
    "Total Amount": collegeParticipants.reduce((sum, p) => sum + p.amount, 0),
  }));

  collegeStats.sort((a, b) => b["Total Participants"] - a["Total Participants"]);

  const csvContent = objectsToCsv(collegeStats);

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "college_statistics.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadParticipantDetail(participant: ExtendedParticipant) {
  let events = await getEventsOfUser(participant.id);
  if ((events && events.length > 0) || participant.groupMembersData) {
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