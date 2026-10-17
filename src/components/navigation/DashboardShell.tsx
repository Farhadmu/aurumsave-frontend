'use client';

import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
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
          {children}
        </main>
      </div>
    </div>
  );
}
