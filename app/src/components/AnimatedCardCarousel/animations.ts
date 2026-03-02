import type { Variants } from 'framer-motion';

export const cardVariants: Variants = {
    // Single card carousel mode
    enter: {
        scale: 0.8,
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.6,
            ease: [0.4, 0.0, 0.2, 1]
        }
    },
    center: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.4, 0.0, 0.2, 1]
        }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        x: 80, // Slide right on exit
        transition: {
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1]
        }
    },

    // Hover mode - all cards visible (fan layout)
    fanOut: (custom: number) => {
        // Determine target positions based on index (0, 1, 2, 3)
        // 0: Top-Left, 1: Top-Right, 2: Bottom-Left, 3: Bottom-Right
        const positions = [
            { x: -160, y: -120, rotate: -6 },
            { x: 160, y: -120, rotate: 6 },
            { x: -160, y: 120, rotate: 6 },
            { x: 160, y: 120, rotate: -6 }
        ];

        // Safety check for index out of bounds
        const pos = positions[custom % 4];

        return {
            x: pos.x,
            y: pos.y,
            rotate: pos.rotate,
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                delay: custom * 0.05, // Slight stagger
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        };
    },

    // Individual card hover when in fan mode
    cardHover: {
        scale: 1.05,
        y: -10,
        zIndex: 50,
        boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        transition: {
            duration: 0.2
        }
    }
};
