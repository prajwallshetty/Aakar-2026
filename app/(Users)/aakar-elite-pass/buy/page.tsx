"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createElitePassOrder } from "@/backend/elite-pass";
import PopArtBackground from "@/components/(User)/PopArtBackground";

const PASS_FEE = 999;

const C = {
    yellow: "#ffff00",
    magenta: "#ff00ff",
    cyan: "#00ffff",
    pink: "#ff0066",
    hot: "#ff0066",
    black: "#000",
    white: "#fff",
};

const popFont = "'Arial Black', Impact, sans-serif";
const monoFont = "'Courier New', 'Space Mono', monospace";
const displayFont = "'Bebas Neue', Impact, sans-serif";

function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
    return (
        <div
            className={className}
            style={{
                background: "rgba(255,255,255,0.96)",
                border: `3px solid ${C.black}`,
                boxShadow: `6px 6px 0 ${C.black}`,
                borderRadius: 16,
                padding: "clamp(1.4rem,3.5vw,2.5rem)",
                position: "relative",
                ...style,
            }}
        >
            {children}
        </div>
    );
}

function SectionHeading({ children, color = C.magenta, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) {
    return (
        <h2
            style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(1.8rem,5vw,3.2rem)",
                letterSpacing: "0.05em",
                lineHeight: 0.95,
                color: C.black,
                textShadow: `0.08em 0.08em 0 ${color}`,
                WebkitTextStroke: `0.02em ${C.black}`,
                margin: "0 0 1.2rem",
                textAlign: center ? "center" : "left",
            }}
        >
            {children}
        </h2>
    );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                background: color,
                border: `2px solid ${C.black}`,
                boxShadow: `3px 3px 0 ${C.black}`,
                padding: "5px 18px",
                borderRadius: 4,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(0.85rem,2vw,1.1rem)",
                letterSpacing: "0.12em",
                color: C.black,
            }}
        >
            {children}
        </div>
    );
}

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
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: disabled ? "#ccc" : bg,
                color: disabled ? "#888" : fg,
                border: `3px solid ${C.black}`,
                boxShadow: hov && !disabled ? "0 0 0 #000" : `5px 5px 0 ${C.black}`,
                fontFamily: popFont,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
                padding: "12px 28px",
                cursor: disabled ? "not-allowed" : "pointer",
                transform: hov && !disabled ? "translate(3px,3px)" : "none",
                transition: "transform 0.1s, box-shadow 0.1s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                borderRadius: 0,
            }}
        >
            {children}
        </button>
    );
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 4 }}>
            <label style={{ fontFamily: monoFont, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.black, marginBottom: 4, display: "block" }}>
                {label}
            </label>
            {children}
            {error && <span style={{ fontFamily: monoFont, fontSize: 10, fontWeight: 700, color: C.pink, letterSpacing: 1, marginTop: 3 }}>⚡ {error}</span>}
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <PopArtBackground />
            <div style={{ background: C.white, border: `3px solid ${C.black}`, boxShadow: `6px 6px 0 ${C.black}`, padding: 32, width: "min(620px,90vw)", position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: displayFont, fontSize: 28, letterSpacing: 4, marginBottom: 12 }}>Loading Elite Pass…</div>
                <div style={{ height: 10, width: "45%", background: "#eee", border: `2px solid ${C.black}`, marginBottom: 10 }} />
                <div style={{ height: 42, background: "#f5f5f5", border: `3px solid ${C.black}`, boxShadow: `3px 3px 0 ${C.black}` }} />
            </div>
        </div>
    );
}

async function compressImageForUpload(file: File): Promise<File> {
    // Keep small files as-is to avoid unnecessary processing delay.
    if (!file.type.startsWith("image/") || file.size <= 1.5 * 1024 * 1024) {
        return file;
    }

    return new Promise<File>((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            const maxDimension = 1600;
            const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
            const targetWidth = Math.max(1, Math.round(img.width * scale));
            const targetHeight = Math.max(1, Math.round(img.height * scale));

            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                URL.revokeObjectURL(objectUrl);
                resolve(file);
                return;
            }

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(objectUrl);

                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    const compressedFile = new File(
                        [blob],
                        file.name.replace(/\.[^.]+$/, "") + ".jpg",
                        { type: "image/jpeg" },
                    );

                    resolve(compressedFile.size < file.size ? compressedFile : file);
                },
                "image/jpeg",
                0.8,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file);
        };

        img.src = objectUrl;
    });
}

export default function ElitePassBuyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrImageUrl, setQrImageUrl] = useState("");
    const [paymentStep, setPaymentStep] = useState<"details" | "payment" | "confirm">("details");
    const [generalError, setGeneralError] = useState("");
    const [formErrors, setFormErrors] = useState<{ [key: string]: string | undefined }>({});
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        usn: "",
        college: "",
        department: "",
        year: 0,
        transactionId: "",
        paymentScreenshot: null as File | null,
    });

    const colleges = [...[
        "A J Institute of Engineering and Technology, Mangalore", "Alva's Ayurveda Medical College, Moodbidri", "Srinivas institute of technology, valachill", "Alva's Homoeopathic Medical College, Moodbidri", "Alva's Institute of Engineering Technology, Moodbidri", "Alvas College of Nursing, Moodbidri", "The Oxford college of engineering", "Aloysius MBA, Mangalore", "Canara Engineering College, Mangalore", "Carmel Degree College, Modankap, BC Road", "St. Mary's College, Shirva", "adichunchanagiri institute of engineering, coorg", "CIT, chickmagalur", "Rajarajeshwari college Bangalore", "Shri Madhwa Vadiraja Institute of Technology and Management, Udupi", "Mahathma Gandhi Memorial (MGM) College, Udupi", "Vaikunta Baliga College of Law, Udupi", "Trisha Vidya College of Commerce and Management", "Upendra Pai Memorial College, Udupi", "Udupi Group of Institutions, Manipal", "Kasturba Medical College (KMC), Manipal", "Laxmi Memorial College of Nursing & Physiotherapy", "Manipal Institute of Technology, Manipal", "College of Fisheries, Mangalore", "Dr G Shankar Government Women's First Grade College & PG Study Centre, Ajjarkadu, Udupi", "Govt. First Grade College, Kaup", "Government Girls Degree College, Brahmagiri, Udupi", "Govinda Dasa College, Surathkal", "GTTC Baikampady, Mangalore", "Karavali Ayurveda and Medical Research, Mangalore", "Karavali College of Hotel Management", "Karavali College of Nursing Science", "Karavali College of Pharmacy, Mangalore", "Karavali College of Pharmacy, Vamanjoor, Mangalore", "Karavali College of Physiotherapy", "Karavali Institute of Technology, Mangalore", "Karavali Institute of Technology, Moodbidri", "KMC, Manipal", "Mahatma Gandhi Memorial (MGM) College, Udupi", "MIT Hotel Management", "MIT Manipal", "MITE - Mangalore Institute of Technology & Engineering", "Moodlakatte Institute of Technology, Kundapur", "N.M.A.M. Institute of Technology, Nitte, Karkala", "NITK, Surathkal", "Nitte Institute of Pharmacy", "Padua College, Mangaluru", "Padu Thirupathi Degree College, Karkala", "Poornaprajna College, Udupi", "Pompeii College, Aikala", "Sahyadri College of Engineering and Management", "SDM College of Engineering and Technology (SDMC)", "SDM Polytechnic, Ujire", "SDPT First Grade College, Kateel", "Shirdi Sai Degree College, Karkala", "Shri Madhwa Vadiraja Institute of Technology & Management, Bantakal", "Sri Bhuvanendra College, Karkala", "Sri Devi Institute of Technology, Kenjara, Bajpe", "Sri Mahaveera College, Kodangallu, Moodbidri", "Sri Taralabalu Jagadguru Institute of Technology", "Srinivas Institute of Engineering and Technology, Mukka", "Srinivas Institute of Medical Sciences and Research Center, Mukka", "St Joseph Engineering College, Vamanjoor, Mangaluru", "St. Raymond's Degree College, Vamanjoor, Kudupu, Karnataka", "Sumedha Fashion Institute, Karkala", "S NM Polytechnic, Moodbidri", "Udupi Group of Institutions", "Upendra Pai Memorial College (UPMC), Kunjebettu, Udupi", "Yenapoya Institute of Arts Science and Commerce", "Muniyal Ayurveda College", "Vaikunta Baliga College of Law, Kunjibettu", "Gandhinagar First Grade College", "Tejaswini Group of Institutions", "Mangala Group of Institutions", "PACE Mangalore", "Yenepoya School Of Engineering & Technology", "Bearys Institute of Technology", "Kanachur Institute of Medical Science", "NITTE Architecture", "NITTE Nursing", "St Mary's College, Shirva", "Ids college, Mangalore", "Canara Degree College", "St Agnes College(Autonomous). Bendur, Mangaluru", "Besant Women's College", "Shree Gokarnanatheshwara College", "Mahatma Gandhi Memorial College, Udupi", "Yenepoya Allied Science", "NITTE Institute of Communication", "Unity Academy of Education, Institute of Nursing, Ashok Nagar, Mangalore", "Trisha College of Commerce and Management, Alake Road, Kodailbail", "Narayana Guru School And College, Barke Road, Kudroli", "Athene Institute of Health Science", "Athena Institute of Nursing Science", "Indira Institute of Nursing Science", "Laxmi Memorial College of Nursing", "St. Aloysius", "Ramakrishna Degree College", "MAPS College", "NITTE MBA", "Moti Mahal", "Govt. JJJ College", "Dr. Dayananda Pai - P Sathisha Pai Govt. First Grade College, Car Street, Mangalore", "AJIM", "M. V. Shetty College of Physiotherapy, Mangalore", "Trisha College of Nursing, Mangalore", "Shree Devi Institute of Technology, Mangalore", "Manel Srinivas Nayak Institute of Management, Mangalore", "Yenepoya Institute of Technology (YIT), Moodbidri", "Sahyadri College of Nursing, Mangalore", "A.J. Institute of Management, Mangalore", "A.J. Institute of Dental Sciences, Mangalore", "A.J. Institute of Allied Health Sciences, Mangalore", "A.J. Institute of Medical Sciences, Mangalore", "Padua College of Commerce and Management, Mangalore", "A.J. Institute of Nursing, Mangalore", "A.J. Institute of Physiotherapy, Mangalore", "Yenepoya Degree College, Mangalore", "Shridevi Institute of Computer Sciences (BCA), Mangalore", "Shridevi College of Nursing, Mangalore", "Shridevi College of Commerce (B.Com), Mangalore", "SDM College of Business Management (MBA), Mangalore", "SDM Law College, Mangalore", "SDM PG College Ujire", "SDM Institute of Technology (SDMIT) Ujire", "Canara College (MCA Program), Mangalore", "Minerva College, Mangalore", "Srinivas Institute of Nursing Sciences, Mangalore", "Srinivas College of Pharmacy, Mangalore", "P.A. College of Engineering, Mangalore", "P.A. Polytechnic, Mangalore", "P.A. First Grade College, Mangalore", "Alva's College, Moodbidri", "Alva's College of Law, Moodbidri", "Alva's College of Naturopathy and Yogic Sciences, Moodbidri", "Canara Engineering College (CEC), Benjanapadavu", "Anugraha Women's College, Kalladka", "Sri Rama First Grade College, Kalladka", "Vivekananda Degree College, Puttur", "Vivekananda College of Engineering & Technology, Puttur", "St Philomena College, Puttur", "St Philomena PG and Research Centre, Puttur", "Akshaya College, Puttur", "Ambika First Grade College, Puttur", "KVG Ayurveda College, Sulya", "KVG College of Engineering, Sulya", "KVG Dental College, Sulya", "BGS Institute of Technology, Bangalore", "Shri Shirdi Sai Mandira College, Karkala", "Vijaya College, Mulki", "Srinivas Institute of Allied Health Sciences, Mangalore", "BGS Institute of Technology, Mangalore", "Acharya Institute of Technology, Bangalore", "Adi Shankara Institute of Engineering Technology, Kalady", "Amrita Vishwa Vidyapeetham, Coimbatore", "Angadi Institute of Technology, Belagavi", "Bangalore Institute of Technology, Bangalore", "BMS College of Engineering, Bangalore", "BMS Institute of Technology and Management, Bangalore", "BNM Institute of Technology, Bangalore", "CMR Institute of Technology, Bangalore", "Dayananda Sagar College of Engineering, Bangalore", "Dr. Ambedkar Institute of Technology, Bangalore", "East Point College of Engineering, Bangalore", "Global Academy of Technology, Bangalore", "Gogte Institute of Technology, Belagavi", "HKBK College of Engineering, Bangalore", "KS Institute of Technology, Bangalore", "KLE Technological University, Hubli", "LBS Institute of Technology for Women, Thiruvananthapuram", "M S Engineering College, Bangalore", "MS Ramaiah Institute of Technology, Bangalore", "New Horizon College of Engineering, Bangalore", "Nitte Meenakshi Institute of Technology, Bangalore", "PES College of Engineering, Mandya", "PES University, Bangalore", "Poojya Doddappa Appa College of Engineering, Kalaburagi", "RNS Institute of Technology, Bangalore", "RV College of Engineering, Bangalore", "Sir M Visvesvaraya Institute of Technology, Bangalore", "SJB Institute of Technology, Bangalore", "SNS College of Engineering, Coimbatore", "Sri Jayachamarajendra College of Engineering (SJCE), Mysore", "Sri Ramakrishna Engineering College, Coimbatore", "Vidyavardhaka College of Engineering, Mysore", "College of Engineering Chengannur", "College of Engineering Trivandrum", "Federal Institute of Science and Technology, Angamaly", "Government Engineering College Adoor", "Government Engineering College Alappuzha", "Government Engineering College Attingal", "Government Engineering College Barton Hill, Thiruvananthapuram", "Government Engineering College Chavara, Kollam", "Government Engineering College Ernakulam", "Government Engineering College Idukki", "Government Engineering College Kanhangad", "Government Engineering College Kannur", "Government Engineering College Karunagapally", "Government Engineering College Kasaragod", "Government Engineering College Kayamkulam", "Government Engineering College Kollam", "Government Engineering College Kottarakkara", "Government Engineering College Kottayam", "Government Engineering College Kozhikode", "Government Engineering College Kunnamkulam", "Government Engineering College Malappuram", "Yenepoya Homoeopathic Medical College and hospital", "Government Engineering College Mananthavady", "Government Engineering College Munnar", "Government Engineering College Painavu", "Government Engineering College Palakkad", "Government Engineering College Pathanamthitta", "Government Engineering College Payyannur", "Government Engineering College Sreekrishnapuram", "Government Engineering College Thalassery", "Government Engineering College Thiruvananthapuram", "Government Engineering College Thodupuzha", "Government Engineering College Thrissur", "Government Engineering College Vadakara", "Government Engineering College Vatakara", "Government Engineering College Wayanad", "Ilahia College of Engineering, Muvattupuzha", "Jyothi Engineering College, Thrissur", "Mar Baselios College of Engineering, Thiruvananthapuram", "Model Engineering College, Kochi", "Mohandas College of Engineering, Thiruvananthapuram", "Rajagiri School of Engineering and Technology, Kochi", "Saintgits College of Engineering, Kottayam", "Sree Buddha College of Engineering, Alappuzha", "TKM College of Engineering, Kollam", "Vidya Academy of Science and Technology, Thrissur", "Coimbatore Institute of Technology", "Garden City University, Bangalore", "Indian Institute of Science (IISc), Bangalore", "Jain University, Bangalore", "JSS Science and Technology University, Mysuru", "Karpagam College of Engineering, Coimbatore", "Karunya Institute of Technology and Sciences, Coimbatore", "Kumaraguru College of Technology, Coimbatore", "National Institute of Engineering (NIE), Mysuru", "PSG College of Technology, Coimbatore", "Reva University, Bangalore"
    ]].sort((a, b) => a.localeCompare(b));

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const upiUrl = `upi://pay?pa=${encodeURIComponent("ajiet@cnrb")}&pn=${encodeURIComponent("Aakar Elite Pass")}&am=${PASS_FEE}&cu=INR&tn=${encodeURIComponent("Aakar Elite Pass")}`;
                setQrImageUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`);
            } catch (error) {
                console.error("Error loading Elite Pass data:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === "year" ? parseInt(value) : id === "usn" ? value.toUpperCase() : id === "email" ? value.toLowerCase() : value,
        }));
        if (formErrors[id]) setFormErrors((prev) => ({ ...prev, [id]: undefined }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, paymentScreenshot: e.target.files![0] }));
            if (formErrors.paymentScreenshot) setFormErrors((prev) => ({ ...prev, paymentScreenshot: undefined }));
        }
    };

    const proceedToPayment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors: { [key: string]: string } = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (!formData.phone.trim()) errors.phone = "Phone number is required";
        if (!formData.usn.trim()) errors.usn = "USN is required";
        if (!formData.college.trim()) errors.college = "College name is required";
        if (!formData.department.trim()) errors.department = "Department is required";
        if (!formData.year || Number.isNaN(formData.year)) errors.year = "Year of study is required";
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setGeneralError("Please fix the highlighted fields.");
            return;
        }
        setGeneralError("");
        setPaymentStep("payment");
        setShowQRCode(true);
    };

    const proceedToConfirm = () => {
        const errors: { [key: string]: string } = {};
        if (!formData.transactionId.trim()) errors.transactionId = "Transaction ID is required";
        if (!formData.paymentScreenshot) errors.paymentScreenshot = "Payment screenshot is required";
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setGeneralError("Please complete payment details.");
            return;
        }
        setGeneralError("");
        setPaymentStep("confirm");
    };

    const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.paymentScreenshot) {
            setFormErrors({ paymentScreenshot: "Payment screenshot is required" });
            return;
        }

        setIsSubmitting(true);
        setFormErrors({});
        setGeneralError("");

        try {
            const optimizedFile = await compressImageForUpload(formData.paymentScreenshot);
            const uploadFormData = new FormData();
            uploadFormData.append("file", optimizedFile);

            const uploadResponse = await fetch("/api/elite-pass/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResponse.ok) {
                setGeneralError(uploadResult?.error || "Payment screenshot upload failed.");
                setIsSubmitting(false);
                return;
            }

            const screenshotUrl = uploadResult.url as string;
            if (!screenshotUrl) {
                setGeneralError("Payment screenshot upload failed.");
                setIsSubmitting(false);
                return;
            }

            const result = await createElitePassOrder({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                usn: formData.usn,
                college: formData.college,
                department: formData.department,
                year: formData.year,
                transactionId: formData.transactionId,
                paymentScreenshotUrl: screenshotUrl,
            });

            if (!result || result.error) {
                if (typeof result?.error === "object" && result.error !== null) {
                    setFormErrors(result.error);
                } else {
                    setGeneralError(result?.error || "Elite Pass purchase failed.");
                }
                setIsSubmitting(false);
                return;
            }

            router.replace("/aakar-elite-pass/success");
        } catch (error) {
            console.error("Elite Pass purchase error:", error);
            setGeneralError("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div style={{ minHeight: "100vh", position: "relative", padding: "clamp(3rem,8vh,6rem) clamp(1rem,5vw,3rem) clamp(3rem,8vh,5rem)" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
                .fade-up { animation: fadeUp 0.5s ease both; }
                .pop-input:focus { box-shadow: 3px 3px 0 #ff00ff !important; border-color: #ff00ff !important; outline: none; }
                .pop-input::placeholder { color: #aaa; font-style: italic; }
            `}</style>

            <PopArtBackground />

            <main style={{ position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(2rem,4vh,3rem)" }}>
                    <div className="fade-up" style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-block", background: C.black, color: C.yellow, fontFamily: displayFont, fontSize: "clamp(0.7rem,1.6vw,0.9rem)", letterSpacing: "0.4em", padding: "4px 20px", border: `2px solid ${C.black}`, boxShadow: `3px 3px 0 ${C.magenta}`, marginBottom: "0.7rem" }}>
                            PURCHASE PASS
                        </div>
                        <div style={{ fontFamily: displayFont, fontSize: "clamp(3rem,10vw,7rem)", lineHeight: 0.88, letterSpacing: "0.04em", color: C.black, textShadow: `0.05em 0.05em 0 ${C.magenta}, 0.1em 0.1em 0 ${C.cyan}`, WebkitTextStroke: `0.02em ${C.black}` }}>
                            AAKAR ELITE
                        </div>
                        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
                            <Chip color={C.yellow}>BUY PASS</Chip>
                            <Chip color={C.cyan}>₹{PASS_FEE}</Chip>
                        </div>
                    </div>

                    {generalError && (
                        <div style={{ background: C.pink, color: C.white, border: `3px solid ${C.black}`, boxShadow: `5px 5px 0 ${C.black}`, padding: "12px 20px", fontFamily: popFont, fontSize: 12, fontWeight: 900, letterSpacing: 2 }}>
                            ⚡ {generalError}
                        </div>
                    )}

                    {paymentStep === "details" && (
                        <form onSubmit={proceedToPayment} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <Card>
                                <SectionHeading color={C.magenta}>01 · Your Details</SectionHeading>
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
                                            <input
                                                type={type}
                                                id={id}
                                                value={id === "year" ? (formData.year || "") : (formData as any)[id]}
                                                onChange={handleChange}
                                                placeholder={placeholder}
                                                required
                                                min={id === "year" ? 1 : undefined}
                                                max={id === "year" ? 8 : undefined}
                                                className="pop-input"
                                                style={{ width: "100%", padding: "10px 12px", border: formErrors[id] ? `3px solid ${C.pink}` : `3px solid ${C.black}`, borderRadius: 0, boxShadow: formErrors[id] ? `3px 3px 0 ${C.pink}` : `3px 3px 0 ${C.black}`, fontFamily: monoFont, fontSize: 13, background: C.white, color: C.black, outline: "none" }}
                                            />
                                        </Field>
                                    ))}
                                </div>
                                <div style={{ gridColumn: "1/-1", marginTop: 16 }}>
                                    <Field label="College Name" error={formErrors.college}>
                                        <input
                                            type="text"
                                            id="college"
                                            list="collegeList"
                                            value={formData.college}
                                            onChange={handleChange}
                                            placeholder="Search or type your college"
                                            required
                                            className="pop-input"
                                            style={{ width: "100%", padding: "10px 12px", border: formErrors.college ? `3px solid ${C.pink}` : `3px solid ${C.black}`, borderRadius: 0, boxShadow: formErrors.college ? `3px 3px 0 ${C.pink}` : `3px 3px 0 ${C.black}`, fontFamily: monoFont, fontSize: 13, background: C.white, color: C.black, outline: "none" }}
                                        />
                                        <datalist id="collegeList">
                                            {colleges.map((collegeName) => <option key={collegeName} value={collegeName} />)}
                                        </datalist>
                                    </Field>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                                    <PopButton type="submit" bg={C.pink} fg={C.white}>PROCEED TO PAYMENT →</PopButton>
                                </div>
                            </Card>
                        </form>
                    )}

                    {paymentStep === "payment" && (
                        <Card>
                            <SectionHeading color={C.yellow}>02 · Payment</SectionHeading>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                                <div style={{ background: C.black, border: `3px solid ${C.black}`, boxShadow: `6px 6px 0 ${C.magenta}`, padding: "12px 32px" }}>
                                    <span style={{ fontFamily: displayFont, fontSize: 42, letterSpacing: 4, color: C.yellow }}>₹{PASS_FEE}</span>
                                </div>
                                <div style={{ fontFamily: monoFont, fontSize: 12, letterSpacing: 2, color: "#444", textAlign: "center" }}>
                                    Scan QR code to pay via UPI · <strong>ajiet@cnrb</strong>
                                </div>
                                {showQRCode ? (
                                    <div style={{ background: C.white, border: `3px solid ${C.black}`, boxShadow: `4px 4px 0 ${C.black}`, padding: 12 }}>
                                        <img src={qrImageUrl || "/logo.svg"} alt="UPI QR Code" style={{ width: 220, height: 220, display: "block" }} />
                                        <div style={{ textAlign: "center", fontFamily: monoFont, fontSize: 9, fontWeight: 700, letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>
                                            UPI · Aakar Elite Pass
                                        </div>
                                    </div>
                                ) : (
                                    <PopButton bg={C.cyan} fg={C.black} onClick={() => setShowQRCode(true)}>GENERATE QR CODE</PopButton>
                                )}
                                <div style={{ width: "100%", maxWidth: 640 }}>
                                    <div style={{ background: C.white, border: `3px solid ${C.black}`, boxShadow: `6px 6px 0 ${C.black}`, padding: 20 }}>
                                        <SectionHeading color={C.magenta}>After Payment</SectionHeading>
                                        <Field label="Transaction ID / Reference Number" error={formErrors.transactionId}>
                                            <input
                                                type="text"
                                                id="transactionId"
                                                value={formData.transactionId}
                                                onChange={handleChange}
                                                placeholder="Enter UTR / Transaction ID"
                                                className="pop-input"
                                                style={{ width: "100%", padding: "10px 12px", border: formErrors.transactionId ? `3px solid ${C.pink}` : `3px solid ${C.black}`, borderRadius: 0, boxShadow: formErrors.transactionId ? `3px 3px 0 ${C.pink}` : `3px 3px 0 ${C.black}`, fontFamily: monoFont, fontSize: 13, background: C.white, color: C.black, outline: "none" }}
                                            />
                                        </Field>
                                        <div style={{ marginTop: 14 }}>
                                            <Field label="Payment Screenshot" error={formErrors.paymentScreenshot}>
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="pop-input" style={{ width: "100%", padding: "10px 12px", border: `3px dashed ${C.black}`, background: C.yellow, fontFamily: monoFont, fontSize: 12, cursor: "pointer" }} />
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
                            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
                                <PopButton bg="#eee" fg={C.black} onClick={() => setPaymentStep("details")}>← BACK</PopButton>
                                <PopButton bg={C.pink} fg={C.white} onClick={proceedToConfirm}>VERIFY PAYMENT →</PopButton>
                            </div>
                        </Card>
                    )}

                    {paymentStep === "confirm" && (
                        <form onSubmit={submitOrder} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <Card>
                                <SectionHeading color={C.cyan}>03 · Review Details</SectionHeading>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {[
                                        ["Name", formData.name],
                                        ["Email", formData.email],
                                        ["Phone", formData.phone],
                                        ["USN", formData.usn],
                                        ["College", formData.college],
                                        ["Department", formData.department],
                                        ["Year", formData.year?.toString()],
                                        ["Transaction ID", formData.transactionId],
                                        ["Screenshot", formData.paymentScreenshot?.name || "No file selected"],
                                    ].map(([key, value]) => (
                                        <div key={key} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: `2px dashed ${C.black}`, fontFamily: monoFont, fontSize: 13 }}>
                                            <span style={{ minWidth: 120, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 10 }}>{key}</span>
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                                <PopButton bg="#eee" fg={C.black} onClick={() => setPaymentStep("payment")}>← BACK</PopButton>
                                <PopButton type="submit" bg={C.pink} fg={C.white} disabled={isSubmitting}>
                                    {isSubmitting ? "SUBMITTING…" : "COMPLETE PURCHASE ✓"}
                                </PopButton>
                            </div>
                        </form>
                    )}

                </div>
            </main>
        </div>
    );
}
