import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController';

import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, isAdmin, getUsers);
router.put('/:id', authenticateToken, isAdmin, updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

export default router;
