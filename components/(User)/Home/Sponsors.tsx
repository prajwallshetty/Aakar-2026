"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Sponsors = () => {
    const sponsors = [
        { id: 1, name: "Sponsor 1", type: "Title Sponsor", logo: "/ajlogo.png" },
        { id: 2, name: "Sponsor 2", type: "Gold Sponsor", logo: "/ajlogo.png" },
        { id: 3, name: "Sponsor 3", type: "Silver Sponsor", logo: "/ajlogo.png" },
        { id: 4, name: "Sponsor 4", type: "Media Sponsor", logo: "/ajlogo.png" },
        { id: 5, name: "Sponsor 5", type: "Technology Partner", logo: "/ajlogo.png" },
        { id: 6, name: "Sponsor 6", type: "Food Partner", logo: "/ajlogo.png" },
        { id: 7, name: "Sponsor 7", type: "Education Partner", logo: "/ajlogo.png" },
        { id: 8, name: "Sponsor 8", type: "Community Partner", logo: "/ajlogo.png" },
    ];

    const [width, setWidth] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }

        const handleResize = () => {
            if (carouselRef.current) {
                setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="text-black p-8 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white mb-12">Our Sponsors</h1>

            <div className="w-full max-w-7xl overflow-hidden px-4">
                <motion.div
                    ref={carouselRef}
                    className="cursor-grab"
                    whileTap={{ cursor: "grabbing" }}
                >
                    <motion.div
                        className="flex gap-12"
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        initial={{ x: 0 }}
                        animate={{ x: [-width, 0] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 20,
                                ease: "linear",
                            },
                        }}
                    >
                        {sponsors.map((sponsor) => (
                            <motion.div
                                key={sponsor.id}
                                className="relative min-w-48 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center">
                                        <Image
                                            src={`${sponsor.logo}` || "/ajlogo.png"}
                                            alt={`${sponsor.name} logo`}
                                            width={200}
                                            height={200}
                                            className="object-contain max-h-full"
                                        />
                                    </div>

                                    <p className="text-white mt-2 text-center text-sm font-light">{sponsor.type}</p>
                                    <p className="text-white text-center font-medium">{sponsor.name}</p>
                                </div>

                                <div
                                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-full"
                                    style={{ width: "200%" }}
                                ></div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Sponsors;