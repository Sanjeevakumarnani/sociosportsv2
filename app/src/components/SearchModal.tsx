import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Trophy, Award, BadgeCheck, X, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusTrap } from '../hooks/useFocusTrap';
import SportsIdCard from './SportsIdCard';
import AthleteResume from './AthleteResume';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SportsProfile {
    id: string;
    sportsId: string;
    name: string;
    role: string;
    userId?: number | string;
    sport?: string;
    profession?: string;
    city?: string;
    image?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    height?: string;
    weight?: string;
    bio?: string;
    achievements?: string;
    trainingHistory?: string;
    certifications?: string;
    experience?: string;
    specializations?: string;
    socialLinks?: string;
    skills?: string;
    languages?: string;
    hobbies?: string;
    references?: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SportsProfile[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<SportsProfile | null>(null);
    const [viewMode, setViewMode] = useState<'ID_CARD' | 'RESUME'>('ID_CARD');
    const modalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useFocusTrap(modalRef, isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
            // Reset state on close
            setTimeout(() => {
                setQuery('');
                setResults([]);
                setHasSearched(false);
                setSelectedProfile(null);
                setViewMode('ID_CARD');
            }, 300);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        setSelectedProfile(null);
        try {
            const response = await api.sportsProfiles.search(query);
            const rows = response.rows ?? [];

            const mapped: SportsProfile[] = rows.map((item: any) => {
                const rawType = (item.user_type || '').toLowerCase();
                const isAthlete =
                    rawType.includes('sportsman') ||
                    rawType.includes('athelete') ||
                    rawType.includes('athlete');

                const firstName = item.first_name || '';
                const lastName = item.last_name || '';
                const fullName = `${firstName} ${lastName}`.trim() || 'New Member';

                // If there is no member_id or it's null/empty, show 'N/A'
                const sportsId =
                    (item.member_id && String(item.member_id).trim()) ||
                    'N/A';

                // Try to pick primary image from photos / cover_photos
                let image: string | undefined;
                if (Array.isArray(item.photos) && item.photos.length > 0) {
                    const firstPhoto = item.photos[0];
                    if (typeof firstPhoto === 'string') {
                        image = firstPhoto;
                    } else if (firstPhoto && typeof firstPhoto === 'object') {
                        image =
                            firstPhoto.Location ||
                            firstPhoto.url ||
                            firstPhoto.path ||
                            firstPhoto.src;
                    }
                } else if (Array.isArray(item.cover_photos) && item.cover_photos.length > 0) {
                    const firstCover = item.cover_photos[0];
                    if (typeof firstCover === 'string') {
                        image = firstCover;
                    } else if (firstCover && typeof firstCover === 'object') {
                        image =
                            firstCover.Location ||
                            firstCover.url ||
                            firstCover.path ||
                            firstCover.src;
                    }
                }

                return {
                    id: String(item.id ?? sportsId),
                    sportsId,
                    name: fullName,
                    role: isAthlete ? 'ATHLETE' : 'TRAINER',
                    userId: item.id,
                    sport: item.professional_title || (isAthlete ? 'Athlete' : 'Coach'),
                    profession: !isAthlete ? (item.professional_title || 'Coach') : undefined,
                    city: item.city || 'India',
                    image,
                    bio: item.technical_overview || undefined,
                    email: item.email ?? item.email_id ?? item.user_email ?? undefined,
                    phone: item.phone ?? item.mobile ?? item.phone_number ?? undefined,
                };
            });

            setResults(mapped);
        } catch (error) {
            console.error(error);
            toast.error('Failed to search');
        } finally {
            setIsSearching(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`relative w-full bg-[var(--bg-secondary)] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col ${selectedProfile ? 'max-w-7xl h-[90vh]' : 'max-w-4xl max-h-[85vh]'}`}
            >
                {selectedProfile ? (
                    viewMode === 'RESUME' ? (
                        <AthleteResume
                            profile={selectedProfile}
                            onBack={() => {
                                setSelectedProfile(null);
                            }}
                            onShowCard={() => setViewMode('ID_CARD')}
                            onClose={onClose}
                        />
                    ) : (
                        <SportsIdCard
                            profile={selectedProfile}
                            onBack={() => {
                                setSelectedProfile(null);
                            }}
                            onShowResume={() => setViewMode('RESUME')}
                        />
                    )
                ) : (
                    <>
                        {/* Header / Search Bar */}
                        <div className="p-6 border-b border-white/5 bg-[var(--bg-primary)]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Search className="w-5 h-5 text-[var(--accent-orange)]" />
                                    Verification Search
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/70" />
                                </button>
                            </div>

                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by Name or Sports ID (e.g. STA00000, STA00001)"
                                    className="w-full pl-6 pr-32 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-white/10 text-white text-lg focus:outline-none focus:border-[var(--accent-orange)] transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-[var(--accent-orange)] text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                                </button>
                            </form>
                        </div>

                        {/* Results Area */}
                        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
                            {hasSearched ? (
                                results.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {results.map((profile) => (
                                            <div
                                                key={profile.id}
                                                onClick={() => setSelectedProfile(profile)}
                                                className="bg-[var(--bg-primary)] rounded-2xl p-4 border border-white/5 hover:border-[var(--accent-orange)]/30 transition-all flex items-start gap-4 group cursor-pointer hover:bg-white/5"
                                            >
                                                <div className="w-16 h-16 rounded-xl bg-[var(--bg-secondary)] overflow-hidden border border-white/10 flex-shrink-0">
                                                    <img
                                                        src={profile.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`}
                                                        alt={profile.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <h3 className="text-white font-bold truncate pr-2 group-hover:text-[var(--accent-orange)] transition-colors">{profile.name}</h3>
                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${profile.role === 'ATHLETE'
                                                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                            : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                            }`}>
                                                            {profile.role}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 mt-1 mb-2">
                                                        <BadgeCheck className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
                                                        <span className="text-xs font-mono text-[var(--accent-orange)] tracking-wider">{profile.sportsId}</span>
                                                    </div>

                                                    <div className="text-xs text-[var(--text-secondary)] space-y-1">
                                                        {(profile.sport || profile.profession) && (
                                                            <div className="flex items-center gap-2">
                                                                {profile.role === 'ATHLETE' ? <Trophy className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                                                                <span className="truncate">{profile.sport || profile.profession}</span>
                                                            </div>
                                                        )}
                                                        {profile.city && (
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-3 h-3" />
                                                                <span className="truncate">{profile.city}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] opacity-50">
                                        <Search className="w-12 h-12 mb-4" />
                                        <p>No profiles found matching "{query}"</p>
                                    </div>
                                )
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] opacity-30">
                                    <Search className="w-16 h-16 mb-4" />
                                    <p className="text-lg">Search for Athletes or Coaches</p>
                                    <p className="text-sm mt-2">Enter Name or Sports ID</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default SearchModal;
