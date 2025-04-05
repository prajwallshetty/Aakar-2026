"use server"
import { Prisma } from "@prisma/client";
import { db } from ".";
import bcrypt from "bcryptjs";
import { isAdmin } from "./admin";

export async function createParticipant(data: Prisma.ParticipantCreateInput) {
    let { password } = data;
    data.password = bcrypt.hashSync(password, 10);
    return await db.participant.create({ data });
}

export async function verifyParticipant(phone: string, password: string) {
    const participant = await db.participant.findUnique({ where: { phone } });
    if (!participant) {
        return null;
    }
    let { password: pass, ...rest } = participant;
    const isPasswordValid = bcrypt.compareSync(password, pass);
    if (!isPasswordValid) {
        return null;
    }
    return rest;
}

export async function getParticipant(id: number) {
    return await db.participant.findUnique({ where: { id }, omit: { password: true } });
}

export async function getParticipants() {
    if (!await isAdmin()) throw new Error("Not authorized");
    return await db.participant.findMany({ omit: { password: true } });
}

export async function updateParticipant(id: number, data: Prisma.ParticipantUpdateInput) {
    if (!await isAdmin()) throw new Error("Not authorized");
    return await db.participant.update({ where: { id }, data });
}

export async function deleteParticipant(id: number) {
    if (!await isAdmin()) throw new Error("Not authorized");
    return await db.participant.delete({ where: { id } });
}