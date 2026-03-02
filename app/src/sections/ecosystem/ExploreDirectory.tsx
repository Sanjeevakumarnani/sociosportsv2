import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    MapPin,
    Trophy,
    ChevronRight,
    Star,
    ArrowRight,
    Loader2,
    BadgeCheck
} from 'lucide-react';
import { api } from '../../services/api';

interface Profile {
    id: string;
    sportsId: string; // Real ID
    name: string;
    role: string; // 'ATHLETE' | 'COACH'
    sport?: string;
    specialization?: string; // For coaches
    location?: string;
    image?: string;
    description?: string; // Bio
    achievements?: string;
    stats?: { matches: number; wins: number } | any;
    rating?: number;
    experience?: string;
    students?: string;
}

const ExploreDirectory = () => {
    const [activeTab, setActiveTab] = useState<'athletes' | 'coaches'>('athletes');
    const [searchTerm, setSearchTerm] = useState('');
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch initial data (recently joined or all)
    const fetchProfiles = async (type: 'athletes' | 'coaches', query: string = '') => {
        setIsLoading(true);
        try {
            let data = [];
            // Use search API for both initial load (empty query) and search
            // The backend now supports empty query returning recent profiles
            const searchResults = await api.sportsProfiles.search(query);

            // Handle response structure (check if array or object)
            const results = Array.isArray(searchResults) ? searchResults : (searchResults.data || []);

            // Filter by active tab role
            const roleFilter = type === 'athletes' ? 'ATHLETE' : 'TRAINER';
            data = results.filter((p: any) => p.role === roleFilter);

            const normalized = data.map((item: any) => ({
                id: item.id || item._id,
                sportsId: item.sportsId || 'N/A',
                name: item.name,
                role: item.role || (type === 'athletes' ? 'ATHLETE' : 'TRAINER'),
                sport: item.sport || item.specialization || 'General',
                location: item.location || 'India',
                image: item.image,
                description: item.bio || item.description || "Recently joined the journey. Congrats for a wonderful start and great achievements to come.",
                stats: item.stats || { matches: '-', wins: '-' },
                rating: item.rating || 5.0,
                students: item.students || 'New',
                experience: item.experience || 'Fresher'
            })).slice(0, 4); // Limit to 4 for display

            setProfiles(normalized);

        } catch (error) {
            console.error('Failed to fetch profiles', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProfiles(activeTab, searchTerm);
        }, searchTerm ? 500 : 0);

        return () => clearTimeout(timer);
    }, [activeTab, searchTerm]);

    return (
        <section className="relative py-20 md:py-28 bg-[var(--bg-primary)] overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[11px] font-black tracking-[0.3em] text-[var(--accent-orange)] uppercase mb-4 block">
                        Discover Talent
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">
                        Explore The <span className="text-gradient">Network</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
                        Same platform. Two powerful directories. Find the right athletes or coaches in seconds.
                    </p>
                </div>

                {/* Tab Bar */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-1.5">
                        <button
                            onClick={() => { setActiveTab('athletes'); setSearchTerm(''); }}
                            className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'athletes'
                                ? 'bg-[var(--accent-orange)] text-white shadow-lg shadow-[var(--accent-orange)]/20'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                                }`}
                        >
                            <Trophy className="w-4 h-4 inline mr-2" />
                            Athletes
                        </button>
                        <button
                            onClick={() => { setActiveTab('coaches'); setSearchTerm(''); }}
                            className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'coaches'
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                                }`}
                        >
                            <Star className="w-4 h-4 inline mr-2" />
                            Coaches
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-10">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab} by name, sport, or location...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Card Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[var(--accent-orange)] animate-spin" />
                    </div>
                ) : profiles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {profiles.map((profile) => (
                            <div
                                key={profile.id}
                                className={`group relative bg-[var(--bg-secondary)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--accent-orange)]/10`}
                            >
                                {/* Gradient Border Effect */}
                                <div className={`absolute inset-0 p-[1px] rounded-2xl bg-gradient-to-br from-white/10 to-transparent ${activeTab === 'athletes' ? 'group-hover:from-[var(--accent-orange)] group-hover:to-[var(--accent-orange)]/20' : 'group-hover:from-blue-500 group-hover:to-blue-500/20'} transition-all duration-300 pointer-events-none`} />

                                <div className="p-5 relative z-10 h-full flex flex-col">
                                    {/* Sport badge & ID */}
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`inline-block px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[10px] font-bold ${activeTab === 'athletes' ? 'text-[var(--accent-orange)]' : 'text-blue-500'} uppercase tracking-wider`}>
                                            {profile.sport}
                                        </span>
                                        {profile.sportsId && (
                                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[10px] font-mono tracking-wider text-[var(--text-secondary)] group-hover:text-white transition-colors">
                                                <BadgeCheck className={`w-3 h-3 ${activeTab === 'athletes' ? 'text-[var(--accent-orange)]' : 'text-blue-500'}`} />
                                                {profile.sportsId}
                                            </div>
                                        )}
                                    </div>

                                    {/* Image & Name */}
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-primary)] overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                                            <img
                                                src={profile.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`}
                                                alt={profile.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-black text-[var(--text-primary)] truncate group-hover:text-white transition-colors">{profile.name}</h3>
                                            <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] truncate mt-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{profile.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* "New Joiner" Message - Enhanced */}
                                    <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border)] relative overflow-hidden group-hover:border-white/10 transition-colors flex-1 flex items-center">
                                        {/* Quote decorative */}
                                        <span className="absolute top-2 left-2 text-4xl leading-none text-[var(--text-secondary)] opacity-10 font-serif">"</span>

                                        <p className="text-[11px] italic text-[var(--text-secondary)] leading-relaxed relative z-10 text-center w-full group-hover:text-[var(--text-primary)] transition-colors">
                                            "Recently joined the journey. Congrats for a wonderful start and great achievements to come."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <p>No profiles found matching "{searchTerm}"</p>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-[var(--text-secondary)] opacity-60">
                        Discover the rising stars and expert mentors joining our ecosystem every day.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ExploreDirectory;
