import { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, Clock, AlertCircle, Loader2, Copy, ArrowRight, FileText } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface EmployerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  existingVerification?: {
    token: string;
    status: string;
    adminRemarks?: string;
  } | null;
}

type Step = 'submit' | 'submitted' | 'approved' | 'rejected';

const EmployerVerificationModal: React.FC<EmployerVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  existingVerification
}) => {
  const [step, setStep] = useState<Step>('submit');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');

  // Form fields
  const [companyName, setCompanyName] = useState('');
  const [organizationEmail, setOrganizationEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [companyRegistrationFile, setCompanyRegistrationFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);

  // Check existing verification on mount
  useEffect(() => {
    if (existingVerification) {
      setToken(existingVerification.token);
      setStatus(existingVerification.status);
      if (existingVerification.adminRemarks) {
        setAdminRemarks(existingVerification.adminRemarks);
      }

      if (existingVerification.status === 'APPROVED') {
        setStep('approved');
      } else if (existingVerification.status === 'REJECTED') {
        setStep('rejected');
      } else {
        setStep('submitted');
      }
    } else {
      setStep('submit');
    }
  }, [existingVerification, isOpen]);

  const handleSubmit = async () => {
    if (!companyName || !organizationEmail || !contactNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!companyRegistrationFile && !idProofFile) {
      toast.error('Please upload at least one document');
      return;
    }

    const authToken = localStorage.getItem('token');
    if (!authToken) {
      toast.error('Please login to submit verification');
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll send data as JSON (in production, upload files first to get URLs)
      const response = await api.employerVerification.submit({
        companyName,
        organizationEmail,
        contactNumber,
        companyRegistrationUrl: companyRegistrationFile ? 'pending-upload' : undefined,
        gstCertificateUrl: gstFile ? 'pending-upload' : undefined,
        idProofUrl: idProofFile ? 'pending-upload' : undefined,
      } as any, authToken);

      setToken(response.token);
      setStatus('PENDING');
      setStep('submitted');
      toast.success('Verification submitted successfully!');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to submit verification');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast.success('Token copied to clipboard!');
  };

  const handlePostJob = () => {
    onVerified();
    onClose();
  };

  if (!isOpen) return null;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'submit' ? 'bg-[var(--accent-orange)] text-white' :
        ['submitted', 'approved'].includes(step) ? 'bg-green-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
        }`}>
        {['submitted', 'approved'].includes(step) ? <CheckCircle className="w-4 h-4" /> : '1'}
      </div>
      <div className={`w-12 h-1 rounded ${['submitted', 'approved', 'rejected'].includes(step) ? 'bg-green-500' : 'bg-[var(--bg-secondary)]'}`} />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'submitted' ? 'bg-[var(--accent-orange)] text-white' :
        step === 'approved' ? 'bg-green-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
        }`}>
        {step === 'approved' ? <CheckCircle className="w-4 h-4" /> : '2'}
      </div>
      <div className={`w-12 h-1 rounded ${step === 'approved' ? 'bg-green-500' : 'bg-[var(--bg-secondary)]'}`} />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'approved' ? 'bg-green-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
        }`}>
        3
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[var(--bg-primary)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl">
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
              {step === 'approved' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : step === 'rejected' ? (
                <AlertCircle className="w-6 h-6 text-red-500" />
              ) : (
                <FileText className="w-6 h-6 text-[var(--accent-orange)]" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {step === 'approved' ? '🎉 Verified!' :
                  step === 'rejected' ? 'Verification Declined' :
                    '🔒 Employer Verification'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {step === 'approved' ? 'You can now post jobs' :
                  step === 'rejected' ? 'Please review and resubmit' :
                    'Required to post jobs on SocioSports'}
              </p>
            </div>
          </div>
          {renderStepIndicator()}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 'submit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Company/Organization Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Organization Email *
                </label>
                <input
                  type="email"
                  value={organizationEmail}
                  onChange={(e) => setOrganizationEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                  placeholder="official@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                  placeholder="+91 7842983839"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Company Registration Certificate
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setCompanyRegistrationFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="company-reg"
                  />
                  <label
                    htmlFor="company-reg"
                    className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent-orange)] transition-colors"
                  >
                    <Upload className="w-5 h-5 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      {companyRegistrationFile ? companyRegistrationFile.name : 'Upload PDF or Image'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  GST Certificate (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setGstFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="gst-cert"
                  />
                  <label
                    htmlFor="gst-cert"
                    className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent-orange)] transition-colors"
                  >
                    <Upload className="w-5 h-5 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      {gstFile ? gstFile.name : 'Upload PDF or Image'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  ID Proof of Authorized Person
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setIdProofFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="id-proof"
                  />
                  <label
                    htmlFor="id-proof"
                    className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent-orange)] transition-colors"
                  >
                    <Upload className="w-5 h-5 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      {idProofFile ? idProofFile.name : 'Upload PDF or Image'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 'submitted' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-green-500" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Verification Submitted!
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  We'll review your documents within 2-3 business days.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border)]">
                <p className="text-xs uppercase text-[var(--text-secondary)] tracking-wider mb-2">
                  Your Tracking Token
                </p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-lg font-mono font-bold text-[var(--accent-orange)]">
                    {token}
                  </code>
                  <button
                    onClick={copyToken}
                    className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-[var(--text-secondary)]">Status:</span>
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 font-medium">
                  ⏳ PENDING
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)]">
                Save your tracking token to check status later on the Jobs page.
              </p>
            </div>
          )}

          {step === 'approved' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  🎉 You are Verified!
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Your organization has been verified. You can now post jobs and hire athletes/coaches on SocioSports.
                </p>
              </div>

              <button
                onClick={handlePostJob}
                className="w-full py-4 bg-[var(--accent-orange)] hover:bg-orange-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                Post Job Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'rejected' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Verification Declined
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Unfortunately, your verification request could not be approved.
                </p>
              </div>

              {adminRemarks && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-left">
                  <p className="text-xs uppercase text-red-400 tracking-wider mb-1">Reason</p>
                  <p className="text-sm text-[var(--text-primary)]">{adminRemarks}</p>
                </div>
              )}

              <button
                onClick={() => {
                  setStep('submit');
                  setToken('');
                  setStatus('');
                  setAdminRemarks('');
                }}
                className="w-full py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl font-medium transition-colors border border-[var(--border)]"
              >
                Resubmit Verification
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'submit' && (
          <div className="p-6 border-t border-[var(--border)]">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-[var(--accent-orange)] hover:bg-orange-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Submit for Verification
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 'submitted' && (
          <div className="p-6 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl font-medium transition-colors border border-[var(--border)]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerVerificationModal;
