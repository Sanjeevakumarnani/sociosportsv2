/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { prisma } from '../index';

export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.job.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

export const createJob = async (req: Request, res: Response) => {
    try {
        const { title, location, type, description, requirements, benefits, department, organization, salary, category, applyUrl } = req.body;
        const postedById = req.user?.userId;
        if (!postedById) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Check if user is verified to post jobs
        const user = await prisma.user.findUnique({
            where: { id: postedById },
            select: { isVerified: true, role: true }
        });

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Admins can always post jobs, others need verification
        if (user.role !== 'ADMIN' && !user.isVerified) {
            res.status(403).json({
                error: 'Employer verification required',
                code: 'VERIFICATION_REQUIRED',
                message: 'You must complete employer verification before posting jobs. Please submit your verification documents.'
            });
            return;
        }

        const job = await prisma.job.create({
            data: {
                title,
                location,
                type,
                description,
                requirements,
                benefits,
                department,
                organization,
                salary,
                category,
                applyUrl,
                postedById,
                isActive: true
            }
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create job' });
    }
};

export const updateJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.update({
            where: { id: String(id) },
            data: req.body
        });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job' });
    }
};

export const deleteJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.job.delete({ where: { id: String(id) } });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
};

export const getAllJobsAdmin = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.job.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};
