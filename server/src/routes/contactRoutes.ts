import express from 'express';
import { submitInquiry } from '../controllers/contactController';

const router = express.Router();

router.post('/', submitInquiry);

export default router;
