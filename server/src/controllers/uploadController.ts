import { Request, Response } from 'express';

// Return the file path after upload
export const uploadFile = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the public URL
    // Assumes 'uploads' is served statically from the root
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({ url: fileUrl });
};
