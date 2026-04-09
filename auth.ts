import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/backend"
import { authConfig } from "./auth.config"

async function verifyAdmin(email: string, password: string) {
    try {
        const configuredEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const configuredPassword = process.env.ADMIN_PASSWORD;

        // 1. Check Env Credentials
        if (configuredEmail && configuredPassword) {
            if (email.toLowerCase() === configuredEmail && password === configuredPassword) {
                return {
                    id: 1,
                    name: "Admin",
                    email: configuredEmail,
                    phone: "",
                };
            }
        }

        // 2. Check Database Credentials
        const dbAdmin = await db.admin.findUnique({
            where: {
                email: email.toLowerCase()
            }
        });

        if (dbAdmin && dbAdmin.password === password) {
            return {
                id: dbAdmin.id,
                name: dbAdmin.name,
                email: dbAdmin.email,
                phone: dbAdmin.phone,
            };
        }

        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) throw new Error("No credentials found.")
        let adm = await verifyAdmin(credentials.email as string, credentials.password as string);
        if (adm)
          return {
            id: `${adm.id}`,
            email: adm.email,
            name: adm.name,
            role: "admin"
          }
        else throw new Error("Invalid credentials.")
      },
    }),
  ]
})