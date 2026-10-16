'use client';

import React, { useState, useEffect } from 'react';
import { PurityGrade, CONVERSIONS, LivePriceRate } from '../shared';
import { formatBDT } from '../lib/utils';
import { apiRequest } from '../lib/api';
import { Badge } from './ui/Badge';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Percent,
  Coins,
  Info,
} from 'lucide-react';

export default function GoldCalculator() {
  const [mode, setMode] = useState<'BDT' | 'GRAM'>('BDT');
  const [bdtAmount, setBdtAmount] = useState<number>(10000);
  const [purity, setPurity] = useState<PurityGrade>(PurityGrade.K24);
  const [liveRates, setLiveRates] = useState<Record<string, number>>({});
  const [ratesAvailable, setRatesAvailable] = useState<boolean>(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: LivePriceRate[] }>('/gold/prices');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const map: Record<string, number> = {};
          res.data.forEach((r) => {
            map[r.purity] = r.buyPricePerGramBdt;
          });
          setLiveRates(map);
          setRatesAvailable(true);
        }
      } catch {
        setRatesAvailable(false);
      }
    };
    fetchRates();
  }, []);

  // Use verified live rates or transparent fallback notice
  const ratePerGram = liveRates[purity] || (purity === PurityGrade.K24 ? 12450 : 11412);

  const calculatedGrams =
    mode === 'BDT'
      ? Number((bdtAmount / ratePerGram).toFixed(4))
      : Number(bdtAmount.toFixed(4));

  const totalCostBdt =
    mode === 'BDT' ? bdtAmount : Math.round(bdtAmount * ratePerGram);

  const calculatedBhori = (calculatedGrams / CONVERSIONS.GRAMS_PER_BHORI).toFixed(3);
  const estimatedPlatformFee = Math.round(totalCostBdt * 0.005); // 0.5%
  const grandTotal = totalCostBdt + estimatedPlatformFee;

  const presetAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  return (
    <div
      id="calculator"
      className="rounded-3xl bg-aurum-card border border-aurum-border-gold p-6 sm:p-10 shadow-card-luxury relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-aurum-gold/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-aurum-border">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="gold" pulse size="sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Accumulation Simulator
            </Badge>
          </div>
          <h3 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-aurum-text tracking-tight">
            Calculate Your Bullion Reserve
          </h3>
          <p className="text-xs sm:text-sm text-aurum-text-muted mt-1.5 max-w-xl">
            Simulate physical gold accumulation based on your personal budget starting at ৳500 with zero rounding loss.
          </p>
        </div>

        {/* Purity Selector */}
        <div className="flex items-center space-x-2 bg-aurum-surface p-1.5 rounded-2xl border border-aurum-border self-start md:self-center">
          <button
            onClick={() => setPurity(PurityGrade.K24)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              purity === PurityGrade.K24
                ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
                : 'text-aurum-text-muted hover:text-aurum-text'
            }`}
          >
            24K (99.9% Bullion)
          </button>
          <button
            onClick={() => setPurity(PurityGrade.K22)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              purity === PurityGrade.K22
                ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
                : 'text-aurum-text-muted hover:text-aurum-text'
            }`}
          >
            22K (Hallmark)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 pt-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim">
              Denominate In
            </label>
            <div className="flex rounded-xl bg-aurum-surface p-1 border border-aurum-border text-xs font-semibold">
              <button
                onClick={() => {
                  setMode('BDT');
                  setBdtAmount(10000);
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  mode === 'BDT'
                    ? 'bg-aurum-gold text-aurum-midnight font-bold shadow-sm'
                    : 'text-aurum-text-muted'
                }`}
              >
                Fixed Taka (৳)
              </button>
              <button
                onClick={() => {
                  setMode('GRAM');
                  setBdtAmount(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  mode === 'GRAM'
                    ? 'bg-aurum-gold text-aurum-midnight font-bold shadow-sm'
                    : 'text-aurum-text-muted'
                }`}
              >
                Grams (g)
              </button>
            </div>
          </div>

          {/* Interactive Input */}
          <div className="p-5 rounded-2xl bg-aurum-surface border border-aurum-border focus-within:border-aurum-gold/60 focus-within:ring-2 focus-within:ring-aurum-gold/20 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-aurum-text-muted">
                {mode === 'BDT' ? 'Budget Amount (BDT)' : 'Target Gold Weight (Grams)'}
              </span>
              <span className="text-xs font-mono text-aurum-gold font-bold">
                {ratesAvailable ? `Live Rate: ৳${ratePerGram.toLocaleString()}/g` : `Benchmark Rate: ৳${ratePerGram.toLocaleString()}/g`}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-aurum-gold">
                {mode === 'BDT' ? '৳' : 'g'}
              </span>
              <input
                type="number"
                min={mode === 'BDT' ? 500 : 0.05}
                max={mode === 'BDT' ? 5000000 : 500}
                step={mode === 'BDT' ? 500 : 0.1}
                value={bdtAmount}
                onChange={(e) => setBdtAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent text-3xl sm:text-4xl font-bold font-mono text-aurum-text focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] uppercase font-mono tracking-wider text-aurum-text-dim block mb-2 font-semibold">
              Quick Micro-Allocation Presets
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setMode('BDT');
                    setBdtAmount(amt);
                  }}
                  className={`py-2 px-1 text-xs font-mono font-semibold rounded-xl border transition-all ${
                    mode === 'BDT' && bdtAmount === amt
                      ? 'bg-aurum-gold/20 border-aurum-gold text-aurum-gold'
                      : 'bg-aurum-surface border-aurum-border text-aurum-text-muted hover:text-aurum-text hover:border-aurum-gold/40'
                  }`}
                >
                  ৳{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* Hypothetical Projection Disclaimer */}
          <div className="p-4 rounded-2xl bg-aurum-surface/50 border border-aurum-border text-xs flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-aurum-gold shrink-0 mt-0.5" />
            <p className="text-aurum-text-muted leading-relaxed">
              <strong className="text-aurum-text">Hypothetical Simulation:</strong> Gold is a physical commodity whose market price fluctuates. Projections are purely illustrative based on benchmark circulars; AurumSave makes no guarantees regarding future gold prices or appreciation.
            </p>
          </div>
        </div>

        {/* Right Output Vault Allocation Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-aurum-surface border border-aurum-border relative">
          <div className="space-y-6">
            <div>
              <span className="text-[11px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Estimated Bullion Allocation
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="font-serif-luxury text-4xl sm:text-5xl font-black text-aurum-text">
                  {calculatedGrams.toLocaleString()}
                </span>
                <span className="text-xl font-bold font-mono text-aurum-gold">
                  Grams ({purity})
                </span>
              </div>
              <p className="text-xs font-mono text-aurum-text-dim mt-1">
                Equivalent to <strong>{calculatedBhori} Bhori</strong> (1 Bhori = 11.664g)
              </p>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-aurum-border text-xs">
              <div className="flex justify-between text-aurum-text-muted">
                <span>Gold Bullion Cost:</span>
                <span className="font-mono text-aurum-text">{formatBDT(totalCostBdt)}</span>
              </div>
              <div className="flex justify-between text-aurum-text-muted">
                <span>Custody & Assurance Fee (0.5%):</span>
                <span className="font-mono text-aurum-text">{formatBDT(estimatedPlatformFee)}</span>
              </div>
              <div className="flex justify-between text-aurum-text-muted">
                <span>Segregated Vault Custody:</span>
                <span className="font-mono text-emerald-400 font-semibold">Included</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-aurum-border text-aurum-text">
                <span>Total Estimated Payable:</span>
                <span className="font-mono text-aurum-gold text-base">{formatBDT(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-aurum-border space-y-3">
            <a
              href={`/trade?purity=${purity}&amount=${totalCostBdt}&type=BUY`}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-sm shadow-gold-glow border border-aurum-gold/40 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              <span>Explore Trade Desk</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex items-center justify-center space-x-2 text-[11px] text-aurum-text-dim">
              <ShieldCheck className="w-3.5 h-3.5 text-aurum-gold" />
              <span>Instant bKash, Nagad & Bank Settlement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
