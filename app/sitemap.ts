import { MetadataRoute } from 'next'
import { getAllEvents } from "@/backend/events";
import { generateEventSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aakar.live';

  // Fetch all events from database
  const events = await getAllEvents();
  
  const eventUrls = events.map((event) => ({
    url: `${baseUrl}/events/${generateEventSlug(event)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    '',
    '/events',
    '/events/technical',
    '/events/cultural',
    '/events/gaming',
    '/events/special',
    '/about',
    '/team',
    '/contact',
    '/faq',
    '/register',
    '/merch',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticUrls, ...eventUrls];
}