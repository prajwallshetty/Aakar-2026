import { db } from "@/backend";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Certificate | Aakar 2026",
  description: "Verify participant certificates for Aakar 2026",
};

export default async function VerifyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  let details = null;

  try {
    if (id.startsWith("ELITE-")) {
      // Normalize to lowercase — UUIDs in the DB are lowercase
      const shortUuid = id.replace("ELITE-", "").toLowerCase();
      const order = await db.elitePassOrder.findFirst({
        where: { uuid: { startsWith: shortUuid } }
      });
      if (order) {
        details = {
          name: order.name,
          eventName: "Aakar 2026 Elite Pass",
          issueDate: order.updatedAt,
          type: "Elite Pass"
        };
      }
    } else {
      // Normal registration: format [8_char_uuid]-[event_id] or [8_char_uuid]-[event_id]-[M_index]
      const parts = id.split("-");
      if (parts.length >= 2) {
        const shortUuid = parts[0];
        const eventId = parseInt(parts[1], 10);
        const memberTag = parts.length === 3 ? parts[2] : null;
        
        const participant = await db.participant.findFirst({
          where: { uuid: { startsWith: shortUuid } },
          include: { events: { where: { id: eventId } } }
        });
        
        if (participant && participant.events.length > 0) {
          let verifiedName = participant.name;
          
          if (memberTag && memberTag.startsWith("M")) {
              const memberIndex = parseInt(memberTag.slice(1), 10);
              const membersData: any = participant.groupMembersData || {};
              const groupEventData = membersData[eventId.toString()];
              if (groupEventData && Array.isArray(groupEventData.members) && groupEventData.members[memberIndex]) {
                  verifiedName = groupEventData.members[memberIndex].name;
              }
          }

          details = {
            name: verifiedName,
            eventName: participant.events[0].eventName,
            issueDate: participant.updatedAt,
            type: "Event Participation"
          };
        }
      }
    }
  } catch (error) {
    console.error("Error fetching certificate verifications:", error);
  }

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-white px-4">
        <XCircle className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-red-500 mb-4 tracking-wider uppercase font-cinzel text-center">Invalid Certificate</h1>
        <p className="text-zinc-400 text-center max-w-md text-lg">
          The certificate ID <span className="text-white font-mono">{id}</span> could not be found or verified in our database. It may be invalid or incorrectly typed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-white px-4 py-12">
      <div className="relative max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 to-emerald-400"></div>
        
        {/* Success Icon */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] border border-green-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-widest font-cinzel bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">Verified</h1>
          <p className="text-zinc-400 mt-2 font-medium">This certificate is officially authentic.</p>
        </div>
        
        {/* Certificate Details */}
        <div className="space-y-6">
          <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/50">
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Issued To</p>
            <p className="text-xl md:text-2xl font-bold font-cinzel text-white uppercase">{details.name}</p>
          </div>
          
          <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/50">
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">In Recognition Of</p>
            <p className="text-lg md:text-xl font-medium text-white">{details.eventName}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-zinc-800/80">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Certificate ID</p>
              <p className="font-mono text-zinc-300 bg-zinc-800/50 px-2 py-1 rounded text-sm border border-zinc-700/50">{id}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Category</p>
              <p className="text-zinc-300 font-medium">{details.type}</p>
            </div>
          </div>
        </div>
        
        {/* Watermark/Footer */}
        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-xs font-mono">AAKAR 2026 OFFICIAL REGISTRY</p>
        </div>
      </div>
    </div>
  );
}
