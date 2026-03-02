import React, { useRef, useEffect } from 'react';
import { X, TrendingUp, Users, Award, Calendar, Target, CheckCircle } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface JourneyData {
    before: {
        challenges: string[];
        stats: { label: string; value: string }[];
    };
    after: {
        achievements: string[];
        stats: { label: string; value: string }[];
        benefits: string[];
    };
}

interface AthleteJourneyModalProps {
    athlete: any;
    isOpen: boolean;
    onClose: () => void;
}

const AthleteJourneyModal = ({ athlete, isOpen, onClose }: AthleteJourneyModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useFocusTrap(modalRef, isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Journey data based on athlete
    const journeyData: JourneyData = athlete.journeyData || {
        before: {
            challenges: [
                'Limited visibility to coaches and scouts',
                'No centralized platform for achievements',
                'Difficulty in networking with other athletes',
                'Hard to track performance progress'
            ],
            stats: [
                { label: 'Coach Connections', value: '2-3' },
                { label: 'Tournament Access', value: 'Limited' },
                { label: 'Profile Visibility', value: 'Local Only' }
            ]
        },
        after: {
            achievements: [
                'Connected with 50+ verified coaches',
                'Participated in 10+ tournaments through platform',
                'Featured in digital sports directory',
                'Received 3 scholarship opportunities'
            ],
            stats: [
                { label: 'Profile Views', value: '1,200+' },
                { label: 'Coach Connects', value: '50+' },
                { label: 'Tournaments', value: '10+' }
            ],
            benefits: [
                'Verified digital sports resume',
                'Direct access to coaches and scouts',
                'Tournament discovery and registration',
                'Performance tracking dashboard',
                'Networking with 500+ athletes',
                'Career guidance and mentorship'
            ]
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div ref={modalRef} className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[var(--bg-primary)] border border-[var(--border)] rounded-3xl shadow-2xl">
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    aria-label="Close athlete journey profile"
                    className="sticky top-4 right-4 float-right z-10 w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition-all group"
                >
                    <X className="w-5 h-5 text-[var(--text-primary)] group-hover:text-white" />
                </button>

                {/* Header */}
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-pink)] flex items-center justify-center text-white font-black text-2xl">
                            {athlete.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-[var(--text-primary)] mb-1">{athlete.name}</h2>
                            <p className="text-[var(--text-secondary)] flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20 text-[var(--accent-orange)] text-sm font-bold">
                                    {athlete.sport}
                                </span>
                                <span>•</span>
                                <span>{athlete.location}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--accent-orange)] font-bold">
                        <TrendingUp className="w-4 h-4" />
                        <span>Journey to Success with SocioSports</span>
                    </div>
                </div>

                {/* Journey Timeline */}
                <div className="px-8 pb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* BEFORE */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <span className="text-red-500 font-black text-lg">BEFORE</span>
                                </div>
                                <div className="flex-1 h-px bg-[var(--border)]"></div>
                            </div>

                            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                                <h3 className="text-lg font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-red-500" />
                                    Challenges Faced
                                </h3>
                                <ul className="space-y-3">
                                    {journeyData.before.challenges.map((challenge, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                                            <span>{challenge}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                                <h3 className="text-lg font-black text-[var(--text-primary)] mb-4">Limited Reach</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {journeyData.before.stats.map((stat, idx) => (
                                        <div key={idx} className="text-center">
                                            <div className="text-2xl font-black text-red-500 mb-1">{stat.value}</div>
                                            <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AFTER */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <span className="text-green-500 font-black text-lg">AFTER</span>
                                </div>
                                <div className="flex-1 h-px bg-[var(--border)]"></div>
                            </div>

                            <div className="bg-gradient-to-br from-[var(--accent-orange)]/5 to-[var(--accent-pink)]/5 border border-[var(--accent-orange)]/20 rounded-2xl p-6">
                                <h3 className="text-lg font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-green-500" />
                                    Key Achievements
                                </h3>
                                <ul className="space-y-3">
                                    {journeyData.after.achievements.map((achievement, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-[var(--accent-orange)]/5 to-[var(--accent-pink)]/5 border border-[var(--accent-orange)]/20 rounded-2xl p-6">
                                <h3 className="text-lg font-black text-[var(--text-primary)] mb-4">Exponential Growth</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {journeyData.after.stats.map((stat, idx) => (
                                        <div key={idx} className="text-center">
                                            <div className="text-2xl font-black text-green-500 mb-1">{stat.value}</div>
                                            <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="mt-8 bg-gradient-to-r from-[var(--accent-orange)]/10 to-[var(--accent-pink)]/10 border border-[var(--accent-orange)]/20 rounded-2xl p-6">
                        <h3 className="text-xl font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Target className="w-6 h-6 text-[var(--accent-orange)]" />
                            SocioSports Platform Benefits
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {journeyData.after.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                                    <CheckCircle className="w-5 h-5 text-[var(--accent-orange)] flex-shrink-0" />
                                    <span className="text-sm font-medium text-[var(--text-primary)]">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-pink)] text-white font-bold">
                            <Users className="w-5 h-5" />
                            <span>Join {athlete.name} and 10,000+ Athletes on SocioSports</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AthleteJourneyModal;
