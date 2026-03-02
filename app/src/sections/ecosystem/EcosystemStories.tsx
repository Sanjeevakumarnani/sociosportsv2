import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, TrendingUp, ChevronLeft, ChevronRight, Trophy, Users, Building2, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EcosystemStories = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeStory, setActiveStory] = useState(0);

    const stories = [
        {
            // Arjun — Athlete
            type: 'athlete',
            typeLabel: 'Athlete',
            typeIcon: Trophy,
            typeColor: '#f97316',
            typeBg: 'bg-orange-500/15',
            name: 'Arjun',
            sport: 'Badminton Player',
            location: 'India',
            image: '/images/athlete_medal_profile.png',
            quote: 'I had 14 medals but zero digital presence. SocioSports changed that overnight — scouts found me within a week.',
            before: {
                title: 'Before SocioSports',
                points: [
                    '14 district-level medals sitting in a drawer',
                    '3 state championship certificates — unverifiable',
                    '127 tournament matches — zero digital proof',
                    'Google search result: Nothing',
                ],
            },
            after: {
                title: 'After SocioSports',
                points: [
                    'Complete verified competition history',
                    'Video highlights indexed & searchable by scouts',
                    'All awards digitally accessible & shareable',
                    'Profile discovered by 500+ scouts & academies',
                ],
            },
            metrics: [
                { value: '14', label: 'Medals Verified', color: 'text-orange-400' },
                { value: '500+', label: 'Scouts Reached', color: 'text-blue-400' },
                { value: '127', label: 'Matches Logged', color: 'text-purple-400' },
                { value: '100%', label: 'Digital Presence', color: 'text-green-400' },
            ],
            timeline: [
                { month: 'Week 1', event: 'Created Sports ID and uploaded achievements' },
                { month: 'Week 2-3', event: 'Profile verified, video highlights indexed' },
                { month: 'Month 2', event: 'Discovered by 3 state academies and 2 sponsors' },
            ],
            highlight: '95% of talented athletes in India have exceptional skill but ZERO digital presence.',
        },
        {
            // Coach Sunitha
            type: 'coach',
            typeLabel: 'Coach',
            typeIcon: Users,
            typeColor: '#3b82f6',
            typeBg: 'bg-blue-500/15',
            name: 'Coach Sunitha',
            sport: 'Badminton Coach',
            location: 'Mumbai',
            image: '/images/success_story.png',
            quote: 'Discovery infrastructure changed my business. Parents can finally find me.',
            before: {
                title: 'Before SocioSports',
                points: [
                    'No online visibility',
                    'Income capped by word-of-mouth',
                    'Struggling to fill training slots',
                    'Limited to local neighborhood only',
                ],
            },
            after: {
                title: 'After 6 Months',
                points: [
                    '22 active students',
                    '5.0★ professional rating',
                    'Income tripled',
                    '85% booking rate from profile views',
                ],
            },
            metrics: [
                { value: '3x', label: 'Income Growth', color: 'text-green-400' },
                { value: '85%', label: 'Booking Rate', color: 'text-blue-400' },
                { value: '2.5x', label: 'More Students', color: 'text-purple-400' },
                { value: '40%', label: 'Better Retention', color: 'text-orange-400' },
            ],
            timeline: [
                { month: 'Month 1', event: 'Created SocioSports profile' },
                { month: 'Months 2-3', event: 'Parents finding her, bookings increased' },
                { month: 'Months 4-6', event: '22 active students, 5.0★ rating' },
            ],
            highlight: 'People trust numbers more than design. Her 3x income growth speaks for itself.',
        },
        {
            // Rajesh Varma — Facility
            type: 'facility',
            typeLabel: 'Facility Owner',
            typeIcon: Building2,
            typeColor: '#8b5cf6',
            typeBg: 'bg-purple-500/15',
            name: 'Rajesh Varma',
            sport: 'Facility Owner',
            location: 'Hyderabad',
            image: '/images/facility_success_story.jpg',
            quote: 'Automated booking and smart venue optimization saved us hundreds of manual hours and filled our empty slots.',
            before: {
                title: 'Before SocioSports',
                points: [
                    '60% off-peak vacancy',
                    'Manual phone bookings only',
                    'Fragmented payment tracking',
                    'Low digital visibility',
                ],
            },
            after: {
                title: 'After 6 Months',
                points: [
                    '92% venue utilization',
                    'Fully automated booking grid',
                    'Revenue grew by 240%',
                    'Top-rated venue in city',
                ],
            },
            metrics: [
                { value: '2.4x', label: 'Revenue Increase', color: 'text-green-400' },
                { value: '92%', label: 'Utilization', color: 'text-blue-400' },
                { value: '150+', label: 'Daily Bookings', color: 'text-purple-400' },
                { value: '0', label: 'Manual Errors', color: 'text-orange-400' },
            ],
            timeline: [
                { month: 'Month 1', event: 'Listed venue on SocioSports' },
                { month: 'Month 2', event: 'Activated Smart Booking Grid' },
                { month: 'Months 3-6', event: '92% utilization reached, 5.0★ rating' },
            ],
            highlight: 'From 60% vacancy to 92% utilization — that\'s the power of digital infrastructure.',
        },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.es-header > *',
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Auto-rotate stories
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStory((prev) => (prev + 1) % stories.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [stories.length]);

    const currentStory = stories[activeStory];
    const TypeIcon = currentStory.typeIcon;

    const nextStory = () => setActiveStory((prev) => (prev + 1) % stories.length);
    const prevStory = () => setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);

    return (
        <section ref={sectionRef} className="relative py-20 md:py-28 bg-[var(--bg-primary)] overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
                style={{ background: `${currentStory.typeColor}08` }} />

            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Header */}
                <div className="es-header text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                        <span className="text-[11px] font-black tracking-[0.3em] text-[var(--accent-orange)] uppercase">Real Transformations</span>
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">
                        Success <span className="text-gradient">Stories</span>
                    </h2>

                    <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                        Real people across the ecosystem — athletes, coaches, and facility owners — all transformed by one platform.
                    </p>
                </div>

                {/* Story Type Pills */}
                <div className="flex justify-center gap-3 mb-12">
                    {stories.map((story, idx) => {
                        const SIcon = story.typeIcon;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveStory(idx)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold transition-all duration-300 ${idx === activeStory
                                    ? 'text-white shadow-lg scale-105'
                                    : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-orange)]/30 hover:text-[var(--text-primary)]'
                                    }`}
                                style={idx === activeStory ? { background: story.typeColor, borderColor: story.typeColor } : {}}
                            >
                                <SIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">{story.name}</span>
                                <span className="sm:hidden">{story.typeLabel}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Story Card */}
                <div className="max-w-6xl mx-auto">
                    <div key={activeStory} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            {/* Left — Image & Quote */}
                            <div>
                                {/* Type badge */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentStory.typeBg} mb-6`}>
                                    <TypeIcon className="w-4 h-4" style={{ color: currentStory.typeColor }} />
                                    <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: currentStory.typeColor }}>
                                        {currentStory.typeLabel} Story
                                    </span>
                                </div>

                                {/* Image */}
                                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] mb-6">
                                    <img
                                        src={currentStory.image}
                                        alt={`${currentStory.name} - Success Story`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Rating Badge */}
                                    <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-white font-bold">5.0</span>
                                    </div>
                                </div>

                                {/* Quote */}
                                <div
                                    className="rounded-2xl p-6 border"
                                    style={{
                                        background: `linear-gradient(135deg, ${currentStory.typeColor}10, ${currentStory.typeColor}05)`,
                                        borderColor: `${currentStory.typeColor}20`,
                                    }}
                                >
                                    <p className="text-lg text-[var(--text-primary)] italic mb-4">"{currentStory.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                                            style={{ background: `linear-gradient(135deg, ${currentStory.typeColor}, ${currentStory.typeColor}cc)` }}
                                        >
                                            {currentStory.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-[var(--text-primary)] font-bold">{currentStory.name}</div>
                                            <div className="text-sm text-[var(--text-secondary)]">
                                                {currentStory.sport} • {currentStory.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right — Journey & Metrics */}
                            <div className="space-y-6">
                                {/* Timeline */}
                                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)]">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" style={{ color: currentStory.typeColor }} />
                                        The Journey
                                    </h3>
                                    <div className="space-y-4">
                                        {currentStory.timeline.map((step, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                                                        style={{
                                                            background: idx === currentStory.timeline.length - 1 ? '#10b981' : currentStory.typeColor,
                                                        }}
                                                    >
                                                        {idx + 1}
                                                    </div>
                                                    {idx < currentStory.timeline.length - 1 && (
                                                        <div className="w-0.5 h-full mt-2" style={{ background: `${currentStory.typeColor}20` }} />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <div className="text-sm font-bold mb-1" style={{ color: currentStory.typeColor }}>
                                                        {step.month}
                                                    </div>
                                                    <div className="text-[var(--text-primary)]">{step.event}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Before & After */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Before */}
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                                        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wide mb-4">
                                            {currentStory.before.title}
                                        </h4>
                                        <div className="space-y-2">
                                            {currentStory.before.points.map((point, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="text-red-400 mt-1 text-xs">✗</span>
                                                    <span className="text-xs text-[var(--text-secondary)]">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* After */}
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                                        <h4 className="text-sm font-bold text-green-400 uppercase tracking-wide mb-4">
                                            {currentStory.after.title}
                                        </h4>
                                        <div className="space-y-2">
                                            {currentStory.after.points.map((point, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="text-green-400 mt-1 text-xs">✓</span>
                                                    <span className="text-xs text-[var(--text-primary)]/80">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div
                                    className="rounded-2xl p-6 border"
                                    style={{
                                        background: `linear-gradient(135deg, ${currentStory.typeColor}10, ${currentStory.typeColor}05)`,
                                        borderColor: `${currentStory.typeColor}20`,
                                    }}
                                >
                                    <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: currentStory.typeColor }}>
                                        Impact Metrics
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {currentStory.metrics.map((metric, idx) => (
                                            <div key={idx} className="text-center p-3 rounded-xl bg-[var(--bg-primary)]/50">
                                                <div className={`text-2xl font-black ${metric.color} mb-1`}>
                                                    {metric.value}
                                                </div>
                                                <div className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">{metric.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Highlight callout */}
                                {currentStory.highlight && (
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                                        <Award className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: currentStory.typeColor }} />
                                        <p className="text-sm text-[var(--text-secondary)] italic">
                                            {currentStory.highlight}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <button
                            onClick={prevStory}
                            className="p-3 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
                        </button>

                        <div className="flex gap-2">
                            {stories.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveStory(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === activeStory ? 'w-8' : 'w-2'
                                        }`}
                                    style={{
                                        background: idx === activeStory ? stories[idx].typeColor : 'var(--border)',
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextStory}
                            className="p-3 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-[var(--text-primary)]" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EcosystemStories;
