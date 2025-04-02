import LandingPage from"../components/(User)/Home/landingPage";
import Image from "next/image";
import { Heading } from "lucide-react";
import { CardGrid } from "@/components/(User)/Card/card-grid";
export default function Home() {
  return (
    <div className="h-[1000vh] font-GameOfSquids">
      <LandingPage/>
    
          <Heading title="Featured Collection" subtitle="Explore our handpicked selection of premium items" />
          <CardGrid />
        </div>
  );
}
