import AdminSidebar from "@/components/(Admin)/adminsidebar";
import React from "react";
import { Montserrat, Cinzel } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

const cinzel = Cinzel({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-cinzel",
});

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`${montserrat.variable} ${cinzel.variable} font-montserrat flex bg-gray-100 min-h-screen`}>
            <AdminSidebar />
            <main className={`flex-1 bg-gray-100 min-h-screen p-4 overflow-y-auto ${montserrat.className}`}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
