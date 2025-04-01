import GlimpseOfAakar from "@/components/(User)/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <div className="h-[1000vh] font-GameOfSquids">
      <LandingPage/>
      </div>
      <div className="h-[1000vh] font-GameOfSquids">
      <GlimpseOfAakar/>
    </div>
    </>
  );
  // return (
  //   <div className="h-[1000vh] font-GameOfSquids">
  //     
  //   </div>
  // );
}
