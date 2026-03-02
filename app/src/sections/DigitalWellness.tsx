import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Sun, Heart, Brain, Zap, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DigitalWellness = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title animation
            gsap.fromTo(
                '.dw-header > *',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                }
            );

            // 1. Comparison Cards
            gsap.fromTo(
                '.dw-comparison .dw-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.dw-comparison',
                        start: 'top 80%',
                    },
                }
            );

            // 2. Center Image
            gsap.fromTo(
                '.dw-image',
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.dw-image',
                        start: 'top 80%',
                    },
                }
            );

            // 3. Benefits Grid
            gsap.fromTo(
                '.dw-grid .dw-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.dw-grid',
                        start: 'top 80%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const attentionStats = [
        { value: '8 sec', label: 'Average attention span', sublabel: '(shorter than goldfish)' },
        { value: '2-3 hrs', label: 'Daily short-form content', sublabel: 'Students average' },
        { value: '50%', label: 'Feel regret after scrolling', sublabel: 'Sadness, guilt, fatigue' },
    ];

    const benefits = [
        { icon: Brain, title: 'Maintains Mobility & Independence', desc: 'Keep your body strong and capable' },
        { icon: Heart, title: 'Boosts Mental Health', desc: 'Natural stress relief and mood elevation' },
        { icon: Zap, title: 'Prevents Chronic Diseases', desc: 'Strengthen heart, bones, immune system' },
        { icon: TrendingUp, title: 'Builds Resilience', desc: 'Physical and mental toughness' },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative py-20 md:py-32 bg-[var(--bg-secondary)]"
        >
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Header */}
                <div className="dw-header max-w-4xl mx-auto text-center mb-16">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="text-4xl">📱</span>
                        <span className="eyebrow">or</span>
                        <span className="text-4xl">⚽</span>
                    </div>

                    <h2 className="section-title mb-6">
                        <span className="text-[var(--text-primary)]/40">ISOLATED</span> OR <span className="text-gradient">CONNECTED?</span>
                    </h2>

                    <p className="section-subtitle max-w-2xl mx-auto">
                        In a world trading melatonin, mental health, and sleep for stimulation,
                        movement becomes medicine.
                    </p>
                </div>

                {/* The Attention Crisis */}
                <div className="mb-16 max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-6 md:p-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <h3 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">THE ATTENTION CRISIS</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {attentionStats.map((stat, idx) => (
                                <div key={idx} className="text-center p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                                    <div className="text-4xl font-black text-red-400 mb-2">{stat.value}</div>
                                    <div className="text-sm font-bold text-[var(--text-primary)] mb-1">{stat.label}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">{stat.sublabel}</div>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-lg font-bold text-red-400">
                            Trading real experiences for dopamine loops. Physical presence for digital fatigue.
                        </p>
                    </div>
                </div>

                <div className="mb-16 max-w-6xl mx-auto">
                    <div className="dw-comparison grid md:grid-cols-2 gap-8">
                        {/* The Scroll (Bad) */}
                        <div className="dw-card bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Smartphone className="w-32 h-32 text-blue-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Smartphone className="w-8 h-8 text-blue-400" />
                                    <h3 className="text-2xl font-black text-[var(--text-primary)]">THE SCROLL</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-400 mt-1">✗</span>
                                        <p className="text-[var(--text-primary)]/80">Fragmented focus</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-400 mt-1">✗</span>
                                        <p className="text-[var(--text-primary)]/80">Dopamine loop addiction</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-400 mt-1">✗</span>
                                        <p className="text-[var(--text-primary)]/80">Digital fatigue & burnout</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-400 mt-1">✗</span>
                                        <p className="text-[var(--text-primary)]/80">Isolated & disconnected</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* The Stroll (Good) */}
                        <div className="dw-card bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Sun className="w-32 h-32 text-green-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Sun className="w-8 h-8 text-green-400" />
                                    <h3 className="text-2xl font-black text-[var(--text-primary)]">THE STROLL</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <p className="text-[var(--text-primary)]/80">Real presence & focus</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <p className="text-[var(--text-primary)]/80">Mental clarity & peace</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <p className="text-[var(--text-primary)]/80">Physical vitality & energy</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <p className="text-[var(--text-primary)]/80">True community connection</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-16 max-w-4xl mx-auto">
                    <div className="dw-card dw-image relative rounded-3xl overflow-hidden aspect-video border border-[var(--border)]">
                        <img
                            src="/images/digital_wellness.png"
                            alt="Scroll vs Stroll - Choose physical activity over digital fatigue"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Movement is Medicine */}
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-4">
                            MOVEMENT IS <span className="text-gradient">MEDICINE</span>
                        </h3>
                        <p className="text-xl text-[var(--text-secondary)] font-semibold">
                            Stay Active, Stay Ageless
                        </p>
                    </div>

                    <div className="dw-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {benefits.map((benefit, idx) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={idx} className="dw-card bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-colors group">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-orange)]/20 to-orange-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-7 h-7 text-[var(--accent-orange)]" />
                                    </div>
                                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">{benefit.title}</h4>
                                    <p className="text-sm text-[var(--text-secondary)]">{benefit.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* The Choice */}
                    <div className="bg-gradient-to-r from-[var(--accent-orange)]/10 to-orange-500/10 border border-[var(--accent-orange)]/20 rounded-3xl p-6 md:p-12 text-center">
                        <h4 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-8">The Choice Is Yours</h4>
                        <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            {[
                                { emoji: '📵', text: 'Put the phone down' },
                                { emoji: '🌤️', text: 'Step outside' },
                                { emoji: '⚽', text: 'Move your body' },
                                { emoji: '❤️', text: 'Reconnect with the world' },
                            ].map((step, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/80 transition-colors border border-[var(--border)]">
                                    <div className="text-4xl mb-2">{step.emoji}</div>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DigitalWellness;
