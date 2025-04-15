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

        const eventN = (await getEventsOfUser(participant.id))?.map(e => e.eventName + ` on ` + e.date.toDateString()).join("\n");

        await sendEmail(participant.email, "Registration Successful for Aakar 2025!", `Dear ${participant.name},

Thank you for registering for Aakar 2025. We are pleased to confirm that your registration has been successfully completed.

Here are your registration details:

Name: ${participant.name}

Events: 
${eventN || 'No events found!'}

Further updates and relevant information will be shared with you closer to the event date. If you have any questions or need assistance, feel free to reach out to us at aakar2025@ajiet.edu.in.

If you'd like to register for additional events, feel free to visit:
👉 https://aakar2025.in/addevents/${participant.uuid}

We look forward to your participation!

Warm regards,
Aakar 2025 Team`);

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


        const eventN = (await getEventsOfUser(participant.id))?.map(e => e.eventName + ` on ` + e.date.toDateString()).join("\n");

        await sendEmail(participant.email, "Registration Successful for Aakar 2025!", `Dear ${participant.name},

Thank you for registering for Aakar 2025. We are pleased to confirm that your registration has been successfully completed.

Here are your registration details:

Name: ${participant.name}

Events: 
${eventN}

Further updates and relevant information will be shared with you closer to the event date. If you have any questions or need assistance, feel free to reach out to us at aakar2025@ajiet.edu.in.

If you'd like to register for additional events, feel free to visit:
👉 https://aakar2025.in/addevents/${participant.uuid}

We look forward to your participation!

Warm regards,
Aakar 2025 Team`);
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