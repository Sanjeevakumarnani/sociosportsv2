import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all bookings (Admin)
export const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: { select: { name: true, email: true } },
                event: { select: { title: true, date: true, type: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

import { sendBookingConfirmation } from '../services/emailService';

// ...

// Create a booking (Public/User/Guest)
export const createBooking = async (req: Request, res: Response) => {
    const { eventId, businessName, contactPerson, email, phone, stallType, requirements } = req.body;
    let userId = (req as any).user?.userId;

    try {
        // If not logged in, try to find user by email or create a placeholder
        if (!userId && email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                userId = existingUser.id;
            } else {
                // Create a guest user
                const guestUser = await prisma.user.create({
                    data: {
                        email,
                        name: contactPerson || businessName || 'Guest User',
                        phone: phone || null,
                        password: 'GUEST_ACCOUNT_' + Math.random().toString(36).slice(-8),
                        role: 'ATHLETE'
                    }
                });
                userId = guestUser.id;
            }
        }

        if (!userId) {
            return res.status(400).json({ error: 'User identification required (Email or Login)' });
        }

        const booking: any = await prisma.booking.create({
            data: {
                userId,
                eventId: eventId || undefined, // Allow undefined if optional
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                businessName,
                stallType,
                requirements
            },
            include: {
                user: true,
                event: true
            }
        });

        // Send confirmation email based on type
        if (booking.user?.email) {
            try {
                if (stallType === 'ATHLETE_REGISTRY') {
                    const { sendWelcomeEmail } = require('../services/emailService');
                    await sendWelcomeEmail(booking.user.email, booking.user.name || 'Athlete');
                } else if (stallType === 'COACH_REGISTRATION') {
                    const { sendGenericConfirmation } = require('../services/emailService');
                    await sendGenericConfirmation(
                        booking.user.email,
                        'Coach Registration Received',
                        `Hi ${booking.user.name}, we have received your application to join as a coach.`,
                        { ApplicationID: booking.id, Sport: requirements }
                    );
                } else if (stallType === 'VENUE_LISTING') {
                    const { sendGenericConfirmation } = require('../services/emailService');
                    await sendGenericConfirmation(
                        booking.user.email,
                        'Venue Listing Request',
                        `Hi ${booking.user.name}, thanks for listing your venue with us.`,
                        { VenueName: businessName, Details: requirements }
                    );
                } else if (stallType === 'JOB_APPLICATION') {
                    const { sendGenericConfirmation } = require('../services/emailService');
                    await sendGenericConfirmation(
                        booking.user.email,
                        'Job Application Received',
                        `Hi ${booking.user.name}, thanks for applying.`,
                        { Position: requirements }
                    );
                } else if (stallType === 'PARTNERSHIP_REQUEST') {
                    const { sendGenericConfirmation } = require('../services/emailService');
                    await sendGenericConfirmation(
                        booking.user.email,
                        'Partnership Request Received',
                        `Hi ${booking.user.name}, we are excited to explore a partnership with your institution.`,
                        { Institution: businessName }
                    );
                } else if (stallType === 'VENDOR_REGISTRATION') {
                    const { sendGenericConfirmation } = require('../services/emailService');
                    await sendGenericConfirmation(
                        booking.user.email,
                        'Vendor Registration',
                        `Hi ${booking.user.name}, your stall registration request is being processed.`,
                        { Business: businessName, Requirements: requirements }
                    );
                } else {
                    // Default Event Booking
                    await sendBookingConfirmation(booking.user.email, {
                        eventTitle: booking.event?.title || 'SocioSports Event',
                        date: booking.event?.date ? booking.event.date.toString() : 'TBD',
                        location: booking.event?.location || 'TBD',
                        amount: 'TBD',
                        paymentStatus: booking.paymentStatus
                    });
                }
            } catch (emailError) {
                console.error("Failed to send booking email:", emailError);
            }
        }

        res.status(201).json(booking);
    } catch (error) {
        console.error("Booking Creation Error:", error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// ...

// Update booking status or payment (Admin)
export const updateBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    try {
        const booking: any = await prisma.booking.update({
            where: { id: String(id) },
            data: {
                status: status ? String(status) : undefined,
                paymentStatus: paymentStatus ? String(paymentStatus) : undefined
            },
            include: { user: true, event: true } // Include for email
        });

        // Send email if confirmed
        if (status === 'CONFIRMED' && booking.user?.email) {
            await sendBookingConfirmation(booking.user.email, {
                eventTitle: booking.event?.title || 'General Booking',
                date: booking.event?.date ? booking.event.date.toString() : 'TBD',
                location: booking.event?.location || 'TBD',
                amount: '500',
                paymentStatus: booking.paymentStatus
            });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
};

// Delete a booking (Admin)
export const deleteBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.booking.delete({ where: { id: String(id) } });
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
};
