import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend";
import { generateCertificate } from "@/backend/certificate";
import { sendEmail } from "@/backend/nodemailer";
import { isAdmin } from "@/backend/admin";

// Add delay utility
const delay = (ms: number) => new Promise((resolve) => resolve(setTimeout(resolve, ms)));

export async function POST(req: NextRequest) {
    try {
        // 1. Authorization Check
        const authorized = await isAdmin();
        if (!authorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch Eligible Participants
        // We look for approved payments who haven't received their certificate yet.
        const participants = await db.participant.findMany({
            where: {
                paymentStatus: "APPROVED" as any, // Using string as any to bypass potential enum mismatch before generation fully settles
                certificateSent: false,
            },
            include: {
                events: true
            }
        });

        if (participants.length === 0) {
            return NextResponse.json({ message: "No participants pending certificates." });
        }

        const results = {
            total: participants.length,
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        // 3. Process Participants
        for (const participant of participants) {
            try {
                // Skip if no events registered (though shouldn't happen for approved participants)
                if (!participant.events || participant.events.length === 0) {
                    console.warn(`Participant ${participant.email} has no events. Skipping.`);
                    continue;
                }

                const attachments = [];
                
                // Generating certificates for each event
                for (const event of participant.events) {
                    // Generate a unique ID if not already existing
                    // Using participant UUID + event name hash or similar for uniqueness per event
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

                // 4. Send Email
                await sendEmail(
                    participant.email,
                    "Your Aakar Certificate 🎉",
                    `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                        <h2 style="color: #6366f1;">Congratulations, ${participant.name}!</h2>
                        <p>We are thrilled to present you with your official certificates for your participation in <b>Aakar</b>.</p>
                        <p>Attached to this email, you will find your personalized certificates. Your hard work and participation made the event a huge success!</p>
                        <br/>
                        <p>Best regards,</p>
                        <p><b>Team Aakar</b><br/>AJ Institute of Engineering & Technology</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
                        <p style="font-size: 12px; color: #777;">You can verify your certificate by scanning the QR code or visiting our website.</p>
                    </div>
                    `,
                    attachments
                );

                // 5. Update Database
                await db.participant.update({
                    where: { id: participant.id },
                    data: {
                        certificateSent: true,
                        certificateId: participant.uuid // Mark as processed
                    }
                });

                results.success++;

                // 6. Enforce production delay (500ms) as per requirements
                await delay(500);

            } catch (err: any) {
                console.error(`Failed to process ${participant.email}:`, err);
                results.failed++;
                results.errors.push(`${participant.email}: ${err.message || 'Unknown error'}`);
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
