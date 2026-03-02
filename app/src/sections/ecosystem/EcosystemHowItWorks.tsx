import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, ShieldCheck, Handshake, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EcosystemHowItWorks = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header
            gsap.fromTo(
                '.ehw-header > *',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.7, stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
                }
            );

            // Steps stagger
            gsap.fromTo(
                '.hiw-step',
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.7, stagger: 0.2,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: '.hiw-steps-row', start: 'top 80%' },
                }
            );

            // Connector lines
            gsap.fromTo(
                '.hiw-connector',
                { scaleX: 0 },
                {
                    scaleX: 1, duration: 0.6, stagger: 0.2, delay: 0.5,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: '.hiw-steps-row', start: 'top 80%' },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const steps = [
        {
            num: '01',
            icon: UserPlus,
            title: 'Create Your Profile',
            desc: 'Sign up as an athlete, coach, or facility manager. Build your verified digital presence.',
            color: '#f97316',
        },
        {
            num: '02',
            icon: ShieldCheck,
            title: 'Get Verified',
            desc: 'Complete verification to earn trust badges. Stand out with authenticated credentials.',
            color: '#3b82f6',
        },
        {
            num: '03',
            icon: Handshake,
            title: 'Connect & Collaborate',
            desc: 'Discover athletes, coaches, venues, and events. Build meaningful connections.',
            color: '#8b5cf6',
        },
        {
            num: '04',
            icon: Rocket,
            title: 'Grow & Succeed',
            desc: 'Scale your career or business with analytics, bookings, and ecosystem support.',
            color: '#10b981',
        },
    ];

    return (
        <section ref={sectionRef} className="relative py-20 md:py-28 bg-[var(--bg-primary)] overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="ehw-header text-center mb-16">
                    <span className="text-[11px] font-black tracking-[0.3em] text-[var(--accent-orange)] uppercase mb-4 block">
                        Simple & Powerful
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
                        Four simple steps to transform your sports career — whether you play, train, or manage.
                    </p>
                </div>

                {/* Steps - Horizontal on desktop, Vertical on mobile */}
                <div className="hiw-steps-row grid grid-cols-1 md:grid-cols-4 gap-0 relative">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div key={idx} className="relative flex flex-col items-center">
                                {/* Step Card */}
                                <div className="hiw-step relative z-10 flex flex-col items-center text-center px-4 py-6 group">
                                    {/* Number Circle */}
                                    <div
                                        className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl relative overflow-hidden"
                                        style={{ background: `${step.color}15`, border: `2px solid ${step.color}30` }}
                                    >
                                        {/* Glow */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `radial-gradient(circle, ${step.color}20 0%, transparent 70%)` }}
                                        />
                                        <Icon className="w-8 h-8 relative z-10" style={{ color: step.color }} />
                                    </div>

                                    {/* Step Number */}
                                    <span
                                        className="text-[10px] font-black tracking-[0.3em] uppercase mb-2"
                                        style={{ color: step.color }}
                                    >
                                        Step {step.num}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[200px]">
                                        {step.desc}
                                    </p>
                                </div>

                                {/* Connector line (hidden on last item and on mobile) */}
                                {idx < steps.length - 1 && (
                                    <div className="hiw-connector hidden md:block absolute top-10 left-[60%] right-0 w-full h-0.5 origin-left z-0"
                                        style={{
                                            background: `linear-gradient(to right, ${step.color}40, ${steps[idx + 1].color}40)`,
                                        }}
                                    />
                                )}

                                {/* Mobile vertical connector */}
                                {idx < steps.length - 1 && (
                                    <div className="md:hidden w-0.5 h-8 mx-auto mb-2"
                                        style={{ background: `linear-gradient(to bottom, ${step.color}40, ${steps[idx + 1].color}40)` }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default EcosystemHowItWorks;
