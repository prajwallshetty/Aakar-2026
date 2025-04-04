import mongoose from "mongoose";
import Event from '../models/eventModel.js';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
let eventsCache = {
    data: null,
    lastUpdated: null
};

const createEvent = async (req, res) => {
    try {
        // Extract event data from request body
        const eventData = req.body;

        // Validate the data (basic validation example)
        if (!eventData || !eventData.eventName) {
            return res.status(400).json({
                message: 'Event data is required and must include a title'
            });
        }

        // Create new event in the database
        const newEvent = await Event.create(eventData);

        if (!newEvent) {
            return res.status(500).json({
                message: 'Failed to create event'
            });
        }

        // Invalidate the cache since we've added a new event
        eventsCache = {
            data: null,
            lastUpdated: null
        };

        return res.status(201).json({
            message: 'Event created successfully',
            event: newEvent
        });

    } catch (error) {
        console.error("Error creating event:", error);

        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        return res.status(500).json({
            message: 'Error creating event',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getAllEventDetails = async (req, res) => {
    try {
        // Check cache first
        if (eventsCache.data && 
            eventsCache.lastUpdated && 
            (Date.now() - eventsCache.lastUpdated) < CACHE_TTL) {
            return res.status(200).json(eventsCache.data);
        }

        // If not in cache or cache expired, fetch from DB
        const events = await Event.find()
            .select('-__v')  // Exclude version field
            .lean();         // Convert to plain objects

        if (!events) {
            return res.status(404).json({
                message: 'No events found'
            });
        }

        // Update cache
        eventsCache = {
            data: events,
            lastUpdated: Date.now()
        };

        // Set appropriate cache headers
        res.set({
            'Cache-Control': `public, max-age=${CACHE_TTL / 1000}`,
            'ETag': new mongoose.Types.ObjectId().toString() // Use 'new' keyword
        });

        return res.status(200).json(events);

    } catch (error) {
        console.error("Error retrieving event details:", error);
        return res.status(500).json({
            message: 'Error retrieving events',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Preload cache on server start
const preloadCache = async () => {
    try {
        const events = await Event.find()
            .select('-__v')
            .lean();

        eventsCache = {
            data: events,
            lastUpdated: Date.now()
        };
        
        console.log('Events cache preloaded successfully');
    } catch (error) {
        console.error('Failed to preload events cache:', error);
    }
};

// Export both the main function and preload function
export { getAllEventDetails as default, preloadCache, createEvent };