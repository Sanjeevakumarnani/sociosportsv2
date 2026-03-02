import express from 'express';
import { getAthletes, updateAthleteProfile, verifyAthlete } from '../controllers/athleteController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAthletes);
router.post('/profile', authenticateToken, updateAthleteProfile);
router.put('/:id/verify', authenticateToken, verifyAthlete); // Admin only ideal, but auth for now

export default router;
