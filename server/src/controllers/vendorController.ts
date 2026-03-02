/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { prisma } from '../index';

export const getVendors = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        const where = category ? { category: String(category) } : {};
        const vendors = await prisma.vendor.findMany({
            where,
            include: { products: true }
        });
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};

export const createVendor = async (req: Request, res: Response) => {
    try {
        const { businessName, category, description, contactPhone, contactEmail, location, image } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const vendor = await prisma.vendor.create({
            data: {
                businessName,
                category,
                description,
                contactPhone,
                contactEmail,
                location,
                image,
                userId
            }
        });
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vendor' });
    }
};

export const updateVendor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vendor = await prisma.vendor.update({
            where: { id: String(id) },
            data: req.body
        });
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update vendor' });
    }
};

export const deleteVendor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.vendor.delete({ where: { id: String(id) } });
        res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete vendor' });
    }
};
