import GlimpseOfAakar from "@/components/(User)/Home/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import RegisterSection from "@/components/(User)/Home/registerSection";
import CardPage from "@/components/(User)/Card/cardPage";
export default function Home() {
  return (
    <div className="">
      <LandingPage />
      <div className="container mx-auto px-4 py-12">
      <CardPage />
    </div>
      <GlimpseOfAakar />
      <RegisterSection />
    </div>
  );
}