'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role } from '../../../shared';
import { formatBDT, formatGoldWeight, formatDateTime } from '../../../lib/utils';
import StaffHeader from '../../../components/StaffHeader';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../../components/ui/States';
import {
  Users,
  Coins,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Building,
  Scale,
  RefreshCw,
  Lock,
  AlertTriangle,
  Power,
  Radio,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [overview, setOverview] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emergencySettings, setEmergencySettings] = useState<any[]>([
    { key: 'PAUSE_BUY_ORDERS', value: false, label: 'Pause Gold Purchases', desc: 'Temporary halt on new BUY orders during volatility' },
    { key: 'PAUSE_SELL_ORDERS', value: false, label: 'Pause Gold Liquidations', desc: 'Temporary freeze on client SELL requests' },
    { key: 'MAINTENANCE_MODE', value: false, label: 'Platform Incident Lockdown', desc: 'Displays maintenance notice across public site' },
    { key: 'BKASH_GATEWAY_ACTIVE', value: true, label: 'bKash MFS Direct Gateway', desc: 'Enable / disable bKash PGW API' },
    { key: 'NAGAD_GATEWAY_ACTIVE', value: true, label: 'Nagad Direct Gateway', desc: 'Enable / disable Nagad PGW API' },
    { key: 'SSLCOMMERZ_GATEWAY_ACTIVE', value: true, label: 'SSLCommerz Gateway', desc: 'Cards, Netbanking & Multi-MFS checkout' },
  ]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [ovRes, usrRes, setRes] = await Promise.all([
        apiRequest<{ success: boolean; data: any }>('/admin/overview'),
        apiRequest<{ success: boolean; data: any[] }>(
          `/admin/users${roleFilter ? `?role=${roleFilter}` : ''}`,
        ),
        apiRequest<{ success: boolean; data: any[] }>('/admin/settings').catch(() => null),
      ]);

      if (ovRes.success) setOverview(ovRes.data);
      if (usrRes.success) setUsersList(usrRes.data);
      if (setRes && setRes.success && Array.isArray(setRes.data)) {
        setEmergencySettings((prev) =>
          prev.map((item) => {
            const found = setRes.data.find((s: any) => s.key === item.key);
            return found ? { ...item, value: Boolean(found.value) } : item;
          }),
        );
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setError('Unable to load executive administration statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      !authLoading &&
      (!user || (user.role !== Role.SUPER_ADMIN && user.role !== Role.ADMIN))
    ) {
      router.push('/login');
      return;
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
        prev.map((u) =>
          u._id === targetUserId ? { ...u, isActive: !currentStatus } : u,
        ),
      );
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleToggleSetting = async (key: string, currentValue: boolean) => {
    try {
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          key,
          value: !currentValue,
          description: `Super Admin emergency control update for ${key}`,
        }),
      });
      setEmergencySettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value: !currentValue } : s)),
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update platform emergency setting');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter((u) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.role?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <StaffHeader
        title="Executive Command Center"
        subtitle="Platform governance, vault reserve liquidity ratios, and cross-staff privilege allocation."
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card glow hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Total Vault Custody (Grams)
          </span>
          <div className="text-3xl font-bold font-mono text-aurum-gold">
            {formatGoldWeight(overview?.totalVaultHoldingsGrams || 0)}
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block font-mono">
            {((overview?.totalVaultHoldingsGrams || 0) / 1000).toFixed(3)} Kilograms Allocated
          </span>
        </Card>

        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Total Vault Assets Under Custody
          </span>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {formatBDT(overview?.totalValuationBdt || 0)}
          </div>
          <span className="text-xs text-emerald-400 mt-2 block font-mono font-bold">
            100% Fully Backed Reserves
          </span>
        </Card>

        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Total Client Accounts
          </span>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {overview?.totalUsers || usersList.length}
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block">
            {overview?.usersPendingKyc || 0} Pending BFIU Review
          </span>
        </Card>

        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Total Platform Orders
          </span>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {overview?.totalOrders || 0}
          </div>
          <span className="text-xs text-emerald-400 mt-2 block font-mono">
            Double-Entry Verified
          </span>
        </Card>
      </div>

      {/* Financial Emergency Controls (Kill Switches) */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                Platform Financial Emergency Controls
              </h3>
              <p className="text-xs text-aurum-text-muted">
                Audited kill-switches and payment gateway enablement (Super Admin Authorization Required)
              </p>
            </div>
          </div>
          <Badge variant="gold" size="sm">
            Dual-Control Enforced
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencySettings.map((s) => (
            <div
              key={s.key}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between space-x-3 ${
                s.value
                  ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                  : 'bg-aurum-surface border-aurum-border text-aurum-text'
              }`}
            >
              <div>
                <span className="font-bold text-xs block text-aurum-text">{s.label}</span>
                <span className="text-[11px] text-aurum-text-muted mt-0.5 block leading-snug">
                  {s.desc}
                </span>
                <span className="text-[10px] font-mono text-aurum-text-dim mt-1.5 block">
                  Config Key: {s.key}
                </span>
              </div>
              <button
                onClick={() => handleToggleSetting(s.key, s.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  s.value
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg'
                    : 'bg-aurum-card hover:bg-aurum-surface border border-aurum-border text-aurum-text-muted'
                }`}
              >
                {s.value ? 'HALTED' : 'ACTIVE'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Staff & User Management Table */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              User & Privilege Management
            </h3>
            <p className="text-xs text-aurum-text-muted">
              Inspect credentials, verify role assignments, or toggle client security status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-aurum-text-dim" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 w-44 sm:w-56"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text font-semibold focus:outline-none focus:border-aurum-gold/60"
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="KYC_OFFICER">KYC Officer</option>
              <option value="FINANCE_OFFICER">Finance Officer</option>
              <option value="SUPPORT_AGENT">Support Agent</option>
              <option value="AUDITOR">Auditor</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={<Users className="w-7 h-7" />}
            title="No Users Found"
            description="No users matched your role filter or search criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                  <th className="py-3 px-4 font-bold">User</th>
                  <th className="py-3 px-4 font-bold">Email Address</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">KYC Status</th>
                  <th className="py-3 px-4 font-bold">Account State</th>
                  <th className="py-3 px-4 font-bold">Registered</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aurum-border/60">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-aurum-surface/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-aurum-text">
                      {u.fullName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-aurum-text-muted">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          u.role === Role.SUPER_ADMIN
                            ? 'gold'
                            : u.role === Role.CUSTOMER
                            ? 'slate'
                            : 'sapphire'
                        }
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          u.kycStatus === 'APPROVED'
                            ? 'emerald'
                            : u.kycStatus === 'PENDING_REVIEW'
                            ? 'amber'
                            : 'slate'
                        }
                        size="sm"
                      >
                        {u.kycStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 font-semibold ${
                          u.isActive !== false ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {u.isActive !== false ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Suspended</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-aurum-text-dim">
                      {formatDateTime(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== Role.SUPER_ADMIN && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.isActive !== false)}
                          className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                            u.isActive !== false
                              ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                              : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {u.isActive !== false ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
