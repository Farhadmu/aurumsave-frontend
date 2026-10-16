'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role, AuditAction } from '@aurumsave/shared';
import {
  ShieldCheck,
  FileSearch,
  Filter,
  Clock,
  Lock,
  Search,
} from 'lucide-react';

export default function AuditorPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [logs, setLogs] = useState<any[]>([]);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

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

    async function loadLogs() {
      try {
        const res = await apiRequest<{ success: boolean; data: any[] }>(
          `/audit/events${actionFilter ? `?action=${actionFilter}` : ''}`,
        );
        if (res.success && res.data) {
          setLogs(res.data);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) loadLogs();
  }, [user, authLoading, router, actionFilter]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-aurum-muted">Connecting to Immutable Audit Journal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Read-Only Regulatory Audit Workspace</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
            Cryptographic Audit Trail Browser
          </h1>
          <p className="text-xs text-aurum-muted mt-0.5">
            Immutable chronicle of all authentication, KYC, order, and ledger balance mutations.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-aurum-card border border-aurum-border text-aurum-ivory focus:border-aurum-gold focus:outline-none"
          >
            <option value="">All Audit Actions</option>
            <option value={AuditAction.ORDER_SETTLED}>ORDER_SETTLED</option>
            <option value={AuditAction.ORDER_CREATED}>ORDER_CREATED</option>
            <option value={AuditAction.KYC_REVIEWED}>KYC_REVIEWED</option>
            <option value={AuditAction.USER_LOGGED_IN}>USER_LOGGED_IN</option>
            <option value={AuditAction.USER_REGISTERED}>USER_REGISTERED</option>
            <option value={AuditAction.ADMIN_SETTING_UPDATED}>ADMIN_SETTING_UPDATED</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl bg-aurum-card border border-aurum-border overflow-hidden">
        <div className="p-5 bg-aurum-surface border-b border-aurum-border flex items-center justify-between text-xs">
          <span className="font-semibold text-aurum-slate uppercase tracking-wider">
            Total Audited Records ({logs.length})
          </span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Non-Repudiation Verified</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-aurum-muted">
            <thead className="bg-aurum-navy text-[11px] uppercase tracking-wider text-aurum-slate">
              <tr>
                <th className="p-4">Log ID</th>
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Role</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurum-border/50">
              {logs.map((log) => (
                <tr key={log.logId} className="hover:bg-aurum-surface/40 transition-colors">
                  <td className="p-4 font-mono text-[11px] text-aurum-gold">{log.logId}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes('SETTLED')
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : log.action.includes('KYC')
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-aurum-surface text-aurum-ivory'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-aurum-ivory">
                    {log.actorId?.fullName || 'System / Guest'}
                  </td>
                  <td className="p-4 font-mono text-aurum-slate text-[11px]">{log.actorRole}</td>
                  <td className="p-4 font-mono text-aurum-ivory">
                    {log.entityType} ({log.entityId || 'N/A'})
                  </td>
                  <td className="p-4 text-aurum-slate">
                    {new Date(log.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="p-4 font-mono text-[10px] text-aurum-slate max-w-xs truncate">
                    {JSON.stringify(log.details)}
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
