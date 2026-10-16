'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role } from '@aurumsave/shared';
import {
  Users,
  Coins,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [overview, setOverview] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== Role.SUPER_ADMIN && user.role !== Role.ADMIN))) {
      router.push('/login');
      return;
    }

    async function loadData() {
      try {
        const [ovRes, usrRes] = await Promise.all([
          apiRequest<{ success: boolean; data: any }>('/admin/overview'),
          apiRequest<{ success: boolean; data: any[] }>(`/admin/users${roleFilter ? `?role=${roleFilter}` : ''}`),
        ]);

        if (ovRes.success) setOverview(ovRes.data);
        if (usrRes.success) setUsersList(usrRes.data);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) loadData();
  }, [user, authLoading, router, roleFilter]);

  const handleToggleUserStatus = async (targetUserId: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/admin/users/${targetUserId}/status`, {
        method: 'POST',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      setUsersList((prev) =>
        prev.map((u) => (u._id === targetUserId ? { ...u, isActive: !currentStatus } : u)),
      );
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-aurum-muted">Loading Administrative Workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-aurum-gold/20 text-aurum-gold text-xs font-bold uppercase tracking-wider mb-1">
            <span>{user?.role} Workspace</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
            Platform Operational Command
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Audit Trail Immutable</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-aurum-card border border-aurum-border space-y-2">
          <div className="flex items-center justify-between text-xs text-aurum-slate">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-aurum-gold" />
          </div>
          <div className="text-2xl font-mono font-bold text-aurum-ivory">
            {overview?.totalCustomers || 0}
          </div>
          <span className="text-[11px] text-aurum-muted">Registered savers &amp; staff</span>
        </div>

        <div className="p-5 rounded-2xl bg-aurum-card border border-aurum-border space-y-2">
          <div className="flex items-center justify-between text-xs text-aurum-slate">
            <span>Vault Gold Backing</span>
            <Coins className="w-4 h-4 text-aurum-gold" />
          </div>
          <div className="text-2xl font-mono font-bold text-aurum-gold">
            {overview?.totalVaultGoldGrams || 0}g
          </div>
          <span className="text-[11px] text-aurum-muted">Allocated physical bullion</span>
        </div>

        <div className="p-5 rounded-2xl bg-aurum-card border border-aurum-border space-y-2">
          <div className="flex items-center justify-between text-xs text-aurum-slate">
            <span>Transacted Volume</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-aurum-ivory">
            ৳{(overview?.totalVolumeBdt || 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-aurum-muted">{overview?.totalOrdersCount || 0} total orders</span>
        </div>

        <div className="p-5 rounded-2xl bg-aurum-card border border-aurum-border space-y-2">
          <div className="flex items-center justify-between text-xs text-aurum-slate">
            <span>Open Support Tickets</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-aurum-ivory">
            {overview?.openTicketsCount || 0}
          </div>
          <span className="text-[11px] text-aurum-muted">Pending staff attention</span>
        </div>
      </div>

      {/* User Management Section */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border overflow-hidden">
        <div className="p-6 border-b border-aurum-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-aurum-ivory">Platform User Management</h3>
            <p className="text-xs text-aurum-muted mt-0.5">Manage access, status, and role privileges</p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-ivory focus:border-aurum-gold focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value={Role.CUSTOMER}>Customers Only</option>
              <option value={Role.KYC_OFFICER}>KYC Officers</option>
              <option value={Role.FINANCE_OFFICER}>Finance Officers</option>
              <option value={Role.SUPPORT_AGENT}>Support Agents</option>
              <option value={Role.AUDITOR}>Auditors</option>
              <option value={Role.ADMIN}>Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-aurum-muted">
            <thead className="bg-aurum-surface text-[11px] uppercase tracking-wider text-aurum-slate">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">KYC Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurum-border/50">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-aurum-surface/40 transition-colors">
                  <td className="p-4 font-semibold text-aurum-ivory">{u.fullName}</td>
                  <td className="p-4 font-mono">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-aurum-surface border border-aurum-border text-aurum-gold">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-aurum-navy text-aurum-muted">
                      {u.kycStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.role !== Role.SUPER_ADMIN && (
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          u.isActive
                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
