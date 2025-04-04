import type { Metadata } from "next";
import Navbar from "@/components/Common/Navbar";
import Footer from "@/components/Common/Footer";
import { GameOfSquids } from "@/lib/font";

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