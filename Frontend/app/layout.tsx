import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en">
      <body className={`${GameOfSquids.className} antialiased`}>
        {children}
      </body>
    </html >
  );
}