/**
 * Email templates for Aakar 2026.
 * Using a cyberpunk/premium aesthetic consistent with registration emails.
 */

export function buildElitePassEmail(name: string, usn: string, transactionId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Aakar 2025 – Elite Pass Confirmed!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap');

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes flicker {
      0%, 100% { opacity: 1; }
      92% { opacity: 1; }
      93% { opacity: 0.7; }
      94% { opacity: 1; }
      96% { opacity: 0.5; }
      97% { opacity: 1; }
    }
    @keyframes glitch {
      0%, 100% { text-shadow: 2px 0 #ff0066, -2px 0 #00ffff; }
      25% { text-shadow: -2px 0 #ff0066, 2px 0 #00ffff; transform: translateX(1px); }
      50% { text-shadow: 2px 0 #00ffff, -2px 0 #ff0066; transform: translateX(-1px); }
      75% { text-shadow: 0 2px #ff0066, 0 -2px #00ffff; }
    }
    @keyframes pulse-border {
      0%, 100% { box-shadow: 0 0 8px #00ffff, 0 0 20px #00ffff44, inset 0 0 8px #00ffff22; }
      50% { box-shadow: 0 0 16px #ff0066, 0 0 40px #ff006644, inset 0 0 16px #ff006622; }
    }
    @keyframes data-stream {
      0% { background-position: 0 0; }
      100% { background-position: 0 200px; }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#050818;font-family:'Share Tech Mono',monospace;">

<!-- Scanline overlay -->
<div style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(transparent,rgba(0,255,255,0.08),transparent);animation:scanline 6s linear infinite;"></div>
</div>

<table width="100%" cellpadding="0" cellspacing="0" style="
  background:#050818;
  background-image:
    radial-gradient(ellipse at 20% 50%, #0d0d3320 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, #1a002620 0%, transparent 50%),
    linear-gradient(#00ffff08 1px, transparent 1px),
    linear-gradient(90deg, #00ffff08 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 28px 28px, 28px 28px;
  padding:48px 20px;
  animation: flicker 8s infinite;
">
  <tr><td align="center">

    <!-- OUTER GLOW FRAME -->
    <div style="
      max-width:620px;
      width:100%;
      position:relative;
      animation: pulse-border 3s ease-in-out infinite;
      border: 1px solid #00ffff44;
      border-radius: 2px;
    ">

      <!-- Corner decorations -->
      <div style="position:absolute;top:-2px;left:-2px;width:20px;height:20px;border-top:2px solid #00ffff;border-left:2px solid #00ffff;"></div>
      <div style="position:absolute;top:-2px;right:-2px;width:20px;height:20px;border-top:2px solid #ff0066;border-right:2px solid #ff0066;"></div>
      <div style="position:absolute;bottom:-2px;left:-2px;width:20px;height:20px;border-bottom:2px solid #ff0066;border-left:2px solid #ff0066;"></div>
      <div style="position:absolute;bottom:-2px;right:-2px;width:20px;height:20px;border-bottom:2px solid #00ffff;border-right:2px solid #00ffff;"></div>

      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:2px;overflow:hidden;">

        <!-- ═══ HEADER ═══ -->
        <tr>
          <td style="
            background: linear-gradient(135deg, #0a0a2e 0%, #1a0033 50%, #0a0a2e 100%);
            padding:32px 36px 28px;
            text-align:center;
            border-bottom: 1px solid #00ffff33;
            position:relative;
            overflow:hidden;
          ">
            <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(45deg,transparent,transparent 10px,#ffffff04 10px,#ffffff04 11px);pointer-events:none;"></div>

            <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:#00ffff88;letter-spacing:5px;margin-bottom:14px;position:relative;">
              ▸ SYSTEM://ELITE.PASS/LEVEL_CLEAR ▸ ACCESS_GRANTED ▸
            </div>

            <div style="
              font-family:'Orbitron',sans-serif;
              font-size:48px;
              font-weight:900;
              color:#ffffff;
              letter-spacing:8px;
              text-transform:uppercase;
              line-height:1;
              animation: glitch 4s infinite;
              position:relative;
            ">ELITE PASS</div>

            <div style="
              display:inline-block;
              background: transparent;
              border: 1px solid #00ffff;
              color:#00ffff;
              font-family:'Share Tech Mono',monospace;
              font-size:13px;
              letter-spacing:10px;
              padding:4px 18px;
              margin:10px 0 12px;
              position:relative;
            ">
              A A K A R 2 5
            </div>
          </td>
        </tr>

        <!-- ═══ BODY ═══ -->
        <tr>
          <td style="background:#06091a;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:32px;">
                  <div style="margin-bottom:24px;">
                    <span style="
                      background:#00ffff12;
                      border:1px solid #00ffff;
                      color:#00ffff;
                      font-family:'Share Tech Mono',monospace;
                      font-size:10px;
                      letter-spacing:3px;
                      padding:6px 14px;
                    ">
                      ELITE_STATUS: ACTIVE
                    </span>
                  </div>

                  <div style="font-family:'Share Tech Mono',monospace;font-size:16px;color:#ffffff;line-height:1.6;margin-bottom:30px;">
                    Greetings, <span style="color:#00ffff;font-weight:700;">${name}</span>.<br/><br/>
                    Your Elite Pass for Aakar 2025 has been successfully processed. You now have full access to all premium events and amenities.
                  </div>

                  <div style="background:#00000044;border:1px solid #ffffff11;padding:20px;margin-bottom:30px;">
                    <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:#ffffff44;letter-spacing:2px;margin-bottom:12px;">◈ PASS_CERTIFICATE_DETAILS</div>
                    <table width="100%" style="font-family:'Share Tech Mono',monospace;font-size:13px;color:#ffffff;">
                      <tr><td width="40%" style="padding:6px 0;color:#ffffff44;">USN:</td><td style="padding:6px 0;color:#00ffff;">${usn}</td></tr>
                      <tr><td style="padding:6px 0;color:#ffffff44;">TXN_ID:</td><td style="padding:6px 0;color:#ff0066;">${transactionId}</td></tr>
                    </table>
                  </div>

                  <div style="font-family:'Share Tech Mono',monospace;font-size:12px;color:#ffffff66;line-height:1.5;">
                    Please present this email at the registration desk to collect your physical pass and welcome kit.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ═══ FOOTER ═══ -->
        <tr>
          <td style="background:#0a0a2e;padding:24px 32px;border-top:1px solid #00ffff33;text-align:center;">
            <div style="font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;color:#ffffff88;letter-spacing:2px;">AAKAR 2025 · THE CYBERNETIC ODYSSEY</div>
          </td>
        </tr>
      </table>
    </div>
  </td></tr>
</table>
</body>
</html>`;
}

export function buildMerchEmail(name: string, variant: string, size: string, transactionId: string): string {
  const variantDisplay = variant.charAt(0).toUpperCase() + variant.slice(1);
  const variantColor = variant.toLowerCase() === 'neon' ? '#00ffff' : variant.toLowerCase() === 'pro' ? '#ff0066' : '#ffffff';
  
  // Inferred price for display in email
  const price = variant.toLowerCase() === 'neon' ? '549' : variant.toLowerCase() === 'pro' ? '599' : '499';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Aakar 2025 – Merch Order Confirmed!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap');

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(0.98); }
    }
    @keyframes glow {
      0%, 100% { text-shadow: 0 0 10px ${variantColor}88, 0 0 20px ${variantColor}44; }
      50% { text-shadow: 0 0 15px ${variantColor}, 0 0 30px ${variantColor}88; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#050818;font-family:'Share Tech Mono',monospace;color:#ffffff;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#050818;padding:40px 10px;">
  <tr><td align="center">
    
    <div style="max-width:600px;width:100%;border: 1px solid ${variantColor}44;background:#0a0a2e;position:relative;overflow:hidden;border-radius:4px;">
      
      <!-- Scanline overlay effect -->
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);"></div>

      <table width="100%" cellpadding="0" cellspacing="0" style="position:relative;z-index:2;">
        <!-- HEADER -->
        <tr>
          <td style="background: linear-gradient(135deg, #0a0a2e 0%, #1a0033 100%); padding:40px 20px; text-align:center; border-bottom: 1px solid ${variantColor}22;">
            <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:${variantColor};letter-spacing:5px;margin-bottom:10px;text-transform:uppercase;">▸ SYSTEM://ARMORY/LINK_ESTABLISHED ▸</div>
            <div style="font-family:'Orbitron',sans-serif;font-size:36px;font-weight:900;color:#ffffff;letter-spacing:4px;text-transform:uppercase;margin:0;">GEAR SECURED</div>
            <div style="display:inline-block;margin-top:15px;padding:4px 15px;border:1px solid #ff0066;color:#ff0066;font-size:12px;letter-spacing:3px;">AAKAR 2025 MERCH</div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 30px;background:#06091a;">
            <div style="font-family:'Share Tech Mono',monospace;font-size:16px;line-height:1.6;margin-bottom:30px;">
              Greetings, <span style="color:${variantColor};font-weight:700;">${name}</span>. <br/><br/>
              Your request for Aakar 2025 tactical apparel has been logged and encrypted. You are now part of the movement.
            </div>

            <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);padding:25px;margin-bottom:30px;border-left:4px solid ${variantColor};">
              <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:2px;margin-bottom:15px;">◈ ORDER_MANIFEST</div>
              
              <table width="100%" style="font-family:'Share Tech Mono',monospace;color:#ffffff;font-size:14px;">
                <tr>
                  <td width="40%" style="padding:8px 0;color:rgba(255,255,255,0.4);">ARMOR_CLASS:</td>
                  <td style="padding:8px 0;color:${variantColor};font-weight:700;text-transform:uppercase;letter-spacing:1px;">${variantDisplay}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:rgba(255,255,255,0.4);">CHASSIS_SIZE:</td>
                  <td style="padding:8px 0;">${size}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:rgba(255,255,255,0.4);">CREDITS:</td>
                  <td style="padding:8px 0;">₹${price}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:rgba(255,255,255,0.4);">LOG_ID:</td>
                  <td style="padding:8px 0;font-size:11px;color:rgba(255,255,255,0.6);">${transactionId}</td>
                </tr>
              </table>
            </div>

            <div style="border: 1px dashed ${variantColor}44; padding: 20px; text-align:center;">
              <div style="font-family:'Orbitron',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;margin-bottom:10px;color:#ffffff;">NEXT STEPS</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
                Verification in progress. Once the transmission is confirmed, your gear will be prepared for pickup at the <strong>Aakar 2025 Tech Hub</strong> during the event.
              </div>
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0a0a2e;padding:25px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
            <div style="font-family:'Orbitron',sans-serif;font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:3px;">
              EQUIPMENT // APPAREL // AAKAR 25
            </div>
            <div style="margin-top:10px;font-size:9px;color:rgba(255,255,255,0.2);">
              DO NOT REPLY TO THIS AUTOMATED UPLINK
            </div>
          </td>
        </tr>
      </table>

    </div>

    <div style="margin-top:20px;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:2px;">
      Powering the Future @ AJIET
    </div>

  </td></tr>
</table>

</body>
</html>`;
}
export function buildMerchAdminNotificationEmail(order: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>New Merch Order - Aakar 2025</title>
</head>
<body style="font-family:sans-serif; background:#f4f4f4; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; padding:20px; border-radius:8px; border:1px solid #ddd;">
    <h2 style="color:#333; border-bottom:2px solid #ff0066; padding-bottom:10px;">New Merch Order Received</h2>
    
    <table width="100%" style="border-collapse:collapse; margin-top:20px;">
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Name:</td><td style="padding:8px; border-bottom:1px solid #eee;">${order.name}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Email:</td><td style="padding:8px; border-bottom:1px solid #eee;">${order.email}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Phone:</td><td style="padding:8px; border-bottom:1px solid #eee;">${order.phone}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Variant:</td><td style="padding:8px; border-bottom:1px solid #eee; text-transform:uppercase;">${order.merchVariant || 'Classic'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Size:</td><td style="padding:8px; border-bottom:1px solid #eee;">${order.size}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">TXN ID:</td><td style="padding:8px; border-bottom:1px solid #eee; font-family:monospace;">${order.transactionId}</td></tr>
    </table>

    <div style="margin-top:30px; text-align:center;">
      <a href="${order.paymentScreenshotUrl || '#'}" style="display:inline-block; padding:12px 25px; background:#ff0066; color:#fff; text-decoration:none; border-radius:4px; font-weight:bold;">View Payment Screenshot</a>
    </div>

    <p style="margin-top:30px; font-size:12px; color:#666; text-align:center;">
      Access the admin panel to verify this transaction.
    </p>
  </div>
</body>
</html>`;
}
