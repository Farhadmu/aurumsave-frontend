'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '../lib/api';
import { LivePriceRate, PurityGrade } from '../shared';
import { Badge } from './ui/Badge';
import { TrendingUp, Clock, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { formatBDT } from '../lib/utils';

export default function HeroRealPriceWidget() {
  const [rates, setRates] = useState<LivePriceRate[]>([]);
  const [selectedPurity, setSelectedPurity] = useState<PurityGrade>(PurityGrade.K24);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const fetchRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; data: LivePriceRate[] }>('/gold/prices');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setRates(res.data);
        setLastRefreshed(new Date().toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' }));
      } else {
        // Honest unavailable state — NEVER use fake numbers
        setRates([]);
        setError('Price temporarily unavailable');
      }
    } catch {
      // Honest unavailable state — NEVER use fake numbers
      setRates([]);
      setError('Price feed currently synchronizing');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000); // 1 minute freshness poll
    return () => clearInterval(interval);
  }, []);

  const currentRate = rates.find((r) => r.purity === selectedPurity) || rates[0];

  return (
    <div className="w-full max-w-lg mx-auto bg-aurum-card/90 backdrop-blur-xl border border-aurum-border-gold/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Ambient gold glow behind card */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-aurum-gold/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Top status bar */}
      <div className="flex items-center justify-between gap-2 border-b border-aurum-border/60 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <Badge variant="slate" size="sm">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin text-aurum-gold" />
              Syncing Feed...
            </Badge>
          ) : error || !currentRate ? (
            <Badge variant="rose" size="sm">
              <AlertCircle className="w-3 h-3 mr-1" />
              Feed Unavailable
            </Badge>
          ) : currentRate.isStale ? (
            <Badge variant="amber" size="sm">
              <Clock className="w-3 h-3 mr-1" />
              Prior Circular
            </Badge>
          ) : (
            <Badge variant="emerald" size="sm" pulse>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
              Live Verified Rate
            </Badge>
          )}

          {currentRate && !error && (
            <span className="text-[10px] text-aurum-text-dim hidden xs:inline font-mono">
              {currentRate.source}
            </span>
          )}
        </div>

        {/* Purity toggles */}
        <div className="flex items-center space-x-1 bg-aurum-surface/80 p-0.5 rounded-xl border border-aurum-border">
          {[PurityGrade.K24, PurityGrade.K22].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPurity(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedPurity === p
                  ? 'bg-aurum-gold text-aurum-midnight shadow-sm'
                  : 'text-aurum-text-muted hover:text-aurum-text'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Real Price Body */}
      {error || !currentRate ? (
        <div className="py-6 text-center space-y-2">
          <p className="text-sm font-semibold text-aurum-text">
            {error || 'Price temporarily unavailable'}
          </p>
          <p className="text-xs text-aurum-text-muted max-w-xs mx-auto">
            Market rates are refreshing with official circular benchmarks. You can still explore features.
          </p>
          <button
            onClick={fetchRates}
            className="mt-2 inline-flex items-center space-x-1.5 text-xs text-aurum-gold font-semibold hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                {currentRate.purity} Pure Gold • Per Gram (Buy)
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-aurum-gold">
                  {formatBDT(currentRate.buyPricePerGramBdt)}
                </span>
                <span className="text-xs font-mono text-aurum-text-muted">/ gram</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Sell-Back
              </span>
              <span className="font-mono text-lg font-bold text-aurum-text mt-0.5 block">
                {formatBDT(currentRate.sellPricePerGramBdt)}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {currentRate.spreadPercentage}% tight spread
              </span>
            </div>
          </div>

          {/* Bhori Conversion & Customer Savings Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-aurum-surface/80 border border-aurum-border/80 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono text-aurum-text-dim">
                Official Bhori Rate (11.664g):
              </span>
              <span className="font-mono font-bold text-aurum-text text-sm mt-0.5">
                {formatBDT(currentRate.buyPricePerBhoriBdt)}
              </span>
              <span className="text-[10px] text-aurum-text-muted mt-0.5">
                BAJUS Benchmark Base
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center justify-between">
                <span>Direct Savers&apos; Gain</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[9px]">0% Making</span>
              </span>
              <span className="font-mono font-bold text-emerald-300 text-sm mt-0.5">
                Save ~{formatBDT(Math.round(currentRate.buyPricePerBhoriBdt * 0.055))}/bhori
              </span>
              <span className="text-[10px] text-emerald-400/80 mt-0.5">
                Vs 5-8% retail jewellery wastage
              </span>
            </div>
          </div>

          {/* Action Row & Live Timestamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-aurum-border/60 gap-2 text-xs">
            <div className="flex items-center space-x-1.5 text-aurum-text-dim font-mono text-[11px]">
              <Clock className="w-3 h-3 text-aurum-gold" />
              <span>
                {currentRate.effectiveAt
                  ? `BAJUS Sync: ${new Date(currentRate.effectiveAt).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })}`
                  : lastRefreshed
                  ? `Refreshed at ${lastRefreshed}`
                  : 'Synchronized'}
              </span>
            </div>

            <Link
              href="/trade"
              className="inline-flex items-center space-x-1 font-bold text-aurum-gold hover:text-aurum-gold-light transition-colors group self-start sm:self-auto"
            >
              <span>Instant Buy / Sell Desk</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
