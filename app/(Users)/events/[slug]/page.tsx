import { getEventById } from "@/backend/events";
import Eventdescription from "@/components/(User)/events/desc/eventdescription";
import React from "react";
import { extractIdFromSlug, resolveEventImageUrl } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = extractIdFromSlug(slug);
  const event = await getEventById(id);

  if (!event) {
    return {
      title: "Event Not Found | AAKAR 2026",
    };
  }

  const imageUrl = resolveEventImageUrl(event.imageUrl, event.id);

  return {
    title: `${event.eventName} | AAKAR 2026`,
    description: event.description || `Join ${event.eventName} at AAKAR 2026 - AJIET Mangaluru's premier TechnoCultural fest.`,
    openGraph: {
      title: `${event.eventName} | AAKAR 2026`,
      description: event.description,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.eventName} | AAKAR 2026`,
      description: event.description,
      images: [imageUrl],
    },
  };
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const id = extractIdFromSlug(slug);
  const eventData = await getEventById(id);

  if (!eventData) return <div>Event not found</div>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventData.eventName,
    description: eventData.description,
    startDate: eventData.date,
    location: {
      "@type": "Place",
      name: eventData.venue || "AJIET Mangaluru",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kottara Chowki",
        addressLocality: "Mangaluru",
        addressRegion: "KN",
        postalCode: "575006",
        addressCountry: "IN",
      },
    },
    image: resolveEventImageUrl(eventData.imageUrl, eventData.id),
    organizer: {
      "@type": "Organization",
      name: "AAKAR Team",
      url: "https://aakar.live",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Eventdescription eventData={eventData} />
    </>
  );
};

export default page;

