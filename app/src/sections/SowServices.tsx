import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, Briefcase, School, Users, Check, ArrowRight, Star, X, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

interface Service {
    id: string;
    icon: any;
    badge: string;
    title: string;
    description: string;
    features: string[];
    cta: string;
}

const SowServices = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [bookingSubmitting, setBookingSubmitting] = useState(false);
    const [bookingSubmitted, setBookingSubmitted] = useState(false);

    const [headerContent, setHeaderContent] = useState({
        label: "Our Services",
        title: "Beyond listings, we engineer world-class sports experiences.",
        subtitle: "Choose the perfect format for your community."
    });

    const [services, setServices] = useState<Service[]>([
        {
            id: 'society-sports',
            icon: Home,
            badge: 'Expert Managed',
            title: 'Society Sports Days',
            description: 'Comprehensive half-day or full-day sports carnivals for residential communities. Includes equipment, referees, and fun games for all ages.',
            features: [
                'Family-centric Games',
                'Badminton & Cricket',
                'Zero Setup Required'
            ],
            cta: 'Book This Event'
        },
        {
            id: 'corporate-team',
            icon: Briefcase,
            badge: 'Expert Managed',
            title: 'Corporate Team Building',
            description: 'High-energy tournaments and fitness challenges designed to boost employee morale and teamwork. Professional management from start to finish.',
            features: [
                'Inter-Company Leagues',
                'Stress-Buster Games',
                'Awards & Ceremony'
            ],
            cta: 'Book This Event'
        },
        {
            id: 'school-sports',
            icon: School,
            badge: 'Expert Managed',
            title: 'School Sports Programs',
            description: 'Structured annual sports days and inter-house competitions. We bring international standard gear and certified officials to your school ground.',
            features: [
                'Age-Appropriate Drills',
                'March Past Support',
                'Medal Distribution'
            ],
            cta: 'Book This Event'
        },
        {
            id: 'mega-carnivals',
            icon: Users,
            badge: 'Expert Managed',
            title: 'Mega Carnivals',
            description: 'Large-scale public events with multi-sport zones, entertainment stages, and food stalls. Managing crowds of 500+ with ease.',
            features: [
                'Multi-Sport Zones',
                'Crowd Management',
                'Sponsorship Ready'
            ],
            cta: 'Book This Event'
        }
    ]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await import('../services/api').then(m => m.api.cms.get('sow-services'));
                if (data && data.content) {
                    const parsed = JSON.parse(data.content);
                    if (parsed.header) setHeaderContent(parsed.header);
                    if (parsed.services) {
                        setServices(parsed.services.map((s: any, i: number) => ({
                            ...s,
                            icon: services[i]?.icon || Home
                        })));
                    }
                }
            } catch (error) {
                console.error("Failed to load SOW Services content", error);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.sow-serv-header > *',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
                }
            );

            gsap.fromTo('.sow-serv-card',
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.2)',
                    scrollTrigger: { trigger: '.sow-serv-grid', start: 'top 85%' }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleBookEvent = (service: Service) => {
        setSelectedService(service);
        setBookingSubmitted(false);
        setBookingForm({ name: '', email: '', phone: '', message: '' });
        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setSelectedService(null);
        setBookingSubmitted(false);
        setBookingForm({ name: '', email: '', phone: '', message: '' });
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService) return;
        if (!bookingForm.name?.trim() || !bookingForm.email?.trim() || !bookingForm.message?.trim()) {
            toast.error('Please fill in name, email, and message.');
            return;
        }
        setBookingSubmitting(true);
        try {
            await api.submitEventBooking({
                request_type: 'event_booking',
                organization_name: bookingForm.name.trim(),
                event_type: selectedService.title,
                email: bookingForm.email.trim(),
                phone_number: bookingForm.phone?.trim() || '',
                description: bookingForm.message.trim(),
            });
            setBookingSubmitted(true);
            toast.success('Request sent! Our event team will contact you shortly.');
            setTimeout(handleCloseBookingModal, 2500);
        } catch (err) {
            console.error('Booking request failed', err);
            toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setBookingSubmitting(false);
        }
    };

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-[var(--bg-primary)] relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[var(--accent-orange)]/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="sow-serv-header text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-1 bg-[var(--accent-orange)]" />
                        <span className="text-[var(--accent-orange)] font-black text-xs uppercase tracking-[0.2em]">
                            {headerContent.label}
                        </span>
                        <div className="w-10 h-1 bg-[var(--accent-orange)]" />
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight max-w-3xl mx-auto leading-tight">
                        {headerContent.title}
                    </h2>

                    <p className="text-[var(--text-secondary)] text-lg font-medium max-w-xl mx-auto">
                        {headerContent.subtitle}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="sow-serv-grid grid md:grid-cols-2 gap-6 lg:gap-8">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.id}
                                className="sow-serv-card group relative bg-[var(--bg-secondary)] rounded-3xl p-6 lg:p-8 border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-500 hover:shadow-2xl"
                            >
                                {/* Badge */}
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                                    <Star className="w-3 h-3 text-green-500" />
                                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                                        {service.badge}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-[var(--accent-orange)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Icon className="w-7 h-7 text-[var(--accent-orange)]" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl lg:text-2xl font-black text-[var(--text-primary)] mb-3 uppercase tracking-tight group-hover:text-[var(--accent-orange)] transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-[var(--text-secondary)] text-sm lg:text-base font-medium mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <div className="space-y-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-[var(--accent-orange)]/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-[var(--accent-orange)]" />
                                            </div>
                                            <span className="text-sm text-[var(--text-primary)]/80 font-medium">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleBookEvent(service)}
                                    className="w-full flex items-center justify-center gap-2 bg-[var(--accent-orange)] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[var(--accent-orange)]/90 transition-all group/btn"
                                >
                                    {service.cta}
                                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Book Event Modal – same style as Contact Us event booking */}
            {showBookingModal && selectedService && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleCloseBookingModal} aria-hidden />
                    <div
                        className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={handleCloseBookingModal}
                            aria-label="Close"
                            className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-primary)] hover:bg-[var(--accent-orange)]/10 transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-[var(--text-primary)]" />
                        </button>
                        <div className="p-6 md:p-8">
                            {bookingSubmitted ? (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                        <Check className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Request sent!</h3>
                                    <p className="text-[var(--text-secondary)]">Our event team will review your details and contact you shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Event Booking Details</h3>
                                    <p className="text-sm text-[var(--accent-orange)] font-bold uppercase tracking-wider mb-6">
                                        {selectedService.title}
                                    </p>
                                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Your name"
                                                required
                                                value={bookingForm.name}
                                                onChange={(e) => setBookingForm((f) => ({ ...f, name: e.target.value }))}
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors text-[var(--text-primary)]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Phone number"
                                                value={bookingForm.phone}
                                                onChange={(e) => setBookingForm((f) => ({ ...f, phone: e.target.value }))}
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors text-[var(--text-primary)]"
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Your email"
                                            required
                                            value={bookingForm.email}
                                            onChange={(e) => setBookingForm((f) => ({ ...f, email: e.target.value }))}
                                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors text-[var(--text-primary)]"
                                        />
                                        <textarea
                                            placeholder="Tell us about your event requirements..."
                                            rows={4}
                                            required
                                            value={bookingForm.message}
                                            onChange={(e) => setBookingForm((f) => ({ ...f, message: e.target.value }))}
                                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors resize-none text-[var(--text-primary)]"
                                        />
                                        <button
                                            type="submit"
                                            disabled={bookingSubmitting}
                                            className="w-full btn-primary gap-2 py-4 disabled:opacity-70 disabled:pointer-events-none"
                                        >
                                            {bookingSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            {bookingSubmitting ? 'Sending...' : 'Submit Booking Request'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SowServices;
