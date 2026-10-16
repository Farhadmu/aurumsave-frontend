import React from 'react';
import { ShieldCheck, Lock, Award, HeartHandshake, ExternalLink } from 'lucide-react';
import { Badge } from './ui/Badge';

export default function Footer() {
  return (
    <footer className="bg-aurum-card border-t border-aurum-border text-aurum-text-muted text-sm pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-aurum-border/60">
          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-aurum-surface/60 border border-aurum-border/60">
            <div className="p-2.5 rounded-xl bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-aurum-text text-sm">BAJUS Benchmark</h4>
              <p className="text-xs text-aurum-text-muted mt-0.5">
                Daily rates aligned with the Bangladesh Jewellers Association standard.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-aurum-surface/60 border border-aurum-border/60">
            <div className="p-2.5 rounded-xl bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-aurum-text text-sm">Allocated Bullion</h4>
              <p className="text-xs text-aurum-text-muted mt-0.5">
                100% physically backed by 24K & 22K certified gold in bank-grade vaults.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-aurum-surface/60 border border-aurum-border/60">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-aurum-text text-sm">BFIU AML Compliance</h4>
              <p className="text-xs text-aurum-text-muted mt-0.5">
                Strict KYC verification & double-entry financial ledger for every gram.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-aurum-surface/60 border border-aurum-border/60">
            <div className="p-2.5 rounded-xl bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-aurum-text text-sm">Instant MFS Liquidity</h4>
              <p className="text-xs text-aurum-text-muted mt-0.5">
                Liquidate anytime with instant payout to bKash, Nagad, Rocket, or Bank.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand Info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aurum-gold via-aurum-gold-light to-aurum-gold-dark flex items-center justify-center font-serif-luxury font-black text-aurum-midnight text-base shadow-sm">
                Au
              </div>
              <span className="font-serif-luxury text-xl font-bold text-aurum-text">
                Aurum<span className="text-aurum-gold font-sans font-light">Save</span>
              </span>
            </div>
            <p className="text-xs text-aurum-text-muted max-w-sm leading-relaxed">
              AurumSave is Bangladesh&apos;s premier digital gold savings architecture. We enable micro-savings starting from 100 milligrams (or ৳500) backed by allocated, audited physical bullion.
            </p>
            <p className="text-[11px] text-aurum-text-dim">
              Headquarters: Gulshan Avenue, Dhaka-1212, Bangladesh.<br />
              Commercial Registry & Vault Custody Underwriters: Lloyd&apos;s Syndicate.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-aurum-text text-xs uppercase font-mono tracking-wider mb-4">
              Platform
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/#rates" className="hover:text-aurum-gold transition-colors">
                  Live BAJUS Rates
                </a>
              </li>
              <li>
                <a href="/#calculator" className="hover:text-aurum-gold transition-colors">
                  Savings Calculator
                </a>
              </li>
              <li>
                <a href="/trade" className="hover:text-aurum-gold transition-colors">
                  Trade Desk (5m Lock)
                </a>
              </li>
              <li>
                <a href="/#vault" className="hover:text-aurum-gold transition-colors">
                  Vault Storage
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-aurum-gold transition-colors">
                  Physical Delivery
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-aurum-text text-xs uppercase font-mono tracking-wider mb-4">
              Governance
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/#faq" className="hover:text-aurum-gold transition-colors">
                  BFIU AML/CFT Policy
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-aurum-gold transition-colors">
                  Vault Custody Terms
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-aurum-gold transition-colors">
                  BAJUS Synchronization
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-aurum-gold transition-colors">
                  Proof of Reserves
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-aurum-gold transition-colors">
                  Support Concierge
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-aurum-text text-xs uppercase font-mono tracking-wider mb-4">
              Supported Payment MFS
            </h5>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-aurum-surface border border-aurum-border text-[11px] font-mono font-bold text-pink-400">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-aurum-surface border border-aurum-border text-[11px] font-mono font-bold text-orange-400">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-aurum-surface border border-aurum-border text-[11px] font-mono font-bold text-purple-400">
                Rocket
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-aurum-surface border border-aurum-border text-[11px] font-mono font-bold text-blue-400">
                BEFTN Bank
              </span>
            </div>
            <div className="mt-4 flex items-center space-x-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">Core Ledger: Operational</span>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="pt-8 border-t border-aurum-border/40 text-center text-[11px] text-aurum-text-dim space-y-2">
          <p>
            Legal Notice: Digital gold purchases through AurumSave are backed 100% by physically segregated bullion in bank vaults. Gold prices fluctuate based on domestic BAJUS market factors.
          </p>
          <p>© {new Date().getFullYear()} AurumSave Technologies Bangladesh Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
