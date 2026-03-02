import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';
import {
  submitVerification,
  getVerificationStatus,
  trackByToken,
  getAllVerifications,
  getVerificationById,
  approveVerification,
  rejectVerification,
  setUnderReview
} from '../controllers/employerVerificationController';

const router = Router();

// Public routes
router.get('/track/:token', trackByToken);

// Protected routes (require authentication)
router.post('/submit', authenticateToken, submitVerification);
router.get('/status', authenticateToken, getVerificationStatus);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, getAllVerifications);
router.get('/admin/:id', authenticateToken, requireAdmin, getVerificationById);
router.put('/admin/:id/approve', authenticateToken, requireAdmin, approveVerification);
router.put('/admin/:id/reject', authenticateToken, requireAdmin, rejectVerification);
router.put('/admin/:id/review', authenticateToken, requireAdmin, setUnderReview);

export default router;
