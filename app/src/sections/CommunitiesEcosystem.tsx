import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Trophy, Calendar, Building2, ArrowRight, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CommunitiesEcosystem = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const connections = [
    {
      icon: Users,
      title: 'Athletes',
      description: 'Find local players to join your community and events',
      link: '/athletes',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Trophy,
      title: 'Coaches',
      description: 'Connect with certified trainers for your events and programs',
      link: '/coaches',
      color: 'from-[var(--accent-orange)] to-yellow-500',
    },
    {
      icon: Calendar,
      title: 'Tournaments',
      description: 'Seamlessly register your teams for local competitions',
      link: '/events',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Building2,
      title: 'Institutions',
      description: 'Partner with schools and academies for expanded reach',
      link: '/institutions',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.eco-header > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        '.eco-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.eco-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16 relative">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-orange)]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="eco-header text-center mb-20 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[var(--accent-orange)]/10">
              <Network className="w-5 h-5 text-[var(--accent-orange)]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-orange)]">
              Ecosystem Integration
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tight">
            Powered by <span className="text-gradient">SocioSports Ecosystem</span>
          </h2>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Your community isn't an island. It's the beating heart of a vast network connecting athletes, coaches, and institutions.
          </p>
        </div>

        {/* Central Diagram */}
        <div className="max-w-5xl mx-auto mb-20 relative">
          <div className="relative p-12 md:p-16 rounded-[48px] bg-gradient-to-b from-[var(--bg-secondary)]/50 to-[var(--bg-primary)]/50 border border-[var(--border)] backdrop-blur-sm overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--text-primary) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            {/* Center Hub Architecture */}
            <div className="flex justify-center mb-16 relative z-10">
              <div className="relative group">
                {/* Orbital Rings */}

                {/* Main Orb */}
                <div className="relative w-40 h-40 rounded-full bg-[var(--bg-primary)] border-4 border-[var(--border)] shadow-2xl flex items-center justify-center z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange)] to-orange-600 opacity-90" />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

                  <div className="relative z-20 text-center">
                    <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Impact</div>
                    <div className="text-xl font-black text-white leading-none">
                      YOUR<br />CIRCLE
                    </div>
                  </div>

                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Outer Glows */}
              </div>
            </div>

            {/* Spoke Connections (Visual lines for desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
              {/* Lines would be complex with CSS, GSAP handles the entrance anyway */}
            </div>

            {/* Connection Cards */}
            <div className="eco-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {connections.map((conn, idx) => (
                <Link
                  key={idx}
                  to={conn.link}
                  className="eco-card group relative p-6 rounded-3xl bg-[var(--bg-primary)]/80 border border-[var(--border)] hover:border-[var(--accent-orange)]/50 transition-all duration-500 hover:-translate-y-2 backdrop-blur-md"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${conn.color} p-[1px] mb-5 group-hover:rotate-6 transition-transform duration-500 shadow-lg shadow-black/10`}>
                    <div className="w-full h-full rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center">
                      <conn.icon className="w-6 h-6 text-[var(--accent-orange)] transition-transform group-hover:scale-110" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-orange)] transition-colors">
                    {conn.title}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                    {conn.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-black text-[var(--accent-orange)] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    View Network
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Hover Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange)]/0 to-[var(--accent-orange)]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center relative z-10">
          <Link
            to="/ecosystem"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
          >
            <Network className="w-5 h-5" />
            DISCOVER THE FULL NETWORK
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-xs text-[var(--text-secondary)] font-medium">Join 2,500+ active communities today</p>
        </div>
      </div>
    </section>
  );
};

export default CommunitiesEcosystem;
