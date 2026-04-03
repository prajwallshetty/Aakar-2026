"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import {
    registerParticipant,
    validateParticipantData,
} from "@/backend/participant";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { getAllEvents, getEventOptions } from "@/backend/events";
import {
    ExtendedEvent,
} from "@/types";
import { eventType } from "@prisma/client";
import { uploadFile } from "@/backend/supabase";

// ─── Glitch text ───────────────────────────────────────────────
function GlitchText({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <span className="glitch-root" data-text={text}>
      {children}
    </span>
  );
}

// ─── Particle field ────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const COLORS = ["#FF4D00", "#00E5FF", "#FFD700", "#B026FF", "#00FF9D"];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ─── Orbiting accent orbs in background ───────────────────────
function OrbField() {
  return (
    <div className="orb-container" aria-hidden>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
}

// ─── Design tokens & Style helpers ────────────────────────────────────────────
const inputBase: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    background: "rgba(0,0,0,0.5)",
    border: `1px solid rgba(0, 229, 255, 0.3)`,
    borderRadius: "6px",
    fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
    color: "#fff",
    outline: "none", transition: "all 0.3s ease",
    appearance: "none" as const,
};

const inputError: React.CSSProperties = {
    ...inputBase,
    border: `1px solid #FF4D00`,
    boxShadow: `0 0 10px rgba(255, 77, 0, 0.3)`,
};

const errorMsg: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700,
    color: "#FF4D00", letterSpacing: 1, marginTop: 4,
    display: "flex", alignItems: "center", gap: 4,
};

const labelStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700,
    letterSpacing: 2, textTransform: "uppercase" as const,
    color: "#00E5FF", marginBottom: 6, display: "block",
};

// ─── Cyber Button ───────────────────────────────────────────────────────────
const CyberButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
    variant?: "primary" | "secondary";
}> = ({ children, onClick, type = "button", disabled, variant = "primary" }) => {
    const isPrimary = variant === "primary";
    const color = isPrimary ? "#00E5FF" : "#FF4D00";
    
    return (
        <button type={type} onClick={onClick} disabled={disabled}
            className={`cyber-btn ${isPrimary ? 'primary' : 'secondary'} ${disabled ? 'disabled' : ''}`}
            style={{
                background: disabled ? "rgba(255,255,255,0.1)" : "rgba(8,10,18,0.8)",
                color: disabled ? "#666" : color,
                border: `1px solid ${disabled ? "#444" : color}`,
                boxShadow: disabled ? "none" : `0 0 15px ${isPrimary ? 'rgba(0,229,255,0.3)' : 'rgba(255,77,0,0.3)'}, inset 0 0 10px ${isPrimary ? 'rgba(0,229,255,0.1)' : 'rgba(255,77,0,0.1)'}`,
                fontFamily: "'Share Tech Mono', monospace", fontSize: 13, fontWeight: 700,
                letterSpacing: 3, textTransform: "uppercase",
                padding: "12px 28px", borderRadius: "4px",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                position: "relative", overflow: "hidden",
            }}>
            {children}
        </button>
    );
};

// ─── Step indicator ───────────────────────────────────────────────────────────
const StepPill: React.FC<{ label: string; num: number; active: boolean; done: boolean; skippable?: boolean }> = ({ label, num, active, done, skippable }) => {
    if (skippable) return null;
    const color = done ? "#00FF9D" : active ? "#00E5FF" : "#444";
    return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: active || done ? 1 : 0.5, transition: "opacity 0.3s" }}>
        <div style={{
            width: 44, height: 44,
            background: done ? "rgba(0,255,157,0.1)" : active ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.05)",
            border: `1.5px solid ${color}`, borderRadius: "50%",
            boxShadow: active || done ? `0 0 15px ${color}40, inset 0 0 10px ${color}20` : "none",
            fontFamily: "'Share Tech Mono', monospace", fontSize: 16, fontWeight: 700, color: color,
            display: "flex", alignItems: "center", justifyContent: "center",
            textShadow: active || done ? `0 0 8px ${color}` : "none"
        }}>
            {done ? "✓" : num}
        </div>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: color, textShadow: active || done ? `0 0 8px ${color}` : "none" }}>
            {label}
        </span>
    </div>
)};

const StepConnector: React.FC<{ done: boolean, skip?: boolean }> = ({ done, skip }) => {
    if (skip) return null;
    const color = done ? "#00FF9D" : "#444";
    return (
    <div style={{ flex: 1, height: 2, marginBottom: 22, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: done ? 1 : 0.3 }} />
)};

// ─── Section head ─────────────────────────────────────────────────────────────
function SectionHeading({ children, index }: { children: React.ReactNode; index: number }) {
  const colors = ["#FF4D00", "#00E5FF", "#B026FF", "#FFD700", "#00FF9D"];
  const c = colors[index % colors.length];
  return (
    <div className="section-head" style={{ marginBottom: "1.5rem" }}>
      <div className="head-line-left" style={{ background: `linear-gradient(90deg, transparent, ${c})` }} />
      <h2 className="head-title" style={{ textShadow: `0 0 20px ${c}80, 0 0 40px ${c}30`, fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
        <span style={{ color: c, opacity: 0.7, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7em" }}>[ </span>
        {children}
        <span style={{ color: c, opacity: 0.7, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7em" }}> ]</span>
      </h2>
      <div className="head-line-right" style={{ background: `linear-gradient(-90deg, transparent, ${c})` }} />
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
const SectionCard: React.FC<{ title: string; index: number; children: React.ReactNode }> = ({ title, index, children }) => (
    <div className="cyber-card" style={{ padding: "30px", marginBottom: "30px" }}>
        <SectionHeading index={index}>{title}</SectionHeading>
        {children}
    </div>
);

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 6 }}>
        <label style={labelStyle}>{label}</label>
        {children}
        {error && <span style={errorMsg}>⚡ {error}</span>}
    </div>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "#050510" }}>
            <OrbField />
            <ParticleField />
            <div className="cyber-card" style={{ padding: 40, width: "min(600px,90vw)", position: "relative", zIndex: 1 }}>
                <SectionHeading index={1}>INITIALIZING SYSTEM</SectionHeading>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ height: 12, width: "35%", background: "rgba(0,229,255,0.2)", borderRadius: 4 }} className="pulse-load" />
                            <div style={{ height: 44, background: "rgba(255,255,255,0.05)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)" }} className="pulse-load" />
                        </div>
                    ))}
                </div>
            </div>
            <style>{`.pulse-load { animation: pulse 1.5s infinite; } @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>
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

    // ✅ SOLO FREE LOGIC
    const total = selectedOptions.reduce((sum: number, event: any) => {
    const eventObj = events.find((e) => e.id === event.id);

    // ✅ FREE ONLY if SOLO AND NOT SPECIAL
    if (
        eventObj?.eventType === "Solo" &&
        eventObj?.eventCategory !== "Special"
    ) {
        return sum;
    }

    return sum + (eventObj?.fee || 0);
}, 0);

setTotalAmount(total);
    setTotalAmount(total);
};
    const handleParticipantCountChange = (groupId: string | number, count: number) => {
        const evDetail = events.find(e => e.id === Number(groupId));
        const maxLimit = evDetail ? evDetail.maxMembers - 1 : 10;
        
        const currentMembers = groupEventData[groupId]?.members || [];
        let newCount = Math.max(1, count);
        
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
    if (totalAmount <= 0) return; // 🔥 safety

    const upiUrl = `upi://pay?pa=${encodeURIComponent("ajiet@cnrb")}
        &pn=${encodeURIComponent("Aakar Registration")}
        &am=${totalAmount}
        &cu=INR`;

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

    if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
    }

    // ✅ IMPORTANT: SKIP PAYMENT IF FREE
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

        // ✅ ONLY upload if paid
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
            background: "rgba(0,0,0,0.5)", 
            border: state.isFocused ? `1px solid #00E5FF` : `1px solid rgba(0, 229, 255, 0.3)`,
            borderRadius: "6px",
            boxShadow: state.isFocused ? `0 0 12px rgba(0,229,255,0.3)` : "none",
            fontFamily: "'Share Tech Mono', monospace", fontSize: 13, minHeight: 44,
            "&:hover": { borderColor: "#00E5FF" },
        }),
        menu: (base: any) => ({
            ...base, 
            background: "rgba(8,10,18,0.95)", 
            border: `1px solid rgba(0,229,255,0.4)`, 
            borderRadius: "6px",
            boxShadow: `0 10px 30px rgba(0,0,0,0.8)`, 
        }),
        option: (base: any, state: any) => ({
            ...base,
            background: state.isSelected ? "rgba(0,229,255,0.2)" : state.isFocused ? "rgba(255,255,255,0.1)" : "transparent",
            color: "#fff", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, cursor: "pointer",
        }),
        multiValue: (base: any) => ({
            ...base, background: "rgba(0,229,255,0.15)", border: `1px solid rgba(0,229,255,0.4)`, borderRadius: "4px",
        }),
        multiValueLabel: (base: any) => ({ ...base, color: "#fff", fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }),
        multiValueRemove: (base: any) => ({ ...base, color: "#fff", "&:hover": { background: "rgba(255,77,0,0.5)", color: "#fff" } }),
        input: (base: any) => ({ ...base, color: "#fff" }),
        singleValue: (base: any) => ({ ...base, color: "#fff" }),
        groupHeading: (base: any) => ({
            ...base, fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2, color: "#00E5FF",
            borderBottom: `1px solid rgba(0,229,255,0.2)`, padding: "8px 12px",
        }),
    };

    if (isLoading) return <LoadingSkeleton />;

    const stepNum = paymentStep === "details" ? 1 : paymentStep === "payment" ? 2 : 3;

    return (
        <div style={{ minHeight: "100vh", position: "relative", padding: "clamp(3rem, 5vh, 6rem) clamp(1rem, 3vw, 2rem)", background: "#050510", color: "#fff", overflow: "hidden" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap');
                
                * { box-sizing: border-box; }
                
                .cyber-card {
                    background: rgba(8, 10, 18, 0.82);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
                }
                
                .cyber-card-inner {
                    background: rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 8px;
                    padding: 20px;
                }

                .cyber-input:focus { border-color: #00E5FF !important; box-shadow: 0 0 12px rgba(0, 229, 255, 0.2) !important; outline: none; }
                .cyber-input::placeholder { color: #555; font-style: italic; }
                
                .cyber-file-input { 
                    width: 100%; padding: 12px 14px; 
                    border: 1px dashed rgba(0, 229, 255, 0.4); 
                    background: rgba(0,0,0,0.5); 
                    font-family: 'Share Tech Mono', monospace; font-size: 13px; color: #00E5FF;
                    cursor: pointer; border-radius: 6px; transition: all 0.3s;
                }
                .cyber-file-input:hover { border-color: #00E5FF; background: rgba(0,229,255,0.05); }
                .cyber-file-input:focus { outline: none; border-color: #00E5FF; box-shadow: 0 0 12px rgba(0,229,255,0.2); }
                
                .review-row { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px dashed rgba(255,255,255,0.1); font-family: 'Share Tech Mono', monospace; font-size: 13px; color: #ddd; }
                .review-row:last-child { border-bottom: none; }
                .review-key { font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-size: 11px; color: #00E5FF; min-width: 120px; flex-shrink: 0; }
                
                /* Animations */
                @keyframes glitchA {
                  0%,100%  { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 1px); }
                  20%      { clip-path: inset(92% 0 1% 0);  transform: translate(1px, -2px); }
                  40%      { clip-path: inset(43% 0 1% 0);  transform: translate(2px, 1px); }
                  60%      { clip-path: inset(25% 0 58% 0); transform: translate(-1px, 2px); }
                  80%      { clip-path: inset(54% 0 7% 0);  transform: translate(1px, 1px); }
                }
                @keyframes glitchB {
                  0%,100%  { clip-path: inset(50% 0 30% 0); transform: translate(2px, -1px); }
                  20%      { clip-path: inset(10% 0 85% 0); transform: translate(-2px, 1px); }
                  40%      { clip-path: inset(75% 0 5% 0);  transform: translate(1px, -2px); }
                  60%      { clip-path: inset(5% 0 70% 0);  transform: translate(-1px, 1px); }
                  80%      { clip-path: inset(30% 0 40% 0); transform: translate(2px, -1px); }
                }
                @keyframes ledPulse {
                  0%,100% { opacity:1; box-shadow: 0 0 8px #00E5FF; }
                  50%     { opacity:0.6; box-shadow: 0 0 16px #00E5FF; }
                }
                .glitch-root { position: relative; display: inline-block; }
                .glitch-root::before, .glitch-root::after { content: attr(data-text); position: absolute; inset: 0; display: inline-block; }
                .glitch-root:hover::before { animation: glitchA 0.4s steps(2, end) infinite; color: #00E5FF; text-shadow: 2px 0 #00E5FF; }
                .glitch-root:hover::after { animation: glitchB 0.4s steps(2, end) infinite; color: #FF4D00; text-shadow: -2px 0 #FF4D00; }
                
                .cyber-btn:hover:not(.disabled) { transform: translateY(-2px); }
                .cyber-btn.primary:hover:not(.disabled) { box-shadow: 0 0 25px rgba(0,229,255,0.4), inset 0 0 15px rgba(0,229,255,0.2); border-color: #fff; }
                .cyber-btn.secondary:hover:not(.disabled) { box-shadow: 0 0 25px rgba(255,77,0,0.4), inset 0 0 15px rgba(255,77,0,0.2); border-color: #fff; text-shadow: 0 0 8px rgba(255,77,0,0.5); }
                
                .section-head { display: flex; align-items: center; gap: 16px; justify-content: flex-start; width: 100%; }
                .head-line-left { width: 40px; height: 2px; border-radius: 2px; }
                .head-line-right { flex: 1; height: 2px; border-radius: 2px; }
                .head-title { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em; color: #fff; margin: 0; text-transform: uppercase; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
                
                .page-badge {
                  display: inline-flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); color: #00E5FF;
                  font-family: 'Share Tech Mono', monospace; font-size: clamp(0.65rem, 2vw, 0.85rem); letter-spacing: 0.22em;
                  padding: 6px 22px; border: 1px solid rgba(0,229,255,0.4); border-radius: 30px;
                  box-shadow: 0 0 18px rgba(0,229,255,0.2), inset 0 0 12px rgba(0,229,255,0.07); margin-bottom: 1.6rem;
                }
                .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #00E5FF; animation: ledPulse 1.5s ease-in-out infinite; flex-shrink: 0; }
                
                .orb-container { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
                .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
                .orb-1 { width: 600px; height: 600px; top: -150px; left: -150px; background: radial-gradient(circle, #FF4D00, transparent 70%); }
                .orb-2 { width: 500px; height: 500px; top: 30%; right: -100px; background: radial-gradient(circle, #00E5FF, transparent 70%); }
                .orb-3 { width: 400px; height: 400px; bottom: 10%; left: 20%; background: radial-gradient(circle, #B026FF, transparent 70%); }
                .orb-4 { width: 350px; height: 350px; bottom: 30%; right: 25%; background: radial-gradient(circle, #FFD700, transparent 70%); }
            `}</style>

            <OrbField />
            <ParticleField />

            <div style={{ maxWidth: 840, margin: "0 auto", position: "relative", zIndex: 10 }}>

                {/* Header */}
                <div style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
                    <div className="page-badge">
                        <div className="badge-dot" />
                        SYSTEM_OP // REGISTRATION
                    </div>
                    
                    <h1 style={{ 
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 5.5rem)", 
                        letterSpacing: "0.05em", color: "#fff", margin: 0, lineHeight: 1,
                        textShadow: "0 0 30px rgba(0, 229, 255, 0.45)", transform: "skewX(-6deg)"
                    }}>
                        AJIET <GlitchText text="PORTAL"><span style={{ color: "#fff", textShadow: "0 0 35px rgba(255,255,255,0.4)" }}>PORTAL</span></GlitchText>
                    </h1>
                    
                    <p style={{
                      fontFamily: "'Share Tech Mono', monospace", fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                      letterSpacing: "0.3em", color: "#00E5FF", marginTop: "1rem", textTransform: "uppercase",
                      textShadow: "0 0 12px #00E5FF"
                    }}>
                        &gt; INTERNAL_ACCESS_GRANTED <span style={{ animation: "ledPulse 1s step-end infinite" }}>_</span>
                    </p>
                </div>

                {/* Step indicator */}
                <div className="cyber-card" style={{ padding: "20px 30px", marginBottom: "2.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <StepPill label="Details" num={1} active={stepNum === 1} done={stepNum > 1} />
                        
                        <StepConnector skip={totalAmount === 0 && selectedEvents.length > 0} done={stepNum > 1} />
                        <StepPill skippable={totalAmount === 0 && selectedEvents.length > 0} label="Payment" num={2} active={stepNum === 2} done={stepNum > 2} />
                        
                        <StepConnector done={stepNum > 2 || (totalAmount === 0 && selectedEvents.length > 0)} />
                        <StepPill label="Verify" num={totalAmount === 0 && selectedEvents.length > 0 ? 2 : 3} active={stepNum === 3} done={false} />
                    </div>
                </div>

                {/* Error */}
                {generalError && (
                    <div style={{
                        background: "rgba(255, 77, 0, 0.15)", color: "#FF4D00",
                        border: `1px solid rgba(255,77,0,0.4)`, borderRadius: "6px",
                        boxShadow: `0 0 20px rgba(255,77,0,0.2)`, backdropFilter: "blur(4px)",
                        padding: "16px 20px", marginBottom: "2rem",
                        fontFamily: "'Share Tech Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 1,
                        display: "flex", alignItems: "center", gap: 12
                    }}>
                        <span style={{ fontSize: 18 }}>⚠️</span> {generalError}
                    </div>
                )}

                {/* ── STEP 1 ── */}
                {paymentStep === "details" && (
                    <form onSubmit={proceedToPayment} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        <SectionCard title="01_PERSONAL_DATA" index={1}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
                                {([
                                    { id: "name", label: "Full Name", placeholder: "Enter your full name", type: "text", maxLength: 50 },
                                    { id: "email", label: "Email Address", placeholder: "your@email.com", type: "email", maxLength: 100 },
                                    { id: "phone", label: "Phone Number", placeholder: "10-digit number", type: "tel", maxLength: 10 },
                                    { id: "usn", label: "USN", placeholder: "4JK21CS000", type: "text", maxLength: 10 },
                                    { id: "year", label: "Year of Study", placeholder: "1, 2, 3 or 4", type: "number", maxLength: undefined },
                                ] as const).map(({ id, label, placeholder, type, maxLength }) => (
                                    <Field key={id} label={label} error={formErrors[id]}>
                                        <input type={type} id={id}
                                            value={id === "year" ? (formData.year || "") : (formData as any)[id]}
                                            onChange={handleChange} placeholder={placeholder} required
                                            min={id === "year" ? 1 : undefined} max={id === "year" ? 8 : undefined}
                                            maxLength={maxLength}
                                            className="cyber-input"
                                            style={formErrors[id] ? inputError : inputBase}
                                        />
                                    </Field>
                                ))}
                                <Field label="Department" error={formErrors.department}>
                                    <select id="department" value={formData.department} onChange={handleChange} required className="cyber-input" style={{ ...inputBase, ...(formErrors.department ? inputError : {}) }}>
                                        <option value="" disabled style={{ color: "#888" }}>Select your department</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                                        <option value="Computer Science & Engineering (Artificial Intelligence & Machine Learning)">Computer Science & Engineering (AI & ML)</option>
                                        <option value="Computer Science & Engineering (IoT & Cyber Security including Blockchain Technology)">Computer Science & Engineering (IoT & Cyber Security)</option>
                                        <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                                        <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                                        <option value="Electronics Engineering (VLSI Design and Technology)">Electronics Engineering (VLSI)</option>
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
                                            className="cyber-input"
                                            style={{...inputBase, background: "rgba(255,255,255,0.05)", color: "#888", border: "1px dashed rgba(255,255,255,0.2)"}}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="02_EVENT_SELECTION" index={2}>
                            {selectedEvents.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                                        {selectedEvents.map((se) => {
                                            const ev = events.find((e) => e.id === se.id);
                                            if (!ev) return null;
                                            const isSoloFree = ev.eventType === "Solo" && ev.eventCategory !== "Special";
                                            return (
                                                <div key={ev.id} style={{
                                                    background: isSoloFree ? "rgba(0,229,255,0.15)" : "rgba(255,77,0,0.15)", 
                                                    border: `1px solid ${isSoloFree ? "rgba(0,229,255,0.4)" : "rgba(255,77,0,0.4)"}`,
                                                    borderRadius: "4px", padding: "6px 12px",
                                                    fontFamily: "'Share Tech Mono', monospace", fontSize: 12, fontWeight: 700,
                                                    display: "flex", alignItems: "center", gap: 10, color: "#fff",
                                                }}>
                                                    {ev.eventName}
                                                    <span style={{ color: isSoloFree ? "#00E5FF" : "#FFD700" }}>
                                                        {isSoloFree ? "FREE" : `₹${ev.fee || 0}`}
                                                    </span>
                                                    <button type="button" onClick={() => {
                                                        const updated = selectedEvents.filter((s) => s.id !== ev.id);
                                                        setSelectedEvents(updated);
                                                        if (groupEventData[ev.id]) setGroupEventData((prev) => { const u = { ...prev }; delete u[ev.id]; return u; });
                                                        
                                                        setTotalAmount(events.filter((e) => updated.find((u) => u.id === e.id)).reduce((sum, e) => {
                                                            if (e.eventType === 'Solo' && e.eventCategory !== 'Special') return sum;
                                                            return sum + (e.fee || 0);
                                                        }, 0));
                                                        
                                                    }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, color: isSoloFree ? "#00E5FF" : "#FF4D00", padding: 0, display: "flex", alignItems: "center" }}>
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{
                                        background: "rgba(0,0,0,0.5)", color: "#00FF9D",
                                        border: `1px solid #00FF9D`, borderRadius: "4px",
                                        padding: "10px 20px", display: "inline-block",
                                        fontFamily: "'Share Tech Mono', monospace", fontSize: 16, fontWeight: 700, letterSpacing: 2,
                                        boxShadow: "0 0 15px rgba(0,255,157,0.2), inset 0 0 10px rgba(0,255,157,0.1)"
                                    }}>
                                        TOTAL_DUE: ₹{totalAmount}
                                    </div>
                                </div>
                            )}
                            <Field label="Add Events" error={formErrors.events}>
                                <Select id="events" instanceId="events-select"
                                    options={eventOptions} isMulti value={selectedEvents}
                                    onChange={handleEventSelection} placeholder="Search database for events..."
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
                                <SectionCard key={event.id} title={`TEAM_CONFIG // ${event.label}`} index={3}>
                                    <Field label="TEAM MEMBERS (EXCLUDING LEADER)" error={invalid ? `Must be ${eventDetail.minMembers - 1}–${eventDetail.maxMembers - 1}` : undefined}>
                                        <input type="number"
                                            min={eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1}
                                            max={eventDetail?.maxMembers ? eventDetail.maxMembers - 1 : 10}
                                            step={1} value={groupData.participantCount}
                                            onChange={(e) => {
                                                const parsed = parseInt(e.target.value, 10);
                                                handleParticipantCountChange(
                                                    event.id,
                                                    Number.isNaN(parsed)
                                                        ? (eventDetail?.minMembers !== undefined ? eventDetail.minMembers - 1 : 1)
                                                        : parsed
                                                );
                                            }}
                                            className="cyber-input" style={{ ...inputBase, maxWidth: 120 }}
                                        />
                                    </Field>
                                    {groupData.members.map((member, index) => (
                                        <div key={index} className="cyber-card-inner" style={{ marginTop: 16 }}>
                                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#B026FF", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, letterSpacing: 2 }}>
                                                <div style={{ width: 6, height: 6, background: "#B026FF", borderRadius: "50%", boxShadow: "0 0 8px #B026FF" }} />
                                                MEMBER_UNIT_{String(index + 1).padStart(2, "0")}
                                            </div>
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
                                                {[
                                                    { field: "name", label: "Full Name", placeholder: "Member Name" },
                                                    { field: "usn", label: "USN", placeholder: "Member USN" },
                                                    { field: "email", label: "Email", placeholder: "Member Email" },
                                                ].map(({ field, label, placeholder }) => (
                                                    <Field key={field} label={label} error={formErrors[`group_${event.id}_member_${index}_${field}`]}>
                                                        <input type="text" value={(member as any)[field] || ""}
                                                            onChange={(e) => handleGroupMemberChange(event.id, index, field,
                                                                field === "usn" ? e.target.value.toUpperCase() : field === "email" ? e.target.value.toLowerCase() : e.target.value)}
                                                            placeholder={placeholder} className="cyber-input"
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

                        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                            <CyberButton type="submit" variant="primary">PROCEED_TO_REVIEW →</CyberButton>
                        </div>
                    </form>
                )}

                {/* ── STEP 2 (Payment - Only if total > 0) ── */}
                {paymentStep === "payment" && totalAmount > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <SectionCard title="COMMERCE_UPLINK" index={2}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                                <div style={{ 
                                    background: "rgba(0,0,0,0.6)", border: `1px solid #FFD700`, 
                                    boxShadow: `0 0 20px rgba(255,215,0,0.2)`, padding: "16px 40px", borderRadius: "8px" 
                                }}>
                                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 4, color: "#FFD700" }}>
                                        ₹{totalAmount}
                                    </span>
                                </div>
                                
                                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, letterSpacing: 2, color: "#00E5FF", textAlign: "center" }}>
                                    <span style={{ opacity: 0.7 }}>SCAN QR TO INITIATE TRANSFER</span><br/>
                                    <strong>ajiet@cnrb</strong>
                                </div>
                                
                                {showQRCode ? (
                                    <div className="cyber-card-inner" style={{ padding: 16, border: "1px solid #00FF9D", background: "rgba(0,255,157,0.05)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <img src={qrImageUrl || "/logo.svg"} alt="UPI QR Code" style={{ width: 220, height: 220, display: "block", borderRadius: "4px" }} />
                                        <div style={{ textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 3, marginTop: 12, color: "#00FF9D" }}>
                                            UPI_TARGET: ajiet@cnrb
                                        </div>
                                    </div>
                                ) : (
                                    <CyberButton variant="secondary" onClick={generateQRCode}>GENERATE_QR_CODE</CyberButton>
                                )}
                                
                                <div style={{ width: "100%", marginTop: "1rem" }}>
                                    <div className="cyber-card-inner" style={{ border: "1px solid rgba(0,229,255,0.3)" }}>
                                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#00E5FF", letterSpacing: 2, marginBottom: "1rem", borderBottom: "1px dashed rgba(0,229,255,0.3)", paddingBottom: "0.5rem" }}>
                                            POST_TRANSFER_VERIFICATION
                                        </div>
                                        <Field label="Transaction ID / UTR" error={formErrors.transactionId}>
                                            <input type="text" id="transactionId" value={formData.transactionId} onChange={handleChange}
                                                placeholder="Enter 12-digit UTR number" className="cyber-input"
                                                style={formErrors.transactionId ? inputError : inputBase}
                                            />
                                        </Field>
                                        <div style={{ marginTop: 20 }}>
                                            <Field label="Payment Screenshot" error={formErrors.paymentScreenshot}>
                                                <input type="file" id="paymentScreenshot" accept="image/*" onChange={handleFileUpload} className="cyber-file-input" />
                                            </Field>
                                            {formData.paymentScreenshot && (
                                                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, marginTop: 8, color: "#00FF9D", letterSpacing: 1, display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ width: 6, height: 6, background: "#00FF9D", borderRadius: "50%", boxShadow: "0 0 8px #00FF9D" }} />
                                                    {formData.paymentScreenshot.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                        <div style={{ display: "flex", justifyItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap", marginTop: "1rem" }}>
                            <CyberButton variant="secondary" onClick={() => setPaymentStep("details")}>← RETURN</CyberButton>
                            <CyberButton variant="primary" onClick={proceedToVerification}>VERIFY_DATA →</CyberButton>
                        </div>
                    </div>
                )}

                {/* ── STEP 3 (Verification / Submit) ── */}
                {paymentStep === "verification" && (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <SectionCard title="01_DATA_VERIFICATION" index={1}>
                            <div className="cyber-card-inner">
                                {[
                                    ["IDENTIFIER", formData.name], ["COMM_LINK", formData.email], ["COM_FREQ", formData.phone],
                                    ["INSTITUTE", formData.college], ["SECTOR", formData.department],
                                    ["CYCLE", formData.year?.toString()], ["UID", formData.usn],
                                ].map(([k, v]) => (
                                    <div key={k} className="review-row">
                                        <span className="review-key">{k}</span><span style={{ color: "#fff" }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        <SectionCard title="02_EVENT_MANIFEST" index={2}>
                            <div className="cyber-card-inner">
                                {selectedEvents.map((se) => {
                                    const ev = events.find((e) => e.id === se.id);
                                    if (!ev) return null;
                                    const isSoloFree = ev.eventType === "Solo" && ev.eventCategory !== "Special";
                                    return (
                                        <div key={ev.id}>
                                            <div className="review-row">
                                                <span className="review-key">{ev.eventName} {ev.eventType === "Team" ? " [GROUP]" : ""}</span>
                                                <span style={{ color: isSoloFree ? "#00E5FF" : "#FFD700", fontWeight: 700 }}>
                                                    {isSoloFree ? "FREE_ACCESS" : `₹${ev.fee || 0}`}
                                                </span>
                                            </div>
                                            {ev.eventType === "Team" && groupEventData[ev.id] && (
                                                <div style={{ paddingLeft: 16, marginBottom: 12, marginTop: 4, borderLeft: "1px dashed rgba(255,255,255,0.2)" }}>
                                                    {groupEventData[ev.id].members.map((m, i) => (
                                                        <div key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#aaa", padding: "4px 0", paddingLeft: 8 }}>
                                                            <span style={{ color: "#B026FF" }}>UNIT_{i + 1}:</span> {m.name} // {m.usn}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                <div style={{ 
                                    marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(0, 229, 255, 0.3)", 
                                    display: "flex", justifyContent: "space-between", alignItems: "center"
                                }}>
                                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, fontWeight: 700, color: "#00E5FF", letterSpacing: 2 }}>FINAL_DUE</span>
                                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: totalAmount > 0 ? "#FFD700" : "#00FF9D" }}>
                                        ₹{totalAmount}
                                    </span>
                                </div>
                            </div>
                        </SectionCard>

                        {totalAmount > 0 && (
                            <SectionCard title="03_TRANSACTION_LOG" index={3}>
                                <div className="cyber-card-inner">
                                    {[
                                        ["Tx_ID", formData.transactionId],
                                        ["FILE_REF", formData.paymentScreenshot?.name || "MISSING_FILE"],
                                    ].map(([k, v]) => (
                                        <div key={k} className="review-row">
                                            <span className="review-key">{k}</span>
                                            <span style={{ color: k === "FILE_REF" && !formData.paymentScreenshot ? "#FF4D00" : "#fff" }}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}
                        
                        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginTop: "1rem" }}>
                            <CyberButton variant="secondary" onClick={() => setPaymentStep(totalAmount > 0 ? "payment" : "details")}>← RETURN</CyberButton>
                            <CyberButton type="submit" variant="primary" disabled={isRegistering}>
                                {isRegistering ? (
                                    <>
                                        <svg style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        PROCESSING_DATA...
                                    </>
                                ) : "INITIALIZE_REGISTRATION ✓"}
                            </CyberButton>
                        </div>
                    </form>
                )}
            </div>
            
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AjietRegister;