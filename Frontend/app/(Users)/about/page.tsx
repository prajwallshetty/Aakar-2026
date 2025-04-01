import Image from "next/image";
import AboutPage from "@/components/(User)/aboutPage";
import Navbar from "@/components/Common/Navbar";

export default function Home() {
  return (
    <div className="h-[1000vh] font-GameOfSquids">
      <AboutPage />
    </div>
  );
}