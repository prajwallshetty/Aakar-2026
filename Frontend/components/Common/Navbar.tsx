"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
})
export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full bg-transparent backdrop-blur-md z-50 ${montserrat.className}`}>
                <div className="container mx-auto flex items-center justify-between max-w-7xl px-6 py-6">
                    <Link href="/" className="flex items-center max-h-[20px]">
                        <Image src="/ajlogo.png" alt="Logo" width={40} height={40} />
                    </Link>

                    <ul className="flex space-x-16 text-white text-lg font-semibold">
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

                    <div>
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
                </div>
            </nav>

            <div className="pt-[80px]"></div>
        </>
    );
}
