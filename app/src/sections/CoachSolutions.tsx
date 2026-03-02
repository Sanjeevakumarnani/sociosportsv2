import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    Users,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Target,
    TrendingUp,
    ShieldCheck,
    Zap
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CoachSolutions = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Problem Cards Reveal
            gsap.from('.problem-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.problems-grid',
                    start: 'top 80%',
                }
            });

            // Solution Reveal
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.solution-section',
                    start: 'top 75%',
                }
            });

            tl.from('.solution-header', {
                y: 30,
                opacity: 0,
                duration: 0.6
            })
                .from('.solution-item', {
                    x: -30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1
                }, '-=0.3');

        }, containerRef);

        return () => ctx.revert();
    });

    const problems = [
        {
            target: "For Coaches",
            icon: Users,
            color: "#f97316",
            points: [
                "Limited reach to new athletes",
                "Manual scheduling & payments",
                "Competition from unverified trainers"
            ]
        },
        {
            target: "For Facility Managers",
            icon: Calendar,
            color: "#3b82f6",
            points: [
                "Low utilization during off-peak hours",
                "Fragmented offline booking systems",
                "Lack of marketing visibility"
            ]
        }
    ];

    const solutions = [
        {
            title: "Verified Identity",
            desc: "Stand out with an official SocioSports ID and NIS certification badge.",
            icon: ShieldCheck
        },
        {
            title: "Smart Management",
            desc: "Automate bookings, payments, and schedules with our pro tools.",
            icon: Zap
        },
        {
            title: "Growth Engine",
            desc: "Direct access to 50k+ active athletes looking for training.",
            icon: TrendingUp
        }
    ];

    return (
        <section ref={containerRef} className="py-20 bg-[var(--bg-primary)] px-6">
            <div className="container mx-auto max-w-6xl">

                {/* The Challenge Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <span className="eyebrow text-red-500 mb-2 inline-block">THE CHALLENGE</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                            Breaking The <span className="text-red-500">Barriers</span>
                        </h2>
                    </div>

                    <div className="problems-grid grid md:grid-cols-2 gap-8">
                        {problems.map((prob, idx) => {
                            const Icon = prob.icon;
                            return (
                                <div key={idx} className="problem-card p-6 md:p-8 rounded-[32px] bg-[var(--bg-secondary)] border border-red-500/20 relative overflow-hidden group hover:border-red-500/40 transition-colors">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)]">{prob.target}</h3>
                                    </div>

                                    <ul className="space-y-4 relative z-10">
                                        {prob.points.map((point, pIdx) => (
                                            <li key={pIdx} className="flex items-start gap-3 text-[var(--text-secondary)]">
                                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* The Solution Section */}
                <div className="solution-section bg-[var(--bg-secondary)] rounded-[40px] p-6 md:p-12 border border-[var(--border)] relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="solution-header text-center lg:text-left">
                            <span className="eyebrow text-blue-500 mb-2 inline-block">THE SOLUTION</span>
                            <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">
                                Enter The <span className="text-gradient">Intelligence Hub</span>
                            </h2>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                                SocioSports bridges the gap between talent and infrastructure. We provide the digital backbone that professionalizes your services and connects you with the right audience.
                            </p>
                            <div className="inline-flex items-center gap-2 text-[var(--text-primary)] font-bold text-sm bg-[var(--bg-primary)] px-4 py-2 rounded-full border border-[var(--border)]">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Platform Live for Early Access</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {solutions.map((sol, idx) => {
                                const Icon = sol.icon;
                                return (
                                    <div key={idx} className="solution-item flex items-start gap-5 p-4 rounded-2xl hover:bg-[var(--bg-primary)] transition-colors border border-transparent hover:border-[var(--border)]">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">{sol.title}</h4>
                                            <p className="text-sm text-[var(--text-secondary)]">{sol.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CoachSolutions;
