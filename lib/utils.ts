import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateEventSlug(event: { id: number, eventName: string }): string {
    const nameSlug = event.eventName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    return `${nameSlug}-${event.id}`;
}

export function extractIdFromSlug(slug: string): number {
    const parts = slug.split('-');
    return parseInt(parts[parts.length - 1], 10);
}

export function resolveEventImageUrl(imageUrl: string | null | undefined, fallbackId?: number): string {
    const raw = (imageUrl ?? "").trim();

    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    if (!raw && typeof fallbackId === "number") {
        return `/events/${fallbackId}.png`;
    }

    if (!raw) {
        return "";
    }

    const normalized = raw.replace(/^\.\//, "").replace(/^\//, "");
    const withoutEventsPrefix = normalized.replace(/^events\//i, "");
    const loweredExtensionPath = withoutEventsPrefix.replace(
        /\.(PNG|JPG|JPEG|WEBP|GIF|AVIF|SVG)$/,
        (m) => m.toLowerCase()
    );
    const hasExtension = /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(loweredExtensionPath);

    if (hasExtension) {
        return `/events/${loweredExtensionPath}`;
    }

    return `/events/${loweredExtensionPath}.png`;
}

export function getEventImageCandidates(imageUrl: string | null | undefined, fallbackId?: number): string[] {
    const raw = (imageUrl ?? "").trim();
    const exts = ["png", "jpg", "jpeg", "webp", "gif", "avif", "svg"];

    if (/^https?:\/\//i.test(raw)) {
        return [raw];
    }

    const source = raw || (typeof fallbackId === "number" ? String(fallbackId) : "");
    if (!source) return [];

    const normalized = source
        .replace(/^\.\//, "")
        .replace(/^\//, "")
        .replace(/^events\//i, "");

    const extMatch = normalized.match(/\.([a-zA-Z0-9]+)$/);
    const base = extMatch ? normalized.slice(0, -extMatch[0].length) : normalized;
    const givenExt = extMatch ? extMatch[1].toLowerCase() : "";

    const candidates = new Set<string>();

    if (givenExt) {
        candidates.add(`/events/${base}.${givenExt}`);
    }

    exts.forEach((ext) => {
        candidates.add(`/events/${base}.${ext}`);
    });

    return Array.from(candidates);
}
