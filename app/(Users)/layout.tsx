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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${GameOfSquids.className} antialiased`}>
      <Navbar />
      <div className="relative z-10 font-GameOfSquids min-h-screen">
        {children}
      </div>
      <Footer />
      <div className="fixed inset-0 -z-10 bg-custom" />
    </div>
  );
}