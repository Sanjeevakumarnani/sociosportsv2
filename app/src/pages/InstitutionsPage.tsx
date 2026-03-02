import { useState, useEffect, useRef } from 'react';
import { Building2, Users, Trophy, Calendar, CheckCircle, MapPin, X, Target, Globe, Award, TrendingUp, Heart, Star, Quote, ArrowRight, Network, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';
import { useAnalytics } from '../components/AnalyticsProvider';
import { Link } from 'react-router-dom';

const InstitutionsPage = () => {
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [filteredInstitutions, setFilteredInstitutions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        loadInstitutions();
    }, []);

    const loadInstitutions = async () => {
        try {
            setLoading(true);
            const data = await api.getInstitutions({ verified: true });
            setInstitutions(data);
            setFilteredInstitutions(data);
        } catch (error) {
            console.error('Failed to load institutions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = institutions;

        if (typeFilter !== 'ALL') {
            filtered = filtered.filter((inst) => inst.type === typeFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (inst) =>
                    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inst.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inst.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredInstitutions(filtered);
    }, [searchTerm, typeFilter, institutions]);

    const institutionTypes = [
        { value: 'ALL', label: 'All Types' },
        { value: 'SCHOOL', label: 'Schools' },
        { value: 'COLLEGE', label: 'Colleges' },
        { value: 'UNIVERSITY', label: 'Universities' },
        { value: 'ACADEMY', label: 'Sports Academies' },
        { value: 'FACILITY', label: 'Sports Facilities' },
        { value: 'STADIUM', label: 'Stadiums' },
    ];

    // Testimonials from partner institutions
    const institutionTestimonials = [
        {
            name: "St. Francis College",
            type: "COLLEGE",
            city: "Hyderabad",
            quote: "SocioSports transformed how we approach sports. Our students now have direct access to national tournaments and scouting opportunities that were previously out of reach.",
            contactPerson: "Dr. Ananya Sharma",
            role: "Sports Director",
            image: "/images/community_01.jpg",
            highlights: ["15 students scouted", "3 national selections", "200% engagement increase"]
        },
        {
            name: "Delhi Public School",
            type: "SCHOOL",
            city: "Secunderabad",
            quote: "Being part of this ecosystem means our athletes are never alone in their journey. From local matches to national championships, the platform connects every dot.",
            contactPerson: "Rajesh Kumar",
            role: "Physical Education Head",
            image: "/images/community_02.jpg",
            highlights: ["Annual sports gala hosted", "50+ tournament participations", "12 coaching camps organized"]
        },
        {
            name: "Telangana Sports Academy",
            type: "ACADEMY",
            city: "Warangal",
            quote: "The credibility and visibility we gained through SocioSports helped us attract talent from across the state. Our athletes are now on the national radar.",
            contactPerson: "Coach Venkatesh",
            role: "Chief Coach",
            image: "/images/community_03.jpg",
            highlights: ["State-level recognition", "8 athletes in national camp", "Facility bookings doubled"]
        },
        {
            name: "Nizam College",
            type: "COLLEGE",
            city: "Hyderabad",
            quote: "What started as a facility booking platform became our complete sports management solution. Our students discovered opportunities we didn't know existed.",
            contactPerson: "Prof. Meera Reddy",
            role: "Dean of Student Affairs",
            image: "/images/community_04.jpg",
            highlights: ["Inter-college tournaments", "Industry partnerships", "Sports scholarship program"]
        }
    ];

    return (
        <>
            <SEOHead
                title="Sports Institutions - Partner with India's Premier Sports Network"
                description="Transform your educational institution or sports facility with SocioSports. Access digital tools, increase student engagement, and join India's largest sports network."
            />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/institution_feature.jpg"
                            alt="Institutional Sports Infrastructure"
                            className="w-full h-full object-cover opacity-60 contrast-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[var(--bg-primary)]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-orange)]/10 to-transparent" />
                    </div>

                    {/* Floating badges */}
                    <div className="absolute top-32 left-8 md:left-16 z-20 hidden md:block">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">1,200+ Institutions</span>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                            <span className="eyebrow text-white">For Institutions</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 max-w-4xl tracking-tighter uppercase italic leading-none">
                            Transform Your <br />
                            <span className="text-[var(--accent-orange)]">Institution's</span>{' '}
                            <span className="text-white">Sports Ecosystem</span>
                        </h1>

                        <p className="text-xl text-white/80 mb-8 max-w-2xl font-medium leading-relaxed">
                            Join India's premier sports network. Digitize your sports infrastructure, engage students, and connect with athletes, coaches, and events nationwide.
                        </p>

                        <button
                            onClick={() => {
                                trackEvent('institution_registration_cta_click', { location: 'hero' });
                                setShowRegistrationModal(true);
                            }}
                            className="btn-primary gap-3 px-10 py-5 rounded-full text-lg font-bold group shadow-[0_0_30px_rgba(255,87,34,0.3)] hover:shadow-[0_0_50px_rgba(255,87,34,0.5)] transition-all"
                        >
                            <Building2 className="w-6 h-6" />
                            REGISTER YOUR INSTITUTION
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </section>

                {/* Ecosystem Connection Banner */}
                <section className="relative py-16 md:py-20 bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-magenta)] to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-3xl" />
                    </div>

                    <div className="relative px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                    <Network className="w-5 h-5 text-white/80" />
                                    <span className="text-white/80 text-sm font-bold uppercase tracking-widest">Connected Ecosystem</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                                    Your Institution. <br className="hidden md:block" />
                                    <span className="text-yellow-300">Connected to India's Sports Movement.</span>
                                </h2>
                                <p className="text-white/90 text-lg max-w-xl">
                                    Be part of a nationwide network where every match matters, every athlete counts, and every institution plays a role in building India's sporting future.
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                                {[
                                    { stat: '500+', label: 'Institutions' },
                                    { stat: '50K+', label: 'Athletes' },
                                    { stat: '200+', label: 'Tournaments' },
                                    { stat: '100+', label: 'Scouts' }
                                ].map((item, idx) => (
                                    <div key={idx} className="text-center px-4 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                        <div className="text-2xl md:text-3xl font-black text-white">{item.stat}</div>
                                        <div className="text-xs text-white/70 font-bold uppercase tracking-wider">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Emotional Sports Movement Section */}
                <section className="py-20 md:py-28 bg-[var(--bg-primary)] relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[var(--accent-orange)]/5 blur-[200px] rounded-full -translate-y-1/2" />
                        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[150px] rounded-full -translate-y-1/2" />
                    </div>

                    <div className="relative px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <Heart className="w-5 h-5 text-[var(--accent-orange)]" />
                                <span className="text-[var(--accent-orange)] text-sm font-bold uppercase tracking-widest">More Than Just Software</span>
                            </div>
                            <h2 className="section-title mb-6">
                                Be Part of India's <span className="text-gradient">Sports Revolution</span>
                            </h2>
                            <p className="section-subtitle max-w-3xl mx-auto text-lg">
                                This isn't about digitizing records. It's about giving every student the chance to discover their athletic potential,
                                connect with opportunities beyond their campus, and become part of a movement that's transforming how India plays.
                            </p>
                        </div>

                        {/* Impact Cards */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange)]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-orange)]/30 transition-all">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-orange)] to-yellow-500 flex items-center justify-center mb-6">
                                        <Trophy className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-3">National Tournament Access</h3>
                                    <p className="text-[var(--text-primary)]/60 mb-4">
                                        Connect your students to national-level tournaments and championships. From district qualifiers to national finals,
                                        we bridge the gap between campus sports and the big stage.
                                    </p>
                                    <div className="flex items-center gap-2 text-[var(--accent-orange)] font-bold text-sm">
                                        <Target className="w-4 h-4" />
                                        <span>200+ tournaments yearly</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-purple-500/30 transition-all">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                                        <Globe className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-3">Scouting Network Connection</h3>
                                    <p className="text-[var(--text-primary)]/60 mb-4">
                                        Your athletes get discovered. Our platform connects talented students with scouts, coaches, and sports organizations
                                        looking for the next generation of champions.
                                    </p>
                                    <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
                                        <Award className="w-4 h-4" />
                                        <span>100+ verified scouts</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-blue-500/30 transition-all">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                                        <TrendingUp className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-3">Athlete Career Pathways</h3>
                                    <p className="text-[var(--text-primary)]/60 mb-4">
                                        From campus to career. Help your students navigate the journey from college sports to professional athletics,
                                        coaching certifications, and sports industry opportunities.
                                    </p>
                                    <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Complete career support</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emotional Quote */}
                        <div className="text-center max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)]">
                            <Quote className="w-10 h-10 text-[var(--accent-orange)]/30 mx-auto mb-4" />
                            <p className="text-xl md:text-2xl text-[var(--text-primary)]/80 italic leading-relaxed mb-6">
                                "Every Olympic champion started somewhere. Every World Cup player had a first coach.
                                Your institution could be where India's next sports hero begins their journey."
                            </p>
                            <div className="flex items-center justify-center gap-2 text-[var(--accent-orange)]">
                                <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                                <span className="text-sm font-bold uppercase tracking-widest">Be the starting point</span>
                                <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section - Enhanced with Emotional Angle */}
                <section className="py-20 md:py-32 bg-[var(--bg-secondary)]">
                    <div className="px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                                <span className="text-[var(--accent-orange)] text-sm font-bold uppercase tracking-widest">Platform Features</span>
                                <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                            </div>
                            <h2 className="section-title mb-4">
                                Tools That <span className="text-gradient">Empower</span> Your Vision
                            </h2>
                            <p className="section-subtitle max-w-2xl mx-auto">
                                Practical solutions that help you focus on what matters most — developing champions and building a lasting sports culture.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Users,
                                    title: 'Digital Presence',
                                    description: 'Showcase your institution to thousands of students, parents, and coaches searching for quality sports education.',
                                    emotionalNote: 'Be discovered by families who value sports'
                                },
                                {
                                    icon: Calendar,
                                    title: 'Event Management',
                                    description: 'Host tournaments, manage registrations, and handle ticketing seamlessly through our integrated platform.',
                                    emotionalNote: 'Create memorable sporting experiences'
                                },
                                {
                                    icon: Trophy,
                                    title: 'Facility Booking',
                                    description: 'Monetize your sports facilities with our easy-to-use booking system. Manage availability and payments effortlessly.',
                                    emotionalNote: 'Maximize your infrastructure impact'
                                },
                                {
                                    icon: Award,
                                    title: 'Institutional Credibility',
                                    description: 'Get verified status and build trust with athletes, parents, and the sports community.',
                                    emotionalNote: 'Earn recognition you deserve'
                                },
                                {
                                    icon: Target,
                                    title: 'Tournament Discovery',
                                    description: 'Access a continuous stream of tournaments, from local matches to national championships. Never miss an opportunity.',
                                    emotionalNote: 'Connect students to competitions'
                                },
                                {
                                    icon: Globe,
                                    title: 'Scouting Visibility',
                                    description: 'Put your talented athletes in front of scouts, coaches, and sports organizations actively seeking new talent.',
                                    emotionalNote: 'Open doors for your champions'
                                },
                            ].map((benefit, index) => (
                                <div
                                    key={index}
                                    className="p-6 md:p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent-orange)]/30 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[var(--accent-orange)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <benefit.icon className="w-7 h-7 text-[var(--accent-orange)]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-[var(--text-primary)]/60 mb-4">
                                        {benefit.description}
                                    </p>
                                    <p className="text-sm text-[var(--accent-orange)] font-medium italic">
                                        → {benefit.emotionalNote}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section - Replacing Partner Institutions Directory */}
                <section className="py-20 md:py-32 bg-[var(--bg-primary)] relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent-orange)]/5 blur-[200px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
                    </div>

                    <div className="relative px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <Star className="w-5 h-5 text-[var(--accent-orange)]" />
                                <span className="text-[var(--accent-orange)] text-sm font-bold uppercase tracking-widest">Success Stories</span>
                            </div>
                            <h2 className="section-title mb-4">
                                Institutions That <span className="text-gradient">Lead the Way</span>
                            </h2>
                            <p className="section-subtitle max-w-2xl mx-auto">
                                Hear from educational institutions that have transformed their sports programs and connected their students to bigger opportunities.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {institutionTestimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="relative p-6 md:p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-orange)]/30 transition-all group"
                                >
                                    <Quote className="absolute top-6 right-6 w-8 h-8 text-[var(--accent-orange)]/20" />

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--accent-orange)]/20 to-purple-500/20">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{testimonial.name}</h3>
                                            <p className="text-sm text-[var(--text-primary)]/60">{testimonial.contactPerson}</p>
                                            <p className="text-xs text-[var(--accent-orange)]">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    <p className="text-[var(--text-primary)]/70 italic mb-6 leading-relaxed">
                                        "{testimonial.quote}"
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {testimonial.highlights.map((highlight, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-3 py-1.5 rounded-full bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] font-bold"
                                            >
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]/60">
                                            <MapPin className="w-4 h-4" />
                                            {testimonial.city}
                                        </div>
                                        <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-bold">
                                            {testimonial.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All Partner Institutions Link */}
                        <div className="text-center mt-12">
                            <Link
                                to="/explore-sports"
                                className="inline-flex items-center gap-2 text-[var(--accent-orange)] font-bold hover:underline"
                            >
                                View all partner institutions in our network
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Ecosystem Integration Section */}
                <section className="py-20 md:py-28 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-orange)]/5 blur-[250px] rounded-full" />
                    </div>

                    <div className="relative px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <Network className="w-5 h-5 text-[var(--accent-orange)]" />
                                <span className="text-[var(--accent-orange)] text-sm font-bold uppercase tracking-widest">Ecosystem Integration</span>
                            </div>
                            <h2 className="section-title mb-4">
                                One Platform, <span className="text-gradient">Infinite Connections</span>
                            </h2>
                            <p className="section-subtitle max-w-2xl mx-auto">
                                Your institution becomes part of a larger sports ecosystem — connected to athletes, coaches, vendors, and events across India.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6 mb-12">
                            {[
                                { icon: Users, label: 'Athletes', count: '50,000+', desc: 'Discover & recruit talent' },
                                { icon: Award, label: 'Coaches', count: '500+', desc: 'Hire certified trainers' },
                                { icon: Calendar, label: 'Events', count: '200+', desc: 'Host & participate' },
                                { icon: Building2, label: 'Partners', count: '500+', desc: 'Network & collaborate' }
                            ].map((item, idx) => (
                                <div key={idx} className="text-center p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all">
                                    <item.icon className="w-8 h-8 text-[var(--accent-orange)] mx-auto mb-3" />
                                    <div className="text-2xl font-black text-[var(--text-primary)]">{item.count}</div>
                                    <div className="text-sm font-bold text-[var(--text-primary)]/80">{item.label}</div>
                                    <div className="text-xs text-[var(--text-primary)]/50 mt-1">{item.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link
                                to="/ecosystem"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--bg-secondary)] rounded-full border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all group"
                            >
                                <span className="font-bold text-[var(--text-primary)]">Explore the Full Ecosystem</span>
                                <ArrowRight className="w-5 h-5 text-[var(--accent-orange)] group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-magenta)] text-white">
                    <div className="px-4 sm:px-6 lg:px-8 xl:px-12 max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">
                            Ready to Transform Your Institution?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join hundreds of institutions already benefiting from India's premier sports network
                        </p>
                        <button
                            onClick={() => {
                                trackEvent('institution_registration_cta_click', { location: 'footer' });
                                setShowRegistrationModal(true);
                            }}
                            className="px-8 py-4 bg-white text-[var(--accent-orange)] rounded-2xl font-bold hover:scale-105 transition-transform"
                        >
                            Get Started Today
                        </button>
                    </div>
                </section>

                <SimpleFooter />
            </main>

            {/* Registration Modal */}
            {showRegistrationModal && (
                <InstitutionRegistrationModal onClose={() => setShowRegistrationModal(false)} />
            )}
        </>
    );
};

import { useFocusTrap } from '../hooks/useFocusTrap';

// Registration Modal Component
const InstitutionRegistrationModal = ({ onClose }: { onClose: () => void }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useFocusTrap(modalRef, true, onClose);

    const [formData, setFormData] = useState({
        name: '',
        type: 'SCHOOL',
        description: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        establishedYear: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const { trackEvent } = useAnalytics();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.createInstitution(formData);
            trackEvent('institution_registered', { type: formData.type });
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Failed to register institution. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border)] p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Register Your Institution</h2>
                    <button onClick={onClose} className="text-[var(--text-primary)]/60 hover:text-[var(--text-primary)]">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {success ? (
                    <div className="p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">Institution Registered!</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Explore it in the app to start managing your institutional sports presence.
                        </p>
                        <Link
                            to="/mobile-app"
                            onClick={onClose}
                            className="btn-primary inline-flex px-8 py-3"
                        >
                            Get the App
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                                Institution Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Type *</label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            >
                                <option value="SCHOOL">School</option>
                                <option value="COLLEGE">College</option>
                                <option value="UNIVERSITY">University</option>
                                <option value="ACADEMY">Sports Academy</option>
                                <option value="FACILITY">Sports Facility</option>
                                <option value="STADIUM">Stadium</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">State</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Contact Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Contact Phone *</label>
                            <input
                                type="tel"
                                required
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Website</label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Register Institution'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default InstitutionsPage;
