'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { getRoleNavConfig } from '../../lib/role-navigation';
import MoreMenuDrawer from './MoreMenuDrawer';
import ThemeToggle from '../ui/ThemeToggle';
import { Badge } from '../ui/Badge';
import {
  MoreHorizontal,
  Globe,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Shield,
  Coins,
  ArrowRight,
} from 'lucide-react';

export default function AppTopBar() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const roleConfig = getRoleNavConfig(user?.role);

  return (
    <>
      <header className="sticky top-0 z-40 bg-aurum-midnight/90 backdrop-blur-xl border-b border-aurum-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Mark & Role Badge */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-aurum-gold via-aurum-gold-light to-aurum-gold-dark flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
                  <span className="font-serif-luxury font-black text-aurum-midnight text-base sm:text-lg tracking-wider select-none">
                    Au
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-aurum-text group-hover:text-aurum-gold transition-colors duration-200">
                    Aurum<span className="text-aurum-gold font-sans font-light">Save</span>
                  </span>
                </div>
              </Link>

              {user && (
                <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-aurum-card border border-aurum-border-gold/60 text-[10px] text-aurum-gold font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-aurum-gold" />
                  <span>{language === 'bn' ? roleConfig.roleTitleBn : roleConfig.roleTitleEn}</span>
                </div>
              )}
            </div>

            {/* Desktop Icon Navigation Bar (Authenticated) */}
            {user ? (
              <nav
                className="hidden md:flex items-center space-x-1 bg-aurum-card/60 p-1.5 rounded-2xl border border-aurum-border/80 shadow-inner"
                aria-label="Application Navigation"
              >
                {roleConfig.primaryNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href) && item.href !== '/dashboard';

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-aurum-gold text-aurum-midnight font-bold shadow-gold-glow'
                          : 'text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                      title={language === 'bn' ? item.labelBn : item.labelEn}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                    </Link>
                  );
                })}

                {/* More Action Button */}
                <button
                  onClick={() => setMoreDrawerOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-aurum-text-muted hover:text-aurum-gold hover:bg-aurum-surface transition-all"
                  aria-label="Open more features menu"
                >
                  <MoreHorizontal className="w-4 h-4 text-aurum-gold" />
                  <span>{language === 'bn' ? 'আরও' : 'More'}</span>
                </button>
              </nav>
            ) : (
              /* Public Navigation Links */
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-aurum-text-muted">
                <Link href="/trade" className="hover:text-aurum-gold transition-colors flex items-center space-x-1.5 font-semibold text-aurum-text">
                  <Coins className="w-4 h-4 text-aurum-gold" />
                  <span>Trade Desk</span>
                </Link>
                <a href="/#rates" className="hover:text-aurum-gold transition-colors">
                  Live Rates
                </a>
                <a href="/#how-it-works" className="hover:text-aurum-gold transition-colors">
                  How It Works
                </a>
                <Link href="/academy" className="hover:text-aurum-gold transition-colors">
                  Academy
                </Link>
              </nav>
            )}

            {/* Right Quick Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-aurum-surface hover:bg-aurum-card border border-aurum-border text-xs font-bold text-aurum-text-muted hover:text-aurum-gold transition-colors"
                title="Toggle English / বাংলা"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-aurum-gold" />
                <span>{language === 'bn' ? 'ENG' : 'বাং'}</span>
              </button>

              <ThemeToggle />

              {/* User Account Controls */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-aurum-surface hover:bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 text-xs font-semibold text-aurum-text transition-all"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label="User Account Menu"
                  >
                    <div className="w-6 h-6 rounded-lg bg-aurum-gold/20 text-aurum-gold flex items-center justify-center font-bold">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {user.fullName || user.phone}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-aurum-text-dim hidden sm:inline" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-aurum-card border border-aurum-border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      role="menu"
                    >
                      <div className="px-3 py-2 border-b border-aurum-border/60 mb-1">
                        <span className="text-xs font-bold text-aurum-text block truncate">
                          {user.fullName || user.phone}
                        </span>
                        <span className="text-[10px] font-mono text-aurum-text-dim block">
                          {roleConfig.roleTitleEn}
                        </span>
                      </div>

                      <Link
                        href="/security"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface transition-colors"
                        role="menuitem"
                      >
                        <Shield className="w-3.5 h-3.5 text-aurum-gold" />
                        <span>Security & 2FA</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setMoreDrawerOpen(true);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface transition-colors text-left"
                        role="menuitem"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 text-aurum-gold" />
                        <span>All Features Drawer</span>
                      </button>

                      <div className="border-t border-aurum-border/60 my-1" />

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-bold"
                        role="menuitem"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-aurum-text hover:text-aurum-gold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-midnight font-bold text-xs shadow-gold-glow transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reusable More Menu Drawer */}
      <MoreMenuDrawer
        isOpen={moreDrawerOpen}
        onClose={() => setMoreDrawerOpen(false)}
        config={roleConfig}
      />
    </>
  );
}
