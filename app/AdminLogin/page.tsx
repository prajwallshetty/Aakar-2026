'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { LockKeyhole } from "lucide-react"; // 👈 Using Lucide icon

const AdminLogin = () => {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-muted px-4 sm:px-8">
            <div className="bg-background w-full max-w-md rounded-lg border border-border p-8 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-primary p-3 rounded-full">
                        <LockKeyhole className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="ml-3 text-2xl font-bold text-foreground">Admin Portal</h2>
                </div>

                {/* Form */}
                <form className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email">Admin Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your admin email"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Admin Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter admin password"
                        />
                    </div>

                    <Button type="submit" className="w-full cursor-pointer">
                        Sign In to Admin
                    </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-border text-center">
                    <Link href="/">
                        <Button variant="outline">Back to Main Site</Button>
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 hidden lg:block h-96 w-64">
                <div
                    className="absolute inset-0 bg-contain bg-no-repeat bg-center"
                    style={{ backgroundImage: "url('/admin-illustration.png')" }}
                />
            </div>
        </div>
    );
};

export default AdminLogin;