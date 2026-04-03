import type { Metadata } from "next";
import Navbar from "@/components/(User)/Common/Navbar";
import Footer from "@/components/(User)/Common/Footer";
import { GameOfSquids } from "@/lib/font";

export const metadata: Metadata = {
  title: "AAKAR 2025 | Brains, Guts and Glory",
  description:
    "Experience the spirit of innovation, creativity, and competition at AAKAR 2025 – a premier TechnoCultural fest bringing together students, tech enthusiasts, and innovators for exciting events, workshops, and unforgettable memories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${GameOfSquids.className} antialiased flex flex-col min-h-screen`}>
      {/* Dynamic Global Background */}
      <div className="fixed inset-0 z-[-10]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/bg.jpg)", transform: "scale(1.02)" }}
        />
        {/* Dark gradient mapping overlay for cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[4px]" />

        {/* Cyber/Anime Tech grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] grid-animate pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
      </div>

      <Navbar />

      {/* Page Content */}
      <main className="flex-grow relative font-GameOfSquids">
        {children}
      </main>

      <Footer />

    </div>
  );
}