import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'sociosports-secret-key';

export const googleLogin = async (req: Request, res: Response) => {
    const { credential, access_token, password } = req.body;

    try {
        let payload: any;

        if (credential) {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } else if (access_token) {
            // Verify access_token by calling Google's tokeninfo endpoint
            const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
            payload = await res.json();
            if (payload.error) throw new Error(payload.error_description || 'Invalid access token');
        }

        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }

        const { email, name, picture } = payload;

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create user if it doesn't exist
            // Hash password if provided, otherwise empty
            const hashedPassword = password ? await bcrypt.hash(password, 10) : '';

            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    password: hashedPassword,
                    role: 'ATHLETE', // Default role
                },
            });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                picture: picture
            }
        });
    } catch (error: any) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Google authentication failed', error: error.message });
    }
};
