'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { getRoleNavConfig, NavItem } from '../../lib/role-navigation';
import { LogOut, ChevronRight, User as UserIcon } from 'lucide-react';

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const pathname = usePathname();

  const roleConfig = getRoleNavConfig(user?.role);

  return (
    <aside
      aria-label="Desktop Dashboard Sidebar"
      className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#0B1220] border-r border-[#D4AF63]/20 z-40 select-none shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
    >
      {/* 1. Brand Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#D4AF63]/15">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF63] via-[#F5E6B3] to-[#996515] flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
            <span className="font-serif-luxury font-black text-[#0B1220] text-base tracking-wider">
              Au
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-luxury text-xl font-bold tracking-tight text-[#F8F6F0] group-hover:text-[#D4AF63] transition-colors">
              Aurum<span className="text-[#D4AF63] font-sans font-light">Save</span>
            </span>
            <span className="text-[10px] font-mono text-[#D4AF63]/80 -mt-1 tracking-wider uppercase font-semibold">
              {language === 'bn' ? roleConfig.roleTitleBn : roleConfig.roleTitleEn}
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Scrollable Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-[#D4AF63]/20 scrollbar-track-transparent">
        {roleConfig.groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            {roleConfig.groups.length > 1 && (
              <span className="px-3 text-[10px] uppercase font-mono tracking-wider font-bold text-[#64748B] block">
                {language === 'bn' ? group.groupBn : group.groupEn}
              </span>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
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
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                      isActive
                        ? 'bg-[#D4AF63] text-[#0B1220] font-bold shadow-md'
                        : 'text-[#94A3B8] hover:text-[#F8F6F0] hover:bg-[#111A2F]/80'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    title={label}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#0B1220]'
                          : 'text-[#94A3B8] group-hover:text-[#D4AF63]'
                      }`}
                    />
                    <span className="truncate flex-1">{label}</span>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#0B1220]/70" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Bottom User Profile Area */}
      {user && (
        <div className="p-4 border-t border-[#D4AF63]/15 bg-[#070C16]/80 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 overflow-hidden group flex-1"
          >
            <div className="w-9 h-9 rounded-full bg-[#111A2F] border border-[#D4AF63]/40 flex items-center justify-center text-[#D4AF63] font-bold text-xs shrink-0 group-hover:border-[#D4AF63] transition-colors">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="truncate flex-1">
              <span className="text-xs font-bold text-[#F8F6F0] truncate block group-hover:text-[#D4AF63] transition-colors">
                {user.fullName || 'Private Client'}
              </span>
              <span className="text-[10px] font-mono text-[#94A3B8] truncate block">
                {user.email || user.phone}
              </span>
            </div>
          </Link>

          <button
            onClick={() => logout()}
            className="p-2 rounded-xl hover:bg-[#111A2F] text-[#94A3B8] hover:text-rose-400 transition-colors shrink-0 ml-1"
            title={language === 'bn' ? 'লগআউট' : 'Sign Out'}
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
