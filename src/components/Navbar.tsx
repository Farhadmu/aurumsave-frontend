'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { Role } from '@aurumsave/shared';
import { Shield, Sparkles, User, LogOut, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-50 bg-aurum-navy/90 backdrop-blur-md border-b border-aurum-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurum-gold to-aurum-gold-dark flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <span className="font-serif font-black text-aurum-navy text-xl tracking-wider">Au</span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-aurum-ivory group-hover:text-aurum-gold transition-colors">
                Aurum<span className="text-aurum-gold font-sans font-light">Save</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-widest bg-aurum-surface border border-aurum-border text-aurum-muted rounded">
                Bangladesh
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-aurum-muted">
            <a href="/#rates" className="hover:text-aurum-gold transition-colors">
              Live Rates
            </a>
            <a href="/#how-it-works" className="hover:text-aurum-gold transition-colors">
              How It Works
            </a>
            <a href="/#calculator" className="hover:text-aurum-gold transition-colors">
              Calculator
            </a>
            <a href="/#vault" className="hover:text-aurum-gold transition-colors">
              Vault & Security
            </a>
            <a href="/#faq" className="hover:text-aurum-gold transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>BAJUS Verified</span>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg bg-aurum-surface border border-aurum-border hover:border-aurum-gold/40 text-aurum-ivory text-sm transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-aurum-card border border-aurum-gold/30 flex items-center justify-center text-aurum-gold text-xs font-bold">
                    {user.fullName.substring(0, 1)}
                  </div>
                  <span className="max-w-[120px] truncate font-medium">{user.fullName}</span>
                  <ChevronDown className="w-4 h-4 text-aurum-muted" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-aurum-card border border-aurum-border shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-aurum-border">
                      <p className="text-xs text-aurum-muted uppercase tracking-wider font-semibold">Logged In As</p>
                      <p className="text-sm font-semibold text-aurum-ivory truncate">{user.fullName}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-aurum-gold/20 text-aurum-gold">
                        {user.role}
                      </span>
                    </div>

                    <a
                      href={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-aurum-ivory hover:bg-aurum-surface hover:text-aurum-gold transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{user.role === Role.CUSTOMER ? 'Customer Dashboard' : 'Staff Workspace'}</span>
                    </a>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-aurum-ivory hover:text-aurum-gold transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="px-5 py-2 text-sm font-semibold text-aurum-navy bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 rounded-lg shadow-gold-glow transition-all"
                >
                  Start Saving
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-aurum-surface text-aurum-muted hover:text-aurum-ivory"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-aurum-border bg-aurum-navy px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-base text-aurum-muted font-medium">
            <a href="/#rates" onClick={() => setMobileMenuOpen(false)}>
              Live Rates
            </a>
            <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </a>
            <a href="/#calculator" onClick={() => setMobileMenuOpen(false)}>
              Calculator
            </a>
            <a href="/#vault" onClick={() => setMobileMenuOpen(false)}>
              Vault & Security
            </a>
            <a href="/#faq" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
          </nav>
          <div className="pt-4 border-t border-aurum-border flex flex-col space-y-2">
            {user ? (
              <>
                <a
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-aurum-gold text-aurum-navy font-bold"
                >
                  Dashboard ({user.role})
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2 text-sm text-rose-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-aurum-surface text-aurum-ivory font-medium border border-aurum-border"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-aurum-gold text-aurum-navy font-bold shadow-gold-glow"
                >
                  Start Saving
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
