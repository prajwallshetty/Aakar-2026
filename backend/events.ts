"use server"
import { eventType, Prisma } from "@prisma/client";
import { db } from ".";
import { isAdmin } from "./admin";
import { GroupBase, OptionsOrGroups } from "react-select";
import { ExtendedEvent } from "@/types";

// Create a new event
export async function createEvent(event: Prisma.EventCreateInput) {
    try {
        if (!await isAdmin()) throw new Error("Not authorized");
        return await db.event.create({
            data: event
        }) as ExtendedEvent | null;
    } catch (e) {
        console.error("Create Event Error:", e);
        return null;
    }
}

// Get a single event by ID
export async function getEventById(id: number) {
    try {
        return await db.event.findUnique({
            where: { id }
        }) as ExtendedEvent | null;
    } catch (e) {
        console.error("Get Event By ID Error:", e);
        return null;
    }
}

// Get all events
export async function getAllEvents() {
    try {
        return await db.event.findMany({
            orderBy: {
                date: "asc"
            }
        }) as ExtendedEvent[];
    } catch (e) {
        console.error("Get All Events Error:", e);
        return [];
    }
}

// Get events by type
export async function getEventsByType(eventType: eventType) {
    try {
        return await db.event.findMany({
            where: {
                eventType
            },
            orderBy: {
                date: "asc"
            }
        }) as ExtendedEvent[];
    } catch (e) {
        console.error("Get Category Events Error:", e);
        return [];
    }
}

export async function getEventOptions(): Promise<OptionsOrGroups<
    { value: string; label: string },
    GroupBase<{ value: string; label: string }>
>> {
    try {
        const eventTypes = await db.event.findMany({
            select: {
                eventType: true,
            },
            distinct: ["eventType"],
        });

        const mappedOptions = await Promise.all(eventTypes.map(async (e) => {
            let events = await getEventsByType(e.eventType);
            let ne = events?.map((event) => {
                return {
                    value: event.id.toString(),
                    label: event.eventName,
                }
            })
            return {
                label: e.eventType,
                options: []
            }
        }));

        return mappedOptions;
    } catch (e) {
        console.error("Get Formatted Events Error:", e);
        return [];
    }
}

export async function getEventsTotalFee(eventIds: number[]) {
    try {
        return await db.event.findMany({
            where: {
                id: {
                    in: eventIds
                }
            },
            select: {
                fee: true
            }
        }).then((events) => {
            return events.reduce((acc, event) => acc + event.fee, 0);
        });
    } catch (e) {
        console.error("Get Events Total Fee Error:", e);
        return 0;
    }
}

// Update an event by ID
export async function updateEvent(id: number, data: Prisma.EventUpdateInput) {
    try {
        if (!await isAdmin()) throw new Error("Not authorized");
        return await db.event.update({
            where: { id },
            data
        }) as ExtendedEvent | null;
    } catch (e) {
        console.error("Update Event Error:", e);
        return null;
    }
}

// Delete an event by ID
export async function deleteEvent(id: number) {
    try {
        if (!await isAdmin()) throw new Error("Not authorized");
        return await db.event.delete({
            where: { id }
        }) as ExtendedEvent | null;
    } catch (e) {
        console.error("Delete Event Error:", e);
        return null;
    }
}
