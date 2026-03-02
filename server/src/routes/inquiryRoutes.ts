import express, { Request, Response } from 'express';
import { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController';
import { authenticateToken } from '../middleware/authMiddleware';
import { sendSportsIdConfirmation } from '../services/emailService';

const router = express.Router();

// Public route for submitting inquiries
router.post('/', createInquiry);

// Completion route
router.post('/registration-complete', async (req: Request, res: Response) => {
    try {
        const { email, name, sportsId, role } = req.body;
        // Send email confirmation only if email is provided
        if (email) {
            await sendSportsIdConfirmation(email, name, sportsId, role);
        }
        res.json({ success: true });
    } catch (error: any) {
        console.error('Error in registration completion:', {
            error,
            body: req.body,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Failed to complete registration',
            message: error.message || 'An unexpected error occurred'
        });
    }
});

// Protected admin routes
router.get('/', authenticateToken, getInquiries);
router.put('/:id/status', authenticateToken, updateInquiryStatus);
router.delete('/:id', authenticateToken, deleteInquiry);

export default router;
