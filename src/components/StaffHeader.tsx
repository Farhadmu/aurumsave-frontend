'use client';

import React from 'react';
import { useAuth } from '../lib/auth-context';
import { useLanguage } from '../lib/language-context';
import { Role } from '../shared';
import { Badge } from './ui/Badge';
import MobileNavigationGrid from './navigation/MobileNavigationGrid';
import {
  Shield,
  Users,
  FileCheck2,
  Scale,
  Headphones,
  FileSearch,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function StaffHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  const isSuperAdmin = user?.role === Role.SUPER_ADMIN || user?.role === Role.ADMIN;

  const links = [
    {
      name: t('staff.nav.admin'),
      href: '/staff/admin',
      icon: Users,
      visible: isSuperAdmin,
    },
    {
      name: t('staff.nav.compliance'),
      href: '/staff/compliance',
      icon: FileCheck2,
      visible: isSuperAdmin || user?.role === Role.KYC_OFFICER,
    },
    {
      name: t('staff.nav.operations'),
      href: '/staff/operations',
      icon: Scale,
      visible: isSuperAdmin || user?.role === Role.FINANCE_OFFICER,
    },
    {
      name: t('staff.nav.support'),
      href: '/staff/support',
      icon: Headphones,
      visible: isSuperAdmin || user?.role === Role.SUPPORT_AGENT,
    },
    {
      name: t('staff.nav.auditor'),
      href: '/staff/auditor',
      icon: FileSearch,
      visible: isSuperAdmin || user?.role === Role.AUDITOR,
    },
  ];

  return (
    <div className="space-y-6 pb-6 border-b border-aurum-border">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-aurum-text-dim">
          <span className="uppercase font-bold text-aurum-gold">{t('staff.header.ops')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-aurum-text-muted">{user?.role}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="emerald" pulse size="sm">
            {t('staff.header.coreLive')}
          </Badge>
          <a
            href="/dashboard"
            className="text-xs text-aurum-text-muted hover:text-aurum-gold transition-colors inline-flex items-center space-x-1"
          >
            <span>{t('staff.header.customerView')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Workspace Title */}
      <div>
        <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-aurum-text tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-aurum-text-muted mt-1 max-w-3xl">
          {subtitle}
        </p>
      </div>

      {/* Desk Switcher Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {links
          .filter((l) => l.visible)
          .map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  isActive
                    ? 'bg-aurum-gold/15 border-aurum-gold text-aurum-gold shadow-sm'
                    : 'bg-aurum-card border-aurum-border text-aurum-text-muted hover:text-aurum-text hover:border-aurum-gold/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
              </a>
            );
          })}
      </div>
      {/* Mobile Navigation Grid (Exclusively for screens < 768px, no bottom bar/drawer) */}
      <MobileNavigationGrid className="pt-2 block md:hidden" />
    </div>
  );
}
