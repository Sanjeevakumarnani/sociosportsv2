import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, X, School, Home, Briefcase, ChevronLeft, ChevronRight, Trophy, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SportsOnWheels = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ location: '', date: '', people: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoScrollRef = useRef<number | null>(null);

  const eventImages = [
    { src: '/images/sow_01.jpg', title: 'Mobile Infrastructure' },
    { src: '/images/sow_02.jpg', title: 'Community Engagement' },
    { src: '/images/sow_03.jpg', title: 'Professional School Support' },
    { src: '/images/sow_04.jpg', title: 'Corporate Excellence' },
  ];

  const corePillars = [
    {
      title: 'Expert Human Capital',
      icon: Users,
      desc: 'Our mobile units are managed by NIS-certified coaches and international-standard officials. We don’t just deliver equipment; we bring professional tournament management, certified refereeing, and technically sound coaching programs directly to your community.',
    },
    {
      title: 'Elite Infrastructure',
      icon: Trophy,
      desc: 'We deploy international-grade gear for 12+ sports, including professional-grade boundary ropes, high-tensile nets, electronic scoring systems, and modular turf markings. Every piece of equipment is maintained to elite standards for maximum performance and safety.',
    }
  ];

  const sectorSupport = [
    {
      icon: Home,
      title: 'Residential Societies',
      desc: 'Weekly coaching clinics and weekend sports festivals at your community.'
    },
    {
      icon: School,
      title: 'Educational Institutions',
      desc: 'Professional sports days and annual championships with expert officiating.'
    },
    {
      icon: Briefcase,
      title: 'Corporate Parks',
      desc: 'High-energy team building carnivals and spirit tournaments at your office.'
    }
  ];

  const stopAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  useEffect(() => {
    const startAutoScroll = () => {
      stopAutoScroll();
      autoScrollRef.current = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % eventImages.length);
      }, 5000);
    };

    startAutoScroll();
    return () => stopAutoScroll();
  }, [eventImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    stopAutoScroll();
    autoScrollRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventImages.length);
    }, 5000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sow-reveal',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.location && formData.date && formData.people) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setShowModal(false);
        setFormData({ location: '', date: '', people: '' });
      }, 2000);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="sow"
      className="relative min-h-screen bg-black flex flex-col justify-center overflow-hidden py-12"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
        {/* Compact Professional Header */}
        <div className="sow-reveal mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
            <span className="text-[10px] font-black tracking-[0.4em] text-[var(--accent-orange)] uppercase">Proprietary Mobile Infrastructure</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              SPORTS ON <span className="text-white/20">WHEELS</span>
            </h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)] font-bold max-w-xl leading-relaxed">
              We eliminate ground availability issues by bringing professional equipment and experts directly to your doorstep.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-stretch">
          {/* Left Column: Visuals & Detailed Core Pillars */}
          <div className="sow-reveal flex flex-col gap-10">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[48px] overflow-hidden shadow-2xl bg-white/5 border border-white/5">
              {eventImages.map((img, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute top-8 left-8">
                    <span className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                      {img.title}
                    </span>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
                <button
                  onClick={() => goToSlide((currentSlide - 1 + eventImages.length) % eventImages.length)}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[var(--accent-orange)] transition-all bg-black/20 backdrop-blur-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goToSlide((currentSlide + 1) % eventImages.length)}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[var(--accent-orange)] transition-all bg-black/20 backdrop-blur-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* EXPANDED DETAILED INFO */}
            <div className="grid md:grid-cols-2 gap-8">
              {corePillars.map((pillar, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] hover:border-[var(--accent-orange)]/30 transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-orange)]/10 flex items-center justify-center scale-90 group-hover:scale-110 transition-transform">
                      <pillar.icon className="w-6 h-6 text-[var(--accent-orange)]" />
                    </div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter">{pillar.title}</h4>
                  </div>
                  <p className="text-[var(--text-secondary)] font-bold text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Integrated Info Stack */}
          <div className="sow-reveal flex flex-col h-full bg-white/[0.03] border border-white/10 rounded-[48px] p-8 md:p-12 overflow-hidden">
            <div className="mb-10">
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter leading-none">Stadium On <span className="text-[var(--accent-orange)]">Demand</span></h3>
              <p className="text-[var(--text-secondary)] font-bold text-sm leading-relaxed">
                Transform any parking lot or playground into a high-performance arena in under 60 minutes.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {sectorSupport.map((sector, i) => (
                <div key={i} className="flex gap-6 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[var(--accent-orange)] group-hover:border-[var(--accent-orange)] transition-all">
                    <sector.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1 uppercase tracking-tight group-hover:text-[var(--accent-orange)] transition-colors">
                      {sector.title}
                    </h4>
                    <p className="text-[var(--text-secondary)] font-bold text-xs leading-relaxed max-w-sm">
                      {sector.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full btn-primary py-6 rounded-2xl flex items-center justify-center gap-4 group shadow-2xl transition-all"
              >
                <span className="font-black uppercase tracking-tighter text-lg">Bring it to my area</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowModal(false)} />
          <div className="relative bg-[var(--bg-secondary)] rounded-[48px] p-10 max-w-md w-full border border-[var(--border)]">
            <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <X className="w-6 h-6" />
            </button>
            {isSubmitted ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase">Inquiry Logged</h3>
                <p className="text-[var(--text-secondary)] font-bold mt-2">Logistics team will connect soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-black text-[var(--text-primary)] mb-10 text-center uppercase tracking-tighter">Request Deployment</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    required
                    placeholder="Neighborhood or Society Name"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[var(--text-primary)] focus:border-[var(--accent-orange)]/50 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" required className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[var(--text-primary)] outline-none" />
                    <input type="number" required placeholder="Persons" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[var(--text-primary)] outline-none" />
                  </div>
                  <button type="submit" className="w-full btn-primary py-6 rounded-2xl font-black uppercase tracking-widest text-lg">Send Inquiry</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SportsOnWheels;
