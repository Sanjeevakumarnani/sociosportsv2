import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Briefcase, Info } from 'lucide-react';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';
import { api } from '../services/api';
import JobsSection from '../sections/JobsSection';

const CareersPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);

    // CMS State
    const [content, setContent] = useState({
        hero: {
            title: 'BUILD THE FUTURE OF SPORTS.',
            description: 'Join the team revolutionizing India\'s sports ecosystem. We are looking for passionate individuals to drive our mission forward.'
        }
    });
    const [realJobs, setRealJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [cmsData, jobsData] = await Promise.all([
                    api.cms.get('jobs-page'),
                    api.getJobs()
                ]);

                if (cmsData && cmsData.content) {
                    setContent(prev => ({ ...prev, ...JSON.parse(cmsData.content) }));
                }
                setRealJobs(jobsData);
            } catch (e) {
                console.error('Failed to load Careers content', e);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.careers-hero-text',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }
            );

            gsap.fromTo('.job-card',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.jobs-list', start: 'top 80%' } }
            );
        }, pageRef);

        return () => ctx.revert();
    }, [content, realJobs]);

    const socioSportsJobs = realJobs.filter(j =>
        (j.category === 'JOIN_SOCIO_SPORTS' || j.category === 'SOCIOSPORTS' || j.company === 'SOCIOSPORTS' || !j.category) && j.isActive
    );

    return (
        <main ref={pageRef} className="bg-[var(--bg-primary)] min-h-screen flex flex-col pt-24">
            <SEOHead
                title="Careers | Join SocioSports"
                description={content.hero.description}
            />

            <section className="container mx-auto px-6 mb-8 text-center px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] mb-4 careers-hero-text">
                    <Briefcase className="w-4 h-4 text-[var(--accent-orange)]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Join our team</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tighter careers-hero-text max-w-4xl mx-auto leading-tight">
                    JOIN <span className="text-[var(--accent-orange)]">SOCIOSPORTS</span>
                </h1>
                <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto careers-hero-text mb-8">
                    We're on a mission to organize Indian sports. If you're passionate about sports and technology, we'd love to have you on board.
                </p>
            </section>

            <div className="flex-1">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : socioSportsJobs.length > 0 ? (
                    <JobsSection
                        jobs={socioSportsJobs}
                        title={null}
                    />
                ) : (
                    <div className="container mx-auto px-6 py-20 text-center">
                        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <Info className="w-12 h-12 text-[var(--accent-orange)] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Openings Currently</h3>
                            <p className="text-[var(--text-secondary)]">
                                We are not hiring at the moment, but we are always looking for great talent.
                                Feel free to send your resume to <a href="mailto:careers@sociosports.in" className="text-[var(--accent-orange)] font-bold">careers@sociosports.in</a>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <SimpleFooter />
        </main>
    );
};

export default CareersPage;
