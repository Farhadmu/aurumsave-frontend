import {
  Home,
  Coins,
  Target,
  Activity,
  MoreHorizontal,
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
  badgeCount?: number;
}

export interface RoleNavConfig {
  role: Role;
  roleTitleEn: string;
  roleTitleBn: string;
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
    primaryNav: [
      { id: 'home', labelEn: 'Home', labelBn: 'হোম', href: '/dashboard', icon: Home, exact: true },
      { id: 'trade', labelEn: 'Gold / Trade', labelBn: 'স্বর্ণ লেনদেন', href: '/trade', icon: Coins },
      { id: 'goals', labelEn: 'Goals', labelBn: 'সঞ্চয় লক্ষ্য', href: '/goals', icon: Target },
      { id: 'activity', labelEn: 'Activity', labelBn: 'লেনদেন বিবরণী', href: '/dashboard#activity', icon: Activity },
    ],
    moreNav: [
      {
        categoryEn: 'Wealth Intelligence',
        categoryBn: 'সম্পদ ও বিশ্লেষণ',
        items: [
          { id: 'portfolio', labelEn: 'Portfolio Insights', labelBn: 'পোর্টফোলিও বিশ্লেষণ', href: '/dashboard/portfolio', icon: PieChart },
          { id: 'autosave', labelEn: 'AutoSave (SIP)', labelBn: 'অটোসেভ কিস্তি', href: '/dashboard/auto-save', icon: Repeat },
          { id: 'gifts', labelEn: 'Gold Gifting', labelBn: 'স্বর্ণ উপহার', href: '/dashboard/gifts', icon: Gift },
          { id: 'simulator', labelEn: 'What-If Simulator', labelBn: 'সম্পদ সিমুলেটর', href: '/dashboard/simulator', icon: Calculator },
          { id: 'passport', labelEn: 'Gold Passport', labelBn: 'গোল্ড পাসপোর্ট', href: '/dashboard/gold-passport', icon: Award },
        ],
      },
      {
        categoryEn: 'Knowledge & Trust',
        categoryBn: 'শিক্ষা ও নিরাপত্তা',
        items: [
          { id: 'academy', labelEn: 'Gold Academy', labelBn: 'গোল্ড একাডেমি', href: '/academy', icon: FileText },
          { id: 'security', labelEn: 'Security & 2FA', labelBn: 'নিরাপত্তা ও ২এফএ', href: '/security', icon: Shield },
          { id: 'support', labelEn: 'Customer Concierge', labelBn: 'গ্রাহক সহায়তা', href: '/support', icon: HelpCircle },
        ],
      },
    ],
  },

  [Role.SUPER_ADMIN]: {
    role: Role.SUPER_ADMIN,
    roleTitleEn: 'Super Administrator',
    roleTitleBn: 'সুপার অ্যাডমিন',
    primaryNav: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/admin', icon: Home, exact: true },
      { id: 'users', labelEn: 'Users', labelBn: 'গ্রাহক তালিকা', href: '/staff/admin#users', icon: Users },
      { id: 'operations', labelEn: 'Operations', labelBn: 'অপারেশনস', href: '/staff/operations', icon: Scale },
      { id: 'alerts', labelEn: 'Alerts', labelBn: 'জরুরি অ্যালার্ট', href: '/staff/admin#emergency', icon: AlertTriangle },
    ],
    moreNav: [
      {
        categoryEn: 'Platform Governance',
        categoryBn: 'প্ল্যাটফর্ম পরিচালনা',
        items: [
          { id: 'compliance', labelEn: 'Compliance Queue', labelBn: 'কমপ্লায়েন্স রিভিউ', href: '/staff/compliance', icon: CheckCircle2 },
          { id: 'audits', labelEn: 'Audit Journal', labelBn: 'অডিট রেকর্ড', href: '/staff/auditor', icon: FileSearch },
          { id: 'support', labelEn: 'Support Tickets', labelBn: 'সাপোর্ট টিকিট', href: '/staff/support', icon: Headphones },
          { id: 'security', labelEn: 'Platform Security', labelBn: 'নিরাপত্তা সেটিংস', href: '/security', icon: Shield },
        ],
      },
    ],
  },

  [Role.ADMIN]: {
    role: Role.ADMIN,
    roleTitleEn: 'Administrator',
    roleTitleBn: 'অ্যাডমিনিস্ট্রেটর',
    primaryNav: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/admin', icon: Home, exact: true },
      { id: 'users', labelEn: 'Users', labelBn: 'গ্রাহক তালিকা', href: '/staff/admin#users', icon: Users },
      { id: 'operations', labelEn: 'Operations', labelBn: 'অপারেশনস', href: '/staff/operations', icon: Scale },
      { id: 'alerts', labelEn: 'Alerts', labelBn: 'জরুরি অ্যালার্ট', href: '/staff/admin#emergency', icon: AlertTriangle },
    ],
    moreNav: [
      {
        categoryEn: 'Administration',
        categoryBn: 'প্রশাসন',
        items: [
          { id: 'compliance', labelEn: 'Compliance Queue', labelBn: 'কমপ্লায়েন্স রিভিউ', href: '/staff/compliance', icon: CheckCircle2 },
          { id: 'support', labelEn: 'Support Tickets', labelBn: 'সাপোর্ট টিকিট', href: '/staff/support', icon: Headphones },
          { id: 'audits', labelEn: 'Audit Events', labelBn: 'অডিট ইভেন্ট', href: '/staff/auditor', icon: FileSearch },
        ],
      },
    ],
  },

  [Role.KYC_OFFICER]: {
    role: Role.KYC_OFFICER,
    roleTitleEn: 'KYC & Compliance Officer',
    roleTitleBn: 'কেওয়াইসি অফিসার',
    primaryNav: [
      { id: 'queue', labelEn: 'Queue', labelBn: 'রিভিউ কিউ', href: '/staff/compliance', icon: CheckCircle2, exact: true },
      { id: 'cases', labelEn: 'Cases', labelBn: 'ভেরিফিকেশন', href: '/staff/compliance#cases', icon: Eye },
      { id: 'review', labelEn: 'Review', labelBn: 'নথিপত্র যাচাই', href: '/staff/compliance#review', icon: FileText },
      { id: 'escalations', labelEn: 'Escalations', labelBn: 'ঝুঁকিপূর্ণ কেস', href: '/staff/compliance#escalations', icon: AlertTriangle },
    ],
    moreNav: [
      {
        categoryEn: 'Regulatory Standards',
        categoryBn: 'নিয়ম ও মানদণ্ড',
        items: [
          { id: 'bfiu', labelEn: 'BFIU Standards', labelBn: 'বিএফআইইউ গাইডলাইন', href: '/security', icon: Shield },
          { id: 'audits', labelEn: 'Audit Trail', labelBn: 'অডিট ট্রেইল', href: '/staff/auditor', icon: FileSearch },
        ],
      },
    ],
  },

  [Role.FINANCE_OFFICER]: {
    role: Role.FINANCE_OFFICER,
    roleTitleEn: 'Treasury & Operations Officer',
    roleTitleBn: 'ট্রেজারি ও অপস অফিসার',
    primaryNav: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', href: '/staff/operations', icon: Home, exact: true },
      { id: 'reconciliation', labelEn: 'Reconciliation', labelBn: 'রিকনসিলিয়েশন', href: '/staff/operations#reconciliation', icon: Scale },
      { id: 'ledger', labelEn: 'Ledger', labelBn: 'অর্ডার খতিয়ান', href: '/staff/operations#orders', icon: FileText },
      { id: 'exceptions', labelEn: 'Exceptions', labelBn: 'পেমেন্ট বিরোধ', href: '/staff/operations#disputes', icon: AlertTriangle },
    ],
    moreNav: [
      {
        categoryEn: 'Treasury Controls',
        categoryBn: 'ট্রেজারি নিয়ন্ত্রণ',
        items: [
          { id: 'gateways', labelEn: 'MFS Gateways (bKash/Nagad)', labelBn: 'এমএফএস গেটওয়ে', href: '/staff/admin#gateways', icon: CreditCard },
          { id: 'audit', labelEn: 'Ledger Audit Chain', labelBn: 'লেজার ভেরিফিকেশন', href: '/staff/auditor', icon: FileSearch },
        ],
      },
    ],
  },

  [Role.SUPPORT_AGENT]: {
    role: Role.SUPPORT_AGENT,
    roleTitleEn: 'Concierge Support Specialist',
    roleTitleBn: 'সাপোর্ট স্পেশালিস্ট',
    primaryNav: [
      { id: 'inbox', labelEn: 'Inbox', labelBn: 'টিকেট ইনবক্স', href: '/staff/support', icon: Headphones, exact: true },
      { id: 'tickets', labelEn: 'Tickets', labelBn: 'খোলা টিকেট', href: '/staff/support#tickets', icon: FileText },
      { id: 'customers', labelEn: 'Customers', labelBn: 'গ্রাহক অনুসন্ধান', href: '/staff/support#customers', icon: Users },
      { id: 'escalations', labelEn: 'Escalations', labelBn: 'বিরোধ এসকেলেশন', href: '/staff/support#escalations', icon: AlertTriangle },
    ],
    moreNav: [
      {
        categoryEn: 'Support Resources',
        categoryBn: 'সহায়তা রিসোর্স',
        items: [
          { id: 'academy', labelEn: 'Knowledge Base', labelBn: 'নলেজ বেস', href: '/academy', icon: FileText },
          { id: 'security', labelEn: 'Security Policy', labelBn: 'নিরাপত্তা পলিসি', href: '/security', icon: Shield },
        ],
      },
    ],
  },

  [Role.AUDITOR]: {
    role: Role.AUDITOR,
    roleTitleEn: 'External Auditor',
    roleTitleBn: 'নিরপেক্ষ নিরীক্ষক',
    primaryNav: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'নিরীক্ষা ড্যাশবোর্ড', href: '/staff/auditor', icon: Home, exact: true },
      { id: 'evidence', labelEn: 'Evidence', labelBn: 'প্রমাণপত্র', href: '/staff/auditor#evidence', icon: FileSearch },
      { id: 'ledger-audit', labelEn: 'Ledger Audit', labelBn: 'লেজার যাচাই', href: '/staff/auditor#events', icon: Scale },
      { id: 'reports', labelEn: 'Chain Verify', labelBn: 'চেইন ভেরিফিকেশন', href: '/staff/auditor#verify', icon: Shield },
    ],
    moreNav: [
      {
        categoryEn: 'Audit Evidence',
        categoryBn: 'অডিট প্রমাণাদি',
        items: [
          { id: 'operations-audit', labelEn: 'Treasury Reports', labelBn: 'ট্রেজারি খতিয়ান', href: '/staff/operations', icon: Scale },
          { id: 'compliance-audit', labelEn: 'BFIU Records', labelBn: 'বিএফআইইউ রিপোর্ট', href: '/staff/compliance', icon: CheckCircle2 },
        ],
      },
    ],
  },
};

export function getRoleNavConfig(role?: Role): RoleNavConfig {
  if (!role || !ROLE_NAVIGATION_CONFIGS[role]) {
    return ROLE_NAVIGATION_CONFIGS[Role.CUSTOMER];
  }
  return ROLE_NAVIGATION_CONFIGS[role];
}
