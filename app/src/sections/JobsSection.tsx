import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Briefcase, CheckCircle, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const JobsSection = ({ jobs, title }: { jobs: any[], title?: React.ReactNode }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!jobs || jobs.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.job-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [jobs]);

    if (!jobs || jobs.length === 0) return null;

    return (
        <section ref={sectionRef} className="py-12 relative overflow-hidden bg-[var(--bg-primary)]">
            {/* Subtle Background Accent */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Clean, Elegant Header */}
                <div className="mb-10 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                        {title}
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mt-4"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} className="job-card group relative p-6 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-primary)] hover:border-blue-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-orange)]">{job.organization || 'SocioSports'}</span>
                                        <CheckCircle className="w-3 h-3 text-[var(--accent-orange)]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">{job.title}</h3>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-[var(--bg-primary)] text-[10px] font-medium text-[var(--text-primary)]/60 border border-[var(--border)]">
                                    {job.type}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 mb-6 text-sm">
                                <div className="flex items-center gap-2 text-[var(--text-primary)]/60">
                                    <MapPin className="w-4 h-4 text-[var(--text-primary)]/20" />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-2 text-[var(--text-primary)]/60">
                                    <Briefcase className="w-4 h-4 text-[var(--text-primary)]/20" />
                                    {job.department || 'General'}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                                <span className="text-[10px] font-medium text-[var(--text-primary)]/40">
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                                {job.applyUrl ? (
                                    <a
                                        href={job.applyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform uppercase tracking-wider"
                                    >
                                        Apply Now <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <button className="flex items-center gap-2 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                                        Apply Now <ExternalLink className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JobsSection;
