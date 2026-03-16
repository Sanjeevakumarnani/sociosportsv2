import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Users, Calendar, Trophy, User, Award, Compass, Truck, Search } from 'lucide-react';
import SportsPersonModal from '../components/SportsPersonModal';
import SearchModal from '../components/SearchModal';
import { useTheme } from '../contexts/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

// Move icon map outside component to prevent recreation on every render
const iconMap: Record<string, any> = {
  Trophy,
  Users,
  Calendar,
  User,
  Award
};

const Hero = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Hero images auto-scroll state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState([
    { src: 'hero_action.jpg', alt: 'Sports action', sport: 'Action' },
    { src: 'hero_badminton.jpg', alt: 'Badminton', sport: 'Badminton' },
    { src: 'hero_basketball.jpg', alt: 'Basketball', sport: 'Basketball' },
    { src: 'hero_football.jpg', alt: 'Football', sport: 'Football' },
    { src: 'hero_tennis.jpg', alt: 'Tennis', sport: 'Tennis' },
  ]);

  // Helper to get theme-specific path - Memoized
  const getThemeImagePath = useCallback((filename: string) => {
    if (!filename) return '';

    // 0. If it's an uploaded image (full URL or absolute path), return it as is
    if (filename.startsWith('http') || filename.startsWith('/uploads') || filename.includes('://')) {
      return filename;
    }

    // 1. CLEANUP & HEALING: Map known broken or legacy paths to valid assets
    let cleanName = filename.split('/').pop() || filename;

    // Map legacy sports-specific names to general hero-action assets if they don't exist
    // Currently we have: hero_action, hero_badminton, hero_basketball, hero_football, hero_tennis
    const validHeroImages = [
      'hero_action.jpg', 'hero_badminton.jpg', 'hero_basketball.jpg',
      'hero_football.jpg', 'hero_tennis.jpg', 'hero_athlete.jpg', 'hero_track.jpg'
    ];

    if (cleanName.includes('hero_') && !validHeroImages.includes(cleanName.toLowerCase())) {
      cleanName = 'hero_action.jpg';
    }

    // 2. THEME HANDLING
    const isDarkTheme = ['navy', 'gold', 'blue'].includes(theme) || !theme;
    const folder = isDarkTheme ? 'dark' : 'light';

    // Light images are .png, dark images are .jpg
    if (!isDarkTheme) {
      cleanName = cleanName.replace(/\.jpg$/i, '.png');
    } else {
      cleanName = cleanName.replace(/\.png$/i, '.jpg');
    }

    // Ensure we don't double up on extensions
    const finalName = cleanName.replace(/\.(jpg|png)\.(jpg|png)$/i, '.$1');

    return `/images/hero/${folder}/${finalName}`;
  }, [theme]);

  // Rotating statistics state
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [heroStats, setHeroStats] = useState([
    { value: '95%', label: 'Athletes have ZERO digital presence', detail: 'Talent remains invisible to scouts' },
    { value: '143', label: 'Tournaments monthly in Mumbai', detail: 'Most athletes miss 90% of opportunities' },
    { value: '80%', label: 'Quit sports by age 15', detail: 'Not from lost passion, but lost direction' },
    { value: '50K+', label: 'Unfilled tournament slots', detail: 'Information gap bridging needed' },
  ]);

  // Featured card rotation state
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [features, setFeatures] = useState([
    {
      title: 'Athlete Stories & Insights',
      description: 'Discover Nikhat Zareen\'s journey and elite techniques in our new Blog & Knowledge Hub.',
      image: '/images/athlete_story_feature.png',
      icon: Trophy,
      link: '/blog',
      cta: 'Explore Blog',
    },
    {
      title: 'Join Tournaments & Events',
      description: 'Find 143+ tournaments in Mumbai alone. Never miss your registration again.',
      image: '/images/tournament_cricket_main.png',
      icon: Calendar,
      link: '/events',
      cta: 'Explore Events',
    },
    {
      title: 'Create Your Sports ID',
      description: 'Move medals from drawers to professional portfolios searchable by elite scouts.',
      image: '/images/athlete_profile.jpg',
      icon: User,
      link: '__register__',
      cta: 'Create Sports ID',
    },
    {
      title: 'Professional Coaching',
      description: 'Connect with NIS-certified experts and elite trainers to elevate your game.',
      image: '/images/coaching_cricket_main.png',
      icon: Users,
      link: '/coaches',
      cta: 'Find Coaches',
    },
    {
      title: 'Sports on Wheels',
      description: 'Mobile sports activations bringing training and events to your community.',
      image: '/images/van_image.png',
      icon: Truck,
      link: '/sports-on-wheels',
      cta: 'Book Mobile Event',
    },
    // Jobs page hidden
    // {
    //   title: 'Sports Career Hub',
    //   description: 'Explore sports industry jobs, internships, and professional opportunities.',
    //   image: '/images/jobs_feature.jpg',
    //   icon: Users,
    //   link: '/jobs',
    //   cta: 'View Openings',
    // },
  ]);

  // CMS Data Fetching
  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      try {
        const data = await import('../services/api').then(m => m.api.cms.get('home-hero'));
        if (isMounted && data && data.content) {
          const content = JSON.parse(data.content);
          if (content.heroImages) setHeroImages(content.heroImages);
          if (content.stats) setHeroStats(content.stats);
          if (content.features && content.features.length > 0) {
            const mappedFeatures = content.features.map((f: any) => ({
              ...f,
              icon: iconMap[f.iconName] || Trophy
            }));
            setFeatures(mappedFeatures);
          }
        }
      } catch (error) {
        console.error('Failed to load hero content', error);
      }
    };
    fetchContent();
    return () => { isMounted = false; };
  }, []);

  // Auto-scroll hero images every 7-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Auto-rotate stats every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % heroStats.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroStats.length]);

  // Animate stats change
  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [currentStatIndex]);

  // Auto-rotate featured card every 5-6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [features.length]);

  // Animate image change
  useEffect(() => {
    if (imageContainerRef.current) {
      const images = imageContainerRef.current.querySelectorAll('.hero-bg-image');
      images.forEach((img, index) => {
        gsap.to(img, {
          opacity: index === currentImageIndex ? 1 : 0,
          scale: index === currentImageIndex ? 1 : 1.1,
          duration: 1.5,
          ease: 'power2.inOut',
        });
      });
    }
  }, [currentImageIndex]);

  // Animate feature card change
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentFeatureIndex]);

  // Manual navigation for hero images
  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // Manual navigation for features
  const goToFeature = useCallback((index: number) => {
    setCurrentFeatureIndex(index);
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Headline animation
      tl.fromTo(
        '.hero-headline-word',
        {
          opacity: 0,
          y: 50,
          rotateX: 25,
          transformOrigin: '50% 100%'
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08
        }
      );

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );

      // CTAs
      tl.fromTo(
        '.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.3'
      );

      // Feature card
      tl.fromTo(
        cardRef.current,
        { opacity: 0, x: 100, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8 },
        '-=0.5'
      );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: false,
          scrub: 0.5,
        },
      });

      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: -80, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        subheadlineRef.current,
        { y: 0, opacity: 1 },
        { y: -60, opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: -40, opacity: 0, ease: 'power2.in' },
        0.74
      );

      scrollTl.fromTo(
        cardRef.current,
        { x: 0, opacity: 1 },
        { x: 150, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentFeature = features[currentFeatureIndex];
  const FeatureIcon = currentFeature.icon;

  const handleFeatureClick = (path: string) => {
    if (path === '__register__') {
      setIsRegistrationOpen(true);
    } else if (path.startsWith('/')) {
      navigate(path);
    } else {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen w-full overflow-hidden"
      >
        {/* Background Images with Auto-scroll */}
        <div
          ref={imageContainerRef}
          className="absolute inset-0 w-full h-full"
        >
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="hero-bg-image absolute inset-0 w-full h-full"
              style={{ opacity: index === currentImageIndex ? 1 : 0 }}
            >
              <img
                src={getThemeImagePath(image.src)}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
              />
            </div>
          ))}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 gradient-overlay" />

          {/* Sport label */}
          <div className="absolute top-32 right-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white/80 text-sm font-medium">{heroImages[currentImageIndex].sport}</span>
          </div>

          {/* Image Navigation Dots */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                  ? 'w-8 bg-[var(--accent-orange)]'
                  : 'bg-white/50 hover:bg-white/80'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 pt-28">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="max-w-2xl">
                {/* Headline */}
                <div ref={headlineRef} className="mb-6" style={{ perspective: '1000px' }}>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    <span className="hero-headline-word inline-block india-flag-gradient">India&apos;s</span>{' '}
                    <span className="hero-headline-word inline-block">Digital</span>{' '}
                    <span className="hero-headline-word inline-block">Sports</span>{' '}
                    <span className="hero-headline-word inline-block">Ecosystem</span>
                    <span className="hero-headline-word block mt-2 text-gradient text-xl sm:text-2xl md:text-3xl">
                      Play, Train, Compete, and Grow
                    </span>
                  </h1>
                </div>

              {/* Subheadline */}
              <div ref={subheadlineRef} className="mb-8">
                  <p className="text-lg md:text-xl max-w-xl leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Connect athletes, coaches, academies, and communities in one platform.
                  </p>
                </div>

                {/* CTAs */}
                <div ref={ctaRef} className="flex flex-wrap gap-5 mb-4">
                  <button
                    onClick={() => setIsRegistrationOpen(true)}
                    aria-label="Join SocioSports – Registration"
                    className="hero-cta btn-primary gap-3 text-base px-10 py-4 animate-pulse-glow"
                  >
                    <User className="w-5 h-5" />
                    Join SocioSports
                  </button>
                  <button
                    onClick={() => navigate('/explore-sports')}
                    aria-label="Explore Sports – View all sports, history and benefits"
                    className="hero-cta btn-secondary gap-3 text-base px-10 py-4"
                  >
                    <Compass className="w-5 h-5" />
                    Explore Sports
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Rotating Stats - Real Data */}
                <div ref={statsRef} className="hero-cta pt-4 border-t min-h-[80px]" style={{ borderColor: 'color-mix(in srgb, var(--text-primary) 10%, transparent)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-1.5 h-12 bg-gradient-to-b from-[var(--accent-orange)] to-transparent rounded-full" />
                    <div>
                      <div className="flex items-baseline gap-3 mb-1">
                        <div className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
                          {heroStats[currentStatIndex].value}
                        </div>
                        <div className="text-sm font-bold text-[var(--accent-orange)] uppercase tracking-wider">
                          Real Problem
                        </div>
                      </div>
                      <div className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {heroStats[currentStatIndex].label}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {heroStats[currentStatIndex].detail}
                      </div>
                    </div>
                  </div>

                  {/* Stat Navigation Dots */}
                  <div className="flex gap-2 mt-4 ml-6">
                    {heroStats.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStatIndex(index)}
                        className={`h-1 rounded-full transition-all duration-300 ${index === currentStatIndex
                          ? 'w-8 bg-[var(--accent-orange)]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                          }`}
                        aria-label={`Show stat ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Feature Card - Auto Rotating */}
              <div
                className="hidden lg:block relative"
              >
                <div ref={cardRef} className="relative ml-auto w-full max-w-md">
                  <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                    <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video">
                      <img
                        src={currentFeature.image}
                        alt={currentFeature.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-orange)' }}>
                          Featured
                        </span>
                        <h3 className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                          {currentFeature.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {currentFeature.description}
                    </p>
                    <button
                      onClick={() => handleFeatureClick(currentFeature.link)}
                      aria-label={`Explore ${currentFeature.title}`}
                      className="flex items-center gap-2 font-semibold text-sm group"
                      style={{ color: 'var(--accent-orange)' }}
                    >
                      <FeatureIcon className="w-4 h-4" />
                      {currentFeature.cta}
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Feature Navigation Dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToFeature(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentFeatureIndex
                          ? 'w-6 bg-[var(--accent-orange)]'
                          : 'bg-white/30 hover:bg-white/50'
                          }`}
                        aria-label={`Go to feature ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Floating badges */}
                  <div
                    className="absolute -top-4 -left-4 px-4 py-2 rounded-full text-sm font-bold animate-bounce-slow"
                    style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}
                  >
                    New
                  </div>
                  {/* <div className="absolute -bottom-4 -right-4 bg-[var(--bg-secondary)] border border-white/10 px-4 py-3 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Live Events</div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>24 Active</div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-20" />
      </section>

      <SportsPersonModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Hero;
