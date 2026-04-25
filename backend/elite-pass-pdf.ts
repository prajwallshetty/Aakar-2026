import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generates a personalized Elite Pass PDF with a unique verification QR code.
 * Uses the elitepass-template.pdf from /public as the base.
 * The template already contains a "Scan Me" label on the right side —
 * we only overlay a QR code beneath it.
 *
 * @param name        Holder's name (unused — template has its own design)
 * @param usn         Holder's USN (unused — template has its own design)
 * @param uuid        Unique order UUID (used for verification link)
 * @returns           Buffer containing the final PDF
 */
export async function generateElitePassPDF(
  _name: string,
  _usn: string,
  uuid: string,
): Promise<Buffer> {
  if (!uuid) {
    console.error('[ElitePassPDF] Error: No UUID provided for PDF generation');
    throw new Error('UUID is required for Elite Pass PDF generation');
  }
  try {
    // ── Load template ──────────────────────────────────────────────
    const templatePath = path.join(process.cwd(), 'public', 'elitepass-template.pdf');
    console.log('[ElitePassPDF] Loading template from:', templatePath);
    const existingPdfBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    console.log('[ElitePassPDF] Template size:', width, 'x', height);

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // ── Build verification ID ──────────────────────────────────────
    // Keep lowercase to match the UUID stored in the database
    // (Prisma startsWith is case-sensitive on PostgreSQL)
    const shortUuid = uuid.slice(0, 8);
    const passId = `ELITE-${shortUuid}`;
    const verifyUrl = `https://aakar.live/verify/${passId}`;
    console.log('[ElitePassPDF] Pass ID:', passId, '| Verify URL:', verifyUrl);

    // ── Generate QR Code ───────────────────────────────────────────
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
    const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    // ── Draw QR Code ───────────────────────────────────────────────
    // Template is 612 x ~198.  The "Scan Me" label is on the right side.
    // Place QR just below "Scan Me" and above "NON TRANSFERABLE".
    const qrSize = 45;
    const qrX = width - qrSize - 55;   // moved a bit to the left
    const qrY = 80;                     // just below "Scan Me" text

    firstPage.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    // ── Save & return ──────────────────────────────────────────────
    const pdfBytes = await pdfDoc.save();
    console.log('[ElitePassPDF] PDF generated successfully, size:', pdfBytes.length, 'bytes');
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('[ElitePassPDF] Error generating Elite Pass PDF:', error);
    throw new Error('Failed to generate Elite Pass PDF');
  }
}

