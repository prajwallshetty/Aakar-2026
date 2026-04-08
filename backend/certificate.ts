import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generates a certificate PDF for a participant in a specific event.
 * @param participantName Name of the participant
 * @param eventName Name of the event
 * @param certificateId Unique certificate identifier for verification
 * @returns Buffer containing the PDF data
 */
export async function generateCertificate(participantName: string, eventName: string, certificateId: string): Promise<Buffer> {
    try {
        const templatePath = path.join(process.cwd(), 'public', 'certificate_template.pdf');
        const existingPdfBytes = await fs.readFile(templatePath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        // Standard fonts (Helvetica-Bold is a safe bet for templates)
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        // Draw Name - Positioned roughly in the middle
        // Note: These coordinates might need adjustment based on the actual visual design of certificate_template.pdf
        const nameFontSize = 36;
        const nameText = participantName.toUpperCase();
        const nameWidth = fontBold.widthOfTextAtSize(nameText, nameFontSize);
        
        firstPage.drawText(nameText, {
            x: width / 2 - nameWidth / 2,
            y: height / 2 + 20,
            size: nameFontSize,
            font: fontBold,
            color: rgb(0, 0, 0),
        });

        // Draw Event Name
        const eventFontSize = 24;
        const eventText = `for successfully participating in ${eventName}`;
        const eventWidth = fontRegular.widthOfTextAtSize(eventText, eventFontSize);
        
        firstPage.drawText(eventText, {
            x: width / 2 - eventWidth / 2,
            y: height / 2 - 30,
            size: eventFontSize,
            font: fontRegular,
            color: rgb(0.1, 0.1, 0.1),
        });

        // Draw Certificate ID for verification (bottom left)
        firstPage.drawText(`Certificate ID: ${certificateId}`, {
            x: 60,
            y: 50,
            size: 10,
            font: fontRegular,
            color: rgb(0.4, 0.4, 0.4),
        });

        // Generate QR Code for verification
        const qrData = `https://aakar.live/verify/${certificateId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, { margin: 1 });
        const qrImageBytes = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        
        // Position QR code in bottom right corner
        const qrSize = 75;
        firstPage.drawImage(qrImage, {
            x: width - qrSize - 60,
            y: 50,
            width: qrSize,
            height: qrSize,
        });

        // Draw Verification URL text under QR
        firstPage.drawText('aakar.live/verify', {
            x: width - qrSize - 60,
            y: 35,
            size: 8,
            font: fontRegular,
            color: rgb(0.5, 0.5, 0.5),
        });

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    } catch (error) {
        console.error('Error in generateCertificate:', error);
        throw new Error('Failed to generate certificate PDF');
    }
}
