import express from 'express';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../controllers/vendorController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getVendors);
router.post('/', authenticateToken, createVendor);
router.put('/:id', authenticateToken, updateVendor);
router.delete('/:id', authenticateToken, deleteVendor);

export default router;
