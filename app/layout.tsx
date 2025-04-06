import type { Metadata } from "next";
import "./globals.css";
import { GameOfSquids } from "@/lib/font";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "AAKAR 2025",
    description: "AAKAR 2025",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let session = await auth();
    return (
        <html lang="en">
            <body className={`${GameOfSquids.className} antialiased`}>
                <SessionProvider session={session}>{children}</SessionProvider>
            </body>
        </html>
    );
}
