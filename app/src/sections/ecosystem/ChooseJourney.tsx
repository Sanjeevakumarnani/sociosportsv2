import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ArrowRight,
    Trophy,
    Eye,
    Search,
    Users,
    Calendar,
    TrendingUp,
    Sparkles,
    Shield,
} from 'lucide-react';
import SportsPersonModal from '../../components/SportsPersonModal';

gsap.registerPlugin(ScrollTrigger);

type DefaultIdentity = 'ATHLETE' | 'TRAINER';

const ChooseJourney = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDefaultIdentity, setModalDefaultIdentity] = useState<DefaultIdentity>('ATHLETE');

    const openModal = (identity: DefaultIdentity) => {
        setModalDefaultIdentity(identity);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header
            gsap.fromTo(
                '.cj-header > *',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.7, stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
                }
            );

            // Cards
            gsap.fromTo(
                '.journey-card',
                { opacity: 0, y: 50, rotateY: 8 },
                {
                    opacity: 1, y: 0, rotateY: 0, duration: 0.9, stagger: 0.25,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '.journey-cards-row', start: 'top 80%' },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const journeys = [
        {
            id: 'athlete',
            tag: 'FOR ATHLETES',
            tagIcon: Trophy,
            title: 'Start Your Journey',
            subtitle: 'Build your identity. Get discovered.',
            features: [
                { icon: Shield, text: 'Create your official Sports ID' },
                { icon: Sparkles, text: 'Showcase verified achievements' },
                { icon: Eye, text: 'Get discovered by scouts & sponsors' },
            ],
            cta: 'Start Your Journey',
            defaultIdentity: 'ATHLETE' as DefaultIdentity,
            gradient: 'from-orange-500 to-amber-500',
            glowColor: 'var(--accent-orange)',
            borderColor: 'border-orange-500/20',
            hoverBorder: 'hover:border-orange-500/50',
            tagBg: 'bg-orange-500/15',
            tagText: 'text-orange-500',
            iconBg: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
            ctaClass: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
        },
        {
            id: 'coach',
            tag: 'FOR COACHES',
            tagIcon: Users,
            title: 'Grow Your Academy',
            subtitle: 'Scale your impact. Multiply your income.',
            features: [
                { icon: Search, text: 'Get discovered by athletes & parents' },
                { icon: Calendar, text: 'Manage bookings & scheduling' },
                { icon: TrendingUp, text: 'Grow income with pro tools' },
            ],
            cta: 'Grow Your Academy',
            defaultIdentity: 'TRAINER' as DefaultIdentity,
            gradient: 'from-blue-500 to-cyan-500',
            glowColor: '#3b82f6',
            borderColor: 'border-blue-500/20',
            hoverBorder: 'hover:border-blue-500/50',
            tagBg: 'bg-blue-500/15',
            tagText: 'text-blue-500',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
            ctaClass: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
        },
    ];

    return (
        <section ref={sectionRef} className="relative py-20 md:py-28 bg-[var(--bg-secondary)] overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-transparent to-blue-500 opacity-30" />

            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="cj-header text-center mb-16">
                    <span className="text-[11px] font-black tracking-[0.3em] text-[var(--accent-orange)] uppercase mb-4 block">
                        Your Path Starts Here
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">
                        Choose Your <span className="text-gradient">Journey</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
                        Whether you are an athlete or a coach, SocioSports has a dedicated path built for you.
                    </p>
                </div>

                {/* Two Journey Cards */}
                <div className="journey-cards-row grid lg:grid-cols-2 gap-8 lg:gap-10">
                    {journeys.map((journey) => {
                        const TagIcon = journey.tagIcon;
                        return (
                            <div
                                key={journey.id}
                                className={`journey-card relative group rounded-[32px] bg-[var(--bg-primary)] border-2 ${journey.borderColor} ${journey.hoverBorder} p-8 md:p-10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl overflow-hidden`}
                            >
                                {/* Glow on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[32px]"
                                    style={{
                                        background: `radial-gradient(ellipse at 50% 100%, ${journey.glowColor}12 0%, transparent 70%)`,
                                    }}
                                />

                                {/* Corner gradient */}
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${journey.gradient} opacity-5 rounded-bl-[100px] -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`} />

                                <div className="relative z-10">
                                    {/* Tag */}
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${journey.tagBg} mb-6`}>
                                        <TagIcon className={`w-4 h-4 ${journey.tagText}`} />
                                        <span className={`text-[11px] font-black tracking-[0.2em] ${journey.tagText} uppercase`}>
                                            {journey.tag}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-3">
                                        {journey.title}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-base mb-8 font-medium">
                                        {journey.subtitle}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-5 mb-10">
                                        {journey.features.map((feature, fIdx) => {
                                            const FeatureIcon = feature.icon;
                                            return (
                                                <div key={fIdx} className="flex items-center gap-4 group/item">
                                                    <div className={`w-11 h-11 rounded-xl ${journey.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-3`}>
                                                        <FeatureIcon className={`w-5 h-5 ${journey.iconColor}`} />
                                                    </div>
                                                    <span className="text-[var(--text-primary)] font-semibold text-sm">
                                                        {feature.text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => openModal(journey.defaultIdentity)}
                                        className={`w-full ${journey.ctaClass} text-white font-bold text-sm uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl group/btn cursor-pointer`}
                                    >
                                        <span>{journey.cta}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Registration Modal */}
            <SportsPersonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultIdentity={modalDefaultIdentity}
            />
        </section>
    );
};

export default ChooseJourney;
