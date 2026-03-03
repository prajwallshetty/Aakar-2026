"use server";

import { db } from ".";

// Participants registered per day
export const getParticipantsOverTime = async () => {
    const participants = await db.participant.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
    });

    const counts: Record<string, number> = {};
    participants.forEach(({ createdAt }) => {
        const date = createdAt.toISOString().slice(0, 10);
        counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        participants: count,
    }));
};

// Events scheduled per day
export const getEventsOverTime = async () => {
    const events = await db.event.findMany({
        select: { date: true },
        orderBy: { date: "asc" },
    });

    const counts: Record<string, number> = {};
    events.forEach(({ date }) => {
        const d = date.toISOString().slice(0, 10);
        counts[d] = (counts[d] || 0) + 1;
    });

    return Object.entries(counts).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        events: count,
    }));
};

// Top 10 colleges by participant count
export const getParticipantsPerCollege = async () => {
    const participants = await db.participant.findMany({
        select: { college: true },
    });

    const counts: Record<string, number> = {};
    participants.forEach(({ college }) => {
        const key = college.trim();
        counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([college, participants]) => ({ college, participants }))
        .sort((a, b) => b.participants - a.participants)
        .slice(0, 10);
};