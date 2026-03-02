import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mountain, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { api } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const InspirationStory = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    const [content, setContent] = useState({
        heading: "SOME JOURNEYS BEGIN QUIETLY",
        subHeading: "But they change everything.",
        slides: [
            {
                title: "The Beginning",
                text: "There was a penguin who didn't wait to be ready. No applause. No guarantees. Just a belief that standing still wouldn't take him anywhere."
            },
            {
                title: "The Climb",
                text: "Every step felt heavy. Every climb felt uncertain. But with each move forward, confidence followed. That's what building a career in sports really looks like."
            },
            {
                title: "The Purpose",
                text: "Slow days. Hard lessons. Small wins that mean everything. SocioSports is for those moments. When you're unsure, but still moving. When you're learning, growing, and choosing progress over comfort."
            }
        ]
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await api.cms.get('home-inspiration');
                if (data && data.content) {
                    setContent(JSON.parse(data.content));
                }
            } catch (error) {
                console.error('Failed to load inspiration content', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % content.slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + content.slides.length) % content.slides.length);

    // Auto-advance
    useEffect(() => {
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [content.slides.length]);

    // Animation on slide change
    useEffect(() => {
        gsap.fromTo(
            '.slide-content',
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
        );
    }, [currentSlide]);

    const renderSlideContent = (slide: any) => {
        return (
            <>
                <p className="text-xl md:text-2xl font-medium text-white mb-6">
                    "{slide.title}"
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                    {slide.text}
                </p>
            </>
        );
    }

    return (
        <section
            ref={sectionRef}
            className="relative py-20 bg-gradient-to-br from-[#1a1a2e] via-[#1f2937] to-[#16213e] overflow-hidden"
        >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            <div className="px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Illustrative / Title Area */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] mb-6">
                                <Mountain className="w-6 h-6 mr-2" />
                                <span className="font-bold tracking-wider text-sm uppercase">Athlete Origin</span>                           </div>

                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6 uppercase">
                                {content.heading.split(' ').slice(0, -1).join(' ')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-orange)] to-orange-500">
                                    {content.heading.split(' ').slice(-1)}
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 font-medium mb-8">
                                {content.subHeading}
                            </p>

                            <div className="hidden lg:block">
                                <div className="flex gap-2">
                                    {content.slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-12 bg-[var(--accent-orange)]' : 'w-4 bg-white/20 hover:bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Story Carousel Card */}
                        <div className="relative">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-12 min-h-[300px] flex flex-col justify-center relative">
                                {/* Navigation */}
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <button
                                        onClick={prevSlide}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-white/50 group-hover:text-white" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                                    >
                                        <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white" />
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <Quote className="w-10 h-10 text-[var(--accent-orange)]/30" />
                                </div>

                                <div className="slide-content">
                                    <span className="text-xs font-bold text-[var(--accent-orange)] uppercase tracking-wider mb-2 block">
                                        Part {currentSlide + 1} / {content.slides.length}
                                    </span>
                                    {renderSlideContent(content.slides[currentSlide])}
                                </div>
                            </div>

                            {/* Mobile Dots */}
                            <div className="flex justify-center gap-2 mt-6 lg:hidden">
                                {content.slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-[var(--accent-orange)]' : 'w-2 bg-white/20'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Final Footer Line */}
                    <div className="mt-12 text-center border-t border-white/5 pt-8">
                        <p className="text-lg font-medium text-white/60">
                            If you're at the start, you're not behind. <span className="text-white">You're just beginning. 🐧⚽</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InspirationStory;
