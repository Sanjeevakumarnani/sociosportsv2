import express from 'express';
import { getJobs, createJob, updateJob, deleteJob, getAllJobsAdmin } from '../controllers/jobController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getJobs);

// Protected routes (Admin/Employer)
router.get('/admin/all', authenticateToken, getAllJobsAdmin);
router.post('/', authenticateToken, createJob);
router.put('/:id', authenticateToken, updateJob);
router.delete('/:id', authenticateToken, deleteJob);

export default router;
