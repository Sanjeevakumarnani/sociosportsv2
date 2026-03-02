import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadService } from '../../services/uploadService';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
    accept?: string; // File type filter (e.g., "image/*", "audio/*", "video/*")
}

const ImageUpload = ({ value, onChange, label = "Upload Image", className = "", accept = "image/*" }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem('adminToken');
        if (!token) {
            alert('Authentication error: No admin token found.');
            return;
        }

        try {
            setUploading(true);
            const url = await uploadService.uploadImage(file, token);
            onChange(url);
        } catch (error) {
            console.error('Upload Error:', error);
            if (error instanceof Error) {
                alert(`Upload Failed: ${error.message}`);
            } else {
                alert('Failed to upload file. Please check console for details.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleClear = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">{label}</label>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
            />

            {!value ? (
                <button
                    type="button" // Prevent form submission
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-32 border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[var(--accent-orange)] hover:bg-[var(--bg-primary)] transition-colors group disabled:opacity-50"
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-[var(--accent-orange)] animate-spin" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-orange)] transition-colors" />
                            <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Click to Upload File</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)] group">
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-2 right-2 p-2 bg-[var(--bg-secondary)] backdrop-blur rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-red-500/80 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">File Uploaded</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
