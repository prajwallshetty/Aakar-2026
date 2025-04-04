"use client";

import Link from "next/link";
import { useState } from "react";
import Select from "react-select";
import { GroupBase, OptionsOrGroups } from "react-select";

const Register = () => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  const events: OptionsOrGroups<{ value: string; label: string }, GroupBase<{ value: string; label: string }>> = [
    {
      label: "Event Categories",
      options: [
        { value: "technical_fest", label: "Technical Fest" },
        { value: "cultural_fest", label: "Cultural Fest" },
        { value: "sports_meet", label: "Sports Meet" },
        { value: "seminar", label: "Seminar" },
      ],
    },
  ];
  const handleSelectChange = (selectedOptions: any) => {
    setSelectedEvents(selectedOptions || []);
  };




  const [selectedCollege, setSelectedCollege] = useState<string>("");
  // College List
  const colleges: string[] = [
    "A J Institute of Engineering and Technology, Mangalore",
    "Alva's Ayurveda Medical College, Moodbidri",
    "Alva's Homoeopathic Medical College, Moodbidri",
    "Alva's Institute of Engineering Technology, Moodbidri",
    "Alvas College of Nursing, Moodbidri",
    "Aloysius MBA, Mangalore",
    "Canara Engineering College, Mangalore",
    "Carmel Degree College, Modankap, BC Road",
    "College of Fisheries, Mangalore",
    "Dr G Shankar Government Women's First Grade College & PG Study Centre, Ajjarkadu, Udupi",
    "Govt. First Grade College, Kaup",
    "Government Girls Degree College, Brahmagiri, Udupi",
    "Govinda Dasa College, Surathkal",
    "GTTC Baikampady, Mangalore",
    "Karavali Ayurveda and Medical Research, Mangalore",
    "Karavali College of Hotel Management",
    "Karavali College of Nursing Science",
    "Karavali College of Pharmacy, Mangalore",
    "Karavali College of Pharmacy, Vamanjoor, Mangalore",
    "Karavali College of Physiotherapy",
    "Karavali Institute of Technology, Mangalore",
    "Karavali Institute of Technology, Moodbidri",
    "KMC, Manipal",
    "Mahatma Gandhi Memorial (MGM) College, Udupi",
    "MIT Hotel Management",
    "MIT Manipal",
    "MITE - Mangalore Institute of Technology & Engineering",
    "Moodlakatte Institute of Technology, Kundapur",
    "N.M.A.M. Institute of Technology, Nitte, Karkala",
    "NITK, Surathkal",
    "Nitte Institute of Pharmacy",
    "Padua College, Mangaluru",
    "Padu Thirupathi Degree College, Karkala",
    "Poornaprajna College, Udupi",
    "Pompeii College, Aikala",
    "Sahyadri College of Engineering and Management",
    "SDM College of Engineering and Technology (SDMC)",
    "SDM Polytechnic, Ujire",
    "SDPT First Grade College, Kateel",
    "Shirdi Sai Degree College, Karkala",
    "Shri Madhwa Vadiraja Institute of Technology & Management, Bantakal",
    "Sri Bhuvanendra College, Karkala",
    "Sri Devi Institute of Technology, Kenjara, Bajpe",
    "Sri Mahaveera College, Kodangallu, Moodbidri",
    "Sri Taralabalu Jagadguru Institute of Technology",
    "Srinivas Institute of Engineering and Technology, Mukka",
    "Srinivas Institute of Medical Sciences and Research Center, Mukka",
    "St Joseph Engineering College, Vamanjoor, Mangaluru",
    "St. Raymond's Degree College, Vamanjoor, Kudupu, Karnataka",
    "Sumedha Fashion Institute, Karkala",
    "S NM Polytechnic, Moodbidri",
    "Udupi Group of Institutions",
    "Upendra Pai Memorial College (UPMC), Kunjebettu, Udupi",
  ];

  return (
    <div className="flex items-center justify-center min-h-screen px-4 md:px-8 py-8 md:py-12 relative">
      <div className="flex flex-col   bg-white w-200 p-6 rounded shadow-md">
        <h2 className="text-black text-lg font-semibold mb-4 flex justify-center">
          Register
        </h2>
        <p className="text-gray-600 text-md mb-4 flex justify-end">
          Already have an account?&nbsp;
          <Link href="/login" className="underline text-black">
            {" "}
            Login
          </Link>
        </p>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-1">
            <label
              htmlFor="name"
              className="text-gray-700 w-3xs whitespace-nowrap "
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500 "
            />
          </div>

          <div className="flex flex-col md:flex-row gap-1">
            <label htmlFor="email" className="text-gray-700 w-3xs ">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-1">
            <label htmlFor="password" className="text-gray-700 w-3xs">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-1">
            <label
              htmlFor="phone"
              className="text-gray-700 w-3xs whitespace-nowrap"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-1">
            <label
              htmlFor="event"
              className="text-gray-700 w-3xs whitespace-nowrap"
            >
              Select Event
            </label>
            <Select
            id="events"
            instanceId="events-select" // ✅ Ensures stable SSR hydration
            options={events}
            isMulti
            value={selectedEvents}
            onChange={handleSelectChange} // ✅ Correct function handling
            placeholder="Select event(s)..."
            className="border border-gray-300 rounded w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          />


          </div>
          <div className="flex flex-col md:flex-row gap-1">
            <label
              htmlFor="college"
              className="text-gray-700 w-3xs whitespace-nowrap"
            >
              College Name
            </label>
            <input
              type="text"
              id="college"
              list="collegeList"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              placeholder="Search or enter your college"
              className="border border-gray-300 rounded p-2 w-full md:w-1xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <datalist id="collegeList">
              {colleges.map((college) => (
                <option key={college} value={college} className="cursor-pointer" >
                  {college}
                </option>
              ))}
            </datalist>
          </div>

          <div className="flex flex-col md:flex-row gap-1">
            <label htmlFor="class" className="text-gray-700 w-3xs">
              Year
            </label>
            <input
              type="text"
              id="year"
              placeholder="Enter the year of study"
              className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-1">
            <label
              htmlFor="department"
              className="text-gray-700 w-3xs whitespace-nowrap"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              placeholder="Enter your department"
              className="border border-gray-300 rounded p-2 w-full md:w-3xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-1">
            <label
              htmlFor="usn"
              className="text-gray-700 w-3xs whitespace-nowrap"
            >
              USN
            </label>
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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/register-ch.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Register;


