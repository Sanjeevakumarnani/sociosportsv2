import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Shield, Zap, Apple } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sociobeats&pcampaignid=web_share';

const SportsPocket = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [showModal, setShowModal] = useState(false);

    const steps = [
        { step: 'Step 1', title: 'Create Profile', color: 'text-[var(--accent-orange)]' },
        { step: 'Step 2', title: 'Discover & Connect', color: 'text-blue-500' },
        { step: 'Step 3', title: 'Book & Play', color: 'text-green-500' },
        { step: 'Step 4', title: 'Grow & Earn', color: 'text-yellow-500' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.sp-hero-element',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleDownload = (platform: 'ios' | 'android') => {
        if (platform === 'android') {
            window.open(PLAY_STORE_URL, '_blank');
        } else {
            setShowModal(true);
        }
    };

    return (
        <section ref={sectionRef} className="relative py-20 md:py-28 bg-[var(--bg-primary)] overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-orange)]/10 blur-[120px] rounded-full" />
            </div>

            {/* iOS Coming Soon Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 animate-pulse">
                            <Zap className="w-8 h-8 text-[var(--accent-orange)]" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                            Shhh... <span style={{ color: 'var(--accent-orange)' }}>You're Early.</span>
                        </h2>
                        <p className="text-lg text-white/70 mb-8 leading-relaxed">
                            The ultimate sports ecosystem is currently in Stealth Mode. We are crafting an experience that will redefine how you play. Access is rolling out soon.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-transform"
                        >
                            Notify Me When Live
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT: Text content */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] mb-6 sp-hero-element">
                            <Smartphone className="w-4 h-4 text-[var(--accent-orange)]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Available Now</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 leading-tight uppercase sp-hero-element">
                            YOUR SPORTS IN YOUR POCKET.
                        </h2>

                        <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-lg leading-relaxed sp-hero-element">
                            The full power of the SocioSports ecosystem. Verified stats, instant bookings, and community connection.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start gap-4 sp-hero-element">
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
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.37,13.07L17.82,16.13L15.39,13.7L20.09,11C20.93,10.53 20.93,9.47 20.09,9L15.39,6.3L17.82,3.87L20.37,6.93C20.87,7.77 20.87,12.23 20.37,13.07M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] uppercase tracking-wider">Get it on</div>
                                    <div className="text-base leading-none font-black">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Phone mockup */}
                    <div className="relative order-1 lg:order-2 flex justify-center sp-hero-element">
                        <div className="absolute inset-0 bg-[var(--accent-orange)]/20 blur-[120px] rounded-full scale-150 pointer-events-none" />

                        <div className="relative z-10 w-full max-w-[700px]">
                            <img
                                src="/images/app_screens_collage.png"
                                alt="SocioSports Mobile App"
                                className="w-full h-auto drop-shadow-2xl rounded-3xl border border-white/5"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                }}
                            />

                            {/* Floating badge */}
                            <div className="absolute -left-6 top-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl hidden md:block">
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

                            {/* Step labels */}
                            <div className="mt-6 hidden md:flex justify-between items-start px-2 text-center">
                                {steps.map((s, i) => (
                                    <div key={i} className="w-1/4">
                                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${s.color}`}>{s.step}</div>
                                        <div className="text-sm font-bold text-[var(--text-primary)]">{s.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SportsPocket;
