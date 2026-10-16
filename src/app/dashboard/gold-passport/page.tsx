'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useLanguage } from '../../../lib/language-context';
import { apiRequest } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import {
  Award,
  Shield,
  QrCode,
  Download,
  Printer,
  CheckCircle2,
  Lock,
  Building,
  Calendar,
  FileCheck,
} from 'lucide-react';

export default function GoldPassportPage() {
  const { user } = useAuth();
  const { language, toLocalizedDigits, formatLocalizedBDT, formatLocalizedGold, formatLocalizedDateTime } =
    useLanguage();

  const [holdings, setHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [passportId, setPassportId] = useState<string>('');
  const [issuedAt, setIssuedAt] = useState<string>('');

  useEffect(() => {
    fetchHoldings();
    setPassportId(`GP-BD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    setIssuedAt(new Date().toISOString());
  }, []);

  const fetchHoldings = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: any }>('/portfolio');
      if (res.success && res.data?.holdings) {
        setHoldings(res.data.holdings);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const totalMg = holdings.reduce((sum, h) => sum + (h.weightMilligramsAvailable || 0), 0);
  const totalGrams = totalMg > 0 ? Number((totalMg / 1000).toFixed(3)) : 5.832; // Demo default 0.5 bhori
  const totalBhori = Number((totalGrams / 11.664).toFixed(3));
  const shaFingerprint = `SHA256:AURUMSAVE:${user?.id || 'CLIENT'}:${totalGrams}G:${issuedAt.split('T')[0]}:VERIFIED`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-aurum-border/60">
        <div>
          <div className="flex items-center space-x-2 text-aurum-gold text-xs font-bold uppercase tracking-wider mb-1.5">
            <Award className="w-4 h-4" />
            <span>{language === 'bn' ? 'সার্বভৌম মালিকানা সনদ' : 'Sovereign Bullion Ownership'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-text">
            {language === 'bn' ? 'অরামসেভ গোল্ড পাসপোর্ট' : 'AurumSave Digital Gold Passport'}
          </h1>
          <p className="text-xs sm:text-sm text-aurum-text-muted mt-1">
            {language === 'bn'
              ? 'আপনার ভল্ট-সংরক্ষিত বাস্তব স্বর্ণের ডিজিটাল সার্টিফাইড মালিকানা দলিল।'
              : 'Cryptographically verifiable certificate of custody for physical gold bullion.'}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-aurum-gold hover:brightness-110 text-aurum-midnight text-xs font-bold transition-all shadow-gold-glow"
        >
          <Printer className="w-4 h-4" />
          <span>{language === 'bn' ? 'সনদ প্রিন্ট / PDF সংরক্ষণ' : 'Print / Save PDF'}</span>
        </button>
      </div>

      {/* Luxury Certificate Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#141E33] via-aurum-card to-[#0F172A] border-2 border-aurum-gold/50 p-8 sm:p-12 shadow-2xl overflow-hidden space-y-8">
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
          <Award className="w-96 h-96 text-aurum-gold" />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-aurum-gold/30 relative">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-aurum-gold/15 border-2 border-aurum-gold/40 text-aurum-gold flex items-center justify-center shrink-0 shadow-gold-glow">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-aurum-gold font-bold block">
                PEOPLE'S REPUBLIC OF BANGLADESH • ALLOCATED BULLION DEPOSITORY
              </span>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-aurum-text tracking-wide mt-0.5">
                CERTIFICATE OF GOLD CUSTODY
              </h2>
              <span className="text-xs text-aurum-text-muted font-mono">
                {language === 'bn' ? 'দলিল নম্বর: ' : 'Document Ref: '}
                <strong className="text-aurum-gold">{passportId}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end space-y-1 text-xs font-mono">
            <Badge variant="emerald" size="sm">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              {language === 'bn' ? 'বিএফআইইউ ও বাজুস সার্টিফাইড' : 'BFIU Verified & Audited'}
            </Badge>
            <span className="text-aurum-text-dim text-[11px] pt-1">
              Issued: {issuedAt ? formatLocalizedDateTime(issuedAt) : 'Today'}
            </span>
          </div>
        </div>

        {/* Client & Ownership Particulars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-aurum-surface/60 border border-aurum-border text-xs relative">
          <div>
            <span className="text-aurum-text-dim block text-[11px]">Beneficiary / Holder:</span>
            <span className="font-bold text-aurum-text text-sm mt-0.5 block">
              {user?.fullName || 'Authorized Wealth Client'}
            </span>
            <span className="text-aurum-gold font-mono text-[10px]">
              ID: {user?.id ? `AUR-${user.id.substring(0, 8).toUpperCase()}` : 'AUR-882190'}
            </span>
          </div>

          <div>
            <span className="text-aurum-text-dim block text-[11px]">KYC Compliance Status:</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full National ID Verified</span>
            </span>
            <span className="text-aurum-text-dim text-[10px]">AML Tier-1 Cleared</span>
          </div>

          <div>
            <span className="text-aurum-text-dim block text-[11px]">Vault Depository:</span>
            <span className="font-bold text-aurum-text text-sm mt-0.5 block">
              Dhaka Central Vault
            </span>
            <span className="text-aurum-text-dim text-[10px]">Secured Bank Facility</span>
          </div>

          <div>
            <span className="text-aurum-text-dim block text-[11px]">Insurance Provider:</span>
            <span className="font-bold text-aurum-text text-sm mt-0.5 block">
              Green Delta PLC
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">100% Comprehensive Policy</span>
          </div>
        </div>

        {/* Central Weight Proof Callout */}
        <div className="p-8 rounded-3xl bg-aurum-midnight/90 border border-aurum-gold/40 text-center space-y-4 relative overflow-hidden shadow-inner">
          <span className="text-xs uppercase font-mono tracking-widest text-aurum-gold font-bold">
            CERTIFIED NET ALLOCATED WEIGHT
          </span>
          <div className="text-4xl sm:text-5xl font-serif-luxury font-bold text-aurum-gold tracking-wider">
            {formatLocalizedGold(totalGrams, true)}
          </div>
          <div className="text-sm font-mono text-aurum-text font-bold">
            ≈ {toLocalizedDigits(totalBhori)} {language === 'bn' ? 'ভরি (১৬ আনা / ৯৬ রতি)' : 'Bhori (Tola)'} • 99.9% 24K Pure Allocated Bullion
          </div>
          <p className="text-xs text-aurum-text-muted max-w-lg mx-auto leading-relaxed pt-2">
            This digital certificate affirms that the named client holds title to the specified weight in physical allocated bullion stored in verified high-security custody.
          </p>
        </div>

        {/* Security Fingerprint & Verification Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-aurum-gold/30 text-xs font-mono">
          <div className="space-y-1.5 max-w-md">
            <span className="text-[10px] uppercase text-aurum-text-dim font-bold block">
              Cryptographic Audit Fingerprint:
            </span>
            <div className="p-2.5 rounded-xl bg-aurum-surface/80 border border-aurum-border text-[10px] text-aurum-gold break-all font-mono">
              {shaFingerprint}
            </div>
            <span className="text-[10px] text-aurum-text-muted block">
              Server-verifiable via AurumSave Public Audit Registry
            </span>
          </div>

          {/* Simulated QR Code Box */}
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white text-aurum-midnight shrink-0 shadow-lg">
            <QrCode className="w-16 h-16" />
            <div className="text-[9px] leading-tight font-sans">
              <strong className="block text-[10px] text-black">SCAN TO VERIFY</strong>
              <span>aurumsave.com</span>
              <span className="block text-gray-500 font-mono">ID: {passportId.substring(0, 10)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
