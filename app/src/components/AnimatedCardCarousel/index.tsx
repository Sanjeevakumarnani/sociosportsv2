import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cardsData } from './cardData';
import Card from './Card';

const AnimatedCardCarousel = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-rotation logic
    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                setCurrentCardIndex((prev) => (prev + 1) % cardsData.length);
            }, 3000); // 3 seconds per card

            return () => clearInterval(interval);
        }
    }, [isHovered]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            className="card-carousel-container w-full h-[600px] flex items-center justify-center relative perspective-[1000px] overflow-hidden md:overflow-visible"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse" />
            </div>

            {isHovered ? (
                // Hover State: Fan Out all 4 cards
                <AnimatePresence>
                    {cardsData.map((card, index) => (
                        <Card
                            key={card.id}
                            card={card}
                            variant="fanOut"
                            custom={index} // Used for staggered delay and position calculation
                            isHovered={true}
                        />
                    ))}
                </AnimatePresence>
            ) : (
                // Default State: Single Rotating Card
                <AnimatePresence mode="wait">
                    <Card
                        key={currentCardIndex} // changing key forces mount/unmount trigger for AnimatePresence
                        card={cardsData[currentCardIndex]}
                        variant="carousel"
                        isHovered={false}
                    />
                </AnimatePresence>
            )}

            {/* Progress Indicators (Optional but helpful) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {cardsData.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${currentCardIndex === idx && !isHovered ? 'w-8 bg-white' : 'w-2 bg-white/20'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AnimatedCardCarousel;
