'use client';

import React, { useState } from 'react';
import GoldPriceWidget from '../components/GoldPriceWidget';
import GoldPriceChart from '../components/GoldPriceChart';
import GoldCalculator from '../components/GoldCalculator';
import { Badge } from '../components/ui/Badge';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Scale,
  RefreshCw,
  FileCheck2,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Coins,
  Shield,
  Layers,
  Building,
  Check,
  X,
  Smartphone,
  Truck,
} from 'lucide-react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is digital gold on AurumSave backed by actual physical bullion?',
      a: 'Yes, 100% physically backed and segregated. For every milligram of digital gold purchased through AurumSave, an equivalent amount of physical 24K (99.9% fineness) or 22K (91.6% hallmarked) bullion is purchased from BAJUS certified refiners and allocated in high-security, insured bank-grade vaults. It is not a synthetic derivative or paper promise.',
    },
    {
      q: 'What is the minimum amount required to start saving in gold?',
      a: 'You can start saving with as little as ৳500 or 0.1 grams of gold. Our mission is to make generational wealth preservation accessible to every household across Bangladesh through fractional gold accumulation with zero integer-rounding drift.',
    },
    {
      q: 'How does AurumSave determine its gold buy and sell benchmark rates?',
      a: 'Our benchmark rates are directly synchronized with the official daily rates published by the Bangladesh Jewellers Association (BAJUS). A transparent spread of 2.0% - 2.5% covers assaying, certified tamper-proof custody, bullion insurance, and instant liquidity operations. There are zero hidden making charges.',
    },
    {
      q: 'Can I redeem and withdraw physical gold bars or coins?',
      a: 'Yes. Once your cumulative vault balance reaches 1 Bhori (11.664 grams) or standard denominations (10g, 1 Bhori, 50g, 100g), you can request physical bullion collection or insured secure armored transit delivery across Bangladesh, complete with an individual assay authenticity certificate.',
    },
    {
      q: 'How quickly can I liquidate my gold holdings into cash?',
      a: 'Liquidation is instantaneous. When you sell gold from your vault, funds are immediately credited in Bangladeshi Taka to your Aurum wallet and can be withdrawn directly to your bKash, Nagad, Rocket, or commercial bank account 24/7.',
    },
    {
      q: 'Why is National ID (NID) verification mandatory?',
      a: 'In strict compliance with Bangladesh Financial Intelligence Unit (BFIU) guidelines and Anti-Money Laundering (AML/CFT) regulations, identity verification via Smart NID or Passport is required to ensure non-repudiation and protect your physical bullion property rights.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        {/* Ambient Radial Luxury Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-aurum-gold/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Sovereign Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-aurum-card border border-aurum-border-gold text-xs text-aurum-gold mb-6 shadow-gold-glow animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-aurum-gold animate-ping" />
            <span className="font-semibold tracking-wide">
              Bangladesh&apos;s Sovereign Physical Bullion Savings Infrastructure
            </span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-aurum-text max-w-4xl mx-auto leading-[1.12]">
            Preserve wealth in{' '}
            <span className="gold-gradient-text">Allocated Physical Gold</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-aurum-text-muted max-w-2xl mx-auto leading-relaxed">
            Hedge your Taka against currency inflation. Accumulate 24K & 22K certified gold bullion from as low as ৳500 with instant bKash/Nagad payments, bank-grade insured vaults, and 5-minute guaranteed rate locks.
          </p>

          {/* Call-To-Action Cluster */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-base shadow-gold-glow border border-aurum-gold/50 transition-all flex items-center justify-center space-x-2.5 active:scale-[0.98]"
            >
              <span>Open Free Vault Account</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#calculator"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-aurum-text font-semibold text-base transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Savings Calculator</span>
            </a>
          </div>

          {/* Quick Pillar Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-aurum-border/60 text-left">
            <div className="p-4 rounded-2xl bg-aurum-card/60 border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Starting Minimum
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-gold mt-0.5 block">
                ৳500 / 0.1g
              </span>
              <span className="text-[11px] text-aurum-text-muted">Fractional micro-savings</span>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-card/60 border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Bullion Purity
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-text mt-0.5 block">
                24K & 22K
              </span>
              <span className="text-[11px] text-aurum-text-muted">100% Hallmarked & Assayed</span>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-card/60 border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Benchmark Rates
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5 block">
                BAJUS Sync
              </span>
              <span className="text-[11px] text-aurum-text-muted">Official Daily Circulars</span>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-card/60 border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Vault Custody
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-gold mt-0.5 block">
                Bank-Grade
              </span>
              <span className="text-[11px] text-aurum-text-muted">Lloyd&apos;s Insured</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE MARKET RATES & REAL-TIME CHART SECTION
         ========================================================================= */}
      <section id="rates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" size="sm">
            Real-Time Market Oracles
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Official BAJUS Gold Benchmark Rates
          </h2>
          <p className="text-sm text-aurum-text-muted">
            Transparent buy and sell spreads updated daily. Zero hidden making charges, zero gem deduction losses.
          </p>
        </div>

        {/* Pricing Cards Widget */}
        <GoldPriceWidget />

        {/* Interactive Chart */}
        <GoldPriceChart />
      </section>

      {/* =========================================================================
          INTERACTIVE SAVINGS CALCULATOR
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoldCalculator />
      </section>

      {/* =========================================================================
          WHY ALLOCATED BULLION VS ALTERNATIVES (COMPARISON MATRIX)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="emerald" size="sm">
            Wealth Preservation Analysis
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            AurumSave vs Traditional Alternatives
          </h2>
          <p className="text-sm text-aurum-text-muted">
            Why savvy savers across Bangladesh are choosing segregated digital bullion custody over jewellery and bank deposits.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-aurum-border bg-aurum-card shadow-card-luxury">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-aurum-border bg-aurum-surface/80">
                <th className="py-4 px-6 font-bold text-aurum-text font-serif-luxury">Key Features</th>
                <th className="py-4 px-6 font-bold text-aurum-gold font-serif-luxury bg-aurum-gold/5 border-x border-aurum-gold/20">
                  AurumSave Bullion
                </th>
                <th className="py-4 px-6 font-semibold text-aurum-text-muted">Traditional Jewellery</th>
                <th className="py-4 px-6 font-semibold text-aurum-text-muted">Bank Fixed Deposit (FDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurum-border/60">
              <tr>
                <td className="py-4 px-6 font-medium text-aurum-text">Making & Wastage Charges</td>
                <td className="py-4 px-6 font-bold text-emerald-400 font-mono bg-aurum-gold/5 border-x border-aurum-gold/20">
                  0% (Zero Making Charges)
                </td>
                <td className="py-4 px-6 text-rose-400 font-mono">15% - 25% Deducted</td>
                <td className="py-4 px-6 text-aurum-text-muted">N/A</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-aurum-text">Minimum Entry Barrier</td>
                <td className="py-4 px-6 font-bold text-aurum-gold font-mono bg-aurum-gold/5 border-x border-aurum-gold/20">
                  ৳500 / 0.1 Gram
                </td>
                <td className="py-4 px-6 text-aurum-text-muted">৳15,000+ (Small Ring)</td>
                <td className="py-4 px-6 text-aurum-text-muted">৳50,000+</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-aurum-text">Inflation Hedge Performance</td>
                <td className="py-4 px-6 font-bold text-emerald-400 bg-aurum-gold/5 border-x border-aurum-gold/20">
                  Superior (+14.2% historic 1Y)
                </td>
                <td className="py-4 px-6 text-aurum-text-muted">Moderate (Offset by making charges)</td>
                <td className="py-4 px-6 text-rose-400">Negative (Eaten by inflation)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-aurum-text">Storage & Theft Risk</td>
                <td className="py-4 px-6 font-bold text-emerald-400 bg-aurum-gold/5 border-x border-aurum-gold/20">
                  Zero (Bank Vaulted & Insured)
                </td>
                <td className="py-4 px-6 text-rose-400">High (Home Burglary Risk)</td>
                <td className="py-4 px-6 text-aurum-text-muted">Zero</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-aurum-text">Liquidity & Instant Cash</td>
                <td className="py-4 px-6 font-bold text-aurum-gold bg-aurum-gold/5 border-x border-aurum-gold/20">
                  Instant (24/7 to bKash/Nagad)
                </td>
                <td className="py-4 px-6 text-aurum-text-muted">In-person shop negotiation</td>
                <td className="py-4 px-6 text-rose-400">Penalty on premature break</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-aurum-text">Physical Gold Delivery</td>
                <td className="py-4 px-6 font-bold text-emerald-400 bg-aurum-gold/5 border-x border-aurum-gold/20">
                  On-demand (From 1 Bhori)
                </td>
                <td className="py-4 px-6 text-aurum-text-muted">Immediate</td>
                <td className="py-4 px-6 text-rose-400">Never (Paper Fiat)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          VAULT CUSTODY & INSTITUTIONAL SECURITY
         ========================================================================= */}
      <section id="vault" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" size="sm">
            Institutional Trust Architecture
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Custody Guaranteed by Bank-Grade Vaults
          </h2>
          <p className="text-sm text-aurum-text-muted">
            Your physical gold is held in segregated accounts, never lent out, never re-hypothecated, and audited regularly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border space-y-4 hover:border-aurum-gold/40 transition-all shadow-card-luxury">
            <div className="w-12 h-12 rounded-2xl bg-aurum-gold/15 border border-aurum-gold/30 flex items-center justify-center text-aurum-gold">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Tier-1 Insured Vaults
            </h3>
            <p className="text-xs sm:text-sm text-aurum-text-muted leading-relaxed">
              Allocated physical bars are housed in certified Class-III bank vaults in Dhaka with biometric access, dual-custody protocols, and Lloyd&apos;s of London insurance underwriting.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border space-y-4 hover:border-aurum-gold/40 transition-all shadow-card-luxury">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Double-Entry Ledger
            </h3>
            <p className="text-xs sm:text-sm text-aurum-text-muted leading-relaxed">
              Every milligram of gold purchase, sale, transfer, and redemption is sealed in an immutable cryptographic journal with zero integer rounding drift.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border space-y-4 hover:border-aurum-gold/40 transition-all shadow-card-luxury">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Physical Bar Delivery
            </h3>
            <p className="text-xs sm:text-sm text-aurum-text-muted leading-relaxed">
              Redeem physical bullion at 1 Bhori (11.664g), 50g, or 100g. Collect from custody centers or receive insured armored door-to-door courier delivery.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (STEP BY STEP)
         ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" size="sm">
            Effortless Micro-Savings
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            How to Build Your Bullion Vault
          </h2>
          <p className="text-sm text-aurum-text-muted">
            Start in less than 3 minutes directly from your phone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3">
            <span className="font-serif-luxury text-4xl font-black text-aurum-gold/30">01</span>
            <h4 className="font-bold text-base text-aurum-text">Open Free Account</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Sign up with your phone number and verify your identity using your Smart NID or Passport.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3">
            <span className="font-serif-luxury text-4xl font-black text-aurum-gold/30">02</span>
            <h4 className="font-bold text-base text-aurum-text">Lock Live Rate</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Choose 24K or 22K gold. Lock guaranteed BAJUS rates for 5 minutes during purchase.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3">
            <span className="font-serif-luxury text-4xl font-black text-aurum-gold/30">03</span>
            <h4 className="font-bold text-base text-aurum-text">Pay via bKash or Bank</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Complete instant micro-payments from ৳500 using bKash, Nagad, Rocket, or internet banking.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3">
            <span className="font-serif-luxury text-4xl font-black text-aurum-gold/30">04</span>
            <h4 className="font-bold text-base text-aurum-text">Hold, Sell, or Deliver</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Watch your wealth appreciate, liquidate for instant cash, or request physical bullion delivery.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION SECTION
         ========================================================================= */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="gold" size="sm">
            Answers & Clarifications
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-aurum-text-muted">
            Everything you need to know about allocated physical digital gold in Bangladesh.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-aurum-border bg-aurum-card overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full py-4 px-6 flex items-center justify-between text-left focus:outline-none focus-visible:bg-aurum-surface"
                >
                  <span className="text-sm sm:text-base font-bold text-aurum-text pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-aurum-gold shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-aurum-text-muted leading-relaxed border-t border-aurum-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION BANNER
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-aurum-card via-aurum-surface to-aurum-card border border-aurum-border-gold p-8 sm:p-14 text-center relative overflow-hidden shadow-card-luxury">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-aurum-gold/15 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-aurum-text relative z-10 max-w-2xl mx-auto">
            Start Accumulating Sovereign Gold Today
          </h2>
          <p className="mt-4 text-sm sm:text-base text-aurum-text-muted max-w-xl mx-auto relative z-10">
            Join thousands of smart savers protecting their family&apos;s financial future with 24K pure bullion.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-base shadow-gold-glow border border-aurum-gold/40 transition-all flex items-center justify-center space-x-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/trade"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/40 text-aurum-text font-bold text-base transition-all"
            >
              View Live Trade Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
