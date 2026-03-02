import express from 'express';
import { getBookings, createBooking, updateBooking } from '../controllers/bookingController';
import { authenticateToken, optionalAuthenticate, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, isAdmin, getBookings);
router.post('/', optionalAuthenticate, createBooking);
router.put('/:id', authenticateToken, isAdmin, updateBooking);

export default router;
