'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { getRoleNavConfig, getRoleDashboardRoute } from '../../lib/role-navigation';
import ThemeToggle from '../ui/ThemeToggle';
import { Badge } from '../ui/Badge';
import {
  Globe,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Shield,
  Coins,
  LayoutDashboard,
  Menu,
  X,
  BookOpen,
  Headphones,
} from 'lucide-react';

export default function AppTopBar() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleConfig = getRoleNavConfig(user?.role);
  const mainDashboardRoute = getRoleDashboardRoute(user?.role);

  // On dashboard and staff routes, DashboardShell handles both the permanent desktop sidebar and header
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/staff')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B1220]/95 backdrop-blur-xl border-b border-[#D4AF63]/15 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Mark */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#D4AF63] via-[#F5E6B3] to-[#996515] flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
                  <span className="font-serif-luxury font-black text-[#0B1220] text-base sm:text-lg tracking-wider select-none">
                    Au
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-[#F8F6F0] group-hover:text-[#D4AF63] transition-colors duration-200">
                    Aurum<span className="text-[#D4AF63] font-sans font-light">Save</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Standard Public Navigation Links (Always clean, no dashboard links in navbar) */}
            <nav
              className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#94A3B8]"
              aria-label="Public Navigation"
            >
              <Link
                href="/trade"
                className="hover:text-[#D4AF63] transition-colors flex items-center space-x-1.5 font-semibold text-[#F8F6F0]"
              >
                <Coins className="w-4 h-4 text-[#D4AF63]" />
                <span>{language === 'bn' ? 'ট্রেড ডেস্ক' : 'Trade Desk'}</span>
              </Link>
              <a href="/#rates" className="hover:text-[#D4AF63] transition-colors">
                {language === 'bn' ? 'লাইভ দর' : 'Live Rates'}
              </a>
              <a href="/#how-it-works" className="hover:text-[#D4AF63] transition-colors">
                {language === 'bn' ? 'কীভাবে কাজ করে' : 'How It Works'}
              </a>
              <Link
                href="/academy"
                className="hover:text-[#D4AF63] transition-colors flex items-center space-x-1"
              >
                <span>{language === 'bn' ? 'একাডেমি' : 'Academy'}</span>
              </Link>
              <Link
                href="/support"
                className="hover:text-[#D4AF63] transition-colors"
              >
                {language === 'bn' ? 'সহায়তা' : 'Support'}
              </Link>
            </nav>

            {/* Right Quick Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#111A2F] hover:bg-[#1A2644] border border-[#D4AF63]/20 text-xs font-bold text-[#94A3B8] hover:text-[#D4AF63] transition-colors"
                title="Toggle English / বাংলা"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4AF63]" />
                <span>{language === 'bn' ? 'ENG' : 'বাং'}</span>
              </button>

              <ThemeToggle />

              {/* User Account Controls */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#111A2F] hover:bg-[#1A2644] border border-[#D4AF63]/30 hover:border-[#D4AF63] text-xs font-semibold text-[#F8F6F0] transition-all"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label="User Account Menu"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#D4AF63]/20 text-[#D4AF63] flex items-center justify-center font-bold">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="hidden sm:inline max-w-[120px] truncate">
                      {user.fullName || user.phone}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden sm:inline" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0B1220] border border-[#D4AF63]/30 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
                      role="menu"
                    >
                      <div className="px-3 py-2 border-b border-[#D4AF63]/15 mb-1.5">
                        <span className="text-xs font-bold text-[#F8F6F0] block truncate">
                          {user.fullName || user.phone}
                        </span>
                        <span className="text-[10px] font-mono text-[#D4AF63] block">
                          {language === 'bn' ? roleConfig.roleTitleBn : roleConfig.roleTitleEn}
                        </span>
                      </div>

                      {/* Primary Dashboard Link with Icon */}
                      <Link
                        href={mainDashboardRoute}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#F8F6F0] bg-[#D4AF63]/15 border border-[#D4AF63]/30 hover:bg-[#D4AF63] hover:text-[#0B1220] transition-all group"
                        role="menuitem"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#D4AF63] group-hover:text-[#0B1220] transition-colors" />
                        <span>{language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                      </Link>

                      <Link
                        href="/dashboard/security"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#F8F6F0] hover:bg-[#111A2F] transition-colors"
                        role="menuitem"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#D4AF63]" />
                        <span>{language === 'bn' ? 'নিরাপত্তা ও ২এফএ' : 'Security & 2FA'}</span>
                      </Link>

                      <div className="border-t border-[#D4AF63]/15 my-1" />

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-bold"
                        role="menuitem"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#F8F6F0] hover:text-[#D4AF63] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF63] via-[#F5E6B3] to-[#996515] hover:brightness-110 text-[#0B1220] font-bold text-xs shadow-gold-glow transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Trigger (Hidden on Desktop) */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-xl bg-[#111A2F] border border-[#D4AF63]/20 text-[#F8F6F0] md:hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown for Public View */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#D4AF63]/20 bg-[#0B1220] px-5 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col space-y-3 text-sm text-[#F8F6F0] font-medium">
              <Link
                href="/trade"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF63] flex items-center space-x-2"
              >
                <Coins className="w-4 h-4 text-[#D4AF63]" />
                <span>{language === 'bn' ? 'ট্রেড ডেস্ক' : 'Trade Desk'}</span>
              </Link>
              <a
                href="/#rates"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF63]"
              >
                {language === 'bn' ? 'লাইভ দর' : 'Live Rates'}
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF63]"
              >
                {language === 'bn' ? 'কীভাবে কাজ করে' : 'How It Works'}
              </a>
              <Link
                href="/academy"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF63]"
              >
                {language === 'bn' ? 'একাডেমি' : 'Academy'}
              </Link>
              <Link
                href="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF63]"
              >
                {language === 'bn' ? 'সহায়তা' : 'Support'}
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#D4AF63]/15 flex flex-col space-y-2.5">
              {user ? (
                <>
                  <Link
                    href={mainDashboardRoute}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF63] via-[#F5E6B3] to-[#996515] text-[#0B1220] font-bold text-sm shadow-gold-glow"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ড্যাশবোর্ড খুলুন' : 'Open Dashboard'}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-center py-2 text-xs font-semibold text-rose-400"
                  >
                    {language === 'bn' ? 'সাইন আউট' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-[#111A2F] text-[#F8F6F0] font-semibold text-xs border border-[#D4AF63]/25"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF63] via-[#F5E6B3] to-[#996515] text-[#0B1220] font-bold text-xs shadow-gold-glow"
                  >
                    Open Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
