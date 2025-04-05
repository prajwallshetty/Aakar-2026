import { Prisma } from "@prisma/client";
import db from "./db";

//TODO: verify admin

// Create a new event
export async function createEvent(event: Prisma.EventCreateInput) {
    try {
        return await db.event.create({
            data: event
        });
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
        });
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
        });
    } catch (e) {
        console.error("Get All Events Error:", e);
        return [];
    }
}

// Update an event by ID
export async function updateEvent(id: number, data: Prisma.EventUpdateInput) {
    try {
        return await db.event.update({
            where: { id },
            data
        });
    } catch (e) {
        console.error("Update Event Error:", e);
        return null;
    }
}

// Delete an event by ID
export async function deleteEvent(id: number) {
    try {
        return await db.event.delete({
            where: { id }
        });
    } catch (e) {
        console.error("Delete Event Error:", e);
        return null;
    }
}
