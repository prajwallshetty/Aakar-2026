import GlimpseOfAakar from "@/components/(User)/Home/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import RegisterSection from "@/components/(User)/Home/registerSection";
import Eventcards from "@/components/(User)/Home/Eventcards";
import DJ from "@/components/(User)/Home/DJ";
import Concert from "@/components/(User)/Home/Concert";
import ArenaBanner from "@/components/(User)/Home/ArenaBanner";

export default function Home() {
  return (
    <div className="">
      <LandingPage />
      <Eventcards />
      <GlimpseOfAakar />
      <DJ/>
      <Concert/>
      <RegisterSection />
      <ArenaBanner />
    </div>
  );
}