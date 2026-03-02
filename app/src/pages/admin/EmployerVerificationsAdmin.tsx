import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Clock, CheckCircle, XCircle, Eye,
  ChevronLeft, Search, Filter, Loader2, ExternalLink,
  FileText, Mail, Phone, Building2, Calendar
} from 'lucide-react';
import { api } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { toast } from 'react-hot-toast';

interface Verification {
  id: string;
  token: string;
  status: string;
  companyName: string;
  organizationEmail: string;
  contactNumber: string;
  companyRegistrationUrl?: string;
  gstCertificateUrl?: string;
  idProofUrl?: string;
  adminRemarks?: string;
  submittedAt: string;
  reviewedAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    isVerified: boolean;
  };
}

const EmployerVerificationsAdmin = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || '';

  const fetchVerifications = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await api.employerVerification.admin.getAll(
        token,
        statusFilter || undefined,
        page,
        pagination.limit
      );
      setVerifications(response.verifications);
      setPagination(prev => ({
        ...prev,
        page,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
      toast.error('Failed to load verifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications(1);
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this verification?')) return;

    setIsProcessing(true);
    try {
      await api.employerVerification.admin.approve(id, token);
      toast.success('Verification approved successfully');
      fetchVerifications(pagination.page);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to approve:', error);
      toast.error('Failed to approve verification');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason || rejectReason.trim().length < 10) {
      toast.error('Please provide a reason (at least 10 characters)');
      return;
    }

    setIsProcessing(true);
    try {
      await api.employerVerification.admin.reject(id, rejectReason, token);
      toast.success('Verification rejected');
      fetchVerifications(pagination.page);
      setShowModal(false);
      setRejectReason('');
    } catch (error) {
      console.error('Failed to reject:', error);
      toast.error('Failed to reject verification');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetUnderReview = async (id: string) => {
    try {
      await api.employerVerification.admin.setUnderReview(id, token);
      toast.success('Status updated to Under Review');
      fetchVerifications(pagination.page);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
            <Eye className="w-3 h-3" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const filteredVerifications = verifications.filter(v =>
    !searchQuery ||
    v.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[var(--accent-orange)]" />
                Employer Verifications
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Review and approve employer verification requests
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, token, or email..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-orange)]" />
            </div>
          ) : filteredVerifications.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheck className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">No verification requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--bg-primary)]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                      Company
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                      Token
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredVerifications.map((verification) => (
                    <tr key={verification.id} className="hover:bg-[var(--bg-primary)]/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[var(--text-secondary)]" />
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">
                              {verification.companyName || 'N/A'}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {verification.organizationEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <code className="text-xs font-mono text-[var(--accent-orange)]">
                          {verification.token}
                        </code>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-[var(--text-primary)]">{verification.user?.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{verification.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(verification.status)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                          <Calendar className="w-3 h-3" />
                          {new Date(verification.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {verification.status === 'PENDING' && (
                            <button
                              onClick={() => handleSetUnderReview(verification.id)}
                              className="px-3 py-1 text-xs bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                            >
                              Start Review
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedVerification(verification);
                              setShowModal(true);
                            }}
                            className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--text-secondary)]">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchVerifications(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchVerifications(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border)] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Verification Details
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectReason('');
                }}
                className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg"
              >
                <XCircle className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Status</span>
                {getStatusBadge(selectedVerification.status)}
              </div>

              {/* Company Info */}
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-3">
                <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--text-secondary)]">Company Name</p>
                    <p className="text-[var(--text-primary)]">{selectedVerification.companyName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Token</p>
                    <code className="text-[var(--accent-orange)]">{selectedVerification.token}</code>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Organization Email</p>
                    <p className="text-[var(--text-primary)] flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedVerification.organizationEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Contact Number</p>
                    <p className="text-[var(--text-primary)] flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedVerification.contactNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-3">
                <h3 className="font-medium text-[var(--text-primary)]">User Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--text-secondary)]">Name</p>
                    <p className="text-[var(--text-primary)]">{selectedVerification.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Email</p>
                    <p className="text-[var(--text-primary)]">{selectedVerification.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-3">
                <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </h3>
                <div className="space-y-2">
                  {selectedVerification.companyRegistrationUrl && (
                    <a
                      href={selectedVerification.companyRegistrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-[var(--bg-primary)]/80 transition-colors"
                    >
                      <span className="text-sm text-[var(--text-primary)]">Company Registration Certificate</span>
                      <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
                    </a>
                  )}
                  {selectedVerification.gstCertificateUrl && (
                    <a
                      href={selectedVerification.gstCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-[var(--bg-primary)]/80 transition-colors"
                    >
                      <span className="text-sm text-[var(--text-primary)]">GST Certificate</span>
                      <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
                    </a>
                  )}
                  {selectedVerification.idProofUrl && (
                    <a
                      href={selectedVerification.idProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-[var(--bg-primary)]/80 transition-colors"
                    >
                      <span className="text-sm text-[var(--text-primary)]">ID Proof</span>
                      <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
                    </a>
                  )}
                  {!selectedVerification.companyRegistrationUrl &&
                    !selectedVerification.gstCertificateUrl &&
                    !selectedVerification.idProofUrl && (
                      <p className="text-sm text-[var(--text-secondary)]">No documents uploaded</p>
                    )}
                </div>
              </div>

              {/* Admin Remarks (if rejected) */}
              {selectedVerification.adminRemarks && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <p className="text-xs uppercase text-red-400 tracking-wider mb-1">Rejection Reason</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedVerification.adminRemarks}</p>
                </div>
              )}

              {/* Reject Reason Input */}
              {selectedVerification.status !== 'APPROVED' && selectedVerification.status !== 'REJECTED' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Enter reason for rejection..."
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-red-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {selectedVerification.status !== 'APPROVED' && selectedVerification.status !== 'REJECTED' && (
              <div className="sticky bottom-0 bg-[var(--bg-primary)] border-t border-[var(--border)] p-4 flex gap-3">
                <button
                  onClick={() => handleReject(selectedVerification.id)}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Reject'}
                </button>
                <button
                  onClick={() => handleApprove(selectedVerification.id)}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Approve'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default EmployerVerificationsAdmin;
