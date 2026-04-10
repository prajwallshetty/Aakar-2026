"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkElitePassDuplicates, createElitePassOrder } from "@/backend/elite-pass";
import { cinzelFont } from "@/lib/font";
import {
  AnimeParticleField,
  AnimeOrbField,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS,
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const PASS_PRICE_EARLY = 399;
const PASS_PRICE_REGULAR = 499;

type SoloEventOption = {
  id: number;
  eventName: string;
  eventCategory: string;
  fee: number;
  date: string;
};

const COLLEGES = ["A J Institute of Engineering and Technology, Mangalore", "Alva's Institute of Engineering Technology, Moodbidri", "Manipal Institute of Technology, Manipal", "NITK, Surathkal", "St Joseph Engineering College, Vamanjoor, Mangaluru", "Sahyadri College of Engineering and Management", "MITE - Mangalore Institute of Technology & Engineering", "Karavali Institute of Technology, Mangalore", "SDM College of Engineering and Technology (SDMC)", "Srinivas Institute of Engineering and Technology, Mukka", "P.A. College of Engineering, Mangalore", "N.M.A.M. Institute of Technology, Nitte, Karkala", "Canara Engineering College, Mangalore", "Yenepoya Institute of Technology (YIT), Moodbidri", "Govinda Dasa College, Surathkal", "Other"].sort();

async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= 1.5 * 1024 * 1024) return file;
  return new Promise<File>((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const maxDimension = 1600;
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(objectUrl); resolve(file); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (!blob) { resolve(file); return; }
        const compressed = new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
        resolve(compressed.size < file.size ? compressed : file);
      }, "image/jpeg", 0.8);
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

export default function ElitePassBuyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"details" | "payment" | "confirm">("details");
  const [soloEvents, setSoloEvents] = useState<SoloEventOption[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [eventToAdd, setEventToAdd] = useState("");
  const [isLoadingSoloEvents, setIsLoadingSoloEvents] = useState(true);
  const [soloEventsLoadError, setSoloEventsLoadError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string | undefined }>({});
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", usn: "", college: "", department: "", year: 0,
    transactionId: "", paymentScreenshot: null as File | null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadSoloEvents() {
      setIsLoadingSoloEvents(true);
      setSoloEventsLoadError("");
      try {
        const response = await fetch("/api/events/solo", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.error || "Failed to load solo events");
        }

        const events = Array.isArray(result?.data) ? result.data as SoloEventOption[] : [];
        if (!cancelled) {
          setSoloEvents(events);
        }
      } catch {
        if (!cancelled) {
          setSoloEventsLoadError("Could not load solo events. Refresh and try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSoloEvents(false);
        }
      }
    }

    void loadSoloEvents();
    return () => {
      cancelled = true;
    };
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
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, paymentScreenshot: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      if (formErrors.paymentScreenshot) setFormErrors((prev) => ({ ...prev, paymentScreenshot: undefined }));
    }
  };

  const addSelectedEvent = () => {
    const eventId = Number(eventToAdd);
    if (!eventId) return;

    setSelectedEventIds((prev) => {
      if (prev.includes(eventId)) return prev;
      return [...prev, eventId];
    });
    setEventToAdd("");

    if (formErrors.eventIds) {
      setFormErrors((prev) => ({ ...prev, eventIds: undefined }));
    }
  };

  const removeSelectedEvent = (eventId: number) => {
    setSelectedEventIds((prev) => prev.filter((id) => id !== eventId));
  };

  const handleEventToAddChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventToAdd(e.target.value);

    if (formErrors.eventIds) {
      setFormErrors((prev) => ({ ...prev, eventIds: undefined }));
    }
  };

  const proceedToPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Required";
    if (!formData.email.trim()) errors.email = "Required";
    if (!formData.phone.trim()) errors.phone = "Required";
    if (!formData.usn.trim()) errors.usn = "Required";
    if (!formData.college.trim()) errors.college = "Required";
    if (!formData.department.trim()) errors.department = "Required";
    if (!formData.year || Number.isNaN(formData.year)) errors.year = "Required";
    if (!selectedEventIds.length) errors.eventIds = "Select at least one solo event";
    if (Object.keys(errors).length > 0) { setFormErrors(errors); setGeneralError("Fix the highlighted power stats first."); return; }

    setIsCheckingDuplicates(true);
    const duplicateErrors = await checkElitePassDuplicates({
      email: formData.email,
      usn: formData.usn,
    });
    setIsCheckingDuplicates(false);

    if (duplicateErrors) {
      setFormErrors((prev) => ({ ...prev, ...duplicateErrors }));
      setGeneralError("Email or USN already used for Elite Pass.");
      return;
    }

    setGeneralError("");
    generateQRCode();
    setPaymentStep("payment");
  };

  const generateQRCode = () => {
    const amount = PASS_PRICE_EARLY;
    const upiUrl = `upi://pay?pa=${encodeURIComponent("ajiet@cnrb")}&pn=${encodeURIComponent("Aakar 2026 Elite Pass")}&am=${amount}&cu=INR&tn=${encodeURIComponent("Elite Pass Purchase")}`;
    setQrImageUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`);
  };

  const proceedToConfirm = async () => {
    const errors: { [key: string]: string } = {};
    if (!formData.transactionId.trim()) errors.transactionId = "Transaction ID is required";
    if (!formData.paymentScreenshot) errors.paymentScreenshot = "Screenshot is required";
    if (Object.keys(errors).length > 0) { setFormErrors(errors); setGeneralError("Seal incomplete — fill in payment details."); return; }

    setIsCheckingDuplicates(true);
    const duplicateErrors = await checkElitePassDuplicates({
      transactionId: formData.transactionId,
    });
    setIsCheckingDuplicates(false);

    if (duplicateErrors) {
      setFormErrors((prev) => ({ ...prev, ...duplicateErrors }));
      setGeneralError("Transaction ID already used.");
      return;
    }

    setGeneralError("");
    setPaymentStep("confirm");
  };

  const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.paymentScreenshot) { setFormErrors({ paymentScreenshot: "Required" }); return; }
    setIsSubmitting(true);
    setGeneralError("");
    try {
      const duplicateErrors = await checkElitePassDuplicates({
        email: formData.email,
        usn: formData.usn,
        transactionId: formData.transactionId,
      });
      if (duplicateErrors) {
        setFormErrors((prev) => ({ ...prev, ...duplicateErrors }));
        setGeneralError("Duplicate details found. Update and try again.");
        setIsSubmitting(false);
        return;
      }

      const optimizedFile = await compressImageForUpload(formData.paymentScreenshot);
      const uploadFormData = new FormData();
      uploadFormData.append("file", optimizedFile);
      const uploadResponse = await fetch("/api/elite-pass/upload", { method: "POST", body: uploadFormData });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) { setGeneralError(uploadResult?.error || "Upload failed."); setIsSubmitting(false); return; }
      const screenshotUrl = uploadResult.url as string;
      if (!screenshotUrl) { setGeneralError("Upload failed."); setIsSubmitting(false); return; }
      const result = await createElitePassOrder({
        name: formData.name, email: formData.email, phone: formData.phone,
        usn: formData.usn, college: formData.college, department: formData.department,
        year: formData.year, transactionId: formData.transactionId, paymentScreenshotUrl: screenshotUrl,
        eventIds: selectedEventIds,
      });
      if (!result || result.error) {
        if (typeof result?.error === "object" && result.error !== null) setFormErrors(result.error);
        else setGeneralError(result?.error || "Enrollment failed.");
        setIsSubmitting(false); return;
      }
      router.replace("/aakar-elite-pass/success");
    } catch {
      setGeneralError("Something broke. Try again, hero.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        ${ANIME_GLOBAL_STYLES}

        @keyframes bannerGlitch {
          0%,92%,100% { transform: none; text-shadow: 0 0 18px ${ANIME_COLORS.secondary}80, 0 0 40px ${ANIME_COLORS.secondary}40; }
          93% { transform: translate(-3px,0) skewX(-2deg); text-shadow: -4px 0 ${ANIME_COLORS.accent}, 4px 0 ${ANIME_COLORS.secondary}; }
          95% { transform: translate(3px,0) skewX(2deg); text-shadow: 4px 0 ${ANIME_COLORS.accent}, -4px 0 ${ANIME_COLORS.secondary}; }
          97% { transform: none; }
        }
        @keyframes scanLine {
          0% { top: -4px; opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes rubyPulse {
          0%,100% { opacity: 0.65; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1.03); }
        }
        @keyframes neonBreath {
          0%,100% { box-shadow: 0 0 28px ${ANIME_COLORS.secondary}50, inset 0 0 16px ${ANIME_COLORS.secondary}18; }
          50% { box-shadow: 0 0 44px ${ANIME_COLORS.secondary}65, inset 0 0 22px ${ANIME_COLORS.secondary}28; }
        }
        @keyframes crtScan {
          from { background-position: 0 0; }
          to { background-position: 0 80px; }
        }
        @keyframes shimmerBtn {
          0% { left: -100%; }
          100% { left: 140%; }
        }
        @keyframes tagFlicker {
          0%,100% { opacity: 1; }
          91% { opacity: 1; }
          93% { opacity: 0.25; }
          95% { opacity: 1; }
          97% { opacity: 0.4; }
        }
        @keyframes merchPanelIn {
          from { opacity: 0; transform: translateY(20px) scale(0.975); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes priceIn {
          from { letter-spacing: 0.18em; opacity: 0.4; }
          to { letter-spacing: 0.04em; opacity: 1; }
        }

        .merch-shell { animation: merchPanelIn .5s cubic-bezier(.22,1,.36,1) both; }
        .merch-card {
          background: linear-gradient(155deg, rgba(8,3,18,.97) 0%, rgba(12,5,24,.95) 55%, rgba(9,3,18,.98) 100%);
          border: 1.5px solid ${ANIME_COLORS.secondary}80;
          animation: neonBreath 5s ease-in-out infinite;
          position: relative; overflow: hidden;
        }
        .merch-card::after {
          content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, ${ANIME_COLORS.secondary}07 3px, ${ANIME_COLORS.secondary}07 4px);
          pointer-events: none; z-index: 0; animation: crtScan 7s linear infinite;
        }
        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.secondary}55, transparent);
          animation: scanLine 5s linear infinite; pointer-events: none; z-index: 5;
        }
        .street-banner {
          text-align: center; padding: 2.4rem 1rem 2rem;
          border-bottom: 1.5px solid ${ANIME_COLORS.secondary}44;
          position: relative; z-index: 1;
        }
        .street-banner::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 72% 90% at 50% 115%, ${ANIME_COLORS.secondary}1e 0%, transparent 70%),
                      radial-gradient(ellipse 38% 55% at 18% 50%, ${ANIME_COLORS.accent}12 0%, transparent 60%);
          pointer-events: none;
        }
        .banner-ruby {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.45em;
          color: ${ANIME_COLORS.accent}; text-transform: uppercase;
          padding: 0.22rem 1.1rem; border: 1px solid ${ANIME_COLORS.accent}80;
          background: ${ANIME_COLORS.accent}16;
          clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%);
          animation: rubyPulse 3s ease-in-out infinite; margin-bottom: 1rem;
        }
        .banner-ruby::before, .banner-ruby::after { content: '◆'; font-size: 0.35rem; opacity: 0.7; }
        .banner-title {
          display: block; font-size: clamp(2.8rem, 7.5vw, 3.8rem); line-height: 0.88;
          letter-spacing: 0.06em; text-transform: uppercase; color: #fff;
          text-shadow: 0 0 20px ${ANIME_COLORS.secondary}75, 0 0 45px ${ANIME_COLORS.secondary}35;
          animation: bannerGlitch 8s ease-in-out infinite;
        }
        .banner-title .stroke-word {
          -webkit-text-stroke: 2px ${ANIME_COLORS.secondary}; color: transparent;
          filter: drop-shadow(0 0 10px ${ANIME_COLORS.secondary}cc);
        }
        .banner-sub {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.5em;
          color: ${ANIME_COLORS.secondary}bb; margin-top: 0.9rem; text-transform: uppercase;
        }
        .banner-deco {
          width: 72px; height: 2px; margin: 0.8rem auto 0;
          background: linear-gradient(90deg, transparent, ${ANIME_COLORS.secondary}cc, transparent);
          animation: rubyPulse 2.8s ease-in-out infinite;
        }
        .pane-divider { display: none; }
        @media (min-width: 1024px) {
          .pane-divider {
            display: block; position: absolute; top: 5%; bottom: 5%; left: 50%;
            width: 1.5px;
            background: linear-gradient(180deg, transparent 0%, ${ANIME_COLORS.secondary}55 20%, ${ANIME_COLORS.secondary}55 80%, transparent 100%);
            pointer-events: none;
          }
        }
        .form-pane { position: relative; z-index: 1; }
        .info-tag {
          font-family: 'Share Tech Mono', monospace; font-size: 0.57rem; letter-spacing: 0.5em;
          color: ${ANIME_COLORS.secondary}; text-transform: uppercase;
          animation: tagFlicker 9s ease-in-out infinite;
        }
        .info-title {
          letter-spacing: 0.04em; color: #fff; line-height: 0.9; margin-top: 0.4rem;
          text-transform: uppercase; text-shadow: 0 0 30px ${ANIME_COLORS.secondary}50;
        }
        .step-badge {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: 'Share Tech Mono', monospace; font-size: 0.56rem; letter-spacing: 0.42em;
          color: ${ANIME_COLORS.secondary}; text-transform: uppercase;
          padding: 0.2rem 0.9rem; border: 1px solid ${ANIME_COLORS.secondary}60;
          background: ${ANIME_COLORS.secondary}12; border-radius: 2px; margin-bottom: 0.9rem;
        }
        .field-label {
          font-family: 'Share Tech Mono', monospace; font-size: 0.54rem; letter-spacing: 0.44em;
          color: ${ANIME_COLORS.secondary}; text-transform: uppercase; display: block; margin-bottom: 0.4rem;
        }
        .merch-input {
          width: 100%;
          background: linear-gradient(135deg, rgba(8,3,18,.92), rgba(12,5,24,.88));
          border: 1.5px solid ${ANIME_COLORS.secondary}70; color: ${ANIME_COLORS.text};
          font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; letter-spacing: 0.04em;
          padding: 0.72rem 1rem; border-radius: 6px; outline: none;
          transition: border-color .18s ease, box-shadow .18s ease;
        }
        .merch-input::placeholder { color: ${ANIME_COLORS.text}44; }
        .merch-input:focus {
          border-color: ${ANIME_COLORS.accent};
          box-shadow: 0 0 22px ${ANIME_COLORS.accent}45, inset 0 0 10px ${ANIME_COLORS.accent}20;
        }
        .merch-input.err { border-color: ${ANIME_COLORS.purple}; box-shadow: 0 0 12px ${ANIME_COLORS.purple}40; }
        .err-msg { color: ${ANIME_COLORS.purple}; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; margin-top: 3px; letter-spacing: 0.1em; }
        .error-box {
          border: 1.5px solid ${ANIME_COLORS.purple}90; background: ${ANIME_COLORS.purple}18;
          color: ${ANIME_COLORS.text}; font-family: 'Share Tech Mono', monospace; font-size: 0.78rem;
          letter-spacing: 0.06em; padding: 0.7rem 1rem; border-radius: 6px;
          box-shadow: 0 0 14px ${ANIME_COLORS.purple}35;
        }
        .summary-pane {
          position: relative; z-index: 1; border-top: 1.5px solid ${ANIME_COLORS.secondary}44;
          background: linear-gradient(135deg, ${ANIME_COLORS.secondary}0d 0%, rgba(8,3,18,.6) 60%, ${ANIME_COLORS.secondary}09 100%);
        }
        @media (min-width: 1024px) {
          .summary-pane { border-top: none; border-left: 1.5px solid ${ANIME_COLORS.secondary}44; }
        }
        .summary-card {
          border: 1.5px solid ${ANIME_COLORS.secondary}55;
          background: linear-gradient(155deg, rgba(8,3,18,.95), rgba(12,5,24,.92));
          border-radius: 1rem; padding: 1.6rem; position: relative; overflow: hidden;
          animation: neonBreath 5s ease-in-out infinite;
        }
        .summary-card::after {
          content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, ${ANIME_COLORS.secondary}06 3px, ${ANIME_COLORS.secondary}06 4px);
          pointer-events: none; animation: crtScan 7s linear infinite;
        }
        .summary-row {
          display: flex; justify-content: space-between; align-items: center; gap: 1rem;
          padding: 0.6rem 0; border-bottom: 1px solid ${ANIME_COLORS.secondary}28;
          font-family: 'Share Tech Mono', monospace; font-size: 0.76rem; letter-spacing: 0.04em;
          color: ${ANIME_COLORS.text}cc;
        }
        .summary-row:last-child { border-bottom: none; }
        .summary-row span:last-child { color: ${ANIME_COLORS.secondary}; font-weight: 700; }
        .price-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; border: 1.5px solid ${ANIME_COLORS.accent}80;
          background: linear-gradient(135deg, ${ANIME_COLORS.accent}18 0%, rgba(8,3,18,.9) 55%, ${ANIME_COLORS.accent}0e 100%);
          border-radius: 10px; padding: 1.1rem 1.4rem;
          box-shadow: 0 0 24px ${ANIME_COLORS.accent}28, inset 0 0 14px ${ANIME_COLORS.accent}0e; margin-top: 1.4rem;
        }
        .price-label {
          font-family: 'Share Tech Mono', monospace; font-size: 0.54rem; letter-spacing: 0.44em;
          color: ${ANIME_COLORS.secondary}; text-transform: uppercase; display: block; margin-bottom: 0.24rem;
        }
        .price-val { font-size: 2.2rem; font-weight: 700; color: #fff; letter-spacing: 0.04em; line-height: 1; animation: priceIn .4s ease both; }
        .price-old { font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: ${ANIME_COLORS.text}50; text-decoration: line-through; margin-left: 0.5rem; }
        .limited-tag {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: ${ANIME_COLORS.accent};
          background: ${ANIME_COLORS.accent}20; padding: 0.3rem 0.6rem; border-radius: 4px;
          border: 1px solid ${ANIME_COLORS.accent}; text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 0.5rem; display: inline-block; animation: rubyPulse 2s infinite;
        }
        .buy-btn {
          font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.28em;
          text-transform: uppercase; padding: 0.78rem 1.8rem;
          border: 1.5px solid ${ANIME_COLORS.secondary};
          background: linear-gradient(135deg, ${ANIME_COLORS.secondary}55, ${ANIME_COLORS.secondary}30);
          color: #fff; border-radius: 5px;
          box-shadow: 0 0 22px ${ANIME_COLORS.secondary}50, inset 0 1px 0 ${ANIME_COLORS.secondary}70;
          white-space: nowrap; cursor: pointer; position: relative; overflow: hidden;
          transition: transform .16s ease, box-shadow .16s ease;
        }
        .buy-btn::after {
          content: ''; position: absolute; top: 0; left: -120%; width: 80%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
          animation: shimmerBtn 3.5s ease-in-out infinite;
        }
        .buy-btn:hover { transform: translateY(-2px); box-shadow: 0 0 34px ${ANIME_COLORS.secondary}75, inset 0 1px 0 ${ANIME_COLORS.secondary}; }
        .buy-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .back-btn {
          font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.28em; text-transform: uppercase;
          padding: 0.78rem 1.6rem; border: 1.5px solid ${ANIME_COLORS.secondary}80;
          background: transparent; color: ${ANIME_COLORS.text}bb; border-radius: 5px;
          transition: all .16s ease; text-decoration: none; display: inline-block; cursor: pointer;
        }
        .back-btn:hover { border-color: ${ANIME_COLORS.secondary}; color: ${ANIME_COLORS.text}; box-shadow: 0 0 16px ${ANIME_COLORS.secondary}35; transform: translateY(-1px); }
        .qr-box {
          border: 2px solid ${ANIME_COLORS.accent}; border-radius: 12px; padding: 1.5rem;
          background: linear-gradient(135deg, ${ANIME_COLORS.accent}10, rgba(8,3,18,.9));
          box-shadow: 0 0 30px ${ANIME_COLORS.accent}30; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
        }
        .review-row {
          display: flex; gap: 1rem; padding: 0.6rem 0;
          border-bottom: 1px dashed ${ANIME_COLORS.secondary}30;
          font-family: 'Share Tech Mono', monospace; font-size: 0.78rem;
        }
        .review-row:last-child { border-bottom: none; }
        .review-key { min-width: 110px; font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: ${ANIME_COLORS.secondary}; }
        .review-val { color: ${ANIME_COLORS.text}; }
        .event-controls {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.6rem;
        }
        .event-select {
          color: ${ANIME_COLORS.text};
          background: linear-gradient(135deg, rgba(8,3,18,.92), rgba(12,5,24,.88));
        }
        .event-select option {
          color: #111;
          background: #f4f4f4;
        }
        .event-add-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border: 1.5px solid ${ANIME_COLORS.accent};
          color: ${ANIME_COLORS.accent};
          background: ${ANIME_COLORS.accent}18;
          border-radius: 6px;
          padding: 0 0.9rem;
          min-height: 43px;
          cursor: pointer;
          transition: box-shadow .16s ease, transform .16s ease;
        }
        .event-add-btn:hover { box-shadow: 0 0 14px ${ANIME_COLORS.accent}3a; transform: translateY(-1px); }
        .event-add-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
        .selected-events {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .event-token {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid ${ANIME_COLORS.secondary}75;
          background: linear-gradient(135deg, ${ANIME_COLORS.secondary}16 0%, rgba(8,3,18,.78) 100%);
          color: ${ANIME_COLORS.text};
          border-radius: 999px;
          padding: 0.32rem 0.7rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.66rem;
          letter-spacing: 0.05em;
        }
        .event-remove-btn {
          border: 1px solid ${ANIME_COLORS.secondary};
          color: ${ANIME_COLORS.secondary};
          background: transparent;
          width: 18px;
          height: 18px;
          line-height: 1;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.7rem;
          padding: 0;
        }
        .event-remove-btn:hover { box-shadow: 0 0 10px ${ANIME_COLORS.secondary}3a; }
        .event-meta {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          color: ${ANIME_COLORS.secondary};
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden">
        <AnimeOrbField />
        <AnimeParticleField />
        <div className="absolute inset-0 -z-0 bg-black/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="merch-shell space-y-5">

            {/* ── BANNER ── */}
            <div className="merch-card street-banner rounded-[1.5rem]">
              <div className="scan-line" />
              <span className="banner-ruby">
                {paymentStep === "details" ? "Step 1 of 3 · Hero Credentials" : paymentStep === "payment" ? "Step 2 of 3 · Forge the Seal" : "Step 3 of 3 · Final Pact"}
              </span>
              <h2 className={`banner-title ${cinzelFont.className}`}>
                AAKAR&nbsp;<span className="stroke-word">ELITE PASS</span>
              </h2>
              <p className="banner-sub">guild enrollment &nbsp;·&nbsp; one pass &nbsp;·&nbsp; full access</p>
              <div className="banner-deco" />
            </div>

            {/* ── MAIN CARD ── */}
            <section className="merch-card overflow-hidden rounded-[1.5rem] relative">
              <div className="scan-line" />
              <div className="pane-divider" />
              <div className="grid lg:grid-cols-2">

                {/* LEFT — FORM */}
                <div className="form-pane p-6 lg:p-10 border-b border-[rgba(255,77,0,0.18)] lg:border-b-0">

                  {/* STEP 1: DETAILS */}
                  {paymentStep === "details" && (
                    <form onSubmit={proceedToPayment}>
                      <span className="step-badge">/ 01 &nbsp; Hero Stats</span>
                      <p className="info-tag">Guild Registration</p>
                      <h1 className={`info-title text-[clamp(2rem,5vw,3.2rem)] ${cinzelFont.className}`}>Hero Credentials</h1>

                      {generalError && <div className="error-box mt-4">⚡ {generalError}</div>}

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {([
                          { id: "name", label: "Full Name", placeholder: "Enter your full name", type: "text" },
                          { id: "email", label: "Email", placeholder: "your@email.com", type: "email" },
                          { id: "phone", label: "Phone", placeholder: "+91 XXXXXXXXXX", type: "tel" },
                          { id: "usn", label: "USN", placeholder: "1AJ21CS000", type: "text" },
                          { id: "year", label: "Year of Study", placeholder: "1, 2, 3 or 4", type: "number" },
                          { id: "department", label: "Department", placeholder: "e.g. Computer Science", type: "text" },
                        ] as const).map(({ id, label, placeholder, type }) => (
                          <label key={id} className="space-y-0">
                            <span className="field-label">{label}</span>
                            <input
                              type={type} id={id} className={`merch-input${formErrors[id] ? " err" : ""}`}
                              value={id === "year" ? (formData.year || "") : (formData as any)[id]}
                              onChange={handleChange} placeholder={placeholder}
                              min={id === "year" ? 1 : undefined} max={id === "year" ? 8 : undefined}
                            />
                            {formErrors[id] && <span className="err-msg">⚡ {formErrors[id]}</span>}
                          </label>
                        ))}
                        <label className="space-y-0 md:col-span-2">
                          <span className="field-label">College</span>
                          <input
                            type="text" id="college" list="collegeList"
                            className={`merch-input${formErrors.college ? " err" : ""}`}
                            value={formData.college} onChange={handleChange}
                            placeholder="Search or type your college"
                          />
                          <datalist id="collegeList">
                            {COLLEGES.map((c) => <option key={c} value={c} />)}
                          </datalist>
                          {formErrors.college && <span className="err-msg">⚡ {formErrors.college}</span>}
                        </label>

                        <div className="space-y-2 md:col-span-2">
                          <span className="field-label">Select Solo Events</span>
                          {isLoadingSoloEvents && (
                            <div className="font-mono text-xs" style={{ color: `${ANIME_COLORS.text}88` }}>
                              Syncing solo quest roster...
                            </div>
                          )}

                          {soloEventsLoadError && (
                            <div className="err-msg">⚡ {soloEventsLoadError}</div>
                          )}

                          {!isLoadingSoloEvents && !soloEventsLoadError && soloEvents.length === 0 && (
                            <div className="err-msg">⚡ No solo events are available right now.</div>
                          )}

                          {!isLoadingSoloEvents && !soloEventsLoadError && soloEvents.length > 0 && (
                            <div className="grid gap-3">
                              <div className="event-controls">
                                <select
                                  className="merch-input event-select"
                                  value={eventToAdd}
                                  onChange={handleEventToAddChange}
                                >
                                  <option value="">Choose a solo event</option>
                                  {soloEvents.map((event) => (
                                    <option key={event.id} value={event.id}>
                                      {event.eventName} ({event.eventCategory} · ₹{event.fee})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  className="event-add-btn"
                                  onClick={addSelectedEvent}
                                  disabled={!eventToAdd}
                                >
                                  Add
                                </button>
                              </div>

                              <div className="selected-events">
                                {selectedEventIds.length === 0 && (
                                  <span className="event-meta">No solo events selected yet</span>
                                )}

                                {soloEvents
                                  .filter((event) => selectedEventIds.includes(event.id))
                                  .map((event) => (
                                    <span key={event.id} className="event-token">
                                      {event.eventName}
                                      <button
                                        type="button"
                                        className="event-remove-btn"
                                        onClick={() => removeSelectedEvent(event.id)}
                                        aria-label={`Remove ${event.eventName}`}
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                          {formErrors.eventIds && <span className="err-msg">⚡ {formErrors.eventIds}</span>}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-6">
                        <button type="submit" className="buy-btn" disabled={isCheckingDuplicates}>
                          {isCheckingDuplicates ? "Checking Records..." : "Proceed to Payment →"}
                        </button>
                        <Link href="/aakar-elite-pass" className="back-btn">← Back</Link>
                      </div>
                    </form>
                  )}

                  {/* STEP 2: PAYMENT */}
                  {paymentStep === "payment" && (
                    <div>
                      <span className="step-badge">/ 02 &nbsp; Forge the Seal</span>
                      <p className="info-tag">UPI Payment</p>
                      <h1 className={`info-title text-[clamp(2rem,5vw,3.2rem)] ${cinzelFont.className}`}>Scan & Pay</h1>
                      <p className="mt-3 font-mono text-sm" style={{ color: `${ANIME_COLORS.text}aa`, lineHeight: 1.8 }}>
                        Scan the QR to complete your tribute, then enter the transaction ID.
                      </p>

                      <div className="qr-box mt-6">
                        {qrImageUrl ? (
                          <img src={qrImageUrl} alt="Elite Pass UPI QR" className="w-52 h-52 object-cover" style={{ border: `2px solid ${ANIME_COLORS.accent}`, borderRadius: 8 }} />
                        ) : (
                          <div className="w-52 h-52 flex items-center justify-center font-mono text-xs" style={{ border: `1.5px dashed ${ANIME_COLORS.secondary}44` }}>
                            Initializing Transponder...
                          </div>
                        )}
                        <div>
                          <div className="field-label">UPI ID</div>
                          <div className="font-mono text-sm" style={{ color: ANIME_COLORS.text }}>ajiet@cnrb</div>
                        </div>
                        <div className="font-mono text-xs" style={{ color: `${ANIME_COLORS.secondary}bb`, letterSpacing: "0.2em" }}>
                          Pay ₹{PASS_PRICE_EARLY} (Early Bird)
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <label className="space-y-0 block">
                          <span className="field-label">Transaction ID / UTR</span>
                          <input type="text" id="transactionId" className={`merch-input${formErrors.transactionId ? " err" : ""}`}
                            value={formData.transactionId} onChange={handleChange} placeholder="Enter UTR / Transaction reference" />
                          {formErrors.transactionId && <span className="err-msg">⚡ {formErrors.transactionId}</span>}
                        </label>
                        <label className="space-y-0 block">
                          <span className="field-label">Payment Screenshot</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload}
                            className={`merch-input${formErrors.paymentScreenshot ? " err" : ""}`}
                            style={{ cursor: "pointer" }} />
                          {formErrors.paymentScreenshot && <span className="err-msg">⚡ {formErrors.paymentScreenshot}</span>}
                        </label>
                        {screenshotPreview && (
                          <div className="rounded-lg p-2" style={{ border: `1px solid ${ANIME_COLORS.secondary}40` }}>
                            <img src={screenshotPreview} alt="Preview" className="h-32 w-full object-cover rounded" />
                          </div>
                        )}
                      </div>

                      {generalError && <div className="error-box mt-4">⚡ {generalError}</div>}

                      <div className="flex flex-wrap items-center gap-3 pt-6">
                        <button type="button" className="buy-btn" onClick={proceedToConfirm} disabled={isCheckingDuplicates}>
                          {isCheckingDuplicates ? "Checking Records..." : "Review Pact →"}
                        </button>
                        <button type="button" className="back-btn" onClick={() => setPaymentStep("details")}>← Back</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: CONFIRM */}
                  {paymentStep === "confirm" && (
                    <form onSubmit={submitOrder}>
                      <span className="step-badge">/ 03 &nbsp; Final Pact</span>
                      <p className="info-tag">Confirm & Submit</p>
                      <h1 className={`info-title text-[clamp(2rem,5vw,3.2rem)] ${cinzelFont.className}`}>Review Details</h1>

                      <div className="mt-6 space-y-0" style={{ border: `1.5px solid ${ANIME_COLORS.secondary}40`, borderRadius: 8, padding: "1rem" }}>
                        {([
                          ["Name", formData.name], ["Email", formData.email], ["Phone", formData.phone],
                          ["USN", formData.usn], ["College", formData.college], ["Department", formData.department],
                          ["Year", formData.year?.toString()], ["Transaction ID", formData.transactionId],
                          ["Screenshot", formData.paymentScreenshot?.name || "—"],
                        ]).map(([key, val]) => (
                          <div key={key} className="review-row">
                            <span className="review-key">{key}</span>
                            <span className="review-val">{val}</span>
                          </div>
                        ))}
                        <div className="review-row">
                          <span className="review-key">Solo Events</span>
                          <span className="review-val">
                            {soloEvents
                              .filter((event) => selectedEventIds.includes(event.id))
                              .map((event) => event.eventName)
                              .join(", ") || "—"}
                          </span>
                        </div>
                      </div>

                      {generalError && <div className="error-box mt-4">⚡ {generalError}</div>}

                      <div className="flex flex-wrap items-center gap-3 pt-6">
                        <button type="submit" className="buy-btn" disabled={isSubmitting}>
                          {isSubmitting ? "Forging Pact…" : "Seal the Pact ✓"}
                        </button>
                        <button type="button" className="back-btn" onClick={() => setPaymentStep("payment")}>← Back</button>
                      </div>
                    </form>
                  )}
                </div>

                {/* RIGHT — ORDER SUMMARY */}
                <div className="summary-pane p-6 lg:p-10">
                  <div className="summary-card">
                    <div className="scan-line" />
                    <p className="info-tag relative z-10">Elite Pass Scroll</p>
                    <h2 className={`info-title text-[clamp(1.6rem,3.5vw,2.4rem)] relative z-10 mt-2 ${cinzelFont.className}`}>
                      Elite Clearance
                    </h2>

                    <div className="mt-5 relative z-10">
                      <div className="summary-row"><span>Solo Quests</span><span>{selectedEventIds.length || 0} Selected</span></div>
                      <div className="summary-row"><span>Boss Battle Concert</span><span>Access Granted</span></div>
                      <div className="summary-row"><span>Pass Rank</span><span>S-Class</span></div>
                    </div>

                    <div className="price-row relative z-10">
                      <div>
                        <span className="limited-tag">Early Bird — Till 15th!</span>
                        <span className="price-label">Amount</span>
                        <div className="flex items-baseline gap-2">
                          <span className="price-val">₹{PASS_PRICE_EARLY}</span>
                          <span className="price-old">₹{PASS_PRICE_REGULAR}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FEAT CARDS */}
                  <div className="mt-5 grid grid-cols-2 gap-3 relative z-10">
                    {[["/ 01", "Solo Quests Unlocked"], ["/ 02", "Boss Battle Access"]].map(([num, text], i) => (
                      <div key={num} className="relative p-3 rounded" style={{ border: `1px solid ${ANIME_COLORS.secondary}40`, background: `linear-gradient(135deg, ${ANIME_COLORS.secondary}0c 0%, transparent 70%)`, animationDelay: `${i * 0.08 + 0.06}s` }}>
                        <span className="field-label">{num}</span>
                        <span className="font-mono text-sm" style={{ color: ANIME_COLORS.text, letterSpacing: "0.04em" }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}
