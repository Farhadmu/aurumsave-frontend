import {
  Home,
  Coins,
  Target,
  Activity,
  PieChart,
  Repeat,
  Calculator,
  Award,
  Shield,
  HelpCircle,
  FileText,
  Users,
  AlertTriangle,
  Scale,
  FileCheck2,
  FileSearch,
  Headphones,
  CheckCircle2,
  Eye,
  CreditCard,
  Building,
  Settings,
  ShoppingBag,
  TrendingDown,
  Receipt,
  BookOpen,
  User,
  Power,
  Sparkles,
  Download,
  Gift,
  LucideIcon,
} from 'lucide-react';
import { Role } from '../shared';

export interface NavItem {
  id: string;
  labelEn: string;
  labelBn: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  groupEn?: string;
  groupBn?: string;
  badgeCount?: number;
}

export interface NavGroup {
  groupEn: string;
  groupBn: string;
  items: NavItem[];
}

export interface RoleNavConfig {
  role: Role;
  roleTitleEn: string;
  roleTitleBn: string;
  navItems: NavItem[];
  groups: NavGroup[];
  primaryNav: NavItem[];
  moreNav: {
    categoryEn: string;
    categoryBn: string;
    items: NavItem[];
  }[];
}

export const ROLE_NAVIGATION_CONFIGS: Record<Role, RoleNavConfig> = {
  [Role.CUSTOMER]: {
    role: Role.CUSTOMER,
    roleTitleEn: 'Private Client',
    roleTitleBn: 'ব্যক্তিগত গ্রাহক',
    navItems: [
      { id: 'home', labelEn: 'Home', labelBn: 'হোম', href: '/dashboard', icon: Home, exact: true, groupEn: 'Main', groupBn: 'মূল' },
      { id: 'buy-gold', labelEn: 'Buy Gold', labelBn: 'স্বর্ণ ক্রয়', href: '/dashboard/trade?type=BUY', icon: ShoppingBag, groupEn: 'Main', groupBn: 'মূল' },
      { id: 'sell-gold', labelEn: 'Sell Gold', labelBn: 'স্বর্ণ বিক্রয়', href: '/dashboard/trade?type=SELL', icon: Coins, groupEn: 'Main', groupBn: 'মূল' },
      { id: 'my-gold', labelEn: 'My Gold', labelBn: 'আমার স্বর্ণ', href: '/dashboard/portfolio', icon: PieChart, groupEn: 'Vault & Savings', groupBn: 'ভল্ট ও সঞ্চয়' },
      { id: 'goals', labelEn: 'Savings Goals', labelBn: 'সঞ্চয় লক্ষ্য', href: '/dashboard/goals', icon: Target, groupEn: 'Vault & Savings', groupBn: 'ভল্ট ও সঞ্চয়' },
      { id: 'autosave', labelEn: 'AutoSave', labelBn: 'অটোসেভ কিস্তি', href: '/dashboard/auto-save', icon: Repeat, groupEn: 'Vault & Savings', groupBn: 'ভল্ট ও সঞ্চয়' },
      { id: 'transactions', labelEn: 'Transactions', labelBn: 'লেনদেন বিবরণী', href: '/dashboard#activity', icon: Receipt, groupEn: 'Vault & Savings', groupBn: 'ভল্ট ও সঞ্চয়' },
      { id: 'passport', labelEn: 'Gold Passport', labelBn: 'গোল্ড পাসপোর্ট', href: '/dashboard/gold-passport', icon: Award, groupEn: 'Intelligence & Tools', groupBn: 'টুলস ও তথ্য' },
      { id: 'calculator', labelEn: 'Gold Calculator', labelBn: 'স্বর্ণ ক্যালকুলেটর', href: '/dashboard/simulator', icon: Calculator, groupEn: 'Intelligence & Tools', groupBn: 'টুলস ও তথ্য' },
      { id: 'learn', labelEn: 'Learn', labelBn: 'গোল্ড একাডেমি', href: '/dashboard/academy', icon: BookOpen, groupEn: 'Account & Support', groupBn: 'সহায়তা ও অ্যাকাউন্ট' },
      { id: 'support', labelEn: 'Support', labelBn: 'গ্রাহক সহায়তা', href: '/dashboard/support', icon: Headphones, groupEn: 'Account & Support', groupBn: 'সহায়তা ও অ্যাকাউন্ট' },
      { id: 'security', labelEn: 'Security', labelBn: 'নিরাপত্তা ও ২এফএ', href: '/dashboard/security', icon: Shield, groupEn: 'Account & Support', groupBn: 'সহায়তা ও অ্যাকাউন্ট' },
      { id: 'profile', labelEn: 'Profile', labelBn: 'প্রোফাইল', href: '/dashboard#profile', icon: User, groupEn: 'Account & Support', groupBn: 'সহায়তা ও অ্যাকাউন্ট' },
      { id: 'settings', labelEn: 'Settings', labelBn: 'সেটিংস', href: '/dashboard/security', icon: Settings, groupEn: 'Account & Support', groupBn: 'সহায়তা ও অ্যাকাউন্ট' },
    ],
    groups: [
      {
        groupEn: 'Main',
        groupBn: 'মূল মেনু',
        items: [
          { id: 'home', labelEn: 'Home', labelBn: 'হোম', href: '/dashboard', icon: Home, exact: true },
          { id: 'buy-gold', labelEn: 'Buy Gold', labelBn: 'স্বর্ণ ক্রয়', href: '/dashboard/trade?type=BUY', icon: ShoppingBag },
          { id: 'sell-gold', labelEn: 'Sell Gold', labelBn: 'স্বর্ণ বিক্রয়', href: '/dashboard/trade?type=SELL', icon: Coins },
        ],
      },
      {
        groupEn: 'Vault & Savings',
        groupBn: 'ভল্ট ও সঞ্চয়',
        items: [
          { id: 'my-gold', labelEn: 'My Gold', labelBn: 'আমার স্বর্ণ', href: '/dashboard/portfolio', icon: PieChart },
          { id: 'goals', labelEn: 'Savings Goals', labelBn: 'সঞ্চয় লক্ষ্য', href: '/dashboard/goals', icon: Target },
          { id: 'autosave', labelEn: 'AutoSave', labelBn: 'অটোসেভ কিস্তি', href: '/dashboard/auto-save', icon: Repeat },
          { id: 'transactions', labelEn: 'Transactions', labelBn: 'লেনদেন বিবরণী', href: '/dashboard#activity', icon: Receipt },
        ],
      },
      {
        groupEn: 'Intelligence & Tools',
        groupBn: 'টুলস ও তথ্য',
        items: [
          { id: 'passport', labelEn: 'Gold Passport', labelBn: 'গোল্ড পাসপোর্ট', href: '/dashboard/gold-passport', icon: Award },
          { id: 'calculator', labelEn: 'Gold Calculator', labelBn: 'স্বর্ণ ক্যালকুলেটর', href: '/dashboard/simulator', icon: Calculator },
        ],
      },
      {
        groupEn: 'Account & Support',
        groupBn: 'সহায়তা ও অ্যাকাউন্ট',
        items: [
          { id: 'learn', labelEn: 'Learn', labelBn: 'গোল্ড একাডেমি', href: '/dashboard/academy', icon: BookOpen },
          { id: 'support', labelEn: 'Support', labelBn: 'গ্রাহক সহায়তা', href: '/dashboard/support', icon: Headphones },
          { id: 'security', labelEn: 'Security', labelBn: 'নিরাপত্তা', href: '/dashboard/security', icon: Shield },
          { id: 'settings', labelEn: 'Settings', labelBn: 'সেটিংস', href: '/dashboard/security', icon: Settings },
        ],
      },
    ],
    primaryNav: [
      { id: 'home', labelEn: 'Home', labelBn: 'হোম', href: '/dashboard', icon: Home, exact: true },
      { id: 'trade', labelEn: 'Buy Gold', labelBn: 'স্বর্ণ ক্রয়', href: '/dashboard/trade?type=BUY', icon: ShoppingBag },
      { id: 'my-gold', labelEn: 'My Gold', labelBn: 'আমার স্বর্ণ', href: '/dashboard/portfolio', icon: PieChart },
      { id: 'goals', labelEn: 'Goals', labelBn: 'সঞ্চয় লক্ষ্য', href: '/dashboard/goals', icon: Target },
    ],
    moreNav: [],
  },

  [Role.SUPER_ADMIN]: {
    role: Role.SUPER_ADMIN,
    roleTitleEn: 'Super Administrator',
    roleTitleBn: 'সুপার অ্যাডমিন',
    navItems: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/admin', icon: Home, exact: true, groupEn: 'Platform Controls', groupBn: 'প্ল্যাটফর্ম নিয়ন্ত্রণ' },
      { id: 'users', labelEn: 'Users', labelBn: 'গ্রাহক তালিকা', href: '/staff/admin#users', icon: Users, groupEn: 'Platform Controls', groupBn: 'প্ল্যাটফর্ম নিয়ন্ত্রণ' },
      { id: 'operations', labelEn: 'Operations', labelBn: 'ট্রেজারি ও অপস', href: '/staff/operations', icon: Building, groupEn: 'Financial Operations', groupBn: 'আর্থিক কার্যক্রম' },
      { id: 'alerts', labelEn: 'Alerts', labelBn: 'জরুরি অ্যালার্ট', href: '/staff/admin#emergency', icon: AlertTriangle, groupEn: 'Risk & Compliance', groupBn: 'ঝুঁকি ও কমপ্লায়েন্স' },
      { id: 'audit-logs', labelEn: 'Audit Logs', labelBn: 'অডিট রেকর্ড', href: '/staff/auditor', icon: FileSearch, groupEn: 'Risk & Compliance', groupBn: 'ঝুঁকি ও কমপ্লায়েন্স' },
      { id: 'settings', labelEn: 'Settings', labelBn: 'সিস্টেম সেটিংস', href: '/staff/admin#settings', icon: Settings, groupEn: 'System', groupBn: 'সিস্টেম' },
      { id: 'emergency', labelEn: 'Emergency Controls', labelBn: 'জরুরি সুইচ', href: '/staff/admin#emergency', icon: Power, groupEn: 'System', groupBn: 'সিস্টেম' },
    ],
    groups: [
      {
        groupEn: 'Platform Controls',
        groupBn: 'প্ল্যাটফর্ম নিয়ন্ত্রণ',
        items: [
          { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/admin', icon: Home, exact: true },
          { id: 'users', labelEn: 'Users', labelBn: 'গ্রাহক তালিকা', href: '/staff/admin#users', icon: Users },
          { id: 'operations', labelEn: 'Operations', labelBn: 'ট্রেজারি ও অপস', href: '/staff/operations', icon: Building },
        ],
      },
      {
        groupEn: 'Risk & Compliance',
        groupBn: 'ঝুঁকি ও কমপ্লায়েন্স',
        items: [
          { id: 'alerts', labelEn: 'Alerts', labelBn: 'জরুরি অ্যালার্ট', href: '/staff/admin#emergency', icon: AlertTriangle },
          { id: 'audit-logs', labelEn: 'Audit Logs', labelBn: 'অডিট রেকর্ড', href: '/staff/auditor', icon: FileSearch },
        ],
      },
      {
        groupEn: 'System Governance',
        groupBn: 'সিস্টেম পরিচালনা',
        items: [
          { id: 'settings', labelEn: 'Settings', labelBn: 'সিস্টেম সেটিংস', href: '/staff/admin#settings', icon: Settings },
          { id: 'emergency', labelEn: 'Emergency Controls', labelBn: 'জরুরি সুইচ', href: '/staff/admin#emergency', icon: Power },
        ],
      },
    ],
    primaryNav: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/admin', icon: Home, exact: true },
      { id: 'users', labelEn: 'Users', labelBn: 'গ্রাহক তালিকা', href: '/staff/admin#users', icon: Users },
      { id: 'operations', labelEn: 'Operations', labelBn: 'ট্রেজারি ও অপস', href: '/staff/operations', icon: Building },
    ],
    moreNav: [],
  },

  [Role.ADMIN]: {
    role: Role.ADMIN,
    roleTitleEn: 'Administrator',
    roleTitleBn: 'অ্যাডমিনিস্ট্রেটর',
    navItems: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/admin', icon: Home, exact: true, groupEn: 'Platform Controls', groupBn: 'প্ল্যাটফর্ম নিয়ন্ত্রণ' },
      { id: 'users', labelEn: 'Users', labelBn: 'গ্রাহক তালিকা', href: '/staff/admin#users', icon: Users, groupEn: 'Platform Controls', groupBn: 'প্ল্যাটফর্ম নিয়ন্ত্রণ' },
      { id: 'operations', labelEn: 'Operations', labelBn: 'ট্রেজারি ও অপস', href: '/staff/operations', icon: Building, groupEn: 'Financial Operations', groupBn: 'আর্থিক কার্যক্রম' },
      { id: 'alerts', labelEn: 'Alerts', labelBn: 'জরুরি অ্যালার্ট', href: '/staff/admin#emergency', icon: AlertTriangle, groupEn: 'Risk & Compliance', groupBn: 'ঝুঁকি ও কমপ্লায়েন্স' },
      { id: 'audit-logs', labelEn: 'Audit Logs', labelBn: 'অডিট রেকর্ড', href: '/staff/auditor', icon: FileSearch, groupEn: 'Risk & Compliance', groupBn: 'ঝুঁকি ও কমপ্লায়েন্স' },
      { id: 'settings', labelEn: 'Settings', labelBn: 'সিস্টেম সেটিংস', href: '/staff/admin#settings', icon: Settings, groupEn: 'System', groupBn: 'সিস্টেম' },
      { id: 'emergency', labelEn: 'Emergency Controls', labelBn: 'জরুরি সুইচ', href: '/staff/admin#emergency', icon: Power, groupEn: 'System', groupBn: 'সিস্টেম' },
    ],
    groups: [
      {
        groupEn: 'Platform Controls',
        groupBn: 'প্ল্যাটফর্ম নিয়ন্ত্রণ',
        items: [
          { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/admin', icon: Home, exact: true },
          { id: 'users', labelEn: 'Users', labelBn: 'গ্রাহক তালিকা', href: '/staff/admin#users', icon: Users },
          { id: 'operations', labelEn: 'Operations', labelBn: 'ট্রেজারি ও অপস', href: '/staff/operations', icon: Building },
        ],
      },
      {
        groupEn: 'Risk & Compliance',
        groupBn: 'ঝুঁকি ও কমপ্লায়েন্স',
        items: [
          { id: 'alerts', labelEn: 'Alerts', labelBn: 'জরুরি অ্যালার্ট', href: '/staff/admin#emergency', icon: AlertTriangle },
          { id: 'audit-logs', labelEn: 'Audit Logs', labelBn: 'অডিট রেকর্ড', href: '/staff/auditor', icon: FileSearch },
          { id: 'settings', labelEn: 'Settings', labelBn: 'সিস্টেম সেটিংস', href: '/staff/admin#settings', icon: Settings },
        ],
      },
    ],
    primaryNav: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/admin', icon: Home, exact: true },
      { id: 'users', labelEn: 'Users', labelBn: 'গ্রাহক তালিকা', href: '/staff/admin#users', icon: Users },
    ],
    moreNav: [],
  },

  [Role.KYC_OFFICER]: {
    role: Role.KYC_OFFICER,
    roleTitleEn: 'KYC & Compliance Officer',
    roleTitleBn: 'কেওয়াইসি অফিসার',
    navItems: [
      { id: 'queue', labelEn: 'Queue', labelBn: 'রিভিউ কিউ', href: '/staff/compliance', icon: CheckCircle2, exact: true, groupEn: 'Verification Workflow', groupBn: 'যাচাইকরণ' },
      { id: 'cases', labelEn: 'Cases', labelBn: 'ভেরিফিকেশন', href: '/staff/compliance#cases', icon: Eye, groupEn: 'Verification Workflow', groupBn: 'যাচাইকরণ' },
      { id: 'review', labelEn: 'Review', labelBn: 'নথিপত্র যাচাই', href: '/staff/compliance#review', icon: FileText, groupEn: 'Verification Workflow', groupBn: 'যাচাইকরণ' },
      { id: 'escalations', labelEn: 'Escalations', labelBn: 'ঝুঁকিপূর্ণ কেস', href: '/staff/compliance#escalations', icon: AlertTriangle, groupEn: 'Compliance & Risk', groupBn: 'কমপ্লায়েন্স ও ঝুঁকি' },
      { id: 'documents', labelEn: 'Documents', labelBn: 'নথিপত্র ভল্ট', href: '/staff/compliance#docs', icon: FileCheck2, groupEn: 'Compliance & Risk', groupBn: 'কমপ্লায়েন্স ও ঝুঁকি' },
      { id: 'copilot', labelEn: 'AI Copilot', labelBn: 'এআই কোপাইলট', href: '/staff/compliance#copilot', icon: Sparkles, groupEn: 'Intelligence', groupBn: 'ইন্টেলিজেন্স' },
      { id: 'reports', labelEn: 'Reports', labelBn: 'বিএফআইইউ রিপোর্ট', href: '/staff/compliance#reports', icon: FileSearch, groupEn: 'Intelligence', groupBn: 'ইন্টেলিজেন্স' },
      { id: 'settings', labelEn: 'Settings', labelBn: 'সেটিংস', href: '/security', icon: Settings, groupEn: 'System', groupBn: 'সিস্টেম' },
    ],
    groups: [
      {
        groupEn: 'Verification Workflow',
        groupBn: 'যাচাইকরণ প্রক্রিয়া',
        items: [
          { id: 'queue', labelEn: 'Queue', labelBn: 'রিভিউ কিউ', href: '/staff/compliance', icon: CheckCircle2, exact: true },
          { id: 'cases', labelEn: 'Cases', labelBn: 'ভেরিফিকেশন', href: '/staff/compliance#cases', icon: Eye },
          { id: 'review', labelEn: 'Review', labelBn: 'নথিপত্র যাচাই', href: '/staff/compliance#review', icon: FileText },
        ],
      },
      {
        groupEn: 'Compliance & Intelligence',
        groupBn: 'কমপ্লায়েন্স ও বিশ্লেষণ',
        items: [
          { id: 'escalations', labelEn: 'Escalations', labelBn: 'ঝুঁকিপূর্ণ কেস', href: '/staff/compliance#escalations', icon: AlertTriangle },
          { id: 'documents', labelEn: 'Documents', labelBn: 'নথিপত্র ভল্ট', href: '/staff/compliance#docs', icon: FileCheck2 },
          { id: 'copilot', labelEn: 'AI Copilot', labelBn: 'এআই কোপাইলট', href: '/staff/compliance#copilot', icon: Sparkles },
          { id: 'reports', labelEn: 'Reports', labelBn: 'বিএফআইইউ রিপোর্ট', href: '/staff/compliance#reports', icon: FileSearch },
        ],
      },
    ],
    primaryNav: [
      { id: 'queue', labelEn: 'Queue', labelBn: 'রিভিউ কিউ', href: '/staff/compliance', icon: CheckCircle2, exact: true },
      { id: 'cases', labelEn: 'Cases', labelBn: 'ভেরিফিকেশন', href: '/staff/compliance#cases', icon: Eye },
    ],
    moreNav: [],
  },

  [Role.FINANCE_OFFICER]: {
    role: Role.FINANCE_OFFICER,
    roleTitleEn: 'Treasury & Operations Officer',
    roleTitleBn: 'ট্রেজারি ও অপস অফিসার',
    navItems: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/operations', icon: Home, exact: true, groupEn: 'Treasury & Ledger', groupBn: 'ট্রেজারি ও লেজার' },
      { id: 'reconciliation', labelEn: 'Reconciliation', labelBn: 'রিকনসিলিয়েশন', href: '/staff/operations#reconciliation', icon: Scale, groupEn: 'Treasury & Ledger', groupBn: 'ট্রেজারি ও লেজার' },
      { id: 'ledger', labelEn: 'Ledger', labelBn: 'অর্ডার খতিয়ান', href: '/staff/operations#orders', icon: FileText, groupEn: 'Treasury & Ledger', groupBn: 'ট্রেজারি ও লেজার' },
      { id: 'exceptions', labelEn: 'Exceptions', labelBn: 'পেমেন্ট বিরোধ', href: '/staff/operations#disputes', icon: AlertTriangle, groupEn: 'Auditing & Controls', groupBn: 'নিরীক্ষা ও নিয়ন্ত্রণ' },
      { id: 'reports', labelEn: 'Reports', labelBn: 'সেটেলমেন্ট রিপোর্ট', href: '/staff/operations#reports', icon: Receipt, groupEn: 'Auditing & Controls', groupBn: 'নিরীক্ষা ও নিয়ন্ত্রণ' },
      { id: 'treasury', labelEn: 'Treasury', labelBn: 'ভল্ট ব্যালান্স', href: '/staff/operations#treasury', icon: Coins, groupEn: 'Auditing & Controls', groupBn: 'নিরীক্ষা ও নিয়ন্ত্রণ' },
      { id: 'settings', labelEn: 'Settings', labelBn: 'সেটিংস', href: '/security', icon: Settings, groupEn: 'System', groupBn: 'সিস্টেম' },
    ],
    groups: [
      {
        groupEn: 'Treasury & Settlement',
        groupBn: 'ট্রেজারি ও নিষ্পত্তি',
        items: [
          { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/operations', icon: Home, exact: true },
          { id: 'reconciliation', labelEn: 'Reconciliation', labelBn: 'রিকনসিলিয়েশন', href: '/staff/operations#reconciliation', icon: Scale },
          { id: 'ledger', labelEn: 'Ledger', labelBn: 'অর্ডার খতিয়ান', href: '/staff/operations#orders', icon: FileText },
        ],
      },
      {
        groupEn: 'Auditing & Risk',
        groupBn: 'নিরীক্ষা ও ঝুঁকি',
        items: [
          { id: 'exceptions', labelEn: 'Exceptions', labelBn: 'পেমেন্ট বিরোধ', href: '/staff/operations#disputes', icon: AlertTriangle },
          { id: 'reports', labelEn: 'Reports', labelBn: 'সেটেলমেন্ট রিপোর্ট', href: '/staff/operations#reports', icon: Receipt },
          { id: 'treasury', labelEn: 'Treasury', labelBn: 'ভল্ট ব্যালান্স', href: '/staff/operations#treasury', icon: Coins },
        ],
      },
    ],
    primaryNav: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/operations', icon: Home, exact: true },
      { id: 'reconciliation', labelEn: 'Reconciliation', labelBn: 'রিকনসিলিয়েশন', href: '/staff/operations#reconciliation', icon: Scale },
    ],
    moreNav: [],
  },

  [Role.SUPPORT_AGENT]: {
    role: Role.SUPPORT_AGENT,
    roleTitleEn: 'Concierge Support Specialist',
    roleTitleBn: 'সাপোর্ট স্পেশালিস্ট',
    navItems: [
      { id: 'inbox', labelEn: 'Inbox', labelBn: 'টিকেট ইনবক্স', href: '/staff/support', icon: Headphones, exact: true, groupEn: 'Ticket Operations', groupBn: 'টিকেট কার্যক্রম' },
      { id: 'tickets', labelEn: 'Tickets', labelBn: 'খোলা টিকেট', href: '/staff/support#tickets', icon: FileText, groupEn: 'Ticket Operations', groupBn: 'টিকেট কার্যক্রম' },
      { id: 'customers', labelEn: 'Customers', labelBn: 'গ্রাহক অনুসন্ধান', href: '/staff/support#customers', icon: Users, groupEn: 'Ticket Operations', groupBn: 'টিকেট কার্যক্রম' },
      { id: 'escalations', labelEn: 'Escalations', labelBn: 'বিরোধ এসকেলেশন', href: '/staff/support#escalations', icon: AlertTriangle, groupEn: 'Escalation & Resolution', groupBn: 'এসকেলেশন ও সমাধান' },
      { id: 'templates', labelEn: 'Templates', labelBn: 'বার্তা টেমপ্লেট', href: '/staff/support#templates', icon: FileCheck2, groupEn: 'Escalation & Resolution', groupBn: 'এসকেলেশন ও সমাধান' },
      { id: 'copilot', labelEn: 'AI Copilot', labelBn: 'এআই খসড়া', href: '/staff/support#copilot', icon: Sparkles, groupEn: 'Intelligence', groupBn: 'ইন্টেলিজেন্স' },
      { id: 'settings', labelEn: 'Settings', labelBn: 'সেটিংস', href: '/security', icon: Settings, groupEn: 'System', groupBn: 'সিস্টেম' },
    ],
    groups: [
      {
        groupEn: 'Concierge Inquiries',
        groupBn: 'গ্রাহক সহায়তা',
        items: [
          { id: 'inbox', labelEn: 'Inbox', labelBn: 'টিকেট ইনবক্স', href: '/staff/support', icon: Headphones, exact: true },
          { id: 'tickets', labelEn: 'Tickets', labelBn: 'খোলা টিকেট', href: '/staff/support#tickets', icon: FileText },
          { id: 'customers', labelEn: 'Customers', labelBn: 'গ্রাহক অনুসন্ধান', href: '/staff/support#customers', icon: Users },
        ],
      },
      {
        groupEn: 'Escalations & Intelligence',
        groupBn: 'এসকেলেশন ও ড্রাফটিং',
        items: [
          { id: 'escalations', labelEn: 'Escalations', labelBn: 'বিরোধ এসকেলেশন', href: '/staff/support#escalations', icon: AlertTriangle },
          { id: 'templates', labelEn: 'Templates', labelBn: 'বার্তা টেমপ্লেট', href: '/staff/support#templates', icon: FileCheck2 },
          { id: 'copilot', labelEn: 'AI Copilot', labelBn: 'এআই খসড়া', href: '/staff/support#copilot', icon: Sparkles },
        ],
      },
    ],
    primaryNav: [
      { id: 'inbox', labelEn: 'Inbox', labelBn: 'টিকেট ইনবক্স', href: '/staff/support', icon: Headphones, exact: true },
      { id: 'tickets', labelEn: 'Tickets', labelBn: 'খোলা টিকেট', href: '/staff/support#tickets', icon: FileText },
    ],
    moreNav: [],
  },

  [Role.AUDITOR]: {
    role: Role.AUDITOR,
    roleTitleEn: 'External Auditor',
    roleTitleBn: 'নিরপেক্ষ নিরীক্ষক',
    navItems: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/auditor', icon: Home, exact: true, groupEn: 'Audit Verification', groupBn: 'নিরীক্ষা কার্যক্রম' },
      { id: 'evidence', labelEn: 'Evidence', labelBn: 'প্রমাণপত্র', href: '/staff/auditor#evidence', icon: FileSearch, groupEn: 'Audit Verification', groupBn: 'নিরীক্ষা কার্যক্রম' },
      { id: 'ledger-audit', labelEn: 'Ledger Audit', labelBn: 'লেজার যাচাই', href: '/staff/auditor#events', icon: Scale, groupEn: 'Audit Verification', groupBn: 'নিরীক্ষা কার্যক্রম' },
      { id: 'reports', labelEn: 'Reports', labelBn: 'নিরীক্ষা রিপোর্ট', href: '/staff/auditor#reports', icon: FileText, groupEn: 'Cryptographic Integrity', groupBn: 'ক্রিপ্টোগ্রাফিক সুরক্ষা' },
      { id: 'verification', labelEn: 'Verification', labelBn: 'চেইন ভেরিফিকেশন', href: '/staff/auditor#verify', icon: CheckCircle2, groupEn: 'Cryptographic Integrity', groupBn: 'ক্রিপ্টোগ্রাফিক সুরক্ষা' },
      { id: 'exports', labelEn: 'Exports', labelBn: 'অডিট এক্সপোর্ট', href: '/staff/auditor#exports', icon: Download, groupEn: 'Cryptographic Integrity', groupBn: 'ক্রিপ্টোগ্রাফিক সুরক্ষা' },
      { id: 'settings', labelEn: 'Settings', labelBn: 'সেটিংস', href: '/staff/auditor#settings', icon: Settings, groupEn: 'System', groupBn: 'সিস্টেম' },
    ],
    groups: [
      {
        groupEn: 'Audit Verification',
        groupBn: 'নিরীক্ষা কার্যক্রম',
        items: [
          { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/auditor', icon: Home, exact: true },
          { id: 'evidence', labelEn: 'Evidence', labelBn: 'প্রমাণপত্র', href: '/staff/auditor#evidence', icon: FileSearch },
          { id: 'ledger-audit', labelEn: 'Ledger Audit', labelBn: 'লেজার যাচাই', href: '/staff/auditor#events', icon: Scale },
        ],
      },
      {
        groupEn: 'Integrity & Reports',
        groupBn: 'সুরক্ষা ও রিপোর্ট',
        items: [
          { id: 'reports', labelEn: 'Reports', labelBn: 'নিরীক্ষা রিপোর্ট', href: '/staff/auditor#reports', icon: FileText },
          { id: 'verification', labelEn: 'Verification', labelBn: 'চেইন ভেরিফিকেশন', href: '/staff/auditor#verify', icon: CheckCircle2 },
          { id: 'exports', labelEn: 'Exports', labelBn: 'অডিট এক্সপোর্ট', href: '/staff/auditor#exports', icon: Download },
        ],
      },
    ],
    primaryNav: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/auditor', icon: Home, exact: true },
      { id: 'evidence', labelEn: 'Evidence', labelBn: 'প্রমাণপত্র', href: '/staff/auditor#evidence', icon: FileSearch },
    ],
    moreNav: [],
  },
};

export function getRoleNavConfig(role?: Role): RoleNavConfig {
  if (!role || !ROLE_NAVIGATION_CONFIGS[role]) {
    return ROLE_NAVIGATION_CONFIGS[Role.CUSTOMER];
  }
  return ROLE_NAVIGATION_CONFIGS[role];
}

export function getRoleDashboardRoute(role?: Role): string {
  if (!role) return '/dashboard';
  switch (role) {
    case Role.SUPER_ADMIN:
    case Role.ADMIN:
      return '/staff/admin';
    case Role.KYC_OFFICER:
      return '/staff/compliance';
    case Role.FINANCE_OFFICER:
      return '/staff/operations';
    case Role.SUPPORT_AGENT:
      return '/staff/support';
    case Role.AUDITOR:
      return '/staff/auditor';
    case Role.CUSTOMER:
    default:
      return '/dashboard';
  }
}
