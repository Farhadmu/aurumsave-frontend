'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import {
  CustomerHoldingsSummary,
  KycStatus,
  OrderStatus,
  PurityGrade,
  CONVERSIONS,
} from '@aurumsave/shared';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShoppingBag,
  Coins,
  Receipt,
  Headphones,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<CustomerHoldingsSummary | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    async function loadDashboardData() {
      if (!user) return;
      try {
        const [portfolioRes, ordersRes] = await Promise.all([
          apiRequest<{ success: boolean; data: CustomerHoldingsSummary }>('/portfolio'),
          apiRequest<{ success: boolean; data: any[] }>('/orders?limit=10'),
        ]);

        if (portfolioRes.success) setPortfolio(portfolioRes.data);
        if (ordersRes.success) setOrders(ordersRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-aurum-muted">Connecting to your allocated bullion vault...</p>
      </div>
    );
  }

  const isKycApproved = user?.kycStatus === KycStatus.APPROVED;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / KYC Notification */}
      {!isKycApproved && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-aurum-ivory">Identity Verification Required</h4>
              <p className="text-xs text-aurum-muted mt-0.5">
                {user?.kycStatus === KycStatus.PENDING_REVIEW
                  ? 'Your NID verification documents are currently under review by our compliance desk.'
                  : 'Submit your Smart NID or Passport to unlock physical bullion delivery and high-value limits.'}
              </p>
            </div>
          </div>
          {user?.kycStatus !== KycStatus.PENDING_REVIEW && (
            <a
              href="/kyc"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-aurum-navy font-bold text-xs shadow-sm whitespace-nowrap transition-all"
            >
              Verify KYC Now
            </a>
          )}
        </div>
      )}

      {/* Header Profile & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-aurum-border/60">
        <div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
            Welcome back, {user?.fullName}
          </h1>
          <div className="flex items-center space-x-3 mt-1 text-xs text-aurum-muted">
            <span>Vault Account ID: <strong className="text-aurum-ivory">{user?.id.substring(0, 10)}...</strong></span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Custody Active</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/trade?type=BUY"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-xs shadow-gold-glow flex items-center space-x-1.5 transition-all"
          >
            <Coins className="w-4 h-4" />
            <span>Buy Gold</span>
          </a>
          <a
            href="/trade?type=SELL"
            className="px-5 py-2.5 rounded-xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 text-aurum-ivory font-semibold text-xs flex items-center space-x-1.5 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sell / Liquidate</span>
          </a>
        </div>
      </div>

      {/* Main Portfolio Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Valuation Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-aurum-card via-aurum-surface to-aurum-card border border-aurum-border/80 shadow-surface-subtle space-y-4">
          <div className="flex items-center justify-between text-xs text-aurum-slate">
            <span className="uppercase tracking-wider font-semibold">Total Portfolio Valuation</span>
            <span className="px-2 py-0.5 rounded bg-aurum-navy border border-aurum-border text-emerald-400 font-mono text-[10px]">
              Live BAJUS Rate
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-aurum-gold">
              ৳{portfolio?.totalValuationBdt.toLocaleString() || '0.00'}
            </div>
            <div className="flex items-center space-x-1.5 mt-2 text-xs">
              {(portfolio?.unrealizedGainLossBdt || 0) >= 0 ? (
                <span className="flex items-center text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-4 h-4 mr-0.5" />
                  +৳{portfolio?.unrealizedGainLossBdt.toLocaleString()} (+{portfolio?.unrealizedGainLossPercentage}%)
                </span>
              ) : (
                <span className="flex items-center text-rose-400 font-semibold">
                  <ArrowDownRight className="w-4 h-4 mr-0.5" />
                  -৳{Math.abs(portfolio?.unrealizedGainLossBdt || 0).toLocaleString()} ({portfolio?.unrealizedGainLossPercentage}%)
                </span>
              )}
              <span className="text-aurum-slate">Unrealized Capital Gain</span>
            </div>
          </div>
        </div>

        {/* Physical Gold Holdings Card */}
        <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border/80 shadow-surface-subtle space-y-4">
          <div className="flex items-center justify-between text-xs text-aurum-slate">
            <span className="uppercase tracking-wider font-semibold">Allocated Bullion Weight</span>
            <span className="text-aurum-gold font-mono text-[11px]">
              {(portfolio?.totalGoldGrams || 0) >= 11.664 ? 'Eligible for Delivery' : 'Micro-Saving'}
            </span>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-aurum-ivory">
                {portfolio?.totalGoldGrams || 0}
              </span>
              <span className="text-sm font-semibold text-aurum-muted">Grams</span>
            </div>
            <p className="text-xs text-aurum-muted mt-2">
              ≈ <strong className="text-aurum-gold font-mono">{((portfolio?.totalGoldGrams || 0) / CONVERSIONS.GRAMS_PER_BHORI).toFixed(3)} Bhori</strong> (1 Bhori = 11.664g)
            </p>
          </div>
        </div>

        {/* Custody Breakdown Card */}
        <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border/80 shadow-surface-subtle space-y-4">
          <div className="flex items-center justify-between text-xs text-aurum-slate">
            <span className="uppercase tracking-wider font-semibold">Vault Security Status</span>
            <span className="text-emerald-400 font-semibold text-[11px]">Insured 1:1</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-aurum-border/40 text-aurum-muted">
              <span>Available to Liquidate:</span>
              <span className="font-mono font-bold text-aurum-ivory">{portfolio?.availableGoldGrams || 0}g</span>
            </div>
            <div className="flex justify-between py-1 border-b border-aurum-border/40 text-aurum-muted">
              <span>Settlement Pending:</span>
              <span className="font-mono text-aurum-ivory">{portfolio?.pendingGoldGrams || 0}g</span>
            </div>
            <div className="flex justify-between py-1 text-aurum-muted">
              <span>Annual Storage Fee:</span>
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Free Allocated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Breakdown by Purity */}
      <div className="p-6 rounded-3xl bg-aurum-surface border border-aurum-border space-y-4">
        <h3 className="font-serif text-lg font-bold text-aurum-ivory">
          Vault Allocation by Purity Grade
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolio?.breakdownByPurity?.map((item) => (
            <div key={item.purity} className="p-4 rounded-2xl bg-aurum-card border border-aurum-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-lg font-bold text-aurum-gold">{item.purity}</span>
                <span className="text-[11px] text-aurum-muted">
                  {item.purity === PurityGrade.K24 ? '99.9% 24K' : '91.6% 22K'}
                </span>
              </div>
              <div className="text-xl font-mono font-bold text-aurum-ivory">
                {item.grams}g
              </div>
              <div className="mt-2 text-xs text-aurum-muted flex justify-between">
                <span>Valuation:</span>
                <span className="font-mono text-aurum-ivory">৳{item.valuationBdt.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border overflow-hidden">
        <div className="p-6 border-b border-aurum-border flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-aurum-ivory">Recent Transactions</h3>
            <p className="text-xs text-aurum-muted mt-0.5">Your official order and settlement records</p>
          </div>
          <a href="/trade" className="text-xs font-semibold text-aurum-gold hover:underline">
            New Transaction &rarr;
          </a>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-aurum-muted text-xs space-y-2">
            <Coins className="w-8 h-8 text-aurum-slate mx-auto" />
            <p>You have not made any gold transactions yet.</p>
            <a href="/trade" className="text-aurum-gold font-semibold hover:underline inline-block mt-2">
              Start with your first ৳500 savings &rarr;
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-aurum-muted">
              <thead className="bg-aurum-surface text-[11px] uppercase tracking-wider text-aurum-slate">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Purity</th>
                  <th className="p-4">Gold Weight</th>
                  <th className="p-4">Total (BDT)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aurum-border/50">
                {orders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-aurum-surface/30 transition-colors">
                    <td className="p-4 font-mono font-medium text-aurum-ivory">{ord.orderId}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.orderType === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {ord.orderType}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-aurum-gold">{ord.purity}</td>
                    <td className="p-4 font-mono text-aurum-ivory">{ord.weightMilligrams / 1000}g</td>
                    <td className="p-4 font-mono font-bold text-aurum-ivory">
                      ৳{(ord.totalPoisha / 100).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          ord.status === OrderStatus.COMPLETED
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : ord.status === OrderStatus.AWAITING_PAYMENT
                            ? 'bg-amber-500/15 text-amber-400 animate-pulse'
                            : 'bg-aurum-surface text-aurum-slate'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-aurum-slate">
                      {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      {ord.status === OrderStatus.AWAITING_PAYMENT ? (
                        <a
                          href={`/payment/checkout?paymentId=${ord.paymentId || ''}&orderId=${ord.orderId}`}
                          className="px-3 py-1 rounded-lg bg-aurum-gold text-aurum-navy font-bold text-[10px] shadow-sm hover:brightness-110"
                        >
                          Complete Payment
                        </a>
                      ) : (
                        <span className="text-emerald-400 text-[10px] font-medium">Allocated</span>
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
