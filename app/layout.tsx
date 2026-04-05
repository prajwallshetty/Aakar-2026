import type { Metadata } from "next";
import "./globals.css";
import { baseFont } from "@/lib/font";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
    title: "AAKAR 2026",
    description:
        "Experience the spirit of innovation, creativity, and competition at AAKAR 2025 – a premier TechnoCultural fest bringing together students, tech enthusiasts, and innovators for exciting events, workshops, and unforgettable memories.",
    keywords: [
        "AAKAR 2026", "TechnoCultural Fest", "Engineering Fest", "Cultural Fest India", "Student Innovation", 
        "AJIET Mangaluru", "College Fest Karnataka", "Technical Events", "Cultural Events India", 
        "Hackathon 2026", "Robotics Competition", "Dance Battle", "Music Fest", "Innovation Challenge", 
        "Gaming Tournament", "Workshop for Students", "Tech Symposium", "Youth Festival India", 
        "AAKAR Registration", "Best College Fest South India", "Web Development Contest", "AI ML Workshop"
    ],
    authors: [{ name: "AAKAR Team", url: "https://aakar2025.in" }],
    creator: "AAKAR Team",
    publisher: "AAKAR Fest Committee",
    robots: "index, follow",
    metadataBase: new URL("https://aakar.live"),
    openGraph: {
        title: "AAKAR 2026 | Brains, Guts and Glory",
        description:
            "Join us for AAKAR 2026, the ultimate blend of technology and culture. Participate in events, win prizes, and make unforgettable memories!",
        url: "https://aakar.live",
        siteName: "AAKAR 2026",
        images: [
            {
                url: "https://aakar.live/aklogo.png",
                width: 1200,
                height: 630,
                alt: "AAKAR 2026 Banner",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AAKAR 2026 | Brains, Guts and Glory",
        description:
            "Tech meets culture at AAKAR 2026! Explore innovation, creativity, and fun at our annual fest.",
        images: ["https://aakar.live/aklogo.png"],
        creator: "@aakar__2025",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-EXY2XKHRKM"></script>
                <script>
                    {
                        `window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-EXY2XKHRKM');`
                        }
                </script>
            </head>
            <body suppressHydrationWarning className={`${baseFont.className} antialiased`}>
                <SessionProvider session={session}>{children}</SessionProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
