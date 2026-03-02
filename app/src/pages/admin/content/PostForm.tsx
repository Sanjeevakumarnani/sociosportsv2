import { useState, useEffect } from 'react';
import { X, Type, FileText, Tag, Image as ImageIcon, Music, Video, Upload } from 'lucide-react';
import { api } from '../../../services/api';
import ImageUpload from '../../../components/common/ImageUpload';

interface PostFormProps {
    post?: any;
    onClose: () => void;
    onSave: () => void;
}

const PostForm = ({ post, onClose, onSave }: PostFormProps) => {
    const [formData, setFormData] = useState({
        title: post?.title || '',
        content: post?.content || '',
        category: post?.category || 'Articles',
        status: post?.status || 'DRAFT',
        image: post?.image || '',
        audio: post?.audio || '',
        video: post?.video || '',
        gallery: post?.gallery || '[]'
    });

    const [mediaTab, setMediaTab] = useState<'image' | 'audio' | 'video' | 'gallery'>('image');

    // For gallery, we still need a side effect if post.gallery changes OR just memoize it?
    // But since it's a form, standard is to initialize and then let it be.
    const [galleryPhotos, setGalleryPhotos] = useState<string[]>(() => {
        try {
            const parsed = JSON.parse(post?.gallery || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGalleryAdd = (url: string) => {
        if (url && !galleryPhotos.includes(url)) {
            const updated = [...galleryPhotos, url];
            setGalleryPhotos(updated);
            setFormData({ ...formData, gallery: JSON.stringify(updated) });
        }
    };

    const handleGalleryRemove = (index: number) => {
        const updated = galleryPhotos.filter((_, i) => i !== index);
        setGalleryPhotos(updated);
        setFormData({ ...formData, gallery: JSON.stringify(updated) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            if (post) {
                await api.updatePost(post.id, formData, token);
            } else {
                await api.createPost({
                    ...formData
                }, token);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save post');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-3xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-white">
                        {post ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/60 uppercase">Title</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="Article Title"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-orange)]"
                                >
                                    <option>Articles</option>
                                    <option>Podcasts</option>
                                    <option>Athlete Stories</option>
                                    <option>Training</option>
                                    <option>Health</option>
                                    <option>Events</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                    </div>

                    {/* Media Upload Tabs */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/60 uppercase">Media</label>

                        {/* Tab Navigation */}
                        <div className="flex gap-2 border-b border-white/10">
                            {[
                                { key: 'image' as const, label: 'Cover Image', icon: ImageIcon },
                                { key: 'audio' as const, label: 'Audio', icon: Music },
                                { key: 'video' as const, label: 'Video', icon: Video },
                                { key: 'gallery' as const, label: 'Photo Gallery', icon: Upload }
                            ].map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setMediaTab(tab.key)}
                                        className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${mediaTab === tab.key
                                            ? 'border-[var(--accent-orange)] text-white'
                                            : 'border-transparent text-white/50 hover:text-white/80'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <div className="pt-2">
                            {mediaTab === 'image' && (
                                <ImageUpload
                                    label="Cover Image (JPG, PNG, WebP)"
                                    value={formData.image}
                                    onChange={(url) => setFormData({ ...formData, image: url })}
                                />
                            )}

                            {mediaTab === 'audio' && (
                                <div className="space-y-2">
                                    <ImageUpload
                                        label="Audio File (MP3, WAV, OGG) - For Podcasts"
                                        value={formData.audio}
                                        onChange={(url) => setFormData({ ...formData, audio: url })}
                                        accept="audio/*"
                                    />
                                    {formData.audio && (
                                        <div className="mt-3 p-3 bg-black/40 rounded-lg border border-white/10">
                                            <p className="text-xs text-white/60 mb-2">Preview:</p>
                                            <audio controls className="w-full">
                                                <source src={formData.audio} />
                                            </audio>
                                        </div>
                                    )}
                                </div>
                            )}

                            {mediaTab === 'video' && (
                                <div className="space-y-2">
                                    <ImageUpload
                                        label="Video File (MP4, WebM) - For Video Content"
                                        value={formData.video}
                                        onChange={(url) => setFormData({ ...formData, video: url })}
                                        accept="video/*"
                                    />
                                    {formData.video && (
                                        <div className="mt-3 p-3 bg-black/40 rounded-lg border border-white/10">
                                            <p className="text-xs text-white/60 mb-2">Preview:</p>
                                            <video controls className="w-full max-h-48 rounded-lg">
                                                <source src={formData.video} />
                                            </video>
                                        </div>
                                    )}
                                </div>
                            )}

                            {mediaTab === 'gallery' && (
                                <div className="space-y-3">
                                    <ImageUpload
                                        label="Add Photos to Gallery"
                                        value=""
                                        onChange={handleGalleryAdd}
                                    />
                                    {galleryPhotos.length > 0 && (
                                        <div className="grid grid-cols-3 gap-3 mt-3">
                                            {galleryPhotos.map((photo, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img
                                                        src={photo}
                                                        alt={`Gallery ${idx + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border border-white/10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGalleryRemove(idx)}
                                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-white/40 italic">
                                        {galleryPhotos.length} photo(s) in gallery
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/60 uppercase">Content</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={10}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-orange)] resize-none"
                                placeholder="Write your post content here..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[var(--accent-orange)] rounded-lg text-white font-bold hover:bg-orange-600 transition-colors"
                        >
                            {post ? 'Update Post' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostForm;
