'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Award, Sparkles, Check, ArrowRight } from 'lucide-react';
import { formatBDT } from '../../lib/utils';
import { PurityGrade } from '../../shared';

export interface OfficialProduct {
  productId: string;
  titleEn: string;
  titleBn: string;
  slug: string;
  productType: 'MINTED_BAR' | 'CAST_BAR' | 'COIN';
  purity: PurityGrade;
  weightGrams: number;
  weightMilligrams: number;
  makingFeePoisha: number;
  inStockQuantity: number;
  reservedQuantity: number;
  images: string[];
  certifier: string;
  standard: string;
  isActive: boolean;
  ratePerGramBdt: number;
  goldValueBdt: number;
  makingFeeBdt: number;
  calculatedPriceBdt: number;
  calculatedPricePoisha: number;
}

interface OfficialProductCardProps {
  product: OfficialProduct;
  onBuyNow: (product: OfficialProduct, quantity: number) => void;
  lang?: 'en' | 'bn';
}

export function OfficialProductCard({
  product,
  onBuyNow,
  lang = 'en',
}: OfficialProductCardProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const isOutOfStock = product.inStockQuantity <= 0;

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((q) => Math.min(product.inStockQuantity || 1, q + 1));
  };

  const totalPriceBdt = product.calculatedPriceBdt * quantity;
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/images/hero/bullion-macro.jpg';

  return (
    <div className="group relative rounded-3xl bg-gradient-to-b from-aurum-card-bg/90 to-aurum-midnight/95 border border-aurum-border/80 hover:border-aurum-gold/60 p-5 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] flex flex-col justify-between">
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-gradient-to-r from-aurum-gold/20 to-aurum-gold-light/20 text-aurum-gold border border-aurum-gold/30">
            <Sparkles className="w-3 h-3 mr-1" />
            {product.purity} • {product.productType === 'MINTED_BAR' ? 'Minted Bullion' : 'Cast Bar'}
          </span>

          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              isOutOfStock
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {isOutOfStock
              ? 'Vault Depleted'
              : `${product.inStockQuantity} in Vault Stock`}
          </span>
        </div>

        {/* Product Visual Container */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-aurum-midnight/80 border border-aurum-border/40 group-hover:border-aurum-gold/40 transition-colors mb-4 flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-gradient-to-t from-aurum-midnight via-transparent to-transparent z-10 opacity-70" />
          <Image
            src={imageSrc}
            alt={product.titleEn}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Authentic Gold Seal */}
          <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center space-x-1 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-aurum-gold/40 text-[10px] font-semibold text-aurum-gold">
            <Award className="w-3 h-3 text-aurum-gold" />
            <span>{product.certifier}</span>
          </div>

          <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded bg-aurum-gold text-aurum-midnight text-[11px] font-extrabold shadow-md">
            {product.weightGrams >= 11.664 ? '1 Bhori (11.664g)' : `${product.weightGrams}g`}
          </div>
        </div>

        {/* Title & Specs */}
        <h3 className="text-base font-bold text-aurum-text group-hover:text-aurum-gold transition-colors leading-snug">
          {lang === 'bn' ? product.titleBn : product.titleEn}
        </h3>

        <p className="text-xs text-aurum-text-muted mt-1 flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1 shrink-0" />
          <span>{product.standard}</span>
        </p>

        {/* Price Breakdown */}
        <div className="mt-4 p-3 rounded-xl bg-aurum-midnight/60 border border-aurum-border/50 text-left">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-aurum-text-muted">Live Rate ({product.purity})</span>
            <span className="text-xs font-mono font-medium text-aurum-text">
              {formatBDT(product.ratePerGramBdt)}/g
            </span>
          </div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-aurum-text-muted">Gold Base Value</span>
            <span className="text-xs font-mono font-medium text-aurum-text">
              {formatBDT(product.goldValueBdt)}
            </span>
          </div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs text-aurum-text-muted">Assay & Blister Fee</span>
            <span className="text-xs font-mono font-medium text-aurum-gold">
              +{formatBDT(product.makingFeeBdt)}
            </span>
          </div>

          <div className="pt-2 border-t border-aurum-border/60 flex justify-between items-baseline">
            <span className="text-xs font-bold text-aurum-text uppercase tracking-wider">
              Unit Price
            </span>
            <span className="text-lg font-black font-mono text-aurum-gold">
              {formatBDT(product.calculatedPriceBdt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action / Buy Bar */}
      <div className="mt-4 pt-3 border-t border-aurum-border/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-aurum-text-muted">Quantity</span>
          <div className="flex items-center space-x-2 bg-aurum-midnight/80 border border-aurum-border rounded-xl px-2 py-1">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-6 h-6 rounded flex items-center justify-center text-aurum-text hover:text-aurum-gold disabled:opacity-40 font-bold"
            >
              -
            </button>
            <span className="text-xs font-bold font-mono text-aurum-text w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.inStockQuantity || isOutOfStock}
              className="w-6 h-6 rounded flex items-center justify-center text-aurum-text hover:text-aurum-gold disabled:opacity-40 font-bold"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => onBuyNow(product, quantity)}
          disabled={isOutOfStock}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold-dark text-aurum-midnight hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95"
        >
          <span>
            {isOutOfStock
              ? 'Out of Stock'
              : `Buy Now • ${formatBDT(totalPriceBdt)}`}
          </span>
          {!isOutOfStock && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
