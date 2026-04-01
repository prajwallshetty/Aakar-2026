import { Event } from "@prisma/client";

export const PRONIGHT_PASS_FEE = 500;

export interface RegistrationIntent {
  isInternal: boolean;
  wantsPronightPass: boolean;
}

/**
 * Calculates the total registration fee for a participant.
 * 
 * Rules:
 * - Internal students (isInternal=true) get `isFreeForInternal` events for free.
 * - External students (isInternal=false) can purchase a Pronight pass.
 * - If an external student purchases a Pronight pass, `isIncludedInPass` events are free.
 * - Otherwise, base event fees apply.
 * 
 * @param intent - Indicates if the participant is internal and whether they want a pass.
 * @param selectedEvents - Array of Prisma `Event` objects the participant is registering for.
 * @returns The total calculated fee in rupees.
 */
export function calculateRegistrationFee(
  intent: RegistrationIntent,
  selectedEvents: Event[]
): number {
  let totalFee = 0;

  // 1. Calculate pass fee
  // The pass is available for External participants for â‚¹500.
  if (!intent.isInternal && intent.wantsPronightPass) {
    totalFee += PRONIGHT_PASS_FEE;
  }

  // 2. Calculate event fees
  for (const event of selectedEvents) {
    let eventFee = event.fee;

    // Apply fee waivers based on participant status and event flags
    if (intent.isInternal && event.isFreeForInternal) {
      eventFee = 0;
    } else if (!intent.isInternal && intent.wantsPronightPass && event.isIncludedInPass) {
      eventFee = 0;
    }

    totalFee += eventFee;
  }

  return totalFee;
}
