"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle, Clock, RefreshCcw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function MaintenancePage() {
    const [progress, setProgress] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState("--:--")
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [countdown, setCountdown] = useState(60)

    // Simulate maintenance progress
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 95) {
                    clearInterval(interval)
                    return 95
                }
                return prevProgress + Math.random() * 2
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    // Set fixed completion time to 12:00 on May 16th
    useEffect(() => {
        // Fixed time: 00:00 on May 16th
        setTimeRemaining("00:00, May 16th")
    }, [])

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined
        if (autoRefresh && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        } else if (autoRefresh && countdown === 0) {
            window.location.reload()
        }

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [autoRefresh, countdown])

    // Toggle auto-refresh
    const handleAutoRefresh = () => {
        setAutoRefresh((prev) => !prev)
        setCountdown(60)
    }

    // Handle manual refresh
    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg.png')" }}
        >

            {/* Main content area with proper padding for all devices */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
                <Card className="w-full max-w-lg md:max-w-2xl shadow-xl bg-white">
                    <CardContent className="pt-6 px-4 sm:px-6">
                        <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
                            <div className="rounded-full bg-amber-100 p-3">
                                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Maintenance in Progress</h1>
                                <p className="text-muted-foreground text-sm sm:text-base">
                                    We're currently updating our systems to serve you better. Please check back soon.
                                </p>
                            </div>

                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                                    <span>Maintenance progress</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full text-center">
                                <div className="bg-slate-100 rounded-lg p-3 md:p-4">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-slate-600" />
                                    <p className="text-xs sm:text-sm text-muted-foreground">Estimated completion</p>
                                    <p className="font-medium text-sm sm:text-base">{timeRemaining}</p>
                                </div>
                                <div className="bg-slate-100 rounded-lg p-3 md:p-4">
                                    <div className="flex justify-center">
                                        {autoRefresh ? (
                                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-slate-600 animate-spin" />
                                        ) : (
                                            <RefreshCcw className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-slate-600" />
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Auto-refresh</p>
                                    <p className="font-medium text-sm sm:text-base">
                                        {autoRefresh ? `Refreshing in ${countdown}s` : "Disabled"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
                                <Button
                                    onClick={handleAutoRefresh}
                                    variant={autoRefresh ? "default" : "outline"}
                                    className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                                >
                                    {autoRefresh ? "Disable Auto-Refresh" : "Enable Auto-Refresh"}
                                </Button>
                                <Button
                                    onClick={handleRefresh}
                                    variant="outline"
                                    className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                                >
                                    <RefreshCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    Refresh Now
                                </Button>
                            </div>

                            <div className="text-xs sm:text-sm text-muted-foreground">
                                <p>
                                    If you need immediate assistance, please contact our support team at{" "}
                                    <span className="font-medium">support@ajiet-events.com</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <footer className="border-t py-4 md:py-6 bg-black bg-opacity-70 text-white">
                <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-2 md:h-10 md:flex-row">
                    <p className="text-xs sm:text-sm text-center">
                        &copy; {new Date().getFullYear()} A J Institute of Engineering and Technology. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}