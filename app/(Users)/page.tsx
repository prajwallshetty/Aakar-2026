import GlimpseOfAakar from "@/components/(User)/Home/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import RegisterSection from "@/components/(User)/Home/registerSection";
import Eventcards from "@/components/(User)/Home/Eventcards";
import DJ from "@/components/(User)/Home/DJ";
import Concert from "@/components/(User)/Home/Concert";
import ArenaBanner from "@/components/(User)/Home/ArenaBanner";
import Sponsors from "@/components/(User)/Home/Sponsors";

export default function Home() {
  return (
    <>
      <LandingPage />
      <Eventcards />
      <GlimpseOfAakar />
      <DJ/>
      <Concert/>
      {/* <Sponsors/> */}
      <RegisterSection />
      <ArenaBanner />
    </>
  );
}