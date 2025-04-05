import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Wallet, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface EventDetail {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    date: string;
    time: string;
    price: string;
    rules: string[];
    coordinators: {
        name: string;
        phone: string;
    }[];
}

const sampleEventData: EventDetail = {
    id: "blitzbot-soccer",
    name: "BLITZBOT SOCCER",
    description: "BlitzBot Soccer offers a dynamic twist to traditional soccer, featuring high-speed matches played by robots. With rapid actions and energetic gameplay, it's an exhilarating spectacle for both players and spectators.",
    imageUrl: "/events/event2.jpg",
    date: "May 9th",
    time: "10 PM",
    price: "₹300/P",
    rules: [
        "The game is played on a designated arena with obstacles and a goal at each end.",
        "One ball is placed in the center of the arena at the start of each match.",
        "Robots are placed at their respective goal posts at the start of each match.",
        "Time Limit: The game has a set time limit (e.g., 3 minutes).",
        "Movement: Robots can be controlled by participants (wired, wireless, or autonomous).",
        "Scoring: Robots can push or hit the ball to score by sending it into the opponent's goal."
    ],
    coordinators: [
        {
            name: "Gagan Rao",
            phone: "948042128"
        },
        {
            name: "Anup Krishna N",
            phone: "6364000253"
        }
    ]
};

const EventDescriptionSkeleton = () => {
    return (
        <div className="min-h-screen text-black p-6 md:p-15 flex flex-col items-center justify-center">
            <div className="w-full max-w-7xl mt-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                <div className="md:w-1/2 flex flex-col space-y-6">
                    <Skeleton className="h-12 w-full max-w-md" />
                    <Skeleton className="h-24 w-full" />

                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center">
                            <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="flex items-center">
                            <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <div className="flex items-center">
                            <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                            <Skeleton className="h-6 w-28" />
                        </div>
                    </div>

                    <Skeleton className="h-12 w-32 rounded-lg" />
                </div>

                <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                    <div className="relative">
                        <Skeleton className="w-80 md:w-90 h-100 rounded-4xl" />
                        <div className="w-32 h-24 absolute bottom-2 right-[-40px]">
                            <Skeleton className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl mt-16">
                <Skeleton className="h-8 w-48 mx-auto mb-6" />
                <div className="bg-black/40 rounded-lg p-6">
                    <div className="space-y-2">
                        {Array(6).fill(0).map((_, index) => (
                            <div key={index} className="flex items-start">
                                <Skeleton className="h-4 w-4 mr-2 mt-1" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl mt-12">
                <Skeleton className="h-8 w-64 mx-auto mb-6" />
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    {Array(2).fill(0).map((_, index) => (
                        <div key={index} className="bg-black/40 px-8 py-4 rounded-lg border border-gray-700">
                            <Skeleton className="h-6 w-32" />
                            <div className="flex items-center mt-2">
                                <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                                <Skeleton className="h-5 w-28" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Eventdescription = ({
    eventData = sampleEventData,
    isLoading = false
}: {
    eventData?: EventDetail;
    isLoading?: boolean;
}) => {
    if (isLoading) {
        return <EventDescriptionSkeleton />;
    }

    return (
        <div className="min-h-screen text-black p-6 md:p-15 flex flex-col items-center justify-center">
            <div className="w-full max-w-7xl mt-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                <div className="md:w-1/2 flex flex-col space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-white">
                        {eventData.name}
                    </h1>

                    <p className="text-gray-300">
                        {eventData.description}
                    </p>

                    <div className="flex flex-col space-y-4 text-xl md:text-2xl text-white">
                        <div className="flex items-center">
                            <Calendar className="h-6 w-6 mr-3" />
                            <p>{eventData.date}</p>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-6 w-6 mr-3" />
                            <p>{eventData.time}</p>
                        </div>
                        <div className="flex items-center">
                            <Wallet className="h-6 w-6 mr-3" />
                            <p>{eventData.price}</p>
                        </div>
                    </div>

                    <Link href="/register">
                        <button className="bg-red-600 cursor-pointer hover:bg-red-800 text-white py-3 px-8 md:px-12 rounded-lg w-fit transition-transform hover:scale-105">
                            Register
                        </button>
                    </Link>
                </div>

                <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                    <div className="relative">
                        <div
                            className="w-80 md:w-90 h-100 rounded-4xl bg-cover bg-center"
                            style={{
                                backgroundImage: `url('${eventData.imageUrl}')`,
                            }}
                        >
                        </div>
                        <div
                            className="w-32 h-24 bg-contain bg-no-repeat absolute bottom-2 right-[-40px]"
                            style={{
                                backgroundImage: `url('/eventcard-ch1.png')`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl mt-16">
                <h2 className="text-3xl font-semibold text-center mb-6 text-white">RULES</h2>
                <div className="bg-black/40 rounded-lg p-6">
                    <ul className="text-gray-300 space-y-2">
                        {eventData.rules.map((rule, index) => (
                            <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="w-full max-w-7xl mt-12">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">EVENT COORDINATORS</h2>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    {eventData.coordinators.map((coordinator, index) => (
                        <div key={index} className="bg-black/40 px-8 py-4 rounded-lg border border-gray-700">
                            <p className="text-white font-medium text-xl">{coordinator.name}</p>
                            <div className="flex items-center text-gray-300 mt-2">
                                <Phone className="h-5 w-5 mr-2" />
                                <p>{coordinator.phone}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Eventdescription;