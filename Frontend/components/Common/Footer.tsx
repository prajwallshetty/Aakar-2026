'use client';

import Link from 'next/link';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
})

const Footer = () => {
  return (
    <section className={`bg-black text-white py-10 px-5 ${montserrat.className}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-medium mb-4">Explore</h4>
          <ul className="space-y-2">
            <li><Link href='/' className="text-gray-400 hover:text-white">Home</Link></li>
            <li><Link href='/events' className="text-gray-400 hover:text-white">Events</Link></li>
            <li><Link href='/about' className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href='/contact' className="text-gray-400 hover:text-white">Contact Us</Link></li>
            <li><Link href='/team' className="text-gray-400 hover:text-white">Our Team</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Contact Us</h4>
          <ul className="space-y-2">
            <li>
              <a href="https://www.instagram.com/aakar_25" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center">
                <i className="fa-brands fa-instagram mr-2"></i> aakar_25
              </a>
            </li>
            <li>
              <a href="tel:+919741152696" className="text-gray-400 hover:text-white flex items-center">
                <i className="fa-solid fa-phone mr-2"></i> +91 628759863
              </a>
            </li>
            <li>
              <a href="mailto:aakaar@gmail.com" className="text-gray-400 hover:text-white flex items-center">
                <i className="fa-solid fa-envelope mr-2"></i> aakar@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Address</h4>
          <p className="text-gray-400 max-w-xs">
            NH66, Kottara Chowki, Mangaluru,
            Karnataka - 575006
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
