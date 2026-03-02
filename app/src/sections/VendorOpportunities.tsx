import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, Calendar, MapPin, Users, ArrowRight, Clock, Check, Package, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import StallBookingModal from '../components/StallBookingModal';
import { useAnalytics } from '../components/AnalyticsProvider';
import { api } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image: string;
  category: string;
  stallsAvailable: number;
  expectedFootfall: string;
}

const VendorOpportunities = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { trackEvent } = useAnalytics();

  const [events, setEvents] = useState<Event[]>([]);

  const stallTypes = [
    {
      name: 'Retail Pop-up',
      image: '/images/event_stall_gear.png',
      desc: 'Maximum exposure for sports gear and apparel. Positioned in high-visibility areas.',
      features: ['10x10 FT Tent', '2 Display Tables', 'Branding Fascia', 'High Footfall Zone'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Nutrition Station',
      image: '/images/event_stall_nutrition.png',
      desc: 'Located at hydration points. Perfect for energy drinks, snacks, and supplements.',
      features: ['8x8 FT Booth', 'Power Supply (15A)', 'Storage Zone', 'Near Rest Areas'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Service Kiosk',
      image: '/images/event_stall_physio.png',
      desc: 'Dedicated area for physiotherapy, massage, and recovery services.',
      features: ['Semi-Private Space', 'Treatment Table', 'Quiet Zone', 'Premium Placement'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Game Zone',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600',
      desc: 'Interactive sports challenges and VR experiences. Great for fan engagement.',
      features: ['VR Setup', 'Console Area', 'Digital Branding', 'Lead Capture'],
      color: 'from-orange-500 to-yellow-500',
    },
    {
      name: 'Fan Corner',
      image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=600',
      desc: 'Exclusive area for merchandise and fan activities. Perfect for sports clubs.',
      features: ['Branded Backdrop', 'Small Counter', 'Display Stand', 'Prize Wheel'],
      color: 'from-red-500 to-rose-500',
    },
    {
      name: 'Refreshment Hub',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
      desc: 'Quick bites, energy coffee, and healthy beverages. Placed near seating.',
      features: ['Cooler Space', 'Waste Management', 'Serving Counter', 'Eco-Friendly'],
      color: 'from-amber-500 to-orange-500',
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const serverEvents = await api.getEvents();
        if (serverEvents && serverEvents.length > 0) {
          const formattedEvents: Event[] = serverEvents.slice(0, 4).map((e: any) => ({
            id: e.id,
            title: e.title,
            location: e.location,
            date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            time: e.time || '9:00 AM',
            image: e.image || '/images/event_default.jpg',
            category: e.type || 'Tournament',
            stallsAvailable: Math.floor(Math.random() * 5) + 1,
            expectedFootfall: `${Math.floor(Math.random() * 300) + 200}+`,
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Failed to load events for vendor opportunities', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.vo-header',
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

      // Events cards animation
      gsap.fromTo(
        '.vo-event-card',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.vo-events-grid',
            start: 'top 85%',
          },
        }
      );

      // Stall cards animation
      gsap.fromTo(
        '.vo-stall-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.vo-stalls-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [events]);

  const handleBookStall = (event: Event | null = null) => {
    setSelectedEvent(event);
    setIsBookingOpen(true);
    trackEvent('open_stall_booking', {
      source: 'vendor_opportunities',
      event_id: event?.id,
      event_title: event?.title,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[var(--bg-primary)] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-orange)]/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="vo-header text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Store className="w-6 h-6 text-[var(--accent-orange)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-orange)]">
              Vendor Opportunities
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase leading-tight">
            Set Up Your Stall at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-orange)] to-yellow-500">
              Our Events
            </span>
          </h2>

          <p className="text-lg text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto">
            Access a captive audience of 500+ athletes and spectators at every Sports on Wheels event. Book your stall and start selling directly to verified sports enthusiasts.
          </p>
        </div>

        {/* Upcoming Events for Vendors - hidden */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[var(--accent-orange)]" />
              <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                Upcoming Events
              </h3>
            </div>
            <Link
              to="/events"
              className="text-sm font-bold text-[var(--accent-orange)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 group"
            >
              View All Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="vo-events-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="vo-event-card group relative bg-[var(--bg-secondary)] rounded-[24px] overflow-hidden border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Event Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[var(--accent-orange)] text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                        {event.category}
                      </span>
                    </div>

                    {/* Stalls Available Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 ${event.stallsAvailable > 2 ? 'bg-green-500' : 'bg-yellow-500'} text-white text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1`}>
                        <Store className="w-3 h-3" />
                        {event.stallsAvailable} stalls
                      </span>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-4">
                    <h4 className="text-base font-black text-[var(--text-primary)] mb-2 uppercase tracking-tight line-clamp-1 group-hover:text-[var(--accent-orange)] transition-colors">
                      {event.title}
                    </h4>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <MapPin className="w-3 h-3 text-[var(--accent-orange)]" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Clock className="w-3 h-3 text-[var(--accent-orange)]" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Users className="w-3 h-3 text-[var(--accent-orange)]" />
                        <span>{event.expectedFootfall} expected</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookStall(event)}
                      className="w-full py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent-orange)] hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2"
                    >
                      <Store className="w-4 h-4" />
                      Book a Stall
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-[var(--bg-secondary)] rounded-[24px] border border-[var(--border)]">
                <Calendar className="w-12 h-12 text-[var(--text-secondary)]/30 mx-auto mb-4" />
                <p className="text-[var(--text-secondary)] font-medium">No upcoming events at the moment.</p>
                <p className="text-sm text-[var(--text-secondary)]/60 mt-1">Check back soon for new opportunities!</p>
              </div>
            )}
          </div>
        </div>

        {/* Stall Types */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-5 h-5 text-[var(--accent-orange)]" />
            <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Stall Options
            </h3>
          </div>

          <div className="vo-stalls-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stallTypes.map((stall, idx) => (
              <div
                key={idx}
                className="vo-stall-card group relative bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Stall Image */}
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={stall.image}
                    alt={stall.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stall.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                </div>

                {/* Content */}
                <div className="p-4 relative -mt-10 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-transparent pt-12">
                  <h4 className="text-lg font-black text-[var(--text-primary)] mb-1.5 uppercase tracking-tight group-hover:text-[var(--accent-orange)] transition-colors">
                    {stall.name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mb-3 line-clamp-2">
                    {stall.desc}
                  </p>

                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-5">
                    {stall.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                        <Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleBookStall()}
                    className="w-full py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent-orange)] hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Book This Stall
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Banner */}
        <div className="vo-header relative bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] rounded-[32px] p-8 md:p-12 border border-[var(--border)] overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--accent-orange)]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight">
                Why Partner With Us?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-orange)]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[var(--accent-orange)]" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-[var(--text-primary)]">3-4x</div>
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">ROI</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-[var(--text-primary)]">500+</div>
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Per Event</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-[var(--text-primary)]">100%</div>
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Verified</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleBookStall()}
              className="btn-primary px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-3 group whitespace-nowrap"
            >
              Register Your Stall
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Stall Booking Modal */}
      <StallBookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedEvent(null);
        }}
      />
    </section>
  );
};

export default VendorOpportunities;
