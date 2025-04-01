import type { Metadata } from "next";
const fontUrl = "/GameofSquids.ttf";
import "./globals.css";
import Navbar from "@/components/Common/Navbar";
import localfont from "next/font/local";

const gamesquid = localfont({
  src: [
    {
    path: fontUrl,
    weight: "700",
  },
 ],
 variable: "--font--gamesquid",
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