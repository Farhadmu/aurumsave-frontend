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
  Headphones,
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
  paymentMethod?: string;
  deliveryMethod?: 'HOME_DELIVERY' | 'PICKUP_POINT';
  shippingAddress?: {
    fullName: string;
    phone: string;
    alternativePhone?: string;
    recipientNid?: string;
    division: string;
    district: string;
    upazila?: string;
    addressLine: string;
    postalCode?: string;
    instructions?: string;
  };
  trackingNumber?: string;
  fulfillmentStatus: FulfillmentStatus;
  pickupPointId?: string;
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
        Loading physical bullion and delivery tracking records...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-aurum-card-bg/30 border border-aurum-border">
        <PackageCheck className="w-10 h-10 text-aurum-gold/40 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-aurum-text">No Physical Gold Orders Yet</h4>
        <p className="text-xs text-aurum-text-muted mt-1 max-w-sm mx-auto">
          Certified minted gold bars (1g to 10g) ordered through the Official Store with armored delivery will appear here with live tracking.
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
          <h3 className="text-base font-bold text-aurum-text font-serif-luxury">
            Physical Gold Orders & Armored Delivery Tracking
          </h3>
          <p className="text-xs text-aurum-text-muted">
            Track vaulted bullion allocation, courier dispatch, and OTP security verification.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-xs font-semibold text-aurum-gold hover:text-aurum-gold-light"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const item = order.items?.[0];
          const isFulfilled =
            order.fulfillmentStatus === FulfillmentStatus.HANDOVER_COMPLETED;
          const totalBdt = order.totalPoisha / CONVERSIONS.POISHA_PER_BDT;
          const isHomeDelivery = order.deliveryMethod === 'HOME_DELIVERY';

          return (
            <div
              key={order.orderId}
              className="p-5 sm:p-6 rounded-3xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all space-y-4 shadow-card-luxury"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-aurum-border/40 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-aurum-gold/15 text-aurum-gold border border-aurum-gold/30">
                    {order.commerceType === 'OFFICIAL_STORE' ? 'Official Minted Bar' : 'C2C Escrow'}
                  </span>
                  <span className="text-xs font-mono font-bold text-aurum-text">
                    #{order.orderId}
                  </span>
                  {order.trackingNumber && (
                    <span className="text-[10px] font-mono text-aurum-text-dim px-2 py-0.5 rounded bg-aurum-surface">
                      {order.trackingNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                      isFulfilled
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isFulfilled
                      ? 'Delivered & Handover Confirmed'
                      : isHomeDelivery
                      ? 'In Dispatch / Armored Transit'
                      : 'Ready for Desk Pickup'}
                  </span>
                  <span className="text-xs font-black font-mono text-aurum-gold">
                    {formatBDT(totalBdt)}
                  </span>
                </div>
              </div>

              {/* Item Specs & Delivery Mode Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {item && (
                  <div className="p-3.5 rounded-2xl bg-aurum-surface/70 border border-aurum-border space-y-1">
                    <span className="text-[10px] text-aurum-text-dim uppercase font-bold block">
                      Ordered Bullion Item:
                    </span>
                    <h5 className="font-bold text-aurum-text text-sm">{item.title}</h5>
                    <p className="text-aurum-text-muted text-[11px]">
                      Purity: <strong className="text-aurum-gold">{item.purity}</strong> • Weight:{' '}
                      <strong>{item.weightGrams}g</strong> • Qty: {item.quantity}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-mono block pt-1">
                      Payment: {order.paymentMethod || 'bKash'} (ESCROW_HELD)
                    </span>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-aurum-surface/70 border border-aurum-border space-y-1">
                  <span className="text-[10px] text-aurum-text-dim uppercase font-bold block">
                    {isHomeDelivery ? 'Armored Courier Delivery Address:' : 'Depository Handover Desk:'}
                  </span>
                  {isHomeDelivery && order.shippingAddress ? (
                    <div className="space-y-0.5">
                      <p className="font-bold text-aurum-text">
                        {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                      </p>
                      <p className="text-aurum-text-muted text-[11px]">
                        {order.shippingAddress.addressLine}, {order.shippingAddress.district}, {order.shippingAddress.division}
                      </p>
                      {order.shippingAddress.recipientNid && (
                        <p className="text-[10px] font-mono text-aurum-gold">
                          Handover NID: {order.shippingAddress.recipientNid}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-mono font-bold text-aurum-text">
                        Desk ID: {order.pickupPointId || 'Central Gulshan Vault'}
                      </p>
                      <p className="text-aurum-text-muted text-[11px]">
                        Present your NID and Handover OTP to the desk officer.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Progress Bar Timeline */}
              <div className="p-4 rounded-2xl bg-aurum-surface/50 border border-aurum-border/60 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-aurum-text-dim block">
                  Delivery & Fulfillment Status Timeline:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1">
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-emerald-400 block">Payment Escrow</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-emerald-400 block">Vault Assay Sealed</span>
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        isFulfilled ? 'bg-emerald-400' : 'bg-aurum-gold animate-pulse'
                      }`}
                    />
                    <span className="font-bold text-aurum-gold block">
                      {isHomeDelivery ? 'Courier Transit' : 'At Pickup Desk'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        isFulfilled ? 'bg-emerald-400' : 'bg-aurum-border'
                      }`}
                    />
                    <span
                      className={`font-bold block ${
                        isFulfilled ? 'text-emerald-400' : 'text-aurum-text-dim'
                      }`}
                    >
                      Handover Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* OTP Box & Concierge Chat Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                {!isFulfilled ? (
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-aurum-gold tracking-wider block">
                        Handover Security OTP:
                      </span>
                      <p className="text-[11px] text-aurum-text-dim">
                        Present this OTP to confirm secure delivery.
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xl font-mono font-black tracking-widest text-aurum-gold px-3 py-1 rounded-xl bg-black/40 border border-aurum-gold/40">
                        {order.pickupVerificationOtp}
                      </span>
                      <button
                        onClick={() => handleCopyOtp(order.orderId, order.pickupVerificationOtp)}
                        className="p-2 rounded-xl bg-aurum-gold/15 hover:bg-aurum-gold/25 text-aurum-gold transition-colors"
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
                  <div className="text-xs text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Gold bar successfully verified and handed over.</span>
                  </div>
                )}

                {/* Direct Concierge Support Chat Button */}
                <a
                  href={`/support?orderId=${order.orderId}&category=DELIVERY_TRACKING&subject=Physical Gold Order #${order.orderId} Delivery Inquiry`}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-aurum-surface border border-aurum-gold/40 hover:bg-aurum-gold/15 text-aurum-gold text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Headphones className="w-3.5 h-3.5 text-aurum-gold" />
                  <span>কনসিয়ার্জ সাপোর্ট চ্যাট (Concierge Support)</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
