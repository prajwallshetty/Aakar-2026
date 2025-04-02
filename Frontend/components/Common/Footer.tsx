"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
})

const Footer: React.FC = () => {
  return (
    <footer className={`bg-black text-white w-full p-17 ${montserrat.className}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
        {/* Logo Section with Image */}
        <div className="mb-6 md:mb-0">
          <Link href="/">
            <div className="relative h-18 w-34">
              <Image 
                src="/Aakarlogo.png" 
                alt="AAKAR 2025 Logo" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Link>
        </div>

        {/* Contact Us Section */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-lg font-medium mb-3">Contact us</h3>
          <Link href="mailto:akar2025@example.com" className="block text-gray-400 hover:text-white mb-2">
          ✉️ akar2025@example.com
          </Link>
          <p className="text-gray-400">📞+9999999999</p>
        </div>

        {/* Legal Section */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-lg font-medium mb-3">Legal</h3>
          <Link href="/privacy-policy" className="block text-gray-400 hover:text-white mb-2">
            Privacy policy
          </Link>
          <Link href="/terms-and-conditions" className="block text-gray-400 hover:text-white">
            Terms and condition
          </Link>
        </div>

        {/* Address Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Address</h3>
          <p className="text-gray-400">
          NH-66, Kottara Chowki,<br />
          Mangaluru, Karnataka <br />
          PIN: 575006
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;