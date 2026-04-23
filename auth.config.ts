import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // empty for now, will be extended in auth.ts
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
  pages: {
    signIn: "/AdminLogin",
  },
  callbacks: {
    // These callbacks are safe for the edge
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        session.user.email = token.email as string;
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
