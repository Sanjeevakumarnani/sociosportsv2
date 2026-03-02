import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const JWT_SECRET = process.env.JWT_SECRET || 'sociosports-secret-key';

export const register = async (req: Request, res: Response) => {
    const { email, password, name, role } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        if (role === 'ADMIN') {
            const { adminSecret } = req.body;
            if (adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
                return res.status(403).json({ message: 'Forbidden: Invalid Admin Secret' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role: role || 'ATHLETE' },
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'User created successfully',
            userId: user.id,
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    } catch (error: any) {
        console.error('Registration error details:', {
            error,
            body: req.body,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Registration failed',
            message: error.message || 'An unexpected error occurred during registration'
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error: any) {
        console.error('Login error details:', {
            error,
            email: req.body.email,
            stack: error.stack
        });
        res.status(500).json({ error: 'Login failed', message: error.message });
    }
};
