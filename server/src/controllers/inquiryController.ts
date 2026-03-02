import { Request, Response } from 'express';
import { prisma } from '../index';

export const createInquiry = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const inquiry = await prisma.inquiry.create({
            data: { name, email, phone, subject, message }
        });
        res.status(201).json({ success: true, inquiry });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
};

export const getInquiries = async (req: Request, res: Response) => {
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const inquiry = await prisma.inquiry.update({
            where: { id: String(id) },
            data: { status }
        });
        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update inquiry status' });
    }
};

export const deleteInquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.inquiry.delete({ where: { id: String(id) } });
        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete inquiry' });
    }
};
