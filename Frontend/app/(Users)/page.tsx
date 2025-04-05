import GlimpseOfAakar from "@/components/(User)/Home/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import RegisterSection from "@/components/(User)/Home/registerSection";
import Eventcards from "@/components/(User)/Home/Eventcards";

export default function Home() {
  return (
    <div className="">
      <LandingPage />
      <Eventcards />
      <GlimpseOfAakar />
      <RegisterSection />
    </div>
  );
}