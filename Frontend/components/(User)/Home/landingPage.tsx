import React from 'react';

import { Montserrat } from "next/font/google";
import Image from 'next/image';

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
})

const LandingPage = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Title overlays - visible only on desktop */}
            <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold opacity-100 text-outline w-full text-center tracking-widest hidden md:block">
                AAKAR 2025
            </div>
            <div className="absolute top-1/5 left-1/2 transform z-40 text-outline-blue -translate-x-1/2 -translate-y-1/2 text-8xl font-bold opacity-100 text-outline w-full text-center tracking-widest hidden md:block">
                AAKAR 2025
            </div>

            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:flex h-full relative z-10">
                <div className="w-1/4 flex items-center justify-end">
                    <Image
                        src="/Aakarlogo.png"
                        alt="AAKAR Logo"
                        width={400}
                        height={200}
                        className="mx-auto"
                    />
                </div>

                {/* Center column - Character with play trailer button */}
                <div className="w-2/4 flex flex-col items-center justify-center relative">
                    {/* Character in red hoodie */}
                    <div className="h-full flex items-center justify-center">
                        <div className="h-5/6 w-auto bg-contain bg-no-repeat bg-center"
                            style={{ backgroundImage: "url('/character.png')", minWidth: "250px" }}>
                        </div>
                    </div>

                    {/* Play trailer button at bottom */}
                    <div className={`mt-8 absolute bottom-31 ${montserrat.className}`}>
                        <button className="flex items-center bg-transparent border cursor-pointer border-white rounded-full px-6 py-3 text-white hover:bg-white hover:text-black transition duration-300">
                            <div className="mr-3 w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-black border-b-4 border-b-transparent ml-1"></div>
                            </div>
                            Play Trailer
                        </button>
                    </div>
                </div>

                {/* Right column - Video thumbnails */}
                <div className="w-1/4 flex items-center justify-center">
                    <div className="flex flex-row space-y-6">
                        <div className="w-40 md:w-48 h-28 md:h-32 rounded-xl overflow-hidden">
                            <div className="w-full h-full bg-blue-900 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/api/placeholder/192/128')" }}>
                                <div className="w-10 h-10 rounded-full bg-white bg-opacity-50 flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-black border-b-4 border-b-transparent ml-1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-40 md:w-48 h-28 md:h-32 rounded-xl overflow-hidden">
                            <div className="w-full h-full bg-blue-900 bg-cover bg-center" style={{ backgroundImage: "url('/api/placeholder/192/128')" }}></div>
                        </div>
                    </div>
                    <div className="absolute left-10 top-1/3 w-20 h-40 border-4 border-pink-500 rounded-full animate-pulse">
                    </div>
                </div>
            </div>

            {/* Mobile layout - improved with centered elements and proper spacing */}
            <div className="flex md:hidden flex-col h-full items-center justify-between py-12">
                {/* Container for mobile content with even spacing */}
                <div className="flex flex-col h-full items-center justify-center space-y-16">
                    {/* AAKAR Logo for mobile - centered */}
                    <div className="text-white text-6xl font-bold tracking-wider relative top-[30px] text-center">
                        <Image
                            src="/Aakarlogo.png"
                            alt="AAKAR Logo"
                            width={200}
                            height={100}
                            className="mx-auto"
                        />
                    </div>

                    <div className="h-full flex items-center justify-center mt relative top-[-50px]">
                        <div className="h-5/6 w-auto bg-contain bg-no-repeat bg-center"
                            style={{ backgroundImage: "url('/character.png')", minWidth: "250px" }}>
                        </div>
                    </div>

                    {/* Play trailer button - centered */}
                    <button className={`flex items-center cursor-pointer bg-transparent border border-white rounded-full px-6 py-3 text-white hover:bg-white hover:text-black transition duration-300 relative top-[-160px] ${montserrat.className}`}>
                        <div className="mr-3 w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-black border-b-4 border-b-transparent ml-1"></div>
                        </div>
                        Play Trailer
                    </button>

                </div>
            </div>

        </div>
    );
};

export default LandingPage;
