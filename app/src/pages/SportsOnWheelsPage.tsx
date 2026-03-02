import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, X, School, Home, Briefcase, Trophy, Users, Shield, Clock, MapPin, User, Mail, Phone, Calendar, Activity, ChevronDown, Zap } from 'lucide-react';
import SimpleFooter from '../sections/SimpleFooter';
import PoweredByEcosystem from '../sections/PoweredByEcosystem';
import VendorOpportunities from '../sections/VendorOpportunities';
// import SowServices from '../sections/SowServices';
import SEOHead from '../components/SEOHead';

import { api } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const SportsOnWheelsPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        orgName: '',
        eventType: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showAllActivities, setShowAllActivities] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero entrance
            gsap.from('.sow-hero-content > *', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            });

            // Section animations
            gsap.utils.toArray('.sow-section').forEach((section: any) => {
                gsap.from(section, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });
            });

            // Flow Animation Timeline
            const flowTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.lg\\:w-2\\/3',
                    start: 'top 75%',
                    end: 'bottom 75%',
                    scrub: 1,
                }
            });

            // 1. Highlight Card 0
            flowTl.to('.flow-card-0', { borderColor: 'var(--accent-orange)', backgroundColor: 'rgba(255,255,255,0.08)' })
                .to('.flow-card-0 .flow-card-glow', { opacity: 1 }, '<')
                .to('.flow-card-0 .flow-card-title', { color: 'var(--accent-orange)' }, '<')
                .to('.flow-card-0 .flow-card-desc', { color: 'rgba(255,255,255,0.9)' }, '<')

                // 2. Draw line to Card 1
                .fromTo('.flow-path-active', { strokeDashoffset: 1 }, { strokeDashoffset: 0.66, duration: 1 })

                // 3. Highlight Card 1
                .to('.flow-card-1', { borderColor: 'var(--accent-orange)', backgroundColor: 'rgba(255,255,255,0.08)' })
                .to('.flow-card-1 .flow-card-glow', { opacity: 1 }, '<')
                .to('.flow-card-1 .flow-card-title', { color: 'var(--accent-orange)' }, '<')
                .to('.flow-card-1 .flow-card-desc', { color: 'rgba(255,255,255,0.9)' }, '<')

                // 4. Draw line to Card 2 (diagonal)
                .to('.flow-path-active', { strokeDashoffset: 0.33, duration: 1 })

                // 5. Highlight Card 2
                .to('.flow-card-2', { borderColor: 'var(--accent-orange)', backgroundColor: 'rgba(255,255,255,0.08)' })
                .to('.flow-card-2 .flow-card-glow', { opacity: 1 }, '<')
                .to('.flow-card-2 .flow-card-title', { color: 'var(--accent-orange)' }, '<')
                .to('.flow-card-2 .flow-card-desc', { color: 'rgba(255,255,255,0.9)' }, '<')

                // 6. Draw line to Card 3
                .to('.flow-path-active', { strokeDashoffset: 0, duration: 1 })

                // 7. Highlight Card 3
                .to('.flow-card-3', { borderColor: 'var(--accent-orange)', backgroundColor: 'rgba(255,255,255,0.08)' })
                .to('.flow-card-3 .flow-card-glow', { opacity: 1 }, '<')
                .to('.flow-card-3 .flow-card-title', { color: 'var(--accent-orange)' }, '<')
                .to('.flow-card-3 .flow-card-desc', { color: 'rgba(255,255,255,0.9)' }, '<');

        }, pageRef);

        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.createBooking({
                businessName: formData.orgName,
                stallType: 'SERVICE_INQUIRY',
                requirements: `Type: ${formData.eventType} | Message: ${formData.message}`,
                contactPerson: formData.orgName,
                email: formData.email,
                phone: formData.phone
            });
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setShowModal(false);
                setFormData({ orgName: '', eventType: '', email: '', phone: '', message: '' });
                setIsSubmitting(false);
            }, 3000);
        } catch (error) {
            console.error('Submission failed', error);
            setIsSubmitting(false);
            alert('Failed to submit request. Please try again.');
        }
    };


    const [features, setFeatures] = useState([
        {
            icon: Clock,
            title: '60-Minute Setup',
            desc: 'Rapid deployment infrastructure that turns any vacant space into a professional arena in under an hour.'
        },
        {
            icon: Trophy,
            title: 'Pro-Grade Equipment',
            desc: 'Tournament-standard gear maintained to international specifications—from professional boundary systems to electronic scoring.'
        },
        {
            icon: Users,
            title: 'Platform Officials',
            desc: 'NIS-certified coaches and internationally-accredited referees from our verified SocioSports network.'
        },
        {
            icon: Shield,
            title: 'Safety Guaranteed',
            desc: 'Full compliance with international sports safety standards for both equipment and on-ground management.'
        }
    ]);

    const [sectors, setSectors] = useState([
        {
            id: 'residential',
            title: 'Housing Societies',
            image: '/images/sow_01.jpg',
            icon: Home,
            points: [
                'Weekend sports carnivals',
                'Professional coaching at your doorstep',
                'Community bonding events',
                'Safe, supervised play for kids'
            ]
        },
        {
            id: 'educational',
            title: 'Schools & Colleges',
            image: '/images/sow_03.jpg',
            icon: School,
            points: [
                'Annual sports day infrastructure',
                'Specialized workshop series',
                'Inter-school championship hosting',
                'Professional match-officiating services'
            ]
        },
        {
            id: 'corporate',
            title: 'Corporate Parks',
            image: '/images/sow_04.jpg',
            icon: Briefcase,
            points: [
                'Employee wellness tournaments',
                'Team building through sport',
                'Themed sports festivals',
                'Full tournament logistics management'
            ]
        }
    ]);

    const [eventFlow, setEventFlow] = useState([
        { step: '01', title: 'Request an Event', desc: 'Tell us your location, audience, and goals.' },
        { step: '02', title: 'Planning & Customization', desc: 'We design a tailored experience matching your needs.' },
        { step: '03', title: 'Event Day', desc: 'Our team arrives with Sports-on-Wheels.' },
        { step: '04', title: 'Execution', desc: 'Professional management ensures smooth operations.' }
    ]);

    const [safetyItems, setSafetyItems] = useState([
        'Trained coordinators and first-aid support',
        'Equipment safety checks and maintenance',
        'Age-appropriate activity planning',
        'Emergency protocols in place',
        'Insurance coverage for all participants'
    ]);

    const allActivities = [
        { category: 'Field Sports', items: ['Box Cricket', 'Futsal', 'Volleyball', 'Throwball'], icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { category: 'Racquet Sports', items: ['Badminton (Mobile Courts)', 'Table Tennis', 'Pickleball'], icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
        { category: 'Fitness & Fun', items: ['Yoga Sessions', 'Zumba Parties', 'Obstacle Courses', 'Tug of War'], icon: Users, color: 'text-[var(--accent-orange)]', bg: 'bg-[var(--accent-orange)]/10' },
        { category: 'Traditional', items: ['Kho-Kho', 'Kabaddi', 'Langdi', 'Lagori'], icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { category: 'Athletics', items: ['Sprint Tracks', 'Long Jump', 'Relay Races', 'Shot Put'], icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { category: 'Kids Zone', items: ['Mini Cricket', 'Fun Races', 'Ball Games', 'Skill Challenges'], icon: Trophy, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { category: 'Combat & Self-Defense', items: ['Karate Workshop', 'Taekwondo Demo', 'Women Self-Defense', 'Judo Basics'], icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
        { category: 'Adventure Zone', items: ['Wall Climbing', 'Archery Range', 'Target Shooting', 'Slacklining'], icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ];

    const displayedActivities = showAllActivities ? allActivities : allActivities; // Showing all by default for better layout balance

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await import('../services/api').then(m => m.api.cms.get('sports-on-wheels'));
                if (data && data.content) {
                    const content = JSON.parse(data.content);

                    if (content.features) {
                        setFeatures(prev => content.features.map((item: any, i: number) => ({
                            ...item,
                            icon: prev[i]?.icon || Clock // Fallback
                        })));
                    }
                    if (content.sectors) {
                        setSectors(prev => content.sectors.map((item: any, i: number) => ({
                            ...item,
                            icon: prev[i]?.icon || Home // Fallback
                        })));
                    }
                    if (content.eventFlow) setEventFlow(content.eventFlow);
                    if (content.safetyItems) setSafetyItems(content.safetyItems);
                }
            } catch (error) {
                console.error('Failed to load SOW content', error);
            }
        };
        fetchContent();
    }, []);

    return (
        <div ref={pageRef} className="bg-[var(--bg-primary)]">
            <SEOHead
                title="Sports on Wheels | Mobile Sports Infrastructure | SocioSports"
                description="Professional sports infrastructure delivered anywhere. We bring the stadium to you with pro-grade equipment, certified officials, and complete event management."
            />

            {/* Hero Section - Premium Green Park Setup */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/van_image.png"
                        alt="Sports on Wheels - Professional Mobile Sports Infrastructure"
                        className="w-full h-full object-cover opacity-60 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[var(--bg-primary)]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-orange)]/10 to-transparent" />
                </div>

                {/* Floating badges */}
                <div className="absolute top-32 left-8 md:left-16 z-20 hidden md:block">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">100+ Sports Available</span>
                    </div>
                </div>
                <div className="absolute top-48 right-8 md:right-16 z-20 hidden md:block">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                        <Clock className="w-3 h-3 text-[var(--accent-orange)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">60-Min Setup</span>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center sow-hero-content pt-32 pb-20">
                    <span className="eyebrow mb-6 inline-block text-[var(--accent-orange)]">Mobile Sports Infrastructure</span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
                        Sports on <span className="text-[var(--accent-orange)]">Wheels</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
                        Professional sports infrastructure delivered anywhere. Powered by India's largest sports ecosystem. We bring the stadium—and the community—to you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary px-10 py-5 rounded-full text-lg font-bold flex items-center gap-3 mx-auto group shadow-[0_0_30px_rgba(255,87,34,0.3)] hover:shadow-[0_0_50px_rgba(255,87,34,0.5)] transition-all"
                        >
                            <Zap className="w-5 h-5" />
                            REQUEST DEPLOYMENT
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-black text-white">100+</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Sports</div>
                        </div>
                        <div className="w-px h-12 bg-white/20 hidden sm:block" />
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-black text-white">{'<'}60m</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Setup Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is Sports on Wheels Section */}
            <section className="py-24 md:py-32 bg-[var(--bg-primary)] sow-section">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="text-[var(--accent-orange)] font-black text-xs uppercase tracking-widest mb-4 block">About the Initiative</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
                            What is <span className="text-gradient">Sports on Wheels?</span>
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-medium">
                            We bring <span className="text-[var(--text-primary)] font-bold">professional sports infrastructure</span> directly to your doorstep — no stadium needed. Schools, societies, parks, and corporate campuses can host fully-managed sports events with certified coaches, pro-grade equipment, and end-to-end support.
                        </p>
                    </div>

                    {/* Two Column Benefits */}
                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Benefits for Common People */}
                        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-[var(--border)] bg-gradient-to-r from-blue-500/10 to-transparent">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <Home className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest text-blue-400">Part 1</span>
                                        <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">Benefits for Common People</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 md:p-8 space-y-6">
                                {[
                                    { emoji: '🏡', title: 'Sports at Your Doorstep', desc: 'No travel needed — certified coaches and pro-grade equipment come directly to your neighborhood, society, or school.' },
                                    { emoji: '💸', title: 'Affordable for Everyone', desc: 'Low-cost, inclusive programs for all ages and income groups, making quality sports accessible to every family.' },
                                    { emoji: '🤝', title: 'Community & Health', desc: 'Build stronger bonds through sport while promoting fitness, teamwork, and a healthier lifestyle for the whole community.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 text-xl group-hover:border-blue-400/40 transition-colors">
                                            {item.emoji}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wide mb-1">{item.title}</h4>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits for Athletes */}
                        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-[var(--border)] bg-gradient-to-r from-[var(--accent-orange)]/10 to-transparent">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-orange)]/20 flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-[var(--accent-orange)]" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest text-[var(--accent-orange)]">Part 2</span>
                                        <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">Benefits for Athletes</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 md:p-8 space-y-6">
                                {[
                                    { emoji: '🎯', title: 'Train with Certified Coaches', desc: 'Get access to NIS-certified coaches and referees in your locality — structured training without the long commute.' },
                                    { emoji: '📈', title: 'Get Discovered Early', desc: 'Local tournaments expose your talent to scouts, selectors, and academies — building your sports profile from the grassroots up.' },
                                    { emoji: '🏆', title: 'Compete & Grow', desc: 'Participate in leagues, trials, and championships near you, with a clear pathway from beginner to competitive athlete.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 text-xl group-hover:border-[var(--accent-orange)]/40 transition-colors">
                                            {item.emoji}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wide mb-1">{item.title}</h4>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Our Services - moved to Sports Events page */}

            {/* Core Features Grid - Improved Wording */}
            <section className="py-24 md:py-32 bg-[var(--bg-secondary)] sow-section">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-[var(--accent-orange)] font-black text-xs uppercase tracking-widest mb-4 block">Why Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight uppercase">
                            Professional <span className="text-gradient">Excellence</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="p-6 md:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all group hover:-translate-y-2 hover:shadow-2xl">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-orange)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-[var(--accent-orange)]/20">
                                    <feature.icon className="w-6 h-6 text-[var(--accent-orange)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Powered by SocioSports Ecosystem Section */}
            <PoweredByEcosystem />

            {/* Main Concept Section */}
            <section className="py-32 container mx-auto px-6 sow-section">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-[var(--accent-orange)]/20 blur-3xl rounded-full" />
                        <img
                            src="/images/sow_02.jpg"
                            alt="Stadium on Demand - Mobile Sports Infrastructure"
                            className="relative rounded-[40px] shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                            <span className="eyebrow">Stadium on Demand</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight uppercase">
                            Transform Any Space <br />Into An <span className="text-gradient">Arena</span>
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                            Ground availability is the single biggest barrier to competitive sports in India. Our proprietary mobile units eliminate this barrier by deploying international-grade infrastructure to parking lots, playgrounds, and community squares.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] uppercase hover:border-[var(--accent-orange)]/30 transition-colors">
                                <div className="text-3xl font-black text-[var(--accent-orange)] mb-1">100+</div>
                                <div className="text-[10px] font-bold text-[var(--text-secondary)]">Sports Supported</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] uppercase hover:border-[var(--accent-orange)]/30 transition-colors">
                                <div className="text-3xl font-black text-[var(--accent-orange)] mb-1">{'<'}60m</div>
                                <div className="text-[10px] font-bold text-[var(--text-secondary)]">Deployment Time</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary px-8 py-4 rounded-full text-sm font-bold flex items-center gap-3 group"
                        >
                            BOOK NOW
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Activities Portfolio - With View More */}
            <section className="py-24 bg-[var(--bg-primary)] sow-section">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="eyebrow text-[var(--accent-orange)] mb-4 inline-block">WHAT WE OFFER</span>
                        <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight">
                            Activities We <span className="text-gradient">Bring</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-xl mx-auto font-medium">
                            A complete portfolio of sports and fun activities tailored to your venue.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayedActivities.map((cat, idx) => (
                            <div key={idx} className="p-6 md:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-primary)] transition-all group hover:-translate-y-2 hover:shadow-2xl">
                                <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 uppercase tracking-tight">{cat.category}</h3>
                                <ul className="space-y-3">
                                    {cat.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>


                </div>
            </section>

            {/* Sectors Supported */}
            <section className="py-32 bg-[var(--bg-secondary)] sow-section">
                <div className="container mx-auto px-6 text-center mb-16">
                    <span className="eyebrow text-[var(--accent-orange)] mb-4 inline-block">Who We Serve</span>
                    <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight">Sectors We <span className="text-gradient">Support</span></h2>
                    <p className="text-[var(--text-secondary)] max-w-xl mx-auto font-medium">Customized deployment models built for every scale of sports engagement.</p>
                </div>

                <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-8">
                    {sectors.map((sector) => (
                        <div key={sector.id} className="group relative overflow-hidden rounded-[40px] bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all hover:-translate-y-2 hover:shadow-2xl">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-orange)] text-white flex items-center justify-center">
                                        <sector.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{sector.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {sector.points.map((point, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)]" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Typical Event Flow */}
            <section className="py-32 container mx-auto px-6 sow-section">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    <div className="lg:w-1/3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20 mb-6">
                            <Clock className="w-4 h-4 text-[var(--accent-orange)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-orange)]">The Process</span>
                        </div>
                        <h2 className="text-4xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tight">Typical Event <span className="text-gradient">Flow</span></h2>
                        <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                            From request to wrap-up, we handle everything so you can focus on enjoying.
                        </p>
                    </div>
                    <div className="lg:w-2/3 relative">
                        {/* Connecting Line SVG - Desktop */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden sm:block z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path
                                d="M 25 25 L 75 25 L 25 75 L 75 75"
                                className="flow-path-bg"
                                fill="none"
                                stroke="var(--border)"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            <path
                                d="M 25 25 L 75 25 L 25 75 L 75 75"
                                className="flow-path-active"
                                fill="none"
                                stroke="var(--accent-orange)"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                                pathLength="1"
                                strokeDasharray="1"
                                strokeDashoffset="1"
                            />
                        </svg>

                        <div className="grid sm:grid-cols-2 gap-8 relative z-10">
                            {eventFlow.map((item, i) => (
                                <div key={i} className={`flow-card flow-card-${i} relative p-6 md:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] transition-all duration-500 overflow-hidden hover:border-[var(--accent-orange)]/30 hover:-translate-y-1 hover:shadow-xl`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange)]/10 to-transparent opacity-0 flow-card-glow transition-opacity duration-500" />
                                    <span className="absolute top-6 right-8 text-5xl font-black text-[var(--text-secondary)]/20 flow-card-num transition-colors">{item.step}</span>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 uppercase tracking-tight relative z-10 flow-card-title transition-colors">{item.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed relative z-10 flow-card-desc transition-colors">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety First Section */}
            <section className="py-32 bg-[var(--bg-secondary)] border-y border-[var(--border)] sow-section">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Security & Trust</span>
                            </div>
                            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tight">Safety <span className="text-gradient">First</span></h2>
                            <p className="text-lg text-[var(--text-primary)] font-medium mb-6">Professional Event Management You Can Trust</p>
                            <p className="text-[var(--text-secondary)] font-medium leading-relaxed mb-10">
                                We take safety seriously. Every event is planned and executed with meticulous attention to participant well-being and smooth operations.
                            </p>
                            <div className="space-y-4">
                                {safetyItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                            <Check className="w-3 h-3 text-green-500" />
                                        </div>
                                        <span className="text-sm text-[var(--text-secondary)] font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-10 bg-[var(--accent-orange)]/5 blur-[100px] rounded-full pointer-events-none" />
                            <img src="/images/sow_05.jpg" alt="Safety protocol" className="relative rounded-[40px] shadow-2xl border border-[var(--border)]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Vendor Opportunities Section */}
            <VendorOpportunities />

            {/* Redesigned Kickoff Section */}
            <section className="py-32 container mx-auto px-6 sow-section">
                <div className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[60px] p-6 md:p-24 text-center">
                    {/* Animated background highlights */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[var(--accent-orange)]/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] mb-8">
                            <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Limited 2026 Slots Available</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-8 tracking-tighter uppercase leading-tight">
                            READY FOR <br /><span className="text-gradient italic">BIG LEAGUE</span> KICKOFF?
                        </h2>

                        <p className="text-lg md:text-2xl text-[var(--text-secondary)] mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                            Stop waiting for grounds. Join the elite network of hubs bringing professional sports infrastructure to their doorstep.
                        </p>

                        <div className="flex flex-col items-center gap-8">
                            <button
                                onClick={() => setShowModal(true)}
                                className="group relative btn-primary px-16 py-6 rounded-full text-xl font-black shadow-[0_20px_50px_rgba(255,107,0,0.3)] transition-all hover:scale-105 hover:shadow-[0_25px_60px_rgba(255,107,0,0.5)] active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    BOOK AN EVENT
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>

                            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-[var(--text-primary)]/40 uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-2 italic underline underline-offset-4 decoration-[var(--accent-orange)]/30 line-through decoration-2">NO MINIMUM COMMITMENT</span>
                                <span className="flex items-center gap-2">● 60-MIN SETUP</span>
                                <span className="flex items-center gap-2">● PRO-GEAR GUARANTEE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SimpleFooter />

            {/* Deployment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[var(--bg-secondary)] border border-white/10 rounded-[32px] overflow-hidden max-w-lg w-full shadow-2xl">
                        <div className="p-6 md:p-10">
                            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                <X className="w-6 h-6" />
                            </button>

                            {isSubmitted ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                                        <Check className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase">Inquiry Received</h3>
                                    <p className="text-[var(--text-secondary)] font-bold mt-2">Our logistics team will reach out within 24 hours.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-[var(--accent-orange)]/10 flex items-center justify-center">
                                            <Calendar className="w-7 h-7 text-[var(--accent-orange)]" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[var(--text-primary)] leading-none uppercase">Book an Event</h3>
                                            <p className="text-sm text-[var(--text-secondary)] font-bold mt-1">Tell us about your event requirements</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                        <div className="relative group">
                                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors" />
                                            <input
                                                type="text"
                                                name="orgName"
                                                value={formData.orgName}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your organization"
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--text-primary)] font-medium outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)] shadow-sm"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-4">Event Type</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors" />
                                                <select
                                                    name="eventType"
                                                    value={formData.eventType}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--text-primary)] font-medium outline-none focus:border-[var(--accent-orange)]/50 transition-all shadow-sm appearance-none"
                                                >
                                                    <option value="" className="bg-[var(--bg-secondary)]">Select event type</option>
                                                    <option value="Residential League" className="bg-[var(--bg-secondary)]">Residential League</option>
                                                    <option value="School Sports Day" className="bg-[var(--bg-secondary)]">School Sports Day</option>
                                                    <option value="Corporate Carnival" className="bg-[var(--bg-secondary)]">Corporate Carnival</option>
                                                    <option value="Other" className="bg-[var(--bg-secondary)]">Other</option>
                                                </select>
                                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="your@email.com"
                                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] font-medium outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)] shadow-sm text-sm"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="7842983839"
                                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] font-medium outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)] shadow-sm text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-4">Message</label>
                                            <div className="relative group">
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Tell us about your event requirements..."
                                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 pl-6 pr-6 text-[var(--text-primary)] font-medium outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)] shadow-sm min-h-[120px] resize-none"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/90 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-base shadow-xl shadow-[var(--accent-orange)]/20 flex items-center justify-center gap-3 transition-all transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <ArrowRight className="w-5 h-5" />
                                            )}
                                            {isSubmitting ? 'Submitting...' : 'Submit Event Request'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SportsOnWheelsPage;
