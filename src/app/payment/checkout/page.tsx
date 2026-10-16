'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '../../../lib/api';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Lock, Sparkles } from 'lucide-react';

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
        setError(err.message || 'Failed to load payment session');
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
      const res = await apiRequest<{ success: boolean; message: string }>('/payments/webhook', {
        method: 'POST',
        body: JSON.stringify({
          paymentId: payment.paymentId,
          gatewayTransactionId: `TRX-${Date.now()}-SIMULATED`,
          signature: 'SANDBOX_BANGLADESH_HMAC_SHA256_VERIFIED',
          success: true,
        }),
      });

      if (res.success) {
        setIsCompleted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-aurum-muted">Connecting to Sandbox Gateway...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="p-8 rounded-3xl bg-aurum-card border border-emerald-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-gold-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-aurum-ivory">
              Payment Confirmed &amp; Gold Allocated!
            </h2>
            <p className="text-xs text-aurum-muted mt-2">
              Payment ID: <strong className="font-mono text-aurum-ivory">{payment?.paymentId}</strong>
            </p>
            <p className="text-xs text-emerald-400 mt-1 font-semibold">
              {(order?.weightMilligrams || 0) / 1000}g {order?.purity} Gold successfully credited to your vault.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-aurum-surface text-left text-xs space-y-2 border border-aurum-border">
            <div className="flex justify-between text-aurum-muted">
              <span>Order Reference:</span>
              <span className="font-mono text-aurum-ivory">{order?.orderId}</span>
            </div>
            <div className="flex justify-between text-aurum-muted">
              <span>Amount Paid:</span>
              <span className="font-mono font-bold text-aurum-gold">
                ৳{((payment?.amountPoisha || 0) / 100).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-aurum-muted">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Vault Credited</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3.5 rounded-xl bg-aurum-gold text-aurum-navy font-bold text-xs shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2"
          >
            <span>View Vault Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const gateway = payment?.gateway || 'MFS';

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
        <div>
          <strong className="block font-semibold">Sandbox Payment Simulator</strong>
          <span>
            This simulates the live bKash / Nagad / SSLCommerz gateway flow. No real funds are deducted.
          </span>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border shadow-2xl space-y-6">
        <div className="text-center pb-4 border-b border-aurum-border">
          <div className="w-12 h-12 rounded-2xl bg-aurum-surface border border-aurum-border flex items-center justify-center font-bold text-lg text-aurum-gold mx-auto mb-2">
            ৳
          </div>
          <h2 className="font-serif text-2xl font-bold text-aurum-ivory">
            {gateway} Checkout
          </h2>
          <p className="text-xs text-aurum-muted mt-0.5">
            Paying for Order <strong className="font-mono text-aurum-ivory">{order?.orderId}</strong>
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-aurum-surface border border-aurum-border text-xs space-y-2.5">
          <div className="flex justify-between text-aurum-muted">
            <span>Payment Session:</span>
            <span className="font-mono text-aurum-ivory">{payment?.paymentId}</span>
          </div>
          <div className="flex justify-between text-aurum-muted">
            <span>Gold Allocation:</span>
            <span className="font-mono font-bold text-aurum-gold">
              {(order?.weightMilligrams || 0) / 1000}g ({order?.purity})
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-aurum-ivory pt-2 border-t border-aurum-border">
            <span>Total Payable:</span>
            <span className="font-mono text-aurum-gold">
              ৳{((payment?.amountPoisha || 0) / 100).toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-aurum-muted block mb-1.5">
            Simulated MFS PIN / OTP Code
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-aurum-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={simulatedOtp}
              onChange={(e) => setSimulatedOtp(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm font-mono text-aurum-ivory focus:border-aurum-gold focus:outline-none"
            />
          </div>
          <span className="text-[10px] text-aurum-slate mt-1 block">
            Default sandbox verification code pre-filled.
          </span>
        </div>

        <button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-sm shadow-gold-glow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Verifying Webhook Signature...</span>
          ) : (
            <>
              <span>Authorize &amp; Credit Vault (Sandbox)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center text-xs text-aurum-muted">
          <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto mb-2" />
          Loading Sandbox Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
