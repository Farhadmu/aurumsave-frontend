'use client';

import React, { useState } from 'react';
import { X, Upload, AlertCircle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import {
  MarketplaceCategory,
  ItemCondition,
  PurityGrade,
  CONVERSIONS,
} from '../../shared';
import { formatBDT } from '../../lib/utils';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: () => void;
  lang?: 'en' | 'bn';
}

export function CreateListingModal({
  isOpen,
  onClose,
  onListingCreated,
  lang = 'en',
}: CreateListingModalProps) {
  const [category, setCategory] = useState<MarketplaceCategory>(MarketplaceCategory.GOLD_BAR);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [claimedPurity, setClaimedPurity] = useState<PurityGrade>(PurityGrade.K22);
  const [claimedGrossWeightGrams, setClaimedGrossWeightGrams] = useState<number>(5.0);
  const [claimedNetGoldWeightGrams, setClaimedNetGoldWeightGrams] = useState<number>(5.0);
  const [condition, setCondition] = useState<ItemCondition>(ItemCondition.LIKE_NEW);
  const [askingPriceBdt, setAskingPriceBdt] = useState<number>(55000);
  const [photoUrl, setPhotoUrl] = useState<string>('/images/hero/bullion-macro.jpg');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const stoneWastage = Math.max(
    0,
    Number((claimedGrossWeightGrams - claimedNetGoldWeightGrams).toFixed(3)),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a descriptive listing title');
      return;
    }
    if (claimedGrossWeightGrams <= 0 || claimedNetGoldWeightGrams <= 0) {
      setError('Weights must be positive numbers');
      return;
    }
    if (claimedGrossWeightGrams < claimedNetGoldWeightGrams) {
      setError('Gross weight cannot be less than net gold weight');
      return;
    }
    if (askingPriceBdt <= 0) {
      setError('Asking price must be greater than zero');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiRequest<{ success: boolean; message: string; listing: any }>(
        '/commerce/marketplace/listings',
        {
          method: 'POST',
          body: JSON.stringify({
            category,
            title: title.trim(),
            description: description.trim() || 'Pre-owned gold item in good condition.',
            photos: [photoUrl],
            claimedPurity,
            claimedGrossWeightGrams,
            claimedNetGoldWeightGrams,
            condition,
            askingPricePoisha: Math.round(askingPriceBdt * CONVERSIONS.POISHA_PER_BDT),
          }),
        },
      );

      if (res?.success) {
        setIsSuccess(true);
        if (onListingCreated) onListingCreated();
      } else {
        setError(res?.message || 'Failed to submit marketplace listing');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to marketplace service');
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

        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aurum-gold px-2 py-0.5 rounded bg-aurum-gold/15 border border-aurum-gold/30">
                Customer Marketplace Listing
              </span>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-aurum-text mt-2">
                Sell Your Pre-Owned Gold / Jewellery
              </h2>
              <p className="text-xs text-aurum-text-muted mt-1">
                List for verified buyers across Bangladesh with mandatory Escrow protection.
              </p>
            </div>

            {/* Mandatory Honesty Alert */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-5 text-xs text-amber-300 flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Verification Standard:</strong> Your item will be listed with an explicit &quot;Customer Claimed: Unverified&quot; tag until inspected by staff during physical handover at the depository desk.
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Category & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                  >
                    {Object.values(MarketplaceCategory).map((cat) => (
                      <option key={cat} value={cat} className="bg-aurum-midnight text-white">
                        {cat.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                  >
                    <option value={ItemCondition.NEW_IN_BLISTER} className="bg-aurum-midnight">
                      New in Blister / Mint Pack
                    </option>
                    <option value={ItemCondition.LIKE_NEW} className="bg-aurum-midnight">
                      Like New (No Wear)
                    </option>
                    <option value={ItemCondition.USED_GOOD} className="bg-aurum-midnight">
                      Used - Good Condition
                    </option>
                    <option value={ItemCondition.SCRAP_OR_DAMAGED} className="bg-aurum-midnight">
                      Scrap / Meltable Jewellery
                    </option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 22K Traditional Bridal Necklace Set"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                />
              </div>

              {/* Purity & Weights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                    Claimed Purity
                  </label>
                  <select
                    value={claimedPurity}
                    onChange={(e) => setClaimedPurity(e.target.value as PurityGrade)}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                  >
                    <option value={PurityGrade.K24} className="bg-aurum-midnight">
                      24K (99.9%)
                    </option>
                    <option value={PurityGrade.K22} className="bg-aurum-midnight">
                      22K (91.6%)
                    </option>
                    <option value={PurityGrade.K21} className="bg-aurum-midnight">
                      21K (87.5%)
                    </option>
                    <option value={PurityGrade.K18} className="bg-aurum-midnight">
                      18K (75.0%)
                    </option>
                  </select>
                </div>

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
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                    Net Gold Weight (g)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={claimedNetGoldWeightGrams}
                    onChange={(e) => setClaimedNetGoldWeightGrams(Number(e.target.value))}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
                  />
                </div>
              </div>

              {stoneWastage > 0 && (
                <div className="p-2.5 rounded-xl bg-aurum-card-bg/40 border border-aurum-border/60 text-xs text-amber-300 flex justify-between">
                  <span>Calculated Stone/Wax Deduction:</span>
                  <span className="font-mono font-bold">-{stoneWastage} grams</span>
                </div>
              )}

              {/* Asking Price */}
              <div>
                <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                  Your Asking Price (BDT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    required
                    value={askingPriceBdt}
                    onChange={(e) => setAskingPriceBdt(Number(e.target.value))}
                    className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold font-mono text-aurum-gold focus:outline-none focus:border-aurum-gold"
                  />
                  <span className="absolute left-3.5 top-2.5 text-aurum-text-muted text-sm font-bold">
                    ৳
                  </span>
                </div>
              </div>

              {/* Photo Selector */}
              <div>
                <label className="block text-xs font-semibold text-aurum-text-muted mb-1 uppercase tracking-wider">
                  Photo Preview Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Gold Bar / Bullion', url: '/images/hero/bullion-macro.jpg' },
                    { label: 'Gold Texture / Ornament', url: '/images/hero/texture-cinematic.jpg' },
                    { label: 'Depository Vault Item', url: '/images/hero/vault-cinematic.jpg' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setPhotoUrl(preset.url)}
                      className={`p-2 rounded-xl border text-[11px] font-medium transition-all ${
                        photoUrl === preset.url
                          ? 'border-aurum-gold bg-aurum-gold/15 text-aurum-gold font-bold'
                          : 'border-aurum-border text-aurum-text-muted hover:border-aurum-gold/50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
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
                disabled={isSubmitting}
                className="w-2/3 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold-dark text-aurum-midnight hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Submitting Listing...</span>
                ) : (
                  <>
                    <span>Submit for Appraisal Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-serif-luxury font-bold text-aurum-text">
              Listing Submitted for Review!
            </h3>
            <p className="text-xs text-aurum-text-muted max-w-md mx-auto mt-2 leading-relaxed">
              Your gold item has been received by our compliance and assay team. It will be published to the marketplace with an unverified label until in-person desk handover.
            </p>

            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-xl font-bold text-sm bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light transition-colors"
            >
              Done & Return to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
