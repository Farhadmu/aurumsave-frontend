'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { KycStatus, KycDocumentType } from '@aurumsave/shared';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';

export default function KycPage() {
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [statusData, setStatusData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [idType, setIdType] = useState('SMART_NID');
  const [idNumber, setIdNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    async function loadStatus() {
      try {
        const res = await apiRequest<{ success: boolean; data: any }>('/kyc/status');
        if (res.success && res.data) {
          setStatusData(res.data);
        }
      } catch (err: any) {
        console.error('Failed to load KYC status:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) loadStatus();
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/kyc/applications', {
        method: 'POST',
        body: JSON.stringify({
          idType,
          idNumber,
          documents: [
            {
              docType: KycDocumentType.NID_FRONT,
              fileName: `${idNumber}_front.jpg`,
              fileSize: 1048576,
              mimeType: 'image/jpeg',
              securePath: `/secure_vault/kyc/${idType}_front.enc`,
            },
            {
              docType: KycDocumentType.NID_BACK,
              fileName: `${idNumber}_back.jpg`,
              fileSize: 1048576,
              mimeType: 'image/jpeg',
              securePath: `/secure_vault/kyc/${idType}_back.enc`,
            },
          ],
        }),
      });

      if (res.success) {
        setSuccessMsg('Your identity documents have been submitted to compliance officers for manual review.');
        await refreshUser();
        const updated = await apiRequest<{ success: boolean; data: any }>('/kyc/status');
        if (updated.success) setStatusData(updated.data);
      }
    } catch (err: any) {
      setError(err.message || 'KYC submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-aurum-muted">Checking compliance status...</p>
      </div>
    );
  }

  const currentStatus = statusData?.currentStatus || user?.kycStatus || KycStatus.NOT_SUBMITTED;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
          Identity Verification (KYC)
        </h1>
        <p className="text-xs sm:text-sm text-aurum-muted mt-1">
          Compliant with Bangladesh Financial Intelligence Unit (BFIU) AML guidelines.
        </p>
      </div>

      {/* Current Status Box */}
      <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`p-3 rounded-2xl ${
              currentStatus === KycStatus.APPROVED
                ? 'bg-emerald-500/10 text-emerald-400'
                : currentStatus === KycStatus.PENDING_REVIEW
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-aurum-surface text-aurum-muted'
            }`}
          >
            {currentStatus === KycStatus.APPROVED ? (
              <ShieldCheck className="w-6 h-6" />
            ) : currentStatus === KycStatus.PENDING_REVIEW ? (
              <Clock className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-aurum-slate">
              Verification Tier
            </span>
            <h3 className="font-serif text-lg font-bold text-aurum-ivory">
              {currentStatus === KycStatus.APPROVED
                ? 'Level 2 Verified (Full Vault Privileges)'
                : currentStatus === KycStatus.PENDING_REVIEW
                ? 'Compliance Review In Progress'
                : 'Unverified Tier (Action Required)'}
            </h3>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            currentStatus === KycStatus.APPROVED
              ? 'bg-emerald-500/20 text-emerald-400'
              : currentStatus === KycStatus.PENDING_REVIEW
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-rose-500/20 text-rose-400'
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {currentStatus === KycStatus.APPROVED ? (
        <div className="p-8 rounded-3xl bg-aurum-surface border border-aurum-border text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-aurum-ivory">
            Identity Verified Successfully
          </h3>
          <p className="text-xs text-aurum-muted max-w-md mx-auto">
            Your National Identity Card has been authenticated. You have unrestricted access to physical bullion delivery, unlimited savings limits, and priority liquidation.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 rounded-xl bg-aurum-gold text-aurum-navy font-bold text-xs shadow-gold-glow hover:brightness-110"
          >
            Go to Vault Dashboard
          </a>
        </div>
      ) : (
        /* Submission Form */
        <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border shadow-surface-subtle space-y-6">
          <h3 className="font-serif text-xl font-bold text-aurum-ivory">
            Submit Your Identity Document
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-aurum-muted block mb-2">
                Document Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'SMART_NID', label: 'Smart NID (10-Digit)' },
                  { id: 'PASSPORT', label: 'BD Passport' },
                  { id: 'DRIVING_LICENSE', label: 'Driving License' },
                ].map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setIdType(doc.id)}
                    className={`p-3 rounded-2xl border text-center text-xs font-semibold transition-all ${
                      idType === doc.id
                        ? 'bg-aurum-surface border-aurum-gold text-aurum-gold shadow-sm'
                        : 'bg-aurum-navy border-aurum-border text-aurum-muted'
                    }`}
                  >
                    {doc.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-aurum-muted block mb-1.5">
                ID / Document Number
              </label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. 19951234567890"
                className="w-full px-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm text-aurum-ivory focus:border-aurum-gold focus:outline-none font-mono"
              />
            </div>

            {/* Document Upload Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-aurum-navy border-2 border-dashed border-aurum-border hover:border-aurum-gold/40 text-center space-y-2 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-aurum-gold mx-auto" />
                <span className="text-xs font-semibold text-aurum-ivory block">
                  Front Side Photo
                </span>
                <span className="text-[10px] text-aurum-slate block">
                  JPEG, PNG or PDF (Max 5MB)
                </span>
                <span className="inline-block px-2 py-0.5 rounded bg-aurum-surface text-[10px] text-emerald-400 font-mono">
                  Ready for Upload
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-aurum-navy border-2 border-dashed border-aurum-border hover:border-aurum-gold/40 text-center space-y-2 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-aurum-gold mx-auto" />
                <span className="text-xs font-semibold text-aurum-ivory block">
                  Back Side Photo
                </span>
                <span className="text-[10px] text-aurum-slate block">
                  JPEG, PNG or PDF (Max 5MB)
                </span>
                <span className="inline-block px-2 py-0.5 rounded bg-aurum-surface text-[10px] text-emerald-400 font-mono">
                  Ready for Upload
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !idNumber.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-sm shadow-gold-glow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting for Compliance Review...</span>
              ) : (
                <>
                  <span>Submit for Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
