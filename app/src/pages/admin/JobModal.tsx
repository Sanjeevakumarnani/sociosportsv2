import { useState } from 'react';
import { X, Briefcase } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface JobModalProps {
    job?: any;
    onClose: () => void;
    onSave: () => void;
}

const JobModal = ({ job, onClose, onSave }: JobModalProps) => {
    const [formData, setFormData] = useState({
        title: job?.title || '',
        organization: job?.organization || '',
        location: job?.location || '',
        salary: job?.salary || '',
        type: job?.type || 'FULL_TIME',
        description: job?.description || '',
        requirements: job?.requirements || '',
        benefits: job?.benefits || '',
        category: job?.category || 'JOIN_SOCIO_SPORTS',
        applyUrl: job?.applyUrl || '',
        status: job?.status || 'OPEN',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            if (job?.id) {
                await api.updateJob(job.id, formData, token);
                toast.success('Job updated successfully!');
            } else {
                await api.createJob(formData, token);
                toast.success('Job created successfully!');
            }

            onSave();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange)]/10 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-[var(--accent-orange)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[var(--text-primary)]">
                                {job ? 'Edit Job Posting' : 'Create Job Posting'}
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {job ? 'Update job details' : 'Add a new job opening'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--text-secondary)]" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g., Senior Sports Coach"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                                Organization *
                            </label>
                            <input
                                type="text"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g., SocioSports Academy"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g., Bangalore, India"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                                Salary Range
                            </label>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g., ₹5-8 LPA"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                                Job Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </select>
                        </div>

                        <div>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                                Job Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option value="ATHLETE_OPPORTUNITY">Athlete Opportunities</option>
                                <option value="COACHING_POSITION">Coaching Positions</option>
                                <option value="JOIN_SOCIO_SPORTS">Join SocioSports</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                                External Application URL (optional)
                            </label>
                            <input
                                type="url"
                                name="applyUrl"
                                value={formData.applyUrl}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="https://example.com/apply"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                            Job Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] resize-none"
                            placeholder="Provide a detailed description of the role..."
                        />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                            Requirements
                        </label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] resize-none"
                            placeholder="List the key requirements (one per line)..."
                        />
                    </div>

                    {/* Benefits */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                            Benefits
                        </label>
                        <textarea
                            name="benefits"
                            value={formData.benefits}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] resize-none"
                            placeholder="List the benefits (one per line)..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobModal;
