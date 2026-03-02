import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Mail, Trophy, Check, ArrowRight, Award, Star, Phone } from 'lucide-react';
import { api } from '../services/api';
import OTPModal from '../components/OTPModal';

gsap.registerPlugin(ScrollTrigger);

const QuoteCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const quotes = [
    {
      text: "Your career is defined by what you can prove. Build a legacy that speaks for itself.",
      author: "The SocioSports Philosophy"
    },
    {
      text: "It’s not whether you get knocked down; it’s whether you get up.",
      author: "Vince Lombardi"
    },
    {
      text: "Hard work beats talent when talent fails to work hard.",
      author: "Kevin Durant"
    },
    {
      text: "The more difficult the victory, the greater the happiness in winning.",
      author: "Pelé"
    },
    {
      text: "Gold medals aren't really made of gold. They're made of sweat, determination, and a hard-to-find alloy called guts.",
      author: "Dan Gable"
    },
    {
      text: "You miss 100% of the shots you don't take.",
      author: "Wayne Gretzky"
    }
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
    } else {
      // When paused (hovered), stop rotation.
      // User asked to "stop for 10 seconds". 
      // This implementation pauses indefinitely while hovered, which is standard.
      // If we want a 10s timeout *after* hover, or *during* hover?
      // Standard "stop while cursor is on it" implies infinite pause until leave.
      // If they meant "pause for 10s even if I leave", that's complex.
      // Let's assume standard pause-on-hover.
    }

    return () => clearInterval(interval);
  }, [isPaused, quotes.length]);

  return (
    <div
      className="mt-8 p-6 rounded-2xl bg-[var(--bg-primary)]/80 border border-[var(--border)] opacity-80 backdrop-blur-sm transition-all duration-300 hover:opacity-100 hover:scale-[1.02] cursor-default"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex gap-4">
        <span className="text-4xl text-[var(--accent-orange)] font-serif leading-4 opacity-50">"</span>
        <div className="flex-1">
          <div className="min-h-[60px] flex items-center">
            <p className="text-sm font-medium text-[var(--text-primary)] italic mb-2 transition-opacity duration-500">
              {quotes[currentIndex].text}
            </p>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mt-2">
            — {quotes[currentIndex].author}
          </p>
          {/* Progress Indicator (Optional but nice) */}
          <div className="flex gap-1 mt-3">
            {quotes.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-[var(--accent-orange)]' : 'w-1 bg-[var(--border)]'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProblemStatement = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance for cards
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );

      // Floating animation for icons
      gsap.to('.ps-icon', {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          from: 'random',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { icon: '🏅', text: 'Medals sitting in drawers', desc: 'Collecting dust instead of unlocking opportunities.' },
    { icon: '📜', text: 'Certificates lost somewhere', desc: 'Hard work that no one can verify today.' },
    { icon: '🎥', text: 'Best videos buried in gallery', desc: 'Invisible to the scouts who need to see them.' },
    { icon: '🔍', text: 'Scout search = Not found', desc: 'If you aren\'t online, you technically don\'t exist.' },
  ];

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto mb-12 ai-problem-banner">
      <div className="p-5 md:p-10 rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(#ff4500 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-4">
            <h3 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-tight">
              Where Do Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Achievements</span> Live?
            </h3>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => { if (el) cardsRef.current[idx] = el; }}
                className="group flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-primary)]/60 backdrop-blur-sm border border-[var(--border)] hover:border-[var(--accent-orange)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-orange)]/10 hover:scale-[1.02]"
              >
                <span className="ps-icon text-3xl flex-shrink-0 mt-1 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {item.icon}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-orange)] transition-colors">
                    {item.text}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AthleteIdentity = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sport: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sports = ['Badminton', 'Basketball', 'Tennis', 'Cricket', 'Football', 'Swimming'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        '.ai-content > *',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Image animation
      gsap.fromTo(
        '.ai-image',
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Form animation
      gsap.fromTo(
        '.ai-form',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.ai-form',
            start: 'top 85%',
          },
        }
      );
      gsap.fromTo(
        '.ai-problem-banner',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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

  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.sport && formData.phone) {
      setIsSubmitting(true);
      try {
        // Send OTP
        await api.otp.send(formData.email, 'athlete_identity');
        setIsSubmitting(false);
        setShowOtpModal(true);
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        alert('Failed to send OTP. Please try again.');
      }
    }
  };

  const handleVerifyAndSubmit = async (otp: string): Promise<boolean> => {
    try {
      const { success } = await api.otp.verify(formData.email, otp, 'athlete_identity');
      if (success) {
        // Proceed with creation
        await api.createBooking({
          businessName: 'Individual Athlete',
          stallType: 'ATHLETE_REGISTRY',
          requirements: `Sport: ${formData.sport} | Level: Entry`,
          contactPerson: formData.name,
          phone: formData.phone,
          email: formData.email
        });

        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
        setFormData({ name: '', email: '', phone: '', sport: '' });
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleResendOtp = async () => {
    await api.otp.send(formData.email, 'athlete_identity');
  };

  return (
    <section
      ref={sectionRef}
      id="athletes"
      className="relative pt-10 pb-10 md:pt-16 md:pb-16 bg-[var(--bg-secondary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Full-width Problem Banner */}
        {/* <ProblemStatement /> */}

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-7xl mx-auto">
          {/* Left - Content */}
          <div className="ai-content">
            {/* Problem Statement Removed (Moved to top) */}

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
              <span className="eyebrow">Verified Athlete Registry</span>
            </div>

            <h2 className="section-title mb-6">
              OFFICIAL <span className="text-gradient">SPORTS ID.</span>
            </h2>

            <p className="section-subtitle mb-6 max-w-lg">
              The SocioSports Registry is the central database for athlete verification, career tracking, and authenticated achievements.
            </p>

            <p className="text-[var(--text-primary)] font-semibold mb-8 max-w-lg">
              Get your Unique Sports ID (USID) and create an immutable record of your career.
            </p>

            {/* Your Professional Identity */}
            <div className="space-y-4 mb-8 overflow-visible relative z-20">
              {[
                {
                  label: 'Complete competition history',
                  sub: 'Organized, timestamped, permanent',
                  before: ['Scattered records', 'Lost match data', 'Unreliable memory'],
                  after: ['Centralized database', 'Every match logged', 'Permanent record']
                },
                {
                  label: 'Video highlights of best performances',
                  sub: 'Searchable by scouts & recruiters',
                  before: ['Buried in phone gallery', 'No one can find them', 'Not shareable'],
                  after: ['Cloud-hosted highlights', 'Indexed & searchable', 'One-click sharing']
                },
                {
                  label: 'Awards & achievements in one place',
                  sub: 'Never lose another certificate',
                  before: ['Physical certificates lost', 'No verification possible', 'Drawer dust collectors'],
                  after: ['Digital proof of all awards', 'Instantly verifiable', 'Always accessible']
                },
                {
                  label: 'Trainer endorsements & recommendations',
                  sub: 'Build credibility & trust',
                  before: ['Word of mouth only', 'No formal proof', 'Hard to verify'],
                  after: ['Coach-verified endorsements', 'Professional credibility', 'Trusted testimonials']
                },
                {
                  label: 'Shareable with sponsors, recruiters, colleges',
                  sub: 'One link, infinite opportunities',
                  before: ['Manual PDF creation', 'Outdated portfolio', 'Time-consuming updates'],
                  after: ['Auto-updated profile link', 'Real-time achievements', 'Instant sharing']
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group/tooltip relative flex items-start gap-4 p-3 rounded-xl hover:bg-[var(--bg-primary)]/50 transition-all duration-200 border border-transparent hover:border-[var(--border)] cursor-pointer overflow-visible"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-sm font-bold text-[var(--text-primary)]">{item.label}</span>
                    <span className="text-xs text-[var(--text-secondary)] font-medium">{item.sub}</span>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="pointer-events-none absolute left-0 top-full mt-2 w-[95vw] max-w-[500px] bg-[var(--bg-primary)] border-2 border-[var(--accent-orange)]/30 rounded-2xl p-5 shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-[9999]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before SocioSports */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          Before SocioSports
                        </h4>
                        <ul className="space-y-1.5">
                          {item.before.map((point, i) => (
                            <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                              <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* After SocioSports */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-green-400 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          After SocioSports
                        </h4>
                        <ul className="space-y-1.5">
                          {item.after.map((point, i) => (
                            <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                              <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>



            {/* Form */}
            <form onSubmit={handleSendOtp} className="ai-form bg-[var(--bg-primary)] rounded-2xl p-8 border border-[var(--border)] overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award className="w-24 h-24 text-[var(--accent-orange)]" />
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Verification Successful!</h3>
                  <p className="text-[var(--text-secondary)]">Welcome to SocioSports. Check your email for next steps.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Build Your Identity</h3>
                    <span className="text-[10px] font-bold text-[var(--accent-orange)] px-2 py-1 bg-[var(--accent-orange)]/10 rounded border border-[var(--accent-orange)]/20">FREE FOREVER</span>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <select
                        value={formData.sport}
                        onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors appearance-none"
                      >
                        <option value="" className="bg-[var(--bg-primary)]">Select primary sport</option>
                        {sports.map((sport) => (
                          <option key={sport} value={sport} className="bg-[var(--bg-primary)]">
                            {sport}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={!formData.name || !formData.phone || !formData.sport}
                      className="w-full btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending OTP...' : 'Create Your Sports Identity'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-center text-xs text-[var(--text-secondary)] mt-4">
                    Free forever. Takes 2 minutes. We're almost ready to help you build it. 🚀
                  </p>
                </>
              )}
            </form>

            <OTPModal
              isOpen={showOtpModal}
              onClose={() => setShowOtpModal(false)}
              email={formData.email}
              onVerify={handleVerifyAndSubmit}
              onResend={handleResendOtp}
            />

            {/* Quote Carousel */}
            <QuoteCarousel />
          </div>

          {/* Right - Image */}
          <div className="ai-image relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] mb-8">
              <img
                src="/images/athlete_medal_profile.png"
                alt="Athlete with medal - SocioSports profile success"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Arjun's Story (Moved) */}
            <div className="mb-6 p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-[var(--accent-orange)]" />
                <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">Arjun's Reality</h4>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-[var(--text-primary)]/90">✓ 14 district-level badminton medals</p>
                <p className="text-sm text-[var(--text-primary)]/90">✓ 3 state championship certificates</p>
                <p className="text-sm text-[var(--text-primary)]/90">✓ 127 tournament matches played</p>
                <p className="text-sm text-[var(--text-primary)]/90">✓ 2 years consistent training</p>
              </div>
              <div className="pt-3 border-t border-[var(--border)]">
                <p className="text-sm text-red-500 font-semibold">Google Search Result: Nothing</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  <span className="font-bold text-[var(--text-primary)]">95%</span> of talented athletes in India have exceptional skill but ZERO digital presence.
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] italic text-center">
              Because your sports journey is more than moments — it's a career, an identity, a legacy.
            </p>

            {/* Who is searching for you? section to fill space */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-primary)]/5 border border-[var(--border)] shadow-xl relative z-10 transition-transform hover:scale-[1.02] duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-[var(--accent-orange)] uppercase tracking-[0.2em]">Ecosystem Access</h4>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--bg-primary)] bg-[var(--bg-secondary)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--text-primary)]/20 to-transparent" />
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold text-[var(--text-primary)] mb-4">Who is searching for profiles like yours?</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                {[
                  { label: 'Pro Scouts', val: '500+' },
                  { label: 'State Clubs', val: '1.2k' },
                  { label: 'Sponsors', val: '200+' },
                  { label: 'Academies', val: '3k+' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border)]">
                    <div className="text-lg font-black text-[var(--text-primary)]">{item.val}</div>
                    <div className="text-[9px] text-[var(--text-secondary)] uppercase font-bold tracking-tighter">{item.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-center text-[var(--text-secondary)]">Your visibility starts with your registry.</p>
            </div>

            {/* Profile Card Overlay (Removed as duplicated/confusing with story box) */}
            <div className="hidden absolute bottom-8 left-8 right-8 bg-[var(--bg-primary)]/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-orange)] to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div>
                  <div className="text-[var(--text-primary)] font-semibold">Arjun's Profile</div>
                  <div className="text-sm text-[var(--text-secondary)]">14 medals, Now visible 🎯</div>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-[var(--accent-orange)]/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AthleteIdentity;
