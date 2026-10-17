'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { getRoleNavConfig, getRoleDashboardRoute } from '../../lib/role-navigation';
import {
  Search,
  Bell,
  Globe,
  User as UserIcon,
  LogOut,
  Shield,
  ChevronDown,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';

export default function DashboardHeader({
  searchQuery,
  onSearchChange,
}: {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}) {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const roleConfig = getRoleNavConfig(user?.role);
  const mainDashboardRoute = getRoleDashboardRoute(user?.role);
  const isSubpage = pathname !== '/dashboard' && pathname !== mainDashboardRoute;

  return (
    <header className="sticky top-0 z-30 bg-[#0B1220]/95 backdrop-blur-md border-b border-[#D4AF63]/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* =========================================================================
              MOBILE HEADER (< 768px): Compact Logo, Notifications, Avatar
             ========================================================================= */}
          <div className="flex md:hidden items-center justify-between w-full">
            {isSubpage ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={mainDashboardRoute}
                  className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-[#111A2F] border border-[#D4AF63]/30 text-xs font-bold text-[#D4AF63] active:scale-95 transition-all shadow-sm"
                  aria-label="Back to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4 text-[#D4AF63]" />
                  <span>{language === 'bn' ? 'ড্যাশবোর্ড' : 'Back'}</span>
                </Link>
                <span className="font-serif-luxury text-sm font-bold text-[#F8F6F0] truncate max-w-[130px]">
                  Aurum<span className="text-[#D4AF63] font-sans font-light">Save</span>
                </span>
              </div>
            ) : (
              <Link href={mainDashboardRoute} className="flex items-center space-x-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF63] via-[#F5E6B3] to-[#996515] flex items-center justify-center shadow-gold-glow">
                  <span className="font-serif-luxury font-black text-[#0B1220] text-sm tracking-wider">
                    Au
                  </span>
                </div>
                <span className="font-serif-luxury text-lg font-bold text-[#F8F6F0]">
                  Aurum<span className="text-[#D4AF63] font-sans font-light">Save</span>
                </span>
              </Link>
            )}

            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="px-2 py-1 rounded-lg bg-[#111A2F] border border-[#D4AF63]/20 text-[11px] font-mono text-[#D4AF63] font-bold"
                aria-label="Toggle language"
              >
                {language === 'bn' ? 'EN' : 'বাং'}
              </button>

              {/* Notification Bell */}
              <button
                className="relative p-2 rounded-xl bg-[#111A2F] border border-[#D4AF63]/20 text-[#94A3B8] hover:text-[#D4AF63]"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF63] animate-pulse" />
              </button>

              {/* User Avatar */}
              <Link
                href="/dashboard#profile"
                className="w-8 h-8 rounded-full bg-[#111A2F] border border-[#D4AF63]/40 flex items-center justify-center text-[#D4AF63] font-bold text-xs"
              >
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
              </Link>
            </div>
          </div>

          {/* =========================================================================
              DESKTOP HEADER (>= 768px): Search Bar, Notifications, Language, User Menu
             ========================================================================= */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Search Input */}
            <div className="relative w-72 lg:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'অনুসন্ধান করুন...' : 'Search anything...'}
                value={searchQuery || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#070C16] border border-[#D4AF63]/20 text-xs text-[#F8F6F0] placeholder-[#64748B] focus:outline-none focus:border-[#D4AF63] transition-colors font-mono"
              />
            </div>

            {/* Desktop Actions */}
            <div className="flex items-center space-x-3.5">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#070C16] border border-[#D4AF63]/20 text-xs font-mono font-semibold text-[#94A3B8] hover:text-[#D4AF63] hover:border-[#D4AF63]/40 transition-colors"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4AF63]" />
                <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-xl bg-[#070C16] border border-[#D4AF63]/20 text-[#94A3B8] hover:text-[#D4AF63] hover:border-[#D4AF63]/40 transition-colors"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF63] animate-pulse" />
              </button>

              {/* User Dropdown Preview */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-[#070C16] border border-[#D4AF63]/20 hover:border-[#D4AF63]/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#111A2F] border border-[#D4AF63]/40 flex items-center justify-center text-[#D4AF63] font-bold text-xs">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-[#F8F6F0] block leading-tight">
                        {user.fullName || 'Private Client'}
                      </span>
                      <span className="text-[10px] font-mono text-[#D4AF63] block">
                        {language === 'bn' ? roleConfig.roleTitleBn : roleConfig.roleTitleEn}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0B1220] border border-[#D4AF63]/30 shadow-2xl p-2 z-50 space-y-1 animate-fadeIn">
                      <Link
                        href={mainDashboardRoute}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#F8F6F0] bg-[#D4AF63]/15 border border-[#D4AF63]/30 hover:bg-[#D4AF63] hover:text-[#0B1220] transition-all group"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#D4AF63] group-hover:text-[#0B1220] transition-colors" />
                        <span>{language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                      </Link>
                      <Link
                        href="/dashboard/security"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#F8F6F0] hover:bg-[#111A2F]"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#D4AF63]" />
                        <span>{language === 'bn' ? 'নিরাপত্তা সেটিংস' : 'Security Settings'}</span>
                      </Link>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
