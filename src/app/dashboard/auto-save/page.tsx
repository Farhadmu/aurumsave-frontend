'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../lib/language-context';
import { Badge } from '../../../components/ui/Badge';
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
} from 'lucide-react';

interface AutoSavePlan {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  amountBdt: number;
  accumulatedGrams: number;
  nextDebitDate: string;
  status: 'active' | 'paused';
  paymentMethod: string;
}

export default function AutoSavePage() {
  const { language, toLocalizedDigits, formatLocalizedBDT, formatLocalizedGold } = useLanguage();

  const [plans, setPlans] = useState<AutoSavePlan[]>([
    {
      id: 'SIP-1001',
      title: language === 'bn' ? 'মাসিক সার্বভৌম স্বর্ণ কিস্তি' : 'Monthly Sovereign Gold SIP',
      frequency: 'monthly',
      amountBdt: 5000,
      accumulatedGrams: 2.45,
      nextDebitDate: '2026-11-01',
      status: 'active',
      paymentMethod: 'bKash (01700-XXXXXX)',
    },
    {
      id: 'SIP-1002',
      title: language === 'bn' ? 'সাপ্তাহিক ক্ষুদ্র স্বর্ণ সঞ্চয়' : 'Weekly Micro-Gold Savings',
      frequency: 'weekly',
      amountBdt: 1200,
      accumulatedGrams: 0.89,
      nextDebitDate: '2026-10-21',
      status: 'active',
      paymentMethod: 'Nagad (01800-XXXXXX)',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [newAmountBdt, setNewAmountBdt] = useState<number>(3000);
  const [newPaymentMethod, setNewPaymentMethod] = useState('bKash');
  const [consentChecked, setConsentChecked] = useState(false);

  const togglePlanStatus = (id: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p,
      ),
    );
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !consentChecked) return;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (newFrequency === 'daily' ? 1 : newFrequency === 'weekly' ? 7 : 30));

    const newPlan: AutoSavePlan = {
      id: `SIP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle.trim(),
      frequency: newFrequency,
      amountBdt: Number(newAmountBdt),
      accumulatedGrams: 0,
      nextDebitDate: nextDate.toISOString().split('T')[0],
      status: 'active',
      paymentMethod: `${newPaymentMethod} Autodebit`,
    };

    setPlans((prev) => [newPlan, ...prev]);
    setShowModal(false);
    setNewTitle('');
    setConsentChecked(false);
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
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-aurum-gold hover:brightness-110 text-aurum-midnight text-xs font-bold transition-all shadow-gold-glow"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{language === 'bn' ? 'নতুন অটোসেভ প্ল্যান তৈরি করুন' : 'Create AutoSave Plan'}</span>
        </button>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 sm:p-7 rounded-3xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all shadow-card-luxury space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim block">
                  {plan.id} • {plan.frequency.toUpperCase()}
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
                  {formatLocalizedBDT(plan.amountBdt)}
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
                  {formatLocalizedGold(plan.accumulatedGrams)}
                </span>
                <span className="text-[10px] text-aurum-text-dim">
                  ≈ {toLocalizedDigits(Number((plan.accumulatedGrams / 11.664).toFixed(3)))} {language === 'bn' ? 'ভরি' : 'Bhori'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-aurum-text-muted pt-1">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-aurum-gold" />
                <span>
                  {language === 'bn' ? 'পরবর্তী কিস্তির তারিখ: ' : 'Next Debit: '}
                  <strong className="text-aurum-text font-mono">{plan.nextDebitDate}</strong>
                </span>
              </span>
              <span className="text-[11px] font-mono text-aurum-text-dim">
                {plan.paymentMethod}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-2 border-t border-aurum-border/60">
              <button
                onClick={() => togglePlanStatus(plan.id)}
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
                onClick={() => deletePlan(plan.id)}
                className="p-2 rounded-xl bg-aurum-surface hover:bg-rose-950/40 border border-aurum-border text-aurum-text-muted hover:text-rose-400 transition-all"
                title="Cancel Plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Operational Staging Notice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-aurum-surface/40 border border-aurum-border/60 text-xs text-aurum-text-muted flex items-start space-x-3">
        <Shield className="w-4 h-4 text-aurum-gold shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-aurum-text block mb-0.5">
            {language === 'bn' ? 'এমএফএস অটো-ডেবিট রেগুলেশন ও স্বচ্ছতা' : 'MFS Auto-Debit Standing Mandate'}
          </strong>
          {language === 'bn'
            ? 'বাংলাদেশ ব্যাংক ও এমএফএস নিয়মানুযায়ী প্রতিটি অটোসেভ কিস্তির পূর্বে আপনার ফোনে এসএমএস নোটিফিকেশন প্রদান করা হয়। আপনি যেকোনো সময় কোনো পেনাল্টি ছাড়াই প্ল্যানটি বাতিল বা স্থগিত করতে পারেন।'
            : 'Per Bangladesh Bank and MFS regulations, automated debits require an authorized recurring token. You can pause or cancel recurring plans at any time with zero penalty.'}
        </div>
      </div>

      {/* Create AutoSave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-aurum-card border border-aurum-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-aurum-border">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center">
                  <Repeat className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-aurum-text font-serif-luxury">
                  {language === 'bn' ? 'নতুন অটোসেভ প্ল্যান কনফিগার' : 'New AutoSave SIP Plan'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-aurum-text-muted hover:text-aurum-text p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                  {language === 'bn' ? 'প্ল্যানের শিরোনাম' : 'Plan Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'যেমন: সন্তানের ভবিষ্যৎ স্বর্ণ সঞ্চয়' : 'e.g. Retirement Gold Reserve'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border focus:border-aurum-gold text-aurum-text text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                    {language === 'bn' ? 'কিস্তির সময়কাল' : 'Frequency'}
                  </label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-sm outline-none"
                  >
                    <option value="monthly">{language === 'bn' ? 'প্রতি মাসে' : 'Monthly'}</option>
                    <option value="weekly">{language === 'bn' ? 'প্রতি সপ্তাহে' : 'Weekly'}</option>
                    <option value="daily">{language === 'bn' ? 'প্রতি দিন (মাইক্রো)' : 'Daily Micro'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                    {language === 'bn' ? 'কিস্তির পরিমাণ (টাকা)' : 'Amount (BDT)'}
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={newAmountBdt}
                    onChange={(e) => setNewAmountBdt(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                  {language === 'bn' ? 'পেমেন্ট চ্যানেল' : 'Payment Method'}
                </label>
                <select
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-sm outline-none"
                >
                  <option value="bKash">bKash MFS Auto-Mandate</option>
                  <option value="Nagad">Nagad Direct Debit</option>
                  <option value="Card">Bangladeshi Visa / Mastercard</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-aurum-surface border border-aurum-border flex items-start space-x-2 text-xs">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 accent-aurum-gold cursor-pointer"
                />
                <label htmlFor="consent" className="text-aurum-text-muted leading-tight cursor-pointer">
                  {language === 'bn'
                    ? 'আমি নির্দিষ্ট তারিখে উল্লেখিত পরিমাণ টাকা স্বয়ংক্রিয়ভাবে কেটে ২৪ ক্যারেট খাঁটি স্বর্ণ ক্রয়ের সম্মতি প্রদান করছি।'
                    : 'I consent to scheduled recurring debits to purchase 24K allocated gold bullion at live benchmark rates.'}
                </label>
              </div>

              <button
                type="submit"
                disabled={!consentChecked || !newTitle.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-midnight font-bold text-sm shadow-gold-glow hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {language === 'bn' ? 'অটোসেভ প্ল্যান সক্রিয় করুন' : 'Activate AutoSave Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
