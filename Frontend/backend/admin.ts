import { Prisma } from "@prisma/client";
import db from "./db";

//Todo: need auth to complete this function
//Todo: need to improve error handling for the frontend with proper format. Maybe {data,error}?

export async function isAdmin() {

}

export async function getAdmins() {
    return await db.admin.findMany()
}

export async function getAdmin(id: number) {
    return await db.admin.findUnique({
        where: {
            id: id
        }
    })
}

export async function createAdmin(admin: Prisma.AdminCreateInput) {
    return await db.admin.create({
        data: admin
    })
}

export async function deleteAdmin(id: number) {
    return await db.admin.delete({
        where: {
            id: id
        }
    })
}

export async function updateAdmin(id: number, admin: Prisma.AdminUpdateInput) {
    return await db.admin.update({
        where: {
            id: id
        },
        data: admin
    })
}