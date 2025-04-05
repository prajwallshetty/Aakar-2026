"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Event, eventType } from "@prisma/client";
import { getEventsByType } from "@/backend/events";

const Eventpage = ({ eventType }: { eventType: eventType }) => {
    const [events, setEvents] = useState<Event[]>([]);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="relative">
                            <div className="w-90 h-100 rounded-4xl bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                            <div
                                className="w-30 h-35 bg-contain bg-no-repeat absolute bottom-2 right-[-40]"
                                style={{
                                    backgroundImage: `url('/eventcard-ch${(i % 3) + 1}.png')`,
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <Link href="desc" key={event.id}>
                            <div
                                className="relative bg-white rounded-4xl p-6 text-center flex flex-col items-center h-100 w-90 bg-cover bg-center cursor-pointer transition-transform hover:scale-105"
                                style={{
                                    backgroundImage: `url('${event.imageUrl}')`,
                                }}
                            >
                                <div
                                    className="w-30 h-35 bg-contain bg-no-repeat absolute bottom-2 right-[-40]"
                                    style={{
                                        backgroundImage: `url('/eventcard-ch${
                                            (index % 3) + 1
                                        }.png')`,
                                    }}
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
