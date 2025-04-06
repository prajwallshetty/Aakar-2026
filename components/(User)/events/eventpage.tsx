"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Event, eventType } from "@prisma/client";
import { getEventsByType } from "@/backend/events";
import { ExtendedEvent } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Eventpage = ({ eventType }: { eventType: eventType }) => {
    const [events, setEvents] = useState<ExtendedEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await getEventsByType(eventType);
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen text-black p-15 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white mb-12">
                {eventType} Events
            </h1>

            {loading ? (
                <div className="relative bg-white rounded-4xl p-6 text-center flex flex-col items-center aspect-[9/16] w-60 bg-cover bg-center cursor-pointer transition-transform hover:scale-105">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="relative">
                            <Skeleton className="w-90 h-100 rounded-4xl"></Skeleton>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="max-w-6xl m-auto flex gap-6 w-full">
                    {events.map((event, index) => (
                        <Link href={"/events/" + event.id} key={event.id}>
                            <div
                                className="relative bg-white rounded-4xl p-6 text-center flex flex-col items-center aspect-[9/16] w-60 bg-cover bg-center cursor-pointer transition-all duration-300 hover:scale-105 group overflow-hidden"
                                style={{
                                    backgroundImage: `url('${event.imageUrl}')`,
                                }}
                            >
                                {/* Add subtle card glow effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 transition-opacity duration-300"></div>

                                {/* Add floating particles on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute h-2 w-2 rounded-full bg-white/70 animate-ping top-1/4 left-1/4 delay-100"></div>
                                    <div className="absolute h-1 w-1 rounded-full bg-white/70 animate-ping top-1/3 right-1/3 delay-300"></div>
                                    <div className="absolute h-1.5 w-1.5 rounded-full bg-white/70 animate-ping bottom-1/3 left-1/2 delay-500"></div>
                                    <div className="absolute h-2 w-2 rounded-full bg-white/70 animate-ping bottom-1/4 right-1/4 delay-700"></div>
                                </div>

                                {/* Enhanced 3D Character animation */}
                                <div
                                    className="w-20 h-25 bg-contain bg-no-repeat absolute bottom-2 right-[-20] 
                  transition-all duration-300 ease-in-out
                  group-hover:scale-110 
                  group-hover:translate-y-[-8px] 
                  group-hover:rotate-6
                  drop-shadow-sm 
                  group-hover:drop-shadow-lg
                  group-hover:filter group-hover:brightness-110"
                                    style={{
                                        backgroundImage: `url('/eventcard-ch${
                                            (index % 3) + 1
                                        }.png')`,
                                        transformOrigin: "bottom center",
                                    }}
                                >
                                    {/* Bounce shadow that separates from character */}
                                    <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-14 h-2 bg-black/20 rounded-full blur-sm scale-0 group-hover:scale-100 transition-all duration-300 ease-in-out"></div>
                                </div>

                                {/* Subtle shine effect across the card */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
                                    style={{ width: "200%" }}
                                ></div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Eventpage;
