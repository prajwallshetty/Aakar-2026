"use server"

import { Participant, Prisma } from "@prisma/client";
import { db } from ".";
import { isAdmin } from "./admin";
import { ExtendedParticipant, ExtendedParticipantCreateInput } from "@/types";
import { sendEmail } from "./nodemailer";

type ServiceResponse<T> = {
    data: T | null;
    error: { [key: string]: string } | string | null;
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

    if (await db.participant.findFirst({ where: { email: data.email.toLowerCase() } })) {
        errors.email = "Email already registered";
    }

    if (await db.participant.findFirst({ where: { usn: data.usn.toUpperCase() } })) {
        errors.usn = "USN already registered";
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

export async function createParticipant(data: ExtendedParticipantCreateInput): Promise<ServiceResponse<Participant>> {
    try {
        const validationErrors = await validateParticipantData(data);
        if (validationErrors) {
            return { data: null, error: validationErrors };
        }

        const participant = await db.participant.create({ data: { ...data, email: data.email.toLowerCase(), usn: data.usn.toUpperCase() } });
        return { data: participant, error: null };
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

export async function registerParticipant(data: ExtendedParticipantCreateInput, events: number[]): Promise<ServiceResponse<Participant>> {
    try {
        const { data: participant, error } = await createParticipant({ ...data, events: { connect: events.map(e => ({ id: e })) }, email: data.email.toLowerCase(), usn: data.usn.toUpperCase() });

        if (error || !participant) {
            return { data: null, error };
        }

        await sendEmail(participant.email, "Registration Successful", "You have successfully registered for the event(s).");

        return { data: participant, error: null };
    } catch (error) {
        console.error("Error registering participant for events:", error);
        return {
            data: null,
            error: "Failed to register participant for events"
        };
    }
}


export async function getParticipant(id: number): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        if (!id) {
            return { data: null, error: { id: "Participant ID is required" } };
        }

        const participant = await db.participant.findUnique({
            where: { id }
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

export async function getParticipants(): Promise<ServiceResponse<Participant[]>> {
    try {
        const isUserAdmin = await isAdmin();

        if (!isUserAdmin) {
            return { data: null, error: "Not authorized" };
        }

        const participants = await db.participant.findMany();

        return { data: participants, error: null };
    } catch (error) {
        console.error("Error fetching participants:", error);
        return { data: null, error: "Failed to fetch participants" };
    }
}

export async function getParticipantsWithFilter(where: Prisma.ParticipantWhereInput): Promise<ServiceResponse<Participant[]>> {
    try {
        const isUserAdmin = await isAdmin();

        if (!isUserAdmin) {
            return { data: null, error: "Not authorized" };
        }

        const participants = await db.participant.findMany({ where });

        return { data: participants, error: null };
    } catch (error) {
        console.error("Error fetching participants:", error);
        return { data: null, error: "Failed to fetch participants" };
    }
}

export async function updateParticipantWithNotify(id: number, data: Prisma.ParticipantUpdateInput): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        let res = await updateParticipant(id, data);
        if (!res.data || res.error) {
            return res;
        }
        await sendEmail(res.data.email, "Update Successful", "Your information has been successfully updated.");
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

export async function updateParticipant(id: number, data: Prisma.ParticipantUpdateInput): Promise<ServiceResponse<ExtendedParticipant>> {
    try {
        if (!id) {
            return { data: null, error: { id: "Participant ID is required" } };
        }

        const updatedParticipant = await db.participant.update({
            where: { id },
            data
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

export async function deleteParticipant(id: number): Promise<ServiceResponse<Participant>> {
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

        return { data: deletedParticipant, error: null };
    } catch (error) {
        console.error("Error deleting participant:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return { data: null, error: "Participant not found" };
        }

        return { data: null, error: "Failed to delete participant" };
    }
}