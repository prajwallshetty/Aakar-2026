"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/(User)/Home/landingPage";
import Eventcards from "@/components/(User)/Home/Eventcards";
import MarqueeStrip from "@/components/(User)/Home/MarqueeStrip";
import MysteryReveal from "@/components/(User)/Home/MysteryReveal";
import ElitePassPromo from "@/components/(User)/Home/ElitePassPromo";
import CountdownRegister from "@/components/(User)/Home/CountdownRegister";
import EnterScreen from "@/components/(User)/EnterScreen";

export default function Home() {
  const [showEnterScreen, setShowEnterScreen] = useState(true);

  useEffect(() => {
    const hasEntered = sessionStorage.getItem("hasEnteredSite");
    if (hasEntered) {
      setShowEnterScreen(false);
    }
  }, []);

  if (showEnterScreen) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-hidden bg-black">
        <EnterScreen 
          onEnter={() => {
            sessionStorage.setItem("hasEnteredSite", "true");
            setShowEnterScreen(false);
          }} 
        />
      </div>
    );
  }

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