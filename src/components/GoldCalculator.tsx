'use client';

import React, { useState } from 'react';
import { PurityGrade, CONVERSIONS } from '@aurumsave/shared';
import { Calculator, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function GoldCalculator() {
  const [mode, setMode] = useState<'BDT' | 'GRAM'>('BDT');
  const [bdtAmount, setBdtAmount] = useState<number>(10000);
  const [purity, setPurity] = useState<PurityGrade>(PurityGrade.K24);

  // Approximate rate per gram
  const ratePerGram = purity === PurityGrade.K24 ? 12450 : 11412;

  const calculatedGrams =
    mode === 'BDT'
      ? Number((bdtAmount / ratePerGram).toFixed(3))
      : Number((bdtAmount).toFixed(3));

  const totalCostBdt =
    mode === 'BDT'
      ? bdtAmount
      : Math.round(bdtAmount * ratePerGram);

  const calculatedBhori = Number((calculatedGrams / CONVERSIONS.GRAMS_PER_BHORI).toFixed(3));
  const estimatedPlatformFee = Math.round(totalCostBdt * 0.005); // 0.5%
  const grandTotal = totalCostBdt + estimatedPlatformFee;

  return (
    <div className="rounded-3xl bg-gradient-to-b from-aurum-card via-aurum-surface to-aurum-card border border-aurum-border p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-aurum-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-aurum-border">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-aurum-gold/10 border border-aurum-gold/20 text-aurum-gold text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Micro-Savings Estimator</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-aurum-ivory">
            Calculate Your Gold Accumulation
          </h3>
          <p className="text-xs sm:text-sm text-aurum-muted mt-1">
            Start saving in micro-quantities from as low as ৳500 or 0.1 grams with transparent spreads.
          </p>
        </div>

        {/* Purity Selector */}
        <div className="flex items-center space-x-2 bg-aurum-navy p-1.5 rounded-xl border border-aurum-border self-start">
          <button
            onClick={() => setPurity(PurityGrade.K24)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              purity === PurityGrade.K24
                ? 'bg-aurum-gold text-aurum-navy shadow-gold-glow'
                : 'text-aurum-muted hover:text-aurum-ivory'
            }`}
          >
            24K (99.9% Pure)
          </button>
          <button
            onClick={() => setPurity(PurityGrade.K22)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              purity === PurityGrade.K22
                ? 'bg-aurum-gold text-aurum-navy shadow-gold-glow'
                : 'text-aurum-muted hover:text-aurum-ivory'
            }`}
          >
            22K (Hallmark)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-aurum-muted">
              I Want to Save By
            </label>
            <div className="flex rounded-lg bg-aurum-navy p-1 border border-aurum-border text-xs">
              <button
                onClick={() => {
                  setMode('BDT');
                  setBdtAmount(10000);
                }}
                className={`px-3 py-1 rounded font-semibold transition-all ${
                  mode === 'BDT' ? 'bg-aurum-gold text-aurum-navy' : 'text-aurum-muted'
                }`}
              >
                Fixed Taka (৳)
              </button>
              <button
                onClick={() => {
                  setMode('GRAM');
                  setBdtAmount(1);
                }}
                className={`px-3 py-1 rounded font-semibold transition-all ${
                  mode === 'GRAM' ? 'bg-aurum-gold text-aurum-navy' : 'text-aurum-muted'
                }`}
              >
                Grams (g)
              </button>
            </div>
          </div>

          <div>
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-aurum-gold font-bold font-mono text-xl">
                {mode === 'BDT' ? '৳' : 'g'}
              </span>
              <input
                type="number"
                min={mode === 'BDT' ? 500 : 0.1}
                step={mode === 'BDT' ? 500 : 0.1}
                value={bdtAmount}
                onChange={(e) => setBdtAmount(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-aurum-navy border border-aurum-border text-2xl font-mono font-bold text-aurum-ivory focus:border-aurum-gold focus:ring-1 focus:ring-aurum-gold transition-all"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {mode === 'BDT'
                ? [2000, 5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBdtAmount(amt)}
                      className="px-3 py-1.5 rounded-lg bg-aurum-surface border border-aurum-border text-xs font-medium text-aurum-muted hover:text-aurum-gold hover:border-aurum-gold/40 transition-all"
                    >
                      ৳{amt.toLocaleString()}
                    </button>
                  ))
                : [0.5, 1, 2.5, 5, 11.664].map((g) => (
                    <button
                      key={g}
                      onClick={() => setBdtAmount(g)}
                      className="px-3 py-1.5 rounded-lg bg-aurum-surface border border-aurum-border text-xs font-medium text-aurum-muted hover:text-aurum-gold hover:border-aurum-gold/40 transition-all"
                    >
                      {g === 11.664 ? '1 Bhori (11.66g)' : `${g}g`}
                    </button>
                  ))}
            </div>
          </div>

          {/* Micro-Savings Transparency Guarantee */}
          <div className="p-4 rounded-xl bg-aurum-navy/70 border border-aurum-border/60 text-xs text-aurum-muted space-y-2">
            <div className="flex items-center space-x-2 text-aurum-ivory font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Bullion Backing & Free Custody</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every taka is converted into physical allocated bullion stored in insured bank vaults. No annual account maintenance fees. No hidden locker rents.
            </p>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-aurum-surface border border-aurum-border/80 relative">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-aurum-slate font-semibold block mb-1">
              Estimated Gold Allocated
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-mono font-black text-aurum-gold">
                {calculatedGrams.toLocaleString()}
              </span>
              <span className="text-base text-aurum-ivory font-bold">Grams</span>
            </div>
            <p className="text-xs text-aurum-muted mt-1">
              Equivalent to <strong className="text-aurum-ivory font-medium">{calculatedBhori} Bhori</strong> (1 Bhori = 11.664g)
            </p>

            <div className="mt-6 space-y-3 pt-4 border-t border-aurum-border text-xs">
              <div className="flex justify-between text-aurum-muted">
                <span>Gold Rate ({purity})</span>
                <span className="font-mono text-aurum-ivory">৳{ratePerGram.toLocaleString()}/g</span>
              </div>
              <div className="flex justify-between text-aurum-muted">
                <span>Subtotal</span>
                <span className="font-mono text-aurum-ivory">৳{totalCostBdt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-aurum-muted">
                <span>Platform Processing (0.5%)</span>
                <span className="font-mono text-aurum-ivory">৳{estimatedPlatformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-aurum-muted">
                <span>Insured Vault Custody</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-aurum-ivory pt-2 border-t border-aurum-border">
                <span>Total Payable</span>
                <span className="font-mono text-aurum-gold">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <a
            href={`/trade?purity=${purity}&amount=${totalCostBdt}`}
            className="mt-6 w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-sm shadow-gold-glow transition-all"
          >
            <span>Lock In This Rate</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
