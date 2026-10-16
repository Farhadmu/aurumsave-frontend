'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role, KycStatus } from '@aurumsave/shared';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function CompliancePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [queue, setQueue] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Review modal state
  const [reviewDecision, setReviewDecision] = useState<KycStatus>(KycStatus.APPROVED);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Front of document is illegible or blurred');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    async function loadQueue() {
      try {
        const res = await apiRequest<{ success: boolean; data: any[] }>('/compliance/kyc/queue');
        if (res.success && res.data) {
          setQueue(res.data);
          if (res.data.length > 0) setSelectedApp(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load compliance queue:', err);
      } finally {
        setIsLoading(false);
      }
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
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-aurum-muted">Loading Compliance Verification Desk...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span>BFIU AML Compliance Desk</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
            KYC Identity Verification Queue
          </h1>
        </div>

        <div className="text-xs text-aurum-muted">
          Pending Verifications: <strong className="text-aurum-gold">{queue.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Queue List (Left) */}
        <div className="lg:col-span-5 rounded-3xl bg-aurum-card border border-aurum-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-aurum-border bg-aurum-surface text-xs font-semibold text-aurum-slate uppercase tracking-wider">
            Awaiting Officer Review ({queue.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-aurum-border/60">
            {queue.length === 0 ? (
              <div className="p-12 text-center text-xs text-aurum-muted space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p>Compliance queue is all clear! No pending identity submissions.</p>
              </div>
            ) : (
              queue.map((app) => (
                <button
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className={`w-full p-4 text-left hover:bg-aurum-surface/50 transition-colors block ${
                    selectedApp?._id === app._id ? 'bg-aurum-surface/80 border-l-4 border-aurum-gold' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-aurum-ivory text-xs">
                      {app.userId?.fullName || 'Customer'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400">
                      {app.idType}
                    </span>
                  </div>
                  <div className="text-[11px] text-aurum-slate font-mono">ID: {app.idNumber}</div>
                  <div className="flex items-center space-x-2 text-[10px] text-aurum-muted mt-1">
                    <span>{app.userId?.email}</span>
                    <span>•</span>
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detailed Application Inspector (Right) */}
        <div className="lg:col-span-7 rounded-3xl bg-aurum-card border border-aurum-border flex flex-col overflow-hidden">
          {selectedApp ? (
            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-aurum-border">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-aurum-ivory">
                      {selectedApp.userId?.fullName}
                    </h3>
                    <p className="text-xs text-aurum-muted font-mono mt-0.5">
                      Email: {selectedApp.userId?.email} | Phone: {selectedApp.userId?.phone || 'N/A'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                    Pending Decision
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-aurum-surface border border-aurum-border">
                    <span className="text-[10px] uppercase font-bold text-aurum-slate block">Document Type</span>
                    <span className="font-semibold text-aurum-ivory text-sm mt-0.5 block">{selectedApp.idType}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-aurum-surface border border-aurum-border">
                    <span className="text-[10px] uppercase font-bold text-aurum-slate block">ID / NID Number</span>
                    <span className="font-mono font-bold text-aurum-gold text-sm mt-0.5 block">{selectedApp.idNumber}</span>
                  </div>
                </div>

                {/* Secure Documents Vault Preview */}
                <div>
                  <h4 className="text-xs font-semibold text-aurum-muted uppercase tracking-wider mb-2">
                    Submitted Vault Documents ({selectedApp.documents?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedApp.documents?.map((doc: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-aurum-navy border border-aurum-border text-xs space-y-1">
                        <div className="flex items-center space-x-1.5 text-aurum-gold font-bold">
                          <FileText className="w-4 h-4" />
                          <span>{doc.docType}</span>
                        </div>
                        <p className="text-[10px] text-aurum-slate font-mono truncate">{doc.fileName}</p>
                        <span className="inline-block px-2 py-0.5 rounded bg-aurum-surface text-[10px] text-emerald-400 font-mono">
                          Vault Path Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Officer Notes Input */}
                <div>
                  <label className="text-xs font-semibold text-aurum-muted block mb-1">
                    Compliance Review Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter verification notes or audit observations..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-navy border border-aurum-border text-xs text-aurum-ivory focus:border-aurum-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-aurum-border flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => handleReview(KycStatus.REJECTED)}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs hover:bg-rose-500/20 transition-all"
                >
                  Reject Submission
                </button>

                <button
                  type="button"
                  onClick={() => handleReview(KycStatus.APPROVED)}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-aurum-navy font-bold text-xs shadow-sm transition-all"
                >
                  Approve Level-2 Verification
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-aurum-muted p-8 text-center">
              Select an application from the queue to inspect identity records
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
