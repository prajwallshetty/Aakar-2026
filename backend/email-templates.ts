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
  <title>Aakar 2026 – Elite Pass Confirmed!</title>
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
                    Your Elite Pass for Aakar 2026 has been successfully processed. You now have full access to all premium events and amenities.
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
            <div style="font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;color:#ffffff88;letter-spacing:2px;">AAKAR 2026 · THE CYBERNETIC ODYSSEY</div>
          </td>
        </tr>
      </table>
    </div>
  </td></tr>
</table>
</body>
</html>`;
}

export function buildRegistrationEmail(name: string, eventsText: string, uuid: string): string {
  const eventRows = eventsText
    .split("\n")
    .filter(Boolean)
    .map((line, i) => {
      const [eventName, ...dateParts] = line.split(" on ");
      const date = dateParts.join(" on ");
      const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff0066"];
      const bg = colors[i % colors.length];
      const textColor = "#000000";
      return `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr>
                <td style="background:${bg};border:3px solid #000000;padding:12px 18px;box-shadow:4px 4px 0 #000;">
                  <span style="display:block;font-family:'Arial Black',Impact,sans-serif;font-size:14px;font-weight:900;color:${textColor};text-transform:uppercase;letter-spacing:1px;">${eventName}</span>
                  ${date ? `<span style="display:block;font-family:'Courier New',monospace;font-size:11px;color:#000;margin-top:4px;font-weight:700;letter-spacing:2px;">▸ ${date.toUpperCase()}</span>` : ""}
                </td>
              </tr>
            </table>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Aakar 2026 – You're IN!</title>
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
            <!-- BG diagonal lines -->
            <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(45deg,transparent,transparent 10px,#ffffff04 10px,#ffffff04 11px);pointer-events:none;"></div>

            <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:#00ffff88;letter-spacing:5px;margin-bottom:14px;position:relative;">
              ▸ SYSTEM://CULTURAL.FEST/TICKET ▸ ADMIT_ONE ▸ VALID_PASS ▸
            </div>

            <!-- AAKAR title with glitch -->
            <div style="
              font-family:'Orbitron',sans-serif;
              font-size:58px;
              font-weight:900;
              color:#ffffff;
              letter-spacing:10px;
              text-transform:uppercase;
              line-height:1;
              animation: glitch 4s infinite;
              position:relative;
            ">AAKAR</div>

            <div style="
              display:inline-block;
              background: transparent;
              border: 1px solid #ff0066;
              color:#ff0066;
              font-family:'Share Tech Mono',monospace;
              font-size:13px;
              letter-spacing:10px;
              padding:4px 18px;
              margin:10px 0 12px;
              position:relative;
            ">
              2 0 2 6
              <span style="position:absolute;top:-1px;left:-1px;width:6px;height:6px;background:#ff0066;"></span>
              <span style="position:absolute;top:-1px;right:-1px;width:6px;height:6px;background:#ff0066;"></span>
              <span style="position:absolute;bottom:-1px;left:-1px;width:6px;height:6px;background:#ff0066;"></span>
              <span style="position:absolute;bottom:-1px;right:-1px;width:6px;height:6px;background:#ff0066;"></span>
            </div>

            <div style="font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:600;color:#ffffff66;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">
              A.J. INSTITUTE OF ENGINEERING &amp; TECHNOLOGY
            </div>
          </td>
        </tr>

        <!-- ═══ BODY ═══ -->
        <tr>
          <td style="background:#06091a;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>

                <!-- LEFT PANEL -->
                <td style="
                  padding:30px 28px 30px 32px;
                  border-right: 1px dashed #00ffff33;
                  vertical-align:top;
                  width:68%;
                ">

                  <!-- STATUS BADGE -->
                  <div style="margin-bottom:24px;">
                    <span style="
                      display:inline-flex;
                      align-items:center;
                      gap:8px;
                      background:#00ffff12;
                      border:1px solid #00ffff;
                      color:#00ffff;
                      font-family:'Share Tech Mono',monospace;
                      font-size:9px;
                      letter-spacing:3px;
                      padding:6px 14px;
                    ">
                      <span style="width:6px;height:6px;background:#00ffff;border-radius:50%;display:inline-block;animation:blink 1s infinite;"></span>
                      REGISTRATION_CONFIRMED
                    </span>
                  </div>

                  <!-- NAME -->
                  <div style="margin-bottom:24px;">
                    <div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:#ffffff44;letter-spacing:4px;margin-bottom:6px;">◈ OPERATOR_ID</div>
                    <div style="
                      font-family:'Orbitron',sans-serif;
                      font-size:22px;
                      font-weight:700;
                      color:#ffffff;
                      letter-spacing:3px;
                      text-transform:uppercase;
                      border-left:3px solid #ff0066;
                      padding-left:12px;
                      line-height:1.2;
                    ">${name}</div>
                  </div>

                  <!-- EVENTS -->
                  <div style="margin-bottom:24px;">
                    <div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:#ffffff44;letter-spacing:4px;margin-bottom:10px;">◈ MISSION_ROSTER</div>
                    <div style="
                      background:#00000044;
                      border:1px solid #ffffff11;
                      padding:14px 16px;
                    ">
                      ${eventRows || `<div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#ffffff33;letter-spacing:2px;">[ NO_EVENTS_LOGGED ]</div>`}
                    </div>
                  </div>

                  <!-- CTA -->
                  <a href="https://aakar.live/addevents/${uuid}"
                     style="
                       display:inline-block;
                       background: linear-gradient(90deg, #ff0066, #cc0044);
                       color:#ffffff;
                       text-decoration:none;
                       font-family:'Orbitron',sans-serif;
                       font-size:10px;
                       font-weight:700;
                       letter-spacing:3px;
                       text-transform:uppercase;
                       padding:12px 22px;
                       border:1px solid #ff0066;
                       position:relative;
                     ">
                    <span style="position:absolute;top:-1px;left:-1px;width:8px;height:8px;border-top:1px solid #ff0066;border-left:1px solid #ff0066;"></span>
                    <span style="position:absolute;bottom:-1px;right:-1px;width:8px;height:8px;border-bottom:1px solid #ff0066;border-right:1px solid #ff0066;"></span>
                    ＋ ADD MORE EVENTS →
                  </a>
                </td>

                <!-- RIGHT STUB -->
                <td style="
                  background: linear-gradient(180deg, #0d002a 0%, #1a0040 100%);
                  padding:24px 16px;
                  text-align:center;
                  vertical-align:top;
                  width:32%;
                  position:relative;
                  overflow:hidden;
                ">
                  <!-- BG data stream -->
                  <div style="
                    position:absolute;top:0;left:0;right:0;bottom:0;
                    background: repeating-linear-gradient(180deg, transparent 0px, transparent 3px, #ff006608 3px, #ff006608 4px);
                    animation: data-stream 3s linear infinite;
                    pointer-events:none;
                  "></div>

                  <!-- Vertical AAKAR -->
                  <div style="
                    writing-mode:vertical-rl;
                    transform:rotate(180deg);
                    font-family:'Orbitron',sans-serif;
                    font-size:22px;
                    font-weight:900;
                    color:#ff0066;
                    letter-spacing:8px;
                    margin:0 auto 20px;
                    display:block;
                    text-shadow: 0 0 10px #ff006688;
                    position:relative;
                  ">AAKAR</div>

                  <!-- Anime-style hexagon badge -->
                  <div style="margin:12px auto;width:70px;height:70px;position:relative;">
                    <div style="
                      width:70px;height:70px;
                      background: conic-gradient(#00ffff, #ff0066, #cc00ff, #00ffff);
                      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                      display:flex;align-items:center;justify-content:center;
                      animation: spin-slow 8s linear infinite;
                    ">
                    </div>
                    <div style="
                      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                      width:50px;height:50px;
                      background:#06091a;
                      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                      display:flex;align-items:center;justify-content:center;
                      flex-direction:column;
                    ">
                      <div style="font-family:'Orbitron',sans-serif;font-size:7px;font-weight:700;color:#00ffff;letter-spacing:0.5px;text-align:center;line-height:1.4;">VALID<br/>PASS</div>
                    </div>
                  </div>

                  <!-- Barcode mock -->
                  <div style="margin:18px auto;width:56px;">
                    <div style="
                      height:55px;
                      background:repeating-linear-gradient(90deg,
                        #00ffff 0px,#00ffff 2px,
                        #06091a 2px,#06091a 4px,
                        #00ffff 4px,#00ffff 5px,
                        #06091a 5px,#06091a 8px,
                        #00ffff 8px,#00ffff 9px,
                        #06091a 9px,#06091a 12px
                      );
                      opacity:0.7;
                      border:1px solid #00ffff44;
                    "></div>
                    <div style="font-family:'Share Tech Mono',monospace;font-size:6px;color:#00ffff66;letter-spacing:1px;margin-top:4px;text-align:center;">2026-AJIET</div>
                  </div>

                  <!-- ID number -->
                  <div style="
                    font-family:'Share Tech Mono',monospace;
                    font-size:8px;
                    color:#ff006688;
                    letter-spacing:1px;
                    margin-top:8px;
                  ">#UID-${uuid ? uuid.toString().slice(0, 8).toUpperCase() : 'XXXXXXXX'}</div>
                </td>

              </tr>
            </table>
          </td>
        </tr>

        <!-- ═══ TEAR LINE ═══ -->
        <tr>
          <td style="background:#06091a;border-top:1px dashed #00ffff33;border-bottom:1px dashed #00ffff33;padding:8px 32px;">
            <div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:#ffffff22;letter-spacing:2px;">
              ✦ ───────── DETACH HERE ─────────── ✦ ───────── DETACH HERE ─────────── ✦
            </div>
          </td>
        </tr>

        <!-- ═══ FOOTER ═══ -->
        <tr>
          <td style="
            background: linear-gradient(90deg, #0a0a2e 0%, #0d001a 100%);
            padding:18px 32px;
            border-top:1px solid #ff006633;
          ">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <div style="font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;color:#ffffff88;letter-spacing:2px;">AAKAR 2026 · CULTURAL FEST</div>
                  <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:#ffffff44;margin-top:4px;">
                    QUERIES? <a href="mailto:aakar2026@ajiet.edu.in" style="color:#00ffff;text-decoration:none;">aakar2026@ajiet.edu.in</a>
                  </div>
                </td>
                <td style="text-align:right;vertical-align:middle;">
                  <div style="
                    display:inline-block;
                    background:transparent;
                    border:1px solid #cc00ff;
                    color:#cc00ff;
                    font-family:'Share Tech Mono',monospace;
                    font-size:8px;
                    letter-spacing:3px;
                    padding:5px 10px;
                    position:relative;
                  ">
                    <span style="position:absolute;top:-1px;left:-1px;width:5px;height:5px;border-top:1px solid #cc00ff;border-left:1px solid #cc00ff;"></span>
                    <span style="position:absolute;bottom:-1px;right:-1px;width:5px;height:5px;border-bottom:1px solid #cc00ff;border-right:1px solid #cc00ff;"></span>
                    NON-TRANSFERABLE
                  </div>
                </td>
              </tr>
            </table>
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
  <title>Aakar 2026 – Merch Order Confirmed!</title>
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
            <div style="display:inline-block;margin-top:15px;padding:4px 15px;border:1px solid #ff0066;color:#ff0066;font-size:12px;letter-spacing:3px;">AAKAR 2026 MERCH</div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 30px;background:#06091a;">
            <div style="font-family:'Share Tech Mono',monospace;font-size:16px;line-height:1.6;margin-bottom:30px;">
              Greetings, <span style="color:${variantColor};font-weight:700;">${name}</span>. <br/><br/>
              Your request for Aakar 2026 tactical apparel has been logged and encrypted. You are now part of the movement.
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

            <div style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
            Verification in progress. Once the transmission is confirmed, your gear will be prepared for pickup at the <strong>Aakar 2026 Tech Hub</strong> during the event.
            <br/><br/>
            Collect T-shirt with <strong>AMAN HASAN</strong> (+91 861 822 9502).
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0a0a2e;padding:25px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
            <div style="font-family:'Orbitron',sans-serif;font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:3px;">
              EQUIPMENT // APPAREL // AAKAR 26
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

export function buildMerchConfirmedEmail(name: string, variant: string): string {
  const variantColor = variant.toLowerCase() === 'neon' ? '#00ffff' : variant.toLowerCase() === 'pro' ? '#ff0066' : '#ffffff';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Aakar 2026 – Order Confirmed!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
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
            <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:${variantColor};letter-spacing:5px;margin-bottom:10px;text-transform:uppercase;">▸ SYSTEM://ARMORY/PAYMENT_VERIFIED ▸</div>
            <div style="font-family:'Orbitron',sans-serif;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:4px;text-transform:uppercase;margin:0;">ORDER CONFIRMED</div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 30px;background:#06091a;">
            <div style="font-family:'Share Tech Mono',monospace;font-size:16px;line-height:1.6;margin-bottom:30px;">
              Greetings, <span style="color:${variantColor};font-weight:700;">${name}</span>. <br/><br/>
              Your payment has been verified and your Aakar 2026 tactical apparel order is now officially confirmed.
            </div>

            <div style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:30px;">
            Your gear will be prepared for pickup at the Aakar 2026 Tech Hub during the event. Stay tuned for further updates.
            </div>
            
            <div style="border-left: 2px solid ${variantColor}; padding-left: 15px; color: ${variantColor}; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">
              STATUS: PAYMENT VERIFIED
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0a0a2e;padding:25px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
            <div style="font-family:'Orbitron',sans-serif;font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:3px;">
              EQUIPMENT // APPAREL // AAKAR 26
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
  <title>New Merch Order - Aakar 2026</title>
</head>
<body style="font-family:sans-serif; background:#f4f4f4; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; padding:20px; border-radius:8px; border:1px solid #ddd;">
    <h2 style="color:#333; border-bottom:2px solid #ff0066; padding-bottom:10px;">New Merch Order Received</h2>
    
    <table width="100%" style="border-collapse:collapse; margin-top:20px;">
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Name:</td><td style="padding:8px; border-bottom:1px solid #eee;">${order.name}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Email:</td><td style="padding:8px; border-bottom:1px solid #eee;">${order.email}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Phone:</td><td style="padding:8px; border-bottom:1px solid #eee;">${order.phone}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Variant:</td><td style="padding:8px; border-bottom:1px solid #eee; text-transform:uppercase;">${order.merchVariant || 'Ascend'}</td></tr>
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

export function buildCertificateEmail(name: string, isElite: boolean): string {
  const status = isElite ? "ELITE" : "PARTICIPANT";
  const accent = isElite ? "#ff0066" : "#00ffff";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Aakar 2026 – Your Certificate is Ready!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#050818;font-family:'Share Tech Mono',monospace;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050818;padding:40px 20px;">
    <tr><td align="center">
      <div style="max-width:600px;width:100%;border:1px solid ${accent}44;background:#0a0a2e;padding:40px;border-radius:4px;text-align:center;">
        <div style="font-family:'Orbitron',sans-serif;font-size:28px;font-weight:900;color:${accent};letter-spacing:4px;text-transform:uppercase;margin-bottom:10px;">MISSION ACCOMPLISHED</div>
        <div style="font-size:10px;color:${accent}88;letter-spacing:5px;margin-bottom:30px;text-transform:uppercase;">▸ CERTIFICATE_GENERATED ▸</div>
        
        <div style="font-size:18px;line-height:1.6;margin-bottom:30px;">
          Well done, <span style="color:${accent};font-weight:700;">${name}</span>.<br/><br/>
          Your participation in Aakar 2026 has been documented. Your official certificate is attached to this uplink.
        </div>

        <div style="display:inline-block;border:1px solid ${accent};padding:10px 20px;color:${accent};font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:30px;">
          STATUS: ${status}
        </div>

        <div style="font-size:11px;color:rgba(255,255,255,0.4);line-height:1.5;">
          Download and keep this record as proof of your achievements in the cybernetic odyssey.
        </div>
        
        <div style="margin-top:40px;border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;font-size:10px;color:rgba(255,255,255,0.2);letter-spacing:2px;">
          AAKAR 2026 · AJIET · SECURE UPLINK TERMINATED
        </div>
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}
