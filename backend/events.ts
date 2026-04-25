"use server"

import { eventCategory } from "@prisma/client";
import { db } from ".";
import { ExtendedEvent, ExtendedEventCreateInput } from "@/types";

const eventsCache = {
    date: null as Date | null,
    events: [] as ExtendedEvent[],
    categoryEvents: {} as Record<eventCategory, { date: Date, events: ExtendedEvent[] }>,
    eventById: {} as Record<number, { date: Date, event: ExtendedEvent }>
}

function isCacheValid(cacheDate: Date | null) {
    if (!cacheDate) return false;
    const now = new Date();
    now.setMinutes(now.getMinutes() - 5);
    return cacheDate > now;
}

export async function createEvent(event: ExtendedEventCreateInput) {
    try {
        const processedEvent: any = {
            eventName: event.eventName,
            eventCategory: event.eventCategory,
            eventType: event.eventType,
            minMembers: event.minMembers,
            maxMembers: event.maxMembers,
            description: event.description,
            fee: event.fee,
            date: event.date,
            time: event.time,
            venue: event.venue,
            imageUrl: event.imageUrl || "",
            rules: event.rules || [],
            studentCoordinators: Array.isArray(event.studentCoordinators)
                ? event.studentCoordinators
                : typeof event.studentCoordinators === "string"
                    ? JSON.parse(event.studentCoordinators)
                    : [],
            facultyCoordinators: Array.isArray(event.facultyCoordinators)
                ? event.facultyCoordinators
                : typeof event.facultyCoordinators === "string"
                    ? JSON.parse(event.facultyCoordinators)
                    : [],
        };
        
        const newEvent = await db.event.create({
            data: processedEvent
        }) as ExtendedEvent | null;

        eventsCache.date = null;
        eventsCache.events = [];
        eventsCache.categoryEvents = {} as any;
        eventsCache.eventById = {};

        return newEvent;
    } catch (e) {
        console.error("❌ Create Event Error:", e);
        return null;
    }
}

export async function getEventById(id: number) {
    try {
        const event = await db.event.findUnique({
            where: { id }
        }) as ExtendedEvent | null;

        if (event) {
            const normalizedEvent: ExtendedEvent = {
                ...event,
                rules: Array.isArray(event.rules) ? event.rules : [],
                studentCoordinators: Array.isArray(event.studentCoordinators)
                    ? event.studentCoordinators
                    : typeof event.studentCoordinators === "string"
                        ? JSON.parse(event.studentCoordinators)
                        : [],
                facultyCoordinators: Array.isArray(event.facultyCoordinators)
                    ? event.facultyCoordinators
                    : typeof event.facultyCoordinators === "string"
                        ? JSON.parse(event.facultyCoordinators)
                        : [],
            };

            eventsCache.eventById[id] = {
                date: new Date(),
                event: normalizedEvent
            };

            return normalizedEvent;
        }

        return event;
    } catch (e) {
        console.error("Get Event By ID Error:", e);
        return null;
    }
}

export async function getAllEvents() {
    try {
        if (isCacheValid(eventsCache.date)) {
            return eventsCache.events;
        }

        const events = await db.event.findMany({
            orderBy: {
                date: "asc"
            }
        }) as ExtendedEvent[];

        eventsCache.date = new Date();
        eventsCache.events = events;
        return events;
    } catch (e) {
        console.error("Get All Events Error:", e);
        return [];
    }
}

export async function getEventsByCategory(eventCategory: eventCategory) {
    try {
        if (eventsCache.categoryEvents[eventCategory] &&
            isCacheValid(eventsCache.categoryEvents[eventCategory].date)) {
            return eventsCache.categoryEvents[eventCategory].events;
        }

        const events = await db.event.findMany({
            where: {
                eventCategory
            },
            orderBy: {
                date: "asc"
            }
        }) as ExtendedEvent[];

        eventsCache.categoryEvents[eventCategory] = {
            date: new Date(),
            events
        };

        return events;
    } catch (e) {
        console.error("Get Category Events Error:", e);
        return [];
    }
}

export async function getEventsOfUser(userId: number | string) {
    try {
        const isUuid = typeof userId === "string";
        return (await db.participant.findUnique({
            where: isUuid ? { uuid: userId } : { id: userId },
            select: {
                events: true
            }
        }))?.events as ExtendedEvent[] | null;
    } catch (e) {
        console.error("Get Events Of User Error:", e);
        return [];
    }
}

export async function getEventsOfAllUsers() {
    try {
        return await db.participant.findMany({
            select: {
                id: true,
                events: true
            }
        }).then((participants) => {
            let a = {} as Record<number, ExtendedEvent[]>;
            participants.forEach((participant) => {
                a[participant.id] = participant.events as ExtendedEvent[];
            })
            return a;
        })
    } catch (e) {
        console.error("Get Events Of All Users Error:", e);
        return [];
    }
}

export async function getSoloEvents() {
    try {
        const events = await db.event.findMany({
            where: {
                eventType: "Solo"
            },
            orderBy: [
                { eventCategory: "asc" },
                { eventName: "asc" }
            ]
        }) as ExtendedEvent[];
        return { data: events, error: null };
    } catch (e) {
        console.error("Get Solo Events Error:", e);
        return { data: [], error: "Failed to fetch solo events" };
    }
}

export async function getEventOptions() {
    try {
        const events = await getAllEvents();
        const eventCategories = [...new Set(events.map(e => e.eventCategory))];

        const mappedOptions = eventCategories.map((category) => {
            let categoryEvents = events.filter(ev => ev.eventCategory === category);
            let eventOptions = categoryEvents.map((event) => {
                return {
                    value: event.id.toString(),
                    label: event.eventName,
                    type: event.eventType,
                    id: event.id,
                };
            });

            return {
                label: category,
                options: eventOptions
            };
        });

        return mappedOptions;
    } catch (e) {
        console.error("Get Formatted Events Error:", e);
        return [];
    }
}

export async function getEventsTotalFee(eventIds: number[]) {
    try {
        if (isCacheValid(eventsCache.date) && eventsCache.events.length > 0) {
            const cachedEvents = eventsCache.events.filter(event => eventIds.includes(event.id));
            if (cachedEvents.length === eventIds.length) {
                return cachedEvents.reduce((acc, event) => acc + event.fee, 0);
            }
        }

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

export async function getTotalEvents() {
    try {
        return await db.event.count();
    } catch (e) {
        console.error("Get Total Events Error:", e);
        return 0;
    }
}

export async function updateEvent(id: number, data: ExtendedEventCreateInput) {
    try {
        const processedEvent: any = {
            eventName: data.eventName,
            eventCategory: data.eventCategory,
            eventType: data.eventType,
            minMembers: data.minMembers,
            maxMembers: data.maxMembers,
            description: data.description,
            fee: data.fee,
            date: data.date,
            time: data.time,
            venue: data.venue,
            imageUrl: data.imageUrl || "",
            rules: data.rules || [],
            studentCoordinators: Array.isArray(data.studentCoordinators)
                ? data.studentCoordinators
                : typeof data.studentCoordinators === "string"
                    ? JSON.parse(data.studentCoordinators)
                    : [],
            facultyCoordinators: Array.isArray(data.facultyCoordinators)
                ? data.facultyCoordinators
                : typeof data.facultyCoordinators === "string"
                    ? JSON.parse(data.facultyCoordinators)
                    : [],
        };
        
        const updatedEvent = await db.event.update({
            where: { id },
            data: processedEvent
        }) as ExtendedEvent | null;

        eventsCache.date = null;
        eventsCache.events = [];
        eventsCache.categoryEvents = {} as any;
        eventsCache.eventById = {};

        return updatedEvent;
    } catch (e) {
        console.error("Update Event Error:", e);
        return null;
    }
}

export async function deleteEvent(id: number) {
    try {
        const deletedEvent = await db.event.delete({
            where: { id }
        }) as ExtendedEvent | null;

        eventsCache.date = null;
        eventsCache.events = [];
        eventsCache.categoryEvents = {} as any;
        eventsCache.eventById = {};

        return deletedEvent;
    } catch (e) {
        console.error("Delete Event Error:", e);
        return null;
    }
}