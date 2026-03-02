import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, CheckCircle, Search, FileCheck, Users, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VerifiedAchievements = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.va-header > *',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                }
            );

            gsap.fromTo(
                '.problem-card',
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: '.problems-grid',
                        start: 'top 75%',
                    },
                }
            );

            gsap.fromTo(
                '.solution-item',
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.solution-list',
                        start: 'top 75%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-12 md:py-20 bg-[var(--bg-primary)]"
        >
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Header */}
                <div className="va-header text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                        <span className="eyebrow">Verification Infrastructure</span>
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
                        BUILDING <span className="text-gradient">TRUST</span>, SAVING <span className="text-gradient">TIME</span>
                    </h2>

                    <p className="section-subtitle max-w-2xl mx-auto mb-0">
                        Professional achievement verification that saves hours and builds confidence
                    </p>
                </div>

                {/* Problems Section */}
                <div className="problems-grid max-w-6xl mx-auto mb-12">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Scout's Problem */}
                        <div className="problem-card bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <Search className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="text-xl font-black text-[var(--text-primary)]">The Selection Bottleneck</h3>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col justify-center">
                                    <p className="text-xs text-[var(--text-primary)]/70 mb-1">Academy Recruiter receives:</p>
                                    <div className="text-2xl font-black text-red-400">47 Candidates</div>
                                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Unverified performance claims</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center flex flex-col justify-center">
                                        <div className="text-lg font-black text-red-400">6-8 hrs</div>
                                        <div className="text-[9px] text-[var(--text-primary)]/80 uppercase tracking-tighter">Manual Checks</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center flex flex-col justify-center">
                                        <div className="text-lg font-black text-red-400">12</div>
                                        <div className="text-[9px] text-[var(--text-primary)]/80 uppercase tracking-tighter">Authenticated</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-red-300 font-bold text-[11px] uppercase tracking-wider">
                                    <span>✗ Unverified</span>
                                    <span>✗ Wasted time</span>
                                    <span>✗ Missed talent</span>
                                </div>
                            </div>
                        </div>

                        {/* Scholarship Crisis */}
                        <div className="problem-card bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-3xl p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <FileCheck className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-black text-[var(--text-primary)]">The Funding Barrier</h3>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col justify-center">
                                    <p className="text-xs text-[var(--text-primary)]/70 mb-2 font-bold">Potential Candidate has:</p>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-primary)]/90">
                                            <span className="text-green-400 text-xs shadow-sm">✓</span>
                                            <span>4yr Performance Records</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-primary)]/90">
                                            <span className="text-green-400 text-xs shadow-sm">✓</span>
                                            <span>Authentic Medals/Awards</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col justify-center">
                                    <p className="text-red-400 font-bold mb-1.5 text-xs">Verification Deadline:</p>
                                    <div className="space-y-1 text-[11px] text-[var(--text-primary)]/80">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-red-400">✗</span>
                                            <span>Physical Paperwork Lost</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-red-400">✗</span>
                                            <span>No digital proof</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                                <p className="text-red-300 font-bold text-[11px] text-center uppercase tracking-wide">
                                    Cannot prove achievements when it matters most
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solution Section */}
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-6">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] mb-1">
                                OUR <span className="text-gradient">SOLUTION</span>
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Professional verification infrastructure from day one
                            </p>
                        </div>

                        {/* Solution Features */}
                        <div className="solution-list grid md:grid-cols-2 gap-3 mb-6">
                            {[
                                {
                                    icon: Shield,
                                    title: 'Platform-verified achievements',
                                    description: 'Every achievement logged, verified, and permanently stored',
                                },
                                {
                                    icon: Users,
                                    title: 'Coach endorsements',
                                    description: 'Professional recommendations from verified trainers',
                                },
                                {
                                    icon: FileCheck,
                                    title: 'Auto-documentation from day one',
                                    description: 'Build your sports resume automatically as you compete',
                                },
                                {
                                    icon: Search,
                                    title: 'Search only verified athletes',
                                    description: 'Scouts find talent with confidence and trust',
                                },
                            ].map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={idx} className="solution-item group">
                                        <div className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border)] hover:border-green-500/30 transition-all">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <Icon className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                                        <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wide">{feature.title}</h4>
                                                    </div>
                                                    <p className="text-[10px] text-[var(--text-secondary)] leading-snug">{feature.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Impact Stats */}
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center flex flex-row items-center justify-center gap-4">
                                <TrendingUp className="w-8 h-8 text-green-400" />
                                <div className="text-left">
                                    <div className="text-2xl font-black text-green-400 leading-none">75%</div>
                                    <div className="text-[10px] font-bold text-[var(--text-primary)] uppercase opacity-80">Time Saved</div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-center flex flex-row items-center justify-center gap-4">
                                <Shield className="w-8 h-8 text-blue-400" />
                                <div className="text-left">
                                    <div className="text-2xl font-black text-blue-400 leading-none">100%</div>
                                    <div className="text-[10px] font-bold text-[var(--text-primary)] uppercase opacity-80">Trust Gain</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerifiedAchievements;
