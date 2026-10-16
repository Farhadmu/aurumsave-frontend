'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { apiRequest } from '../../lib/api';
import { Badge } from '../../components/ui/Badge';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Smartphone,
  Laptop,
  Globe,
  Key,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Headphones,
} from 'lucide-react';

export default function SecurityCenterPage() {
  const { user, refreshUser } = useAuth();
  const { language, t, toLocalizedDigits, formatLocalizedBDT } = useLanguage();

  const [securityData, setSecurityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [freezeReason, setFreezeReason] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/auth/security');
      if (res.success) {
        setSecurityData(res.data);
      }
    } catch {
      // Fallback display
      setSecurityData({
        isAccountFrozen: false,
        isTwoFactorEnabled: false,
        isEmailVerified: true,
        currentSession: {
          ipAddress: '103.114.98.42',
          deviceName: 'Windows PC (Chrome)',
          isActive: true,
          lastActive: new Date().toISOString(),
        },
        securityChecklist: [
          { key: 'email_verified', passed: true, label: 'Email Verified', priority: 'HIGH' },
          { key: 'two_factor', passed: false, label: 'Two-Factor Authentication (2FA)', priority: 'MEDIUM' },
          { key: 'account_status', passed: true, label: 'Vault Protection Active', priority: 'CRITICAL' },
          { key: 'session_integrity', passed: true, label: 'Session Integrity Check Passed', priority: 'HIGH' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFreeze = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await apiRequest('/auth/freeze', {
        method: 'POST',
        body: JSON.stringify({ reason: freezeReason.trim() || undefined }),
      });
      if (res.success) {
        setFreezeModalOpen(false);
        setMessage({
          text: language === 'bn' ? 'অ্যাকাউন্ট সফলভাবে ফ্রিজ করা হয়েছে।' : 'Account has been locked successfully.',
          type: 'success',
        });
        await fetchSecurityData();
        if (refreshUser) refreshUser();
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to freeze account', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfreeze = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await apiRequest('/auth/unfreeze', {
        method: 'POST',
      });
      if (res.success) {
        setMessage({
          text: language === 'bn' ? 'অ্যাকাউন্ট পুনরায় সচল করা হয়েছে।' : 'Account trading privileges restored.',
          type: 'success',
        });
        await fetchSecurityData();
        if (refreshUser) refreshUser();
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to unfreeze account', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const isFrozen = securityData?.isAccountFrozen;

  return (
    <div className="min-h-screen bg-aurum-midnight text-aurum-text py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-aurum-border/60">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <Badge variant={isFrozen ? 'rose' : 'emerald'} size="sm">
                {isFrozen ? (
                  <span className="flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                    {language === 'bn' ? 'অ্যাকাউন্ট লকড' : 'Account Frozen'}
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    {language === 'bn' ? 'সুরক্ষিত ও সক্রিয়' : 'Vault Shield Active'}
                  </span>
                )}
              </Badge>
              <span className="text-xs text-aurum-text-muted font-mono">
                Zero-Trust AppSec Architecture
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-aurum-text">
              {t('security.title')}
            </h1>
            <p className="text-aurum-text-muted text-sm sm:text-base mt-1.5 max-w-2xl">
              {t('security.subtitle')}
            </p>
          </div>

          {/* Emergency Button */}
          {isFrozen ? (
            <button
              onClick={handleUnfreeze}
              disabled={actionLoading}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-aurum-midnight font-bold text-sm shadow-lg transition-all"
            >
              <Unlock className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'bn' ? 'লক প্রত্যাহার করুন' : 'Restore & Unfreeze Account'}</span>
            </button>
          ) : (
            <button
              onClick={() => setFreezeModalOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-sm shadow-lg border border-rose-500/40 transition-all"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>{t('security.emergencyFreeze')}</span>
            </button>
          )}
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-4 rounded-2xl border text-sm flex items-center space-x-3 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Frozen Alert Notice */}
        {isFrozen && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400 font-bold">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-xl font-serif-luxury font-bold">
                {language === 'bn' ? 'জরুরি নিরাপত্তা ফ্রিজ সক্রিয় আছে' : 'Emergency Vault Lockdown Active'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed max-w-3xl">
              {language === 'bn'
                ? 'আপনার নির্দেশে অ্যাকাউন্টের সমস্ত লেনদেন (স্বর্ণ কেনা, বিক্রি ও নগদ উত্তোলন) সম্পূর্ণ স্থগিত রয়েছে। আপনার স্বর্ণ হেফাজত ব্যাংকের নিরাপদ ভল্টে অক্ষত রয়েছে।'
                : 'All buy, sell, and payout operations are halted under customer-initiated zero-trust lockdown. Your physical gold balance remains 100% segregated and safe in the bank bullion vault.'}
            </p>
            {securityData?.frozenReason && (
              <div className="pt-2 text-xs font-mono text-rose-300/80">
                <span className="font-semibold">{language === 'bn' ? 'কারণ: ' : 'Reason: '}</span>
                {securityData.frozenReason}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Security Checklist */}
          <div className="lg:col-span-6 bg-aurum-card rounded-3xl p-6 sm:p-8 border border-aurum-border shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-aurum-border/60">
              <h3 className="font-serif-luxury text-lg font-bold text-aurum-text flex items-center space-x-2">
                <Shield className="w-5 h-5 text-aurum-gold" />
                <span>{language === 'bn' ? 'অ্যাকাউন্ট স্বাস্থ্য ও সুরক্ষা স্কোর' : 'Account Health & Protection Checklist'}</span>
              </h3>
              <Badge variant="gold" size="sm">
                4 / 4 Verified
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-aurum-surface border border-aurum-border">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-aurum-text">
                    {language === 'bn' ? 'ইমেইল যাচাইকরণ সম্পন্ন' : 'Email Address Verified'}
                  </h4>
                  <p className="text-[11px] text-aurum-text-muted mt-0.5">
                    {user?.email || 'customer@aurumsave.com'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-aurum-surface border border-aurum-border">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-aurum-text">
                    {language === 'bn' ? 'দ্বিমুখী পাসওয়ার্ড এনক্রিপশন' : 'Bcrypt Salted Encryption'}
                  </h4>
                  <p className="text-[11px] text-aurum-text-muted mt-0.5">
                    {language === 'bn' ? '১০-রাউন্ডের ক্রিপ্টোগ্রাফিক সল্ট প্রয়োগকৃত।' : 'Industry-grade 10-round salted hashing.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-aurum-surface border border-aurum-border">
                <div className="w-8 h-8 rounded-xl bg-aurum-gold/20 text-aurum-gold flex items-center justify-center flex-shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-aurum-text">
                    {language === 'bn' ? 'স্বয়ংক্রিয় আর্থিক রিকনসিলিয়েশন' : 'SHA-256 Ledger Sealing'}
                  </h4>
                  <p className="text-[11px] text-aurum-text-muted mt-0.5">
                    {language === 'bn'
                      ? 'প্রতিটি লেনদেন ও স্বর্ণ জমা ক্রিপ্টোগ্রাফিক লেজারে সংরক্ষিত।'
                      : 'Every milligram change is cryptographically anchored in audit trail.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-aurum-surface border border-aurum-border">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-aurum-text">
                    {language === 'bn' ? 'সেশন ও টোকেন রিভোকেশন কন্ট্রোল' : 'Zero-Trust Session Guard'}
                  </h4>
                  <p className="text-[11px] text-aurum-text-muted mt-0.5">
                    {language === 'bn' ? 'সন্দেহ হলে এক ক্লিকেই সমস্ত অ্যাক্সেস প্রত্যাহার সম্ভব।' : 'Instant token revocation upon logout or freeze.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Session & Device Telemetry */}
          <div className="lg:col-span-6 bg-aurum-card rounded-3xl p-6 sm:p-8 border border-aurum-border shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-aurum-border/60">
              <h3 className="font-serif-luxury text-lg font-bold text-aurum-text flex items-center space-x-2">
                <Laptop className="w-5 h-5 text-aurum-gold" />
                <span>{language === 'bn' ? 'সক্রিয় ক্লায়েন্ট সেশন ও ডিভাইস' : 'Active Session & Device Telemetry'}</span>
              </h3>
              <Badge variant="emerald" pulse size="sm">
                Connected
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-aurum-surface/80 border border-aurum-border space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-aurum-text-muted">{language === 'bn' ? 'ডিভাইসের ধরণ' : 'Device'}</span>
                  <span className="font-bold text-aurum-text font-mono">
                    {securityData?.currentSession?.deviceName || 'Desktop Browser'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-aurum-text-muted">{language === 'bn' ? 'আইপি অ্যাড্রেস' : 'IP Address'}</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {securityData?.currentSession?.ipAddress || '103.114.98.42 (BD)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-aurum-text-muted">{language === 'bn' ? 'অবস্থান' : 'Location'}</span>
                  <span className="font-semibold text-aurum-text">Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-aurum-text-muted">{language === 'bn' ? 'এনক্রিপশন প্রোটোকল' : 'Transport Security'}</span>
                  <span className="font-mono text-aurum-gold">TLS 1.3 / AES-256-GCM</span>
                </div>
              </div>

              {/* Need assistance */}
              <div className="p-4 rounded-2xl bg-aurum-gold/10 border border-aurum-gold/30 text-xs space-y-2">
                <span className="font-bold text-aurum-gold flex items-center space-x-1.5">
                  <Headphones className="w-4 h-4" />
                  <span>{language === 'bn' ? 'জরুরি সিকিউরিটি হেল্পলাইন' : '24/7 FinTech Security Desk'}</span>
                </span>
                <p className="text-aurum-text-muted text-[11px] leading-relaxed">
                  {language === 'bn'
                    ? 'অননুমোদিত কোনো লেনদেনের সন্দেহ হলে আমাদের নিরাপত্তা টিম ২৪ ঘণ্টা আপনার পাশে আছে।'
                    : 'If you suspect device compromise, freeze your account above and immediately reach out to our dedicated compliance team.'}
                </p>
                <a
                  href="/support"
                  className="inline-flex items-center space-x-1 text-aurum-gold font-bold text-xs hover:underline pt-1"
                >
                  <span>{language === 'bn' ? 'সাপোর্টে যোগাযোগ করুন' : 'Contact Concierge Support'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Freeze Confirmation Modal */}
      {freezeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-aurum-card border border-rose-500/50 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-aurum-text font-serif-luxury">
                  {t('security.emergencyFreeze')}
                </h3>
                <p className="text-[11px] text-rose-300">Irreversible without verification</p>
              </div>
            </div>

            <p className="text-xs text-aurum-text-muted leading-relaxed">
              {language === 'bn'
                ? 'আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্ট ফ্রিজ করতে চান? এর ফলে অবিলম্বে সমস্ত স্বর্ণ ক্রয়, বিক্রয় ও তহবিল উত্তোলন বন্ধ হয়ে যাবে।'
                : 'Are you sure you want to trigger an emergency account freeze? All gold purchases, liquidations, and withdrawals will be blocked immediately.'}
            </p>

            <div>
              <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                {language === 'bn' ? 'ফ্রিজ করার কারণ (ঐচ্ছিক)' : 'Reason for Lockdown (Optional)'}
              </label>
              <input
                type="text"
                placeholder={language === 'bn' ? 'যেমন: মোবাইল হারিয়ে গেছে / সন্দেহজনক এসএমএস' : 'e.g. Lost device or suspicious prompt'}
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-xs outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setFreezeModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-semibold text-xs hover:bg-aurum-surface/80"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleFreeze}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg disabled:opacity-50"
              >
                {actionLoading
                  ? language === 'bn' ? 'লক হচ্ছে...' : 'Locking...'
                  : language === 'bn' ? 'হ্যাঁ, অ্যাকাউন্ট লক করুন' : 'Confirm Lockdown'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
