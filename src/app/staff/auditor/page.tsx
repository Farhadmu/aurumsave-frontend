'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role, AuditAction } from '../../../shared';
import { formatDateTime } from '../../../lib/utils';
import StaffHeader from '../../../components/StaffHeader';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../../components/ui/States';
import {
  ShieldCheck,
  FileSearch,
  Filter,
  Clock,
  Lock,
  Search,
  Hash,
  Database,
  CheckCircle2,
} from 'lucide-react';

export default function AuditorPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [logs, setLogs] = useState<any[]>([]);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiRequest<{ success: boolean; data: any[] }>(
        `/audit/events${actionFilter ? `?action=${actionFilter}` : ''}`,
      );
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
      setError('Unable to stream cryptographic audit journal.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      !authLoading &&
      (!user ||
        (user.role !== Role.AUDITOR &&
          user.role !== Role.ADMIN &&
          user.role !== Role.SUPER_ADMIN))
    ) {
      router.push('/login');
      return;
    }

    if (user) loadLogs();
  }, [user, authLoading, router, actionFilter]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.action?.toLowerCase().includes(query) ||
      log.entityId?.toLowerCase().includes(query) ||
      log.userId?.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <StaffHeader
        title="Non-Repudiation Audit Journal"
        subtitle="Cryptographically chained event stream monitoring quote reservations, ledger settlements, compliance decisions, and administrative actions."
      />

      {error && <ErrorState message={error} onRetry={loadLogs} />}

      {/* Verification Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Chain Integrity
          </span>
          <div className="text-xl font-bold font-serif-luxury text-emerald-400 mt-1 flex items-center space-x-1.5">
            <CheckCircle2 className="w-5 h-5" />
            <span>100% Tamper Evident</span>
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block font-mono">
            SHA-256 Sequential Hash Chaining
          </span>
        </Card>

        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Journal Access Privilege
          </span>
          <div className="text-xl font-bold font-serif-luxury text-aurum-gold mt-1">
            Strictly Read-Only
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block">
            Zero In-Place Mutation Permitted
          </span>
        </Card>

        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Logged Events Recorded
          </span>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {logs.length}
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block">
            Indexed by Transaction and Actor ID
          </span>
        </Card>
      </div>

      {/* Audit Log Stream */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Immutable System Events
            </h3>
            <p className="text-xs text-aurum-text-muted">
              Live inspection of system state mutations signed by actor roles
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-aurum-text-dim" />
              <input
                type="text"
                placeholder="Search action or entity ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 w-44 sm:w-56"
              />
            </div>

            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text font-semibold focus:outline-none focus:border-aurum-gold/60"
            >
              <option value="">All Action Types</option>
              <option value="USER_REGISTERED">User Registered</option>
              <option value="USER_LOGGED_IN">User Logged In</option>
              <option value="KYC_SUBMITTED">KYC Submitted</option>
              <option value="KYC_REVIEWED">KYC Reviewed</option>
              <option value="QUOTE_REQUESTED">Quote Requested</option>
              <option value="ORDER_CREATED">Order Created</option>
              <option value="ORDER_SETTLED">Order Settled</option>
              <option value="LEDGER_COMMITTED">Ledger Committed</option>
            </select>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <EmptyState
            icon={<FileSearch className="w-7 h-7" />}
            title="No Audit Records"
            description="No system audit entries matched your filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                  <th className="py-3 px-4 font-bold">Event ID</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                  <th className="py-3 px-4 font-bold">Actor Role</th>
                  <th className="py-3 px-4 font-bold">Actor Identity</th>
                  <th className="py-3 px-4 font-bold">Target Entity</th>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aurum-border/60">
                {filteredLogs.map((log) => (
                  <tr key={log._id || log.logId} className="hover:bg-aurum-surface/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-aurum-gold font-bold">
                      {log.logId ? log.logId.substring(0, 12) : log._id?.substring(0, 12)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="gold" size="sm">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-aurum-text">
                      {log.userRole || 'SYSTEM'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-aurum-text-muted">
                      {log.userId?.email || log.userId || 'Core Engine'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-aurum-text-dim">
                      {log.entityType ? `${log.entityType}:${log.entityId?.substring(0, 8)}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-aurum-text-dim">
                      {formatDateTime(log.createdAt)}
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
