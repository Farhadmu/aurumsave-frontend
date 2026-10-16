import React from 'react';
import { ShieldCheck, Lock, Award, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-aurum-surface border-t border-aurum-border text-aurum-muted text-sm pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-aurum-border/60">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-aurum-card border border-aurum-border text-aurum-gold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-aurum-ivory text-sm">BAJUS Benchmark</h4>
              <p className="text-xs text-aurum-muted mt-0.5">
                Daily rates aligned with the Bangladesh Jewellers Association standard.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-aurum-card border border-aurum-border text-aurum-gold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-aurum-ivory text-sm">Allocated Bullion</h4>
              <p className="text-xs text-aurum-muted mt-0.5">
                100% physically backed by 24K & 22K certified gold stored in bank-grade vaults.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-aurum-card border border-aurum-border text-aurum-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-aurum-ivory text-sm">BFIU AML Compliance</h4>
              <p className="text-xs text-aurum-muted mt-0.5">
                Strict KYC verification & financial transaction audit logs for every gram.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-aurum-card border border-aurum-border text-aurum-gold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-aurum-ivory text-sm">Instant MFS Liquidity</h4>
              <p className="text-xs text-aurum-muted mt-0.5">
                Liquidate your savings anytime with instant payout to bKash, Nagad, or Bank.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand Info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-aurum-gold flex items-center justify-center font-serif font-black text-aurum-navy text-sm">
                Au
              </div>
              <span className="font-serif text-xl font-bold text-aurum-ivory">
                Aurum<span className="text-aurum-gold font-sans font-light">Save</span>
              </span>
            </div>
            <p className="text-xs text-aurum-muted mt-3 max-w-sm leading-relaxed">
              AurumSave is Bangladesh&apos;s premier digital gold savings architecture. We enable micro-savings starting from 100 milligrams (or 500 BDT) backed by allocated, audited physical bullion.
            </p>
            <p className="text-[11px] text-aurum-slate mt-4">
              Headquarters: Gulshan Avenue, Dhaka-1212, Bangladesh.<br />
              Registration & Tax ID: Verified Sandbox Sandbox-BD-2026.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-aurum-ivory text-xs uppercase tracking-wider mb-4">Platform</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="/#rates" className="hover:text-aurum-gold transition-colors">Live BAJUS Rates</a></li>
              <li><a href="/#calculator" className="hover:text-aurum-gold transition-colors">Savings Calculator</a></li>
              <li><a href="/#how-it-works" className="hover:text-aurum-gold transition-colors">How It Works</a></li>
              <li><a href="/#vault" className="hover:text-aurum-gold transition-colors">Vault Storage</a></li>
              <li><a href="/#purity" className="hover:text-aurum-gold transition-colors">Purity & Hallmarks</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-aurum-ivory text-xs uppercase tracking-wider mb-4">Governance</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="/#faq" className="hover:text-aurum-gold transition-colors">AML/CFT Policy</a></li>
              <li><a href="/#faq" className="hover:text-aurum-gold transition-colors">Custody Agreements</a></li>
              <li><a href="/#faq" className="hover:text-aurum-gold transition-colors">Terms of Service</a></li>
              <li><a href="/#faq" className="hover:text-aurum-gold transition-colors">Privacy Notice</a></li>
              <li><a href="/#faq" className="hover:text-aurum-gold transition-colors">Dispute Resolution</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-aurum-ivory text-xs uppercase tracking-wider mb-4">Supported MFS</h5>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-aurum-card border border-aurum-border text-[11px] font-medium text-pink-400">bKash</span>
              <span className="px-2.5 py-1 rounded bg-aurum-card border border-aurum-border text-[11px] font-medium text-orange-400">Nagad</span>
              <span className="px-2.5 py-1 rounded bg-aurum-card border border-aurum-border text-[11px] font-medium text-purple-400">Rocket</span>
              <span className="px-2.5 py-1 rounded bg-aurum-card border border-aurum-border text-[11px] font-medium text-blue-400">BEFTN / NPSB</span>
            </div>
            <p className="text-[11px] text-aurum-slate mt-4">
              Operational Status: <span className="text-emerald-400 font-medium">All Systems Live</span>
            </p>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="pt-8 border-t border-aurum-border/40 text-center text-[11px] text-aurum-slate space-y-2">
          <p>
            Disclaimer: Digital gold purchases via AurumSave are backed 1:1 by physical bullion held in secure custody. Gold prices fluctuate based on market conditions. Historical performance does not guarantee future results.
          </p>
          <p>© {new Date().getFullYear()} AurumSave Technologies Bangladesh Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
