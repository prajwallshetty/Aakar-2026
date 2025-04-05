import { Prisma } from "@prisma/client";
import db from "./db";
import bcrypt from "bcryptjs";
import { auth } from "../auth";

//Todo: need to improve error handling for the frontend with proper format. Maybe {data,error}?

export async function isAdmin() {
    let session = await auth();
    if(!session || !session.user || !session.user.id) return false;
    let user = await db.admin.findUnique({
        where: {
            id: parseInt(session.user.id)
        }
    })
    return !!user;
}

export async function getAdmins() {
    if(!await isAdmin()) return null;
    return await db.admin.findMany({ omit: { password: true } })
}

export async function getAdmin(id: number) {
    if(!await isAdmin()) return null;
    return await db.admin.findUnique({
        where: {
            id: id
        },
        omit: {
            password: true
        }
    })
}

export async function createAdmin(admin: Prisma.AdminCreateInput) {
    if(!await isAdmin()) return null;
    return await db.admin.create({
        data: admin
    })
}

export async function deleteAdmin(id: number) {
    if(!await isAdmin()) return null;
    return await db.admin.delete({
        where: {
            id: id
        }
    })
}

export async function updateAdmin(id: number, admin: Prisma.AdminUpdateInput) {
    if(!await isAdmin()) return null;
    return await db.admin.update({
        where: {
            id: id
        },
        data: admin
    })
}

export async function verifyAdmin(phone: string, password: string) {
    const ad = await db.admin.findUnique({
        where: {
            phone: phone,
            password: password
        },
    })
    if (!ad) return null;
    let { password: pass, ...rest } = ad;
    if (bcrypt.compareSync(password, pass)) return rest;
    else return null;
}