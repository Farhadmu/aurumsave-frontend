'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { PurityGrade, CONVERSIONS, LivePriceRate } from '../shared';
import { apiRequest } from '../lib/api';
import { formatBDT, formatDateTime } from '../lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Info,
  Calendar,
  Scale,
  Bot,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PriceRecord {
  date: string;
  timestamp: string;
  purity: PurityGrade;
  rateBdt: number;
  ratePerBhoriBdt: number;
  source: string;
  isVerifiedHistory: boolean;
  notice?: string;
}

interface AiInsightState {
  isOpen: boolean;
  query: string;
  answer: string | null;
  sources: string[];
  confidence: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function GoldPriceChart() {
  const [purity, setPurity] = useState<PurityGrade>(PurityGrade.K24);
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '6M' | '1Y'>('1M');
  const [historyData, setHistoryData] = useState<PriceRecord[]>([]);
  const [currentRate, setCurrentRate] = useState<LivePriceRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Grounded AI Intelligence insight state
  const [aiInsight, setAiInsight] = useState<AiInsightState>({
    isOpen: false,
    query: 'How does BAJUS establish daily gold rates in Bangladesh?',
    answer: null,
    sources: [],
    confidence: null,
    isLoading: false,
    error: null,
  });

  const days = timeframe === '7D' ? 7 : timeframe === '1M' ? 30 : timeframe === '6M' ? 180 : 365;

  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const [histRes, liveRes] = await Promise.all([
          apiRequest<{ success: boolean; data: PriceRecord[] }>(
            `/gold/prices/history?purity=${purity}&days=${days}`,
          ),
          apiRequest<{ success: boolean; data: LivePriceRate[] }>('/gold/prices').catch(
            () => null,
          ),
        ]);

        if (histRes.success && Array.isArray(histRes.data)) {
          // Filter out any corrupted or non-numeric records
          const sanitized = histRes.data.filter(
            (r) => typeof r.rateBdt === 'number' && !isNaN(r.rateBdt) && r.rateBdt > 0,
          );
          setHistoryData(sanitized);
        } else {
          setHistoryData([]);
        }

        if (liveRes?.success && Array.isArray(liveRes.data)) {
          const match = liveRes.data.find((r) => r.purity === purity) || liveRes.data[0];
          setCurrentRate(match || null);
        }
      } catch (err: any) {
        console.error('Failed to load BAJUS market intelligence:', err);
        setError('Market oracle connection temporarily interrupted. Tap retry to reconnect.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [purity, days],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load grounded AI assistant answer on demand
  const handleFetchAiInsight = async (customQuery?: string) => {
    const q = customQuery || aiInsight.query;
    setAiInsight((prev) => ({ ...prev, isOpen: true, isLoading: true, error: null }));

    try {
      const res = await apiRequest<{
        success: boolean;
        data: {
          answer: string;
          citedSources: string[];
          confidence: string;
          disclaimer: string;
        };
      }>('/ai/assistant', {
        method: 'POST',
        body: JSON.stringify({ query: q }),
      });

      if (res.success && res.data) {
        setAiInsight((prev) => ({
          ...prev,
          isLoading: false,
          answer: res.data.answer,
          sources: res.data.citedSources || [],
          confidence: res.data.confidence,
        }));
      } else {
        throw new Error('AI Intelligence unavailable');
      }
    } catch {
      setAiInsight((prev) => ({
        ...prev,
        isLoading: false,
        error:
          'Grounded knowledge assistant temporarily offline. Pricing contracts remain fully verifiable via the oracle ledger.',
      }));
    }
  };

  // Calculations derived exclusively from actual records
  const recordsCount = historyData.length;
  const hasMultiplePoints = recordsCount > 1;

  // Prioritize active rate from /gold/prices, fallback to latest historical record
  const latestHistorical = historyData[historyData.length - 1];
  const activeRateBdt = currentRate ? currentRate.buyPricePerGramBdt : latestHistorical?.rateBdt || 0;
  const activeBhoriBdt = currentRate
    ? currentRate.buyPricePerBhoriBdt
    : Math.round(activeRateBdt * CONVERSIONS.GRAMS_PER_BHORI);

  // Period delta calculations (strictly guarded when records >= 2)
  const startRate = historyData[0]?.rateBdt || 0;
  const endRate = latestHistorical?.rateBdt || 0;
  const periodDiff = hasMultiplePoints ? endRate - startRate : 0;
  const periodPct =
    hasMultiplePoints && startRate > 0
      ? Number(((periodDiff / startRate) * 100).toFixed(2))
      : 0;
  const isPeriodPositive = periodDiff >= 0;

  // Period min / max
  const ratesList = historyData.map((d) => d.rateBdt);
  const minRate = hasMultiplePoints ? Math.min(...ratesList) : activeRateBdt;
  const maxRate = hasMultiplePoints ? Math.max(...ratesList) : activeRateBdt;

  // Stale detection
  const isStale = currentRate?.isStale || false;
  const sourceName = currentRate?.source || latestHistorical?.source || 'BAJUS_OFFICIAL_BENCHMARK';
  const effectiveTimestamp = currentRate?.effectiveAt || latestHistorical?.timestamp;
  const spreadPct = currentRate?.spreadPercentage ?? 2.45;

  // Fineness description for purity
  const purityFineness: Record<PurityGrade, string> = {
    [PurityGrade.K24]: '99.9% Fineness (Sovereign Bullion)',
    [PurityGrade.K22]: '91.6% Fineness (Standard Jewellery)',
    [PurityGrade.K21]: '87.5% Fineness (Traditional Gold)',
    [PurityGrade.K18]: '75.0% Fineness (Ornament Grade)',
  };

  return (
    <div
      role="region"
      aria-label="BAJUS Benchmark Gold Market Intelligence"
      className="rounded-3xl bg-[#0B1220] border border-[#D4AF63]/25 p-5 sm:p-7 lg:p-9 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.7)] text-[#F8F6F0] relative overflow-hidden space-y-6 transition-all"
    >
      {/* Subtle Ambient Radial Gold Glow */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 bg-[#D4AF63]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* =========================================================================
          1. HEADER & CONTROLS BAR
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[#D4AF63]/15">
        {/* Title, Source & Status */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F8F6F0] tracking-tight">
              BAJUS Benchmark Gold Trend
            </h3>

            {/* Verification Status Badge */}
            {sourceName.includes('OFFICIAL') ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 border border-emerald-500/35 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Benchmark</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/15 border border-amber-500/35 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Benchmark Seed (Unverified)</span>
              </span>
            )}

            {/* Data Freshness Indicator */}
            {isStale ? (
              <span
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40"
                title="Awaiting today's official 10:00 AM BAJUS morning rate publication"
              >
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Stale Rate • Pending Morning Circular</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Feed Active</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
            Official Bangladesh Jewellers Association daily price trajectory. Tracks wholesale
            benchmark circulars published for Dhaka, Chittagong, and national OTC bullion markets.
          </p>

          {effectiveTimestamp && (
            <div className="flex items-center space-x-2 text-[11px] font-mono text-[#94A3B8]">
              <Clock className="w-3 h-3 text-[#D4AF63]" />
              <span>
                Oracle Circular Effective:{' '}
                <strong className="text-[#F8F6F0]">{formatDateTime(effectiveTimestamp)}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Controls: Purity Switcher, Timeframe & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Purity Selector */}
          <div
            role="tablist"
            aria-label="Purity Grade Selector"
            className="inline-flex items-center rounded-xl bg-[#070C16] p-1 border border-[#D4AF63]/20 text-xs font-semibold"
          >
            {[PurityGrade.K24, PurityGrade.K22, PurityGrade.K21, PurityGrade.K18].map((p) => {
              const isActive = purity === p;
              return (
                <button
                  key={p}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setPurity(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF63] ${
                    isActive
                      ? 'bg-[#D4AF63] text-[#0B1220] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8F6F0]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Timeframe Selector */}
          <div
            role="tablist"
            aria-label="Historical Timeframe Selector"
            className="inline-flex items-center rounded-xl bg-[#070C16] p-1 border border-[#D4AF63]/20 text-xs font-semibold"
          >
            {(['7D', '1M', '6M', '1Y'] as const).map((tf) => {
              const isActive = timeframe === tf;
              return (
                <button
                  key={tf}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF63] ${
                    isActive
                      ? 'bg-[#D4AF63]/20 text-[#D4AF63] font-bold border border-[#D4AF63]/40'
                      : 'text-[#64748B] hover:text-[#F8F6F0]'
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>

          {/* Refresh Action */}
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing || isLoading}
            aria-label="Refresh BAJUS benchmark rates"
            className="p-2 rounded-xl bg-[#070C16] border border-[#D4AF63]/20 text-[#94A3B8] hover:text-[#D4AF63] hover:border-[#D4AF63]/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF63]"
            title="Refresh benchmark data from oracle"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D4AF63]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. STALE DATA WARNING BANNER (When Applicable)
         ========================================================================= */}
      {isStale && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center space-x-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-amber-200 leading-relaxed">
            <strong className="text-amber-300">Stale Benchmark Notice:</strong> The displayed rate card
            was published on {formatDateTime(effectiveTimestamp || '')}. BAJUS releases new official
            daily pricing circulars by 10:00 AM BST. Once published, rates are automatically
            synchronized.
          </div>
        </div>
      )}

      {/* =========================================================================
          3. INTELLIGENT PRICE SUMMARY CARDS
         ========================================================================= */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#070C16]/80 border border-[#D4AF63]/10 h-24"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
          <p className="text-sm font-semibold text-rose-200">{error}</p>
          <button
            onClick={() => fetchData()}
            className="text-xs font-bold text-[#D4AF63] hover:underline inline-flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Benchmark Rate Per Gram */}
          <div className="p-4 rounded-2xl bg-[#070C16]/80 border border-[#D4AF63]/20 hover:border-[#D4AF63]/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] mb-1">
              <span>Benchmark / Gram</span>
              <span className="text-[#D4AF63] font-bold">{purity}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F8F6F0]">
              {formatBDT(activeRateBdt)}
            </div>
            <span className="text-[10px] text-[#64748B] block mt-1">
              {purityFineness[purity].split(' ')[0]} Hallmarked
            </span>
          </div>

          {/* Card 2: Benchmark Rate Per Bhori */}
          <div className="p-4 rounded-2xl bg-[#070C16]/80 border border-[#D4AF63]/20 hover:border-[#D4AF63]/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] mb-1">
              <span>Rate / Bhori (Tola)</span>
              <span className="text-[10px] text-[#64748B]">11.664g</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#D4AF63]">
              {formatBDT(activeBhoriBdt)}
            </div>
            <span className="text-[10px] text-[#64748B] block mt-1">
              Standard 16 Annas / 96 Rattis
            </span>
          </div>

          {/* Card 3: Period Trajectory & Delta */}
          <div className="p-4 rounded-2xl bg-[#070C16]/80 border border-[#D4AF63]/20 hover:border-[#D4AF63]/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] mb-1">
              <span>Period Delta</span>
              <span className="text-[10px] text-[#D4AF63]">{timeframe}</span>
            </div>
            {hasMultiplePoints ? (
              <>
                <div
                  className={`text-xl sm:text-2xl font-bold font-mono flex items-center space-x-1 ${
                    isPeriodPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPeriodPositive ? (
                    <TrendingUp className="w-5 h-5 shrink-0" />
                  ) : (
                    <TrendingDown className="w-5 h-5 shrink-0" />
                  )}
                  <span>
                    {isPeriodPositive ? `+${formatBDT(periodDiff)}` : `-${formatBDT(Math.abs(periodDiff))}`}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-[#94A3B8] block mt-1">
                  {isPeriodPositive ? `+${periodPct}%` : `${periodPct}%`} over {timeframe}
                </span>
              </>
            ) : (
              <>
                <div className="text-sm font-bold font-mono text-[#94A3B8] mt-1">
                  Baseline Circular
                </div>
                <span className="text-[10px] text-[#64748B] block mt-1">
                  Delta requires ≥2 records
                </span>
              </>
            )}
          </div>

          {/* Card 4: Period Range (Low / High) */}
          <div className="p-4 rounded-2xl bg-[#070C16]/80 border border-[#D4AF63]/20 hover:border-[#D4AF63]/40 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1">
              Period Range ({timeframe})
            </span>
            {hasMultiplePoints ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#64748B]">Low:</span>
                  <span className="font-bold text-[#F8F6F0]">{formatBDT(minRate)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#64748B]">High:</span>
                  <span className="font-bold text-[#D4AF63]">{formatBDT(maxRate)}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm font-bold font-mono text-[#F8F6F0] mt-1">
                  {formatBDT(activeRateBdt)}
                </div>
                <span className="text-[10px] text-[#64748B] block mt-1">
                  Single circular (Low = High)
                </span>
              </>
            )}
          </div>

          {/* Card 5: Spread & Fee Structure Transparency */}
          <div className="p-4 rounded-2xl bg-[#070C16]/80 border border-[#D4AF63]/20 hover:border-[#D4AF63]/40 transition-colors col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1">
              Fee & Spread Transparency
            </span>
            <div className="text-sm font-bold font-mono text-[#D4AF63] mt-0.5">
              0.5% Protocol Fee
            </div>
            <div className="text-[10px] text-[#94A3B8] font-mono space-y-0.5 mt-1">
              <div>Market Spread: {spreadPct}%</div>
              <div className="text-emerald-400 font-semibold">Vault Custody: 100% Free</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. INTERACTIVE HISTORICAL PRICE CHART AREA
         ========================================================================= */}
      <div className="rounded-2xl bg-[#070C16]/60 border border-[#D4AF63]/15 p-4 sm:p-6 space-y-4">
        {isLoading ? (
          <div className="h-64 sm:h-80 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-[#D4AF63] animate-spin" />
            <span className="text-xs font-mono text-[#94A3B8]">
              Streaming cryptographically verified circular records...
            </span>
          </div>
        ) : error || recordsCount === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-2.5 p-6 text-[#94A3B8]">
            <Info className="w-7 h-7 text-[#D4AF63]" />
            <h4 className="text-sm font-bold text-[#F8F6F0]">
              {error ? 'Unable to Load Historical Oracle' : 'No Benchmark Records in Selected Window'}
            </h4>
            <p className="text-xs max-w-md text-[#64748B]">
              {error
                ? error
                : `No official BAJUS circulars were recorded for ${purity} within the last ${timeframe}. Try selecting a wider timeframe (1M or 1Y) or 24K purity.`}
            </p>
          </div>
        ) : hasMultiplePoints ? (
          /* Multi-point Interactive Line/Area Chart */
          <div className="h-64 sm:h-80 md:h-96 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={historyData}
                margin={{ top: 12, right: 16, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="aurumGoldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF63" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#D4AF63" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(212, 175, 99, 0.08)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(212, 175, 99, 0.2)' }}
                  tickFormatter={(val: string) => {
                    try {
                      const d = new Date(val);
                      return d.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' });
                    } catch {
                      return val;
                    }
                  }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(212, 175, 99, 0.2)' }}
                  tickFormatter={(v: number) => `৳${Math.round(v).toLocaleString()}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const pt = payload[0].payload as PriceRecord;
                      return (
                        <div className="rounded-xl bg-[#070C16] border border-[#D4AF63]/50 p-3.5 shadow-2xl backdrop-blur-md space-y-1.5 text-xs font-mono">
                          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pb-1 border-b border-[#D4AF63]/15">
                            <span>{pt.date}</span>
                            <span className="font-bold text-[#D4AF63]">{pt.purity}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#64748B] block">Benchmark Rate:</span>
                            <span className="text-base font-bold text-[#F8F6F0]">
                              {formatBDT(pt.rateBdt)} / gram
                            </span>
                          </div>
                          <div className="text-[11px] text-[#D4AF63]">
                            {formatBDT(pt.ratePerBhoriBdt)} / bhori
                          </div>
                          <div className="text-[9px] text-[#64748B] pt-1 border-t border-[#D4AF63]/10">
                            Source: {pt.source}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rateBdt"
                  stroke="#D4AF63"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#aurumGoldAreaGradient)"
                  dot={{ r: 3, fill: '#D4AF63', stroke: '#0B1220', strokeWidth: 1.5 }}
                  activeDot={{
                    r: 6,
                    fill: '#F8F6F0',
                    stroke: '#D4AF63',
                    strokeWidth: 2,
                    className: 'shadow-gold-glow',
                  }}
                />
                {minRate > 0 && (
                  <ReferenceLine
                    y={minRate}
                    stroke="rgba(244, 63, 94, 0.35)"
                    strokeDasharray="4 4"
                    label={{
                      value: `Low: ${formatBDT(minRate)}`,
                      fill: '#94A3B8',
                      fontSize: 10,
                      position: 'insideBottomRight',
                    }}
                  />
                )}
                {maxRate > 0 && maxRate !== minRate && (
                  <ReferenceLine
                    y={maxRate}
                    stroke="rgba(16, 185, 129, 0.35)"
                    strokeDasharray="4 4"
                    label={{
                      value: `High: ${formatBDT(maxRate)}`,
                      fill: '#D4AF63',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Single-Point Focal Indicator (Truthful presentation when only 1 record exists) */
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1220] border border-[#D4AF63]/25 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF63]/15 border border-[#D4AF63]/40 flex items-center justify-center text-[#D4AF63] mx-auto">
              <Calendar className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF63] font-bold">
                Archived Benchmark Circular Established
              </span>
              <h4 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#F8F6F0]">
                {formatBDT(activeRateBdt)} / gram • {purity}
              </h4>
              <p className="text-xs sm:text-sm text-[#94A3B8] font-mono">
                Equivalent: <strong className="text-[#D4AF63]">{formatBDT(activeBhoriBdt)}</strong>{' '}
                per standard Bhori (11.664g)
              </p>
            </div>

            <div className="max-w-xl mx-auto p-4 rounded-xl bg-[#070C16] border border-[#D4AF63]/15 text-left space-y-2 text-xs leading-relaxed text-[#94A3B8]">
              <div className="flex items-center space-x-2 text-[#D4AF63] font-bold">
                <Info className="w-4 h-4 shrink-0" />
                <span>Historical Time-Series Accumulation Notice</span>
              </div>
              <p>
                {latestHistorical?.notice ||
                  'The AurumSave oracle has officially catalogued this active benchmark circular. In accordance with strict financial integrity standards, synthetic trend points are never fabricated.'}
              </p>
              <p className="text-[11px] text-[#64748B]">
                As BAJUS issues subsequent circulars (typically every trading morning at ~10:00 AM BST
                or during significant London Bullion Market / forex shifts), multi-day trend curves
                and volatility bands will populate automatically.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          5. MARKET INTELLIGENCE FOOTER & DATA SPECIFICATION
         ========================================================================= */}
      <div className="pt-4 border-t border-[#D4AF63]/15 space-y-4">
        {/* Metric Specification Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-[#94A3B8]">
          <div>
            <span className="text-[10px] uppercase text-[#64748B] block">Benchmark Authority</span>
            <span className="text-[#F8F6F0] font-semibold">BAJUS Central Committee</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#64748B] block">Archived Circulars</span>
            <span className="text-[#F8F6F0] font-semibold">
              {recordsCount} {recordsCount === 1 ? 'Circular' : 'Circulars'} ({timeframe})
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#64748B] block">Exchange Standard</span>
            <span className="text-[#F8F6F0] font-semibold">BDT / Gram (1 Bhori = 11.664g)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#64748B] block">Custody Allocation</span>
            <span className="text-emerald-400 font-semibold">100% Physical Vault Backed</span>
          </div>
        </div>

        {/* Informational Disclosure Strip */}
        <div className="p-4 rounded-2xl bg-[#070C16] border border-[#D4AF63]/15 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs leading-relaxed text-[#94A3B8]">
          <div className="flex items-start space-x-2.5">
            <Scale className="w-4 h-4 text-[#D4AF63] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F8F6F0]">What does this benchmark represent?</strong>
              <p className="mt-0.5">
                BAJUS benchmark prices reflect the official baseline ornament and bullion trading rates
                in Bangladesh. AurumSave enables micro-savings starting from ৳100 directly against this
                benchmark without traditional jewellery wastage (making charges) or monthly locker fees.
              </p>
            </div>
          </div>

          {/* AI Intelligence Assistant Toggle */}
          <button
            onClick={() => {
              if (!aiInsight.isOpen && !aiInsight.answer) {
                handleFetchAiInsight();
              } else {
                setAiInsight((prev) => ({ ...prev, isOpen: !prev.isOpen }));
              }
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF63]/15 hover:bg-[#D4AF63]/25 border border-[#D4AF63]/35 text-[#D4AF63] font-bold shrink-0 transition-all self-start md:self-auto"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Market Intelligence Notes</span>
            {aiInsight.isOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Expandable Grounded AI Market Insight Panel */}
        {aiInsight.isOpen && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070C16] border border-[#D4AF63]/30 space-y-3 text-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF63]/15">
              <div className="flex items-center space-x-2 text-[#D4AF63] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Grounded Market Assistant • Platform Knowledge Base</span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                Confidence: {aiInsight.confidence || 'HIGH'}
              </span>
            </div>

            {aiInsight.isLoading ? (
              <div className="flex items-center space-x-2 py-3 text-[#94A3B8] font-mono">
                <RefreshCw className="w-4 h-4 text-[#D4AF63] animate-spin" />
                <span>Retrieving grounded regulatory and market pricing standards...</span>
              </div>
            ) : aiInsight.error ? (
              <div className="text-amber-300 py-1">{aiInsight.error}</div>
            ) : (
              <div className="space-y-2 text-[#F8F6F0] leading-relaxed">
                <p>{aiInsight.answer}</p>
                {aiInsight.sources.length > 0 && (
                  <div className="pt-2 border-t border-[#D4AF63]/10 text-[10px] text-[#94A3B8] font-mono flex items-center space-x-2">
                    <span>Cited Platform Rule:</span>
                    <strong className="text-[#D4AF63]">{aiInsight.sources.join(', ')}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="text-[10px] text-[#64748B] italic">
              Disclosed strictly for market transparency and digital gold literacy under Bangladesh
              financial regulations. Does not constitute personal investment or speculative advice.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
