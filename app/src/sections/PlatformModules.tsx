import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Star, Calendar, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PlatformModules = () => {
    const sectionRef = useRef<HTMLElement>(null);

    const modules = [
        {
            title: "SPORTS NETWORKING",
            description: "Connect with athletes, form teams, and find sparring partners in your neighborhood.",
            icon: UserPlus,
            color: "#ec4899", // Pink
        },
        {
            title: "TRAINER BOOKING",
            description: "Find NIS-certified coaches for personal training or group sessions. Book slots instantly.",
            icon: Star,
            color: "#3b82f6", // Blue
        },
        {
            title: "SMART CALENDAR",
            description: "Never miss a match. Sync tournaments, practice sessions, and events to your personal schedule.",
            icon: Calendar,
            color: "#eab308", // Yellow
        },
        {
            title: "TOURNAMENT DISCOVERY",
            description: "One-tap registration for local and national tournaments. Track brackets live.",
            icon: Trophy,
            color: "#f97316", // Orange
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.module-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 bg-[var(--bg-primary)] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module, idx) => (
                        <div
                            key={idx}
                            className="module-card group relative p-8 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                        >
                            {/* Icon Box */}
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                                style={{
                                    backgroundColor: `${module.color}10`,
                                    borderColor: `${module.color}30`
                                }}
                            >
                                <module.icon className="w-8 h-8" style={{ color: module.color }} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-black text-[var(--text-primary)] uppercase mb-4 tracking-tighter">
                                {module.title}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 font-medium">
                                {module.description}
                            </p>



                            {/* Glow Effect */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[32px]"
                                style={{
                                    background: `radial-gradient(circle at top right, ${module.color}08 0%, transparent 70%)`
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformModules;
