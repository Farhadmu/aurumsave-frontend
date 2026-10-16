'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HeroGoldSlideshow from '../components/HeroGoldSlideshow';
import HeroRealPriceWidget from '../components/HeroRealPriceWidget';
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
  Smartphone,
  Truck,
  Heart,
  GraduationCap,
  Home,
  AlertCircle,
  HelpCircle,
  PieChart,
  Repeat,
  BookOpen,
} from 'lucide-react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does digital gold savings work on AurumSave?',
      a: 'When you purchase digital gold on AurumSave, you acquire legal and beneficial ownership of physical 24K (99.9% pure) or 22K hallmarked investment-grade bullion. Every milligram purchased is recorded in our auditable double-entry cryptographic ledger and held in segregated custody on your behalf.',
    },
    {
      q: 'How are live gold prices calculated and updated?',
      a: 'AurumSave synchronizes directly with official daily price circulars published by the Bangladesh Jewellers Association (BAJUS). All rates specify both buy and sell prices per gram and per bhori, with clear timestamps indicating freshness.',
    },
    {
      q: 'What fees apply to gold transactions?',
      a: 'AurumSave charges 0% making charges and 0% wastage fees on bullion accumulation. Purchases incur an explicit 0.5% custody and assay fee clearly itemized prior to payment. The buy/sell spread is completely transparent with zero hidden deductions.',
    },
    {
      q: 'Which payment methods are supported for deposits and liquidations?',
      a: 'You can fund micro-savings starting from ৳500 instantly via bKash, Nagad, Rocket, or Bangladeshi bank transfers. When you sell gold back, the proceeds are disbursed directly to your verified MFS wallet or bank account.',
    },
    {
      q: 'Is identity verification (KYC) required?',
      a: 'Yes. In adherence to Bangladesh Bank and BFIU guidelines, users complete identity verification using their National ID (Smart NID) or Passport before initiating high-volume transactions or physical redemption.',
    },
    {
      q: 'Can I redeem physical gold bullion?',
      a: 'Yes. Customers holding a minimum of 1 Bhori (11.664 grams) of accumulated 24K or 22K gold may request physical delivery of certified hallmarked bars, subject to operational scheduling and authorized custody center verification.',
    },
    {
      q: 'Can support staff or administrators access my gold?',
      a: 'No. The platform enforces strict role-based separation of concerns. Support staff have zero financial execution authority, while all ledger movements require cryptographically signed multi-party authorization.',
    },
  ];

  const savingsGoals = [
    {
      id: 'wedding',
      title: 'Wedding Reserve',
      icon: Heart,
      color: 'rose',
      desc: 'Accumulate sovereign gold incrementally for dowry-free marital security.',
      typicalHorizon: '12 – 36 Months',
    },
    {
      id: 'education',
      title: 'Higher Education Fund',
      icon: GraduationCap,
      color: 'sky',
      desc: 'Hedge future university tuition against currency inflation with pure bullion.',
      typicalHorizon: '3 – 7 Years',
    },
    {
      id: 'family',
      title: 'Family Legacy Vault',
      icon: Home,
      color: 'emerald',
      desc: 'Build generational wealth with shared collective family savings goals.',
      typicalHorizon: 'Ongoing Accumulation',
    },
    {
      id: 'hajj',
      title: 'Hajj & Pilgrimage Reserve',
      icon: Award,
      color: 'amber',
      desc: 'Disciplined micro-gold savings earmarked for sacred pilgrimage travel costs.',
      typicalHorizon: '24 – 48 Months',
    },
    {
      id: 'emergency',
      title: 'Emergency Gold Reserve',
      icon: ShieldCheck,
      color: 'gold',
      desc: 'A liquid safe-haven reserve that can be liquidated 24/7 to bKash or Nagad.',
      typicalHorizon: 'Instant Liquidity',
    },
    {
      id: 'custom',
      title: 'Custom Wealth Goal',
      icon: Sparkles,
      color: 'purple',
      desc: 'Design personal milestones denominated in exact grams or bhori.',
      typicalHorizon: 'Flexible Timeline',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* =========================================================================
          SECTION 1 — CINEMATIC GOLD HERO & REAL-PRICE WIDGET
         ========================================================================= */}
      <HeroGoldSlideshow intervalMs={6500}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-12 text-center">
          {/* Sovereign Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-aurum-midnight/80 border border-aurum-border-gold text-xs text-aurum-gold mb-6 shadow-gold-glow backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-aurum-gold animate-ping" />
            <span className="font-semibold tracking-wide">
              Bangladesh Sovereign Digital Bullion Infrastructure
            </span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-aurum-text max-w-4xl mx-auto leading-[1.12]">
            Your Gold. Your Goals.{' '}
            <span className="gold-gradient-text block sm:inline">Your Future.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-aurum-text-muted max-w-2xl mx-auto leading-relaxed">
            Build disciplined gold savings with transparent pricing, clear ownership records, and tools designed around your real financial goals.
          </p>

          {/* Primary & Secondary Call-To-Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-base shadow-gold-glow border border-aurum-gold/50 transition-all flex items-center justify-center space-x-2.5 active:scale-[0.98]"
            >
              <span>Start Saving in Gold</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-aurum-card/80 backdrop-blur-md border border-aurum-border hover:border-aurum-gold/50 text-aurum-text font-semibold text-base transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore How It Works</span>
            </a>
          </div>

          {/* Hero Verified Real-Price Widget */}
          <div className="mt-12">
            <HeroRealPriceWidget />
          </div>

          {/* Pillar Metric Highlights Bar (Strictly Factual) */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-aurum-card/80 backdrop-blur-md border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Starting Minimum
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-gold mt-0.5 block">
                ৳500 / 0.1g
              </span>
              <span className="text-[11px] text-aurum-text-muted">Fractional micro-savings</span>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-card/80 backdrop-blur-md border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Bullion Purity
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-text mt-0.5 block">
                24K & 22K
              </span>
              <span className="text-[11px] text-aurum-text-muted">100% Hallmarked & Assayed</span>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-card/80 backdrop-blur-md border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Benchmark Rates
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5 block">
                BAJUS Sync
              </span>
              <span className="text-[11px] text-aurum-text-muted">Official Daily Circulars</span>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-card/80 backdrop-blur-md border border-aurum-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                Ledger Custody
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-gold mt-0.5 block">
                Double-Entry
              </span>
              <span className="text-[11px] text-aurum-text-muted">Cryptographically Audited</span>
            </div>
          </div>
        </div>
      </HeroGoldSlideshow>

      {/* =========================================================================
          SECTION 2 — LIVE GOLD PRICE PREVIEW & VERIFIED HISTORY
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
            Transparent buy and sell spreads updated daily across 24K, 22K, 21K, and 18K purities. Zero hidden deductions.
          </p>
        </div>

        {/* Pricing Cards Widget (Real Data Only) */}
        <GoldPriceWidget />

        {/* Real-Data Historical Chart */}
        <GoldPriceChart />
      </section>

      {/* =========================================================================
          SECTION 3 — HOW AURUMSAVE WORKS (THE VERIFIED CUSTOMER JOURNEY)
         ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" size="sm">
            Streamlined FinTech Architecture
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            How AurumSave Works
          </h2>
          <p className="text-sm text-aurum-text-muted">
            From initial registration to physical bar redemption, every step is built around transparency and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3 hover:border-aurum-gold/40 transition-colors">
            <span className="font-serif-luxury text-3xl font-black text-aurum-gold/30">01</span>
            <h4 className="font-bold text-base text-aurum-text">Open an Account</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Register quickly with your mobile number and set up secure PIN or biometric authentication.
            </p>
            <Link href="/register" className="inline-flex items-center space-x-1 text-xs text-aurum-gold font-bold hover:underline pt-1">
              <span>Sign Up</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3 hover:border-aurum-gold/40 transition-colors">
            <span className="font-serif-luxury text-3xl font-black text-aurum-gold/30">02</span>
            <h4 className="font-bold text-base text-aurum-text">Complete Smart KYC</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Verify your identity using your Smart NID or Passport in compliance with BFIU compliance standards.
            </p>
            <Link href="/kyc" className="inline-flex items-center space-x-1 text-xs text-aurum-gold font-bold hover:underline pt-1">
              <span>View KYC Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3 hover:border-aurum-gold/40 transition-colors">
            <span className="font-serif-luxury text-3xl font-black text-aurum-gold/30">03</span>
            <h4 className="font-bold text-base text-aurum-text">Lock Live Rate (5-Min Quote)</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Select 24K or 22K bullion. Review exact grammage, transparent spread, and lock guaranteed rates for 5 minutes.
            </p>
            <Link href="/trade" className="inline-flex items-center space-x-1 text-xs text-aurum-gold font-bold hover:underline pt-1">
              <span>Live Trade Desk</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3 hover:border-aurum-gold/40 transition-colors">
            <span className="font-serif-luxury text-3xl font-black text-aurum-gold/30">04</span>
            <h4 className="font-bold text-base text-aurum-text">Instant MFS Settlement</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Pay micro-deposits from ৳500 seamlessly via bKash, Nagad, Rocket, or internet banking with zero latency.
            </p>
            <span className="text-[11px] text-aurum-text-dim block pt-1 font-mono">
              Direct Gateway Integration
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3 hover:border-aurum-gold/40 transition-colors">
            <span className="font-serif-luxury text-3xl font-black text-aurum-gold/30">05</span>
            <h4 className="font-bold text-base text-aurum-text">Track Verified Holdings</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Every milligram is sealed in an immutable cryptographic journal. Download official CSV statements anytime.
            </p>
            <Link href="/dashboard" className="inline-flex items-center space-x-1 text-xs text-aurum-gold font-bold hover:underline pt-1">
              <span>Customer Vault</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border relative space-y-3 hover:border-aurum-gold/40 transition-colors">
            <span className="font-serif-luxury text-3xl font-black text-aurum-gold/30">06</span>
            <h4 className="font-bold text-base text-aurum-text">Liquidate or Take Delivery</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Sell back instantly for MFS disbursement or request physical hallmarked bullion delivery starting from 1 Bhori.
            </p>
            <Link href="/academy" className="inline-flex items-center space-x-1 text-xs text-aurum-gold font-bold hover:underline pt-1">
              <span>Redemption Guide</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — GOAL-BASED GOLD SAVINGS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" size="sm">
            Disciplined Wealth Creation
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Goal-Based Gold Savings
          </h2>
          <p className="text-sm text-aurum-text-muted">
            Transform abstract savings into tangible bullion targets for life&apos;s most meaningful milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsGoals.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                className="p-6 rounded-3xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all shadow-card-luxury space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-aurum-surface border border-aurum-border flex items-center justify-center text-aurum-gold">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-aurum-text">
                    {g.title}
                  </h3>
                  <span className="text-[11px] font-mono text-aurum-gold font-semibold block mt-0.5">
                    Target Horizon: {g.typicalHorizon}
                  </span>
                </div>
                <p className="text-xs text-aurum-text-muted leading-relaxed">
                  {g.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/goals"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-aurum-text font-bold text-sm transition-all"
          >
            <span>Explore Savings Goals & Collaborative Vaults</span>
            <ArrowRight className="w-4 h-4 text-aurum-gold" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — TRANSPARENT PRICING ARCHITECTURE
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="emerald" size="sm">
            Zero Hidden Fees
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Transparent Pricing Policy
          </h2>
          <p className="text-sm text-aurum-text-muted">
            We believe trust starts with complete pricing visibility. Here is exactly how our buy and sell spreads work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              1. Direct BAJUS Alignment
            </h3>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Every gold buy and sell quotation is anchored to the official Bangladesh Jewellers Association daily circular.
            </p>
            <ul className="text-xs text-aurum-text-dim space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero making charges (0% deduction)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero gem deduction losses</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              2. 5-Minute Quote Expiry Lock
            </h3>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              When you initiate an order, your rate is locked for exactly 300 seconds. No price slippage during checkout.
            </p>
            <ul className="text-xs text-aurum-text-dim space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Guaranteed price during payment</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Automated quote refresh if expired</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              3. Itemized 0.5% Custody Fee
            </h3>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              A single, transparent 0.5% custody and assay fee covers segregated vaulting, assay verification, and audit logs.
            </p>
            <ul className="text-xs text-aurum-text-dim space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Clearly displayed before you confirm</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero recurring annual storage charges</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — WEALTH INTELLIGENCE & PORTFOLIO TOOLS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" size="sm">
            Analytical Clarity
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Wealth Intelligence & Tracking
          </h2>
          <p className="text-sm text-aurum-text-muted">
            Institutional-grade transparency into your holdings, average cost basis, and historical performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-aurum-surface border border-aurum-border flex items-center justify-center text-aurum-gold">
              <PieChart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-aurum-text">Purity Breakdown</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Track allocated milligrams across 24K and 22K purities with automated Bhori conversions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-aurum-surface border border-aurum-border flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-aurum-text">Cost Basis & Valuation</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Monitor your total BDT capital deployed against real-time indicative liquidation value.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-aurum-surface border border-aurum-border flex items-center justify-center text-sky-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-aurum-text">Audit-Ready Statements</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Export downloadable transaction CSVs with complete order IDs, timestamps, and fees.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/dashboard/portfolio"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-aurum-text font-bold text-sm transition-all"
          >
            <span>Explore Wealth Portfolio Tools</span>
            <ArrowRight className="w-4 h-4 text-aurum-gold" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — INTERACTIVE SAVINGS PLANNER & SIMULATOR
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoldCalculator />
      </section>

      {/* =========================================================================
          SECTION 8 — INSTITUTIONAL SECURITY & CRYPTOGRAPHIC TRANSPARENCY
         ========================================================================= */}
      <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" size="sm">
            Auditable Truth
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Security Grounded in Verifiable Evidence
          </h2>
          <p className="text-sm text-aurum-text-muted">
            We describe only implemented controls and architectural assurances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border space-y-4 hover:border-aurum-gold/40 transition-all shadow-card-luxury">
            <div className="w-12 h-12 rounded-2xl bg-aurum-gold/15 border border-aurum-gold/30 flex items-center justify-center text-aurum-gold">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Cryptographic Double-Entry
            </h3>
            <p className="text-xs sm:text-sm text-aurum-text-muted leading-relaxed">
              Every purchase, sale, gift, and fee deduction is recorded in an immutable audit ledger with zero integer rounding drift.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border space-y-4 hover:border-aurum-gold/40 transition-all shadow-card-luxury">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Role-Based Privilege Isolation
            </h3>
            <p className="text-xs sm:text-sm text-aurum-text-muted leading-relaxed">
              Support agents cannot execute financial changes, auditors have read-only access, and treasury operations require dual authentication.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border space-y-4 hover:border-aurum-gold/40 transition-all shadow-card-luxury">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Segregated Physical Allocation
            </h3>
            <p className="text-xs sm:text-sm text-aurum-text-muted leading-relaxed">
              Customer bullion is held in segregated custody accounts and is never lent out, hypothecated, or pooled into paper derivatives.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — DIGITAL GOLD EDUCATION & ACADEMY PREVIEW
         ========================================================================= */}
      <section id="academy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" size="sm">
            Bangla & English Academy
          </Badge>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Master the Science of Gold Savings
          </h2>
          <p className="text-sm text-aurum-text-muted">
            Empowering Bangladeshi savers with clear knowledge of purity standards, traditional units, and market risks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <span className="text-[10px] uppercase font-mono font-bold text-aurum-gold block">Lesson 01</span>
            <h4 className="font-bold text-base text-aurum-text">24K vs 22K Purity</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Understand 99.9% fine investment bullion versus 91.6% hallmark jewellery standards.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <span className="text-[10px] uppercase font-mono font-bold text-aurum-gold block">Lesson 02</span>
            <h4 className="font-bold text-base text-aurum-text">Grams & Bhori Conversion</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Exact mathematical conversion: 1 Bhori = 11.664g = 16 Ana = 96 Roti. Zero rounding ambiguity.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <span className="text-[10px] uppercase font-mono font-bold text-aurum-gold block">Lesson 03</span>
            <h4 className="font-bold text-base text-aurum-text">Buy/Sell Spread Demystified</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Why bid-ask spreads exist, how BAJUS circulars define them, and how digital trading saves costs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-3">
            <span className="text-[10px] uppercase font-mono font-bold text-aurum-gold block">Lesson 04</span>
            <h4 className="font-bold text-base text-aurum-text">Custody vs Home Storage</h4>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Comparing burglary risk and locker costs against segregated digital bullion accounts.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/academy"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-aurum-text font-bold text-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-aurum-gold" />
            <span>Visit the AurumSave Academy</span>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — FREQUENTLY ASKED QUESTIONS (HONEST POLICIES)
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
            Clear, honest answers about our technology, custody protocols, and operations.
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
          SECTION 11 — FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-aurum-card via-aurum-surface to-aurum-card border border-aurum-border-gold p-8 sm:p-14 text-center relative overflow-hidden shadow-card-luxury">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-aurum-gold/15 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-aurum-text relative z-10 max-w-2xl mx-auto">
            Start Accumulating Sovereign Gold Today
          </h2>
          <p className="mt-4 text-sm sm:text-base text-aurum-text-muted max-w-xl mx-auto relative z-10">
            Build your family&apos;s financial resilience with pure bullion allocated in real-time from ৳500.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-base shadow-gold-glow border border-aurum-gold/40 transition-all flex items-center justify-center space-x-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/trade"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/40 text-aurum-text font-bold text-base transition-all"
            >
              View Live Trade Desk
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12 — COMPREHENSIVE FOOTER & REGULATORY DISCLOSURE
         ========================================================================= */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-aurum-border/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aurum-gold to-aurum-gold-dark flex items-center justify-center shadow-gold-glow font-serif-luxury font-black text-aurum-midnight text-lg">
                Au
              </div>
              <span className="font-serif-luxury text-xl font-bold text-aurum-text">
                Aurum<span className="text-aurum-gold font-sans font-light">Save</span>
              </span>
            </div>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              Bangladesh&apos;s digital bullion infrastructure for disciplined gold savings, family wealth reserves, and transparent physical custody.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text block">
              Platform
            </span>
            <ul className="text-xs space-y-2 text-aurum-text-muted">
              <li><Link href="/trade" className="hover:text-aurum-gold transition-colors">Trade Desk (24K & 22K)</Link></li>
              <li><Link href="/goals" className="hover:text-aurum-gold transition-colors">Savings Goals & Family Vaults</Link></li>
              <li><Link href="/dashboard/portfolio" className="hover:text-aurum-gold transition-colors">Portfolio Insights</Link></li>
              <li><Link href="/dashboard/simulator" className="hover:text-aurum-gold transition-colors">What-If Wealth Simulator</Link></li>
            </ul>
          </div>

          {/* Transparency & Knowledge */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text block">
              Knowledge & Trust
            </span>
            <ul className="text-xs space-y-2 text-aurum-text-muted">
              <li><Link href="/academy" className="hover:text-aurum-gold transition-colors">Gold Academy (Bangla & EN)</Link></li>
              <li><Link href="/security" className="hover:text-aurum-gold transition-colors">Security Architecture</Link></li>
              <li><a href="#rates" className="hover:text-aurum-gold transition-colors">BAJUS Benchmark Rates</a></li>
              <li><Link href="/support" className="hover:text-aurum-gold transition-colors">Support & Disputes</Link></li>
            </ul>
          </div>

          {/* Legal Disclosures */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text block">
              Compliance & Legal
            </span>
            <p className="text-[11px] text-aurum-text-dim leading-relaxed">
              Gold is a physical commodity. Prices fluctuate based on international markets and BAJUS benchmarks. Digital gold savings do not represent bank deposits or fixed-return instruments.
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">
              Strict Double-Entry Ledger Verification
            </span>
          </div>
        </div>

        <div className="py-6 border-t border-aurum-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-aurum-text-dim">
          <span>&copy; {new Date().getFullYear()} AurumSave. All rights reserved. Dhaka, Bangladesh.</span>
          <div className="flex items-center space-x-4">
            <Link href="/security" className="hover:text-aurum-text">Privacy Policy</Link>
            <span>•</span>
            <Link href="/security" className="hover:text-aurum-text">Terms of Service</Link>
            <span>•</span>
            <Link href="/security" className="hover:text-aurum-text">Risk Disclosure</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
