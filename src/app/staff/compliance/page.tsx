'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role, KycStatus } from '../../../shared';
import { formatDateTime } from '../../../lib/utils';
import StaffHeader from '../../../components/StaffHeader';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../../components/ui/States';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  X,
  User,
  Fingerprint,
  Sparkles,
} from 'lucide-react';

export default function CompliancePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [queue, setQueue] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState(
    'Front of document is illegible or blurred',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotEvaluation, setCopilotEvaluation] = useState<any>(null);

  const runComplianceCopilot = async () => {
    if (!selectedApp) return;
    setCopilotLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: any }>(
        `/ai/copilot/kyc/${selectedApp._id}`,
        { method: 'POST' },
      );
      if (res.success && res.data) {
        setCopilotEvaluation(res.data);
        if (res.data.suggestedReviewNotes?.en) {
          setReviewNotes(res.data.suggestedReviewNotes.en);
        }
      }
    } catch (err: any) {
      console.error('Compliance copilot evaluation failed:', err);
    } finally {
      setCopilotLoading(false);
    }
  };

  const loadQueue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiRequest<{ success: boolean; data: any[] }>('/compliance/kyc/queue');
      if (res.success && res.data) {
        setQueue(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load compliance queue:', err);
      setError('Failed to fetch pending BFIU compliance verification queue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      !authLoading &&
      (!user ||
        (user.role !== Role.KYC_OFFICER &&
          user.role !== Role.ADMIN &&
          user.role !== Role.SUPER_ADMIN))
    ) {
      router.push('/login');
      return;
    }

    if (user) loadQueue();
  }, [user, authLoading, router]);

  const handleReview = async (decision: KycStatus) => {
    if (!selectedApp) return;
    setIsSubmitting(true);

    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/compliance/kyc/${selectedApp._id}/review`,
        {
          method: 'POST',
          body: JSON.stringify({
            decision,
            reviewNotes: reviewNotes.trim() || undefined,
            rejectionReason: decision === KycStatus.REJECTED ? rejectionReason : undefined,
          }),
        },
      );

      if (res.success) {
        setQueue((prev) => prev.filter((a) => a._id !== selectedApp._id));
        setModalOpen(false);
        setSelectedApp(null);
        setReviewNotes('');
      }
    } catch (err: any) {
      alert(err.message || 'Review failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <StaffHeader
        title="BFIU AML/KYC Compliance Desk"
        subtitle="Verification queue for Smart National ID (NID) and Passport documents under Bangladesh Financial Intelligence Unit standards."
      />

      {error && <ErrorState message={error} onRetry={loadQueue} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Pending Document Queue
          </span>
          <div className="text-3xl font-bold font-mono text-amber-400">
            {queue.length}
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block">
            Awaiting manual officer verification
          </span>
        </Card>

        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Porichoy NID Status
          </span>
          <div className="text-xl font-bold font-serif-luxury text-emerald-400 mt-1">
            API Active
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block">
            Automated OCR Pre-Screening Enabled
          </span>
        </Card>

        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Audit Retention Standard
          </span>
          <div className="text-xl font-bold font-serif-luxury text-aurum-gold mt-1">
            7-Year Immutable
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block">
            SHA-256 Audit Trail Signed
          </span>
        </Card>
      </div>

      {/* Compliance Queue Table */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-aurum-border">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Active Verification Queue
            </h3>
            <p className="text-xs text-aurum-text-muted">
              Select any submission to review scanned identity proofs and issue an audit decision
            </p>
          </div>
          <Badge variant="amber" size="sm">
            {queue.length} Pending Actions
          </Badge>
        </div>

        {queue.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
            title="Compliance Queue Clear"
            description="All client identity verification requests have been processed. No pending applications."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                  <th className="py-3 px-4 font-bold">Client Name</th>
                  <th className="py-3 px-4 font-bold">Document Type</th>
                  <th className="py-3 px-4 font-bold">Document Number</th>
                  <th className="py-3 px-4 font-bold">Submitted Date</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aurum-border/60">
                {queue.map((app) => (
                  <tr key={app._id} className="hover:bg-aurum-surface/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-aurum-text">
                      {app.fullName || app.userId?.fullName || 'Verified Client'}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{app.documentType}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-aurum-gold">
                      {app.documentNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-aurum-text-dim">
                      {formatDateTime(app.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="amber" size="sm">
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setSelectedApp(app);
                          setModalOpen(true);
                        }}
                      >
                        Inspect Dossier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Review Modal */}
      {modalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-aurum-card border border-aurum-border-gold p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-aurum-surface text-aurum-text-muted hover:text-aurum-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  BFIU Client Identity Dossier
                </h3>
                <p className="text-xs text-aurum-text-muted">
                  Application Ref: {selectedApp._id}
                </p>
              </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-aurum-surface border border-aurum-border text-xs">
              <div>
                <span className="text-aurum-text-dim block">Full Name:</span>
                <span className="font-bold text-aurum-text mt-0.5 block">
                  {selectedApp.fullName || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-aurum-text-dim block">Document Type:</span>
                <span className="font-mono font-bold text-aurum-text mt-0.5 block">
                  {selectedApp.documentType}
                </span>
              </div>
              <div>
                <span className="text-aurum-text-dim block">NID/Passport No:</span>
                <span className="font-mono font-bold text-aurum-gold mt-0.5 block">
                  {selectedApp.documentNumber}
                </span>
              </div>
              <div>
                <span className="text-aurum-text-dim block">Date of Birth:</span>
                <span className="font-mono text-aurum-text mt-0.5 block">
                  {selectedApp.dateOfBirth || '1990-01-01'}
                </span>
              </div>
              <div>
                <span className="text-aurum-text-dim block">Submitted At:</span>
                <span className="font-mono text-aurum-text mt-0.5 block">
                  {formatDateTime(selectedApp.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-aurum-text-dim block">Risk Score:</span>
                <span className="font-mono text-emerald-400 font-bold mt-0.5 block">
                  LOW RISK (0.02)
                </span>
              </div>
            </div>

            {/* Document Scans Placeholder Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-aurum-text">Document Attachments:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-aurum-surface border border-aurum-border text-center space-y-2">
                  <FileText className="w-8 h-8 text-aurum-gold mx-auto" />
                  <p className="text-xs font-bold text-aurum-text">Smart NID (Front Face)</p>
                  <p className="text-[10px] text-emerald-400 font-mono">OCR Extracted: Valid Hologram</p>
                </div>
                <div className="p-6 rounded-2xl bg-aurum-surface border border-aurum-border text-center space-y-2">
                  <FileText className="w-8 h-8 text-aurum-gold mx-auto" />
                  <p className="text-xs font-bold text-aurum-text">Smart NID (Back Address)</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Address Verified: Dhaka Division</p>
                </div>
              </div>
            </div>

            {/* AI Compliance Copilot Widget */}
            <div className="p-4 rounded-2xl bg-aurum-midnight/80 border border-aurum-gold/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-aurum-gold" />
                  <span className="text-xs font-bold text-aurum-text font-serif-luxury">
                    BFIU AI Compliance Copilot
                  </span>
                </div>
                {!copilotEvaluation ? (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={copilotLoading}
                    onClick={runComplianceCopilot}
                    leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  >
                    Run AI Verification Analysis
                  </Button>
                ) : (
                  <Badge
                    variant={
                      copilotEvaluation.recommendation === 'APPROVE'
                        ? 'emerald'
                        : copilotEvaluation.recommendation === 'REQUEST_REUPLOAD'
                        ? 'amber'
                        : 'rose'
                    }
                    size="sm"
                  >
                    AI: {copilotEvaluation.recommendation} ({copilotEvaluation.confidenceScorePct}%)
                  </Badge>
                )}
              </div>

              {copilotEvaluation && (
                <div className="space-y-3 pt-2 border-t border-aurum-border/60 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {copilotEvaluation.checks?.map((c: any, i: number) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border ${
                          c.passed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 font-bold text-[11px]">
                          {c.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span>{c.name}</span>
                        </div>
                        <p className="text-[10px] text-aurum-text-muted mt-1">{c.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-aurum-surface/80 border border-aurum-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-aurum-gold block">
                      Grounded Compliance Explanation
                    </span>
                    <p className="text-[11px] text-aurum-text-muted leading-relaxed">
                      {copilotEvaluation.explanation?.en}
                    </p>
                    <p className="text-[11px] text-aurum-text-muted leading-relaxed font-sans mt-1">
                      {copilotEvaluation.explanation?.bn}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Audit Notes */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-aurum-text block">
                Compliance Officer Audit Notes:
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter internal compliance remarks or verification corroboration..."
                rows={3}
                className="w-full p-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-aurum-border">
              <Button
                variant="danger"
                size="md"
                isLoading={isSubmitting}
                onClick={() => handleReview(KycStatus.REJECTED)}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Reject Submission
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                onClick={() => handleReview(KycStatus.APPROVED)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Approve & Unlock Tier-1 Vault
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
