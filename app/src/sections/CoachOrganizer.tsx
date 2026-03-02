import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, UserCheck, Globe, LineChart, MapPin, Zap, Trophy } from 'lucide-react';
import CoachRegistrationModal from '../components/CoachRegistrationModal';
import VenueRegistrationModal from '../components/VenueRegistrationModal';

gsap.registerPlugin(ScrollTrigger);

const CoachOrganizer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal header
      gsap.fromTo(
        '.co-header-simple > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      // Reveal blocks
      const blocks = gsap.utils.toArray('.role-block');
      blocks.forEach((block: any) => {
        gsap.fromTo(
          block.querySelectorAll('.reveal-item'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const roles = [
    {
      id: 'coach',
      tag: 'Coaching Professional',
      title: "Coaching Excellence",
      description: "Scale your coaching business with India's most powerful sports professional network. Reach more athletes and streamline your operations.",
      image: '/images/coach_card.jpg',
      steps: [
        {
          icon: UserCheck,
          title: 'Elite Verification',
          desc: "Gain instant credibility with the 'Elite Pro' badge and verified background."
        },
        {
          icon: Globe,
          title: 'National Exposure',
          desc: "Connect with a database of 120,000+ active athletes across the country."
        },
        {
          icon: LineChart,
          title: 'Business Suite',
          desc: "Professional tools for scheduling, payments, and performance analytics."
        },
      ],
      cta: 'Join as Coach',
      theme: 'var(--accent-orange)',
    },
    {
      id: 'organizer',
      tag: 'Facility Management',
      title: "Venue Optimization",
      description: "Maximize your facility's potential with seamless digital booking and end-to-end tournament management systems.",
      image: '/images/organizer_card.jpg',
      steps: [
        {
          icon: MapPin,
          title: 'Smart Listing',
          desc: "Feature your venue with professional galleries and dynamic amenity highlights."
        },
        {
          icon: Zap,
          title: 'Instant Booking',
          desc: "Enable real-time availability and frictionless transactions for your users."
        },
        {
          icon: Trophy,
          title: 'Event Management',
          desc: "Full-stack tools for hosting sanctioned tournaments and local leagues."
        },
      ],
      cta: 'List Venue',
      theme: 'white',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="coaches"
      className="relative py-12 md:py-20 bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Refined Header */}
        <div className="co-header-simple mb-12 text-center lg:text-left">
          <span className="text-[10px] font-black tracking-[0.4em] text-[var(--accent-orange)] uppercase mb-4 block">
            Partner With Us
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] leading-tight tracking-tight mb-6 uppercase">
            Grow Your <span className="text-gradient">Professional Impact</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Join the specialized ecosystem built for high-performance sports management.
            Choose the membership path that fits your specialty.
          </p>
        </div>

        {/* Professional Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {roles.map((role) => (
            <div key={role.id} className="role-block flex flex-col bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[40px] p-6 md:p-10 group hover:border-[var(--accent-orange)]/20 transition-all duration-500">
              {/* Image Container */}
              <div className="reveal-item relative aspect-video overflow-hidden rounded-3xl mb-8 bg-[var(--bg-primary)] border border-[var(--border)]">
                <img
                  src={role.image}
                  alt={role.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
              </div>

              {/* Content Container */}
              <div className="flex flex-col flex-grow">
                <span className="reveal-item text-[10px] font-black tracking-[0.3em] mb-4 uppercase text-[var(--text-primary)]/40">
                  {role.tag}
                </span>

                <h3 className="reveal-item text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight uppercase">
                  {role.title}
                </h3>

                <p className="reveal-item text-sm text-[var(--text-secondary)] mb-10 font-medium leading-relaxed">
                  {role.description}
                </p>

                {/* Enriched Points */}
                <div className="reveal-item space-y-8 mb-12">
                  {role.steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex gap-5 group/step">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border)] group-hover/step:border-[var(--accent-orange)]/50 transition-colors">
                          <Icon className="w-5 h-5 text-[var(--text-primary)]/70 group-hover/step:text-[var(--accent-orange)] transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1 tracking-tight">
                            {step.title}
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Call to Action */}
                <div className="reveal-item mt-auto">
                  <button
                    onClick={() => {
                      if (role.id === 'organizer') {
                        setIsVenueModalOpen(true);
                      } else {
                        // Open Coach Modal
                        setIsCoachModalOpen(true);
                      }
                    }}
                    className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 group/cta shadow-lg"
                  >
                    <span className="text-sm font-bold uppercase tracking-wider">
                      {role.cta}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CoachRegistrationModal
        isOpen={isCoachModalOpen}
        onClose={() => setIsCoachModalOpen(false)}
      />

      <VenueRegistrationModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
      />
    </section>
  );
};

export default CoachOrganizer;
