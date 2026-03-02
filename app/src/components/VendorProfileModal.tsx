import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
    X,
    MapPin,
    Phone,
    Mail,
    Star,
    Globe,
    ShieldCheck,
    Tag
} from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export interface Vendor {
    id: string;
    name: string;
    category: string;
    description?: string;
    location?: string;
    contactPhone?: string;
    contactEmail?: string;
    rating?: number;
    image?: string;
    products?: Array<{
        name: string;
        price: number;
    }>;
}

interface VendorProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendor: Vendor | null;
}

const VendorProfileModal: React.FC<VendorProfileModalProps> = ({ isOpen, onClose, vendor }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useFocusTrap(modalRef, isOpen, onClose);

    useEffect(() => {
        if (isOpen && vendor) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.95, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );

            // Stagger animation for content
            gsap.fromTo('.vendor-modal-content',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2 }
            );

            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, vendor]);

    if (!isOpen || !vendor) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-3xl bg-[var(--bg-secondary)] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-[var(--accent-orange)] hover:text-white transition-colors z-20 text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Hero / Cover */}
                <div className="h-48 relative shrink-0 overflow-hidden">
                    {vendor.image ? (
                        <div className="absolute inset-0">
                            <img
                                src={vendor.image}
                                alt={vendor.name}
                                className="w-full h-full object-cover opacity-60 blur-sm scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange)]/20 to-[var(--bg-primary)]" />
                    )}

                    <div className="absolute bottom-6 left-8 z-10 flex items-end gap-6 vendor-modal-content">
                        <div className="w-24 h-24 rounded-2xl bg-[var(--bg-primary)] border-4 border-[var(--bg-secondary)] shadow-xl overflow-hidden shrink-0">
                            <img
                                src={vendor.image || '/images/vendor_default.png'}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800' }}
                                alt={vendor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-orange)] text-white text-[10px] font-black uppercase tracking-widest">
                                    {vendor.category}
                                </span>
                                <div className="flex items-center gap-1 text-[var(--accent-orange)]">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-bold">{vendor.rating || '4.5'}</span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter shadow-black drop-shadow-lg">
                                {vendor.name}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">

                            {/* About */}
                            <div className="vendor-modal-content">
                                <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[var(--accent-orange)]" />
                                    About Partner
                                </h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed font-medium text-sm">
                                    {vendor.description || `${vendor.name} is a verified partner of SocioSports, providing premium ${vendor.category?.toLowerCase() || 'service'} solutions to our athletic community. Committed to quality and performance.`}
                                </p>
                            </div>

                            {/* Products / Services */}
                            <div className="vendor-modal-content">
                                <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[var(--accent-orange)]" />
                                    Key Offerings
                                </h3>

                                {vendor.products && vendor.products.length > 0 ? (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {vendor.products.map((prod, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex justify-between items-center group hover:border-[var(--accent-orange)]/30 transition-colors">
                                                <span className="font-bold text-[var(--text-primary)] text-sm">{prod.name}</span>
                                                <span className="font-black text-[var(--accent-orange)] text-xs">₹{prod.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-center">
                                        <p className="text-xs text-[var(--text-secondary)] font-medium italic">
                                            Contact vendor for full catalog and pricing.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="md:col-span-1 space-y-6 vendor-modal-content">
                            <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] space-y-4">
                                <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest mb-4 border-b border-[var(--border)] pb-2">
                                    Contact Info
                                </h3>

                                <div className="space-y-4">
                                    {vendor.location && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-[var(--accent-orange)] mt-0.5 shrink-0" />
                                            <div>
                                                <span className="block text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wide">Location</span>
                                                <span className="text-xs text-[var(--text-primary)] font-medium">{vendor.location}</span>
                                            </div>
                                        </div>
                                    )}

                                    {vendor.contactEmail && (
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-4 h-4 text-[var(--accent-orange)] mt-0.5 shrink-0" />
                                            <div>
                                                <span className="block text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wide">Email</span>
                                                <a href={`mailto:${vendor.contactEmail}`} className="text-xs text-[var(--text-primary)] font-medium hover:text-[var(--accent-orange)] transition-colors break-all">
                                                    {vendor.contactEmail}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {vendor.contactPhone && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-[var(--accent-orange)] mt-0.5 shrink-0" />
                                            <div>
                                                <span className="block text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wide">Phone</span>
                                                <a href={`tel:${vendor.contactPhone}`} className="text-xs text-[var(--text-primary)] font-medium hover:text-[var(--accent-orange)] transition-colors">
                                                    {vendor.contactPhone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <Globe className="w-4 h-4 text-[var(--accent-orange)] mt-0.5 shrink-0" />
                                        <div>
                                            <span className="block text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wide">Verification</span>
                                            <span className="inline-flex items-center gap-1 text-[10px] text-green-500 font-black uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded">
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full btn-primary py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-orange)]/20">
                                Contact Partner
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorProfileModal;
