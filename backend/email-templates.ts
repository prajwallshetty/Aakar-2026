/**
 * Email templates for Aakar 2026.
 * Unified design system: "Simple, Good, and Premium".
 * Focus on "Pass" aesthetic for participant interactions.
 */

const COLORS = {
  primary: "#00ffff", // Cyan
  secondary: "#ff0066", // Pink/Red
  accent: "#cc00ff", // Purple
  bg: "#050818",
  cardBg: "#0a0a2e",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.6)",
  border: "rgba(0, 255, 255, 0.2)",
};

const COMMON_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;600&family=Share+Tech+Mono&display=swap');
  body { margin: 0; padding: 0; background: ${COLORS.bg}; font-family: 'Inter', sans-serif; color: ${COLORS.text}; }
  .pass-container { max-width: 600px; margin: 40px auto; border: 1px solid ${COLORS.border}; border-radius: 12px; overflow: hidden; background: ${COLORS.cardBg}; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
  .pass-header { padding: 32px; background: linear-gradient(135deg, #0a0a2e 0%, #1a0033 100%); text-align: center; border-bottom: 1px dashed ${COLORS.border}; position: relative; }
  .pass-body { padding: 32px; position: relative; }
  .pass-footer { padding: 20px; background: rgba(0,0,0,0.2); text-align: center; font-size: 12px; color: ${COLORS.textMuted}; border-top: 1px solid ${COLORS.border}; }
  .orbitron { font-family: 'Orbitron', sans-serif; }
  .mono { font-family: 'Share Tech Mono', monospace; }
  .glitch-text { text-transform: uppercase; letter-spacing: 4px; color: ${COLORS.primary}; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
  .badge-elite { background: ${COLORS.secondary}; color: white; }
  .badge-standard { background: ${COLORS.primary}; color: #000; }
  .ticket-stub { border-left: 2px dashed ${COLORS.border}; padding-left: 24px; }
`;

export function buildElitePassEmail(name: string, usn: string, transactionId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="pass-container" style="border: 2px solid ${COLORS.secondary};">
    <div class="pass-header">
      <div class="mono" style="font-size: 10px; color: ${COLORS.secondary}; letter-spacing: 4px; margin-bottom: 8px;">AAKAR 2026 // ELITE ACCESS</div>
      <h1 class="orbitron" style="margin: 0; font-size: 36px; letter-spacing: 6px; color: #fff;">ELITE PASS</h1>
      <div style="margin-top: 15px;">
        <span class="badge badge-elite">PREMIUM MEMBER</span>
      </div>
    </div>
    
    <div class="pass-body">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align: top;">
            <div style="margin-bottom: 25px;">
              <label class="mono" style="font-size: 10px; color: ${COLORS.textMuted}; display: block; margin-bottom: 4px;">PARTICIPANT NAME</label>
              <div class="orbitron" style="font-size: 20px; color: ${COLORS.primary};">${name.toUpperCase()}</div>
            </div>
            
            <div style="margin-bottom: 25px;">
              <label class="mono" style="font-size: 10px; color: ${COLORS.textMuted}; display: block; margin-bottom: 4px;">CLEARANCE LEVEL</label>
              <div style="font-size: 16px;">Full Event Access + Premium Perks</div>
            </div>

            <div style="font-size: 13px; color: ${COLORS.textMuted}; line-height: 1.6; margin-top: 30px;">
              This pass grants you entry to all workshops, keynote sessions, and exclusive elite-only zones. Please keep your USN and Transaction ID ready for physical pass collection.
            </div>
          </td>
          <td width="30%" class="ticket-stub" style="vertical-align: top; text-align: center;">
            <div style="margin-bottom: 20px;">
              <label class="mono" style="font-size: 9px; color: ${COLORS.textMuted}; display: block; margin-bottom: 4px;">USN</label>
              <div class="mono" style="font-size: 14px; color: ${COLORS.secondary};">${usn.toUpperCase()}</div>
            </div>
            <div style="margin-bottom: 20px;">
              <label class="mono" style="font-size: 9px; color: ${COLORS.textMuted}; display: block; margin-bottom: 4px;">TXN_ID</label>
              <div class="mono" style="font-size: 10px; word-break: break-all;">${transactionId}</div>
            </div>
            <div style="margin-top: 40px; opacity: 0.5;">
              <div style="height: 60px; background: repeating-linear-gradient(90deg, #fff 0, #fff 2px, transparent 2px, transparent 4px);"></div>
              <div class="mono" style="font-size: 8px; margin-top: 5px;">VERIFIED ACCESS</div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="pass-footer">
      <div class="orbitron" style="letter-spacing: 2px;">AAKAR 2026 • AJIET MANGALURU</div>
      <div style="margin-top: 8px; font-size: 10px;">This is a digital confirmation. Present this at the registration desk.</div>
    </div>
  </div>
</body>
</html>`;
}

export function buildRegistrationEmail(name: string, eventsText: string, uuid: string): string {
  const eventItems = eventsText
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [eventName, ...dateParts] = line.split(" on ");
      const date = dateParts.join(" on ");
      return `
        <div style="padding: 12px; background: rgba(255,255,255,0.05); border-left: 3px solid ${COLORS.primary}; margin-bottom: 10px;">
          <div class="orbitron" style="font-size: 14px; color: #fff;">${eventName.toUpperCase()}</div>
          ${date ? `<div class="mono" style="font-size: 11px; color: ${COLORS.primary}; margin-top: 4px;">${date}</div>` : ""}
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="pass-container">
    <div class="pass-header" style="background: linear-gradient(135deg, #050818 0%, #0a0a2e 100%);">
      <div class="mono" style="font-size: 10px; color: ${COLORS.primary}; letter-spacing: 4px; margin-bottom: 8px;">CONFIRMED ENTRANCE</div>
      <h1 class="orbitron" style="margin: 0; font-size: 32px; letter-spacing: 4px; color: #fff;">REGISTRATION</h1>
    </div>
    
    <div class="pass-body">
      <div style="margin-bottom: 30px;">
        <p style="font-size: 16px; margin-top: 0;">Welcome, <strong>${name}</strong>.</p>
        <p style="font-size: 14px; color: ${COLORS.textMuted};">Your mission roster for Aakar 2026 has been updated. You are registered for the following events:</p>
      </div>

      <div style="margin-bottom: 30px;">
        ${eventItems || '<div class="mono" style="color: rgba(255,255,255,0.2);">[ NO EVENTS LOGGED ]</div>'}
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://aakar.live/addevents/${uuid}" style="display: inline-block; padding: 14px 24px; background: ${COLORS.primary}; color: #000; text-decoration: none; font-weight: bold; font-family: 'Orbitron', sans-serif; font-size: 12px; border-radius: 4px; letter-spacing: 1px;">+ ADD MORE EVENTS</a>
      </div>
    </div>

    <div class="pass-footer">
      <div class="mono" style="font-size: 10px; margin-bottom: 5px;">PASS_UUID: ${uuid.slice(0, 8).toUpperCase()}</div>
      <div class="orbitron" style="letter-spacing: 2px;">AAKAR 2026 • THE FUTURE IS NOW</div>
    </div>
  </div>
</body>
</html>`;
}

export function buildMerchEmail(name: string, variant: string, size: string, transactionId: string): string {
  const variantColor = variant.toLowerCase() === 'neon' ? COLORS.primary : variant.toLowerCase() === 'pro' ? COLORS.secondary : '#ffffff';
  const price = variant.toLowerCase() === 'neon' ? '549' : variant.toLowerCase() === 'pro' ? '599' : '499';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="pass-container" style="border-color: ${variantColor};">
    <div class="pass-header" style="background: linear-gradient(135deg, #0a0a2e 0%, #000 100%);">
      <div class="mono" style="font-size: 10px; color: ${variantColor}; letter-spacing: 4px; margin-bottom: 8px;">ARMORY ACCESS // SECURED</div>
      <h1 class="orbitron" style="margin: 0; font-size: 32px; letter-spacing: 4px; color: #fff;">GEAR SECURED</h1>
    </div>
    
    <div class="pass-body">
      <p style="font-size: 15px;">Greetings, <strong>${name}</strong>. Your Aakar tactical gear has been logged.</p>
      
      <div style="background: rgba(0,0,0,0.3); border: 1px solid ${COLORS.border}; padding: 20px; margin-top: 25px;">
        <table width="100%" style="font-size: 14px;">
          <tr><td style="color: ${COLORS.textMuted}; padding: 8px 0;">VARIANT:</td><td style="color: ${variantColor}; font-weight: bold; text-transform: uppercase;">${variant}</td></tr>
          <tr><td style="color: ${COLORS.textMuted}; padding: 8px 0;">SIZE:</td><td>${size}</td></tr>
          <tr><td style="color: ${COLORS.textMuted}; padding: 8px 0;">CREDITS:</td><td>₹${price}</td></tr>
          <tr><td style="color: ${COLORS.textMuted}; padding: 8px 0;">LOG_ID:</td><td class="mono" style="font-size: 11px;">${transactionId}</td></tr>
        </table>
      </div>

      <p style="font-size: 13px; color: ${COLORS.textMuted}; margin-top: 25px; line-height: 1.6;">
        Pick up your gear at the <strong>Aakar 2026 Tech Hub</strong> during the event. 
        <br/>Contact: <strong>AMAN HASAN</strong> (+91 861 822 9502).
      </p>
    </div>

    <div class="pass-footer">
      <div class="orbitron" style="font-size: 10px; letter-spacing: 2px;">EQUIPMENT // APPAREL // AAKAR 26</div>
    </div>
  </div>
</body>
</html>`;
}

export function buildCertificateEmail(name: string, isElite: boolean = false): string {
  const accent = isElite ? COLORS.secondary : COLORS.primary;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="pass-container" style="border-color: ${accent};">
    <div class="pass-header">
      <div class="mono" style="font-size: 10px; color: ${accent}; letter-spacing: 4px; margin-bottom: 8px;">MISSION ACCOMPLISHED</div>
      <h1 class="orbitron" style="margin: 0; font-size: 28px; letter-spacing: 4px; color: #fff;">CERTIFICATE</h1>
    </div>
    
    <div class="pass-body" style="text-align: center;">
      <h2 class="orbitron" style="color: ${accent}; margin-bottom: 15px;">CONGRATULATIONS!</h2>
      <p style="font-size: 16px; line-height: 1.6;">
        Excellent work, <strong>${name}</strong>. Your participation in Aakar 2026 has been officially certified.
      </p>
      <p style="font-size: 14px; color: ${COLORS.textMuted}; margin-top: 20px;">
        Your official digital certificate is attached to this transmission.
      </p>
      
      <div style="margin-top: 40px; border-top: 1px solid ${COLORS.border}; padding-top: 20px;">
        <p style="font-size: 12px; color: ${COLORS.textMuted};">
          Thank you for being part of the cybernetic odyssey.
        </p>
      </div>
    </div>

    <div class="pass-footer">
      <div class="orbitron" style="font-size: 10px; letter-spacing: 2px;">TEAM AAKAR • AJIET MANGALURU</div>
    </div>
  </div>
</body>
</html>`;
}

export function buildMerchAdminNotificationEmail(order: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>New Merch Order - Aakar 2026</title>
</head>
<body style="font-family: sans-serif; background: #f4f4f4; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <h2 style="color: ${COLORS.secondary}; border-bottom: 2px solid ${COLORS.secondary}; padding-bottom: 10px; margin-top: 0;">New Merch Order Received</h2>
    
    <table width="100%" style="border-collapse: collapse; margin-top: 20px;">
      <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${order.name}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${order.email}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${order.phone}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Variant:</td><td style="padding: 12px; border-bottom: 1px solid #eee; text-transform: uppercase;">${order.merchVariant || 'Classic'}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Size:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${order.size || 'N/A'}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">TXN ID:</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-family: monospace;">${order.transactionId}</td></tr>
    </table>

    <div style="margin-top: 30px; text-align: center;">
      <a href="${order.paymentScreenshotUrl || '#'}" style="display: inline-block; padding: 14px 28px; background: ${COLORS.secondary}; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Payment Screenshot</a>
    </div>

    <p style="margin-top: 30px; font-size: 13px; color: #777; text-align: center;">
      Access the admin panel to verify this transaction.
    </p>
  </div>
</body>
</html>`;
}
