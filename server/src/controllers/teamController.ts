
import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all team members
export const getAllTeamMembers = async (req: Request, res: Response) => {
    try {
        const members = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(members);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: 'Failed to fetch team members' });
    }
};

export const createTeamMember = async (req: Request, res: Response) => {
    try {
        const { name, role, bio, image, linkedin, quote, category, order } = req.body;

        const newMember = await prisma.teamMember.create({
            data: {
                name: name as string,
                role: role as string,
                bio: bio as string,
                image: image as string,
                linkedin: linkedin as string,
                quote: quote as string,
                category: category as string,
                order: order ? parseInt(order as string) : 0
            }
        });

        res.status(201).json(newMember);
    } catch (error) {
        console.error('Error creating team member:', error);
        res.status(500).json({ error: 'Failed to create team member' });
    }
};

export const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, role, bio, image, linkedin, quote, category, order } = req.body;

        const updatedMember = await prisma.teamMember.update({
            where: { id: id as string },
            data: {
                name: name as string,
                role: role as string,
                bio: bio as string,
                image: image as string,
                linkedin: linkedin as string,
                quote: quote as string,
                category: category as string,
                order: order ? parseInt(order as string) : undefined
            }
        });

        res.json(updatedMember);
    } catch (error) {
        console.error('Error updating team member:', error);
        res.status(500).json({ error: 'Failed to update team member' });
    }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { force } = req.query; // Add force parameter to handle related data if needed

        await prisma.teamMember.delete({
            where: { id: id as string }
        });

        res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({ error: 'Failed to delete team member' });
    }
};
