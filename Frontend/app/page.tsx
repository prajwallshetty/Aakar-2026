import GlimpseOfAakar from "@/components/(User)/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import RegisterSection from "@/components/(User)/Home/registerSection";
import AboutPage from "@/components/(User)/aboutPage";

export default function Home() {
  return (
    <>
      <div className="h-[1000vh] font-GameOfSquids">
        <AboutPage />
        <GlimpseOfAakar />
        <LandingPage />
        <RegisterSection />
      </div>
    </>
  );
}