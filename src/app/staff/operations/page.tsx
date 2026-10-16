'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role } from '@aurumsave/shared';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Coins,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';

export default function OperationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [recRes, ordRes] = await Promise.all([
        apiRequest<{ success: boolean; data: any }>('/operations/reconciliation'),
        apiRequest<{ success: boolean; data: any[] }>('/orders?limit=25'),
      ]);
      if (recRes.success) setReport(recRes.data);
      if (ordRes.success) setOrders(ordRes.data);
    } catch (err) {
      console.error('Failed to load operations data:', err);
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
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-aurum-muted">Auditing Financial Ledgers...</p>
      </div>
    );
  }

  const isBalanced = report?.isBalanced;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Treasury &amp; Settlements Desk</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
            Financial Reconciliation &amp; Ledger Audit
          </h1>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold text-xs text-aurum-ivory font-semibold flex items-center space-x-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Rerun Ledger Audit</span>
        </button>
      </div>

      {/* Reconciliation Status Banner */}
      <div
        className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isBalanced
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-rose-500/10 border-rose-500/30'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div
            className={`p-3 rounded-2xl ${
              isBalanced ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isBalanced ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-aurum-ivory">
              {isBalanced
                ? 'All Ledgers 100% Balanced & Reconciled'
                : 'Discrepancy Detected in Financial Journal'}
            </h3>
            <p className="text-xs text-aurum-muted mt-0.5">
              Audited at {new Date(report?.runTimestamp).toLocaleTimeString()} • Zero unallocated gold or fiat drift.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-aurum-slate uppercase tracking-wider font-bold block">
            Net Discrepancy
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-400">
            ৳{report?.discrepancyBdt || '0.00'}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-2">
          <span className="text-xs text-aurum-slate font-semibold uppercase tracking-wider">
            Total Gateway Inflow (MFS)
          </span>
          <div className="text-3xl font-mono font-bold text-aurum-ivory">
            ৳{(report?.totalPaymentReceivedBdt || 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-aurum-muted">
            {report?.totalSuccessfulPaymentsCount || 0} verified transactions
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-2">
          <span className="text-xs text-aurum-slate font-semibold uppercase tracking-wider">
            Total Order Commitments
          </span>
          <div className="text-3xl font-mono font-bold text-aurum-gold">
            ৳{(report?.totalOrderValueBdt || 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-aurum-muted">
            {report?.totalCompletedOrdersCount || 0} settled orders
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-2">
          <span className="text-xs text-aurum-slate font-semibold uppercase tracking-wider">
            Physical Bullion Allocated
          </span>
          <div className="text-3xl font-mono font-bold text-emerald-400">
            {report?.totalGoldCreditedGrams || 0}g
          </div>
          <span className="text-[11px] text-aurum-muted">Vault double-entry journal balance</span>
        </div>
      </div>

      {/* Orders Ledger Inspection Table */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border overflow-hidden">
        <div className="p-6 border-b border-aurum-border flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-aurum-ivory">Settlement Journal</h3>
            <p className="text-xs text-aurum-muted mt-0.5">Audited customer order allocations</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-aurum-muted">
            <thead className="bg-aurum-surface text-[11px] uppercase tracking-wider text-aurum-slate">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Weight (g)</th>
                <th className="p-4">Amount (BDT)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Settled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurum-border/50">
              {orders.map((ord) => (
                <tr key={ord.orderId} className="hover:bg-aurum-surface/40 transition-colors">
                  <td className="p-4 font-mono font-semibold text-aurum-ivory">{ord.orderId}</td>
                  <td className="p-4">{ord.userId?.fullName || 'Customer'}</td>
                  <td className="p-4 font-mono text-aurum-gold">{ord.paymentMethod || 'MFS'}</td>
                  <td className="p-4 font-mono text-aurum-ivory">{ord.weightMilligrams / 1000}g</td>
                  <td className="p-4 font-mono font-bold text-aurum-ivory">
                    ৳{(ord.totalPoisha / 100).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-aurum-slate">
                    {new Date(ord.createdAt).toLocaleDateString()}
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
