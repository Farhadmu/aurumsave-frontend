'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PurityGrade } from '../shared';
import { apiRequest } from '../lib/api';
import { Badge } from './ui/Badge';
import { Skeleton } from './ui/Skeleton';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Info, RefreshCw } from 'lucide-react';
import { formatBDT } from '../lib/utils';

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

export default function GoldPriceChart() {
  const [purity, setPurity] = useState<PurityGrade>(PurityGrade.K24);
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '6M' | '1Y'>('1M');
  const [data, setData] = useState<PriceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = timeframe === '7D' ? 7 : timeframe === '1M' ? 30 : timeframe === '6M' ? 180 : 365;

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; data: PriceRecord[] }>(
        `/gold/prices/history?purity=${purity}&days=${days}`,
      );
      if (res.success && Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (err: any) {
      console.error('Failed to load price history:', err);
      setError('Historical market trajectory currently unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [purity, timeframe]);

  const hasMultiplePoints = data.length > 1;
  const startPrice = data[0]?.rateBdt || 0;
  const endPrice = data[data.length - 1]?.rateBdt || 0;
  const diff = endPrice - startPrice;
  const percentage = startPrice > 0 ? Number(((diff / startPrice) * 100).toFixed(2)) : 0;
  const isPositive = diff >= 0;

  const minRate = data.length > 0 ? Math.min(...data.map((d) => d.rateBdt)) : 0;
  const maxRate = data.length > 0 ? Math.max(...data.map((d) => d.rateBdt)) : 0;

  return (
    <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury relative overflow-hidden space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-aurum-text">
              BAJUS Benchmark Gold Trend
            </h3>
            {hasMultiplePoints && (
              <Badge variant={isPositive ? 'emerald' : 'rose'} size="sm">
                {isPositive ? `+${percentage}%` : `${percentage}%`}
              </Badge>
            )}
            {!hasMultiplePoints && !isLoading && (
              <Badge variant="gold" size="sm">
                Verified Snapshot
              </Badge>
            )}
          </div>
          <p className="text-xs text-aurum-text-muted">
            Official Bangladesh Jewellers Association daily price trajectory
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Purity Switcher */}
          <div className="inline-flex rounded-xl bg-aurum-surface p-1 border border-aurum-border text-xs font-semibold">
            {[PurityGrade.K24, PurityGrade.K22].map((p) => (
              <button
                key={p}
                onClick={() => setPurity(p)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  purity === p
                    ? 'bg-aurum-gold text-aurum-midnight font-bold shadow-sm'
                    : 'text-aurum-text-muted hover:text-aurum-text'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Timeframe Switcher */}
          <div className="inline-flex rounded-xl bg-aurum-surface p-1 border border-aurum-border text-xs font-semibold">
            {(['7D', '1M', '6M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-aurum-gold/20 text-aurum-gold font-bold'
                    : 'text-aurum-text-dim hover:text-aurum-text'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 text-aurum-gold animate-spin" />
          <span className="text-xs text-aurum-text-muted">Loading verified historical rates...</span>
        </div>
      ) : error ? (
        <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 p-6 rounded-2xl bg-aurum-surface/50 border border-aurum-border">
          <Info className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold text-aurum-text">{error}</span>
          <button
            onClick={loadHistory}
            className="text-xs text-aurum-gold font-bold hover:underline inline-flex items-center space-x-1"
          >
            <span>Retry connection</span>
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 p-6 rounded-2xl bg-aurum-surface/50 border border-aurum-border">
          <Info className="w-5 h-5 text-aurum-gold" />
          <span className="text-sm font-semibold text-aurum-text">No price history available</span>
          <span className="text-xs text-aurum-text-muted">
            Historical price charts display exclusively verified recorded benchmark circulars.
          </span>
        </div>
      ) : (
        <>
          {/* Metric Highlight */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-aurum-surface/60 border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim block">
                Current Rate (Gram)
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-aurum-gold mt-0.5 block">
                {formatBDT(endPrice)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-aurum-surface/60 border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim block">
                Current Rate (Bhori)
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-aurum-text mt-0.5 block">
                {formatBDT(Math.round(endPrice * 11.664))}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-aurum-surface/60 border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim block">
                Period Low
              </span>
              <span className="text-base sm:text-lg font-semibold font-mono text-aurum-text-muted mt-0.5 block">
                {formatBDT(minRate)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-aurum-surface/60 border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim block">
                Period High
              </span>
              <span className="text-base sm:text-lg font-semibold font-mono text-aurum-text-muted mt-0.5 block">
                {formatBDT(maxRate)}
              </span>
            </div>
          </div>

          {/* Chart Area */}
          {hasMultiplePoints ? (
            <div className="h-64 sm:h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(212, 175, 55, 0.15)' }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(212, 175, 55, 0.15)' }}
                    tickFormatter={(v) => `৳${Math.round(v).toLocaleString()}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const pt = payload[0].payload as PriceRecord;
                        return (
                          <div className="rounded-xl bg-aurum-midnight/95 border border-aurum-border-gold p-3 shadow-xl backdrop-blur-md">
                            <span className="text-[10px] text-aurum-text-dim font-mono block">
                              {pt.date} • {pt.source}
                            </span>
                            <span className="text-base font-bold text-aurum-gold font-mono block mt-0.5">
                              {formatBDT(pt.rateBdt)} / gram
                            </span>
                            <span className="text-xs text-aurum-text-muted font-mono block">
                              {formatBDT(pt.ratePerBhoriBdt)} / bhori
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rateBdt"
                    stroke="#d4af37"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#goldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-aurum-surface/40 border border-aurum-border/60 text-center space-y-2">
              <span className="text-xs font-semibold text-aurum-gold font-mono block">
                Active Benchmark Rate: {formatBDT(endPrice)} / gram ({purity})
              </span>
              <p className="text-xs text-aurum-text-muted max-w-lg mx-auto">
                {data[0]?.notice ||
                  'Single active benchmark circular recorded. Multi-day area trajectory will render as new daily BAJUS circulars are archived in the oracle ledger.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
