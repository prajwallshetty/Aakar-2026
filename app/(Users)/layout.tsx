import type { Metadata } from "next";
import Navbar from "@/components/(User)/Common/Navbar";
import Footer from "@/components/(User)/Common/Footer";
import { baseFont } from "@/lib/font";
import { BackgroundBeamsWrapper } from "@/components/(User)/Common/BackgroundBeamsWrapper";

export const metadata: Metadata = {
  title: "AAKAR 2026 | Brains, Guts and Glory",
  description:
    "Experience the spirit of innovation, creativity, and competition at AAKAR 2026 – a premier TechnoCultural fest bringing together students, tech enthusiasts, and innovators for exciting events, workshops, and unforgettable memories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${baseFont.className} antialiased flex flex-col min-h-screen`}>
      {/* Dynamic Global Background */}
      <div className="fixed inset-0 z-[-10]">
        {/* Base dark indigo background */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0118 0%, #0d0526 30%, #10082e 60%, #08001a 100%)" }} />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,1,20,0.7) 0%, rgba(10,3,30,0.5) 50%, rgba(8,0,22,0.9) 100%)" }} />

        {/* Aceternity Background Beams */}
        <BackgroundBeamsWrapper />

        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
      </div>

      <Navbar />

      {/* Page Content */}
      <main className="flex-grow relative font-sans">
        {children}
      </main>

      <Footer />

    </div>
  );
}