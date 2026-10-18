'use client';

import React, { useState } from 'react';
import { X, Sparkles, Scale, Building2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { DistrictPickupSelector, PickupPoint } from './DistrictPickupSelector';
import { apiRequest } from '../../lib/api';
import { PurityGrade } from '../../shared';
import { formatBDT } from '../../lib/utils';

interface ScrapJewelleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'bn';
}

export function ScrapJewelleryModal({
  isOpen,
  onClose,
  lang = 'en',
}: ScrapJewelleryModalProps) {
  const [category, setCategory] = useState<string>('Broken Gold Jewellery / Scrap');
  const [claimedPurity, setClaimedPurity] = useState<PurityGrade>(PurityGrade.K22);
  const [claimedGrossWeightGrams, setClaimedGrossWeightGrams] = useState<number>(10.0);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [disbursementMethod, setDisbursementMethod] = useState<string>('GOLD_WALLET_CREDIT');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedRequest, setConfirmedRequest] = useState<any | null>(null);

  if (!isOpen) return null;

  // Approximate live rates for instant estimator display
  const estimateRatePerGram =
    claimedPurity === PurityGrade.K24
      ? 12100
      : claimedPurity === PurityGrade.K22
      ? 11100
      : claimedPurity === PurityGrade.K21
      ? 10600
      : 9000;

  const estimatedPayoutBdt = Math.round(estimateRatePerGram * claimedGrossWeightGrams);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoint) {
      setError('Please select a regional depository / assay desk');
      return;
    }
    if (claimedGrossWeightGrams <= 0) {
      setError('Weight must be greater than zero');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiRequest<{ success: boolean; message: string; request: any }>(
        '/commerce/marketplace/scrap-sell',
        {
          method: 'POST',
          body: JSON.stringify({
            category,
            claimedPurity,
            claimedGrossWeightGrams,
            preferredPickupPointId: selectedPoint.pointId,
            disbursementMethod,
          }),
        },
      );

      if (res?.success && res?.request) {
        setConfirmedRequest(res.request);
      } else {
        setError(res?.message || 'Failed to submit liquidation request');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to liquidation service');
    } finally {
      setIsSubmitting(false);
    }
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

        {!confirmedRequest ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aurum-gold px-2 py-0.5 rounded bg-aurum-gold/15 border border-aurum-gold/30">
                Instant Gold Scrap & Jewellery Liquidation
              </span>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-aurum-text mt-2">
                Sell Pre-Owned & Scrap Jewellery
              </h2>
              <p className="text-xs text-aurum-text-muted mt-1">
                Bring old ornaments, broken bangles, or coins for on-site XRF testing and instant bank or wallet payout.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Category & Purity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                    Ornament Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                  >
                    <option value="Broken Gold Jewellery / Scrap" className="bg-aurum-midnight">
                      Broken Gold Jewellery / Scrap
                    </option>
                    <option value="Necklace or Chain" className="bg-aurum-midnight">
                      Necklace or Chain
                    </option>
                    <option value="Gold Bangles / Churi" className="bg-aurum-midnight">
                      Gold Bangles / Churi
                    </option>
                    <option value="Rings or Earrings" className="bg-aurum-midnight">
                      Rings or Earrings
                    </option>
                    <option value="Vintage Gold Coin" className="bg-aurum-midnight">
                      Vintage Gold Coin
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                    Estimated Purity
                  </label>
                  <select
                    value={claimedPurity}
                    onChange={(e) => setClaimedPurity(e.target.value as PurityGrade)}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                  >
                    <option value={PurityGrade.K24} className="bg-aurum-midnight">
                      24K (99.9% Pure Gold)
                    </option>
                    <option value={PurityGrade.K22} className="bg-aurum-midnight">
                      22K (91.6% Hallmark)
                    </option>
                    <option value={PurityGrade.K21} className="bg-aurum-midnight">
                      21K (87.5% Traditional)
                    </option>
                    <option value={PurityGrade.K18} className="bg-aurum-midnight">
                      18K (75.0% Jewellery)
                    </option>
                  </select>
                </div>
              </div>

              {/* Weight & Disbursement Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                    Gross Weight (g)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={claimedGrossWeightGrams}
                    onChange={(e) => setClaimedGrossWeightGrams(Number(e.target.value))}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                    Disbursement Method
                  </label>
                  <select
                    value={disbursementMethod}
                    onChange={(e) => setDisbursementMethod(e.target.value)}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                  >
                    <option value="GOLD_WALLET_CREDIT" className="bg-aurum-midnight">
                      Credit to AurumSave Gold Wallet
                    </option>
                    <option value="BKASH" className="bg-aurum-midnight">
                      Instant bKash Payout
                    </option>
                    <option value="NAGAD" className="bg-aurum-midnight">
                      Instant Nagad Payout
                    </option>
                    <option value="BANK_TRANSFER" className="bg-aurum-midnight">
                      Direct BEFTN / NPSB Bank Transfer
                    </option>
                  </select>
                </div>
              </div>

              {/* Instant Valuation Estimate */}
              <div className="p-4 rounded-2xl bg-aurum-card-bg/60 border border-aurum-border text-left">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-aurum-text-muted">Estimated Liquidation Payout</span>
                  <span className="text-lg font-black font-mono text-aurum-gold">
                    ≈ {formatBDT(estimatedPayoutBdt)}
                  </span>
                </div>
                <p className="text-[10px] text-aurum-text-dim mt-1">
                  *Exact payout calculated upon on-site XRF density testing and physical stone deduction.
                </p>
              </div>

              {/* District Desk Selector */}
              <div>
                <DistrictPickupSelector
                  selectedPointId={selectedPoint?.pointId || ''}
                  onSelectPoint={(point) => setSelectedPoint(point)}
                  lang={lang}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl font-semibold text-xs border border-aurum-border text-aurum-text-muted hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedPoint}
                className="w-2/3 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold-dark text-aurum-midnight hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Scheduling Assay Desk...</span>
                ) : (
                  <>
                    <span>Book On-Site Assay & Payout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-serif-luxury font-bold text-aurum-text">
              Assay Appointment Booked!
            </h3>
            <p className="text-xs text-aurum-text-muted mt-1">
              Ticket ID:{' '}
              <span className="font-mono font-bold text-aurum-gold">
                {confirmedRequest.requestId}
              </span>
            </p>

            <div className="my-6 p-4 rounded-xl bg-aurum-card-bg/60 border border-aurum-border text-left text-xs text-aurum-text-muted space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-aurum-gold block">
                Next Steps for Physical Payout:
              </span>
              <p>1. Bring your ornaments and NID to: <strong className="text-aurum-text">{selectedPoint?.nameEn}</strong>.</p>
              <p>2. Staff will perform free on-site XRF testing and weigh net gold content with stone removal.</p>
              <p>3. Funds will be immediately disbursed via <strong className="text-aurum-gold">{disbursementMethod}</strong>.</p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light transition-colors"
            >
              Done & Return to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
