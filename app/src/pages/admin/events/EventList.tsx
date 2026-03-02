import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Calendar,
    MapPin,
    Users,
    Edit,
    Trash2,
    Clock,
    Image as ImageIcon,
    ChevronRight
} from 'lucide-react';
import { api } from '../../../services/api';
import AdminLayout from '../../../layouts/AdminLayout';
import EventForm from './EventForm';
import Pagination from '../../../components/admin/Pagination';
import ExportButton from '../../../components/admin/ExportButton';
import Skeleton from '../../../components/Skeleton';
import toast from 'react-hot-toast';

const EventList = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await api.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreate = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (event: any) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete event "${title}"?`)) return;

        const token = localStorage.getItem('adminToken');
        if (token) {
            try {
                await api.deleteEvent(id, token);
                toast.success('Event deleted successfully');
                fetchEvents();
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to delete event.');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'upcoming': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'ongoing': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'completed': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    // Filter logic
    const filteredEvents = events.filter(event => {
        const matchesSearch =
            event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.type?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'ALL' || event.type === filterType;

        return matchesSearch && matchesType;
    });

    // Pagination logic
    const totalItems = filteredEvents.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Columns for export
    const exportColumns = [
        { key: 'title', header: 'Title' },
        { key: 'type', header: 'Type' },
        { key: 'date', header: 'Date' },
        { key: 'location', header: 'Location' },
        { key: 'status', header: 'Status' }
    ];

    const eventTypes = ['ALL', 'Training', 'Tournament', 'Workshop', 'Meetup'];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Event Management</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Create and manage your tournaments, training sessions, and workshops</p>
                    </div>
                    <div className="flex gap-3">
                        <ExportButton
                            data={filteredEvents}
                            filename="events_export"
                            columns={exportColumns}
                        />
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 bg-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[var(--accent-orange)]/20"
                        >
                            <Plus className="w-5 h-5" />
                            Create Event
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search events..."
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
                            {eventTypes.map(type => (
                                <option key={type} value={type}>{type === 'ALL' ? 'All Types' : type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Event List */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--bg-primary)]/50 border-b border-[var(--border)] text-xs uppercase text-[var(--text-secondary)] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={5} className="px-6 py-4">
                                                <Skeleton variant="text" height="40px" width="100%" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                            No events found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedEvents.map((event) => (
                                        <tr key={event.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] overflow-hidden border border-[var(--border)] flex-shrink-0">
                                                        {event.image ? (
                                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                                                                <ImageIcon className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-orange)] transition-colors">{event.title}</div>
                                                        <div className="text-[10px] font-black uppercase text-[var(--accent-orange)] tracking-widest">{event.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </div>
                                                    {event.time && (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Clock className="w-3 h-3" />
                                                            {event.time}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                    <MapPin className="w-4 h-4 text-[var(--accent-orange)]" />
                                                    <span className="truncate max-w-[150px]">{event.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border tracking-wider ${getStatusColor(event.status || 'upcoming')}`}>
                                                    {event.status || 'Upcoming'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-[var(--text-secondary)]">
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="p-2 hover:bg-[var(--bg-primary)] rounded-lg hover:text-[var(--accent-orange)] transition-colors"
                                                        title="Edit Event"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event.id, event.title)}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg hover:text-red-500 transition-colors"
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
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

                {/* Modal */}
                {isModalOpen && (
                    <EventForm
                        event={editingEvent}
                        onClose={() => setIsModalOpen(false)}
                        onSave={fetchEvents}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default EventList;
