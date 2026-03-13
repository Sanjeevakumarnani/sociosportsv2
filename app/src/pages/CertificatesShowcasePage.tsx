import { useState, useEffect } from 'react';
import { getAllCertificates, imageToDataUrl, type CertificateRecord } from '../utils/certificateStore';
import SEOHead from '../components/SEOHead';
import SimpleFooter from '../sections/SimpleFooter';

const CertificatesShowcasePage = () => {
  const [list, setList] = useState<CertificateRecord[]>([]);

  useEffect(() => {
    getAllCertificates().then(setList);
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <SEOHead
        title="Certificates | SocioSports"
        description="View all verified certificate submissions on SocioSports."
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Certificates
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          All submitted certificate details (from JSON file).
        </p>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center">
            <p className="text-[var(--text-secondary)]">No certificates submitted yet.</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Scan a certificate QR code or go to <code className="text-[var(--accent-orange)]">/verify-certificate/YOUR_ID</code> to add one.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {list.map((c) => (
              <div
                key={c.certificateId}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden"
              >
                <div className="aspect-video bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
                  {(c.imageBase64 ?? (c as any).imageDataUrl) ? (
                    <img src={imageToDataUrl(c.imageBase64 ?? (c as any).imageDataUrl)} alt={c.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[var(--text-secondary)] text-sm">No image</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-mono text-xs text-[var(--accent-orange)] mb-1">{c.certificateId}</p>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{c.fullName}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.sportName}</p>
                  {c.location && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{c.location}</p>}
                  <p className="text-xs mt-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(c.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SimpleFooter />
    </main>
  );
};

export default CertificatesShowcasePage;
