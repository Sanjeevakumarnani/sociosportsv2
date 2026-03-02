import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bell, Calendar, MapPin, User, Clock, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SmartNotifications = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.sn-content > *',
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

            gsap.fromTo(
                '.notification-card',
                { opacity: 0, x: 60, rotate: 5 },
                {
                    opacity: 1,
                    x: 0,
                    rotate: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: '.notifications-visual',
                        start: 'top 75%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const notificationTypes = [
        {
            icon: MapPin,
            title: 'New tournaments in your area',
            example: 'Badminton Championship starting 2.3km away',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/20',
        },
        {
            icon: Clock,
            title: 'Registration opening soon',
            example: 'Tennis League registration opens in 24 hours',
            color: 'text-green-500',
            bgColor: 'bg-green-500/20',
        },
        {
            icon: Bell,
            title: 'Deadlines approaching',
            example: '3 days left to register for Cricket tournament',
            color: 'text-[var(--accent-orange)]',
            bgColor: 'bg-[var(--accent-orange)]/20',
        },
        {
            icon: User,
            title: 'Coach availability in your slot',
            example: 'Coach Priya has openings this weekend',
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/20',
        },
        {
            icon: Eye,
            title: 'Scout is viewing your profile',
            example: 'Mumbai Academy scout viewed your highlights',
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/20',
        },
        {
            icon: Calendar,
            title: 'Event starting tomorrow',
            example: '3v3 Basketball  Jam starts tomorrow at 10 AM',
            color: 'text-red-500',
            bgColor: 'bg-red-500/20',
        },
    ];

    const features = [
        { icon: '⏰', text: 'Reminders when you need them' },
        { icon: '🔕', text: 'Not annoying, just helpful' },
        { icon: '⚙️', text: 'Customizable notification preferences' },
        { icon: '📧', text: 'Email + Push notifications' },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative py-20 md:py-32 bg-[var(--bg-primary)]"
        >
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
                    {/* Left - Content */}
                    <div className="sn-content">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                            <span className="eyebrow">🔔 Smart Notifications</span>
                        </div>

                        <h2 className="section-title mb-6">
                            STAY <span className="text-gradient">INFORMED</span>
                        </h2>

                        <p className="section-subtitle mb-8 max-w-lg">
                            Never miss opportunities. Get notified about everything that matters to your sports journey.
                        </p>

                        {/* Notification Types */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">You get notified about:</h3>
                            {notificationTypes.map((type, idx) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] transition-all border border-[var(--border)] hover:border-[var(--accent-orange)]/30 group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg ${type.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                <Icon className={`w-5 h-5 ${type.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-[var(--text-primary)]">✓</span>
                                                    <span className="text-sm font-bold text-[var(--text-primary)]">{type.title}</span>
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)]">{type.example}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Smart timing features */}
                        <div className="bg-gradient-to-r from-[var(--accent-orange)]/10 to-orange-500/10 border border-[var(--accent-orange)]/20 rounded-2xl p-6 mb-8">
                            <h4 className="text-sm font-bold text-[var(--accent-orange)] uppercase tracking-wide mb-4">
                                Smart Timing
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-xl">{feature.icon}</span>
                                        <span className="text-xs text-[var(--text-primary)]/90">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-lg font-bold text-[var(--text-primary)] italic">
                            Never caught off guard. Always prepared. 🎯
                        </p>
                    </div>

                    {/* Right - Notifications Visual */}
                    <div className="notifications-visual relative">
                        <div className="relative aspect-square max-w-md mx-auto">
                            {/* Visual representation of notification cards */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full relative">
                                    {[
                                        { top: '10%', left: '5%', delay: 0 },
                                        { top: '25%', right: '10%', delay: 0.1 },
                                        { top: '45%', left: '15%', delay: 0.2 },
                                        { top: '60%', right: '5%', delay: 0.3 },
                                        { bottom: '15%', left: '50%', delay: 0.4, transform: '-translate-x-1/2' },
                                    ].map((pos, idx) => (
                                        <div
                                            key={idx}
                                            className="notification-card absolute"
                                            style={{
                                                ...pos,
                                                transform: pos.transform || undefined,
                                            }}
                                        >
                                            <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-sm max-w-[200px]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-orange)] to-orange-600 flex items-center justify-center">
                                                        <Bell className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-bold text-[var(--text-primary)] truncate">SocioSports</div>
                                                        <div className="text-[10px] text-[var(--text-secondary)]">Just now</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-[var(--text-primary)]/90 line-clamp-2">
                                                    {notificationTypes[idx % notificationTypes.length].example}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Central phone icon or dashboard */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-orange)] to-orange-600 flex items-center justify-center shadow-2xl">
                                        <Bell className="w-10 h-10 text-white animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-[var(--accent-orange)]/10 blur-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SmartNotifications;
