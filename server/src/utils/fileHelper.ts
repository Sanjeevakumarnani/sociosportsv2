import fs from 'fs';
import path from 'path';

export const deleteFile = (fileUrl: string) => {
    if (!fileUrl) return;

    try {
        // Extract filename from URL
        // Example: http://localhost:5000/uploads/image-123.jpg -> image-123.jpg
        const filename = fileUrl.split('/').pop();
        if (!filename) return;

        const filePath = path.join(__dirname, '../../uploads', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        } else {
            console.warn(`File not found for deletion: ${filePath}`);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};
