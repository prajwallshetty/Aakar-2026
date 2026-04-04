"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { cinzelFont } from "@/lib/font";
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
import { ElitePassCard } from "@/components/(User)/auth/ElitePassCard";
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

// ─── Anime Design tokens ────────────────────────────────────────────────────────────
const C = {
    yellow: ANIME_COLORS.accent,
    magenta: ANIME_COLORS.primary,
    cyan: ANIME_COLORS.secondary,
    pink: ANIME_COLORS.purple,
    black: ANIME_COLORS.background,
    white: ANIME_COLORS.text,
};
const popFont = cinzelFont.style.fontFamily;
const monoFont = "'Share Tech Mono', monospace";
const displayFont = cinzelFont.style.fontFamily;

// ─── Anime Style helpers ────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
    background: `${ANIME_COLORS.background}20`,
    border: `1px solid ${ANIME_COLORS.primary}`,
    boxShadow: `0 0 20px ${ANIME_COLORS.primary}40, inset 0 0 8px ${ANIME_COLORS.primary}20`,
    borderRadius: 8,
    backdropFilter: "blur(8px)",
};

const sectionHeaderStyle = (bg: string): React.CSSProperties => ({
    background: `${bg}20`,
    border: `1px solid ${bg}`,
    boxShadow: `0 0 12px ${bg}40, inset 0 0 4px ${bg}20`,
    padding: "8px 20px",
    fontFamily: popFont,
    fontSize: 14, fontWeight: 900,
    letterSpacing: 4,
    textTransform: "uppercase" as const,
    color: ANIME_COLORS.text,
    display: "inline-block",
    marginBottom: 16,
    borderRadius: 4,
    backdropFilter: "blur(4px)"
});

const labelStyle: React.CSSProperties = {
    fontFamily: monoFont, fontSize: 11, fontWeight: 700,
    letterSpacing: 3, textTransform: "uppercase" as const,
    color: ANIME_COLORS.secondary, marginBottom: 6, display: "block",
};

const inputBase: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    border: `1px solid ${ANIME_COLORS.primary}`, borderRadius: 6,
    boxShadow: `0 0 8px ${ANIME_COLORS.primary}20, inset 0 0 4px ${ANIME_COLORS.primary}10`,
    fontFamily: monoFont, fontSize: 14,
    background: `${ANIME_COLORS.background}40`,
    color: ANIME_COLORS.text,
    outline: "none", transition: "all 0.2s",
    appearance: "none" as const,
    backdropFilter: "blur(4px)"
};

const inputError: React.CSSProperties = {
    ...inputBase,
    border: `1px solid ${ANIME_COLORS.purple}`,
    boxShadow: `0 0 12px ${ANIME_COLORS.purple}40, inset 0 0 6px ${ANIME_COLORS.purple}20`,
    background: `${ANIME_COLORS.purple}10`
};

const errorMsg: React.CSSProperties = {
    fontFamily: monoFont, fontSize: 11, fontWeight: 700,
    color: ANIME_COLORS.purple, letterSpacing: 1, marginTop: 4,
    display: "flex", alignItems: "center", gap: 4,
};

// ─── Anime Button ───────────────────────────────────────────────────────────
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
        <button type={type} onClick={onClick} disabled={disabled}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: disabled ? `${ANIME_COLORS.background}40` : `${bg}20`,
                color: disabled ? `${ANIME_COLORS.text}40` : fg,
                border: `1px solid ${bg}`,
                boxShadow: hov && !disabled ? `0 0 20px ${bg}60` : `0 0 8px ${bg}40`,
                fontFamily: popFont, fontSize: 14, fontWeight: 900,
                letterSpacing: 3, textTransform: "uppercase" as const,
                padding: "14px 32px",
                cursor: disabled ? "not-allowed" : "pointer",
                transform: hov && !disabled ? "translateY(-2px)" : "none",
                transition: "all 0.2s",
                display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                borderRadius: 6,
                backdropFilter: "blur(4px)"
            }}>
            {children}
        </button>
    );
};

// ─── Anime Step indicator ───────────────────────────────────────────────────────────
const AnimeStepPill: React.FC<{ label: string; num: number; active: boolean; done: boolean }> = ({ label, num, active, done }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{
            width: 44, height: 44,
            background: done ? `${ANIME_COLORS.secondary}40` : active ? `${ANIME_COLORS.accent}40` : `${ANIME_COLORS.background}40`,
            border: `1px solid ${done ? ANIME_COLORS.secondary : active ? ANIME_COLORS.accent : ANIME_COLORS.primary}`,
            boxShadow: active ? `0 0 16px ${ANIME_COLORS.accent}60` : `0 0 8px ${ANIME_COLORS.primary}40`,
            fontFamily: popFont, fontSize: 18, fontWeight: 900, color: ANIME_COLORS.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: active ? "rotate(-4deg)" : "none",
            borderRadius: 8,
            backdropFilter: "blur(4px)"
        }}>
            {done ? "✓" : num}
        </div>
        <span style={{ fontFamily: monoFont, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: ANIME_COLORS.secondary }}>
            {label}
        </span>
    </div>
);

const AnimeStepConnector: React.FC<{ done: boolean }> = ({ done }) => (
    <div style={{ flex: 1, height: 2, marginBottom: 20, borderTop: `2px dashed ${done ? ANIME_COLORS.secondary : ANIME_COLORS.primary}`, opacity: done ? 0.8 : 0.4 }} />
);

// ─── Anime Section card ─────────────────────────────────────────────────────────────
const AnimeSectionCard: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
    <AnimeCardWrapper accentIndex={0} style={{ padding: 28, marginBottom: 24 }}>
        <AnimeSectionHeading index={0}>{title}</AnimeSectionHeading>
        {children}
    </AnimeCardWrapper>
);

// ─── Anime Field wrapper ────────────────────────────────────────────────────────────
const AnimeField: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 8 }}>
        <label style={labelStyle}>{label}</label>
        {children}
        {error && <span style={errorMsg}>{error}</span>}
    </div>
);

// ─── Anime Loading skeleton ─────────────────────────────────────────────────────────
function AnimeLoadingSkeleton() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <AnimeOrbField />
            <AnimeParticleField />
            <AnimeCardWrapper accentIndex={0} style={{ padding: 40, width: "min(600px,90vw)", position: "relative", zIndex: 1 }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${ANIME_COLORS.primary}, ${ANIME_COLORS.secondary})`, marginBottom: 24, borderRadius: 2 }} />
                <AnimeSectionHeading index={0}>Loading Events…</AnimeSectionHeading>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ height: 12, width: "35%", background: `${ANIME_COLORS.background}40`, border: `1px solid ${ANIME_COLORS.primary}`, borderRadius: 4 }} />
                            <div style={{ height: 44, background: `${ANIME_COLORS.background}20`, border: `1px solid ${ANIME_COLORS.primary}`, borderRadius: 6 }} />
                        </div>
                    ))}
                </div>
            </AnimeCardWrapper>
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

    const colleges = [
        "A J Institute of Engineering and Technology, Mangalore",
        "Alva's Institute of Engineering Technology, Moodbidri",
        "Canara Engineering College, Mangalore",
        "Manipal Institute of Technology, Manipal",
        "NITK, Surathkal",
        "St. Mary's College, Shirva",
    ].sort((a, b) => a.localeCompare(b));

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base, 
            border: `1px solid ${ANIME_COLORS.primary} !important`, 
            borderRadius: 6,
            boxShadow: state.isFocused ? `0 0 12px ${ANIME_COLORS.secondary}60 !important` : `0 0 8px ${ANIME_COLORS.primary}40 !important`,
            fontFamily: monoFont, 
            fontSize: 14, 
            minHeight: 48, 
            background: `#080a12 !important`,
            color: `#ffffff !important`,
            "&:hover": { borderColor: `${ANIME_COLORS.secondary} !important` },
            backdropFilter: "blur(4px)"
        }),
        placeholder: (base: any) => ({
            ...base,
            color: `#ffffffb3 !important`,
            fontFamily: monoFont,
            fontSize: 14,
        }),
        input: (base: any) => ({
            ...base,
            color: `#ffffff !important`,
            fontFamily: monoFont,
            fontSize: 14,
        }),
        singleValue: (base: any) => ({
            ...base,
            color: `#ffffff !important`,
            fontFamily: monoFont,
            fontSize: 14,
        }),
        menu: (base: any) => ({
            ...base, 
            border: `1px solid ${ANIME_COLORS.primary} !important`, 
            borderRadius: 8,
            boxShadow: `0 0 20px ${ANIME_COLORS.primary}60 !important`, 
            fontFamily: monoFont, 
            fontSize: 13,
            background: `#080a12 !important`,
            backdropFilter: "blur(8px)",
            zIndex: 50
        }),
        option: (base: any, state: any) => ({
            ...base,
            background: state.isSelected ? `#00e5ff40 !important` : state.isFocused ? `#ffd70040 !important` : `#080a12 !important`,
            color: `#ffffff !important`, 
            fontFamily: monoFont, 
            fontSize: 13, 
            cursor: "pointer",
        }),
        multiValue: (base: any) => ({
            ...base, background: `${ANIME_COLORS.primary}40 !important`, border: `1px solid ${ANIME_COLORS.primary} !important`, borderRadius: 4,
        }),
        multiValueLabel: (base: any) => ({ ...base, color: `${ANIME_COLORS.text} !important`, fontFamily: monoFont, fontSize: 12, fontWeight: 700 }),
        multiValueRemove: (base: any) => ({ ...base, color: `${ANIME_COLORS.text} !important`, "&:hover": { background: `${ANIME_COLORS.purple} !important`, color: `${ANIME_COLORS.text} !important` } }),
        menuPortal: (base: any) => ({ ...base, zIndex: 1000 }),
        groupHeading: (base: any) => ({
            ...base, fontFamily: popFont, fontSize: 11, letterSpacing: 3, color: ANIME_COLORS.text,
            background: `${ANIME_COLORS.accent}40`, borderBottom: `1px solid ${ANIME_COLORS.primary}`, padding: "8px 16px",
        }),
    };

    if (isLoading) return <AnimeLoadingSkeleton />;

    const stepNum = paymentStep === "details" ? 1 : paymentStep === "payment" ? 2 : 3;

    return (
        <div style={{ minHeight: "100vh", position: "relative", padding: "32px 16px 80px" }}>
            <style>{`
                ${ANIME_GLOBAL_STYLES}
                @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }
                @keyframes popIn {
                    0%   { transform: scale(0) rotate(-6deg); opacity: 0; }
                    70%  { transform: scale(1.04) rotate(1deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .anime-input:focus { box-shadow: 0 0 16px ${ANIME_COLORS.secondary}60 !important; border-color: ${ANIME_COLORS.secondary} !important; outline: none; }
                .anime-input::placeholder { color: ${ANIME_COLORS.text}60; font-style: italic; }
                .anime-file-input { width:100%; padding:12px 16px; border:1px dashed ${ANIME_COLORS.primary}; background:${ANIME_COLORS.background}40; font-family:'Share Tech Mono',monospace; font-size:14px; cursor:pointer; border-radius:6px; color:${ANIME_COLORS.text}; }
                .anime-file-input:focus { outline:none; border-style:solid; border-color:${ANIME_COLORS.secondary}; }
                .review-row { display:flex; gap:8px; padding:8px 0; border-bottom:1px dashed ${ANIME_COLORS.primary}; font-family:'Share Tech Mono',monospace; font-size:13px; color:${ANIME_COLORS.text}; }
                .review-row:last-child { border-bottom:none; }
                .review-key { font-weight:700; letter-spacing:2px; text-transform:uppercase; font-size:10px; color:${ANIME_COLORS.secondary}; min-width:110px; flex-shrink:0; }
                
                /* Remove global text override that might interfere with dropdown */
                /* Global text color override to prevent black text - REMOVED for dropdown compatibility */
                /* * { color: ${ANIME_COLORS.text} !important; } */
                input, select, textarea { color: ${ANIME_COLORS.text} !important; }
                strong, b { color: ${ANIME_COLORS.accent} !important; }
                
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
            `}</style>

            <AnimeOrbField />
            <AnimeParticleField />

            <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1, padding: "0 16px" }}>

                {/* Header */}
                <div style={{ marginBottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, animation: "popIn 0.7s cubic-bezier(.175,.885,.32,1.275) both" }}>
                    <AnimeCardWrapper accentIndex={0} style={{ padding: "12px 48px" }}>
                        <span style={{ fontFamily: displayFont, fontSize: "clamp(32px,6vw,64px)", letterSpacing: 8, color: ANIME_COLORS.text }}>
                                REGISTER
                        </span>
                    </AnimeCardWrapper>
                </div>

                {/* Step indicator */}
                <AnimeCardWrapper accentIndex={1} style={{ padding: "24px 40px", marginBottom: 40 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <AnimeStepPill label="Details" num={1} active={stepNum === 1} done={stepNum > 1} />
                        <AnimeStepConnector done={stepNum > 1} />
                        <AnimeStepPill label="Payment" num={2} active={stepNum === 2} done={stepNum > 2} />
                        <AnimeStepConnector done={stepNum > 2} />
                        <AnimeStepPill label="Confirm" num={3} active={stepNum === 3} done={false} />
                    </div>
                </AnimeCardWrapper>

                {/* Error */}
                {generalError && (
                    <AnimeCardWrapper accentIndex={2} style={{ padding: "20px 32px", marginBottom: 32, background: `${ANIME_COLORS.purple}20`, border: `1px solid ${ANIME_COLORS.purple}` }}>
                        <span style={{ fontFamily: monoFont, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: ANIME_COLORS.text }}>
                            {generalError}
                        </span>
                    </AnimeCardWrapper>
                )}

                {/* ── STEP 1 ── */}
                {paymentStep === "details" && (
                    <form onSubmit={proceedToPayment} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        <AnimeSectionCard title="01 · Personal Info" color={ANIME_COLORS.secondary}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
                                {[
                                    { id: "name", label: "Full Name", placeholder: "Enter your full name", type: "text" },
                                    { id: "email", label: "Email Address", placeholder: "your@email.com", type: "email" },
                                    { id: "phone", label: "Phone Number", placeholder: "+91 XXXXXXXXXX", type: "tel" },
                                    { id: "usn", label: "USN", placeholder: "1AJ21CS000", type: "text" },
                                    { id: "year", label: "Year of Study", placeholder: "1, 2, 3 or 4", type: "number" },
                                    { id: "department", label: "Department", placeholder: "e.g. Computer Science", type: "text" },
                                ].map(({ id, label, placeholder, type }) => (
                                    <AnimeField key={id} label={label} error={formErrors[id]}>
                                        <input type={type} id={id}
                                            value={id === "year" ? (formData.year || "") : (formData as any)[id]}
                                            onChange={handleChange} placeholder={placeholder} required
                                            min={id === "year" ? 1 : undefined} max={id === "year" ? 8 : undefined}
                                            className="anime-input"
                                            style={formErrors[id] ? inputError : inputBase}
                                        />
                                    </AnimeField>
                                ))}
                                <div style={{ gridColumn: "1/-1" }}>
                                    <AnimeField label="College Name" error={formErrors.college}>
                                        <input type="text" id="college" list="collegeList"
                                            value={formData.college} onChange={handleChange}
                                            placeholder="Search or type your college" required
                                            className="anime-input"
                                            style={formErrors.college ? inputError : inputBase}
                                        />
                                        <datalist id="collegeList">
                                            {colleges.map((c) => <option key={c} value={c} />)}
                                        </datalist>
                                    </AnimeField>
                                </div>
                            </div>
                        </AnimeSectionCard>

                        <div style={{ marginBottom: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                            <ElitePassCard />
                        </div>

                        <AnimeSectionCard title="02 · Pick Your Events" color={ANIME_COLORS.primary}>
                            {selectedEvents.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                                        {selectedEvents.map((se) => {
                                            const ev = events.find((e) => e.id === se.id);
                                            if (!ev) return null;
                                            return (
                                                <div key={ev.id} style={{
                                                    background: `${ANIME_COLORS.accent}40`, border: `1px solid ${ANIME_COLORS.accent}`,
                                                    boxShadow: `0 0 8px ${ANIME_COLORS.accent}40`, padding: "6px 12px",
                                                    fontFamily: monoFont, fontSize: 11, fontWeight: 700,
                                                    display: "flex", alignItems: "center", gap: 6, borderRadius: 4,
                                                }}>
                                                    {ev.eventName} · ₹{ev.fee || 0}
                                                    <button type="button" onClick={() => {
                                                        const updated = selectedEvents.filter((s) => s.id !== ev.id);
                                                        setSelectedEvents(updated);
                                                        if (groupEventData[ev.id]) setGroupEventData((prev) => { const u = { ...prev }; delete u[ev.id]; return u; });
                                                        setTotalAmount(events.filter((e) => updated.find((u) => u.id === e.id)).reduce((s, e) => s + (e.fee || 0), 0));
                                                    }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 900, fontSize: 14, color: ANIME_COLORS.purple, padding: 0 }}>
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{
                                        background: `${ANIME_COLORS.background}40`, color: ANIME_COLORS.accent,
                                        border: `1px solid ${ANIME_COLORS.accent}`, boxShadow: `0 0 12px ${ANIME_COLORS.accent}40`,
                                        padding: "10px 20px", display: "inline-block",
                                        fontFamily: popFont, fontSize: 16, fontWeight: 900, letterSpacing: 2,
                                        borderRadius: 6,
                                    }}>
                                        TOTAL: ₹{totalAmount}
                                    </div>
                                </div>
                            )}
                            <AnimeField label="Add Events" error={formErrors.events}>
                                <Select id="events" instanceId="events-select"
                                    options={eventOptions} isMulti value={selectedEvents}
                                    onChange={handleEventSelection} placeholder="Search and select events…"
                                    styles={selectStyles}
                                    menuPortalTarget={document.body}
                                />
                            </AnimeField>
                        </AnimeSectionCard>

                        {selectedEvents.map((event) => {
                            if (event?.type !== "Team") return null;
                            const eventDetail = events.find((e) => e.id === event.id);
                            const groupData = groupEventData[event.id] || {
                                participantCount: eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1,
                                members: Array.from({ length: eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1 }, () => ({ name: "", email: "", usn: "" })),
                            };
                            const invalid = eventDetail && (groupData.participantCount < (eventDetail.minMembers - 1) || groupData.participantCount > (eventDetail.maxMembers - 1));
                            return (
                                <AnimeSectionCard key={event.id} title={`👥 ${event.label} — Team`} color={ANIME_COLORS.accent}>
                                    <AnimeField label="Team Members (excluding leader)" error={invalid ? `Must be ${eventDetail.minMembers - 1}–${eventDetail.maxMembers - 1}` : undefined}>
                                        <input type="number"
                                            min={eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1}
                                            max={eventDetail?.maxMembers ? eventDetail.maxMembers - 1 : 10}
                                            step={1} value={groupData.participantCount || ""}
                                            onChange={(e) => handleParticipantCountChange(event.id, parseInt(e.target.value) || "")}
                                            className="anime-input" style={{ ...inputBase, maxWidth: 120 }}
                                        />
                                    </AnimeField>
                                    {groupData.members.map((member, index) => (
                                        <div key={index} style={{ ...cardStyle, background: `${ANIME_COLORS.background}20`, padding: 20, marginTop: 16, borderRadius: 8 }}>
                                            <div style={{ ...sectionHeaderStyle(ANIME_COLORS.secondary), fontSize: 10, marginBottom: 12 }}>MEMBER {index + 1}</div>
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                                                {[
                                                    { field: "name", label: "Full Name", placeholder: "Member Name" },
                                                    { field: "usn", label: "USN", placeholder: "Member USN" },
                                                    { field: "email", label: "Email", placeholder: "Member Email" },
                                                ].map(({ field, label, placeholder }) => (
                                                    <AnimeField key={field} label={label} error={formErrors[`group_${event.id}_member_${index}_${field}`]}>
                                                        <input type="text" value={(member as any)[field] || ""}
                                                            onChange={(e) => handleGroupMemberChange(event.id, index, field,
                                                                field === "usn" ? e.target.value.toUpperCase() : field === "email" ? e.target.value.toLowerCase() : e.target.value)}
                                                            placeholder={placeholder} className="anime-input"
                                                            style={formErrors[`group_${event.id}_member_${index}_${field}`] ? inputError : inputBase}
                                                        />
                                                    </AnimeField>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </AnimeSectionCard>
                            );
                        })}

                        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                            <AnimeButton type="submit" bg={ANIME_COLORS.primary} fg={ANIME_COLORS.text}>PROCEED TO PAYMENT →</AnimeButton>
                        </div>
                    </form>
                )}

                {/* ── STEP 2 ── */}
                {paymentStep === "payment" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <AnimeSectionCard title="💰 Payment" color={ANIME_COLORS.accent}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                                <div style={{ background: `${ANIME_COLORS.background}40`, border: `1px solid ${ANIME_COLORS.primary}`, boxShadow: `0 0 16px ${ANIME_COLORS.primary}40`, padding: "16px 40px", borderRadius: 8 }}>
                                    <span style={{ fontFamily: displayFont, fontSize: 48, letterSpacing: 4, color: ANIME_COLORS.accent }}>₹{totalAmount}</span>
                                </div>
                                <div style={{ fontFamily: monoFont, fontSize: 14, letterSpacing: 2, color: ANIME_COLORS.text, textAlign: "center" }}>
                                    Scan QR code to pay via UPI · <strong style={{ color: ANIME_COLORS.accent }}>ajiet@cnrb</strong>
                                </div>
                                {showQRCode ? (
                                    <AnimeCardWrapper accentIndex={0} style={{ padding: 16 }}>
                                        <img src={qrImageUrl || "/logo.svg"} alt="UPI QR Code" style={{ width: 200, height: 200, display: "block", margin: "0 auto" }} />
                                        <div style={{ textAlign: "center", fontFamily: monoFont, fontSize: 10, fontWeight: 700, letterSpacing: 3, marginTop: 12, textTransform: "uppercase", color: ANIME_COLORS.secondary }}>
                                            UPI · ajiet@cnrb
                                        </div>
                                    </AnimeCardWrapper>
                                ) : (
                                    <AnimeButton bg={ANIME_COLORS.secondary} fg={ANIME_COLORS.text} onClick={generateQRCode}>GENERATE QR CODE</AnimeButton>
                                )}
                                <div style={{ width: "100%" }}>
                                    <AnimeCardWrapper accentIndex={1} style={{ padding: 24 }}>
                                        <AnimeSectionHeading index={1}>After Payment</AnimeSectionHeading>
                                        <AnimeField label="Transaction ID / Reference Number" error={formErrors.transactionId}>
                                            <input type="text" id="transactionId" value={formData.transactionId} onChange={handleChange}
                                                placeholder="Enter UTR / Transaction ID" className="anime-input"
                                                style={formErrors.transactionId ? inputError : inputBase}
                                            />
                                        </AnimeField>
                                        <div style={{ marginTop: 16 }}>
                                            <AnimeField label="Payment Screenshot" error={formErrors.paymentScreenshot}>
                                                <input type="file" id="paymentScreenshot" accept="image/*" onChange={handleFileUpload} className="anime-file-input" />
                                            </AnimeField>
                                            {formData.paymentScreenshot && (
                                                <div style={{ fontFamily: monoFont, fontSize: 11, marginTop: 8, color: ANIME_COLORS.text, letterSpacing: 1 }}>
                                                    ✔ {formData.paymentScreenshot.name}
                                                </div>
                                            )}
                                        </div>
                                    </AnimeCardWrapper>
                                </div>
                            </div>
                        </AnimeSectionCard>
                        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginTop: 32 }}>
                            <AnimeButton bg={`${ANIME_COLORS.background}40`} fg={ANIME_COLORS.text} onClick={() => setPaymentStep("details")}>← BACK</AnimeButton>
                            <AnimeButton bg={ANIME_COLORS.primary} fg={ANIME_COLORS.text} onClick={proceedToVerification}>VERIFY PAYMENT →</AnimeButton>
                        </div>
                    </div>
                )}

                {/* ── STEP 3 ── */}
                {paymentStep === "verification" && (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <AnimeSectionCard title="01 · Personal Info" color={ANIME_COLORS.accent}>
                            {[
                                ["Name", formData.name], ["Email", formData.email], ["Phone", formData.phone],
                                ["College", formData.college], ["Department", formData.department],
                                ["Year", formData.year?.toString()], ["USN", formData.usn],
                            ].map(([k, v]) => (
                                <div key={k} className="review-row">
                                    <span className="review-key">{k}</span><span style={{ color: ANIME_COLORS.text }}>{v}</span>
                                </div>
                            ))}
                        </AnimeSectionCard>
                        <AnimeSectionCard title="02 · Selected Events" color={ANIME_COLORS.primary}>
                            {selectedEvents.map((se) => {
                                const ev = events.find((e) => e.id === se.id);
                                if (!ev) return null;
                                return (
                                    <div key={ev.id}>
                                        <div className="review-row">
                                            <span className="review-key">{ev.eventName}</span>
                                            <span style={{ color: ANIME_COLORS.text }}>₹{ev.fee || 0}</span>
                                        </div>
                                        {ev.eventType === "Team" && groupEventData[ev.id] && (
                                            <div style={{ paddingLeft: 16, marginBottom: 8 }}>
                                                {groupEventData[ev.id].members.map((m, i) => (
                                                    <div key={i} style={{ fontFamily: monoFont, fontSize: 11, color: ANIME_COLORS.text, padding: "3px 0" }}>
                                                        Member {i + 1}: {m.name} ({m.usn} · {m.email})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div style={{ ...sectionHeaderStyle(ANIME_COLORS.background), color: ANIME_COLORS.accent, marginTop: 12, borderRadius: 4 }}>
                                TOTAL: ₹{totalAmount}
                            </div>
                        </AnimeSectionCard>
                        <AnimeSectionCard title="03 · Payment Details" color={ANIME_COLORS.accent}>
                            {[
                                ["Transaction ID", formData.transactionId],
                                ["Screenshot", formData.paymentScreenshot?.name || "No file selected"],
                            ].map(([k, v]) => (
                                <div key={k} className="review-row">
                                    <span className="review-key">{k}</span><span style={{ color: ANIME_COLORS.text }}>{v}</span>
                                </div>
                            ))}
                        </AnimeSectionCard>
                        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginTop: 32 }}>
                            <AnimeButton bg={`${ANIME_COLORS.background}40`} fg={ANIME_COLORS.text} onClick={() => setPaymentStep("payment")}>← BACK</AnimeButton>
                            <AnimeButton bg={ANIME_COLORS.primary} fg={ANIME_COLORS.text} type="submit" disabled={isRegistering}>
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
                )}
            </div>
        </div>
    );
};

export default Register;
