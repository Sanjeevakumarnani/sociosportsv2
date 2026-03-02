import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all users (Admin only)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role, name } = req.body; // Allow role promotion/demotion
    try {
        const user = await prisma.user.update({
            where: { id: String(id) },
            data: {
                role: role ? String(role) : undefined,
                name: name ? String(name) : undefined
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        res.json(user);
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: String(id) } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
