import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Common/Navbar";
import localfont from "next/font/local";

const gamesquid = localfont({
  src: [
    {
    path: "../public/fonts/GameofSquids.otf",
    weight: "700",
  },
 ],
 variable: "--font--gamesquid",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AAKAR 2025",
  description: "AAKAR 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gamesquid.className} antialiased`}>
        <Navbar/>
        <div className="relative z-10 font-GameOfSquids">{children}</div>
        <div className="fixed inset-0 -z-10 bg-custom" />
      </body>
    </html>
  );
}