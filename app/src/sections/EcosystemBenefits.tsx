import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Bookmark, TrendingUp, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EcosystemBenefits = () => {
    const sectionRef = useRef<HTMLElement>(null);

    const benefits = [
        {
            title: "CONNECT INSTANTLY",
            description: "Join thousands of athletes and coaches in your area",
            icon: Users
        },
        {
            title: "ACHIEVE GOALS",
            description: "Track progress and celebrate every milestone together",
            icon: Bookmark
        },
        {
            title: "GROW FASTER",
            description: "Learn from experts and reach your potential quicker",
            icon: TrendingUp
        },
        {
            title: "GET DISCOVERED",
            description: "Build your verified sports profile and get seen by scouts",
            icon: Trophy
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.benefit-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="pb-24 bg-[var(--bg-primary)] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, idx) => (
                        <div
                            key={idx}
                            className="benefit-card group p-10 rounded-[32px] bg-[var(--bg-secondary)] border border-white/5 hover:border-[var(--accent-orange)]/20 transition-all duration-500"
                        >
                            <benefit.icon className="w-10 h-10 text-[var(--accent-orange)] mb-8 transition-transform duration-500 group-hover:scale-110" />

                            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase mb-4 tracking-tighter">
                                {benefit.title}
                            </h3>

                            <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EcosystemBenefits;
