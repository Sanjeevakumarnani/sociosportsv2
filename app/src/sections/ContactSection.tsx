import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, Check, Instagram, Linkedin, Youtube, Twitter, Calendar, Users } from 'lucide-react';
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

    const [isSubmitted, setIsSubmitted] = useState(false);

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
        if (formData.name && formData.email && formData.message) {
            try {
                if (formData.reason === 'Book an Event') {
                    // Map Contact Form to Booking Schema
                    const submissionData = {
                        businessName: formData.name,
                        contactPerson: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        stallType: 'BOOK_EVENT',
                        requirements: `Type: ${formData.eventType} | Venue: ${formData.eventVenue} | Date: ${formData.eventDate} | Footfall: ${formData.footfall} | Msg: ${formData.message}`
                    };

                    await api.createBooking(submissionData);

                    trackEvent('submit_booking_request', {
                        type: formData.eventType,
                        has_event_details: true
                    });
                } else {
                    // Start of: General Inquiry & Partner with Us
                    // Use Inquiry API
                    const inquiryData = {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        subject: formData.reason,
                        message: formData.message
                    };

                    await api.createInquiry(inquiryData);

                    trackEvent('submit_inquiry', {
                        type: formData.reason
                    });
                }

                trackFormSubmission('Contact Form', true, {
                    reason: formData.reason
                });

                setIsSubmitted(true);
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
                // Fail silently or show a toast in future
            }
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
        { icon: Twitter, href: settings.socials.twitter, label: 'Twitter' },
        { icon: Youtube, href: settings.socials.youtube, label: 'YouTube' },
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
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="relative">
                                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                                            <input
                                                                type="date"
                                                                value={formData.eventDate}
                                                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors dark-date-input"
                                                                style={{ color: 'var(--text-primary)' }}
                                                                aria-label="Event Date"
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                                            <input
                                                                type="text"
                                                                placeholder="Expected Gathering (e.g. 500+)"
                                                                value={formData.footfall}
                                                                onChange={(e) => setFormData({ ...formData, footfall: e.target.value })}
                                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                                                                style={{ color: 'var(--text-primary)' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Event Venue/City"
                                                            value={formData.eventVenue}
                                                            onChange={(e) => setFormData({ ...formData, eventVenue: e.target.value })}
                                                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        />
                                                        <select
                                                            value={formData.eventType}
                                                            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors appearance-none"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        >
                                                            <option value="">Event Type</option>
                                                            <option>Tournament</option>
                                                            <option>Training Camp</option>
                                                            <option>Community Engagement</option>
                                                            <option>Corporate Sports Day</option>
                                                        </select>
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

                                            <button type="submit" aria-label={formData.reason === 'Book an Event' ? 'Submit Booking Request' : 'Send message'} className="w-full btn-primary gap-2 py-4">
                                                <Send className="w-4 h-4" />
                                                {formData.reason === 'Book an Event' ? 'Submit Booking Request' : 'Send message'}
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
