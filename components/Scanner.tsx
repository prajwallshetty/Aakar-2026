"use client";

import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";

interface ScannerProps {
  onScan: (uuid: string) => void;
  cooldown?: number;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, cooldown = 2000 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastScanTime = useRef<number>(0);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.error("Audio feedback failed:", e);
    }
  };

  const triggerVibration = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const extractUuid = (text: string) => {
    // Check for "elite:" prefix
    if (text.startsWith("elite:")) {
      return text.replace("elite:", "");
    }

    // Check for aakar.live/verify/ format
    if (text.includes("/verify/")) {
      const parts = text.split("/verify/");
      return parts[parts.length - 1].split("?")[0]; // Get the ID after /verify/ and before any query params
    }

    // Generic URL or raw ID fallback
    try {
      if (text.includes("/") || text.includes("?")) {
        const url = new URL(text.startsWith("http") ? text : `https://${text}`);
        const pathParts = url.pathname.split("/").filter(Boolean);
        return pathParts[pathParts.length - 1] || text;
      }
    } catch (e) {
      // Fallback to raw text
    }
    return text;
  };

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
        // Prefer back camera
        const selectedDevice = videoInputDevices.find(device => 
          device.label.toLowerCase().includes("back") || 
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
        ) || videoInputDevices[0];

        if (!selectedDevice) {
            setError("No camera found");
            return;
        }

        const controls = await codeReader.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const now = Date.now();
              if (now - lastScanTime.current < cooldown) return;

              lastScanTime.current = now;
              const text = result.getText();
              const uuid = extractUuid(text);
              
              triggerVibration();
              playBeep();
              onScan(uuid);
            }
          }
        );

        controlsRef.current = controls;
      } catch (err) {
        console.error("Scanner initialization failed:", err);
        setError("Camera access denied or error occurred.");
      }
    };

    startScanner();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [onScan, cooldown]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-600/80 text-white p-4 text-center z-10">
          <div>
            <p className="text-xl font-bold mb-2">Scanner Error</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-white text-red-600 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Scanner Overlay UI */}
      {!error && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <div className="w-1/2 sm:w-64 aspect-square border-2 border-white/50 rounded-2xl sm:rounded-3xl relative">
            {/* Corner Indicators */}
            <div className="absolute -top-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-l-4 border-white rounded-tl-lg sm:rounded-tl-xl"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-r-4 border-white rounded-tr-lg sm:rounded-tr-xl"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-l-4 border-white rounded-bl-lg sm:rounded-bl-xl"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-r-4 border-white rounded-br-lg sm:rounded-br-xl"></div>
            
            {/* Scanning Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/40 animate-scan-line"></div>
          </div>
          <p className="mt-8 text-white/70 text-[10px] sm:text-sm tracking-widest font-medium uppercase px-4 text-center">
            Align QR Code within frame
          </p>
        </div>
      )}

      {/* Global CSS for scanning animation */}
      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Scanner;
