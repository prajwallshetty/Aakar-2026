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
  const variantColor = variant.toLowerCase() === 'neon' ? '#00ffff' : variant.toLowerCase() === 'pro' ? '#ff0066' : '#ffffff';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Aakar 2025 – Merch Order Confirmed!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap');
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#050818;font-family:'Share Tech Mono',monospace;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#050818;padding:48px 20px;">
  <tr><td align="center">
    <div style="max-width:600px;width:100%;border: 1px solid #ff006644;position:relative;">
      
      <table width="100%" cellpadding="0" cellspacing="0">
        <!-- HEADER -->
        <tr>
          <td style="background:#1a0033;padding:40px;text-align:center;border-bottom:1px solid #ff006633;">
            <div style="font-family:'Orbitron',sans-serif;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:5px;">GEAR SECURED</div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#ff0066;letter-spacing:10px;margin-top:10px;">AAKAR 2025 MERCH</div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#06091a;padding:40px;">
            <div style="font-family:'Share Tech Mono',monospace;font-size:16px;color:#ffffff;line-height:1.6;margin-bottom:30px;">
              Ready to represent, <span style="color:#ff0066;">${name}</span>?<br/><br/>
              Your order for Aakar 2025 merchandise has been confirmed. You've selected the following gear:
            </div>

            <div style="background:#00000044;border:1px solid #ffffff11;padding:24px;margin-bottom:30px;">
              <table width="100%" style="font-family:'Share Tech Mono',monospace;color:#ffffff;">
                <tr>
                  <td width="40%" style="padding:8px 0;color:#ffffff44;">VARIANT:</td>
                  <td style="padding:8px 0;color:${variantColor};font-weight:700;text-transform:uppercase;">${variant}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#ffffff44;">SIZE:</td>
                  <td style="padding:8px 0;color:#ffffff;">${size}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#ffffff44;">TXN_ID:</td>
                  <td style="padding:8px 0;color:#ffffff66;font-size:11px;">${transactionId}</td>
                </tr>
              </table>
            </div>

            <div style="border-left:2px solid #ff0066;padding-left:20px;font-size:13px;color:#ffffff88;line-height:1.6;">
              <strong style="color:#ffffff;">WHAT'S NEXT?</strong><br/>
              Stay tuned for collection details. We will notify you once your gear is ready for pickup during the fest.
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0a0a2e;padding:20px;text-align:center;font-size:10px;color:#ffffff44;letter-spacing:2px;">
             EQUIPMENT // APPAREL // AAKAR 25
          </td>
        </tr>
      </table>

    </div>
  </td></tr>
</table>
</body>
</html>`;
}
