'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useLanguage } from '../../../lib/language-context';
import { apiRequest } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import {
  PieChart,
  TrendingUp,
  Shield,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Lock,
  Building,
} from 'lucide-react';

interface PortfolioSummary {
  totalGoldGrams: number;
  totalGoldBhori: number;
  totalInvestedBdt: number;
  currentValuationBdt: number;
  unrealizedGainBdt: number;
  unrealizedGainPct: number;
  holdings: Array<{
    purity: string;
    weightGrams: number;
    weightBhori: number;
    investedBdt: number;
    currentValueBdt: number;
    avgCostPerGramBdt: number;
    liveRatePerGramBdt: number;
    unrealizedGainBdt: number;
    unrealizedGainPct: number;
  }>;
}

export default function PortfolioInsightsPage() {
  const { user } = useAuth();
  const { language, t, toLocalizedDigits, formatLocalizedBDT, formatLocalizedGold, formatLocalizedDateTime } =
    useLanguage();

  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const [portRes, priceRes] = await Promise.all([
        apiRequest<{ success: boolean; data: any }>('/portfolio'),
        apiRequest<{ success: boolean; data: any[] }>('/gold/prices'),
      ]);

      const holdings = portRes.success && portRes.data?.holdings ? portRes.data.holdings : [];
      const rate24K = priceRes.success && Array.isArray(priceRes.data)
        ? priceRes.data.find((r: any) => r.purity === '24K')?.buyPricePerGramBdt || 12450
        : 12450;
      const rate22K = priceRes.success && Array.isArray(priceRes.data)
        ? priceRes.data.find((r: any) => r.purity === '22K')?.buyPricePerGramBdt || 11412
        : 11412;

      let totalMg = 0;
      let totalInvestedPoisha = 0;
      let totalCurrentValuationBdt = 0;

      const mappedHoldings = holdings.map((h: any) => {
        const grams = (h.weightMilligramsAvailable || 0) / 1000;
        const bhori = Number((grams / 11.664).toFixed(3));
        const investedBdt = (h.totalCostPoisha || 0) / 100;
        const liveRate = h.purity === '22K' ? rate22K : rate24K;
        const currentValueBdt = Math.round(grams * liveRate);
        const avgCost = grams > 0 ? Math.round(investedBdt / grams) : 0;
        const gainBdt = currentValueBdt - investedBdt;
        const gainPct = investedBdt > 0 ? Number(((gainBdt / investedBdt) * 100).toFixed(2)) : 0;

        totalMg += h.weightMilligramsAvailable || 0;
        totalInvestedPoisha += h.totalCostPoisha || 0;
        totalCurrentValuationBdt += currentValueBdt;

        return {
          purity: h.purity || '24K',
          weightGrams: grams,
          weightBhori: bhori,
          investedBdt,
          currentValueBdt,
          avgCostPerGramBdt: avgCost,
          liveRatePerGramBdt: liveRate,
          unrealizedGainBdt: gainBdt,
          unrealizedGainPct: gainPct,
        };
      });

      const totalGrams = Number((totalMg / 1000).toFixed(3));
      const totalBhori = Number((totalGrams / 11.664).toFixed(3));
      const totalInvestedBdt = totalInvestedPoisha / 100;
      const unrealizedGainBdt = totalCurrentValuationBdt - totalInvestedBdt;
      const unrealizedGainPct =
        totalInvestedBdt > 0 ? Number(((unrealizedGainBdt / totalInvestedBdt) * 100).toFixed(2)) : 0;

      setPortfolio({
        totalGoldGrams: totalGrams,
        totalGoldBhori: totalBhori,
        totalInvestedBdt,
        currentValuationBdt: totalCurrentValuationBdt,
        unrealizedGainBdt,
        unrealizedGainPct,
        holdings: mappedHoldings,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch portfolio analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatement = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-aurum-text-muted">
        <div className="w-10 h-10 border-2 border-aurum-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium">
          {language === 'bn' ? 'পোর্টফোলিও বিশ্লেষণ লোড হচ্ছে...' : 'Loading portfolio insights...'}
        </p>
      </div>
    );
  }

  const isPositiveGain = (portfolio?.unrealizedGainBdt || 0) >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-aurum-border/60">
        <div>
          <div className="flex items-center space-x-2 text-aurum-gold text-xs font-bold uppercase tracking-wider mb-1.5">
            <PieChart className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্বর্ণ সম্পদ বিশ্লেষণ' : 'Gold Wealth Analytics'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-text">
            {language === 'bn' ? 'পোর্টফোলিও ও সম্পদ বিশ্লেষণ' : 'Portfolio & Wealth Intelligence'}
          </h1>
          <p className="text-xs sm:text-sm text-aurum-text-muted mt-1">
            {language === 'bn'
              ? 'আপনার সংগৃহীত ২৪ ক্যারেট ও ২২ ক্যারেট বাস্তব স্বর্ণের লাভ-ক্ষতি ও ব্যয় বিশ্লেষণ।'
              : 'Granular cost basis, real-time BAJUS valuations, and purity breakdown for your gold holdings.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadStatement}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-aurum-surface hover:bg-aurum-surface/80 border border-aurum-border text-aurum-text text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-aurum-gold" />
            <span>{language === 'bn' ? 'অডিট স্টেটমেন্ট প্রিন্ট' : 'Export Statement'}</span>
          </button>
          <a
            href="/trade"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-aurum-gold hover:brightness-110 text-aurum-midnight text-xs font-bold transition-all shadow-gold-glow"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'স্বর্ণ জমা করুন' : 'Add to Portfolio'}</span>
          </a>
        </div>
      </div>

      {/* Top 3 Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Valuation */}
        <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border shadow-card-luxury relative overflow-hidden">
          <span className="text-[11px] uppercase font-bold text-aurum-text-dim tracking-wider block">
            {language === 'bn' ? 'মোট বর্তমান মূল্য (বাজুস লাইভ)' : 'Total Portfolio Valuation'}
          </span>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-gold mt-2">
            {formatLocalizedBDT(portfolio?.currentValuationBdt || 0)}
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs font-mono">
            <span className="text-aurum-text font-bold">
              {formatLocalizedGold(portfolio?.totalGoldGrams || 0, true)}
            </span>
            <span className="text-aurum-text-dim">
              ({toLocalizedDigits(portfolio?.totalGoldBhori || 0)} {language === 'bn' ? 'ভরি' : 'Bhori'})
            </span>
          </div>
        </div>

        {/* Invested Capital */}
        <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border shadow-card-luxury">
          <span className="text-[11px] uppercase font-bold text-aurum-text-dim tracking-wider block">
            {language === 'bn' ? 'মোট ক্রয় ব্যয় (বিনিয়োগ)' : 'Total Invested Capital'}
          </span>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-text mt-2">
            {formatLocalizedBDT(portfolio?.totalInvestedBdt || 0)}
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block">
            {language === 'bn' ? 'ঐতিহাসিক নিট লেনদেন ভিত্তি' : 'Net cumulative acquisition cost'}
          </span>
        </div>

        {/* Unrealized Gain */}
        <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border shadow-card-luxury">
          <span className="text-[11px] uppercase font-bold text-aurum-text-dim tracking-wider block">
            {language === 'bn' ? 'অর্জিত অবাস্তবায়িত লাভ / ক্ষতি' : 'Unrealized Wealth Growth'}
          </span>
          <div
            className={`text-2xl sm:text-3xl font-serif-luxury font-bold mt-2 flex items-center space-x-1 ${
              isPositiveGain ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositiveGain ? (
              <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <ArrowDownRight className="w-6 h-6 stroke-[2.5]" />
            )}
            <span>
              {isPositiveGain ? '+' : ''}
              {formatLocalizedBDT(portfolio?.unrealizedGainBdt || 0)}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={isPositiveGain ? 'emerald' : 'rose'} size="sm">
              {isPositiveGain ? '+' : ''}
              {toLocalizedDigits(portfolio?.unrealizedGainPct || 0)}%
            </Badge>
            <span className="text-xs text-aurum-text-muted">
              {language === 'bn' ? 'লাইভ বাজার দরে' : 'against market rate'}
            </span>
          </div>
        </div>
      </div>

      {/* Holdings Breakdown Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-aurum-card border border-aurum-border shadow-card-luxury space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-aurum-border/60">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              {language === 'bn' ? 'ক্যারেট অনুযায়ী সংরক্ষিত স্বর্ণ' : 'Holdings Breakdown by Purity'}
            </h3>
            <p className="text-xs text-aurum-text-muted mt-0.5">
              {language === 'bn'
                ? 'প্রতিটি ক্যারেটের গড় ক্রয়মূল্য এবং বর্তমান বাজুস বাজার দরের তুলনা।'
                : 'Purity-level average cost basis vs verified benchmark valuations.'}
            </p>
          </div>
          <Badge variant="gold" size="sm">
            {language === 'bn' ? '১০০% ভল্ট ব্যাকড' : '100% Vault Allocated'}
          </Badge>
        </div>

        {(!portfolio?.holdings || portfolio.holdings.length === 0) ? (
          <div className="py-12 text-center space-y-3">
            <Coins className="w-10 h-10 text-aurum-gold/40 mx-auto" />
            <h4 className="text-base font-bold text-aurum-text">
              {language === 'bn' ? 'কোনো স্বর্ণ জমা নেই' : 'No Bullion Holdings Yet'}
            </h4>
            <p className="text-xs text-aurum-text-muted max-w-sm mx-auto">
              {language === 'bn'
                ? 'আপনার ব্যক্তিগত ভল্ট সক্রিয়। ৳৫০০ থেকে আপনার প্রথম স্বর্ণ সঞ্চয় শুরু করুন।'
                : 'Your personal vault is active. Begin accumulating pure bullion from ৳500.'}
            </p>
            <a
              href="/trade"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-aurum-gold text-aurum-midnight font-bold text-xs shadow-gold-glow hover:brightness-110 transition-all"
            >
              <span>{language === 'bn' ? 'স্বর্ণ ক্রয় করুন' : 'Buy 24K Gold Bullion'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                  <th className="py-3 px-4 font-bold">{language === 'bn' ? 'বিশুদ্ধতা (ক্যারেট)' : 'Purity Grade'}</th>
                  <th className="py-3 px-4 font-bold">{language === 'bn' ? 'ওজন (গ্রাম / ভরি)' : 'Gold Weight'}</th>
                  <th className="py-3 px-4 font-bold">{language === 'bn' ? 'গড় ক্রয়মূল্য/গ্রাম' : 'Avg Cost / Gram'}</th>
                  <th className="py-3 px-4 font-bold">{language === 'bn' ? 'বর্তমান দর/গ্রাম' : 'Live Benchmark'}</th>
                  <th className="py-3 px-4 font-bold">{language === 'bn' ? 'বর্তমান মূল্য' : 'Current Value'}</th>
                  <th className="py-3 px-4 font-bold text-right">{language === 'bn' ? 'লাভ / ক্ষতি' : 'Net P&L'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aurum-border/60 font-mono">
                {portfolio?.holdings.map((h, idx) => {
                  const gainPositive = h.unrealizedGainBdt >= 0;
                  return (
                    <tr key={idx} className="hover:bg-aurum-surface/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-aurum-gold">
                        <span className="flex items-center space-x-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{h.purity} Gold</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-aurum-text">
                        {formatLocalizedGold(h.weightGrams)}
                        <span className="text-aurum-text-dim font-normal block text-[10px]">
                          ≈ {toLocalizedDigits(h.weightBhori)} {language === 'bn' ? 'ভরি' : 'Bhori'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-aurum-text">
                        {formatLocalizedBDT(h.avgCostPerGramBdt)}
                      </td>
                      <td className="py-4 px-4 text-aurum-gold font-bold">
                        {formatLocalizedBDT(h.liveRatePerGramBdt)}
                      </td>
                      <td className="py-4 px-4 font-bold text-aurum-text">
                        {formatLocalizedBDT(h.currentValueBdt)}
                      </td>
                      <td className={`py-4 px-4 text-right font-bold ${gainPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {gainPositive ? '+' : ''}
                        {formatLocalizedBDT(h.unrealizedGainBdt)}
                        <span className="block text-[10px] font-normal">
                          ({gainPositive ? '+' : ''}
                          {toLocalizedDigits(h.unrealizedGainPct)}%)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custody & Security Trust Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-aurum-card via-aurum-surface to-aurum-card border border-aurum-border shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-aurum-gold/15 text-aurum-gold border border-aurum-gold/30 shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-aurum-text">
              {language === 'bn' ? 'সেগ্রিগেটেড ভল্ট কাস্টডি' : 'Segregated Vault Custody'}
            </h4>
            <p className="text-xs text-aurum-text-muted mt-1 leading-relaxed">
              {language === 'bn'
                ? 'আপনার স্বর্ণ স্বতন্ত্র গ্রাহক অ্যাকাউন্টে সংরক্ষিত, যা কখনোই ঋণ হিসেবে ব্যবহৃত হয় না।'
                : 'Customer bullion is held in segregated custody accounts and never re-hypothecated or lent out.'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-aurum-text">
              {language === 'bn' ? 'ক্রিপ্টোগ্রাফিক ডাবল-এন্ট্রি লেজার' : 'Double-Entry Cryptographic Ledger'}
            </h4>
            <p className="text-xs text-aurum-text-muted mt-1 leading-relaxed">
              {language === 'bn'
                ? 'প্রতিটি মিলিগ্রাম ক্রয় ও বিক্রয় অপরিবর্তনীয় ডিজিটাল লেজারে সংরক্ষিত।'
                : 'Every milligram buy, sell, or transfer transaction is sealed in an auditable double-entry journal.'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-aurum-gold/15 text-aurum-gold border border-aurum-gold/30 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-aurum-text">
              {language === 'bn' ? 'স্বচ্ছ ফি ও শূন্য ভল্ট চার্জ' : 'Zero Recurring Storage Fees'}
            </h4>
            <p className="text-xs text-aurum-text-muted mt-1 leading-relaxed">
              {language === 'bn'
                ? 'কোনো মাসিক বা বার্ষিক গোপন চার্জ নেই। শুধুমাত্র স্বচ্ছ ০.৫% লেনদেন ফি।'
                : 'Transparent fintech pricing: zero recurring storage charges, with a single 0.5% custody fee on orders.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
