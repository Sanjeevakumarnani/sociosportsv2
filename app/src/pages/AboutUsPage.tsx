import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Linkedin,
    MoveRight,
    Target,
    Users,
    Zap,
    Shield,
    Eye,
    Sparkles,
    MoveDown
} from 'lucide-react';
import SimpleFooter from '../sections/SimpleFooter';

gsap.registerPlugin(ScrollTrigger);

const AboutUsPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.fromTo('.about-hero-text',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15 }
            );

            // Section scroll animations
            gsap.utils.toArray('.about-section').forEach((section: any) => {
                gsap.fromTo(section.querySelectorAll('.animate-on-scroll'),
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 85%',
                        }
                    }
                );
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    const [visionMission, setVisionMission] = useState([
        {
            title: 'Our Vision',
            desc: "To build India's most inclusive sports ecosystem where every athlete has visibility, dignity, and opportunity.",
            icon: Target
        },
        {
            title: 'Our Mission',
            desc: "To make sports accessible to everyone, everywhere by connecting athletes and revitalizing community play.",
            icon: Zap
        },
    ]);

    const [coreValues, setCoreValues] = useState([
        { title: 'Community First', desc: 'Strengthening real-world bonds.', icon: Users },
        { title: 'Health & Wellness', desc: 'Active engagement focus.', icon: Sparkles },
        { title: 'Inclusivity', desc: 'Spaces where everyone thrives.', icon: Target },
        { title: 'Joy in Movement', desc: 'Accessible fun for all.', icon: Eye },
        { title: 'Trust & Safety', desc: 'Managed professional events.', icon: Shield },
    ]);



    const defaultLeadership = [
        {
            name: 'Phanindra KKV',
            role: 'Founder & Chief Executive Officer',
            image: '/Phanindra KKV.png',
            linkedin: '#',
            bio: 'IIM Business Management graduate with 15+ years of experience. Founder of MaxPark with revenue of ₹11.6 Cr. Executed government projects including ISRO / BDL project experience.',
            quote: '',
            category: 'LEADERSHIP',
        },
        {
            name: 'Md Javeed (Scientist)',
            role: 'Technology & Innovation Director',
            image: '/Dr. Javeed MD.png',
            linkedin: '#',
            bio: 'Scientist & Guinness World Record achiever with 12 international research awards and 20+ international research articles. 12 patents and recognized with national-level innovation awards.',
            quote: '',
            category: 'LEADERSHIP',
        },
        {
            name: 'M Srinivas (Trainer)',
            role: 'Head of Sports Events & Training',
            image: '',
            linkedin: '#',
            bio: 'Sports Authority Telangana coach with 15+ years of experience. Trained 40,000+ athletes, medal-winning trainees, and large event specialist from 100 to 10,000 participants.',
            quote: '',
            category: 'LEADERSHIP',
        },
    ];

    const [leadership, setLeadership] = useState<any[]>(defaultLeadership);
    const defaultAdvisors = [
        {
            name: 'Shri Dr. N.S. Dileep, Ph.D.',
            role: 'Academic & University Sports Advisor',
            bio: 'Professor & Physical Director – Jawaharlal Nehru Technological University (JNTU). A highly respected academician, sports administrator, and physical education leader with decades of experience in developing university-level sports ecosystems. Known for his discipline, integrity, and commitment to excellence.',
            category: 'ADVISOR',
        },
        {
            name: 'T Vijaya Kumar',
            role: 'Mentor & Strategic Advisor – Business Growth',
            bio: 'Retired IAS Officer with extensive experience in governance, urban development, and education administration. Served as Commissioner in Education Department, Telangana Government, and held key positions including Vice Chancellor of Mahatma Gandhi University.',
            category: 'ADVISOR',
        },
    ];
    const [advisors, setAdvisors] = useState<any[]>(defaultAdvisors);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                // Import api dynamically or use existing import if available
                const { api } = await import('../services/api');
                const members = await api.getTeam();

                const leadershipMembers = members.filter((m: any) => m.category === 'LEADERSHIP');
                const advisorMembers = members.filter((m: any) => m.category === 'ADVISOR');

                setLeadership(leadershipMembers.length > 0 ? leadershipMembers : defaultLeadership);
                setAdvisors(advisorMembers.length > 0 ? advisorMembers : defaultAdvisors);
            } catch (error) {
                console.error('Failed to fetch team members:', error);
            }
        };
        fetchTeam();
    }, []);





    return (
        <main ref={pageRef} className="bg-[var(--bg-primary)] overflow-hidden">
            {/* 1. Hero Section - Condensed */}
            <section className="relative min-h-[60vh] flex items-center justify-center pt-20 px-6 overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] mb-6 about-hero-text">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Our Identity</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase about-hero-text leading-[1.1]">
                        CONNECTING <span className="text-gradient italic">ATHLETES.</span><br />BUILDING COMMUNITIES.
                    </h1>
                    <p className="text-base md:text-lg text-[var(--text-secondary)] font-medium max-w-xl mx-auto leading-relaxed about-hero-text mb-8">
                        India's First Sports Networking & Community Platform. We're on a mission to make sports accessible to <strong>Everyone, Everywhere.</strong>
                    </p>
                    <div className="flex justify-center animate-bounce opacity-20">
                        <MoveDown className="w-5 h-5 text-[var(--text-primary)]" />
                    </div>
                </div>

                {/* Ambient Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[var(--accent-orange)]/5 blur-[180px] rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[180px] rounded-full" />
                </div>
            </section>

            {/* 2. Our Story Section - Tighter */}
            <section className="py-12 container mx-auto px-6 about-section border-t border-[var(--border)]">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-on-scroll">
                        <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-3 block">The Genesis</span>
                        <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase">WHY WE <span className="text-gradient italic font-black">STARTED.</span></h2>
                        <div className="space-y-4 text-base text-[var(--text-secondary)] font-medium leading-relaxed">
                            <p>SocioSports was started to bring people back into real-world play and meaningful connections — through sports, fitness, and shared experiences.</p>
                            <p>In a virtual age, we revitalize physical communities. Sports is the ultimate bridge between people of all ages.</p>
                        </div>
                    </div>
                    <div className="relative animate-on-scroll">
                        <img
                            src="/images/about_genesis.png"
                            alt="Founding story"
                            className="rounded-3xl shadow-xl border border-[var(--border)] max-h-[350px] w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* 2.5 Founder's Story Section */}
            <section className="py-16 bg-[var(--bg-secondary)] border-y border-[var(--border)] about-section">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10 animate-on-scroll">
                            <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-3 block">The Story Behind</span>
                            <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase">FOUNDER&apos;S <span className="text-gradient italic font-black">VISION.</span></h2>
                        </div>

                        <div className="bg-[var(--bg-primary)] rounded-[40px] p-8 md:p-12 border border-[var(--border)] animate-on-scroll">
                            <div className="space-y-6 text-base text-[var(--text-secondary)] font-medium leading-relaxed">
                                <p className="text-lg md:text-xl text-[var(--text-primary)] font-bold">
                                    We saw two growing problems around us.
                                </p>
                                <p>
                                    Thousands of trained sportspeople across India were struggling without income, visibility, or career opportunities, despite years of dedication and sacrifice. At the same time, people were becoming inactive and disconnected — kids stuck to screens, adults confined to work routines, and seniors feeling isolated.
                                </p>
                                <p className="text-[var(--text-primary)] font-semibold">
                                    We realized sports could solve both.
                                </p>
                                <p>
                                    SocioSports with a concept called <span className="text-[var(--accent-orange)] font-bold">Sports-On-Wheels</span> was created to bring sports back into everyday life while creating real opportunities for athletes and trainers. By connecting sportspeople with general citizens, events, and jobs, we turn screen time into play time, inactivity into engagement, and sports passion into sustainable careers.
                                </p>
                                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border-l-4 border-[var(--accent-orange)] my-8">
                                    <p className="text-lg md:text-xl text-[var(--text-primary)] font-bold italic">
                                        &ldquo;Sports on Wheels: if people can&apos;t come to sports, let&apos;s bring sports to people.&rdquo;
                                    </p>
                                </div>
                                <p>
                                    Sports is not just about medals — it&apos;s about <span className="text-[var(--accent-orange)] font-semibold">health, dignity, and human connection.</span>
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-[var(--border)] flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">Founder</p>
                                    <p className="text-[var(--accent-orange)] font-bold text-lg">SocioSports</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)]/10 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-[var(--accent-orange)]">Building the future of sports</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2.6 Impact Metrics - Hidden as per user request */}
            {/* 
            <section className="py-12 container mx-auto px-6 about-section">
                <div className="text-center mb-10 animate-on-scroll">
                    <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-3 block">Our Impact</span>
                    <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase">NUMBERS THAT <span className="text-gradient italic font-black">MATTER.</span></h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { number: '500+', label: 'Athletes Connected', icon: Users },
                        { number: '50+', label: 'Events Hosted', icon: Calendar },
                        { number: '20+', label: 'Communities Built', icon: Heart },
                        { number: '5+', label: 'Cities Active', icon: MapPin },
                    ].map((metric, i) => (
                        <div key={i} className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border)] text-center hover:border-[var(--accent-orange)]/30 transition-all animate-on-scroll">
                            <metric.icon className="w-8 h-8 text-[var(--accent-orange)] mx-auto mb-3" />
                            <p className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tighter">{metric.number}</p>
                            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-2">{metric.label}</p>
                        </div>
                    ))}
                </div>
            </section>
            */}

            {/* 3. Vision & Mission Horizontal Grid - Two Statements */}
            <section className="py-20 bg-[var(--bg-secondary)] border-y border-[var(--border)] about-section">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 animate-on-scroll">
                        <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter">VISION & <span className="text-gradient font-black">MISSION</span></h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {visionMission.map((point, i) => (
                            <div key={i} className="p-8 md:p-12 rounded-[40px] bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all group animate-on-scroll flex flex-col h-full">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-orange)]/10 flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform">
                                    <point.icon className="w-8 h-8 text-[var(--accent-orange)]" />
                                </div>
                                <h3 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tighter leading-tight">{point.title}</h3>
                                <p className="text-base md:text-xl text-[var(--text-secondary)] font-medium leading-relaxed">{point.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Leadership Section - Redesigned Intro Cards */}
            <section className="py-16 container mx-auto px-6 about-section border-t border-[var(--border)]">
                <div className="mb-16 text-center animate-on-scroll">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20 mb-4">
                        <Users className="w-3 h-3 text-[var(--accent-orange)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-orange)]">Core Team</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-4">THE <span className="text-gradient font-black italic">LEADERSHIP.</span></h2>
                    <p className="text-base text-[var(--text-secondary)] font-medium max-w-xl mx-auto">Merging visionary technology with deep sports science expertise to redefine play.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                    {leadership.map((member, i) => (
                        <div key={i} className="group relative flex flex-col bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-lg hover:shadow-[var(--accent-orange)]/10 animate-on-scroll h-full">
                            {/* Top Image Section */}
                            <div className="relative h-72 md:h-80 overflow-hidden flex items-end justify-center bg-gradient-to-b from-[var(--bg-primary)] to-transparent">
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[var(--bg-primary)] flex items-center justify-center">
                                        <Users className="w-16 h-16 text-[var(--text-secondary)]/20" />
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-60" />

                                {/* Social Link */}
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all duration-300 group/link"
                                >
                                    <Linkedin className="w-5 h-5 group-hover/link:scale-110 transition-transform" />
                                </a>
                            </div>

                            {/* Content Section */}
                            <div className="p-8 flex-grow flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-1 line-clamp-1 group-hover:text-[var(--accent-orange)] transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-[var(--accent-orange)] font-black uppercase tracking-[0.15em] text-[10px]">
                                        {member.role}
                                    </p>
                                </div>

                                <div className="space-y-4 relative">
                                    {/* Introduction / Bio */}
                                    <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed italic opacity-90">
                                        &ldquo;{member.bio}&rdquo;
                                    </p>

                                    {member.quote && (
                                        <div className="pt-4 border-t border-[var(--border)]">
                                            <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest mb-1 opacity-50">Philosophy</p>
                                            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight italic">
                                                {member.quote}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hover Bottom Accent */}
                            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. Advisory Board - Condensed */}
            <section className="py-12 bg-[var(--bg-secondary)] border-y border-[var(--border)] about-section">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest mb-10">STRATEGIC <span className="text-gradient font-black">ADVISORS.</span></h2>
                    <div className="grid lg:grid-cols-2 gap-4 text-left">
                        {advisors.map((advisor, i) => (
                            <div key={i} className="p-6 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border)] animate-on-scroll hover:bg-[var(--bg-primary)]/80 transition-all">
                                <div className="flex gap-5 items-center mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tighter leading-tight">{advisor.name}</h4>
                                        <p className="text-[var(--accent-orange)] font-black text-[8px] uppercase tracking-widest mt-0.5 italic">{advisor.role}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{advisor.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. The DNA & Company - Unified High Density */}
            <section className="py-24 container mx-auto px-6 about-section border-t border-[var(--border)]">
                {/* DNA - Taking full width or adjusted layout */}
                <div className="animate-on-scroll max-w-4xl mx-auto w-full">
                    <span className="text-[var(--accent-orange)] font-black text-[10px] uppercase tracking-widest mb-3 block">Our DNA</span>
                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-8 tracking-tighter uppercase leading-tight text-center">WHAT WE <span className="text-gradient font-black">STAND FOR.</span></h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {coreValues.map((value, i) => (
                            <div key={i} className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] flex gap-5 items-center hover:border-[var(--accent-orange)]/30 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-orange)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--accent-orange)]/20 transition-colors">
                                    <value.icon className="w-6 h-6 text-[var(--accent-orange)]" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none mb-1">{value.title}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA - Minimalist */}
            <section className="py-20 container mx-auto px-6 about-section">
                <div className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[48px] p-6 md:p-16 text-center">
                    <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[var(--accent-orange)]/5 blur-[100px] rounded-full pointer-events-none" />
                    <h2 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] mb-8 tracking-tighter uppercase leading-[1.1] animate-on-scroll">
                        BUILD THE <span className="text-gradient italic font-black">FUTURE.</span>
                    </h2>
                    <button className="btn-primary px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-3 mx-auto">
                        Join the Ecosystem
                        <MoveRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            <SimpleFooter />
        </main>
    );
};

export default AboutUsPage;
