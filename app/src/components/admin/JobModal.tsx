import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface JobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    job?: any;
}

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, onSuccess, job }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        type: 'Full-time',
        department: '',
        description: '',
        requirements: '',
        category: 'SOCIOSPORTS',
        applicationUrl: ''
    });
    const [loading, setLoading] = useState(false);

    useFocusTrap(modalRef, isOpen, onClose);

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || '',
                location: job.location || '',
                type: job.type || 'Full-time',
                department: job.department || '',
                description: job.description || '',
                requirements: job.requirements || '',
                category: job.category || 'SOCIOSPORTS',
                applicationUrl: job.applicationUrl || ''
            });
        } else {
            setFormData({
                title: '',
                location: '',
                type: 'Full-time', // Default value
                department: '',
                description: '',
                requirements: '',
                category: 'SOCIOSPORTS',
                applicationUrl: ''
            });
        }
    }, [job, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            if (job) {
                await api.updateJob(job.id, formData, token);
            } else {
                await api.createJob(formData, token);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save job:', error);
            alert('Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div ref={modalRef} className="bg-[var(--bg-secondary)] border border-[var(--border)] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--bg-secondary)] z-10">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        {job ? 'Edit Job' : 'Post New Job'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors text-[var(--text-secondary)]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g. Senior Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g. Remote / New York"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g. Engineering"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option value="ATHLETE">For Athletes</option>
                                <option value="COACH">For Coaches</option>
                                <option value="SOCIOSPORTS">SocioSports Internal</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] min-h-[100px]"
                            placeholder="Job description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Requirements</label>
                        <textarea
                            required
                            value={formData.requirements}
                            onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] min-h-[100px]"
                            placeholder="Requirements..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Application URL (Optional)</label>
                        <input
                            type="url"
                            value={formData.applicationUrl}
                            onChange={e => setFormData({ ...formData, applicationUrl: e.target.value })}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            placeholder="e.g. https://forms.gle/..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border)] mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Saving...' : (job ? 'Update Job' : 'Post Job')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobModal;
