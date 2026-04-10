"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
    registerParticipant,
    validateParticipantData
} from "@/backend/participant";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Select from "react-select";
import { getAllEvents, getEventOptions } from "@/backend/events";
import {
    CartEvents,
    ExtendedEvent,
    ExtendedParticipantCreateInput
} from "@/types";
import { eventType } from "@prisma/client";
import { uploadFile } from "@/backend/supabase";
import { ElitePassCard } from "@/components/(User)/auth/ElitePassCard";
import { 
  AnimeCardWrapper, 
  AnimeSectionHeading, 
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
  ACCENTS 
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

// ─── Anime Design tokens ────────────────────────────────────────────────────────────
const C = {
    yellow: ANIME_COLORS.accent,
    magenta: ANIME_COLORS.primary,
    cyan: ANIME_COLORS.secondary,
    pink: ANIME_COLORS.purple,
    black: ANIME_COLORS.background,
    white: ANIME_COLORS.text,
};
const popFont = "'Cinzel', Impact, serif";
const monoFont = "'Share Tech Mono', monospace";
const displayFont = "'Cinzel', Impact, serif";

// ─── Anime Style helpers ────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
    background: `${ANIME_COLORS.background}20`,
    border: `1px solid ${ANIME_COLORS.primary}`,
    boxShadow: `0 0 20px ${ANIME_COLORS.primary}40, inset 0 0 8px ${ANIME_COLORS.primary}20`,
    borderRadius: 8,
    backdropFilter: "blur(8px)",
    padding: "clamp(1.4rem,3.5vw,2.5rem)",
    position: "relative",
};

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 18px",
    background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
    border: `1px solid ${ANIME_COLORS.primary}60`, borderRadius: 8,
    boxShadow: `0 2px 10px rgba(0,0,0,0.2), inset 0 2px 8px rgba(0,0,0,0.3)`,
    fontFamily: monoFont, fontSize: 13, letterSpacing: 1,
    color: ANIME_COLORS.text,
    outline: "none", transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
    backdropFilter: "blur(8px)"
};

const inputFocusStyle: React.CSSProperties = {
    borderColor: ANIME_COLORS.secondary,
    boxShadow: `0 0 16px ${ANIME_COLORS.secondary}60, inset 0 2px 8px rgba(0,0,0,0.2)`,
    background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
};

const errorStyle: React.CSSProperties = {
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: 700,
    color: ANIME_COLORS.purple,
    letterSpacing: 1,
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    gap: 4,
};

const labelStyle: React.CSSProperties = {
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    color: ANIME_COLORS.text,
    marginBottom: 6,
    display: "block",
};

// ─── Anime Button Component ───────────────────────────────────────────────────────
const AnimeButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
    href?: string;
    bg?: string;
    fg?: string;
}> = ({ children, onClick, type = "button", disabled, href, bg = ANIME_COLORS.primary, fg = ANIME_COLORS.text }) => {
    const [hov, setHov] = useState(false);

    if (href) {
        return (
            <Link href={href}>
                <button
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                        background: disabled ? `${ANIME_COLORS.background}40` : `linear-gradient(135deg, ${bg}40, ${bg}10)`,
                        color: disabled ? `${ANIME_COLORS.text}40` : fg,
                        border: `1px solid ${disabled ? bg + '40' : bg}`,
                        boxShadow: hov && !disabled ? `0 0 25px ${bg}80` : `0 4px 15px rgba(0,0,0,0.3)`,
                        fontFamily: popFont, fontSize: 13, fontWeight: 900,
                        letterSpacing: 4, textTransform: "uppercase",
                        padding: "14px 32px",
                        cursor: disabled ? "not-allowed" : "pointer",
                        transform: hov && !disabled ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
                        transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                        display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                        borderRadius: 8,
                        backdropFilter: "blur(8px)",
                        textShadow: hov && !disabled ? `0 0 8px ${fg}80` : "none"
                    }}
                >
                    {children}
                </button>
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: disabled ? `${ANIME_COLORS.background}40` : `linear-gradient(135deg, ${bg}40, ${bg}10)`,
                color: disabled ? `${ANIME_COLORS.text}40` : fg,
                border: `1px solid ${disabled ? bg + '40' : bg}`,
                boxShadow: hov && !disabled ? `0 0 25px ${bg}80` : `0 4px 15px rgba(0,0,0,0.3)`,
                fontFamily: popFont, fontSize: 13, fontWeight: 900,
                letterSpacing: 4, textTransform: "uppercase",
                padding: "14px 32px",
                cursor: disabled ? "not-allowed" : "pointer",
                transform: hov && !disabled ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
                transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                borderRadius: 8,
                backdropFilter: "blur(8px)",
                textShadow: hov && !disabled ? `0 0 8px ${fg}80` : "none"
            }}
        >
            {children}
        </button>
    );
};

// ─── Field Component ───────────────────────────────────────────────────────────────
const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 6 }}>
        <label style={labelStyle}>{label}</label>
        {children}
        {error && <span style={errorStyle}>{error}</span>}
    </div>
);

// ─── Loading Skeleton ────────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><AnimeCardWrapper accentIndex={0} style={{ padding: 40, width: "min(600px,90vw)", position: "relative", zIndex: 1 }}>
                <AnimeSectionHeading index={1}>INITIALIZING AJIET SYSTEM</AnimeSectionHeading>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ height: 12, width: "35%", background: `${ANIME_COLORS.primary}40`, borderRadius: 4 }} />
                            <div style={{ height: 44, background: `${ANIME_COLORS.background}40`, borderRadius: 6, border: `1px solid ${ANIME_COLORS.primary}40` }} />
                        </div>
                    ))}
                </div>
            </AnimeCardWrapper>
            <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>
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
    const [upiDeepLink, setUpiDeepLink] = useState("");
    const [paymentStep, setPaymentStep] = useState<"details" | "payment" | "verification">("details");

    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", college: "A J Institute of Engineering and Technology, Mangalore",
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

        selectedOptions.forEach((event: any) => {
            const eventObj = events.find((e) => e.id === event.id);

            if (eventObj && eventObj.eventType === "Team" && !newGroupData[event.id]) {
                newGroupData[event.id] = {
                    participantCount: eventObj.minMembers - 1,
                    members: Array.from(
                        { length: eventObj.minMembers - 1 },
                        () => ({ name: "", usn: "", email: "" })
                    ),
                };
            }
        });

        Object.keys(newGroupData).forEach((groupId) => {
            if (!selectedEventIds.includes(Number(groupId))) {
                delete newGroupData[groupId];
            }
        });

        setGroupEventData(newGroupData);

        // SOLO FREE LOGIC
        const total = selectedOptions.reduce((sum: number, event: any) => {
            const eventObj = events.find((e) => e.id === event.id);

            // FREE ONLY if SOLO AND NOT SPECIAL
            if (
                eventObj?.eventType === "Solo" &&
                eventObj?.eventCategory !== "Special"
            ) {
                return sum;
            }

            return sum + (eventObj?.fee || 0);
        }, 0);

        setTotalAmount(total);
    };

    const handleParticipantCountChange = (groupId: string | number, count: number) => {
        const evDetail = events.find(e => e.id === Number(groupId));
        const maxLimit = evDetail ? evDetail.maxMembers - 1 : 10;
        const minLimit = evDetail ? evDetail.minMembers - 1 : 1;
        
        const currentMembers = groupEventData[groupId]?.members || [];
        let newCount = Math.max(minLimit, count);
        
        // Ensure they cannot bypass the event's max participant limit!
        if (newCount > maxLimit) {
            newCount = maxLimit;
        }

        let newMembers = [...currentMembers];
        if (newCount > currentMembers.length) {
            for (let i = currentMembers.length; i < newCount; i++) newMembers.push({ name: "", usn: "", email: "" });
        } else if (newCount < currentMembers.length) {
            newMembers = newMembers.slice(0, newCount);
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
        if (totalAmount <= 0) return; // safety

        const upiUrl = `upi://pay?pa=${encodeURIComponent("ajiet@cnrb")}&pn=${encodeURIComponent("Aakar Registration")}&am=${totalAmount}&cu=INR`;
        
        setUpiDeepLink(upiUrl);
        setQrImageUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`
        );

        setShowQRCode(true);
    };

    const proceedToPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = (await validateParticipantData(formData)) || {};

        if (!formData.usn.toUpperCase().startsWith("4JK")) {
            errors.usn = "Only AJIET students allowed (4JK)";
        }

        if (selectedEvents.length === 0) {
            errors.events = "Select at least one event";
        }

        // Validate Group Members
        Object.keys(groupEventData).forEach((groupId) => {
            const event = selectedEvents.find((e) => e.id === Number(groupId));
            const eventDetail = events.find((e) => e.id === Number(groupId));
            
            if (event && eventDetail) {
                const count = groupEventData[groupId].participantCount;
                if (count < eventDetail.minMembers - 1 || count > eventDetail.maxMembers - 1) {
                    errors[`group_${groupId}_count`] = `Team must have ${eventDetail.minMembers - 1}–${eventDetail.maxMembers - 1} extra members`;
                }

                groupEventData[groupId].members.forEach((member, index) => {
                    if (!member.name) errors[`group_${groupId}_member_${index}_name`] = "Member name is required";
                    if (!member.usn) {
                        errors[`group_${groupId}_member_${index}_usn`] = "Member USN is required";
                    } else if (!member.usn.toUpperCase().startsWith("4JK")) {
                        errors[`group_${groupId}_member_${index}_usn`] = "Team members must be AJIET students (4JK)";
                    }
                    if (!member.email) errors[`group_${groupId}_member_${index}_email`] = "Member email is required";
                });
            }
        });

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // IMPORTANT: SKIP PAYMENT IF FREE
        if (totalAmount === 0) {
            setPaymentStep("verification");
            return;
        }

        // Paid flow
        setPaymentStep("payment");
        generateQRCode();
    };

    const proceedToVerification = () => {
        if (totalAmount === 0) {
            setPaymentStep("verification");
            return;
        }

        if (!formData.transactionId) {
            setFormErrors({ transactionId: "Transaction ID required" });
            return;
        }

        if (!formData.paymentScreenshot) {
            setFormErrors({ paymentScreenshot: "Screenshot required" });
            return;
        }

        setPaymentStep("verification");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsRegistering(true);

        try {
            let fileUrls: string[] = [];

            // ONLY upload if paid
            if (totalAmount > 0) {
                const fileUrl = await uploadFile(
                    formData.paymentScreenshot!,
                    "paymentscreenshots"
                );

                if (!fileUrl) {
                    setGeneralError("Upload failed");
                    setIsRegistering(false);
                    return;
                }

                fileUrls = [fileUrl];
            }

            const { transactionId, paymentScreenshot, ...restFormData } = formData;

            const participantData = {
                ...restFormData,
                usn: restFormData.usn.toUpperCase(),
                transaction_ids: totalAmount > 0 && transactionId ? [transactionId] : [],
                paymentScreenshotUrls: fileUrls,
                groupMembersData: groupEventData,
                amount: totalAmount,
            };

            const result = await registerParticipant(
                participantData,
                selectedEvents.map((e) => e.id)
            );

            if (!result || result.error) {
                if (typeof result?.error === "object" && result.error !== null) {
                    setFormErrors(result.error as { [key: string]: string });
                    setGeneralError("Please fix the validation errors");
                } else {
                    setGeneralError((result?.error as string) || "Registration failed");
                }
                setIsRegistering(false);
                return;
            }

            router.replace("/registration-success");

        } catch (err) {
            console.error(err);
            setGeneralError("Something went wrong");
            setIsRegistering(false);
        }
    };

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base, 
            background: `#080a12 !important`,
            border: state.isFocused ? `1px solid ${ANIME_COLORS.primary} !important` : `1px solid ${ANIME_COLORS.primary}40`,
            borderRadius: "6px",
            boxShadow: state.isFocused ? `0 0 12px ${ANIME_COLORS.primary}40 !important` : `0 0 8px ${ANIME_COLORS.primary}20`,
            fontFamily: monoFont, fontSize: 13, minHeight: 44,
            color: `#ffffff !important`,
            "&:hover": { borderColor: ANIME_COLORS.primary },
        }),
        placeholder: (base: any) => ({
            ...base,
            color: `#ffffffb3 !important`,
            fontFamily: monoFont,
            fontSize: 13,
        }),
        input: (base: any) => ({
            ...base,
            color: `#ffffff !important`,
            fontFamily: monoFont,
            fontSize: 13,
        }),
        singleValue: (base: any) => ({
            ...base,
            color: `#ffffff !important`,
            fontFamily: monoFont,
            fontSize: 13,
        }),
        menu: (base: any) => ({
            ...base, 
            background: `#080a12 !important`, 
            border: `1px solid ${ANIME_COLORS.primary}`, 
            borderRadius: "6px",
            boxShadow: `0 10px 30px ${ANIME_COLORS.background}60`,
            position: "absolute",
            zIndex: 1000,
            backdropFilter: "blur(10px)",
        }),
        option: (base: any, state: any) => ({
            ...base,
            background: state.isSelected ? `#00e5ff40 !important` : state.isFocused ? `#ffd70040 !important` : `#080a12 !important`,
            color: `#ffffff !important`, fontFamily: monoFont, fontSize: 12, cursor: "pointer",
        }),
        multiValue: (base: any) => ({
            ...base, background: `#ff4d0040 !important`, border: `1px solid #ff4d00 !important`, borderRadius: "4px",
        }),
        multiValueLabel: (base: any) => ({ ...base, color: `#ffffff !important`, fontFamily: monoFont, fontSize: 11 }),
        multiValueRemove: (base: any) => ({ ...base, color: `#ffffff !important`, "&:hover": { background: `#b026ff !important`, color: `#ffffff !important` } }),
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
        groupHeading: (base: any) => ({
            ...base, fontFamily: popFont, fontSize: 14, letterSpacing: 2, color: `#ffffff`,
            borderBottom: `1px solid ${ANIME_COLORS.primary}40`, padding: "8px 12px",
        }),
    };

    if (isLoading) return <LoadingSkeleton />;

    const stepNum = paymentStep === "details" ? 1 : paymentStep === "payment" ? 2 : 3;

    return (
        <div style={{ minHeight: "100vh", position: "relative", padding: "clamp(3rem, 5vh, 6rem) clamp(1rem, 3vw, 2rem)", overflow: "hidden" }}>
            <style>{`${ANIME_GLOBAL_STYLES}
                /* Dropdown specific overrides to prevent global styles interference */
                div[class*="css-"][class*="control"], 
                div[class*="css-"][class*="menu"] {
                    font-family: 'Share Tech Mono', monospace !important;
                }
                div[class*="css-"][class*="control"] {
                    background: #080a12 !important;
                    color: #ffffff !important;
                }
                div[class*="css-"][class*="placeholder"] {
                    color: #ffffffb3 !important;
                    font-family: 'Share Tech Mono', monospace !important;
                }
                div[class*="css-"][class*="input"] {
                    color: #ffffff !important;
                    font-family: 'Share Tech Mono', monospace !important;
                }
                div[class*="css-"][class*="single-value"] {
                    color: #ffffff !important;
                    font-family: 'Share Tech Mono', monospace !important;
                }
                div[class*="css-"][class*="option"] {
                    color: #ffffff !important;
                    font-family: 'Share Tech Mono', monospace !important;
                    background: #080a12 !important;
                }
                div[class*="css-"][class*="option"]:hover {
                    background: #ffd70040 !important;
                    color: #ffffff !important;
                }
                div[class*="css-"][class*="option"][class*="selected"] {
                    background: #00e5ff40 !important;
                    color: #ffffff !important;
                }
                div[class*="css-"][class*="multi-value"] {
                    background: #ff4d0040 !important;
                    border: 1px solid #ff4d00 !important;
                }
                div[class*="css-"][class*="multi-value__label"] {
                    color: #ffffff !important;
                    font-family: 'Share Tech Mono', monospace !important;
                }
                div[class*="css-"][class*="multi-value__remove"] {
                    color: #ffffff !important;
                }
                div[class*="css-"][class*="multi-value__remove"]:hover {
                    background: #b026ff !important;
                    color: #ffffff !important;
                }
                /* Force dropdown menu visibility */
                div[class*="css-"][class*="menu"] {
                    background: #080a12 !important;
                    border: 1px solid #ff4d00 !important;
                    z-index: 9999 !important;
                }
                /* Additional overrides for stubborn elements */
                [class*="css-"] {
                    color: #ffffff !important;
                }
                [class*="css-"][class*="placeholder"] {
                    color: #ffffffb3 !important;
                }
                [class*="css-"][class*="option"] {
                    color: #ffffff !important;
                    background: #080a12 !important;
                }
                [class*="css-"][class*="option"]:hover,
                [class*="css-"][class*="option"]:focus {
                    background: #ffd70060 !important;
                    color: #ffffff !important;
                }
            `}</style><div style={{ maxWidth: 840, margin: "0 auto", position: "relative", zIndex: 10 }}>

                {/* Header */}
                <div style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
                    <AnimeCardWrapper accentIndex={0} style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 22px",
                        background: `${ANIME_COLORS.background}60`,
                        border: `1px solid ${ANIME_COLORS.primary}`,
                        borderRadius: 30,
                        backdropFilter: "blur(6px)",
                    }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: ANIME_COLORS.primary }} />
                        <span style={{
                            fontFamily: monoFont,
                            fontSize: "clamp(0.65rem, 2vw, 0.85rem)",
                            letterSpacing: "0.22em",
                            color: ANIME_COLORS.primary,
                            textTransform: "uppercase",
                        }}>
                            AJIET_PORTAL // REGISTRATION
                        </span>
                    </AnimeCardWrapper>
                    
                    <h1 style={{ 
                        fontFamily: displayFont, fontSize: "clamp(1.8rem, 6vw, 4rem)", 
                        letterSpacing: "0.05em", color: ANIME_COLORS.text, margin: 0, lineHeight: 1,
                        textShadow: `0 0 30px ${ANIME_COLORS.primary}45`
                    }}>
                        AJIET PORTAL
                    </h1>
                    
                    <p style={{
                        fontFamily: monoFont, fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                        letterSpacing: "0.3em", color: ANIME_COLORS.secondary, marginTop: "1rem", textTransform: "uppercase",
                        textShadow: `0 0 12px ${ANIME_COLORS.secondary}`
                    }}>
                        &gt; INTERNAL_ACCESS_GRANTED
                    </p>
                </div>

                {/* Step indicator */}
                <AnimeCardWrapper accentIndex={1} style={{ padding: "20px 30px", marginBottom: "2.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {/* Step pills would go here - simplified for now */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            fontFamily: monoFont,
                            fontSize: 12,
                            color: ANIME_COLORS.text,
                        }}>
                            <div style={{
                                width: 44, height: 44,
                                background: stepNum >= 1 ? `${ANIME_COLORS.primary}40` : `${ANIME_COLORS.background}40`,
                                border: `1px solid ${stepNum >= 1 ? ANIME_COLORS.primary : ANIME_COLORS.background}`,
                                borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: stepNum >= 1 ? ANIME_COLORS.primary : ANIME_COLORS.text,
                            }}>
                                {stepNum > 1 ? "✓" : "1"}
                            </div>
                            <div style={{ flex: 1, height: 2, background: stepNum > 1 ? ANIME_COLORS.primary : `${ANIME_COLORS.background}40` }} />
                            <div style={{
                                width: 44, height: 44,
                                background: stepNum >= 2 ? `${ANIME_COLORS.primary}40` : `${ANIME_COLORS.background}40`,
                                border: `1px solid ${stepNum >= 2 ? ANIME_COLORS.primary : ANIME_COLORS.background}`,
                                borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: stepNum >= 2 ? ANIME_COLORS.primary : ANIME_COLORS.text,
                            }}>
                                {stepNum > 2 ? "✓" : "2"}
                            </div>
                            <div style={{ flex: 1, height: 2, background: stepNum > 2 ? ANIME_COLORS.primary : `${ANIME_COLORS.background}40` }} />
                            <div style={{
                                width: 44, height: 44,
                                background: stepNum >= 3 ? `${ANIME_COLORS.primary}40` : `${ANIME_COLORS.background}40`,
                                border: `1px solid ${stepNum >= 3 ? ANIME_COLORS.primary : ANIME_COLORS.background}`,
                                borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: stepNum >= 3 ? ANIME_COLORS.primary : ANIME_COLORS.text,
                            }}>
                                3
                            </div>
                        </div>
                    </div>
                </AnimeCardWrapper>

                {/* Error */}
                {generalError && (
                    <AnimeCardWrapper accentIndex={3} style={{
                        background: `${ANIME_COLORS.purple}40`,
                        border: `1px solid ${ANIME_COLORS.purple}`,
                        padding: "16px 20px",
                        marginBottom: "2rem",
                        fontFamily: monoFont,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 12
                    }}>
                        <span style={{ fontSize: 18 }}>⚠️</span> {generalError}
                    </AnimeCardWrapper>
                )}

                {/* ── STEP 1 ── */}
                {paymentStep === "details" && (
                    <form onSubmit={proceedToPayment} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        <AnimeCardWrapper accentIndex={0} style={cardStyle}>
                            <AnimeSectionHeading index={0}>Personal Details</AnimeSectionHeading>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 16 }}>
                                {[
                                    { id: "name", label: "Full Name", placeholder: "Enter your full name", type: "text" },
                                    { id: "email", label: "Email Address", placeholder: "your.email@example.com", type: "email" },
                                    { id: "phone", label: "Phone Number", placeholder: "10-digit mobile number", type: "tel" },
                                    { id: "usn", label: "USN", placeholder: "4JKXXYYZZZ", type: "text" },
                                ].map((field) => (
                                    <Field key={field.id} label={field.label} error={formErrors[field.id]}>
                                        <input
                                            type={field.type}
                                            id={field.id}
                                            placeholder={field.placeholder}
                                            value={formData[field.id as keyof typeof formData] as string | number}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                ...inputStyle,
                                                ...(formErrors[field.id] ? { borderColor: ANIME_COLORS.purple, boxShadow: `0 0 12px ${ANIME_COLORS.purple}40` } : {})
                                            }}
                                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                                        />
                                    </Field>
                                ))}
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
                                <Field label="College" error={formErrors.college}>
                                    <input
                                        type="text"
                                        id="college"
                                        value={formData.college}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            ...inputStyle,
                                            ...(formErrors.college ? { borderColor: ANIME_COLORS.purple, boxShadow: `0 0 12px ${ANIME_COLORS.purple}40` } : {})
                                        }}
                                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                                    />
                                </Field>
                                
                                <Field label="Year of Study" error={formErrors.year}>
                                    <select
                                        id="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            ...inputStyle,
                                            ...(formErrors.year ? { borderColor: ANIME_COLORS.purple, boxShadow: `0 0 12px ${ANIME_COLORS.purple}40` } : {})
                                        }}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </Field>
                                
                                <Field label="Department" error={formErrors.department}>
                                    <input
                                        type="text"
                                        id="department"
                                        placeholder="e.g. Computer Science"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            ...inputStyle,
                                            ...(formErrors.department ? { borderColor: ANIME_COLORS.purple, boxShadow: `0 0 12px ${ANIME_COLORS.purple}40` } : {})
                                        }}
                                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                                    />
                                </Field>
                            </div>
                        </AnimeCardWrapper>

                        {/* Team Member Forms */}
                        {selectedEvents.map((event) => {
                            if (event?.type !== "Team") return null;
                            const eventDetail = events.find((e) => e.id === event.id);
                            const groupData = groupEventData[event.id] || {
                                participantCount: eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1,
                                members: Array.from({ length: eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1 }, () => ({ name: "", email: "", usn: "" })),
                            };
                            return (
                                <AnimeCardWrapper key={event.id} accentIndex={2} style={{ ...cardStyle, marginTop: 32 }}>
                                    <AnimeSectionHeading index={2}>👥 {event.label} Details</AnimeSectionHeading>
                                    
                                    <div style={{ marginBottom: 20 }}>
                                        <Field label="Additional Team Members" error={formErrors[`group_${event.id}_count`]}>
                                            <input 
                                                type="number"
                                                min={eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1}
                                                max={eventDetail?.maxMembers ? eventDetail.maxMembers - 1 : 10}
                                                step={1}
                                                value={groupData.participantCount || ""}
                                                onChange={(e) => handleParticipantCountChange(event.id, parseInt(e.target.value) || 0)}
                                                style={{ ...inputStyle, maxWidth: 120 }}
                                            />
                                            <p style={{ fontFamily: monoFont, fontSize: 10, color: ANIME_COLORS.secondary, marginTop: 4, letterSpacing: 1 }}>
                                                Total team size: {groupData.participantCount + 1} (Leader + Members)
                                            </p>
                                        </Field>
                                    </div>

                                    {groupData.members.map((member, index) => (
                                        <div key={index} style={{ 
                                            background: `${ANIME_COLORS.background}40`, 
                                            border: `1px solid ${ANIME_COLORS.primary}40`, 
                                            padding: 16, 
                                            borderRadius: 8, 
                                            marginTop: 16,
                                            position: "relative"
                                        }}>
                                            <div style={{ 
                                                fontFamily: monoFont, 
                                                fontSize: 10, 
                                                letterSpacing: 2, 
                                                color: ANIME_COLORS.primary,
                                                marginBottom: 12,
                                                textTransform: "uppercase"
                                            }}>
                                                Member {index + 1}
                                            </div>
                                            
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                                                <Field label="Full Name" error={formErrors[`group_${event.id}_member_${index}_name`]}>
                                                    <input
                                                        type="text"
                                                        placeholder="Member Name"
                                                        value={member.name}
                                                        onChange={(e) => handleGroupMemberChange(event.id, index, "name", e.target.value)}
                                                        style={{
                                                            ...inputStyle,
                                                            ...(formErrors[`group_${event.id}_member_${index}_name`] ? { borderColor: ANIME_COLORS.purple } : {})
                                                        }}
                                                    />
                                                </Field>
                                                <Field label="USN" error={formErrors[`group_${event.id}_member_${index}_usn`]}>
                                                    <input
                                                        type="text"
                                                        placeholder="4JKXXYYZZZ"
                                                        value={member.usn}
                                                        onChange={(e) => handleGroupMemberChange(event.id, index, "usn", e.target.value.toUpperCase())}
                                                        style={{
                                                            ...inputStyle,
                                                            ...(formErrors[`group_${event.id}_member_${index}_usn`] ? { borderColor: ANIME_COLORS.purple } : {})
                                                        }}
                                                    />
                                                </Field>
                                                <Field label="Email" error={formErrors[`group_${event.id}_member_${index}_email`]}>
                                                    <input
                                                        type="email"
                                                        placeholder="member@email.com"
                                                        value={member.email}
                                                        onChange={(e) => handleGroupMemberChange(event.id, index, "email", e.target.value.toLowerCase())}
                                                        style={{
                                                            ...inputStyle,
                                                            ...(formErrors[`group_${event.id}_member_${index}_email`] ? { borderColor: ANIME_COLORS.purple } : {})
                                                        }}
                                                    />
                                                </Field>
                                            </div>
                                        </div>
                                    ))}
                                </AnimeCardWrapper>
                            );
                        })}

                        <AnimeCardWrapper accentIndex={1} style={{ ...cardStyle, marginTop: 32 }}>
                            <AnimeSectionHeading index={1}>Event Selection</AnimeSectionHeading>
                            
                            <Field label="Select Events" error={formErrors.events}>
                                <Select
                                    isMulti
                                    options={eventOptions}
                                    value={selectedEvents}
                                    onChange={handleEventSelection}
                                    styles={selectStyles}
                                    placeholder="Choose events to participate in..."
                                    menuPortalTarget={document.body}
                                    menuShouldScrollIntoView={false}
                                />
                            </Field>

                            {selectedEvents.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <h4 style={{ 
                                        fontFamily: popFont, 
                                        fontSize: 14, 
                                        color: ANIME_COLORS.text, 
                                        marginBottom: 12,
                                        letterSpacing: 2
                                    }}>
                                        Selected Events: {selectedEvents.length}
                                    </h4>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {selectedEvents.map((event) => (
                                            <div key={event.id} style={{
                                                background: `${ANIME_COLORS.primary}40`,
                                                border: `1px solid ${ANIME_COLORS.primary}`,
                                                padding: "4px 12px",
                                                borderRadius: 20,
                                                fontFamily: monoFont,
                                                fontSize: 11,
                                                color: ANIME_COLORS.text
                                            }}>
                                                {event.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {totalAmount > 0 && (
                                <div style={{
                                    background: `${ANIME_COLORS.accent}40`,
                                    border: `1px solid ${ANIME_COLORS.accent}`,
                                    padding: "16px",
                                    borderRadius: 8,
                                    marginTop: 16,
                                    textAlign: "center"
                                }}>
                                    <div style={{ fontFamily: popFont, fontSize: 16, color: ANIME_COLORS.accent, letterSpacing: 2 }}>
                                        Total Amount: ₹{totalAmount}
                                    </div>
                                </div>
                            )}
                        </AnimeCardWrapper>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                            <AnimeButton type="submit" disabled={isRegistering}>
                                {isRegistering ? "Processing..." : totalAmount === 0 ? "Register Now" : "Proceed to Payment"}
                            </AnimeButton>
                        </div>
                    </form>
                )}

                {/* ── STEP 2 ── */}
                {paymentStep === "payment" && (
                    <AnimeCardWrapper accentIndex={2} style={cardStyle}>
                        <AnimeSectionHeading index={2}>Payment Details</AnimeSectionHeading>
                        
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <div style={{ fontFamily: popFont, fontSize: 24, color: ANIME_COLORS.accent, letterSpacing: 2 }}>
                                Amount to Pay: ₹{totalAmount}
                            </div>
                        </div>

                        {showQRCode && qrImageUrl && (
                            <div style={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                marginBottom: 24,
                                width: "100%"
                            }}>
                                <img 
                                    src={qrImageUrl} 
                                    alt="Payment QR Code" 
                                    style={{ 
                                        maxWidth: 200, 
                                        height: 200, 
                                        border: `2px solid ${ANIME_COLORS.primary}`, 
                                        borderRadius: 8,
                                        display: "block",
                                        margin: "0 auto"
                                    }} 
                                />
                                <p style={{ 
                                    fontFamily: monoFont, 
                                    fontSize: 12, 
                                    color: ANIME_COLORS.text, 
                                    opacity: 0.6,
                                    marginTop: 8,
                                    textAlign: "center"
                                }}>
                                    Scan QR code to pay
                                </p>
                                
                                {/* UPI Deep Link Button */}
                                <a
                                    href={upiDeepLink}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        color: "rgba(255,255,255,0.85)",
                                        fontFamily: monoFont,
                                        fontSize: 13,
                                        padding: "10px 20px",
                                        borderRadius: 6,
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        transition: "background 0.2s",
                                        marginTop: 8,
                                    }}
                                >
                                    📱 Pay via UPI App
                                </a>
                                <p style={{
                                    fontFamily: monoFont,
                                    fontSize: 11,
                                    color: `${ANIME_COLORS.text}60`,
                                    textAlign: "center",
                                    margin: "6px 0 0",
                                }}>
                                    Opens GPay / PhonePe with ₹{totalAmount} pre-filled · return here to upload screenshot
                                </p>
                            </div>
                        )}

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 16 }}>
                            <Field label="Transaction ID" error={formErrors.transactionId}>
                                <input
                                    type="text"
                                    id="transactionId"
                                    placeholder="Enter UPI transaction ID"
                                    value={formData.transactionId}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        ...inputStyle,
                                        ...(formErrors.transactionId ? { borderColor: ANIME_COLORS.purple, boxShadow: `0 0 12px ${ANIME_COLORS.purple}40` } : {})
                                    }}
                                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                                />
                            </Field>
                            
                            <Field label="Payment Screenshot" error={formErrors.paymentScreenshot}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    required
                                    style={{
                                        ...inputStyle,
                                        border: `1px dashed ${ANIME_COLORS.primary}`,
                                        background: `${ANIME_COLORS.background}20`,
                                        cursor: "pointer"
                                    }}
                                />
                            </Field>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
                            <AnimeButton onClick={() => setPaymentStep("details")} bg={ANIME_COLORS.background}>
                                Back
                            </AnimeButton>
                            <AnimeButton onClick={proceedToVerification} disabled={isRegistering}>
                                Verify & Submit
                            </AnimeButton>
                        </div>
                    </AnimeCardWrapper>
                )}

                {/* ── STEP 3 ── */}
                {paymentStep === "verification" && (
                    <AnimeCardWrapper accentIndex={3} style={cardStyle}>
                        <AnimeSectionHeading index={3}>Final Verification</AnimeSectionHeading>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                            <div style={{ fontFamily: monoFont, fontSize: 13, color: ANIME_COLORS.text }}>
                                <strong>Name:</strong> {formData.name}
                            </div>
                            <div style={{ fontFamily: monoFont, fontSize: 13, color: ANIME_COLORS.text }}>
                                <strong>Email:</strong> {formData.email}
                            </div>
                            <div style={{ fontFamily: monoFont, fontSize: 13, color: ANIME_COLORS.text }}>
                                <strong>Phone:</strong> {formData.phone}
                            </div>
                            <div style={{ fontFamily: monoFont, fontSize: 13, color: ANIME_COLORS.text }}>
                                <strong>USN:</strong> {formData.usn}
                            </div>
                            <div style={{ fontFamily: monoFont, fontSize: 13, color: ANIME_COLORS.text }}>
                                <strong>College:</strong> {formData.college}
                            </div>
                            <div style={{ fontFamily: monoFont, fontSize: 13, color: ANIME_COLORS.text }}>
                                <strong>Events:</strong> {selectedEvents.map(e => e.label).join(", ")}
                            </div>
                            {selectedEvents.some(e => e.type === "Team") && (
                                <div style={{ borderLeft: `2px solid ${ANIME_COLORS.primary}40`, paddingLeft: 16, marginTop: 8 }}>
                                    <h5 style={{ fontFamily: popFont, fontSize: 12, color: ANIME_COLORS.primary, letterSpacing: 2, marginBottom: 8 }}>TEAM MEMBERS DETAILS</h5>
                                    {selectedEvents.filter(e => e.type === "Team").map(event => (
                                        <div key={event.id} style={{ marginBottom: 12 }}>
                                            <div style={{ fontFamily: monoFont, fontSize: 11, color: ANIME_COLORS.secondary, textTransform: "uppercase" }}>{event.label}:</div>
                                            {groupEventData[event.id]?.members.map((m, i) => (
                                                <div key={i} style={{ fontFamily: monoFont, fontSize: 11, color: ANIME_COLORS.text, marginLeft: 8 }}>
                                                    Member {i + 1}: {m.name} ({m.usn} | {m.email})
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {totalAmount > 0 && (
                                <div style={{ fontFamily: monoFont, fontSize: 13, color: ANIME_COLORS.accent, marginTop: 8 }}>
                                    <strong>Amount:</strong> ₹{totalAmount}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                                <AnimeButton type="button" onClick={() => setPaymentStep("details")} bg={ANIME_COLORS.background}>
                                    Back
                                </AnimeButton>
                                <AnimeButton type="submit" disabled={isRegistering}>
                                    {isRegistering ? (
                                        <>
                                            <svg style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke={ANIME_COLORS.text} strokeWidth="3" opacity="0.3" />
                                                <path d="M12 2a10 10 0 0 1 10 10" stroke={ANIME_COLORS.text} strokeWidth="3" strokeLinecap="round" />
                                            </svg>
                                            REGISTERING…
                                        </>
                                    ) : "COMPLETE REGISTRATION ✓"}
                                </AnimeButton>
                            </div>
                        </form>
                    </AnimeCardWrapper>
                )}
            </div>
        </div>
    );
};

export default AjietRegister;
