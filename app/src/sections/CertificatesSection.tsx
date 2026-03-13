import { useState, useEffect } from 'react';
import { getAllCertificates, imageToDataUrl, type CertificateRecord } from '../utils/certificateStore';
import { ChevronDown, ChevronUp, Award } from 'lucide-react';

const PREVIEW_COUNT = 6;

const CertificateCard = ({ c }: { c: CertificateRecord }) => {
  const imgSrc = imageToDataUrl(c.imageBase64 ?? (c as any).imageDataUrl);
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-300 flex flex-col">
      <div className="aspect-video bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={c.fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
            <Award className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
        )}
      </div>
      <div className="p-4 flex-1">
        <p className="font-mono text-xs text-[var(--accent-orange)] mb-1">{c.certificateId}</p>
        <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{c.fullName}</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.sportName}</p>
        {c.location && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{c.location}</p>}
        <p className="text-xs mt-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>
          {new Date(c.submittedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const CertificatesSection = () => {
  const [list, setList] = useState<CertificateRecord[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getAllCertificates().then(setList);
  }, []);

  if (list.length === 0) return null;

  const displayList = showAll ? list : list.slice(0, PREVIEW_COUNT);
  const hasMore = list.length > PREVIEW_COUNT;

  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-orange)]">Verified certificates</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Certificate submissions
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
          Recently verified certificate details from QR code submissions.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((c) => (
            <CertificateCard key={c.certificateId} c={c} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--accent-orange)] text-[var(--accent-orange)] font-semibold hover:bg-[var(--accent-orange)]/10 transition-colors"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-5 h-5" /> Show less
                </>
              ) : (
                <>
                  See all ({list.length} records) <ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificatesSection;
