import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, MapPin, Award, Star, CheckCircle, ShieldCheck, Filter, Plus, Trash2, Edit, User, Smartphone, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/admin/Pagination';
import ExportButton from '../../components/admin/ExportButton';
import Skeleton from '../../components/Skeleton';
import toast from 'react-hot-toast';

const TrainersAdmin = () => {
    const [trainers, setTrainers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchTrainers = async () => {
        setLoading(true);
        try {
            const data = await api.getTrainers();
            setTrainers(data);
        } catch (error) {
            console.error('Failed to fetch trainers:', error);
            toast.error('Failed to load trainers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const toggleVerification = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            await api.verifyTrainer(id, !currentStatus, token);
            toast.success(`Trainer ${currentStatus ? 'Unverified' : 'Verified'} successfully`);
            fetchTrainers();
        } catch (error) {
            console.error('Failed to update verification:', error);
            toast.error('Failed to update verification status');
        }
    };

    const filteredTrainers = trainers.filter(t =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedTrainers = filteredTrainers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const exportColumns = [
        { key: 'name', header: 'Trainer' },
        { key: 'specialization', header: 'Specialization' },
        { key: 'location', header: 'Location' },
        { key: 'rating', header: 'Rating' },
        { key: 'isVerified', header: 'Verified' }
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Expert Trainers</h1>
                        <p className="text-[var(--text-secondary)]">Manage trainer profiles and certifying certificates.</p>
                    </div>
                    <ExportButton
                        data={filteredTrainers}
                        filename="trainers_export"
                        columns={exportColumns}
                    />
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[32px] overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)] flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                placeholder="Search trainers..."
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
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Trainer</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Specialization</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Location</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Rating</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading ? (
                                    Array.from({ length: pageSize }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={5} className="px-8 py-4">
                                                <Skeleton variant="text" width="100%" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedTrainers.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-[var(--text-secondary)]">No trainers found.</td></tr>
                                ) : paginatedTrainers.map(trainer => (
                                    <tr key={trainer.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                        <td className="px-8 py-4 font-bold text-[var(--text-primary)]">{trainer.name}</td>
                                        <td className="px-8 py-4 text-sm text-[var(--text-secondary)]">{trainer.specialization}</td>
                                        <td className="px-8 py-4 text-sm text-[var(--text-secondary)]">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3 h-3" /> {trainer.location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-sm flex items-center gap-1 font-bold text-[var(--text-primary)]">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" /> {trainer.rating}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button
                                                onClick={() => toggleVerification(trainer.id, trainer.isVerified)}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${trainer.isVerified
                                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-blue-500 hover:text-blue-500'
                                                    }`}
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                                {trainer.isVerified ? 'Verified' : 'Verify Now'}
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
                        totalPages={Math.ceil(filteredTrainers.length / pageSize)}
                        pageSize={pageSize}
                        totalItems={filteredTrainers.length}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default TrainersAdmin;
