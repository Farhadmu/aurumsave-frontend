'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { getRoleNavConfig, NavItem } from '../../lib/role-navigation';

export default function MobileNavigationGrid({
  className = '',
}: {
  className?: string;
}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const pathname = usePathname();

  const roleConfig = getRoleNavConfig(user?.role);

  return (
    <div
      aria-label="Mobile Navigation Dashboard Grid"
      className={`block md:hidden space-y-2.5 ${className}`}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#94A3B8]">
          {language === 'bn' ? 'কার্যক্রম ও নেভিগেশন' : 'Navigation & Services'}
        </span>
        <span className="text-[10px] font-mono text-[#D4AF63]">
          {roleConfig.navItems.length} {language === 'bn' ? 'টি অপশন' : 'Destinations'}
        </span>
      </div>

      {/* Responsive 3-Column Touch Tile Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {roleConfig.navItems.map((item) => {
          const Icon = item.icon;
          const itemPath = item.href.split('?')[0].split('#')[0];
          const isActive = item.exact
            ? pathname === item.href || (pathname === itemPath && !item.href.includes('?'))
            : pathname === item.href ||
              (itemPath !== '/dashboard' &&
                itemPath !== '/staff/admin' &&
                itemPath !== '/staff/compliance' &&
                itemPath !== '/staff/operations' &&
                itemPath !== '/staff/support' &&
                itemPath !== '/staff/auditor' &&
                pathname.startsWith(itemPath));

          const label = language === 'bn' ? item.labelBn : item.labelEn;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`min-h-[78px] rounded-2xl border transition-all duration-200 active:scale-95 flex flex-col items-center justify-center p-2.5 text-center select-none shadow-sm ${
                isActive
                  ? 'bg-[#D4AF63] border-[#D4AF63] text-[#0B1220] font-bold shadow-[0_4px_16px_rgba(212,175,99,0.35)]'
                  : 'bg-[#111A2F]/90 border-[#D4AF63]/20 text-[#F8F6F0] hover:border-[#D4AF63]/45 hover:bg-[#16223D]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1.5 rounded-xl mb-1 transition-colors ${
                  isActive ? 'bg-[#0B1220]/10 text-[#0B1220]' : 'text-[#D4AF63]'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-[11px] font-medium leading-tight truncate max-w-full px-0.5">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
