import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Type, Image as ImageIcon } from 'lucide-react';
import { api } from '../../../services/api';
import ImageUpload from '../../../components/common/ImageUpload';

interface EventFormProps {
    event?: any;
    onClose: () => void;
    onSave: () => void;
}

const EventForm = ({ event, onClose, onSave }: EventFormProps) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        description: event?.description || '',
        date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event?.location || '',
        type: event?.type || 'Tournament',
        price: event?.price || '',
        image: event?.image || ''
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            if (event) {
                await api.updateEvent(event.id, {
                    ...formData,
                    date: new Date(formData.date).toISOString()
                }, token);
            } else {
                await api.createEvent({
                    ...formData,
                    date: new Date(formData.date).toISOString()
                }, token);
            }
            onSave();
            onClose();
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Failed to save event');
            if (error.message && (error.message.includes('token') || error.message.includes('Forbidden') || error.message.includes('Access'))) {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin';
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[var(--bg-secondary)] rounded-2xl w-full max-w-lg border border-[var(--border)] overflow-hidden my-auto">
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        {event ? 'Edit Event' : 'Create New Event'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Event Title</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg py-2.5 pl-10 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g. Summer Cricket League"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Date & Time</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg py-2.5 pl-10 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg py-2.5 px-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option>Tournament</option>
                                <option>Training</option>
                                <option>Workshop</option>
                                <option>Webinar</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg py-2.5 px-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => handleChange(e as any)}
                            rows={3}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg py-2.5 px-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] resize-none"
                            placeholder="Event details..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg py-2.5 pl-10 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                placeholder="e.g. Hyderabad Sports Complex"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ImageUpload
                            label="Event Image"
                            value={formData.image}
                            onChange={(url: string) => {
                                console.log('EventForm received URL:', url);
                                setFormData({ ...formData, image: url });
                            }}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[var(--accent-orange)] rounded-lg text-white font-bold hover:bg-orange-600 transition-colors"
                        >
                            {event ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
