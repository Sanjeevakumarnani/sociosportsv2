import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  name: string;
  role: string;
  community: string;
  type: string;
  image: string;
  quote: string;
  highlights: string[];
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Community Head',
    community: 'Hiranandani Apartments',
    type: 'Apartment',
    image: '/images/community_01.jpg',
    quote: 'SocioSports transformed our residential community. We went from 10 people playing occasionally to 150+ active members with weekly tournaments.',
    highlights: ['150+ members', 'Weekly tournaments', '15x growth'],
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Sports Coordinator',
    community: 'Tech Mahindra',
    type: 'Corporate',
    image: '/images/community_02.jpg',
    quote: 'Employee engagement increased by 340% after implementing regular sports programs. The ROI on wellness is incredible.',
    highlights: ['340% engagement', '200+ employees', '40% wellness improvement'],
    rating: 5,
  },
  {
    name: 'Coach Venkatesh',
    role: 'Founder',
    community: 'Warangal Youth Sports',
    type: 'NGO',
    image: '/images/rural_football.png',
    quote: 'The platform helped us track 500+ youth across 8 centers. Our donor funding increased 200% thanks to transparent impact reporting.',
    highlights: ['500+ youth', '8 centers', '200% funding increase'],
    rating: 5,
  },
  {
    name: 'Dr. Meera Reddy',
    role: 'Sports Director',
    community: 'Delhi Public School',
    type: 'School',
    image: '/images/community_03.jpg',
    quote: 'Our students now have verifiable digital sports portfolios. 15 students got scouted nationally in the first year.',
    highlights: ['15 students scouted', 'Digital portfolios', 'National recognition'],
    rating: 5,
  },
];

const CommunityTestimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-card',
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[var(--bg-primary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Quote className="w-6 h-6 text-[var(--accent-orange)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-orange)]">
              Testimonials
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
            What Community <span className="text-gradient">Leaders Say</span>
          </h2>
          
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Real feedback from organizers who transformed their communities.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              className="testimonial-card group p-6 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all"
            >
              {/* Top Row */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--accent-orange)] flex items-center justify-center">
                    <span className="text-[10px] font-black text-white">
                      {testimonial.type[0]}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-black text-[var(--text-primary)]">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {testimonial.role}, {testimonial.community}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-[var(--text-primary)] leading-relaxed mb-4 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {testimonial.highlights.map((highlight, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityTestimonials;
