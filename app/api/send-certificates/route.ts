import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend";
import { generateCertificate } from "@/backend/certificate";
import { sendEmail } from "@/backend/nodemailer";
import { isAdmin } from "@/backend/admin";

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
                }

                await sendEmail(
                    participant.email,
                    "Your Aakar Certificate 🎉",
                    `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                        <h2 style="color: #6366f1;">Congratulations, ${participant.name}!</h2>
                        <p>We are thrilled to present you with your official certificates for your participation in <b>Aakar</b>.</p>
                        <p>Attached to this email, you will find your personalized certificates.</p>
                        <br/>
                        <p>Best regards,</p>
                        <p><b>Team Aakar</b><br/>AJ Institute of Engineering & Technology</p>
                    </div>
                    `,
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
                    "Aakar 2025", 
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
                    `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                        <h2 style="color: #6366f1;">Congratulations, ${order.name}!</h2>
                        <p>Thank you for being part of <b>Aakar</b> as an Elite Pass holder.</p>
                        <p>Attached to this email, you will find your official participation certificate.</p>
                        <br/>
                        <p>Best regards,</p>
                        <p><b>Team Aakar</b><br/>AJ Institute of Engineering & Technology</p>
                    </div>
                    `,
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
