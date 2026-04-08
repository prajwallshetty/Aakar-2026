"use server"

import { Prisma } from "@prisma/client";
import { db } from ".";
import { isAdmin } from "./admin";
import { ExtendedEvent, ExtendedParticipant, ExtendedParticipantCreateInput } from "@/types";
import { sendEmail } from "./nodemailer";
import { getEventById, getEventsOfUser } from "./events";

type ServiceResponse<T> = {
  data: T | null;
  error: { [key: string]: string } | string | null;
  hasNext?: boolean;
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function buildRegistrationEmail(name: string, eventsText: string, uuid: string): string {
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
                  ${date ? `<span style="display:block;font-family:'Courier New',monospace;font-size:11px;color:#000;margin-top:4px;font-weight:700;letter-spacing:2px;">📅 ${date.toUpperCase()}</span>` : ""}
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

// ─── Participant Logic ────────────────────────────────────────────────────────

export async function validateParticipantData(data: ExtendedParticipantCreateInput): Promise<{ [key: string]: string } | null> {
  const errors: { [key: string]: string } = {};

  if (!data.name || data.name.length < 2) {
    errors.name = "Name should be minimum 2 letters";
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Valid email is required";
  }

  if (!data.phone || !/^\d{10}$/.test(data.phone)) {
    errors.phone = "Valid 10-digit phone number is required";
  }

  if (!data.college || data.college.length < 3) {
    errors.college = "College name is required";
  }

  if (!data.year || data.year > 10 || data.year <= 0) {
    errors.year = "Invalid year. Year should be between 1 and 10";
  }

  if (await db.participant.findFirst({ where: { email: data.email.toLowerCase() } })) {
    errors.email = "Email already registered";
  }

  if (await db.participant.findFirst({ where: { usn: data.usn.toUpperCase() } })) {
    errors.usn = "USN already registered";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export async function createParticipant(data: ExtendedParticipantCreateInput): Promise<ServiceResponse<ExtendedParticipant>> {
  try {
    const validationErrors = await validateParticipantData(data);
    if (validationErrors) {
      return { data: null, error: validationErrors };
    }

    const participant = await db.participant.create({ data: { ...data, email: data.email.toLowerCase(), usn: data.usn.toUpperCase() } });
    return { data: participant as ExtendedParticipant, error: null };
  } catch (error) {
    console.error("Error creating participant:", error);
    return {
      data: null,
      error: error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
        ? "A participant with this email or phone already exists"
        : "Failed to create participant"
    };
  }
}

export async function registerParticipant(data: ExtendedParticipantCreateInput, events: number[]): Promise<ServiceResponse<ExtendedParticipant>> {
  try {
    const { data: participant, error } = await createParticipant({ ...data, events: { connect: events.map(e => ({ id: e })) }, email: data.email.toLowerCase(), usn: data.usn.toUpperCase() });

    if (error || !participant) {
      return { data: null, error };
    }

    const eventsOfUser = await getEventsOfUser(participant.id);
    const eventN = eventsOfUser?.map(e => e.eventName + ` on ` + e.date.toDateString()).join("\n") || "";

    await sendEmail(
      participant.email,
      "Registration Confirmed – Aakar 2026! 🎉",
      buildRegistrationEmail(participant.name, eventN, participant.uuid)
    );

    return { data: participant, error: null };
  } catch (error) {
    console.error("Error registering participant for events:", error);
    return {
      data: null,
      error: "Failed to register participant for events"
    };
  }
}

export async function getParticipantsCount() {
  const usns = new Set();
  const participants = await db.participant.findMany({ select: { usn: true, groupMembersData: true } }) as ExtendedParticipant[];
  participants.forEach(p => {
    usns.add(p.usn);
    if (p.groupMembersData) {
      Object.keys(p.groupMembersData).forEach(groupEvent => {
        p.groupMembersData![groupEvent].members.forEach(member => {
          usns.add(member.usn);
        })
      });
    }
  })

  return usns.size;
}

export async function getParticipantsCountForEvent(eventId: number) {
  const event = await getEventById(eventId);
  if (!event) {
    return 0;
  }
  const participants = await db.participant.findMany({ where: { events: { some: { id: eventId } } }, select: { usn: true, groupMembersData: true } }) as ExtendedParticipant[];
  const usns = new Set();
  participants.forEach(p => {
    usns.add(p.usn);
    if (p.groupMembersData) {
      Object.keys(p.groupMembersData).forEach(groupEvent => {
        p.groupMembersData![groupEvent].members.forEach(member => {
          usns.add(member.usn);
        })
      });
    }
  })

  return usns.size;
}

export async function getParticipantsCountForCollege(collegeName: string) {
  const participants = await db.participant.findMany({ where: { college: collegeName }, select: { usn: true, groupMembersData: true } }) as ExtendedParticipant[];
  const usns = new Set();
  participants.forEach(p => {
    usns.add(p.usn);
    if (p.groupMembersData) {
      Object.keys(p.groupMembersData).forEach(groupEvent => {
        p.groupMembersData![groupEvent].members.forEach(member => {
          usns.add(member.usn);
        })
      });
    }
  })

  return usns.size;
}

export async function getParticipant(id: number | string): Promise<ServiceResponse<ExtendedParticipant>> {
  try {
    if (!id) {
      return { data: null, error: { id: "Participant ID is required" } };
    }

    const participant = await db.participant.findUnique({
      where: typeof id === "string" ? { uuid: id } : { id }
    });

    if (!participant) {
      return { data: null, error: "Participant not found" };
    }

    return { data: participant as ExtendedParticipant, error: null };
  } catch (error) {
    console.error("Error fetching participant:", error);
    return { data: null, error: "Failed to fetch participant" };
  }
}

export async function getParticipantWithEvents(id: number): Promise<ServiceResponse<ExtendedParticipant & { events: ExtendedEvent[] }>> {
  try {
    if (!id) {
      return { data: null, error: { id: "Participant ID is required" } };
    }

    const participant = await db.participant.findUnique({
      where: { id },
      include: { events: true }
    });

    if (!participant) {
      return { data: null, error: "Participant not found" };
    }

    return { data: participant as ExtendedParticipant & { events: ExtendedEvent[] }, error: null };
  } catch (error) {
    console.error("Error fetching participant:", error);
    return { data: null, error: "Failed to fetch participant" };
  }
}

export async function getParticipantsWithEvents(index?: number, limit?: number): Promise<ServiceResponse<(ExtendedParticipant & { events: ExtendedEvent[] })[]>> {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return { data: null, error: "Not authorized" };
    }

    const count = await db.participant.count();

    if (index !== undefined && limit !== undefined) {
      const participants = await db.participant.findMany({
        include: { events: true },
        skip: index * limit,
        take: limit
      });
      return { data: participants as (ExtendedParticipant & { events: ExtendedEvent[] })[], error: null, hasNext: count > (index + 1) * limit };
    } else {
      const participants = await db.participant.findMany({
        include: { events: true },
      });

      return { data: participants as (ExtendedParticipant & { events: ExtendedEvent[] })[], error: null, hasNext: false };
    }
  } catch (error) {
    console.error("Error fetching participants:", error);
    return { data: null, error: "Failed to fetch participant" };
  }
}

export async function getParticipants(): Promise<ServiceResponse<ExtendedParticipant[]>> {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return { data: null, error: "Not authorized" };
    }

    const participants = await db.participant.findMany();

    return { data: participants as ExtendedParticipant[], error: null };
  } catch (error) {
    console.error("Error fetching participants:", error);
    return { data: null, error: "Failed to fetch participants" };
  }
}

export async function getParticipantsWithFilter(where: Prisma.ParticipantWhereInput): Promise<ServiceResponse<ExtendedParticipant[]>> {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return { data: null, error: "Not authorized" };
    }

    const participants = await db.participant.findMany({ where });

    return { data: participants as ExtendedParticipant[], error: null };
  } catch (error) {
    console.error("Error fetching participants:", error);
    return { data: null, error: "Failed to fetch participants" };
  }
}

export async function updateParticipantWithNotify(id: number | string, data: Prisma.ParticipantUpdateInput): Promise<ServiceResponse<ExtendedParticipant>> {
  try {
    let res = await updateParticipant(id, data);
    if (!res.data || res.error) {
      return res;
    }

    const participant = res.data;
    const eventsOfUser = await getEventsOfUser(participant.id);
    const eventN = eventsOfUser?.map(e => e.eventName + ` on ` + e.date.toDateString()).join("\n") || "";

    await sendEmail(
      participant.email,
      "Your Registration Has Been Updated – Aakar 2026",
      buildRegistrationEmail(participant.name, eventN, participant.uuid)
    );

    return res;
  } catch (error) {
    console.error("Error updating participant:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2026') {
        return { data: null, error: "Participant not found" };
      }
    }

    return { data: null, error: "Failed to update participant" };
  }
}

export async function updateParticipant(id: number | string, data: Prisma.ParticipantUpdateInput): Promise<ServiceResponse<ExtendedParticipant>> {
  try {
    if (!id) {
      return { data: null, error: { id: "Participant ID is required" } };
    }

    const updatedParticipant = await db.participant.update({
      where: typeof id === "string" ? { uuid: id } : { id },
      data: { ...data, email: (data.email as string)?.toLowerCase() || undefined, usn: (data.usn as string)?.toUpperCase() || undefined }
    }) as ExtendedParticipant;

    return { data: updatedParticipant, error: null };
  } catch (error) {
    console.error("Error updating participant:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2026') {
        return { data: null, error: "Participant not found" };
      }
    }

    return { data: null, error: "Failed to update participant" };
  }
}

export async function deleteParticipant(id: number): Promise<ServiceResponse<ExtendedParticipant>> {
  try {
    if (!id) {
      return { data: null, error: { id: "Participant ID is required" } };
    }

    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return { data: null, error: "Not authorized" };
    }

    const deletedParticipant = await db.participant.delete({
      where: { id }
    });

    return { data: deletedParticipant as ExtendedParticipant, error: null };
  } catch (error) {
    console.error("Error deleting participant:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2026') {
      return { data: null, error: "Participant not found" };
    }

    return { data: null, error: "Failed to delete participant" };
  }
}