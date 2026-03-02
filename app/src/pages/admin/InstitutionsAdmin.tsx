import { useState, useEffect } from 'react';
import { Building2, CheckCircle, XCircle, Trash2, Edit, MapPin, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import Pagination from '../../components/admin/Pagination';
import ExportButton from '../../components/admin/ExportButton';
import Skeleton from '../../components/Skeleton';
import toast from 'react-hot-toast';

const InstitutionsAdmin = () => {
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const loadData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken') || '';

            // Load institutions and stats
            const [institutionsData, statsData] = await Promise.all([
                api.getInstitutions({}),
                api.getInstitutionStats(token),
            ]);

            setInstitutions(institutionsData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load institutions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleVerifyToggle = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('adminToken') || '';
            await api.verifyInstitution(id, !currentStatus, token);
            toast.success(`Institution ${!currentStatus ? 'verified' : 'unverified'} successfully`);
            loadData();
        } catch (error) {
            toast.error('Failed to update verification status');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const token = localStorage.getItem('adminToken') || '';
            await api.deleteInstitution(id, token);
            toast.success('Institution deleted successfully');
            loadData();
        } catch (error) {
            toast.error('Failed to delete institution');
        }
    };

    // Filter logic
    const filteredInstitutions = institutions.filter(inst => {
        const matchesSearch =
            inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inst.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inst.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'ALL' || inst.type === filterType;

        return matchesSearch && matchesType;
    });

    // Pagination logic
    const totalItems = filteredInstitutions.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedInstitutions = filteredInstitutions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Columns for export
    const exportColumns = [
        { key: 'name', header: 'Institution' },
        { key: 'type', header: 'Type' },
        { key: 'city', header: 'City' },
        { key: 'state', header: 'State' },
        { key: 'contactEmail', header: 'Email' },
        { key: 'contactPhone', header: 'Phone' },
        { key: 'isVerified', header: 'Verified' }
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Institutions</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Manage educational institutions and sports facilities</p>
                    </div>
                    <div className="flex gap-3">
                        <ExportButton
                            data={filteredInstitutions}
                            filename="institutions_export"
                            columns={exportColumns}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                {stats && !loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-[var(--text-secondary)]">
                                <Building2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Total</span>
                            </div>
                            <p className="text-3xl font-black text-[var(--text-primary)]">{stats.total || 0}</p>
                        </div>
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
                            </div>
                            <p className="text-3xl font-black text-[var(--text-primary)]">{stats.verified || 0}</p>
                        </div>
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-[var(--accent-orange)]">
                                <XCircle className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
                            </div>
                            <p className="text-3xl font-black text-[var(--text-primary)]">{stats.pending || 0}</p>
                        </div>
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-blue-500">
                                <Building2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Types</span>
                            </div>
                            <p className="text-3xl font-black text-[var(--text-primary)]">{stats.byType?.length || 0}</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search institutions..."
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
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                        >
                            <option value="ALL">All Types</option>
                            <option value="SCHOOL">Schools</option>
                            <option value="COLLEGE">Colleges</option>
                            <option value="UNIVERSITY">Universities</option>
                            <option value="ACADEMY">Sports Academies</option>
                            <option value="FACILITY">Sports Facilities</option>
                            <option value="STADIUM">Stadiums</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Institution</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={6} className="px-6 py-4">
                                                <Skeleton variant="text" height="20px" width="80%" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedInstitutions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                            No institutions found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedInstitutions.map((inst) => (
                                        <tr key={inst.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange)]/10 flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-[var(--accent-orange)]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[var(--text-primary)]">{inst.name}</p>
                                                        {inst.establishedYear && (
                                                            <p className="text-xs text-[var(--text-secondary)]">Est. {inst.establishedYear}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                                                    {inst.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                    <MapPin className="w-4 h-4" />
                                                    {inst.city || 'N/A'}, {inst.state || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <p className="text-[var(--text-primary)]">{inst.contactEmail}</p>
                                                    <p className="text-[var(--text-secondary)] text-xs">{inst.contactPhone}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleVerifyToggle(inst.id, inst.isVerified)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${inst.isVerified
                                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                                                            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20'
                                                        }`}
                                                >
                                                    {inst.isVerified ? (
                                                        <>
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            Verified
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Pending
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(inst.id, inst.name)}
                                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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

export default InstitutionsAdmin;
