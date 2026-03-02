import express from 'express';
import { getContent, updateContent } from '../controllers/pageContentController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:slug', getContent);
router.post('/:slug', authenticateToken, isAdmin, updateContent); // Using POST to handle both create/update via upsert logic

export default router;
