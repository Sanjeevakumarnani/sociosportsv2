import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Award, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LifeAfterSports = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.las-header > *',
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
                '.las-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.solutions-grid',
                        start: 'top 75%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const solutions = [
        {
            icon: Users,
            title: 'FROM COMPETITOR TO COACH',
            subtitle: 'Transform your experience into expertise',
            description: 'Former athletes become trainers and mentors, building sustainable coaching careers.',
            benefits: [
                'Leverage your sports knowledge',
                'Build recurring income streams',
                'Flexible scheduling',
                'Work with passion',
            ],
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400',
        },
        {
            icon: Target,
            title: 'COMMUNITY-FIRST ECOSYSTEM',
            subtitle: 'Connect beyond competition',
            description: 'Connect with societies, schools, and corporates to host events and wellness programs.',
            benefits: [
                'Corporate wellness programs',
                'School coaching opportunities',
                'Community event hosting',
                'Social impact projects',
            ],
            color: 'from-green-500 to-emerald-600',
            iconBg: 'bg-green-500/20',
            iconColor: 'text-green-400',
        },
        {
            icon: Award,
            title: 'RECOGNITION BEYOND TROPHIES',
            subtitle: 'Skills that translate everywhere',
            description: 'Sports teaches discipline, leadership, resilience, and teamwork. These should open doors, not close them.',
            benefits: [
                'Leadership development',
                'Team management skills',
                'Resilience & mental toughness',
                'Time management mastery',
            ],
            color: 'from-[var(--accent-orange)] to-orange-600',
            iconBg: 'bg-[var(--accent-orange)]/20',
            iconColor: 'text-[var(--accent-orange)]',
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative py-12 md:py-16 bg-[var(--bg-secondary)]"
        >
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Header */}
                <div className="las-header max-w-5xl mx-auto mb-10">
                    <div className="flex items-center gap-3 mb-2 justify-center">
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                        <span className="eyebrow">Career Sustainability</span>
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                    </div>

                    <h2 className="section-title mb-6 text-center text-3xl md:text-4xl">
                        BEYOND MEDALS, <span className="text-gradient">BEYOND COMPETITION</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* The Unseen Reality */}
                        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
                            <h3 className="text-xl font-black text-white mb-3 relative z-10">
                                The Unseen Athlete Reality
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 relative z-10">
                                Behind each champion, thousands struggle financially and professionally.
                            </p>
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 relative z-10">
                                <p className="text-amber-200 text-sm font-medium">
                                    Most end up in unrelated, low-income roles effectively wasting their sports investment.
                                </p>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 flex flex-col justify-center hover:border-amber-500/40 transition-colors">
                                <div className="text-3xl font-black text-amber-500 mb-1">80%</div>
                                <div className="text-xs font-bold text-white">Quit by age 15</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-600/10 border border-indigo-500/20 flex flex-col justify-center hover:border-indigo-500/40 transition-colors">
                                <div className="text-3xl font-black text-indigo-400 mb-1">95%</div>
                                <div className="text-xs font-bold text-white">Don't turn pro</div>
                            </div>
                            <div className="col-span-2 text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 flex flex-col justify-center hover:border-emerald-500/40 transition-colors">
                                <div className="text-2xl font-black text-emerald-400 mb-1">100% Deserve Opportunities</div>
                                <div className="text-xs text-[var(--text-secondary)]">Skills that transfer everywhere</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solutions We're Building */}
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">
                            SOLUTIONS WE'RE <span className="text-gradient">BUILDING</span>
                        </h3>
                    </div>

                    <div className="solutions-grid grid md:grid-cols-3 gap-4">
                        {solutions.map((solution, idx) => {
                            const Icon = solution.icon;
                            return (
                                <div key={idx} className="las-card group">
                                    <div className="bg-[var(--bg-primary)] h-full rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all flex flex-col">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-xl ${solution.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon className={`w-6 h-6 ${solution.iconColor}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-black text-[var(--text-primary)] leading-tight">
                                                    {solution.title}
                                                </h4>
                                                <p className="text-[10px] font-bold text-[var(--accent-orange)] uppercase tracking-wide">
                                                    {solution.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-xs text-[var(--text-secondary)] mb-4 flex-grow">
                                            {solution.description}
                                        </p>

                                        <ul className="grid grid-cols-1 gap-1.5">
                                            {solution.benefits.slice(0, 3).map((benefit, bidx) => (
                                                <li key={bidx} className="flex items-center gap-2 text-[11px] text-[var(--text-primary)]/80">
                                                    <span className="text-green-500 text-xs">✓</span>
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Closing Message */}
                    <div className="mt-8 text-center">
                        <div className="bg-gradient-to-r from-[var(--accent-orange)]/10 to-orange-500/10 border border-[var(--accent-orange)]/20 rounded-2xl p-6 max-w-3xl mx-auto">
                            <p className="text-lg font-black text-[var(--text-primary)] mb-1">
                                80% quit by age 15 not from lost passion, but lost direction.
                            </p>
                            <p className="text-base text-[var(--accent-orange)] font-bold">
                                We're building the direction. 🎯
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LifeAfterSports;
