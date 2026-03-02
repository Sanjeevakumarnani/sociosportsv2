import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

/**
 * CardFlipCarousel Plan Implementation
 * 
 * Features:
 * - 3D Fan Layout with perspective
 * - Click to Flip center card
 * - Click side cards to bring them to center
 * - Infinite looping
 * - Interactive navigation (dots + arrows)
 */

interface CardData {
  id: number;
  frontImage: string;
  frontLabel: string;
  backTitle: string;
  backBody: string;
  accent: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    frontImage: '/images/athlete_story_feature.png',
    frontLabel: 'COMMUNITY',
    backTitle: 'Athlete Network',
    backBody: 'Connect with athletes nationwide, share your journey, and find training partners in your local area.',
    accent: '#ff4d1c'
  },
  {
    id: 2,
    frontImage: '/images/sports_profile_mockup.png',
    frontLabel: 'IDENTITY',
    backTitle: 'Digital Identity',
    backBody: 'Your verified sports profile tracking achievements, stats, and certifications in one unified identity.',
    accent: '#ff6b35'
  },
  {
    id: 3,
    frontImage: '/images/tournament_discovery.png',
    frontLabel: 'COMPETE',
    backTitle: 'Tournament Hub',
    backBody: 'Discover and register for tournaments. Get real-time updates and track your performance history.',
    accent: '#ff4d1c'
  },
  {
    id: 4,
    frontImage: '/images/about_vision.png',
    frontLabel: 'VISION',
    backTitle: 'Future of Sports',
    backBody: "Join India's sports revolution. We are building the digital backbone for the entire sports ecosystem.",
    accent: '#ff6b35'
  }
];

interface FlipCardProps {
  card: CardData;
  virtualPosition: number;
  activeVirtualIndex: number;
  isFlipped: boolean;
  onFlip: () => void;
  onCardClick: (virtualPosition: number) => void;
}

function FlipCard({ card, virtualPosition, activeVirtualIndex, isFlipped, onFlip, onCardClick }: FlipCardProps) {
  const offset = virtualPosition - activeVirtualIndex;
  const isCenter = offset === 0;

  // 3D positioning calculations from plan
  const rotateY = offset * 18;
  const translateX = offset * 160;
  const translateZ = -Math.abs(offset) * 80;
  const scale = isCenter ? 1 : 0.88 - Math.abs(offset) * 0.04;
  const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.15;
  const zIndex = 10 - Math.abs(offset);

  const handleInteraction = () => {
    if (isCenter) {
      onFlip();
    } else {
      onCardClick(virtualPosition);
    }
  };

  return (
    <div
      onClick={handleInteraction}
      role="button"
      tabIndex={0}
      aria-label={`${card.backTitle} card`}
      style={{
        position: 'absolute',
        width: 300,
        height: 400,
        cursor: 'pointer',
        userSelect: 'none',
        perspective: 1500,
        zIndex,
        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transformStyle: 'preserve-3d',
          transform: isFlipped && isCenter ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT FACE */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: 24,
            overflow: 'hidden',
            border: isCenter ? `2px solid ${card.accent}` : '1px solid rgba(255,255,255,0.1)',
            boxShadow: isCenter
              ? `0 0 30px ${card.accent}44, 0 10px 40px rgba(0,0,0,0.5)`
              : '0 5px 15px rgba(0,0,0,0.3)',
            background: '#111',
          }}
        >
          {/* Image */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${card.frontImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: isCenter ? 'none' : 'grayscale(0.3) brightness(0.7)',
              transition: 'filter 0.5s ease',
            }}
          />

          {/* Label Badge */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              padding: '6px 14px',
              borderRadius: 30,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${card.accent}`,
              color: '#fff',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.1em',
              zIndex: 2,
            }}
          >
            {card.frontLabel}
          </div>

          {/* Hint icon for center card */}
          {isCenter && !isFlipped && (
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: card.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                animation: 'pulse 2s infinite',
                zIndex: 2,
              }}
            >
              <Info size={18} />
            </div>
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)',
              zIndex: 1,
            }}
          />
        </div>

        {/* BACK FACE */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: 24,
            background: '#1a1a1a',
            border: `2px solid ${card.accent}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 40,
            transform: 'rotateY(180deg)',
            textAlign: 'center',
            boxShadow: `0 0 50px ${card.accent}33`,
          }}
        >
          <div
            style={{
              width: 60,
              height: 4,
              background: card.accent,
              borderRadius: 2,
              marginBottom: 30,
            }}
          />
          <h3
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            {card.backTitle}
          </h3>
          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              marginBottom: 30,
            }}
          >
            {card.backBody}
          </p>
          <button
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              background: 'transparent',
              border: `1px solid ${card.accent}`,
              color: card.accent,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onFlip();
            }}
          >
            GO BACK
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 ${card.accent}77; }
          70% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 0 10px ${card.accent}00; }
          100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 ${card.accent}00; }
        }
      `}</style>
    </div>
  );
}

export default function CardFlipCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const autoRotateTimer = useRef<any>(null);

  const getCardIndex = (virtualIndex: number) => {
    return ((virtualIndex % CARDS.length) + CARDS.length) % CARDS.length;
  };

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setActiveIndex(prev => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setActiveIndex(prev => prev - 1);
  }, []);

  const handleCardClick = (virtualPos: number) => {
    setIsFlipped(false);
    setActiveIndex(virtualPos);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Auto-rotation
  useEffect(() => {
    if (!isHovered && !isFlipped) {
      autoRotateTimer.current = setInterval(handleNext, 5000);
    } else {
      if (autoRotateTimer.current) clearInterval(autoRotateTimer.current);
    }
    return () => {
      if (autoRotateTimer.current) clearInterval(autoRotateTimer.current);
    };
  }, [isHovered, isFlipped, handleNext]);

  // Virtual positions for rendering infinite loop
  const visibleVirtualPositions = [];
  for (let i = -2; i <= 2; i++) {
    visibleVirtualPositions.push(activeIndex + i);
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1000,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 450,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          perspective: 1200,
        }}
      >
        {visibleVirtualPositions.map(virtualPos => {
          const cardIndex = getCardIndex(virtualPos);
          const card = CARDS[cardIndex];
          return (
            <FlipCard
              key={`${virtualPos}-${cardIndex}`}
              card={card}
              virtualPosition={virtualPos}
              activeVirtualIndex={activeIndex}
              isFlipped={isFlipped && virtualPos === activeIndex}
              onFlip={toggleFlip}
              onCardClick={handleCardClick}
            />
          );
        })}
      </div>

      {/* Navigation UI */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          marginTop: 40,
          zIndex: 20,
        }}
      >
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button
            onClick={handlePrev}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = '#ff4d1c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 10 }}>
            {CARDS.map((_, i) => {
              const currentCardIndex = getCardIndex(activeIndex);
              const isActive = i === currentCardIndex;
              return (
                <div
                  key={i}
                  onClick={() => {
                    const diff = i - currentCardIndex;
                    handleCardClick(activeIndex + diff);
                  }}
                  style={{
                    width: isActive ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: isActive ? '#ff4d1c' : 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                />
              );
            })}
          </div>

          <button
            onClick={handleNext}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = '#ff4d1c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
