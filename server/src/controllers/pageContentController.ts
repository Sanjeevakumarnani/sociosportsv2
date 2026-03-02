import { Request, Response } from 'express';
import { prisma } from '../index';

// Get content by slug
export const getContent = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const content = await prisma.pageContent.findUnique({
            where: { slug: String(slug) }
        });
        res.json(content || {});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch content' });
    }
};

// Update or Create content
export const updateContent = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { title, content } = req.body;
    try {
        const page = await prisma.pageContent.upsert({
            where: { slug: String(slug) },
            update: { title, content },
            create: { slug: String(slug), title, content }
        });
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update content' });
    }
};
