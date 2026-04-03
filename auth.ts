import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"

async function verifyAdmin(email: string, password: string) {
    try {
        const configuredEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const configuredPassword = process.env.ADMIN_PASSWORD;

        if (!configuredEmail || !configuredPassword) return null;
        if (email.toLowerCase() !== configuredEmail) return null;
        if (password !== configuredPassword) return null;

        return {
            id: 1,
            name: "Admin",
            email: configuredEmail,
            phone: "",
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
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