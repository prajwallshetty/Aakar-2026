import { db } from "@/backend";
import { CertificatesDashboard } from "@/components/(Admin)/CertificatesDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aakar Admin | Certificates",
    description: "Manage and send event certificates to participants.",
};

export default async function CertificatesPage() {
    // 1. Count Normal Participants (Approved + must have events)
    const pendingParticipants = await db.participant.count({
        where: {
            paymentStatus: "APPROVED" as any,
            certificateSent: false,
            events: {
                some: {} 
            }
        }
    });

    const sentParticipants = await db.participant.count({
        where: {
            certificateSent: true
        }
    });

    // 2. Count Elite Pass Orders using Raw SQL to bypass stale Prisma client validation
    let pendingElitePass = 0;
    let sentElitePass = 0;

    try {
        const pendingResult = await db.$queryRaw<any[]>`
            SELECT COUNT(*)::int as count FROM "ElitePassOrder" 
            WHERE "paymentStatus" = 'APPROVED' AND "certificateSent" = false
        `;
        pendingElitePass = pendingResult[0]?.count || 0;

        const sentResult = await db.$queryRaw<any[]>`
            SELECT COUNT(*)::int as count FROM "ElitePassOrder" 
            WHERE "certificateSent" = true
        `;
        sentElitePass = sentResult[0]?.count || 0;
    } catch (err) {
        console.error("Failed to fetch ElitePass metrics via raw query:", err);
        // Fallback to 0 if the table isn't ready or columns are missing
    }

    return (
        <div className="container py-8 max-w-7xl mx-auto">
            <CertificatesDashboard 
                initialPendingCount={pendingParticipants + pendingElitePass} 
                initialSentCount={sentParticipants + sentElitePass} 
            />
        </div>
    );
}
