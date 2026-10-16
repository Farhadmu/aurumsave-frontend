'use client';

import React, { useEffect, useState } from 'react';
import { PurityGrade, LivePriceRate, CONVERSIONS } from '@aurumsave/shared';
import { apiRequest } from '../lib/api';
import { TrendingUp, Clock, Info, ShieldCheck } from 'lucide-react';

export default function GoldPriceWidget() {
  const [rates, setRates] = useState<LivePriceRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<'GRAM' | 'BHORI'>('GRAM');

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await apiRequest<{ success: boolean; data: LivePriceRate[] }>('/gold/prices');
        if (res.success && res.data) {
          setRates(res.data);
        }
      } catch (err) {
        console.error('Failed to load gold rates:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRates();
    const interval = setInterval(loadRates, 60000); // 1 minute auto refresh
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-aurum-surface/60 border border-aurum-border/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unit Selector Toggle & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center space-x-2 text-xs text-aurum-muted">
          <Clock className="w-3.5 h-3.5 text-aurum-gold" />
          <span>
            Rates Effective:{' '}
            <strong className="text-aurum-ivory font-medium">
              {rates[0]?.effectiveAt ? new Date(rates[0].effectiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
            </strong>
          </span>
          <span className="text-aurum-border">•</span>
          <span className="text-emerald-400 font-medium">Market Active</span>
        </div>

        <div className="inline-flex items-center rounded-lg bg-aurum-card p-1 border border-aurum-border text-xs">
          <button
            onClick={() => setSelectedUnit('GRAM')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedUnit === 'GRAM'
                ? 'bg-aurum-gold text-aurum-navy shadow-sm'
                : 'text-aurum-muted hover:text-aurum-ivory'
            }`}
          >
            Per Gram (g)
          </button>
          <button
            onClick={() => setSelectedUnit('BHORI')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedUnit === 'BHORI'
                ? 'bg-aurum-gold text-aurum-navy shadow-sm'
                : 'text-aurum-muted hover:text-aurum-ivory'
            }`}
          >
            Per Bhori / Tola (11.664g)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rates.map((rate) => {
          const buyPrice =
            selectedUnit === 'GRAM' ? rate.buyPricePerGramBdt : rate.buyPricePerBhoriBdt;
          const sellPrice =
            selectedUnit === 'GRAM' ? rate.sellPricePerGramBdt : rate.sellPricePerBhoriBdt;
          const isK24 = rate.purity === PurityGrade.K24;

          return (
            <div
              key={rate.purity}
              className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                isK24
                  ? 'bg-gradient-to-b from-aurum-card via-aurum-surface to-aurum-card border-2 border-aurum-gold/40 shadow-gold-glow'
                  : 'bg-aurum-card border border-aurum-border hover:border-aurum-gold/30'
              }`}
            >
              {isK24 && (
                <div className="absolute top-0 right-0 bg-aurum-gold text-aurum-navy text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-bl-lg">
                  Finest Bullion
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-aurum-ivory">
                    {rate.purity}
                  </h3>
                  <p className="text-[11px] text-aurum-muted">
                    {rate.purity === PurityGrade.K24
                      ? '99.9% 24 Karat Pure'
                      : rate.purity === PurityGrade.K22
                      ? '91.6% Hallmark Standard'
                      : rate.purity === PurityGrade.K21
                      ? '87.5% Hallmark Jewelry'
                      : '75.0% Fine Gold'}
                  </p>
                </div>
              </div>

              {/* Buy Price */}
              <div className="mb-3 p-3 rounded-xl bg-aurum-surface/80 border border-aurum-border/60">
                <span className="text-[10px] uppercase tracking-wider text-aurum-muted font-semibold block">
                  You Buy At
                </span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-xl font-bold font-mono text-aurum-gold">
                    ৳{buyPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-aurum-slate">
                    /{selectedUnit === 'GRAM' ? 'g' : 'bhori'}
                  </span>
                </div>
              </div>

              {/* Sell Price & Spread */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-aurum-border/40">
                <div>
                  <span className="text-aurum-slate block text-[10px]">You Sell At</span>
                  <span className="font-mono font-medium text-aurum-ivory">
                    ৳{sellPrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-aurum-slate block text-[10px]">Spread</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    {rate.spreadPercentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-muted flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-aurum-gold flex-shrink-0" />
          <span>
            Guaranteed physical allocation. Spreads are locked for 5 minutes during checkout to protect against market slippage.
          </span>
        </div>
        <a href="#how-it-works" className="text-aurum-gold hover:underline whitespace-nowrap ml-4">
          Spread Methodology &rarr;
        </a>
      </div>
    </div>
  );
}
