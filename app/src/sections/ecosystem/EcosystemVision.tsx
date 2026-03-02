import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EcosystemVision = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
            });

            tl.fromTo('.ev-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' })
                .fromTo('.ev-headline', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
                .fromTo('.ev-subtext', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
                .fromTo('.ev-pillar', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
                .fromTo('.ev-cta-line', { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');

            // Floating orbs animation
            gsap.to('.ev-orb', {
                y: -15,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: { each: 0.5, from: 'random' },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const pillars = [
        { label: 'Athletes', emoji: '🏅' },
        { label: 'Coaches', emoji: '🎯' },
        { label: 'Facilities', emoji: '🏟️' },
        { label: 'Events', emoji: '🏆' },
        { label: 'Sponsors', emoji: '💼' },
    ];

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-[var(--bg-primary)] overflow-hidden">
            {/* Decorative orbs */}
            <div className="ev-orb absolute top-20 left-[15%] w-48 h-48 bg-[var(--accent-orange)]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="ev-orb absolute bottom-20 right-[10%] w-64 h-64 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none" />
            <div className="ev-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
                {/* Solution Badge */}
                <div className="ev-badge inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--accent-orange)]/15 to-orange-500/10 border border-[var(--accent-orange)]/30">
                    <Zap className="w-4 h-4 text-[var(--accent-orange)]" />
                    <span className="text-xs font-black tracking-[0.2em] text-[var(--accent-orange)] uppercase">The Solution</span>
                </div>

                {/* Headline */}
                <h2 className="ev-headline text-4xl md:text-6xl lg:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-8 leading-[1.1]">
                    One Platform{' '}
                    <span className="text-gradient">Connecting</span>
                    <br className="hidden md:block" />{' '}
                    The Entire Sports
                    <br className="hidden md:block" />{' '}
                    <span className="text-gradient">Ecosystem</span>
                </h2>

                {/* Subtext */}
                <p className="ev-subtext text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
                    SocioSports isn't just an app. It's the <strong className="text-[var(--text-primary)]">digital infrastructure</strong> that powers India's sports economy — connecting every stakeholder under one unified platform.
                </p>

                {/* Pillar Tags */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
                    {pillars.map((pillar, idx) => (
                        <div
                            key={idx}
                            className="ev-pillar flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--accent-orange)]/20 to-orange-500/10 border-2 border-[var(--accent-orange)]/50 hover:border-[var(--accent-orange)] transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[var(--accent-orange)]/20 cursor-default relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-orange)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="text-2xl relative z-10">{pillar.emoji}</span>
                            <span className="text-sm font-black text-[var(--accent-orange)] uppercase tracking-wider relative z-10">{pillar.label}</span>
                        </div>
                    ))}
                </div>

                {/* Decorative line */}
                <div className="ev-cta-line w-24 h-1 bg-gradient-to-r from-[var(--accent-orange)] to-orange-400 rounded-full mx-auto" />
            </div>
        </section>
    );
};

export default EcosystemVision;
