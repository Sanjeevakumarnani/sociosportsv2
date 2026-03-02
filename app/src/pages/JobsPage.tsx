import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MapPin, Briefcase, MoveRight, Search, PlusCircle, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';
import { api } from '../services/api';
import JobsSection from '../sections/JobsSection';
import { useAnalytics } from '../components/AnalyticsProvider';
import JobApplicationModal from '../components/JobApplicationModal';
import EmployerVerificationModal from '../components/EmployerVerificationModal';
import TrackVerificationModal from '../components/TrackVerificationModal';

const JobsPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const { trackEvent } = useAnalytics();

    // Modal states
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [existingVerification, setExistingVerification] = useState<any>(null);

    // CMS State
    const [content, setContent] = useState({
        hero: {
            title: 'BUILD THE FUTURE OF SPORTS.',
            description: 'Join the team revolutionizing India\'s sports ecosystem. We are looking for passionate individuals to drive our mission forward.'
        },
        jobs: [] as any[]
    });
    const [realJobs, setRealJobs] = useState<any[]>([]);

    // Handle Post Job click
    const handlePostJobClick = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Not logged in - show verification modal (will prompt login)
            setShowVerificationModal(true);
            return;
        }

        try {
            // Check verification status
            const status = await api.employerVerification.getStatus(token);

            if (status.isVerified) {
                // User is verified - redirect to post job (for now, open email)
                window.location.href = 'mailto:jobs@sociosports.com?subject=Post a Job Inquiry';
            } else if (status.hasVerification) {
                // Has pending/rejected verification
                setExistingVerification({
                    token: status.token,
                    status: status.status,
                    adminRemarks: status.adminRemarks
                });
                setShowVerificationModal(true);
            } else {
                // No verification - show modal to submit
                setExistingVerification(null);
                setShowVerificationModal(true);
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
            // On error, show verification modal
            setShowVerificationModal(true);
        }

        trackEvent('click_post_job', { location: 'jobs_page' });
    };

    const handleVerified = () => {
        // User is now verified - redirect to post job
        window.location.href = 'mailto:jobs@sociosports.com?subject=Post a Job Inquiry';
    };

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
                console.error('Failed to load Jobs content', e);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.jobs-hero-text',
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

    const athleteJobs = realJobs.filter(j => (j.category === 'ATHLETE_OPPORTUNITY' || j.category === 'ATHLETE') && j.isActive);
    const coachJobs = realJobs.filter(j => (j.category === 'COACHING_POSITION' || j.category === 'COACH') && j.isActive);

    return (
        <main ref={pageRef} className="bg-[var(--bg-primary)] min-h-screen flex flex-col pt-24">
            <SEOHead
                title="Careers | SocioSports"
                description={content.hero.description}
            />

            <section className="container mx-auto px-6 mb-8 text-center">

                <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tighter jobs-hero-text max-w-4xl mx-auto leading-tight">
                    {content.hero.title}
                </h1>
                <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto jobs-hero-text mb-8">
                    {content.hero.description}
                </p>

            </section>

            <section className="container mx-auto px-6 mb-12">
                <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 md:p-8 border border-[var(--border)] text-center max-w-3xl mx-auto">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-6 h-6 text-[var(--accent-orange)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">Hiring Sports Talent?</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                        Find the right athletes & coaches for your needs. Verification required to post jobs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handlePostJobClick}
                            className="inline-flex items-center justify-center gap-2 btn-primary px-6 py-3 bg-[var(--accent-orange)] hover:bg-orange-600 text-white rounded-xl font-bold transition-colors"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Post a Job
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowTrackModal(true)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl font-medium transition-colors border border-[var(--border)]"
                        >
                            <Search className="w-4 h-4" />
                            Track Verification
                        </button>
                    </div>
                </div>
            </section>

            {athleteJobs.length > 0 && (
                <JobsSection
                    jobs={athleteJobs}
                    title={<>Athlete <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Opportunities</span></>}
                />
            )}

            {coachJobs.length > 0 && (
                <JobsSection
                    jobs={coachJobs}
                    title={<>Coaching <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">Positions</span></>}
                />
            )}




            {/* Modals */}
            <EmployerVerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                onVerified={handleVerified}
                existingVerification={existingVerification}
            />

            <TrackVerificationModal
                isOpen={showTrackModal}
                onClose={() => setShowTrackModal(false)}
            />

            <SimpleFooter />
        </main >
    );
};



export default JobsPage;
