import LandingPage from "@/components/(User)/Home/landingPage";
import Image from "next/image";
import RegisterSection from "@/components/(User)/Home/registerSection";
import Footer from "@/components/(User)/footer";

export default function Home() {
  return (
    <div className="h-[1000vh] font-GameOfSquids">
      <LandingPage />
      <RegisterSection />
      <Footer />
    </div>
  );
}
