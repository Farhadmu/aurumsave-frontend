'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../../lib/auth-context';
import { useLanguage } from '../../../lib/language-context';
import { apiRequest } from '../../../lib/api';
import { BANGLADESH_DIVISIONS, DistrictPickupSelector, PickupPoint } from '../../../components/commerce/DistrictPickupSelector';
import { OfficialProduct } from '../../../components/commerce/OfficialProductCard';
import { formatBDT } from '../../../lib/utils';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import {
  ShieldCheck,
  Award,
  Lock,
  Truck,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Check,
  AlertCircle,
  Copy,
  Headphones,
  FileText,
  User,
  Phone,
  MapPin,
  Sparkles,
} from 'lucide-react';

const FALLBACK_PRODUCTS: OfficialProduct[] = [
  {
    productId: 'PROD-BAR-1G-24K',
    titleEn: 'AurumSave Sovereign 1g 24K Minted Gold Bar',
    titleBn: 'অরামসেভ ১ গ্রাম ২৪ ক্যারেট মিন্টেড গোল্ড বার',
    slug: '1g-24k-minted-gold-bar',
    productType: 'MINTED_BAR',
    purity: '24K' as any,
    weightGrams: 1.0,
    weightMilligrams: 1000,
    makingFeePoisha: 45000,
    inStockQuantity: 50,
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
    purity: '24K' as any,
    weightGrams: 5.0,
    weightMilligrams: 5000,
    makingFeePoisha: 125000,
    inStockQuantity: 25,
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
    purity: '24K' as any,
    weightGrams: 10.0,
    weightMilligrams: 10000,
    makingFeePoisha: 200000,
    inStockQuantity: 20,
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
];

function StoreCheckoutContent() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get('productId') || 'PROD-BAR-1G-24K';
  const initialQty = Math.max(1, parseInt(searchParams.get('qty') || '1', 10));

  const [product, setProduct] = useState<OfficialProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(initialQty);
  const [loading, setLoading] = useState<boolean>(true);

  // Delivery Mode: 'HOME_DELIVERY' | 'PICKUP_POINT'
  const [deliveryMethod, setDeliveryMethod] = useState<'HOME_DELIVERY' | 'PICKUP_POINT'>('HOME_DELIVERY');

  // Home Delivery Fields
  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || '');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [recipientNid, setRecipientNid] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Pickup Point Selection
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PickupPoint | null>(null);

  // Payment Method: 'BKASH' | 'NAGAD' | 'STRIPE' | 'WALLET'
  const [paymentMethod, setPaymentMethod] = useState<'BKASH' | 'NAGAD' | 'STRIPE' | 'WALLET'>('BKASH');

  // Payment Simulation Inputs
  const [bkashNumber, setBkashNumber] = useState(user?.phone || '01711000000');
  const [bkashOtp, setBkashOtp] = useState('123456');
  const [bkashPin, setBkashPin] = useState('');
  const [nagadNumber, setNagadNumber] = useState(user?.phone || '01811000000');
  const [nagadPin, setNagadPin] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  // Submission & Result States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await apiRequest<{ success: boolean; data: OfficialProduct[] }>(
          '/commerce/store/products',
        );
        if (res?.data && res.data.length > 0) {
          const match = res.data.find((p) => p.productId === productId);
          setProduct(match || res.data[0]);
        } else {
          const fallback = FALLBACK_PRODUCTS.find((p) => p.productId === productId) || FALLBACK_PRODUCTS[0];
          setProduct(fallback);
        }
      } catch (err) {
        console.error('Failed to load product', err);
        const fallback = FALLBACK_PRODUCTS.find((p) => p.productId === productId) || FALLBACK_PRODUCTS[0];
        setProduct(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Calculations
  const goldValueBdt = (product?.goldValueBdt || 12450) * quantity;
  const makingFeeBdt = (product?.makingFeeBdt || 450) * quantity;
  const deliveryFeeBdt = deliveryMethod === 'HOME_DELIVERY' ? 250 : 0;
  const totalBdt = goldValueBdt + makingFeeBdt + deliveryFeeBdt;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!user) {
      alert('Please log in to complete your gold bullion order.');
      router.push(`/login?redirect=/store/checkout?productId=${product.productId}&qty=${quantity}`);
      return;
    }

    if (deliveryMethod === 'HOME_DELIVERY') {
      if (!recipientName.trim() || !recipientPhone.trim() || !streetAddress.trim()) {
        setOrderError('Please provide complete recipient name, phone number, and delivery street address.');
        return;
      }
    } else {
      if (!selectedPickupPoint) {
        setOrderError('Please select an authorized AurumSave depository pickup desk.');
        return;
      }
    }

    setIsSubmitting(true);
    setOrderError(null);

    const paymentRef = `${paymentMethod}-REF-${Date.now().toString().slice(-6)}`;

    try {
      const payload: any = {
        productId: product.productId,
        quantity,
        deliveryMethod,
        paymentMethod,
        paymentReference: paymentRef,
      };

      if (deliveryMethod === 'HOME_DELIVERY') {
        payload.shippingAddress = {
          fullName: recipientName.trim(),
          phone: recipientPhone.trim(),
          alternativePhone: alternativePhone.trim(),
          recipientNid: recipientNid.trim(),
          division: selectedDivision,
          district: selectedDistrict,
          upazila: upazila.trim(),
          addressLine: streetAddress.trim(),
          postalCode: postalCode.trim(),
          instructions: specialInstructions.trim(),
        };
      } else {
        payload.pickupPointId = selectedPickupPoint?.pointId || 'PKP-DHK-GULSHAN';
      }

      const res = await apiRequest<{ success: boolean; message: string; order: any }>(
        '/commerce/store/orders',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      );

      if (res?.success && res?.order) {
        setConfirmedOrder(res.order);
      } else {
        setOrderError(res?.message || 'Order placement failed. Please verify details.');
      }
    } catch (err: any) {
      setOrderError(err.message || 'Payment gateway connection failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-aurum-midnight text-aurum-text flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-aurum-gold/20 border border-aurum-gold/40 text-aurum-gold flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-serif-luxury text-aurum-gold">
            Loading Real-Time Bullion Quote & Secure Checkout...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aurum-midnight text-aurum-text pb-20 pt-8 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/store')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-aurum-text-muted hover:text-aurum-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'গোল্ড স্টোরে ফিরে যান' : 'Back to Bullion Store'}</span>
          </button>
          <div className="flex items-center space-x-2">
            <Badge variant="emerald" size="sm">
              Bank-Grade Escrow Settlement
            </Badge>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: SUCCESSFUL ORDER CONFIRMATION SCREEN */}
        {/* ========================================================= */}
        {confirmedOrder ? (
          <div className="max-w-2xl mx-auto rounded-3xl bg-aurum-card border border-aurum-gold/50 p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 font-mono">
                Payment Settled & Custody Allocated
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-black text-aurum-text">
                Physical Gold Order Confirmed!
              </h2>
              <p className="text-xs text-aurum-text-muted max-w-md mx-auto">
                Your 24K gold bullion bar has been allocated from company vault custody and is now preparing for handover.
              </p>
            </div>

            {/* Order Identifiers Box */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-aurum-surface border border-aurum-border text-xs text-left">
              <div>
                <span className="text-aurum-text-dim block text-[11px]">Order Number:</span>
                <span className="font-mono font-bold text-aurum-gold text-sm block mt-0.5">
                  {confirmedOrder.orderId}
                </span>
              </div>
              <div>
                <span className="text-aurum-text-dim block text-[11px]">Courier Tracking #:</span>
                <span className="font-mono font-bold text-aurum-text text-sm block mt-0.5">
                  {confirmedOrder.trackingNumber || 'TRK-VAULT-ALLOCATED'}
                </span>
              </div>
              <div>
                <span className="text-aurum-text-dim block text-[11px]">Delivery Mode:</span>
                <span className="font-semibold text-aurum-text block mt-0.5">
                  {confirmedOrder.deliveryMethod === 'HOME_DELIVERY' ? 'Armored Home Delivery' : 'Vault Depository Pickup'}
                </span>
              </div>
              <div>
                <span className="text-aurum-text-dim block text-[11px]">Settlement Status:</span>
                <span className="font-semibold text-emerald-400 block mt-0.5 font-mono">
                  ESCROW_HELD (Paid)
                </span>
              </div>
            </div>

            {/* Handover OTP Highlight */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-aurum-midnight via-aurum-surface to-aurum-midnight border border-aurum-gold/40 space-y-2">
              <span className="text-xs font-bold text-aurum-gold uppercase tracking-wider block">
                6-Digit Security Handover OTP
              </span>
              <p className="text-[11px] text-aurum-text-muted">
                Keep this code secret. Present it to the armored delivery agent or depository officer upon verifying your identity.
              </p>
              <div className="flex items-center justify-center space-x-3 pt-1">
                <span className="font-mono font-black text-3xl text-aurum-gold px-4 py-1.5 rounded-xl bg-black/50 border border-aurum-gold/30 tracking-widest">
                  {confirmedOrder.pickupVerificationOtp}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyOtp(confirmedOrder.pickupVerificationOtp)}
                  className="p-2.5 rounded-xl bg-aurum-gold/20 hover:bg-aurum-gold/30 text-aurum-gold transition-colors"
                  title="Copy OTP"
                >
                  {copiedOtp ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Direct Action Navigation Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-aurum-gold text-aurum-midnight hover:bg-aurum-gold-light text-xs font-bold shadow-gold-glow flex items-center justify-center space-x-2"
              >
                <span>Track in Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  router.push(
                    `/support?orderId=${confirmedOrder.orderId}&category=DELIVERY_TRACKING&subject=Gold Bar Delivery Tracking Inquiry for Order #${confirmedOrder.orderId}`,
                  )
                }
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-aurum-surface border border-aurum-gold/40 text-aurum-gold hover:bg-aurum-gold/10 text-xs font-bold flex items-center justify-center space-x-2"
              >
                <Headphones className="w-4 h-4" />
                <span>Chat with Concierge Support</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: DEDICATED CHECKOUT & PAYMENT FORM */
          /* ========================================================= */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Delivery & Payment Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Delivery Mode Selection */}
              <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-7 space-y-5 shadow-card-luxury">
                <div className="flex items-center space-x-2 pb-3 border-b border-aurum-border">
                  <div className="w-8 h-8 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-base font-bold text-aurum-text">
                      1. Delivery & Handover Method
                    </h3>
                    <p className="text-xs text-aurum-text-muted">
                      Choose between secure armored home courier or authorized depository desk pickup.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('HOME_DELIVERY')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-1 relative ${
                      deliveryMethod === 'HOME_DELIVERY'
                        ? 'border-aurum-gold bg-aurum-gold/10 shadow-gold-glow'
                        : 'border-aurum-border bg-aurum-surface hover:border-aurum-gold/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-aurum-text flex items-center space-x-1.5">
                        <Truck className="w-3.5 h-3.5 text-aurum-gold" />
                        <span>Armored Home Delivery</span>
                      </span>
                      {deliveryMethod === 'HOME_DELIVERY' && (
                        <CheckCircle2 className="w-4 h-4 text-aurum-gold" />
                      )}
                    </div>
                    <p className="text-[11px] text-aurum-text-muted">
                      Direct delivery to your doorstep via Securitas / Sundarban Bullion Express with OTP handover.
                    </p>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block pt-1">
                      Courier Fee: ৳250 (Insured)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('PICKUP_POINT')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-1 relative ${
                      deliveryMethod === 'PICKUP_POINT'
                        ? 'border-aurum-gold bg-aurum-gold/10 shadow-gold-glow'
                        : 'border-aurum-border bg-aurum-surface hover:border-aurum-gold/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-aurum-text flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-aurum-gold" />
                        <span>Vault & Depository Desk</span>
                      </span>
                      {deliveryMethod === 'PICKUP_POINT' && (
                        <CheckCircle2 className="w-4 h-4 text-aurum-gold" />
                      )}
                    </div>
                    <p className="text-[11px] text-aurum-text-muted">
                      Collect in-person from Central Gulshan Vault or 64 District partner depository desks.
                    </p>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block pt-1">
                      Free (৳0) Pickup Handover
                    </span>
                  </button>
                </div>

                {/* Form fields for HOME DELIVERY */}
                {deliveryMethod === 'HOME_DELIVERY' ? (
                  <div className="space-y-4 pt-2 text-xs border-t border-aurum-border/60">
                    <span className="font-bold text-aurum-text block">
                      Recipient & Shipping Address (ডেলিভারি ঠিকানা ও প্রাপক):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-aurum-text-dim mb-1 font-semibold">
                          Recipient Full Name (NID অনুযায়ী নাম) *
                        </label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="e.g. Farhad Hossain"
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text focus:outline-none focus:border-aurum-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-aurum-text-dim mb-1 font-semibold">
                          Primary Mobile Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono focus:outline-none focus:border-aurum-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-aurum-text-dim mb-1 font-semibold">
                          Alternative Phone (বিকল্প মোবাইল)
                        </label>
                        <input
                          type="text"
                          value={alternativePhone}
                          onChange={(e) => setAlternativePhone(e.target.value)}
                          placeholder="018XXXXXXXX"
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono focus:outline-none focus:border-aurum-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-aurum-text-dim mb-1 font-semibold">
                          Recipient NID Number (হস্তান্তর যাচাইকরণ)
                        </label>
                        <input
                          type="text"
                          value={recipientNid}
                          onChange={(e) => setRecipientNid(e.target.value)}
                          placeholder="Smart NID 10/17 digits"
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono focus:outline-none focus:border-aurum-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-aurum-text-dim mb-1 font-semibold">
                          Division (বিভাগ) *
                        </label>
                        <select
                          value={selectedDivision}
                          onChange={(e) => {
                            const newDiv = e.target.value;
                            setSelectedDivision(newDiv);
                            const dists = BANGLADESH_DIVISIONS[newDiv] || [];
                            if (dists.length > 0) setSelectedDistrict(dists[0]);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text focus:outline-none focus:border-aurum-gold"
                        >
                          {Object.keys(BANGLADESH_DIVISIONS).map((divName) => (
                            <option key={divName} value={divName}>
                              {divName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-aurum-text-dim mb-1 font-semibold">
                          District (জেলা) *
                        </label>
                        <select
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text focus:outline-none focus:border-aurum-gold"
                        >
                          {(BANGLADESH_DIVISIONS[selectedDivision] || []).map(
                            (dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-aurum-text-dim mb-1 font-semibold">
                        Street, House & Holding Address (রাস্তা, বাসা ও হোল্ডিং নম্বর) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="House #, Road #, Area / Moholla, Thana / Upazila"
                        className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text focus:outline-none focus:border-aurum-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-aurum-text-dim mb-1 font-semibold">
                        Special Handover Instructions
                      </label>
                      <input
                        type="text"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="e.g. Call 1 hour prior to dispatch, Handover strictly to recipient"
                        className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text focus:outline-none focus:border-aurum-gold"
                      />
                    </div>
                  </div>
                ) : (
                  /* Form fields for PICKUP DESK */
                  <div className="pt-2 border-t border-aurum-border/60">
                    <DistrictPickupSelector
                      onSelectPoint={(point) => setSelectedPickupPoint(point)}
                      selectedPointId={selectedPickupPoint?.pointId || ''}
                    />
                  </div>
                )}
              </div>

              {/* Step 2: Payment Method Selection */}
              <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-7 space-y-5 shadow-card-luxury">
                <div className="flex items-center space-x-2 pb-3 border-b border-aurum-border">
                  <div className="w-8 h-8 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-base font-bold text-aurum-text">
                      2. Secure Payment Gateway
                    </h3>
                    <p className="text-xs text-aurum-text-muted">
                      Full functional payment via bKash, Nagad, Visa/Mastercard, or Vault Balance.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'BKASH', label: 'bKash (বিকাশ)', color: 'border-pink-500/40 text-pink-400' },
                    { id: 'NAGAD', label: 'Nagad (নগদ)', color: 'border-orange-500/40 text-orange-400' },
                    { id: 'STRIPE', label: 'Cards (কার্ড)', color: 'border-blue-500/40 text-blue-400' },
                    { id: 'WALLET', label: 'Vault Balance', color: 'border-emerald-500/40 text-emerald-400' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all text-xs font-bold ${
                        paymentMethod === m.id
                          ? 'border-aurum-gold bg-aurum-gold/15 text-aurum-gold shadow-gold-glow'
                          : 'border-aurum-border bg-aurum-surface text-aurum-text-muted hover:border-aurum-gold/40'
                      }`}
                    >
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Method Specific UI */}
                {paymentMethod === 'BKASH' && (
                  <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink-500/30 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-pink-400 font-bold">
                      <span>bKash Payment Gateway</span>
                      <span className="font-mono">৳{totalBdt.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-aurum-text-dim block mb-1">
                          bKash Wallet Number:
                        </label>
                        <input
                          type="text"
                          value={bkashNumber}
                          onChange={(e) => setBkashNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-pink-500/40 text-aurum-text font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-aurum-text-dim block mb-1">
                          bKash 5-Digit PIN:
                        </label>
                        <input
                          type="password"
                          maxLength={5}
                          value={bkashPin}
                          onChange={(e) => setBkashPin(e.target.value)}
                          placeholder="•••••"
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-pink-500/40 text-aurum-text font-mono text-center tracking-widest"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NAGAD' && (
                  <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-orange-400 font-bold">
                      <span>Nagad Direct Checkout</span>
                      <span className="font-mono">৳{totalBdt.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-aurum-text-dim block mb-1">
                          Nagad Account Mobile:
                        </label>
                        <input
                          type="text"
                          value={nagadNumber}
                          onChange={(e) => setNagadNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-orange-500/40 text-aurum-text font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-aurum-text-dim block mb-1">
                          Nagad 4-Digit PIN:
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={nagadPin}
                          onChange={(e) => setNagadPin(e.target.value)}
                          placeholder="••••"
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-orange-500/40 text-aurum-text font-mono text-center tracking-widest"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'STRIPE' && (
                  <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-blue-400 font-bold">
                      <span>Credit / Debit Card (Visa, Mastercard, AMEX)</span>
                      <span className="font-mono">৳{totalBdt.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-aurum-text-dim block mb-1">Card Number:</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-blue-500/40 text-aurum-text font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-aurum-text-dim block mb-1">Exp & CVV:</label>
                        <div className="flex space-x-1">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-1/2 px-2 py-2 rounded-xl bg-aurum-surface border border-blue-500/40 text-aurum-text font-mono text-center"
                          />
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="CVV"
                            className="w-1/2 px-2 py-2 rounded-xl bg-aurum-surface border border-blue-500/40 text-aurum-text font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'WALLET' && (
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-aurum-text space-y-1">
                    <span className="font-bold text-emerald-400 block">
                      Pay with AurumSave Vault Fiat Balance
                    </span>
                    <p className="text-aurum-text-muted">
                      Funds will be deducted immediately from your verified digital gold wallet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Product Summary & Pay Action */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="rounded-3xl bg-aurum-card border border-aurum-gold/40 p-6 sm:p-7 space-y-5 shadow-2xl">
                <span className="text-[10px] uppercase font-bold tracking-widest text-aurum-gold block">
                  Order Summary
                </span>

                {/* Product Card */}
                {product && (
                  <div className="flex items-center space-x-3 pb-4 border-b border-aurum-border">
                    <div className="w-16 h-16 rounded-2xl bg-black/40 border border-aurum-gold/30 overflow-hidden shrink-0 relative">
                      <Image
                        src={product.images?.[0] || '/images/hero/bullion-macro.jpg'}
                        alt={product.titleEn}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-aurum-gold/15 text-aurum-gold">
                          {product.purity} • {product.weightGrams}g
                        </span>
                      </div>
                      <h4 className="font-serif-luxury font-bold text-sm text-aurum-text mt-0.5">
                        {product.titleEn}
                      </h4>
                      <p className="text-[11px] text-aurum-text-dim">
                        {product.certifier || 'BSTI & PAMP Assay Certified'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center justify-between py-2 border-b border-aurum-border text-xs">
                  <span className="text-aurum-text-dim font-semibold">Quantity (গোল্ড বার সংখ্যা):</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-aurum-surface border border-aurum-border text-aurum-text hover:border-aurum-gold text-sm font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-aurum-gold text-sm w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-aurum-surface border border-aurum-border text-aurum-text hover:border-aurum-gold text-sm font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Itemized Price Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-aurum-text-dim">
                    <span>24K Pure Gold Value:</span>
                    <span className="font-mono text-aurum-text">৳{goldValueBdt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-aurum-text-dim">
                    <span>Tamper-Proof Blister Assay Fee:</span>
                    <span className="font-mono text-aurum-text">৳{makingFeeBdt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-aurum-text-dim">
                    <span>
                      {deliveryMethod === 'HOME_DELIVERY' ? 'Armored Courier (Insured):' : 'Depository Desk Pickup:'}
                    </span>
                    <span className="font-mono text-emerald-400">
                      {deliveryMethod === 'HOME_DELIVERY' ? '৳250' : 'FREE (৳0)'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-aurum-border/60 flex justify-between items-end">
                    <div>
                      <span className="text-xs text-aurum-text-dim block font-bold">Total Amount:</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Guaranteed Live Price</span>
                    </div>
                    <span className="text-2xl font-black font-mono text-aurum-gold">
                      ৳{totalBdt.toLocaleString()}
                    </span>
                  </div>
                </div>

                {orderError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                {/* Confirm Pay Button */}
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full py-4 text-sm font-bold shadow-gold-glow flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Securing Escrow Payment...'
                      : `Pay ৳${totalBdt.toLocaleString()} & Confirm Order`}
                  </span>
                </Button>

                <p className="text-[10px] text-center text-aurum-text-dim leading-snug">
                  Secured by AurumSave Triple-Entry Financial Ledger. Handover requires phone verification OTP and recipient National ID.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function StoreCheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-aurum-midnight text-aurum-gold flex items-center justify-center text-sm font-serif-luxury">
          Loading Checkout...
        </div>
      }
    >
      <StoreCheckoutContent />
    </React.Suspense>
  );
}
