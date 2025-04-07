"use client";
import React from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Wallet,
    Phone,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@prisma/client";
import { ExtendedEvent } from "@/types";
import { Button } from "@/components/ui/button";

const EventDescriptionSkeleton = () => (
    <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto mt-8 md:mt-12">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                <div className="flex-1 space-y-8">
                    <Skeleton className="h-12 w-3/4 rounded-lg" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full rounded-md" />
                        <Skeleton className="h-6 w-5/6 rounded-md" />
                        <Skeleton className="h-6 w-4/5 rounded-md" />
                    </div>
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-6 w-32 rounded-md" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Skeleton className="h-12 w-36 rounded-lg" />
                        <Skeleton className="h-12 w-36 rounded-lg" />
                    </div>
                </div>
                <div className="lg:w-1/3 flex justify-center relative">
                    <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
                    <Skeleton className="absolute -bottom-4 -right-4 w-24 h-20 rounded-lg" />
                </div>
            </div>
            <div className="mt-16 space-y-6">
                <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
                <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <Skeleton className="h-5 w-5 rounded-full mt-1" />
                            <Skeleton className="h-5 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-16 space-y-6">
                <Skeleton className="h-8 w-64 mx-auto rounded-lg" />
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex-1 max-w-md">
                            <Skeleton className="h-7 w-40 rounded-md mb-3" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-5 w-32 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const EventDescription = ({
    eventData,
    isLoading = false,
}: {
    eventData?: ExtendedEvent | null;
    isLoading?: boolean;
}) => {
    if (isLoading) return <EventDescriptionSkeleton />;
    if (!eventData)
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl">
                Event not found. Please try again later.
            </div>
        );

    const coordinators = Array.isArray(eventData.coordinators)
        ? eventData.coordinators
        : eventData.coordinators
            ? [eventData.coordinators]
            : [];

    return (
        <div className="min-h-screen p-4 md:p-8 text-white">
            <div className="md:max-w-6xl max-w-7xl mx-auto mt-8 md:mt-12">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    <div className="flex-1 space-y-8">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            {eventData.eventName}
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {eventData.description}
                        </p>
                        <div className="space-y-4 text-xl">
                            <div className="flex items-center gap-4">
                                <Calendar className="h-7 w-7 text-red-500" />
                                <span>{new Date(eventData.date).toDateString()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Clock className="h-7 w-7 text-blue-500" />
                                <span>{eventData.time}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Wallet className="h-7 w-7 text-green-500" />
                                <span>{eventData.fee}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg transition-all hover:scale-105"
                                >
                                    Register Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Image Section */}
                    <div className="lg:w-1/3 flex justify-center relative">
                        <div className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden border-2 border-gray-700/50">
                            <img
                                src={eventData.imageUrl}
                                alt={eventData.eventName}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Rules */}
                <div className="mt-16 space-y-6">
                    <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Event Rules
                    </h2>
                    <div className="bg-gray-800/50 rounded-xl p-6 space-y-3">
                        {Array.isArray(eventData.rules) && eventData.rules.length > 0 ? (
                            eventData.rules.map((rule, index) => (
                                <div key={index} className="flex gap-3">
                                    <span className="text-red-500 mt-1">•</span>
                                    <p className="text-gray-300">{rule}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No rules specified for this event.</p>
                        )}
                    </div>
                </div>

                {/* Coordinators */}
                <div className="mt-16 space-y-6">
                    <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                        Event Coordinators
                    </h2>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        {coordinators.length > 0 ? (
                            coordinators.map((coordinator, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex-1 max-w-md hover:border-cyan-500/30 transition-colors"
                                >
                                    <p className="text-xl font-semibold text-white mb-2">
                                        {coordinator.name}
                                    </p>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Phone className="h-5 w-5 text-blue-400" />
                                        <a
                                            href={`tel:${coordinator.phone}`}
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            {coordinator.phone}
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 text-center">
                                <p className="text-gray-400 italic">
                                    Coordinator information will be available soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDescription;