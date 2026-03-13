import { useRef, useState } from 'react';
import { Download, Share2, ShieldCheck, MapPin, Trophy, Award, ChevronLeft } from 'lucide-react';
import html2canvas from 'html2canvas'; // Ensure this is installed: npm install html2canvas
import { toast } from 'react-hot-toast';

interface SportsProfile {
    id: string;
    sportsId: string;
    name: string;
    role: string;
    sport?: string;
    profession?: string;
    city?: string;
    image?: string;
    email?: string;
    phone?: string;
}

interface SportsIdCardProps {
    profile: SportsProfile;
    onBack: () => void;
    onShowResume: () => void;
}

const SportsIdCard: React.FC<SportsIdCardProps> = ({ profile, onBack, onShowResume }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imageSrc = !imageError && profile.image
        ? profile.image
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        const toastId = toast.loading('Generating ID Card...');

        try {
            // Wait for images to load if needed, but usually they are cached since we just showed them
            // Short delay to ensure rendering is stable
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true, // Important for external images
                scale: 3, // Higher resolution
                backgroundColor: null, // Transparent background if possible, but card has its own
                logging: false,
            });

            const link = document.createElement('a');
            link.download = `SocioSports-ID-${profile.sportsId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            toast.success('ID Card Downloaded!', { id: toastId });
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download card', { id: toastId });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)]">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[var(--bg-secondary)]">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Search
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={onShowResume}
                        className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
                    >
                        View Full Profile
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? 'Saving...' : 'Download Card'}
                    </button>
                </div>
            </div>

            {/* Card Preview Area */}
            <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
                <div className="min-h-full w-full flex items-center justify-center p-8">
                    {/* The ID Card Component to Capture */}
                    <div
                        ref={cardRef}
                        className="relative w-[400px] aspect-[3/5] rounded-3xl overflow-hidden shadow-2xl bg-[#0f141f] text-white border border-white/10 shrink-0"
                        style={{
                            backgroundImage: 'url("/images/grid-pattern.png"), linear-gradient(135deg, #0f141f 0%, #1a2233 100%)',
                            backgroundBlendMode: 'overlay, normal'
                        }}
                    >
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-orange)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        {/* Header */}
                        <div className="p-6 pb-2 text-center relative z-10">
                            <div className="flex justify-center mb-3">
                                <img src="/images/logo.png" alt="SocioSports" className="h-8 object-contain" />
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-3" />
                            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] font-bold">Official Digital Identity</h2>
                        </div>

                        {/* Profile Image */}
                        <div className="relative z-10 px-6 py-4 flex justify-center">
                            <div className="w-32 h-32 rounded-3xl p-1 bg-gradient-to-br from-[var(--accent-orange)] to-purple-600 shadow-lg">
                                <div className="w-full h-full rounded-[20px] overflow-hidden bg-[var(--bg-primary)]">
                                    <img
                                        src={imageSrc}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                </div>
                            </div>
                            {/* Verified Badge */}
                            <div className="absolute bottom-2 right-1/2 translate-x-10 translate-y-2 bg-blue-500 text-white rounded-full p-1.5 border-4 border-[#0f141f]">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 text-center space-y-4 relative z-10">
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">{profile.name}</h1>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border mb-2 ${profile.role === 'ATHLETE'
                                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    : 'bg-green-500/10 text-green-500 border-green-500/20'
                                    }`}>
                                    {profile.role}
                                </span>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-colors duration-300">
                                <div className="text-left">
                                    <p className="text-[10px] uppercase text-[var(--text-secondary)] tracking-[0.2em] mb-1.5 font-bold">Official Sports ID</p>
                                    <p className="text-2xl font-mono font-black text-[var(--accent-orange)] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{profile.sportsId}</p>
                                </div>
                                <div className="p-1.5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${profile.sportsId}&bgcolor=ffffff&color=0f141f`}
                                        alt="QR Code"
                                        className="w-12 h-12"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-left">
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <p className="text-[9px] uppercase text-[var(--text-secondary)] tracking-widest mb-1 flex items-center gap-1">
                                        {profile.role === 'ATHLETE' ? <Trophy className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                                        {profile.role === 'ATHLETE' ? 'Sport' : 'Profession'}
                                    </p>
                                    <p className="text-sm font-bold truncate">{profile.sport || profile.profession || '-'}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <p className="text-[9px] uppercase text-[var(--text-secondary)] tracking-widest mb-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Location
                                    </p>
                                    <p className="text-sm font-bold truncate">{profile.city || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                            <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-medium">Verified Member • SocioSports Ecosystem</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SportsIdCard;
