'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import {
  MarketplaceListingCard,
  MarketplaceListing,
} from '../../components/commerce/MarketplaceListingCard';
import { EscrowPurchaseModal } from '../../components/commerce/EscrowPurchaseModal';
import { CreateListingModal } from '../../components/commerce/CreateListingModal';
import { ScrapJewelleryModal } from '../../components/commerce/ScrapJewelleryModal';
import {
  Sparkles,
  PlusCircle,
  ShieldCheck,
  Scale,
  Filter,
  Search,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { MarketplaceCategory, PurityGrade } from '../../shared';
import { useLanguage } from '../../lib/language-context';

export default function MarketplacePage() {
  const { t, language } = useLanguage();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPurity, setSelectedPurity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [activeListingForBuy, setActiveListingForBuy] = useState<MarketplaceListing | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState<boolean>(false);
  const [isScrapModalOpen, setIsScrapModalOpen] = useState<boolean>(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: MarketplaceListing[] }>(
        '/commerce/marketplace/listings',
      );
      if (res?.data) {
        setListings(res.data);
      }
    } catch (err) {
      console.error('Failed to load marketplace listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleBuyClick = (listing: MarketplaceListing) => {
    setActiveListingForBuy(listing);
    setIsBuyModalOpen(true);
  };

  const filteredListings = listings.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedPurity !== 'ALL' && item.claimedPurity !== selectedPurity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSeller = item.sellerName.toLowerCase().includes(q);
      if (!matchTitle && !matchSeller) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-aurum-midnight text-aurum-text pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-aurum-border/60 bg-gradient-to-b from-aurum-midnight via-aurum-card-bg/30 to-aurum-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-aurum-gold/15 border border-aurum-gold/30 text-aurum-gold text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Peer-to-Peer Gold Exchange</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif-luxury font-black tracking-tight text-aurum-text leading-tight">
                Customer Gold & Jewellery{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-amber-200">
                  Marketplace
                </span>
              </h1>

              <p className="text-sm sm:text-base text-aurum-text-muted leading-relaxed">
                Buy and sell authentic pre-owned minted gold bars, coins, and heritage ornaments with guaranteed <strong>AurumSave Escrow Protection</strong> and on-site physical assay inspection.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsCreateListingOpen(true)}
                className="px-5 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold-dark text-aurum-midnight hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell Pre-Owned Gold</span>
              </button>

              <button
                onClick={() => setIsScrapModalOpen(true)}
                className="px-5 py-3 rounded-2xl font-bold text-sm bg-aurum-card-bg border border-aurum-gold/40 text-aurum-gold hover:bg-aurum-gold/10 transition-colors flex items-center justify-center space-x-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Liquidate Scrap Jewellery</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Filters Row */}
        <div className="p-4 rounded-2xl bg-aurum-card-bg/60 border border-aurum-border/70 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-aurum-text-muted" />
            <input
              type="text"
              placeholder="Search listings or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-aurum-midnight/90 border border-aurum-border rounded-xl pl-10 pr-4 py-2 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-aurum-text-muted uppercase tracking-wider shrink-0 flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-aurum-midnight border border-aurum-border rounded-xl px-3 py-1.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold"
            >
              <option value="ALL">All Categories</option>
              {Object.values(MarketplaceCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ')}
                </option>
              ))}
            </select>

            {/* Purity Filter */}
            <select
              value={selectedPurity}
              onChange={(e) => setSelectedPurity(e.target.value)}
              className="bg-aurum-midnight border border-aurum-border rounded-xl px-3 py-1.5 text-xs text-aurum-text focus:outline-none focus:border-aurum-gold ml-2"
            >
              <option value="ALL">All Purities</option>
              <option value={PurityGrade.K24}>24K (99.9%)</option>
              <option value={PurityGrade.K22}>22K (91.6%)</option>
              <option value={PurityGrade.K21}>21K (87.5%)</option>
              <option value={PurityGrade.K18}>18K (75.0%)</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-aurum-card-bg/40 border border-aurum-border animate-pulse"
              />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <MarketplaceListingCard
                key={listing.listingId}
                listing={listing}
                onBuy={handleBuyClick}
                lang={language as any}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-3xl bg-aurum-card-bg/30 border border-aurum-border">
            <Scale className="w-12 h-12 text-aurum-gold/40 mx-auto mb-3" />
            <h4 className="text-base font-bold text-aurum-text">No active listings matching your criteria</h4>
            <p className="text-xs text-aurum-text-muted mt-1 max-w-sm mx-auto">
              Be the first to list a gold bullion bar or jewellery piece for verified buyers across Bangladesh.
            </p>
            <button
              onClick={() => setIsCreateListingOpen(true)}
              className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light transition-colors"
            >
              List an Item Now
            </button>
          </div>
        )}
      </section>

      {/* Modals */}
      <EscrowPurchaseModal
        listing={activeListingForBuy}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onPurchaseCompleted={fetchListings}
        lang={language as any}
      />

      <CreateListingModal
        isOpen={isCreateListingOpen}
        onClose={() => setIsCreateListingOpen(false)}
        onListingCreated={fetchListings}
        lang={language as any}
      />

      <ScrapJewelleryModal
        isOpen={isScrapModalOpen}
        onClose={() => setIsScrapModalOpen(false)}
        lang={language as any}
      />
    </div>
  );
}
