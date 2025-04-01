import LandingPage from "@/components/(User)/landingPage";
import Image from "next/image";
import RegisterSection from "@/components/(User)/Home/registerSection";

export default function Home() {
  return (
    <div className="h-[1000vh] font-GameOfSquids">
      <LandingPage />
      <RegisterSection />
    </div>
  );
}
