import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Trophy, BarChart3, MapPin, Calendar, Heart, Building, Target } from 'lucide-react';
import { useCommunityType, type CommunityType } from '../contexts/CommunityTypeContext';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  icon: typeof Users;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

const FEATURES_BY_TYPE: Record<CommunityType, Feature[]> = {
  apartments: [
    {
      icon: Building,
      title: 'Manage Facilities',
      description: 'Book courts, grounds, and equipment for residents with easy scheduling.',
      stat: '500+',
      statLabel: 'Facilities Managed',
    },
    {
      icon: Users,
      title: 'Organize Leagues',
      description: 'Create weekend tournaments with automatic scheduling and live scoring.',
      stat: '1,200+',
      statLabel: 'Events Hosted',
    },
    {
      icon: Calendar,
      title: 'Send Notifications',
      description: 'WhatsApp and email alerts for events, bookings, and community updates.',
      stat: '50K+',
      statLabel: 'Notifications Sent',
    },
    {
      icon: BarChart3,
      title: 'Track Usage',
      description: 'Analytics on facility utilization, participation, and member engagement.',
      stat: '98%',
      statLabel: 'Satisfaction Rate',
    },
  ],
  corporate: [
    {
      icon: Building,
      title: 'Employee Teams',
      description: 'Create inter-department teams and leagues for team building.',
      stat: '200+',
      statLabel: 'Companies Active',
    },
    {
      icon: Heart,
      title: 'Wellness Programs',
      description: 'Track employee fitness goals, activities, and wellness metrics.',
      stat: '85%',
      statLabel: 'Engagement Increase',
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Schedule sports days, team-building events, and corporate tournaments.',
      stat: '1,500+',
      statLabel: 'Events Organized',
    },
    {
      icon: Trophy,
      title: 'Recognition',
      description: 'Leaderboards, awards, and recognition for active participants.',
      stat: '10K+',
      statLabel: 'Awards Given',
    },
  ],
  ngo: [
    {
      icon: Users,
      title: 'Youth Registration',
      description: 'Easy onboarding for program participants with digital profiles.',
      stat: '25K+',
      statLabel: 'Youth Registered',
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Monitor individual and group development with detailed metrics.',
      stat: '92%',
      statLabel: 'Tracking Accuracy',
    },
    {
      icon: BarChart3,
      title: 'Impact Reports',
      description: 'Generate professional reports for donors and stakeholders.',
      stat: '500+',
      statLabel: 'Reports Generated',
    },
    {
      icon: MapPin,
      title: 'Multi-location',
      description: 'Manage programs across different centers from one dashboard.',
      stat: '14+',
      statLabel: 'Cities Covered',
    },
  ],
  school: [
    {
      icon: Users,
      title: 'Student Profiles',
      description: 'Digital sports profiles for every student with achievement tracking.',
      stat: '50K+',
      statLabel: 'Students Active',
    },
    {
      icon: Calendar,
      title: 'Tournament Management',
      description: 'Organize inter-house and inter-school competitions effortlessly.',
      stat: '2,000+',
      statLabel: 'Tournaments',
    },
    {
      icon: Trophy,
      title: 'Achievement Records',
      description: 'Permanent digital records of all sports achievements.',
      stat: '100%',
      statLabel: 'Records Preserved',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track student progress and identify talent early.',
      stat: '300+',
      statLabel: 'Schools Using',
    },
  ],
  club: [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Handle memberships, renewals, and member communications.',
      stat: '100K+',
      statLabel: 'Members Managed',
    },
    {
      icon: Calendar,
      title: 'Event Organization',
      description: 'Plan and execute club events, matches, and tournaments.',
      stat: '5,000+',
      statLabel: 'Events Hosted',
    },
    {
      icon: Trophy,
      title: 'Competition Registration',
      description: 'Easy registration for external competitions and leagues.',
      stat: '1,200+',
      statLabel: 'Registrations',
    },
    {
      icon: BarChart3,
      title: 'Growth Analytics',
      description: 'Track membership growth, engagement, and revenue.',
      stat: '45%',
      statLabel: 'Avg Growth',
    },
  ],
};

const WhatYouCanDo = () => {
  const { selectedType, config } = useCommunityType();
  const sectionRef = useRef<HTMLElement>(null);
  const features = FEATURES_BY_TYPE[selectedType];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 40 },
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
  }, [selectedType]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-20 bg-[var(--bg-primary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-orange)]">
              Features
            </span>
            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
            What You Can <span className="text-gradient">Do Here</span>
          </h2>
          
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Powerful tools designed specifically for {config.label.toLowerCase()} to build and manage thriving sports communities.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="feature-card group relative p-6 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} p-[2px] mb-5 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[var(--accent-orange)]" />
                </div>
              </div>

              {/* Stat */}
              <div className="mb-4">
                <div className="text-3xl font-black text-[var(--text-primary)]">
                  {feature.stat}
                </div>
                <div className="text-xs font-bold text-[var(--accent-orange)] uppercase tracking-wider">
                  {feature.statLabel}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-black text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-orange)] transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom Accent */}
              <div className={`absolute bottom-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r ${config.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouCanDo;
