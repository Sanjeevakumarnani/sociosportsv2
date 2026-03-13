import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, Check, Instagram, Linkedin, Youtube, Twitter, Calendar, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAnalytics } from '../components/AnalyticsProvider';
import { api } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { trackEvent, trackFormSubmission } = useAnalytics();

    // Settings State
    const [settings, setSettings] = useState({
        socials: {
            instagram: 'https://instagram.com/sociosports',
            linkedin: 'https://linkedin.com/company/sociosports',
            twitter: 'https://twitter.com/sociosports',
            youtube: 'https://youtube.com/@sociosports'
        },
        contact: {
            email: 'info@sociosports.com',
            phone: '+91 7842983839',
            address: 'Plot 417, Vasanth Nagar, KPHB 9th Phase, Hyderabad, Telangana - 500085'
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await api.cms.get('global-settings');
                if (data && data.content) {
                    setSettings(prev => ({ ...prev, ...JSON.parse(data.content) }));
                }
            } catch (e) {
                console.error('Failed to load global settings', e);
            }
        };
        fetchSettings();
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        reason: 'General Inquiry',
        eventDate: '',
        footfall: '',
        eventVenue: '',
        eventType: '',
        message: ''
    });

    // Initialize reason from URL query (?reason=partner or ?reason=book-event)
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const reasonParam = params.get('reason');
            if (reasonParam === 'partner') {
                setFormData(prev => ({ ...prev, reason: 'Partner with Us' }));
            } else if (reasonParam === 'book-event') {
                setFormData(prev => ({ ...prev, reason: 'Book an Event' }));
            }
        } catch {
            // ignore URL parsing errors
        }
    }, []);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Content animation
            gsap.fromTo(
                '.cf-content > *',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // Form animation
            gsap.fromTo(
                '.cf-form',
                { opacity: 0, x: 40 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.cf-form',
                        start: 'top 80%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name?.trim() || !formData.email?.trim() || !formData.message?.trim()) {
            toast.error('Please fill in name, email, and message.');
            return;
        }
        setIsSubmitting(true);
        try {
                if (formData.reason === 'Book an Event') {
                    await api.submitEventBooking({
                        request_type: 'event_booking',
                        organization_name: formData.name.trim(),
                        event_type: formData.eventType || 'Event',
                        email: formData.email.trim(),
                        phone_number: formData.phone?.trim() || '',
                        description: [formData.eventType && `Type: ${formData.eventType}`, formData.message?.trim()]
                            .filter(Boolean)
                            .join('. ') || formData.message?.trim() || '',
                    });

                    trackEvent('submit_booking_request', {
                        type: formData.eventType,
                        has_event_details: true
                    });
                } else {
                    // General Inquiry: use Settings/helpsupport API (fixed request_type & subject)
                    if (formData.reason === 'General Inquiry') {
                        await api.submitHelpSupport({
                            full_name: formData.name,
                            email: formData.email,
                            phonenumber: formData.phone || '',
                            description: formData.message
                        });
                    } else {
                        // Partner with Us: use existing inquiry API
                        const inquiryData = {
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            subject: formData.reason,
                            message: formData.message
                        };
                        await api.createInquiry(inquiryData);
                    }

                    trackEvent('submit_inquiry', {
                        type: formData.reason
                    });
                }

                trackFormSubmission('Contact Form', true, {
                    reason: formData.reason
                });

                setIsSubmitted(true);
                toast.success('Message sent! We\'ll get back to you soon.');
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        reason: 'General Inquiry',
                        eventDate: '',
                        footfall: '',
                        eventVenue: '',
                        eventType: '',
                        message: ''
                    });
                }, 3000);
            } catch (error) {
                console.error("Contact form failed", error);
                trackFormSubmission('Contact Form', false, { error: (error as Error).message });
                const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
                toast.error(message);
            } finally {
                setIsSubmitting(false);
            }
    };

    const contactInfo = [
        { icon: Mail, label: 'Email', value: settings.contact.email, href: `mailto:${settings.contact.email}` },
        { icon: Phone, label: 'Phone', value: settings.contact.phone, href: `tel:${settings.contact.phone}` },
        { icon: MapPin, label: 'Location', value: settings.contact.address, href: 'https://maps.google.com/?q=Hitech+City+Hyderabad' },
    ];

    const socialLinks = [
        { icon: Instagram, href: settings.socials.instagram, label: 'Instagram' },
        { icon: Linkedin, href: settings.socials.linkedin, label: 'LinkedIn' },
    ];

    const reasons = ['General Inquiry', 'Book an Event', 'Partner with Us'];

    return (
        <section
            ref={sectionRef}
            className="relative bg-[var(--bg-primary)] py-20 md:py-32"
        >
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Left - Content */}
                        <div className="cf-content">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                                <span className="eyebrow">Contact</span>
                            </div>

                            <h2 className="section-title mb-6">
                                LET&apos;S BUILD THE <span className="text-gradient">FUTURE</span> OF SPORTS
                            </h2>

                            <p className="section-subtitle mb-6 max-w-lg">
                                Whether you&apos;re planning an event, exploring partnerships, or have questions — we&apos;re here to help bring your sports vision to life.
                            </p>

                            {/* Why Contact Us - Value Proposition */}
                            <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 mb-6 border border-[var(--border)] max-w-lg">
                                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">What happens after you contact us?</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Your inquiry is routed to the right team within hours</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Expect a personalized response within 24 hours</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Free consultation for events and partnerships</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mb-8 max-w-lg">
                                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)]/10 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-[var(--accent-orange)]">We typically respond within 24 hours</span>
                                </div>
                            </div>

                            <p className="text-sm mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                                Serving institutions, communities, and events across India.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-4 mb-8">
                                {contactInfo.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={item.href}
                                            className="flex items-center gap-4 group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-white/10 flex items-center justify-center group-hover:border-[var(--accent-orange)]/50 transition-colors">
                                                <Icon className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
                                            </div>
                                            <div>
                                                <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
                                                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-white/10 flex items-center justify-center hover:border-[var(--accent-orange)]/50 hover:bg-[var(--accent-orange)]/10 transition-all duration-300"
                                        >
                                            <Icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right - Form */}
                        <div className="cf-form">
                            <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 md:p-8 border border-[var(--border)]">
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                            <Check className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            {formData.reason === 'Book an Event'
                                                ? 'Our event team will review your details and contact you shortly.'
                                                : 'We&apos;ll get back to you soon.'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                                            {formData.reason === 'Book an Event' ? 'Event Booking Details' : 'Send us a message'}
                                        </h3>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* Reason Selector */}
                                            <div className="flex gap-2 p-1 bg-[var(--bg-primary)] rounded-xl mb-6">
                                                {reasons.map((r) => (
                                                    <button
                                                        key={r}
                                                        type="button"
                                                        aria-label={`Inquiry type: ${r}`}
                                                        onClick={() => setFormData({ ...formData, reason: r })}
                                                        className={`flex-1 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${formData.reason === r
                                                            ? 'bg-[var(--accent-orange)] text-white shadow-lg'
                                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                                                            }`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Your name"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                                                        style={{ color: 'var(--text-primary)' }}
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Phone number"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                                                        style={{ color: 'var(--text-primary)' }}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="Your email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                                                    style={{ color: 'var(--text-primary)' }}
                                                />
                                            </div>

                                            {/* Conditional Event Fields */}
                                            {formData.reason === 'Book an Event' && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                                                            Event Type
                                                        </label>
                                                        <div className="relative">
                                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                                            <select
                                                                value={formData.eventType}
                                                                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 pl-11 pr-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors appearance-none"
                                                                style={{ color: 'var(--text-primary)' }}
                                                            >
                                                                <option value="">Select event type</option>
                                                                <option value="Residential League">Residential League</option>
                                                                <option value="School Sports Day">School Sports Day</option>
                                                                <option value="Corporate Carnival">Corporate Carnival</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <textarea
                                                    placeholder={formData.reason === 'Book an Event' ? "Tell us about your event requirements..." : "Your message..."}
                                                    rows={4}
                                                    required
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors resize-none"
                                                    style={{ color: 'var(--text-primary)' }}
                                                />
                                            </div>

                                            <button type="submit" disabled={isSubmitting} aria-label={formData.reason === 'Book an Event' ? 'Submit Booking Request' : 'Send message'} className="w-full btn-primary gap-2 py-4 disabled:opacity-70 disabled:pointer-events-none">
                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                {isSubmitting ? 'Sending...' : (formData.reason === 'Book an Event' ? 'Submit Booking Request' : 'Send message')}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
