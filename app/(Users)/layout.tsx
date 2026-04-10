import type { Metadata } from "next";
import Navbar from "@/components/(User)/Common/Navbar";
import Footer from "@/components/(User)/Common/Footer";
import { baseFont } from "@/lib/font";
import { BackgroundBeamsWrapper } from "@/components/(User)/Common/BackgroundBeamsWrapper";

export const metadata: Metadata = {
  title: "AAKAR 2026 | Vibe. Compete. Conquer.",
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
      {/* Dynamic Global Background — 2 layers only */}
      <div className="fixed inset-0 z-[-10]">
        {/* Combined dark indigo gradient (was 3 separate layers) */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0118 0%, #0d0526 30%, #10082e 60%, #08001a 100%)" }} />

        {/* Aceternity Background Beams */}
        <BackgroundBeamsWrapper />
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