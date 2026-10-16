'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { RoleNavConfig } from '../../lib/role-navigation';
import ThemeToggle from '../ui/ThemeToggle';
import { X, LogOut, Globe, Shield, Sparkles } from 'lucide-react';

interface MoreMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: RoleNavConfig;
}

export default function MoreMenuDrawer({
  isOpen,
  onClose,
  config,
}: MoreMenuDrawerProps) {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-aurum-midnight/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="more-menu-title"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm sm:max-w-md h-full bg-aurum-card border-l border-aurum-border shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-aurum-border/80 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-aurum-gold" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-aurum-gold">
                {language === 'bn' ? config.roleTitleBn : config.roleTitleEn}
              </span>
            </div>
            <h2 id="more-menu-title" className="font-serif-luxury text-xl font-bold text-aurum-text mt-1">
              {language === 'bn' ? 'অতিরিক্ত সেবা ও সেটিংস' : 'App Launcher & Services'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-aurum-surface text-aurum-text-muted hover:text-aurum-text border border-aurum-border hover:border-aurum-gold/40 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories & Actions */}
        <div className="p-6 space-y-6 flex-1">
          {config.moreNav.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-aurum-text-dim font-bold block">
                {language === 'bn' ? cat.categoryBn : cat.categoryEn}
              </span>

              <div className="grid grid-cols-1 gap-2">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center space-x-3.5 p-3.5 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-aurum-gold/15 border-aurum-gold text-aurum-gold font-bold shadow-sm'
                          : 'bg-aurum-surface/60 border-aurum-border hover:border-aurum-gold/30 text-aurum-text hover:bg-aurum-surface'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl ${
                          isActive ? 'bg-aurum-gold text-aurum-midnight' : 'bg-aurum-surface text-aurum-gold'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold block truncate">
                          {language === 'bn' ? item.labelBn : item.labelEn}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer Controls */}
        <div className="p-6 border-t border-aurum-border bg-aurum-surface/40 space-y-4">
          {/* Language & Theme Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs font-semibold text-aurum-text hover:border-aurum-gold/40 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-aurum-gold" />
              <span>{language === 'bn' ? 'English Language' : 'বাংলা সংস্করণ'}</span>
            </button>

            <ThemeToggle />
          </div>

          {/* User Status / Logout */}
          {user && (
            <div className="pt-2 flex items-center justify-between border-t border-aurum-border/60">
              <div className="truncate pr-2">
                <span className="text-xs font-bold text-aurum-text block truncate">
                  {user.fullName || user.phone}
                </span>
                <span className="text-[10px] font-mono text-aurum-text-dim block">
                  {user.phone || user.email}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
