import LandingPage from "@/components/(User)/Home/landingPage";
import Eventcards from "@/components/(User)/Home/Eventcards";
import MarqueeStrip from "@/components/(User)/Home/MarqueeStrip";
import FeaturedActs from "@/components/(User)/Home/FeaturedActs";
import MysteryReveal from "@/components/(User)/Home/MysteryReveal";
import ElitePassPromo from "@/components/(User)/Home/ElitePassPromo";
import CountdownRegister from "@/components/(User)/Home/CountdownRegister";
import EnterScreen from "@/components/(User)/EnterScreen";

export default function Home() {
  return (
    <>
      <LandingPage />
      <MarqueeStrip />
      <Eventcards />
      <MysteryReveal />
      <ElitePassPromo />
      <CountdownRegister />
    </>
  );
}
