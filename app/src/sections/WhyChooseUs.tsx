import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardFlipCarousel from '../components/CardFlipCarousel';

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.why-content',
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    }
                }
            );

            gsap.fromTo(
                '.carousel-wrapper',
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: 'back.out(1.0)',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-14 md:py-20 overflow-hidden bg-[var(--bg-primary)]">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-orange)] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* LEFT: Content Side */}
                    <div className="why-content order-2 lg:order-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-1 bg-[var(--accent-orange)]" />
                            <span className="text-[var(--accent-orange)] font-bold tracking-widest uppercase text-sm">Our Mission</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-8 leading-[0.9]">
                            WHY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">SOCIOSPORTS?</span>
                        </h2>

                        {/* The "Valuable Content" Highlight Box */}
                        <div className="relative group mb-10">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-orange)] to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-md"></div>
                            <div className="relative bg-[var(--bg-secondary)] p-8 rounded-xl border border-[var(--border)]">
                                <p className="text-xl md:text-2xl font-medium text-[var(--text-primary)] leading-relaxed mb-6">
                                    "India has <span className="text-[var(--accent-orange)] font-bold">1.4 billion people</span> but ranks 48th in Olympic medals per capita."
                                </p>
                                <div className="h-px w-full bg-[var(--border)] mb-6" />
                                <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                                    The problem isn't talent—it's infrastructure and access.{' '}
                                    <span className="text-[var(--accent-orange)] font-semibold">SocioSports</span>{' '}
                                    builds the digital bridges to democratize sports for everyone, from weekend warriors to future champions.
                                </p>
                            </div>
                        </div>

                        <p className="text-[var(--text-secondary)] text-sm font-medium tracking-wide uppercase">
                            Building India's Digital Sports Backbone
                        </p>
                    </div>

                    {/* RIGHT: New 3D Animated Card Carousel */}
                    <div className="carousel-wrapper order-1 lg:order-2 flex justify-center items-center relative py-10 w-full">
                        <CardFlipCarousel />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
