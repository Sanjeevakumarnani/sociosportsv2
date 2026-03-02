import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from './animations';


interface CardProps {
    card: {
        id: number;
        title: string;
        description: string;
        icon: React.ElementType;
        gradient: string;
        bgPattern: string;
        color: string;
    };
    variant: 'carousel' | 'fanOut';
    custom?: number;
    isHovered: boolean;
}

const Card: React.FC<CardProps> = ({ card, variant, custom, isHovered }) => {
    const Icon = card.icon;

    return (
        <motion.div
            className="feature-card sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl"
            variants={cardVariants}
            initial={variant === 'carousel' ? 'enter' : 'center'} // Start at center if fanning out, prevents jump
            animate={variant === 'carousel' ? 'center' : 'fanOut'}
            exit={variant === 'carousel' ? 'exit' : undefined}
            custom={custom}
            whileHover={isHovered ? 'cardHover' : undefined}
            style={{
                background: card.gradient,
                borderRadius: '16px',
                width: '320px',
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: variant === 'fanOut' ? 'absolute' : 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                padding: '30px',
                zIndex: variant === 'fanOut' ? 10 : 20 // Active carousel card on top
            }}
        >
            {/* Icon */}
            <div
                className="card-icon mb-5"
                style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}
            >
                <Icon size={48} color="white" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 text-center tracking-wide drop-shadow-md">
                {card.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-white/90 text-center leading-relaxed font-medium drop-shadow-sm">
                {card.description}
            </p>

            {/* Background Pattern Overlay */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-10"
                style={{ backgroundImage: getPattern(card.bgPattern) }}
            />
        </motion.div>
    );
};

// Helper function for background patterns
const patterns: Record<string, string> = {
    grid: 'linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
    dots: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
    stripes: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15) 10px, transparent 10px, transparent 20px)',
    network: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)'
};

const getPattern = (type: string) => {
    return patterns[type] || patterns.grid;
};

export default Card;
