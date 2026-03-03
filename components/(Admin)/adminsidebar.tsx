"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    CalendarDays,
    Menu,
    ChevronLeft,
    LogOut,
    User,
    BarChart,
    School,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/AdminPortal" },
    { icon: <CalendarDays size={18} />, label: "Events", href: "/EventsCRUD" },
    { icon: <User size={18} />, label: "Participants", href: "/Participants" },
    { icon: <BarChart size={18} />, label: "Event Stats", href: "/EventStatistics" },
    { icon: <School size={18} />, label: "College Stats", href: "/CollegeStatistics" },
];

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={`shrink-0 transition-all duration-300 ${isOpen ? "w-60" : "w-16"}`} />
            <aside
                className={`fixed top-0 left-0 z-50 h-full flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ${
                    isOpen ? "w-60" : "w-16"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-4 border-b border-zinc-800">
                    {isOpen && (
                        <span className="text-white font-semibold text-sm tracking-wide pl-1">
                            Admin Panel
                        </span>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ${!isOpen ? "mx-auto" : ""}`}
                    >
                        {isOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 space-y-1 px-2">
                    {menuItems.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-2 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors group ${
                                !isOpen ? "justify-center" : ""
                            }`}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            {isOpen && (
                                <span className="text-sm font-medium truncate">{item.label}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-zinc-800 px-2 py-4">
                    {isOpen && (
                        <div className="flex items-center gap-3 px-2 py-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                                A
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">Admin Name</p>
                                <p className="text-xs text-zinc-500 truncate">admin@email.com</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={async () => await signOut()}
                        className={`flex items-center gap-3 w-full px-2 py-2.5 rounded-lg text-red-500 hover:text-red-400 hover:bg-zinc-800 transition-colors text-sm ${
                            !isOpen ? "justify-center" : ""
                        }`}
                    >
                        <LogOut size={18} className="shrink-0" />
                        {isOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;