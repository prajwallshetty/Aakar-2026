import AdminSidebar from "@/components/(Admin)/adminsidebar";
import React from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
})

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`flex bg-gray-100 min-h-screen`}>
            <AdminSidebar />
            <main className={`flex-1 bg-gray-100 min-h-screen p-4 overflow-y-auto ${montserrat.className}`}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
