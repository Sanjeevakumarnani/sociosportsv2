import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Upload, CheckCircle, X } from 'lucide-react';
import { API_URL, api } from '../services/api';
import SEOHead from '../components/SEOHead';

const VerifyCertificatePage = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const [existing, setExisting] = useState<any | null>(null);
  const [showExistsModal, setShowExistsModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    sportName: '',
    description: '',
    imageUrl: '',
    imageObject: null as any,
  });
  const [societyQuery, setSocietyQuery] = useState('');
  const [societyResults, setSocietyResults] = useState<{ id: number; society_name: string }[]>([]);
  const [societyLoading, setSocietyLoading] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState<{ id: number; society_name: string } | null>(null);
  const [sportQuery, setSportQuery] = useState('');
  const [sportResults, setSportResults] = useState<{ id: number; title: string }[]>([]);
  const [sportLoading, setSportLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState<{ id: number; title: string } | null>(null);

  useEffect(() => {
    if (!certificateId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const params = new URLSearchParams();
        params.append('certificate_id', certificateId);
        params.append('is_screen_for', 'verifycertificate');
        const res = await fetch(`${API_URL}/EventCirtificate?${params.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch certificate');
        }
        const data = await res.json();
        const row = Array.isArray(data?.rows) && data.rows.length > 0 ? data.rows[0] : null;
        if (!cancelled) {
          setExisting(row);
          if (row && row.full_name && row.player_images && row.player_images.length > 0) {
            setShowExistsModal(true);
          }
        }
      } catch {
        if (!cancelled) setExisting(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [certificateId]);

  // Auto-search societies as user types
  useEffect(() => {
    let cancelled = false;
    const q = societyQuery.trim();
    // If nothing typed or input matches the selected society name, don't show dropdown
    if (!q || (selectedSociety && q === selectedSociety.society_name)) {
      setSocietyResults([]);
      return;
    }
    setSocietyLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await api.searchSocieties(q);
        if (!cancelled) {
          setSocietyResults(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) setSocietyResults([]);
      } finally {
        if (!cancelled) setSocietyLoading(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [societyQuery]);

  // Auto-search sports (MasterInterest) as user types in sport field
  useEffect(() => {
    let cancelled = false;
    const q = sportQuery.trim();
    if (!q) {
      setSportResults([]);
      return;
    }
    setSportLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const rows = await api.masterInterest.list({ category: 'General', title: q });
        if (!cancelled) {
          setSportResults(Array.isArray(rows) ? rows : []);
        }
      } catch {
        if (!cancelled) setSportResults([]);
      } finally {
        if (!cancelled) setSportLoading(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [sportQuery]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('singleFile', file);
      const res = await fetch(`${API_URL}/Common/Upload?modulename=webcertificates`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to upload image');
      }
      const data = await res.json();
      // Backend returns a single S3 object response with Location and Key
      const uploaded = Array.isArray(data) ? data[0] : data;
      setForm((f) => ({
        ...f,
        imageUrl: uploaded?.Location || uploaded?.url || '',
        imageObject: uploaded || null,
      }));
    } catch {
      setForm((f) => ({ ...f, imageUrl: '', imageObject: null }));
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId || !form.fullName.trim() || !selectedSociety || !selectedSport || !form.imageUrl || saving) return;
    if (!existing) return;
    setSaving(true);
    try {
      const payload: any = {
        full_name: form.fullName.trim(),
        // Player image is mandatory: always send at least one image object
        player_images: [form.imageObject || { Location: form.imageUrl }],
      };
      if (selectedSociety) {
        payload.society = selectedSociety.id;
      }
      if (selectedSport) {
        payload.sport = selectedSport.id;
      }
      if (form.description.trim()) {
        payload.description = form.description.trim();
      }

      const res = await fetch(`${API_URL}/EventCirtificate/${existing.id}?is_screen_for=verifycertificate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update certificate');
      }
      setSubmitted(true);
    } catch (err: any) {
      alert(err?.message || 'Failed to update certificate. Make sure the API is running.');
    } finally {
      setSaving(false);
    }
  };

  // After successful submit, take the user back to the public leaderboard/gallery.
  useEffect(() => {
    if (!submitted) return;
    const t = window.setTimeout(() => {
      navigate('/event-certificates');
    }, 2000);
    return () => window.clearTimeout(t);
  }, [submitted, navigate]);

  if (!certificateId) {
    return (
      <main className="min-h-screen pt-24 px-4">
        <p className="text-[var(--text-secondary)]">Invalid certificate link. Use a QR code or link with a certificate ID.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <SEOHead
        title={`Verify Certificate ${certificateId} | SocioSports`}
        description="Submit or view certificate details for SocioSports verification."
      />
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Certificate Verification
        </h1>
        <div className="flex items-center justify-between gap-2 mb-8">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Certificate ID:{' '}
            <span className="font-mono font-semibold text-[var(--accent-orange)]">{certificateId}</span>
          </p>
          {existing?.certificate_type && (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                existing.certificate_type === 'Gold'
                  ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/40'
                  : existing.certificate_type === 'Silver'
                  ? 'bg-slate-400/15 text-slate-200 border border-slate-400/40'
                  : 'bg-amber-700/20 text-amber-300 border border-amber-600/40'
              }`}
            >
              {existing.certificate_type}
            </span>
          )}
        </div>

        {loading ? (
          <p className="text-[var(--text-secondary)]">Loading…</p>
        ) : submitted ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Details submitted</h2>
            <p className="text-[var(--text-secondary)]">Certificate details have been saved successfully.</p>
          </div>
        ) : existing && existing.full_name && existing.player_images && existing.player_images.length > 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center">
            <p className="text-[var(--text-primary)] mb-4">This certificate already has details on file.</p>
            <button
              type="button"
              onClick={() => setShowExistsModal(true)}
              className="btn-primary"
            >
              View details
            </button>
          </div>
        ) : !existing ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center">
            <p className="text-[var(--text-primary)] mb-2">Certificate not found.</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Please check the certificate link or try again later.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Full name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Enter full name"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] focus:border-[var(--accent-orange)] focus:outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Sport *</label>
              <input
                type="text"
                value={selectedSport ? selectedSport.title : sportQuery}
                onChange={(e) => {
                  setSportQuery(e.target.value);
                  setSelectedSport(null);
                }}
                placeholder="Start typing sport name"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] focus:border-[var(--accent-orange)] focus:outline-none text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
              {sportLoading && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Searching sports…
                </p>
              )}
              {sportResults.length > 0 && !selectedSport && (
                <div className="mt-1 max-h-40 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] divide-y divide-[var(--border)]">
                  {sportResults.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedSport(s);
                        setSportQuery('');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Select society *</label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={societyQuery}
                  onChange={(e) => {
                    setSocietyQuery(e.target.value);
                    if (selectedSociety && e.target.value.trim() !== selectedSociety.society_name) {
                      setSelectedSociety(null);
                    }
                  }}
                  placeholder="Start typing society name"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] focus:border-[var(--accent-orange)] focus:outline-none text-sm"
                  style={{ color: 'var(--text-primary)' }}
                />
                {societyLoading && (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Searching societies…
                  </p>
                )}
                {societyResults.length > 0 && !selectedSociety && (
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] divide-y divide-[var(--border)]">
                    {societyResults.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedSociety(s);
                          setSocietyQuery(s.society_name);
                          setSocietyResults([]);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--accent-orange)]/10"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {s.society_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Player image *</label>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>On mobile: use Upload to pick from gallery if Camera fails.</p>
              <div className="flex gap-3 items-center flex-wrap">
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent-orange)] transition-colors active:scale-[0.98]">
                  <Camera className="w-5 h-5 text-[var(--accent-orange)]" />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent-orange)] transition-colors active:scale-[0.98]">
                  <Upload className="w-5 h-5 text-[var(--accent-orange)]" />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {form.imageUrl && (
                <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-[var(--border)]">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, imageUrl: '', imageObject: null }))}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Share your moments</label>
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                Tell us more about this match, tournament, or achievement (optional, up to 1000 characters).
              </p>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    description: e.target.value.slice(0, 1000),
                  }))
                }
                rows={5}
                placeholder="What made this moment special? Key highlights, opponents, scores, or anything you want remembered."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] focus:border-[var(--accent-orange)] focus:outline-none text-sm resize-y"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <button
              type="submit"
              disabled={
                !form.fullName.trim() ||
                !selectedSociety ||
                !selectedSport ||
                !existing ||
                !form.imageUrl ||
                saving
              }
              className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {saving ? 'Saving…' : 'Submit'}
            </button>
          </form>
        )}
      </div>

      {/* Already exists popup */}
      {showExistsModal && existing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowExistsModal(false)}>
          <div
            className="relative w-full max-w-lg rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Certificate details already exist
              </h3>
              <button
                type="button"
                onClick={() => setShowExistsModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1 space-y-2 text-sm">
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  This certificate ID already has verified details on file.
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">Name:</span>{' '}
                  <span style={{ color: 'var(--text-primary)' }}>{existing.full_name}</span>
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">Sport:</span>{' '}
                  <span style={{ color: 'var(--text-primary)' }}>
                    {existing.sport_detail?.title || existing.MasterInterest?.title || '—'}
                  </span>
                </p>
                {existing.Society?.name && (
                  <p>
                    <span className="text-[var(--text-secondary)]">Society:</span>{' '}
                    <span style={{ color: 'var(--text-primary)' }}>{existing.Society.name}</span>
                  </p>
                )}
              </div>
              {Array.isArray(existing.player_images) &&
                existing.player_images.length > 0 &&
                (existing.player_images[0]?.url || existing.player_images[0]?.Location) && (
                <div className="w-28 h-28 rounded-2xl overflow-hidden border border-[var(--border)] flex-shrink-0 self-start mt-2">
                  <img
                    src={existing.player_images[0].url || existing.player_images[0].Location}
                    alt={existing.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <button type="button" onClick={() => setShowExistsModal(false)} className="mt-6 w-full btn-secondary py-3">
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default VerifyCertificatePage;
