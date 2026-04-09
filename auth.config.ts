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
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
} satisfies NextAuthConfig;
