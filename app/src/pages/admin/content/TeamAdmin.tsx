
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MoreHorizontal, User, Linkedin, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../../../services/api';
import TeamMemberForm from '../../../components/admin/content/TeamMemberForm';
import { type TeamMemberFormData } from '../../../components/admin/content/TeamMemberSchema';

interface TeamMember extends TeamMemberFormData {
    id: string;
}

const TeamAdmin = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMembers = async () => {
        try {
            const data = await api.getTeam();
            setMembers(data);
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleSubmit = async (data: TeamMemberFormData) => {
        setIsSubmitting(true);
        try {
            // Get token from localStorage
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No token found');

            if (editingMember) {
                await api.updateTeamMember(editingMember.id, data, token);
            } else {
                await api.createTeamMember(data, token);
            }
            await fetchMembers();
            setIsFormOpen(false);
            setEditingMember(null);
        } catch (error) {
            console.error('Failed to save team member:', error);
            alert('Failed to save team member');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No token found');

            await api.deleteTeamMember(id, token);
            fetchMembers();
        } catch (error) {
            console.error('Failed to delete member:', error);
            alert('Failed to delete member');
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Team Management</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Manage leadership and advisors.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingMember(null);
                        setIsFormOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                >
                    <Plus className="w-4 h-4" />
                    Add Member
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border)]">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--accent-orange)]"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Member</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Order</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">Loading...</td>
                            </tr>
                        ) : filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">No members found.</td>
                            </tr>
                        ) : (
                            filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-[var(--text-secondary)]" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[var(--text-primary)]">{member.name}</div>
                                                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"><Linkedin className="w-3 h-3" /> LinkedIn</a>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-[var(--text-secondary)]">{member.role}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${member.category === 'LEADERSHIP'
                                            ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                            : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                            }`}>
                                            {member.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-mono text-[var(--text-secondary)]">{member.order}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingMember(member);
                                                    setIsFormOpen(true);
                                                }}
                                                className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-orange)] transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <TeamMemberForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingMember(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingMember}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default TeamAdmin;
