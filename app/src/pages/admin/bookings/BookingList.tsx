import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    X,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Trash2,
    CreditCard,
    ChevronRight,
    Download
} from 'lucide-react';
import { api } from '../../../services/api';
import AdminLayout from '../../../layouts/AdminLayout';
import Pagination from '../../../components/admin/Pagination';
import ExportButton from '../../../components/admin/ExportButton';
import Skeleton from '../../../components/Skeleton';
import toast from 'react-hot-toast';

const BookingList = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            if (token) {
                const data = await api.getBookings(token);
                setBookings(data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return;

        try {
            const token = localStorage.getItem('adminToken');
            if (token) {
                await api.updateBookingStatus(id, status, token);
                toast.success(`Booking status updated to ${status}`);
                fetchBookings();
                if (selectedBooking && selectedBooking.id === id) {
                    setSelectedBooking({ ...selectedBooking, status });
                }
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            toast.error('Failed to update booking status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    const getPaymentColor = (status: string) => {
        return status === 'PAID' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10';
    };

    // Filter logic
    const filteredBookings = bookings.filter(b => {
        const matchesSearch =
            b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.event?.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
        const matchesType = filterType === 'ALL' || b.event?.type === filterType;

        return matchesSearch && matchesStatus && matchesType;
    });

    // Pagination logic
    const totalItems = filteredBookings.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Columns for export
    const exportColumns = [
        { key: 'id', header: 'Booking ID' },
        { key: 'user.name', header: 'User' },
        { key: 'event.title', header: 'Event' },
        { key: 'status', header: 'Status' },
        { key: 'paymentStatus', header: 'Payment' },
        { key: 'createdAt', header: 'Date' }
    ];

    const eventTypes = ['ALL', 'Training', 'Tournament', 'Stall'];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Booking Management</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Track event registrations, stall bookings, and payments</p>
                    </div>
                    <div className="flex gap-3">
                        <ExportButton
                            data={filteredBookings}
                            filename="bookings_export"
                            columns={exportColumns}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                placeholder="Search by user, business, or event..."
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
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                {eventTypes.map(type => (
                                    <option key={type} value={type}>{type === 'ALL' ? 'All Types' : type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Booking List */}
                    <div className="lg:col-span-2 space-y-4">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                                    <Skeleton variant="text" height="24px" width="60%" />
                                </div>
                            ))
                        ) : paginatedBookings.length === 0 ? (
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-12 text-center">
                                <Calendar className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No bookings found</h3>
                                <p className="text-[var(--text-secondary)]">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-[var(--bg-primary)]/50 border-b border-[var(--border)] text-xs uppercase text-[var(--text-secondary)] font-bold tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Booking</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border)]">
                                            {paginatedBookings.map((booking) => (
                                                <tr
                                                    key={booking.id}
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className={`hover:bg-[var(--bg-primary)]/50 transition-colors cursor-pointer group ${selectedBooking?.id === booking.id ? 'bg-[var(--bg-primary)]' : ''}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--text-secondary)]">
                                                                {booking.businessName?.[0] || booking.user?.name?.[0] || 'G'}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">
                                                                    {booking.businessName || booking.user?.name || 'Guest User'}
                                                                </div>
                                                                <div className="text-[10px] font-black uppercase text-[var(--accent-orange)] tracking-widest mt-0.5">
                                                                    {booking.event?.title || booking.stallType || 'General Request'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border tracking-wider ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            {new Date(booking.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <ChevronRight className={`w-5 h-5 ml-auto transition-transform ${selectedBooking?.id === booking.id ? 'translate-x-1 text-[var(--accent-orange)]' : 'text-[var(--text-secondary)]'}`} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    totalItems={totalItems}
                                    onPageChange={setCurrentPage}
                                    onPageSizeChange={setPageSize}
                                />
                            </div>
                        )}
                    </div>

                    {/* Details Sidebar */}
                    <div className="lg:col-span-1">
                        {selectedBooking ? (
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 sticky top-6 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Details</h2>
                                        <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">ID: {selectedBooking.id}</p>
                                    </div>
                                    <button onClick={() => setSelectedBooking(null)} className="p-1 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)]">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border tracking-wider ${getStatusColor(selectedBooking.status)}`}>
                                                {selectedBooking.status}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border tracking-wider ${getPaymentColor(selectedBooking.paymentStatus)}`}>
                                                {selectedBooking.paymentStatus}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-[var(--text-primary)]">{selectedBooking.event?.title || selectedBooking.stallType || 'Standard Booking'}</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-3">
                                            <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1">User</p>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{selectedBooking.user?.name || 'N/A'}</p>
                                        </div>
                                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-3">
                                            <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1">Email</p>
                                            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{selectedBooking.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {selectedBooking.businessName && (
                                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-3">
                                            <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1">Business</p>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{selectedBooking.businessName}</p>
                                        </div>
                                    )}

                                    {selectedBooking.requirements && (
                                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-3">
                                            <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1">Requirements</p>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">"{selectedBooking.requirements}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-3">
                                    {selectedBooking.status === 'PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}
                                                className="bg-green-500 hover:bg-green-600 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-green-500/20"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                                                className="bg-red-500 hover:bg-red-600 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-red-500/20"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedBooking.id, selectedBooking.status === 'CANCELLED' ? 'PENDING' : 'CANCELLED')}
                                            className="col-span-2 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-black uppercase text-[10px] tracking-widest py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
                                        >
                                            {selectedBooking.status === 'CANCELLED' ? 'Restore to Pending' : 'Revoke Booking'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-secondary)] border border-dashed border-[var(--border)] rounded-2xl p-12 text-center h-[200px] flex flex-col items-center justify-center">
                                <Filter className="w-8 h-8 text-[var(--text-secondary)] opacity-20 mb-3" />
                                <p className="text-sm text-[var(--text-secondary)] font-bold">Select a booking<br />to see details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BookingList;
