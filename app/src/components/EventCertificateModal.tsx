import { Award, X } from 'lucide-react';

export interface EventCertificate {
  id: number;
  full_name: string;
  certificate_id: string;
  description?: string;
  player_images?: { url?: string; key?: string }[];
  MasterInterest?: { id: number; title: string };
  sport_detail?: { id: string | number; title: string };
  Society?: { id: number; name: string };
  createdAt?: string;
  certificate_type?: string;
}

interface Props {
  cert: EventCertificate;
  onClose: () => void;
}

const EventCertificateModal: React.FC<Props> = ({ cert, onClose }) => {
  const primaryImage =
    Array.isArray(cert.player_images) && cert.player_images.length > 0
      ? cert.player_images[0]?.url ||
        (cert.player_images[0] as any)?.Location ||
        (cert.player_images[0] as any)?.location ||
        ''
      : '';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white/80 hover:text-white"
          aria-label="Close certificate details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="aspect-video bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={cert.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Award className="w-10 h-10 text-[var(--text-secondary)]" />
          )}
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[11px] text-[var(--accent-orange)] tracking-[0.25em] uppercase">
              {cert.certificate_id}
            </p>
            {cert.certificate_type && (
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  cert.certificate_type === 'Gold'
                    ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/40'
                    : cert.certificate_type === 'Silver'
                    ? 'bg-slate-400/15 text-slate-200 border border-slate-400/40'
                    : 'bg-amber-700/20 text-amber-300 border border-amber-600/40'
                }`}
              >
                {cert.certificate_type}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">
            {cert.full_name}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {cert.sport_detail?.title || cert.MasterInterest?.title || 'Multi-sport'}
            {cert.Society?.name ? ` • ${cert.Society.name}` : ''}
          </p>
          {cert.description && (
            <p className="text-sm text-[var(--text-secondary)]/90 mt-2">
              {cert.description}
            </p>
          )}
          {cert.createdAt && (
            <p className="text-xs text-[var(--text-secondary)]/70 mt-1">
              Posted on{' '}
              {new Date(cert.createdAt as unknown as string).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCertificateModal;

