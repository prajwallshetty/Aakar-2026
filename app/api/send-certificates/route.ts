import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend";
import { generateCertificate } from "@/backend/certificate";
import { sendEmail } from "@/backend/nodemailer";
import { isAdmin } from "@/backend/admin";
import { buildCertificateEmail } from "@/backend/email-templates";

// Add delay utility
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
    try {
        // 1. Authorization Check
        const authorized = await isAdmin();
        if (!authorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch Eligible Participants
        const participants = await db.participant.findMany({
            where: {
                paymentStatus: "APPROVED" as any,
                certificateSent: false,
            },
            include: {
                events: true
            }
        });

        // 3. Fetch Eligible Elite Pass Orders via raw SQL fallback
        let elitePassOrders: any[] = [];
        try {
            elitePassOrders = await db.$queryRaw<any[]>`
                SELECT * FROM "ElitePassOrder" 
                WHERE "paymentStatus" = 'APPROVED' AND "certificateSent" = false
            `;
        } catch (err) {
            console.error("Failed to fetch Elite Pass orders for mailing via raw query:", err);
            // Fallback to empty if table or columns are missing
        }

        if (participants.length === 0 && elitePassOrders.length === 0) {
            return NextResponse.json({ message: "No pending certificates." });
        }

        const results = {
            total: participants.length + elitePassOrders.length,
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        // 4. Process Normal Participants (Must have events)
        for (const participant of participants) {
            try {
                if (!participant.events || participant.events.length === 0) {
                    console.warn(`Participant ${participant.email} has no events. Skipping.`);
                    continue;
                }

                const attachments = [];
                const membersData: any = participant.groupMembersData || {};

                for (const event of participant.events) {
                    const certId = `${participant.uuid.slice(0, 8)}-${event.id}`;

                    const pdfBuffer = await generateCertificate(
                        participant.name,
                        event.eventName,
                        certId
                    );

                    attachments.push({
                        filename: `Certificate_${event.eventName.replace(/\s+/g, '_')}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    });

                    // Check for group members for this event
                    const groupEventData = membersData[event.id.toString()];
                    if (groupEventData && Array.isArray(groupEventData.members)) {
                        for (let i = 0; i < groupEventData.members.length; i++) {
                            const member = groupEventData.members[i];
                            if (!member.name) continue;

                            const memberCertId = `${participant.uuid.slice(0, 8)}-${event.id}-M${i}`;
                            const memberPdfBuffer = await generateCertificate(
                                member.name,
                                event.eventName,
                                memberCertId
                            );

                            attachments.push({
                                filename: `Certificate_${member.name.replace(/\s+/g, '_')}_${event.eventName.replace(/\s+/g, '_')}.pdf`,
                                content: memberPdfBuffer,
                                contentType: 'application/pdf'
                            });
                        }
                    }
                }

                await sendEmail(
                    participant.email,
                    "Your Aakar Certificate 🎉",
                    buildCertificateEmail(participant.name, false),
                    attachments
                );

                await db.participant.update({
                    where: { id: participant.id },
                    data: { certificateSent: true, certificateId: participant.uuid }
                });

                results.success++;
                await delay(500);

            } catch (err: any) {
                console.error(`Failed to process participant ${participant.email}:`, err);
                results.failed++;
                results.errors.push(`Participant ${participant.email}: ${err.message || 'Unknown error'}`);
            }
        }

        // 5. Process Elite Pass Orders
        for (const order of elitePassOrders) {
            try {
                const certId = `ELITE-${order.uuid.slice(0, 8)}`;

                const pdfBuffer = await generateCertificate(
                    order.name,
                    "Aakar 2026",
                    certId
                );

                const attachments = [{
                    filename: `Certificate_Aakar_Participation.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }];

                await sendEmail(
                    order.email,
                    "Your Aakar Participation Certificate 🎉",
                    buildCertificateEmail(order.name, true),
                    attachments
                );

                // Update using raw SQL fallback to avoid stale Prisma client errors
                await db.$executeRawUnsafe(`
                    UPDATE "ElitePassOrder"
                    SET "certificateSent" = true, "updatedAt" = CURRENT_TIMESTAMP
                    WHERE "id" = ${order.id}
                `);

                results.success++;
                await delay(500);

            } catch (err: any) {
                console.error(`Failed to process Elite Pass ${order.email}:`, err);
                results.failed++;
                results.errors.push(`Elite Pass ${order.email}: ${err.message || 'Unknown error'}`);
            }
        }

        return NextResponse.json({
            message: "Certificate processing completed",
            ...results
        });

    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
