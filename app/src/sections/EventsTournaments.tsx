import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Trophy, ArrowRight, Flame, Check, X, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../components/AnalyticsProvider';
import UniversalBookingModal from '../components/UniversalBookingModal'; // Import modal

gsap.registerPlugin(ScrollTrigger);

const EventsTournaments = ({ isHomeTeaser = false }: { isHomeTeaser?: boolean }) => {
  const sectionRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [bookingEvent, setBookingEvent] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const { trackEvent } = useAnalytics();

  const [headerContent, setHeaderContent] = useState({
    label: "Live Action",
    titleLine1: "Compete.",
    titleLine2: "Conquer.",
    description: "Discover 20+ active tournaments in your city. From district rankings to corporate leagues."
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await import('../services/api').then(m => m.api.cms.get('home-events-header'));
        if (data && data.content) {
          const parsed = JSON.parse(data.content);
          setHeaderContent(parsed);
        }
      } catch (error) {
        console.error("Failed to load Events header content", error);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo('.et-header-text',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      // Event Cards Stagger
      gsap.fromTo('.et-card',
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: '.et-grid', start: 'top 85%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleRegister = () => {
    setIsRegistered(true);
    trackEvent('complete_event_registration', {
      event_id: selectedEvent.id,
      event_title: selectedEvent.title
    });
    setTimeout(() => {
      setIsRegistered(false);
      setSelectedEvent(null);
    }, 2000);
  };

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dynamic events from backend
    import('../services/api').then(({ api }) => {
      api.getEvents().then(serverEvents => {
        if (serverEvents && serverEvents.length > 0) {
          // Map server events to UI format if needed
          const formattedEvents = serverEvents.map((e: any) => ({
            id: e.id,
            title: e.title,
            location: e.location,
            date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            fullDate: new Date(e.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
            time: e.time || '9:00 AM',
            image: e.image || '/images/event_default.jpg',
            category: e.type || 'Open',
            prize: e.prize || 'TBD',
            participants: 0,
            spotsLeft: e.maxParticipants || 100,
            description: e.description,
            isUrgent: new Date(e.date).getTime() - Date.now() < 604800000, // < 7 days
            tagColor: 'bg-purple-500' // Default for dynamic
          }));
          // Prepend dynamic events to static ones
          setEvents(formattedEvents);
          // Refresh animation
          ScrollTrigger.refresh();
        }
      }).catch(err => console.error("Failed to load events", err));
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[var(--bg-primary)] overflow-hidden relative">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover opacity-15 grayscale scale-110"
          alt=""
        />
      </div>

      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-orange)]/10 blur-[150px] rounded-full pointer-events-none z-10" />

      <div className="container mx-auto px-6 relative z-10">


        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="md:max-w-xl">
            {/* label hidden */}
            <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tighter et-header-text leading-none">
              {headerContent.titleLine1}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary)]/40">{headerContent.titleLine2}</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg font-medium et-header-text max-w-md">
              {headerContent.description}
            </p>
          </div>
          <div className="et-header-text">
            <Link to="/events" className="group flex items-center gap-3 text-[var(--text-primary)] font-bold uppercase tracking-widest text-xs hover:text-[var(--accent-orange)] transition-colors">
              View Full Calendar
              <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent-orange)] group-hover:bg-[var(--accent-orange)]/10 transition-all">
                <ArrowRight className="w-4 h-4 transform group-hover:-rotate-45 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 et-grid">
          {(isHomeTeaser ? events.slice(0, 3) : events).map((event) => (
            <div
              key={event.id}
              className="et-card group relative bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
              onClick={() => {
                setSelectedEvent(event);
                trackEvent('open_event_modal', { event_id: event.id, event_title: event.title });
              }}
            >
              {/* Event Image & Badge */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent z-10" />
                {event.isUrgent && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                    <Flame className="w-3 h-3" />
                    Closing Soon
                  </div>
                )}
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1626244422470-363675688582?auto=format&fit=crop&q=80&w=800' }}
                />
              </div>

              {/* Content */}
              <div className="p-6 pt-0 relative z-20">
                {/* Date Badge */}
                <div className="flex justify-between items-start mb-4 -mt-8">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-3 rounded-2xl text-center min-w-[70px] shadow-xl">
                    <span className="block text-2xl font-black text-[var(--text-primary)] leading-none">{event.date.split(' ')[1].split('-')[0]}</span>
                    <span className="block text-[10px] font-bold text-[var(--accent-orange)] uppercase tracking-wider">{event.date.split(' ')[0]}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)]/80 border border-[var(--border)] bg-[var(--bg-primary)]`}>
                    {event.category}
                  </div>
                </div>

                <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 uppercase leading-tight group-hover:text-[var(--accent-orange)] transition-colors line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                    <Trophy className="w-4 h-4 shrink-0 text-[var(--accent-gold)]" />
                    <span>Prize: <span className="text-[var(--text-primary)] font-bold">{event.prize}</span></span>
                  </div>
                </div>

                {/* Footer / CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="text-xs font-medium text-[var(--text-secondary)]">
                    <span className="text-[var(--text-primary)] font-bold">{event.spotsLeft}</span> spots left
                  </div>
                  <button className="flex items-center gap-2 text-[var(--accent-orange)] text-xs font-black uppercase tracking-widest hover:gap-3 transition-all">
                    Register
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Modal Logic */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          />
          <div className="relative bg-[var(--bg-secondary)] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200">
            {/* Header Image */}
            <div className="relative aspect-video">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 -mt-8 relative">
              {isRegistered ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Registered!</h3>
                  <p className="text-[var(--text-secondary)]">See you at {selectedEvent.title}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] text-xs font-semibold rounded-full">
                      {selectedEvent.category}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                      {selectedEvent.spotsLeft} spots left
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{selectedEvent.title}</h3>
                  <p className="text-[var(--text-secondary)] mb-4">{selectedEvent.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[var(--bg-primary)] rounded-xl p-3">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                      <div className="text-[var(--text-primary)] font-medium">{selectedEvent.fullDate}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-1">
                        <MapPin className="w-4 h-4" />
                        Location
                      </div>
                      <div className="text-[var(--text-primary)] font-medium">{selectedEvent.location}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setBookingEvent(selectedEvent);
                    }}
                    className="w-full btn-primary gap-2"
                  >
                    Register Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <UniversalBookingModal
        isOpen={!!bookingEvent}
        onClose={() => setBookingEvent(null)}
        mode="TOURNAMENT"
        initialData={bookingEvent}
      />
    </section>
  );
};

export default EventsTournaments;
