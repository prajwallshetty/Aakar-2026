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
const StepPill: React.FC<{ label: string; num: number; active: boolean; done: boolean; skippable?: boolean }> = ({ label, num, active, done, skippable }) => {
    if (skippable) return null; // Used to hide Payment indicator if Total is 0
    return (
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
)};

const StepConnector: React.FC<{ done: boolean, skip?: boolean }> = ({ done, skip }) => {
    if (skip) return null;
    return (
    <div style={{ flex: 1, height: 3, marginBottom: 18, borderTop: `3px dashed ${done ? C.cyan : C.black}` }} />
)};

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
// Main component - AJIET REGISTER
// ─────────────────────────────────────────────────────────────────────────────
const AjietRegister = () => {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string | undefined }>({});
    const [generalError, setGeneralError] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrImageUrl, setQrImageUrl] = useState("");
    const [paymentStep, setPaymentStep] = useState<"details" | "payment" | "verification">("details");

    // Pre-fill and lock college field for AJIET
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", college: "A.J. Institute of Engineering & Technology",
        year: 0, department: "", usn: "",
        transactionId: "", paymentScreenshot: null as File | null,
    });

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
            } catch (error) {
                console.error("Error fetching events:", error);
            }
            setIsLoading(false);
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        
        // Strict Input Constraints
        if (id === "phone" && !/^\d*$/.test(value)) return;
        if (id === "name" && !/^[a-zA-Z\s'.\-]*$/.test(value)) return;

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
        
        // AJIET LOGIC: Solo events are completely free (fee = 0)
        setTotalAmount(selectedOptions.reduce((sum: number, event: any) => {
            const eventObj = events.find((e) => e.id === event.id);
            if (eventObj?.eventType === "Solo") return sum; // Free for AJIET!
            return sum + (eventObj?.fee || 0); // Not Solo? Normal fee.
        }, 0));
    };

    const handleParticipantCountChange = (groupId: string | number, count: number | "") => {
        const evDetail = events.find(e => e.id === Number(groupId));
        const maxLimit = evDetail ? evDetail.maxMembers - 1 : 10;
        
        const currentMembers = groupEventData[groupId]?.members || [];
        let newCount = !count ? "" : Math.max(1, count);
        
        // Ensure they cannot bypass the event's max participant limit!
        if (typeof newCount === "number" && newCount > maxLimit) {
            newCount = maxLimit;
        }

        // To prevent catastrophic data loss if a user temporarily clears the input box,
        // we will only splice down the array when `newCount` is specifically a number and lower.
        let newMembers = [...currentMembers];
        if (typeof newCount === "number") {
            if (newCount > currentMembers.length) {
                for (let i = currentMembers.length; i < newCount; i++) newMembers.push({ name: "", usn: "", email: "" });
            } else if (newCount < currentMembers.length) {
                newMembers = newMembers.slice(0, newCount);
            }
        }
        
        setGroupEventData((prev) => ({ ...prev, [groupId]: { participantCount: newCount, members: newMembers } }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB Limit
                setFormErrors({ paymentScreenshot: "File size must be strictly less than 5MB!" });
                setGeneralError("File size must be strictly less than 5MB!");
                e.target.value = "";
                return;
            }
            setFormData((prev) => ({ ...prev, paymentScreenshot: file }));
        }
    };

    const handleGroupMemberChange = (groupId: number | string, index: number, field: string, value: string) => {
        // Strict Input Constraints
        if (field === "name" && !/^[a-zA-Z\s'.\-]*$/.test(value)) return;

        setGroupEventData((prev) => {
            const updatedMembers = [...(prev[groupId]?.members || [])];
            updatedMembers[index] = { ...updatedMembers[index], [field]: value };
            return { ...prev, [groupId]: { ...prev[groupId], members: updatedMembers } };
        });
    };

    const generateQRCode = () => {
        const upiUrl = `upi://pay?pa=${encodeURIComponent("ajiet@cnrb")}&pn=${encodeURIComponent("Aakar 2026 Registration")}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent("Aakar " + formData.usn)}`;
        setQrImageUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`);
        setShowQRCode(true);
    };

    const proceedToPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = (await validateParticipantData(formData)) || {};
        
        // STRIKE-SURE AJIET STUDENT VALIDATION
        if (!formData.usn.toUpperCase().startsWith("4JK")) {
            errors.usn = "Only AJIET students (USN starting with 4JK) can use this portal.";
        }

        if (Object.keys(errors).length > 0) { setFormErrors(errors); setGeneralError("Please fix the highlighted errors below."); return; }
        if (selectedEvents.length === 0) { setFormErrors({ events: "Please select at least one event" }); setGeneralError("Please select at least one event."); return; }
        
        Object.keys(groupEventData).forEach((groupId) => {
            if (selectedEvents.find((e) => e.value === groupId || e.id === parseInt(groupId))) {
                groupEventData[groupId].members.forEach((member, index) => {
                    if (!member.name) errors[`group_${groupId}_member_${index}_name`] = "Member name is required";
                    if (!member.usn) {
                        errors[`group_${groupId}_member_${index}_usn`] = "Member USN is required";
                    } else if (!member.usn.toUpperCase().startsWith("4JK")) {
                        errors[`group_${groupId}_member_${index}_usn`] = "All teammates must be from AJIET (4JK)";
                    }
                    if (!member.email) errors[`group_${groupId}_member_${index}_email`] = "Member Email is required";
                });
            }
        });
        
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

        // AJIET BYPASS PAYMENT IF IT'S 0 (Meaning only strictly Solo Events are picked)
        if (totalAmount === 0) {
            setPaymentStep("verification");
            return;
        }

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
            let fileUrls: string[] = [];

            // ONLY execute screenshot upload if amount > 0
            if (totalAmount > 0) {
                const fileUrl = await uploadFile(
                    formData.paymentScreenshot!,
                    "paymentscreenshots"
                );

                if (!fileUrl) {
                    setIsRegistering(false);
                    setGeneralError("Payment screenshot upload failed.");
                    return;
                }
                fileUrls = [fileUrl];
            }

            const participantData: ExtendedParticipantCreateInput = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                college: "A.J. Institute of Engineering & Technology", // Forced hardcode to prevent Payload Tampering
                year: formData.year,
                department: formData.department,
                usn: formData.usn.toUpperCase(),
                transaction_ids: totalAmount > 0 ? [formData.transactionId] : [], // Empty if free
                paymentScreenshotUrls: fileUrls, // Empty if free
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
                            AJIET REGISTRATION
                        </span>
                    </div>

                </div>

                {/* Step indicator */}
                <div style={{ ...cardStyle, background: C.white, padding: "16px 28px", marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <StepPill label="Details" num={1} active={stepNum === 1} done={stepNum > 1} />
                        
                        {/* Only show payment step pill if totalAmount > 0 (or if we haven't selected anything yet) */}
                        <StepConnector skip={totalAmount === 0 && selectedEvents.length > 0} done={stepNum > 1} />
                        <StepPill skippable={totalAmount === 0 && selectedEvents.length > 0} label="Payment" num={2} active={stepNum === 2} done={stepNum > 2} />
                        
                        <StepConnector done={stepNum > 2 || (totalAmount === 0 && selectedEvents.length > 0)} />
                        <StepPill label="Confirm" num={totalAmount === 0 && selectedEvents.length > 0 ? 2 : 3} active={stepNum === 3} done={false} />
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
                                    { id: "name", label: "Full Name", placeholder: "Enter your full name", type: "text", maxLength: 50 },
                                    { id: "email", label: "Email Address", placeholder: "your@email.com", type: "email", maxLength: 100 },
                                    { id: "phone", label: "Phone Number", placeholder: "10-digit number (e.g. 9876543210)", type: "tel", maxLength: 10 },
                                    { id: "usn", label: "USN", placeholder: "4JK21CS000", type: "text", maxLength: 10 },
                                    { id: "year", label: "Year of Study", placeholder: "1, 2, 3 or 4", type: "number", maxLength: undefined },
                                ] as const).map(({ id, label, placeholder, type, maxLength }) => (
                                    <Field key={id} label={label} error={formErrors[id]}>
                                        <input type={type} id={id}
                                            value={id === "year" ? (formData.year || "") : (formData as any)[id]}
                                            onChange={handleChange} placeholder={placeholder} required
                                            min={id === "year" ? 1 : undefined} max={id === "year" ? 8 : undefined}
                                            maxLength={maxLength}
                                            className="pop-input"
                                            style={formErrors[id] ? inputError : inputBase}
                                        />
                                    </Field>
                                ))}
                                <Field label="Department" error={formErrors.department}>
                                    <select id="department" value={formData.department} onChange={handleChange} required className="pop-input" style={{ ...inputBase, ...(formErrors.department ? inputError : {}) }}>
                                        <option value="" disabled>Select your department</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                                        <option value="Computer Science & Engineering (Artificial Intelligence & Machine Learning)">Computer Science & Engineering (Artificial Intelligence & Machine Learning)</option>
                                        <option value="Computer Science & Engineering (IoT & Cyber Security including Blockchain Technology)">Computer Science & Engineering (IoT & Cyber Security including Blockchain Technology)</option>
                                        <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                                        <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                                        <option value="Electronics Engineering (VLSI Design and Technology)">Electronics Engineering (VLSI Design and Technology)</option>
                                        <option value="Information Science & Engineering">Information Science & Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Basic Science and Humanity">Basic Science and Humanity</option>
                                        <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                                        <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                                    </select>
                                </Field>
                                <div style={{ gridColumn: "1/-1" }}>
                                    <Field label="College Name (Fixed)" error={formErrors.college}>
                                        <input type="text" id="college"
                                            value={formData.college} disabled
                                            className="pop-input"
                                            style={{...inputBase, background: "#efefef", color: "#666"}}
                                        />
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
                                            const isSoloFree = ev.eventType === "Solo";
                                            return (
                                                <div key={ev.id} style={{
                                                    background: isSoloFree ? C.cyan : C.yellow, border: `2px solid ${C.black}`,
                                                    boxShadow: `2px 2px 0 ${C.black}`, padding: "4px 10px",
                                                    fontFamily: monoFont, fontSize: 11, fontWeight: 700,
                                                    display: "flex", alignItems: "center", gap: 6,
                                                }}>
                                                    {ev.eventName} · {isSoloFree ? "FREE (AJIET)" : `₹${ev.fee || 0}`}
                                                    <button type="button" onClick={() => {
                                                        const updated = selectedEvents.filter((s) => s.id !== ev.id);
                                                        setSelectedEvents(updated);
                                                        if (groupEventData[ev.id]) setGroupEventData((prev) => { const u = { ...prev }; delete u[ev.id]; return u; });
                                                        
                                                        // Explicit check during removal
                                                        setTotalAmount(events.filter((e) => updated.find((u) => u.id === e.id)).reduce((sum, e) => {
                                                            if (e.eventType === 'Solo') return sum;
                                                            return sum + (e.fee || 0);
                                                        }, 0));
                                                        
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
                            <PopButton type="submit" bg={C.pink} fg={C.white}>PROCEED TO REVIEW →</PopButton>
                        </div>
                    </form>
                )}

                {/* ── STEP 2 (Payment - Only if total > 0) ── */}
                {paymentStep === "payment" && totalAmount > 0 && (
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

                {/* ── STEP 3 (Verification / Submit) ── */}
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
                                const isSoloFree = ev.eventType === "Solo";
                                return (
                                    <div key={ev.id}>
                                        <div className="review-row">
                                            <span className="review-key">{ev.eventName} {ev.eventType === "Team" ? " (Team)" : ""}</span>
                                            <span>{isSoloFree ? "FREE (AJIET)" : `₹${ev.fee || 0}`}</span>
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

                        {/* Only show Payment Info section if they actually had to pay */}
                        {totalAmount > 0 && (
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
                        )}
                        
                        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                            <PopButton bg="#eee" fg={C.black} onClick={() => setPaymentStep(totalAmount > 0 ? "payment" : "details")}>← BACK</PopButton>
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

export default AjietRegister;
