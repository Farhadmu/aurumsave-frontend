'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/language-context';
import { apiRequest } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import {
  Calculator,
  Sparkles,
  TrendingUp,
  Shield,
  Coins,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export default function WhatIfSimulatorPage() {
  const { language, toLocalizedDigits, formatLocalizedBDT, formatLocalizedGold } = useLanguage();

  const [targetGrams, setTargetGrams] = useState<number>(11.664); // 1 Bhori default
  const [months, setMonths] = useState<number>(12);
  const [monthlyBudgetBdt, setMonthlyBudgetBdt] = useState<number>(12000);
  const [scenarioRatePct, setScenarioRatePct] = useState<number>(9); // Baseline 9%
  const [liveRate24K, setLiveRate24K] = useState<number>(12450);

  useEffect(() => {
    fetchLiveRate();
  }, []);

  const fetchLiveRate = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: any }>('/prices/rates');
      if (res.success && res.data?.rates) {
        setLiveRate24K(res.data.rates['24K']?.buyPricePerGramBdt || 12450);
      }
    } catch {
      setLiveRate24K(12450);
    }
  };

  // Calculations
  const targetBhori = Number((targetGrams / 11.664).toFixed(3));
  const currentTotalCostBdt = Math.round(targetGrams * liveRate24K);
  const requiredMonthlyBdt = Math.round(currentTotalCostBdt / months);

  // Projected price at horizon under chosen scenario
  const years = months / 12;
  const projectedFutureRatePerGram = Math.round(liveRate24K * Math.pow(1 + scenarioRatePct / 100, years));
  const totalCapitalInvestedBdt = monthlyBudgetBdt * months;

  // Approximate gold grams accumulated with the monthly budget
  const avgExpectedPriceOverHorizon = (liveRate24K + projectedFutureRatePerGram) / 2;
  const projectedAccumulatedGrams = Number((totalCapitalInvestedBdt / avgExpectedPriceOverHorizon).toFixed(3));
  const projectedMaturityValueBdt = Math.round(projectedAccumulatedGrams * projectedFutureRatePerGram);
  const projectedGainBdt = projectedMaturityValueBdt - totalCapitalInvestedBdt;

  // Feasibility score (0 - 100)
  const feasibilityScore = Math.min(
    100,
    Math.max(10, Math.round((monthlyBudgetBdt / requiredMonthlyBdt) * 100)),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-aurum-border/60">
        <div>
          <div className="flex items-center space-x-2 text-aurum-gold text-xs font-bold uppercase tracking-wider mb-1.5">
            <Calculator className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্মার্ট সম্পদ সিমুলেটর' : 'Deterministic Wealth Lab'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-text">
            {language === 'bn' ? 'হোয়াট-ইফ স্বর্ণ সঞ্চয় সিমুলেটর' : 'What-If Gold Savings Simulator'}
          </h1>
          <p className="text-xs sm:text-sm text-aurum-text-muted mt-1 max-w-3xl">
            {language === 'bn'
              ? 'বিভিন্ন বাজার পরিস্থিতি ও আপনার সাধ্যের মাসিক কিস্তির উপর ভিত্তি করে স্বর্ণ জমার সম্ভাব্য রূপরেখা বিশ্লেষণ করুন।'
              : 'Project your physical gold accumulation, maturity valuation, and feasibility under diverse market scenarios.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="gold" size="sm">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {language === 'bn' ? 'বাজুস ২৪K ভেরিফায়েড রেট' : 'BAJUS 24K Verified'}
          </Badge>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-aurum-card p-6 sm:p-7 rounded-3xl border border-aurum-border shadow-card-luxury">
          <h3 className="font-serif-luxury text-lg font-bold text-aurum-text border-b border-aurum-border/60 pb-3">
            {language === 'bn' ? '১. সঞ্চয় প্যারামিটার নির্ধারণ' : '1. Configure Goal Parameters'}
          </h3>

          {/* Slider 1: Target Weight */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-aurum-text">
                {language === 'bn' ? 'টার্গেট স্বর্ণের ওজন' : 'Target Gold Weight'}:
              </span>
              <span className="text-aurum-gold font-mono">
                {formatLocalizedGold(targetGrams, true)} ({toLocalizedDigits(targetBhori)} {language === 'bn' ? 'ভরি' : 'Bhori'})
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={targetGrams}
              onChange={(e) => setTargetGrams(parseFloat(e.target.value))}
              className="w-full accent-aurum-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-aurum-text-dim mt-1 font-mono">
              <span>1g</span>
              <span>11.66g (১ ভরি)</span>
              <span>25g</span>
              <span>50g (৪+ ভরি)</span>
            </div>
          </div>

          {/* Slider 2: Time Horizon */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-aurum-text">
                {language === 'bn' ? 'সঞ্চয় সময়সীমা' : 'Time Horizon'}:
              </span>
              <span className="text-aurum-gold font-mono">
                {toLocalizedDigits(months)} {language === 'bn' ? 'মাস' : 'Months'} ({(months / 12).toFixed(1)} {language === 'bn' ? 'বছর' : 'yr'})
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="36"
              step="3"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
              className="w-full accent-aurum-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-aurum-text-dim mt-1 font-mono">
              <span>3m</span>
              <span>6m</span>
              <span>12m (১ বছর)</span>
              <span>24m</span>
              <span>36m (৩ বছর)</span>
            </div>
          </div>

          {/* Slider 3: Monthly Budget */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-aurum-text">
                {language === 'bn' ? 'আপনার মাসিক সাধ্য' : 'Monthly Savings Budget'}:
              </span>
              <span className="text-aurum-gold font-mono">
                {formatLocalizedBDT(monthlyBudgetBdt)} / {language === 'bn' ? 'মাস' : 'mo'}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={monthlyBudgetBdt}
              onChange={(e) => setMonthlyBudgetBdt(parseInt(e.target.value))}
              className="w-full accent-aurum-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-aurum-text-dim mt-1 font-mono">
              <span>৳1,000</span>
              <span>৳10,000</span>
              <span>৳25,000</span>
              <span>৳50,000+</span>
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="space-y-2 pt-2 border-t border-aurum-border/60">
            <span className="text-xs font-bold text-aurum-text block">
              {language === 'bn' ? 'স্বর্ণের সম্ভাব্য বার্ষিক বৃদ্ধির দৃশ্যপট' : 'Annual Market Appreciation Scenario'}:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setScenarioRatePct(3)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  scenarioRatePct === 3
                    ? 'bg-sky-500/15 border-sky-400 text-sky-300 font-bold'
                    : 'bg-aurum-surface border-aurum-border text-aurum-text-muted hover:border-aurum-border-gold'
                }`}
              >
                <span className="block text-[11px]">🛡️ {language === 'bn' ? 'রক্ষণশীল' : 'Conservative'}</span>
                <span className="text-[10px] font-mono">+৩%/বছর</span>
              </button>

              <button
                onClick={() => setScenarioRatePct(9)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  scenarioRatePct === 9
                    ? 'bg-aurum-gold/15 border-aurum-gold text-aurum-gold font-bold shadow-sm'
                    : 'bg-aurum-surface border-aurum-border text-aurum-text-muted hover:border-aurum-border-gold'
                }`}
              >
                <span className="block text-[11px]">⚖️ {language === 'bn' ? 'প্রত্যাশিত (বেসলাইন)' : 'Baseline Trend'}</span>
                <span className="text-[10px] font-mono">+৯%/বছর</span>
              </button>

              <button
                onClick={() => setScenarioRatePct(15)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  scenarioRatePct === 15
                    ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-aurum-surface border-aurum-border text-aurum-text-muted hover:border-aurum-border-gold'
                }`}
              >
                <span className="block text-[11px]">🚀 {language === 'bn' ? 'গতিশীল' : 'Dynamic Sovereign'}</span>
                <span className="text-[10px] font-mono">+১৫%/বছর</span>
              </button>

              <button
                onClick={() => setScenarioRatePct(-5)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  scenarioRatePct === -5
                    ? 'bg-rose-500/15 border-rose-400 text-rose-300 font-bold'
                    : 'bg-aurum-surface border-aurum-border text-aurum-text-muted hover:border-aurum-border-gold'
                }`}
              >
                <span className="block text-[11px]">📉 {language === 'bn' ? 'মার্কেট পুলব্যাক' : 'Stress Test'}</span>
                <span className="text-[10px] font-mono">-৫%/বছর</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results & Projections Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-aurum-card border border-aurum-border shadow-card-luxury space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-aurum-border/60">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  {language === 'bn' ? 'সিমুলেশন ফলাফল ও প্রক্ষেপণ' : 'Simulation Projections'}
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  {language === 'bn'
                    ? 'বর্তমান বাজুস রেট ও আপনার মাসিক সঞ্চয়ের উপর ভিত্তি করে অনুমিত রূপরেখা।'
                    : 'Calculated using deterministic compounding rules and live BAJUS benchmarks.'}
                </p>
              </div>
              <Badge
                variant={feasibilityScore >= 80 ? 'emerald' : feasibilityScore >= 50 ? 'gold' : 'rose'}
                size="sm"
              >
                {language === 'bn' ? 'সম্ভাব্যতা: ' : 'Feasibility: '}
                {toLocalizedDigits(feasibilityScore)}%
              </Badge>
            </div>

            {/* Key Metric Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-aurum-surface border border-aurum-border">
                <span className="text-[11px] uppercase font-bold text-aurum-text-dim tracking-wider block">
                  {language === 'bn' ? 'মোট সঞ্চিত অর্থ (আপনার বিনিয়োগ)' : 'Total Capital Invested'}
                </span>
                <div className="text-2xl font-serif-luxury font-bold text-aurum-text mt-1.5 font-mono">
                  {formatLocalizedBDT(totalCapitalInvestedBdt)}
                </div>
                <span className="text-[11px] text-aurum-text-muted mt-1 block">
                  {formatLocalizedBDT(monthlyBudgetBdt)} × {toLocalizedDigits(months)} {language === 'bn' ? 'মাস' : 'months'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-aurum-surface border border-aurum-gold/40">
                <span className="text-[11px] uppercase font-bold text-aurum-gold tracking-wider block">
                  {language === 'bn' ? 'প্রত্যাশিত মেয়াদপূর্তি স্বর্ণের মূল্য' : 'Projected Maturity Value'}
                </span>
                <div className="text-2xl font-serif-luxury font-bold text-aurum-gold mt-1.5 font-mono">
                  {formatLocalizedBDT(projectedMaturityValueBdt)}
                </div>
                <span className={`text-[11px] font-bold mt-1 block ${projectedGainBdt >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {projectedGainBdt >= 0 ? '+' : ''}
                  {formatLocalizedBDT(projectedGainBdt)} {language === 'bn' ? 'প্রত্যাশিত লাভ' : 'projected gain'}
                </span>
              </div>
            </div>

            {/* Gold Accumulation Metric */}
            <div className="p-5 rounded-2xl bg-aurum-midnight/80 border border-aurum-border/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-aurum-gold/15 text-aurum-gold">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-aurum-text-dim block">
                    {language === 'bn' ? 'মোট সংগৃহীত স্বর্ণ' : 'Estimated Gold Accumulated'}
                  </span>
                  <span className="text-lg font-bold text-aurum-text font-mono">
                    {formatLocalizedGold(projectedAccumulatedGrams)} (≈ {toLocalizedDigits(Number((projectedAccumulatedGrams / 11.664).toFixed(3)))} {language === 'bn' ? 'ভরি' : 'Bhori'})
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-aurum-text-dim block">
                  {language === 'bn' ? 'টার্গেট পূরণ' : 'Target Coverage'}
                </span>
                <span className="text-sm font-bold text-aurum-gold font-mono">
                  {toLocalizedDigits(Math.min(100, Math.round((projectedAccumulatedGrams / targetGrams) * 100)))}%
                </span>
              </div>
            </div>

            {/* Feasibility Insight */}
            <div className="p-4 rounded-2xl bg-aurum-surface/60 border border-aurum-border text-xs space-y-2">
              <div className="flex items-center space-x-2 text-aurum-gold font-bold">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'bn' ? 'অ্যাডভাইজর পরামর্শ' : 'Grounded Advisor Recommendation'}</span>
              </div>
              <p className="text-aurum-text-muted leading-relaxed">
                {feasibilityScore >= 90
                  ? language === 'bn'
                    ? `আপনার মাসিক ৳${monthlyBudgetBdt.toLocaleString()} সঞ্চয় দিয়ে নির্ধারিত ${months} মাসে ${targetGrams} গ্রাম স্বর্ণ জমানো অত্যন্ত বাস্তবসম্মত ও সহজসাধ্য!`
                    : `Your monthly contribution of ৳${monthlyBudgetBdt.toLocaleString()} is fully aligned to achieve ${targetGrams}g within ${months} months.`
                  : language === 'bn'
                  ? `নির্ধারিত ${months} মাসে পূর্ণ ${targetGrams} গ্রাম স্বর্ণের লক্ষ্য পূরণ করতে আপনার মাসিক কিস্তি ৳${requiredMonthlyBdt.toLocaleString()} এ উন্নীত করা বা সময়সীমা বৃদ্ধি করার সুপারিশ করা হলো।`
                  : `To fully achieve ${targetGrams}g within ${months} months, we recommend adjusting your monthly contribution to ৳${requiredMonthlyBdt.toLocaleString()} or extending the time horizon.`}
              </p>
            </div>

            {/* CTA */}
            <a
              href="/trade"
              className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-midnight font-bold text-sm shadow-gold-glow hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2 block"
            >
              <span>{language === 'bn' ? 'এই পরিকল্পনা অনুযায়ী প্রথম সঞ্চয় শুরু করুন' : 'Start Saving with this Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Legal Transparency Note */}
          <div className="p-4 rounded-2xl bg-aurum-surface/40 border border-aurum-border/60 text-[11px] text-aurum-text-dim leading-relaxed flex items-start space-x-2.5">
            <Shield className="w-4 h-4 text-aurum-gold shrink-0 mt-0.5" />
            <span>
              {language === 'bn'
                ? 'আইনি স্বচ্ছতা নীতি: সিমুলেটর প্রদর্শিত সকল ফলাফল গাণিতিক প্রক্ষেপণমাত্র। এটি কোনো নিশ্চিত মুনাফা বা বিনিয়োগ পরামর্শ নয়। স্বর্ণের বাজার দর আন্তর্জাতিক ও বাজুস অফিসিয়াল রেট অনুযায়ী পরিবর্তনশীল।'
                : 'Legal Transparency Standard: All figures generated by this simulator are hypothetical deterministic models for disciplined personal budgeting. They do not constitute guaranteed returns or investment advice.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
