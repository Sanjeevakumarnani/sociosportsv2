import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    MapPin,
    Briefcase,
    DollarSign,
    Clock,
    Trash2,
    Edit,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { api } from '../../services/api';
import JobModal from './JobModal';
import Pagination from '../../components/admin/Pagination';
import ExportButton from '../../components/admin/ExportButton';
import Skeleton from '../../components/Skeleton';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';

const JobsAdmin = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            if (token) {
                const data = await api.getAllJobsAdmin(token);
                setJobs(data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDeleteJob = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                const token = localStorage.getItem('adminToken');
                if (token) {
                    await api.deleteJob(id, token);
                    toast.success('Job deleted successfully');
                    fetchJobs();
                }
            } catch (error) {
                console.error('Error deleting job:', error);
                toast.error('Failed to delete job');
            }
        }
    };

    const handleEditJob = (job: any) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleCreateJob = () => {
        setSelectedJob(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    const handleModalSave = () => {
        fetchJobs();
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    // Filter logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || job.status === filterStatus;
        const matchesCategory = filterCategory === 'ALL' || job.category === filterCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Pagination logic
    const totalItems = filteredJobs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Columns for export
    const exportColumns = [
        { key: 'title', header: 'Job Title' },
        { key: 'organization', header: 'Organization' },
        { key: 'location', header: 'Location' },
        { key: 'type', header: 'Type' },
        { key: 'salary', header: 'Salary' },
        { key: 'status', header: 'Status' },
        { key: 'createdAt', header: 'Created At' }
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Job Listings</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Manage job openings and applications</p>
                    </div>
                    <div className="flex gap-3">
                        <ExportButton
                            data={filteredJobs}
                            filename="jobs_export"
                            columns={exportColumns}
                        />
                        <button
                            onClick={handleCreateJob}
                            className="flex items-center gap-2 bg-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/90 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[var(--accent-orange)]/20"
                        >
                            <Plus className="w-5 h-5" />
                            Post New Job
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search jobs..."
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
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                        >
                            <option value="ALL">All Categories</option>
                            <option value="ATHLETE_OPPORTUNITY">Athlete Opportunities</option>
                            <option value="COACHING_POSITION">Coaching Positions</option>
                            <option value="JOIN_SOCIO_SPORTS">Join SocioSports</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                        >
                            <option value="ALL">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>
                </div>

                {/* Job List */}
                <div className="space-y-4">
                    {loading ? (
                        // Skeleton Loading
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-2 w-full">
                                        <Skeleton variant="text" width="40%" height="24px" />
                                        <Skeleton variant="text" width="20%" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : paginatedJobs.length === 0 ? (
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-12 text-center">
                            <Briefcase className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No jobs found</h3>
                            <p className="text-[var(--text-secondary)]">
                                Try adjusting your search or filters, or create a new job posting.
                            </p>
                        </div>
                    ) : (
                        paginatedJobs.map((job) => (
                            <div key={job.id} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--accent-orange)]/50 transition-colors group">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between md:justify-start gap-4 mb-2">
                                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{job.title}</h3>
                                            <div className="flex gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${job.category === 'ATHLETE_OPPORTUNITY'
                                                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                    : job.category === 'COACHING_POSITION'
                                                        ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                                        : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                                    }`}>
                                                    {job.category?.replace(/_/g, ' ')}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${job.status === 'OPEN'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)] mb-4">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                {job.organization}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salary || 'Not specified'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {job.type}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)] mt-4">
                                            <button
                                                onClick={() => handleEditJob(job)}
                                                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-orange)] text-sm font-bold transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(job.id)}
                                                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-red-500 text-sm font-bold transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
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

                {/* Job Modal */}
                {isModalOpen && (
                    <JobModal
                        job={selectedJob}
                        onClose={handleModalClose}
                        onSave={handleModalSave}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default JobsAdmin;
