'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '../../../lib/api';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Sparkles,
  RefreshCw,
  Building2,
  Coins,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatBDT, formatGoldWeight } from '../../../lib/utils';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const orderId = searchParams.get('orderId');

  const [payment, setPayment] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [simulatedOtp, setSimulatedOtp] = useState('123456');

  useEffect(() => {
    async function loadPayment() {
      if (!paymentId) return;
      try {
        const res = await apiRequest<{ success: boolean; data: any }>(`/payments/${paymentId}`);
        if (res.success && res.data) {
          setPayment(res.data.payment);
          setOrder(res.data.order);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load secure payment session');
      } finally {
        setIsLoading(false);
      }
    }
    loadPayment();
  }, [paymentId]);

  const handleSimulatePayment = async () => {
    if (!payment) return;
    setIsProcessing(true);
    setError(null);

    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/payments/sandbox/simulate', {
        method: 'POST',
        body: JSON.stringify({
          paymentId: payment.paymentId,
          success: true,
        }),
      });

      if (res.success) {
        setIsCompleted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <div className="space-y-1">
          <h3 className="font-serif-luxury text-lg font-bold text-aurum-text">
            Connecting to Payment Gateway
          </h3>
          <p className="text-xs text-aurum-text-muted">
            Establishing 256-bit TLS encrypted session with banking network...
          </p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 rounded-3xl bg-aurum-card border border-emerald-500/40 shadow-card-luxury text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-gold-glow">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <Badge variant="emerald" size="md">
              Vault Allocation Confirmed
            </Badge>
            <h2 className="font-serif-luxury text-2xl font-bold text-aurum-text tracking-tight pt-2">
              Payment Completed
            </h2>
            <p className="text-xs text-aurum-text-muted">
              Transaction ID: <span className="font-mono text-aurum-gold font-bold">{payment?.paymentId}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-aurum-surface/80 text-left text-xs space-y-2.5 border border-aurum-border">
            <div className="flex justify-between items-center text-aurum-text-muted">
              <span>Order Reference:</span>
              <span className="font-mono text-aurum-text">{order?.orderId}</span>
            </div>
            <div className="flex justify-between items-center text-aurum-text-muted">
              <span>Gold Allocated:</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatGoldWeight(order?.weightMilligrams || 0)} ({order?.purity || '24K'})
              </span>
            </div>
            <div className="flex justify-between items-center text-aurum-text-muted">
              <span>Total Settled:</span>
              <span className="font-mono font-bold text-aurum-gold text-sm">
                {formatBDT(payment?.amountPoisha || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center text-aurum-text-muted pt-2 border-t border-aurum-border">
              <span>Custody Facility:</span>
              <span className="text-aurum-text flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-aurum-gold inline" />
                <span>Brinks / Secure Vault Dhaka</span>
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full py-3.5"
            onClick={() => router.push('/dashboard')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Access Vault Portfolio
          </Button>
        </div>
      </div>
    );
  }

  const gateway = payment?.gateway || 'MFS';

  return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-6 animate-in fade-in duration-300">
      {/* Sandbox Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-3 shadow-sm">
        <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
        <div className="space-y-0.5">
          <strong className="block font-bold">Bangladesh Bank Sandbox Simulator</strong>
          <span className="text-amber-200/90 leading-relaxed">
            Simulating live webhook authorization for {gateway}. No real money will be charged from your wallet.
          </span>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border-gold shadow-card-luxury space-y-6">
        <div className="text-center pb-4 border-b border-aurum-border space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-aurum-gold/20 to-aurum-gold/5 border border-aurum-gold/40 flex items-center justify-center mx-auto text-aurum-gold shadow-gold-glow">
            <Coins className="w-7 h-7" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-aurum-text tracking-tight">
            {gateway} Gateway Checkout
          </h2>
          <p className="text-xs text-aurum-text-muted">
            Order Reference: <span className="font-mono text-aurum-gold font-semibold">{order?.orderId}</span>
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-aurum-surface/80 border border-aurum-border text-xs space-y-3">
          <div className="flex justify-between items-center text-aurum-text-muted">
            <span>Payment Session ID:</span>
            <span className="font-mono text-aurum-text">{payment?.paymentId}</span>
          </div>
          <div className="flex justify-between items-center text-aurum-text-muted">
            <span>Allocated Weight:</span>
            <span className="font-mono font-bold text-aurum-gold">
              {formatGoldWeight(order?.weightMilligrams || 0)} ({order?.purity || '24K'})
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-aurum-text pt-2.5 border-t border-aurum-border">
            <span>Total Amount Payable:</span>
            <span className="font-mono text-aurum-gold text-base">
              {formatBDT(payment?.amountPoisha || 0)}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-aurum-text-muted block">
            Simulated MFS OTP / PIN
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-aurum-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={simulatedOtp}
              onChange={(e) => setSimulatedOtp(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs font-mono text-aurum-text focus:outline-none focus:border-aurum-gold transition-colors"
            />
          </div>
          <span className="text-[10px] text-aurum-text-dim block">
            Test authorization credential pre-filled for rapid verification.
          </span>
        </div>

        <Button
          type="button"
          variant="primary"
          className="w-full py-4 text-sm"
          isLoading={isProcessing}
          onClick={handleSimulatePayment}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isProcessing ? 'Verifying HMAC Signature...' : 'Authorize & Allocate Gold Bullion'}
        </Button>

        <div className="flex items-center justify-center space-x-2 text-[10px] text-aurum-text-dim">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted with SHA-256 HMAC Webhook Architecture</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center text-xs text-aurum-text-muted space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
          <p>Initializing Secure Payment Channel...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
