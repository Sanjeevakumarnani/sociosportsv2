import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    User as UserIcon,
    Shield,
    CheckCircle,
    Trash2,
    Edit,
    Mail,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { api } from '../../../services/api';
import AdminLayout from '../../../layouts/AdminLayout';
import Pagination from '../../../components/admin/Pagination';
import ExportButton from '../../../components/admin/ExportButton';
import Skeleton from '../../../components/Skeleton';
import toast from 'react-hot-toast';

const UserList = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            if (token) {
                const data = await api.getUsers(token);
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) return;

        try {
            const token = localStorage.getItem('adminToken');
            if (token) {
                await api.deleteUser(id, token);
                toast.success('User deleted successfully');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const handleRoleUpdate = async (id: string, newRole: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (token) {
                await api.updateUser(id, { role: newRole }, token);
                toast.success(`User role updated to ${newRole}`);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update user role');
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'COACH': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'ATHLETE': return 'bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] border-[var(--accent-orange)]/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    // Filter logic
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'ALL' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    // Pagination logic
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Columns for export
    const exportColumns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
        { key: 'createdAt', header: 'Joined' }
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">User Management</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Manage athletes, coaches, and platform administrators</p>
                    </div>
                    <div className="flex gap-3">
                        <ExportButton
                            data={filteredUsers}
                            filename="users_export"
                            columns={exportColumns}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
                        <select
                            value={filterRole}
                            onChange={(e) => {
                                setFilterRole(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                        >
                            <option value="ALL">All Roles</option>
                            <option value="ADMIN">Administrators</option>
                            <option value="COACH">Coaches</option>
                            <option value="ATHLETE">Athletes</option>
                            <option value="USER">General Users</option>
                        </select>
                    </div>
                </div>

                {/* User List */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--bg-primary)]/50 border-b border-[var(--border)] text-xs uppercase text-[var(--text-secondary)] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={4} className="px-6 py-4">
                                                <Skeleton variant="text" height="24px" width="80%" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)]">
                                                        <UserIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">{user.name || 'No Name'}</div>
                                                        <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border tracking-wider ${getRoleColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                    <div className="group/role relative">
                                                        <button className="p-1 hover:bg-[var(--bg-primary)] rounded border border-transparent hover:border-[var(--border)] transition-all">
                                                            <Edit className="w-3.5 h-3.5 text-[var(--text-secondary)] hover:text-[var(--accent-orange)]" />
                                                        </button>
                                                        <div className="absolute left-0 top-full mt-2 w-32 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl overflow-hidden hidden group-hover/role:block z-20 shadow-2xl">
                                                            <button onClick={() => handleRoleUpdate(user.id, 'ADMIN')} className="w-full text-left px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-orange)] transition-colors">Make Admin</button>
                                                            <button onClick={() => handleRoleUpdate(user.id, 'COACH')} className="w-full text-left px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-orange)] transition-colors">Make Coach</button>
                                                            <button onClick={() => handleRoleUpdate(user.id, 'ATHLETE')} className="w-full text-left px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-orange)] transition-colors">Make Athlete</button>
                                                            <button onClick={() => handleRoleUpdate(user.id, 'USER')} className="w-full text-left px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-orange)] transition-colors">Make User</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!loading && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserList;
