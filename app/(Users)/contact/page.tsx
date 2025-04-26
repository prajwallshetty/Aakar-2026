import React from 'react';
import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';

const montserrat = Montserrat({
    weight: '600',
    subsets: ['latin'],
});

const ContactPage = () => {
    return (
        <div className="min-h-screen px-6 py-10 text-white">
            <div className="max-w-5xl mx-auto space-y-10">
                <h1 className="text-4xl font-bold text-center">Contact Us</h1>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">General Info</h2>
                    <div className="space-y-2">
                        <p className={`flex items-center gap-2 ${montserrat.className}`}><FaEnvelope /> <Link href="mailto:aakar2025@ajiet.edu.in" className="text-blue-400">aakar2025@ajiet.edu.in</Link></p>
                        <p className={`flex items-center gap-2 ${montserrat.className}`}><FaPhone /> <Link href="tel:+919611829800" className="text-blue-400">+91 96118 29800</Link></p>
                        <p className={`flex items-center gap-2 ${montserrat.className}`}><FaInstagram /> <Link href="https://www.instagram.com/aakar__2025/" target="_blank" rel="noopener noreferrer" className="text-blue-400">@aakar_25</Link></p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">College Address</h2>
                    <div className="flex items-start gap-3">
                        <FaMapMarkerAlt size={20} />
                        <div className={`${montserrat.className} text-gray-300`}>
                            <p>AJ Institute of Engineering and Technology</p>
                            <p>NH66, Kottara Chowki, Mangaluru, Karnataka - 575006</p>
                            <p className="mt-1"><FaPhone className="inline mr-2" /> <a href="tel:+918242224477" className="text-blue-400">+91 824 222 4477</a></p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Find Us on Map</h2>
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.963363458579!2d74.82941331519004!3d12.91579839089306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35b1e29f2d89b%3A0x2d662ae00671be23!2sAJ%20Institute%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1700000000000"
                            width="100%"
                            height="400"
                            className="rounded-xl border-2 border-white"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;