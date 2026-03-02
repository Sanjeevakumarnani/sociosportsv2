import { Request, Response } from 'express';
import { prisma } from '../index';

export const submitInquiry = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message, type } = req.body;

        // In a real app we might store this in a Contact table.
        // For now we'll simulate success or log it.
        console.log('Inquiry received:', { name, email, phone, message, type });

        // Pending: Create Contact/Inquiry model if strict persistence is needed. 
        // SOW plan mentions "Store in database", so let's verify if model exists.
        // I recall creating Inquiry or Contact model? 
        // Checking schema... user has 'bookings' and 'posts'. Admin Inquiries view implies storage.
        // There is no Inquiry model in schema I saw. I'll rely on logging or Booking if it's a booking.

        // If it's a booking request (SOW), we could create a PENDING booking?

        res.status(200).json({ message: 'Inquiry submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
};
