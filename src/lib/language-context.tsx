'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  toLocalizedDigits: (input: string | number) => string;
  formatLocalizedBDT: (amount?: number | null, fromPoisha?: boolean) => string;
  formatLocalizedGold: (grams?: number | null, includeBhori?: boolean) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Global
    'nav.trade': 'Trade Desk',
    'nav.dashboard': 'Vault Portfolio',
    'nav.goals': 'Savings Goals',
    'nav.security': 'Security Center',
    'nav.academy': 'Gold Academy',
    'nav.support': 'Support & Disputes',
    'nav.staff': 'Staff Console',
    'nav.login': 'Sign In',
    'nav.register': 'Open Account',
    'nav.logout': 'Sign Out',
    'nav.switchRole': 'Role Switcher',

    // Hero & Trading
    'hero.badge': 'BANGLADESH SOVEREIGN DIGITAL GOLD STANDARD',
    'hero.title': 'Physical 24K Gold Savings for Every Citizen',
    'hero.subtitle': 'Preserve generational wealth with micro-gold savings from ৳500. Direct benchmark pricing, bank-insured segregated custody, and instant liquidity via bKash, Nagad & Rocket.',
    'trade.buy': 'Buy Gold',
    'trade.sell': 'Sell Gold',
    'trade.rate24k': '24K 99.9% Benchmark Rate',
    'trade.rate22k': '22K 91.6% Benchmark Rate',
    'trade.spread': 'Transparent Spread',
    'trade.live': 'LIVE BENCHMARK',
    'trade.amountInput': 'Amount in BDT (৳)',
    'trade.weightInput': 'Weight in Grams (g)',
    'trade.quoteExpiry': 'Quote Valid For',
    'trade.executeBuy': 'Confirm & Proceed to Payment',
    'trade.executeSell': 'Confirm & Liquidate to Account',
    
    // Portfolio & Dashboard
    'vault.totalBalance': 'Total Gold Holding',
    'vault.indicativeValue': 'Indicative Portfolio Value',
    'vault.unrealizedGain': 'Unrealized Gain / Loss',
    'vault.activeGoals': 'Active Savings Goals',
    'vault.recentTransactions': 'Authoritative Ledger Events',
    'vault.downloadPassport': 'Download Gold Passport (PDF)',
    'vault.statement': 'Audited Statement',

    // Goals
    'goals.title': 'Smart Gold Savings Goals',
    'goals.subtitle': 'Set disciplined targets for weddings, education, Hajj, or family security. Track physical gold weight with live valuation.',
    'goals.create': 'Create New Goal',
    'goals.target': 'Target',
    'goals.saved': 'Accumulated',
    'goals.remaining': 'Remaining',
    'goals.calculator': 'Gold Savings Calculator',
    'goals.calculatePlan': 'Calculate Monthly Plan',

    // Security
    'security.title': 'Personal Security Center',
    'security.subtitle': 'Zero-trust account monitoring, cryptographic session telemetry, and customer-controlled emergency lockdown.',
    'security.status': 'Account Protection Status',
    'security.activeSession': 'Active Client Session',
    'security.emergencyFreeze': 'Emergency Account Freeze',
    'security.freezeNotice': 'Suspect unauthorized access? Immediately lock trading and withdrawals with one tap.',

    // Academy
    'academy.title': 'Gold Learning Academy',
    'academy.subtitle': 'Master gold purity, hallmarking, unit conversions, and fintech security with interactive bilingual modules.',
  },
  bn: {
    // Navigation & Global
    'nav.trade': 'ট্রেড ডেস্ক',
    'nav.dashboard': 'ভল্ট পোর্টফোলিও',
    'nav.goals': 'সঞ্চয় লক্ষ্য (গোলস)',
    'nav.security': 'নিরাপত্তা কেন্দ্র',
    'nav.academy': 'স্বর্ণ একাডেমি',
    'nav.support': 'সাপোর্ট ও বিরোধ নিষ্পত্তি',
    'nav.staff': 'অফিসিয়াল কনসোল',
    'nav.login': 'লগইন করুন',
    'nav.register': 'অ্যাকাউন্ট খুলুন',
    'nav.logout': 'লগআউট',
    'nav.switchRole': 'রোল পরিবর্তন',

    // Hero & Trading
    'hero.badge': 'বাংলাদেশের প্রথম সার্বভৌম ডিজিটাল গোল্ড প্ল্যাটফর্ম',
    'hero.title': 'প্রতিটি নাগরিকের জন্য আসল ২৪ ক্যারেট স্বর্ণ সঞ্চয়',
    'hero.subtitle': 'মাত্র ৫০০ টাকা থেকে শুরু করুন খাঁটি স্বর্ণের সঞ্চয়। বাজুস অনুমোদিত স্বচ্ছ রেট, ব্যাংক-বীমাকৃত ভল্ট হেফাজত এবং বিকাশ ও নগদের মাধ্যমে তাৎক্ষণিক ক্যাশআউট।',
    'trade.buy': 'স্বর্ণ কিনুন',
    'trade.sell': 'স্বর্ণ বিক্রি করুন',
    'trade.rate24k': '২৪ ক্যারেট ৯৯.৯% লাইভ রেট',
    'trade.rate22k': '২২ ক্যারেট ৯১.৬% লাইভ রেট',
    'trade.spread': 'স্বচ্ছ স্প্রেড',
    'trade.live': 'লাইভ বাজার দর',
    'trade.amountInput': 'টাকার পরিমাণ (৳)',
    'trade.weightInput': 'স্বর্ণের ওজন গ্রামে (g)',
    'trade.quoteExpiry': 'দর বহাল থাকবে',
    'trade.executeBuy': 'নিশ্চিত করুন ও পেমেন্টে যান',
    'trade.executeSell': 'বিক্রি নিশ্চিত করুন',

    // Portfolio & Dashboard
    'vault.totalBalance': 'মোট স্বর্ণ সঞ্চয়',
    'vault.indicativeValue': 'বর্তমান আনুমানিক মূল্য',
    'vault.unrealizedGain': 'অর্জিত লাভ / ক্ষতি',
    'vault.activeGoals': 'সক্রিয় সঞ্চয় লক্ষ্য',
    'vault.recentTransactions': 'প্রমাণিত লেজার হিস্ট্রি',
    'vault.downloadPassport': 'গোল্ড পাসপোর্ট ডাউনলোড (PDF)',
    'vault.statement': 'অডিটেড স্টেটমেন্ট',

    // Goals
    'goals.title': 'স্মার্ট গোল্ড সঞ্চয় লক্ষ্য',
    'goals.subtitle': 'বিবাহ, সন্তানের উচ্চশিক্ষা, হজ্ব বা পারিবারিক ভবিষ্যতের জন্য সুনির্দিষ্ট স্বর্ণ সঞ্চয়ের লক্ষ্য নির্ধারণ করুন।',
    'goals.create': 'নতুন লক্ষ্য তৈরি করুন',
    'goals.target': 'লক্ষ্যমাত্রা',
    'goals.saved': 'জমা হয়েছে',
    'goals.remaining': 'বাকি আছে',
    'goals.calculator': 'স্বর্ণ সঞ্চয় ক্যালকুলেটর',
    'goals.calculatePlan': 'মাসিক সঞ্চয় পরিকল্পনা দেখুন',

    // Security
    'security.title': 'ব্যক্তিগত নিরাপত্তা কেন্দ্র',
    'security.subtitle': 'জিরো-ট্রাস্ট অ্যাকাউন্ট পর্যবেক্ষণ, ক্রিপ্টোগ্রাফিক সেশন ট্র্যাকিং এবং তাৎক্ষণিক ইমার্জেন্সি অ্যাকাউন্ট লকডাউন।',
    'security.status': 'অ্যাকাউন্ট সুরক্ষা স্ট্যাটাস',
    'security.activeSession': 'বর্তমান সক্রিয় সেশন',
    'security.emergencyFreeze': 'ইমার্জেন্সি অ্যাকাউন্ট ফ্রিজ',
    'security.freezeNotice': 'অ্যাকাউন্টে কোনো সন্দেহজনক কার্যকলাপ লক্ষ্য করলে সাথে সাথে সমস্ত লেনদেন ও উত্তোলন স্থগিত করুন।',

    // Academy
    'academy.title': 'স্বর্ণ লার্নিং একাডেমি',
    'academy.subtitle': 'স্বর্ণের বিশুদ্ধতা, হলমার্কিং, ভরি-গ্রাম রূপান্তর এবং আর্থিক নিরাপত্তা জানুন বাংলায়।',
  },
};

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

function convertToBengaliDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (w) => BENGALI_DIGITS[+w]);
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn'); // Bangladesh-first default: Bangla!

  useEffect(() => {
    const saved = localStorage.getItem('aurumsave_language') as Language;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aurumsave_language', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const toLocalizedDigits = (input: string | number): string => {
    if (language === 'bn') {
      return convertToBengaliDigits(input);
    }
    return String(input);
  };

  const formatLocalizedBDT = (amount?: number | null, fromPoisha = false): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return language === 'bn' ? '৳ ০' : '৳0';
    }
    const val = fromPoisha ? amount / 100 : amount;
    const formatted = Math.round(val).toLocaleString('en-US');

    if (language === 'bn') {
      return `৳ ${convertToBengaliDigits(formatted)}`;
    }
    return `৳${formatted}`;
  };

  const formatLocalizedGold = (grams?: number | null, includeBhori = false): string => {
    const safeGrams = typeof grams === 'number' && !isNaN(grams) ? grams : 0;
    const formattedNum = safeGrams.toFixed(4);

    if (language === 'bn') {
      const bnGrams = `${convertToBengaliDigits(formattedNum)} গ্রাম`;
      if (includeBhori && safeGrams >= 1) {
        const bhori = convertToBengaliDigits((safeGrams / 11.664).toFixed(3));
        return `${bnGrams} (${bhori} ভরি)`;
      }
      return bnGrams;
    }

    const enGrams = `${formattedNum} g`;
    if (includeBhori && safeGrams >= 1) {
      const bhori = (safeGrams / 11.664).toFixed(3);
      return `${enGrams} (${bhori} Bhori)`;
    }
    return enGrams;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        toLocalizedDigits,
        formatLocalizedBDT,
        formatLocalizedGold,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
