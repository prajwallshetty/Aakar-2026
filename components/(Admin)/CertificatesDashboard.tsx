"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, CheckCircle2, Loader2, Send, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    initialPendingCount: number;
    initialSentCount: number;
}

export const CertificatesDashboard = ({ initialPendingCount, initialSentCount }: Props) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [pendingCount, setPendingCount] = useState(initialPendingCount);
    const [sentCount, setSentCount] = useState(initialSentCount);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    const handleSendCertificates = async () => {
        if (pendingCount === 0) {
            toast.info("No pending certificates to send.");
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setLogs(["Initiating batch process...", `Found ${pendingCount} participants.`]);

        try {
            const response = await fetch("/api/send-certificates", {
                method: "POST",
            });

            const data = await response.json();

            if (response.ok) {
                setSentCount(prev => prev + data.success);
                setPendingCount(prev => prev - data.success);
                setProgress(100);
                setLogs(prev => [...prev, `Successfully sent ${data.success} certificates.`, `Failed: ${data.failed}`]);
                
                if (data.failed > 0) {
                    toast.warning(`Process completed with ${data.failed} errors.`);
                } else {
                    toast.success("All certificates sent successfully!");
                }
            } else {
                throw new Error(data.error || "Failed to process certificates");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "An unexpected error occurred");
            setLogs(prev => [...prev, `CRITICAL ERROR: ${error.message}`]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
                        <Award className="text-indigo-600" size={32} />
                        Certificate Management
                    </h1>
                    <p className="text-zinc-500 mt-1">
                        Automated generation and distribution system for Aakar 2026.
                    </p>
                </div>
                
                <Button 
                    onClick={handleSendCertificates}
                    disabled={isProcessing || pendingCount === 0}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2" size={18} />
                            Send Certificates
                        </>
                    )}
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-indigo-50/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-600 font-medium">Pending Release</CardDescription>
                        <CardTitle className="text-4xl font-bold text-indigo-950">{pendingCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-indigo-400">Approved participants waiting for certificates</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-emerald-50/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-600 font-medium">Successfully Sent</CardDescription>
                        <CardTitle className="text-4xl font-bold text-emerald-950">{sentCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-emerald-400">Total verified certificates delivered via email</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-amber-50/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-amber-600 font-medium">System Status</CardDescription>
                        <CardTitle className="text-2xl font-bold text-amber-950 flex items-center gap-2">
                            <CheckCircle2 className="text-emerald-500" size={24} />
                            Operational
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-amber-400">All services (SMTP, PDF-Lib) are healthy</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Action Area */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3 border-zinc-100 shadow-xl overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                        <CardTitle className="text-lg">Processing Pipeline</CardTitle>
                        <CardDescription>Track the progress of current batch operations</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className={isProcessing ? "text-indigo-600 animate-pulse" : "text-zinc-600"}>
                                    {isProcessing ? "Encrypting & Mailing..." : "Awaiting Trigger"}
                                </span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-3 bg-zinc-100" indicatorClassName="bg-indigo-600" />
                        </div>

                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-[13px] text-zinc-400 h-[260px] overflow-y-auto border border-zinc-800 shadow-inner">
                            {logs.length === 0 ? (
                                <div className="text-zinc-600 italic">Logs will appear here once processing starts...</div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="mb-1 flex gap-2">
                                        <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
                                        <span className={log.includes('ERROR') ? "text-red-400" : log.includes('Success') ? "text-emerald-400" : "text-indigo-300"}>
                                            {log}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-zinc-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Instructions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-zinc-600">
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900 font-bold">1</div>
                            <p>Verify that participants have their <b>Payment Status</b> set to <b>APPROVED</b> in the Participants list.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900 font-bold">2</div>
                            <p>Ensure the <b>certificate_template.pdf</b> is correctly uploaded to the public directory.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900 font-bold">3</div>
                            <p>Click <b>Send Certificates</b> to start the batch. The system processes users with 500ms delay to ensure high deliverability.</p>
                        </div>
                        
                        <div className="pt-4 border-t border-zinc-100 mt-4">
                            <div className="flex items-center gap-2 text-amber-600 font-medium mb-1">
                                <AlertCircle size={16} />
                                Important Note
                            </div>
                            <p className="text-xs italic text-zinc-500">
                                This process cannot be undone. Once a certificate is sent, the participant is marked as 'Complete' to avoid duplicates.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
