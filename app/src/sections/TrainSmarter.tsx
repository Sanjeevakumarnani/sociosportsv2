import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, Calendar, Target, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const TrainSmarter = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoScrollRef = useRef<number | null>(null);

  const [content, setContent] = useState({
    label: "Premium Training",
    titleLine1: "TRAIN",
    titleLine2: "SMARTER",
    trainingImages: [
      { src: '/images/coaching_cricket_main.png', caption: 'Professional Cricket Coaching & Drills' },
      { src: '/images/training_02.jpg', caption: 'Personal Fitness Training' },
      { src: '/images/training_03.jpg', caption: 'Basketball Skills Development' },
      { src: '/images/training_04.jpg', caption: 'Tennis Technique Mastery' },
      { src: '/images/community_yoga_main.png', caption: 'Yoga & Wellness Sessions' },
    ],
    features: [
      'Personalized coaching plans tailored to your skill level',
      'Flexible scheduling with 24/7 booking availability',
      'Real-time progress tracking & expert feedback',
      'Advanced curriculum & community-driven skill sharing',
      'Access to certified coaches across all sports',
    ],
    stats: [
      { icon: 'Target', value: '500+', label: 'Training Modules' },
      { icon: 'TrendingUp', value: 'Live', label: 'Drill Sessions' },
      { icon: 'Calendar', value: 'Elite', label: 'Mentor Access' },
    ]
  });

  const { trainingImages, features, stats } = content;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await import('../services/api').then(m => m.api.cms.get('home-train-smarter'));
        if (data && data.content) {
          const parsed = JSON.parse(data.content);
          setContent(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error("Failed to load TrainSmarter content", error);
      }
    };
    fetchContent();
  }, []);

  const iconMap: any = { Target, TrendingUp, Calendar };

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % trainingImages.length);
      }, 6000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [trainingImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trainingImages.length);
    }, 6000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % trainingImages.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + trainingImages.length) % trainingImages.length);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ken Burns Effect on current image
      gsap.fromTo(
        '.ken-burns-img',
        { scale: 1 },
        { scale: 1.15, duration: 8, ease: 'sine.inOut' }
      );

      // Content reveal
      gsap.fromTo(
        '.ts-glass-card',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          }
        }
      );

      // Feature staggering
      gsap.fromTo(
        '.ts-feature-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.ts-features-list',
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [currentSlide]);

  return (
    <section
      ref={sectionRef}
      id="coaches"
      className="relative min-h-[90vh] flex items-center py-20 bg-black overflow-hidden"
    >
      {/* Background Slider - 100% SHARP */}
      <div className="absolute inset-0 z-0">
        {trainingImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <img
              src={image.src}
              alt={image.caption}
              className={`w-full h-full object-cover ${index === currentSlide ? 'ken-burns-img' : ''
                }`}
              style={{ filter: 'brightness(0.9)' }}
            />
            {/* Professional Gradient for text contrast without blurring the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden lg:block" />
          </div>
        ))}
      </div>

      <div className="relative z-20 px-4 sm:px-6 lg:px-8 xl:px-12 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12">
        {/* Navigation Info */}
        <div className="lg:mb-12 text-left w-full lg:w-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
            <span className="eyebrow text-white/80">{content.label}</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white leading-none mb-6">
            {content.titleLine1} <br />
            <span className="text-gradient">{content.titleLine2}</span>
          </h2>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-2">
              {trainingImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[var(--accent-orange)] w-8' : 'bg-white/30 w-4'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Content Card - SOLID BACKGROUND FOR CLARITY */}
        <div className="ts-content w-full lg:max-w-md p-6 md:p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl overflow-hidden">
          <p className="text-lg text-[var(--text-primary)] mb-8 leading-relaxed italic">
            "{trainingImages[currentSlide].caption}"
          </p>

          <div className="ts-features-list space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="ts-feature-item flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[var(--accent-orange)]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
                </div>
                <span className="text-[var(--text-secondary)] text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {stats.map((stat, index) => {
              const Icon = iconMap[stat.icon] || Target;
              return (
                <div key={index} className="text-center p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                  <Icon className="w-4 h-4 text-[var(--accent-orange)] mx-auto mb-2" />
                  <div className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <Link to="/mobile-app" className="btn-primary w-full py-4 rounded-2xl shadow-xl shadow-[var(--accent-orange)]/20 flex items-center justify-center">
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrainSmarter;

