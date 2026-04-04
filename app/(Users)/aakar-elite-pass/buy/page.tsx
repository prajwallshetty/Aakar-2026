"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createElitePassOrder } from "@/backend/elite-pass";
import { 
  AnimeParticleField, 
  AnimeOrbField, 
  AnimeCardWrapper, 
  AnimeSectionHeading, 
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const PASS_FEE = 999;

// ─── Anime Design tokens ────────────────────────────────────────────────────────────
const C = {
    yellow: ANIME_COLORS.accent,
    magenta: ANIME_COLORS.primary,
    cyan: ANIME_COLORS.secondary,
    pink: ANIME_COLORS.purple,
    hot: ANIME_COLORS.purple,
    black: ANIME_COLORS.background,
    white: ANIME_COLORS.text,
};

const popFont = "'Bebas Neue', Impact, sans-serif";
const monoFont = "'Share Tech Mono', monospace";
const displayFont = "'Bebas Neue', Impact, sans-serif";

function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
    return (
        <AnimeCardWrapper accentIndex={0} className={className} style={{
            padding: "clamp(1.4rem,3.5vw,2.5rem)",
            position: "relative",
            ...style,
        }}>
            {children}
        </AnimeCardWrapper>
    );
}

function SectionHeading({ children, color = ANIME_COLORS.primary, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) {
    const accentIndex = color === ANIME_COLORS.primary ? 0 : color === ANIME_COLORS.secondary ? 1 : color === ANIME_COLORS.accent ? 2 : 3;
    return (
        <AnimeSectionHeading index={accentIndex} style={{
            textAlign: center ? "center" : "left",
        }}>
            {children}
        </AnimeSectionHeading>
    );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                background: `${color}40`,
                border: `1px solid ${color}`,
                boxShadow: `0 0 12px ${color}40`,
                padding: "6px 16px",
                borderRadius: 6,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(0.85rem,2vw,1.1rem)",
                letterSpacing: "0.12em",
                color: ANIME_COLORS.text,
                backdropFilter: "blur(4px)"
            }}
        >
            {children}
        </div>
    );
}

const AnimeButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
    bg?: string;
    fg?: string;
}> = ({ children, onClick, type = "button", disabled, bg = ANIME_COLORS.primary, fg = ANIME_COLORS.text }) => {
    const [hov, setHov] = useState(false);
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: disabled ? `${ANIME_COLORS.background}40` : `${bg}20`,
                color: disabled ? `${ANIME_COLORS.text}40` : fg,
                border: `1px solid ${bg}`,
                boxShadow: hov && !disabled ? `0 0 20px ${bg}60` : `0 0 8px ${bg}40`,
                fontFamily: popFont,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
                padding: "12px 28px",
                cursor: disabled ? "not-allowed" : "pointer",
                transform: hov && !disabled ? "translateY(-2px)" : "none",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                borderRadius: 6,
                backdropFilter: "blur(4px)"
            }}
        >
            {children}
        </button>
    );
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 4 }}>
            <label style={{ fontFamily: monoFont, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: ANIME_COLORS.text, marginBottom: 4, display: "block" }}>
                {label}
            </label>
            {children}
            {error && <span style={{ fontFamily: monoFont, fontSize: 10, fontWeight: 700, color: ANIME_COLORS.purple, letterSpacing: 1, marginTop: 3 }}>⚡ {error}</span>}
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <AnimeOrbField />
            <AnimeParticleField />
            <AnimeCardWrapper accentIndex={0} style={{ padding: 32, width: "min(620px,90vw)", position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: displayFont, fontSize: 28, letterSpacing: 4, marginBottom: 12, color: ANIME_COLORS.text }}>
                    <AnimeGlitchText text="Loading Elite Pass…">
                        Loading Elite Pass…
                    </AnimeGlitchText>
                </div>
                <div style={{ height: 10, width: "45%", background: `${ANIME_COLORS.background}40`, border: `1px solid ${ANIME_COLORS.primary}`, marginBottom: 10 }} />
                <div style={{ height: 42, background: `${ANIME_COLORS.background}20`, border: `1px solid ${ANIME_COLORS.primary}`, boxShadow: `0 0 8px ${ANIME_COLORS.primary}40` }} />
            </AnimeCardWrapper>
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
                ${ANIME_GLOBAL_STYLES}
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
                .fade-up { animation: fadeUp 0.5s ease both; }
                .anime-input:focus { box-shadow: 0 0 16px ${ANIME_COLORS.secondary}60 !important; border-color: ${ANIME_COLORS.secondary} !important; outline: none; }
                .anime-input::placeholder { color: ${ANIME_COLORS.text}60; font-style: italic; }
            `}</style>

            <AnimeOrbField />
            <AnimeParticleField />

            <main style={{ position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(2rem,4vh,3rem)" }}>
                    <div className="fade-up" style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-block", background: `${ANIME_COLORS.background}80`, color: ANIME_COLORS.accent, fontFamily: displayFont, fontSize: "clamp(0.7rem,1.6vw,0.9rem)", letterSpacing: "0.4em", padding: "4px 20px", border: `1px solid ${ANIME_COLORS.accent}`, boxShadow: `0 0 12px ${ANIME_COLORS.accent}40`, marginBottom: "0.7rem", backdropFilter: "blur(4px)" }}>
                            PURCHASE PASS
                        </div>
                        <div style={{ fontFamily: displayFont, fontSize: "clamp(3rem,10vw,7rem)", lineHeight: 0.88, letterSpacing: "0.04em", color: ANIME_COLORS.text, textShadow: `0 0 30px ${ANIME_COLORS.primary}45, -3px -3px 0 ${ANIME_COLORS.primary}, 3px 3px 0 ${ANIME_COLORS.secondary}` }}>
                            <AnimeGlitchText text="AAKAR ELITE">
                                AAKAR ELITE
                            </AnimeGlitchText>
                        </div>
                        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
                            <Chip color={ANIME_COLORS.accent}>BUY PASS</Chip>
                            <Chip color={ANIME_COLORS.secondary}>₹{PASS_FEE}</Chip>
                        </div>
                    </div>

                    {generalError && (
                        <div style={{ background: `${ANIME_COLORS.purple}40`, color: ANIME_COLORS.text, border: `1px solid ${ANIME_COLORS.purple}`, boxShadow: `0 0 12px ${ANIME_COLORS.purple}40`, padding: "12px 20px", fontFamily: popFont, fontSize: 12, fontWeight: 900, letterSpacing: 2, borderRadius: 6, backdropFilter: "blur(4px)" }}>
                            ⚡ {generalError}
                        </div>
                    )}

                    {paymentStep === "details" && (
                        <form onSubmit={proceedToPayment} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <Card>
                                <SectionHeading color={ANIME_COLORS.primary}>01 · Your Details</SectionHeading>
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
                                                className="anime-input"
                                                style={{ width: "100%", padding: "10px 12px", border: formErrors[id] ? `1px solid ${ANIME_COLORS.purple}` : `1px solid ${ANIME_COLORS.primary}`, borderRadius: 6, boxShadow: formErrors[id] ? `0 0 12px ${ANIME_COLORS.purple}40` : `0 0 8px ${ANIME_COLORS.primary}40`, fontFamily: monoFont, fontSize: 13, background: `${ANIME_COLORS.background}40`, color: ANIME_COLORS.text, outline: "none", backdropFilter: "blur(4px)" }}
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
                                            className="anime-input"
                                            style={{ width: "100%", padding: "10px 12px", border: formErrors.college ? `1px solid ${ANIME_COLORS.purple}` : `1px solid ${ANIME_COLORS.primary}`, borderRadius: 6, boxShadow: formErrors.college ? `0 0 12px ${ANIME_COLORS.purple}40` : `0 0 8px ${ANIME_COLORS.primary}40`, fontFamily: monoFont, fontSize: 13, background: `${ANIME_COLORS.background}40`, color: ANIME_COLORS.text, outline: "none", backdropFilter: "blur(4px)" }}
                                        />
                                        <datalist id="collegeList">
                                            {colleges.map((collegeName) => <option key={collegeName} value={collegeName} />)}
                                        </datalist>
                                    </Field>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                                    <AnimeButton type="submit" bg={ANIME_COLORS.primary} fg={ANIME_COLORS.text}>PROCEED TO PAYMENT →</AnimeButton>
                                </div>
                            </Card>
                        </form>
                    )}

                    {paymentStep === "payment" && (
                        <Card>
                            <SectionHeading color={ANIME_COLORS.accent}>02 · Payment</SectionHeading>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                                <div style={{ background: `${ANIME_COLORS.background}80`, border: `1px solid ${ANIME_COLORS.accent}`, boxShadow: `0 0 12px ${ANIME_COLORS.accent}40`, padding: "12px 32px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
                                    <span style={{ fontFamily: displayFont, fontSize: 42, letterSpacing: 4, color: ANIME_COLORS.accent }}>₹{PASS_FEE}</span>
                                </div>
                                <div style={{ fontFamily: monoFont, fontSize: 12, letterSpacing: 2, color: ANIME_COLORS.subtext, textAlign: "center" }}>
                                    Scan QR code to pay via UPI · <strong>ajiet@cnrb</strong>
                                </div>
                                {showQRCode ? (
                                    <div style={{ background: `${ANIME_COLORS.background}80`, border: `1px solid ${ANIME_COLORS.primary}`, boxShadow: `0 0 12px ${ANIME_COLORS.primary}40`, padding: 12, borderRadius: 6, backdropFilter: "blur(4px)" }}>
                                        <img src={qrImageUrl || "/logo.svg"} alt="UPI QR Code" style={{ width: 220, height: 220, display: "block" }} />
                                        <div style={{ textAlign: "center", fontFamily: monoFont, fontSize: 9, fontWeight: 700, letterSpacing: 3, marginTop: 8, textTransform: "uppercase", color: ANIME_COLORS.text }}>
                                            UPI · Aakar Elite Pass
                                        </div>
                                    </div>
                                ) : (
                                    <AnimeButton bg={ANIME_COLORS.secondary} fg={ANIME_COLORS.text} onClick={() => setShowQRCode(true)}>GENERATE QR CODE</AnimeButton>
                                )}
                                <div style={{ width: "100%", maxWidth: 640 }}>
                                    <div style={{ background: `${ANIME_COLORS.background}80`, border: `1px solid ${ANIME_COLORS.primary}`, boxShadow: `0 0 12px ${ANIME_COLORS.primary}40`, padding: 20, borderRadius: 6, backdropFilter: "blur(4px)" }}>
                                        <SectionHeading color={ANIME_COLORS.primary}>After Payment</SectionHeading>
                                        <Field label="Transaction ID / Reference Number" error={formErrors.transactionId}>
                                            <input
                                                type="text"
                                                id="transactionId"
                                                value={formData.transactionId}
                                                onChange={handleChange}
                                                placeholder="Enter UTR / Transaction ID"
                                                className="anime-input"
                                                style={{ width: "100%", padding: "10px 12px", border: formErrors.transactionId ? `1px solid ${ANIME_COLORS.purple}` : `1px solid ${ANIME_COLORS.primary}`, borderRadius: 6, boxShadow: formErrors.transactionId ? `0 0 12px ${ANIME_COLORS.purple}40` : `0 0 8px ${ANIME_COLORS.primary}40`, fontFamily: monoFont, fontSize: 13, background: `${ANIME_COLORS.background}40`, color: ANIME_COLORS.text, outline: "none", backdropFilter: "blur(4px)" }}
                                            />
                                        </Field>
                                        <div style={{ marginTop: 14 }}>
                                            <Field label="Payment Screenshot" error={formErrors.paymentScreenshot}>
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="anime-input" style={{ width: "100%", padding: "10px 12px", border: `1px dashed ${ANIME_COLORS.primary}`, background: `${ANIME_COLORS.accent}40`, fontFamily: monoFont, fontSize: 12, cursor: "pointer", borderRadius: 6, color: ANIME_COLORS.text, backdropFilter: "blur(4px)" }} />
                                            </Field>
                                            {formData.paymentScreenshot && (
                                                <div style={{ fontFamily: monoFont, fontSize: 10, marginTop: 6, color: ANIME_COLORS.subtext, letterSpacing: 1 }}>
                                                    ✔ {formData.paymentScreenshot.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
                                <AnimeButton bg={`${ANIME_COLORS.background}40`} fg={ANIME_COLORS.text} onClick={() => setPaymentStep("details")}>← BACK</AnimeButton>
                                <AnimeButton bg={ANIME_COLORS.primary} fg={ANIME_COLORS.text} onClick={proceedToConfirm}>VERIFY PAYMENT →</AnimeButton>
                            </div>
                        </Card>
                    )}

                    {paymentStep === "confirm" && (
                        <form onSubmit={submitOrder} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <Card>
                                <SectionHeading color={ANIME_COLORS.secondary}>03 · Review Details</SectionHeading>
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
                                        <div key={key} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: `1px dashed ${ANIME_COLORS.primary}40`, fontFamily: monoFont, fontSize: 13 }}>
                                            <span style={{ minWidth: 120, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 10, color: ANIME_COLORS.secondary }}>{key}</span>
                                            <span style={{ color: ANIME_COLORS.text }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                                <AnimeButton bg={`${ANIME_COLORS.background}40`} fg={ANIME_COLORS.text} onClick={() => setPaymentStep("payment")}>← BACK</AnimeButton>
                                <AnimeButton type="submit" bg={ANIME_COLORS.primary} fg={ANIME_COLORS.text} disabled={isSubmitting}>
                                    {isSubmitting ? "SUBMITTING…" : "COMPLETE PURCHASE ✓"}
                                </AnimeButton>
                            </div>
                        </form>
                    )}

                </div>
            </main>
        </div>
    );
}
