"use client";

import { useState, useEffect, use } from "react";
import Select from "react-select";
import Link from "next/link";
import { eventType } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
    getAllEvents,
    getEventOptions,
    getEventsOfUser,
} from "@/backend/events";
import {
    getParticipant,
    updateParticipantWithNotify,
} from "@/backend/participant";
import { ExtendedEvent, ExtendedParticipant } from "@/types";
import { uploadFile } from "@/backend/supabase";
import Error from "next/error";
import { Skeleton } from "@/components/ui/skeleton";
import { Montserrat } from "next/font/google";
import {
    AnimeParticleField,
    AnimeOrbField,
    ANIME_GLOBAL_STYLES,
    ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import { cinzelFont } from "@/lib/font";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

interface FormErrors {
    [key: string]: string;
}

export default function AddAdditionalEvents({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const userId = use(params).id;

    const [events, setEvents] = useState<ExtendedEvent[]>([]);
    const [eventOptions, setEventOptions] =
        useState<Awaited<ReturnType<typeof getEventOptions>>>();
    const [userInfo, setUserInfo] = useState<ExtendedParticipant | null>(null);
    const [existingEvents, setExistingEvents] = useState<
        {
            value: string;
            label: string;
            type: eventType;
            id: number;
        }[]
    >([]);
    const [selectedEvents, setSelectedEvents] = useState<
        {
            value: string;
            label: string;
            type: eventType;
            id: number;
        }[]
    >([]);
    const [groupEventData, setGroupEventData] = useState<
        ExtendedParticipant["groupMembersData"]
    >({});
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactionId, setTransactionId] = useState<string>("");
    const [paymentScreenshot, setPaymentScreenshot] = useState<File>();
    const [qrImageUrl, setQrImageUrl] = useState<string>("");
    const [showQRCode, setShowQRCode] = useState<boolean>(false);
    const [filteredEventIds, setFilteredEventIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                const allEvents = await getAllEvents();
                setEvents(allEvents);

                const { data: userData } = await getParticipant(userId);
                setUserInfo(userData);

                let userEvents = (await getEventsOfUser(userId))?.map(
                    (event) => ({
                        label: event.eventName,
                        value: event.id.toString(),
                        type: event.eventType,
                        id: event.id,
                    })
                );

                if (userEvents) {
                    setExistingEvents(userEvents);
                }

                const eventOpts = await getEventOptions();

                const eventsToFilter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
                setFilteredEventIds(eventsToFilter);
                const filteredOptions = eventOpts.map((category) => ({
                    label: category.label,
                    options: category.options.filter(
                        (option) => !userEvents?.some((ex) => ex.id === option.id)
                 )
            }));

                setEventOptions(filteredOptions);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    async function addUserEvents(
        data: typeof selectedEvents,
        groupData: typeof groupEventData
    ): Promise<void> {
        let fileUrl = await uploadFile(
            paymentScreenshot!,
            "paymentscreenshots"
        );
        if (!fileUrl) return;
        await updateParticipantWithNotify(userId, {
            events: { connect: data.map((e) => ({ id: e.id })) },
            paymentScreenshotUrls: { push: fileUrl },
            transaction_ids: { push: transactionId },
            groupMembersData: groupData
                ? { ...(userInfo!.groupMembersData || {}), ...groupData }
                : userInfo!.groupMembersData || {},
            amount: (userInfo?.amount || 0) + totalAmount,
        });
    }

    const handleEventSelection = (selected: any) => {
        const selectedOptions: typeof selectedEvents = selected || [];
        setSelectedEvents([...selectedOptions]);
        setShowQRCode(false);
        setQrImageUrl("");

        const amount = selectedOptions.reduce(
            (sum: number, event) =>
                sum + (events.find((e) => e.id === event.id)?.fee || 0),
            0
        );
        setTotalAmount(amount);

        selectedOptions.forEach((event) => {
            if (event.type === "Team" && !groupEventData?.[event.id]) {
                setGroupEventData((prev) => ({
                    ...prev,
                    [event.id]: {
                        participantCount: 1,
                        members: [{ name: "", usn: "", email: "" }],
                    },
                }));
            }
        });
    };

    const generateQRCode = () => {
        const amount =
            selectedEvents.length > 0
                ? events
                    .filter((event) =>
                        selectedEvents.find((e) => e.id === event.id)
                    )
                    .reduce((sum, event) => sum + (event.fee || 0), 0)
                : 0;

        setTotalAmount(amount);

        const upiId = "ajiet@cnrb";
        const payeeName = "Aakar 2025 Registration";
        const transactionNote = "Aakar 2025 Registration";

        const upiUrl = `upi://pay?pa=${encodeURIComponent(
            upiId
        )}&pn=${encodeURIComponent(
            payeeName
        )}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

        setQrImageUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                upiUrl
            )}`
        );
        setShowQRCode(true);
    };

    const handleParticipantCountChange = (eventId: number, count: number) => {
        const currentData = groupEventData?.[eventId] || {
            participantCount: 1,
            members: [{ name: "", usn: "", email: "" }],
        };

        count = Math.max(1, Math.min(10, count));

        let members = [...currentData.members];
        if (count > members.length) {
            for (let i = members.length; i < count; i++) {
                members.push({ name: "", usn: "", email: "" });
            }
        } else if (count < members.length) {
            members = members.slice(0, count);
        }

        setGroupEventData((prev) => ({
            ...prev,
            [eventId]: {
                participantCount: count,
                members,
            },
        }));
    };

    const handleGroupMemberChange = (
        eventId: number,
        index: number,
        field: "name" | "usn" | "email",
        value: string
    ) => {
        const currentData = groupEventData?.[eventId];
        if (!currentData) return;

        const updatedMembers = [...currentData.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            [field]: value,
        };

        setGroupEventData((prev) => ({
            ...prev,
            [eventId]: {
                ...prev?.[eventId],
                members: updatedMembers,
            },
        }));
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (selectedEvents.length === 0) {
            errors.events = "Please select at least one event";
        }

        selectedEvents.forEach((event) => {
            if (event.type === "Team") {
                const teamData = groupEventData?.[event.id];

                if (teamData) {
                    teamData.members.forEach((member, index) => {
                        if (!member.name || member.name.trim() === "") {
                            errors[`group_${event.id}_member_${index}_name`] =
                                "Name is required";
                        }

                        if (!member.usn || member.usn.trim() === "") {
                            errors[`group_${event.id}_member_${index}_usn`] =
                                "USN is required";
                        } else if (!/^[A-Z0-9]+$/i.test(member.usn)) {
                            errors[`group_${event.id}_member_${index}_usn`] =
                                "Enter a valid USN";
                        }

                        if (!member.email || member.email.trim() === "") {
                            errors[`group_${event.id}_member_${index}_email`] =
                                "Email is required";
                        } else if (
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)
                        ) {
                            errors[`group_${event.id}_member_${index}_email`] =
                                "Enter a valid email";
                        }
                    });
                }
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await addUserEvents(selectedEvents, groupEventData);

            setTimeout(() => {
                router.push(`/registration-success`);
            }, 2000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setFormErrors({
                submit: "An error occurred while submitting. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
                <AnimeOrbField />
                <AnimeParticleField />
                <div className="relative z-10 flex flex-col items-center gap-4 font-mono" style={{ color: ANIME_COLORS.secondary }}>
                    <div className="text-xs tracking-[0.5em] uppercase animate-pulse" style={{ color: ANIME_COLORS.accent }}>◆ Initializing Quest Board ◆</div>
                    <div className="w-48 h-1 rounded" style={{ background: `linear-gradient(90deg, transparent, ${ANIME_COLORS.primary}, transparent)` }} />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-80 h-8 rounded animate-pulse" style={{ background: `${ANIME_COLORS.primary}18`, border: `1px solid ${ANIME_COLORS.primary}30` }} />
                    ))}
                </div>
            </main>
        );
    }

    if (!userInfo) return <Error statusCode={404} />;

    return (
        <main className="relative min-h-screen overflow-hidden">
            <style>{`
                ${ANIME_GLOBAL_STYLES}
                @keyframes neonBreath {
                    0%,100% { box-shadow: 0 0 28px ${ANIME_COLORS.primary}50, inset 0 0 16px ${ANIME_COLORS.primary}18; }
                    50%      { box-shadow: 0 0 44px ${ANIME_COLORS.secondary}65, inset 0 0 22px ${ANIME_COLORS.secondary}28; }
                }
                @keyframes scanLine {
                    0%   { top: -4px; opacity: 0.6; }
                    90%  { opacity: 0.6; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes crtScan {
                    from { background-position: 0 0; }
                    to   { background-position: 0 80px; }
                }
                @keyframes rubyPulse {
                    0%,100% { opacity: 0.65; transform: scaleX(1); }
                    50% { opacity: 1; transform: scaleX(1.03); }
                }
                @keyframes bannerGlitch {
                    0%,92%,100% { transform: none; text-shadow: 0 0 18px ${ANIME_COLORS.primary}80, 0 0 40px ${ANIME_COLORS.primary}40; }
                    93% { transform: translate(-3px,0) skewX(-2deg); text-shadow: -4px 0 ${ANIME_COLORS.accent}, 4px 0 ${ANIME_COLORS.secondary}; }
                    95% { transform: translate(3px,0) skewX(2deg); text-shadow: 4px 0 ${ANIME_COLORS.accent}, -4px 0 ${ANIME_COLORS.secondary}; }
                    97% { transform: none; }
                }
                @keyframes shimmerBtn {
                    0%   { left: -100%; }
                    100% { left: 140%; }
                }
                @keyframes panelIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.975); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes inputGlow {
                    0%,100% { box-shadow: 0 0 12px ${ANIME_COLORS.primary}30, inset 0 0 6px ${ANIME_COLORS.primary}15; }
                    50%     { box-shadow: 0 0 20px ${ANIME_COLORS.primary}50, inset 0 0 10px ${ANIME_COLORS.primary}25; }
                }

                .ae-shell { animation: panelIn .5s cubic-bezier(.22,1,.36,1) both; }

                .ae-card {
                    background: linear-gradient(155deg, rgba(8,3,18,.97) 0%, rgba(12,5,24,.95) 55%, rgba(9,3,18,.98) 100%);
                    border: 1.5px solid ${ANIME_COLORS.primary}80;
                    animation: neonBreath 5s ease-in-out infinite;
                    position: relative; overflow: hidden;
                }
                .ae-card::after {
                    content: ''; position: absolute; inset: 0;
                    background: repeating-linear-gradient(0deg,transparent,transparent 3px,${ANIME_COLORS.primary}07 3px,${ANIME_COLORS.primary}07 4px);
                    pointer-events: none; z-index: 0; animation: crtScan 7s linear infinite;
                }
                .ae-scan { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,${ANIME_COLORS.primary}55,transparent); animation: scanLine 5s linear infinite; pointer-events: none; z-index: 5; }

                .ae-banner { text-align: center; padding: 2.4rem 1rem 2rem; border-bottom: 1.5px solid ${ANIME_COLORS.primary}44; position: relative; z-index: 1; }
                .ae-banner::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 72% 90% at 50% 115%, ${ANIME_COLORS.primary}1e 0%, transparent 70%); }
                .ae-ruby { display: inline-flex; align-items: center; gap: 0.6rem; font-family: 'Share Tech Mono',monospace; font-size: 0.58rem; letter-spacing: 0.45em; color: ${ANIME_COLORS.accent}; text-transform: uppercase; padding: 0.22rem 1.1rem; border: 1px solid ${ANIME_COLORS.accent}80; background: ${ANIME_COLORS.accent}16; clip-path: polygon(10px 0%,calc(100% - 10px) 0%,100% 50%,calc(100% - 10px) 100%,10px 100%,0% 50%); animation: rubyPulse 3s ease-in-out infinite; margin-bottom: 1rem; }
                .ae-ruby::before,.ae-ruby::after { content: '◆'; font-size: 0.35rem; opacity: 0.7; }
                .ae-title { display: block; font-size: clamp(2.2rem,6vw,3.4rem); line-height: 0.88; letter-spacing: 0.06em; text-transform: uppercase; color: #fff; text-shadow: 0 0 20px ${ANIME_COLORS.primary}75, 0 0 45px ${ANIME_COLORS.primary}35; animation: bannerGlitch 8s ease-in-out infinite; }
                .ae-title .stroke { -webkit-text-stroke: 2px ${ANIME_COLORS.primary}; color: transparent; filter: drop-shadow(0 0 10px ${ANIME_COLORS.primary}cc); }
                .ae-sub { font-family: 'Share Tech Mono',monospace; font-size: 0.6rem; letter-spacing: 0.5em; color: ${ANIME_COLORS.secondary}bb; margin-top: 0.9rem; text-transform: uppercase; }
                .ae-deco { width: 72px; height: 2px; margin: 0.8rem auto 0; background: linear-gradient(90deg,transparent,${ANIME_COLORS.primary}cc,transparent); animation: rubyPulse 2.8s ease-in-out infinite; }

                .ae-label { font-family: 'Share Tech Mono',monospace; font-size: 0.54rem; letter-spacing: 0.44em; color: ${ANIME_COLORS.secondary}; text-transform: uppercase; display: block; margin-bottom: 0.4rem; }
                .ae-input { width: 100%; background: linear-gradient(135deg,rgba(8,3,18,.92),rgba(12,5,24,.88)); border: 1.5px solid ${ANIME_COLORS.primary}70; color: ${ANIME_COLORS.text}; font-family: 'Share Tech Mono',monospace; font-size: 0.8rem; letter-spacing: 0.04em; padding: 0.72rem 1rem; border-radius: 6px; outline: none; transition: border-color .18s ease, box-shadow .18s ease; animation: inputGlow 5s ease-in-out infinite; }
                .ae-input::placeholder { color: ${ANIME_COLORS.text}44; }
                .ae-input:focus { border-color: ${ANIME_COLORS.accent}; box-shadow: 0 0 22px ${ANIME_COLORS.accent}45, inset 0 0 10px ${ANIME_COLORS.accent}20; animation: none; }
                .ae-input[type="file"]::file-selector-button { background: linear-gradient(135deg,${ANIME_COLORS.primary}40,${ANIME_COLORS.primary}20); color: ${ANIME_COLORS.text}; border: 1px solid ${ANIME_COLORS.primary}; padding: 6px 10px; margin-right: 12px; border-radius: 4px; font-family: 'Share Tech Mono',monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; }
                .ae-input.error { border-color: ${ANIME_COLORS.accent}; }

                .ae-tag { font-family: 'Share Tech Mono',monospace; font-size: 0.57rem; letter-spacing: 0.5em; color: ${ANIME_COLORS.secondary}; text-transform: uppercase; }
                .ae-section-title { letter-spacing: 0.04em; color: #fff; line-height: 1; margin-top: 0.3rem; text-transform: uppercase; text-shadow: 0 0 20px ${ANIME_COLORS.primary}50; font-size: clamp(1rem,2vw,1.3rem); }

                .ae-pill { font-family: 'Share Tech Mono',monospace; font-size: 0.6rem; letter-spacing: 0.14em; padding: 0.3rem 0.85rem; border-radius: 4px; border: 1.5px solid ${ANIME_COLORS.primary}55; background: ${ANIME_COLORS.primary}12; color: ${ANIME_COLORS.text}cc; display: inline-flex; align-items: center; gap: 0.4rem; }
                .ae-pill.selected { border-color: ${ANIME_COLORS.accent}; background: ${ANIME_COLORS.accent}20; color: ${ANIME_COLORS.text}; box-shadow: 0 0 14px ${ANIME_COLORS.accent}40; }
                .ae-pill-x { cursor: pointer; color: ${ANIME_COLORS.accent}; font-size: 0.8rem; line-height: 1; transition: color .15s; }
                .ae-pill-x:hover { color: #fff; }

                .ae-team-card { border: 1.5px solid ${ANIME_COLORS.primary}44; background: linear-gradient(135deg,${ANIME_COLORS.primary}0c 0%,rgba(8,3,18,.7) 100%); border-radius: 10px; padding: 1.2rem; position: relative; overflow: hidden; margin-bottom: 1.2rem; }
                .ae-team-card::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg,transparent,transparent 3px,${ANIME_COLORS.primary}05 3px,${ANIME_COLORS.primary}05 4px); pointer-events: none; }
                .ae-member-card { border: 1px solid ${ANIME_COLORS.secondary}40; background: rgba(8,3,18,.6); border-radius: 8px; padding: 1rem; margin-bottom: 0.8rem; position: relative; z-index: 1; }

                .ae-btn { font-family: 'Share Tech Mono',monospace; font-size: 0.7rem; letter-spacing: 0.28em; text-transform: uppercase; padding: 0.78rem 1.8rem; border: 1.5px solid ${ANIME_COLORS.primary}; background: linear-gradient(135deg,${ANIME_COLORS.primary}55,${ANIME_COLORS.primary}30); color: #fff; border-radius: 5px; box-shadow: 0 0 22px ${ANIME_COLORS.primary}50, inset 0 1px 0 ${ANIME_COLORS.primary}70; white-space: nowrap; cursor: pointer; position: relative; overflow: hidden; transition: transform .16s ease, box-shadow .16s ease; }
                .ae-btn::after { content: ''; position: absolute; top: 0; left: -120%; width: 80%; height: 100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent); animation: shimmerBtn 3.5s ease-in-out infinite; }
                .ae-btn:hover { transform: translateY(-2px); box-shadow: 0 0 34px ${ANIME_COLORS.primary}75, inset 0 1px 0 ${ANIME_COLORS.primary}; }
                .ae-btn:active { transform: translateY(0); }
                .ae-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .ae-btn-ghost { font-family: 'Share Tech Mono',monospace; font-size: 0.7rem; letter-spacing: 0.28em; text-transform: uppercase; padding: 0.78rem 1.6rem; border: 1.5px solid ${ANIME_COLORS.secondary}80; background: transparent; color: ${ANIME_COLORS.text}bb; border-radius: 5px; transition: all .16s ease; text-decoration: none; display: inline-block; cursor: pointer; }
                .ae-btn-ghost:hover { border-color: ${ANIME_COLORS.secondary}; color: ${ANIME_COLORS.text}; box-shadow: 0 0 16px ${ANIME_COLORS.secondary}35; transform: translateY(-1px); }

                .ae-error { font-family: 'Share Tech Mono',monospace; font-size: 0.72rem; color: ${ANIME_COLORS.accent}; margin-top: 0.3rem; letter-spacing: 0.04em; }

                .ae-qr-card { border: 1.5px solid ${ANIME_COLORS.primary}55; background: linear-gradient(155deg,rgba(8,3,18,.95),rgba(12,5,24,.92)); border-radius: 1rem; padding: 1.6rem; position: relative; overflow: hidden; animation: neonBreath 5s ease-in-out infinite; }
                .ae-qr-card::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg,transparent,transparent 3px,${ANIME_COLORS.primary}06 3px,${ANIME_COLORS.primary}06 4px); pointer-events: none; animation: crtScan 7s linear infinite; }

                .ae-price-row { display: flex; align-items: center; justify-content: space-between; border: 1.5px solid ${ANIME_COLORS.accent}80; background: linear-gradient(135deg,${ANIME_COLORS.accent}18 0%,rgba(8,3,18,.9) 55%,${ANIME_COLORS.accent}0e 100%); border-radius: 10px; padding: 1rem 1.4rem; box-shadow: 0 0 24px ${ANIME_COLORS.accent}28; }
                .ae-price-val { font-size: 2rem; font-weight: 700; color: #fff; letter-spacing: 0.04em; line-height: 1; }

                /* react-select override */
                .ae-select .select__control { background: linear-gradient(135deg,rgba(8,3,18,.92),rgba(12,5,24,.88)) !important; border: 1.5px solid ${ANIME_COLORS.primary}70 !important; border-radius: 6px !important; color: ${ANIME_COLORS.text} !important; font-family: 'Share Tech Mono',monospace !important; font-size: 0.8rem !important; box-shadow: none !important; }
                .ae-select .select__control--is-focused { border-color: ${ANIME_COLORS.accent} !important; box-shadow: 0 0 18px ${ANIME_COLORS.accent}40 !important; }
                .ae-select .select__menu { background: rgba(8,3,18,.98) !important; border: 1.5px solid ${ANIME_COLORS.primary}60 !important; border-radius: 8px !important; font-family: 'Share Tech Mono',monospace !important; }
                .ae-select .select__option { background: transparent !important; color: ${ANIME_COLORS.text}cc !important; font-size: 0.78rem !important; }
                .ae-select .select__option--is-focused { background: ${ANIME_COLORS.primary}25 !important; color: ${ANIME_COLORS.text} !important; }
                .ae-select .select__option--is-selected { background: ${ANIME_COLORS.accent}30 !important; color: ${ANIME_COLORS.text} !important; }
                .ae-select .select__multi-value { background: ${ANIME_COLORS.primary}30 !important; border: 1px solid ${ANIME_COLORS.primary}60 !important; border-radius: 4px !important; }
                .ae-select .select__multi-value__label { color: ${ANIME_COLORS.text} !important; font-size: 0.7rem !important; }
                .ae-select .select__multi-value__remove:hover { background: ${ANIME_COLORS.accent}40 !important; color: ${ANIME_COLORS.text} !important; }
                .ae-select .select__placeholder { color: ${ANIME_COLORS.text}44 !important; font-size: 0.78rem !important; }
                .ae-select .select__input-container { color: ${ANIME_COLORS.text} !important; }
                .ae-select .select__group-heading { color: ${ANIME_COLORS.secondary} !important; font-size: 0.55rem !important; letter-spacing: 0.4em !important; text-transform: uppercase !important; }
                .ae-select .select__indicator svg { color: ${ANIME_COLORS.secondary}80 !important; }
                .ae-select .select__indicator-separator { background: ${ANIME_COLORS.primary}40 !important; }
            `}</style>

            <AnimeOrbField />
            <AnimeParticleField />
            <div className="absolute inset-0 -z-0 bg-black/10" />

            <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="ae-shell space-y-5">

                    {/* ── BANNER ── */}
                    <div className="ae-card ae-banner rounded-[1.5rem]">
                        <div className="ae-scan" />
                        <span className="ae-ruby">Quest Board · Add Events</span>
                        <h1 className={`ae-title ${cinzelFont.className}`}>
                            AAKAR&nbsp;<span className="stroke">QUEST LOG</span>
                        </h1>
                        <p className="ae-sub">
                            {userInfo && `${userInfo.name} · ${userInfo.usn}`}
                        </p>
                        <div className="ae-deco" />
                    </div>

                    {/* ── MAIN CARD ── */}
                    <section className="ae-card rounded-[1.5rem] p-6 lg:p-10">
                        <div className="ae-scan" />

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">

                            {/* Already registered */}
                            {existingEvents.length > 0 && (
                                <div>
                                    <p className="ae-tag mb-3">Already Enrolled</p>
                                    <p className={`ae-section-title mb-4 ${cinzelFont.className}`}>Active Quests</p>
                                    <div className="flex flex-wrap gap-2">
                                        {existingEvents.map((event) => (
                                            <span key={event.id} className="ae-pill">
                                                {event.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            {existingEvents.length > 0 && (
                                <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${ANIME_COLORS.primary}44, transparent)` }} />
                            )}

                            {/* Event selector */}
                            <div>
                                <p className="ae-tag mb-1">New Quests</p>
                                <p className={`ae-section-title mb-4 ${cinzelFont.className}`}>Select Additional Events</p>
                                <div className="ae-select">
                                    <Select
                                        id="events"
                                        instanceId="events-select"
                                        options={eventOptions}
                                        isMulti
                                        value={selectedEvents}
                                        onChange={handleEventSelection}
                                        placeholder="Choose quests to undertake..."
                                        className={`${montserrat.className} ${formErrors.events ? "error" : ""} w-full`}
                                        classNamePrefix="select"
                                    />
                                </div>
                                {formErrors.events && <p className="ae-error mt-1">⚠ {formErrors.events}</p>}
                            </div>

                            {/* Selected events pills */}
                            {selectedEvents.length > 0 && (
                                <div>
                                    <p className="ae-label mb-2">Selected Quests</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedEvents.map((selectedEvent) => (
                                            <span key={selectedEvent.id} className="ae-pill selected">
                                                {selectedEvent.label}
                                                <button
                                                    type="button"
                                                    className="ae-pill-x"
                                                    onClick={() => {
                                                        const updatedSelection = selectedEvents.filter((e) => e.id !== selectedEvent.id);
                                                        setSelectedEvents(updatedSelection);
                                                        if (groupEventData?.[selectedEvent.id]) {
                                                            setGroupEventData((prev) => {
                                                                const updated = { ...prev };
                                                                delete updated[selectedEvent.id];
                                                                return updated;
                                                            });
                                                        }
                                                        const amount = updatedSelection.reduce((sum, event) => sum + (events.find((e) => e.id === event.id)?.fee || 0), 0);
                                                        setTotalAmount(amount);
                                                    }}
                                                >×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Team member forms */}
                            {selectedEvents.length > 0 && (
                                <div>
                                    {selectedEvents.filter((e) => e.type === "Team").map((event) => {
                                        const groupData = groupEventData?.[event.id] || { participantCount: 1, members: [{ name: "", usn: "", email: "" }] };
                                        return (
                                            <div key={event.id} className="ae-team-card">
                                                <div className="ae-scan" />
                                                <p className="ae-tag relative z-10">{event.label}</p>
                                                <p className={`ae-section-title relative z-10 mb-4 ${cinzelFont.className}`}>Team Details</p>

                                                <div className="mb-4 relative z-10">
                                                    <label htmlFor={`participant-count-${event.id}`} className="ae-label">Number of Team Members</label>
                                                    <input
                                                        type="number"
                                                        id={`participant-count-${event.id}`}
                                                        min="1" max="10"
                                                        value={groupData.participantCount}
                                                        onChange={(e) => handleParticipantCountChange(event.id, Number.parseInt(e.target.value) || 1)}
                                                        className="ae-input w-24"
                                                    />
                                                </div>

                                                {groupData.members.map((member, index) => (
                                                    <div key={index} className="ae-member-card">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="ae-label" style={{ marginBottom: 0 }}>Member {index + 1}</span>
                                                            {index > 0 && (
                                                                <button
                                                                    type="button"
                                                                    className="ae-btn-ghost"
                                                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.6rem' }}
                                                                    onClick={() => {
                                                                        const updatedMembers = [...(groupData?.members || [])];
                                                                        updatedMembers.splice(index, 1);
                                                                        setGroupEventData((prev) => ({ ...prev, [event.id]: { ...prev?.[event.id], participantCount: prev![event.id].participantCount - 1, members: updatedMembers } }));
                                                                    }}
                                                                >Remove</button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <div>
                                                                <label className="ae-label">Full Name</label>
                                                                <input type="text" value={member.name || ""} onChange={(e) => handleGroupMemberChange(event.id, index, "name", e.target.value)} placeholder="Member Name" required className={`ae-input ${formErrors[`group_${event.id}_member_${index}_name`] ? "error" : ""}`} />
                                                                {formErrors[`group_${event.id}_member_${index}_name`] && <p className="ae-error">{formErrors[`group_${event.id}_member_${index}_name`]}</p>}
                                                            </div>
                                                            <div>
                                                                <label className="ae-label">USN</label>
                                                                <input type="text" value={member.usn || ""} onChange={(e) => handleGroupMemberChange(event.id, index, "usn", e.target.value.toUpperCase())} placeholder="Member USN" required className={`ae-input ${formErrors[`group_${event.id}_member_${index}_usn`] ? "error" : ""}`} />
                                                                {formErrors[`group_${event.id}_member_${index}_usn`] && <p className="ae-error">{formErrors[`group_${event.id}_member_${index}_usn`]}</p>}
                                                            </div>
                                                            <div>
                                                                <label className="ae-label">Email</label>
                                                                <input type="text" value={member.email || ""} onChange={(e) => handleGroupMemberChange(event.id, index, "email", e.target.value.toLowerCase())} placeholder="Member Email" required className={`ae-input ${formErrors[`group_${event.id}_member_${index}_email`] ? "error" : ""}`} />
                                                                {formErrors[`group_${event.id}_member_${index}_email`] && <p className="ae-error">{formErrors[`group_${event.id}_member_${index}_email`]}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Divider */}
                            <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${ANIME_COLORS.primary}44, transparent)` }} />

                            {/* QR & Payment */}
                            <div className="ae-qr-card">
                                <div className="ae-scan" />
                                <div className="relative z-10">
                                    <p className="ae-tag mb-1">Tribute</p>
                                    <p className={`ae-section-title mb-5 ${cinzelFont.className}`}>Payment</p>

                                    <div className="ae-price-row mb-6">
                                        <div>
                                            <p className="ae-label" style={{ marginBottom: '0.2rem' }}>Total Amount</p>
                                            <span className="ae-price-val">₹{totalAmount}</span>
                                        </div>
                                        {!showQRCode && (
                                            <button type="button" onClick={generateQRCode} className="ae-btn" style={{ fontSize: '0.6rem' }}>
                                                Generate QR
                                            </button>
                                        )}
                                    </div>

                                    {showQRCode ? (
                                        <div className="flex justify-center mb-6">
                                            <img src={qrImageUrl || "/placeholder.svg"} alt="Payment QR Code" className="w-52 h-52 border-2 p-2 rounded-xl bg-white" style={{ borderColor: ANIME_COLORS.primary }} />
                                        </div>
                                    ) : (
                                        <p className="ae-label text-center mb-6">Select events above, then generate QR to pay.</p>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="transactionId" className="ae-label">Transaction ID / Reference</label>
                                            <input
                                                type="text"
                                                id="transactionId"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                placeholder="Enter transaction ID"
                                                className={`ae-input ${formErrors.transactionId ? "error" : ""}`}
                                            />
                                            {formErrors.transactionId && <p className="ae-error">{formErrors.transactionId}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="paymentScreenshot" className="ae-label">Payment Screenshot</label>
                                            <input
                                                type="file"
                                                id="paymentScreenshot"
                                                accept="image/*"
                                                onChange={(e) => setPaymentScreenshot(e.target.files![0])}
                                                className={`ae-input cursor-pointer ${formErrors.paymentScreenshot ? "error" : ""}`}
                                            />
                                            {formErrors.paymentScreenshot && <p className="ae-error">{formErrors.paymentScreenshot}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {formErrors.submit && (
                                <div className="ae-error" style={{ border: `1.5px solid ${ANIME_COLORS.accent}90`, background: `${ANIME_COLORS.accent}18`, padding: '0.7rem 1rem', borderRadius: '6px' }}>
                                    ⚠ {formErrors.submit}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                <Link href="/" className="ae-btn-ghost">← Cancel</Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || selectedEvents.length === 0}
                                    className="ae-btn"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Forging...
                                        </span>
                                    ) : "Register"}
                                </button>
                            </div>

                        </form>
                    </section>

                </div>
            </div>
        </main>
    );
}

