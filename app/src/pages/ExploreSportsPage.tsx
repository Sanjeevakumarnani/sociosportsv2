import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SimpleFooter from '../sections/SimpleFooter';

gsap.registerPlugin(ScrollTrigger);

interface SportInfo {
    name: string;
    image: string;
    tagline: string;
    history: string;
    benefits: string[];
    origin: string;
    players: string;
}

const sportsData: SportInfo[] = [
    {
        name: 'Cricket',
        image: '/images/sport_cricket.png',
        tagline: 'The heartbeat of Indian sports',
        history: 'Cricket arrived in India through British colonialism in the 18th century and has since become the nation\'s most beloved sport. From Ranji Trophy to the IPL, cricket has built legends like Sachin Tendulkar, Kapil Dev, and Virat Kohli. India\'s 1983 World Cup victory ignited a nationwide passion that continues to grow.',
        benefits: ['Improves hand-eye coordination', 'Builds physical endurance & stamina', 'Develops strategic thinking', 'Fosters teamwork and communication'],
        origin: 'England, 16th century',
        players: '11 per side',
    },
    {
        name: 'Football',
        image: '/images/sport_football.png',
        tagline: 'The beautiful game that unites millions',
        history: 'Football has deep roots in India, especially in West Bengal, Goa, and the northeast. Mohun Bagan\'s historic 1911 IFA Shield victory against the East Yorkshire Regiment was a landmark moment. Today, the ISL has revitalized Indian football, inspiring a new generation of players across the country.',
        benefits: ['Builds cardiovascular fitness', 'Enhances agility & speed', 'Strengthens lower body muscles', 'Promotes teamwork & leadership'],
        origin: 'England, 1863',
        players: '11 per side',
    },
    {
        name: 'Badminton',
        image: '/images/sport_badminton_new.jpg',
        tagline: 'Speed, precision, and explosive power',
        history: 'Modern badminton evolved from a game called "Poona" in British India. India\'s medal haul at international competitions has surged thanks to players like Prakash Padukone, Saina Nehwal, and PV Sindhu. Sindhu\'s Olympic medals have made badminton one of India\'s most popular racquet sports.',
        benefits: ['Improves reflexes & reaction time', 'Burns calories rapidly', 'Enhances flexibility & balance', 'Boosts mental alertness'],
        origin: 'India (Poona), 19th century',
        players: 'Singles or Doubles',
    },
    {
        name: 'Basketball',
        image: '/images/sport_basketball_new.jpg',
        tagline: 'Rising fast on Indian courts',
        history: 'Basketball was introduced to India in the 1930s and has grown steadily, with the Basketball Federation of India organizing national championships since 1934. Indian players like Satnam Singh (first Indian drafted into the NBA) have brought global attention. The 3x3 format is driving grassroots growth across cities.',
        benefits: ['Builds full-body strength', 'Improves coordination & agility', 'Develops quick decision-making', 'Promotes height and bone health'],
        origin: 'USA, 1891',
        players: '5 per side',
    },
    {
        name: 'Athletics',
        image: '/images/hero/light/hero_action.png',
        tagline: 'The purest form of human performance',
        history: 'Athletics in India gained international prominence with Milkha Singh\'s legendary near-miss at the 1960 Olympics. Neeraj Chopra\'s historic gold medal in javelin throw at the 2020 Tokyo Olympics marked a watershed moment. Today, Indian athletes are breaking barriers in sprints, marathons, and field events.',
        benefits: ['Develops overall fitness & endurance', 'Strengthens bones & joints', 'Improves mental discipline', 'Builds competitive resilience'],
        origin: 'Ancient Greece, 776 BC',
        players: 'Individual / Team',
    },
    {
        name: 'Tennis',
        image: '/images/sport_tennis_new.jpg',
        tagline: 'Grace, grit, and grand slams',
        history: 'India has a proud tennis legacy from Ramanathan Krishnan\'s Wimbledon semi-finals in 1960-61 to Leander Paes and Sania Mirza\'s Grand Slam titles. Tennis is growing rapidly in urban India, with world-class academies and rising young talent pushing the boundaries of Indian tennis globally.',
        benefits: ['Builds upper body & core strength', 'Improves cardiovascular health', 'Enhances strategic thinking', 'Develops mental toughness'],
        origin: 'France/England, 12th century',
        players: 'Singles or Doubles',
    },
    {
        name: 'Kabaddi',
        image: '/images/hero/light/hero_action.png',
        tagline: 'India\'s indigenous contact sport',
        history: 'Kabaddi originated in ancient India over 4,000 years ago and was played by warriors to develop defense skills. The Pro Kabaddi League (2014) transformed this traditional sport into a television sensation. India has dominated international kabaddi, winning every Asian Games gold from 2002 to 2014.',
        benefits: ['Builds explosive strength & power', 'Improves breath control & lung capacity', 'Develops quick reflexes', 'Enhances tactical intelligence'],
        origin: 'Ancient India, 4000+ years',
        players: '7 per side',
    },
    {
        name: 'Hockey',
        image: '/images/hero/light/hero_action.png',
        tagline: 'India\'s national game legacy',
        history: 'India dominated Olympic hockey from 1928 to 1980, winning 8 gold medals—an unmatched record. Legends like Dhyan Chand, whose skill amazed the world, built India\'s hockey identity. The recent bronze at Tokyo 2020 after 41 years rekindled national passion for this proud sport.',
        benefits: ['Builds cardiovascular endurance', 'Develops hand-eye coordination', 'Strengthens legs & core', 'Teaches teamwork under pressure'],
        origin: 'Ancient civilizations, 2000 BC',
        players: '11 per side',
    },
    {
        name: 'Swimming',
        image: '/images/sport_swimming.png',
        tagline: 'Dive into fitness and freedom',
        history: 'Swimming has been a competitive sport in India since the early 20th century. Indian swimmers have made their mark in Asian and Commonwealth Games. The sport is gaining popularity with improved infrastructure and training facilities across the country, producing talented athletes who compete internationally.',
        benefits: ['Full-body workout', 'Low-impact exercise', 'Improves lung capacity', 'Enhances cardiovascular health'],
        origin: 'Ancient times',
        players: 'Individual / Relay',
    },
];

const ExploreSportsPage = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            gsap.fromTo(
                '.explore-hero-text',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
            );

            // Cards stagger animation
            if (cardsRef.current) {
                gsap.fromTo(
                    cardsRef.current.children,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: 'top 85%',
                        },
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Helmet>
                <title>Explore Sports – SocioSports | History, Benefits & More</title>
                <meta name="description" content="Discover popular sports in India – their history, benefits, and how to get started. From Cricket to Kabaddi, explore the rich world of Indian sports." />
            </Helmet>

            {/* Hero Section */}
            <div
                ref={heroRef}
                className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)',
                }}
            >
                {/* Decorative grid */}
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[var(--accent-orange)]/5 blur-3xl" />
                <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[var(--accent-orange)]/3 blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="explore-hero-text inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>

                    <div className="explore-hero-text flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-0.5 bg-[var(--accent-orange)]" />
                        <span className="eyebrow">Discover & Play</span>
                        <div className="w-10 h-0.5 bg-[var(--accent-orange)]" />
                    </div>

                    <h1 className="explore-hero-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-6">
                        Explore the World of{' '}
                        <span className="text-gradient">Sports</span>
                    </h1>

                    <p className="explore-hero-text text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        From ancient traditions to modern arenas — discover the history, benefits, and glory of India's most loved sports.
                    </p>
                </div>
            </div>

            {/* Sports Cards Grid */}
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {sportsData.map((sport, index) => (
                        <div
                            key={sport.name}
                            className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[var(--accent-orange)]/5"
                        >
                            {/* Image Header */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={sport.image}
                                    alt={sport.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-orange)]">
                                            {sport.origin}
                                        </span>
                                        <span className="text-xs text-white/40">•</span>
                                        <span className="text-xs text-white/60">{sport.players}</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {sport.name}
                                    </h2>
                                    <p className="text-sm text-white/70 italic mt-1">{sport.tagline}</p>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-6">
                                {/* History */}
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--accent-orange)] mb-3">
                                        History & Legacy
                                    </h3>
                                    <p className="text-[var(--text-secondary)] leading-relaxed text-xs">
                                        {sport.history}
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--accent-orange)] mb-4">
                                        Key Benefits
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {sport.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] mt-2 flex-shrink-0" />
                                                <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-20 md:mt-28">
                    <div className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Ready to Start Your{' '}
                            <span className="text-gradient">Sports Journey?</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-10 max-w-xl mx-auto leading-relaxed">
                            Join SocioSports to connect with athletes, coaches, and communities. Build your digital sports profile and never miss an opportunity.
                        </p>
                        <button
                            onClick={() => navigate('/#athletes')}
                            className="btn-primary px-10 py-4 text-base font-bold"
                        >
                            Join SocioSports
                        </button>
                    </div>
                </div>
            </div>

            <SimpleFooter />
        </>
    );
};

export default ExploreSportsPage;
