'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useLanguage } from '../../../lib/language-context';
import { apiRequest } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import {
  Gift,
  Send,
  Inbox,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  UserCheck,
  RotateCcw,
} from 'lucide-react';

export default function GoldGiftingPage() {
  const { user } = useAuth();
  const {
    language,
    toLocalizedDigits,
    formatLocalizedBDT,
    formatLocalizedGold,
    formatLocalizedDateTime,
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<'send' | 'received' | 'sent'>('send');
  const [recipientIdentifier, setRecipientIdentifier] = useState('');
  const [recipientLookup, setRecipientLookup] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [weightGrams, setWeightGrams] = useState<number>(1.0);
  const [message, setMessage] = useState('');
  const [availableGoldMg, setAvailableGoldMg] = useState(5832);
  const [currentRateBdt, setCurrentRateBdt] = useState(11500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [receivedGifts, setReceivedGifts] = useState<any[]>([]);
  const [sentGifts, setSentGifts] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDataAndGifts();
  }, []);

  const fetchUserDataAndGifts = async () => {
    try {
      const [portfolioRes, priceRes, receivedRes, sentRes] = await Promise.all([
        apiRequest<{ success: boolean; data: any }>('/portfolio').catch(() => null),
        apiRequest<{ success: boolean; data: any }>('/prices/live').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/gifts/received').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/gifts/sent').catch(() => null),
      ]);

      if (portfolioRes?.success && portfolioRes.data?.holdings) {
        const k24 = portfolioRes.data.holdings.find((h: any) => h.purity === '24K');
        if (k24) setAvailableGoldMg(k24.weightMilligramsAvailable || 0);
      }

      if (priceRes?.success && priceRes.data) {
        const k24Rate = Array.isArray(priceRes.data)
          ? priceRes.data.find((p: any) => p.purity === '24K')
          : priceRes.data;
        if (k24Rate?.sellPricePerGramBdt) {
          setCurrentRateBdt(k24Rate.sellPricePerGramBdt);
        }
      }

      if (receivedRes?.success && Array.isArray(receivedRes.data)) {
        setReceivedGifts(receivedRes.data);
      }

      if (sentRes?.success && Array.isArray(sentRes.data)) {
        setSentGifts(sentRes.data);
      }
    } catch {
      // Fallback
    }
  };

  const handleLookup = async () => {
    if (!recipientIdentifier.trim()) return;
    setIsLookingUp(true);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; data: any }>('/gifts/lookup', {
        method: 'POST',
        body: JSON.stringify({ recipientIdentifier: recipientIdentifier.trim() }),
      });
      if (res.success) {
        setRecipientLookup(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Recipient lookup failed');
      setRecipientLookup(null);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientIdentifier.trim()) {
      setError('Please provide recipient phone number or email');
      return;
    }
    if (weightGrams <= 0) {
      setError('Please enter a valid gift weight');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await apiRequest<{ success: boolean; message: string; data: any }>('/gifts', {
        method: 'POST',
        body: JSON.stringify({
          recipientIdentifier: recipientIdentifier.trim(),
          weightGrams,
          message: message.trim(),
          purity: '24K',
        }),
      });

      if (res.success) {
        setSuccessMsg(
          language === 'bn'
            ? 'স্বর্ণ উপহার সফলভাবে পাঠানো হয়েছে এবং এসক্রোতে সংরক্ষিত রয়েছে!'
            : 'Gold gift sent successfully and safely held in vault escrow!',
        );
        setRecipientIdentifier('');
        setRecipientLookup(null);
        setMessage('');
        fetchUserDataAndGifts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send gold gift');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (giftId: string) => {
    setActionLoading(giftId);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(`/gifts/${giftId}/accept`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      if (res.success) {
        setSuccessMsg(res.message);
        fetchUserDataAndGifts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to accept gift');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (giftId: string) => {
    if (!confirm('Are you sure you want to decline this gift? It will return to the sender.')) return;
    setActionLoading(giftId);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(`/gifts/${giftId}/reject`, {
        method: 'POST',
      });
      if (res.success) {
        setSuccessMsg(res.message);
        fetchUserDataAndGifts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to decline gift');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (giftId: string) => {
    if (!confirm('Cancel this pending gift? The gold will immediately return to your vault.')) return;
    setActionLoading(giftId);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(`/gifts/${giftId}/cancel`, {
        method: 'POST',
      });
      if (res.success) {
        setSuccessMsg(res.message);
        fetchUserDataAndGifts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel gift');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingReceivedCount = receivedGifts.filter((g) => g.status === 'pending_acceptance').length;
  const valuationBdt = Math.round(weightGrams * currentRateBdt);
  const availableGrams = Number((availableGoldMg / 1000).toFixed(3));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-aurum-border/60">
        <div>
          <div className="flex items-center space-x-2 text-aurum-gold text-xs font-bold uppercase tracking-wider mb-1.5">
            <Gift className="w-4 h-4" />
            <span>{language === 'bn' ? 'পিয়ার-টু-পিয়ার উপহার' : 'P2P Sovereign Gold Gifting'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-text">
            {language === 'bn' ? 'ডিজিটাল স্বর্ণ উপহার' : 'Digital Gold Gifting'}
          </h1>
          <p className="text-xs sm:text-sm text-aurum-text-muted mt-1 max-w-2xl">
            {language === 'bn'
              ? 'প্রিয়জনকে ঈদ, বিবাহ বা বিশেষ দিনে ২৪ ক্যারেট খাঁটি স্বর্ণ উপহার দিন। প্রাপক গ্রহণ না করা পর্যন্ত ভল্ট এসক্রোতে সম্পূর্ণ সুরক্ষিত।'
              : 'Gift 24K allocated bullion to friends and family with automated 72-hour escrow guarantee.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-aurum-card border border-aurum-gold/30 shadow-gold-glow flex items-center space-x-4">
          <Sparkles className="w-8 h-8 text-aurum-gold shrink-0" />
          <div>
            <span className="text-[11px] text-aurum-text-dim block uppercase font-mono">
              {language === 'bn' ? 'উপহারযোগ্য স্বর্ণ' : 'Available to Gift'}
            </span>
            <span className="text-lg font-bold text-aurum-gold font-mono">
              {formatLocalizedGold(availableGrams, false)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-aurum-border/60 pb-3">
        <button
          onClick={() => setActiveTab('send')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'send'
              ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
              : 'text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface/50'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{language === 'bn' ? 'স্বর্ণ উপহার পাঠান' : 'Send Gold Gift'}</span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'received'
              ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
              : 'text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface/50'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>{language === 'bn' ? 'প্রাপ্ত উপহার' : 'Received Gifts'}</span>
          {pendingReceivedCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold animate-pulse">
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'sent'
              ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
              : 'text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{language === 'bn' ? 'প্রেরিত উপহার ইতিহাস' : 'Sent History'}</span>
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: SEND GOLD GIFT */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSendGift} className="p-6 sm:p-8 rounded-3xl bg-aurum-card border border-aurum-border space-y-6 shadow-xl">
              <h2 className="text-lg font-bold text-aurum-text flex items-center space-x-2">
                <Send className="w-5 h-5 text-aurum-gold" />
                <span>{language === 'bn' ? 'উপহারের বিবরণ দিন' : 'Gift Particulars'}</span>
              </h2>

              {/* Recipient Input & Lookup */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-aurum-text-muted block">
                  {language === 'bn' ? 'প্রাপকের ফোন নম্বর বা ইমেইল' : 'Recipient Phone Number or Email'}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 01712345678 or friend@example.com"
                    value={recipientIdentifier}
                    onChange={(e) => {
                      setRecipientIdentifier(e.target.value);
                      setRecipientLookup(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-xs sm:text-sm focus:border-aurum-gold focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={isLookingUp || !recipientIdentifier.trim()}
                    className="px-4 py-2.5 rounded-xl bg-aurum-surface hover:bg-aurum-surface/80 border border-aurum-border text-aurum-gold text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isLookingUp ? '...' : language === 'bn' ? 'যাচাই' : 'Verify'}</span>
                  </button>
                </div>

                {recipientLookup && (
                  <div className="p-3.5 rounded-xl bg-aurum-surface/80 border border-aurum-gold/40 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-aurum-text block">
                          {recipientLookup.maskedName || 'Verified Recipient'}
                        </span>
                        <span className="text-[11px] text-aurum-text-dim font-mono">
                          {recipientLookup.maskedPhone || recipientLookup.maskedEmail}
                        </span>
                      </div>
                    </div>
                    {recipientLookup.kycVerified && (
                      <Badge variant="emerald" size="sm">
                        KYC Cleared
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Weight Presets */}
              <div className="space-y-2.5">
                <label className="text-xs font-medium text-aurum-text-muted block">
                  {language === 'bn' ? 'স্বর্ণের পরিমাণ নির্বাচন করুন' : 'Select Gold Weight'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[0.5, 1.0, 2.5, 5.0, 11.664].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setWeightGrams(g)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                        weightGrams === g
                          ? 'bg-aurum-gold text-aurum-midnight border-aurum-gold shadow-gold-glow'
                          : 'bg-aurum-surface text-aurum-text hover:border-aurum-gold/40 border-aurum-border'
                      }`}
                    >
                      {g === 11.664 ? (language === 'bn' ? '১ ভরি' : '1 Bhori') : `${g}g`}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-xs sm:text-sm font-mono focus:border-aurum-gold focus:outline-none"
                    placeholder="Custom weight in grams"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-aurum-text-muted block">
                  {language === 'bn' ? 'উপহার শুভেচ্ছা বার্তা (ঐচ্ছিক)' : 'Luxury Greeting Message (Optional)'}
                </label>
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {[
                    'Eid Mubarak! 🌙',
                    'Shubho Bibaho! 💍',
                    'Happy Birthday! 🎂',
                    'Warmest Congratulations! 🎓',
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setMessage(preset)}
                      className="px-2.5 py-1 rounded-lg bg-aurum-surface text-aurum-text-dim text-[11px] hover:text-aurum-gold hover:border-aurum-gold/30 border border-aurum-border"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="May this physical gold bring timeless security and happiness..."
                  className="w-full px-4 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-xs sm:text-sm focus:border-aurum-gold focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || availableGrams < weightGrams}
                className="w-full py-3.5 rounded-xl bg-aurum-gold hover:brightness-110 text-aurum-midnight text-xs sm:text-sm font-bold transition-all shadow-gold-glow flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Gift className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Processing Escrow...'
                    : language === 'bn'
                    ? `${formatLocalizedGold(weightGrams, false)} উপহার পাঠান`
                    : `Send ${weightGrams}g Gold Gift`}
                </span>
              </button>
            </form>
          </div>

          {/* Right Summary Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#141E33] to-aurum-card border border-aurum-gold/40 shadow-xl space-y-5">
              <span className="text-[11px] uppercase font-mono tracking-wider text-aurum-gold font-bold block">
                {language === 'bn' ? 'উপহার মূল্যায়ন সারসংক্ষেপ' : 'Gift Valuation Preview'}
              </span>

              <div className="space-y-3 pt-1 border-t border-aurum-border/60 text-xs">
                <div className="flex justify-between items-center text-aurum-text-dim">
                  <span>Purity Grade:</span>
                  <span className="font-bold text-aurum-gold font-mono">24 Karat (99.9%)</span>
                </div>
                <div className="flex justify-between items-center text-aurum-text-dim">
                  <span>Gross Weight:</span>
                  <span className="font-bold text-aurum-text font-mono">{weightGrams} Grams</span>
                </div>
                <div className="flex justify-between items-center text-aurum-text-dim">
                  <span>Live Market Rate:</span>
                  <span className="font-mono text-aurum-text font-bold">
                    {formatLocalizedBDT(currentRateBdt)} /g
                  </span>
                </div>
                <div className="flex justify-between items-center text-aurum-text pt-2 border-t border-aurum-border/60 text-sm font-bold">
                  <span>Estimated Total:</span>
                  <span className="text-aurum-gold font-mono">
                    {formatLocalizedBDT(valuationBdt)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-aurum-surface/80 border border-aurum-border text-[11px] text-aurum-text-muted space-y-2 leading-relaxed">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>72-Hour Escrow Protection</span>
                </div>
                <p>
                  The gold is deducted from your available vault and safely held in escrow. If the recipient does not claim within 72 hours, 100% of the gold returns to your balance automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECEIVED GIFTS */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedGifts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-aurum-card border border-aurum-border text-aurum-text-dim space-y-3">
              <Inbox className="w-12 h-12 mx-auto text-aurum-gold/40" />
              <p className="text-sm">No incoming gold gifts received yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {receivedGifts.map((gift) => {
                const isPending = gift.status === 'pending_acceptance';
                const isAccepted = gift.status === 'accepted';
                const isExpired = gift.status === 'expired';

                return (
                  <div
                    key={gift.giftId}
                    className="p-6 rounded-3xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center font-bold">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-bold text-aurum-gold block">
                            {gift.giftId}
                          </span>
                          <span className="text-xs text-aurum-text-dim">
                            From: {gift.senderId?.fullName || 'AurumSave Wealth Client'}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={isAccepted ? 'emerald' : isPending ? 'amber' : 'slate'}
                        size="sm"
                      >
                        {gift.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="p-4 rounded-2xl bg-aurum-surface text-center space-y-1">
                      <div className="text-2xl font-serif-luxury font-bold text-aurum-gold font-mono">
                        {formatLocalizedGold(gift.weightMilligrams / 1000, true)}
                      </div>
                      <span className="text-xs text-aurum-text-muted font-mono block">
                        ≈ {formatLocalizedBDT(gift.valuationAtGiftPoisha / 100)} Market Value
                      </span>
                    </div>

                    {gift.message && (
                      <p className="text-xs italic text-aurum-text-muted bg-aurum-midnight/50 p-3 rounded-xl border border-aurum-border/40">
                        "{gift.message}"
                      </p>
                    )}

                    {isPending && (
                      <div className="flex items-center space-x-2 pt-2">
                        <button
                          onClick={() => handleAccept(gift.giftId)}
                          disabled={actionLoading === gift.giftId}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{actionLoading === gift.giftId ? 'Claiming...' : 'Accept to Vault'}</span>
                        </button>

                        <button
                          onClick={() => handleReject(gift.giftId)}
                          disabled={actionLoading === gift.giftId}
                          className="px-4 py-2.5 rounded-xl bg-aurum-surface hover:bg-aurum-surface/80 border border-aurum-border text-aurum-text-muted text-xs font-bold transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SENT GIFTS HISTORY */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentGifts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-aurum-card border border-aurum-border text-aurum-text-dim space-y-3">
              <Clock className="w-12 h-12 mx-auto text-aurum-gold/40" />
              <p className="text-sm">No gold gifts sent yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentGifts.map((gift) => {
                const isPending = gift.status === 'pending_acceptance';

                return (
                  <div
                    key={gift.giftId}
                    className="p-5 rounded-2xl bg-aurum-card border border-aurum-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center shrink-0">
                        <Send className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-aurum-gold">
                            {gift.giftId}
                          </span>
                          <Badge
                            variant={
                              gift.status === 'accepted'
                                ? 'emerald'
                                : gift.status === 'pending_acceptance'
                                ? 'amber'
                                : 'slate'
                            }
                            size="sm"
                          >
                            {gift.status.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-aurum-text-muted block mt-0.5">
                          Recipient: {gift.recipientPhone || gift.recipientEmail}
                        </span>
                        <span className="text-[11px] text-aurum-text-dim font-mono">
                          Sent: {formatLocalizedDateTime(gift.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-sm font-bold text-aurum-text font-mono block">
                          {formatLocalizedGold(gift.weightMilligrams / 1000, false)}
                        </span>
                        <span className="text-[11px] text-aurum-text-dim font-mono">
                          {formatLocalizedBDT(gift.valuationAtGiftPoisha / 100)}
                        </span>
                      </div>

                      {isPending && (
                        <button
                          onClick={() => handleCancel(gift.giftId)}
                          disabled={actionLoading === gift.giftId}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
