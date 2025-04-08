"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen text-white">
      <div className="py-8">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center py-6">
            About our Institution
          </h2>

          <div className="rounded-xl overflow-hidden p-4 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <div className="relative group w-full cursor-pointer" onClick={openModal}>
                  <Image
                    src="/college.jpg"
                    width={600}
                    height={400}
                    alt="Watch AJ Institute Video"
                    className="w-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center rounded-lg transition duration-300 group-hover:bg-opacity-60">
                    <FaPlay className="text-white text-4xl" />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-2 md:px-4">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
                  AJ INSTITUTE OF ENGINEERING AND TECHNOLOGY
                </h3>
                <div className={`space-y-4 text-base md:text-lg ${montserrat.className}`}>
                  <p>Established in 2005, Kottara, Mangaluru</p>
                  <p>Affiliated to Visvesvaraya Technological University, Belagavi</p>
                  <p>Recognized by AICTE, New Delhi</p>
                </div>
              </div>
            </div>

            <div className={`mt-10 ${montserrat.className}`}>
              <p className="text-base md:text-lg mb-6">
                A J Institute of Engineering & Technology is promoted by Laxmi Memorial Education Trust which was registered in the year 1991 in memory of Late Laxmi Shetty, mother of Dr. A. J. Shetty.
              </p>
              <p className="text-base md:text-lg mb-6">
                The main objective is to impart high quality theoretical knowledge supported by practical experience to shape students into highly competent professionals and exemplary human beings.
              </p>
              <p className="text-base md:text-lg">
                Students are at the heart of our institution and every staff member aligns their activities to meet their needs.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden p-4 md:p-10 mt-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              About AAKAR
            </h2>

            <div className="flex flex-col items-center gap-4 mb-6">
              <p className={`text-base md:text-lg font-semibold ${montserrat.className}`}>
                December 9th - 10th, 2025
              </p>
              <p className={`text-base md:text-lg font-semibold text-center ${montserrat.className}`}>
                A J INSTITUTE OF ENGINEERING AND TECHNOLOGY, Kottarachowki, Mangaluru
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <p className={`text-base md:text-lg mb-6 ${montserrat.className}`}>
                  Our institution stands as a beacon of academic brilliance, fostering innovation and excellence in engineering education.
                </p>
                <p className={`text-base md:text-lg mb-6 ${montserrat.className}`}>
                  We provide a holistic educational experience combining rigorous academics with practical skill development, creativity, and problem-solving.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <Image
                  src="/co.jpg"
                  width={600}
                  height={400}
                  alt="AAKAR Event Venue"
                  className="w-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-zinc-900 rounded-2xl overflow-hidden max-w-3xl w-full shadow-lg">
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full rounded-t-2xl"
                src="https://www.youtube.com/embed/3rVNKn6h-Hk?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-right p-2">
              <Button
                onClick={closeModal}
                className="text-white text-sm cursor-pointer bg-transparent hover:text-red-400"
              >
                Close ✖
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}