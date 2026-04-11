import { headers } from "next/headers";

// Simple auto-clearing memory cache per isolate
const ipCache = new Map<string, { count: number; timestamp: number }>();

/**
 * Validates if the current request's IP is within the rate limit.
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns true if allowed, false if limit exceeded
 */
export async function checkRateLimit(limit: number = 7, windowMs: number = 60000): Promise<boolean> {
  try {
    const reqHeaders = await headers();
    const rawIp = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "unknown";
    const ip = rawIp.split(",")[0].trim();

    // Allow localhost or unknown safely
    if (ip === "unknown" || ip === "127.0.0.1" || ip === "::1") return true;

    const now = Date.now();
    const hitData = ipCache.get(ip);

    // Occasional garbage collection
    if (ipCache.size > 500) {
      for (const [key, val] of ipCache.entries()) {
        if (now - val.timestamp > windowMs) {
          ipCache.delete(key);
        }
      }
    }

    if (!hitData || now - hitData.timestamp > windowMs) {
      ipCache.set(ip, { count: 1, timestamp: now });
      return true;
    }

    if (hitData.count >= limit) {
      return false; // Blocked by rate limit
    }

    hitData.count++;
    return true;
  } catch (error) {
    // If headers lookup fails due to context or error, safely open
    return true;
  }
}
