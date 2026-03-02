import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useCommunityType, COMMUNITY_CONFIGS } from '../contexts/CommunityTypeContext';

interface CommunityTypeSelectorProps {
  heroSectionRef?: React.RefObject<HTMLElement | null>;
}

const CommunityTypeSelector = ({ heroSectionRef }: CommunityTypeSelectorProps) => {
  const { selectedType, setSelectedType } = useCommunityType();
  const selectorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll visibility logic - hide when past hero section
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Get hero section height (default to 600px if ref not available)
      const heroHeight = heroSectionRef?.current?.offsetHeight || 600;
      
      // Show selector only when in hero section area (with some buffer)
      // Hide when scrolled past 70% of hero section
      const hideThreshold = heroHeight * 0.7;
      
      if (currentScrollY < hideThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroSectionRef]);

  // GSAP animation for entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.type-pill',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }, selectorRef);

    return () => ctx.revert();
  }, []);

  const types = Object.values(COMMUNITY_CONFIGS);

  return (
    <div
      ref={selectorRef}
      className={`sticky top-16 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border)] py-4 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            I'm looking for
          </span>
        </div>
        {/* Single line horizontal scroll on mobile, normal flex on larger screens */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`type-pill group relative px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                selectedType === type.id
                  ? 'bg-[var(--accent-orange)] text-white shadow-lg shadow-[var(--accent-orange)]/25'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{type.icon}</span>
                <span className="hidden md:inline">{type.label}</span>
                <span className="md:hidden">{type.shortLabel}</span>
              </span>
              {selectedType === type.id && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent-orange)] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityTypeSelector;
