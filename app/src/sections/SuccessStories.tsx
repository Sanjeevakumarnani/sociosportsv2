import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SuccessStories = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeStory, setActiveStory] = useState(0);

    const stories = [
        {
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
                { value: '3x', label: 'Income growth', color: 'text-green-400' },
                { value: '85%', label: 'Booking rate', color: 'text-blue-400' },
                { value: '2.5x', label: 'More students', color: 'text-purple-400' },
                { value: '40%', label: 'Better retention', color: 'text-[var(--accent-orange)]' },
            ],
            timeline: [
                { month: 'Month 1', event: 'Created SocioSports profile' },
                { month: 'Months 2-3', event: 'Parents finding her, bookings increased' },
                { month: 'Months 4-6', event: '22 active students, 5.0★ rating' },
            ],
        },
        {
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
                { value: '2.4x', label: 'Revenue increase', color: 'text-green-400' },
                { value: '92%', label: 'Utilization', color: 'text-blue-400' },
                { value: '150+', label: 'Daily bookings', color: 'text-purple-400' },
                { value: '0', label: 'Manual errors', color: 'text-[var(--accent-orange)]' },
            ],
            timeline: [
                { month: 'Month 1', event: 'Listed venue on SocioSports' },
                { month: 'Month 2', event: 'Activated Smart Booking Grid' },
                { month: 'Months 3-6', event: '92% utilization reached, 5.0★ rating' },
            ],
        },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.ss-header > *',
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
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const currentStory = stories[activeStory];

    const nextStory = () => {
        setActiveStory((prev) => (prev + 1) % stories.length);
    };

    const prevStory = () => {
        setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
    };

    return (
        <section
            ref={sectionRef}
            className="relative py-20 md:py-32 bg-[var(--bg-primary)]"
        >
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Header */}
                <div className="ss-header text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                        <span className="eyebrow">Real Transformations</span>
                        <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                    </div>

                    <h2 className="section-title mb-6">
                        SUCCESS <span className="text-gradient">STORIES</span>
                    </h2>

                    <p className="section-subtitle max-w-2xl mx-auto">
                        Real people. Real growth. Real impact. See how SocioSports transforms sports careers.
                    </p>
                </div>

                {/* Story Card */}
                <div className="max-w-6xl mx-auto">
                    <div key={activeStory} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left - Image & Quote */}
                            <div>
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
                                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                                    <p className="text-lg text-[var(--text-primary)] italic mb-4">"{currentStory.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-orange)] to-orange-600 flex items-center justify-center text-white font-bold">
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

                            {/* Right - Journey & Metrics */}
                            <div className="space-y-8">
                                {/* Timeline */}
                                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)]">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-[var(--accent-orange)]" />
                                        The Journey
                                    </h3>
                                    <div className="space-y-4">
                                        {currentStory.timeline.map((step, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full ${idx === currentStory.timeline.length - 1 ? 'bg-green-500' : 'bg-[var(--accent-orange)]'} flex items-center justify-center text-white font-bold text-sm`}>
                                                        {idx + 1}
                                                    </div>
                                                    {idx < currentStory.timeline.length - 1 && (
                                                        <div className="w-0.5 h-full bg-white/10 mt-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <div className="text-sm font-bold text-[var(--accent-orange)] mb-1">
                                                        {step.month}
                                                    </div>
                                                    <div className="text-[var(--text-primary)]">{step.event}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Before & After */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Before */}
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                                        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wide mb-4">
                                            {currentStory.before.title}
                                        </h4>
                                        <div className="space-y-2">
                                            {currentStory.before.points.map((point, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="text-red-400 mt-1">✗</span>
                                                    <span className="text-sm text-[var(--text-primary)]/80">{point}</span>
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
                                                    <span className="text-green-400 mt-1">✓</span>
                                                    <span className="text-sm text-[var(--text-primary)]/80">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="bg-gradient-to-r from-[var(--accent-orange)]/10 to-orange-500/10 border border-[var(--accent-orange)]/20 rounded-2xl p-6">
                                    <h4 className="text-sm font-bold text-[var(--accent-orange)] uppercase tracking-wide mb-4">
                                        Impact Metrics
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {currentStory.metrics.map((metric, idx) => (
                                            <div key={idx} className="text-center p-3 rounded-xl bg-[var(--bg-primary)]/50">
                                                <div className={`text-3xl font-black ${metric.color} mb-1`}>
                                                    {metric.value}
                                                </div>
                                                <div className="text-xs text-[var(--text-secondary)]">{metric.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation (if multiple stories) */}
                    {stories.length > 1 && (
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
                                        className={`w-2 h-2 rounded-full transition-all ${idx === activeStory ? 'bg-[var(--accent-orange)] w-8' : 'bg-[var(--border)]'}`}
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
                    )}
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;
