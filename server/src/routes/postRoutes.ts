import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/postController';

import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', authenticateToken, isAdmin, createPost);
router.put('/:id', authenticateToken, isAdmin, updatePost);
router.delete('/:id', authenticateToken, isAdmin, deletePost);

export default router;
