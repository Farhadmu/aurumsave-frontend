'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  toLocalizedDigits: (input: string | number) => string;
  formatLocalizedBDT: (amount?: number | null, fromPoisha?: boolean) => string;
  formatLocalizedGold: (grams?: number | null, includeBhori?: boolean) => string;
  formatLocalizedDateTime: (isoString?: string | null) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common & Actions
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.loading': 'Processing...',
    'common.active': 'Active',
    'common.suspended': 'Suspended',
    'common.completed': 'Completed',
    'common.pending': 'Pending Review',
    'common.failed': 'Failed',
    'common.success': 'Success',
    'common.search': 'Search...',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.download': 'Download',
    'common.print': 'Print Statement',
    'common.back': 'Back',
    'common.verified': 'Verified',
    'common.save': 'Save Changes',
    'common.close': 'Close',

    // Navigation
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
    'nav.vaultProof': 'Vault Custody',
    'nav.calculator': 'Calculator',
    'nav.faq': 'FAQ',

    // Hero Section
    'hero.badge': 'BANGLADESH SOVEREIGN DIGITAL GOLD STANDARD',
    'hero.title': 'Physical 24K Gold Savings for Every Citizen',
    'hero.subtitle': 'Preserve generational wealth with micro-gold savings from ৳500. Direct benchmark pricing, bank-insured segregated custody, and instant liquidity via bKash, Nagad & Rocket.',
    'hero.cta.start': 'Open Free Vault Account',
    'hero.cta.calculate': 'Explore Savings Calculator',
    'hero.liveBajusBadge': 'Live BAJUS Benchmark',
    'hero.stats.vaultGrams': 'Grams In Custody',
    'hero.stats.accuracy': 'Double-Entry Invariant',
    'hero.stats.backing': 'Physically Allocated',
    'hero.stats.storageFee': 'Free Vault Storage',

    // Home Features & Comparison
    'features.purity.title': '100% 24K Allocated Bullion',
    'features.purity.desc': 'Every milligram is backed by physical 24K (99.9%) or 22K (91.6%) gold bullion stored in Class-III bank-grade vaults.',
    'features.liquidity.title': 'Instant MFS Liquidation',
    'features.liquidity.desc': 'Liquidate gold back to Bangladeshi Taka anytime 24/7 with instant direct payout to your bKash or Nagad wallet.',
    'features.spread.title': 'Zero Hidden Cutting Charges',
    'features.spread.desc': 'Transparent 2.0% - 2.5% market spread with no arbitrary retail deductions or craftsmanship fees.',
    'features.delivery.title': 'Physical Bullion Redemption',
    'features.delivery.desc': 'Collect certified gold bars and minted coins starting from 1 Bhori (11.664g) with tamper-proof assay packaging.',

    // FAQ Section
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Clear, transparent answers on physical vault backing, pricing, liquidity, and regulatory compliance.',
    'faq.q1': 'Is digital gold on AurumSave backed by actual physical bullion?',
    'faq.a1': 'Yes, 100% physically backed and segregated. For every milligram of digital gold purchased through AurumSave, an equivalent amount of physical 24K (99.9% fineness) or 22K (91.6% hallmarked) bullion is purchased from BAJUS certified refiners and allocated in high-security, insured bank-grade vaults. It is not a synthetic derivative or paper promise.',
    'faq.q2': 'What is the minimum amount required to start saving in gold?',
    'faq.a2': 'You can start saving with as little as ৳500 or 0.1 grams of gold. Our mission is to make generational wealth preservation accessible to every household across Bangladesh through fractional gold accumulation with zero integer-rounding drift.',
    'faq.q3': 'How does AurumSave determine its gold buy and sell benchmark rates?',
    'faq.a3': 'Our benchmark rates are directly synchronized with the official daily rates published by the Bangladesh Jewellers Association (BAJUS). A transparent spread of 2.0% - 2.5% covers assaying, certified tamper-proof custody, bullion insurance, and instant liquidity operations. There are zero hidden making charges.',
    'faq.q4': 'Can I redeem and withdraw physical gold bars or coins?',
    'faq.a4': 'Yes. Once your cumulative vault balance reaches 1 Bhori (11.664 grams) or standard denominations (10g, 1 Bhori, 50g, 100g), you can request physical bullion collection or insured secure armored transit delivery across Bangladesh, complete with an individual assay authenticity certificate.',
    'faq.q5': 'How quickly can I liquidate my gold holdings into cash?',
    'faq.a5': 'Liquidation is instantaneous. When you sell gold from your vault, funds are immediately credited in Bangladeshi Taka to your Aurum wallet and can be withdrawn directly to your bKash, Nagad, Rocket, or commercial bank account 24/7.',
    'faq.q6': 'Why is National ID (NID) verification mandatory?',
    'faq.a6': 'In strict compliance with Bangladesh Financial Intelligence Unit (BFIU) guidelines and Anti-Money Laundering (AML/CFT) regulations, identity verification via Smart NID or Passport is required to ensure non-repudiation and protect your physical bullion property rights.',

    // Trade Desk
    'trade.buy': 'Buy Gold',
    'trade.sell': 'Liquidate into Taka',
    'trade.rate24k': '24K 99.9% Benchmark Rate',
    'trade.rate22k': '22K 91.6% Benchmark Rate',
    'trade.spread': 'Transparent Spread',
    'trade.live': 'LIVE BENCHMARK',
    'trade.amountInput': 'Amount in BDT (৳)',
    'trade.weightInput': 'Weight in Grams (g)',
    'trade.quoteExpiry': 'Rate Lock Valid For',
    'trade.executeBuy': 'Confirm & Proceed to Payment',
    'trade.executeSell': 'Confirm & Liquidate to Account',
    'trade.puritySelect': 'Purity Standard',
    'trade.rateLockNotice': '5-minute guaranteed rate lock prevents slippage while completing payment.',
    'trade.breakdown.title': 'Authoritative Transaction Breakdown',
    'trade.breakdown.benchmark': 'Benchmark Rate / Gram',
    'trade.breakdown.goldWeight': 'Physical Gold Weight',
    'trade.breakdown.pureMetal': 'Net Pure Gold Value',
    'trade.breakdown.platformFee': 'Platform Settlement Fee (0.5%)',
    'trade.breakdown.vaultCustody': 'Bank Vault Storage & Insurance',
    'trade.breakdown.totalPayable': 'Total Payable Amount',
    'trade.paymentMethod': 'Select Payment Provider',
    'trade.payoutAccount': 'Payout Wallet Number',
    'trade.payoutPrompt': 'Enter your personal verified bKash or Nagad wallet number for instant payout.',

    // Portfolio & Dashboard
    'vault.totalBalance': 'Total Gold Holding',
    'vault.indicativeValue': 'Indicative Portfolio Value',
    'vault.unrealizedGain': 'Unrealized Gain / Loss',
    'vault.activeGoals': 'Active Savings Goals',
    'vault.recentTransactions': 'Authoritative Ledger Events',
    'vault.downloadPassport': 'Download Gold Passport (PDF)',
    'vault.statement': 'Audited Statement',
    'vault.delivery': 'Physical Delivery',
    'vault.deliveryNotice': 'Deliveries require approved BFIU KYC and minimum 1 Bhori cumulative balance.',
    'vault.orders.id': 'Order Ref',
    'vault.orders.type': 'Type',
    'vault.orders.weight': 'Allocated Weight',
    'vault.orders.total': 'Total BDT',
    'vault.orders.status': 'Settlement Status',
    'vault.orders.date': 'Timestamp',

    // Goals
    'goals.title': 'Smart Gold Savings Goals',
    'goals.subtitle': 'Set disciplined targets for weddings, education, Hajj, or family security. Track physical gold weight with live valuation.',
    'goals.create': 'Create New Goal',
    'goals.target': 'Target',
    'goals.saved': 'Accumulated',
    'goals.remaining': 'Remaining',
    'goals.calculator': 'Gold Savings Calculator',
    'goals.calculatePlan': 'Calculate Monthly Plan',
    'goals.category.marriage': 'Wedding Gold',
    'goals.category.education': 'Higher Education',
    'goals.category.family': 'Family Reserve',
    'goals.category.hajj': 'Hajj Savings',
    'goals.category.emergency': 'Emergency Reserve',
    'goals.category.custom': 'Custom Target',
    'goals.allocateAction': 'Allocate Gold to Goal',

    // Security
    'security.title': 'Personal Security Center',
    'security.subtitle': 'Zero-trust account monitoring, cryptographic session telemetry, and customer-controlled emergency lockdown.',
    'security.status': 'Account Protection Status',
    'security.activeSession': 'Active Client Session',
    'security.emergencyFreeze': 'Emergency Account Freeze',
    'security.freezeNotice': 'Suspect unauthorized access? Immediately lock trading and withdrawals with one tap.',
    'security.restoreAccess': 'Restore & Unfreeze Account',
    'security.ip': 'IP Address',
    'security.device': 'Device',
    'security.encryption': 'Transport Encryption',

    // Academy
    'academy.title': 'Gold Learning Academy',
    'academy.subtitle': 'Master gold purity, hallmarking, unit conversions, and fintech security with interactive bilingual modules.',
    'academy.converter': 'Bullion Unit Converter',
    'academy.quiz': 'Gold Knowledge Check',
    'academy.submitQuiz': 'Submit Answers',

    // Support
    'support.title': 'Customer Support & Dispute Center',
    'support.subtitle': 'Authoritative resolution desk for order discrepancies, payment verifications, and account security.',
    'support.createTicket': 'Open Support Ticket',
    'support.category': 'Category',
    'support.subject': 'Subject',
    'support.description': 'Describe your inquiry or transaction issue...',
    'support.priority': 'Priority',

    // KYC
    'kyc.title': 'BFIU Identity Verification (KYC)',
    'kyc.subtitle': 'Upload your government-issued Smart NID or Passport to unlock physical deliveries and elevated thresholds.',
    'kyc.docType': 'Document Type',
    'kyc.docNumber': 'Document / NID Number',
    'kyc.front': 'Front Image (Clear Photo)',
    'kyc.back': 'Back Image',
    'kyc.status.approved': 'Verification Approved',
    'kyc.status.pending': 'Under Compliance Review',
    'kyc.status.rejected': 'Requires Resubmission',

    // Staff Workspaces
    'staff.admin.title': 'Executive Command Center',
    'staff.admin.subtitle': 'Platform governance, vault reserve liquidity ratios, and emergency platform kill switches.',
    'staff.compliance.title': 'KYC & AML Compliance Workspace',
    'staff.compliance.subtitle': 'BFIU identity verification queue, risk flagging, and document audit.',
    'staff.operations.title': 'Finance & Treasury Operations Desk',
    'staff.operations.subtitle': 'Payment gateway reconciliation, double-entry ledger audits, and refund approvals.',
    'staff.support.title': 'Concierge Support Console',
    'staff.support.subtitle': 'Customer issue management, ticket escalations, and resolution audit trails.',
    'staff.auditor.title': 'Independent Auditor Portal',
    'staff.auditor.subtitle': 'Read-only immutable audit trail verification and cryptographic SHA-256 chain inspection.',

    // Register
    'register.title': 'Open Your Gold Vault',
    'register.subtitle': 'Start saving in 24K and 22K allocated gold bullion. Real physical custody.',
    'register.fullName': 'Full Legal Name',
    'register.email': 'Email Address',
    'register.phone': 'Mobile Number (MFS)',
    'register.password': 'Vault Password',
    'register.confirmPassword': 'Confirm Password',
    'register.strength': 'Password Security:',
    'register.strengthWeak': 'Weak',
    'register.strengthModerate': 'Moderate',
    'register.strengthStrong': 'Institutional-Grade',
    'register.complianceTitle': 'Zero Account Opening Fees • BAJUS Benchmark Rates',
    'register.complianceTerms': "By creating a vault account, you agree to AurumSave's allocated custody terms and Bangladesh Bank AML/KYC guidelines.",
    'register.submit': 'Create Sovereign Gold Vault',
    'register.alreadyHave': 'Already have a bullion account?',
    'register.signIn': 'Sign In to Vault',
    'register.errPasswordMismatch': 'Vault passwords do not match. Please verify both inputs.',
    'register.errPasswordShort': 'Password must be at least 8 characters with numbers and symbols.',

    // Dashboard Extras
    'dashboard.welcome': 'Welcome back,',
    'dashboard.level1Verified': 'Level 1 Verified Client',
    'dashboard.deskLabel': 'Secure Allocated Vault Desk',
    'dashboard.portfolioValuation': 'Portfolio Valuation',
    'dashboard.allocatedWeight': 'Allocated Bullion Weight',
    'dashboard.liquidCash': 'Liquid Cash Balance',
    'dashboard.custodyStatus': 'Vault Custody Status',
    'dashboard.custodyDesc': 'Physically segregated custody sealed in cryptographic double-entry ledger.',
    'dashboard.fullyAllocated': '100% Allocated',
    'dashboard.unrealizedGain': 'Unrealized Gain:',
    'dashboard.equivalentTola': 'Equivalent Tola:',
    'dashboard.settlementGateway': 'Settlement Gateway:',
    'dashboard.chartTitle': 'Vault Asset Valuation Trajectory',
    'dashboard.chartSubtitle': 'Real-time valuation based on active BAJUS spot rates',
    'dashboard.chartSync': 'Synchronized',
    'dashboard.purityHoldings': 'Holdings by Purity Grade',
    'dashboard.accumulateMore': 'Accumulate More Gold',
    'dashboard.ledgerTitle': 'Audited Vault Transaction Ledger',
    'dashboard.ledgerSubtitle': 'Immutable journal of gold purchases, sales, and custodial settlements',
    'dashboard.searchOrders': 'Search Order ID...',
    'dashboard.filterAll': 'ALL',
    'dashboard.filterBuy': 'BUY',
    'dashboard.filterSell': 'SELL',
    'dashboard.exportStatement': 'Export Statement',
    'dashboard.noTransactions': 'No Transactions Found',
    'dashboard.noTransactionsDesc': 'You have not made any gold purchases or liquidations yet. Start accumulating from as little as ৳500.',
    'dashboard.noTransactionsFiltered': 'No orders matched your search query.',
    'dashboard.buyGoldNow': 'Buy Gold Now',
    'dashboard.clearFilter': 'Clear Filter',
    'dashboard.table.orderId': 'Order ID',
    'dashboard.table.type': 'Type',
    'dashboard.table.purity': 'Purity',
    'dashboard.table.weight': 'Weight',
    'dashboard.table.amount': 'Amount',
    'dashboard.table.status': 'Status',
    'dashboard.table.date': 'Date',
    'dashboard.table.receipt': 'Receipt',
    'dashboard.table.view': 'View',
    'dashboard.kycAlertTitle': 'Complete BFIU Identity Verification',
    'dashboard.kycAlertUnderReview': 'Identity Verification Under Review',
    'dashboard.kycAlertDesc': 'Submit your Smart NID or Passport to unlock physical bullion delivery and elevated transaction limits.',
    'dashboard.kycAlertPendingDesc': 'Your NID verification is currently being reviewed by our compliance desk. High-value physical delivery will be enabled upon approval.',
    'dashboard.verifyNidNow': 'Verify NID Now',
    'dashboard.deliveryDeskTitle': 'Physical Bullion Delivery Desk',
    'dashboard.deliveryDeskSubtitle': 'Redeem your segregated physical gold into certified bars',
    'dashboard.availableVaultBalance': 'Available Vault Balance:',
    'dashboard.minRedemption': 'Minimum Physical Redemption:',
    'dashboard.minRedemptionVal': '1 Bhori (11.664 Grams)',
    'dashboard.certifiedPack': 'Certified Assay Pack:',
    'dashboard.certiCard': 'Tamper-Proof CertiCard',
    'dashboard.minThresholdTitle': 'Minimum Threshold Requirement',
    'dashboard.minThresholdNotice': 'You need at least 1 Bhori (11.664g) to request physical bar delivery. Continue micro-saving to reach the delivery milestone.',
    'dashboard.deliveryLogistics': 'Our armored transport logistics partner will coordinate delivery to your verified registered address with biometric verification upon handover.',
    'dashboard.confirmRedemption': 'Confirm Physical Redemption Request',
    'dashboard.closeWindow': 'Close Window',
    'dashboard.certificateTitle': 'AurumSave Bullion Certificate',
    'dashboard.orderRef': 'Order Reference:',
    'dashboard.certAuditNote': 'Cryptographically audited by AurumSave Sovereign Ledger. Non-repudiable property of the authenticated client.',
    'dashboard.closeReceipt': 'Close Receipt',

    // Trade Desk Extras
    'trade.rateLock': '5-Minute Guaranteed Rate Lock',
    'trade.zeroSlippage': 'Zero Slippage',
    'trade.buyTitle': 'Physical Bullion Trade Desk',
    'trade.sellTitle': 'Instant Gold Liquidation',
    'trade.deskSubtitle': 'Lock verified BAJUS benchmark rates for 300 seconds. Transactions are guaranteed by allocated bank vault reserves.',
    'trade.emergencyLockActive': 'Emergency Security Lockdown Active',
    'trade.emergencyLockNotice': 'Gold orders and liquidation are halted while account is frozen.',
    'trade.btnBuy': 'Buy Physical Bullion',
    'trade.btnSell': 'Liquidate into Taka',
    'trade.k24desc': '99.9% Pure Investment Gold',
    'trade.k22desc': '91.6% Hallmark Standard',
    'trade.amountTo': 'Amount to',
    'trade.invest': 'Invest',
    'trade.liquidate': 'Liquidate',
    'trade.zeroSurcharge': 'Zero Surcharge',
    'trade.payoutDest': 'Payout Disbursement Destination',
    'trade.payoutBkash': 'bKash Wallet',
    'trade.payoutNagad': 'Nagad Wallet',
    'trade.payoutBank': 'Bank Transfer',
    'trade.bankNamePlaceholder': 'Bank Name (e.g. City Bank)',
    'trade.routingPlaceholder': 'Routing Number',
    'trade.accountPlaceholder': 'Account Number',
    'trade.mobilePlaceholder': 'Mobile Number (e.g. 01700000000)',
    'trade.requestQuote': 'Lock Live BAJUS Rate',
    'trade.quoteLockedFor': 'Quote locked for {seconds}s',
    'trade.ratePerGram': 'Rate / Gram',
    'trade.pureWeight': 'Pure Weight',
    'trade.grossTotal': 'Gross Value',
    'trade.platformFee': 'Custody & Insurance Fee',
    'trade.netPayable': 'Total Settlement Amount',
    'trade.confirmAndPay': 'Confirm Order & Pay via {gw}',
    'trade.confirmAndSell': 'Confirm Liquidation Payout',

    // Staff Header & Links
    'staff.header.ops': 'AurumSave Operations',
    'staff.header.coreLive': 'Core Engine Live',
    'staff.header.customerView': 'Customer View',
    'staff.nav.admin': 'Executive Admin',
    'staff.nav.compliance': 'BFIU Compliance',
    'staff.nav.operations': 'Treasury & Operations',
    'staff.nav.support': 'Support Desk',
    'staff.nav.auditor': 'Cryptographic Audit',

    // Footer
    'footer.bajusTitle': 'BAJUS Benchmark',
    'footer.bajusDesc': 'Daily rates aligned with the Bangladesh Jewellers Association standard.',
    'footer.allocatedTitle': 'Allocated Bullion',
    'footer.allocatedDesc': '100% physically backed by 24K & 22K certified gold in bank-grade vaults.',
    'footer.bfiuTitle': 'BFIU AML Compliance',
    'footer.bfiuDesc': 'Strict KYC verification & double-entry financial ledger for every gram.',
    'footer.mfsTitle': 'Instant MFS Liquidity',
    'footer.mfsDesc': 'Liquidate anytime with instant payout to bKash, Nagad, Rocket, or Bank.',
    'footer.brandDesc': "AurumSave is Bangladesh's premier digital gold savings architecture. We enable micro-savings starting from 100 milligrams (or ৳500) backed by allocated, audited physical bullion.",
    'footer.hq': 'Headquarters: Gulshan Avenue, Dhaka-1212, Bangladesh. Custody: Segregated Vault Facility.',
    'footer.platform': 'Platform',
    'footer.governance': 'Governance',
    'footer.payments': 'Supported Payment MFS',
    'footer.coreLedgerStatus': 'Core Ledger: Operational',
    'footer.legal': 'Legal Notice: Digital gold purchases through AurumSave are backed 100% by physically segregated bullion in bank vaults. Gold prices fluctuate based on domestic BAJUS market factors.',
    'footer.rights': '© {year} AurumSave Technologies Bangladesh Ltd. All rights reserved.',

    // Errors & Validations
    'error.network': 'Network connection failed. Please check your internet connection.',
    'error.quoteExpired': 'Price quote has expired. Generating a fresh live quote...',
    'error.frozen': 'Account is locked under emergency security freeze. Trading operations are halted.',
    'error.invalidCreds': 'Invalid credentials. Please verify your email and password.',
  },
  bn: {
    // Common & Actions
    'common.confirm': 'নিশ্চিত করুন',
    'common.cancel': 'বাতিল',
    'common.submit': 'সাবমিট করুন',
    'common.loading': 'প্রসেসিং হচ্ছে...',
    'common.active': 'সক্রিয়',
    'common.suspended': 'স্থগিত',
    'common.completed': 'সম্পন্ন',
    'common.pending': 'অপেক্ষমাণ',
    'common.failed': 'ব্যর্থ',
    'common.success': 'সফল',
    'common.search': 'খুঁজুন...',
    'common.filter': 'ফিল্টার',
    'common.all': 'সকল',
    'common.download': 'ডাউনলোড',
    'common.print': 'স্টেটমেন্ট প্রিন্ট করুন',
    'common.back': 'ফিরে যান',
    'common.verified': 'যাচাইকৃত',
    'common.save': 'পরিবর্তন সংরক্ষণ করুন',
    'common.close': 'বন্ধ করুন',

    // Navigation
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
    'nav.vaultProof': 'ভল্ট হেফাজত',
    'nav.calculator': 'ক্যালকুলেটর',
    'nav.faq': 'সাধারণ জিজ্ঞাসা',

    // Hero Section
    'hero.badge': 'বাংলাদেশের প্রথম সার্বভৌম ডিজিটাল গোল্ড প্ল্যাটফর্ম',
    'hero.title': 'প্রতিটি নাগরিকের জন্য আসল ২৪ ক্যারেট স্বর্ণ সঞ্চয়',
    'hero.subtitle': 'মাত্র ৫০০ টাকা থেকে শুরু করুন খাঁটি স্বর্ণের সঞ্চয়। বাজুস অনুমোদিত স্বচ্ছ রেট, ব্যাংক-বীমাকৃত ভল্ট হেফাজত এবং বিকাশ ও নগদের মাধ্যমে তাৎক্ষণিক ক্যাশআউট।',
    'hero.cta.start': 'বিনামূল্যে ভল্ট অ্যাকাউন্ট খুলুন',
    'hero.cta.calculate': 'সঞ্চয় ক্যালকুলেটর দেখুন',
    'hero.liveBajusBadge': 'লাইভ বাজুস বাজার দর',
    'hero.stats.vaultGrams': 'গ্রাম স্বর্ণ ভল্টে সংরক্ষিত',
    'hero.stats.accuracy': 'ডাবল-এন্ট্রি ব্যালেন্সিং',
    'hero.stats.backing': '১০০% আসল স্বর্ণ সংরক্ষিত',
    'hero.stats.storageFee': 'বিনামূল্যে ভল্ট হেফাজত',

    // Home Features & Comparison
    'features.purity.title': '১০০% খাঁটি ২৪K স্বর্ণের বার',
    'features.purity.desc': 'প্রতিটি মিলিগ্রাম স্বর্ণ ২৪ ক্যারেট (৯৯.৯%) বা ২২ ক্যারেট (৯১.৬%) হলমার্কযুক্ত এবং ব্যাংকের গ্রেড-৩ ভল্টে সংরক্ষিত।',
    'features.liquidity.title': 'তাৎক্ষণিক মোবাইল ক্যাশআউট',
    'features.liquidity.desc': '২৪ ঘণ্টা যেকোনো মুহূর্তে স্বর্ণ বিক্রি করে আপনার বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টে তাৎক্ষণিক টাকা তুলুন।',
    'features.spread.title': 'কোনো কাটিং চার্জ নেই',
    'features.spread.desc': 'মাত্র ২.০% - ২.৫% স্বচ্ছ স্প্রেড। অলংকারের মতো কোনো অপ্রয়োজনীয় মজুরি বা কাটিং ফি কাটা হয় না।',
    'features.delivery.title': 'আসল স্বর্ণ হাতে পাওয়ার সুবিধা',
    'features.delivery.desc': 'ন্যূনতম ১ ভরি (১১.৬৬৪ গ্রাম) স্বর্ণ সঞ্চয় হলে সিকিউরড আর্মার্ড ডেলিভারির মাধ্যমে নিজের বাসায় স্বর্ণ বার বা কয়েন সংগ্রহ করুন।',

    // FAQ Section
    'faq.title': 'সাধারণ জিজ্ঞাসা ও উত্তর',
    'faq.subtitle': 'ভল্ট নিরাপত্তা, বাজার দর, ক্রয়-বিক্রয় এবং আইনি স্বচ্ছতা সম্পর্কিত সাধারণ প্রশ্নের উত্তর।',
    'faq.q1': 'AurumSave-এ স্বর্ণ কেনার পর তা কি সত্যিই আসল স্বর্ণ হিসেবে থাকে?',
    'faq.a1': 'হ্যাঁ, সম্পূর্ণ ১০০% আসল স্বর্ণ দ্বারা সমর্থিত। আপনার কেনা প্রতিটি মিলিগ্রাম স্বর্ণের বিপরীতে বাজুস অনুমোদিত রিফাইনারি থেকে সমপরিমাণ আসল ২৪ ক্যারেট (৯৯.৯%) বা ২২ ক্যারেট (৯১.৬%) স্বর্ণ কেনা হয় এবং তা ব্যাংকের নিরাপদ ভল্টে ক্লায়েন্টের নামে সংরক্ষিত থাকে। এটি কোনো কাগজী নোট বা ডিজিটাল মুদ্রা নয়।',
    'faq.q2': 'স্বর্ণ সঞ্চয় শুরু করতে সর্বনিম্ন কত টাকা প্রয়োজন?',
    'faq.a2': 'আপনি মাত্র ৫০০ টাকা বা ০.১ গ্রাম স্বর্ণ কিনে সঞ্চয় শুরু করতে পারেন। আমাদের লক্ষ্য হল বাংলাদেশের প্রতিটি পরিবারের জন্য মূল্যস্ফীতি প্রতিরোধী স্বর্ণ সঞ্চয় সহজ ও সাধ্যের মধ্যে আনা।',
    'faq.q3': 'স্বর্ণের ক্রয় ও বিক্রয় মূল্য কীভাবে নির্ধারিত হয়?',
    'faq.a3': 'আমাদের দর বাংলাদেশ জুয়েলার্স অ্যাসোসিয়েশন (বাজুস)-এর দৈনিক অফিসিয়াল রেটের সাথে সরাসরি যুক্ত। খাঁটি স্বর্ণ হেফাজত, বীমা ও তাৎক্ষণিক ক্যাশআউট পরিচালনার জন্য মাত্র ২.০% - ২.৫% স্বচ্ছ স্প্রেড প্রযোজ্য। কোনো লুকানো চার্জ নেই।',
    'faq.q4': 'আমি কি আমার জমানো স্বর্ণ আসল বার বা কয়েন হিসেবে হাতে পেতে পারি?',
    'faq.a4': 'হ্যাঁ। আপনার অ্যাকাউন্টে ন্যূনতম ১ ভরি (১১.৬৬৪ গ্রাম) স্বর্ণ জমা হলে আপনি আসল গোল্ড বার বা কয়েন হিসেবে ডেলিভারি নেওয়ার আবেদন করতে পারেন। নিরাপত্তা ও মান নিশ্চিতের জন্য প্রতিটি বারের সাথে অফিশিয়াল অ্যাসেই সার্টিফিকেট দেওয়া হয়।',
    'faq.q5': 'স্বর্ণ বিক্রি করে ক্যাশ টাকা পেতে কত সময় লাগে?',
    'faq.a5': 'ক্যাশআউট তাৎক্ষণিক। যখনই আপনি স্বর্ণ বিক্রি করবেন, সাথে সাথে আপনার অ্যাকাউন্টে টাকা জমা হবে এবং তা ২৪/৭ বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টে ক্যাশআউট করা যাবে।',
    'faq.q6': 'অ্যাকাউন্টে জাতীয় পরিচয়পত্র (NID) যাচাইকরণ কেন বাধ্যতামূলক?',
    'faq.a6': 'বাংলাদেশ ফাইন্যান্সিয়াল ইন্টেলিজেন্স ইউনিট (বিএফআইইউ) এবং মানি লন্ডারিং প্রতিরোধ আইনের কঠোর নির্দেশিকা অনুযায়ী গ্রাহকের পরিচয় নিশ্চিত করা এবং আপনার মূল্যবান স্বর্ণের প্রকৃত মালিকানা সুরক্ষিত রাখার স্বার্থে এনআইডি যাচাই আবশ্যক।',

    // Trade Desk
    'trade.buy': 'স্বর্ণ কিনুন',
    'trade.sell': 'টাকায় ক্যাশআউট করুন',
    'trade.rate24k': '২৪ ক্যারেট ৯৯.৯% লাইভ রেট',
    'trade.rate22k': '২২ ক্যারেট ৯১.৬% লাইভ রেট',
    'trade.spread': 'স্বচ্ছ স্প্রেড',
    'trade.live': 'লাইভ বাজার দর',
    'trade.amountInput': 'টাকার পরিমাণ (৳)',
    'trade.weightInput': 'স্বর্ণের ওজন গ্রামে (g)',
    'trade.quoteExpiry': 'দর বহাল থাকবে',
    'trade.executeBuy': 'নিশ্চিত করুন ও পেমেন্টে যান',
    'trade.executeSell': 'বিক্রি নিশ্চিত করুন',
    'trade.puritySelect': 'বিশুদ্ধতার মান',
    'trade.rateLockNotice': '৫ মিনিটের গ্যারান্টিযুক্ত রেট লক চলাকালীন বাজারের ওঠানামায় আপনার দর পরিবর্তিত হবে না।',
    'trade.breakdown.title': 'লেনদেনের বিস্তারিত স্বচ্ছ হিসাব',
    'trade.breakdown.benchmark': 'বাজার দর / গ্রাম',
    'trade.breakdown.goldWeight': 'শারীরিক স্বর্ণের ওজন',
    'trade.breakdown.pureMetal': 'খাঁটি স্বর্ণের মূল্য',
    'trade.breakdown.platformFee': 'প্ল্যাটফর্ম সেটেলমেন্ট ফি (০.৫%)',
    'trade.breakdown.vaultCustody': 'ব্যাংক ভল্ট হেফাজত ও বীমা',
    'trade.breakdown.totalPayable': 'মোট প্রদেয় টাকা',
    'trade.paymentMethod': 'পেমেন্ট গেটওয়ে নির্বাচন করুন',
    'trade.payoutAccount': 'ক্যাশআউট ওয়ালেট নম্বর',
    'trade.payoutPrompt': 'তাৎক্ষণিক টাকা পাওয়ার জন্য আপনার ব্যক্তিগত যাচাইকৃত বিকাশ বা নগদ নম্বর লিখুন।',

    // Portfolio & Dashboard
    'vault.totalBalance': 'মোট স্বর্ণ সঞ্চয়',
    'vault.indicativeValue': 'বর্তমান আনুমানিক মূল্য',
    'vault.unrealizedGain': 'অর্জিত লাভ / ক্ষতি',
    'vault.activeGoals': 'সক্রিয় সঞ্চয় লক্ষ্য',
    'vault.recentTransactions': 'প্রমাণিত লেজার হিস্ট্রি',
    'vault.downloadPassport': 'গোল্ড পাসপোর্ট ডাউনলোড (PDF)',
    'vault.statement': 'অডিটেড স্টেটমেন্ট',
    'vault.delivery': 'শারীরিক ডেলিভারি',
    'vault.deliveryNotice': 'ডেলিভারির জন্য অনুমোদিত এনআইডি ভেরিফিকেশন ও ন্যূনতম ১ ভরি ব্যালেন্স প্রয়োজন।',
    'vault.orders.id': 'অর্ডার রেফারেন্স',
    'vault.orders.type': 'ধরণ',
    'vault.orders.weight': 'স্বর্ণের পরিমাণ',
    'vault.orders.total': 'মোট টাকা',
    'vault.orders.status': 'স্ট্যাটাস',
    'vault.orders.date': 'সময়কাল',

    // Goals
    'goals.title': 'স্মার্ট গোল্ড সঞ্চয় লক্ষ্য',
    'goals.subtitle': 'বিবাহ, সন্তানের উচ্চশিক্ষা, হজ্ব বা পারিবারিক ভবিষ্যতের জন্য সুনির্দিষ্ট স্বর্ণ সঞ্চয়ের লক্ষ্য নির্ধারণ করুন।',
    'goals.create': 'নতুন লক্ষ্য তৈরি করুন',
    'goals.target': 'লক্ষ্যমাত্রা',
    'goals.saved': 'জমা হয়েছে',
    'goals.remaining': 'বাকি আছে',
    'goals.calculator': 'স্বর্ণ সঞ্চয় ক্যালকুলেটর',
    'goals.calculatePlan': 'মাসিক সঞ্চয় পরিকল্পনা দেখুন',
    'goals.category.marriage': 'বিবাহ সঞ্চয়',
    'goals.category.education': 'সন্তানের উচ্চশিক্ষা',
    'goals.category.family': 'পারিবারিক সঞ্চয়',
    'goals.category.hajj': 'পবিত্র হজ্ব সঞ্চয়',
    'goals.category.emergency': 'জরুরি রিজার্ভ',
    'goals.category.custom': 'কাস্টম গোল',
    'goals.allocateAction': 'এই লক্ষ্যে স্বর্ণ জমা করুন',

    // Security
    'security.title': 'ব্যক্তিগত নিরাপত্তা কেন্দ্র',
    'security.subtitle': 'জিরো-ট্রাস্ট অ্যাকাউন্ট পর্যবেক্ষণ, ক্রিপ্টোগ্রাফিক সেশন ট্র্যাকিং এবং তাৎক্ষণিক ইমার্জেন্সি অ্যাকাউন্ট লকডাউন।',
    'security.status': 'অ্যাকাউন্ট সুরক্ষা স্ট্যাটাস',
    'security.activeSession': 'বর্তমান সক্রিয় সেশন',
    'security.emergencyFreeze': 'ইমার্জেন্সি অ্যাকাউন্ট ফ্রিজ',
    'security.freezeNotice': 'অ্যাকাউন্টে কোনো সন্দেহজনক কার্যকলাপ লক্ষ্য করলে সাথে সাথে সমস্ত লেনদেন ও উত্তোলন স্থগিত করুন।',
    'security.restoreAccess': 'লক প্রত্যাহার ও অ্যাকাউন্ট সচল করুন',
    'security.ip': 'আইপি অ্যাড্রেস',
    'security.device': 'ডিভাইস',
    'security.encryption': 'ট্রান্সপোর্ট এনক্রিপশন',

    // Academy
    'academy.title': 'স্বর্ণ লার্নিং একাডেমি',
    'academy.subtitle': 'স্বর্ণের বিশুদ্ধতা, হলমার্কিং, ভরি-গ্রাম রূপান্তর এবং আর্থিক নিরাপত্তা জানুন বাংলায়।',
    'academy.converter': 'স্বর্ণের পরিমাপ রূপান্তর টুল',
    'academy.quiz': 'স্বর্ণ জ্ঞান যাচাই কুইজ',
    'academy.submitQuiz': 'কুইজ সাবমিট করুন',

    // Support
    'support.title': 'গ্রাহক সহায়তা ও বিরোধ নিষ্পত্তি কেন্দ্র',
    'support.subtitle': 'লেনদেন সংক্রান্ত যে কোনো সমস্যা, পেমেন্ট নিষ্পত্তি ও অ্যাকাউন্ট সুরক্ষায় অফিসিয়াল সহায়তা।',
    'support.createTicket': 'নতুন অভিযোগ/টিকিট খুলুন',
    'support.category': 'ক্যাটাগরি',
    'support.subject': 'বিষয়',
    'support.description': 'আপনার সমস্যা বা লেনদেনের বিবরণ লিখুন...',
    'support.priority': 'অগ্রাধিকার',

    // KYC
    'kyc.title': 'বিএফআইইউ পরিচয় যাচাইকরণ (এনআইডি/পাসপোর্ট)',
    'kyc.subtitle': 'শারীরিক স্বর্ণ ডেলিভারি এবং উচ্চ লেনদেন সীমা আনলক করতে আপনার স্মার্ট এনআইডি বা পাসপোর্ট আপলোড করুন।',
    'kyc.docType': 'ডকুমেন্টের ধরণ',
    'kyc.docNumber': 'এনআইডি / পাসপোর্ট নম্বর',
    'kyc.front': 'সামনের স্পষ্ট ছবি',
    'kyc.back': 'পেছনের স্পষ্ট ছবি',
    'kyc.status.approved': 'যাচাইকরণ অনুমোদিত',
    'kyc.status.pending': 'কমপ্লায়েন্স পর্যবেক্ষণে রয়েছে',
    'kyc.status.rejected': 'পুনরায় জমা দিন',

    // Staff Workspaces
    'staff.admin.title': 'এক্সিকিউটিভ কমান্ড সেন্টার',
    'staff.admin.subtitle': 'প্ল্যাটফর্ম প্রশাসন, ভল্ট রিজার্ভ লিকুইডিটি এবং জরুরি আর্থিক কিল-সুইচ নিয়ন্ত্রণ।',
    'staff.compliance.title': 'কেওয়াইসি ও এএমএল কমপ্লায়েন্স ওয়ার্কস্পেস',
    'staff.compliance.subtitle': 'বিএফআইইউ পরিচয় যাচাইকরণ কিউ, ঝুঁকি নিরীক্ষা এবং ডকুমেন্ট অনুমোদন।',
    'staff.operations.title': 'ফাইন্যান্স ও ট্রেজারি অপারেশনস ডেস্ক',
    'staff.operations.subtitle': 'পেমেন্ট গেটওয়ে রিকনসিলিয়েশন, ডাবল-এন্ট্রি লেজার অডিট এবং রিফান্ড অনুমোদন।',
    'staff.support.title': 'কনসিয়ার্জ কেয়ার সাপোর্ট কনসোল',
    'staff.support.subtitle': 'গ্রাহক বিরোধ নিষ্পত্তি, টিকিট এসকেলেশন এবং রেজোলিউশন অডিট হিস্ট্রি।',
    'staff.auditor.title': 'স্বাধীন অডিটর পোর্টাল',
    'staff.auditor.subtitle': 'রিড-অনলি অডিট ট্রেইল ভেরিফিকেশন এবং এসএইচএ-২৫৬ চেইন সত্যতা যাচাই।',

    // Register
    'register.title': 'আপনার স্বর্ণ ভল্ট অ্যাকাউন্ট খুলুন',
    'register.subtitle': 'আসল ২৪K ও ২২K স্বর্ণ সঞ্চয় শুরু করুন। শতভাগ নিরাপদ ভল্ট হেফাজত।',
    'register.fullName': 'পূর্ণ আইনি নাম',
    'register.email': 'ইমেইল অ্যাড্রেস',
    'register.phone': 'মোবাইল নম্বর (বিকাশ/নগদ)',
    'register.password': 'ভল্ট পাসওয়ার্ড',
    'register.confirmPassword': 'পাসওয়ার্ড নিশ্চিত করুন',
    'register.strength': 'পাসওয়ার্ড সুরক্ষা:',
    'register.strengthWeak': 'দুর্বল',
    'register.strengthModerate': 'মাঝারি',
    'register.strengthStrong': 'সর্বোচ্চ শক্তিশালী',
    'register.complianceTitle': 'কোনো অ্যাকাউন্ট খোলার ফি নেই • লাইভ বাজুস বাজার দর',
    'register.complianceTerms': 'ভল্ট অ্যাকাউন্ট তৈরির মাধ্যমে আপনি AurumSave-এর হেফাজতের শর্তাবলী ও বাংলাদেশ ব্যাংক এএমএল/কেওয়াইসি বিধিমালার সাথে সম্মত হচ্ছেন।',
    'register.submit': 'স্বর্ণ ভল্ট অ্যাকাউন্ট খুলুন',
    'register.alreadyHave': 'ইতোমধ্যে অ্যাকাউন্ট আছে?',
    'register.signIn': 'লগইন করুন',
    'register.errPasswordMismatch': 'উভয় পাসওয়ার্ড মিলছে না। অনুগ্রহ করে যাচাই করুন।',
    'register.errPasswordShort': 'পাসওয়ার্ড ন্যূনতম ৮ অক্ষর, সংখ্যা ও প্রতীকের সংমিশ্রণ হতে হবে।',

    // Dashboard Extras
    'dashboard.welcome': 'স্বাগতম,',
    'dashboard.level1Verified': 'লেভেল ১ যাচাইকৃত ক্লায়েন্ট',
    'dashboard.deskLabel': 'নিরাপদ অ্যালকেটেড ভল্ট ডেস্ক',
    'dashboard.portfolioValuation': 'পোর্টফোলিও মূল্যায়ন',
    'dashboard.allocatedWeight': 'ভল্টে বরাদ্দকৃত মোট ওজন',
    'dashboard.liquidCash': 'নগদ ওয়ালেট ব্যালেন্স',
    'dashboard.custodyStatus': 'ভল্ট হেফাজত স্ট্যাটাস',
    'dashboard.custodyDesc': 'স্বতন্ত্র অ্যাকাউন্টে সংরক্ষিত এবং ক্রিপ্টোগ্রাফিক ডাবল-এন্ট্রি লেজারে প্রত্যয়িত।',
    'dashboard.fullyAllocated': '১০০% বরাদ্দকৃত',
    'dashboard.unrealizedGain': 'অর্জিত লাভ/ক্ষতি:',
    'dashboard.equivalentTola': 'সমপরিমাণ ভরি:',
    'dashboard.settlementGateway': 'সেটেলমেন্ট গেটওয়ে:',
    'dashboard.chartTitle': 'ভল্ট সম্পদের বাজারদর পরিবর্তন গ্রাফ',
    'dashboard.chartSubtitle': 'লাইভ বাজুস বাজার দরের ওপর ভিত্তি করে রিয়েল-টাইম হিসাব',
    'dashboard.chartSync': 'সিঙ্ক্রোনাইজড',
    'dashboard.purityHoldings': 'বিশুদ্ধতার মান অনুযায়ী মোট স্বর্ণ',
    'dashboard.accumulateMore': 'আরও স্বর্ণ জমা করুন',
    'dashboard.ledgerTitle': 'অডিটেড ভল্ট লেনদেন খতিয়ান',
    'dashboard.ledgerSubtitle': 'স্বর্ণ ক্রয়, বিক্রয় ও ভল্ট নিষ্পত্তির অপরিবর্তনীয় অডিট হিস্ট্রি',
    'dashboard.searchOrders': 'অর্ডার আইডি দিয়ে খুঁজুন...',
    'dashboard.filterAll': 'সকল',
    'dashboard.filterBuy': 'ক্রয়',
    'dashboard.filterSell': 'বিক্রয়',
    'dashboard.exportStatement': 'স্টেটমেন্ট এক্সপোর্ট',
    'dashboard.noTransactions': 'কোনো লেনদেন পাওয়া যায়নি',
    'dashboard.noTransactionsDesc': 'আপনি এখনও কোনো স্বর্ণ কেনেননি বা বিক্রি করেননি। মাত্র ৫০০ টাকা থেকে শুরু করুন।',
    'dashboard.noTransactionsFiltered': 'আপনার সার্চে কোনো অর্ডার পাওয়া যায়নি।',
    'dashboard.buyGoldNow': 'এখনই স্বর্ণ কিনুন',
    'dashboard.clearFilter': 'ফিল্টার মুছুন',
    'dashboard.table.orderId': 'অর্ডার আইডি',
    'dashboard.table.type': 'ধরণ',
    'dashboard.table.purity': 'ক্যারেট',
    'dashboard.table.weight': 'ওজন',
    'dashboard.table.amount': 'টাকা',
    'dashboard.table.status': 'স্ট্যাটাস',
    'dashboard.table.date': 'তারিখ',
    'dashboard.table.receipt': 'রশিদ',
    'dashboard.table.view': 'দেখুন',
    'dashboard.kycAlertTitle': 'বিএফআইইউ পরিচয় যাচাইকরণ সম্পন্ন করুন',
    'dashboard.kycAlertUnderReview': 'পরিচয় যাচাইকরণ পর্যবেক্ষণে রয়েছে',
    'dashboard.kycAlertDesc': 'শারীরিক স্বর্ণ ডেলিভারি এবং উচ্চ লেনদেন সীমা পেতে স্মার্ট এনআইডি বা পাসপোর্ট জমা দিন।',
    'dashboard.kycAlertPendingDesc': 'আপনার এনআইডি ভেরিফিকেশন কমপ্লায়েন্স ডেস্ক যাচাই করছে। অনুমোদনের পর ডেলিভারি সুবিধা চালু হবে।',
    'dashboard.verifyNidNow': 'এনআইডি যাচাই করুন',
    'dashboard.deliveryDeskTitle': 'শারীরিক স্বর্ণ ডেলিভারি ডেস্ক',
    'dashboard.deliveryDeskSubtitle': 'আপনার ভল্টের স্বর্ণ সার্টিফাইড আসল বারে ডেলিভারি নিন',
    'dashboard.availableVaultBalance': 'উপলব্ধ ভল্ট ব্যালেন্স:',
    'dashboard.minRedemption': 'ন্যূনতম ডেলিভারি পরিমাণ:',
    'dashboard.minRedemptionVal': '১ ভরি (১১.৬৬৪ গ্রাম)',
    'dashboard.certifiedPack': 'সার্টিফাইড প্যাকেজিং:',
    'dashboard.certiCard': 'টেম্পার-প্রুফ সার্টি-কার্ড',
    'dashboard.minThresholdTitle': 'ন্যূনতম ডেলিভারি শর্তাবলী',
    'dashboard.minThresholdNotice': 'আসল গোল্ড বার ডেলিভারির জন্য ন্যূনতম ১ ভরি (১১.৬৬৪ গ্রাম) স্বর্ণ সঞ্চয় প্রয়োজন। আপনার বর্তমান ব্যালেন্স দেখে সঞ্চয় চালিয়ে যান।',
    'dashboard.deliveryLogistics': 'আমাদের সিকিউরড আর্মার্ড লজিস্টিকস পার্টনার বায়োমেট্রিক ও এনআইডি যাচাইয়ের মাধ্যমে নিবন্ধিত ঠিকানায় ডেলিভারি পৌঁছে দেবে।',
    'dashboard.confirmRedemption': 'শারীরিক ডেলিভারির আবেদন নিশ্চিত করুন',
    'dashboard.closeWindow': 'বন্ধ করুন',
    'dashboard.certificateTitle': 'AurumSave স্বর্ণ মালিকানা সনদ',
    'dashboard.orderRef': 'অর্ডার রেফারেন্স:',
    'dashboard.certAuditNote': 'AurumSave সার্বভৌম লেজার দ্বারা ক্রিপ্টোগ্রাফিকভাবে সংরক্ষিত ও যাচাইকৃত।',
    'dashboard.closeReceipt': 'রশিদ বন্ধ করুন',

    // Trade Desk Extras
    'trade.rateLock': '৫ মিনিটের নিশ্চিত রেট লক',
    'trade.zeroSlippage': 'জিরো স্লিপেজ',
    'trade.buyTitle': 'শারীরিক স্বর্ণ ট্রেড ডেস্ক',
    'trade.sellTitle': 'তাৎক্ষণিক স্বর্ণ বিক্রয় ও ক্যাশআউট',
    'trade.deskSubtitle': '৩০০ সেকেন্ডের জন্য লাইভ বাজুস রেট লক করুন। প্রতিটি লেনদেন ভল্ট রিজার্ভ দ্বারা শতভাগ সমর্থিত।',
    'trade.emergencyLockActive': 'জরুরি নিরাপত্তা ফ্রিজ সক্রিয়',
    'trade.emergencyLockNotice': 'অ্যাকাউন্ট ফ্রিজ অবস্থায় থাকায় সমস্ত স্বর্ণ ক্রয়-বিক্রয় সাময়িকভাবে স্থগিত।',
    'trade.btnBuy': 'আসল স্বর্ণ কিনুন',
    'trade.btnSell': 'বিক্রি করে ক্যাশআউট করুন',
    'trade.k24desc': '৯৯.৯% বিনিয়োগযোগ্য খাঁটি স্বর্ণ',
    'trade.k22desc': '৯১.৬% হলমার্ক স্ট্যান্ডার্ড স্বর্ণ',
    'trade.amountTo': 'পরিমাণ',
    'trade.invest': 'বিনিয়োগ করুন',
    'trade.liquidate': 'বিক্রি করুন',
    'trade.zeroSurcharge': 'কোনো অতিরিক্ত চার্জ নেই',
    'trade.payoutDest': 'ক্যাশআউট গন্তব্য একাউন্ট',
    'trade.payoutBkash': 'বিকাশ ওয়ালেট',
    'trade.payoutNagad': 'নগদ ওয়ালেট',
    'trade.payoutBank': 'ব্যাংক একাউন্ট',
    'trade.bankNamePlaceholder': 'ব্যাংকের নাম (যেমন সিটি ব্যাংক)',
    'trade.routingPlaceholder': 'রাউটিং নম্বর',
    'trade.accountPlaceholder': 'একাউন্ট নম্বর',
    'trade.mobilePlaceholder': 'মোবাইল নম্বর (যেমন ০১৭০০০০০০০০)',
    'trade.requestQuote': 'লাইভ বাজুস দর লক করুন',
    'trade.quoteLockedFor': 'দরটির মেয়াদ বাকি: {seconds} সেকেন্ড',
    'trade.ratePerGram': 'প্রতি গ্রাম রেট',
    'trade.pureWeight': 'খাঁটি ওজন',
    'trade.grossTotal': 'মোট স্বর্ণের মূল্য',
    'trade.platformFee': 'হেফাজত ও প্ল্যাটফর্ম ফি',
    'trade.netPayable': 'মোট পরিশোধযোগ্য টাকা',
    'trade.confirmAndPay': 'অর্ডার নিশ্চিত করে {gw}-এ পেমেন্ট করুন',
    'trade.confirmAndSell': 'বিক্রি নিশ্চিত করুন',

    // Staff Header & Links
    'staff.header.ops': 'AurumSave অপারেশনস',
    'staff.header.coreLive': 'কোর ইঞ্জিন সক্রিয়',
    'staff.header.customerView': 'গ্রাহক ভিউ',
    'staff.nav.admin': 'এক্সিকিউটিভ অ্যাডমিন',
    'staff.nav.compliance': 'বিএফআইইউ কমপ্লায়েন্স',
    'staff.nav.operations': 'ট্রেজারি ও অপারেশনস',
    'staff.nav.support': 'সাপোর্ট ডেস্ক',
    'staff.nav.auditor': 'ক্রিপ্টোগ্রাফিক অডিট',

    // Footer
    'footer.bajusTitle': 'বাজুস লাইভ রেট',
    'footer.bajusDesc': 'বাংলাদেশ জুয়েলার্স অ্যাসোসিয়েশন মানদণ্ড অনুযায়ী স্বচ্ছ দৈনিক দর।',
    'footer.allocatedTitle': 'ভল্টে আসল স্বর্ণ',
    'footer.allocatedDesc': '১০০% ব্যাংক ভল্টে সংরক্ষিত ও বীমাকৃত ২৪K ও ২২K আসল স্বর্ণ।',
    'footer.bfiuTitle': 'বিএফআইইউ এএমএল কমপ্লায়েন্স',
    'footer.bfiuDesc': 'কঠোর এনআইডি যাচাইকরণ এবং প্রতিটি গ্রামের ডাবল-এন্ট্রি খতিয়ান।',
    'footer.mfsTitle': 'তাৎক্ষণিক মোবাইল ক্যাশআউট',
    'footer.mfsDesc': 'বিকাশ, নগদ, রকেট বা ব্যাংকে তাৎক্ষণিক টাকা উত্তোলন করুন।',
    'footer.brandDesc': 'AurumSave বাংলাদেশের ডিজিটাল স্বর্ণ সঞ্চয় প্ল্যাটফর্ম। মাত্র ১০০ মিলিগ্রাম বা ৫০০ টাকা থেকে শুরু করুন আসল স্বর্ণের সঞ্চয়।',
    'footer.hq': 'হেডকোয়ার্টার: গুলশান এভিনিউ, ঢাকা-১২১২, বাংলাদেশ। ভল্ট হেফাজত: সেগ্রিগেটেড ভল্ট ফ্যাসিলিটি।',
    'footer.platform': 'প্ল্যাটফর্ম',
    'footer.governance': 'আইনি ও স্বচ্ছতা',
    'footer.payments': 'সমর্থিত পেমেন্ট মাধ্যম',
    'footer.coreLedgerStatus': 'কোর লেজার: সক্রিয়',
    'footer.legal': 'আইনি বিজ্ঞপ্তি: AurumSave-এর মাধ্যমে কেনা সমস্ত ডিজিটাল স্বর্ণ ব্যাংক ভল্টে সংরক্ষিত আসল সোনা দ্বারা ১০০% সুরক্ষিত। স্থানীয় বাজুস বাজার দরের ওপর মূল্য নির্ধারিত হয়।',
    'footer.rights': '© {year} AurumSave Technologies Bangladesh Ltd. সর্বস্বত্ব সংরক্ষিত।',

    // Errors & Validations
    'error.network': 'নেটওয়ার্ক সংযোগ ব্যর্থ হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।',
    'error.quoteExpired': 'দরটির মেয়াদ শেষ হয়েছে। নতুন লাইভ দর নেওয়া হচ্ছে...',
    'error.frozen': 'জরুরি নিরাপত্তা ফ্রিজের কারণে অ্যাকাউন্ট স্থগিত রয়েছে। সমস্ত লেনদেন সাময়িকভাবে বন্ধ।',
    'error.invalidCreds': 'ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
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
    try {
      const saved = localStorage.getItem('aurumsave_language') as Language;
      if (saved && (saved === 'en' || saved === 'bn')) {
        setLanguageState(saved);
      }
    } catch {
      // Safe fallback if localStorage is disabled or restricted
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('aurumsave_language', lang);
    } catch {}
  };

  const toggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || translations['en']?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        const valStr = language === 'bn' ? convertToBengaliDigits(paramVal) : String(paramVal);
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), valStr);
      });
    }
    return text;
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

  const formatLocalizedDateTime = (isoString?: string | null): string => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;

      if (language === 'bn') {
        const options: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };
        const enDateStr = date.toLocaleDateString('en-GB', options);
        return convertToBengaliDigits(enDateStr);
      }

      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
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
        formatLocalizedDateTime,
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
