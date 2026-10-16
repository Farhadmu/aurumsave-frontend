'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/language-context';
import { apiRequest } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Repeat,
  Plus,
  Calendar,
  Coins,
  Shield,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  CreditCard,
  RefreshCw,
} from 'lucide-react';

interface AutoSavePlan {
  _id?: string;
  planId: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  amountPoisha?: number;
  amountBdt?: number;
  accumulatedGoldMg?: number;
  nextDebitDate?: string;
  status: 'active' | 'paused' | 'cancelled';
  paymentMethod: string;
}

export default function AutoSavePage() {
  const { language, toLocalizedDigits, formatLocalizedBDT, formatLocalizedGold } = useLanguage();

  const [plans, setPlans] = useState<AutoSavePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [newAmountBdt, setNewAmountBdt] = useState<number>(3000);
  const [newPaymentMethod, setNewPaymentMethod] = useState('bKash');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; data: any[] }>('/goals/plans');
      if (res.success && Array.isArray(res.data)) {
        const normalized = res.data.map((p) => ({
          ...p,
          amountBdt: typeof p.amountBdt === 'number' ? p.amountBdt : (p.amountPoisha || 0) / 100,
        }));
        setPlans(normalized);
      } else {
        setPlans([]);
      }
    } catch (err: any) {
      console.error('Failed to load AutoSave plans:', err);
      setError('Unable to load recurring AutoSave SIP plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const togglePlanStatus = async (plan: AutoSavePlan) => {
    const nextStatus = plan.status === 'active' ? 'paused' : 'active';
    try {
      await apiRequest(`/goals/plans/${plan.planId || plan._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      await fetchPlans();
    } catch (err: any) {
      alert(err.message || 'Failed to update plan status');
    }
  };

  const deletePlan = async (plan: AutoSavePlan) => {
    if (!confirm('Are you sure you want to cancel this recurring gold savings plan?')) return;
    try {
      await apiRequest(`/goals/plans/${plan.planId || plan._id}`, {
        method: 'DELETE',
      });
      await fetchPlans();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel plan');
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !consentChecked) return;

    setIsSubmitting(true);
    try {
      const res = await apiRequest('/goals/plans', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle.trim(),
          frequency: newFrequency,
          amountBdt: Number(newAmountBdt),
          paymentMethod: `${newPaymentMethod} Autodebit`,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setNewTitle('');
        setConsentChecked(false);
        await fetchPlans();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create AutoSave plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-aurum-border/60">
        <div>
          <div className="flex items-center space-x-2 text-aurum-gold text-xs font-bold uppercase tracking-wider mb-1.5">
            <Repeat className="w-4 h-4" />
            <span>{language === 'bn' ? 'ধারাবাহিক সঞ্চয় স্কিম' : 'Systematic Gold Plan (SIP)'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-text">
            {language === 'bn' ? 'অটোসেভ রিকারিং সঞ্চয় প্ল্যান' : 'AutoSave Recurring Gold Plans'}
          </h1>
          <p className="text-xs sm:text-sm text-aurum-text-muted mt-1 max-w-2xl">
            {language === 'bn'
              ? 'নিয়মিত দৈনিক, সাপ্তাহিক বা মাসিক কিস্তিতে স্বয়ংক্রিয়ভাবে খাঁটি ২৪ ক্যারেট স্বর্ণ সঞ্চয় করুন।'
              : 'Automate disciplined micro-gold accumulation with scheduled recurring debits.'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-aurum-gold hover:brightness-110 text-aurum-midnight text-xs font-bold transition-all shadow-gold-glow self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{language === 'bn' ? 'নতুন অটোসেভ প্ল্যান তৈরি করুন' : 'Create AutoSave Plan'}</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="text-base font-bold text-aurum-text">{error}</h4>
          <button
            onClick={fetchPlans}
            className="text-xs text-aurum-gold font-bold hover:underline inline-flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : plans.length === 0 ? (
        <div className="p-10 sm:p-14 rounded-3xl bg-aurum-card border border-aurum-border text-center space-y-4 shadow-card-luxury">
          <div className="w-14 h-14 rounded-2xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center mx-auto border border-aurum-gold/30">
            <Repeat className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              {language === 'bn' ? 'কোনো অটোসেভ প্ল্যান সক্রিয় নেই' : 'No Recurring AutoSave Plans Yet'}
            </h3>
            <p className="text-xs text-aurum-text-muted max-w-md mx-auto leading-relaxed">
              {language === 'bn'
                ? 'স্বয়ংক্রিয়ভাবে প্রতিদিন, প্রতি সপ্তাহে বা প্রতি মাসে নির্দিষ্ট কিস্তিতে খাঁটি স্বর্ণ জমা করুন।'
                : 'Automate micro-gold savings starting from ৳500 with automated debit mandates and zero making charges.'}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-xs shadow-gold-glow transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'bn' ? 'প্রথম প্ল্যান শুরু করুন' : 'Start Your First Plan'}</span>
          </button>
        </div>
      ) : (
        /* Plans List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const grams = (plan.accumulatedGoldMg || 0) / 1000;
            const bhori = Number((grams / 11.664).toFixed(3));
            return (
              <div
                key={plan.planId || plan._id}
                className="p-6 sm:p-7 rounded-3xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all shadow-card-luxury space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim block">
                      {plan.planId} • {plan.frequency.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-aurum-text mt-0.5">{plan.title}</h3>
                  </div>
                  <Badge variant={plan.status === 'active' ? 'emerald' : 'amber'} size="sm">
                    {plan.status === 'active' ? (
                      <span className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        <span>{language === 'bn' ? 'সক্রিয়' : 'Active'}</span>
                      </span>
                    ) : (
                      <span>{language === 'bn' ? 'স্থগিত' : 'Paused'}</span>
                    )}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-aurum-surface text-xs">
                  <div>
                    <span className="text-aurum-text-dim block text-[11px]">
                      {language === 'bn' ? 'নির্ধারিত কিস্তি' : 'Contribution Amount'}:
                    </span>
                    <span className="text-lg font-bold text-aurum-gold font-mono block mt-0.5">
                      {formatLocalizedBDT(plan.amountBdt || 0)}
                    </span>
                    <span className="text-[10px] text-aurum-text-muted capitalize">
                      {plan.frequency}
                    </span>
                  </div>

                  <div>
                    <span className="text-aurum-text-dim block text-[11px]">
                      {language === 'bn' ? 'মোট সংগৃহীত স্বর্ণ' : 'Gold Accumulated'}:
                    </span>
                    <span className="text-lg font-bold text-aurum-text font-mono block mt-0.5">
                      {formatLocalizedGold(grams)}
                    </span>
                    <span className="text-[10px] text-aurum-text-dim">
                      ≈ {toLocalizedDigits(bhori)} {language === 'bn' ? 'ভরি' : 'Bhori'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-aurum-text-muted pt-1">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-aurum-gold" />
                    <span>
                      {language === 'bn' ? 'পরবর্তী কিস্তির তারিখ: ' : 'Next Debit: '}
                      <strong className="text-aurum-text font-mono">
                        {plan.nextDebitDate ? new Date(plan.nextDebitDate).toLocaleDateString() : 'Scheduled'}
                      </strong>
                    </span>
                  </span>
                  <span className="text-[11px] font-mono text-aurum-text-dim">
                    {plan.paymentMethod}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2 border-t border-aurum-border/60">
                  <button
                    onClick={() => togglePlanStatus(plan)}
                    className="flex-1 py-2 rounded-xl bg-aurum-surface hover:bg-aurum-surface/80 border border-aurum-border text-xs font-bold text-aurum-text transition-all flex items-center justify-center space-x-1.5"
                  >
                    {plan.status === 'active' ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'bn' ? 'স্থগিত করুন' : 'Pause Plan'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'bn' ? 'পুনরায় চালু করুন' : 'Resume Plan'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deletePlan(plan)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                    title="Cancel Plan"
                    aria-label="Cancel Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aurum-midnight/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-aurum-card border border-aurum-border-gold rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-aurum-border pb-4">
              <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                {language === 'bn' ? 'নতুন অটোসেভ প্ল্যান কনফিগার করুন' : 'Configure AutoSave Plan'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-aurum-text-muted hover:text-aurum-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block mb-1.5">
                  {language === 'bn' ? 'প্ল্যানের নাম' : 'Plan Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Daughter Gold Trust"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-sm text-aurum-text focus:outline-none focus:border-aurum-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block mb-1.5">
                    {language === 'bn' ? 'কিস্তির মেয়াদ' : 'Debit Frequency'}
                  </label>
                  <select
                    value={newFrequency}
                    onChange={(e: any) => setNewFrequency(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-sm text-aurum-text focus:outline-none focus:border-aurum-gold"
                  >
                    <option value="daily">Daily (প্রতিদিন)</option>
                    <option value="weekly">Weekly (সাপ্তাহিক)</option>
                    <option value="monthly">Monthly (মাসিক)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block mb-1.5">
                    {language === 'bn' ? 'কিস্তির পরিমাণ (টাকা)' : 'Amount (BDT)'}
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={100}
                    required
                    value={newAmountBdt}
                    onChange={(e) => setNewAmountBdt(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-sm text-aurum-text font-mono focus:outline-none focus:border-aurum-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block mb-1.5">
                  {language === 'bn' ? 'পেমেন্ট গেটওয়ে' : 'Payment Method'}
                </label>
                <select
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-sm text-aurum-text focus:outline-none focus:border-aurum-gold"
                >
                  <option value="bKash">bKash MFS Direct Debit</option>
                  <option value="Nagad">Nagad MFS Direct Debit</option>
                  <option value="Rocket">Rocket DBBL Direct Debit</option>
                  <option value="Bank Card">Visa / Mastercard Autodebit</option>
                </select>
              </div>

              {/* Autodebit Consent */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 text-xs text-aurum-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded border-aurum-border text-aurum-gold focus:ring-aurum-gold"
                  />
                  <span>
                    {language === 'bn'
                      ? 'আমি AurumSave-কে নির্ধারিত দিনে উল্লেখিত পরিমাণ অর্থ ডেবিট করে ২৪K স্বর্ণ রূপান্তরের অনুমতি প্রদান করছি।'
                      : 'I authorize AurumSave to execute recurring debits for conversion into allocated 24K bullion.'}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-aurum-border/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-aurum-text-muted hover:text-aurum-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !consentChecked}
                  className="px-6 py-2.5 rounded-xl bg-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-xs shadow-gold-glow transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Plan...' : 'Confirm Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
