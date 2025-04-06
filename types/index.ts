import { Event } from "@prisma/client";

export interface ExtendedEvent extends Event {
    coordinators: { name: string, phone: string }[]
}