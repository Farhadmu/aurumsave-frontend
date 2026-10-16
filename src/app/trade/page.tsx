'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { apiRequest } from '../../lib/api';
import {
  OrderType,
  PurityGrade,
  PaymentMethod,
  QuoteDetails,
  CONVERSIONS,
} from '../../shared';
import { formatBDT, formatGoldWeight } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Coins,
  ShoppingBag,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

function TradeContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { t, formatLocalizedBDT, formatLocalizedGold, toLocalizedDigits, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderType, setOrderType] = useState<OrderType>(
    searchParams.get('type') === 'SELL' ? OrderType.SELL : OrderType.BUY,
  );
  const [purity, setPurity] = useState<PurityGrade>(
    (searchParams.get('purity') as PurityGrade) || PurityGrade.K24,
  );
  const [inputMode, setInputMode] = useState<'BDT' | 'GRAM'>('BDT');
  const [amountInput, setAmountInput] = useState<number>(
    Number(searchParams.get('amount')) || 5000,
  );

  const [quote, setQuote] = useState<QuoteDetails | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [isQuoting, setIsQuoting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BKASH);
  const [payoutType, setPayoutType] = useState<'BKASH' | 'NAGAD' | 'BANK'>('BKASH');
  const [payoutNumber, setPayoutNumber] = useState<string>('');
  const [payoutBankName, setPayoutBankName] = useState<string>('');
  const [payoutRoutingNumber, setPayoutRoutingNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Quote countdown timer
  useEffect(() => {
    if (!quote) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQuote(null);
          setError('Rate lock expired (300s window). Please request a fresh live quote.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quote]);

  const handleGetQuote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsQuoting(true);

    try {
      const payload: any = {
        orderType,
        purity,
      };

      if (inputMode === 'BDT') {
        payload.amountBdt = amountInput;
      } else {
        payload.grams = amountInput;
      }

      const res = await apiRequest<{ success: boolean; data: QuoteDetails }>('/gold/quotes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        setQuote(res.data);
        setSecondsRemaining(res.data.validForSeconds || 300);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate quote. Check input parameters.');
    } finally {
      setIsQuoting(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!quote) return;
    setError(null);

    if (orderType === OrderType.SELL) {
      if (!payoutNumber.trim()) {
        setError('Please provide your recipient account or wallet number for payout settlement.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderRes = await apiRequest<{ success: boolean; data: any }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          quoteId: quote.quoteId,
          paymentMethod,
          idempotencyKey: `IDEM-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          ...(orderType === OrderType.SELL
            ? {
                payoutDetails: {
                  accountType: payoutType,
                  accountNumber: payoutNumber.trim(),
                  ...(payoutType === 'BANK'
                    ? {
                        bankName: payoutBankName.trim() || undefined,
                        routingNumber: payoutRoutingNumber.trim() || undefined,
                      }
                    : {}),
                },
              }
            : {}),
        }),
      });

      const order = orderRes.data;

      if (orderType === OrderType.SELL) {
        router.push(`/dashboard?success=sold&orderId=${order.orderId}`);
        return;
      }

      const payRes = await apiRequest<{ success: boolean; data: any }>('/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({
          orderId: order.orderId,
          gateway: paymentMethod,
        }),
      });

      const paymentSession = payRes.data;
      router.push(
        `/payment/checkout?paymentId=${paymentSession.paymentId}&orderId=${order.orderId}`,
      );
    } catch (err: any) {
      setError(err.message || 'Order execution failed. Please retry.');
      setIsSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-1.5">
          <Badge variant="gold" pulse size="sm">
            {t('trade.rateLock')}
          </Badge>
          <span className="text-xs text-aurum-text-dim">• {t('trade.zeroSlippage')}</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-aurum-text">
          {orderType === OrderType.BUY ? t('trade.buyTitle') : t('trade.sellTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-aurum-text-muted mt-1 max-w-2xl">
          {t('trade.deskSubtitle')}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {user?.isAccountFrozen && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/60 flex items-center justify-between gap-3 text-rose-200 text-xs shadow-lg">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold block">{t('trade.emergencyLockActive')}</span>
              <span className="text-[11px] text-rose-300">
                {t('trade.emergencyLockNotice')}
              </span>
            </div>
          </div>
          <a
            href="/security"
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 shadow transition-all"
          >
            {t('nav.security')}
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Input Configuration Card */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-aurum-card border border-aurum-border shadow-card-luxury space-y-6">
            {/* Direction Selector */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-aurum-surface border border-aurum-border">
              <button
                type="button"
                onClick={() => {
                  setOrderType(OrderType.BUY);
                  setQuote(null);
                }}
                className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs transition-all ${
                  orderType === OrderType.BUY
                    ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
                    : 'text-aurum-text-muted hover:text-aurum-text'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>{t('trade.btnBuy')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderType(OrderType.SELL);
                  setQuote(null);
                }}
                className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs transition-all ${
                  orderType === OrderType.SELL
                    ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
                    : 'text-aurum-text-muted hover:text-aurum-text'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('trade.btnSell')}</span>
              </button>
            </div>

            {/* Purity Selection */}
            <div>
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block mb-2">
                {t('trade.puritySelect')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPurity(PurityGrade.K24);
                    setQuote(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    purity === PurityGrade.K24
                      ? 'bg-aurum-surface border-aurum-gold shadow-sm'
                      : 'bg-aurum-surface/40 border-aurum-border hover:border-aurum-border-gold'
                  }`}
                >
                  <span className="font-serif-luxury font-bold text-base text-aurum-gold block">
                    {language === 'bn' ? '২৪ ক্যারেট বার' : '24K Bullion'}
                  </span>
                  <span className="text-[11px] text-aurum-text-muted">
                    {t('trade.k24desc')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPurity(PurityGrade.K22);
                    setQuote(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    purity === PurityGrade.K22
                      ? 'bg-aurum-surface border-aurum-gold shadow-sm'
                      : 'bg-aurum-surface/40 border-aurum-border hover:border-aurum-border-gold'
                  }`}
                >
                  <span className="font-serif-luxury font-bold text-base text-aurum-text block">
                    {language === 'bn' ? '২২ ক্যারেট হলমার্ক' : '22K Hallmark'}
                  </span>
                  <span className="text-[11px] text-aurum-text-muted">
                    {t('trade.k22desc')}
                  </span>
                </button>
              </div>
            </div>

            {/* Amount / Weight Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim">
                  {t('trade.amountTo')} {orderType === OrderType.BUY ? t('trade.invest') : t('trade.liquidate')}
                </label>
                <div className="flex rounded-xl bg-aurum-surface p-0.5 border border-aurum-border text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setInputMode('BDT')}
                    className={`px-3 py-1 rounded-lg font-bold ${
                      inputMode === 'BDT'
                        ? 'bg-aurum-gold text-aurum-midnight shadow-sm'
                        : 'text-aurum-text-muted'
                    }`}
                  >
                    BDT (৳)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputMode('GRAM');
                      if (amountInput > 100) setAmountInput(1);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold ${
                      inputMode === 'GRAM'
                        ? 'bg-aurum-gold text-aurum-midnight shadow-sm'
                        : 'text-aurum-text-muted'
                    }`}
                  >
                    {language === 'bn' ? 'গ্রাম (g)' : 'Grams (g)'}
                  </button>
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-aurum-gold text-lg">
                  {inputMode === 'BDT' ? '৳' : 'g'}
                </span>
                <input
                  type="number"
                  min={inputMode === 'BDT' ? 500 : 0.05}
                  step={inputMode === 'BDT' ? 500 : 0.1}
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(Number(e.target.value));
                    setQuote(null);
                  }}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-aurum-surface border border-aurum-border text-2xl font-mono font-bold text-aurum-text focus:border-aurum-gold/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Gateway for BUY */}
            {orderType === OrderType.BUY && (
              <div>
                <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block mb-2">
                  {t('trade.paymentMethod')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: PaymentMethod.BKASH, label: 'bKash MFS', color: 'text-pink-400' },
                    { id: PaymentMethod.NAGAD, label: 'Nagad MFS', color: 'text-orange-400' },
                    { id: PaymentMethod.SSLCOMMERZ, label: 'Card / Bank', color: 'text-blue-400' },
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setPaymentMethod(gw.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === gw.id
                          ? 'bg-aurum-surface border-aurum-gold shadow-sm'
                          : 'bg-aurum-surface/40 border-aurum-border'
                      }`}
                    >
                      <span className={`block font-bold text-xs ${gw.color}`}>{gw.label}</span>
                      <span className="text-[10px] text-aurum-text-dim">{t('trade.zeroSurcharge')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payout Destination for SELL */}
            {orderType === OrderType.SELL && (
              <div className="p-4 rounded-2xl bg-aurum-surface/60 border border-aurum-border space-y-3">
                <label className="text-xs font-bold uppercase font-mono tracking-wider text-aurum-text-dim block">
                  {t('trade.payoutDest')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'BKASH', label: t('trade.payoutBkash') },
                    { id: 'NAGAD', label: t('trade.payoutNagad') },
                    { id: 'BANK', label: t('trade.payoutBank') },
                  ].map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setPayoutType(dest.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        payoutType === dest.id
                          ? 'bg-aurum-card border-aurum-gold text-aurum-gold'
                          : 'bg-aurum-card/40 border-aurum-border text-aurum-text-muted'
                      }`}
                    >
                      {dest.label}
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder={
                      payoutType === 'BANK'
                        ? t('trade.accountPlaceholder')
                        : t('trade.mobilePlaceholder')
                    }
                    value={payoutNumber}
                    onChange={(e) => setPayoutNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-aurum-card border border-aurum-border text-sm font-mono text-aurum-text focus:border-aurum-gold/60 focus:outline-none"
                  />
                </div>

                {payoutType === 'BANK' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder={t('trade.bankNamePlaceholder')}
                      value={payoutBankName}
                      onChange={(e) => setPayoutBankName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-aurum-card border border-aurum-border text-xs text-aurum-text focus:border-aurum-gold/60 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder={t('trade.routingPlaceholder')}
                      value={payoutRoutingNumber}
                      onChange={(e) => setPayoutRoutingNumber(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-aurum-card border border-aurum-border text-xs text-aurum-text focus:border-aurum-gold/60 focus:outline-none"
                    />
                  </div>
                )}
                <span className="text-[11px] text-aurum-text-dim block">
                  {language === 'bn'
                    ? 'টাকা ওয়ালেটে জমা হওয়া পর্যন্ত স্বর্ণ নিরাপদে এসক্রোতে সংরক্ষিত থাকবে।'
                    : 'Gold will be safely placed into vault escrow until payout disbursement is authorized and completed by Operations.'}
                </span>
              </div>
            )}

            {!quote ? (
              <Button
                type="button"
                variant="primary"
                className="w-full py-4 text-base"
                isLoading={isQuoting}
                onClick={handleGetQuote}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isQuoting
                  ? language === 'bn' ? 'বাজুস লাইভ দরের সাথে যুক্ত হচ্ছে...' : 'Connecting to BAJUS Oracle...'
                  : t('trade.requestQuote')}
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleGetQuote}
              >
                {language === 'bn' ? 'নতুন লাইভ দর নিন' : 'Refresh Live Quote'}
              </Button>
            )}
          </div>
        </div>

        {/* Right Quote Summary Card */}
        <div className="md:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-aurum-card border border-aurum-border shadow-card-luxury relative">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-aurum-border">
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-aurum-text-dim">
                {t('trade.breakdown.title')}
              </span>
              {quote && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
              )}
            </div>

            {quote ? (
              <div className="space-y-5 pt-4">
                <div>
                  <span className="text-[11px] text-aurum-text-dim block uppercase font-mono">
                    {orderType === OrderType.BUY ? t('trade.breakdown.goldWeight') : t('trade.pureWeight')}
                  </span>
                  <div className="text-4xl font-mono font-black text-aurum-gold mt-1">
                    {formatLocalizedGold(quote.weightGrams)}
                  </div>
                  <span className="text-xs text-aurum-text-muted mt-0.5 block font-mono">
                    ({quote.purity} Gold • {toLocalizedDigits((quote.weightGrams / CONVERSIONS.GRAMS_PER_BHORI).toFixed(3))} {language === 'bn' ? 'ভরি' : 'Bhori'})
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-aurum-border text-xs">
                  <div className="flex justify-between text-aurum-text-muted">
                    <span>{t('trade.breakdown.benchmark')}:</span>
                    <span className="font-mono text-aurum-text">{formatLocalizedBDT(quote.ratePerGramBdt)}/g</span>
                  </div>
                  <div className="flex justify-between text-aurum-text-muted">
                    <span>{t('trade.breakdown.pureMetal')}:</span>
                    <span className="font-mono text-aurum-text">{formatLocalizedBDT(quote.subtotalBdt)}</span>
                  </div>
                  <div className="flex justify-between text-aurum-text-muted">
                    <span>{t('trade.breakdown.platformFee')}:</span>
                    <span className="font-mono text-aurum-text">{formatLocalizedBDT(quote.platformFeeBdt)}</span>
                  </div>
                  <div className="flex justify-between text-aurum-text-muted">
                    <span>{t('trade.breakdown.vaultCustody')}:</span>
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">
                      {language === 'bn' ? 'বিনামূল্যে (ব্যাংক বীমাকৃত)' : 'Included (Bank Insured)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-aurum-text pt-3 border-t border-aurum-border">
                    <span>{t('trade.breakdown.totalPayable')}:</span>
                    <span className="font-mono text-aurum-gold text-xl">{formatLocalizedBDT(quote.totalBdt)}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text-muted flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {t('trade.rateLockNotice')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-aurum-text-muted text-xs space-y-3">
                <Coins className="w-12 h-12 text-aurum-gold mx-auto opacity-30" />
                <p>
                  {language === 'bn'
                    ? 'আপনার কাঙ্ক্ষিত টাকার অংক বা স্বর্ণের পরিমাণ লিখুন এবং ৫ মিনিটের গ্যারান্টিযুক্ত রেট লক পেতে কোট নিন।'
                    : 'Configure your investment parameters and generate a quote to lock your guaranteed market price.'}
                </p>
              </div>
            )}
          </div>

          {quote && (
            <div className="pt-6 mt-6 border-t border-aurum-border">
              <Button
                variant="primary"
                className="w-full py-4 text-sm"
                isLoading={isSubmitting}
                onClick={handleConfirmOrder}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {orderType === OrderType.BUY
                  ? t('trade.executeBuy')
                  : t('trade.executeSell')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center text-xs text-aurum-text-muted">
          <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto mb-2" />
          Loading Trade Terminal...
        </div>
      }
    >
      <TradeContent />
    </Suspense>
  );
}
