import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Target,
    Calendar,
    TrendingUp,
    Award,
    Users,
    Megaphone,
    ArrowRight,
    MapPin,
    UserCheck,
    UserPlus,
    Trophy,
    BadgeCheck,
    CreditCard,
    Search,
    Clock,
    ShieldCheck,
    BarChart3,
    Zap,
    LayoutDashboard,
    FileText,
    Share2,
    Briefcase,
    PieChart,
    Building2,
    Medal
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DesignedForEveryone = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    const segments = [
        {
            title: "For Athletes & Enthusiasts",
            shortTitle: "Athletes",
            icon: Target,
            color: "#f97316",
            image: "/images/athletes_segment_bg.jpg",
            link: "/athletes",
            cta: "Join as Athlete",
            benefits: [
                { icon: MapPin, text: "500+ Verified Venues", subtext: "Play anywhere" },
                { icon: UserCheck, text: "Digital Sports ID", subtext: "Track progress" },
                { icon: UserPlus, text: "Find Partners", subtext: "Match skill levels" },
                { icon: Trophy, text: "Join Tournaments", subtext: "Compete locally" },
                { icon: BadgeCheck, text: "No Hidden Costs", subtext: "Transparent pricing" },
                { icon: Medal, text: "Rankings & Stats", subtext: "Compete nationally" }
            ]
        },
        {
            title: "For Tournaments & Events",
            shortTitle: "Events",
            icon: Calendar,
            color: "#3b82f6",
            image: "/images/organizers_segment_bg.jpg",
            link: "/events",
            cta: "Book Your Event",
            benefits: [
                { icon: Search, text: "Easy Discovery", subtext: "Find local events" },
                { icon: Clock, text: "Live Scoring", subtext: "Real-time updates" },
                { icon: CreditCard, text: "Instant Booking", subtext: "Secure payments" },
                { icon: BarChart3, text: "Stats Tracking", subtext: "Performance history" },
                { icon: ShieldCheck, text: "Verified Events", subtext: "Safe participation" },
                { icon: LayoutDashboard, text: "Event Microsites", subtext: "Professional page" }
            ]
        },
        {
            title: "For Facility Owners",
            shortTitle: "Owners",
            icon: TrendingUp,
            color: "#10b981",
            image: "/images/facilities_segment_bg.jpg",
            link: "/partners",
            cta: "List Your Facility",
            benefits: [
                { icon: TrendingUp, text: "+40% Utilization", subtext: "Maximize bookings" },
                { icon: Zap, text: "Dynamic Pricing", subtext: "Optimize revenue" },
                { icon: LayoutDashboard, text: "Smart Dashboard", subtext: "Manage everything" },
                { icon: CreditCard, text: "Instant Payouts", subtext: "Secure gateway" },
                { icon: Megaphone, text: "Free Marketing", subtext: "Reach 50k+ users" },
                { icon: PieChart, text: "Inventory Control", subtext: "Stock management" }
            ]
        },
        {
            title: "For Coaches & Trainers",
            shortTitle: "Coaches",
            icon: Award,
            color: "#8b5cf6",
            image: "/images/coaches_segment_bg.jpg",
            link: "/coaches",
            cta: "Join as Coach",
            benefits: [
                { icon: FileText, text: "Pro Profile", subtext: "Showcase skills" },
                { icon: Calendar, text: "Easy Scheduling", subtext: "Manage sessions" },
                { icon: BarChart3, text: "Athlete Data", subtext: "Track clients" },
                { icon: Share2, text: "Brand Building", subtext: "Grow audience" },
                { icon: UserPlus, text: "New Clients", subtext: "Consistent leads" },
                { icon: CreditCard, text: "Automated Billing", subtext: "No more chasing" }
            ]
        },
        {
            title: "For Corporate & Communities",
            shortTitle: "Corporate",
            icon: Users,
            color: "#ec4899",
            image: "/images/corporate_segment_bg.jpg",
            link: "/community",
            cta: "Explore Solutions",
            benefits: [
                { icon: Briefcase, text: "Turnkey Sports Days", subtext: "Full organization" },
                { icon: Award, text: "Group Rates", subtext: "Exclusive discounts" },
                { icon: BarChart3, text: "Wellness Tracking", subtext: "Employee health" },
                { icon: Building2, text: "Private Leagues", subtext: "Community engagement" },
                { icon: Trophy, text: "Custom Awards", subtext: "Branded experience" },
                { icon: ShieldCheck, text: "Fully Insured", subtext: "Liability covered" }
            ]
        },
        {
            title: "For Brands & Sponsors",
            shortTitle: "Brands",
            icon: Megaphone,
            color: "#f43f5e",
            image: "/images/sponsors_segment_bg.jpg",
            link: "/contact",
            cta: "Contact Us",
            benefits: [
                { icon: Target, text: "Targeted Reach", subtext: "50k+ enthusiasts" },
                { icon: PieChart, text: "Deep Analytics", subtext: "Measure ROI" },
                { icon: Share2, text: "Omnichannel", subtext: "Digital & physical" },
                { icon: Award, text: "Brand Impact", subtext: "Community trust" },
                { icon: Medal, text: "Flexible Tiers", subtext: "Fit any budget" },
                { icon: Building2, text: "Physical Presence", subtext: "On-ground banners" }
            ]
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.dfe-fade-in',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-[var(--bg-primary)] overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12 dfe-fade-in">
                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tighter">
                        DESIGNED FOR <span className="text-gradient">EVERYONE</span>
                    </h2>
                </div>

                {/* Tags Navigation */}
                <div className="dfe-fade-in mb-16 px-2 overflow-hidden">
                    <div className="flex flex-nowrap justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 w-full">
                        {segments.map((segment: any, idx) => {
                            const Icon = segment.icon;
                            const isActive = activeTab === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`flex items-center gap-1 md:gap-2 px-1.5 sm:px-3 md:px-5 py-2 md:py-2.5 rounded-full border transition-all duration-300 text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap ${isActive
                                        ? 'bg-white text-black border-white font-bold shadow-lg scale-105'
                                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <Icon className={`hidden xs:block w-3 h-3 md:w-4 md:h-4 ${isActive ? 'text-black' : ''}`} style={{ color: isActive ? undefined : segment.color }} />
                                    <span>{segment.shortTitle}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative min-h-[500px] md:min-h-[400px] dfe-fade-in">
                    {segments.map((segment, idx) => {
                        if (idx !== activeTab) return null;
                        const Icon = segment.icon;

                        return (
                            <div
                                key={idx}
                                className="animate-in fade-in zoom-in-95 duration-500 flex flex-col md:flex-row rounded-[32px] overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl"
                            >
                                {/* Left: Image Side */}
                                <div className="w-full md:w-5/12 relative h-64 md:h-auto min-h-[300px]">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                        style={{ backgroundImage: `url(${segment.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

                                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10 pr-6">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-xl">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="text-3xl font-black leading-tight">{segment.title}</h4>
                                    </div>
                                </div>

                                {/* Right: Content Side */}
                                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="mb-8">
                                        <h5 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                                            <span className="w-8 h-1 rounded-full" style={{ backgroundColor: segment.color }}></span>
                                            KEY BENEFITS
                                        </h5>

                                        {/* Grid Layout for Benefits */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {segment.benefits.map((benefit, bidx) => {
                                                const BenefitIcon = benefit.icon;
                                                return (
                                                    <div key={bidx} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border)] hover:border-[var(--text-primary)]/30 transition-colors">
                                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-secondary)] shrink-0">
                                                            <BenefitIcon className="w-5 h-5" style={{ color: segment.color }} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-[var(--text-primary)] text-sm">{benefit.text}</div>
                                                            <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">{benefit.subtext}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => navigate(segment.link)}
                                            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-fit"
                                            style={{ backgroundColor: segment.color }}
                                        >
                                            {segment.cta}
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default DesignedForEveryone;
