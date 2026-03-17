import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
    X, ArrowRight, ArrowLeft, Check,
    Building2, Phone, Mail, User as UserIcon,
    Trophy, Users, Calendar, MapPin
} from 'lucide-react';
import { useAnalytics } from './AnalyticsProvider';
import { api } from '../services/api';
import OTPModal from './OTPModal';

import { useFocusTrap } from '../hooks/useFocusTrap';

interface UniversalBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'TOURNAMENT' | 'SERVICE' | 'STALL';
    initialData?: any; // Event details, etc.
}

const UniversalBookingModal: React.FC<UniversalBookingModalProps> = ({ isOpen, onClose, mode, initialData }) => {
    const { trackEvent, trackFormSubmission } = useAnalytics();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const [formData, setFormData] = useState({
        // Common
        name: '', // Captain Name / Contact Person
        email: '',
        phone: '',

        // Tournament Specific
        teamName: '',
        squadSize: '',

        // Service Specific
        orgName: '', // Company/School Name
        serviceType: initialData?.title || '',
        date: initialData?.date || '',
    });

    const handleClose = () => {
        setStep(1);
        setIsSuccess(false);
        onClose();
    };

    // Integrated Focus Trapping
    useFocusTrap(modalRef, isOpen, handleClose);

    const hasPrefilled = useRef(false);

    useEffect(() => {
        if (isOpen) {
            // Focus close button on open
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);

            document.body.style.overflow = 'hidden';
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
            );
            // Pre-fill service type from selected card (never ask – type comes from card)
            if (initialData?.title) {
                setFormData(prev => ({
                    ...prev,
                    serviceType: initialData.title,
                    date: initialData.date || prev.date
                }));
            }
            if (initialData) hasPrefilled.current = true;
        } else {
            document.body.style.overflow = 'unset';
            hasPrefilled.current = false;
        }
    }, [isOpen, initialData]);

    const handleNext = () => {
        gsap.to(contentRef.current, {
            opacity: 0,
            x: -20,
            duration: 0.2,
            onComplete: () => {
                setStep(prev => prev + 1);
                gsap.fromTo(contentRef.current,
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
                );
            }
        });
    };

    const handleBack = () => {
        gsap.to(contentRef.current, {
            opacity: 0,
            x: 20,
            duration: 0.2,
            onComplete: () => {
                setStep(prev => prev - 1);
                gsap.fromTo(contentRef.current,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
                );
            }
        });
    };

    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleSendOtp = async () => {
        setIsSubmitting(true);
        try {
            // Determine purpose based on mode
            const purpose = mode === 'TOURNAMENT' ? 'tournament_registration' : 'service_inquiry';
            await api.otp.send(formData.email, purpose);
            setIsSubmitting(false);
            setShowOtpModal(true);
        } catch (error) {
            console.error('Failed to send OTP:', error);
            setIsSubmitting(false);
            alert('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyAndSubmit = async (otp: string): Promise<boolean> => {
        setIsSubmitting(true);
        try {
            const purpose = mode === 'TOURNAMENT' ? 'tournament_registration' : 'service_inquiry';
            const { success } = await api.otp.verify(formData.email, otp, purpose);

            if (success) {
                // Map to backend schema
                // businessName -> Team Name / Org Name
                // stallType -> Mode / Service Type
                // requirements -> Extra Details

                let businessName = '';
                let type = '';
                let requirements = '';

                if (mode === 'TOURNAMENT') {
                    businessName = formData.teamName;
                    type = 'TOURNAMENT';
                    requirements = `Captain: ${formData.name} | Squad: ${formData.squadSize} | Event: ${initialData?.title}`;
                } else if (mode === 'SERVICE') {
                    businessName = formData.orgName;
                    type = 'SERVICE';
                    requirements = `Service: ${initialData?.title} | Contact: ${formData.name}`;
                }

                if (mode === 'SERVICE') {
                    await api.submitEventBooking({
                        request_type: 'event_booking',
                        organization_name: (businessName || formData.name).trim(),
                        event_type: initialData?.title || formData.serviceType || 'Service',
                        email: formData.email.trim(),
                        phone_number: formData.phone?.trim() || '',
                        description: requirements,
                    });
                } else {
                    const bookingData = {
                        businessName,
                        stallType: type,
                        requirements,
                        contactPerson: formData.name,
                        phone: formData.phone,
                        email: formData.email,
                        eventId: (initialData?.id && initialData.id.length > 10) ? initialData.id : undefined
                    };
                    await api.createBooking(bookingData);
                }

                trackEvent(`submit_${mode.toLowerCase()}_booking`, {
                    category: type,
                    event: initialData?.title,
                });

                trackFormSubmission(`${mode} Booking`, true, {
                    category: type,
                    event: initialData?.title,
                });

                setShowOtpModal(false);
                setIsSubmitting(false);
                setIsSuccess(true);
                return true;
            }
            setIsSubmitting(false);
            return false;
        } catch (error) {
            console.error('Booking failed:', error);
            trackFormSubmission(`${mode} Booking`, false, { error: (error as Error).message });
            setIsSubmitting(false);
            alert('Failed to submit booking. Please try again.');
            return false;
        }
    };

    const handleResendOtp = async () => {
        const purpose = mode === 'TOURNAMENT' ? 'tournament_registration' : 'service_inquiry';
        await api.otp.send(formData.email, purpose);
    };

    if (!isOpen) return null;

    // render content based on mode
    const renderModeContent = () => {
        if (mode === 'TOURNAMENT') {
            return (
                <>
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-2 block">Step 01 / 02</span>
                                <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Team <span className="text-gradient">Details.</span></h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Team Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                        placeholder="e.g. Hyderabad Punks"
                                        value={formData.teamName}
                                        onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Squad Size</label>
                                    <select
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                        value={formData.squadSize}
                                        onChange={e => setFormData({ ...formData, squadSize: e.target.value })}
                                    >
                                        <option value="">Select Size</option>
                                        <option value="Individual">Individual</option>
                                        <option value="5-10">5-10 Players</option>
                                        <option value="11-15">11-15 Players</option>
                                        <option value="15+">15+ Players</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleNext}
                                aria-label="Next Step"
                                disabled={!formData.teamName || !formData.squadSize}
                                className="w-full btn-primary mt-4"
                            >
                                Next Step
                            </button>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-2 block">Step 02 / 02</span>
                                <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Captain <span className="text-gradient">Contact.</span></h2>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Captain's Name"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={handleBack} className="px-6 py-4 rounded-full border border-[var(--border)] text-[var(--text-primary)] font-bold hover:bg-[var(--bg-primary)]">Back</button>
                                <button
                                    onClick={handleSendOtp}
                                    aria-label={isSubmitting ? 'Sending OTP...' : 'Verify & Register'}
                                    disabled={!formData.name || !formData.phone || isSubmitting}
                                    className="flex-1 btn-primary"
                                >
                                    {isSubmitting ? 'Sending OTP...' : 'Verify & Register'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            );
        }

        if (mode === 'SERVICE') {
            const serviceTitle = initialData?.title || formData.serviceType || 'General Inquiry';
            const canSubmit = formData.orgName?.trim() && formData.name?.trim() && formData.phone?.trim() && formData.email?.trim();
            return (
                <div className="space-y-6">
                    {initialData?.title && (
                        <p className="text-sm text-[var(--accent-orange)] font-bold uppercase tracking-wider mb-2">
                            Booking: {initialData.title}
                        </p>
                    )}
                    <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Book <span className="text-gradient">this event</span></h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Organization / School Name</label>
                            <input
                                type="text"
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                placeholder="e.g. Greenwood High"
                                value={formData.orgName}
                                onChange={e => setFormData({ ...formData, orgName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Event / service type (from your selection)</label>
                            <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] font-bold opacity-90">
                                {serviceTitle}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Contact Person Name</label>
                            <input
                                type="text"
                                placeholder="Contact Person Name"
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Email (for OTP)</label>
                                <input
                                    type="email"
                                    placeholder="Official Email"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] font-bold focus:border-[var(--accent-orange)] focus:outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSendOtp}
                        disabled={!canSubmit || isSubmitting}
                        className="w-full btn-primary py-4 mt-2"
                    >
                        {isSubmitting ? 'Sending OTP...' : 'Verify & Submit'}
                    </button>
                </div>
            );
        }

        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* ... existing wrapper ... */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={handleClose}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
                {/* ... existing close button ... */}
                <button
                    ref={closeButtonRef}
                    onClick={handleClose}
                    aria-label="Close modal"
                    className="absolute top-6 right-6 p-2 bg-[var(--bg-primary)] rounded-full hover:bg-[var(--accent-orange)]/10 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-[var(--text-primary)]" />
                </button>

                <div className="p-8 md:p-12">
                    {/* ... success state ... */}
                    {isSuccess ? (
                        <div className="text-center py-12 success-animation">
                            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                                <Check className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-4">
                                {mode === 'TOURNAMENT' ? 'Registration Complete!' : 'Inquiry Sent!'}
                            </h2>
                            <p className="text-[var(--text-secondary)] font-medium max-w-sm mx-auto mb-10">
                                {mode === 'TOURNAMENT'
                                    ? 'Your team slot is reserved provisionally. We will contact the captain shortly.'
                                    : 'Our team will review your requirements and get back to you within 24 hours.'}
                            </p>
                            <button
                                onClick={handleClose}
                                className="btn-primary px-12"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div ref={contentRef}>
                            {renderModeContent()}
                        </div>
                    )}
                </div>
            </div>

            <OTPModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                email={formData.email}
                onVerify={handleVerifyAndSubmit}
                onResend={handleResendOtp}
            />
        </div>
    );
};

export default UniversalBookingModal;
