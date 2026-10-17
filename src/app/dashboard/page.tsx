'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { apiRequest } from '../../lib/api';
import {
  CustomerHoldingsSummary,
  KycStatus,
  OrderStatus,
  PurityGrade,
  CONVERSIONS,
} from '../../shared';
import { formatBDT, formatGoldWeight, formatDateTime } from '../../lib/utils';
import Link from 'next/link';
import MobileNavigationGrid from '../../components/navigation/MobileNavigationGrid';
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
  PieChart,
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
  CreditCard,
  Target,
  Shield,
  Printer,
  X,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    t,
    formatLocalizedBDT,
    formatLocalizedGold,
    formatLocalizedDateTime,
    toLocalizedDigits,
    language,
  } = useLanguage();
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

  // Holdings state check
  const hasHoldings = Boolean(portfolio && portfolio.totalGoldGrams > 0);

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
          ACCOUNT SUMMARY HERO BANNER & MOBILE NAVIGATION GRID (Infographic Design)
         ========================================================================= */}
      <div className="rounded-3xl bg-[#0B1220] border border-[#D4AF63]/30 p-5 sm:p-7 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D4AF63]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Welcome Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs uppercase font-mono tracking-wider text-[#94A3B8] font-bold">
                {t('dashboard.deskLabel')}
              </span>
              <Badge variant="gold" size="sm">
                {isKycApproved ? t('dashboard.level1Verified') : 'Tier-1 KYC Active'}
              </Badge>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#F8F6F0]">
              {language === 'bn' ? 'শুভ দিন' : 'Good Morning'},{' '}
              <span className="gold-gradient-text">{user?.fullName || 'Private Client'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              {language === 'bn'
                ? 'স্বর্ণে গড়ে তুলুন আপনার ভবিষ্যৎ। নিরাপদ, স্বচ্ছ, সার্বভৌম।'
                : 'Build your future with gold. Safe. Transparent. Yours.'}
            </p>
          </div>

          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              leftIcon={<Download className="w-4 h-4 text-aurum-gold" />}
            >
              {t('vault.downloadPassport')}
            </Button>
          </div>
        </div>

        {/* Real Account Data Card & Gold Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-5 rounded-2xl bg-[#070C16]/90 border border-[#D4AF63]/20">
          {/* Metrics */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
                  Total Gold Holdings
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F8F6F0] mt-0.5">
                  {formatLocalizedGold(totalGrams)}
                </div>
                <span className="text-xs font-mono text-[#D4AF63] font-semibold block mt-0.5">
                  ≈ {toLocalizedDigits(totalBhori)} {language === 'bn' ? 'ভরি' : 'Bhori'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
                  Estimated Value
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#D4AF63] mt-0.5">
                  {formatLocalizedBDT(totalValuation)}
                </div>
                <div className="text-xs font-mono text-emerald-400 font-semibold mt-0.5 flex items-center space-x-1">
                  <span>+{formatLocalizedBDT(portfolio?.unrealizedGainLossBdt || 0)}</span>
                  <span>({toLocalizedDigits(portfolio?.unrealizedGainLossPercentage || 0)}%)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Desktop Pill Buttons) */}
            <div className="hidden sm:flex flex-wrap items-center gap-2 pt-2 border-t border-[#D4AF63]/15">
              <Link
                href="/trade?type=BUY"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF63]/15 hover:bg-[#D4AF63]/25 border border-[#D4AF63]/40 text-[#D4AF63] text-xs font-bold transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy Gold</span>
              </Link>
              <Link
                href="/trade?type=SELL"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111A2F] hover:bg-[#16223D] border border-[#D4AF63]/20 text-[#F8F6F0] text-xs font-semibold transition-all"
              >
                <Coins className="w-3.5 h-3.5 text-[#D4AF63]" />
                <span>Sell Gold</span>
              </Link>
              <Link
                href="/goals"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111A2F] hover:bg-[#16223D] border border-[#D4AF63]/20 text-[#F8F6F0] text-xs font-semibold transition-all"
              >
                <Target className="w-3.5 h-3.5 text-[#D4AF63]" />
                <span>Savings Goals</span>
              </Link>
              <Link
                href="/dashboard/auto-save"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111A2F] hover:bg-[#16223D] border border-[#D4AF63]/20 text-[#F8F6F0] text-xs font-semibold transition-all"
              >
                <Repeat className="w-3.5 h-3.5 text-[#D4AF63]" />
                <span>AutoSave</span>
              </Link>
              <Link
                href="/dashboard/portfolio"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111A2F] hover:bg-[#16223D] border border-[#D4AF63]/20 text-[#94A3B8] hover:text-[#F8F6F0] text-xs font-semibold transition-all"
              >
                <PieChart className="w-3.5 h-3.5 text-[#D4AF63]" />
                <span>Portfolio</span>
              </Link>
            </div>
          </div>

          {/* Gold Bullion 3D Visual on Right */}
          <div className="md:col-span-4 flex items-center justify-center p-2">
            <div className="w-36 h-24 sm:w-44 sm:h-28 rounded-2xl overflow-hidden border border-[#D4AF63]/40 shadow-gold-glow relative">
              <img
                src="/images/hero/bullion-macro.jpg"
                alt="Sovereign Gold Bullion"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[10px] font-mono text-[#D4AF63] font-bold">
                  24K 999.9 Bullion
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE NAVIGATION GRID (< 768px): Directly on main screen
           ========================================================================= */}
        <MobileNavigationGrid className="pt-1" />
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
                  ? t('dashboard.kycAlertUnderReview')
                  : t('dashboard.kycAlertTitle')}
              </h4>
              <p className="text-xs text-aurum-text-muted mt-0.5">
                {isKycPending
                  ? t('dashboard.kycAlertPendingDesc')
                  : t('dashboard.kycAlertDesc')}
              </p>
            </div>
          </div>
          {!isKycPending && (
            <a href="/kyc" className="shrink-0">
              <Button variant="primary" size="sm">
                {t('dashboard.verifyNidNow')}
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
            <span>{t('dashboard.portfolioValuation')}</span>
            <Badge variant="emerald" size="sm">
              Live BAJUS
            </Badge>
          </div>
          <div className="text-3xl font-bold font-mono text-aurum-gold">
            {formatLocalizedBDT(totalValuation)}
          </div>
          <div className="mt-3 pt-3 border-t border-aurum-border flex items-center justify-between text-xs text-aurum-text-muted">
            <span>{t('dashboard.unrealizedGain')}</span>
            <span className="font-mono text-emerald-400 font-bold">
              +{formatLocalizedBDT(portfolio?.unrealizedGainLossBdt || 0)} (
              {toLocalizedDigits(portfolio?.unrealizedGainLossPercentage || 0)}%)
            </span>
          </div>
        </Card>

        {/* Total Allocated Physical Weight */}
        <Card hoverLift>
          <div className="flex items-center justify-between text-xs font-mono text-aurum-text-dim mb-2 font-bold uppercase tracking-wider">
            <span>{t('dashboard.allocatedWeight')}</span>
            <Coins className="w-4 h-4 text-aurum-gold" />
          </div>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {formatLocalizedGold(totalGrams)}
          </div>
          <div className="mt-3 pt-3 border-t border-aurum-border flex items-center justify-between text-xs text-aurum-text-muted">
            <span>{t('dashboard.equivalentTola')}</span>
            <span className="font-mono font-bold text-aurum-gold">
              {toLocalizedDigits(totalBhori)} {language === 'bn' ? 'ভরি' : 'Bhori'}
            </span>
          </div>
        </Card>

        {/* Liquid Wallet Balance */}
        <Card hoverLift>
          <div className="flex items-center justify-between text-xs font-mono text-aurum-text-dim mb-2 font-bold uppercase tracking-wider">
            <span>{t('dashboard.liquidCash')}</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-aurum-text">
            {formatLocalizedBDT(portfolio?.fiatBalanceBdt || 0)}
          </div>
          <div className="mt-3 pt-3 border-t border-aurum-border flex items-center justify-between text-xs text-aurum-text-muted">
            <span>{t('dashboard.settlementGateway')}</span>
            <span className="font-mono text-aurum-text font-semibold">bKash / Nagad</span>
          </div>
        </Card>

        {/* Custody Security Guarantee */}
        <Card hoverLift>
          <div className="flex items-center justify-between text-xs font-mono text-aurum-text-dim mb-2 font-bold uppercase tracking-wider">
            <span>{t('dashboard.custodyStatus')}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-serif-luxury text-emerald-400 mt-1">
            {t('dashboard.fullyAllocated')}
          </div>
          <p className="text-[11px] text-aurum-text-muted mt-1 leading-snug">
            {t('dashboard.custodyDesc')}
          </p>
        </Card>
      </div>

      {/* =========================================================================
          PORTFOLIO ASSET PERFORMANCE CHART & PURITY BREAKDOWN
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Vault Holdings / Onboarding Panel */}
        <div className="lg:col-span-8 rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-aurum-border">
            <div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-aurum-text">
                {hasHoldings ? (language === 'bn' ? 'সংরক্ষিত স্বর্ণ ও সম্পদ সারসংক্ষেপ' : 'Allocated Bullion Reserve') : (language === 'bn' ? 'স্বর্ণ ভল্ট স্ট্যাটাস' : 'Vault Custody Status')}
              </h3>
              <p className="text-xs text-aurum-text-muted mt-0.5">
                {hasHoldings
                  ? (language === 'bn' ? 'খতিয়ানে সংরক্ষিত প্রকৃত খাঁটি স্বর্ণ এবং লাইভ বাজার দর।' : 'Real-time verified gold weight recorded in double-entry cryptographic ledger.')
                  : (language === 'bn' ? 'আপনার ব্যক্তিগত ভল্ট সক্রিয় ও প্রস্তুত।' : 'Your allocated depository vault is active and ready for micro-accumulations.')}
              </p>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {language === 'bn' ? 'বাজুস লাইভ সিঙ্ক' : 'BAJUS Live Sync'}
              </span>
            </div>
          </div>

          {!hasHoldings ? (
            <div className="py-10 text-center space-y-4 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center mx-auto border border-aurum-gold/30 shadow-gold-glow">
                <Coins className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  {language === 'bn' ? 'ভল্টে এখনো কোনো স্বর্ণ জমা নেই' : 'No Allocated Gold in Vault Yet'}
                </h4>
                <p className="text-xs text-aurum-text-muted max-w-md mx-auto leading-relaxed">
                  {language === 'bn'
                    ? 'আপনার সার্বভৌম স্বর্ণ ভল্ট সক্রিয়। ৳৫০০ থেকে ০% মেকিং চার্জে শুরু করুন আপনার প্রথম স্বর্ণ সঞ্চয়।'
                    : 'Start your wealth reserve today from ৳500 (0.1g) with zero making charges, guaranteed BAJUS benchmark rates, and instant bKash settlement.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="/trade"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-xs shadow-gold-glow border border-aurum-gold/40 transition-all flex items-center space-x-2"
                >
                  <Coins className="w-4 h-4" />
                  <span>{language === 'bn' ? '২৪K স্বর্ণ কিনুন' : 'Buy 24K Gold Bullion'}</span>
                </a>
                <a
                  href="/dashboard/auto-save"
                  className="px-5 py-3 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/40 text-aurum-text font-bold text-xs transition-all flex items-center space-x-2"
                >
                  <Repeat className="w-4 h-4 text-aurum-gold" />
                  <span>{language === 'bn' ? 'অটোসেভ কিস্তি চালু করুন' : 'Start AutoSave (SIP)'}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-aurum-surface/80 border border-aurum-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                    {language === 'bn' ? 'মোট সংরক্ষিত ওজন' : 'Verified Weight'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-aurum-gold mt-1 block">
                    {formatLocalizedGold(totalGrams)}
                  </span>
                  <span className="text-[11px] text-aurum-text-muted mt-0.5 block">
                    ≈ {toLocalizedDigits(totalBhori)} {language === 'bn' ? 'ভরি' : 'Bhori'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-aurum-surface/80 border border-aurum-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                    {language === 'bn' ? 'লাইভ বাজার মূল্য' : 'Current Valuation'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-aurum-text mt-1 block">
                    {formatLocalizedBDT(totalValuation)}
                  </span>
                  <span className="text-[11px] text-emerald-400 mt-0.5 block font-mono">
                    {language === 'bn' ? 'বাজুস লাইভ মূল্যায়নে' : 'Real-Time Benchmark'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-aurum-surface/80 border border-aurum-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block">
                    {language === 'bn' ? 'অর্জিত লাভ / বৃদ্ধি' : 'Unrealized Growth'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                    +{formatLocalizedBDT(portfolio?.unrealizedGainLossBdt || 0)}
                  </span>
                  <span className="text-[11px] text-aurum-text-muted mt-0.5 block">
                    ({toLocalizedDigits(portfolio?.unrealizedGainLossPercentage || 0)}%)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-aurum-border/60">
                <span className="text-xs text-aurum-text-muted">
                  {language === 'bn' ? 'প্রকৃত ভল্ট কাস্টডিতে সংরক্ষিত ও সুরক্ষিত।' : 'Segregated bullion custody confirmed in Dhaka vault ledger.'}
                </span>
                <div className="flex items-center space-x-2">
                  <a
                    href="/dashboard/portfolio"
                    className="px-4 py-2 rounded-xl bg-aurum-surface hover:bg-aurum-card border border-aurum-border text-xs font-bold text-aurum-text transition-all"
                  >
                    {language === 'bn' ? 'বিস্তারিত পোর্টফোলিও' : 'Detailed Analytics'}
                  </a>
                  <a
                    href="/trade"
                    className="px-4 py-2 rounded-xl bg-aurum-gold hover:brightness-110 text-aurum-midnight text-xs font-bold shadow-gold-glow transition-all"
                  >
                    {language === 'bn' ? 'আরও স্বর্ণ কিনুন' : 'Trade Desk'}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Purity Breakdown Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border space-y-4 shadow-card-luxury">
            <h3 className="font-serif-luxury text-base font-bold text-aurum-text flex items-center justify-between">
              <span>{t('dashboard.purityHoldings')}</span>
              <Coins className="w-4 h-4 text-aurum-gold" />
            </h3>

            {portfolio?.breakdownByPurity.map((item) => (
              <div
                key={item.purity}
                className="p-4 rounded-2xl bg-aurum-surface border border-aurum-border space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-serif-luxury text-base font-bold text-aurum-text">
                    {item.purity} {language === 'bn' ? 'স্বর্ণের বার' : 'Gold Bullion'}
                  </span>
                  <Badge variant={item.purity === PurityGrade.K24 ? 'gold' : 'slate'} size="sm">
                    {item.purity === PurityGrade.K24
                      ? language === 'bn' ? '৯৯.৯% খাঁটি' : '99.9% Pure'
                      : language === 'bn' ? '৯১.৬% হলমার্ক' : '91.6% Hallmark'}
                  </Badge>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-mono text-xl font-bold text-aurum-gold">
                    {formatLocalizedGold(item.grams)}
                  </span>
                  <span className="font-mono text-xs text-aurum-text-muted">
                    {formatLocalizedBDT(item.valuationBdt)}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <a href="/trade?type=BUY">
                <Button variant="outline" size="sm" className="w-full">
                  {t('dashboard.accumulateMore')}
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
              {t('dashboard.ledgerTitle')}
            </h3>
            <p className="text-xs text-aurum-text-muted">
              {t('dashboard.ledgerSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-aurum-text-dim" />
              <input
                type="text"
                placeholder={t('dashboard.searchOrders')}
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
                  {filter === 'ALL'
                    ? t('dashboard.filterAll')
                    : filter === 'BUY'
                    ? t('dashboard.filterBuy')
                    : t('dashboard.filterSell')}
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
              {t('dashboard.exportStatement')}
            </Button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-7 h-7" />}
            title={t('dashboard.noTransactions')}
            description={
              searchQuery
                ? t('dashboard.noTransactionsFiltered')
                : t('dashboard.noTransactionsDesc')
            }
            actionText={searchQuery ? t('dashboard.clearFilter') : t('dashboard.buyGoldNow')}
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
                  <th className="py-3 px-4 font-bold">{t('dashboard.table.orderId')}</th>
                  <th className="py-3 px-4 font-bold">{t('dashboard.table.type')}</th>
                  <th className="py-3 px-4 font-bold">{t('dashboard.table.purity')}</th>
                  <th className="py-3 px-4 font-bold">{t('dashboard.table.weight')}</th>
                  <th className="py-3 px-4 font-bold">{t('dashboard.table.amount')}</th>
                  <th className="py-3 px-4 font-bold">{t('dashboard.table.status')}</th>
                  <th className="py-3 px-4 font-bold">{t('dashboard.table.date')}</th>
                  <th className="py-3 px-4 font-bold text-right">{t('dashboard.table.receipt')}</th>
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
                          {isBuy ? t('dashboard.filterBuy') : t('dashboard.filterSell')}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-aurum-text">{order.purity}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-aurum-gold">
                        {formatLocalizedGold(order.weightGrams)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-aurum-text">
                        {formatLocalizedBDT(order.totalBdt)}
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
                          {order.status === OrderStatus.COMPLETED
                            ? t('common.completed')
                            : order.status === OrderStatus.PAYMENT_CONFIRMED
                            ? t('common.verified')
                            : order.status === OrderStatus.AWAITING_PAYMENT
                            ? t('common.pending')
                            : order.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-aurum-text-muted">
                        {formatLocalizedDateTime(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 rounded-lg bg-aurum-surface border border-aurum-border hover:border-aurum-gold text-aurum-text hover:text-aurum-gold text-xs font-semibold transition-all inline-flex items-center space-x-1"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>{t('dashboard.table.view')}</span>
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
                  {t('dashboard.deliveryDeskTitle')}
                </h3>
                <p className="text-xs text-aurum-text-muted">
                  {t('dashboard.deliveryDeskSubtitle')}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-surface border border-aurum-border space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.availableVaultBalance')}</span>
                <span className="font-mono font-bold text-aurum-gold">
                  {formatLocalizedGold(totalGrams)} ({toLocalizedDigits(totalBhori)} {language === 'bn' ? 'ভরি' : 'Bhori'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.minRedemption')}</span>
                <span className="font-mono text-aurum-text">{t('dashboard.minRedemptionVal')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.certifiedPack')}</span>
                <span className="text-emerald-400 font-bold">{t('dashboard.certiCard')}</span>
              </div>
            </div>

            {totalGrams < 11.664 ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                <p className="font-bold">{t('dashboard.minThresholdTitle')}</p>
                <p>
                  {t('dashboard.minThresholdNotice')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-aurum-text-muted">
                  {t('dashboard.deliveryLogistics')}
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    alert(language === 'bn' ? 'ডেলিভারি আবেদন ভল্ট ডেস্কে গৃহীত হয়েছে।' : 'Delivery request filed with Vault Custody Desk. An officer will contact you.');
                    setDeliveryModalOpen(false);
                  }}
                >
                  {t('dashboard.confirmRedemption')}
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setDeliveryModalOpen(false)}
            >
              {t('dashboard.closeWindow')}
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
                {t('dashboard.certificateTitle')}
              </h3>
              <p className="text-xs font-mono text-aurum-text-dim">
                {t('dashboard.orderRef')} {selectedOrder.orderId}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-aurum-surface border border-aurum-border space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.table.type')}:</span>
                <span className="font-bold text-aurum-text">{selectedOrder.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.table.purity')}:</span>
                <span className="font-bold text-aurum-text">{selectedOrder.purity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.table.weight')}:</span>
                <span className="font-mono font-bold text-aurum-gold">
                  {formatLocalizedGold(selectedOrder.weightGrams, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.table.amount')}:</span>
                <span className="font-mono font-bold text-aurum-text text-sm">
                  {formatLocalizedBDT(selectedOrder.totalBdt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.table.date')}:</span>
                <span className="font-mono text-aurum-text-dim">
                  {formatLocalizedDateTime(selectedOrder.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aurum-text-muted">{t('dashboard.table.status')}:</span>
                <span className="text-emerald-400 font-bold">{selectedOrder.status}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-aurum-text-dim">
                {t('dashboard.certAuditNote')}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedOrder(null)}
            >
              {t('dashboard.closeReceipt')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
