import express, { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile } from '../controllers/uploadController';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        // Create unique string filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for audio/video files
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // Accept images, audio, and video files
        const imageTypes = /jpeg|jpg|png|webp|gif/;
        const audioTypes = /mp3|wav|ogg|m4a|aac/;
        const videoTypes = /mp4|webm|avi|mov/;

        const ext = path.extname(file.originalname).toLowerCase();
        const isImage = imageTypes.test(file.mimetype) || imageTypes.test(ext);
        const isAudio = audioTypes.test(file.mimetype) || audioTypes.test(ext);
        const isVideo = videoTypes.test(file.mimetype) || videoTypes.test(ext);

        if (isImage || isAudio || isVideo) {
            return cb(null, true);
        }
        cb(new Error('Only images, audio, and video files are allowed!'));
    }
});

import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

router.post('/', authenticateToken, isAdmin, upload.single('image'), uploadFile);
router.post('/public', upload.single('image'), uploadFile);

export default router;
