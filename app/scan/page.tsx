"use client";

import React, { useState, useCallback, useEffect } from "react";
import Scanner from "@/components/Scanner";
import { verifyElitePassLink } from "@/lib/api";
import { Loader2, RefreshCw, WifiOff, XCircle, CheckCircle, Clock } from "lucide-react";

type VerificationResult = {
  name: string;
  usn: string;
  college: string;
  phone: string;
  paymentStatus: "APPROVED" | "PENDING" | "FAILED";
} | null;

export default function ScanPage() {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleScan = useCallback(async (uuid: string) => {
    if (loading) return;
    
    setLoading(true);
    setScanning(false);
    setError(null);
    setResult(null);

    try {
      if (!navigator.onLine) {
        throw new Error("No internet connection");
      }

      const data = await verifyElitePassLink(uuid);
      setResult(data);
    } catch (err: any) {
      console.error("Scan verification failed:", err);
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const resetScanner = () => {
    setResult(null);
    setError(null);
    setScanning(true);
    setLoading(false);
  };

  // Status mapping
  const statusConfig = {
    APPROVED: { color: "bg-green-600", icon: CheckCircle, label: "Approved" },
    PENDING: { color: "bg-yellow-500", icon: Clock, label: "Pending" },
    FAILED: { color: "bg-red-600", icon: XCircle, label: "Failed" },
  };

  return (
    <main className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between z-50">
        <h1 className="text-xl font-bold tracking-tight">Elite Pass Scanner</h1>
        {isOffline && (
            <span className="flex items-center gap-2 text-red-500 text-sm font-medium animate-pulse">
                <WifiOff size={16} /> No Internet
            </span>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {scanning ? (
          <Scanner onScan={handleScan} />
        ) : (
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-colors duration-300 ${
            loading ? 'bg-zinc-900' : 
            error ? 'bg-red-900' : 
            result ? statusConfig[result.paymentStatus].color : 'bg-zinc-900'
          }`}>
            
            {loading && (
              <div className="flex flex-col items-center">
                <Loader2 size={64} className="animate-spin text-white/50 mb-4" />
                <p className="text-xl font-medium tracking-wide">Verifying QR...</p>
              </div>
            )}

            {!loading && error && (
              <div className="text-center w-full max-w-md animate-in fade-in zoom-in duration-300">
                <XCircle size={80} className="mx-auto mb-4 opacity-80 sm:w-24 sm:h-24" />
                <h2 className="text-3xl sm:text-5xl font-black mb-2 sm:mb-4 uppercase tracking-tighter">
                  {error === "Invalid QR" ? "INVALID QR" : "ERROR"}
                </h2>
                <p className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-80">{error}</p>
                <button 
                  onClick={resetScanner}
                  className="w-full py-4 sm:py-5 bg-white text-black text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                  <RefreshCw size={24} /> Scan Next
                </button>
              </div>
            )}

            {!loading && result && (
              <div className="w-full max-w-lg flex flex-col items-center animate-in slide-in-from-bottom duration-500 overflow-y-auto no-scrollbar max-h-full py-4">
                {/* Large Result Icon */}
                {React.createElement(statusConfig[result.paymentStatus].icon, {
                    size: 60,
                    className: "mb-4 opacity-20 absolute top-10 -right-4 -rotate-12 pointer-events-none sm:size-[100px]"
                })}

                <div className="w-full text-center mb-6 sm:mb-10">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-1 sm:mb-2 italic">Participant Name</p>
                    <h2 className="text-3xl sm:text-5xl font-black leading-tight break-words uppercase">
                        {result.name}
                    </h2>
                </div>

                <div className="w-full grid grid-cols-1 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <DetailItem label="College" value={result.college} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                        <DetailItem label="USN" value={result.usn} />
                        <DetailItem label="Phone" value={result.phone} />
                    </div>
                    <div className="p-4 sm:p-6 bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm flex items-center justify-between border border-white/5">
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Payment Status</p>
                            <p className="text-xl sm:text-2xl font-black uppercase tracking-wide">{result.paymentStatus}</p>
                        </div>
                        {React.createElement(statusConfig[result.paymentStatus].icon, { size: 32, className: "sm:size-10" })}
                    </div>
                </div>

                <button 
                  onClick={resetScanner}
                  className="w-full py-5 sm:py-6 bg-white text-black text-xl sm:text-2xl font-black rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-transform uppercase tracking-tighter sticky bottom-0"
                >
                  <RefreshCw size={24} className="sm:size-7" /> Next Verification
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {scanning && (
          <footer className="p-6 text-center text-white/40 text-xs backdrop-blur-sm absolute bottom-0 w-full pointer-events-none">
              AAKAR 2026 Verification System
          </footer>
      )}
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="w-full text-left p-4 sm:p-6 bg-black/20 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-sm">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{label}</p>
            <p className="text-lg sm:text-xl font-bold truncate tracking-tight">{value}</p>
        </div>
    );
}
