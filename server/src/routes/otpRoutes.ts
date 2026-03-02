import express, { Request, Response } from 'express';
import { createOTP, verifyOTP, OTPPurpose } from '../services/otpService';
import { sendOTP } from '../services/emailService';
import { smsService } from '../services/smsService';

const router = express.Router();

// Helper to validate email format
const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// POST /api/otp/send
router.post('/send', async (req: Request, res: Response) => {
    try {
        const { email, purpose } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!purpose) {
            return res.status(400).json({ error: 'Purpose is required' });
        }

        const otp = await createOTP(email, purpose as OTPPurpose);

        // Send email (don't await to avoid blocking response, or await if critical)
        await sendOTP(email, otp, purpose);

        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// POST /api/otp/send-phone
router.post('/send-phone', async (req: Request, res: Response) => {
    try {
        const { phone, purpose } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        if (!purpose) {
            return res.status(400).json({ error: 'Purpose is required' });
        }

        const otp = await createOTP(phone, purpose as OTPPurpose, 'phone');

        // Send real SMS (or simulated console output) via smsService
        await smsService.sendOTP(phone, otp);

        res.json({ success: true, message: 'OTP sent successfully to your phone' });
    } catch (error) {
        console.error('Error sending phone OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// POST /api/otp/verify
router.post('/verify', async (req: Request, res: Response) => {
    try {
        const { email, phone, otp, purpose } = req.body;

        if (!(email || phone) || !otp || !purpose) {
            return res.status(400).json({ error: 'Email/Phone, OTP, and purpose are required' });
        }

        const identifier = (email || phone) as string;
        const type = email ? 'email' : 'phone';

        const isValid = await verifyOTP(identifier, otp, purpose as OTPPurpose, type);

        if (isValid) {
            res.json({ success: true, message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

export default router;
