'use client';

import React from 'react';
import Image from 'next/image';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Scale,
  ArrowRight,
  User,
  Clock,
  Tag,
} from 'lucide-react';
import { formatBDT } from '../../lib/utils';
import {
  MarketplaceCategory,
  MarketplaceVerificationStatus,
  ItemCondition,
  PurityGrade,
  CONVERSIONS,
} from '../../shared';

export interface MarketplaceListing {
  listingId: string;
  sellerId: string;
  sellerName: string;
  category: MarketplaceCategory;
  title: string;
  description: string;
  photos: string[];
  claimedPurity: PurityGrade;
  claimedGrossWeightGrams: number;
  claimedNetGoldWeightGrams: number;
  stoneWastageDeductionGrams: number;
  condition: ItemCondition;
  askingPricePoisha: number;
  status: string;
  verificationStatus: MarketplaceVerificationStatus;
  verifiedPurity?: PurityGrade;
  verifiedNetGoldWeightGrams?: number;
  createdAt: string;
}

interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
  onBuy: (listing: MarketplaceListing) => void;
  lang?: 'en' | 'bn';
}

export function MarketplaceListingCard({
  listing,
  onBuy,
  lang = 'en',
}: MarketplaceListingCardProps) {
  const askingPriceBdt = listing.askingPricePoisha / CONVERSIONS.POISHA_PER_BDT;
  const isPhysicallyAssayed =
    listing.verificationStatus === MarketplaceVerificationStatus.PHYSICALLY_ASSAYED;

  const photoUrl =
    listing.photos && listing.photos.length > 0
      ? listing.photos[0]
      : '/images/hero/bullion-macro.jpg';

  const conditionLabels: Record<ItemCondition, string> = {
    [ItemCondition.NEW_IN_BLISTER]: 'New in Blister',
    [ItemCondition.LIKE_NEW]: 'Like New',
    [ItemCondition.USED_GOOD]: 'Used (Good)',
    [ItemCondition.SCRAP_OR_DAMAGED]: 'Scrap / Meltable',
  };

  return (
    <div className="group rounded-3xl bg-gradient-to-b from-aurum-card-bg/90 to-aurum-midnight/95 border border-aurum-border/80 hover:border-aurum-gold/60 p-5 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] flex flex-col justify-between text-left">
      <div>
        {/* Verification Status Banner - Mandatory Honesty Rule */}
        <div className="mb-3">
          {isPhysicallyAssayed ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>XRF Spectrometer Assayed by AurumSave</span>
            </div>
          ) : (
            <div className="flex items-start space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-tight font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Customer Claimed:</strong> Unverified until physical assay at AurumSave pickup desk
              </span>
            </div>
          )}
        </div>

        {/* Visual Container */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-aurum-midnight/80 border border-aurum-border/40 group-hover:border-aurum-gold/40 transition-colors mb-4 flex items-center justify-center">
          <Image
            src={photoUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-aurum-midnight/80 backdrop-blur-md border border-aurum-border text-[10px] font-bold text-aurum-gold">
            {listing.category.replace('_', ' ')}
          </div>
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white flex items-center space-x-1">
            <Tag className="w-3 h-3 text-aurum-gold" />
            <span>{conditionLabels[listing.condition] || listing.condition}</span>
          </div>
        </div>

        {/* Title & Seller Info */}
        <div className="flex items-center justify-between text-xs text-aurum-text-muted mb-1">
          <span className="flex items-center space-x-1">
            <User className="w-3 h-3 text-aurum-gold" />
            <span className="truncate max-w-[130px]">{listing.sellerName}</span>
          </span>
          <span className="font-mono text-[10px]">{listing.listingId}</span>
        </div>

        <h3 className="text-base font-bold text-aurum-text group-hover:text-aurum-gold transition-colors line-clamp-1">
          {listing.title}
        </h3>

        {/* Weights Matrix */}
        <div className="mt-3 p-3 rounded-2xl bg-aurum-midnight/60 border border-aurum-border/50 space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-aurum-text-muted">Purity Grade:</span>
            <span className="font-bold text-aurum-gold font-mono">
              {isPhysicallyAssayed && listing.verifiedPurity
                ? `${listing.verifiedPurity} (Verified)`
                : `${listing.claimedPurity} (Claimed)`}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-aurum-text-muted">Gross Item Weight:</span>
            <span className="font-mono font-medium text-aurum-text">
              {listing.claimedGrossWeightGrams}g
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-aurum-text-muted">Net Gold Content:</span>
            <span className="font-mono font-bold text-emerald-400">
              {isPhysicallyAssayed && listing.verifiedNetGoldWeightGrams
                ? `${listing.verifiedNetGoldWeightGrams}g (Assayed)`
                : `${listing.claimedNetGoldWeightGrams}g`}
            </span>
          </div>

          {listing.stoneWastageDeductionGrams > 0 && (
            <div className="flex justify-between items-center text-[11px] text-amber-400/90 pt-1 border-t border-aurum-border/30">
              <span>Stone / Wax Deduction:</span>
              <span className="font-mono">-{listing.stoneWastageDeductionGrams}g</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Asking Price & Action */}
      <div className="mt-4 pt-3 border-t border-aurum-border/40">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs font-semibold text-aurum-text-muted uppercase tracking-wider">
            Seller Asking Price
          </span>
          <span className="text-xl font-black font-mono text-aurum-gold">
            {formatBDT(askingPriceBdt)}
          </span>
        </div>

        <button
          onClick={() => onBuy(listing)}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold-dark text-aurum-midnight hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95"
        >
          <span>Buy via Escrow Protection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
