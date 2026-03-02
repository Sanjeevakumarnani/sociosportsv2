/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sociosports-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            console.error('JWT Verification Error:', {
                name: err.name,
                message: err.message,
                tokenPrefix: token ? token.substring(0, 15) : 'NONE',
                secretUsedPrefix: JWT_SECRET.substring(0, 5)
            });
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (!err) {
            req.user = user;
        }
        next();
    });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};

export const requireAdmin = isAdmin;
