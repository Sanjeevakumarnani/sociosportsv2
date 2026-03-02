import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';

import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getEvents);
router.post('/', authenticateToken, isAdmin, createEvent);
router.put('/:id', authenticateToken, isAdmin, updateEvent);
router.delete('/:id', authenticateToken, isAdmin, deleteEvent);

export default router;
