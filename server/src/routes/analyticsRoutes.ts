import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';
import {
    getDashboardStats,
    getRecentUsers,
    getRevenueChart,
    getBookingStats,
    getDetailedStats
} from '../controllers/analyticsController';

const router = Router();

// All analytics routes require admin authentication
router.get('/stats', authenticateToken, requireAdmin, getDashboardStats);
router.get('/recent-users', authenticateToken, requireAdmin, getRecentUsers);
router.get('/revenue-chart', authenticateToken, requireAdmin, getRevenueChart);
router.get('/booking-stats', authenticateToken, requireAdmin, getBookingStats);
router.get('/detailed', authenticateToken, requireAdmin, getDetailedStats);

export default router;
