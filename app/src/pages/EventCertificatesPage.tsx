import { useEffect, useState } from 'react';
import { api } from '../services/api';
import SEOHead from '../components/SEOHead';
import SimpleFooter from '../sections/SimpleFooter';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
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

const PAGE_SIZE = 10;

const EventCertificatesPage = () => {
  const [items, setItems] = useState<EventCertificate[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EventCertificate | null>(null);
  const [search, setSearch] = useState('');
  const [activeCertificateId, setActiveCertificateId] = useState<string | null>(null);

  const totalPages = activeCertificateId ? 1 : Math.max(1, Math.ceil(count / PAGE_SIZE));

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.getEventCertificates({
          page: activeCertificateId ? 0 : page,
          pageSize: PAGE_SIZE,
          certificateId: activeCertificateId || undefined,
        });
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
  }, [page, activeCertificateId]);

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  return (
    <main>
      <SEOHead
        title="Event Certificates - SocioSports"
        description="Browse all tournament participation and winner certificates generated on SocioSports."
      />
      <div className="pt-20 min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-10 flex-1">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <p className="text-[11px] font-black tracking-[0.3em] uppercase text-[var(--accent-orange)] mb-3">
                Certificates
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">
                Event Certificates
              </h1>
              <p className="text-[var(--text-secondary)] max-w-2xl">
                Full gallery of certificates generated for verified SocioSports events. Scroll through the list and
                use pagination to explore more records.
              </p>
            </header>

            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] p-4 sm:p-6 lg:p-8">
              {/* Search by certificate ID */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPage(0);
                  setActiveCertificateId(search.trim() || null);
                }}
                className="mb-6 flex justify-end"
              >
                <div className="flex flex-col items-start gap-1 w-full max-w-sm">
                  <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                    Search by Certificate ID
                  </label>
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="e.g. CERT-2025-0001"
                      className="flex-1 px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-orange)]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[var(--accent-orange)] text-white text-xs font-black uppercase tracking-widest"
                    >
                      Search
                    </button>
                    {activeCertificateId && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCertificateId(null);
                          setSearch('');
                          setPage(0);
                        }}
                        className="px-3 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {loading ? (
                <div className="py-16 flex items-center justify-center text-[var(--text-secondary)]">
                  <span className="text-sm font-medium">Loading certificates…</span>
                </div>
              ) : items.length === 0 ? (
                <div className="py-16 flex items-center justify-center text-[var(--text-secondary)]">
                  <span className="text-sm font-medium">No certificates found yet.</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((cert) => {
                      const primaryImage = Array.isArray(cert.player_images) && cert.player_images.length > 0
                        ? (cert.player_images[0]?.url ||
                           (cert.player_images[0] as any)?.Location ||
                           (cert.player_images[0] as any)?.location ||
                           '')
                        : '';

                      return (
                        <button
                          key={cert.id}
                          type="button"
                          onClick={() => setSelected(cert)}
                          className="bg-[var(--bg-primary)]/80 border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent-orange)]/40 transition-all flex flex-col text-left"
                        >
                          <div className="aspect-video bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden">
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
                          <div className="p-4 flex-1 flex flex-col gap-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-mono text-[11px] text-[var(--accent-orange)] tracking-[0.25em] uppercase">
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
                            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] truncate">
                              {cert.full_name}
                            </h2>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">
                              {cert.sport_detail?.title || cert.MasterInterest?.title || 'Multi-sport'}
                              {cert.Society?.name ? ` • ${cert.Society.name}` : ''}
                            </p>
                            {cert.description && (
                              <p className="text-xs text-[var(--text-secondary)]/90 line-clamp-3 mt-1">
                                {cert.description}
                              </p>
                            )}
                            <p className="text-[10px] text-[var(--text-secondary)]/70 mt-1">
                              Posted on{' '}
                              {cert.createdAt
                                ? new Date(cert.createdAt as unknown as string).toLocaleDateString()
                                : '—'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-xs text-[var(--text-secondary)]">
                  Showing page <span className="font-semibold">{page + 1}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span> •{' '}
                  <span className="font-semibold">{count}</span> total certificates
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canPrev}
                    onClick={() => canPrev && setPage((p) => Math.max(0, p - 1))}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                      canPrev
                        ? 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)]/40 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-3 h-3" /> Prev
                  </button>
                  <button
                    type="button"
                    disabled={!canNext}
                    onClick={() => canNext && setPage((p) => p + 1)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                      canNext
                        ? 'border-[var(--accent-orange)] text-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/10'
                        : 'border-[var(--border)] text-[var(--text-secondary)]/40 cursor-not-allowed'
                    }`}
                  >
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {selected && (
          <EventCertificateModal cert={selected} onClose={() => setSelected(null)} />
        )}

        <SimpleFooter />
      </div>
    </main>
  );
};

export default EventCertificatesPage;

