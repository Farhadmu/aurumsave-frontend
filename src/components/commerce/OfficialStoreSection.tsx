'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Lock,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Scale,
  TrendingUp,
  Percent,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { formatBDT } from '../../lib/utils';
import { useLanguage } from '../../lib/language-context';
import { OfficialProduct } from './OfficialProductCard';
import { StoreCheckoutModal } from './StoreCheckoutModal';
import { PurityGrade } from '../../shared';

export interface CartItem {
  product: OfficialProduct;
  quantity: number;
}

// Default fallback catalog if backend is booting or on initial paint
const DEFAULT_PRODUCTS: OfficialProduct[] = [
  {
    productId: 'PROD-BAR-1G-24K',
    titleEn: 'AurumSave Sovereign 1g 24K Minted Gold Bar',
    titleBn: 'অরামসেভ ১ গ্রাম ২৪ ক্যারেট মিন্টেড গোল্ড বার',
    slug: '1g-24k-minted-gold-bar',
    productType: 'MINTED_BAR',
    purity: PurityGrade.K24,
    weightGrams: 1.0,
    weightMilligrams: 1000,
    makingFeePoisha: 45000,
    inStockQuantity: 25,
    reservedQuantity: 0,
    images: ['/images/hero/bullion-macro.jpg'],
    certifier: 'BSTI & PAMP Assay Certified',
    standard: 'LBMA Good Delivery Standard',
    isActive: true,
    ratePerGramBdt: 12450,
    goldValueBdt: 12450,
    makingFeeBdt: 450,
    calculatedPriceBdt: 12900,
    calculatedPricePoisha: 1290000,
  },
  {
    productId: 'PROD-BAR-5G-24K',
    titleEn: 'AurumSave Sovereign 5g 24K Minted Gold Bar',
    titleBn: 'অরামসেভ ৫ গ্রাম ২৪ ক্যারেট মিন্টেড গোল্ড বার',
    slug: '5g-24k-minted-gold-bar',
    productType: 'MINTED_BAR',
    purity: PurityGrade.K24,
    weightGrams: 5.0,
    weightMilligrams: 5000,
    makingFeePoisha: 125000,
    inStockQuantity: 15,
    reservedQuantity: 0,
    images: ['/images/hero/vault-cinematic.jpg'],
    certifier: 'BSTI & PAMP Assay Certified',
    standard: 'LBMA Good Delivery Standard',
    isActive: true,
    ratePerGramBdt: 12450,
    goldValueBdt: 62250,
    makingFeeBdt: 1250,
    calculatedPriceBdt: 63500,
    calculatedPricePoisha: 6350000,
  },
  {
    productId: 'PROD-BAR-10G-24K',
    titleEn: 'AurumSave Sovereign 10g 24K Minted Gold Bar',
    titleBn: 'অরামসেভ ১০ গ্রাম ২৪ ক্যারেট মিন্টেড গোল্ড বার',
    slug: '10g-24k-minted-gold-bar',
    productType: 'MINTED_BAR',
    purity: PurityGrade.K24,
    weightGrams: 10.0,
    weightMilligrams: 10000,
    makingFeePoisha: 200000,
    inStockQuantity: 10,
    reservedQuantity: 0,
    images: ['/images/hero/texture-cinematic.jpg'],
    certifier: 'BSTI & Valcambi Assay Certified',
    standard: 'LBMA Good Delivery Standard',
    isActive: true,
    ratePerGramBdt: 12450,
    goldValueBdt: 124500,
    makingFeeBdt: 2000,
    calculatedPriceBdt: 126500,
    calculatedPricePoisha: 12650000,
  },
  {
    productId: 'PROD-BAR-1BHORI-22K',
    titleEn: 'AurumSave Heritage 1 Bhori (11.664g) 22K Investment Bar',
    titleBn: 'অরামসেভ হেরিটেজ ১ ভরি (১১.৬৬৪ গ্রাম) ২২ ক্যারেট গোল্ড বার',
    slug: '1-bhori-22k-investment-bar',
    productType: 'CAST_BAR',
    purity: PurityGrade.K22,
    weightGrams: 11.664,
    weightMilligrams: 11664,
    makingFeePoisha: 250000,
    inStockQuantity: 8,
    reservedQuantity: 0,
    images: ['/images/hero/bullion-macro.jpg'],
    certifier: 'BSTI Hallmark 916 Assayed',
    standard: 'Bangladesh Jewellery Standard',
    isActive: true,
    ratePerGramBdt: 11850,
    goldValueBdt: 138218,
    makingFeeBdt: 2500,
    calculatedPriceBdt: 140718,
    calculatedPricePoisha: 14071800,
  },
];

export default function OfficialStoreSection() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<OfficialProduct[]>(DEFAULT_PRODUCTS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'K24' | 'K22'>('ALL');
  const [loading, setLoading] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'PROD-BAR-1G-24K': 1,
    'PROD-BAR-5G-24K': 1,
    'PROD-BAR-10G-24K': 1,
    'PROD-BAR-1BHORI-22K': 1,
  });

  // Cart & Checkout state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeCheckoutProduct, setActiveCheckoutProduct] = useState<OfficialProduct | null>(null);
  const [activeCheckoutQuantity, setActiveCheckoutQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Fetch real catalog from API
  const fetchProducts = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: OfficialProduct[] }>(
        '/commerce/store/products',
      );
      if (res?.data && res.data.length > 0) {
        setProducts(res.data);
      }
    } catch {
      // Fallback remains active
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: string, delta: number, maxStock: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(maxStock, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleInstantBuy = (product: OfficialProduct) => {
    const qty = quantities[product.productId] || 1;
    setActiveCheckoutProduct(product);
    setActiveCheckoutQuantity(qty);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (product: OfficialProduct) => {
    const qty = quantities[product.productId] || 1;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.productId === product.productId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = Math.min(
          product.inStockQuantity,
          updated[existingIndex].quantity + qty,
        );
        return updated;
      } else {
        return [...prev, { product, quantity: qty }];
      }
    });

    const title = language === 'bn' ? product.titleBn : product.titleEn;
    setCartToast(`${qty}× ${title} ${language === 'bn' ? 'কার্টে যোগ করা হয়েছে' : 'added to cart'}`);
    setTimeout(() => setCartToast(null), 3000);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.productId !== productId));
  };

  const handleUpdateCartQty = (productId: string, delta: number, maxStock: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(maxStock, newQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    );
  };

  // Cart aggregate totals
  const totalCartWeightGrams = cart.reduce(
    (sum, item) => sum + item.product.weightGrams * item.quantity,
    0,
  );
  const totalCartWeightBhori = totalCartWeightGrams / 11.664;
  const totalCartPriceBdt = cart.reduce(
    (sum, item) => sum + item.product.calculatedPriceBdt * item.quantity,
    0,
  );
  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filtered product list
  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'K24') return p.purity === PurityGrade.K24;
    if (selectedFilter === 'K22') return p.purity === PurityGrade.K22;
    return true;
  });

  return (
    <section id="official-gold-store" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3 rounded-2xl bg-aurum-midnight border border-aurum-gold/60 shadow-[0_10px_30px_rgba(212,175,55,0.3)] text-xs text-aurum-gold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{cartToast}</span>
        </div>
      )}

      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-aurum-border/60">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold text-xs font-bold tracking-widest uppercase mb-3 shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-aurum-gold" />
            <span>{t('store.badge')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">BAJUS SYNCED</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-black text-aurum-text tracking-tight">
            {language === 'bn'
              ? 'খাঁটি মিন্টেড গোল্ড বার ও কয়েন'
              : 'Authentic Minted Bullion Collection'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-aurum-text-muted max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'কোম্পানির কেন্দ্রীয় ভল্ট থেকে সরাসরি সংগৃহীত ১ গ্রাম, ৫ গ্রাম, ১০ গ্রাম এবং ১ ভরি আসল সোনা। টেম্পার-প্রুফ সিকিউরিটি ব্লিস্টার প্যাকেজিং ও ৬৪ জেলায় নিরাপদ হ্যান্ডওভার সুবিধা।'
              : 'Directly vaulted 1g, 5g, 10g, and 1 Bhori pure physical bars. Sealed in tamper-evident blister cards with 6-digit OTP secure collection at 64 district depository desks.'}
          </p>
        </div>

        {/* Right Action & Cart Pill */}
        <div className="flex items-center space-x-3 self-start md:self-end">
          {/* Cart Pill Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2.5 rounded-xl bg-aurum-card-bg/90 border border-aurum-gold/40 hover:border-aurum-gold text-aurum-text hover:text-aurum-gold transition-all flex items-center space-x-2 text-xs font-bold shadow-md"
          >
            <ShoppingCart className="w-4 h-4 text-aurum-gold" />
            <span>{language === 'bn' ? 'স্বর্ণ কার্ট' : 'Bullion Cart'}</span>
            {totalCartItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-aurum-gold text-aurum-midnight text-[11px] font-black flex items-center justify-center">
                {totalCartItemsCount}
              </span>
            )}
          </button>

          <Link
            href="/store"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold hover:brightness-110 text-aurum-midnight font-bold text-xs shadow-gold-glow flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ স্টোর' : 'View Full Store'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Assurance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="inline-flex p-1 rounded-2xl bg-aurum-card-bg/80 border border-aurum-border">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-aurum-gold text-aurum-midnight shadow-md'
                : 'text-aurum-text-muted hover:text-aurum-text'
            }`}
          >
            {language === 'bn' ? 'সকল সাইজ (১ গ্রাম – ১ ভরি)' : 'All Sizes (1g – 1 Bhori)'}
          </button>
          <button
            onClick={() => setSelectedFilter('K24')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'K24'
                ? 'bg-aurum-gold text-aurum-midnight shadow-md'
                : 'text-aurum-text-muted hover:text-aurum-text'
            }`}
          >
            {language === 'bn' ? '২৪ ক্যারেট মিন্টেড বার (৯৯.৯%)' : '24K Minted Bars (99.9%)'}
          </button>
          <button
            onClick={() => setSelectedFilter('K22')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'K22'
                ? 'bg-aurum-gold text-aurum-midnight shadow-md'
                : 'text-aurum-text-muted hover:text-aurum-text'
            }`}
          >
            {language === 'bn' ? '২২ ক্যারেট হেরিটেজ বার (৯১.৬%)' : '22K Heritage Bars (91.6%)'}
          </button>
        </div>

        {/* Security badges quick row */}
        <div className="hidden lg:flex items-center space-x-4 text-[11px] text-aurum-text-muted">
          <span className="flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-aurum-gold" />
            <span>BSTI & PAMP Assayed</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-aurum-border" />
          <span className="flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tamper-Proof Blister Safe</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-aurum-border" />
          <span className="flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-aurum-gold" />
            <span>64-District Handover Desks</span>
          </span>
        </div>
      </div>

      {/* Product Cards Grid — Gold Kinen Inspired Luxury Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const qty = quantities[product.productId] || 1;
          const isOutOfStock = product.inStockQuantity <= 0;
          const totalUnitBdt = product.calculatedPriceBdt * qty;
          const imageSrc =
            product.images && product.images.length > 0
              ? product.images[0]
              : '/images/hero/bullion-macro.jpg';

          return (
            <div
              key={product.productId}
              className="group relative rounded-3xl bg-gradient-to-b from-[#111A2E]/90 to-aurum-card-bg/95 border border-aurum-border/80 hover:border-aurum-gold/60 p-5 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(212,175,55,0.18)] flex flex-col justify-between"
            >
              {/* Product Top Metadata */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-gradient-to-r from-aurum-gold/20 to-aurum-gold-light/20 text-aurum-gold border border-aurum-gold/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {product.purity} • {product.productType === 'MINTED_BAR' ? 'Minted Bar' : 'Heritage Cast'}
                  </span>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isOutOfStock
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {isOutOfStock
                      ? (language === 'bn' ? 'ভল্ট স্টক শেষ' : 'Vault Depleted')
                      : (language === 'bn'
                          ? `${product.inStockQuantity}টি ভল্টে মজুদ`
                          : `${product.inStockQuantity} in Vault`)}
                  </span>
                </div>

                {/* Bullion Image Container with Hologram Badge */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-aurum-midnight/80 border border-aurum-border/50 group-hover:border-aurum-gold/40 transition-colors mb-4 flex items-center justify-center p-3">
                  <div className="absolute inset-0 bg-gradient-to-t from-aurum-midnight via-transparent to-transparent z-10 opacity-70" />
                  <Image
                    src={imageSrc}
                    alt={product.titleEn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Certifier Seal */}
                  <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center space-x-1 px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-aurum-gold/40 text-[10px] font-semibold text-aurum-gold">
                    <Award className="w-3 h-3 text-aurum-gold shrink-0" />
                    <span className="truncate max-w-[130px]">{product.certifier}</span>
                  </div>

                  {/* Weight Tag */}
                  <div className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded-lg bg-aurum-gold text-aurum-midnight text-[11px] font-black shadow-lg">
                    {product.weightGrams >= 11.664 ? '1 Bhori (11.664g)' : `${product.weightGrams}g`}
                  </div>
                </div>

                {/* Title & Standards */}
                <h3 className="text-base font-bold text-aurum-text group-hover:text-aurum-gold transition-colors leading-snug">
                  {language === 'bn' ? product.titleBn : product.titleEn}
                </h3>

                <p className="text-[11px] text-aurum-text-muted mt-1 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1 shrink-0" />
                  <span className="truncate">{product.standard}</span>
                </p>

                {/* Itemized Price Breakdown */}
                <div className="mt-4 p-3 rounded-2xl bg-aurum-midnight/70 border border-aurum-border/60 text-left space-y-1.5 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-aurum-text-muted text-[11px]">
                      {language === 'bn' ? 'লাইভ বাজার দর' : 'Live Rate'} ({product.purity})
                    </span>
                    <span className="font-mono text-aurum-text">
                      {formatBDT(product.ratePerGramBdt)}/g
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-aurum-text-muted text-[11px]">
                      {language === 'bn' ? 'স্বর্ণের ভিত্তি মূল্য' : 'Base Gold Value'}
                    </span>
                    <span className="font-mono text-aurum-text">
                      {formatBDT(product.goldValueBdt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-aurum-text-muted text-[11px]">
                      {language === 'bn' ? 'অ্যাসেই ও ব্লিস্টার ফি' : 'Assay & Blister Fee'}
                    </span>
                    <span className="font-mono text-aurum-gold font-semibold">
                      +{formatBDT(product.makingFeeBdt)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-aurum-border/60 flex justify-between items-baseline">
                    <span className="font-bold text-aurum-text uppercase tracking-wider text-[11px]">
                      {language === 'bn' ? 'মোট একক মূল্য' : 'Unit Price'}
                    </span>
                    <span className="text-lg font-black font-mono text-aurum-gold">
                      {formatBDT(product.calculatedPriceBdt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar (Quantity + Buy Now + Add To Cart) */}
              <div className="mt-4 pt-3 border-t border-aurum-border/50">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-aurum-text-muted">
                    {language === 'bn' ? 'পরিমাণ' : 'Quantity'}
                  </span>
                  <div className="flex items-center space-x-2 bg-aurum-midnight/90 border border-aurum-border rounded-xl px-2.5 py-1">
                    <button
                      onClick={() => handleQuantityChange(product.productId, -1, product.inStockQuantity)}
                      disabled={qty <= 1 || isOutOfStock}
                      className="w-5 h-5 rounded flex items-center justify-center text-aurum-text hover:text-aurum-gold disabled:opacity-30 font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold font-mono text-aurum-text w-6 text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.productId, 1, product.inStockQuantity)}
                      disabled={qty >= product.inStockQuantity || isOutOfStock}
                      className="w-5 h-5 rounded flex items-center justify-center text-aurum-text hover:text-aurum-gold disabled:opacity-30 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Primary Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    className="py-2.5 px-2 rounded-xl text-xs font-bold border border-aurum-gold/40 hover:border-aurum-gold bg-aurum-midnight/80 hover:bg-aurum-card-bg text-aurum-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'কার্টে রাখুন' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={() => handleInstantBuy(product)}
                    disabled={isOutOfStock}
                    className="py-2.5 px-2 rounded-xl text-xs font-black bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold text-aurum-midnight hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-gold-glow transition-all flex items-center justify-center space-x-1 active:scale-95"
                  >
                    <span>{language === 'bn' ? 'কিনুন' : 'Buy Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparent Savings Metric Comparison Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#111A2E] via-aurum-card-bg to-[#111A2E] border border-aurum-border-gold/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center shrink-0 border border-aurum-gold/30">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-aurum-text">
              {language === 'bn'
                ? 'অলংকারের তুলনায় সরাসরি কেনাকাটায় মজুরি সাশ্রয়'
                : 'Zero Making Charges & Zero Wastage Loss'}
            </h4>
            <p className="text-xs text-aurum-text-muted mt-0.5 max-w-xl leading-relaxed">
              {language === 'bn'
                ? 'ঐতিহ্যবাহী স্বর্ণালঙ্কার দোকানে প্রতি গ্রামে ৩৫০ – ৬০০ টাকা মজুরি এবং ২% – ৩% কাটিং লস কাটা হয়। AurumSave-এ আপনি পাচ্ছেন ১০০% বিশুদ্ধ বুলিয়ন যাতে আপনার সম্পূর্ণ টাকা সরাসরি সোনায় বিনিয়োগ হয়।'
                : 'Traditional retail jewellery deducts ৳350 – ৳600/gram in making charges and 2.5% in cutting wastage. On AurumSave, 100% of your investment accumulates in certified physical bullion.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <Link
            href="/marketplace"
            className="px-4 py-2.5 rounded-xl border border-aurum-border hover:border-aurum-gold text-xs font-bold text-aurum-text hover:text-aurum-gold transition-colors flex items-center space-x-1.5"
          >
            <span>{language === 'bn' ? 'পুরোনো সোনা বিক্রয় মার্কেটপ্লেস' : 'Pre-Owned Gold Exchange'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Slide-out Bullion Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md h-full bg-aurum-midnight border-l border-aurum-border/80 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            {/* Cart Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-aurum-border/60">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-aurum-gold" />
                  <h3 className="text-lg font-serif-luxury font-bold text-aurum-text">
                    {language === 'bn' ? 'আপনার স্বর্ণ কার্ট' : 'Your Bullion Cart'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-aurum-gold/20 text-aurum-gold">
                    {totalCartItemsCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-aurum-text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center text-aurum-text-muted space-y-3">
                    <Scale className="w-12 h-12 text-aurum-border mx-auto stroke-1" />
                    <p className="text-sm">
                      {language === 'bn'
                        ? 'আপনার স্বর্ণ কার্টে বর্তমানে কোনো আইটেম নেই।'
                        : 'Your bullion cart is currently empty.'}
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-aurum-gold border border-aurum-gold/40 hover:bg-aurum-gold/10"
                    >
                      {language === 'bn' ? 'বুলিয়ন ক্যাটালগ দেখুন' : 'Explore Bullion Catalog'}
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.productId}
                      className="p-3.5 rounded-2xl bg-aurum-card-bg/60 border border-aurum-border/60 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-aurum-text line-clamp-1">
                          {language === 'bn' ? item.product.titleBn : item.product.titleEn}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-aurum-text-muted">
                          <span>{item.product.purity}</span>
                          <span>•</span>
                          <span>{item.product.weightGrams}g each</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-aurum-gold block">
                          {formatBDT(item.product.calculatedPriceBdt * item.quantity)}
                        </span>
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex flex-col items-end space-y-2">
                        <button
                          onClick={() => handleRemoveFromCart(item.product.productId)}
                          className="text-aurum-text-dim hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center space-x-1.5 bg-aurum-midnight border border-aurum-border rounded-lg px-2 py-0.5 text-xs">
                          <button
                            onClick={() =>
                              handleUpdateCartQty(
                                item.product.productId,
                                -1,
                                item.product.inStockQuantity,
                              )
                            }
                            className="text-aurum-text hover:text-aurum-gold font-bold px-1"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-aurum-text w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateCartQty(
                                item.product.productId,
                                1,
                                item.product.inStockQuantity,
                              )
                            }
                            className="text-aurum-text hover:text-aurum-gold font-bold px-1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Footer & Checkout Trigger */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-aurum-border/60 space-y-4">
                <div className="p-3.5 rounded-2xl bg-aurum-card-bg/40 border border-aurum-border/60 space-y-2 text-xs">
                  <div className="flex justify-between text-aurum-text-muted">
                    <span>{language === 'bn' ? 'মোট স্বর্ণের ওজন' : 'Total Bullion Weight'}</span>
                    <span className="font-mono text-aurum-text font-bold">
                      {totalCartWeightGrams.toFixed(3)}g ({totalCartWeightBhori.toFixed(3)} Bhori)
                    </span>
                  </div>

                  <div className="flex justify-between text-aurum-text-muted">
                    <span>{language === 'bn' ? 'হ্যান্ডওভার নিরাপত্তা' : 'Depository Handover'}</span>
                    <span className="text-emerald-400 font-semibold">6-Digit OTP Verified</span>
                  </div>

                  <div className="pt-2 border-t border-aurum-border/40 flex justify-between items-baseline">
                    <span className="font-bold text-aurum-text uppercase tracking-wider text-xs">
                      {language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Grand Total'}
                    </span>
                    <span className="text-xl font-mono font-black text-aurum-gold">
                      {formatBDT(totalCartPriceBdt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    // Open checkout for first item or combined
                    if (cart.length > 0) {
                      setActiveCheckoutProduct(cart[0].product);
                      setActiveCheckoutQuantity(cart[0].quantity);
                      setIsCheckoutOpen(true);
                    }
                  }}
                  className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold text-aurum-midnight hover:brightness-110 shadow-gold-glow transition-all flex items-center justify-center space-x-2"
                >
                  <span>{language === 'bn' ? 'নিরাপদ চেকআউট সম্পন্ন করুন' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <StoreCheckoutModal
        product={activeCheckoutProduct}
        quantity={activeCheckoutQuantity}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={() => {
          fetchProducts();
          setCart([]);
        }}
        lang={language as any}
      />
    </section>
  );
}
