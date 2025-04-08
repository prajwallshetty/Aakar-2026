"use server"

import type { Participant, Event } from "@prisma/client"

type ExtendedParticipant = Participant & {
  events?: Event[]
}

/**
 * Convert array of objects to CSV string
 */
function objectsToCsv(data: any) {
  if (data.length === 0) return '';

  // Get headers
  const headers = Object.keys(data[0]);

  // Create CSV header row
  const headerRow = headers.join(',');

  // Create data rows
  const rows = data.map((obj: any) => {
    return headers.map(header => {
      let value = obj[header];

      // Handle values that need quoting (contain commas, quotes, or newlines)
      if (value === null || value === undefined) {
        value = '';
      } else if (typeof value === 'string') {
        // Escape quotes by doubling them and wrap in quotes
        value = `"${value.replace(/"/g, '""')}"`;
      } else {
        value = String(value);
      }

      return value;
    }).join(',');
  });

  // Combine header and rows
  return [headerRow, ...rows].join('\n');
}

export async function downloadParticipantData(participants: ExtendedParticipant[], groupByCollege = false) {
  if (groupByCollege) {
    // Group participants by college
    const collegeGroups: Record<string, ExtendedParticipant[]> = {};

    participants.forEach((participant) => {
      if (!collegeGroups[participant.college]) {
        collegeGroups[participant.college] = [];
      }
      collegeGroups[participant.college].push(participant);
    });

    // Create CSV for each college and return a combined ZIP file
    const csvFiles = [];

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
      }));

      const csvContent = objectsToCsv(wsData);
      csvFiles.push({
        name: `${college.replace(/[^a-zA-Z0-9]/g, '_')}.csv`,
        content: csvContent
      });
    }

    // Return an object with multiple CSV files
    return {
      type: 'multi-csv',
      files: csvFiles
    };
  } else {
    // Create a single CSV with all participants
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
    }));

    const csvContent = objectsToCsv(wsData);

    // Convert the CSV string to a buffer
    const textEncoder = new TextEncoder();
    const csvBuffer = textEncoder.encode(csvContent);

    return csvBuffer;
  }
}

export async function downloadEventData(eventData: { name: string; count: number; category: string }[]) {
  // Create data for CSV
  const wsData = eventData.map((event) => ({
    "Event Name": event.name,
    Category: event.category,
    Registrations: event.count,
  }));

  const csvContent = objectsToCsv(wsData);

  // Convert the CSV string to a buffer
  const textEncoder = new TextEncoder();
  const csvBuffer = textEncoder.encode(csvContent);

  return csvBuffer;
}

export async function downloadCollegeData(participants: ExtendedParticipant[]) {
  // Group participants by college
  const collegeGroups: Record<string, ExtendedParticipant[]> = {};

  participants.forEach((participant) => {
    if (!collegeGroups[participant.college]) {
      collegeGroups[participant.college] = [];
    }
    collegeGroups[participant.college].push(participant);
  });

  // Create data for college statistics
  const collegeStats = Object.entries(collegeGroups).map(([college, participants]) => ({
    "College Name": college,
    Participants: participants.length,
    "Total Amount": participants.reduce((sum, p) => sum + p.amount, 0),
  }));

  // Sort by number of participants (descending)
  collegeStats.sort((a, b) => b.Participants - a.Participants);

  const csvContent = objectsToCsv(collegeStats);

  // Convert the CSV string to a buffer
  const textEncoder = new TextEncoder();
  const csvBuffer = textEncoder.encode(csvContent);

  return csvBuffer;
}

export async function downloadParticipantDetail(participant: ExtendedParticipant) {
  // Create data for participant details CSV
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
  ];

  const csvFiles = [];

  // Add participant details CSV
  csvFiles.push({
    name: "participant_details.csv",
    content: objectsToCsv(participantData)
  });

  // Add events CSV if available
  if (participant.events && participant.events.length > 0) {
    const eventsData = participant.events.map((event) => ({
      "Event Name": event.eventName,
      Category: event.eventCategory,
      Type: event.eventType,
      Date: new Date(event.date).toLocaleDateString(),
      Time: event.time,
      Venue: event.venue,
      Fee: event.fee,
    }));

    csvFiles.push({
      name: "registered_events.csv",
      content: objectsToCsv(eventsData)
    });
  }

  // Add group members CSV if available
  if (participant.groupMembersData) {
    try {
      const groupMembers =
        typeof participant.groupMembersData === "string"
          ? JSON.parse(participant.groupMembersData)
          : participant.groupMembersData;

      if (Array.isArray(groupMembers) && groupMembers.length > 0) {
        csvFiles.push({
          name: "group_members.csv",
          content: objectsToCsv(groupMembers)
        });
      }
    } catch (error) {
      console.error("Error parsing group members data:", error);
    }
  }

  // If there's only one file, return its buffer
  if (csvFiles.length === 1) {
    const textEncoder = new TextEncoder();
    const csvBuffer = textEncoder.encode(csvFiles[0].content);
    return csvBuffer;
  }

  // Otherwise return the multi-CSV object
  return {
    type: 'multi-csv',
    files: csvFiles
  };
}