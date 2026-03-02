
import express from 'express';
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllTeamMembers);

// Protected routes (Admin only)
router.post('/', authenticateToken, requireAdmin, createTeamMember);
router.put('/:id', authenticateToken, requireAdmin, updateTeamMember);
router.delete('/:id', authenticateToken, requireAdmin, deleteTeamMember);

export default router;
