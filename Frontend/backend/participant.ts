import { Prisma } from "@prisma/client";
import db from "./db";

//Todo: verify admin
export async function createParticipant(data: Prisma.ParticipantCreateInput) {
    return await db.participant.create({ data });
}

export async function getParticipant(id: number) {
    return await db.participant.findUnique({ where: { id } });
}

export async function getParticipants() {
    return await db.participant.findMany();
}

export async function updateParticipant(id: number, data: Prisma.ParticipantUpdateInput) {
    return await db.participant.update({ where: { id }, data });
}

export async function deleteParticipant(id: number) {
    return await db.participant.delete({ where: { id } });
}