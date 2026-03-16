import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Dumbbell, Medal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import SearchModal from '../components/SearchModal';

gsap.registerPlugin(ScrollTrigger);

const Ecosystem = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [loading, setLoading] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [cards, setCards] = useState([
        {
            title: "Sports Networking",
            subtitle: "Connect & Collaborate",
            description: "Build meaningful connections with athletes, coaches, academies, and sports professionals across India. Grow your network, discover events, and unlock opportunities.",
            iconName: "Users",
            color: "#FF4D2E",
            link: "/community",
            cta: "Explore Network",
            features: ["Find athletes & coaches near you", "Join sports communities & groups", "Discover events & tournaments"]
        },
        {
            title: "Trainer Ecosystem",
            subtitle: "Coach. Inspire. Transform.",
            description: "Showcase your coaching expertise to a nationwide audience. Get discovered by students and institutions, manage your sessions, and build your professional reputation.",
            iconName: "Dumbbell",
            color: "#3b82f6",
            link: "/coaches",
            cta: "Become a Trainer",
            features: ["Build a certified coaching profile", "Connect with students & academies", "Manage bookings & sessions"]
        },
        {
            title: "Athlete Ecosystem",
            subtitle: "Perform. Shine. Succeed.",
            description: "Create your digital sports identity. Showcase achievements, share video highlights, and get noticed by scouts, recruiters, and selection committees.",
            iconName: "Medal",
            color: "#10b981",
            link: "/athletes",
            cta: "Create Profile",
            features: ["Build your sports portfolio", "Upload performance highlights", "Get noticed by scouts & recruiters"]
        }
    ]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await api.cms.get('home-ecosystem');
                if (data && data.content) {
                    const content = JSON.parse(data.content);
                    if (content.cards) setCards(content.cards);
                }
            } catch (error) {
                console.error('Failed to load ecosystem content', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        if (loading) return;

        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    '.eco-card',
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 75%',
                        }
                    }
                );

                gsap.fromTo(
                    '.eco-title',
                    { opacity: 0, y: 30 },
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
        }, 100);

        return () => clearTimeout(timer);
    }, [loading]);

    const getIcon = (name: string) => {
        switch (name) {
            case 'Users': return Users;
            case 'Dumbbell': return Dumbbell;
            case 'Medal': return Medal;
            default: return Users;
        }
    };

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}>
            <div className="container mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 eco-title">
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="w-10 h-0.5 bg-[var(--accent-orange)]" />
                        <span className="eyebrow tracking-widest text-[var(--accent-orange)]">THREE PILLARS</span>
                        <div className="w-10 h-0.5 bg-[var(--accent-orange)]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tighter">
                        THE SPORTS <span className="text-gradient">ECOSYSTEM</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] font-medium text-lg leading-relaxed">
                        Three interconnected ecosystems powering India's sports community – for networking, coaching, and athletic growth.
                    </p>
                </div>

                {/* Cards Grid – White Theme */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
                    {cards.map((card, idx) => {
                        const Icon = getIcon(card.iconName);

                        return (
                            <Link
                                to={card.link}
                                key={idx}
                                aria-label={`Explore the ${card.title}`}
                                className="eco-card group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                            >
                                {/* Top Color Bar */}
                                <div
                                    className="h-1.5 w-full transition-all duration-500 group-hover:h-2"
                                    style={{ background: card.color }}
                                />

                                <div className="p-8 md:p-10">
                                    {/* Icon */}
                                    <div className="mb-8">
                                        <div
                                            className="inline-flex w-16 h-16 rounded-2xl items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                            style={{
                                                background: `${card.color}15`,
                                                border: `1px solid ${card.color}30`,
                                            }}
                                        >
                                            <Icon className="w-8 h-8" style={{ color: card.color }} />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {card.title}
                                    </h3>

                                    {/* Subtitle */}
                                    <p
                                        className="text-xs font-bold uppercase tracking-widest mb-5"
                                        style={{ color: card.color }}
                                    >
                                        {card.subtitle}
                                    </p>

                                    {/* Description */}
                                    <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-sm">
                                        {card.description}
                                    </p>

                                    {/* Feature List */}
                                    <ul className="mb-8 space-y-4">
                                        {card.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-3 text-sm text-white/90 font-medium"
                                            >
                                                <div
                                                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{ background: `${card.color}20` }}
                                                >
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ background: card.color }}
                                                    />
                                                </div>
                                                <span className="leading-snug">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <div
                                        className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 group-hover:gap-5"
                                        style={{ color: card.color, cursor: card.title === 'Sports Networking' ? 'pointer' : 'inherit' }}
                                        onClick={(e) => {
                                            if (card.title === 'Sports Networking') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsSearchOpen(true);
                                            }
                                        }}
                                    >
                                        <span>{card.cta}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                                    </div>
                                </div>

                                {/* Hover glow effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"
                                    style={{
                                        background: `radial-gradient(ellipse at top, ${card.color}08 0%, transparent 70%)`,
                                    }}
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </section>
    );
};

export default Ecosystem;
