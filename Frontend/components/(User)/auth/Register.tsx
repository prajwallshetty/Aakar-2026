"use client";

import { useState } from "react";

const Register = () => {
    const [selectedEvent, setSelectedEvent] = useState<string>("");

    const events: string[] = ["Technical Fest", "Cultural Fest", "Sports Meet", "Seminar"];

    return (
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-8 relative">
            <div className="flex flex-col   bg-white w-200 p-6 rounded shadow-md">
                <h2 className="text-black text-lg font-semibold mb-4">Register</h2>
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="name" className="text-gray-700 w-3xs whitespace-nowrap ">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500 "
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="email" className="text-gray-700 w-3xs ">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="password" className="text-gray-700 w-3xs">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="phone" className="text-gray-700 w-3xs whitespace-nowrap">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Enter your phone number"
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="event" className="text-gray-700 w-3xs whitespace-nowrap">Select Event</label>
                        <select
                            id="event"
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">Select an event</option>
                            {events.map((event) => (
                                <option key={event} value={event}>
                                    {event}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="college" className="text-gray-700 w-3xs whitespace-nowrap">College Name</label>
                        <input
                            type="text"
                            id="college"
                            placeholder="Enter your college name"
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="class" className="text-gray-700 w-3xs">Class</label>
                        <input
                            type="text"
                            id="class"
                            placeholder="Enter your class"
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="department" className="text-gray-700 w-3xs whitespace-nowrap">Department</label>
                        <input
                            type="text"
                            id="department"
                            placeholder="Enter your department"
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1">
                        <label htmlFor="registerNumber" className="text-gray-700 w-3xs whitespace-nowrap">Register Number</label>
                        <input
                            type="text"
                            id="registerNumber"
                            placeholder="Enter your register number"
                            className="border border-gray-300 rounded p-2 w-full sm:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-row justify-center gap-4">
                        <button className="bg-pink-800 text-white py-2 px-4 rounded-full hover:bg-pink-700">
                            Register
                        </button>
                    </div>
                </form>
            </div>
            <div className="h-96 w-64  bg-transparent absolute bottom-0 left-0 hidden sm:block">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/register-ch.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat" }}></div>
            </div>
        </div>
    );
};

export default Register;