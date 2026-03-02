import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Trash2,
    CheckCircle,
    XCircle,
    MessageSquare,
    Calendar,
    Mail,
    Phone,
    User,
    Archive
} from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/admin/Pagination';
import ExportButton from '../../components/admin/ExportButton';
import Skeleton from '../../components/Skeleton';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';

const InquiriesAdmin = () => {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            if (token) {
                const data = await api.getInquiries(token);
                setInquiries(data);
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (token) {
                await api.updateInquiryStatus(id, newStatus, token);
                toast.success(`Inquiry marked as ${newStatus}`);
                fetchInquiries();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                const token = localStorage.getItem('adminToken');
                if (token) {
                    await api.deleteInquiry(id, token);
                    toast.success('Inquiry deleted successfully');
                    fetchInquiries();
                }
            } catch (error) {
                console.error('Error deleting inquiry:', error);
                toast.error('Failed to delete inquiry');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} inquiries?`)) {
            try {
                const token = localStorage.getItem('adminToken');
                if (token) {
                    await Promise.all(selectedItems.map(id => api.deleteInquiry(id, token)));
                    toast.success('Selected inquiries deleted successfully');
                    setSelectedItems([]);
                    fetchInquiries();
                }
            } catch (error) {
                console.error('Error deleting inquiries:', error);
                toast.error('Failed to delete selected inquiries');
            }
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === paginatedInquiries.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(paginatedInquiries.map(i => i.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Filter logic
    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch =
            inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || inquiry.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalItems = filteredInquiries.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedInquiries = filteredInquiries.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Columns for export
    const exportColumns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'subject', header: 'Subject' },
        { key: 'message', header: 'Message' },
        { key: 'status', header: 'Status' },
        { key: 'createdAt', header: 'Date' }
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Inquiries</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Manage customer support and contact requests</p>
                    </div>
                    <div className="flex gap-3">
                        <ExportButton
                            data={filteredInquiries}
                            filename="inquiries_export"
                            columns={exportColumns}
                        />
                        {selectedItems.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
                            >
                                <Trash2 className="w-5 h-5" />
                                Delete Selected ({selectedItems.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
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
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Inquiries List */}
                <div className="space-y-4">
                    {/* Select All Header (only if items exist) */}
                    {!loading && paginatedInquiries.length > 0 && (
                        <div className="flex items-center gap-3 px-6 py-2">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === paginatedInquiries.length && paginatedInquiries.length > 0}
                                onChange={toggleSelectAll}
                                className="w-5 h-5 rounded border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent-orange)] focus:ring-[var(--accent-orange)]"
                            />
                            <span className="text-sm font-bold text-[var(--text-secondary)]">Select All on Page</span>
                        </div>
                    )}

                    {loading ? (
                        // Skeleton Loading
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-2 w-full">
                                        <Skeleton variant="text" width="30%" height="24px" />
                                        <Skeleton variant="text" width="50%" />
                                        <Skeleton variant="text" width="80%" height="40px" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : paginatedInquiries.length === 0 ? (
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-12 text-center">
                            <MessageSquare className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No inquiries found</h3>
                            <p className="text-[var(--text-secondary)]">
                                Try adjusting your search or filters.
                            </p>
                        </div>
                    ) : (
                        paginatedInquiries.map((inquiry) => (
                            <div key={inquiry.id} className={`bg-[var(--bg-secondary)] border rounded-2xl p-6 transition-all group ${selectedItems.includes(inquiry.id)
                                ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/5'
                                : 'border-[var(--border)] hover:border-[var(--accent-orange)]/50'
                                }`}>
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(inquiry.id)}
                                        onChange={() => toggleSelectItem(inquiry.id)}
                                        className="mt-1 w-5 h-5 rounded border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent-orange)] focus:ring-[var(--accent-orange)]"
                                    />

                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border)]">
                                                    <User className="w-5 h-5 text-[var(--text-secondary)]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[var(--text-primary)]">{inquiry.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                        <Mail className="w-3 h-3" />
                                                        {inquiry.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${inquiry.status === 'RESOLVED'
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : inquiry.status === 'ARCHIVED'
                                                    ? 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]'
                                                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                {inquiry.status}
                                            </span>
                                        </div>

                                        <div className="bg-[var(--bg-primary)] rounded-xl p-4 mb-4 border border-[var(--border)]">
                                            <h4 className="font-bold text-[var(--text-primary)] mb-1 text-sm">{inquiry.subject}</h4>
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{inquiry.message}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {inquiry.status !== 'RESOLVED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(inquiry.id, 'RESOLVED')}
                                                        className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                                                        title="Mark as Resolved"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {inquiry.status !== 'ARCHIVED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(inquiry.id, 'ARCHIVED')}
                                                        className="p-2 hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-lg transition-colors"
                                                        title="Archive"
                                                    >
                                                        <Archive className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(inquiry.id)}
                                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
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
            </div>
        </AdminLayout>
    );
};

export default InquiriesAdmin;
