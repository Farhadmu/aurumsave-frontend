'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { getRoleNavConfig } from '../../lib/role-navigation';
import MoreMenuDrawer from './MoreMenuDrawer';
import {
  Home,
  Coins,
  TrendingUp,
  BookOpen,
  LogIn,
  MoreHorizontal,
} from 'lucide-react';

export default function ResponsiveBottomNav() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const roleConfig = getRoleNavConfig(user?.role);

  // Fallback nav items for unauthenticated public visitors
  const publicNavItems = [
    { id: 'home', labelEn: 'Home', labelBn: 'হোম', href: '/', icon: Home, exact: true },
    { id: 'trade', labelEn: 'Trade', labelBn: 'লেনদেন', href: '/trade', icon: Coins },
    { id: 'rates', labelEn: 'Live Rates', labelBn: 'লাইভ রেট', href: '/#rates', icon: TrendingUp },
    { id: 'academy', labelEn: 'Academy', labelBn: 'একাডেমি', href: '/academy', icon: BookOpen },
    { id: 'login', labelEn: 'Sign In', labelBn: 'লগইন', href: '/login', icon: LogIn },
  ];

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-aurum-midnight/95 backdrop-blur-xl border-t border-aurum-border/80 px-2 py-1.5 pb-safe transition-colors"
        aria-label="Mobile Navigation Dock"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {user ? (
            /* Authenticated Role Navigation (4 Primary items + More) */
            <>
              {roleConfig.primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href) && item.href !== '/dashboard';

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                      isActive
                        ? 'text-aurum-gold font-bold scale-105'
                        : 'text-aurum-text-muted hover:text-aurum-text'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-aurum-gold/15' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[62px]">
                      {language === 'bn' ? item.labelBn : item.labelEn}
                    </span>
                  </Link>
                );
              })}

              {/* 5th Slot: More Button */}
              <button
                onClick={() => setMoreOpen(true)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  moreOpen ? 'text-aurum-gold font-bold scale-105' : 'text-aurum-text-muted hover:text-aurum-text'
                }`}
                aria-label="Open more features drawer"
              >
                <div className={`p-1.5 rounded-xl transition-colors ${moreOpen ? 'bg-aurum-gold/15' : ''}`}>
                  <MoreHorizontal className="w-5 h-5 text-aurum-gold" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[62px]">
                  {language === 'bn' ? 'আরও' : 'More'}
                </span>
              </button>
            </>
          ) : (
            /* Public Guest Navigation */
            publicNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-aurum-gold font-bold scale-105'
                      : 'text-aurum-text-muted hover:text-aurum-text'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-aurum-gold/15' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[62px]">
                    {language === 'bn' ? item.labelBn : item.labelEn}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </nav>

      {/* Role-Specific Drawer */}
      <MoreMenuDrawer
        isOpen={moreOpen}
        onClose={() => setMoreOpen(false)}
        config={roleConfig}
      />
    </>
  );
}
