"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
})

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Prevent scrolling when sidebar is open
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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full bg-transparent backdrop-blur-md z-40 ${montserrat.className}`}>
                <div className="container mx-auto flex items-center justify-between max-w-7xl px-6 py-6">
                    <Link href="/" className="flex items-center max-h-[20px]">
                        <Image src="/ajlogo.png" alt="Logo" width={40} height={40} />
                    </Link>

                    {/* Desktop Navigation */}
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
                        <li>
                            <Link href="/events" className="hover:text-pink-400 transition">
                                Events
                            </Link>
                        </li>
                    </ul>

                    {/* Desktop Auth */}
                    <div className="hidden md:block">
                        {isLoggedIn ? (
                            <Link href="/profile">
                                <FaUserCircle className="text-white text-2xl cursor-pointer hover:text-pink-400 transition" />
                            </Link>
                        ) : (
                            <Link href="/register" className="text-white font-semibold hover:text-pink-400 transition">
                                Register
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-white text-2xl focus:outline-none z-50" 
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>

            {/* Full-page Sidebar Overlay */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out md:hidden ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeSidebar}
            ></div>

            {/* Full-page Sidebar with Montserrat font */}
            <div 
                className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                } ${montserrat.className}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo area in sidebar */}
                    <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                        <Link href="/" onClick={closeSidebar}>
                            <Image src="/ajlogo.png" alt="Logo" width={40} height={40} />
                        </Link>
                    </div>

                    {/* Navigation Links */}
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
                                <Link 
                                    href="/events" 
                                    className="block py-2 hover:text-pink-400 transition transform hover:translate-x-2 duration-200" 
                                    onClick={closeSidebar}
                                >
                                    Events
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Auth Section at Bottom */}
                    <div className="p-6 border-t border-gray-800">
                        {isLoggedIn ? (
                            <Link 
                                href="/profile" 
                                className="flex items-center py-2 hover:text-pink-400 transition transform hover:translate-x-2 duration-200" 
                                onClick={closeSidebar}
                            >
                                <FaUserCircle className="mr-3 text-2xl" /> Profile
                            </Link>
                        ) : (
                            <Link 
                                href="/register" 
                                className="flex items-center justify-center w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-lg transition font-semibold" 
                                onClick={closeSidebar}
                            >
                                Register
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-[80px]"></div>
        </>
    );
}