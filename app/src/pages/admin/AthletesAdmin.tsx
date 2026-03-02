import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, MapPin, Trophy, ShieldCheck, CheckCircle, XCircle, Filter, Plus, Trash2, Edit, Star, User, Smartphone } from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/admin/Pagination';
import ExportButton from '../../components/admin/ExportButton';
import Skeleton from '../../components/Skeleton';
import toast from 'react-hot-toast';

const AthletesAdmin = () => {
    const [athletes, setAthletes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchAthletes = async () => {
        setLoading(true);
        try {
            const data = await api.getAthletes();
            setAthletes(data);
        } catch (error) {
            console.error('Failed to fetch athletes:', error);
            toast.error('Failed to load athletes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAthletes();
    }, []);

    const toggleVerification = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            await api.verifyAthlete(id, !currentStatus, token);
            toast.success(`Athlete ${currentStatus ? 'Unverified' : 'Verified'} successfully`);
            fetchAthletes(); // Refresh list
        } catch (error) {
            console.error('Failed to update verification:', error);
            toast.error('Failed to update verification status');
        }
    };

    const filteredAthletes = athletes.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.sport?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedAthletes = filteredAthletes.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const exportColumns = [
        { key: 'name', header: 'Athlete' },
        { key: 'sport', header: 'Sport' },
        { key: 'location', header: 'Location' },
        { key: 'tier', header: 'Tier' },
        { key: 'isVerified', header: 'Verified' }
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Verified Athletes</h1>
                        <p className="text-[var(--text-secondary)]">Manage athlete profiles and verification status.</p>
                    </div>
                    <ExportButton
                        data={filteredAthletes}
                        filename="athletes_export"
                        columns={exportColumns}
                    />
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[32px] overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)] flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                placeholder="Search athletes..."
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-full py-2.5 pl-12 pr-4 text-sm outline-none focus:border-[var(--accent-orange)]"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Athlete</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Sport</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Location</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Tier</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Status</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading ? (
                                    Array.from({ length: pageSize }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={6} className="px-8 py-4">
                                                <Skeleton variant="text" width="100%" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedAthletes.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-[var(--text-secondary)]">No athletes found.</td></tr>
                                ) : paginatedAthletes.map(athlete => (
                                    <tr key={athlete.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                        <td className="px-8 py-4 font-bold text-[var(--text-primary)]">{athlete.name}</td>
                                        <td className="px-8 py-4 text-sm text-[var(--text-secondary)]">{athlete.sport}</td>
                                        <td className="px-8 py-4 text-sm text-[var(--text-secondary)]">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3 h-3" /> {athlete.location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-[var(--text-primary)] font-bold">{athlete.tier}</td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20 bg-green-500/10 text-green-500`}>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button
                                                onClick={() => toggleVerification(athlete.id, athlete.isVerified)}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${athlete.isVerified
                                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-blue-500 hover:text-blue-500'
                                                    }`}
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                                {athlete.isVerified ? 'Verified' : 'Verify Now'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredAthletes.length / pageSize)}
                        pageSize={pageSize}
                        totalItems={filteredAthletes.length}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AthletesAdmin;
