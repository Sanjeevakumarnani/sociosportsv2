/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { prisma } from '../index';

export const getTrainers = async (req: Request, res: Response) => {
    try {
        const { specialization } = req.query;
        const where: any = {};
        if (specialization) where.specialization = String(specialization);

        const trainers = await prisma.trainerProfile.findMany({
            where,
            include: { user: { select: { name: true, email: true } } }
        });
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trainers' });
    }
};

export const updateTrainerProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { specialization, certification, experience, bio, rate, availability } = req.body;

        const profile = await prisma.trainerProfile.upsert({
            where: { userId },
            update: { specialization, certification, experience, bio, rate, availability },
            create: { userId, specialization, certification, experience, bio, rate, availability }
        });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update trainer profile' });
    }
};

export const verifyTrainer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;
        const profile = await prisma.trainerProfile.update({
            where: { id: String(id) },
            data: { isVerified }
        });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify trainer' });
    }
};
