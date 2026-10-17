'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { getRoleDashboardRoute } from '../../lib/role-navigation';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { ArrowLeft } from 'lucide-react';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { language } = useLanguage();
  const mainDashboardRoute = getRoleDashboardRoute(user?.role);
  const isSubpage = pathname !== '/dashboard' && pathname !== mainDashboardRoute;

  return (
    <div className="min-h-screen bg-[#060913] text-[#F8F6F0] flex">
      {/* 1. Desktop Persistent Left Sidebar (>= 768px) */}
      <DashboardSidebar />

      {/* 2. Main Content Viewport (offset by 64 on desktop) */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header (Desktop search bar & user menu / Mobile compact logo & avatar) */}
        <DashboardHeader />

        {/* Dashboard Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Mobile Back-to-Dashboard Navigation Option when inside a subpage */}
          {isSubpage && (
            <div className="md:hidden flex items-center justify-between pb-3 -mt-1 border-b border-[#D4AF63]/15">
              <Link
                href={mainDashboardRoute}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#111A2F] border border-[#D4AF63]/30 text-xs font-semibold text-[#D4AF63] hover:bg-[#D4AF63]/15 active:scale-95 transition-all shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}</span>
              </Link>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
