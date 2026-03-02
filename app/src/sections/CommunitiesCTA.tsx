import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, MessageCircle, Check, Sparkles } from 'lucide-react';
import { useCommunityType } from '../contexts/CommunityTypeContext';

interface CommunitiesCTAProps {
  onStartCommunity: () => void;
}

const CommunitiesCTA = ({ onStartCommunity }: CommunitiesCTAProps) => {
  const { config } = useCommunityType();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-content > *',
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const trustPoints = [
    'Free to start',
    'No credit card required',
    'Setup in 5 minutes',
    'Cancel anytime',
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-secondary)] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${config.color} rounded-full blur-[200px] opacity-10`} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-orange)] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center cta-content">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20 mb-8">
            <Sparkles className="w-4 h-4 text-[var(--accent-orange)]" />
            <span className="text-sm font-bold text-[var(--accent-orange)]">
              Join 500+ thriving communities
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tight">
            Ready to Build Your{' '}
            <span className="text-gradient">Sports Community?</span>
          </h2>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            Join thousands of communities already thriving on SocioSports. 
            Start organizing, connecting, and growing today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={onStartCommunity}
              className="btn-primary gap-2 px-10 py-4 text-base w-full sm:w-auto"
            >
              Start Your Community
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="/contact"
              className="btn-secondary gap-2 px-10 py-4 text-base w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              Talk to Our Team
            </a>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {trustPoints.map((point, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Check className="w-4 h-4 text-green-500" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitiesCTA;
