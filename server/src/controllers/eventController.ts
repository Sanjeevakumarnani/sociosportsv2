import { Request, Response } from 'express';
import { prisma } from '../index';
import { deleteFile } from '../utils/fileHelper';

// Get all events
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' },
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// Create an event (Admin only - middleware to be added later if needed)
export const createEvent = async (req: Request, res: Response) => {
    const { title, description, date, location, type, price, image, organizerId } = req.body;

    // Basic Validation
    if (!title || !date || !location || !type) {
        return res.status(400).json({ error: 'Missing required fields: title, date, location, type' });
    }

    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: parsedDate,
                location,
                type,
                price: price ? parseFloat(String(price)) : 0,
                image,
                organizerId: organizerId || undefined
            }
        });
        res.status(201).json(event);
    } catch (error: any) {
        console.error('Create event error details:', {
            error,
            body: req.body,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Failed to create event',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, date, location, type, price, image, organizerId } = req.body;

    try {
        const existingEvent = await prisma.event.findUnique({
            where: { id: String(id) }
        });

        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const event = await prisma.event.update({
            where: { id: String(id) },
            data: {
                title,
                description,
                date: date ? new Date(date) : undefined,
                location,
                type,
                price: price !== undefined ? parseFloat(String(price)) : undefined,
                image,
                organizerId: organizerId || undefined
            }
        });
        res.json(event);
    } catch (error: any) {
        console.error('Update event error details:', {
            error,
            id,
            body: req.body,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Failed to update event',
            message: error.message
        });
    }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`Deleting event ${id}`);
    try {
        const event = await prisma.event.findUnique({
            where: { id: String(id) }
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.image) {
            deleteFile(event.image);
        }

        await prisma.event.delete({
            where: { id: String(id) }
        });
        res.json({ message: 'Event deleted successfully' });
    } catch (error: any) {
        console.error('Delete event error:', error);
        res.status(500).json({
            error: 'Failed to delete event',
            message: error.message
        });
    }
};
