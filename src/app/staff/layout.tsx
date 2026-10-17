'use client';

import React from 'react';
import DashboardShell from '../../components/navigation/DashboardShell';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
