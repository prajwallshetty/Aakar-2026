import { getEventById } from "@/backend/events";
import Eventdescription from "@/components/(User)/events/desc/eventdescription";
import React from "react";
import { extractIdFromSlug } from "@/lib/utils";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const id = extractIdFromSlug(slug);
    const eventData = await getEventById(id);

    return (
        <Eventdescription eventData={eventData}/>
    );
};

export default page;
