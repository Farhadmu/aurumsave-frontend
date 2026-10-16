'use client';

import React, { useState } from 'react';
import GoldPriceWidget from '../components/GoldPriceWidget';
import GoldCalculator from '../components/GoldCalculator';
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
} from 'lucide-react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is digital gold on AurumSave backed by actual physical gold?',
      a: 'Yes, 100%. For every milligram of digital gold purchased through AurumSave, an equivalent amount of physical 24K (99.9% fineness) or 22K (91.6% hallmarked) bullion is purchased and allocated in high-security, insured bank-grade vaults. It is not a synthetic derivative.',
    },
    {
      q: 'What is the minimum amount I can start saving with?',
      a: 'You can start saving with as little as ৳500 or 0.1 grams of gold. Our mission is to make wealth preservation accessible to everyone across Bangladesh through fractional gold accumulation.',
    },
    {
      q: 'How does AurumSave determine its gold buy and sell prices?',
      a: 'Our benchmark rates are directly synchronized with the official daily rates published by the Bangladesh Jewellers Association (BAJUS). A transparent spread of 2.0% - 2.5% covers physical assay, secure custody, insurance, and liquidity operations. There are no surprise hidden fees.',
    },
    {
      q: 'Can I withdraw physical gold bars or coins?',
      a: 'Yes. Once your cumulative vault balance reaches 1 Bhori (11.664 grams) or multiples of 1 Bhori/10g, you can request physical bullion delivery or collection from authorized custody centers with assay certificates.',
    },
    {
      q: 'How quickly can I sell my gold and receive money?',
      a: 'Liquidation is instantaneous. When you sell gold from your vault, funds are immediately credited to your Aurum wallet and can be withdrawn directly to your bKash, Nagad, Rocket, or bank account.',
    },
    {
      q: 'Why is KYC identity verification required?',
      a: 'In accordance with Bangladesh Financial Intelligence Unit (BFIU) guidelines and Anti-Money Laundering (AML) regulations, customer identity must be verified using your Smart National ID card (NID) or Passport before conducting high-value gold transactions.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        {/* Ambient radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-aurum-gold/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-aurum-card border border-aurum-gold/30 text-xs text-aurum-gold mb-6 shadow-gold-glow animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-aurum-gold animate-ping" />
            <span className="font-semibold tracking-wide">Bangladesh&apos;s Sovereign Gold Savings Infrastructure</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-aurum-ivory max-w-4xl mx-auto leading-[1.1]">
            Build generational wealth in{' '}
            <span className="gold-gradient-text">Allocated Physical Gold</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-aurum-muted max-w-2xl mx-auto leading-relaxed">
            Protect your taka against inflation. Buy, hold, and liquidate 24K & 22K certified bullion starting from ৳500 with instant MFS payments and bank-grade insured vaults.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-base shadow-gold-glow transition-all flex items-center justify-center space-x-2"
            >
              <span>Open Free Vault Account</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#calculator"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-aurum-ivory font-semibold text-base transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Savings Calculator</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-aurum-border/60 text-left">
            <div className="p-4 rounded-xl bg-aurum-surface/40 border border-aurum-border/40">
              <span className="text-[11px] uppercase tracking-wider text-aurum-slate font-semibold block">
                Starting Minimum
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-gold mt-0.5 block">
                ৳500 / 0.1g
              </span>
              <span className="text-[11px] text-aurum-muted">Fractional micro-savings</span>
            </div>

            <div className="p-4 rounded-xl bg-aurum-surface/40 border border-aurum-border/40">
              <span className="text-[11px] uppercase tracking-wider text-aurum-slate font-semibold block">
                Bullion Standard
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-ivory mt-0.5 block">
                24K & 22K
              </span>
              <span className="text-[11px] text-aurum-muted">99.9% Assay certified</span>
            </div>

            <div className="p-4 rounded-xl bg-aurum-surface/40 border border-aurum-border/40">
              <span className="text-[11px] uppercase tracking-wider text-aurum-slate font-semibold block">
                Physical Custody
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5 block">
                100% Insured
              </span>
              <span className="text-[11px] text-aurum-muted">Zero storage fee</span>
            </div>

            <div className="p-4 rounded-xl bg-aurum-surface/40 border border-aurum-border/40">
              <span className="text-[11px] uppercase tracking-wider text-aurum-slate font-semibold block">
                MFS Settlement
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-aurum-ivory mt-0.5 block">
                Instant
              </span>
              <span className="text-[11px] text-aurum-muted">bKash, Nagad, Rocket</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live BAJUS Gold Rates Section */}
      <section id="rates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-aurum-gold mb-1">
            <Award className="w-4 h-4" />
            <span>Market Transparency Feed</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-aurum-ivory">
            Live Official BAJUS Gold Rates
          </h2>
          <p className="text-sm text-aurum-muted mt-1 max-w-xl">
            Real-time rates updated directly in accordance with the Bangladesh Jewellers Association benchmark.
          </p>
        </div>

        <GoldPriceWidget />
      </section>

      {/* Interactive Savings Calculator */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <GoldCalculator />
      </section>

      {/* How AurumSave Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-wider text-aurum-gold">
            Seamless Lifecycle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-aurum-ivory mt-2">
            How Digital Gold Savings Works
          </h2>
          <p className="text-sm text-aurum-muted mt-2">
            From your smartphone to bank-grade vault custody in four transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-aurum-card border border-aurum-border relative group hover:border-aurum-gold/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-aurum-surface border border-aurum-border flex items-center justify-center font-mono font-bold text-aurum-gold text-lg mb-4 group-hover:scale-105 transition-transform">
              01
            </div>
            <h3 className="text-lg font-bold text-aurum-ivory mb-2">Create & Verify</h3>
            <p className="text-xs text-aurum-muted leading-relaxed">
              Register in 60 seconds. Verify your identity with your Smart NID card to comply with Bangladesh anti-money laundering (BFIU) guidelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-aurum-card border border-aurum-border relative group hover:border-aurum-gold/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-aurum-surface border border-aurum-border flex items-center justify-center font-mono font-bold text-aurum-gold text-lg mb-4 group-hover:scale-105 transition-transform">
              02
            </div>
            <h3 className="text-lg font-bold text-aurum-ivory mb-2">Save via MFS</h3>
            <p className="text-xs text-aurum-muted leading-relaxed">
              Lock in your live rate with a guaranteed 5-minute quote. Pay seamlessly via bKash, Nagad, Rocket, or Bangladeshi bank transfer.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-aurum-card border border-aurum-border relative group hover:border-aurum-gold/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-aurum-surface border border-aurum-border flex items-center justify-center font-mono font-bold text-aurum-gold text-lg mb-4 group-hover:scale-105 transition-transform">
              03
            </div>
            <h3 className="text-lg font-bold text-aurum-ivory mb-2">Allocated Vault Custody</h3>
            <p className="text-xs text-aurum-muted leading-relaxed">
              Every milligram is backed 1:1 by physical bullion held in high-security, fully insured vaults with independent quarterly audits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-aurum-card border border-aurum-border relative group hover:border-aurum-gold/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-aurum-surface border border-aurum-border flex items-center justify-center font-mono font-bold text-aurum-gold text-lg mb-4 group-hover:scale-105 transition-transform">
              04
            </div>
            <h3 className="text-lg font-bold text-aurum-ivory mb-2">Liquidate or Redeem</h3>
            <p className="text-xs text-aurum-muted leading-relaxed">
              Sell anytime for instant taka withdrawal to your bKash/Nagad wallet, or request physical 1 Bhori (11.664g) bar delivery to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Purity & Karat Education */}
      <section id="purity" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-aurum-surface border border-aurum-border">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase font-semibold tracking-wider text-aurum-gold">
              Hallmark Certification
            </span>
            <h2 className="font-serif text-3xl font-bold text-aurum-ivory mt-2">
              Understanding Gold Purity & Conversions
            </h2>
            <p className="text-xs sm:text-sm text-aurum-muted mt-2">
              Gold fineness determines its purity and intrinsic financial value in Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-aurum-card border border-aurum-border">
              <span className="text-2xl font-serif font-black text-aurum-gold">24K</span>
              <h4 className="text-sm font-bold text-aurum-ivory mt-1">99.9% Fineness (999)</h4>
              <p className="text-xs text-aurum-muted mt-2 leading-relaxed">
                The international gold standard for investment bullion bars and coins. Zero alloy mixture.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-aurum-card border border-aurum-border">
              <span className="text-2xl font-serif font-black text-aurum-ivory">22K</span>
              <h4 className="text-sm font-bold text-aurum-ivory mt-1">91.6% Fineness (916)</h4>
              <p className="text-xs text-aurum-muted mt-2 leading-relaxed">
                The most popular hallmark jewellery grade in Bangladesh, offering high durability and purity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-aurum-card border border-aurum-border">
              <span className="text-2xl font-serif font-black text-aurum-slate">21K</span>
              <h4 className="text-sm font-bold text-aurum-ivory mt-1">87.5% Fineness (875)</h4>
              <p className="text-xs text-aurum-muted mt-2 leading-relaxed">
                Traditional Bangladeshi jewellery standard containing 21 parts pure gold and 3 parts alloy.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-aurum-card border border-aurum-border">
              <span className="text-2xl font-serif font-black text-aurum-slate">18K</span>
              <h4 className="text-sm font-bold text-aurum-ivory mt-1">75.0% Fineness (750)</h4>
              <p className="text-xs text-aurum-muted mt-2 leading-relaxed">
                Sturdy gold alloy standard frequently utilized for diamond jewellery and fine watchmaking.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-aurum-navy border border-aurum-border text-xs text-aurum-muted flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-aurum-gold" />
              <span>
                Standard Weight Standard: <strong>1 Bhori (Tola) = 11.664 Grams = 16 Annas = 96 Rattis</strong>.
              </span>
            </div>
            <a href="#calculator" className="text-aurum-gold hover:underline font-semibold whitespace-nowrap">
              Test Unit Converter &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-semibold tracking-wider text-aurum-gold">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-aurum-ivory mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-aurum-muted mt-2">
            Everything you need to know about digital gold custody, pricing, and regulation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-aurum-card border border-aurum-border overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-aurum-surface/50 transition-colors"
                >
                  <span className="font-semibold text-aurum-ivory text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-aurum-gold transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-aurum-muted leading-relaxed border-t border-aurum-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-aurum-card via-aurum-surface to-aurum-card border-2 border-aurum-gold/40 shadow-gold-glow text-center relative overflow-hidden">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-aurum-ivory">
            Start Your Gold Savings Portfolio Today
          </h2>
          <p className="mt-4 text-sm sm:text-base text-aurum-muted max-w-xl mx-auto">
            Join thousands of savers safeguarding their hard-earned money in physical allocated gold bullion.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-navy font-bold text-sm shadow-gold-glow hover:brightness-110 transition-all"
            >
              Create Account in 60 Seconds
            </a>
            <a
              href="/login"
              className="px-6 py-3.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-ivory text-sm font-semibold hover:border-aurum-gold transition-colors"
            >
              Sign In to Existing Vault
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
