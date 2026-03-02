import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Users, Trophy, ArrowRight, Check } from 'lucide-react';
import { useCommunityType } from '../contexts/CommunityTypeContext';

gsap.registerPlugin(ScrollTrigger);

interface Template {
  id: string;
  title: string;
  description: string;
  setupTime: string;
  includes: string[];
  image: string;
  popular?: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: 'weekend-cricket',
    title: 'Weekend Cricket League',
    description: 'Complete tournament setup with teams, schedule, scoring, and leaderboard.',
    setupTime: '10 min',
    includes: ['Team registration', 'Match scheduling', 'Live scoring', 'Leaderboard'],
    image: '/images/sport_cricket.png',
    popular: true,
  },
  {
    id: 'corporate-fitness',
    title: 'Corporate Fitness Challenge',
    description: '30-day wellness program with daily activities, tracking, and rewards.',
    setupTime: '15 min',
    includes: ['Daily challenges', 'Progress tracking', 'Team competition', 'Rewards system'],
    image: '/images/community_yoga_main.png',
  },
  {
    id: 'apartment-sports-day',
    title: 'Apartment Sports Day',
    description: 'Annual event template with multiple sports, registration, and volunteer management.',
    setupTime: '20 min',
    includes: ['Multi-sport events', 'Online registration', 'Volunteer coordination', 'Results dashboard'],
    image: '/images/community_01.jpg',
    popular: true,
  },
  {
    id: 'ngo-youth-program',
    title: 'NGO Youth Program',
    description: '3-month development program with sessions, attendance, and progress reports.',
    setupTime: '25 min',
    includes: ['Session planning', 'Attendance tracking', 'Progress reports', 'Impact metrics'],
    image: '/images/rural_football.png',
  },
];

const QuickStartTemplates = () => {
  const { config } = useCommunityType();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.template-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[var(--bg-secondary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-orange)]">
              Quick Start
            </span>
            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
            Ready-to-Use <span className="text-gradient">Templates</span>
          </h2>
          
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Get started in minutes with pre-built templates. Just customize and launch.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="template-card group relative rounded-[24px] bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent-orange)]/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                
                {template.popular && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[var(--accent-orange)] text-[9px] font-black text-white uppercase tracking-wider">
                    Popular
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-black text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-orange)] transition-colors">
                  {template.title}
                </h3>
                
                <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Setup Time */}
                <div className="flex items-center gap-2 mb-4 text-xs text-[var(--text-secondary)]">
                  <Clock className="w-4 h-4 text-[var(--accent-orange)]" />
                  <span>Setup in {template.setupTime}</span>
                </div>

                {/* Includes */}
                <div className="space-y-2 mb-5">
                  {template.includes.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Check className="w-3 h-3 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className="w-full py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--accent-orange)] hover:text-white hover:border-[var(--accent-orange)] transition-all flex items-center justify-center gap-2">
                  Use Template
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Can't find what you need? Create your own custom setup.
          </p>
          <button className="btn-secondary gap-2">
            Create Custom Community
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuickStartTemplates;
