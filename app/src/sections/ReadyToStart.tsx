import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Download, Apple } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sociobeats&pcampaignid=web_share';

const ReadyToStart = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main entry animation
            gsap.fromTo(
                '.rts-content',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // Number counter animation
            const obj = { value: 0 };
            gsap.to(obj, {
                value: 50000,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                },
                onUpdate: () => {
                    if (countRef.current) {
                        countRef.current.innerText = Math.floor(obj.value).toLocaleString() + '+';
                    }
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleDownload = (platform: 'ios' | 'android') => {
        if (platform === 'android') {
            window.open(PLAY_STORE_URL, '_blank');
        } else {
            // iOS is handled via "Coming Soon" modal in some parts, 
            // but here we can just link to top or show alert for simplicity 
            // since the specific modal logic is in SportsPocket
            alert("iOS App is coming soon to the App Store!");
        }
    };

    return (
        <section ref={sectionRef} className="relative py-20 bg-[var(--bg-secondary)] overflow-hidden border-t border-[var(--border)]">
            {/* Background Decorative Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-orange)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="rts-content max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] mb-8 shadow-sm">
                        <Smartphone className="w-4 h-4 text-[var(--accent-orange)]" />
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">
                            Join the Movement
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-8 tracking-tight uppercase leading-[0.9]">
                        Ready to get <span className="text-gradient">started?</span>
                    </h2>

                    <div className="mb-12">
                        <div className="text-5xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter mb-2">
                            <span ref={countRef}>0+</span>
                        </div>
                        <p className="text-lg text-[var(--text-secondary)] font-medium uppercase tracking-widest">
                            Athletes & Enthusiasts already onboarded
                        </p>
                    </div>

                    <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
                        The national sports ecosystem is now at your fingertips. Download the app today and unlock your true potential.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => handleDownload('android')}
                            className="group flex items-center gap-4 px-10 py-5 bg-[var(--accent-orange)] text-white rounded-2xl font-black uppercase tracking-wider transition-all shadow-xl shadow-[var(--accent-orange)]/20 hover:scale-105 active:scale-95"
                        >
                            <Download className="w-6 h-6 group-hover:animate-bounce" />
                            <span>Download App</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleDownload('ios')}
                                className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                                title="Download on App Store"
                            >
                                <Apple className="w-6 h-6 text-[var(--text-primary)]" />
                            </button>
                            <button
                                onClick={() => handleDownload('android')}
                                className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                                title="Get it on Google Play"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[var(--text-primary)]">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.37,13.07L17.82,16.13L15.39,13.7L20.09,11C20.93,10.53 20.93,9.47 20.09,9L15.39,6.3L17.82,3.87L20.37,6.93C20.87,7.77 20.87,12.23 20.37,13.07M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReadyToStart;
