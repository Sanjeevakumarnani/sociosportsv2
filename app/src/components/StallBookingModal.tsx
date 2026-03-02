import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
    X,
    ArrowRight,
    ArrowLeft,
    Check,
    Store,
    Zap,
    Users,
    Shield,
    Package,
    Layout,
    Calendar,
    Building2,
    Phone,
    Mail,
    User as UserIcon,
    ShoppingBag,
    Wifi,
    Info,
    Box,
    Sun
} from 'lucide-react';
import { useAnalytics } from './AnalyticsProvider';
import { api } from '../services/api';
import OTPModal from './OTPModal';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface StallBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StallBookingModal: React.FC<StallBookingModalProps> = ({ isOpen, onClose }) => {
    const { trackEvent } = useAnalytics();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const [formData, setFormData] = useState({
        category: '',
        event: '',
        size: '10x10',
        powerRequired: false,
        furniture: false,
        wifi: false,
        branding: false,
        storage: false,
        lighting: false,
        businessName: '',
        contactPerson: '',
        phone: '',
        email: ''
    });

    useFocusTrap(modalRef, isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            // Animation
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
            // State reset moved to open block to avoid updates on close/unmount
        }
    }, [isOpen]);

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
            await api.otp.send(formData.email, 'vendor_registration');
            setIsSubmitting(false);
            setShowOtpModal(true);
        } catch (error) {
            console.error('Failed to send OTP:', error);
            setIsSubmitting(false);
            alert('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyAndSubmit = async (otp: string): Promise<boolean> => {
        try {
            const { success } = await api.otp.verify(formData.email, otp, 'vendor_registration');
            if (success) {
                // Determine stall type enum based on category string
                // Map 'retail' -> 'VENDOR_REGISTRATION', etc. Or just pass it as business category
                // Backend expects specific stallTypes? 
                // The backend controller allowed 'VENDOR_REGISTRATION' logic.
                // We will use 'VENDOR_REGISTRATION' as the main type for the email logic, 
                // but keep the specific category in the booking details.

                const bookingData = {
                    businessName: formData.businessName,
                    stallType: 'VENDOR_REGISTRATION', // Using generic type for email logic
                    requirements: `Category: ${formData.category} | Event: ${formData.event} | Size: ${formData.size}FT | Power: ${formData.powerRequired ? 'YES' : 'NO'} | Furniture: ${formData.furniture ? 'YES' : 'NO'} | WiFi: ${formData.wifi ? 'YES' : 'NO'} | Branding: ${formData.branding ? 'YES' : 'NO'}`,
                    contactPerson: formData.contactPerson,
                    phone: formData.phone,
                    email: formData.email,
                };

                await api.createBooking(bookingData);

                trackEvent('submit_stall_booking', {
                    category: formData.category,
                    event: formData.event,
                    size: formData.size,
                    businessName: formData.businessName
                });

                setShowOtpModal(false);
                setIsSubmitting(false);
                setIsSuccess(true);
                gsap.from('.success-animation', {
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Booking failed:', error);
            return false;
        }
    };

    const handleResendOtp = async () => {
        await api.otp.send(formData.email, 'vendor_registration');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    aria-label="Close booking modal"
                    className="absolute top-6 right-6 p-2 bg-[var(--bg-primary)] rounded-full hover:bg-[var(--accent-orange)]/10 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-[var(--text-primary)]" />
                </button>

                {/* Progress Bar */}
                {!isSuccess && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--border)]">
                        <div
                            className="h-full bg-[var(--accent-orange)] transition-all duration-500 ease-out"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                )}

                <div className="p-8 md:p-12">
                    {isSuccess ? (
                        <div className="text-center py-12 success-animation">
                            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                                <Check className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-4">Application Received!</h2>
                            <p className="text-[var(--text-secondary)] font-medium max-w-sm mx-auto mb-10">
                                Our partnership team will review your business profile and contact you within 24 hours with event allotments.
                            </p>
                            <button
                                onClick={onClose}
                                className="btn-primary px-12"
                            >
                                Return to Marketplace
                            </button>
                        </div>
                    ) : (
                        <div ref={contentRef}>
                            {/* Step 1: Category Selection */}
                            {step === 1 && (
                                <div className="space-y-8">
                                    <div>
                                        <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-2 block">Step 01 / 04</span>
                                        <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Choose your <span className="text-gradient">Space Type.</span></h2>
                                    </div>
                                    <div className="grid gap-4">
                                        {[
                                            { id: 'retail', title: 'Retail Pop-up', desc: 'Sports gear, apparel & equipment.', icon: ShoppingBag },
                                            { id: 'nutrition', title: 'Nutrition Hub', desc: 'Energy drinks, snacks & supplements.', icon: Zap },
                                            { id: 'recovery', title: 'Recovery Tech', desc: 'Physio, massage & wellness devices.', icon: Shield },
                                        ].map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => { setFormData({ ...formData, category: cat.id }); handleNext(); }}
                                                className={`p-6 rounded-3xl border text-left transition-all flex items-center gap-6 group ${formData.category === cat.id
                                                    ? 'bg-[var(--accent-orange)]/10 border-[var(--accent-orange)]'
                                                    : 'bg-[var(--bg-primary)] border-[var(--border)] hover:border-[var(--accent-orange)]/50'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.category === cat.id ? 'bg-[var(--accent-orange)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                                                    }`}>
                                                    <cat.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-[var(--text-primary)] uppercase tracking-tight">{cat.title}</h4>
                                                    <p className="text-xs text-[var(--text-secondary)] font-medium">{cat.desc}</p>
                                                </div>
                                                <ArrowRight className={`ml-auto w-5 h-5 transition-transform ${formData.category === cat.id ? 'text-[var(--accent-orange)] translate-x-1' : 'text-[var(--text-secondary)]/50'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Event Selection */}
                            {step === 2 && (
                                <div className="space-y-8">
                                    <div>
                                        <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-2 block">Step 02 / 04</span>
                                        <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Locate the <span className="text-gradient">Action.</span></h2>
                                    </div>
                                    <div className="grid gap-3">
                                        {[
                                            { id: 'hyd', city: 'Hyderabad', event: 'SOW Hyderabad Open', date: 'Aug 21-22' },
                                            { id: 'pune', city: 'Pune', event: 'Basketball Regional Jam', date: 'Aug 23-24' },
                                            { id: 'blr', city: 'Bangalore', event: 'Tennis Masters League', date: 'Sept 01-02' },
                                            { id: 'chn', city: 'Chennai', event: 'Cricket Premier League', date: 'Sept 15-18' },
                                        ].map((evt) => (
                                            <button
                                                key={evt.id}
                                                onClick={() => setFormData({ ...formData, event: evt.id })}
                                                className={`p-5 rounded-2xl border text-left transition-all flex justify-between items-center ${formData.event === evt.id
                                                    ? 'bg-[var(--accent-orange)]/10 border-[var(--accent-orange)]'
                                                    : 'bg-[var(--bg-primary)] border-[var(--border)] hover:border-[var(--accent-orange)]/50'
                                                    }`}
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black uppercase text-[var(--accent-orange)]">{evt.city}</span>
                                                        <span className="text-[10px] font-bold text-[var(--text-secondary)]/50">•</span>
                                                        <span className="text-[10px] font-black uppercase text-[var(--text-secondary)]">{evt.date}</span>
                                                    </div>
                                                    <h4 className="font-black text-[var(--text-primary)] uppercase tracking-tight">{evt.event}</h4>
                                                </div>
                                                {formData.event === evt.id && <Check className="w-5 h-5 text-[var(--accent-orange)]" />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button onClick={handleBack} className="px-8 py-4 rounded-full border border-[var(--border)] text-[var(--text-primary)] font-bold text-sm uppercase flex items-center gap-2 hover:bg-[var(--bg-primary)] transition-all">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <button
                                            disabled={!formData.event}
                                            onClick={handleNext}
                                            className="flex-1 btn-primary"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Configuration */}
                            {step === 3 && (
                                <div className="space-y-8">
                                    <div>
                                        <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-2 block">Step 03 / 04</span>
                                        <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Configure <span className="text-gradient">Stall.</span></h2>
                                    </div>

                                    <div className="grid gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3 block">Base Dimensions</label>
                                            <div className="grid grid-cols-5 gap-2">
                                                {['6x6', '10x10', '10x20', '20x20', 'Custom'].map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setFormData({ ...formData, size })}
                                                        className={`py-3 rounded-xl border text-[10px] font-black transition-all ${formData.size === size
                                                            ? 'bg-[var(--accent-orange)] border-[var(--accent-orange)] text-white'
                                                            : 'bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-orange)]/50'
                                                            }`}
                                                    >
                                                        {size} {size !== 'Custom' ? 'FT' : ''}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3 block">Requirements</label>
                                            {[
                                                { id: 'powerRequired', label: 'Power Supply (5-15A)', icon: Zap },
                                                { id: 'furniture', label: 'Furniture Kit (Tables/Chairs)', icon: Layout },
                                                { id: 'wifi', label: 'High-Speed WiFi', icon: Wifi },
                                                { id: 'branding', label: 'Custom Fascia Branding', icon: Info },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setFormData(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof prev] }))}
                                                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${formData[opt.id as keyof typeof formData] === true
                                                        ? 'bg-[var(--bg-primary)] border-[var(--accent-orange)]'
                                                        : 'bg-[var(--bg-primary)] border-[var(--border)] opacity-60'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <opt.icon className="w-5 h-5 text-[var(--accent-orange)]" />
                                                        <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-tight">{opt.label}</span>
                                                    </div>
                                                    <div className={`w-10 h-6 rounded-full transition-all relative ${formData[opt.id as keyof typeof formData] ? 'bg-green-500' : 'bg-[var(--bg-secondary)]'}`}>
                                                        <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm bg-white transition-all ${formData[opt.id as keyof typeof formData] ? 'left-5' : 'left-1'}`} />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button onClick={handleBack} className="px-8 py-4 rounded-full border border-[var(--border)] text-[var(--text-primary)] font-bold text-sm uppercase flex items-center gap-2 hover:bg-[var(--bg-primary)] transition-all">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <button onClick={handleNext} className="flex-1 btn-primary">
                                            Contact Details
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Business Details */}
                            {step === 4 && (
                                <div className="space-y-8">
                                    <div>
                                        <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-2 block">Step 04 / 04</span>
                                        <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Business <span className="text-gradient">Identity.</span></h2>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Business Name"
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)]"
                                                value={formData.businessName}
                                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors">
                                                    <UserIcon className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Contact Person"
                                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)]"
                                                    value={formData.contactPerson}
                                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    placeholder="Mobile Number"
                                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)]"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="Business Email"
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)]"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                                        <Shield className="w-6 h-6 text-blue-400 shrink-0" />
                                        <p className="text-[10px] text-blue-200/60 font-medium leading-relaxed uppercase tracking-wider">
                                            By clicking submit, you agree to our Vendor Terms of Service and Event Conduct Policy. All stall bookings are subject to approval.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button onClick={handleBack} className="px-8 py-4 rounded-full border border-[var(--border)] text-[var(--text-primary)] font-bold text-sm uppercase flex items-center gap-2 hover:bg-[var(--bg-primary)] transition-all">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <button
                                            disabled={!formData.businessName || !formData.phone || isSubmitting}
                                            onClick={handleSendOtp}
                                            className="flex-1 btn-primary disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Sending OTP...' : 'Verify & Submit'}
                                        </button>
                                    </div>
                                </div>
                            )}
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

export default StallBookingModal;
