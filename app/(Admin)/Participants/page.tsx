"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DownloadCloud,
    Filter,
    Search,
    School,
    FileSpreadsheet,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    ChevronFirst,
    ChevronLast,
    UserPlus,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { getParticipantsPaginated, getParticipantColleges, getAllParticipantsForExport } from "@/backend/participant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadEventRegistrationsByCollege, downloadParticipantData, downloadParticipantDataByEvents } from "./utils";
import { ExtendedEvent, ExtendedParticipant } from "@/types";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function ParticipantsPage() {
    const [participants, setParticipants] = useState<(ExtendedParticipant & { events: ExtendedEvent[] })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCollege, setSelectedCollege] = useState<string>("");
    const [filterType, setFilterType] = useState<"include" | "exclude" | "all">("all");
    const [colleges, setColleges] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search input (400ms)
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }
        searchTimerRef.current = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 400);

        return () => {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        };
    }, [searchQuery]);

    // Fetch colleges once on mount
    useEffect(() => {
        getParticipantColleges().then(setColleges).catch(console.error);
    }, []);

    // Main data fetch — triggered by pagination, search, or filter changes
    const fetchParticipants = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await getParticipantsPaginated({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch,
                college: selectedCollege,
                collegeFilterType: filterType,
            });

            if (response.error) {
                setError(typeof response.error === "string" ? response.error : "Failed to fetch participants");
                setParticipants([]);
                setTotalItems(0);
                setTotalPages(1);
            } else if (response.data) {
                setParticipants(response.data);
                setTotalItems(response.totalCount);
                setTotalPages(response.totalPages || 1);
            }
        } catch (err) {
            setError("An error occurred while fetching participants");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage, debouncedSearch, selectedCollege, filterType]);

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    // Download helpers — fetch all data on-demand
    const fetchAllForExport = async () => {
        setIsDownloading(true);
        try {
            const response = await getAllParticipantsForExport();
            if (response.error || !response.data) {
                setError("Failed to fetch data for download");
                return null;
            }
            return response.data;
        } catch (err) {
            console.error("Error fetching for export:", err);
            setError("Failed to fetch data for download");
            return null;
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadAll = async () => {
        const data = await fetchAllForExport();
        if (data) {
            try {
                await downloadParticipantData(data);
            } catch (error) {
                console.error("Error downloading data:", error);
                setError("Failed to download participant data");
            }
        }
    };

    const handleDownloadByCollege = async () => {
        const data = await fetchAllForExport();
        if (data) {
            try {
                await downloadParticipantData(data, true);
            } catch (error) {
                console.error("Error downloading data by college:", error);
                setError("Failed to download participant data by college");
            }
        }
    };

    const handleDownloadByEvent = async () => {
        const data = await fetchAllForExport();
        if (data) {
            try {
                await downloadParticipantDataByEvents(data);
            } catch (error) {
                console.error("Error downloading data by events:", error);
                setError("Failed to download participant data by events");
            }
        }
    };

    const handleDownloadEventCounts = async () => {
        const data = await fetchAllForExport();
        if (data) {
            try {
                await downloadEventRegistrationsByCollege(data, "A J Institute of Engineering and Technology, Mangalore");
            } catch (error) {
                console.error("Error downloading event counts:", error);
                setError("Failed to download event counts");
            }
        }
    };

    const resetFilters = () => {
        setSearchQuery("");
        setDebouncedSearch("");
        setSelectedCollege("");
        setFilterType("all");
        setCurrentPage(1);
    };

    const toggleParticipantExpanded = (id: number) => {
        setExpandedParticipant(
            expandedParticipant === id.toString() ? null : id.toString()
        );
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = parseInt(value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const TableSkeleton = () => (
        <>
            {Array(5)
                .fill(0)
                .map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-28" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-20" />
                        </TableCell>
                    </TableRow>
                ))}
        </>
    );

    const PaginationControls = () => (
        <div className="flex flex-col md:flex-row items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                    Items per page:
                </span>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                >
                    <SelectTrigger className="h-8 w-[70px] cursor-pointer">
                        <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5" className="cursor-pointer">5</SelectItem>
                        <SelectItem value="10" className="cursor-pointer">10</SelectItem>
                        <SelectItem value="20" className="cursor-pointer">20</SelectItem>
                        <SelectItem value="50" className="cursor-pointer">50</SelectItem>
                        <SelectItem value="100" className="cursor-pointer">100</SelectItem>
                        <SelectItem value="250" className="cursor-pointer">250</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || isLoading}
                    className="cursor-pointer h-8 w-8"
                >
                    <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="cursor-pointer h-8 w-8"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="cursor-pointer h-8 w-8"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="cursor-pointer h-8 w-8"
                >
                    <ChevronLast className="h-4 w-4" />
                </Button>
            </div>

            <div className="text-sm text-muted-foreground">
                Showing {totalItems === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
            </div>
        </div>
    );

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Participant Management</CardTitle>
                    <CardDescription>
                        View and manage all participant registrations for your
                        event
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="participants">
                        <TabsContent value="participants">
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Search participants, USN, email, event name..."
                                                className="pl-8 w-full"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                        <div className="flex items-center flex-col md:flex-row gap-2">
                                            <Select
                                                value={filterType}
                                                onValueChange={(value: "include" | "exclude" | "all") => {
                                                    setFilterType(value);
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <SelectTrigger className="w-[100px] cursor-pointer">
                                                    <SelectValue placeholder="Filter type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all" className="cursor-pointer">All</SelectItem>
                                                    <SelectItem value="include" className="cursor-pointer">Include</SelectItem>
                                                    <SelectItem value="exclude" className="cursor-pointer">Exclude</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={selectedCollege}
                                                onValueChange={(value) => {
                                                    setSelectedCollege(value);
                                                    setCurrentPage(1);
                                                }}
                                                disabled={filterType === "all"}
                                            >
                                                <SelectTrigger className="w-full sm:w-[180px] cursor-pointer">
                                                    <SelectValue placeholder="College" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {colleges.map((college) => (
                                                        <SelectItem
                                                            key={college}
                                                            value={college}
                                                            className={`cursor-pointer ${montserrat.className}`}
                                                        >
                                                            {college}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={resetFilters}
                                            className="cursor-pointer"
                                        >
                                            <Filter className="mr-2 h-4 w-4" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 justify-between items-center">
                                    <div className="flex items-center flex-col md:flex-row gap-2 overflow-hidden">
                                        <Badge variant="outline">
                                            {totalItems} registrations
                                        </Badge>
                                        {selectedCollege && filterType !== "all" && (
                                            <Badge variant="secondary">
                                                <School className="mr-1 h-3 w-3" />
                                                {filterType === "include" ? "Including" : "Excluding"}: {selectedCollege}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button asChild className="cursor-pointer">
                                            <Link href="/Participants/add">
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                <span className="whitespace-nowrap">Add Participant</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            onClick={handleDownloadAll}
                                            className="cursor-pointer"
                                            disabled={isDownloading}
                                        >
                                            <DownloadCloud className="mr-2 h-4 w-4" />
                                            <span className="whitespace-nowrap">
                                                {isDownloading ? "Loading..." : "Download Data"}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleDownloadEventCounts}
                                            className="cursor-pointer"
                                            disabled={isDownloading}
                                        >
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            <span className="whitespace-nowrap">Download Event Counts</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleDownloadByCollege}
                                            className="cursor-pointer"
                                            disabled={isDownloading}
                                        >
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            <span className="whitespace-nowrap">
                                                Download by College
                                            </span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleDownloadByEvent}
                                            className="cursor-pointer"
                                            disabled={isDownloading}
                                        >
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            <span className="whitespace-nowrap">
                                                Download by Events
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-500 p-3 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>id</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>College</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Events</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? (
                                                <TableSkeleton />
                                            ) : participants.length ===
                                                0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={7}
                                                        className="text-center py-10"
                                                    >
                                                        No participants found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                participants.map(
                                                    (participant) => (
                                                        <React.Fragment
                                                            key={participant.id}
                                                        >
                                                            <TableRow
                                                                className={
                                                                    expandedParticipant ===
                                                                        participant.id.toString()
                                                                        ? "border-b-0"
                                                                        : ""
                                                                }
                                                            >
                                                                <TableCell className="font-medium">
                                                                    {
                                                                        participant.id
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                    {
                                                                        participant.name
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        participant.college
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            participant.paymentStatus === "APPROVED"
                                                                                ? "default"
                                                                                : participant.paymentStatus === "FAILED"
                                                                                    ? "destructive"
                                                                                    : "outline"
                                                                        }
                                                                        className={
                                                                            participant.paymentStatus === "APPROVED"
                                                                                ? "bg-green-600 hover:bg-green-700 text-white border-none"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        {participant.paymentStatus}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {participant.events.map((e, index) => (
                                                                        <span key={index}>
                                                                            {e.eventName}
                                                                            <br />
                                                                        </span>
                                                                    ))}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        participant.phone
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                (window.location.href = `/Participants/${participant.id}`)
                                                                            }
                                                                            className="cursor-pointer"
                                                                        >
                                                                            View
                                                                        </Button>

                                                                        {participant.groupMembersData &&
                                                                            Object.values(
                                                                                participant.groupMembersData
                                                                            ).some(
                                                                                (
                                                                                    group
                                                                                ) =>
                                                                                    group
                                                                                        .members
                                                                                        .length >
                                                                                    0
                                                                            ) && (
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        toggleParticipantExpanded(
                                                                                            participant.id
                                                                                        )
                                                                                    }
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    {expandedParticipant ===
                                                                                        participant.id.toString() ? (
                                                                                        <ChevronDown className="h-4 w-4" />
                                                                                    ) : (
                                                                                        <ChevronRight className="h-4 w-4" />
                                                                                    )}
                                                                                    Group
                                                                                </Button>
                                                                            )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>

                                                            {participant.groupMembersData &&
                                                                Object.values(
                                                                    participant.groupMembersData
                                                                ).some(
                                                                    (group) =>
                                                                        group
                                                                            .members
                                                                            .length >
                                                                        0
                                                                ) &&
                                                                expandedParticipant ===
                                                                participant.id.toString() && (
                                                                    <TableRow className="bg-muted/50">
                                                                        <TableCell
                                                                            colSpan={
                                                                                7
                                                                            }
                                                                            className="py-2"
                                                                        >
                                                                            <div className="pl-6 border-l-2 border-primary/20 ml-2 mt-2 overflow-x-auto">
                                                                                <h4 className="font-medium text-sm mb-2">
                                                                                    Group
                                                                                    Members
                                                                                </h4>
                                                                                {Object.keys(
                                                                                    participant.groupMembersData
                                                                                ).map(
                                                                                    (
                                                                                        group,
                                                                                        im
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                im
                                                                                            }
                                                                                        >
                                                                                            <h4>
                                                                                                {
                                                                                                    participant.events.find(
                                                                                                        (
                                                                                                            e
                                                                                                        ) =>
                                                                                                            e.id ===
                                                                                                            parseInt(
                                                                                                                group
                                                                                                            )
                                                                                                    )
                                                                                                        ?.eventName
                                                                                                }
                                                                                            </h4>
                                                                                            <Table>
                                                                                                <TableHeader>
                                                                                                    <TableRow>
                                                                                                        <TableHead className="w-1/2">
                                                                                                            Name
                                                                                                        </TableHead>
                                                                                                        <TableHead className="w-1/2">
                                                                                                            USN
                                                                                                        </TableHead>
                                                                                                    </TableRow>
                                                                                                </TableHeader>
                                                                                                <TableBody>
                                                                                                    {participant.groupMembersData![
                                                                                                        group
                                                                                                    ].members.map(
                                                                                                        (
                                                                                                            member,
                                                                                                            idx
                                                                                                        ) => (
                                                                                                            <TableRow
                                                                                                                key={
                                                                                                                    idx +
                                                                                                                    1
                                                                                                                }
                                                                                                            >
                                                                                                                <TableCell>
                                                                                                                    {
                                                                                                                        member.name
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                                <TableCell>
                                                                                                                    {
                                                                                                                        member.usn
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                            </TableRow>
                                                                                                        )
                                                                                                    )}
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                        </React.Fragment>
                                                    )
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {!isLoading && <PaginationControls />}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}