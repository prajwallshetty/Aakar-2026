"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Calendar,
    Phone,
    Mail,
    School,
    User,
    Users,
    Tag,
    CreditCard,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getParticipantWithEvents } from "@/backend/participant";
import Link from "next/link";
import type { Event } from "@prisma/client";
import { ExtendedParticipant } from "@/types";

type ExtendedParticipant1 = ExtendedParticipant & {
    events: Event[];
};

export default function ParticipantDetailPage() {
    const { id } = useParams();
    const [participant, setParticipant] = useState<ExtendedParticipant1 | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedEvents, setExpandedEvents] = useState<{
        [key: string]: boolean;
    }>({});

    useEffect(() => {
        const fetchParticipantDetails = async () => {
            try {
                setIsLoading(true);
                const participantId = Array.isArray(id)
                    ? Number.parseInt(id[0])
                    : Number.parseInt(id as string);

                if (isNaN(participantId)) {
                    setError("Invalid participant ID");
                    return;
                }

                const response = await getParticipantWithEvents(participantId);

                if (response.error || !response.data) {
                    setError(
                        typeof response.error === "string"
                            ? response.error
                            : "Failed to fetch participant details"
                    );
                    return;
                }

                if (response.data) {
                    setParticipant(response.data);

                    if (
                        response.data.paymentScreenshotUrls &&
                        Array.isArray(response.data.paymentScreenshotUrls) &&
                        response.data.paymentScreenshotUrls.length > 0
                    ) {
                        const cache = await caches.open(
                            "payment-screenshots-cache"
                        );
                        response.data.paymentScreenshotUrls.forEach(
                            async (url) => {
                                const cached = await cache.match(url);
                                if (!cached) {
                                    const response = await fetch(url, {
                                        mode: "no-cors",
                                    });
                                    cache.put(url, response);
                                }
                            }
                        );
                    }
                }
            } catch (err) {
                setError(
                    "An error occurred while fetching participant details"
                );
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchParticipantDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-9 w-36 bg-gray-200 animate-pulse rounded-md"></div>
                </div>

                <div className="border rounded-lg shadow-sm">
                    <div className="p-6 space-y-3">
                        <div className="h-7 w-48 bg-gray-200 animate-pulse rounded-md"></div>
                        <div className="h-5 w-72 bg-gray-100 animate-pulse rounded-md"></div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-md"></div>
                                    <div className="h-px w-full bg-gray-200"></div>
                                </div>

                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            key={i}
                                            className="flex items-start"
                                        >
                                            <div className="h-5 w-5 mr-2 bg-gray-200 animate-pulse rounded-md"></div>
                                            <div className="space-y-2 flex-1">
                                                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded-md"></div>
                                                <div className="h-5 w-32 bg-gray-100 animate-pulse rounded-md"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="h-6 w-44 bg-gray-200 animate-pulse rounded-md"></div>
                                    <div className="h-px w-full bg-gray-200"></div>
                                </div>

                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="flex items-start"
                                        >
                                            <div className="h-5 w-5 mr-2 bg-gray-200 animate-pulse rounded-md"></div>
                                            <div className="space-y-2 flex-1">
                                                <div className="h-5 w-28 bg-gray-200 animate-pulse rounded-md"></div>
                                                <div className="h-5 w-24 bg-gray-100 animate-pulse rounded-md"></div>
                                            </div>
                                        </div>
                                    ))}

                                    <div>
                                        <div className="h-5 w-36 bg-gray-200 animate-pulse rounded-md mb-2"></div>
                                        <div className="h-48 w-64 bg-gray-100 animate-pulse rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="h-6 w-36 bg-gray-200 animate-pulse rounded-md"></div>
                                <div className="h-px w-full bg-gray-200"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="border rounded-lg p-4 shadow-sm"
                                    >
                                        <div className="flex justify-between">
                                            <div className="space-y-2">
                                                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                                                <div className="h-4 w-28 bg-gray-100 animate-pulse rounded-md"></div>
                                                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded-md"></div>
                                                <div className="flex gap-2 mt-2">
                                                    <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-full"></div>
                                                    <div className="h-5 w-16 bg-gray-100 animate-pulse rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="h-5 w-12 bg-gray-200 animate-pulse rounded-md"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !participant) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="bg-red-50 text-red-500 p-4 rounded-md">
                            {error || "Participant not found"}
                        </div>
                        <div className="mt-4">
                            <Button asChild className="cursor-pointer">
                                <Link href="/admin/participants">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Participants
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" asChild className="cursor-pointer">
                    <Link href="/Participants" className="cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Participants
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Participant Details</CardTitle>
                    <CardDescription>
                        Complete information about the participant
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">
                                    Personal Information
                                </h3>
                                <Separator />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-start">
                                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">Name</div>
                                        <div>{participant.name}</div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">Email</div>
                                        <div>{participant.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">Phone</div>
                                        <div>{participant.phone}</div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">USN</div>
                                        <div>{participant.usn}</div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <School className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            College
                                        </div>
                                        <div>{participant.college}</div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            Department & Year
                                        </div>
                                        <div>
                                            {participant.department || "N/A"} -{" "}
                                            {participant.year} Year
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            Registered On
                                        </div>
                                        <div>
                                            {new Date(
                                                participant.createdAt
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">
                                    Payment Information
                                </h3>
                                <Separator />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-start">
                                    <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            Amount Paid
                                        </div>
                                        <div>₹{participant.amount}</div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            Transaction ID
                                        </div>
                                        <div>
                                            {participant.transaction_ids.join(
                                                ", "
                                            ) || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 flex flex-col md:flex-row gap-4">
                            {participant.paymentScreenshotUrls &&
                                participant.paymentScreenshotUrls.map(
                                    (pS, index) => (
                                        <div key={index}>
                                            <div className="font-medium mb-2">
                                                Payment Screenshot {index + 1}
                                            </div>
                                            <div className="border rounded-md overflow-hidden max-w-sm bg-black">
                                                {pS == "None" ? (
                                                    <div className="flex items-center justify-center h-48 bg-gray-100">
                                                        <p className="text-[10px] text-muted-foreground">
                                                            Registered through
                                                            /registerAJIET
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={
                                                            pS ||
                                                            "/Aakarlogo.svg"
                                                        }
                                                        alt="Payment Screenshot"
                                                        className="w-full h-auto"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">
                                Registered Events
                            </h3>
                            <Separator />
                        </div>

                        {participant.events && participant.events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {participant.events.map((event) => (
                                    <Card key={event.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">
                                                        {event.eventName}
                                                    </h4>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            event.date
                                                        ).toLocaleDateString()}{" "}
                                                        at {event.time}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Venue: {event.venue}
                                                    </div>
                                                    <div className="mt-2 flex gap-2">
                                                        <Badge>
                                                            {
                                                                event.eventCategory
                                                            }
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {event.eventType}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">
                                                        ₹{event.fee}
                                                    </div>
                                                </div>
                                            </div>

                                            {participant.groupMembersData &&
                                                participant.groupMembersData[
                                                    event.id
                                                ] && (
                                                    <div
                                                        className="mt-3 pt-2 border-t"
                                                        key={
                                                            event.id +
                                                            "expanded"
                                                        }
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                setExpandedEvents(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [event.id]:
                                                                            !prev[
                                                                                event
                                                                                    .id
                                                                            ],
                                                                    })
                                                                )
                                                            }
                                                            className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors w-full"
                                                        >
                                                            <Users size={16} />
                                                            <span>
                                                                Group Members (
                                                                {
                                                                    participant
                                                                        .groupMembersData[
                                                                        event.id
                                                                    ]
                                                                        .participantCount
                                                                }
                                                                )
                                                            </span>
                                                            {expandedEvents[
                                                                event.id
                                                            ] ? (
                                                                <ChevronUp
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                <ChevronDown
                                                                    size={16}
                                                                />
                                                            )}
                                                        </button>

                                                        {expandedEvents[
                                                            event.id
                                                        ] && (
                                                            <div className="mt-2 space-y-2 pl-6">
                                                                {participant.groupMembersData[
                                                                    event.id
                                                                ].members.map(
                                                                    (
                                                                        member,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="text-sm bg-muted p-2 rounded-md"
                                                                        >
                                                                            <div className="font-medium">
                                                                                {
                                                                                    member.name
                                                                                }
                                                                            </div>
                                                                            <div className="text-xs text-muted-foreground">
                                                                                USN:{" "}
                                                                                {
                                                                                    member.usn
                                                                                }{" "}
                                                                                |
                                                                                Email:{" "}
                                                                                {
                                                                                    member.email
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground">
                                No events registered
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
