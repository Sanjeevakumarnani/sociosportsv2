import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ShoppingBag,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    Globe,
    MoveRight,
    ImageIcon
} from 'lucide-react';
import SimpleFooter from '../sections/SimpleFooter';
import StallBookingModal from '../components/StallBookingModal';
import SEOHead from '../components/SEOHead';
import { useAnalytics } from '../components/AnalyticsProvider';
import { api } from '../services/api';

import VendorProfileModal from '../components/VendorProfileModal';
import type { Vendor } from '../components/VendorProfileModal';

gsap.registerPlugin(ScrollTrigger);

const VendorsPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedStallType, setSelectedStallType] = useState<string | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { trackEvent } = useAnalytics();

    // CMS State
    const [content, setContent] = useState({
        hero: {
            subtitle: 'Partner Gateway',
            title: 'SCALE YOUR BUSINESS.',
            description: 'Join India\'s premier sports ecosystem. Access massive footfall, build institutional credibility, and connect directly with verified athletes.'
        },
        benefits: [
            {
                title: 'Direct Monetization',
                desc: 'Turn spectators into customers. Sell gear, supplements, and services directly to an active audience.',
                stats: '3-4x ROI'
            },
            {
                title: 'Brand Visibility',
                desc: 'Position your brand in the heart of high-performance tournament environments across India.',
                stats: '5k+ Monthly Reach'
            },
            {
                title: 'Verified Audience',
                desc: 'Connect with a curated network of professional athletes, certified coaches, and sports enthusiasts.',
                stats: '100% Verified Users'
            }
        ],
        stallTypes: [
            {
                name: 'Retail Pop-up',
                image: '/images/vendor_retail_indian.png',
                desc: 'Maximum exposure for sports gear and apparel. Positioned in high-visibility dugout exits.',
                features: ['10x10 FT Tent', '2 Display Tables', 'Branding Fascia']
            },
            {
                name: 'Nutrition Station',
                image: '/images/vendor_nutrition_indian.png',
                desc: 'Located at hydration points. Perfect for energy drinks, snacks, and recovery supplements.',
                features: ['8x8 FT Booth', 'Power Supply (15A)', 'Storage Zone']
            }
        ],
        steps: [
            { step: '01', title: 'Register', desc: 'Secure your spot through our digital portal.' },
            { step: '02', title: 'Approve', desc: 'Our team verifies your business profile.' },
            { step: '03', title: 'Setup', desc: 'Professional setup conducted before start.' },
            { step: '04', title: 'Profit', desc: 'Connect and monetize at the event.' },
        ]
    });

    const [vendors, setVendors] = useState<any[]>([]);

    useEffect(() => {
        const fetchVendors = async () => {
            import('../services/api').then(({ api }) => {
                api.getVendors().then(data => {
                    if (data && data.length > 0) {
                        setVendors(data);
                    }
                }).catch(err => console.error(err));
            });
        };
        fetchVendors();
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await api.cms.get('vendors-page');
                if (data && data.content) {
                    setContent(prev => ({ ...prev, ...JSON.parse(data.content) }));
                }
            } catch (e) {
                console.error('Failed to load Vendors content', e);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.fromTo('.vendors-hero-text',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15 }
            );

            // Section scroll animations
            gsap.utils.toArray('.vendors-section').forEach((section: any) => {
                gsap.fromTo(section.querySelectorAll('.animate-on-scroll'),
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 85%',
                        }
                    }
                );
            });
        }, pageRef);

        return () => ctx.revert();
    }, [content]); // Re-run animations when content updates

    // Helper to get benefits icon (since CMS only stores strings/data, not icon components)
    // We can map logic or simply use generic icons for now to keep it persistent.
    // For simplicity, I'll rotate through a few appropriate icons.
    const getBenefitIcon = (index: number) => {
        const icons = [TrendingUp, Globe, ShieldCheck];
        return icons[index % icons.length];
    };

    return (
        <main ref={pageRef} className="bg-[var(--bg-primary)] overflow-hidden">
            <SEOHead
                title="Vendor Registration | SocioSports"
                description={content.hero.description}
            />
            {/* 1. Hero Section - Condensed */}
            <section className="relative min-h-[60vh] flex items-center justify-center pt-20 pb-12 px-6 overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] mb-6 vendors-hero-text">
                        <ShoppingBag className="w-3 h-3 text-[var(--accent-orange)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">{content.hero.subtitle}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase vendors-hero-text leading-[1.1]">
                        {content.hero.title}
                    </h1>
                    <p className="text-base md:text-lg text-[var(--text-secondary)] font-medium max-w-xl mx-auto leading-relaxed vendors-hero-text mb-10">
                        {content.hero.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 vendors-hero-text">
                        <button onClick={() => {
                            setSelectedStallType(null);
                            setIsBookingOpen(true);
                            trackEvent('open_booking_modal', { source: 'hero_section' });
                        }} className="btn-primary px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-3">
                            Register Your Stall
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Ambient Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[var(--accent-orange)]/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[200px] rounded-full" />
                </div>
            </section>

            {/* 2. Market Reach Section - Condensed */}
            <section className="py-12 container mx-auto px-6 vendors-section border-t border-[var(--border)]">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-on-scroll">
                        <span className="text-[var(--accent-orange)] font-black text-xs uppercase tracking-widest mb-4 block">Market Reach</span>
                        <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase leading-tight">ACCESS A <span className="text-gradient italic font-black">CAPTIVE AUDIENCE.</span></h2>
                        <div className="space-y-4 text-base text-[var(--text-secondary)] font-medium leading-relaxed">
                            <p>SocioSports isn't just a platform; it's a physical network. Every weekend, thousands of verified athletes gather for our **SportsOnWheels** tournaments.</p>
                            <p>As a vendor, you gain more than space; you gain an ecosystem that trusts SocioSports for quality, safety, and professional execution.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                                <div className="text-2xl font-black text-[var(--text-primary)] mb-1">500+</div>
                                <div className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-widest">Athletes / Event</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                                <div className="text-2xl font-black text-[var(--text-primary)] mb-1">2.4k</div>
                                <div className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-widest">Avg. Footfall</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative animate-on-scroll">
                        <div className="absolute -inset-4 bg-[var(--accent-orange)]/10 blur-[80px] rounded-full pointer-events-none" />
                        <img
                            src="/images/vendor_hero_indian.png"
                            alt="Marketplace Atmosphere"
                            className="rounded-[32px] shadow-2xl border border-[var(--border)] relative z-10 w-full object-cover aspect-video"
                        />
                    </div>
                </div>
            </section>

            {/* 3. Benefits Grid - Tight */}
            <section className="py-12 bg-[var(--bg-secondary)] border-y border-[var(--border)] vendors-section">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-12 animate-on-scroll">
                        <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tighter">WHY PARTNER <span className="text-gradient">WITH US?</span></h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {content.benefits.map((benefit, i) => {
                            const Icon = getBenefitIcon(i);
                            return (
                                <div key={i} className="p-6 md:p-8 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/20 transition-all group animate-on-scroll">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-orange)]/10 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6 text-[var(--accent-orange)]" />
                                    </div>
                                    <h4 className="text-xl font-black text-[var(--text-primary)] mb-3 uppercase tracking-tighter">{benefit.title}</h4>
                                    <p className="text-[var(--text-secondary)] font-medium leading-relaxed mb-4 italic text-xs">{benefit.desc}</p>
                                    <div className="pt-4 border-t border-[var(--border)] text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest">
                                        Expected: {benefit.stats}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. Stall Categories - High Density */}
            <section className="py-12 container mx-auto px-6 vendors-section">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-12">
                    <div className="lg:w-1/2 animate-on-scroll">
                        <span className="text-[var(--accent-orange)] font-black text-xs uppercase tracking-widest mb-3 block">Configuration</span>
                        <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase leading-tight">STALL <span className="text-gradient font-black">OPTIONS.</span></h2>
                    </div>
                    <p className="lg:w-1/3 text-[var(--text-secondary)] font-medium text-xs animate-on-scroll">
                        Choose the layout that best fits your business goals. All stalls include professional setup and security.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {content.stallTypes.map((stall, i) => (
                        <div key={i} className="group relative rounded-[32px] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)]/80 hover:border-[var(--accent-orange)]/30 transition-all duration-500 animate-on-scroll hover:-translate-y-1 hover:shadow-2xl">
                            <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8 items-center h-full">
                                {stall.image ? (
                                    <img src={stall.image} alt={stall.name} className="rounded-2xl h-full w-full object-cover transition-all duration-700 aspect-square group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full bg-[var(--bg-primary)] rounded-2xl flex items-center justify-center aspect-square">
                                        <ImageIcon className="w-12 h-12 text-[var(--text-secondary)]/20" />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-1">{stall.name}</h3>
                                        <p className="text-[10px] text-[var(--text-secondary)] font-medium">{stall.desc}</p>
                                    </div>
                                    <ul className="space-y-2">
                                        {stall.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                                                <div className="w-1 h-1 rounded-full bg-[var(--accent-orange)]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-2">
                                        <button onClick={() => {
                                            setSelectedStallType(stall.name);
                                            setIsBookingOpen(true);
                                            trackEvent('open_booking_modal', { source: 'stall_card', stall_type: stall.name });
                                        }} className="w-full py-3 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-black uppercase text-[9px] tracking-widest hover:bg-[var(--accent-orange)] hover:border-transparent cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]">
                                            Book This Space
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. How to Book - Condensed Interactivity */}
            <section className="py-12 bg-[var(--bg-secondary)] border-y border-[var(--border)] vendors-section">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-4 gap-6">
                        {content.steps.map((step, i) => (
                            <div key={i} className="group relative p-6 md:p-8 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/40 transition-all duration-500 animate-on-scroll overflow-hidden hover:-translate-y-2 hover:bg-[var(--bg-primary)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                                <div className="text-5xl font-black text-[var(--text-secondary)]/10 mb-4 group-hover:text-[var(--accent-orange)]/30 transition-all duration-700 group-hover:-translate-y-2 transform italic leading-none">{step.step}</div>
                                <h4 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2 group-hover:text-[var(--accent-orange)] transition-colors duration-300">{step.title}</h4>
                                <p className="text-[11px] text-[var(--text-secondary)] font-medium uppercase tracking-[0.15em] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-300">{step.desc}</p>

                                {/* Theme-aware hover elements */}
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--accent-orange)]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                <div className="absolute top-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[var(--accent-orange)] to-[#ff8c00] group-hover:w-full transition-all duration-500 origin-left" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Featured Vendors Directory */}
            <section className="py-20 container mx-auto px-6 vendors-section" id="marketplace">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="animate-on-scroll">
                        <span className="text-[var(--accent-orange)] font-black text-xs uppercase tracking-widest mb-3 block">Marketplace</span>
                        <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase">TRUSTED <span className="text-gradient font-black">PARTNERS.</span></h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vendors.length > 0 ? (
                        vendors.map((vendor, i) => (
                            <div key={i} className="group p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all hover:-translate-y-1 animate-on-scroll">
                                <div className="aspect-square rounded-2xl bg-[var(--bg-primary)] mb-6 overflow-hidden relative">
                                    <img src={vendor.image || '/images/vendor_default.png'}
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800' }}
                                        alt={vendor.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                        ⭐ {vendor.rating || '4.5'}
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight mb-1">{vendor.name}</h3>
                                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mb-4">{vendor.category}</p>
                                <button onClick={() => {
                                    setSelectedVendor(vendor);
                                    setIsProfileOpen(true);
                                }} className="w-full py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent-orange)] hover:text-white hover:border-transparent transition-all">
                                    View Profile
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-[var(--text-secondary)] font-medium">
                            No verified vendors listed yet. Check back soon!
                        </div>
                    )}
                </div>
            </section>

            {/* Final CTA - Tighter */}
            <section className="py-16 container mx-auto px-6 vendors-section">

                <div className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[48px] p-6 md:p-16 text-center">
                    <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[var(--accent-orange)]/5 blur-[120px] rounded-full pointer-events-none" />
                    <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase leading-tight animate-on-scroll">
                        Start your <span className="text-gradient italic font-black">Success Story.</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-on-scroll">
                        <button onClick={() => {
                            setIsBookingOpen(true);
                            trackEvent('open_booking_modal', { source: 'bottom_cta' });
                        }} className="btn-primary px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-3">
                            Click to Register
                            <MoveRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            <SimpleFooter />

            <StallBookingModal
                isOpen={isBookingOpen}
                onClose={() => { setIsBookingOpen(false); setSelectedStallType(null); }}
                initialStallType={selectedStallType ?? undefined}
            />

            <VendorProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                vendor={selectedVendor}
            />
        </main>
    );
};

export default VendorsPage;
