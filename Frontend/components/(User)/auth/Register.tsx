"use client";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
    const [selectedEvent, setSelectedEvent] = useState<string>("");

    const events: string[] = ["Technical Fest", "Cultural Fest", "Sports Meet", "Seminar"];

    
    const [selectedCollege, setSelectedCollege] = useState<string>("");
    // College List
    const colleges: string[] = [
        "ACS College of Engineering, Bangalore",
        "A J Institute of Engineering and Technology, Mangalore",
        "Alva's Institute of Engineering and Technology, Moodbidri",
        "Bearys Institute of Technology, Mangalore",
        "B L D E A's V P Dr P G Halakatti College of Engineering and Technology, Bijapur",
        "BMS Institute of Technology and Management, Bangalore",
        "Cambridge Institute of Technology, Bangalore",
        "Canara Engineering College (CE), Mangalore",
        "City College, Mangalore",
        "Dayananda Sagar College of Engineering, Bangalore",
        "Dr Ambedkar Institute of Technology",
        "Dr M V Shetty Institute of Technology",
        "National Institute of Technology Karnataka (NITK), Surathkal",
        "St Joseph Engineering College, Vamanjoor",
        "Vemana Institute of Technology",
        "Yenepoya Institute of Technology (YIT), Moodbidri"
    ];

    return (
        <div className="flex items-center justify-center min-h-screen px-4 md:px-8 py-8 md:py-12 relative">
            <div className="flex flex-col   bg-white w-200 p-6 rounded shadow-md">
                <h2 className="text-black text-lg font-semibold mb-4 flex justify-center">Register</h2>
                <p className="text-gray-600 text-md mb-4 flex justify-end">Already have an account?&nbsp; 
                    <Link href="/login" className="underline text-black"> Login</Link>
                </p>
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="name" className="text-gray-700 w-3xs whitespace-nowrap ">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500 "
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="email" className="text-gray-700 w-3xs ">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="password" className="text-gray-700 w-3xs">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="phone" className="text-gray-700 w-3xs whitespace-nowrap">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Enter your phone number"
                            className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="event" className="text-gray-700 w-3xs whitespace-nowrap">Select Event</label>
                        <select
                            id="event"
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                        >
                            <option value="" className="cursor-pointer">--Select an event--</option>
                            {events.map((event) => (
                                <option key={event} value={event} className="cursor-pointer" >
                                    {event}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                <label htmlFor="college" className="text-gray-700 w-3xs whitespace-nowrap">College Name</label>
                <select
                    id="college"
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full md:w-1xl focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                >
                    <option value="">--Select your college--</option>
                    {colleges.map((college) => (
                        <option key={college} value={college}>
                            {college}
                        </option>
                    ))}
                </select>
            </div>
                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="class" className="text-gray-700 w-3xs">Year</label>
                        <input
                            type="text"
                            id="year"
                            placeholder="Enter the year of study"
                            className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="department" className="text-gray-700 w-3xs whitespace-nowrap">Department</label>
                        <input
                            type="text"
                            id="department"
                            placeholder="Enter your department"
                            className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="usn" className="text-gray-700 w-3xs whitespace-nowrap">USN</label>
                        <input
                            type="text"
                            id="usn"
                            placeholder="Enter your USN"
                            className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-row justify-center gap-4">
                        <button className="bg-pink-800 text-white py-2 px-4 rounded-full hover:bg-pink-700 cursor-pointer">
                            Register
                        </button>
                    </div>
                </form>
            </div>
            <div className="h-96 w-64  bg-transparent absolute bottom-0 left-0 hidden md:block">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/register-ch.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat" }}></div>
            </div>
        </div>
    );
};




   

    
            
   
export default Register;