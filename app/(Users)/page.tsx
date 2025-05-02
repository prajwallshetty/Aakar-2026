"use client"

import GlimpseOfAakar from "@/components/(User)/Home/glimpseofaakar";
import LandingPage from "@/components/(User)/Home/landingPage";
import RegisterSection from "@/components/(User)/Home/registerSection";
import Eventcards from "@/components/(User)/Home/Eventcards";
import DJ from "@/components/(User)/Home/DJ";
import Concert from "@/components/(User)/Home/Concert";
import ArenaBanner from "@/components/(User)/Home/ArenaBanner";
import Sponsors from "@/components/(User)/Home/Sponsors";
import Loading from "@/components/loading";
import Notice from "@/components/notice";
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(true);
  return (
    <>
      <Loading />
      {showModal && (
        <Notice
          title="Notice"
          description="Due to present circumstances AAKAR 2025 is postponed. The dates will be announced soon. STAY TUNED!!"
          onClose={() => setShowModal(false)}
        />
      )}
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