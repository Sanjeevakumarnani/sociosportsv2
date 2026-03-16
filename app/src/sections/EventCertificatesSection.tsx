import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import EventCertificateModal from '../components/EventCertificateModal';

interface EventCertificate {
  id: number;
  full_name: string;
  certificate_id: string;
  description?: string;
  player_images?: { url?: string; key?: string }[];
  MasterInterest?: { id: number; title: string };
  sport_detail?: { id: string | number; title: string };
  Society?: { id: number; name: string };
  certificate_type?: string;
}

const PREVIEW_COUNT = 4;

const EventCertificateCard = ({ cert }: { cert: EventCertificate }) => {
  const primaryImage = Array.isArray(cert.player_images) && cert.player_images.length > 0
    ? (cert.player_images[0]?.url ||
       (cert.player_images[0] as any)?.Location ||
       (cert.player_images[0] as any)?.location ||
       '')
    : '';

  return (
    <article className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-orange)]/40 transition-all duration-300 flex flex-col h-full">
      <div className="aspect-video bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={cert.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
            <Award className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-[var(--accent-orange)] tracking-[0.2em] uppercase">
            {cert.certificate_id}
          </p>
          {cert.certificate_type && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
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
        <h3 className="font-bold text-lg text-[var(--text-primary)] leading-snug line-clamp-1">
          {cert.full_name}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
          {cert.sport_detail?.title || cert.MasterInterest?.title || 'Multi-sport'}
        </p>
        {cert.Society?.name && (
          <p className="text-xs text-[var(--text-secondary)]/80 line-clamp-1">
            {cert.Society.name}
          </p>
        )}
        {cert.description && (
          <p className="text-xs text-[var(--text-secondary)]/80 mt-1 line-clamp-2">
            {cert.description}
          </p>
        )}
      </div>
    </article>
  );
};

const EventCertificatesSection = () => {
  const [items, setItems] = useState<EventCertificate[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EventCertificate | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.getEventCertificates({ page: 0, pageSize: PREVIEW_COUNT });
        const rows = Array.isArray(res.rows) ? res.rows : [];
        if (!cancelled) {
          setItems(rows as EventCertificate[]);
          setCount(typeof res.count === 'number' ? res.count : rows.length);
        }
      } catch (err) {
        console.error('Failed to load event certificates', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return null;
  if (!items.length) return null;

  const hasMore = count > PREVIEW_COUNT;

  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-orange)]">
              Event certificates
            </span>
          </div>
          {hasMore && (
            <Link
              to="/event-certificates"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--border)] text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-colors"
              aria-label="Browse all event certificates"
            >
              Browse all certificates
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-2 text-[var(--text-primary)] uppercase tracking-tight">
          Tournament Certificate Gallery
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
          Latest participation and winner certificates issued through SocioSports events.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {items.map((cert) => (
            <button
              key={cert.id}
              type="button"
              onClick={() => setSelected(cert)}
              className="text-left h-full"
            >
              <EventCertificateCard cert={cert} />
            </button>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              to="/event-certificates"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--accent-orange)] text-[var(--accent-orange)] font-semibold hover:bg-[var(--accent-orange)]/10 transition-colors"
              aria-label="Browse all event certificates"
            >
              Browse all ({count})
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        {selected && (
          <EventCertificateModal cert={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
};

export default EventCertificatesSection;

