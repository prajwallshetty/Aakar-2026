import GlimpseOfAakar from "@/components/(User)/Home/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import RegisterSection from "@/components/(User)/Home/registerSection";

export default function Home() {
  return (
    <div className="">
      <LandingPage />
      <GlimpseOfAakar />
      <RegisterSection />
    </div>
  );
}