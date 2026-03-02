
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LocationDiscovery = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.ld-header > *',
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
                '.ld-card',
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: '.ld-grid',
                        start: 'top 75%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const filters = [
        { icon: '🏸', label: 'Sport', value: 'Badminton, Cricket, Football...' },
        { icon: '📍', label: 'Distance', value: '1km, 3km, 5km, 10km radius' },
        { icon: '👤', label: 'Gender', value: 'Male, Female, Any' },
        { icon: '⭐', label: 'Experience', value: 'Beginner, Intermediate, Expert' },
        { icon: '💰', label: 'Budget', value: '₹500-1000, ₹1000-2000...' },
        { icon: '👧', label: 'Age Group', value: 'Kids, Teens, Adults, Seniors' },
        { icon: '📅', label: 'Availability', value: 'Morning, Evening, Weekend' },
        { icon: '⭐', label: 'Rating', value: '4+ stars, 4.5+ stars' },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative py-20 md:py-32 bg-[var(--bg-secondary)]"
        >
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Header with Problem Statement */}
                <div className="ld-header max-w-4xl mx-auto mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                        <span className="eyebrow">Location-Based Discovery</span>
                    </div>

                    <h2 className="section-title mb-8">
                        THE <span className="text-gradient">2.3 KILOMETER PROBLEM</span>
                    </h2>

                    {/* The Story */}
                    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-8 md:p-12 mb-12">
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                                <p className="text-lg text-[var(--text-primary)]/90 mb-4">
                                    <span className="font-bold text-[var(--text-primary)]">Mrs. Kapoor</span> searching for cricket coach for her son
                                </p>
                                <div className="flex items-center justify-center gap-4 my-6">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                                        <span className="text-2xl">👩</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-1 bg-gradient-to-r from-blue-500/50 via-red-500/50 to-green-500/50 rounded-full relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-red-500 rounded-full text-[10px] font-black text-white">
                                                2.8km
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                        <span className="text-2xl">👨‍🏫</span>
                                    </div>
                                </div>
                                <p className="text-lg text-[var(--text-primary)]/90">
                                    <span className="font-bold text-[var(--text-primary)]">Coach Anil Kumar:</span> 2.8km away
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <span className="text-green-400 font-bold block mb-1">✓</span>
                                    <span className="text-sm text-[var(--text-primary)]">Perfect match</span>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <span className="text-green-400 font-bold block mb-1">✓</span>
                                    <span className="text-sm text-[var(--text-primary)]">Open slots</span>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <span className="text-green-400 font-bold block mb-1">✓</span>
                                    <span className="text-sm text-[var(--text-primary)]">Right experience</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-[var(--border)] text-center">
                                <p className="text-2xl font-black text-[var(--text-primary)] mb-2">They'll never meet.</p>
                                <p className="text-red-400 font-bold">The connection doesn't exist.</p>
                            </div>
                        </div>
                    </div>

                    {/* Discovery Infrastructure */}
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-4">
                            DISCOVERY <span className="text-gradient">INFRASTRUCTURE</span>
                        </h3>
                        <p className="text-xl text-[var(--text-secondary)] font-semibold max-w-2xl mx-auto">
                            Location-based discovery changes everything. Connection multiplies opportunity.
                        </p>
                    </div>
                </div>

                {/* Filter Options */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h4 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-8">
                        Find coaches within radius, filtered by:
                    </h4>

                    <div className="ld-grid grid grid-cols-2 md:grid-cols-4 gap-4">
                        {filters.map((filter, idx) => (
                            <div key={idx} className="ld-card bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{filter.icon}</span>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">
                                            {filter.label}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)]">{filter.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Proximity Examples */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-[var(--accent-orange)]/10 to-orange-500/10 border border-[var(--accent-orange)]/20 rounded-3xl p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin className="w-8 h-8 text-[var(--accent-orange)]" />
                            <h4 className="text-2xl font-black text-[var(--text-primary)]">Within 3km of Coach Sunita's facility:</h4>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]">
                                <span className="text-3xl">👨‍👩‍👧‍👦</span>
                                <p className="text-[var(--text-primary)]">
                                    <span className="font-bold text-green-400">47 parents</span> searching for badminton coach
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]">
                                <span className="text-3xl">👧👦</span>
                                <p className="text-[var(--text-primary)]">
                                    <span className="font-bold text-green-400">23 kids</span> wanting to learn
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[var(--border)] text-center">
                            <p className="text-xl font-black text-[var(--text-primary)] mb-2">Perfect matches exist.</p>
                            <p className="text-lg font-bold text-[var(--accent-orange)]">
                                The connection doesn't. We're building it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationDiscovery;
