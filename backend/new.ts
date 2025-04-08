"use server"

import type { Participant, Event } from "@prisma/client"
import { db } from "./db"

type ServiceResponse<T> = {
    data: T | null
    error: { [key: string]: string } | string | null
}

export async function getParticipants(): Promise<ServiceResponse<Participant[]>> {
    try {
        const participants = await db.participant.findMany()
        return { data: participants, error: null }
    } catch (error) {
        console.error("Error fetching participants:", error)
        return { data: null, error: "Failed to fetch participants" }
    }
}

export async function getParticipant(id: number): Promise<ServiceResponse<Participant>> {
    try {
        if (!id) {
            return { data: null, error: { id: "Participant ID is required" } }
        }

        const participant = await db.participant.findUnique({
            where: { id },
        })

        if (!participant) {
            return { data: null, error: "Participant not found" }
        }

        return { data: participant, error: null }
    } catch (error) {
        console.error("Error fetching participant:", error)
        return { data: null, error: "Failed to fetch participant" }
    }
}

export async function getParticipantEvents(participantId: number): Promise<Event[]> {
    try {
        const participant = await db.participant.findUnique({
            where: { id: participantId },
            include: { events: true },
        })

        return participant?.events || []
    } catch (error) {
        console.error("Error fetching participant events:", error)
        return []
    }
}

