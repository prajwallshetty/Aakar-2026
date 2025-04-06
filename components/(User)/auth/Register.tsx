"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Select from "react-select";
import { GroupBase, OptionsOrGroups } from "react-select";
import { createParticipant } from "@/backend/participant";
import { useRouter } from "next/navigation";
import { signIn } from "@/auth";
import { getEventOptions } from "@/backend/events";
import { Skeleton } from "@/components/ui/skeleton";

const Register = () => {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formErrors, setFormErrors] = useState<{
        [key: string]: string | undefined;
    }>({});
    const [generalError, setGeneralError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        college: "",
        year: "",
        department: "",
        usn: "",
    });

    const [selectedEvents, setSelectedEvents] = useState<
        { value: string; label: string }[]
    >([]);
    const [events, setEvents] = useState<
        OptionsOrGroups<
            { value: string; label: string },
            GroupBase<{ value: string; label: string }>
        >
    >([]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));

        if (formErrors[id]) {
            setFormErrors((prev) => ({
                ...prev,
                [id]: undefined,
            }));
        }
    };
  
    const handleSelectChange = (selectedOptions: any) => {
        setSelectedEvents(selectedOptions || []);
    };

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

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsRegistering(true);
        setFormErrors({});
        setGeneralError("");

        try {
            // Extract events from the selected options
            const events = selectedEvents.map((event) => parseInt(event.value));

            // Create the participant data object
            const participantData = {
                ...formData,
                events,
            };

            // Call your backend function to create the participant
            const { data, error } = await createParticipant(participantData);

            if (error) {
                setIsRegistering(false);

                // Handle different error formats
                if (typeof error === "object") {
                    // Field-specific errors
                    setFormErrors(error);
                } else {
                    // General error message
                    setGeneralError(error);
                }
                return;
            }

            // After successful registration, sign in the user
            const signInResult = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.error) {
                setGeneralError(
                    "Registration successful, but there was an issue signing in. Please try logging in."
                );
                router.push("/login");
            } else {
                // Successful registration and login
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            setGeneralError(
                "Something went wrong during registration. Please try again."
            );
            console.error("Registration error:", error);
            setIsRegistering(false);
        }
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const events = await getEventOptions();
            setEvents(events);
            setIsLoading(false);
        })();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4 md:px-8 py-8 md:py-12 relative">
                <div className="flex flex-col bg-white w-200 p-6 rounded shadow-md space-y-4">
                    <Skeleton className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></Skeleton>

                    <Skeleton className="h-4 bg-gray-200 rounded w-2/3 self-end mb-2"></Skeleton>

                    {[...Array(9)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row gap-1"
                        >
                            <Skeleton className="bg-gray-200 h-5 w-32 rounded"></Skeleton>
                            <div className="w-full">
                                <Skeleton className="h-10 bg-gray-200 rounded"></Skeleton>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-center">
                        <Skeleton className="h-10 w-32 bg-gray-300 rounded-full"></Skeleton>
                    </div>
                </div>

                <div className="h-96 w-64 bg-transparent absolute bottom-0 left-0 hidden md:block">
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
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 md:px-8 py-8 md:py-12 relative">
            <div className="flex flex-col bg-white w-200 p-6 rounded shadow-md">
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

                {generalError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {generalError}
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-1">
                        <label
                            htmlFor="name"
                            className="text-gray-700 w-3xs whitespace-nowrap"
                        >
                            Full Name
                        </label>
                        <div className="w-full">
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className={`border ${
                                    formErrors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="email" className="text-gray-700 w-3xs">
                            Email
                        </label>
                        <div className="w-full">
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className={`border ${
                                    formErrors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label
                            htmlFor="password"
                            className="text-gray-700 w-3xs"
                        >
                            Password
                        </label>
                        <div className="w-full">
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className={`border ${
                                    formErrors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                            {formErrors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label
                            htmlFor="phone"
                            className="text-gray-700 w-3xs whitespace-nowrap"
                        >
                            Phone Number
                        </label>
                        <div className="w-full">
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                                className={`border ${
                                    formErrors.phone
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                            {formErrors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label
                            htmlFor="event"
                            className="text-gray-700 w-3xs whitespace-nowrap"
                        >
                            Select Event
                        </label>
                        <div className="w-full">
                            <Select
                                id="events"
                                instanceId="events-select"
                                options={events}
                                isMulti
                                value={selectedEvents}
                                onChange={handleSelectChange}
                                placeholder="Select event(s)..."
                                className={`${
                                    formErrors.events ? "border-red-500" : ""
                                } w-full`}
                                classNamePrefix="select"
                            />
                            {formErrors.events && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.events}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label
                            htmlFor="college"
                            className="text-gray-700 w-3xs whitespace-nowrap"
                        >
                            College Name
                        </label>
                        <div className="w-full">
                            <input
                                type="text"
                                id="college"
                                list="collegeList"
                                value={formData.college}
                                onChange={handleChange}
                                placeholder="Search or enter your college"
                                required
                                className={`border ${
                                    formErrors.college
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded p-2 w-full md:w-1xl focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                            {formErrors.college && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.college}
                                </p>
                            )}
                            <datalist id="collegeList">
                                {colleges.map((college) => (
                                    <option
                                        key={college}
                                        value={college}
                                        className="cursor-pointer"
                                    >
                                        {college}
                                    </option>
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label htmlFor="year" className="text-gray-700 w-3xs">
                            Year
                        </label>
                        <div className="w-full">
                            <input
                                type="text"
                                id="year"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="Enter the year of study"
                                required
                                className={`border ${
                                    formErrors.year
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                            {formErrors.year && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.year}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label
                            htmlFor="department"
                            className="text-gray-700 w-3xs whitespace-nowrap"
                        >
                            Department
                        </label>
                        <div className="w-full">
                            <input
                                type="text"
                                id="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="Enter your department"
                                required
                                className={`border ${
                                    formErrors.department
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                            {formErrors.department && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.department}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-1">
                        <label
                            htmlFor="usn"
                            className="text-gray-700 w-3xs whitespace-nowrap"
                        >
                            USN
                        </label>
                        <div className="w-full">
                            <input
                                type="text"
                                id="usn"
                                value={formData.usn}
                                onChange={handleChange}
                                placeholder="Enter your USN"
                                required
                                className={`border ${
                                    formErrors.usn
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                            {formErrors.usn && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.usn}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row justify-center gap-4">
                        <button
                            type="submit"
                            disabled={isRegistering}
                            className="bg-pink-800 text-white py-2 px-4 rounded-full hover:bg-pink-700 cursor-pointer disabled:opacity-70"
                        >
                            {isRegistering ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="h-96 w-64 bg-transparent absolute bottom-0 left-0 hidden md:block">
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
