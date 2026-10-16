'use client';

import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-aurum-midnight text-aurum-text flex flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
