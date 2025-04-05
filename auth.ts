import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyParticipant } from "./backend/participant"
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
        let par = await verifyParticipant(credentials.phone as string, credentials.password as string);
        if (par)
          return {
            id: `${par.id}`,
            phone: par.phone,
            name: par.name,
            role: "user"
          }
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