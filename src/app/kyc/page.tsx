'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { KycStatus, KycDocumentType } from '../../shared';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Fingerprint,
  Lock,
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
        setSuccessMsg(
          'Your identity documents have been submitted to compliance officers for manual review.',
        );
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
        <p className="text-xs text-aurum-text-muted">Checking compliance status...</p>
      </div>
    );
  }

  const currentStatus =
    statusData?.currentStatus || user?.kycStatus || KycStatus.NOT_SUBMITTED;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center space-x-2 mb-1.5">
          <Badge variant="emerald" size="sm">
            BFIU AML/CFT Standards
          </Badge>
          <span className="text-xs text-aurum-text-dim">• Sovereign Compliance</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
          Identity Verification (KYC)
        </h1>
        <p className="text-xs sm:text-sm text-aurum-text-muted mt-1 max-w-xl">
          Compliant with Bangladesh Financial Intelligence Unit (BFIU) guidelines to protect your physical bullion property rights.
        </p>
      </div>

      {/* Current Status Box */}
      <Card glow={currentStatus === KycStatus.APPROVED}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3.5 rounded-2xl shrink-0 ${
                currentStatus === KycStatus.APPROVED
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : currentStatus === KycStatus.PENDING_REVIEW
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-aurum-surface text-aurum-text-dim border border-aurum-border'
              }`}
            >
              {currentStatus === KycStatus.APPROVED ? (
                <ShieldCheck className="w-7 h-7" />
              ) : currentStatus === KycStatus.PENDING_REVIEW ? (
                <Clock className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-aurum-text-dim">
                Verification Tier
              </span>
              <h3 className="font-serif-luxury text-lg font-bold text-aurum-text">
                {currentStatus === KycStatus.APPROVED
                  ? 'Level 1 Verified (Full Physical Vault Privileges)'
                  : currentStatus === KycStatus.PENDING_REVIEW
                  ? 'Compliance Review In Progress'
                  : 'Unverified Tier (Action Required)'}
              </h3>
              <p className="text-xs text-aurum-text-muted mt-0.5">
                {currentStatus === KycStatus.APPROVED
                  ? 'Your identity is verified. You can withdraw physical gold bullion and trade without limits.'
                  : currentStatus === KycStatus.PENDING_REVIEW
                  ? 'Your submission is in the compliance queue. Review typically completes within 2 to 4 business hours.'
                  : 'Please submit your National ID (Smart NID) or Passport below.'}
              </p>
            </div>
          </div>

          <Badge
            variant={
              currentStatus === KycStatus.APPROVED
                ? 'emerald'
                : currentStatus === KycStatus.PENDING_REVIEW
                ? 'amber'
                : 'rose'
            }
            size="md"
          >
            {currentStatus}
          </Badge>
        </div>
      </Card>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {currentStatus !== KycStatus.APPROVED && currentStatus !== KycStatus.PENDING_REVIEW && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block mb-2">
                Identity Document Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIdType('SMART_NID')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    idType === 'SMART_NID'
                      ? 'bg-aurum-surface border-aurum-gold shadow-sm'
                      : 'bg-aurum-surface/40 border-aurum-border text-aurum-text-muted'
                  }`}
                >
                  <span className="font-bold text-sm text-aurum-text block">Smart NID</span>
                  <span className="text-[11px] text-aurum-text-dim">10 or 17 Digit National ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIdType('PASSPORT')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    idType === 'PASSPORT'
                      ? 'bg-aurum-surface border-aurum-gold shadow-sm'
                      : 'bg-aurum-surface/40 border-aurum-border text-aurum-text-muted'
                  }`}
                >
                  <span className="font-bold text-sm text-aurum-text block">Passport</span>
                  <span className="text-[11px] text-aurum-text-dim">Bangladesh E-Passport / MRP</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block mb-2">
                {idType === 'SMART_NID' ? 'Smart NID Number' : 'Passport Number'}
              </label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder={idType === 'SMART_NID' ? 'e.g. 1990269250000000' : 'e.g. A01234567'}
                className="w-full px-4 py-3.5 rounded-2xl bg-aurum-surface border border-aurum-border text-base font-mono font-bold text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60"
              />
            </div>

            {/* Document Scans Placeholder Upload Area */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block">
                Attach Document Scans
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl border-2 border-dashed border-aurum-border text-center space-y-2 bg-aurum-surface/30">
                  <Upload className="w-6 h-6 text-aurum-gold mx-auto" />
                  <p className="text-xs font-bold text-aurum-text">Front Face of Document</p>
                  <p className="text-[10px] text-aurum-text-dim">PNG, JPG or PDF up to 10MB</p>
                </div>
                <div className="p-6 rounded-2xl border-2 border-dashed border-aurum-border text-center space-y-2 bg-aurum-surface/30">
                  <Upload className="w-6 h-6 text-aurum-gold mx-auto" />
                  <p className="text-xs font-bold text-aurum-text">Back Face / Address</p>
                  <p className="text-[10px] text-aurum-text-dim">Clear readable scan or camera capture</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-sm"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit for BFIU Compliance Verification
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
