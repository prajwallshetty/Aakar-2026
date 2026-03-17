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
