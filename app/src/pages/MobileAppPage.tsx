import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Smartphone, Shield, Zap, Bell, Apple } from 'lucide-react';
import SimpleFooter from '../sections/SimpleFooter';
import SmartNotifications from '../sections/SmartNotifications';
import SEOHead from '../components/SEOHead';
import { useAnalytics } from '../components/AnalyticsProvider';
import { api } from '../services/api';

const MobileAppPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const { trackEvent, trackAppDownloadIntent } = useAnalytics();

    // Default Content State
    const [content, setContent] = useState({
        hero: {
            title: 'YOUR SPORTS IN YOUR POCKET.',
            subtitle: 'Available Now',
            description: 'The full power of the SocioSports ecosystem. Verified stats, instant bookings, and community connection.',
            androidLink: 'https://play.google.com/store/apps/details?id=com.sociobeats&pcampaignid=web_share',
            iosLink: '#'
        },
        modal: {
            title: "Shhh... You're Early.",
            subtitle: 'Stealth Mode',
            description: 'The ultimate sports ecosystem is currently in Stealth Mode. We are crafting an experience that will redefine how you play. Access is rolling out soon.'
        },
        features: [
            { title: "Verified Sports ID", desc: "Your digital passport for tournaments and trials." },
            { title: "Smart Alerts", desc: "Instant notifications for tournament registrations and results." },
            { title: "Live Scores", desc: "Real-time updates from ongoing matches in your network." },
            { title: "Easy Booking", desc: "Book turfs, coaches, and events in 3 taps." }
        ],
        steps: [
            { step: 'Step 1', title: 'Create Profile' },
            { step: 'Step 2', title: 'Discover & Connect' },
            { step: 'Step 3', title: 'Book & Play' },
            { step: 'Step 4', title: 'Grow & Earn' }
        ]
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await api.cms.get('mobile-app');
                if (data && data.content) {
                    setContent(prev => ({ ...prev, ...JSON.parse(data.content) }));
                }
            } catch (err) {
                console.error('Failed to load Mobile App content', err);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.app-hero-element',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
            );

            gsap.fromTo('.feature-card',
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
                    scrollTrigger: { trigger: '.features-grid', start: 'top 80%' }
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, [content]); // Re-run animations when content loads

    const [showModal, setShowModal] = useState(false);

    const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sociobeats&pcampaignid=web_share';

    const handleDownload = (platform: 'ios' | 'android') => {
        if (platform === 'android') {
            // Always use the Play Store URL for Android
            trackAppDownloadIntent(platform, PLAY_STORE_URL);
            window.open(PLAY_STORE_URL, '_blank');
        } else {
            // iOS - check if link is available
            const link = content.hero.iosLink;
            if (link && link !== '#') {
                trackAppDownloadIntent(platform, link);
                window.open(link, '_blank');
            } else {
                trackEvent('click_download_app_unavailable', { platform });
                setShowModal(true);
            }
        }
    };

    // Helper to get icon safely
    const getIcon = (index: number) => {
        const icons = [Shield, Bell, Zap, Smartphone];
        return icons[index % icons.length];
    };

    const getStepColor = (index: number) => {
        const colors = ['text-[var(--accent-orange)]', 'text-blue-500', 'text-green-500', 'text-yellow-500'];
        return colors[index % colors.length];
    }

    return (
        <main ref={pageRef} className="bg-[var(--bg-primary)] pt-20">
            <SEOHead
                title="Download SocioSports App | The National Sports Ecosystem"
                description={content.hero.description}
            />

            {/* Mystery Launch Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-3xl transition-opacity duration-500"
                        onClick={() => setShowModal(false)}
                    />

                    <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/5 rounded-3xl p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        {/* Glow Effects */}
                        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[var(--accent-orange)]/20 blur-[100px] rounded-full" />
                        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/20 blur-[100px] rounded-full" />

                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 animate-pulse">
                                <Zap className="w-8 h-8 text-[var(--accent-orange)]" />
                            </div>

                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                                {content.modal.title.split(' ')[0]} <span className="text-gradient">{content.modal.title.split(' ').slice(1).join(' ')}</span>
                            </h2>

                            <p className="text-lg text-white/70 mb-8 font-medium leading-relaxed">
                                {content.modal.description}
                            </p>

                            <button
                                onClick={() => setShowModal(false)}
                                aria-label="Notify Me When Live"
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-transform"
                            >
                                Notify Me When Live
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 overflow-hidden">
                <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] mb-6 app-hero-element">
                            <Smartphone className="w-4 h-4 text-[var(--accent-orange)]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">{content.hero.subtitle}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 leading-tight app-hero-element text-transform uppercase">
                            {content.hero.title}
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg mx-auto lg:mx-0 app-hero-element">
                            {content.hero.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 app-hero-element">
                            <button
                                onClick={() => handleDownload('ios')}
                                aria-label="Download on the App Store"
                                className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-xl hover:scale-105 transition-transform font-bold"
                            >
                                <Apple className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase tracking-wider">Download on the</div>
                                    <div className="text-base leading-none font-black">App Store</div>
                                </div>
                            </button>
                            <button
                                onClick={() => handleDownload('android')}
                                aria-label="Get it on Google Play"
                                className="flex items-center gap-3 px-6 py-4 bg-transparent border border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors font-bold"
                            >
                                <div className="w-6 h-6 grid place-items-center">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.37,13.07L17.82,16.13L15.39,13.7L20.09,11C20.93,10.53 20.93,9.47 20.09,9L15.39,6.3L17.82,3.87L20.37,6.93C20.87,7.77 20.87,12.23 20.37,13.07M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] uppercase tracking-wider">Get it on</div>
                                    <div className="text-base leading-none font-black">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="relative app-hero-element order-1 lg:order-2 flex justify-center">
                        <div className="absolute inset-0 bg-[var(--accent-orange)]/20 blur-[120px] rounded-full scale-150" />

                        {/* 3D Stitched Effect Wrapper */}
                        <div className="relative z-10 w-full max-w-[800px] perspective-1000 transform transition-transform duration-700 hover:scale-[1.01]">
                            <img
                                src="/images/app_screens_collage.png"
                                alt="SocioSports Mobile Experience"
                                className="w-full h-auto drop-shadow-2xl rounded-3xl border border-white/5"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                                }}
                            />

                            {/* Floating Badges */}
                            <div className="absolute -left-24 md:-left-32 top-0 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-float hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Status</div>
                                        <div className="text-sm font-black text-white">Verified Athlete</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -right-24 md:-right-32 bottom-32 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-float hidden md:block" style={{ animationDelay: '2s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--accent-orange)]/20 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-[var(--accent-orange)]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Upcoming</div>
                                        <div className="text-sm font-black text-white">Hyd Open 2026</div>
                                    </div>
                                </div>
                            </div>

                            {/* Screen Labels - Dynamic */}
                            <div className="relative mt-8 hidden md:flex justify-between items-start px-2 text-center">
                                {content.steps.map((step, i) => (
                                    <div key={i} className="w-1/4">
                                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${getStepColor(i)}`}>{step.step}</div>
                                        <div className="text-sm font-bold text-[var(--text-primary)]">{step.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-[var(--bg-secondary)] features-grid">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.features.map((f, i) => {
                            const Icon = getIcon(i);
                            return (
                                <div key={i} className="feature-card p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-orange)]/10 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-[var(--accent-orange)]" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{f.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Smart Notifications Section */}
            <SmartNotifications />

            <SimpleFooter />
        </main>
    );
};

export default MobileAppPage;
