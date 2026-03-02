import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Serve Frontend Static Files (Production)
const frontendPath = path.join(process.cwd(), '../app/dist');
app.use(express.static(frontendPath));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import bookingRoutes from './routes/bookingRoutes';
import postRoutes from './routes/postRoutes';

import pageContentRoutes from './routes/pageContentRoutes';
import uploadRoutes from './routes/uploadRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import jobRoutes from './routes/jobRoutes';
import vendorRoutes from './routes/vendorRoutes';
import athleteRoutes from './routes/athleteRoutes';
import trainerRoutes from './routes/trainerRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import otpRoutes from './routes/otpRoutes';
import institutionRoutes from './routes/institutionRoutes';
import teamRoutes from './routes/teamRoutes';
import sportsProfileRoutes from './routes/sportsProfileRoutes';
import employerVerificationRoutes from './routes/employerVerificationRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/posts', postRoutes);

app.use('/api/content', pageContentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/contact', inquiryRoutes); // Alias for backward compatibility
app.use('/api/otp', otpRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/profiles', sportsProfileRoutes);
app.use('/api/employer-verification', employerVerificationRoutes);

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: 'Database connection failed'
        });
    }
});

// Health Check for the root
app.get('/api-status', (req, res) => {
    res.send('SocioSports API is running');
});

// SPA Catch-all: Route all non-API requests to index.html
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    }
});

// Error Handling Middleware (Must be after all routes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend served from: ${frontendPath}`);
});

export { prisma };
