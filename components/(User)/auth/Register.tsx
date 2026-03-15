"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
    registerParticipant,
    validateParticipantData,
} from "@/backend/participant";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { getAllEvents, getEventOptions } from "@/backend/events";
import {
    CartEvents,
    ExtendedEvent,
    ExtendedParticipantCreateInput,
} from "@/types";
import { eventType } from "@prisma/client";
import { uploadFile } from "@/backend/supabase";
import PopArtBackground from "@/components/(User)/PopArtBackground";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
    yellow: "#ffff00",
    magenta: "#ff00ff",
    cyan: "#00ffff",
    pink: "#ff0066",
    black: "#000",
    white: "#fff",
};
const popFont = "'Arial Black', Impact, sans-serif";
const monoFont = "'Courier New', 'Space Mono', monospace";
const displayFont = "'Bebas Neue', Impact, sans-serif";

// ─── Style helpers ────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
    background: C.white,
    border: `3px solid ${C.black}`,
    boxShadow: `6px 6px 0 ${C.black}`,
    borderRadius: 0,
};

const sectionHeaderStyle = (bg: string): React.CSSProperties => ({
    background: bg,
    border: `3px solid ${C.black}`,
    boxShadow: `4px 4px 0 ${C.black}`,
    padding: "6px 18px",
    fontFamily: popFont,
    fontSize: 12, fontWeight: 900,
    letterSpacing: 4,
    textTransform: "uppercase" as const,
    color: C.black,
    display: "inline-block",
    marginBottom: 16,
});

const labelStyle: React.CSSProperties = {
    fontFamily: monoFont, fontSize: 10, fontWeight: 700,
    letterSpacing: 3, textTransform: "uppercase" as const,
    color: C.black, marginBottom: 4, display: "block",
};

const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: `3px solid ${C.black}`, borderRadius: 0,
    boxShadow: `3px 3px 0 ${C.black}`,
    fontFamily: monoFont, fontSize: 13,
    background: C.white, color: C.black,
    outline: "none", transition: "box-shadow 0.1s",
    appearance: "none" as const,
};

const inputError: React.CSSProperties = {
    ...inputBase,
    border: `3px solid ${C.pink}`,
    boxShadow: `3px 3px 0 ${C.pink}`,
};

const errorMsg: React.CSSProperties = {
    fontFamily: monoFont, fontSize: 10, fontWeight: 700,
    color: C.pink, letterSpacing: 1, marginTop: 3,
    display: "flex", alignItems: "center", gap: 4,
};

// ─── Inline background functions removed in favor of unified PopArtBackground

// ─── Pop-Art Button ───────────────────────────────────────────────────────────
const PopButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
    bg?: string;
    fg?: string;
}> = ({ children, onClick, type = "button", disabled, bg = C.pink, fg = C.white }) => {
    const [hov, setHov] = useState(false);
    return (
        <button type={type} onClick={onClick} disabled={disabled}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: disabled ? "#ccc" : bg,
                color: disabled ? "#888" : fg,
                border: `3px solid ${C.black}`,
                boxShadow: hov && !disabled ? "0 0 0 #000" : `5px 5px 0 ${C.black}`,
                fontFamily: popFont, fontSize: 12, fontWeight: 900,
                letterSpacing: 3, textTransform: "uppercase" as const,
                padding: "12px 28px",
                cursor: disabled ? "not-allowed" : "pointer",
                transform: hov && !disabled ? "translate(3px,3px)" : "none",
                transition: "transform 0.1s, box-shadow 0.1s",
                display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
            }}>
            {children}
        </button>
    );
};

// ─── Step indicator ───────────────────────────────────────────────────────────
const StepPill: React.FC<{ label: string; num: number; active: boolean; done: boolean }> = ({ label, num, active, done }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{
            width: 40, height: 40,
            background: done ? C.cyan : active ? C.yellow : "#eee",
            border: `3px solid ${C.black}`,
            boxShadow: active ? `3px 3px 0 ${C.black}` : "none",
            fontFamily: popFont, fontSize: 16, fontWeight: 900, color: C.black,
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: active ? "rotate(-4deg)" : "none",
        }}>
            {done ? "✓" : num}
        </div>
        <span style={{ fontFamily: monoFont, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: C.black }}>
            {label}
        </span>
    </div>
);

const StepConnector: React.FC<{ done: boolean }> = ({ done }) => (
    <div style={{ flex: 1, height: 3, marginBottom: 18, borderTop: `3px dashed ${done ? C.cyan : C.black}` }} />
);

// ─── Section card ─────────────────────────────────────────────────────────────
const SectionCard: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
    <div style={{ ...cardStyle, padding: 24, marginBottom: 20 }}>
        <div style={sectionHeaderStyle(color)}>{title}</div>
        {children}
    </div>
);

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 4 }}>
        <label style={labelStyle}>{label}</label>
        {children}
        {error && <span style={errorMsg}>⚡ {error}</span>}
    </div>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <PopArtBackground />
            <div style={{ ...cardStyle, padding: 32, width: "min(600px,90vw)", background: C.white, position: "relative", zIndex: 1 }}>
                <div style={{ background: C.magenta, height: 8, border: `3px solid ${C.black}`, marginBottom: 24 }} />
                <div style={sectionHeaderStyle(C.yellow)}>Loading Events…</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ height: 10, width: "35%", background: "#eee", border: `2px solid ${C.black}` }} />
                            <div style={{ height: 38, background: "#f5f5f5", border: `3px solid ${C.black}`, boxShadow: `3px 3px 0 ${C.black}` }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const Register = () => {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string | undefined }>({});
    const [generalError, setGeneralError] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrImageUrl, setQrImageUrl] = useState("");
    const [paymentStep, setPaymentStep] = useState<"details" | "payment" | "verification">("details");

    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", college: "",
        year: 0, department: "", usn: "",
        transactionId: "", paymentScreenshot: null as File | null,
    });

    const [cartEvents, setCartEvents] = useState<CartEvents>([]);
    const [eventOptions, setEventOptions] = useState<Awaited<ReturnType<typeof getEventOptions>>>([]);
    const [events, setEvents] = useState<ExtendedEvent[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<{ value: string; label: string; type: eventType; id: number }[]>([]);
    const [groupEventData, setGroupEventData] = useState<{
        [groupId: string]: { participantCount: number; members: { name: string; usn: string; email: string }[] };
    }>({});

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const eventOptionsData = await getEventOptions();
                const eventsData = await getAllEvents();
                setEventOptions(eventOptionsData);
                setEvents(eventsData);
                const cartData = localStorage.getItem("eventCart");
                if (cartData) {
                    const cartEventsLocal = JSON.parse(cartData) as CartEvents;
                    setCartEvents(cartEventsLocal);
                    cartEventsLocal.forEach((eventId) => {
                        const eventObj = eventsData.find((e) => e.id === eventId);
                        if (!eventObj) return;
                        setSelectedEvents((prev) => {
                            if (prev.find((e) => e.id === eventId)) return prev;
                            return [...prev, { value: eventId.toString(), label: eventObj.eventName, type: eventObj.eventType, id: eventObj.id }];
                        });
                    });
                } else { setCartEvents([]); }
            } catch (error) {
                console.error("Error fetching events:", error);
                setCartEvents([]);
            }
            setIsLoading(false);
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === "year" ? parseInt(value) : id === "usn" ? value.toUpperCase() : value,
        }));
        if (formErrors[id]) setFormErrors((prev) => ({ ...prev, [id]: undefined }));
    };

    const handleEventSelection = (selectedOptions: any) => {
        setSelectedEvents(selectedOptions);
        const selectedEventIds = selectedOptions.map((o: any) => o.id);
        const newGroupData = { ...groupEventData };
        selectedOptions.forEach((event: (typeof selectedEvents)[number]) => {
            const eventObj = events.find((e) => e.id === event.id);
            if (eventObj && eventObj.eventType === "Team" && !newGroupData[event.id]) {
                newGroupData[event.id] = {
                    participantCount: eventObj.minMembers - 1,
                    members: Array.from({ length: eventObj.minMembers - 1 }, () => ({ name: "", usn: "", email: "" })),
                };
            }
        });
        Object.keys(newGroupData).forEach((groupId) => {
            if (!selectedEventIds.includes(Number(groupId))) delete newGroupData[groupId];
        });
        setGroupEventData(newGroupData);
        setTotalAmount(selectedOptions.reduce((sum: number, event: any) => {
            const eventObj = events.find((e) => e.id === event.id);
            return sum + (eventObj?.fee || 0);
        }, 0));
    };

    const handleParticipantCountChange = (groupId: string | number, count: number | "") => {
        const currentMembers = groupEventData[groupId]?.members || [];
        const newCount = !count ? "" : Math.max(1, count);
        if (!newCount) return setGroupEventData((prev) => ({ ...prev, [groupId]: { participantCount: 0, members: [] } }));
        let newMembers = [...currentMembers];
        if (newCount > currentMembers.length) {
            for (let i = currentMembers.length; i < newCount; i++) newMembers.push({ name: "", usn: "", email: "" });
        } else if (newCount < currentMembers.length) {
            newMembers = newMembers.slice(0, newCount);
        }
        setGroupEventData((prev) => ({ ...prev, [groupId]: { participantCount: newCount, members: newMembers } }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0])
            setFormData((prev) => ({ ...prev, paymentScreenshot: e.target.files![0] }));
    };

    const handleGroupMemberChange = (groupId: number | string, index: number, field: string, value: string) => {
        setGroupEventData((prev) => {
            const updatedMembers = [...(prev[groupId]?.members || [])];
            updatedMembers[index] = { ...updatedMembers[index], [field]: value };
            return { ...prev, [groupId]: { ...prev[groupId], members: updatedMembers } };
        });
    };

    const generateQRCode = () => {
        const amount = selectedEvents.length > 0
            ? events.filter((e) => selectedEvents.find((s) => s.id === e.id)).reduce((sum, e) => sum + (e.fee || 0), 0)
            : 0;
        setTotalAmount(amount);
        const upiUrl = `upi://pay?pa=${encodeURIComponent("ajiet@cnrb")}&pn=${encodeURIComponent("Aakar 2025 Registration")}&am=${amount}&cu=INR&tn=${encodeURIComponent("Aakar 2025 Registration")}`;
        setQrImageUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`);
        setShowQRCode(true);
    };

    const proceedToPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = (await validateParticipantData(formData)) || {};
        if (Object.keys(errors).length > 0) { setFormErrors(errors); alert("Check for the errors in the form."); return; }
        if (selectedEvents.length === 0) errors.events = "Please select at least one event";
        Object.keys(groupEventData).forEach((groupId) => {
            if (selectedEvents.find((e) => e.value === groupId || e.id === parseInt(groupId))) {
                groupEventData[groupId].members.forEach((member, index) => {
                    if (!member.name) errors[`group_${groupId}_member_${index}_name`] = "Member name is required";
                    if (!member.usn) errors[`group_${groupId}_member_${index}_usn`] = "Member USN is required";
                    if (!member.email) errors[`group_${groupId}_member_${index}_email`] = "Member Email is required";
                });
            }
        });
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
        setPaymentStep("payment");
        generateQRCode();
    };

    const proceedToVerification = () => {
        if (!formData.transactionId) { setFormErrors({ transactionId: "Transaction ID is required" }); return; }
        if (!formData.paymentScreenshot) { setFormErrors({ paymentScreenshot: "Payment screenshot is required" }); return; }
        setPaymentStep("verification");
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsRegistering(true);
        setFormErrors({});
        setGeneralError("");

        try {
            // upload screenshot first
            const fileUrl = await uploadFile(
                formData.paymentScreenshot!,
                "paymentscreenshots"
            );

            if (!fileUrl) {
                setIsRegistering(false);
                setGeneralError("Payment screenshot upload failed.");
                return;
            }

            const participantData: ExtendedParticipantCreateInput = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                college: formData.college,
                year: formData.year,
                department: formData.department,
                usn: formData.usn.toUpperCase(),
                transaction_ids: [formData.transactionId],
                paymentScreenshotUrls: [fileUrl],
                groupMembersData: groupEventData,
                amount: totalAmount,
            };

            const result = await registerParticipant(
                participantData,
                selectedEvents.map((e) => e.id)
            );

            if (!result || result.error) {
                setIsRegistering(false);

                if (typeof result?.error === "object" && result.error !== null) {
                    setFormErrors(result.error);
                } else {
                    setGeneralError(result?.error || "Registration failed.");
                }

                return;
            }

            // success
            setIsRegistering(false);

            // redirect to success page
            setTimeout(() => {
                router.replace("/registration-success");
            }, 200);

        } catch (error) {
            console.error("Registration error:", error);
            setIsRegistering(false);
            setGeneralError("Something went wrong. Please try again.");
        }
    };
    const colleges = [...[
        "A J Institute of Engineering and Technology, Mangalore", "Alva's Ayurveda Medical College, Moodbidri", "Srinivas institute of technology, valachill", "Alva's Homoeopathic Medical College, Moodbidri", "Alva's Institute of Engineering Technology, Moodbidri", "Alvas College of Nursing, Moodbidri", "The Oxford college of engineering", "Aloysius MBA, Mangalore", "Canara Engineering College, Mangalore", "Carmel Degree College, Modankap, BC Road", "St. Mary's College, Shirva", "adichunchanagiri institute of engineering, coorg", "CIT, chickmagalur", "Rajarajeshwari college Bangalore", "Shri Madhwa Vadiraja Institute of Technology and Management, Udupi", "Mahathma Gandhi Memorial (MGM) College, Udupi", "Vaikunta Baliga College of Law, Udupi", "Trisha Vidya College of Commerce and Management", "Upendra Pai Memorial College, Udupi", "Udupi Group of Institutions, Manipal", "Kasturba Medical College (KMC), Manipal", "Laxmi Memorial College of Nursing & Physiotherapy", "Manipal Institute of Technology, Manipal", "College of Fisheries, Mangalore", "Dr G Shankar Government Women's First Grade College & PG Study Centre, Ajjarkadu, Udupi", "Govt. First Grade College, Kaup", "Government Girls Degree College, Brahmagiri, Udupi", "Govinda Dasa College, Surathkal", "GTTC Baikampady, Mangalore", "Karavali Ayurveda and Medical Research, Mangalore", "Karavali College of Hotel Management", "Karavali College of Nursing Science", "Karavali College of Pharmacy, Mangalore", "Karavali College of Pharmacy, Vamanjoor, Mangalore", "Karavali College of Physiotherapy", "Karavali Institute of Technology, Mangalore", "Karavali Institute of Technology, Moodbidri", "KMC, Manipal", "Mahatma Gandhi Memorial (MGM) College, Udupi", "MIT Hotel Management", "MIT Manipal", "MITE - Mangalore Institute of Technology & Engineering", "Moodlakatte Institute of Technology, Kundapur", "N.M.A.M. Institute of Technology, Nitte, Karkala", "NITK, Surathkal", "Nitte Institute of Pharmacy", "Padua College, Mangaluru", "Padu Thirupathi Degree College, Karkala", "Poornaprajna College, Udupi", "Pompeii College, Aikala", "Sahyadri College of Engineering and Management", "SDM College of Engineering and Technology (SDMC)", "SDM Polytechnic, Ujire", "SDPT First Grade College, Kateel", "Shirdi Sai Degree College, Karkala", "Shri Madhwa Vadiraja Institute of Technology & Management, Bantakal", "Sri Bhuvanendra College, Karkala", "Sri Devi Institute of Technology, Kenjara, Bajpe", "Sri Mahaveera College, Kodangallu, Moodbidri", "Sri Taralabalu Jagadguru Institute of Technology", "Srinivas Institute of Engineering and Technology, Mukka", "Srinivas Institute of Medical Sciences and Research Center, Mukka", "St Joseph Engineering College, Vamanjoor, Mangaluru", "St. Raymond's Degree College, Vamanjoor, Kudupu, Karnataka", "Sumedha Fashion Institute, Karkala", "S NM Polytechnic, Moodbidri", "Udupi Group of Institutions", "Upendra Pai Memorial College (UPMC), Kunjebettu, Udupi", "Yenapoya Institute of Arts Science and Commerce", "Muniyal Ayurveda College", "Vaikunta Baliga College of Law, Kunjibettu", "Gandhinagar First Grade College", "Tejaswini Group of Institutions", "Mangala Group of Institutions", "PACE Mangalore", "Yenepoya School Of Engineering & Technology", "Bearys Institute of Technology", "Kanachur Institute of Medical Science", "NITTE Architecture", "NITTE Nursing", "St Mary's College, Shirva", "Ids college, Mangalore", "Canara Degree College", "St Agnes College(Autonomous). Bendur, Mangaluru", "Besant Women's College", "Shree Gokarnanatheshwara College", "Mahatma Gandhi Memorial College, Udupi", "Yenepoya Allied Science", "NITTE Institute of Communication", "Unity Academy of Education, Institute of Nursing, Ashok Nagar, Mangalore", "Trisha College of Commerce and Management, Alake Road, Kodailbail", "Narayana Guru School And College, Barke Road, Kudroli", "Athene Institute of Health Science", "Athena Institute of Nursing Science", "Indira Institute of Nursing Science", "Laxmi Memorial College of Nursing", "St. Aloysius", "Ramakrishna Degree College", "MAPS College", "NITTE MBA", "Moti Mahal", "Govt. JJJ College", "Dr. Dayananda Pai - P Sathisha Pai Govt. First Grade College, Car Street, Mangalore", "AJIM", "M. V. Shetty College of Physiotherapy, Mangalore", "Trisha College of Nursing, Mangalore", "Shree Devi Institute of Technology, Mangalore", "Manel Srinivas Nayak Institute of Management, Mangalore", "Yenepoya Institute of Technology (YIT), Moodbidri", "Sahyadri College of Nursing, Mangalore", "A.J. Institute of Management, Mangalore", "A.J. Institute of Dental Sciences, Mangalore", "A.J. Institute of Allied Health Sciences, Mangalore", "A.J. Institute of Medical Sciences, Mangalore", "Padua College of Commerce and Management, Mangalore", "A.J. Institute of Nursing, Mangalore", "A.J. Institute of Physiotherapy, Mangalore", "Yenepoya Degree College, Mangalore", "Shridevi Institute of Computer Sciences (BCA), Mangalore", "Shridevi College of Nursing, Mangalore", "Shridevi College of Commerce (B.Com), Mangalore", "SDM College of Business Management (MBA), Mangalore", "SDM Law College, Mangalore", "SDM PG College Ujire", "SDM Institute of Technology (SDMIT) Ujire", "Canara College (MCA Program), Mangalore", "Minerva College, Mangalore", "Srinivas Institute of Nursing Sciences, Mangalore", "Srinivas College of Pharmacy, Mangalore", "P.A. College of Engineering, Mangalore", "P.A. Polytechnic, Mangalore", "P.A. First Grade College, Mangalore", "Alva's College, Moodbidri", "Alva's College of Law, Moodbidri", "Alva's College of Naturopathy and Yogic Sciences, Moodbidri", "Canara Engineering College (CEC), Benjanapadavu", "Anugraha Women's College, Kalladka", "Sri Rama First Grade College, Kalladka", "Vivekananda Degree College, Puttur", "Vivekananda College of Engineering & Technology, Puttur", "St Philomena College, Puttur", "St Philomena PG and Research Centre, Puttur", "Akshaya College, Puttur", "Ambika First Grade College, Puttur", "KVG Ayurveda College, Sulya", "KVG College of Engineering, Sulya", "KVG Dental College, Sulya", "BGS Institute of Technology, Bangalore", "Shri Shirdi Sai Mandira College, Karkala", "Vijaya College, Mulki", "Srinivas Institute of Allied Health Sciences, Mangalore", "BGS Institute of Technology, Mangalore", "Acharya Institute of Technology, Bangalore", "Adi Shankara Institute of Engineering Technology, Kalady", "Amrita Vishwa Vidyapeetham, Coimbatore", "Angadi Institute of Technology, Belagavi", "Bangalore Institute of Technology, Bangalore", "BMS College of Engineering, Bangalore", "BMS Institute of Technology and Management, Bangalore", "BNM Institute of Technology, Bangalore", "CMR Institute of Technology, Bangalore", "Dayananda Sagar College of Engineering, Bangalore", "Dr. Ambedkar Institute of Technology, Bangalore", "East Point College of Engineering, Bangalore", "Global Academy of Technology, Bangalore", "Gogte Institute of Technology, Belagavi", "HKBK College of Engineering, Bangalore", "KS Institute of Technology, Bangalore", "KLE Technological University, Hubli", "LBS Institute of Technology for Women, Thiruvananthapuram", "M S Engineering College, Bangalore", "MS Ramaiah Institute of Technology, Bangalore", "New Horizon College of Engineering, Bangalore", "Nitte Meenakshi Institute of Technology, Bangalore", "PES College of Engineering, Mandya", "PES University, Bangalore", "Poojya Doddappa Appa College of Engineering, Kalaburagi", "RNS Institute of Technology, Bangalore", "RV College of Engineering, Bangalore", "Sir M Visvesvaraya Institute of Technology, Bangalore", "SJB Institute of Technology, Bangalore", "SNS College of Engineering, Coimbatore", "Sri Jayachamarajendra College of Engineering (SJCE), Mysore", "Sri Ramakrishna Engineering College, Coimbatore", "Vidyavardhaka College of Engineering, Mysore", "College of Engineering Chengannur", "College of Engineering Trivandrum", "Federal Institute of Science and Technology, Angamaly", "Government Engineering College Adoor", "Government Engineering College Alappuzha", "Government Engineering College Attingal", "Government Engineering College Barton Hill, Thiruvananthapuram", "Government Engineering College Chavara, Kollam", "Government Engineering College Ernakulam", "Government Engineering College Idukki", "Government Engineering College Kanhangad", "Government Engineering College Kannur", "Government Engineering College Karunagapally", "Government Engineering College Kasaragod", "Government Engineering College Kayamkulam", "Government Engineering College Kollam", "Government Engineering College Kottarakkara", "Government Engineering College Kottayam", "Government Engineering College Kozhikode", "Government Engineering College Kunnamkulam", "Government Engineering College Malappuram", "Yenepoya Homoeopathic Medical College and hospital", "Government Engineering College Mananthavady", "Government Engineering College Munnar", "Government Engineering College Painavu", "Government Engineering College Palakkad", "Government Engineering College Pathanamthitta", "Government Engineering College Payyannur", "Government Engineering College Sreekrishnapuram", "Government Engineering College Thalassery", "Government Engineering College Thiruvananthapuram", "Government Engineering College Thodupuzha", "Government Engineering College Thrissur", "Government Engineering College Vadakara", "Government Engineering College Vatakara", "Government Engineering College Wayanad", "Ilahia College of Engineering, Muvattupuzha", "Jyothi Engineering College, Thrissur", "Mar Baselios College of Engineering, Thiruvananthapuram", "Model Engineering College, Kochi", "Mohandas College of Engineering, Thiruvananthapuram", "Rajagiri School of Engineering and Technology, Kochi", "Saintgits College of Engineering, Kottayam", "Sree Buddha College of Engineering, Alappuzha", "TKM College of Engineering, Kollam", "Vidya Academy of Science and Technology, Thrissur", "Coimbatore Institute of Technology", "Garden City University, Bangalore", "Indian Institute of Science (IISc), Bangalore", "Jain University, Bangalore", "JSS Science and Technology University, Mysuru", "Karpagam College of Engineering, Coimbatore", "Karunya Institute of Technology and Sciences, Coimbatore", "Kumaraguru College of Technology, Coimbatore", "National Institute of Engineering (NIE), Mysuru", "PSG College of Technology, Coimbatore", "Reva University, Bangalore"
    ]].sort((a, b) => a.localeCompare(b));

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base, border: `3px solid ${C.black}`, borderRadius: 0,
            boxShadow: state.isFocused ? `3px 3px 0 ${C.cyan}` : `3px 3px 0 ${C.black}`,
            fontFamily: monoFont, fontSize: 13, minHeight: 44, background: C.white,
            "&:hover": { borderColor: C.black },
        }),
        menu: (base: any) => ({
            ...base, border: `3px solid ${C.black}`, borderRadius: 0,
            boxShadow: `5px 5px 0 ${C.black}`, fontFamily: monoFont, fontSize: 12,
        }),
        option: (base: any, state: any) => ({
            ...base,
            background: state.isSelected ? C.cyan : state.isFocused ? C.yellow : C.white,
            color: C.black, fontFamily: monoFont, fontSize: 12, cursor: "pointer",
        }),
        multiValue: (base: any) => ({
            ...base, background: C.magenta, border: `2px solid ${C.black}`, borderRadius: 0,
        }),
        multiValueLabel: (base: any) => ({ ...base, color: C.white, fontFamily: monoFont, fontSize: 11, fontWeight: 700 }),
        multiValueRemove: (base: any) => ({ ...base, color: C.white, "&:hover": { background: C.pink, color: C.white } }),
        groupHeading: (base: any) => ({
            ...base, fontFamily: popFont, fontSize: 10, letterSpacing: 3, color: C.black,
            background: C.yellow, borderBottom: `2px solid ${C.black}`, padding: "6px 12px",
        }),
    };

    if (isLoading) return <LoadingSkeleton />;

    const stepNum = paymentStep === "details" ? 1 : paymentStep === "payment" ? 2 : 3;

    return (
        <div style={{ minHeight: "100vh", position: "relative", padding: "32px 16px 80px" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }
                @keyframes floatShape {
                    from { transform: translateY(0) rotate(0deg); }
                    to   { transform: translateY(-14px) rotate(8deg); }
                }
                @keyframes wiggle {
                    from { transform: rotate(-3deg) scale(1); }
                    to   { transform: rotate(3deg) scale(1.06); }
                }
                @keyframes popIn {
                    0%   { transform: scale(0) rotate(-6deg); opacity: 0; }
                    70%  { transform: scale(1.04) rotate(1deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .pop-input:focus { box-shadow: 3px 3px 0 #ff00ff !important; border-color: #ff00ff !important; outline: none; }
                .pop-input::placeholder { color: #aaa; font-style: italic; }
                .pop-file-input { width:100%; padding:10px 12px; border:3px dashed #000; background:#ffff00; font-family:'Courier New',monospace; font-size:12px; cursor:pointer; }
                .pop-file-input:focus { outline:none; border-style:solid; border-color:#ff00ff; }
                .review-row { display:flex; gap:8px; padding:8px 0; border-bottom:2px dashed #000; font-family:'Courier New',monospace; font-size:13px; }
                .review-row:last-child { border-bottom:none; }
                .review-key { font-weight:700; letter-spacing:2px; text-transform:uppercase; font-size:10px; color:#000; min-width:110px; flex-shrink:0; }
            `}</style>

            <PopArtBackground />

            <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>

                {/* Header */}
                <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "popIn 0.7s cubic-bezier(.175,.885,.32,1.275) both" }}>
                    <div style={{
                        background: C.black, border: `4px solid ${C.black}`,
                        boxShadow: `8px 8px 0 ${C.magenta}, 12px 12px 0 ${C.cyan}`,
                        padding: "10px 36px",
                    }}>
                        <span style={{ fontFamily: displayFont, fontSize: "clamp(28px,5vw,56px)", letterSpacing: 8, color: C.yellow }}>
                            REGISTER
                        </span>
                    </div>

                </div>

                {/* Step indicator */}
                <div style={{ ...cardStyle, background: C.white, padding: "16px 28px", marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <StepPill label="Details" num={1} active={stepNum === 1} done={stepNum > 1} />
                        <StepConnector done={stepNum > 1} />
                        <StepPill label="Payment" num={2} active={stepNum === 2} done={stepNum > 2} />
                        <StepConnector done={stepNum > 2} />
                        <StepPill label="Confirm" num={3} active={stepNum === 3} done={false} />
                    </div>
                </div>

                {/* Error */}
                {generalError && (
                    <div style={{
                        background: C.pink, color: C.white,
                        border: `3px solid ${C.black}`, boxShadow: `5px 5px 0 ${C.black}`,
                        padding: "12px 20px", marginBottom: 20,
                        fontFamily: popFont, fontSize: 12, fontWeight: 900, letterSpacing: 2,
                    }}>
                        ⚡ {generalError}
                    </div>
                )}

                {/* ── STEP 1 ── */}
                {paymentStep === "details" && (
                    <form onSubmit={proceedToPayment} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        <SectionCard title="01 · Personal Info" color={C.cyan}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
                                {([
                                    { id: "name", label: "Full Name", placeholder: "Enter your full name", type: "text" },
                                    { id: "email", label: "Email Address", placeholder: "your@email.com", type: "email" },
                                    { id: "phone", label: "Phone Number", placeholder: "+91 XXXXXXXXXX", type: "tel" },
                                    { id: "usn", label: "USN", placeholder: "1AJ21CS000", type: "text" },
                                    { id: "year", label: "Year of Study", placeholder: "1, 2, 3 or 4", type: "number" },
                                    { id: "department", label: "Department", placeholder: "e.g. Computer Science", type: "text" },
                                ] as const).map(({ id, label, placeholder, type }) => (
                                    <Field key={id} label={label} error={formErrors[id]}>
                                        <input type={type} id={id}
                                            value={id === "year" ? (formData.year || "") : (formData as any)[id]}
                                            onChange={handleChange} placeholder={placeholder} required
                                            min={id === "year" ? 1 : undefined} max={id === "year" ? 8 : undefined}
                                            className="pop-input"
                                            style={formErrors[id] ? inputError : inputBase}
                                        />
                                    </Field>
                                ))}
                                <div style={{ gridColumn: "1/-1" }}>
                                    <Field label="College Name" error={formErrors.college}>
                                        <input type="text" id="college" list="collegeList"
                                            value={formData.college} onChange={handleChange}
                                            placeholder="Search or type your college" required
                                            className="pop-input"
                                            style={formErrors.college ? inputError : inputBase}
                                        />
                                        <datalist id="collegeList">
                                            {colleges.map((c) => <option key={c} value={c} />)}
                                        </datalist>
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="02 · Pick Your Events" color={C.magenta}>
                            {selectedEvents.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                                        {selectedEvents.map((se) => {
                                            const ev = events.find((e) => e.id === se.id);
                                            if (!ev) return null;
                                            return (
                                                <div key={ev.id} style={{
                                                    background: C.yellow, border: `2px solid ${C.black}`,
                                                    boxShadow: `2px 2px 0 ${C.black}`, padding: "4px 10px",
                                                    fontFamily: monoFont, fontSize: 11, fontWeight: 700,
                                                    display: "flex", alignItems: "center", gap: 6,
                                                }}>
                                                    {ev.eventName} · ₹{ev.fee || 0}
                                                    <button type="button" onClick={() => {
                                                        const updated = selectedEvents.filter((s) => s.id !== ev.id);
                                                        setSelectedEvents(updated);
                                                        if (groupEventData[ev.id]) setGroupEventData((prev) => { const u = { ...prev }; delete u[ev.id]; return u; });
                                                        setTotalAmount(events.filter((e) => updated.find((u) => u.id === e.id)).reduce((s, e) => s + (e.fee || 0), 0));
                                                    }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 900, fontSize: 14, color: C.pink, padding: 0 }}>
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{
                                        background: C.black, color: C.yellow,
                                        border: `3px solid ${C.black}`, boxShadow: `4px 4px 0 ${C.magenta}`,
                                        padding: "8px 16px", display: "inline-block",
                                        fontFamily: popFont, fontSize: 14, fontWeight: 900, letterSpacing: 2,
                                    }}>
                                        TOTAL: ₹{totalAmount}
                                    </div>
                                </div>
                            )}
                            <Field label="Add Events" error={formErrors.events}>
                                <Select id="events" instanceId="events-select"
                                    options={eventOptions} isMulti value={selectedEvents}
                                    onChange={handleEventSelection} placeholder="Search and select events…"
                                    styles={selectStyles}
                                />
                            </Field>
                        </SectionCard>

                        {selectedEvents.map((event) => {
                            if (event?.type !== "Team") return null;
                            const eventDetail = events.find((e) => e.id === event.id);
                            const groupData = groupEventData[event.id] || {
                                participantCount: eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1,
                                members: Array.from({ length: eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1 }, () => ({ name: "", email: "", usn: "" })),
                            };
                            const invalid = eventDetail && (groupData.participantCount < (eventDetail.minMembers - 1) || groupData.participantCount > (eventDetail.maxMembers - 1));
                            return (
                                <SectionCard key={event.id} title={`👥 ${event.label} — Team`} color={C.yellow}>
                                    <Field label="Team Members (excluding leader)" error={invalid ? `Must be ${eventDetail.minMembers - 1}–${eventDetail.maxMembers - 1}` : undefined}>
                                        <input type="number"
                                            min={eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1}
                                            max={eventDetail?.maxMembers ? eventDetail.maxMembers - 1 : 10}
                                            step={1} value={groupData.participantCount || ""}
                                            onChange={(e) => handleParticipantCountChange(event.id, parseInt(e.target.value) || "")}
                                            className="pop-input" style={{ ...inputBase, maxWidth: 100 }}
                                        />
                                    </Field>
                                    {groupData.members.map((member, index) => (
                                        <div key={index} style={{ ...cardStyle, background: "#fafafa", padding: 16, marginTop: 12 }}>
                                            <div style={{ ...sectionHeaderStyle(C.cyan), fontSize: 10, marginBottom: 12 }}>MEMBER {index + 1}</div>
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                                                {[
                                                    { field: "name", label: "Full Name", placeholder: "Member Name" },
                                                    { field: "usn", label: "USN", placeholder: "Member USN" },
                                                    { field: "email", label: "Email", placeholder: "Member Email" },
                                                ].map(({ field, label, placeholder }) => (
                                                    <Field key={field} label={label} error={formErrors[`group_${event.id}_member_${index}_${field}`]}>
                                                        <input type="text" value={(member as any)[field] || ""}
                                                            onChange={(e) => handleGroupMemberChange(event.id, index, field,
                                                                field === "usn" ? e.target.value.toUpperCase() : field === "email" ? e.target.value.toLowerCase() : e.target.value)}
                                                            placeholder={placeholder} className="pop-input"
                                                            style={formErrors[`group_${event.id}_member_${index}_${field}`] ? inputError : inputBase}
                                                        />
                                                    </Field>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </SectionCard>
                            );
                        })}

                        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                            <PopButton type="submit" bg={C.pink} fg={C.white}>PROCEED TO PAYMENT →</PopButton>
                        </div>
                    </form>
                )}

                {/* ── STEP 2 ── */}
                {paymentStep === "payment" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <SectionCard title="💰 Payment" color={C.yellow}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                                <div style={{ background: C.black, border: `3px solid ${C.black}`, boxShadow: `6px 6px 0 ${C.magenta}`, padding: "12px 32px" }}>
                                    <span style={{ fontFamily: displayFont, fontSize: 42, letterSpacing: 4, color: C.yellow }}>₹{totalAmount}</span>
                                </div>
                                <div style={{ fontFamily: monoFont, fontSize: 12, letterSpacing: 2, color: "#444", textAlign: "center" }}>
                                    Scan QR code to pay via UPI · <strong>ajiet@cnrb</strong>
                                </div>
                                {showQRCode ? (
                                    <div style={{ ...cardStyle, padding: 12 }}>
                                        <img src={qrImageUrl || "/logo.svg"} alt="UPI QR Code" style={{ width: 200, height: 200, display: "block" }} />
                                        <div style={{ textAlign: "center", fontFamily: monoFont, fontSize: 9, fontWeight: 700, letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>
                                            UPI · ajiet@cnrb
                                        </div>
                                    </div>
                                ) : (
                                    <PopButton bg={C.cyan} fg={C.black} onClick={generateQRCode}>GENERATE QR CODE</PopButton>
                                )}
                                <div style={{ width: "100%" }}>
                                    <div style={{ ...cardStyle, padding: 20, background: C.white }}>
                                        <div style={sectionHeaderStyle(C.magenta)}>After Payment</div>
                                        <Field label="Transaction ID / Reference Number" error={formErrors.transactionId}>
                                            <input type="text" id="transactionId" value={formData.transactionId} onChange={handleChange}
                                                placeholder="Enter UTR / Transaction ID" className="pop-input"
                                                style={formErrors.transactionId ? inputError : inputBase}
                                            />
                                        </Field>
                                        <div style={{ marginTop: 14 }}>
                                            <Field label="Payment Screenshot" error={formErrors.paymentScreenshot}>
                                                <input type="file" id="paymentScreenshot" accept="image/*" onChange={handleFileUpload} className="pop-file-input" />
                                            </Field>
                                            {formData.paymentScreenshot && (
                                                <div style={{ fontFamily: monoFont, fontSize: 10, marginTop: 6, color: "#444", letterSpacing: 1 }}>
                                                    ✔ {formData.paymentScreenshot.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                            <PopButton bg="#eee" fg={C.black} onClick={() => setPaymentStep("details")}>← BACK</PopButton>
                            <PopButton bg={C.pink} fg={C.white} onClick={proceedToVerification}>VERIFY PAYMENT →</PopButton>
                        </div>
                    </div>
                )}

                {/* ── STEP 3 ── */}
                {paymentStep === "verification" && (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <SectionCard title="01 · Personal Info" color={C.cyan}>
                            {[
                                ["Name", formData.name], ["Email", formData.email], ["Phone", formData.phone],
                                ["College", formData.college], ["Department", formData.department],
                                ["Year", formData.year?.toString()], ["USN", formData.usn],
                            ].map(([k, v]) => (
                                <div key={k} className="review-row">
                                    <span className="review-key">{k}</span><span>{v}</span>
                                </div>
                            ))}
                        </SectionCard>
                        <SectionCard title="02 · Selected Events" color={C.magenta}>
                            {selectedEvents.map((se) => {
                                const ev = events.find((e) => e.id === se.id);
                                if (!ev) return null;
                                return (
                                    <div key={ev.id}>
                                        <div className="review-row">
                                            <span className="review-key">{ev.eventName}</span>
                                            <span>₹{ev.fee || 0}</span>
                                        </div>
                                        {ev.eventType === "Team" && groupEventData[ev.id] && (
                                            <div style={{ paddingLeft: 16, marginBottom: 8 }}>
                                                {groupEventData[ev.id].members.map((m, i) => (
                                                    <div key={i} style={{ fontFamily: monoFont, fontSize: 11, color: "#555", padding: "3px 0" }}>
                                                        Member {i + 1}: {m.name} ({m.usn} · {m.email})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div style={{ ...sectionHeaderStyle(C.black), color: C.yellow, marginTop: 12 }}>
                                TOTAL: ₹{totalAmount}
                            </div>
                        </SectionCard>
                        <SectionCard title="03 · Payment Info" color={C.yellow}>
                            {[
                                ["Transaction ID", formData.transactionId],
                                ["Screenshot", formData.paymentScreenshot?.name || "No file selected"],
                            ].map(([k, v]) => (
                                <div key={k} className="review-row">
                                    <span className="review-key">{k}</span><span>{v}</span>
                                </div>
                            ))}
                        </SectionCard>
                        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                            <PopButton bg="#eee" fg={C.black} onClick={() => setPaymentStep("payment")}>← BACK</PopButton>
                            <PopButton type="submit" bg={C.pink} fg={C.white} disabled={isRegistering}>
                                {isRegistering ? (
                                    <>
                                        <svg style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.3" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        REGISTERING…
                                    </>
                                ) : "COMPLETE REGISTRATION ✓"}
                            </PopButton>
                        </div>
                    </form>
                )}
            </div>

        </div>
    );
};

export default Register;