import { API_URL } from '../services/api';

export const uploadService = {
    uploadImage: async (file: File, token: string): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed with status:', response.status, errorText);
            throw new Error(`Server returned ${response.status}: ${errorText}`);
        }


        const data = await response.json();
        console.log('Upload successful, server response:', data);
        return data.url;
    }
};
