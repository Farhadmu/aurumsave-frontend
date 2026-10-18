'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import {
  Store,
  ShoppingBag,
  Building2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Scale,
  Sparkles,
  AlertCircle,
  Search,
  RefreshCw,
  QrCode,
  Flame,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { formatBDT } from '../../lib/utils';
import {
  MarketplaceCategory,
  MarketplaceVerificationStatus,
  PurityGrade,
  CONVERSIONS,
} from '../../shared';

export function CommerceAdminControl() {
  const [activeTab, setActiveTab] = useState<'store' | 'review' | 'scrap' | 'handover'>('review');

  // Store Catalog state
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [loadingStore, setLoadingStore] = useState<boolean>(false);
  const [stockEdit, setStockEdit] = useState<{ [productId: string]: number }>({});
  const [storeSuccess, setStoreSuccess] = useState<string | null>(null);

  // Review Queue state
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [loadingReview, setLoadingReview] = useState<boolean>(false);
  const [selectedReviewListing, setSelectedReviewListing] = useState<any | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [verifiedPurity, setVerifiedPurity] = useState<PurityGrade>(PurityGrade.K22);
  const [verifiedNetWeight, setVerifiedNetWeight] = useState<number>(0);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  // Scrap Queue state
  const [scrapQueue, setScrapQueue] = useState<any[]>([]);
  const [loadingScrap, setLoadingScrap] = useState<boolean>(false);
  const [selectedScrap, setSelectedScrap] = useState<any | null>(null);
  const [scrapActualPurity, setScrapActualPurity] = useState<PurityGrade>(PurityGrade.K22);
  const [scrapActualGross, setScrapActualGross] = useState<number>(0);
  const [scrapStoneDeduction, setScrapStoneDeduction] = useState<number>(0);
  const [scrapNotes, setScrapNotes] = useState<string>('');
  const [isSubmittingScrap, setIsSubmittingScrap] = useState<boolean>(false);

  // Handover state
  const [handoverOrderId, setHandoverOrderId] = useState<string>('');
  const [handoverOtp, setHandoverOtp] = useState<string>('');
  const [handoverDeskId, setHandoverDeskId] = useState<string>('PKP-DHK-GULSHAN');
  const [isVerifyingHandover, setIsVerifyingHandover] = useState<boolean>(false);
  const [handoverResult, setHandoverResult] = useState<any | null>(null);
  const [handoverError, setHandoverError] = useState<string | null>(null);

  // Loaders
  const loadStoreProducts = async () => {
    setLoadingStore(true);
    try {
      const res = await apiRequest<{ success: boolean; data: any[] }>('/commerce/store/products');
      if (res?.data) {
        setStoreProducts(res.data);
        const map: any = {};
        res.data.forEach((p) => {
          map[p.productId] = p.inStockQuantity;
        });
        setStockEdit(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStore(false);
    }
  };

  const loadReviewQueue = async () => {
    setLoadingReview(true);
    try {
      const res = await apiRequest<{ success: boolean; data: any[] }>(
        '/commerce/marketplace/review-queue',
      );
      if (res?.data) {
        setReviewQueue(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReview(false);
    }
  };

  const loadScrapQueue = async () => {
    setLoadingScrap(true);
    try {
      const res = await apiRequest<{ success: boolean; data: any[] }>(
        '/commerce/marketplace/scrap-sell/queue',
      );
      if (res?.data) {
        setScrapQueue(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingScrap(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'store') loadStoreProducts();
    if (activeTab === 'review') loadReviewQueue();
    if (activeTab === 'scrap') loadScrapQueue();
  }, [activeTab]);

  const handleUpdateStock = async (product: any) => {
    try {
      await apiRequest('/commerce/store/products', {
        method: 'POST',
        body: JSON.stringify({
          ...product,
          inStockQuantity: Number(stockEdit[product.productId] || product.inStockQuantity),
        }),
      });
      setStoreSuccess(`Stock updated for ${product.titleEn}`);
      setTimeout(() => setStoreSuccess(null), 3000);
      loadStoreProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const handleExecuteReview = async () => {
    if (!selectedReviewListing) return;
    setIsSubmittingReview(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/commerce/marketplace/listings/${selectedReviewListing.listingId}/review`,
        {
          method: 'POST',
          body: JSON.stringify({
            decision: reviewDecision,
            verifiedPurity: reviewDecision === 'APPROVE' ? verifiedPurity : undefined,
            verifiedNetGoldWeightGrams:
              reviewDecision === 'APPROVE' && verifiedNetWeight > 0 ? verifiedNetWeight : undefined,
            notes: reviewNotes,
            rejectionReason: reviewDecision === 'REJECT' ? reviewNotes : undefined,
          }),
        },
      );
      if (res?.success) {
        setReviewMessage(`Listing ${selectedReviewListing.listingId} review completed`);
        setSelectedReviewListing(null);
        setTimeout(() => setReviewMessage(null), 3000);
        loadReviewQueue();
      }
    } catch (err: any) {
      alert(err.message || 'Review failed');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleExecuteScrapAppraisal = async () => {
    if (!selectedScrap) return;
    setIsSubmittingScrap(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/commerce/marketplace/scrap-sell/${selectedScrap.requestId}/appraise`,
        {
          method: 'POST',
          body: JSON.stringify({
            actualPurity: scrapActualPurity,
            actualGrossWeightGrams: scrapActualGross,
            stoneWeightDeductionGrams: scrapStoneDeduction,
            assayStaffNotes: scrapNotes || 'Spectrometer XRF testing completed at central lab',
          }),
        },
      );
      if (res?.success) {
        setSelectedScrap(null);
        loadScrapQueue();
      }
    } catch (err: any) {
      alert(err.message || 'Scrap appraisal failed');
    } finally {
      setIsSubmittingScrap(false);
    }
  };

  const handleConfirmHandover = async () => {
    if (!handoverOrderId.trim() || !handoverOtp.trim()) {
      setHandoverError('Please enter both Order ID and customer 6-digit OTP');
      return;
    }
    setIsVerifyingHandover(true);
    setHandoverError(null);
    setHandoverResult(null);

    try {
      const res = await apiRequest<{ success: boolean; message: string; order: any }>(
        '/commerce/pickup-points/verify-handover',
        {
          method: 'POST',
          body: JSON.stringify({
            orderId: handoverOrderId.trim(),
            otp: handoverOtp.trim(),
            pickupPointId: handoverDeskId,
            handoverNotes: 'Verified with physical inspection and OTP release at desk',
          }),
        },
      );
      if (res?.success) {
        setHandoverResult(res.order);
      } else {
        setHandoverError(res?.message || 'Handover verification failed');
      }
    } catch (err: any) {
      setHandoverError(err?.message || 'Failed to verify handover OTP');
    } finally {
      setIsVerifyingHandover(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Sub tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-aurum-border pb-3">
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'review'
              ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
              : 'bg-aurum-card-bg/60 text-aurum-text-muted hover:text-white border border-aurum-border'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Marketplace Review Queue ({reviewQueue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'store'
              ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
              : 'bg-aurum-card-bg/60 text-aurum-text-muted hover:text-white border border-aurum-border'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Official Store Vault Stock</span>
        </button>

        <button
          onClick={() => setActiveTab('scrap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'scrap'
              ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
              : 'bg-aurum-card-bg/60 text-aurum-text-muted hover:text-white border border-aurum-border'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Scrap Jewellery Appraisals ({scrapQueue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('handover')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'handover'
              ? 'bg-aurum-gold text-aurum-midnight shadow-gold-glow'
              : 'bg-aurum-card-bg/60 text-aurum-text-muted hover:text-white border border-aurum-border'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Desk Handover & OTP Safe</span>
        </button>
      </div>

      {/* ========================================================
          1. MARKETPLACE REVIEW QUEUE
         ======================================================== */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-aurum-text">
                Customer Marketplace Submissions Awaiting Appraisal
              </h4>
              <p className="text-xs text-aurum-text-muted">
                Review claimed purity, gross weight, and net weight. Approved items are marked unverified until physical handover unless assayed here.
              </p>
            </div>
            <button
              onClick={loadReviewQueue}
              className="p-1.5 rounded-lg bg-aurum-card-bg border border-aurum-border text-aurum-text hover:text-aurum-gold"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {reviewMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              {reviewMessage}
            </div>
          )}

          {loadingReview ? (
            <div className="p-6 rounded-2xl bg-aurum-card-bg/40 border border-aurum-border animate-pulse text-xs text-aurum-text-muted">
              Loading review queue...
            </div>
          ) : reviewQueue.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-aurum-card-bg/30 border border-aurum-border text-xs text-aurum-text-muted">
              No customer listings currently waiting in review queue.
            </div>
          ) : (
            <div className="space-y-3">
              {reviewQueue.map((item) => (
                <div
                  key={item.listingId}
                  className="p-4 rounded-2xl bg-aurum-card-bg/70 border border-aurum-border/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-aurum-gold">
                        {item.listingId}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-aurum-surface text-aurum-text">
                        {item.category}
                      </span>
                      <span className="text-xs text-aurum-text-muted">
                        Seller: <strong>{item.sellerName}</strong>
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-aurum-text">{item.title}</h5>
                    <p className="text-xs text-aurum-text-muted">
                      Claimed: <strong className="text-aurum-gold">{item.claimedPurity}</strong> • Gross:{' '}
                      {item.claimedGrossWeightGrams}g • Net Gold: {item.claimedNetGoldWeightGrams}g • Asking:{' '}
                      <strong className="text-emerald-400">
                        {formatBDT(item.askingPricePoisha / CONVERSIONS.POISHA_PER_BDT)}
                      </strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReviewListing(item);
                      setVerifiedPurity(item.claimedPurity);
                      setVerifiedNetWeight(item.claimedNetGoldWeightGrams);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light shrink-0"
                  >
                    Review & Appraise
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Review Decision Modal */}
          {selectedReviewListing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl bg-aurum-midnight border border-aurum-gold/40 p-6 space-y-4">
                <h4 className="text-base font-bold text-aurum-text">
                  Appraise Listing: {selectedReviewListing.listingId}
                </h4>
                <p className="text-xs text-aurum-text-muted">{selectedReviewListing.title}</p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                      Decision
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewDecision('APPROVE')}
                        className={`py-2 rounded-xl text-xs font-bold ${
                          reviewDecision === 'APPROVE'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-aurum-card-bg text-aurum-text-muted border border-aurum-border'
                        }`}
                      >
                        Approve Listing
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewDecision('REJECT')}
                        className={`py-2 rounded-xl text-xs font-bold ${
                          reviewDecision === 'REJECT'
                            ? 'bg-rose-500 text-white'
                            : 'bg-aurum-card-bg text-aurum-text-muted border border-aurum-border'
                        }`}
                      >
                        Reject Listing
                      </button>
                    </div>
                  </div>

                  {reviewDecision === 'APPROVE' && (
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-aurum-card-bg/40 border border-aurum-border text-xs">
                      <div>
                        <label className="block text-aurum-text-muted mb-1">Verified Purity</label>
                        <select
                          value={verifiedPurity}
                          onChange={(e) => setVerifiedPurity(e.target.value as PurityGrade)}
                          className="w-full bg-aurum-midnight border border-aurum-border rounded-lg p-2 text-white"
                        >
                          <option value={PurityGrade.K24}>24K</option>
                          <option value={PurityGrade.K22}>22K</option>
                          <option value={PurityGrade.K21}>21K</option>
                          <option value={PurityGrade.K18}>18K</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-aurum-text-muted mb-1">
                          Assayed Net Gold (g)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={verifiedNetWeight}
                          onChange={(e) => setVerifiedNetWeight(Number(e.target.value))}
                          className="w-full bg-aurum-midnight border border-aurum-border rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                      Staff Appraisal Notes / Rejection Reason
                    </label>
                    <textarea
                      rows={2}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Notes recorded to immutable audit ledger..."
                      className="w-full bg-aurum-card-bg border border-aurum-border rounded-xl p-2.5 text-xs text-aurum-text"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-aurum-border">
                  <button
                    onClick={() => setSelectedReviewListing(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-aurum-border text-aurum-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteReview}
                    disabled={isSubmittingReview}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light"
                  >
                    Confirm Appraisal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          2. OFFICIAL STORE VAULT STOCK
         ======================================================== */}
      {activeTab === 'store' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-aurum-text">Company Vault Bullion Inventory</h4>
              <p className="text-xs text-aurum-text-muted">
                Manage stock counts for official minted bars (1g, 5g, 10g, 1 Bhori) backed by physical vault custody.
              </p>
            </div>
            <button
              onClick={loadStoreProducts}
              className="p-1.5 rounded-lg bg-aurum-card-bg border border-aurum-border text-aurum-text hover:text-aurum-gold"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {storeSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              {storeSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeProducts.map((prod) => (
              <div
                key={prod.productId}
                className="p-5 rounded-2xl bg-aurum-card-bg/70 border border-aurum-border/80 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-aurum-gold">
                      {prod.productId}
                    </span>
                    <h5 className="text-sm font-bold text-aurum-text mt-0.5">{prod.titleEn}</h5>
                    <p className="text-xs text-aurum-text-muted">
                      {prod.purity} • {prod.weightGrams}g • Making Fee: {formatBDT(prod.makingFeeBdt)}
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {formatBDT(prod.calculatedPriceBdt)}
                  </span>
                </div>

                <div className="pt-2 border-t border-aurum-border/40 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-aurum-text-muted">Vault Stock:</span>
                    <input
                      type="number"
                      min="0"
                      value={stockEdit[prod.productId] !== undefined ? stockEdit[prod.productId] : prod.inStockQuantity}
                      onChange={(e) =>
                        setStockEdit({ ...stockEdit, [prod.productId]: Number(e.target.value) })
                      }
                      className="w-16 bg-aurum-midnight border border-aurum-border rounded-lg px-2 py-1 text-xs text-aurum-text font-mono text-center"
                    />
                    <span className="text-[11px] text-aurum-text-dim">
                      ({prod.reservedQuantity} reserved)
                    </span>
                  </div>

                  <button
                    onClick={() => handleUpdateStock(prod)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light"
                  >
                    Save Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          3. SCRAP JEWELLERY APPRAISALS
         ======================================================== */}
      {activeTab === 'scrap' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-aurum-text">
                Scrap Gold & Jewellery Liquidation Requests
              </h4>
              <p className="text-xs text-aurum-text-muted">
                On-site XRF testing results and stone deduction entries for instant customer buybacks.
              </p>
            </div>
            <button
              onClick={loadScrapQueue}
              className="p-1.5 rounded-lg bg-aurum-card-bg border border-aurum-border text-aurum-text hover:text-aurum-gold"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {scrapQueue.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-aurum-card-bg/30 border border-aurum-border text-xs text-aurum-text-muted">
              No scrap jewellery liquidation requests currently pending.
            </div>
          ) : (
            <div className="space-y-3">
              {scrapQueue.map((req) => (
                <div
                  key={req.requestId}
                  className="p-4 rounded-2xl bg-aurum-card-bg/70 border border-aurum-border/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-aurum-gold">
                      {req.requestId}
                    </span>
                    <h5 className="text-sm font-bold text-aurum-text">
                      Customer: {req.customerName} ({req.customerPhone})
                    </h5>
                    <p className="text-xs text-aurum-text-muted">
                      Claimed: {req.claimedPurity} • Gross: {req.claimedGrossWeightGrams}g • Status:{' '}
                      <strong className="text-aurum-gold">{req.status}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedScrap(req);
                      setScrapActualPurity(req.claimedPurity);
                      setScrapActualGross(req.claimedGrossWeightGrams);
                      setScrapStoneDeduction(0);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light shrink-0"
                  >
                    Enter XRF Assay
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Scrap Appraisal Modal */}
          {selectedScrap && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl bg-aurum-midnight border border-aurum-gold/40 p-6 space-y-4">
                <h4 className="text-base font-bold text-aurum-text">
                  Enter XRF Spectrometer Assay Result
                </h4>
                <p className="text-xs text-aurum-text-muted">Request: {selectedScrap.requestId}</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                      Assayed Purity
                    </label>
                    <select
                      value={scrapActualPurity}
                      onChange={(e) => setScrapActualPurity(e.target.value as PurityGrade)}
                      className="w-full bg-aurum-card-bg border border-aurum-border rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value={PurityGrade.K24}>24K</option>
                      <option value={PurityGrade.K22}>22K</option>
                      <option value={PurityGrade.K21}>21K</option>
                      <option value={PurityGrade.K18}>18K</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                      Gross Scale Weight (g)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={scrapActualGross}
                      onChange={(e) => setScrapActualGross(Number(e.target.value))}
                      className="w-full bg-aurum-card-bg border border-aurum-border rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                      Stone / Wax Deduction (g)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={scrapStoneDeduction}
                      onChange={(e) => setScrapStoneDeduction(Number(e.target.value))}
                      className="w-full bg-aurum-card-bg border border-aurum-border rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                      Net Pure Gold Weight (g)
                    </label>
                    <div className="w-full bg-aurum-card-bg/50 border border-aurum-border rounded-xl p-2.5 text-xs font-mono font-bold text-emerald-400">
                      {Math.max(0, Number((scrapActualGross - scrapStoneDeduction).toFixed(3)))}g
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-aurum-border">
                  <button
                    onClick={() => setSelectedScrap(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-aurum-border text-aurum-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteScrapAppraisal}
                    disabled={isSubmittingScrap}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light"
                  >
                    Confirm Offer & Payout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          4. DESK HANDOVER & OTP SAFE
         ======================================================== */}
      {activeTab === 'handover' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-aurum-card-bg/70 border border-aurum-border/80 space-y-5">
          <div>
            <h4 className="text-base font-bold text-aurum-text">
              Physical Gold Handover & OTP Terminal
            </h4>
            <p className="text-xs text-aurum-text-muted mt-1">
              Verify customer secret OTP to complete physical handover and atomically release escrow payouts to the seller or close company vault order.
            </p>
          </div>

          {handoverError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{handoverError}</span>
            </div>
          )}

          {handoverResult && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Handover Verified & Escrow Released!</span>
              </div>
              <p>Order ID: {handoverResult.orderId}</p>
              <p>Fulfillment Status: {handoverResult.fulfillmentStatus}</p>
              <p>Payment Settlement: {handoverResult.paymentStatus}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                Depository Desk Location
              </label>
              <select
                value={handoverDeskId}
                onChange={(e) => setHandoverDeskId(e.target.value)}
                className="w-full bg-aurum-midnight border border-aurum-border rounded-xl p-2.5 text-xs text-white"
              >
                <option value="PKP-DHK-GULSHAN">Dhaka Central Vault Desk — Gulshan</option>
                <option value="PKP-DHK-MOTIJHEEL">Motijheel Financial Desk</option>
                <option value="PKP-CTG-AGRABAD">Chattogram Port City Depository</option>
                <option value="PKP-SYL-ZINDABAZAR">Sylhet Regional Depository</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                Order Reference (e.g. ORD-STR-... or ORD-MKT-...)
              </label>
              <input
                type="text"
                value={handoverOrderId}
                onChange={(e) => setHandoverOrderId(e.target.value)}
                placeholder="ORD-..."
                className="w-full bg-aurum-midnight border border-aurum-border rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-aurum-text-muted mb-1">
                Customer 6-Digit Handover OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={handoverOtp}
                onChange={(e) => setHandoverOtp(e.target.value)}
                placeholder="654321"
                className="w-full bg-aurum-midnight border border-aurum-border rounded-xl p-2.5 text-lg font-mono font-bold tracking-widest text-center text-aurum-gold"
              />
            </div>

            <button
              onClick={handleConfirmHandover}
              disabled={isVerifyingHandover}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold-dark text-aurum-midnight hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {isVerifyingHandover ? (
                <span>Verifying Depository Safe...</span>
              ) : (
                <>
                  <span>Verify OTP & Release Gold</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
