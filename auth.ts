import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyAdmin } from "./backend/admin"

export const { handlers, signIn, signOut, auth } = NextAuth({
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