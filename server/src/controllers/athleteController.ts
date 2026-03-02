/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAthletes = async (req: Request, res: Response) => {
    try {
        const { sport, level } = req.query;
        const where: any = { isVerified: true }; // Only show verified by default? Or all? Let's show all
        if (sport) where.sport = String(sport);
        if (level) where.level = String(level);

        const athletes = await prisma.athleteProfile.findMany({
            where,
            include: { user: { select: { name: true, email: true } } }
        });
        res.json(athletes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch athletes' });
    }
};

export const updateAthleteProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { bio, sports, level, achievements, stats } = req.body;

        const profile = await prisma.athleteProfile.upsert({
            where: { userId },
            update: { bio, sports, level, achievements, stats },
            create: { userId, bio, sports, level, achievements, stats }
        });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const verifyAthlete = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;
        const profile = await prisma.athleteProfile.update({
            where: { id: String(id) },
            data: { isVerified }
        });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify athlete' });
    }
};
