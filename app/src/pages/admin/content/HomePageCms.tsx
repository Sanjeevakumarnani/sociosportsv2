import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import ImageUpload from '../../../components/common/ImageUpload';
import { useNavigate } from 'react-router-dom';
import { Section, Input, RemoveBtn } from '../../../components/admin/CmsComponents';

const HomePageCms = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'hero' | 'ecosystem' | 'inspiration' | 'whychooseus' | 'events' | 'trainsmarter' | 'community' | 'howitworks' | 'findsport'>('hero');

    // Hero Section Data
    const [heroData, setHeroData] = useState({
        taglines: [
            { line1: 'PLAY.', line2: 'TRAIN.', line3: 'BELONG.' },
            { line1: 'COMPETE.', line2: 'EXCEL.', line3: 'WIN.' }
        ],
        heroImages: [
            { src: 'hero_action.jpg', alt: 'Hero action', sport: 'Sports' }
        ],
        stats: [
            { value: '95%', label: 'Zero digital presence', detail: 'Talent remains invisible' }
        ],
        features: [
            {
                title: 'Athlete Stories & Insights',
                description: 'Discover Nikhat Zareen\'s journey...',
                image: '/images/athlete_story_feature.png',
                iconName: 'Trophy',
                link: '/blog',
                cta: 'Explore Blog',
            }
        ]
    });

    // Ecosystem Section Data
    const [ecosystemData, setEcosystemData] = useState({
        cards: [
            {
                title: "Sports Networking",
                subtitle: "Connect. Discover. Grow.",
                description: "Build trusted connections...",
                iconName: "Network",
                color: "var(--accent-orange)",
                link: "/community",
                cta: "Explore Networking",
                features: ["Connect with Pros"]
            }
        ]
    });

    // Inspiration Section Data
    const [inspirationData, setInspirationData] = useState({
        heading: "SOME JOURNEYS BEGIN QUIETLY",
        subHeading: "But they change everything.",
        slides: [
            {
                title: "The Beginning",
                text: "There was a penguin who didn't wait to be ready..."
            }
        ]
    });

    // Why Choose Us Data
    const [whyChooseUsData, setWhyChooseUsData] = useState({
        title: "WHY SOCIOSPORTS?",
        subtitle: "We are building the digital backbone for India's grassroots sports revolution.",
        features: [
            {
                title: "Verified Infrastructure",
                description: "Access curated, high-quality sports facilities...",
                iconName: "ShieldCheck",
                color: "var(--accent-orange)"
            }
        ]
    });

    // Events Header Data
    const [eventsHeaderData, setEventsHeaderData] = useState({
        label: "Live Action",
        titleLine1: "Compete.",
        titleLine2: "Conquer.",
        description: "Discover 20+ active tournaments in your city..."
    });

    // Train Smarter Data
    const [trainSmarterData, setTrainSmarterData] = useState({
        label: "Premium Training",
        titleLine1: "TRAIN",
        titleLine2: "SMARTER",
        trainingImages: [
            { src: '/images/coaching_cricket_main.png', caption: 'Professional Cricket Coaching & Drills' },
            { src: '/images/training_02.jpg', caption: 'Personal Fitness Training' },
            { src: '/images/training_03.jpg', caption: 'Basketball Skills Development' }
        ],
        features: [
            'Personalized coaching plans tailored to your skill level',
            'Flexible scheduling with 24/7 booking availability'
        ],
        stats: [
            { icon: 'Target', value: '500+', label: 'Training Modules' },
            { icon: 'TrendingUp', value: 'Live', label: 'Drill Sessions' },
            { icon: 'Calendar', value: 'Elite', label: 'Mentor Access' }
        ]
    });



    // Community Vibe Data
    const [communityData, setCommunityData] = useState({
        introTitle: "SPORTS AREN'T JUST ABOUT WINNING.",
        introSubtitle: "IT'S ABOUT BELONGING",
        introDesc: "In a world where we're more connected digitally yet lonelier than ever, SocioSports brings back the joy of real, physical sports communities.",
        quote: "\"From 8 to 80, everyone has a place in sports. We're building the infrastructure for belonging.\" 🌟",
        impactPulseData: [
            { title: "Digital Identity", value: "100%", label: "Achievements Preserved", desc: "Moving medals from drawers to permanent, shareable athletic portfolios.", subText: "Identity, not just moments." }
        ],
        liveFeeds: [
            { user: 'Anjali Sharma', text: '"I had 14 state medals but zero digital presence. Scouts couldn\'t find me until I moved my entire archive to SocioSports."', kudos: 890 }
        ]
    });

    // How It Works Data
    const [howItWorksData, setHowItWorksData] = useState({
        title: "Your Sports Journey",
        subtitle: "In 4 Simple Steps",
        description: "From creating your profile to earning through sports, SocioSports makes it easy to connect, play, and grow.",
        steps: [
            { title: 'Create Your Profile', description: 'Build your digital sports identity in minutes.', iconName: 'User', color: '#FF4D2E' },
            { title: 'Discover & Connect', description: 'Find coaches, training sessions, and events.', iconName: 'Search', color: '#3B82F6' },
            { title: 'Book & Participate', description: 'Book training sessions and register for tournaments.', iconName: 'Calendar', color: '#22C55E' },
            { title: 'Grow & Earn', description: 'Track your progress and get recognized.', iconName: 'Trophy', color: '#FFD700' }
        ],
        appFeatures: [
            { title: "Sports Networking", desc: "Connect with athletes and find partners.", iconName: "UserPlus", color: "#ec4899", stat: "5K+ Connections" },
            { title: "Trainer Booking", desc: "Find coaches for personal training.", iconName: "Star", color: "#3b82f6", stat: "200+ Coaches" },
            { title: "Smart Calendar", desc: "Sync tournaments and practice sessions.", iconName: "Calendar", color: "#eab308", stat: "Auto-Sync" },
            { title: "Tournament Discovery", desc: "One-tap registration for tournaments.", iconName: "Trophy", color: "#f97316", stat: "150+ Events" }
        ]
    });

    // Find Your Sport Data
    const [findYourSportData, setFindYourSportData] = useState({
        title: "FIND YOUR SPORT",
        subtitle: "Explore Disciplines",
        description: "Experience professional-grade training and vibrant communities. We connect you with the best academies and local venues across India.",
        sports: [
            { name: "BADMINTON", image: "/images/sport_badminton.jpg", players: "45K+", coaches: "1.2K", description: "Fast-paced indoor racquet sport perfect for all ages and fitness levels", benefits: ["Improves reflexes", "Full-body workout", "Great for cardio"], skillLevels: "Beginner to Pro", availability: "200+ courts" },
            { name: "BASKETBALL", image: "/images/sport_basketball.jpg", players: "32K+", coaches: "890", description: "Team sport that builds strength, coordination, and strategic thinking", benefits: ["Team building", "Endurance training", "Strategic gameplay"], skillLevels: "All levels", availability: "150+ courts" },
            { name: "TENNIS", image: "/images/sport_tennis.jpg", players: "28K+", coaches: "650", description: "Classic racquet sport combining power, precision, and mental toughness", benefits: ["Mental focus", "Agility training", "Competitive edge"], skillLevels: "Beginner to Advanced", availability: "120+ courts" },
            { name: "CRICKET", image: "/images/sport_cricket.png", players: "100K+", coaches: "5K+", description: "A strategic game of bat and ball, loved by millions for its intensity and technique", benefits: ["Strategic Focus", "Team Coordination", "Mental Strength"], skillLevels: "All levels", availability: "500+ grounds" },
            { name: "FOOTBALL", image: "/images/sport_football.png", players: "80K+", coaches: "3K+", description: "The world's most popular sport, demanding speed, stamina, and teamwork", benefits: ["High Endurance", "Agility Skills", "Elite Teamwork"], skillLevels: "Beginner to Pro", availability: "300+ turfs" },
            { name: "SWIMMING", image: "/images/sport_swimming.png", players: "40K+", coaches: "800+", description: "Full-body workout that builds strength and endurance without impact stress", benefits: ["Cardiovascular Health", "Muscle Tone", "Zero Impact"], skillLevels: "All levels", availability: "100+ pools" }
        ],
        footerTags: ["Yoga", "Table Tennis", "MMA", "Volleyball", "Fitness", "Cardio"]
    });

    // Join Movement Data


    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [hero, eco, insp, why, events, train, community, how, find] = await Promise.all([
                api.cms.get('home-hero'),
                api.cms.get('home-ecosystem'),
                api.cms.get('home-inspiration'),
                api.cms.get('home-why-choose-us'),
                api.cms.get('home-events-header'),
                api.cms.get('home-train-smarter'),
                api.cms.get('home-community'),
                api.cms.get('home-how-it-works'),
                api.cms.get('home-find-sport')
            ]);

            if (hero?.content) setHeroData(JSON.parse(hero.content));
            if (eco?.content) setEcosystemData(JSON.parse(eco.content));
            if (insp?.content) setInspirationData(JSON.parse(insp.content));
            if (why?.content) setWhyChooseUsData(JSON.parse(why.content));
            if (events?.content) setEventsHeaderData(JSON.parse(events.content));
            if (train?.content) setTrainSmarterData(JSON.parse(train.content));
            if (community?.content) setCommunityData(JSON.parse(community.content));
            if (how?.content) setHowItWorksData(JSON.parse(how.content));
            if (find?.content) setFindYourSportData(JSON.parse(find.content));

        } catch (error) {
            console.error('Failed to load home content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (token) {
                // no op
            } else {
                navigate('/admin');
                return;
            }

            await Promise.all([
                api.cms.update('home-hero', { title: 'Home Page Hero', content: JSON.stringify(heroData) }, token),
                api.cms.update('home-ecosystem', { title: 'Home Page Ecosystem', content: JSON.stringify(ecosystemData) }, token),
                api.cms.update('home-inspiration', { title: 'Home Page Inspiration', content: JSON.stringify(inspirationData) }, token),
                api.cms.update('home-why-choose-us', { title: 'Home Page Why Choose Us', content: JSON.stringify(whyChooseUsData) }, token),
                api.cms.update('home-events-header', { title: 'Home Page Events Header', content: JSON.stringify(eventsHeaderData) }, token),
                api.cms.update('home-train-smarter', { title: 'Home Page Train Smarter', content: JSON.stringify(trainSmarterData) }, token),
                api.cms.update('home-community', { title: 'Home Page Community', content: JSON.stringify(communityData) }, token),
                api.cms.update('home-how-it-works', { title: 'Home Page How It Works', content: JSON.stringify(howItWorksData) }, token),
                api.cms.update('home-find-sport', { title: 'Home Page Find Your Sport', content: JSON.stringify(findYourSportData) }, token)
            ]);

            alert('All Home Page sections updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    // --- Helpers for Hero ---
    const updateHeroTagline = (index: number, field: string, value: string) => {
        const newTaglines = [...heroData.taglines];
        (newTaglines[index] as any)[field] = value;
        setHeroData({ ...heroData, taglines: newTaglines });
    };

    const addHeroTagline = () => {
        setHeroData({
            ...heroData,
            taglines: [...heroData.taglines, { line1: 'NEW.', line2: 'TAG.', line3: 'LINE.' }]
        });
    };

    const removeHeroTagline = (index: number) => {
        const newTaglines = heroData.taglines.filter((_, i) => i !== index);
        setHeroData({ ...heroData, taglines: newTaglines });
    };

    // --- Helpers for Ecosystem ---
    const updateEcoCard = (index: number, field: string, value: string) => {
        const newCards = [...ecosystemData.cards];
        (newCards[index] as any)[field] = value;
        setEcosystemData({ ...ecosystemData, cards: newCards });
    };

    const updateEcoFeature = (cardIndex: number, featureIndex: number, value: string) => {
        const newCards = [...ecosystemData.cards];
        newCards[cardIndex].features[featureIndex] = value;
        setEcosystemData({ ...ecosystemData, cards: newCards });
    };

    // --- Helpers for Inspiration ---
    const updateInspSlide = (index: number, field: string, value: string) => {
        const newSlides = [...inspirationData.slides];
        (newSlides[index] as any)[field] = value;
        setInspirationData({ ...inspirationData, slides: newSlides });
    };

    // --- Helpers for Why Choose Us ---
    const updateWhyFeature = (index: number, field: string, value: string) => {
        const newFeatures = [...whyChooseUsData.features];
        (newFeatures[index] as any)[field] = value;
        setWhyChooseUsData({ ...whyChooseUsData, features: newFeatures });
    };


    if (loading) return <div className="text-[var(--text-primary)] p-8">Loading CMS...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Home Page <span className="text-[var(--accent-orange)]">Editor</span></h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[var(--border)] mb-8 flex-wrap">
                {['hero', 'ecosystem', 'inspiration', 'whychooseus', 'events', 'trainsmarter', 'community', 'howitworks', 'findsport'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab
                            ? 'border-[var(--accent-orange)] text-[var(--accent-orange)]'
                            : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {tab === 'whychooseus' ? 'Why Choose Us' : tab === 'events' ? 'Events' : tab === 'trainsmarter' ? 'Train Smarter' : tab === 'community' ? 'Community' : tab === 'howitworks' ? 'How It Works' : tab === 'findsport' ? 'Find Sport' : tab}
                    </button>
                ))}
            </div>

            {/* HERO EDITOR */}
            {activeTab === 'hero' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Rotating Taglines" onAdd={addHeroTagline}>
                        {heroData.taglines.map((tag, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 bg-[var(--bg-primary)] p-4 rounded-xl relative group border border-[var(--border)]">
                                <Input label="Line 1" value={tag.line1} onChange={(v: string) => updateHeroTagline(index, 'line1', v)} />
                                <Input label="Line 2" value={tag.line2} onChange={(v: string) => updateHeroTagline(index, 'line2', v)} />
                                <Input label="Line 3" value={tag.line3} onChange={(v: string) => updateHeroTagline(index, 'line3', v)} />
                                <RemoveBtn onClick={() => removeHeroTagline(index)} />
                            </div>
                        ))}
                    </Section>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase mb-6">Hero Images</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {heroData.heroImages.map((img, index) => (
                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-[var(--border)]">
                                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                        <input
                                            value={img.sport}
                                            onChange={(e) => {
                                                const newImages = [...heroData.heroImages];
                                                newImages[index].sport = e.target.value;
                                                setHeroData({ ...heroData, heroImages: newImages });
                                            }}
                                            className="bg-transparent border-b border-white/50 text-white text-center text-sm w-full outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                const newImages = heroData.heroImages.filter((_, i) => i !== index);
                                                setHeroData({ ...heroData, heroImages: newImages });
                                            }}
                                            className="bg-red-500 p-2 rounded-full"
                                        >
                                            <Trash2 className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="relative aspect-square rounded-xl border border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-2 hover:bg-[var(--bg-primary)]/50 transition-colors p-4 text-center overflow-hidden">
                                <ImageUpload
                                    onChange={(url: string) => {
                                        setHeroData({
                                            ...heroData,
                                            heroImages: [...heroData.heroImages, { src: url, alt: 'New Image', sport: 'Sport' }]
                                        });
                                    }}
                                    className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
                                    label=""
                                />
                                <ImageIcon className="w-8 h-8 text-[var(--text-secondary)]" />
                                <span className="text-xs text-[var(--text-secondary)] font-bold uppercase">Upload New Image</span>
                            </div>
                        </div>
                    </div>

                    <Section title="Featured Cards (Max 5)">
                        {heroData.features?.map((feature, index) => (
                            <div key={index} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4 relative group">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase text-[var(--accent-orange)]">Card {index + 1}</span>
                                    <RemoveBtn onClick={() => {
                                        const newFeatures = heroData.features.filter((_, i) => i !== index);
                                        setHeroData({ ...heroData, features: newFeatures });
                                    }} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Title" value={feature.title} onChange={(v: string) => {
                                        const newFeatures = [...heroData.features];
                                        newFeatures[index].title = v;
                                        setHeroData({ ...heroData, features: newFeatures });
                                    }} />
                                    <Input label="Icon Name (Trophy, Users, Calendar, User)" value={feature.iconName} onChange={(v: string) => {
                                        const newFeatures = [...heroData.features];
                                        newFeatures[index].iconName = v;
                                        setHeroData({ ...heroData, features: newFeatures });
                                    }} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Description</label>
                                    <textarea
                                        value={feature.description}
                                        onChange={(e) => {
                                            const newFeatures = [...heroData.features];
                                            newFeatures[index].description = e.target.value;
                                            setHeroData({ ...heroData, features: newFeatures });
                                        }}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[60px]"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="CTA Text" value={feature.cta} onChange={(v: string) => {
                                        const newFeatures = [...heroData.features];
                                        newFeatures[index].cta = v;
                                        setHeroData({ ...heroData, features: newFeatures });
                                    }} />
                                    <Input label="Link" value={feature.link} onChange={(v: string) => {
                                        const newFeatures = [...heroData.features];
                                        newFeatures[index].link = v;
                                        setHeroData({ ...heroData, features: newFeatures });
                                    }} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Feature Image</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--border)]">
                                            <img src={feature.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <ImageUpload
                                                onChange={(url: string) => {
                                                    const newFeatures = [...heroData.features];
                                                    newFeatures[index].image = url;
                                                    setHeroData({ ...heroData, features: newFeatures });
                                                }}
                                                label="Upload Card Image"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!heroData.features || heroData.features.length < 5) && (
                            <button
                                onClick={() => setHeroData({
                                    ...heroData,
                                    features: [...(heroData.features || []), {
                                        title: 'New Feature',
                                        description: 'New feature description',
                                        image: '/images/placeholder.jpg',
                                        iconName: 'Trophy',
                                        link: '/',
                                        cta: 'Learn More',
                                    }]
                                })}
                                className="btn-secondary w-full flex justify-center py-3"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Featured Card
                            </button>
                        )}
                    </Section>
                </div>
            )}

            {/* ECOSYSTEM EDITOR */}
            {activeTab === 'ecosystem' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Ecosystem Cards">
                        {ecosystemData.cards.map((card, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Title" value={card.title} onChange={(v: string) => updateEcoCard(i, 'title', v)} />
                                    <Input label="Subtitle" value={card.subtitle} onChange={(v: string) => updateEcoCard(i, 'subtitle', v)} />
                                    <div className="md:col-span-2">
                                        <Input label="Description" value={card.description} onChange={(v: string) => updateEcoCard(i, 'description', v)} />
                                    </div>
                                    <Input label="CTA Text" value={card.cta} onChange={(v: string) => updateEcoCard(i, 'cta', v)} />
                                    <Input label="Link" value={card.link} onChange={(v: string) => updateEcoCard(i, 'link', v)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Features List</label>
                                    {card.features.map((feat, fIndex) => (
                                        <input
                                            key={fIndex}
                                            value={feat}
                                            onChange={(e) => updateEcoFeature(i, fIndex, e.target.value)}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Section>
                </div>
            )}

            {/* WHY CHOOSE US EDITOR */}
            {activeTab === 'whychooseus' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Headings">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                            <Input label="Title" value={whyChooseUsData.title} onChange={(v: string) => setWhyChooseUsData({ ...whyChooseUsData, title: v })} />
                            <Input label="Subtitle" value={whyChooseUsData.subtitle} onChange={(v: string) => setWhyChooseUsData({ ...whyChooseUsData, subtitle: v })} />
                        </div>
                    </Section>

                    <Section title="Features">
                        {whyChooseUsData.features.map((feature, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase text-[var(--accent-orange)]">Feature {i + 1}</span>
                                </div>
                                <Input label="Title" value={feature.title} onChange={(v: string) => updateWhyFeature(i, 'title', v)} />
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Example: ShieldCheck, TrendingUp, Users, Award</label>
                                    <Input label="Icon Name" value={feature.iconName} onChange={(v: string) => updateWhyFeature(i, 'iconName', v)} />
                                </div>
                                <Input label="Color" value={feature.color} onChange={(v: string) => updateWhyFeature(i, 'color', v)} />
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Description</label>
                                    <textarea
                                        value={feature.description}
                                        onChange={(e) => updateWhyFeature(i, 'description', e.target.value)}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[80px]"
                                    />
                                </div>
                            </div>
                        ))}
                    </Section>
                </div>
            )}

            {/* EVENTS EDITOR */}
            {activeTab === 'events' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Events Section Header">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                            <Input label="Label" value={eventsHeaderData.label} onChange={(v: string) => setEventsHeaderData({ ...eventsHeaderData, label: v })} />
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Title Line 1" value={eventsHeaderData.titleLine1} onChange={(v: string) => setEventsHeaderData({ ...eventsHeaderData, titleLine1: v })} />
                                <Input label="Title Line 2 (Gradient)" value={eventsHeaderData.titleLine2} onChange={(v: string) => setEventsHeaderData({ ...eventsHeaderData, titleLine2: v })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Description</label>
                                <textarea
                                    value={eventsHeaderData.description}
                                    onChange={(e) => setEventsHeaderData({ ...eventsHeaderData, description: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[80px]"
                                />
                            </div>
                        </div>
                    </Section>
                </div>
            )}

            {/* INSPIRATION EDITOR */}
            {activeTab === 'inspiration' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Main Headings">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                            <Input label="Main Heading" value={inspirationData.heading} onChange={(v: string) => setInspirationData({ ...inspirationData, heading: v })} />
                            <Input label="Sub Heading" value={inspirationData.subHeading} onChange={(v: string) => setInspirationData({ ...inspirationData, subHeading: v })} />
                        </div>
                    </Section>

                    <Section title="Story Slides">
                        {inspirationData.slides.map((slide, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase text-[var(--accent-orange)]">Slide {i + 1}</span>
                                </div>
                                <Input label="Title" value={slide.title} onChange={(v: string) => updateInspSlide(i, 'title', v)} />
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Story Text</label>
                                    <textarea
                                        value={slide.text}
                                        onChange={(e) => updateInspSlide(i, 'text', e.target.value)}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[100px]"
                                    />
                                </div>
                            </div>
                        ))}
                    </Section>
                </div>
            )}

            {/* TRAIN SMARTER EDITOR */}
            {activeTab === 'trainsmarter' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Header Content">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                            <Input label="Label" value={trainSmarterData.label} onChange={(v: string) => setTrainSmarterData({ ...trainSmarterData, label: v })} />
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Title Line 1" value={trainSmarterData.titleLine1} onChange={(v: string) => setTrainSmarterData({ ...trainSmarterData, titleLine1: v })} />
                                <Input label="Title Line 2 (Gradient)" value={trainSmarterData.titleLine2} onChange={(v: string) => setTrainSmarterData({ ...trainSmarterData, titleLine2: v })} />
                            </div>
                        </div>
                    </Section>

                    <Section title="Training Images">
                        {trainSmarterData.trainingImages.map((img, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl flex gap-4 items-center">
                                <img src={img.src} alt="" className="w-16 h-16 object-cover rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Input label="Image URL" value={img.src} onChange={(v: string) => {
                                        const newImages = [...trainSmarterData.trainingImages];
                                        newImages[i].src = v;
                                        setTrainSmarterData({ ...trainSmarterData, trainingImages: newImages });
                                    }} />
                                    <Input label="Caption" value={img.caption} onChange={(v: string) => {
                                        const newImages = [...trainSmarterData.trainingImages];
                                        newImages[i].caption = v;
                                        setTrainSmarterData({ ...trainSmarterData, trainingImages: newImages });
                                    }} />
                                </div>
                                <button onClick={() => {
                                    const newImages = trainSmarterData.trainingImages.filter((_, idx) => idx !== i);
                                    setTrainSmarterData({ ...trainSmarterData, trainingImages: newImages });
                                }} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button onClick={() => setTrainSmarterData({
                            ...trainSmarterData,
                            trainingImages: [...trainSmarterData.trainingImages, { src: '/images/placeholder.jpg', caption: 'New Training' }]
                        })} className="btn-secondary w-full flex justify-center py-3"><Plus className="w-4 h-4 mr-2" /> Add Image</button>
                    </Section>

                    <Section title="Features List">
                        {trainSmarterData.features.map((feat, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <Input label={`Feature ${i + 1}`} value={feat} onChange={(v: string) => {
                                    const newFeatures = [...trainSmarterData.features];
                                    newFeatures[i] = v;
                                    setTrainSmarterData({ ...trainSmarterData, features: newFeatures });
                                }} />
                                <button onClick={() => {
                                    const newFeatures = trainSmarterData.features.filter((_, idx) => idx !== i);
                                    setTrainSmarterData({ ...trainSmarterData, features: newFeatures });
                                }} className="text-red-500 mt-6"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button onClick={() => setTrainSmarterData({
                            ...trainSmarterData,
                            features: [...trainSmarterData.features, "New Feature"]
                        })} className="btn-secondary w-full flex justify-center py-3"><Plus className="w-4 h-4 mr-2" /> Add Feature</button>
                    </Section>

                    <Section title="Stats">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {trainSmarterData.stats.map((stat, i) => (
                                <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl space-y-2">
                                    <Input label="Value" value={stat.value} onChange={(v: string) => {
                                        const newStats = [...trainSmarterData.stats];
                                        newStats[i].value = v;
                                        setTrainSmarterData({ ...trainSmarterData, stats: newStats });
                                    }} />
                                    <Input label="Label" value={stat.label} onChange={(v: string) => {
                                        const newStats = [...trainSmarterData.stats];
                                        newStats[i].label = v;
                                        setTrainSmarterData({ ...trainSmarterData, stats: newStats });
                                    }} />
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Icon (Target, TrendingUp, Calendar)</label>
                                        <select
                                            value={stat.icon}
                                            onChange={(e) => {
                                                const newStats = [...trainSmarterData.stats];
                                                newStats[i].icon = e.target.value;
                                                setTrainSmarterData({ ...trainSmarterData, stats: newStats });
                                            }}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-md px-2 py-2 text-sm text-[var(--text-primary)]"
                                        >
                                            <option value="Target">Target</option>
                                            <option value="TrendingUp">TrendingUp</option>
                                            <option value="Calendar">Calendar</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            )}

            {/* COMMUNITY EDITOR */}
            {activeTab === 'community' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Intro Content">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                            <Input label="Intro Title" value={communityData.introTitle} onChange={(v: string) => setCommunityData({ ...communityData, introTitle: v })} />
                            <Input label="Intro Subtitle (Gradient)" value={communityData.introSubtitle} onChange={(v: string) => setCommunityData({ ...communityData, introSubtitle: v })} />
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Intro Description</label>
                                <textarea
                                    value={communityData.introDesc}
                                    onChange={(e) => setCommunityData({ ...communityData, introDesc: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Quote</label>
                                <textarea
                                    value={communityData.quote}
                                    onChange={(e) => setCommunityData({ ...communityData, quote: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[80px]"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section title="Impact Pulse Data">
                        {communityData.impactPulseData.map((item, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                                <Input label="Title" value={item.title} onChange={(v: string) => {
                                    const newData = [...communityData.impactPulseData];
                                    newData[i].title = v;
                                    setCommunityData({ ...communityData, impactPulseData: newData });
                                }} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Value" value={item.value} onChange={(v: string) => {
                                        const newData = [...communityData.impactPulseData];
                                        newData[i].value = v;
                                        setCommunityData({ ...communityData, impactPulseData: newData });
                                    }} />
                                    <Input label="Label" value={item.label} onChange={(v: string) => {
                                        const newData = [...communityData.impactPulseData];
                                        newData[i].label = v;
                                        setCommunityData({ ...communityData, impactPulseData: newData });
                                    }} />
                                </div>
                                <Input label="Description" value={item.desc} onChange={(v: string) => {
                                    const newData = [...communityData.impactPulseData];
                                    newData[i].desc = v;
                                    setCommunityData({ ...communityData, impactPulseData: newData });
                                }} />
                                <Input label="Sub Text" value={item.subText} onChange={(v: string) => {
                                    const newData = [...communityData.impactPulseData];
                                    newData[i].subText = v;
                                    setCommunityData({ ...communityData, impactPulseData: newData });
                                }} />
                                <RemoveBtn onClick={() => {
                                    const newData = communityData.impactPulseData.filter((_, idx) => idx !== i);
                                    setCommunityData({ ...communityData, impactPulseData: newData });
                                }} />
                            </div>
                        ))}
                        <button onClick={() => setCommunityData({
                            ...communityData,
                            impactPulseData: [...communityData.impactPulseData, { title: "New Metric", value: "0", label: "Metric", desc: "Description", subText: "Subtitle" }]
                        })} className="btn-secondary w-full flex justify-center py-3"><Plus className="w-4 h-4 mr-2" /> Add Metric</button>
                    </Section>

                    <Section title="Live Feeds">
                        {communityData.liveFeeds.map((feed, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                                <Input label="User Name" value={feed.user} onChange={(v: string) => {
                                    const newFeeds = [...communityData.liveFeeds];
                                    newFeeds[i].user = v;
                                    setCommunityData({ ...communityData, liveFeeds: newFeeds });
                                }} />
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Feed Text</label>
                                    <textarea
                                        value={feed.text}
                                        onChange={(e) => {
                                            const newFeeds = [...communityData.liveFeeds];
                                            newFeeds[i].text = e.target.value;
                                            setCommunityData({ ...communityData, liveFeeds: newFeeds });
                                        }}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[80px]"
                                    />
                                </div>
                                <Input label="Kudos Count" value={String(feed.kudos)} onChange={(v: string) => {
                                    const newFeeds = [...communityData.liveFeeds];
                                    newFeeds[i].kudos = Number(v) || 0;
                                    setCommunityData({ ...communityData, liveFeeds: newFeeds });
                                }} />
                                <RemoveBtn onClick={() => {
                                    const newFeeds = communityData.liveFeeds.filter((_, idx) => idx !== i);
                                    setCommunityData({ ...communityData, liveFeeds: newFeeds });
                                }} />
                            </div>
                        ))}
                        <button onClick={() => setCommunityData({
                            ...communityData,
                            liveFeeds: [...communityData.liveFeeds, { user: "New User", text: "New Feed", kudos: 0 }]
                        })} className="btn-secondary w-full flex justify-center py-3"><Plus className="w-4 h-4 mr-2" /> Add Feed</button>
                    </Section>
                </div>
            )}

            {/* HOW IT WORKS EDITOR */}
            {activeTab === 'howitworks' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Header">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                            <Input label="Title" value={howItWorksData.title} onChange={(v: string) => setHowItWorksData({ ...howItWorksData, title: v })} />
                            <Input label="Subtitle (Gradient)" value={howItWorksData.subtitle} onChange={(v: string) => setHowItWorksData({ ...howItWorksData, subtitle: v })} />
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Description</label>
                                <textarea
                                    value={howItWorksData.description}
                                    onChange={(e) => setHowItWorksData({ ...howItWorksData, description: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[80px]"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section title="Steps (4 Steps)">
                        {howItWorksData.steps.map((step, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase text-[var(--accent-orange)]">Step {i + 1}</span>
                                </div>
                                <Input label="Title" value={step.title} onChange={(v: string) => {
                                    const newSteps = [...howItWorksData.steps];
                                    newSteps[i].title = v;
                                    setHowItWorksData({ ...howItWorksData, steps: newSteps });
                                }} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Icon Name (User, Search, Calendar, Trophy)" value={step.iconName} onChange={(v: string) => {
                                        const newSteps = [...howItWorksData.steps];
                                        newSteps[i].iconName = v;
                                        setHowItWorksData({ ...howItWorksData, steps: newSteps });
                                    }} />
                                    <Input label="Color (Hex)" value={step.color} onChange={(v: string) => {
                                        const newSteps = [...howItWorksData.steps];
                                        newSteps[i].color = v;
                                        setHowItWorksData({ ...howItWorksData, steps: newSteps });
                                    }} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Description</label>
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => {
                                            const newSteps = [...howItWorksData.steps];
                                            newSteps[i].description = e.target.value;
                                            setHowItWorksData({ ...howItWorksData, steps: newSteps });
                                        }}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[60px]"
                                    />
                                </div>
                            </div>
                        ))}
                    </Section>

                    <Section title="App Features (4 Cards)">
                        {howItWorksData.appFeatures.map((feat, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase text-[var(--accent-orange)]">Feature {i + 1}</span>
                                </div>
                                <Input label="Title" value={feat.title} onChange={(v: string) => {
                                    const newFeats = [...howItWorksData.appFeatures];
                                    newFeats[i].title = v;
                                    setHowItWorksData({ ...howItWorksData, appFeatures: newFeats });
                                }} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Icon Name (UserPlus, Star, Calendar, Trophy)" value={feat.iconName} onChange={(v: string) => {
                                        const newFeats = [...howItWorksData.appFeatures];
                                        newFeats[i].iconName = v;
                                        setHowItWorksData({ ...howItWorksData, appFeatures: newFeats });
                                    }} />
                                    <Input label="Color (Hex)" value={feat.color} onChange={(v: string) => {
                                        const newFeats = [...howItWorksData.appFeatures];
                                        newFeats[i].color = v;
                                        setHowItWorksData({ ...howItWorksData, appFeatures: newFeats });
                                    }} />
                                </div>
                                <Input label="Stat Label" value={feat.stat} onChange={(v: string) => {
                                    const newFeats = [...howItWorksData.appFeatures];
                                    newFeats[i].stat = v;
                                    setHowItWorksData({ ...howItWorksData, appFeatures: newFeats });
                                }} />
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Description</label>
                                    <textarea
                                        value={feat.desc}
                                        onChange={(e) => {
                                            const newFeats = [...howItWorksData.appFeatures];
                                            newFeats[i].desc = e.target.value;
                                            setHowItWorksData({ ...howItWorksData, appFeatures: newFeats });
                                        }}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[60px]"
                                    />
                                </div>
                            </div>
                        ))}
                    </Section>
                </div>
            )}

            {/* FIND YOUR SPORT EDITOR */}
            {activeTab === 'findsport' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Section title="Header">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                            <Input label="Title" value={findYourSportData.title} onChange={(v: string) => setFindYourSportData({ ...findYourSportData, title: v })} />
                            <Input label="Subtitle (Eyebrow)" value={findYourSportData.subtitle} onChange={(v: string) => setFindYourSportData({ ...findYourSportData, subtitle: v })} />
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Description</label>
                                <textarea
                                    value={findYourSportData.description}
                                    onChange={(e) => setFindYourSportData({ ...findYourSportData, description: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[80px]"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section title="Sports Cards">
                        {findYourSportData.sports.map((sport, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase text-[var(--accent-orange)]">Sport {i + 1}</span>
                                    <RemoveBtn onClick={() => {
                                        const newSports = findYourSportData.sports.filter((_, idx) => idx !== i);
                                        setFindYourSportData({ ...findYourSportData, sports: newSports });
                                    }} />
                                </div>
                                <Input label="Name" value={sport.name} onChange={(v: string) => {
                                    const newSports = [...findYourSportData.sports];
                                    newSports[i].name = v;
                                    setFindYourSportData({ ...findYourSportData, sports: newSports });
                                }} />
                                <Input label="Image URL" value={sport.image} onChange={(v: string) => {
                                    const newSports = [...findYourSportData.sports];
                                    newSports[i].image = v;
                                    setFindYourSportData({ ...findYourSportData, sports: newSports });
                                }} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Players Stat" value={sport.players} onChange={(v: string) => {
                                        const newSports = [...findYourSportData.sports];
                                        newSports[i].players = v;
                                        setFindYourSportData({ ...findYourSportData, sports: newSports });
                                    }} />
                                    <Input label="Coaches Stat" value={sport.coaches} onChange={(v: string) => {
                                        const newSports = [...findYourSportData.sports];
                                        newSports[i].coaches = v;
                                        setFindYourSportData({ ...findYourSportData, sports: newSports });
                                    }} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Description</label>
                                    <textarea
                                        value={sport.description}
                                        onChange={(e) => {
                                            const newSports = [...findYourSportData.sports];
                                            newSports[i].description = e.target.value;
                                            setFindYourSportData({ ...findYourSportData, sports: newSports });
                                        }}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] min-h-[60px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Benefits (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={sport.benefits.join(', ')}
                                        onChange={(e) => {
                                            const newSports = [...findYourSportData.sports];
                                            newSports[i].benefits = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                                            setFindYourSportData({ ...findYourSportData, sports: newSports });
                                        }}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Skill Levels" value={sport.skillLevels} onChange={(v: string) => {
                                        const newSports = [...findYourSportData.sports];
                                        newSports[i].skillLevels = v;
                                        setFindYourSportData({ ...findYourSportData, sports: newSports });
                                    }} />
                                    <Input label="Availability" value={sport.availability} onChange={(v: string) => {
                                        const newSports = [...findYourSportData.sports];
                                        newSports[i].availability = v;
                                        setFindYourSportData({ ...findYourSportData, sports: newSports });
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setFindYourSportData({
                            ...findYourSportData,
                            sports: [...findYourSportData.sports, { name: "New Sport", image: "", players: "0", coaches: "0", description: "", benefits: [], skillLevels: "", availability: "" }]
                        })} className="btn-secondary w-full flex justify-center py-3"><Plus className="w-4 h-4 mr-2" /> Add Sport</button>
                    </Section>

                    <Section title="Footer Tags">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl space-y-4">
                            <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] ml-1">Tags (Comma separated)</label>
                            <input
                                type="text"
                                value={findYourSportData.footerTags.join(', ')}
                                onChange={(e) => {
                                    setFindYourSportData({ ...findYourSportData, footerTags: e.target.value.split(',').map(s => s.trim()) });
                                }}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]"
                            />
                        </div>
                    </Section>
                </div>
            )}



        </div>
    );
};

export default HomePageCms;
