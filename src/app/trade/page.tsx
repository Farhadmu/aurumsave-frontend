'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { OrderType, PurityGrade, PaymentMethod, QuoteDetails, CONVERSIONS } from '@aurumsave/shared';
import {
  Coins,
  ShoppingBag,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

function TradeContent() {
  const { user, isLoading: authLoading } = useAuth();
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Quote expiration timer
  useEffect(() => {
    if (!quote) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQuote(null);
          setError('Rate lock expired. Please request a fresh quote.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quote]);

  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setIsSubmitting(true);

    try {
      const orderRes = await apiRequest<{ success: boolean; data: any }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          quoteId: quote.quoteId,
          paymentMethod,
          idempotencyKey: `IDEM-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
      router.push(`/payment/checkout?paymentId=${paymentSession.paymentId}&orderId=${order.orderId}`);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
          {orderType === OrderType.BUY ? 'Buy Allocated Physical Gold' : 'Liquidate Vault Gold'}
        </h1>
        <p className="text-xs sm:text-sm text-aurum-muted mt-1">
          Lock in verified BAJUS benchmark rates with guaranteed 5-minute execution.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-aurum-card border border-aurum-border shadow-surface-subtle space-y-6">
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-aurum-navy border border-aurum-border">
              <button
                type="button"
                onClick={() => {
                  setOrderType(OrderType.BUY);
                  setQuote(null);
                }}
                className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs transition-all ${
                  orderType === OrderType.BUY
                    ? 'bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-navy shadow-gold-glow'
                    : 'text-aurum-muted hover:text-aurum-ivory'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Buy Gold</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderType(OrderType.SELL);
                  setQuote(null);
                }}
                className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs transition-all ${
                  orderType === OrderType.SELL
                    ? 'bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-navy shadow-gold-glow'
                    : 'text-aurum-muted hover:text-aurum-ivory'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Sell Gold</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-aurum-muted block mb-2">
                Purity Standard
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPurity(PurityGrade.K24);
                    setQuote(null);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    purity === PurityGrade.K24
                      ? 'bg-aurum-surface border-aurum-gold shadow-sm'
                      : 'bg-aurum-navy border-aurum-border hover:border-aurum-border/80'
                  }`}
                >
                  <span className="font-serif font-bold text-base text-aurum-gold block">24K Bullion</span>
                  <span className="text-[11px] text-aurum-muted">99.9% Pure Investment Gold</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPurity(PurityGrade.K22);
                    setQuote(null);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    purity === PurityGrade.K22
                      ? 'bg-aurum-surface border-aurum-gold shadow-sm'
                      : 'bg-aurum-navy border-aurum-border hover:border-aurum-border/80'
                  }`}
                >
                  <span className="font-serif font-bold text-base text-aurum-ivory block">22K Hallmark</span>
                  <span className="text-[11px] text-aurum-muted">91.6% Hallmark Standard</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-aurum-muted">
                  Amount to {orderType === OrderType.BUY ? 'Invest' : 'Liquidate'}
                </label>
                <div className="flex rounded-lg bg-aurum-navy p-0.5 border border-aurum-border text-[11px]">
                  <button
                    type="button"
                    onClick={() => setInputMode('BDT')}
                    className={`px-2.5 py-1 rounded font-semibold ${
                      inputMode === 'BDT' ? 'bg-aurum-gold text-aurum-navy' : 'text-aurum-muted'
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
                    className={`px-2.5 py-1 rounded font-semibold ${
                      inputMode === 'GRAM' ? 'bg-aurum-gold text-aurum-navy' : 'text-aurum-muted'
                    }`}
                  >
                    Grams (g)
                  </button>
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-aurum-gold text-lg">
                  {inputMode === 'BDT' ? '৳' : 'g'}
                </span>
                <input
                  type="number"
                  min={inputMode === 'BDT' ? 500 : 0.1}
                  step={inputMode === 'BDT' ? 500 : 0.1}
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(Number(e.target.value));
                    setQuote(null);
                  }}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-aurum-navy border border-aurum-border text-xl font-mono font-bold text-aurum-ivory focus:border-aurum-gold focus:outline-none"
                />
              </div>
            </div>

            {orderType === OrderType.BUY && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-aurum-muted block mb-2">
                  Select Payment Gateway
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
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === gw.id
                          ? 'bg-aurum-surface border-aurum-gold shadow-sm'
                          : 'bg-aurum-navy border-aurum-border'
                      }`}
                    >
                      <span className={`block font-bold text-xs ${gw.color}`}>{gw.label}</span>
                      <span className="text-[10px] text-aurum-slate">Zero Surcharge</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!quote ? (
              <button
                type="button"
                onClick={handleGetQuote}
                disabled={isQuoting || !amountInput}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-sm shadow-gold-glow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isQuoting ? (
                  <span>Fetching Live BAJUS Quote...</span>
                ) : (
                  <>
                    <span>Generate Guaranteed Rate Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGetQuote}
                className="w-full py-2.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-muted hover:text-aurum-ivory transition-all"
              >
                Refresh Quote with Latest Market Price
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col justify-between p-6 rounded-3xl bg-aurum-surface border border-aurum-border relative">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-aurum-border">
              <span className="text-xs uppercase tracking-wider font-semibold text-aurum-slate">
                Order Summary
              </span>
              {quote && (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
              )}
            </div>

            {quote ? (
              <div className="space-y-4 pt-4">
                <div>
                  <span className="text-[11px] text-aurum-slate block">
                    {orderType === OrderType.BUY ? 'Allocated Weight' : 'Weight Liquidated'}
                  </span>
                  <div className="text-3xl font-mono font-black text-aurum-gold mt-0.5">
                    {quote.weightGrams}g
                  </div>
                  <span className="text-xs text-aurum-muted">
                    ({quote.purity} Gold • {(quote.weightGrams / CONVERSIONS.GRAMS_PER_BHORI).toFixed(3)} Bhori)
                  </span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-aurum-border/60 text-xs">
                  <div className="flex justify-between text-aurum-muted">
                    <span>Rate Locked At</span>
                    <span className="font-mono text-aurum-ivory">৳{quote.ratePerGramBdt.toLocaleString()}/g</span>
                  </div>
                  <div className="flex justify-between text-aurum-muted">
                    <span>Subtotal</span>
                    <span className="font-mono text-aurum-ivory">৳{quote.subtotalBdt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-aurum-muted">
                    <span>Platform Fee</span>
                    <span className="font-mono text-aurum-ivory">৳{quote.platformFeeBdt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-aurum-muted">
                    <span>Insured Vault Storage</span>
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-aurum-ivory pt-3 border-t border-aurum-border">
                    <span>{orderType === OrderType.BUY ? 'Total Payable' : 'Estimated Proceeds'}</span>
                    <span className="font-mono text-aurum-gold">৳{quote.totalBdt.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-aurum-card border border-aurum-border text-[11px] text-aurum-muted flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Your price is locked for 5 minutes. If confirmed, this order is committed to your double-entry ledger.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-aurum-muted text-xs space-y-2">
                <Coins className="w-10 h-10 text-aurum-slate mx-auto opacity-40" />
                <p>Select your savings amount and click &ldquo;Generate Quote&rdquo; to lock your guaranteed market price.</p>
              </div>
            )}
          </div>

          {quote && (
            <div className="pt-6">
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-sm shadow-gold-glow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Proceed to {orderType === OrderType.BUY ? 'Payment' : 'Wallet'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
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
        <div className="max-w-md mx-auto px-4 py-20 text-center text-xs text-aurum-muted">
          <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto mb-2" />
          Loading Trade Terminal...
        </div>
      }
    >
      <TradeContent />
    </Suspense>
  );
}
