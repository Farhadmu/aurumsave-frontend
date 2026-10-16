'use client';

import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Role } from '../shared';
import ThemeToggle from './ui/ThemeToggle';
import { Badge } from './ui/Badge';
import {
  Shield,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Coins,
  Headphones,
  Lock,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case Role.SUPER_ADMIN:
      case Role.ADMIN:
        return '/staff/admin';
      case Role.KYC_OFFICER:
        return '/staff/compliance';
      case Role.FINANCE_OFFICER:
        return '/staff/operations';
      case Role.SUPPORT_AGENT:
        return '/staff/support';
      case Role.AUDITOR:
        return '/staff/auditor';
      default:
        return '/dashboard';
    }
  };

  const getRoleDisplayName = () => {
    if (!user) return '';
    switch (user.role) {
      case Role.SUPER_ADMIN:
        return 'Super Admin';
      case Role.ADMIN:
        return 'Administrator';
      case Role.KYC_OFFICER:
        return 'Compliance Officer';
      case Role.FINANCE_OFFICER:
        return 'Operations Desk';
      case Role.SUPPORT_AGENT:
        return 'Concierge Support';
      case Role.AUDITOR:
        return 'Audit Authority';
      default:
        return 'Private Client';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-aurum-midnight/90 backdrop-blur-xl border-b border-aurum-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Mark */}
          <a href="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-aurum-gold via-aurum-gold-light to-aurum-gold-dark flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif-luxury font-black text-aurum-midnight text-xl tracking-wider select-none">
                Au
              </span>
              <div className="absolute -inset-0.5 rounded-2xl bg-aurum-gold/20 blur-sm -z-10 group-hover:bg-aurum-gold/40 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-aurum-text group-hover:text-aurum-gold transition-colors duration-200">
                Aurum<span className="text-aurum-gold font-sans font-light">Save</span>
              </span>
              <div className="flex items-center space-x-1.5 -mt-0.5">
                <span className="text-[9px] uppercase font-bold tracking-widest text-aurum-text-dim">
                  Sovereign Bullion Vault
                </span>
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-mono text-emerald-400 font-semibold">BD</span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-aurum-text-muted">
            <a href="/#rates" className="hover:text-aurum-gold transition-colors">
              BAJUS Rates
            </a>
            <a href="/#calculator" className="hover:text-aurum-gold transition-colors">
              Calculator
            </a>
            <a href="/trade" className="hover:text-aurum-gold transition-colors flex items-center space-x-1.5">
              <span>Trade Gold</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-aurum-gold/20 text-aurum-gold font-mono">
                5m Lock
              </span>
            </a>
            <a href="/#vault" className="hover:text-aurum-gold transition-colors">
              Vault Proof
            </a>
            <a href="/support" className="hover:text-aurum-gold transition-colors">
              Support
            </a>
            <a href="/#faq" className="hover:text-aurum-gold transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action / Auth & Controls */}
          <div className="hidden md:flex items-center space-x-3.5">
            <Badge variant="emerald" pulse size="sm" className="hidden xl:inline-flex">
              BAJUS Live Feed
            </Badge>

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-aurum-text text-sm transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-aurum-gold to-aurum-gold-dark text-aurum-midnight font-bold text-xs flex items-center justify-center shadow-sm">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="max-w-[130px] truncate font-semibold text-xs">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-aurum-text-muted" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-aurum-card border border-aurum-border-gold shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-aurum-border/60">
                      <p className="text-[10px] uppercase font-mono tracking-widest text-aurum-text-dim font-bold">
                        Authenticated Client
                      </p>
                      <p className="text-sm font-bold text-aurum-text truncate mt-0.5">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-aurum-text-muted truncate">{user.email}</p>
                      <div className="mt-2">
                        <Badge variant="gold" size="sm">
                          {getRoleDisplayName()}
                        </Badge>
                      </div>
                    </div>

                    <div className="py-1">
                      <a
                        href={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-aurum-text hover:bg-aurum-surface hover:text-aurum-gold transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-aurum-gold" />
                        <span>
                          {user.role === Role.CUSTOMER ? 'Customer Vault Dashboard' : 'Staff Workspace'}
                        </span>
                      </a>

                      <a
                        href="/trade"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-aurum-text hover:bg-aurum-surface hover:text-aurum-gold transition-colors"
                      >
                        <Coins className="w-4 h-4 text-aurum-gold" />
                        <span>Buy / Liquidate Bullion</span>
                      </a>

                      <a
                        href="/support"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-aurum-text hover:bg-aurum-surface hover:text-aurum-gold transition-colors"
                      >
                        <Headphones className="w-4 h-4 text-aurum-gold" />
                        <span>Concierge Support Desk</span>
                      </a>
                    </div>

                    <div className="pt-1 border-t border-aurum-border/60">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Secure Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <a
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-aurum-text hover:text-aurum-gold transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="px-5 py-2.5 text-xs font-bold text-aurum-midnight bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold hover:brightness-110 rounded-xl shadow-gold-glow border border-aurum-gold/40 transition-all active:scale-[0.98]"
                >
                  Open Vault Account
                </a>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-aurum-border bg-aurum-card px-5 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-3 text-sm text-aurum-text font-medium">
            <a href="/#rates" onClick={() => setMobileMenuOpen(false)} className="hover:text-aurum-gold">
              BAJUS Benchmark Rates
            </a>
            <a href="/#calculator" onClick={() => setMobileMenuOpen(false)} className="hover:text-aurum-gold">
              Savings Calculator
            </a>
            <a href="/trade" onClick={() => setMobileMenuOpen(false)} className="hover:text-aurum-gold">
              Trade Gold (5m Rate Lock)
            </a>
            <a href="/#vault" onClick={() => setMobileMenuOpen(false)} className="hover:text-aurum-gold">
              Vault Custody & Insurance
            </a>
            <a href="/support" onClick={() => setMobileMenuOpen(false)} className="hover:text-aurum-gold">
              Support Desk
            </a>
            <a href="/#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-aurum-gold">
              Frequently Asked Questions
            </a>
          </nav>

          <div className="pt-4 border-t border-aurum-border flex flex-col space-y-2.5">
            {user ? (
              <>
                <a
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-aurum-gold text-aurum-midnight font-bold text-sm shadow-gold-glow"
                >
                  Open {getRoleDisplayName()} Workspace
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-aurum-surface text-aurum-text font-semibold text-sm border border-aurum-border"
                >
                  Sign In to Vault
                </a>
                <a
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-midnight font-bold text-sm shadow-gold-glow"
                >
                  Open Free Vault Account
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
