import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Users,
  Heart,
  TrendingUp,
  Zap,
  Activity,
  Award,
  ArrowUpRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CommunityVibe = ({ isHomeTeaser = false }: { isHomeTeaser?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [currentFeedIdx, setCurrentFeedIdx] = useState(0);
  const [activeRegionalIdx, setActiveRegionalIdx] = useState(0);
  const [activeEcosystemIdx, setActiveEcosystemIdx] = useState(0);
  const [activeImpactIdx, setActiveImpactIdx] = useState(0);
  const [regionalPaused, setRegionalPaused] = useState(false);
  const [ecoPaused, setEcoPaused] = useState(false);

  // CMS State
  const [content, setContent] = useState({
    introTitle: "SPORTS AREN'T JUST ABOUT WINNING.",
    introSubtitle: "IT'S ABOUT BELONGING",
    introDesc: "In a world where we're more connected digitally yet lonelier than ever, SocioSports brings back the joy of real, physical sports communities.",
    quote: "\"From 8 to 80, everyone has a place in sports. We're building the infrastructure for belonging.\" 🌟",
    impactPulseData: [
      {
        title: "Digital Identity",
        value: "100%",
        label: "Achievements Preserved",
        desc: "Moving medals from drawers to permanent, shareable athletic portfolios.",
        subText: "Identity, not just moments."
      },
      // ... (truncated default data for brevity, will rely on CMS or default)
      { title: "Coach Visibility", value: "4.8K", label: "Trainers Recognized", desc: "Giving credit to the unsung heroes shaping champions before they're famous.", subText: "Mentorship matters." },
      { title: "Smart Discovery", value: "23+", label: "Tournaments/City", desc: "Athletes now discover 100% of local opportunities, up from just 5-10%.", subText: "Never miss a game." },
      { title: "Network Impact", value: "5x", label: "Growth Multiplier", desc: "Isolation is a talent killer. Physical networks accelerate athletic progress.", subText: "Connection is power." },
      { title: "Regional Reach", value: "14+", label: "Active Sports Hubs", desc: "Building vibrant sports communities from Hyderabad to Bangalore.", subText: "Physical Joy at Scale." }
    ],
    liveFeeds: [
      { user: 'Anjali Sharma', text: '"I had 14 state medals but zero digital presence. Scouts couldn\'t find me until I moved my entire archive to SocioSports."', kudos: 890 },
      { user: 'Coach Anil Kumar', text: '"I was 2km away from kids needing coaching, but invisible. The location discovery engine filled my slots in 3 months."', kudos: 1240 },
      { user: 'Scout Vikram Malhotra', text: '"Verifying athlete claims manually took hours. Now, I save 75% of my time by searching only verified profiles."', kudos: 560 }
    ]
  });

  const { impactPulseData, liveFeeds } = content;

  const regionalSlides = [
    {
      title: 'The Discovery Reality',
      data: [
        { city: 'Mumbai', units: '143+ Tournaments', growth: '90% Missed', color: 'text-red-500' },
        { city: 'National Gap', units: '50,000+ Slots', growth: 'Unfilled', color: 'text-[var(--accent-orange)]' },
        { city: 'Discovery ROI', units: '100% Visibility', growth: '+24% Participation', color: 'text-green-500' },
        { city: 'Hyderabad Hub', units: '2.3km Match', growth: 'Elite Access', color: 'text-purple-500' },
      ]
    },
    {
      title: 'Economic Impact',
      data: [
        { city: 'Coach Revenue', units: '3x Income Growth', growth: '+200% Capacity', color: 'text-blue-500' },
        { city: 'Facility ROI', units: 'Rent: ₹25k/mo', growth: 'Filled 10% → 90%', color: 'text-[var(--accent-orange)]' },
        { city: 'Scouting Efficiency', units: '75% Time Saved', growth: '100% Trust', color: 'text-green-500' },
        { city: 'Student Retention', units: '40% Improvement', growth: 'Verified Progress', color: 'text-purple-500' },
      ]
    }
  ];

  const ecosystemSlides = [
    {
      title: 'Career Infrastructure',
      params: [
        { title: 'Govt Job Gateway', desc: 'Direct access to Indian Railways Sports Quota and 54+ verified vacancies.', icon: Award, stat: 'Live Now' },
        { title: 'Digital Legacy', desc: 'Secure lifetime documentation for scholarship interviews and college quotas.', icon: Zap, stat: 'Permanent' },
        { title: 'Verification Engine', desc: 'Coach endorsements and automated stats that scouts trust 100%.', icon: Users, stat: 'Certified' },
        { title: 'Direct Access', desc: 'Verified direct-to-recruiter messaging, eliminating middlemen and agents.', icon: TrendingUp, stat: '1:1 Ready' }
      ]
    },
    {
      title: 'Beyond the Medal',
      params: [
        { title: 'The Mentor Path', desc: 'Transform from a retired competitor into a high-demand professional coach.', icon: Heart, stat: 'New Income' },
        { title: 'Visible Talent', desc: 'Arjun had 14 medals but zero search presence. Now he is scout-findable.', icon: Activity, stat: 'Discovered' },
        { title: 'Ecosystem Access', desc: 'Connecting the "Isolated Athlete" to a billion-dollar sports industry.', icon: TrendingUp, stat: 'Growth Opps' },
        { title: 'Video Proof', desc: 'A dedicated library for performance highlights searchable by elite scouts.', icon: Activity, stat: 'Skill-Verified' }
      ]
    }
  ];

  // Fetch CMS Content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await import('../services/api').then(m => m.api.cms.get('home-community'));
        if (data && data.content) {
          const parsed = JSON.parse(data.content);
          // Merge with default deep structures if needed, or just replace
          setContent(prev => ({
            ...prev,
            ...parsed,
            // Ensure arrays are present if parsed lacks them (though CMS should correct them)
            impactPulseData: parsed.impactPulseData || prev.impactPulseData,
            liveFeeds: parsed.liveFeeds || prev.liveFeeds
          }));
        }
      } catch (error) {
        console.error("Failed to load CommunityVibe content", error);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    if (liveFeeds.length === 0 || impactPulseData.length === 0) return;

    const feedInt = setInterval(() => setCurrentFeedIdx((prev: number) => (prev + 1) % liveFeeds.length), 5000);
    const impactInt = setInterval(() => setActiveImpactIdx((prev) => (prev + 1) % impactPulseData.length), 5000);

    let regInt: any;
    if (!regionalPaused) {
      regInt = setInterval(() => setActiveRegionalIdx((prev) => (prev + 1) % regionalSlides.length), 6000);
    }

    let ecoInt: any;
    if (!ecoPaused) {
      ecoInt = setInterval(() => setActiveEcosystemIdx((prev) => (prev + 1) % ecosystemSlides.length), 6000);
    }

    return () => {
      clearInterval(feedInt);
      clearInterval(impactInt);
      if (regInt) clearInterval(regInt);
      if (ecoInt) clearInterval(ecoInt);
    };
  }, [liveFeeds.length, impactPulseData.length, regionalPaused, ecoPaused]);

  // Handle Pause with 10s delay logic
  const handleHoverPause = (type: 'reg' | 'eco') => {
    if (type === 'reg') {
      setRegionalPaused(true);
      setTimeout(() => setRegionalPaused(false), 10000);
    } else {
      setEcoPaused(true);
      setTimeout(() => setEcoPaused(false), 10000);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.info-panel',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: infoRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="community"
      className="relative py-20 bg-[var(--bg-primary)] border-t border-[var(--border)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
        {/* Belonging Intro */}
        {/* Belonging Intro */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-20 lg:mb-32">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] leading-tight tracking-tight mb-6">
              {content.introTitle}
              <br />
              <span className="text-gradient">{content.introSubtitle}</span>
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium mb-10 leading-relaxed max-w-2xl">
              {content.introDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                {
                  icon: '⚽',
                  title: 'Adults',
                  desc: 'Find groups that match your skill level'
                },
                {
                  icon: '🧘',
                  title: 'Seniors',
                  desc: 'Morning walks and holistic wellness'
                },
                {
                  icon: '👨‍👩‍👧‍👦',
                  title: 'Families',
                  desc: 'Weekend sports for all ages'
                },
                {
                  icon: '💡',
                  title: 'Wisdom',
                  desc: 'Boost mental health by 40% together'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-primary)]/20 transition-all group">
                  <div className="text-2xl mb-3 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                  <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-1">{item.title}</h4>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-lg font-bold text-[var(--text-primary)]/90 italic border-l-2 border-[var(--accent-orange)] pl-6">
              {content.quote}
            </p>
          </div>

          {/* New Visual: Impact Pulse (Fills empty space) */}
          <div className="flex-1 w-full max-w-sm xl:max-w-md">
            <div className="bg-[var(--bg-secondary)] rounded-[32px] p-6 md:p-8 border border-[var(--border)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange)]/10 blur-[60px] rounded-full" />

              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-[var(--text-primary)]/40 uppercase tracking-[0.3em]">Impact Pulse</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-500 uppercase">Live Data</span>
                </div>
              </div>

              <div key={activeImpactIdx} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
                <div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]/60">{impactPulseData[activeImpactIdx].label}</span>
                    <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">{impactPulseData[activeImpactIdx].value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent-orange)] to-orange-400 rounded-full shadow-[0_0_15px_rgba(255,107,0,0.5)] transition-all duration-1000"
                      style={{ width: impactPulseData[activeImpactIdx].value.includes('%') ? impactPulseData[activeImpactIdx].value : '85%' }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                  <div className="text-[10px] font-black text-[var(--text-primary)]/80 leading-relaxed mb-1">
                    {impactPulseData[activeImpactIdx].desc}
                  </div>
                  <div className="text-[8px] text-[var(--accent-orange)] font-black uppercase tracking-widest">
                    {impactPulseData[activeImpactIdx].subText}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--bg-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-primary)]">
                          {['R', 'P', 'V', 'S'][i - 1]}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--accent-orange)] flex items-center justify-center text-[8px] font-black text-white">
                        +12k
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-primary)]/50 leading-tight">
                      <span className="text-[var(--text-primary)]">Active Growth:</span> Join <br /> national hubs this week
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-full btn-secondary py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-black transition-all">
                Join the Movement
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Header: User Friendly */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[1px] bg-[var(--accent-orange)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent-orange)]">Ecosystem Network</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] leading-tight tracking-tight uppercase mb-4">
            BEYOND THE MEDAL: <span className="text-[var(--text-primary)]/40">DIGITAL</span> LEGACY
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">
            A medal tells the world you won, but your profile tells them who you ARE.
            We're bridging the networking infrastructure gap in India, transforming
            isolated talent into a connected ecosystem of opportunities. 🚀
          </p>
        </div>
        {!isHomeTeaser && (
          <>
            {/* Information-Rich Intelligence Hub */}
            <div
              ref={infoRef}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* 1. Regional Activity Report (4 Cols) */}
              <div
                onMouseEnter={() => handleHoverPause('reg')}
                className="info-panel md:col-span-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 md:p-8 flex flex-col h-[480px] transition-all hover:bg-[var(--bg-primary)]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Local Activity</h3>
                  </div>
                  <div className="flex gap-1">
                    {regionalSlides.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeRegionalIdx ? 'bg-[var(--accent-orange)]' : 'bg-[var(--text-primary)]/10'}`} />
                    ))}
                  </div>
                </div>

                <div key={activeRegionalIdx} className="space-y-6 flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <h4 className="text-[10px] font-black text-[var(--text-primary)]/30 uppercase tracking-[0.2em] mb-2">{regionalSlides[activeRegionalIdx].title}</h4>
                  {regionalSlides[activeRegionalIdx].data.map((loc, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)] mb-1">{loc.city}</div>
                        <div className="text-[10px] font-bold text-[var(--text-primary)]/30 uppercase tracking-widest">{loc.units}</div>
                      </div>
                      <div className={`text-[10px] font-black ${loc.color} bg-[var(--bg-primary)] px-2 py-1 rounded`}>
                        {loc.growth}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-8 group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--accent-orange)] hover:text-white transition-colors">
                  Full Network View <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              {/* 2. Professional Scouting & Network Logic (5 Cols) */}
              <div
                onMouseEnter={() => handleHoverPause('eco')}
                className="info-panel md:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 md:p-8 h-[480px] transition-all hover:bg-[var(--bg-primary)]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-500" />
                    <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Trust & Safety</h3>
                  </div>
                  <div className="flex gap-1">
                    {ecosystemSlides.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeEcosystemIdx ? 'bg-green-500' : 'bg-[var(--text-primary)]/10'}`} />
                    ))}
                  </div>
                </div>

                <div key={activeEcosystemIdx} className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <h4 className="text-[10px] font-black text-[var(--text-primary)]/30 uppercase tracking-[0.2em] mb-2">{ecosystemSlides[activeEcosystemIdx].title}</h4>
                  {ecosystemSlides[activeEcosystemIdx].params.map((item, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border)] group-hover:bg-[var(--accent-orange)]/20 transition-all">
                        <item.icon className="w-4 h-4 text-[var(--text-primary)]/60 group-hover:text-[var(--accent-orange)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">{item.title}</h4>
                          <span className="text-[9px] font-black text-green-500 uppercase">{item.stat}</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Community Engagement Pulse (3 Cols) */}
              <div className="info-panel md:col-span-3 space-y-6">
                <div className="bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20 rounded-3xl p-6 md:p-8 relative overflow-hidden h-[300px] flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <Heart className="w-6 h-6 text-[var(--accent-orange)]" />
                    <span className="px-2 py-1 rounded-md bg-[var(--accent-orange)] text-[8px] font-black text-white uppercase tracking-widest animate-pulse">Live Feed</span>
                  </div>

                  <div key={currentFeedIdx} className="animate-in fade-in slide-in-from-right-4 duration-1000">
                    <p className="text-sm font-bold text-white mb-6 leading-relaxed italic">
                      {liveFeeds[currentFeedIdx].text}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-white">
                        {liveFeeds[currentFeedIdx].user[0]}
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white">{liveFeeds[currentFeedIdx].user}</div>
                        <div className="text-[8px] font-black text-[var(--accent-orange)] uppercase tracking-widest">Kudos {liveFeeds[currentFeedIdx].kudos}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 md:p-8">
                  <h4 className="text-[10px] font-black text-[var(--text-primary)]/30 uppercase tracking-[0.2em] mb-4">Ecosystem Movements</h4>
                  <div className="space-y-3">
                    {['#BEYOND_THE_MEDAL', '#DIGITAL_IDENTITY', '#SCOUT_READY'].map(tag => (
                      <div key={tag} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-xs font-black text-[var(--text-primary)]/60 group-hover:text-[var(--text-primary)] transition-colors">{tag}</span>
                        <ArrowUpRight className="w-3 h-3 text-[var(--text-primary)]/20 group-hover:text-[var(--accent-orange)]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Metrics Bar */}
            <div className="mt-16 pt-10 border-t border-[var(--border)] flex flex-wrap justify-center gap-12 md:gap-24">
              {[
                { label: 'Tracked Tournaments', value: '1,432+' },
                { label: 'Empty Slots Filled', value: '50,000+' },
                { label: 'Income Growth', value: '3x Avg.' },
                { label: 'Verified Legacy', value: '100%' }
              ].map((m, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-[var(--text-primary)] tracking-tighter mb-1">{m.value}</div>
                  <div className="text-[9px] font-black text-[var(--text-primary)]/30 uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CommunityVibe;
