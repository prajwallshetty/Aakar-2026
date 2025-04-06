import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyAdmin } from "./backend/admin"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        phone: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.phone || !credentials?.password) throw new Error("No credentials found.")
        let adm = await verifyAdmin(credentials.phone as string, credentials.password as string);
        if (adm)
          return {
            id: `${adm.id}`,
            phone: adm.phone,
            name: adm.name,
            role: "admin"
          }
        else throw new Error("Invalid credentials.")
      },
    }),
  ]
})