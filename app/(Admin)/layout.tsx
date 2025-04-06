import AdminSidebar from "@/components/(Admin)/adminsidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 bg-gray-100 min-h-screen p-4 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
