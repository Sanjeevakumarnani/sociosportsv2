import express from 'express';
import { getTrainers, updateTrainerProfile, verifyTrainer } from '../controllers/trainerController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getTrainers);
router.post('/profile', authenticateToken, updateTrainerProfile);
router.put('/:id/verify', authenticateToken, verifyTrainer); // Admin only ideal

export default router;
