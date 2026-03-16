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
