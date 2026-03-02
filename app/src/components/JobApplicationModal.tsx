import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Check } from 'lucide-react';
import { api } from '../services/api';
import OTPModal from './OTPModal';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface JobApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobTitle?: string;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ isOpen, onClose, jobTitle }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleClose = () => {
        setFormData({
            name: '', email: '', phone: '', linkedin: '', portfolio: ''
        });
        setIsSuccess(false);
        onClose();
    };

    useFocusTrap(modalRef, isOpen, handleClose);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
            );

            // Focus close button on open
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.otp.send(formData.email, 'job_application');
            setIsSubmitting(false);
            setShowOtpModal(true);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            alert('Failed to send OTP.');
        }
    };

    const handleVerifyAndSubmit = async (otp: string): Promise<boolean> => {
        try {
            const { success } = await api.otp.verify(formData.email, otp, 'job_application');
            if (success) {
                await api.createBooking({
                    businessName: formData.name, // Using Name as Business Name for generic booking schema
                    stallType: 'JOB_APPLICATION',
                    requirements: `Role: ${jobTitle || 'General Application'} | LinkedIn: ${formData.linkedin} | Portfolio: ${formData.portfolio}`,
                    contactPerson: formData.name,
                    phone: formData.phone,
                    email: formData.email
                });

                setShowOtpModal(false);
                setIsSubmitting(false);
                setIsSuccess(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleResendOtp = async () => {
        await api.otp.send(formData.email, 'job_application');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />
            <div ref={modalRef} className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-white/10 rounded-2xl shadow-2xl p-6 lg:p-8 overflow-hidden">
                <button
                    ref={closeButtonRef}
                    onClick={handleClose}
                    aria-label="Close application modal"
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>

                {isSuccess ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Application Sent</h2>
                        <p className="text-[var(--text-secondary)] mb-6">HR will review your profile and contact you.</p>
                        <button onClick={handleClose} className="btn-primary w-full">Done</button>
                    </div>
                ) : (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Apply Now</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">Applying for: <span className="text-[var(--accent-orange)] font-bold">{jobTitle || 'Open Position'}</span></p>

                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Phone</label>
                            <input
                                type="tel"
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">LinkedIn / Profile URL</label>
                            <input
                                type="url"
                                required
                                placeholder="https://linkedin.com/in/..."
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                value={formData.linkedin}
                                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                            />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full btn-primary mt-4">
                            {isSubmitting ? 'Sending OTP...' : 'Verify & Apply'}
                        </button>
                    </form>
                )}
                <OTPModal
                    isOpen={showOtpModal}
                    onClose={() => setShowOtpModal(false)}
                    email={formData.email}
                    onVerify={handleVerifyAndSubmit}
                    onResend={handleResendOtp}
                />
            </div>
        </div>
    );
};

export default JobApplicationModal;
