"use server"

import { Participant, Prisma } from "@prisma/client";
import { db } from ".";
import bcrypt from "bcryptjs";
import { isAdmin } from "./admin";
import { ExtendedParticipantCreateInput } from "@/types";

type ServiceResponse<T> = {
    data: T | null;
    error: { [key: string]: string } | string | null;
}

function validateParticipantData(data: ExtendedParticipantCreateInput): { [key: string]: string } | null {
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

    return Object.keys(errors).length > 0 ? errors : null;
}

//todo: group events need to be added, normal events also needs to be accepted
export async function createParticipant(data: ExtendedParticipantCreateInput): Promise<ServiceResponse<Participant>> {
    try {
        const validationErrors = validateParticipantData(data);
        if (validationErrors) {
            return { data: null, error: validationErrors };
        }

        const existingParticipant = await db.participant.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phone: data.phone }
                ]
            }
        });

        if (existingParticipant) {
            return {
                data: null,
                error: existingParticipant.email === data.email
                    ? { email: "Email already registered" }
                    : { phone: "Phone number already registered" }
            };
        }

        const participant = await db.participant.create({ data });
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
        const { data: participant, error } = await createParticipant({...data, events: { connect: events.map(e => ({ id: e })) }});

        if (error || !participant) {
            return { data: null, error };
        }

        return { data: participant, error: null };
    } catch (error) {
        console.error("Error registering participant for events:", error);
        return {
            data: null,
            error: "Failed to register participant for events"
        };
    }
}


export async function getParticipant(id: number): Promise<ServiceResponse<Participant>> {
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

        return { data: participant, error: null };
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

export async function updateParticipant(id: number, data: Prisma.ParticipantUpdateInput): Promise<ServiceResponse<Participant>> {
    try {
        if (!id) {
            return { data: null, error: { id: "Participant ID is required" } };
        }

        const isUserAdmin = await isAdmin();

        if (!isUserAdmin) {
            return { data: null, error: "Not authorized" };
        }

        const updatedParticipant = await db.participant.update({
            where: { id },
            data
        });

        return { data: updatedParticipant, error: null };
    } catch (error) {
        console.error("Error updating participant:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return { data: null, error: "Participant not found" };
            }
            if (error.code === 'P2002') {
                return { data: null, error: "Email or phone number already in use" };
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