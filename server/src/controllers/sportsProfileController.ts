/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { prisma } from '../index';

export const createProfile = async (req: Request, res: Response) => {
    try {
        const { sportsId, name, email, phone, role, sport, profession, location, image,
            dateOfBirth, height, weight, bio, achievements, trainingHistory,
            certifications, experience, specializations, socialLinks,
            skills, languages, hobbies, references } = req.body;

        const existingProfile = await prisma.sportsProfile.findUnique({
            where: { sportsId }
        });

        if (existingProfile) {
            const updated = await prisma.sportsProfile.update({
                where: { sportsId },
                data: {
                    name, email, phone, role, sport, profession, location, image,
                    dateOfBirth, height, weight, bio, achievements, trainingHistory,
                    certifications, experience, specializations, socialLinks,
                    skills, languages, hobbies, references
                }
            });
            res.json(updated);
            return;
        }

        const profile = await prisma.sportsProfile.create({
            data: {
                sportsId, name, email, phone, role, sport, profession, location, image,
                dateOfBirth, height, weight, bio, achievements, trainingHistory,
                certifications, experience, specializations, socialLinks,
                skills, languages, hobbies, references
            }
        });
        res.status(201).json(profile);
    } catch (error) {
        console.error('Create Profile Error:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
};

export const getProfileBySportsId = async (req: Request, res: Response) => {
    try {
        const sportsId = req.params.sportsId as string;

        const profile = await prisma.sportsProfile.findUnique({
            where: { sportsId }
        });

        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        res.json(profile);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const searchProfiles = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query || typeof query !== 'string' || query.trim() === '') {
            const profiles = await prisma.sportsProfile.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' }
            });
            res.json(profiles);
            return;
        }

        const searchTerm = query.trim();

        const profiles = await prisma.sportsProfile.findMany({
            where: {
                OR: [
                    { sportsId: { equals: searchTerm, mode: 'insensitive' } },
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { sport: { contains: searchTerm, mode: 'insensitive' } },
                    { location: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            take: 20,
            orderBy: { createdAt: 'desc' }
        });

        res.json(profiles);
    } catch (error) {
        console.error('Search Profile Error:', error);
        res.status(500).json({ error: 'Failed to search profiles' });
    }
};

