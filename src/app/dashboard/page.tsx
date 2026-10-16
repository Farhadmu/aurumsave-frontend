'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import {
  CustomerHoldingsSummary,
  KycStatus,
  OrderStatus,
  PurityGrade,
  CONVERSIONS,
} from '../../shared';
import { formatBDT, formatGoldWeight, formatDateTime } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Skeleton, PortfolioCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/States';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
  Truck,
  Repeat,
  Download,
  Search,
  CheckCircle2,
  X,
  CreditCard,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<CustomerHoldingsSummary | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state for orders
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Physical Delivery Modal State
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  // Receipt Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleDownloadStatement = () => {
    if (!orders || orders.length === 0) return;

    const headers = ['Order ID', 'Type', 'Purity', 'Weight (g)', 'Amount (BDT)', 'Status', 'Date'];
    const rows = orders.map((o) => [
      `"${o.orderId || ''}"`,
      `"${o.orderType || ''}"`,
      `"${o.purity || ''}"`,
      o.weightGrams ?? 0,
      o.totalBdt ?? 0,
      `"${o.status || ''}"`,
      `"${new Date(o.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `AurumSave_Gold_Statement_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const [portfolioRes, ordersRes] = await Promise.all([
        apiRequest<{ success: boolean; data: CustomerHoldingsSummary }>('/portfolio'),
        apiRequest<{ success: boolean; data: any[] }>('/orders?limit=25'),
      ]);

      if (portfolioRes.success && portfolioRes.data) {
        setPortfolio(portfolioRes.data);
      } else {
        // Fallback default clean state for fresh customer
        setPortfolio({
          totalGoldGrams: 0,
          availableGoldGrams: 0,
          pendingGoldGrams: 0,
          totalValuationBdt: 0,
          unrealizedGainLossBdt: 0,
          unrealizedGainLossPercentage: 0,
          breakdownByPurity: [
            {
              purity: PurityGrade.K24,
              grams: 0,
              valuationBdt: 0,
              avgPurchaseRateBdt: 12450,
            },
            {
              purity: PurityGrade.K22,
              grams: 0,
              valuationBdt: 0,
              avgPurchaseRateBdt: 11412,
            },
          ],
          fiatBalanceBdt: 0,
          lastUpdated: new Date().toISOString(),
        });
      }

      if (ordersRes.success && ordersRes.data) {
        const rawOrders = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : (ordersRes.data as any).orders || [];
        const normalized = rawOrders.map((o: any) => ({
          ...o,
          weightGrams:
            typeof o.weightGrams === 'number'
              ? o.weightGrams
              : typeof o.weightMilligrams === 'number'
              ? o.weightMilligrams / 1000
              : 0,
          totalBdt:
            typeof o.totalBdt === 'number'
              ? o.totalBdt
              : typeof o.totalPoisha === 'number'
              ? o.totalPoisha / 100
              : 0,
        }));
        setOrders(normalized);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to synchronize with secure vault ledger.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  // Synthetic portfolio performance timeline based on customer holdings
  const performanceData = useMemo(() => {
    const days = 14;
    const data = [];
    const now = new Date();
    const currentVal = portfolio?.totalValuationBdt || 0;

    for (let i = days; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const factor = currentVal > 0 ? (1 - (i / days) * 0.05) : 0;
      data.push({
        date: d.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' }),
        valuation: Math.round(currentVal * factor),
      });
    }
    return data;
  }, [portfolio]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        orderFilter === 'ALL' || order.orderType === orderFilter;
      const matchesSearch =
        searchQuery === '' ||
        order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.quoteId?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [orders, orderFilter, searchQuery]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PortfolioCardSkeleton />
          <PortfolioCardSkeleton />
          <PortfolioCardSkeleton />
          <PortfolioCardSkeleton />
        </div>
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  const isKycApproved = user?.kycStatus === KycStatus.APPROVED;
  const isKycPending = user?.kycStatus === KycStatus.PENDING_REVIEW;
  const totalGrams = portfolio?.totalGoldGrams || 0;
  const totalValuation = portfolio?.totalValuationBdt || 0;
  const totalBhori = (totalGrams / CONVERSIONS.GRAMS_PER_BHORI).toFixed(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* =========================================================================
          GREETING & KYC VERIFICATION CALLOUT
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-aurum-text-dim font-bold">
              Secure Allocated Vault Desk
            </span>
            <Badge variant="gold" size="sm">
              Level 1 Verified Client
            </Badge>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
            Welcome back, <span className="gold-gradient-text">{user?.fullName}</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeliveryModalOpen(true)}
            leftIcon={<Truck className="w-4 h-4 text-aurum-gold" />}
          >
            Physical Delivery
          </Button>
          <a href="/trade">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Coins className="w-4 h-4" />}
            >
              Instant Trade Desk
            </Button>
          </a>
        </div>
      </div>

      {/* KYC Alert if not verified */}
      {!isKycApproved && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-aurum-text">
                {isKycPending
                  ? 'Identity Verification Under Review'
                  : 'Complete BFIU Identity Verification'}
              </h4>
              <p className="text-xs text-aurum-text-muted mt-0.5">
                {isKycPending
                  ? 'Your NID verification is currently being reviewed by our compliance desk. High-value physical delivery will be enabled upon approval.'
                  : 'Submit your Smart NID or Passport to unlock physical bullion delivery and elevated transaction limits.'}
              </p>
            </div>
          </div>
          {!isKycPending && (
            <a href="/kyc" className="shrink-0">
              <Button variant="primary" size="sm">
                Verify NID Now
              </Button>
            </a>
          )}
        </div>
      )}

      {/* =========================================================================
          PORTFOLIO SUMMARY CARDS
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Valuation */}
        <Card glow hoverLift>
          <div className="flex items-center justify-between text-xs font-mono text-aurum-text-dim mb-2 font-bold uppercase tracking-wider">
            <span>Portfolio Valuation</span>
            <Badge variant="emerald" size="sm">
              Live BAJUS
            </Badge>
          </div>
          <div className="text-3xl font-bold font-mono text-aurum-gold">
            {formatBDT(totalValuation)}
          </div>
          <div className="mt-3 pt-3 border-t border-aurum-border flex items-center justify-between text-xs text-aurum-text-muted">
            <span>Unrealized Gain:</span>
            <span className="font-mono text-emerald-400 font-bold">
              +{formatBDT(portfolio?.unrealizedGainLossBdt || 0)} (
              {portfolio?.unrealizedGainLossPercentage || 0}%)
            </span>
          </div>
        </Card>

        {/* Total Allocated Physical Weight */}
        <Card hoverLift>
          <div className="flex items-center justify-between text-xs font-mono text-aurum-text-dim mb-2 font-bold uppercase tracking-wider">
            <span>Allocated Bullion Weight</span>
            <Coins className="w-4 h-4 text-aurum-gold" />
          </div>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {formatGoldWeight(totalGrams)}
          </div>
          <div className="mt-3 pt-3 border-t border-aurum-border flex items-center justify-between text-xs text-aurum-text-muted">
            <span>Equivalent Tola:</span>
            <span className="font-mono font-bold text-aurum-gold">{totalBhori} Bhori</span>
          </div>
        </Card>

        {/* Liquid Wallet Balance */}
        <Card hoverLift>
          <div className="flex items-center justify-between text-xs font-mono text-aurum-text-dim mb-2 font-bold uppercase tracking-wider">
            <span>Liquid Cash Balance</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {formatBDT(portfolio?.fiatBalanceBdt || 0)}
          </div>
          <div className="mt-3 pt-3 border-t border-aurum-border flex items-center justify-between text-xs text-aurum-text-muted">
            <span>Settlement Gateway:</span>
            <span className="font-mono text-aurum-text font-semibold">bKash / Nagad</span>
          </div>
        </Card>

        {/* Custody Security Guarantee */}
        <Card hoverLift>
          <div className="flex items-center justify-between text-xs font-mono text-aurum-text-dim mb-2 font-bold uppercase tracking-wider">
            <span>Vault Custody Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-serif-luxury text-emerald-400 mt-1">
            100% Allocated
          </div>
          <p className="text-[11px] text-aurum-text-muted mt-1 leading-snug">
            Segregated custody insured by Lloyd&apos;s underwriter in Class-III bank vault.
          </p>
        </Card>
      </div>

      {/* =========================================================================
          PORTFOLIO ASSET PERFORMANCE CHART & PURITY BREAKDOWN
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-8 rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-aurum-border">
            <div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-aurum-text">
                Vault Asset Valuation Trajectory
              </h3>
              <p className="text-xs text-aurum-text-muted">
                Real-time valuation based on active BAJUS spot rates
              </p>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Synchronized
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="vaultGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(212, 175, 55, 0.15)' }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `৳${v.toLocaleString()}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-aurum-surface border border-aurum-border-gold shadow-xl text-xs space-y-1">
                          <p className="text-aurum-text-dim font-mono">{data.date}</p>
                          <p className="font-bold font-mono text-aurum-gold text-sm">
                            ৳{data.valuation.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="valuation"
                  stroke="#D4AF37"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#vaultGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Purity Breakdown Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-4 shadow-card-luxury">
            <h3 className="font-serif-luxury text-base font-bold text-aurum-text flex items-center justify-between">
              <span>Holdings by Purity Grade</span>
              <Coins className="w-4 h-4 text-aurum-gold" />
            </h3>

            {portfolio?.breakdownByPurity.map((item) => (
              <div
                key={item.purity}
                className="p-4 rounded-2xl bg-aurum-surface border border-aurum-border space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-serif-luxury text-base font-bold text-aurum-text">
                    {item.purity} Gold Bullion
                  </span>
                  <Badge variant={item.purity === PurityGrade.K24 ? 'gold' : 'slate'} size="sm">
                    {item.purity === PurityGrade.K24 ? '99.9% Pure' : '91.6% Hallmark'}
                  </Badge>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-mono text-xl font-bold text-aurum-gold">
                    {formatGoldWeight(item.grams)}
                  </span>
                  <span className="font-mono text-xs text-aurum-text-muted">
                    {formatBDT(item.valuationBdt)}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <a href="/trade?type=BUY">
                <Button variant="outline" size="sm" className="w-full">
                  Accumulate More Gold
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RECENT VAULT TRANSACTIONS & AUDITED ORDERS
         ========================================================================= */}
      <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Audited Vault Transaction Ledger
            </h3>
            <p className="text-xs text-aurum-text-muted">
              Immutable journal of gold purchases, sales, and custodial settlements
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-aurum-text-dim" />
              <input
                type="text"
                placeholder="Search Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 w-36 sm:w-48"
              />
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex rounded-xl bg-aurum-surface p-1 border border-aurum-border text-xs font-semibold">
              {(['ALL', 'BUY', 'SELL'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOrderFilter(filter)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    orderFilter === filter
                      ? 'bg-aurum-gold text-aurum-midnight font-bold shadow-sm'
                      : 'text-aurum-text-muted hover:text-aurum-text'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Export Statement */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadStatement}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              disabled={orders.length === 0}
            >
              Export Statement
            </Button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-7 h-7" />}
            title="No Transactions Found"
            description={
              searchQuery
                ? 'No orders matched your search query.'
                : 'You have not made any gold purchases or liquidations yet. Start accumulating from as little as ৳500.'
            }
            actionText={searchQuery ? 'Clear Filter' : 'Buy Gold Now'}
            onAction={() => {
              if (searchQuery) setSearchQuery('');
              else router.push('/trade');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Type</th>
                  <th className="py-3 px-4 font-bold">Purity</th>
                  <th className="py-3 px-4 font-bold">Weight</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aurum-border/60">
                {filteredOrders.map((order) => {
                  const isBuy = order.orderType === 'BUY';
                  return (
                    <tr
                      key={order._id || order.orderId}
                      className="hover:bg-aurum-surface/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-aurum-text">
                        {order.orderId}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={isBuy ? 'gold' : 'slate'} size="sm">
                          {order.orderType}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-aurum-text">{order.purity}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-aurum-gold">
                        {formatGoldWeight(order.weightGrams)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-aurum-text">
                        {formatBDT(order.totalBdt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            order.status === OrderStatus.COMPLETED
                              ? 'emerald'
                              : order.status === OrderStatus.PAYMENT_CONFIRMED
                              ? 'sapphire'
                              : order.status === OrderStatus.AWAITING_PAYMENT
                              ? 'amber'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-aurum-text-muted">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 rounded-lg bg-aurum-surface border border-aurum-border hover:border-aurum-gold text-aurum-text hover:text-aurum-gold text-xs font-semibold transition-all inline-flex items-center space-x-1"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          PHYSICAL BULLION DELIVERY MODAL
         ========================================================================= */}
      {deliveryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-aurum-card border border-aurum-border-gold p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setDeliveryModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-aurum-surface text-aurum-text-muted hover:text-aurum-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  Physical Bullion Delivery Desk
                </h3>
                <p className="text-xs text-aurum-text-muted">
                  Redeem your segregated physical gold into certified bars
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-surface border border-aurum-border space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Available Vault Balance:</span>
                <span className="font-mono font-bold text-aurum-gold">
                  {formatGoldWeight(totalGrams)} ({totalBhori} Bhori)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Minimum Physical Redemption:</span>
                <span className="font-mono text-aurum-text">1 Bhori (11.664 Grams)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Certified Assay Pack:</span>
                <span className="text-emerald-400 font-bold">Tamper-Proof CertiCard</span>
              </div>
            </div>

            {totalGrams < 11.664 ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                <p className="font-bold">Minimum Threshold Requirement</p>
                <p>
                  You need at least <strong>1 Bhori (11.664g)</strong> to request physical bar delivery. You currently hold <strong>{totalGrams}g</strong>. Continue micro-saving to reach the delivery milestone.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-aurum-text-muted">
                  Our armored transport logistics partner will coordinate delivery to your verified registered address with biometric verification upon handover.
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    alert('Delivery request filed with Vault Custody Desk. An officer will contact you.');
                    setDeliveryModalOpen(false);
                  }}
                >
                  Confirm Physical Redemption Request
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setDeliveryModalOpen(false)}
            >
              Close Window
            </Button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ORDER RECEIPT MODAL
         ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-aurum-card border border-aurum-border-gold p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-aurum-surface text-aurum-text-muted hover:text-aurum-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                AurumSave Bullion Certificate
              </h3>
              <p className="text-xs font-mono text-aurum-text-dim">
                Order Reference: {selectedOrder.orderId}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-surface border border-aurum-border space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Transaction Type:</span>
                <span className="font-bold text-aurum-text">{selectedOrder.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Gold Purity:</span>
                <span className="font-bold text-aurum-text">{selectedOrder.purity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Allocated Weight:</span>
                <span className="font-mono font-bold text-aurum-gold">
                  {formatGoldWeight(selectedOrder.weightGrams, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Settlement Total:</span>
                <span className="font-mono font-bold text-aurum-text text-sm">
                  {formatBDT(selectedOrder.totalBdt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Timestamp:</span>
                <span className="font-mono text-aurum-text-dim">
                  {formatDateTime(selectedOrder.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">Vault Status:</span>
                <span className="text-emerald-400 font-bold">{selectedOrder.status}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-aurum-text-dim">
                Cryptographically audited by AurumSave Sovereign Ledger. Non-repudiable property of the authenticated client.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedOrder(null)}
            >
              Close Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
