'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { apiRequest } from '../../lib/api';
import { Badge } from '../../components/ui/Badge';
import {
  Target,
  Plus,
  Coins,
  Calendar,
  TrendingUp,
  Sparkles,
  Shield,
  CheckCircle2,
  Clock,
  Heart,
  GraduationCap,
  Home,
  AlertCircle,
  HelpCircle,
  Calculator,
} from 'lucide-react';

interface Goal {
  _id: string;
  title: string;
  category: string;
  targetWeightGrams?: number;
  currentWeightGrams?: number;
  remainingWeightGrams?: number;
  targetAmountBdt?: number;
  currentAmountBdt?: number;
  indicativeCurrentValuationBdt?: number;
  remainingAmountBdt?: number;
  progressPct: number;
  targetDate?: string;
  suggestedMonthlyContributionBdt?: number;
  status: 'active' | 'completed' | 'paused' | 'archived';
  notes?: string;
}

export default function GoalsPage() {
  const { user } = useAuth();
  const { language, t, toLocalizedDigits, formatLocalizedBDT, formatLocalizedGold } = useLanguage();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Goal Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('marriage');
  const [newTargetGrams, setNewTargetGrams] = useState<number>(10);
  const [newTargetMonths, setNewTargetMonths] = useState<number>(12);
  const [newNotes, setNewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Interactive Calculator state
  const [calcGrams, setCalcGrams] = useState<number>(11.664); // 1 Bhori
  const [calcMonths, setCalcMonths] = useState<number>(12);
  const [calcResult, setCalcResult] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [advisorResult, setAdvisorResult] = useState<any>(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
    runCalculator(11.664, 12);
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/goals');
      if (res.success && Array.isArray(res.data)) {
        setGoals(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  const runCalculator = async (grams: number, months: number) => {
    setCalcLoading(true);
    setAdvisorLoading(true);
    try {
      const [res, advRes] = await Promise.all([
        apiRequest('/goals/calculate', {
          method: 'POST',
          body: JSON.stringify({
            targetWeightMg: Math.round(grams * 1000),
            targetMonths: months,
          }),
        }),
        apiRequest('/goals/advisor/simulate', {
          method: 'POST',
          body: JSON.stringify({
            targetGrams: grams,
            targetMonths: months,
            language: language,
          }),
        }).catch(() => null),
      ]);

      if (res.success) {
        setCalcResult(res.data);
      }
      if (advRes && advRes.success) {
        setAdvisorResult(advRes.data);
      }
    } catch {
      // Indicative client fallback
      const estRate = 12450;
      const totalBdt = Math.round(grams * estRate);
      setCalcResult({
        targetAmountBdt: totalBdt,
        targetWeightGrams: grams,
        indicativeGoldRatePerGram: estRate,
        schedules: {
          monthly: { amountBdt: Math.round(totalBdt / months), goldWeightGrams: Number((grams / months).toFixed(3)) },
          weekly: { amountBdt: Math.round(totalBdt / (months * 4.33)), goldWeightGrams: Number((grams / (months * 4.33)).toFixed(3)) },
          daily: { amountBdt: Math.round(totalBdt / (months * 30)), goldWeightGrams: Number((grams / (months * 30)).toFixed(3)) },
        },
      });
    } finally {
      setCalcLoading(false);
      setAdvisorLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    try {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + Number(newTargetMonths));

      const res = await apiRequest('/goals', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          targetWeightMg: Math.round(Number(newTargetGrams) * 1000),
          targetDate: targetDate.toISOString().split('T')[0],
          notes: newNotes.trim() || undefined,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setNewTitle('');
        setNewNotes('');
        await fetchGoals();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create goal');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marriage':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'education':
        return <GraduationCap className="w-5 h-5 text-sky-400" />;
      case 'family':
        return <Home className="w-5 h-5 text-emerald-400" />;
      case 'emergency':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return <Target className="w-5 h-5 text-aurum-gold" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    if (language === 'bn') {
      switch (category) {
        case 'marriage':
          return 'বিবাহ সঞ্চয়';
        case 'education':
          return 'সন্তানের উচ্চশিক্ষা';
        case 'family':
          return 'পারিবারিক সঞ্চয়';
        case 'emergency':
          return 'জরুরি রিজার্ভ';
        case 'hajj':
          return 'পবিত্র হজ্ব সঞ্চয়';
        default:
          return 'কাস্টম গোল';
      }
    }
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-aurum-midnight text-aurum-text py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-aurum-border/60">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <Badge variant="gold" size="sm">
                <Target className="w-3.5 h-3.5 mr-1" />
                {language === 'bn' ? 'স্মার্ট স্বর্ণ সঞ্চয়' : 'Disciplined Wealth Creation'}
              </Badge>
              <span className="text-xs text-aurum-text-muted font-mono">
                {language === 'bn' ? 'বাজুস ২৪K অ্যাফিলিয়েটেড' : '24K Allocated Bullion'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-aurum-text">
              {t('goals.title')}
            </h1>
            <p className="text-aurum-text-muted text-sm sm:text-base mt-1.5 max-w-2xl">
              {t('goals.subtitle')}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold text-aurum-midnight font-bold text-sm shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('goals.create')}</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-aurum-text-muted">
              <div className="w-10 h-10 border-2 border-aurum-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium">
                {language === 'bn' ? 'সঞ্চয় লক্ষ্যসমূহ লোড হচ্ছে...' : 'Fetching your smart savings goals...'}
              </p>
            </div>
          ) : goals.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-aurum-card/50 rounded-3xl border border-aurum-border p-8">
              <div className="w-16 h-16 rounded-2xl bg-aurum-gold/10 text-aurum-gold flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-aurum-text">
                {language === 'bn' ? 'কোনো সক্রিয় সঞ্চয় লক্ষ্য নেই' : 'No active savings goals found'}
              </h3>
              <p className="text-xs text-aurum-text-muted max-w-md mx-auto mt-2 mb-6">
                {language === 'bn'
                  ? 'বিবাহ, সন্তানের ভবিষ্যৎ বা জরুরি তহবিলের জন্য সুনির্দিষ্ট স্বর্ণের লক্ষ্য নির্ধারণ করে নিয়মিত সঞ্চয় শুরু করুন।'
                  : 'Start by creating your first gold target for weddings, family security, or long-term financial freedom.'}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 rounded-xl bg-aurum-gold text-aurum-midnight font-bold text-xs shadow-gold-glow hover:brightness-110"
              >
                {t('goals.create')}
              </button>
            </div>
          ) : (
            goals.map((g) => (
              <div
                key={g._id}
                className="bg-aurum-card rounded-2xl p-6 border border-aurum-border hover:border-aurum-gold/40 transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-aurum-surface border border-aurum-border flex items-center justify-center">
                      {getCategoryIcon(g.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-aurum-text group-hover:text-aurum-gold transition-colors">
                        {g.title}
                      </h4>
                      <p className="text-xs text-aurum-text-muted">{getCategoryLabel(g.category)}</p>
                    </div>
                  </div>
                  <Badge variant={g.status === 'completed' ? 'emerald' : 'gold'} size="sm">
                    {g.status === 'completed' ? (
                      <span className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{language === 'bn' ? 'অর্জিত' : 'Completed'}</span>
                      </span>
                    ) : (
                      `${toLocalizedDigits(g.progressPct)}%`
                    )}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-aurum-surface rounded-full h-2.5 overflow-hidden border border-aurum-border/60">
                    <div
                      className="bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(3, g.progressPct))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-aurum-gold font-bold">
                      {formatLocalizedGold(g.currentWeightGrams || 0)}
                    </span>
                    <span className="text-aurum-text-muted">
                      {language === 'bn' ? 'লক্ষ্য: ' : 'Target: '}
                      {formatLocalizedGold(g.targetWeightGrams || 0, true)}
                    </span>
                  </div>
                </div>

                {/* Metric Summary */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-aurum-border/60 text-xs">
                  <div>
                    <span className="text-aurum-text-dim block text-[11px]">
                      {language === 'bn' ? 'বর্তমান মূল্য' : 'Current Value'}
                    </span>
                    <span className="font-bold text-aurum-text font-mono">
                      {formatLocalizedBDT(g.indicativeCurrentValuationBdt || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-aurum-text-dim block text-[11px]">
                      {language === 'bn' ? 'অবশিষ্ট পরিমাণ' : 'Remaining'}
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {formatLocalizedGold(g.remainingWeightGrams || 0)}
                    </span>
                  </div>
                </div>

                {/* Action Link */}
                <a
                  href="/trade"
                  className="w-full text-center py-2.5 rounded-xl bg-aurum-surface hover:bg-aurum-gold hover:text-aurum-midnight text-xs font-bold text-aurum-text border border-aurum-border/80 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'এই লক্ষ্যে স্বর্ণ জমা করুন' : 'Allocate Gold to Goal'}</span>
                </a>
              </div>
            ))
          )}
        </div>

        {/* Interactive Savings Schedule Simulator */}
        <div className="bg-aurum-card rounded-3xl p-6 sm:p-8 border border-aurum-border shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-aurum-border/60">
            <div>
              <div className="flex items-center space-x-2 text-aurum-gold text-xs font-bold uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>{language === 'bn' ? 'ইন্টারেক্টিভ ক্যালকুলেটর' : 'Interactive Savings Simulator'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-aurum-text">
                {t('goals.calculator')}
              </h2>
            </div>
            <div className="text-xs text-aurum-text-muted max-w-sm">
              {language === 'bn'
                ? 'বর্তমান বাজুস রেট ও আপনার সময়সীমা অনুযায়ী প্রয়োজনীয় মাসিক বা সাপ্তাহিক কিস্তি দেখুন।'
                : 'Project your required periodic gold contributions based on live verified benchmark rates.'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-aurum-text">
                    {language === 'bn' ? 'টার্গেট স্বর্ণের ওজন' : 'Target Gold Weight'}:
                  </span>
                  <span className="text-aurum-gold font-mono">
                    {formatLocalizedGold(calcGrams, true)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={calcGrams}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCalcGrams(val);
                    runCalculator(val, calcMonths);
                  }}
                  className="w-full accent-aurum-gold cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-aurum-text-dim mt-1 font-mono">
                  <span>1g</span>
                  <span>11.66g (1 ভরি)</span>
                  <span>25g</span>
                  <span>50g</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-aurum-text">
                    {language === 'bn' ? 'সময়সীমা (মাস)' : 'Time Horizon (Months)'}:
                  </span>
                  <span className="text-aurum-gold font-mono">
                    {toLocalizedDigits(calcMonths)} {language === 'bn' ? 'মাস' : 'Months'}
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="36"
                  step="3"
                  value={calcMonths}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCalcMonths(val);
                    runCalculator(calcGrams, val);
                  }}
                  className="w-full accent-aurum-gold cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-aurum-text-dim mt-1 font-mono">
                  <span>3m</span>
                  <span>6m</span>
                  <span>12m (1 yr)</span>
                  <span>24m</span>
                  <span>36m</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-aurum-surface/80 border border-aurum-border text-xs text-aurum-text-muted space-y-1">
                <span className="font-bold text-aurum-text block">
                  {language === 'bn' ? 'স্বচ্ছ বাজার নীতি' : 'Financial Transparency Note'}
                </span>
                <p className="text-[11px] leading-relaxed">
                  {language === 'bn'
                    ? 'প্রদর্শিত কিস্তি বর্তমান বাজার দরের উপর ভিত্তি করে আনুমানিক। আন্তর্জাতিক ও স্থানীয় বাজার দরের পরিবর্তনের সাথে সঞ্চয় সমন্বয় করা যাবে।'
                    : 'Projections are calculated using the live verified 24K benchmark rate. Real-time rates fluctuate based on market movements.'}
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-aurum-surface/50 rounded-2xl p-6 border border-aurum-border">
              {calcResult && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-aurum-border/60">
                    <div>
                      <span className="text-xs text-aurum-text-dim block">
                        {language === 'bn' ? 'আনুমানিক মোট মূল্য' : 'Total Indicative Target'}
                      </span>
                      <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-gold">
                        {formatLocalizedBDT(calcResult.targetAmountBdt)}
                      </span>
                    </div>
                    <Badge variant="emerald" size="sm">
                      {language === 'bn' ? '২৪ ক্যারেট খাঁটি স্বর্ণ' : '99.9% 24K Pure'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-aurum-card border border-aurum-border">
                      <span className="text-[10px] uppercase font-bold text-aurum-text-dim tracking-wider block">
                        {language === 'bn' ? 'প্রতি মাসে সঞ্চয়' : 'Monthly Required'}
                      </span>
                      <span className="text-lg font-bold text-aurum-text font-mono mt-1 block">
                        {formatLocalizedBDT(calcResult.schedules?.monthly?.amountBdt)}
                      </span>
                      <span className="text-[11px] text-aurum-gold font-mono">
                        ≈ {formatLocalizedGold(calcResult.schedules?.monthly?.goldWeightGrams)} / mo
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-aurum-card border border-aurum-border">
                      <span className="text-[10px] uppercase font-bold text-aurum-text-dim tracking-wider block">
                        {language === 'bn' ? 'প্রতি সপ্তাহে সঞ্চয়' : 'Weekly Required'}
                      </span>
                      <span className="text-lg font-bold text-aurum-text font-mono mt-1 block">
                        {formatLocalizedBDT(calcResult.schedules?.weekly?.amountBdt)}
                      </span>
                      <span className="text-[11px] text-aurum-gold font-mono">
                        ≈ {formatLocalizedGold(calcResult.schedules?.weekly?.goldWeightGrams)} / wk
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-aurum-card border border-aurum-border">
                      <span className="text-[10px] uppercase font-bold text-aurum-text-dim tracking-wider block">
                        {language === 'bn' ? 'দৈনিক ক্ষুদ্র সঞ্চয়' : 'Daily Micro-Saving'}
                      </span>
                      <span className="text-lg font-bold text-aurum-text font-mono mt-1 block">
                        {formatLocalizedBDT(calcResult.schedules?.daily?.amountBdt)}
                      </span>
                      <span className="text-[11px] text-aurum-gold font-mono">
                        ≈ {formatLocalizedGold(calcResult.schedules?.daily?.goldWeightGrams)} / day
                      </span>
                    </div>
                  </div>

                  {/* AI Scenario Projections & Grounded Advisory */}
                  {advisorResult && (
                    <div className="p-5 rounded-2xl bg-aurum-midnight/80 border border-aurum-gold/30 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-aurum-border/60">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-aurum-gold animate-pulse" />
                          <span className="text-xs font-bold text-aurum-text font-serif-luxury">
                            {language === 'bn' ? 'অরামসেভ স্মার্ট সঞ্চয় অ্যাডভাইজর' : 'AurumSave Smart Goal Advisor'}
                          </span>
                        </div>
                        <Badge
                          variant={
                            advisorResult.feasibilityScore >= 80
                              ? 'emerald'
                              : advisorResult.feasibilityScore >= 50
                              ? 'gold'
                              : 'rose'
                          }
                          size="sm"
                        >
                          {language === 'bn' ? 'সম্ভাব্যতা স্কোর: ' : 'Feasibility: '}
                          {toLocalizedDigits(advisorResult.feasibilityScore)}%
                        </Badge>
                      </div>

                      {/* 3 Scenario Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-aurum-surface/80 border border-aurum-border/60 text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-sky-400 block">
                            🛡️ {language === 'bn' ? 'রক্ষণশীল (+৩%/বছর)' : 'Conservative (+3%)'}
                          </span>
                          <span className="font-bold text-aurum-text font-mono block">
                            {formatLocalizedBDT(advisorResult.scenarios?.conservative?.projectedMaturityValueBdt)}
                          </span>
                          <span className="text-[10px] text-aurum-text-dim block">
                            {language === 'bn' ? 'সম্ভাব্য লাভ: ' : 'Gain: '}
                            +{formatLocalizedBDT(advisorResult.scenarios?.conservative?.projectedNominalGainBdt)}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-aurum-surface/80 border border-aurum-gold/40 text-xs space-y-1 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-aurum-gold text-aurum-midnight text-[9px] font-bold px-1.5 py-0.5 rounded-bl">
                            {language === 'bn' ? 'বেসলাইন' : 'Baseline'}
                          </div>
                          <span className="text-[10px] uppercase font-bold text-aurum-gold block">
                            ⚖️ {language === 'bn' ? 'প্রত্যাশিত (+৯%/বছর)' : 'Baseline (+9%)'}
                          </span>
                          <span className="font-bold text-aurum-text font-mono block">
                            {formatLocalizedBDT(advisorResult.scenarios?.baseline?.projectedMaturityValueBdt)}
                          </span>
                          <span className="text-[10px] text-emerald-400 block">
                            {language === 'bn' ? 'সম্ভাব্য লাভ: ' : 'Gain: '}
                            +{formatLocalizedBDT(advisorResult.scenarios?.baseline?.projectedNominalGainBdt)}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-aurum-surface/80 border border-aurum-border/60 text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                            🚀 {language === 'bn' ? 'গতিশীল (+১৫%/বছর)' : 'Dynamic (+15%)'}
                          </span>
                          <span className="font-bold text-aurum-text font-mono block">
                            {formatLocalizedBDT(advisorResult.scenarios?.dynamic?.projectedMaturityValueBdt)}
                          </span>
                          <span className="text-[10px] text-emerald-400 block">
                            {language === 'bn' ? 'সম্ভাব্য লাভ: ' : 'Gain: '}
                            +{formatLocalizedBDT(advisorResult.scenarios?.dynamic?.projectedNominalGainBdt)}
                          </span>
                        </div>
                      </div>

                      {/* Grounded Advice Bullets */}
                      <div className="space-y-1.5 pt-2">
                        {(language === 'bn'
                          ? advisorResult.recommendations?.bilingualNotes?.bn || []
                          : advisorResult.recommendations?.bilingualNotes?.en || []
                        ).map((note: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-2 text-[11px] text-aurum-text-muted leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-aurum-gold shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <a
                    href="/trade"
                    className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-midnight font-bold text-sm shadow-gold-glow hover:brightness-110 active:scale-98 transition-all block"
                  >
                    {language === 'bn' ? 'এখনই প্রথম কিস্তি স্বর্ণ কিনুন' : 'Start Your First Contribution'}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-aurum-card border border-aurum-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-aurum-border">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-aurum-text font-serif-luxury">
                  {t('goals.create')}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-aurum-text-muted hover:text-aurum-text p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                  {language === 'bn' ? 'লক্ষ্যের শিরোনাম' : 'Goal Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'যেমন: ছোট বোনের বিয়ের উপহার' : 'e.g. Sister Wedding Bullion'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border focus:border-aurum-gold text-aurum-text text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-sm outline-none"
                  >
                    <option value="marriage">{language === 'bn' ? 'বিবাহ সঞ্চয়' : 'Marriage'}</option>
                    <option value="education">{language === 'bn' ? 'সন্তানের শিক্ষা' : 'Education'}</option>
                    <option value="family">{language === 'bn' ? 'পারিবারিক ভবিষ্যৎ' : 'Family'}</option>
                    <option value="hajj">{language === 'bn' ? 'হজ্ব সঞ্চয়' : 'Hajj Reserve'}</option>
                    <option value="emergency">{language === 'bn' ? 'জরুরি রিজার্ভ' : 'Emergency'}</option>
                    <option value="custom">{language === 'bn' ? 'অন্যান্য লক্ষ্য' : 'Custom'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                    {language === 'bn' ? 'টার্গেট ওজন (গ্রাম)' : 'Target Weight (Grams)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={newTargetGrams}
                    onChange={(e) => setNewTargetGrams(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border focus:border-aurum-gold text-aurum-text text-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                  {language === 'bn' ? 'সময়সীমা (মাস)' : 'Time Horizon (Months)'}
                </label>
                <select
                  value={newTargetMonths}
                  onChange={(e) => setNewTargetMonths(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-sm outline-none"
                >
                  <option value={3}>3 {language === 'bn' ? 'মাস' : 'Months'}</option>
                  <option value={6}>6 {language === 'bn' ? 'মাস' : 'Months'}</option>
                  <option value={12}>12 {language === 'bn' ? 'মাস (১ বছর)' : 'Months (1 Year)'}</option>
                  <option value={24}>24 {language === 'bn' ? 'মাস (২ বছর)' : 'Months (2 Years)'}</option>
                  <option value={36}>36 {language === 'bn' ? 'মাস (৩ বছর)' : 'Months (3 Years)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-aurum-text mb-1.5">
                  {language === 'bn' ? 'ব্যক্তিগত নোট (ঐচ্ছিক)' : 'Personal Note (Optional)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={language === 'bn' ? 'আপনার ব্যক্তিগত অনুপ্রেরণা বা বিস্তারিত...' : 'Motivation or special notes...'}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-sm outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-semibold text-xs hover:bg-aurum-surface/80"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-midnight font-bold text-xs shadow-gold-glow hover:brightness-110 disabled:opacity-50"
                >
                  {submitting
                    ? language === 'bn' ? 'তৈরি হচ্ছে...' : 'Creating...'
                    : language === 'bn' ? 'লক্ষ্য নিশ্চিত করুন' : 'Confirm Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
