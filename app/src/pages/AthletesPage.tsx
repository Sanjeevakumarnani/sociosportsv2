import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Trophy, Award, Calendar, Instagram, Twitter, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import AthleteIdentity from '../sections/AthleteIdentity';
import VerifiedAchievements from '../sections/VerifiedAchievements';
import TrainSmarter from '../sections/TrainSmarter';
import FindCoach from '../sections/FindCoach';
import LifeAfterSports from '../sections/LifeAfterSports';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';
import AthleteJourneyModal from '../components/AthleteJourneyModal';
import { api } from '../services/api';

// Sample athlete profiles for demonstration
const SAMPLE_ATHLETES = [
    {
        id: 'athlete-1',
        name: 'S Sanjeeva Kumar',
        sport: 'Cricket',
        location: 'Bhagyalatha, Hyderabad',
        verified: true,
        bio: 'Passionate cricketer with strong batting and bowling skills. Committed to excellence in the sport.',
        achievements: '🏏 District Level Player | 🎯 Best All-Rounder Award',
        stats: { matches: 85, wins: 58 },
        socialLinks: {}
    },
    {
        id: 'athlete-2',
        name: 'S Sahasra Reddy',
        sport: 'Kick Boxing',
        location: 'Hayathnagar, Hyderabad',
        verified: true,
        bio: 'Dedicated kick boxing athlete with multiple tournament wins. Training for state championships.',
        achievements: '🥊 Regional Champion 2024 | 🥇 Gold Medalist',
        stats: { matches: 42, wins: 35 },
        socialLinks: {}
    },
    {
        id: 'athlete-3',
        name: 'Y Adwitha',
        sport: 'Basketball',
        location: 'Hayathnagar, Hyderabad',
        verified: true,
        bio: 'Skilled basketball player with excellent teamwork and shooting abilities.',
        achievements: '🏀 School Champion | 🌟 MVP Award 2023',
        stats: { matches: 67, wins: 45 },
        socialLinks: {}
    },
    {
        id: 'athlete-4',
        name: 'M Priyanka',
        sport: 'Running',
        location: 'Hyderabad',
        verified: true,
        bio: 'Long distance runner with impressive stamina and speed. Passionate about athletics.',
        achievements: '� State Level Qualifier | 🥈 District Silver Medal',
        stats: { matches: 38, wins: 26 },
        socialLinks: {}
    },
    {
        id: 'athlete-5',
        name: 'B Yuvraj',
        sport: 'Swimming',
        location: 'Kukatpally, Hyderabad',
        verified: true,
        bio: 'Competitive swimmer with expertise in multiple swimming styles. Dedicated to the sport.',
        achievements: '� State Championship Participant | � Bronze Medalist',
        stats: { matches: 29, wins: 22 },
        socialLinks: {}
    },
    {
        id: 'athlete-6',
        name: 'S Rohith Kumar',
        sport: 'Hockey',
        location: 'Anajpur, Hyderabad',
        verified: true,
        bio: 'Talented hockey player with strong teamwork and strategic playing skills.',
        achievements: '🏑 District Team Player | 🎖️ Best Forward Award',
        stats: { matches: 76, wins: 53 },
        socialLinks: {}
    },
];

const AthletesPage = () => {
    const location = useLocation();
    const isFromGap = location.state?.fromGap === true;
    const [athletes, setAthletes] = useState<any[]>(SAMPLE_ATHLETES);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSport, setFilterSport] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
    const [showJourneyModal, setShowJourneyModal] = useState(false);

    // Removed API fetch to restore sample data display

    // Filter athletes based on search and sport filter
    const filteredAthletes = athletes.filter(athlete => {
        const matchesSearch = searchTerm === '' ||
            athlete.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            athlete.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            athlete.sport?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSport = filterSport === 'All' || athlete.sport === filterSport;

        return matchesSearch && matchesSport;
    });

    // Handle view profile click
    const handleViewProfile = (athlete: any) => {
        setSelectedAthlete(athlete);
        setShowJourneyModal(true);
    };

    // Get unique sports for filter
    const uniqueSports = ['All', ...new Set(athletes.map(a => a.sport).filter(Boolean))];

    return (
        <main>
            <SEOHead
                title="Digital Sports Profiles for Athletes | SocioSports"
                description="Create your verified digital sports resume. Track achievements, connect with coaches and scouts, access tournaments, and build your athletic career with India's leading sports platform."
            />
            <div className="pt-20">
                <AthleteIdentity />
                <VerifiedAchievements />
                {!isFromGap && (
                    <>
                        <TrainSmarter />
                        <FindCoach />
                    </>
                )}

                {/* Featured Profiles Disclaimer Banner */}
                <div className="bg-[var(--bg-secondary)] border-t border-b border-[var(--border)] py-3">
                    <div className="container mx-auto px-4 md:px-6">
                        <p className="text-center text-xs text-[var(--text-secondary)]">
                            <span className="font-bold text-[var(--accent-orange)]">Note:</span> The profiles shown below are featured athletes for demonstration purposes. The complete athlete directory with advanced search and filtering is available below.
                        </p>
                    </div>
                </div>

                {/* Athlete Directory Section */}
                <section className="py-20 bg-[var(--bg-primary)]">
                    <div className="container mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
                                Find <span className="text-gradient">Athletes</span>
                            </h2>
                            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                                Connect with verified athletes across India. Discover talent, check achievements, and build your sports network.
                            </p>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="max-w-4xl mx-auto mb-12">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, sport, or location..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-orange)] transition-all"
                                >
                                    <Filter className="w-5 h-5" />
                                    <span className="font-bold">Filters</span>
                                </button>
                            </div>

                            {/* Filter Panel */}
                            {showFilters && (
                                <div className="mt-4 p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Sport</label>
                                        <select
                                            value={filterSport}
                                            onChange={(e) => setFilterSport(e.target.value)}
                                            className="w-full md:w-48 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                                        >
                                            {uniqueSports.map(sport => (
                                                <option key={sport} value={sport}>{sport}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            {filteredAthletes.length} athlete{filteredAthletes.length !== 1 ? 's' : ''} found
                                        </span>
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilterSport('All');
                                            }}
                                            className="text-sm font-bold text-[var(--accent-orange)] hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Athletes Grid */}
                        {loading ? (
                            <div className="text-center py-20">
                                <img src="/favicon.png" alt="Loading..." className="w-16 h-16 animate-spin" />
                                <p className="mt-4 text-[var(--text-secondary)]">Loading athletes...</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredAthletes.length > 0 ? (
                                    filteredAthletes.map((athlete) => (
                                        <div key={athlete.id} className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent-orange)]/50 transition-all hover:-translate-y-1">
                                            {/* Content */}
                                            <div className="p-5">
                                                {/* Name & Location */}
                                                <div className="mb-4">
                                                    <h3 className="text-lg font-black text-[var(--text-primary)] mb-2">
                                                        {athlete.name || 'Athlete'}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{athlete.location || 'India'}</span>
                                                    </div>
                                                </div>

                                                {/* Sport Badge */}
                                                <div className="mb-4">
                                                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-xs font-bold text-[var(--accent-orange)]">
                                                        {athlete.sport || 'Multi-Sport'}
                                                    </span>
                                                </div>

                                                {/* Stats */}
                                                {athlete.stats && (
                                                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[var(--border)]">
                                                        {athlete.stats.matches && (
                                                            <div>
                                                                <div className="text-xs text-[var(--text-secondary)] mb-1">Matches</div>
                                                                <div className="text-lg font-black text-[var(--text-primary)]">{athlete.stats.matches}</div>
                                                            </div>
                                                        )}
                                                        {athlete.stats.wins && (
                                                            <div>
                                                                <div className="text-xs text-[var(--text-secondary)] mb-1">Wins</div>
                                                                <div className="text-lg font-black text-[var(--text-primary)]">{athlete.stats.wins}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Bio */}
                                                {athlete.bio && (
                                                    <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                                                        {athlete.bio}
                                                    </p>
                                                )}

                                                {/* View Profile Button */}
                                                <button
                                                    onClick={() => handleViewProfile(athlete)}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-bold text-sm hover:bg-[var(--accent-orange)] hover:text-white hover:border-[var(--accent-orange)] transition-all group-hover:bg-[var(--accent-orange)] group-hover:text-white group-hover:border-[var(--accent-orange)]">
                                                    View Journey
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20">
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                                            <Trophy className="w-10 h-10 text-[var(--text-secondary)]" />
                                        </div>
                                        <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">
                                            No Athletes Found
                                        </h3>
                                        <p className="text-[var(--text-secondary)] mb-6">
                                            {searchTerm || filterSport !== 'All'
                                                ? 'Try adjusting your search or filters'
                                                : 'Be the first to create your athlete profile and get discovered!'}
                                        </p>
                                        {(searchTerm || filterSport !== 'All') && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setFilterSport('All');
                                                }}
                                                className="px-6 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-bold hover:border-[var(--accent-orange)] transition-all"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>


                <LifeAfterSports />
                <SimpleFooter />

                {/* Journey Modal */}
                {selectedAthlete && (
                    <AthleteJourneyModal
                        athlete={selectedAthlete}
                        isOpen={showJourneyModal}
                        onClose={() => {
                            setShowJourneyModal(false);
                            setSelectedAthlete(null);
                        }}
                    />
                )}
            </div>
        </main>
    );
};

export default AthletesPage;
