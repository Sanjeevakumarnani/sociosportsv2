import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Trophy, Calendar, ArrowRight, Network, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const PoweredByEcosystem = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const ecosystemFeatures = [
    {
      icon: Users,
      title: 'Coaches from Platform',
      stat: '150+',
      statLabel: 'NIS Certified',
      description: 'Every coach at our events is a verified member of the SocioSports network, ensuring professional quality and accountability.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Trophy,
      title: 'Athletes from Platform',
      stat: '5000+',
      statLabel: 'Verified Players',
      description: 'Our tournaments feature athletes who have built their sports profiles on SocioSports, creating a trusted competitive environment.',
      color: 'from-[var(--accent-orange)] to-yellow-500',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.pbe-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Cards stagger animation
      gsap.fromTo(
        '.pbe-card',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.pbe-grid',
            start: 'top 85%',
          },
        }
      );

      // Connection lines animation
      gsap.fromTo(
        '.pbe-connection',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '.pbe-connection-container',
            start: 'top 90%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[var(--accent-orange)]/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[200px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/3 blur-[250px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="pbe-header text-center max-w-4xl mx-auto mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[var(--accent-orange)]" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20">
              <Network className="w-4 h-4 text-[var(--accent-orange)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-orange)]">
                Unified Sports Network
              </span>
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[var(--accent-orange)]" />
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase leading-tight">
            Powered by sports professional <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D00] via-[#FF7043] to-[#FFAB91]">
              athletes & trainers
            </span>
          </h2>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto">
            Our events are driven by elite talent. Certified trainers, professional athletes, and expert coaches—all brought together to deliver an unmatched sports experience.
          </p>
        </div>

        {/* Ecosystem Cards Grid */}
        <div className="pbe-grid grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {ecosystemFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="pbe-card group relative bg-[var(--bg-primary)] rounded-[32px] p-6 md:p-8 border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-[2px] mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[var(--accent-orange)]" />
                </div>
              </div>

              {/* Stat */}
              <div className="mb-4">
                <div className="text-4xl md:text-5xl font-black text-[var(--text-primary)] leading-none mb-1">
                  {feature.stat}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent-orange)]">
                  {feature.statLabel}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 uppercase tracking-tight group-hover:text-[var(--accent-orange)] transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-8 right-8 h-[3px] rounded-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>
          ))}
        </div>

        {/* Connection Visualization */}
        <div className="pbe-connection-container relative max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="flex-1 text-right">
              <span className="text-sm font-bold text-[var(--text-secondary)]">Sports on Wheels</span>
            </div>
            <div className="pbe-connection relative flex-1 h-[3px] bg-gradient-to-r from-[var(--accent-orange)] via-purple-500 to-blue-500 rounded-full origin-left" />
            <div className="flex-1">
              <span className="text-sm font-bold text-[var(--text-secondary)]">SocioSports Platform</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pbe-header text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 md:p-8 bg-[var(--bg-secondary)] rounded-[32px] border border-[var(--border)]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-orange)] to-yellow-500 flex items-center justify-center">
                <Network className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">
                  One Platform. Infinite Possibilities.
                </div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">
                  Connect with India's top sports professionals
                </div>
              </div>
            </div>
            <Link
              to="/ecosystem"
              className="btn-primary px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-3 group whitespace-nowrap"
            >
              Explore Ecosystem
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoweredByEcosystem;
