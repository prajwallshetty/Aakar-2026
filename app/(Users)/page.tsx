import GlimpseOfAakar from "@/components/(User)/Home/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import RegisterSection from "@/components/(User)/Home/registerSection";
import Eventcards from "@/components/(User)/Home/Eventcards";
import DJ from "@/components/(User)/Home/DJ";
import Concert from "@/components/(User)/Home/Concert";
import ArenaBanner from "@/components/(User)/Home/ArenaBanner";
// import Sponsors from "@/components/(User)/Home/Sponsors";
import Loading from "@/components/loading";
// import Notice from "@/components/notice";

export default function Home() {
  return (
    <>
      {/* <Notice title="🎮 Limited-Time Offer: Gaming Event Fees Slashed! 🚀" description="Ready to game? Now’s your chance! For a short time only, registration fees for all gaming events have been reduced to boost the thrill! Don’t miss out – register now and join the battle. Offer ends soon!" /> */}
      <Loading />
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