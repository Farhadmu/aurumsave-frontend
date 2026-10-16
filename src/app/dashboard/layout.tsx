'use client';

import React from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../lib/language-context';
import {
  LayoutDashboard,
  PieChart,
  Coins,
  Target,
  Repeat,
  Calculator,
  Award,
  Shield,
  HelpCircle,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const navItems = [
    {
      href: '/dashboard',
      labelEn: 'Overview',
      labelBn: 'ওভারভিউ',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/portfolio',
      labelEn: 'Portfolio Insights',
      labelBn: 'পোর্টফোলিও বিশ্লেষণ',
      icon: PieChart,
    },
    {
      href: '/trade',
      labelEn: 'Buy & Sell',
      labelBn: 'স্বর্ণ লেনদেন',
      icon: Coins,
    },
    {
      href: '/goals',
      labelEn: 'Savings Goals',
      labelBn: 'সঞ্চয় লক্ষ্য',
      icon: Target,
    },
    {
      href: '/dashboard/auto-save',
      labelEn: 'AutoSave (SIP)',
      labelBn: 'অটোসেভ কিস্তি',
      icon: Repeat,
    },
    {
      href: '/dashboard/simulator',
      labelEn: 'What-If Simulator',
      labelBn: 'সঞ্চয় সিমুলেটর',
      icon: Calculator,
    },
    {
      href: '/dashboard/gold-passport',
      labelEn: 'Gold Passport',
      labelBn: 'গোল্ড পাসপোর্ট',
      icon: Award,
    },
    {
      href: '/security',
      labelEn: 'Security',
      labelBn: 'নিরাপত্তা',
      icon: Shield,
    },
    {
      href: '/support',
      labelEn: 'Support',
      labelBn: 'সহায়তা',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-aurum-midnight text-aurum-text flex flex-col">
      {/* Wealth Sub-Navigation Bar */}
      <nav aria-label="Dashboard sub-navigation" className="sticky top-16 z-30 bg-aurum-card/90 backdrop-blur-md border-b border-aurum-border/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-aurum-gold/15 text-aurum-gold border border-aurum-gold/30 shadow-sm font-bold'
                      : 'text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-aurum-gold' : 'text-aurum-text-dim'}`} />
                  <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
