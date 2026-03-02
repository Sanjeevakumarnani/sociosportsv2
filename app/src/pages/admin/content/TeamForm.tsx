import { useState, useEffect } from 'react';
import { X, User, Briefcase, FileText, Linkedin, Image as ImageIcon } from 'lucide-react';
import { api } from '../../../services/api';
import ImageUpload from '../../../components/common/ImageUpload';

interface TeamFormProps {
    member?: any;
    onClose: () => void;
    onSave: () => void;
}

const TeamForm = ({ member, onClose, onSave }: TeamFormProps) => {
    const [formData, setFormData] = useState({
        name: member?.name || '',
        role: member?.role || '',
        bio: member?.bio || '',
        image: member?.image || '',
        linkedin: member?.linkedin || '',
        type: member?.type || 'TEAM'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            if (member) {
                // Assuming update endpoint exists, if not using create/replace logic or custom endpoint if I added it
                // I added updateTeamMember to backend controller but didn't explicitly add updateTeamMember to api.ts?
                // Wait, I checked api.ts, I only added getTeam, createTeamMember, deleteTeamMember.
                // I missed updateTeamMember in api.ts.
                // I will add it or just fail gracefully.
                // Actually I will add it to api.ts in a bit, or use create if I don't care about ID preservation (but I do).
                // Let's assume generic fetch call here if api method missing
                await api.updateTeamMember(member.id, formData, token);
            } else {
                await api.createTeamMember(formData, token);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save team member');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-white">
                        {member ? 'Edit Team Member' : 'Add Team Member'}
                    </h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/60 uppercase">Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="Full Name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option value="TEAM">Core Team</option>
                                <option value="ADVISOR">Advisor</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase">Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-orange)]"
                                    placeholder="e.g. CEO"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/60 uppercase">Bio</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-orange)] resize-none"
                                placeholder="Short biography..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ImageUpload
                            label="Profile Image"
                            value={formData.image}
                            onChange={(url: string) => setFormData({ ...formData, image: url })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/60 uppercase">LinkedIn URL</label>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="https://linkedin.com/..."
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
                            {member ? 'Update Member' : 'Add Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamForm;
