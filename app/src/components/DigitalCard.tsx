import { useRef } from 'react';
import { gsap } from 'gsap';
import { QrCode } from 'lucide-react';

interface DigitalCardProps {
    name: string;
    role: string;
    idNumber: string;
    stats: { label: string; value: string }[];
    tier: 'Pro' | 'Elite' | 'Rising';
    image?: string;
}

const DigitalCard = ({
    name = "Arjun Reddy",
    role = "Professional Athlete",
    idNumber = "SS-2024-8892",
    stats = [
        { label: "Matches", value: "42" },
        { label: "Win Rate", value: "68%" },
        { label: "Rank", value: "#12" }
    ],
    tier = "Elite",
    image = "/images/athlete_story_feature.png"
}: DigitalCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !glowRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(cardRef.current, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000
        });

        gsap.to(glowRef.current, {
            x: x,
            y: y,
            duration: 0.1
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    // Color theme based on tier
    const getThemeColor = () => {
        switch (tier) {
            case 'Pro': return 'from-amber-400 to-yellow-600';
            case 'Elite': return 'from-blue-400 to-indigo-600';
            default: return 'from-emerald-400 to-teal-600';
        }
    };

    return (
        <div className="perspective-1000 py-10 flex justify-center">
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-[320px] h-[500px] rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl overflow-hidden cursor-pointer transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] group"
            >
                {/* Dynamic Glow Effect */}
                <div
                    ref={glowRef}
                    className={`absolute w-[300px] h-[300px] bg-gradient-to-r ${getThemeColor()} opacity-20 blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
                />

                {/* Card Header */}
                <div className="relative z-10 p-6 flex justify-between items-start">
                    <img src="/images/logo.png" alt="Logo" className="h-6 opacity-80" />
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getThemeColor()} text-[10px] font-black uppercase tracking-widest text-white shadow-lg`}>
                        {tier} Verified
                    </div>
                </div>

                {/* Athlete Image Area */}
                <div className="relative z-10 w-full h-[220px] overflow-hidden mt-2 mx-auto w-[280px] rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]">
                    <img src={image} alt={name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                    <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${getThemeColor()} opacity-20`} />
                </div>

                {/* Details */}
                <div className="relative z-10 p-6 text-center">
                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-1">{name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-widest mb-6">{role}</p>

                    <div className="flex justify-between px-2 mb-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-sm font-black text-[var(--text-primary)]">{stat.value}</div>
                                <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / ID */}
                    <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
                        <div className="text-left">
                            <div className="text-[8px] text-[var(--text-secondary)] uppercase tracking-widest">Player ID</div>
                            <div className="text-[10px] font-mono text-[var(--text-primary)]">{idNumber}</div>
                        </div>
                        <QrCode className="w-8 h-8 text-[var(--text-primary)] p-1 bg-[var(--bg-primary)] rounded-lg" />
                    </div>
                </div>

                {/* Holographic Overlay Texture */}
                <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            </div>
        </div>
    );
};

export default DigitalCard;
