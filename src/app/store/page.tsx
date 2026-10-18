'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiRequest } from '../../lib/api';
import { OfficialProductCard, OfficialProduct } from '../../components/commerce/OfficialProductCard';
import { StoreCheckoutModal } from '../../components/commerce/StoreCheckoutModal';
import { ShieldCheck, Award, Lock, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../lib/language-context';

export default function OfficialGoldStorePage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<OfficialProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<OfficialProduct | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: OfficialProduct[] }>(
        '/commerce/store/products',
      );
      if (res?.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load store products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuyNow = (product: OfficialProduct, qty: number) => {
    setSelectedProduct(product);
    setSelectedQuantity(qty);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-aurum-midnight text-aurum-text pb-20">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-aurum-border/60 bg-gradient-to-b from-aurum-midnight via-aurum-card-bg/40 to-aurum-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AurumSave Minted Bullion Store</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif-luxury font-black tracking-tight text-aurum-text leading-tight">
                Authentic Minted Gold Bars{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-amber-200">
                  Ready for Pickup
                </span>
              </h1>

              <p className="text-sm sm:text-base text-aurum-text-muted max-w-xl leading-relaxed">
                Directly from company vault custody. Manufactured under LBMA good delivery standards and sealed in tamper-evident assay blister packs. Collect at verified depository desks across Bangladesh.
              </p>

              {/* Security Badges Row */}
              <div className="pt-2 flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-aurum-card-bg/70 border border-aurum-border text-xs">
                  <Award className="w-4 h-4 text-aurum-gold shrink-0" />
                  <span className="font-medium">BSTI & PAMP Assayed 999.9</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-aurum-card-bg/70 border border-aurum-border text-xs">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">Tamper-Proof Blister Safe</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-aurum-card-bg/70 border border-aurum-border text-xs">
                  <Building2 className="w-4 h-4 text-aurum-gold shrink-0" />
                  <span className="font-medium">64-District Handover Network</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden border border-aurum-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                <Image
                  src="/images/hero/bullion-macro.jpg"
                  alt="AurumSave Sovereign Minted Gold Bullion"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-aurum-midnight via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-aurum-midnight/90 backdrop-blur-md border border-aurum-border/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-aurum-gold tracking-wider">
                      Physical Vault Custody
                    </span>
                    <p className="text-xs font-bold text-aurum-text">
                      Guaranteed Immediate Allocation
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Rates Applied
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-aurum-gold">
              Company Minted Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-aurum-text mt-1">
              Select Your Minted Bullion Bar
            </h2>
            <p className="text-xs text-aurum-text-muted mt-1">
              All prices update live with BAJUS / LBMA benchmark rates and include transparent assay & making fees.
            </p>
          </div>

          <a
            href="/marketplace"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-aurum-gold hover:text-aurum-gold-light transition-colors self-start sm:self-auto"
          >
            <span>Looking for pre-owned jewellery or C2C gold?</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-aurum-card-bg/40 border border-aurum-border animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <OfficialProductCard
                key={product.productId}
                product={product}
                onBuyNow={handleBuyNow}
                lang={language as any}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-aurum-card-bg/30 border border-aurum-border">
            <p className="text-sm text-aurum-text-muted">
              No store products currently listed. Please check back shortly.
            </p>
          </div>
        )}
      </section>

      {/* Authenticity Guarantee & District Pickup Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-aurum-card-bg/80 via-aurum-midnight to-aurum-card-bg/80 border border-aurum-border/80 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-aurum-text">BSTI & Assay Certified</h4>
              <p className="text-xs text-aurum-text-muted leading-relaxed">
                Each bullion bar undergoes spectrometer XRF assay verification and is accompanied by a unique serial code and authenticity certificate.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-aurum-text">Tamper-Proof Blister Seal</h4>
              <p className="text-xs text-aurum-text-muted leading-relaxed">
                Individual cards are sealed in high-security, tamper-evident blister packaging. Opening the pack breaks the security hologram seal.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-aurum-text">6-Digit OTP Secure Handover</h4>
              <p className="text-xs text-aurum-text-muted leading-relaxed">
                Handover is strictly completed in person at authorized depository desks upon verifying your phone OTP and national ID.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Drawer/Modal */}
      <StoreCheckoutModal
        product={selectedProduct}
        quantity={selectedQuantity}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={fetchProducts}
        lang={language as any}
      />
    </div>
  );
}
