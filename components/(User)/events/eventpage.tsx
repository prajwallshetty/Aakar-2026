"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { eventCategory } from "@prisma/client";
import { getEventsByCategory } from "@/backend/events";
import { ExtendedEvent } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Eventpage = ({ eventCategory }: { eventCategory: eventCategory }) => {
    const [events, setEvents] = useState<ExtendedEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await getEventsByCategory(eventCategory);
                setEvents(data);
    
                // Cache all event images
                const cache = await caches.open('event-image-cache');
                data.forEach(async (event) => {
                    const cached = await cache.match(event.imageUrl);
                    if (!cached) {
                        const response = await fetch(event.imageUrl, { mode: 'no-cors' });
                        cache.put(event.imageUrl, response);
                    }
                });
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
                {eventCategory} Events
            </h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full md:max-w-5xl  px-4" >
                    {
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="relative aspect-[1/1.414] w-full bg-gray-300 rounded-4xl overflow-hidden">
                                <Skeleton className="w-full h-full" />
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
                                        backgroundImage: `url('/eventcard-ch${(i % 3) + 1
                                            }.png')`,
                                        transformOrigin: "bottom center",
                                    }}
                                >
                                    <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-14 h-2 bg-black/20 rounded-full blur-sm scale-0 group-hover:scale-100 transition-all duration-300 ease-in-out"></div>
                                </div>

                            </div>
                        ))
                    }
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full md:max-w-5xl md:px-4">
                    {events.map((event, index) => (
                        <Link href={"/events/" + event.imageUrl} key={event.id} className="w-full">
                            <div
                                className="relative bg-white rounded-4xl p-6 text-center flex flex-col items-center aspect-[1/1.414] w-full bg-cover bg-center cursor-pointer transition-all duration-300 hover:scale-105 group overflow-hidden"
                                style={{
                                    backgroundImage: `url('${event.id}.png')`,
                                }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 transition-opacity duration-300"></div>

                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute h-2 w-2 rounded-full bg-white/70 animate-ping top-1/4 left-1/4 delay-100"></div>
                                    <div className="absolute h-1 w-1 rounded-full bg-white/70 animate-ping top-1/3 right-1/3 delay-300"></div>
                                    <div className="absolute h-1.5 w-1.5 rounded-full bg-white/70 animate-ping bottom-1/3 left-1/2 delay-500"></div>
                                    <div className="absolute h-2 w-2 rounded-full bg-white/70 animate-ping bottom-1/4 right-1/4 delay-700"></div>
                                </div>

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
                                        backgroundImage: `url('/eventcard-ch${(index % 3) + 1
                                            }.png')`,
                                        transformOrigin: "bottom center",
                                    }}
                                >
                                    <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-14 h-2 bg-black/20 rounded-full blur-sm scale-0 group-hover:scale-100 transition-all duration-300 ease-in-out"></div>
                                </div>

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