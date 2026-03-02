
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Upload, User, Linkedin, Quote } from 'lucide-react';
import { teamMemberSchema, type TeamMemberFormData } from './TeamMemberSchema';

interface TeamMemberFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TeamMemberFormData) => void;
    initialData?: any;
    isSubmitting?: boolean;
}

const TeamMemberForm = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }: TeamMemberFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(teamMemberSchema),
        defaultValues: {
            name: '',
            role: '',
            bio: '',
            image: '',
            linkedin: '',
            quote: '',
            category: 'LEADERSHIP',
            order: 0
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    role: initialData.role,
                    bio: initialData.bio || '',
                    image: initialData.image || '',
                    linkedin: initialData.linkedin || '',
                    quote: initialData.quote || '',
                    category: initialData.category as "LEADERSHIP" | "ADVISOR",
                    order: initialData.order || 0
                });
            } else {
                reset({
                    name: '',
                    role: '',
                    bio: '',
                    image: '',
                    linkedin: '',
                    quote: '',
                    category: 'LEADERSHIP',
                    order: 0
                });
            }
        }
    }, [isOpen, initialData, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-md bg-[var(--bg-secondary)] h-full shadow-2xl overflow-y-auto border-l border-[var(--border)] animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--bg-secondary)]/95 backdrop-blur z-10">
                    <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                        {initialData ? 'Edit Member' : 'Add Member'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors">
                        <X className="w-5 h-5 text-[var(--text-secondary)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                <input
                                    {...register('name')}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Role / Title</label>
                            <input
                                {...register('role')}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                                placeholder="e.g. Chief Executive Officer"
                            />
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Category</label>
                            <div className="flex bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--border)]">
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" value="LEADERSHIP" {...register('category')} className="sr-only peer" />
                                    <div className="text-center py-2 rounded-lg text-xs font-bold text-[var(--text-secondary)] peer-checked:bg-[var(--accent-orange)] peer-checked:text-white transition-all">
                                        Leadership
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" value="ADVISOR" {...register('category')} className="sr-only peer" />
                                    <div className="text-center py-2 rounded-lg text-xs font-bold text-[var(--text-secondary)] peer-checked:bg-[var(--accent-orange)] peer-checked:text-white transition-all">
                                        Advisor
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Profile Image URL</label>
                        <div className="relative">
                            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                {...register('image')}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                                placeholder="/images/team_member.jpg"
                            />
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-1 ml-1">Enter absolute URL or path relative to public folder.</p>
                    </div>

                    {/* Socials & Bio */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">LinkedIn URL (Optional)</label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                <input
                                    {...register('linkedin')}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin.message}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Display Order</label>
                            <input
                                type="number"
                                {...register('order', { valueAsNumber: true })}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Short Bio</label>
                            <textarea
                                {...register('bio')}
                                rows={3}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors resize-none"
                                placeholder="Brief description of experience and role..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Quote (Optional)</label>
                            <div className="relative">
                                <Quote className="absolute left-3 top-3 w-4 h-4 text-[var(--text-secondary)]" />
                                <textarea
                                    {...register('quote')}
                                    rows={2}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors resize-none"
                                    placeholder="Inspirational quote..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl bg-[var(--accent-orange)] text-white text-sm font-bold shadow-lg shadow-[var(--accent-orange)]/20 hover:bg-[var(--accent-orange)]/90 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting ? 'Saving...' : 'Save Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamMemberForm;
