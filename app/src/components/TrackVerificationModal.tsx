import { useState } from 'react';
import { X, Search, CheckCircle, Clock, AlertCircle, Loader2, Copy } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface TrackVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VerificationStatus {
  token: string;
  status: string;
  companyName: string;
  submittedAt: string;
  reviewedAt?: string;
  adminRemarks?: string;
  isVerified: boolean;
}

const TrackVerificationModal: React.FC<TrackVerificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationStatus | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!token.trim()) {
      toast.error('Please enter a verification token');
      return;
    }

    if (!token.startsWith('SOCIO-VER-')) {
      toast.error('Invalid token format. Token should start with SOCIO-VER-');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.employerVerification.trackByToken(token.trim());
      setResult(response);
    } catch (err: any) {
      console.error('Track error:', err);
      setError(err.message || 'Verification not found');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    if (result?.token) {
      navigator.clipboard.writeText(result.token);
      toast.success('Token copied!');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          label: 'Approved'
        };
      case 'REJECTED':
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          label: 'Rejected'
        };
      case 'UNDER_REVIEW':
        return {
          icon: <Clock className="w-6 h-6" />,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          label: 'Under Review'
        };
      default:
        return {
          icon: <Clock className="w-6 h-6" />,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          label: 'Pending'
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-[var(--border)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-orange)]/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-[var(--accent-orange)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Track Verification
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Check your verification status
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Enter Verification Token
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] font-mono focus:border-[var(--accent-orange)] focus:outline-none"
                placeholder="SOCIO-VER-XXXXX"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-4 py-3 bg-[var(--accent-orange)] hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className={`flex items-center justify-center gap-2 p-4 rounded-xl ${getStatusConfig(result.status).bg}`}>
                <span className={getStatusConfig(result.status).color}>
                  {getStatusConfig(result.status).icon}
                </span>
                <span className={`font-bold ${getStatusConfig(result.status).color}`}>
                  {getStatusConfig(result.status).label}
                </span>
              </div>

              {/* Details */}
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase text-[var(--text-secondary)]">Company</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{result.companyName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase text-[var(--text-secondary)]">Token</span>
                  <div className="flex items-center gap-1">
                    <code className="text-xs font-mono text-[var(--accent-orange)]">{result.token}</code>
                    <button onClick={copyToken} className="p-1 hover:bg-[var(--bg-primary)] rounded">
                      <Copy className="w-3 h-3 text-[var(--text-secondary)]" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase text-[var(--text-secondary)]">Submitted</span>
                  <span className="text-sm text-[var(--text-primary)]">
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                {result.reviewedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-[var(--text-secondary)]">Reviewed</span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {new Date(result.reviewedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Admin Remarks (for rejected) */}
              {result.status === 'REJECTED' && result.adminRemarks && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <p className="text-xs uppercase text-red-400 tracking-wider mb-1">Reason</p>
                  <p className="text-sm text-[var(--text-primary)]">{result.adminRemarks}</p>
                </div>
              )}

              {/* Success Message */}
              {result.status === 'APPROVED' && (
                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl text-center">
                  <p className="text-sm text-green-600">
                    🎉 Your organization is verified! You can now post jobs on SocioSports.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl font-medium transition-colors border border-[var(--border)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackVerificationModal;
