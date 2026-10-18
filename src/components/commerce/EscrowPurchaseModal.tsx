'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, AlertCircle, Copy, Check, ArrowRight } from 'lucide-react';
import { MarketplaceListing } from './MarketplaceListingCard';
import { DistrictPickupSelector, PickupPoint } from './DistrictPickupSelector';
import { apiRequest } from '../../lib/api';
import { formatBDT } from '../../lib/utils';
import { CONVERSIONS } from '../../shared';

interface EscrowPurchaseModalProps {
  listing: MarketplaceListing | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseCompleted?: () => void;
  lang?: 'en' | 'bn';
}

export function EscrowPurchaseModal({
  listing,
  isOpen,
  onClose,
  onPurchaseCompleted,
  lang = 'en',
}: EscrowPurchaseModalProps) {
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [copiedOtp, setCopiedOtp] = useState<boolean>(false);

  if (!isOpen || !listing) return null;

  const askingPriceBdt = listing.askingPricePoisha / CONVERSIONS.POISHA_PER_BDT;
  const platformFeeBdt = Math.round(askingPriceBdt * 0.015);
  const assayFeeBdt = 350;
  const totalBdt = askingPriceBdt + platformFeeBdt + assayFeeBdt;

  const handleConfirmPurchase = async () => {
    if (!selectedPoint) {
      setError('Please select an authorized AurumSave depository desk for safe handover');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiRequest<{ success: boolean; message: string; order: any }>(
        '/commerce/marketplace/orders',
        {
          method: 'POST',
          body: JSON.stringify({
            listingId: listing.listingId,
            pickupPointId: selectedPoint.pointId,
          }),
        },
      );

      if (res?.success && res?.order) {
        setConfirmedOrder(res.order);
        if (onPurchaseCompleted) onPurchaseCompleted();
      } else {
        setError(res?.message || 'Failed to complete escrow reservation');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to marketplace service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-aurum-midnight border border-aurum-gold/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 my-8 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-aurum-text-muted hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedOrder ? (
          <div>
            <div className="mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aurum-gold px-2 py-0.5 rounded bg-aurum-gold/15 border border-aurum-gold/30">
                Guaranteed Peer Escrow Purchase
              </span>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-aurum-text mt-2">
                Buy with AurumSave Escrow Protection
              </h2>
              <p className="text-xs text-aurum-text-muted mt-1">
                Your payment is held in neutral escrow until both parties inspect and verify the gold at the desk.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Listing Summary */}
            <div className="p-4 rounded-2xl bg-aurum-card-bg/60 border border-aurum-border/60 mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-aurum-text">{listing.title}</h4>
                  <p className="text-xs text-aurum-text-muted mt-0.5">
                    Seller: <strong className="text-aurum-text">{listing.sellerName}</strong> •{' '}
                    {listing.claimedPurity} • Net Gold:{' '}
                    {listing.claimedNetGoldWeightGrams}g
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-aurum-gold">
                    {formatBDT(askingPriceBdt)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-aurum-border/40 grid grid-cols-3 gap-2 text-[11px] text-aurum-text-dim">
                <div>
                  <span className="block text-aurum-text-muted text-[10px]">Seller Asking</span>
                  <span className="font-mono text-aurum-text">{formatBDT(askingPriceBdt)}</span>
                </div>
                <div>
                  <span className="block text-aurum-text-muted text-[10px]">Escrow & Inspection</span>
                  <span className="font-mono text-aurum-gold">
                    +{formatBDT(platformFeeBdt + assayFeeBdt)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-aurum-text-muted text-[10px]">Total Escrow Hold</span>
                  <span className="font-mono font-bold text-aurum-text">{formatBDT(totalBdt)}</span>
                </div>
              </div>
            </div>

            {/* Step 2: District Pickup Point Selector */}
            <div className="mb-6">
              <DistrictPickupSelector
                selectedPointId={selectedPoint?.pointId || ''}
                onSelectPoint={(point) => setSelectedPoint(point)}
                lang={lang}
              />
            </div>

            {/* Escrow Mechanism Explanation */}
            <div className="p-3.5 rounded-xl bg-aurum-gold/5 border border-aurum-gold/20 mb-6 text-xs text-aurum-text-muted flex items-start space-x-2.5">
              <Lock className="w-4 h-4 text-aurum-gold shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Risk Guarantee:</strong> The seller cannot access your funds until you physically test and accept the gold at the AurumSave desk with the desk officer. You may reject the item if the purity does not match.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl font-semibold text-xs border border-aurum-border text-aurum-text-muted hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isSubmitting || !selectedPoint}
                className="w-2/3 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold-dark text-aurum-midnight hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Locking Escrow Funds...</span>
                ) : (
                  <>
                    <span>Deposit into Escrow • {formatBDT(totalBdt)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation with OTP */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              Escrow Locked & Item Reserved
            </span>

            <h3 className="text-2xl font-serif-luxury font-bold text-aurum-text mt-3">
              Escrow Protection Active!
            </h3>
            <p className="text-xs text-aurum-text-muted mt-1">
              Order Reference:{' '}
              <span className="font-mono font-bold text-aurum-gold">
                {confirmedOrder.orderId}
              </span>
            </p>

            {/* OTP Display Card */}
            <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-aurum-midnight to-aurum-card-bg border border-aurum-gold/40 shadow-inner">
              <span className="text-[10px] uppercase font-bold tracking-wider text-aurum-text-muted block mb-1">
                Your Secret Handover & Release OTP
              </span>
              <div className="flex items-center justify-center space-x-3 my-2">
                <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-aurum-gold">
                  {confirmedOrder.pickupVerificationOtp}
                </span>
                <button
                  onClick={() => handleCopyOtp(confirmedOrder.pickupVerificationOtp)}
                  className="p-2 rounded-lg bg-aurum-gold/20 hover:bg-aurum-gold/30 text-aurum-gold transition-colors"
                  title="Copy OTP"
                >
                  {copiedOtp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-aurum-text-dim">
                Present this OTP to the desk officer only after you have physically inspected the gold and approved the condition.
              </p>
            </div>

            {/* Depository Location */}
            <div className="p-4 rounded-xl bg-aurum-card-bg/40 border border-aurum-border text-left mb-6 text-xs text-aurum-text-muted space-y-1">
              <p className="text-aurum-gold font-bold">{selectedPoint?.nameEn}</p>
              <p>{selectedPoint?.addressEn}</p>
              <p className="text-aurum-text-dim">Hours: {selectedPoint?.operatingHours}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-sm bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light transition-colors"
            >
              Done & View Order in Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
