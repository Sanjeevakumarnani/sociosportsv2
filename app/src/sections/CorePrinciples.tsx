import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Heart, Briefcase, Home, ShieldCheck, Activity, Smile, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CorePrinciples = () => {
    const sectionRef = useRef<HTMLElement>(null);

    const principles = [
        {
            icon: Users,
            color: "#FF4D2E", // Orange
            title: "Every Athlete Matters",
            description: "Sports should not reward only medal winners. Every athlete and trainer deserves visibility, dignity, and opportunity."
        },
        {
            icon: Heart,
            color: "#ec4899", // Pink
            title: "Sports Beyond Medals",
            description: "We believe sports is not just about winning—it is about health, character, livelihood, and lifelong growth."
        },
        {
            icon: Briefcase,
            color: "#3b82f6", // Blue
            title: "Employment Through Sports",
            description: "Sports must create sustainable income and career pathways, not just competitions."
        },
        {
            icon: Home,
            color: "#10b981", // Green
            title: "Grassroots First",
            description: "Real sports development starts at the community level—societies, schools, colleges, and local grounds."
        },
        {
            icon: ShieldCheck,
            color: "#06b6d4", // Cyan
            title: "Digital Identity & Transparency",
            description: "Every sportsperson should have a verified digital identity and lifelong sports record for structured recognition and governance."
        },
        {
            icon: Activity,
            color: "#ef4444", // Red
            title: "Health Through Participation",
            description: "Sports is preventive healthcare. Active communities are healthier, happier, and more connected."
        },
        {
            icon: Smile,
            color: "#8b5cf6", // Purple
            title: "Inclusivity Across Ages",
            description: "All sports should be for all, Kids, adults, and seniors—all deserve access to sports and physical engagement."
        },
        {
            icon: Globe,
            color: "#6366f1", // Indigo
            title: "Community Before Competition",
            description: "Strong communities create strong athletes. Engagement comes before excellence."
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.principle-card',
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

            gsap.fromTo(
                '.section-title',
                { opacity: 0, y: -20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
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
        <section ref={sectionRef} className="py-20 md:py-32 bg-[var(--bg-primary)] relative overflow-hidden">
            {/* Background Elements if needed, keeping it clean as per screenshot */}
            <div className="container mx-auto px-6 lg:px-8">

                <div className="text-center mb-16 section-title">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter">
                        BUILT ON <span className="text-[var(--accent-orange)]">CORE PRINCIPLES</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {principles.map((item, idx) => (
                        <div
                            key={idx}
                            className="principle-card p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-orange)]/30 transition-colors duration-300 group"
                        >
                            <div className="mb-6 inline-flex p-3 rounded-xl bg-opacity-10" style={{ backgroundColor: `${item.color}15` }}>
                                <item.icon className="w-8 h-8" style={{ color: item.color }} />
                            </div>

                            <h3 className="text-xl font-black text-[var(--text-primary)] uppercase mb-4 tracking-tight leading-none group-hover:text-[var(--accent-orange)] transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CorePrinciples;
