import GlimpseOfAakar from "@/components/(User)/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import Image from "next/image";
import RegisterSection from "@/components/(User)/Home/registerSection";

export default function Home() {
  return (
    <>
    <div className="h-[1000vh] font-GameOfSquids">
      <LandingPage />
      <RegisterSection />
      <GlimpseOfAakar/>
    </div>
    </>
  );
}
