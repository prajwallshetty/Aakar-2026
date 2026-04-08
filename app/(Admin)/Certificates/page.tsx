import { db } from "@/backend";
import { CertificatesDashboard } from "@/components/(Admin)/CertificatesDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aakar Admin | Certificates",
    description: "Manage and send event certificates to participants.",
};

export default async function CertificatesPage() {
    // Initial counts for the dashboard
    // We use strings for PaymentStatus to avoid potential enum mismatches in the client
    const pendingCount = await db.participant.count({
        where: {
            paymentStatus: "APPROVED" as any,
            certificateSent: false
        }
    });

    const sentCount = await db.participant.count({
        where: {
            certificateSent: true
        }
    });

    return (
        <div className="container py-8 max-w-7xl mx-auto">
            <CertificatesDashboard 
                initialPendingCount={pendingCount} 
                initialSentCount={sentCount} 
            />
        </div>
    );
}
