import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Building2, AlertCircle, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EcosystemProblems = () => {
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header reveal
            gsap.fromTo(
                '.ep-header > *',
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
                }
            );

            // Cards stagger
            gsap.fromTo(
                '.gap-card',
                { opacity: 0, y: 60, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.2,
                    ease: 'back.out(1.4)',
                    scrollTrigger: { trigger: '.gap-cards-grid', start: 'top 80%' },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const gaps = [
        {
            icon: Trophy,
            label: 'Athletes',
            link: '/athletes',
            color: '#f97316',
            bgGlow: 'from-orange-500/20 to-orange-600/5',
            borderColor: 'border-orange-500/30',
            hoverBorder: 'hover:border-orange-500/60',
            iconBg: 'bg-orange-500/15',
            iconColor: 'text-orange-500',
            problems: [
                { title: 'No Visibility', desc: 'Medals sitting in drawers — scouts can\'t find you if you\'re not online.' },
                { title: 'No Verified Record', desc: 'Certificates lost, achievements unproven — your career exists only in memory.' },
            ],
        },
        {
            icon: Users,
            label: 'Coaches',
            link: '/coaches',
            color: '#3b82f6',
            bgGlow: 'from-blue-500/20 to-blue-600/5',
            borderColor: 'border-blue-500/30',
            hoverBorder: 'hover:border-blue-500/60',
            iconBg: 'bg-blue-500/15',
            iconColor: 'text-blue-500',
            problems: [
                { title: 'Hard to Find Students', desc: 'Limited reach beyond word-of-mouth — your expertise stays hidden.' },
                { title: 'Income Inconsistent', desc: 'Manual scheduling, irregular bookings — no system to grow reliably.' },
            ],
        },
        {
            icon: Building2,
            label: 'Facilities',
            link: '/institutions',
            color: '#8b5cf6',
            bgGlow: 'from-purple-500/20 to-purple-600/5',
            borderColor: 'border-purple-500/30',
            hoverBorder: 'hover:border-purple-500/60',
            iconBg: 'bg-purple-500/15',
            iconColor: 'text-purple-500',
            problems: [
                { title: 'Low Utilization', desc: 'Empty slots during off-peak hours — wasted potential and revenue.' },
                { title: 'Fragmented Bookings', desc: 'Phone calls, WhatsApp, walk-ins — no unified system to manage demand.' },
            ],
        },
    ];

    return (
        <section ref={sectionRef} className="relative py-20 md:py-28 bg-[var(--bg-secondary)] overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="ep-header text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] font-black tracking-[0.3em] text-red-500 uppercase">The Reality</span>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6 leading-tight">
                        <span className="india-flag-text">India's</span> Sports Ecosystem Has{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">3 Big Gaps</span>
                    </h2>

                    <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
                        Talent exists. Infrastructure exists. But the connection layer is broken. Here's what's holding everyone back.
                    </p>
                </div>

                {/* 3 Gap Cards */}
                <div className="gap-cards-grid grid md:grid-cols-3 gap-6 lg:gap-8">
                    {gaps.map((gap, idx) => {
                        const Icon = gap.icon;
                        return (
                            <div
                                key={idx}
                                className={`gap-card relative group rounded-[28px] bg-gradient-to-br ${gap.bgGlow} border ${gap.borderColor} ${gap.hoverBorder} p-7 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default overflow-hidden`}
                            >
                                {/* Glow effect on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle at 50% 0%, ${gap.color}15 0%, transparent 70%)`,
                                    }}
                                />

                                {/* Icon + Label */}
                                <div className="relative z-10 flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${gap.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon className={`w-7 h-7 ${gap.iconColor}`} />
                                    </div>
                                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                                        {gap.label}
                                    </h3>
                                </div>

                                {/* Problem Points */}
                                <div className="relative z-10 space-y-5">
                                    {gap.problems.map((problem, pIdx) => (
                                        <div key={pIdx} className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                                                    {problem.title}
                                                </h4>
                                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                                    {problem.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Explore More Option */}
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <button
                                        onClick={() => navigate(gap.link, { state: { fromGap: gap.label === 'Athletes' } })}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group/btn"
                                        style={{ color: gap.color }}
                                    >
                                        Explore More
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 group-hover/btn:bg-white/10 transition-colors">
                                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default EcosystemProblems;
