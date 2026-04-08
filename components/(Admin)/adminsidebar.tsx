"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    Menu,
    LogOut,
    User,
    BarChart2,
    School,
    Shirt,
    Ticket,
    ChevronRight,
    Award,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const menuItems = [
    { icon: LayoutDashboard, label: "Admin Portal", href: "/AdminPortal" },
    { icon: CalendarDays, label: "Events", href: "/EventsCRUD" },
    { icon: User, label: "Participants", href: "/Participants" },
    { icon: Shirt, label: "Merch Orders", href: "/MerchOrders" },
    { icon: Ticket, label: "Elite Pass Orders", href: "/ElitePassOrders" },
    { icon: BarChart2, label: "Event Stats", href: "/EventStatistics" },
    { icon: School, label: "College Stats", href: "/CollegeStatistics" },
    { icon: Award, label: "Certificates", href: "/Certificates" },
];

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Spacer to prevent content overlap */}
            <div className={cn("shrink-0 transition-all duration-300", isOpen ? "w-64" : "w-[60px]")} />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen flex flex-col",
                    "bg-white border-r border-zinc-200 shadow-sm",
                    "transition-all duration-300 ease-in-out",
                    isOpen ? "w-64" : "w-[60px]",
                    montserrat.className
                )}
            >
                {/* Header */}
                <div className="flex items-center h-16 px-3 border-b border-zinc-100 shrink-0">
                    {isOpen ? (
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold tracking-tight">A</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900 leading-none">Aakar</p>
                                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-none">Admin Panel</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={15} />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mx-auto text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                            onClick={() => setIsOpen(true)}
                        >
                            <Menu size={16} />
                        </Button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                    {isOpen && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-2 pb-2">
                            Navigation
                        </p>
                    )}
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return isOpen ? (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150",
                                    "group relative",
                                    isActive
                                        ? "bg-zinc-900 text-white font-medium"
                                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                                )}
                            >
                                <Icon size={16} className={cn(isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-700")} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <ChevronRight size={14} className="ml-auto text-white/60" />
                                )}
                            </Link>
                        ) : (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-center h-9 w-9 mx-auto rounded-md transition-all duration-150",
                                            isActive
                                                ? "bg-zinc-900 text-white"
                                                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                                        )}
                                    >
                                        <Icon size={16} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className={cn("text-xs", montserrat.className)}>
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                <Separator className="bg-zinc-100" />

                {/* Footer / User section */}
                <div className="p-3 shrink-0">
                    {isOpen ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-zinc-50 border border-zinc-100">
                                <div className="h-7 w-7 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                                    <span className="text-zinc-600 text-xs font-semibold">A</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-zinc-800 truncate">Admin Name</p>
                                    <p className="text-[10px] text-zinc-400 truncate">admin@email.com</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={async () => await signOut()}
                            >
                                <LogOut size={14} />
                                Sign out
                            </Button>
                        </div>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 mx-auto flex text-red-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={async () => await signOut()}
                                >
                                    <LogOut size={15} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className={cn("text-xs", montserrat.className)}>Sign out</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </aside>
        </TooltipProvider>
    );
};

export default AdminSidebar;