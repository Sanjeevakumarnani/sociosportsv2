import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, Plus, ShoppingBag, Trash2, Edit2, Star, Filter, X } from 'lucide-react';
import { api } from '../../services/api';

const VendorsAdmin = () => {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const data = await api.getVendors();
            setVendors(data);
        } catch (error) {
            console.error('Failed to fetch vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this vendor?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            await api.deleteVendor(id, token);
            fetchVendors();
        } catch (error) {
            console.error('Failed to delete vendor:', error);
            alert('Failed to delete vendor');
        }
    };

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        category: 'Nutrition',
        owner: '',
        contactEmail: '',
        contactPhone: '',
        location: '',
        description: ''
    });

    const handleEdit = (vendor: any) => {
        setEditingVendor(vendor);
        setFormData({
            businessName: vendor.businessName || '',
            category: vendor.category || 'Nutrition',
            owner: vendor.owner || '',
            contactEmail: vendor.contactEmail || '',
            contactPhone: vendor.contactPhone || '',
            location: vendor.location || '',
            description: vendor.description || ''
        });
        setIsAddModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                alert('Authentication error');
                return;
            }

            if (editingVendor) {
                await api.updateVendor(editingVendor.id, formData, token);
            } else {
                await api.createVendor(formData, token);
            }

            setIsAddModalOpen(false);
            setEditingVendor(null);
            setFormData({
                businessName: '',
                category: 'Nutrition',
                owner: '',
                contactEmail: '',
                contactPhone: '',
                location: '',
                description: ''
            });
            fetchVendors();
        } catch (error) {
            console.error('Failed to save vendor:', error);
            alert('Failed to save vendor');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Vendor Partners</h1>
                        <p className="text-[var(--text-secondary)]">Manage marketplace vendors and stall bookings.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Vendor
                    </button>
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[32px] overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)] flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-full py-2.5 pl-12 pr-4 text-sm outline-none focus:border-[var(--accent-orange)]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Business</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Category</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Owner</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Rating</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Status</th>
                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-8 text-center"><img src="/favicon.png" alt="Loading..." className="w-16 h-16 animate-spin mx-auto" /></td></tr>
                                ) : vendors.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-[var(--text-secondary)]">No vendors found.</td></tr>
                                ) : vendors.map(vendor => (
                                    <tr key={vendor.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                        <td className="px-8 py-4 font-bold text-[var(--text-primary)] flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--accent-orange)]/10 flex items-center justify-center text-[var(--accent-orange)]">
                                                <ShoppingBag className="w-4 h-4" />
                                            </div>
                                            {vendor.businessName}
                                        </td>
                                        <td className="px-8 py-4 text-sm text-[var(--text-secondary)]">{vendor.category}</td>
                                        <td className="px-8 py-4 text-sm text-[var(--text-primary)]">{vendor.owner}</td>
                                        <td className="px-8 py-4 text-sm flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                            <span className="font-bold">{vendor.rating || 'N/A'}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${vendor.status === 'Active'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(vendor)} className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-blue-500 transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(vendor.id)} className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Vendor Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[var(--bg-secondary)] w-full max-w-lg rounded-3xl border border-[var(--border)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                            <h2 className="text-xl font-black text-[var(--text-primary)]">{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setEditingVendor(null);
                                }}
                                className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors text-[var(--text-secondary)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Business Name</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Category</label>
                                    <select
                                        name="category"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Nutrition">Nutrition</option>
                                        <option value="Equipment">Equipment</option>
                                        <option value="Merchandise">Merchandise</option>
                                        <option value="Physiotherapy">Physiotherapy</option>
                                        <option value="Training">Training</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Owner Name</label>
                                <input
                                    type="text"
                                    name="owner"
                                    required
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none"
                                    value={formData.owner}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none h-24 resize-none"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 btn-primary py-3 rounded-xl font-bold flex justify-center items-center"
                                >
                                    {isSubmitting ? (
                                        <img src="/favicon.png" alt="Loading..." className="w-5 h-5 animate-spin" />
                                    ) : (
                                        editingVendor ? 'Update Vendor' : 'Create Vendor'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default VendorsAdmin;
