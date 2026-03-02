import express from 'express';
import { createProfile, searchProfiles, getProfileBySportsId } from '../controllers/sportsProfileController';

const router = express.Router();

router.post('/', createProfile);
router.get('/search', searchProfiles);
router.get('/:sportsId', getProfileBySportsId);

export default router;
