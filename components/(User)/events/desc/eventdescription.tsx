"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Wallet,
    Phone,
    ShoppingCart,
    Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "next/error";
import { Event } from "@prisma/client";
import { CartEvents, ExtendedEvent } from "@/types";

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

                    <div className="flex space-x-4">
                        <Skeleton className="h-12 w-32 rounded-lg" />
                        <Skeleton className="h-12 w-32 rounded-lg" />
                    </div>
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
                        {Array(6)
                            .fill(0)
                            .map((_, index) => (
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
                    {Array(2)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="bg-black/40 px-8 py-4 rounded-lg border border-gray-700"
                            >
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
    eventData,
    isLoading = false,
}: {
    eventData?: ExtendedEvent | null;
    isLoading?: boolean;
}) => {
    const [isInCart, setIsInCart] = useState(false);
    const [buttonText, setButtonText] = useState("Add to Cart");

    // Check if event is already in cart when component mounts
    useEffect(() => {
        if (typeof window !== "undefined") {
            const cartItems = JSON.parse(
                localStorage.getItem("eventCart") || "[]"
            ) as CartEvents;
            const eventInCart = cartItems.some((id) => id === eventData?.id);
            setIsInCart(eventInCart);
            if (eventInCart) {
                setButtonText("Added to Cart");
            }
        }
    }, [eventData?.id]);

    const addToCart = () => {
        if (typeof window !== "undefined" && eventData) {
            const cartItems = JSON.parse(
                localStorage.getItem("eventCart") || "[]"
            ) as CartEvents;

            // Check if event is already in cart
            const eventExists = cartItems.some((id) => id === eventData.id);

            if (!eventExists) {
                cartItems.push(eventData.id);
                localStorage.setItem("eventCart", JSON.stringify(cartItems));
                setIsInCart(true);
                setButtonText("Added to Cart");

                // Show temporary feedback message
                setTimeout(() => {
                    setButtonText("Added to Cart");
                }, 1500);
            } else {
                // Remove from cart if already there
                const updatedCart = cartItems.filter(
                    (id) => id !== eventData.id
                );
                localStorage.setItem("eventCart", JSON.stringify(updatedCart));
                setIsInCart(false);
                setButtonText("Add to Cart");
            }
        }
    };

    if (isLoading) {
        return <EventDescriptionSkeleton />;
    }

    if (!eventData) return <Error statusCode={404} />;

    return (
        <div className="min-h-screen text-black p-6 md:p-15 flex flex-col items-center justify-center">
            <div className="w-full max-w-7xl mt-12 flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="md:w-2/3 flex flex-col space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-white">
                        {eventData.eventName}
                    </h1>

                    <p className="text-gray-300">{eventData.description}</p>

                    <div className="flex flex-col space-y-4 text-xl md:text-2xl text-white">
                        <div className="flex items-center">
                            <Calendar className="h-6 w-6 mr-3" />
                            <p>{eventData.date.toDateString()}</p>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-6 w-6 mr-3" />
                            <p>{eventData.time}</p>
                        </div>
                        <div className="flex items-center">
                            <Wallet className="h-6 w-6 mr-3" />
                            <p>{eventData.fee}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/register">
                            <button className="bg-red-600 cursor-pointer hover:bg-red-800 text-white py-3 px-8 md:px-12 rounded-lg w-fit transition-transform hover:scale-105">
                                Register
                            </button>
                        </Link>

                        <button
                            onClick={addToCart}
                            className={`flex items-center gap-2 cursor-pointer py-3 px-8 md:px-12 rounded-lg w-fit transition-transform hover:scale-105 ${
                                isInCart
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            } text-white`}
                        >
                            {isInCart ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <ShoppingCart className="h-5 w-5" />
                            )}
                            {buttonText}
                        </button>
                    </div>
                </div>

                <div className="md:w-1/3 max-w-[30%] flex justify-center relative">
                    <div className="relative h-full w-full flex items-center justify-center">
                        <div
                            className="rounded-4xl overflow-hidden"
                            style={{
                                width: "100%",
                                height: "0",
                                paddingBottom:
                                    "177.78%" /* 16:9 inverse aspect ratio (9/16 = 0.5625) expressed as percentage: 177.78% */,
                                position: "relative",
                                maxHeight: "100%",
                            }}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url('${eventData.imageUrl}')`,
                                }}
                            ></div>
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
                <h2 className="text-3xl font-semibold text-center mb-6 text-white">
                    RULES
                </h2>
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
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                    EVENT COORDINATORS
                </h2>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    {eventData.coordinators.map((coordinator, index) => (
                        <div
                            key={index}
                            className="bg-black/40 px-8 py-4 rounded-lg border border-gray-700"
                        >
                            <p className="text-white font-medium text-xl">
                                {coordinator.name}
                            </p>
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
