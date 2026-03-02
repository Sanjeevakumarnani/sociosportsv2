import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Check } from 'lucide-react';
import { api } from '../services/api';
import OTPModal from './OTPModal';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CoachRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CoachRegistrationModal: React.FC<CoachRegistrationModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        sport: '',
        experience: 'Less than 1 year',
        certification: 'None'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleClose = () => {
        setFormData({
            name: '', email: '', phone: '', sport: '', experience: 'Less than 1 year', certification: 'None'
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
            await api.otp.send(formData.email, 'coach_registration');
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
            const { success } = await api.otp.verify(formData.email, otp, 'coach_registration');
            if (success) {
                await api.createBooking({
                    businessName: 'Individual Coach',
                    stallType: 'COACH_REGISTRATION',
                    requirements: `Sport: ${formData.sport} | Exp: ${formData.experience} | Cert: ${formData.certification}`,
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
        await api.otp.send(formData.email, 'coach_registration');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />
            <div ref={modalRef} className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-white/10 rounded-2xl shadow-2xl p-6 lg:p-8 overflow-hidden">
                <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>

                {isSuccess ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Application Received</h2>
                        <p className="text-[var(--text-secondary)] mb-6">We'll review your profile and get back to you.</p>
                        <button onClick={handleClose} className="btn-primary w-full">Done</button>
                    </div>
                ) : (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Join as Coach</h2>
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
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Sport</label>
                            <select
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                value={formData.sport}
                                onChange={e => setFormData({ ...formData, sport: e.target.value })}
                            >
                                <option value="">Select Sport</option>
                                <option value="Badminton">Badminton</option>
                                <option value="Tennis">Tennis</option>
                                <option value="Cricket">Cricket</option>
                                <option value="Football">Football</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Swimming">Swimming</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full btn-primary mt-4">
                            {isSubmitting ? 'Sending OTP...' : 'Submit Application'}
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

export default CoachRegistrationModal;
