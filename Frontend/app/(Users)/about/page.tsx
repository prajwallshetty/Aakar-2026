import Image from "next/image";
import AboutPage from "@/components/(User)/aboutPage";
import Navbar from "@/components/Common/Navbar";

export default function Home() {
  return (
    <div className="font-GameOfSquids">
      <AboutPage />
    </div>
  );
}