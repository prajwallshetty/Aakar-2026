"use server"

import { Prisma } from "@prisma/client";
import { db } from ".";
import { isAdmin } from "./admin";
import { ExtendedEvent, ExtendedParticipant, ExtendedParticipantCreateInput } from "@/types";
import { sendEmail } from "./nodemailer";
import { getEventById, getEventsOfUser } from "./events";

type ServiceResponse<T> = {
    data: T | null;
    error: { [key: string]: string } | string | null;
    hasNext?: boolean;
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function buildRegistrationEmail(name: string, eventsText: string, uuid: string): string {
    const eventRows = eventsText
        .split("\n")
        .filter(Boolean)
        .map((line, i) => {
            const [eventName, ...dateParts] = line.split(" on ");
            const date = dateParts.join(" on ");
            const accentColor = i % 2 === 0 ? "#c9a84c" : "#8bc34a";
            return `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
              <tr>
                <td style="background:#1a1a2e;border-left:3px solid ${accentColor};border-radius:0 8px 8px 0;padding:14px 18px;">
                  <span style="display:block;font-size:15px;font-weight:500;color:#ffffff;">${eventName}</span>
                  ${date ? `<span style="display:block;font-size:12px;color:#666688;margin-top:3px;letter-spacing:1px;">${date}</span>` : ""}
                </td>
              </tr>
            </table>`;
        })
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Aakar 2026 – Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'DM Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#0f0f1a 0%,#1a0a2e 50%,#0f1a0f 100%);border-radius:16px 16px 0 0;padding:48px 40px 36px;text-align:center;">
          <div style="height:3px;background:linear-gradient(90deg,#c9a84c,#f0d080,#c9a84c,#8bc34a,#c9a84c);margin-bottom:32px;border-radius:2px;"></div>
          <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#f0d080);margin-bottom:20px;line-height:64px;font-size:28px;font-weight:900;color:#0a0a0f;font-family:Georgia,serif;">A</div>
          <h1 style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:900;letter-spacing:6px;color:#f0d080;text-transform:uppercase;">AAKAR</h1>
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;font-weight:400;letter-spacing:8px;color:#8bc34a;text-transform:uppercase;">2 0 2 6</p>
          <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:24px auto 0;"></div>
        </td>
      </tr>

      <!-- Hero -->
      <tr>
        <td style="background:#111122;padding:36px 40px;text-align:center;border-left:1px solid #1e1e3a;border-right:1px solid #1e1e3a;">
          <p style="margin:0 0 10px;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#8bc34a;font-weight:500;">✦ Registration Confirmed ✦</p>
          <h2 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">Welcome to the Celebration,<br><span style="color:#f0d080;">${name}</span></h2>
          <p style="margin:0;font-size:15px;color:#8888aa;line-height:1.7;font-weight:300;">Your spot at Aakar 2026 is secured. Get ready for an extraordinary cultural experience at AJIET.</p>
        </td>
      </tr>

      <!-- Divider -->
      <tr><td style="background:#111122;padding:0 40px;border-left:1px solid #1e1e3a;border-right:1px solid #1e1e3a;"><div style="height:1px;background:linear-gradient(90deg,transparent,#2a2a4a,transparent);"></div></td></tr>

      <!-- Events -->
      <tr>
        <td style="background:#111122;padding:32px 40px;border-left:1px solid #1e1e3a;border-right:1px solid #1e1e3a;">
          <p style="margin:0 0 20px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c9a84c;font-weight:500;">Your Registered Events</p>
          ${eventRows || `<p style="color:#666688;font-size:14px;margin:0;">No events found.</p>`}
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="background:#0f0f1f;padding:28px 40px 32px;text-align:center;border-left:1px solid #1e1e3a;border-right:1px solid #1e1e3a;">
          <p style="margin:0 0 18px;font-size:14px;color:#8888aa;line-height:1.6;">Want to participate in more events?</p>
          <a href="https://aakar.live/addevents/${uuid}"
             style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#0a0a0f;text-decoration:none;font-family:Georgia,serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:14px 36px;border-radius:4px;">
            Add More Events →
          </a>
        </td>
      </tr>

      <!-- Divider -->
      <tr><td style="background:#0f0f1f;padding:0 40px;border-left:1px solid #1e1e3a;border-right:1px solid #1e1e3a;"><div style="height:1px;background:linear-gradient(90deg,transparent,#2a2a4a,transparent);"></div></td></tr>

      <!-- Contact -->
      <tr>
        <td style="background:#0f0f1f;padding:24px 40px;text-align:center;border-left:1px solid #1e1e3a;border-right:1px solid #1e1e3a;">
          <p style="margin:0;font-size:13px;color:#555577;line-height:1.7;">
            Questions? Reach us at <a href="mailto:aakar2026@ajiet.edu.in" style="color:#c9a84c;text-decoration:none;">aakar2026@ajiet.edu.in</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:linear-gradient(135deg,#0f0f1a,#1a0a2e 50%,#0f1a0f);border-radius:0 0 16px 16px;padding:28px 40px 32px;text-align:center;">
          <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:14px;font-weight:700;letter-spacing:4px;color:#f0d080;">AAKAR 2026</p>
          <p style="margin:0 0 16px;font-size:11px;color:#444466;letter-spacing:2px;text-transform:uppercase;">A.J. Institute of Engineering &amp; Technology</p>
          <div style="height:2px;background:linear-gradient(90deg,#c9a84c,#f0d080,#c9a84c,#8bc34a,#c9a84c);border-radius:2px;"></div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Participant Logic (unchanged) ───────────────────────────────────────────

export async function validateParticipantData(data: ExtendedParticipantCreateInput): Promise<{ [key: string]: string } | null> {
    const errors: { [key: string]: string } = {};

    if (!data.name || data.name.length < 2) {
        errors.name = "Name should be minimum 2 letters";
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Valid email is required";
    }

    if (!data.phone || !/^\d{10}$/.test(data.phone)) {
        errors.phone = "Valid 10-digit phone number is required";
    }

    if (!data.college || data.college.length < 3) {
        errors.college = "College name is required";
    }

    if (!data.year || data.year > 10 || data.year <= 0) {
        errors.year = "Invalid year. Year should be between 1 and 10";
    }

    if (await db.participant.findFirst({ where: { email: data.email.toLowerCase() } })) {
        errors.email = "Email already registered";
    }

    if (await db.participant.findFirst({ where: { usn: data.usn.toUpperCase() } })) {
        errors.usn = "USN already registered";
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

export async function createParticipant(data: ExtendedParticipantCreateInput): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        const validationErrors = await validateParticipantData(data);
        if (validationErrors) {
            return { data: null, error: validationErrors };
        }

        const participant = await db.participant.create({ data: { ...data, email: data.email.toLowerCase(), usn: data.usn.toUpperCase() } });
        return { data: participant as ExtendedParticipant, error: null };
    } catch (error) {
        console.error("Error creating participant:", error);
        return {
            data: null,
            error: error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
                ? "A participant with this email or phone already exists"
                : "Failed to create participant"
        };
    }
}

export async function registerParticipant(data: ExtendedParticipantCreateInput, events: number[]): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        const { data: participant, error } = await createParticipant({ ...data, events: { connect: events.map(e => ({ id: e })) }, email: data.email.toLowerCase(), usn: data.usn.toUpperCase() });

        if (error || !participant) {
            return { data: null, error };
        }

        const eventsOfUser = await getEventsOfUser(participant.id);
        const eventN = eventsOfUser?.map(e => e.eventName + ` on ` + e.date.toDateString()).join("\n") || "";

        await sendEmail(
            participant.email,
            "Registration Confirmed – Aakar 2026! 🎉",
            buildRegistrationEmail(participant.name, eventN, participant.uuid)
        );

        return { data: participant, error: null };
    } catch (error) {
        console.error("Error registering participant for events:", error);
        return {
            data: null,
            error: "Failed to register participant for events"
        };
    }
}

export async function getParticipantsCount() {
    const usns = new Set();
    const participants = await db.participant.findMany({ select: { usn: true, groupMembersData: true } }) as ExtendedParticipant[];
    participants.forEach(p => {
        usns.add(p.usn);
        if (p.groupMembersData) {
            Object.keys(p.groupMembersData).forEach(groupEvent => {
                p.groupMembersData![groupEvent].members.forEach(member => {
                    usns.add(member.usn);
                })
            });
        }
    })

    return usns.size;
}

export async function getParticipantsCountForEvent(eventId: number) {
    const event = await getEventById(eventId);
    if (!event) {
        return 0;
    }
    const participants = await db.participant.findMany({ where: { events: { some: { id: eventId } } }, select: { usn: true, groupMembersData: true } }) as ExtendedParticipant[];
    const usns = new Set();
    participants.forEach(p => {
        usns.add(p.usn);
        if (p.groupMembersData) {
            Object.keys(p.groupMembersData).forEach(groupEvent => {
                p.groupMembersData![groupEvent].members.forEach(member => {
                    usns.add(member.usn);
                })
            });
        }
    })

    return usns.size;
}

export async function getParticipantsCountForCollege(collegeName: string) {
    const participants = await db.participant.findMany({ where: { college: collegeName }, select: { usn: true, groupMembersData: true } }) as ExtendedParticipant[];
    const usns = new Set();
    participants.forEach(p => {
        usns.add(p.usn);
        if (p.groupMembersData) {
            Object.keys(p.groupMembersData).forEach(groupEvent => {
                p.groupMembersData![groupEvent].members.forEach(member => {
                    usns.add(member.usn);
                })
            });
        }
    })

    return usns.size;
}

export async function getParticipant(id: number | string): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        if (!id) {
            return { data: null, error: { id: "Participant ID is required" } };
        }

        const participant = await db.participant.findUnique({
            where: typeof id === "string" ? { uuid: id } : { id }
        });

        if (!participant) {
            return { data: null, error: "Participant not found" };
        }

        return { data: participant as ExtendedParticipant, error: null };
    } catch (error) {
        console.error("Error fetching participant:", error);
        return { data: null, error: "Failed to fetch participant" };
    }
}

export async function getParticipantWithEvents(id: number): Promise<ServiceResponse<ExtendedParticipant & { events: ExtendedEvent[] }>> {
    try {
        if (!id) {
            return { data: null, error: { id: "Participant ID is required" } };
        }

        const participant = await db.participant.findUnique({
            where: { id },
            include: { events: true }
        });

        if (!participant) {
            return { data: null, error: "Participant not found" };
        }

        return { data: participant as ExtendedParticipant & { events: ExtendedEvent[] }, error: null };
    } catch (error) {
        console.error("Error fetching participant:", error);
        return { data: null, error: "Failed to fetch participant" };
    }
}

export async function getParticipantsWithEvents(index?: number, limit?: number): Promise<ServiceResponse<(ExtendedParticipant & { events: ExtendedEvent[] })[]>> {
    try {
        const isUserAdmin = await isAdmin();

        if (!isUserAdmin) {
            return { data: null, error: "Not authorized" };
        }

        const count = await db.participant.count();

        if (index !== undefined && limit !== undefined) {
            const participants = await db.participant.findMany({
                include: { events: true },
                skip: index * limit,
                take: limit
            });
            return { data: participants as (ExtendedParticipant & { events: ExtendedEvent[] })[], error: null, hasNext: count > (index + 1) * limit };
        } else {
            const participants = await db.participant.findMany({
                include: { events: true },
            });

            return { data: participants as (ExtendedParticipant & { events: ExtendedEvent[] })[], error: null, hasNext: false };
        }
    } catch (error) {
        console.error("Error fetching participants:", error);
        return { data: null, error: "Failed to fetch participant" };
    }
}

export async function getParticipants(): Promise<ServiceResponse<ExtendedParticipant[]>> {
    try {
        const isUserAdmin = await isAdmin();

        if (!isUserAdmin) {
            return { data: null, error: "Not authorized" };
        }

        const participants = await db.participant.findMany();

        return { data: participants as ExtendedParticipant[], error: null };
    } catch (error) {
        console.error("Error fetching participants:", error);
        return { data: null, error: "Failed to fetch participants" };
    }
}

export async function getParticipantsWithFilter(where: Prisma.ParticipantWhereInput): Promise<ServiceResponse<ExtendedParticipant[]>> {
    try {
        const isUserAdmin = await isAdmin();

        if (!isUserAdmin) {
            return { data: null, error: "Not authorized" };
        }

        const participants = await db.participant.findMany({ where });

        return { data: participants as ExtendedParticipant[], error: null };
    } catch (error) {
        console.error("Error fetching participants:", error);
        return { data: null, error: "Failed to fetch participants" };
    }
}

export async function updateParticipantWithNotify(id: number | string, data: Prisma.ParticipantUpdateInput): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        let res = await updateParticipant(id, data);
        if (!res.data || res.error) {
            return res;
        }

        const participant = res.data;
        const eventsOfUser = await getEventsOfUser(participant.id);
        const eventN = eventsOfUser?.map(e => e.eventName + ` on ` + e.date.toDateString()).join("\n") || "";

        await sendEmail(
            participant.email,
            "Your Registration Has Been Updated – Aakar 2026",
            buildRegistrationEmail(participant.name, eventN, participant.uuid)
        );

        return res;
    } catch (error) {
        console.error("Error updating participant:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return { data: null, error: "Participant not found" };
            }
        }

        return { data: null, error: "Failed to update participant" };
    }
}

export async function updateParticipant(id: number | string, data: Prisma.ParticipantUpdateInput): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        if (!id) {
            return { data: null, error: { id: "Participant ID is required" } };
        }

        const updatedParticipant = await db.participant.update({
            where: typeof id === "string" ? { uuid: id } : { id },
            data: { ...data, email: (data.email as string)?.toLowerCase() || undefined, usn: (data.usn as string)?.toUpperCase() || undefined }
        }) as ExtendedParticipant;

        return { data: updatedParticipant, error: null };
    } catch (error) {
        console.error("Error updating participant:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return { data: null, error: "Participant not found" };
            }
        }

        return { data: null, error: "Failed to update participant" };
    }
}

export async function deleteParticipant(id: number): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        if (!id) {
            return { data: null, error: { id: "Participant ID is required" } };
        }

        const isUserAdmin = await isAdmin();

        if (!isUserAdmin) {
            return { data: null, error: "Not authorized" };
        }

        const deletedParticipant = await db.participant.delete({
            where: { id }
        });

        return { data: deletedParticipant as ExtendedParticipant, error: null };
    } catch (error) {
        console.error("Error deleting participant:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return { data: null, error: "Participant not found" };
        }

        return { data: null, error: "Failed to delete participant" };
    }
}