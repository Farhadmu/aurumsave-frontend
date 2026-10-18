'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import {
  ShoppingBag,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  PackageCheck,
} from 'lucide-react';
import { formatBDT } from '../../lib/utils';
import { CONVERSIONS, FulfillmentStatus } from '../../shared';

export interface CommerceOrder {
  orderId: string;
  commerceType: 'OFFICIAL_STORE' | 'MARKETPLACE';
  buyerId: string;
  sellerId?: string;
  items: Array<{
    productId?: string;
    listingId?: string;
    title: string;
    purity: string;
    weightGrams: number;
    unitPricePoisha: number;
    makingFeePoisha: number;
    quantity: number;
    totalPoisha: number;
  }>;
  subtotalPoisha: number;
  platformFeePoisha: number;
  assayFeePoisha: number;
  totalPoisha: number;
  paymentStatus: string;
  fulfillmentStatus: FulfillmentStatus;
  pickupPointId: string;
  pickupVerificationOtp: string;
  handoverConfirmedAt?: string;
  handoverNotes?: string;
  createdAt: string;
}

export function MyCommerceOrders() {
  const [orders, setOrders] = useState<CommerceOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: CommerceOrder[] }>(
        '/commerce/orders/my-orders',
      );
      if (res?.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load commerce orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopyOtp = (orderId: string, otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-aurum-card-bg/40 border border-aurum-border animate-pulse text-xs text-aurum-text-muted">
        Loading physical bullion and marketplace custody orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-aurum-card-bg/30 border border-aurum-border">
        <PackageCheck className="w-10 h-10 text-aurum-gold/40 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-aurum-text">No Physical Gold Orders Yet</h4>
        <p className="text-xs text-aurum-text-muted mt-1 max-w-sm mx-auto">
          Orders placed through the Official Store or Peer Marketplace with physical pickup desk verification will appear here.
        </p>
        <div className="mt-4 flex items-center justify-center space-x-3">
          <a
            href="/store"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light transition-colors"
          >
            Visit Gold Store
          </a>
          <a
            href="/marketplace"
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-aurum-border text-aurum-text hover:bg-white/5 transition-colors"
          >
            Explore Marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-aurum-text">Physical Gold & Depository Orders</h3>
          <p className="text-xs text-aurum-text-muted">
            Track allocated bullion bars, safe escrow status, and OTP verification codes.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-xs font-semibold text-aurum-gold hover:text-aurum-gold-light"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const item = order.items?.[0];
          const isFulfilled =
            order.fulfillmentStatus === FulfillmentStatus.HANDOVER_COMPLETED;
          const totalBdt = order.totalPoisha / CONVERSIONS.POISHA_PER_BDT;

          return (
            <div
              key={order.orderId}
              className="p-5 rounded-2xl bg-aurum-card-bg/70 border border-aurum-border/80 hover:border-aurum-gold/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-aurum-border/40 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-aurum-gold/15 text-aurum-gold border border-aurum-gold/30">
                    {order.commerceType === 'OFFICIAL_STORE' ? 'Official Minted Bar' : 'C2C Escrow'}
                  </span>
                  <span className="text-xs font-mono font-bold text-aurum-text">
                    {order.orderId}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isFulfilled
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isFulfilled ? 'Handover Completed' : 'Ready for Desk Pickup'}
                  </span>
                  <span className="text-xs font-black font-mono text-aurum-gold">
                    {formatBDT(totalBdt)}
                  </span>
                </div>
              </div>

              {/* Item Specs */}
              {item && (
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-aurum-text">{item.title}</h5>
                    <p className="text-aurum-text-muted text-[11px] mt-0.5">
                      Purity: <strong className="text-aurum-gold">{item.purity}</strong> • Weight:{' '}
                      {item.weightGrams}g • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-aurum-text-dim">
                    <span>Pickup Point ID:</span>
                    <p className="font-mono text-aurum-text font-semibold">{order.pickupPointId}</p>
                  </div>
                </div>
              )}

              {/* OTP Box / Handover Status */}
              {!isFulfilled ? (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-aurum-midnight via-aurum-card-bg to-aurum-midnight border border-aurum-gold/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold text-aurum-gold tracking-wider block">
                      Handover Verification OTP
                    </span>
                    <p className="text-[11px] text-aurum-text-dim">
                      Present this OTP in-person to the AurumSave desk officer to release your gold.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-mono font-black tracking-widest text-aurum-gold px-3 py-1 rounded-lg bg-black/40 border border-aurum-gold/30">
                      {order.pickupVerificationOtp}
                    </span>
                    <button
                      onClick={() => handleCopyOtp(order.orderId, order.pickupVerificationOtp)}
                      className="p-2 rounded-lg bg-aurum-gold/20 hover:bg-aurum-gold/30 text-aurum-gold transition-colors"
                      title="Copy OTP"
                    >
                      {copiedOrderId === order.orderId ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Gold successfully inspected, verified, and handed over at depository desk.
                    </span>
                  </div>
                  {order.handoverConfirmedAt && (
                    <span className="text-[10px] text-emerald-400/80 font-mono">
                      {new Date(order.handoverConfirmedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
