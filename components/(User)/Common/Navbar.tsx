"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Montserrat } from "next/font/google";
import { Button } from "@/components/ui/button";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
})

export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
    const [mobileEventsExpanded, setMobileEventsExpanded] = useState(false);
    const dropdownRef = useRef<HTMLLIElement | null>(null);

    const eventCategories = [
        { id: 1, name: "CULTURAL", href: "/events/cultural" },
        { id: 2, name: "TECHNICAL", href: "/events/technical" },
        { id: 3, name: "GAMING", href: "/events/gaming" },
        { id: 4, name: "SPECIAL", href: "/events/special" },
    ];

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
                setEventsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleMobileEvents = () => {
        setMobileEventsExpanded(!mobileEventsExpanded);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full bg-transparent backdrop-blur-sm z-40 ${montserrat.className}`}>
                <div className="container mx-auto flex items-center justify-between max-w-7xl px-6 py-8">
                    <Link href="/" className="flex items-center max-h-[20px]">
                        <Image src="/logo1.png" alt="Logo" width={480} height={120} className="max-w-[80%]"/>
                    </Link>

                    <ul className="hidden md:flex space-x-8 lg:space-x-16 text-white text-lg font-semibold">
                        <li>
                            <Link href="/" className="hover:text-pink-400 transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-pink-400 transition">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/team" className="hover:text-pink-400 transition">
                                Team
                            </Link>
                        </li>
                        <li ref={dropdownRef} className="relative">
                            <Button
                                className="flex items-center bg-transparent hover:text-pink-400 transition cursor-pointer focus:outline-none"
                                onClick={() => setEventsDropdownOpen(!eventsDropdownOpen)}
                                onMouseEnter={() => setEventsDropdownOpen(true)}
                            >
                                Events
                                <FaChevronDown className="ml-1 text-sm" />
                            </Button>

                            <div
                                className={`absolute left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 origin-top-left ${eventsDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                                    }`}
                                onMouseLeave={() => setEventsDropdownOpen(false)}
                            >
                                <div className="py-1">
                                    {eventCategories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={category.href}
                                            className="block px-4 py-3 text-white hover:bg-gray-800 hover:text-pink-400 transition"
                                            onClick={() => setEventsDropdownOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>
                    </ul>

                    <div className="hidden md:block">
                        <Link
                            href="/register"
                            className="relative inline-flex items-center justify-center w-full py-2 px-8 overflow-hidden font-semibold text-white transition-all duration-300 bg-[#9d0208] rounded-lg group hover:bg-black hover:text-[#ff006e] shadow-md shadow-[#ff006e]/30"
                        >
                            <span className="absolute inset-0 w-full h-full transition-all duration-500 bg-[#ff006e] opacity-10 group-hover:scale-100 rounded-lg blur-sm"></span>
                            <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">Register</span>
                        </Link>
                    </div>

                    <Button
                        className="md:hidden text-white bg-transparent text-2xl cursor-pointer focus:outline-none z-50"
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </Button>
                </div>
            </nav>

            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeSidebar}
            ></div>

            <div
                className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    } ${montserrat.className}`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                        <Link href="/" onClick={closeSidebar}>
                            <Image src="/logo1.png" alt="Logo" width={40} height={40} />
                        </Link>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        <ul className="p-6 space-y-6 text-lg font-semibold">
                            <li>
                                <Link
                                    href="/"
                                    className="block py-2 hover:text-pink-400 transition transform hover:translate-x-2 duration-200"
                                    onClick={closeSidebar}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="block py-2 hover:text-pink-400 transition transform hover:translate-x-2 duration-200"
                                    onClick={closeSidebar}
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/team"
                                    className="block py-2 hover:text-pink-400 transition transform hover:translate-x-2 duration-200"
                                    onClick={closeSidebar}
                                >
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Button
                                    className="flex items-center justify-between w-full py-2 hover:text-pink-400 transition transform hover:translate-x-2 duration-200"
                                    onClick={toggleMobileEvents}
                                >
                                    Events
                                    {mobileEventsExpanded ? (
                                        <FaChevronDown className="ml-2" />
                                    ) : (
                                        <FaChevronRight className="ml-2" />
                                    )}
                                </Button>

                                <div className={`mt-2 ml-4 space-y-3 overflow-hidden transition-all duration-300 ${mobileEventsExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    {eventCategories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={category.href}
                                            className="block py-2 pl-2 hover:border-pink-400 hover:text-pink-400 transition transform hover:translate-x-2 duration-200"
                                            onClick={closeSidebar}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 border-t border-gray-800">
                        <Link
                            href="/register"
                            className="flex items-center justify-center w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-lg transition font-semibold"
                            onClick={closeSidebar}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>

            <div className="pt-[80px]"></div>
        </>
    );
}