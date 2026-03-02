import { useEffect, useRef, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Users, Trophy, MapPin, Star, Activity, TrendingUp, Clock } from 'lucide-react';
import { useCommunityType } from '../contexts/CommunityTypeContext';
import { useState } from 'react';

interface CommunitiesHeroProps {
  onStartCommunity: () => void;
}

const CommunitiesHero = forwardRef<HTMLElement, CommunitiesHeroProps>(({ onStartCommunity }, forwardedRef) => {
  const { config } = useCommunityType();
  const internalRef = useRef<HTMLElement>(null);
  const heroRef = (forwardedRef as React.RefObject<HTMLElement>) || internalRef;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-content > *',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        '.hero-stats > *',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.5,
          ease: 'back.out(1.2)',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [config.id]); // Re-animate when type changes

  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Real-time counter simulation
  const [liveStats, setLiveStats] = useState({
    communities: 524,
    members: 54290,
    matches: 842
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        communities: prev.communities + (Math.random() > 0.9 ? 1 : 0),
        members: prev.members + Math.floor(Math.random() * 3),
        matches: prev.matches + (Math.random() > 0.7 ? 1 : 0)
      }));
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Users,
      value: liveStats.communities.toLocaleString() + '+',
      label: 'Communities',
      trend: '+12%',
      trendUp: true,
      subtext: 'Across 12+ Sports'
    },
    {
      icon: Trophy,
      value: liveStats.members.toLocaleString() + '+',
      label: 'Active Members',
      trend: '+5.4k',
      trendUp: true,
      subtext: '5k+ Pro Coaches'
    },
    {
      icon: MapPin,
      value: '18+',
      label: 'Cities',
      trend: 'New',
      trendUp: true,
      subtext: 'Pune, Chennai added'
    },
    {
      icon: Activity,
      value: liveStats.matches.toLocaleString(),
      label: 'Daily Matches',
      trend: 'Live',
      trendUp: true,
      subtext: 'Peak: 1.2k weekends'
    },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-secondary)]">
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${config.color} rounded-full blur-[150px] opacity-30`} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-orange)] rounded-full blur-[120px] opacity-20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 xl:px-16 py-20 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="hero-content">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-orange)]">
                  For {config.shortLabel}
                </span>
                <span className="text-2xl">{config.icon}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-6 leading-tight tracking-tight">
                {config.headline.split(' ').map((word, idx) => (
                  <span key={idx}>
                    {idx === 2 || idx === 3 ? (
                      <span className="text-gradient">{word} </span>
                    ) : (
                      `${word} `
                    )}
                  </span>
                ))}
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-xl leading-relaxed">
                {config.subtext}
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={onStartCommunity}
                  className="btn-primary gap-2 px-8 py-4 text-base"
                >
                  Start a Community
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>

            {/* Right: Stats & Visual */}
            <div className="hero-stats relative">
              <div className="bg-[var(--bg-secondary)] rounded-[32px] p-8 border border-[var(--border)] relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${config.color} rounded-full blur-[80px] opacity-20`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
                      Platform Stats
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-500 uppercase">Live</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] group hover:border-[var(--accent-orange)]/30 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <stat.icon className="w-5 h-5 text-[var(--accent-orange)]" />
                          <div className={`flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-md ${stat.trend === 'Live' ? 'bg-green-500/20 text-green-500' : 'bg-[var(--accent-orange)]/10 text-orange-500'}`}>
                            <TrendingUp className="w-2.5 h-2.5" />
                            {stat.trend}
                          </div>
                        </div>
                        <div className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">
                          {stat.value}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">
                          {stat.label}
                        </div>
                        <div className="text-[9px] text-[var(--text-secondary)]/60 font-medium italic">
                          {stat.subtext}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3 text-[var(--accent-orange)]" />
                      Last Updated: {lastUpdated}
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--accent-orange)]/10 to-orange-500/10 border border-[var(--accent-orange)]/20">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-[var(--bg-secondary)] bg-gradient-to-br from-[var(--accent-orange)] to-orange-500 flex items-center justify-center text-[10px] font-bold text-white"
                          >
                            {['A', 'P', 'R', 'S'][i - 1]}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-[var(--text-primary)]">+12 joined</span>
                        <span className="text-[var(--text-secondary)]"> in the last hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CommunitiesHero.displayName = 'CommunitiesHero';

export default CommunitiesHero;
