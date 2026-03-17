import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Check, Building2, Phone, Mail, User as UserIcon } from 'lucide-react';
import { useAnalytics } from './AnalyticsProvider';
import { api } from '../services/api';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface StallBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** When opened from a specific stall card, pass the stall type name (e.g. "Retail Pop-up"). Backend differentiates by this. */
    initialStallType?: string;
}

const StallBookingModal: React.FC<StallBookingModalProps> = ({ isOpen, onClose, initialStallType }) => {
    const { trackEvent } = useAnalytics();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const [formData, setFormData] = useState({
        organization_name: '',
        email: '',
        phone_number: '',
        description: '',
    });

    useFocusTrap(modalRef, isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setFormData({ organization_name: '', email: '', phone_number: '', description: '' });
            setIsSuccess(false);
            gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
            setTimeout(() => closeButtonRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const stallType = initialStallType || 'General stall';
        try {
            await api.submitStallBooking({
                request_type: 'stall_booking',
                stall_type: stallType,
                organization_name: formData.organization_name.trim(),
                email: formData.email.trim(),
                phone_number: formData.phone_number.trim(),
                description: formData.description.trim(),
            });
            trackEvent('stall_booking_submitted', { stall_type: stallType });
            setIsSuccess(true);
        } catch (err) {
            console.error('Stall booking failed', err);
            trackEvent('stall_booking_error', { stall_type: stallType });
            alert('Something went wrong. Please try again or contact support.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="stall-booking-title"
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--accent-orange)] hover:border-transparent hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 md:p-10">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                <Check className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 id="stall-booking-title" className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-3">
                                Request received
                            </h2>
                            <p className="text-[var(--text-secondary)] font-medium text-sm max-w-sm mx-auto mb-8">
                                Our team will get back to you shortly with stall availability and next steps.
                            </p>
                            <button type="button" onClick={onClose} className="btn-primary px-10 py-3 rounded-full text-sm font-black uppercase">
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 id="stall-booking-title" className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-1">
                                Book a stall
                            </h2>
                            {initialStallType && (
                                <p className="text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest mb-6">
                                    Stall type: {initialStallType}
                                </p>
                            )}
                            {!initialStallType && <p className="text-[var(--text-secondary)] text-sm font-medium mb-6">Submit your details and we’ll get in touch.</p>}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Organization / Business name"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-3.5 pl-12 pr-4 text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--accent-orange)]/50 placeholder:text-[var(--text-secondary)]"
                                        value={formData.organization_name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, organization_name: e.target.value }))}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-3.5 pl-12 pr-4 text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--accent-orange)]/50 placeholder:text-[var(--text-secondary)]"
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-3.5 pl-12 pr-4 text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--accent-orange)]/50 placeholder:text-[var(--text-secondary)]"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-4 text-[var(--text-secondary)]">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <textarea
                                        placeholder="Message (event preference, requirements, etc.)"
                                        rows={3}
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-3.5 pl-12 pr-4 text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--accent-orange)]/50 placeholder:text-[var(--text-secondary)] resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-4 rounded-2xl text-sm font-black uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting…' : 'Submit request'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StallBookingModal;
