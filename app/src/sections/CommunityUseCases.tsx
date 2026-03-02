import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Users, Trophy, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCommunityType, type CommunityType } from '../contexts/CommunityTypeContext';

gsap.registerPlugin(ScrollTrigger);

interface UseCase {
  type: CommunityType;
  title: string;
  before: string[];
  after: string[];
  impact: string;
  image: string;
  quote: string;
  author: string;
}

const USE_CASES: UseCase[] = [
  {
    type: 'apartments',
    title: 'Hiranandani Apartments',
    before: ['10 players', 'Irregular games', 'WhatsApp chaos', 'No facility tracking'],
    after: ['150+ members', 'Weekly tournaments', 'Organized platform', 'Full analytics'],
    impact: '15x growth in 6 months',
    image: '/images/community_01.jpg',
    quote: 'We went from struggling to find players to having a waitlist for our weekend leagues.',
    author: 'Priya Sharma, Community Head',
  },
  {
    type: 'corporate',
    title: 'Infosys Mysore',
    before: ['Isolated employees', 'High stress metrics', 'Unused sports complex', 'Zero team activities'],
    after: ['50+ active clubs', 'Wellness scores up 40%', 'Daily tournaments', 'Vibrant campus life'],
    impact: '90% employee satisfaction',
    image: '/images/community_06.jpg',
    quote: 'Our campus is now buzzing with energy even on weekends. Sports brought life back to the workplace.',
    author: 'Vikram Singh, Campus Head',
  },
  {
    type: 'corporate',
    title: 'Google Hyderabad',
    before: ['Siloed teams', 'High burnout risk', 'Empty recreational areas', 'No organized play'],
    after: ['Cross-functional leagues', 'Improved work-life balance', '100% facility usage', 'Active sports clubs'],
    impact: '30% higher team morale',
    image: '/images/community_05.jpg',
    quote: 'The inter-team tournaments created bonds that improved collaboration back at the desk.',
    author: 'Sarah Jenkins, People Operations',
  },
  {
    type: 'ngo',
    title: 'Warangal Youth Program',
    before: ['Manual attendance', 'Paper records', 'No progress tracking', 'Limited reporting'],
    after: ['Digital profiles', 'Real-time analytics', 'Progress dashboards', 'Auto-generated reports'],
    impact: '85% retention rate',
    image: '/images/rural_football.png',
    quote: 'Our donors love the transparent impact reports. Funding increased by 200%.',
    author: 'Coach Venkatesh, Founder',
  },
  {
    type: 'school',
    title: 'Delhi Public School',
    before: ['Paper records', 'Lost achievements', 'Limited visibility', 'Manual tournaments'],
    after: ['Digital profiles', 'Permanent records', 'National exposure', 'Automated events'],
    impact: '15 students scouted',
    image: '/images/community_03.jpg',
    quote: 'Our students now have verifiable sports portfolios that help with college admissions.',
    author: 'Dr. Meera Reddy, Sports Director',
  },
  {
    type: 'apartments',
    title: 'Brigade Gateway Community',
    before: ['50 active players', 'Sporadic events', 'No coordination', 'Unused facilities'],
    after: ['500+ active members', 'Daily activities', 'Dedicated sports committee', 'Fully utilized amenities'],
    impact: '10x member engagement',
    image: '/images/community_04.jpg',
    quote: 'What started as a small cricket group now includes badminton, tennis, swimming, and yoga. The platform made it all possible.',
    author: 'Arun Kumar, Resident Sports Lead',
  },
];

const CommunityUseCases = () => {
  const { selectedType } = useCommunityType();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCase, setActiveCase] = useState<UseCase | null>(null);

  // Filter use cases based on selected type, or show all
  const filteredCases = USE_CASES.filter((c) => c.type === selectedType || !selectedType);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.usecase-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedType]);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[var(--bg-secondary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-[var(--accent-orange)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-orange)]">
              Success Stories
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
            Real <span className="text-gradient">Impact</span> Stories
          </h2>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            See how communities like yours transformed their sports culture.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredCases.map((useCase, idx) => (
            <div
              key={idx}
              className="usecase-card group bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border)] overflow-hidden hover:border-[var(--accent-orange)]/30 transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-xl font-black text-white mb-1">{useCase.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="w-4 h-4" />
                    {useCase.type.charAt(0).toUpperCase() + useCase.type.slice(1)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Before/After */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-xs font-black text-red-400 uppercase tracking-wider mb-2">
                      Before
                    </div>
                    <ul className="space-y-1">
                      {useCase.before.map((item, i) => (
                        <li key={i} className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-black text-green-400 uppercase tracking-wider mb-2">
                      After
                    </div>
                    <ul className="space-y-1">
                      {useCase.after.map((item, i) => (
                        <li key={i} className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Impact Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20 mb-4">
                  <TrendingUp className="w-4 h-4 text-[var(--accent-orange)]" />
                  <span className="text-sm font-bold text-[var(--accent-orange)]">{useCase.impact}</span>
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-[var(--text-secondary)] italic mb-2">
                  "{useCase.quote}"
                </blockquote>
                <cite className="text-xs text-[var(--text-primary)] font-bold not-italic">
                  — {useCase.author}
                </cite>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="btn-secondary gap-2 inline-flex items-center"
          >
            View All Success Stories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommunityUseCases;
