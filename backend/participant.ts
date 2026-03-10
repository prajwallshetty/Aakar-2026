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
            const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff0066"];
            const bg = colors[i % colors.length];
            const textColor = "#000000";
            return `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr>
                <td style="background:${bg};border:3px solid #000000;padding:12px 18px;box-shadow:4px 4px 0 #000;">
                  <span style="display:block;font-family:'Arial Black',Impact,sans-serif;font-size:14px;font-weight:900;color:${textColor};text-transform:uppercase;letter-spacing:1px;">${eventName}</span>
                  ${date ? `<span style="display:block;font-family:'Courier New',monospace;font-size:11px;color:#000;margin-top:4px;font-weight:700;letter-spacing:2px;">📅 ${date.toUpperCase()}</span>` : ""}
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
  <title>Aakar 2026 – You're IN!</title>
</head>
<body style="margin:0;padding:0;background:#ffff00;font-family:'Arial Black',Impact,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffff00;background-image:radial-gradient(circle,#00000018 1px,transparent 1px);background-size:12px 12px;padding:36px 20px;">
  <tr><td align="center">

    <!-- TICKET WRAPPER -->
    <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;border:4px solid #000;box-shadow:8px 8px 0 #000;">

      <!-- TOP STUB HEADER -->
      <tr>
        <td style="background:#ff00ff;border-bottom:4px dashed #000;padding:28px 36px 24px;text-align:center;">
          <div style="font-family:'Courier New',monospace;font-size:10px;font-weight:700;color:#000;letter-spacing:4px;margin-bottom:10px;">✦ ADMIT ONE ✦ ADMIT ONE ✦ ADMIT ONE ✦</div>
          <h1 style="margin:0 0 4px;font-family:'Arial Black',Impact,sans-serif;font-size:52px;font-weight:900;color:#000;letter-spacing:4px;text-transform:uppercase;line-height:1;text-shadow:4px 4px 0 #ffff00;">AAKAR</h1>
          <div style="display:inline-block;background:#000;color:#ffff00;font-family:'Courier New',monospace;font-size:16px;font-weight:700;letter-spacing:8px;padding:4px 16px;margin:6px 0;">2 0 2 6</div>
          <div style="margin-top:10px;font-family:'Courier New',monospace;font-size:10px;font-weight:700;color:#000;letter-spacing:3px;">A.J. INSTITUTE OF ENGINEERING &amp; TECHNOLOGY</div>
        </td>
      </tr>

      <!-- TICKET BODY -->
      <tr>
        <td style="background:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <!-- LEFT: Main content -->
              <td style="padding:28px 28px 28px 32px;border-right:4px dashed #000;width:70%;vertical-align:top;">

                <!-- Status badge -->
                <div style="display:inline-block;background:#00ffff;border:3px solid #000;padding:5px 14px;margin-bottom:20px;box-shadow:3px 3px 0 #000;">
                  <span style="font-family:'Arial Black',sans-serif;font-size:10px;font-weight:900;color:#000;letter-spacing:3px;text-transform:uppercase;">✔ REGISTRATION CONFIRMED</span>
                </div>

                <!-- Name -->
                <div style="margin-bottom:22px;">
                  <div style="font-family:'Courier New',monospace;font-size:9px;font-weight:700;color:#888;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">PASSENGER NAME</div>
                  <div style="font-family:'Arial Black',Impact,sans-serif;font-size:24px;font-weight:900;color:#000;text-transform:uppercase;letter-spacing:2px;background:#ffff00;display:inline-block;padding:2px 8px;border:2px solid #000;">${name}</div>
                </div>

                <!-- Events section -->
                <div style="margin-bottom:20px;">
                  <div style="font-family:'Courier New',monospace;font-size:9px;font-weight:700;color:#888;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">EVENTS</div>
                  ${eventRows || `<div style="font-family:'Courier New',monospace;font-size:13px;color:#555;font-weight:700;">NO EVENTS REGISTERED</div>`}
                </div>

                <!-- CTA button -->
                <div style="margin-top:22px;">
                  <a href="https://aakar.live/addevents/${uuid}"
                     style="display:inline-block;background:#ff0066;border:3px solid #000;box-shadow:4px 4px 0 #000;color:#ffffff;text-decoration:none;font-family:'Arial Black',sans-serif;font-size:12px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;">
                    + ADD MORE EVENTS →
                  </a>
                </div>
              </td>

              <!-- RIGHT: Stub -->
              <td style="background:#ff0066;padding:24px 18px;text-align:center;vertical-align:top;width:30%;">
                <!-- Rotated AAKAR text -->
                <div style="writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);font-family:'Arial Black',Impact,sans-serif;font-size:28px;font-weight:900;color:#ffff00;letter-spacing:6px;text-shadow:2px 2px 0 #000;margin:0 auto 20px;display:block;">AAKAR</div>

                <!-- Barcode mock -->
                <div style="margin:16px auto;width:60px;">
                  <div style="height:60px;background:repeating-linear-gradient(90deg,#000 0px,#000 2px,#fff 2px,#fff 4px,#000 4px,#000 5px,#fff 5px,#fff 8px,#000 8px,#000 9px,#fff 9px,#fff 12px);border:2px solid #000;"></div>
                  <div style="font-family:'Courier New',monospace;font-size:7px;font-weight:700;color:#000;letter-spacing:1px;margin-top:4px;text-align:center;">2026-AJIET</div>
                </div>

                <!-- Valid pass circle -->
                <div style="width:64px;height:64px;background:#00ffff;border:3px solid #000;border-radius:50%;margin:16px auto 0;box-shadow:3px 3px 0 #000;">
                  <div style="font-family:'Arial Black',sans-serif;font-size:8px;font-weight:900;color:#000;text-align:center;line-height:1.2;padding-top:18px;letter-spacing:0.5px;">VALID<br>PASS</div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- TEAR LINE -->
      <tr>
        <td style="background:#ffffff;border-top:4px dashed #000;border-bottom:4px dashed #000;padding:10px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-family:'Courier New',monospace;font-size:9px;font-weight:700;color:#bbb;letter-spacing:2px;">✂ ─────────────────────────────────────────────── ✂</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- FOOTER STUB -->
      <tr>
        <td style="background:#00ffff;padding:18px 32px;border-top:4px solid #000;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;">
                <div style="font-family:'Arial Black',sans-serif;font-size:11px;font-weight:900;color:#000;letter-spacing:1px;">AAKAR 2026 · CULTURAL FEST</div>
                <div style="font-family:'Courier New',monospace;font-size:10px;color:#333;margin-top:3px;">Questions? <a href="mailto:aakar2026@ajiet.edu.in" style="color:#ff0066;text-decoration:none;font-weight:700;">aakar2026@ajiet.edu.in</a></div>
              </td>
              <td style="text-align:right;vertical-align:middle;">
                <div style="display:inline-block;background:#ff00ff;border:3px solid #000;box-shadow:3px 3px 0 #000;padding:6px 12px;">
                  <span style="font-family:'Arial Black',sans-serif;font-size:9px;font-weight:900;color:#000;letter-spacing:2px;">NON-TRANSFERABLE</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>

  </td></tr>
</table>
</body>
</html>`;
}

// ─── Participant Logic ────────────────────────────────────────────────────────

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