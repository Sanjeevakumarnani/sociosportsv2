import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Animated counter hook
const useCountUp = (end: number, trigger: boolean, duration = 2000) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!trigger) return;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            setCount(Math.floor(eased * end));
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [trigger, end, duration]);

    return count;
};

const EcosystemImpact = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header
            gsap.fromTo(
                '.ei-header > *',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.7, stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
                }
            );

            // Metrics reveal
            gsap.fromTo(
                '.impact-metric',
                { opacity: 0, y: 40, scale: 0.9 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12,
                    ease: 'back.out(1.3)',
                    scrollTrigger: {
                        trigger: '.impact-metrics-grid',
                        start: 'top 80%',
                        onEnter: () => setIsVisible(true),
                    },
                }
            );

            // Before/After cards
            gsap.fromTo(
                '.ba-card',
                { opacity: 0, x: (idx: number) => idx === 0 ? -40 : 40 },
                {
                    opacity: 1, x: 0, duration: 0.8, stagger: 0.2,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: '.ba-section', start: 'top 80%' },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const metrics = [
        { value: 3, suffix: 'x', label: 'Income Growth', sub: 'For coaches', color: '#10b981', emoji: '💰' },
        { value: 85, suffix: '%', label: 'Booking Rate', sub: 'For coaches', color: '#3b82f6', emoji: '📅' },
        { value: 500, suffix: '+', label: 'Scouts Searching', sub: 'For athletes', color: '#f97316', emoji: '🔍' },
        { value: 3, suffix: 'k+', label: 'Academies', sub: 'For athletes', color: '#8b5cf6', emoji: '🏫' },
        { value: 92, suffix: '%', label: 'Venue Utilization', sub: 'For facilities', color: '#ec4899', emoji: '🏟️' },
    ];

    const count0 = useCountUp(metrics[0].value, isVisible);
    const count1 = useCountUp(metrics[1].value, isVisible);
    const count2 = useCountUp(metrics[2].value, isVisible);
    const count3 = useCountUp(metrics[3].value, isVisible);
    const count4 = useCountUp(metrics[4].value, isVisible);
    const countValues = [count0, count1, count2, count3, count4];

    const beforeAfter = {
        before: [
            'No online visibility',
            'Income capped by word-of-mouth',
            'Struggling to fill training slots',
            'Manual scheduling & bookings',
        ],
        after: [
            '3x income growth in 6 months',
            '85% booking rate from profile views',
            '22 active students enrolled',
            'Automated scheduling & payments',
        ],
    };

    return (
        <section ref={sectionRef} className="relative py-20 md:py-28 bg-[var(--bg-secondary)] overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-orange)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                {/* Header */}
                <div className="ei-header text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-[11px] font-black tracking-[0.3em] text-green-500 uppercase">Proven Results</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">
                        Real <span className="text-gradient">Impact</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
                        Numbers don't lie. Here's how SocioSports transforms careers across the ecosystem.
                    </p>
                </div>

                {/* Impact Metrics Grid */}
                <div className="impact-metrics-grid grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
                    {metrics.map((metric, idx) => (
                        <div
                            key={idx}
                            className="impact-metric group relative rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] p-5 text-center hover:border-[var(--accent-orange)]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default overflow-hidden"
                        >
                            {/* Subtle glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at 50% 100%, ${metric.color}10 0%, transparent 70%)` }}
                            />

                            <span className="text-2xl mb-2 block">{metric.emoji}</span>
                            <div className="text-3xl md:text-4xl font-black mb-1 relative z-10" style={{ color: metric.color }}>
                                {countValues[idx]}{metric.suffix}
                            </div>
                            <div className="text-sm font-bold text-[var(--text-primary)] mb-1 relative z-10">{metric.label}</div>
                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold relative z-10">{metric.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Before vs After */}
                <div className="ba-section grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Before */}
                    <div className="ba-card rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 p-7 hover:border-red-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                                <ArrowDown className="w-5 h-5 text-red-500" />
                            </div>
                            <h3 className="text-lg font-black text-red-400 uppercase tracking-tight">Before SocioSports</h3>
                        </div>
                        <div className="space-y-3">
                            {beforeAfter.before.map((point, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <span className="text-red-400 mt-0.5 font-bold">✗</span>
                                    <span className="text-sm text-[var(--text-secondary)]">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* After */}
                    <div className="ba-card rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-7 hover:border-green-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                                <ArrowUp className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-lg font-black text-green-400 uppercase tracking-tight">After SocioSports</h3>
                        </div>
                        <div className="space-y-3">
                            {beforeAfter.after.map((point, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <span className="text-green-400 mt-0.5 font-bold">✓</span>
                                    <span className="text-sm text-[var(--text-primary)]">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EcosystemImpact;
