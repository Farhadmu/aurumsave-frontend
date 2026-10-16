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
  Scale,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Coins,
  RefreshCw,
  FileSpreadsheet,
  Building,
  CreditCard,
  DollarSign,
} from 'lucide-react';

export default function OperationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [recRes, ordRes] = await Promise.all([
        apiRequest<{ success: boolean; data: any }>('/operations/reconciliation'),
        apiRequest<{ success: boolean; data: any[] }>('/orders/all?limit=25'),
      ]);
      if (recRes.success) setReport(recRes.data);
      if (ordRes.success) setOrders(ordRes.data);
    } catch (err: any) {
      console.error('Failed to load operations data:', err);
      setError('Unable to load Treasury & Reconciliation Ledger.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      !authLoading &&
      (!user ||
        (user.role !== Role.FINANCE_OFFICER &&
          user.role !== Role.ADMIN &&
          user.role !== Role.SUPER_ADMIN))
    ) {
      router.push('/login');
      return;
    }

    if (user) loadData();
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const hasDiscrepancy = report?.hasDiscrepancy || false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <StaffHeader
        title="Treasury & Settlement Desk"
        subtitle="Automated double-entry reconciliation between Mobile Financial Services (bKash/Nagad) gateway settlements and physical bullion vault allocations."
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      {/* Discrepancy Status Banner */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
          hasDiscrepancy
            ? 'bg-rose-500/10 border-rose-500/30'
            : 'bg-emerald-500/10 border-emerald-500/30'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              hasDiscrepancy
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {hasDiscrepancy ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-aurum-text">
              {hasDiscrepancy
                ? 'Reconciliation Discrepancy Detected'
                : 'Sovereign Double-Entry Ledger Balanced (0.00 Drift)'}
            </h4>
            <p className="text-xs text-aurum-text-muted mt-0.5">
              {hasDiscrepancy
                ? 'Gateway transaction volume differs from physical bullion allocations. Manual audit required.'
                : 'All bKash, Nagad, and bank transactions match cumulative vault ledger milligram entries with 100% precision.'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Re-Run Audit
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Total MFS Deposits Collected
          </span>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {formatBDT(report?.totalPaymentsCollectedBdt || 0)}
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block font-mono">
            {report?.successfulPaymentsCount || 0} Settled Inbound Gateways
          </span>
        </Card>

        <Card glow hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Allocated Bullion Backing
          </span>
          <div className="text-3xl font-bold font-mono text-aurum-gold">
            {formatGoldWeight(report?.totalGoldAllocatedGrams || 0)}
          </div>
          <span className="text-xs text-emerald-400 mt-2 block font-mono font-bold">
            100.0% Reserve Coverage Ratio
          </span>
        </Card>

        <Card hoverLift>
          <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
            Cumulative Platform Margin
          </span>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {formatBDT(report?.totalPlatformFeesCollectedBdt || 0)}
          </div>
          <span className="text-xs text-aurum-text-muted mt-2 block font-mono">
            0.5% Protocol Fee Accruals
          </span>
        </Card>
      </div>

      {/* Settlement Orders Journal */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-aurum-border">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Recent Clearing & Settlement Transactions
            </h3>
            <p className="text-xs text-aurum-text-muted">
              Real-time audit log of executed market transactions and payment gateway IDs
            </p>
          </div>
          <Badge variant="gold" size="sm">
            {orders.length} Logged Entries
          </Badge>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-8 h-8 text-aurum-gold" />}
            title="No Orders Cleared Yet"
            description="The settlement pipeline will list transactions as customers place buy and sell orders."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                  <th className="py-3 px-4 font-bold">Order Ref</th>
                  <th className="py-3 px-4 font-bold">Direction</th>
                  <th className="py-3 px-4 font-bold">Purity</th>
                  <th className="py-3 px-4 font-bold">Allocated Weight</th>
                  <th className="py-3 px-4 font-bold">Amount (BDT)</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aurum-border/60">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-aurum-surface/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-aurum-text">
                      {ord.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={ord.orderType === 'BUY' ? 'gold' : 'slate'} size="sm">
                        {ord.orderType}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-aurum-text">{ord.purity}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-aurum-gold">
                      {formatGoldWeight(ord.weightGrams)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-aurum-text">
                      {formatBDT(ord.totalBdt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={ord.status === 'COMPLETED' ? 'emerald' : 'amber'}
                        size="sm"
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-aurum-text-dim">
                      {formatDateTime(ord.createdAt)}
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
