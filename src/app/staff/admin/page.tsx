'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import {
  Role,
  PurityGrade,
  DualApprovalOperation,
  DualApprovalStatus,
  VaultCustodyStatus,
  PurchaseOrderStatus,
  CmsContentType,
} from '../../../shared';
import { formatBDT, formatGoldWeight, formatDateTime } from '../../../lib/utils';
import StaffHeader from '../../../components/StaffHeader';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../../components/ui/States';
import {
  Home,
  Users,
  Coins,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Building,
  Scale,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle,
  Power,
  Sparkles,
  FileText,
  Plus,
  BookOpen,
  Sliders,
  DollarSign,
  Award,
  Layers,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { CommerceAdminControl } from '../../../components/commerce/CommerceAdminControl';

type AdminTab =
  | 'overview'
  | 'margins'
  | 'suppliers'
  | 'vault'
  | 'users'
  | 'approvals'
  | 'ai'
  | 'cms'
  | 'emergency'
  | 'commerce';

export default function SuperAdminControlCenter() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [margins, setMargins] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [vaultRecords, setVaultRecords] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [cmsItems, setCmsItems] = useState<any[]>([]);
  const [aiConfig, setAiConfig] = useState<any>(null);
  const [emergencySettings, setEmergencySettings] = useState<any[]>([]);

  // Filters & search
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [cmsFilter, setCmsFilter] = useState<string>('');

  // Modals / Form states
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    licenseNumber: '',
    currentBidQuotePoishaPerGram: 1205000,
    currentAskQuotePoishaPerGram: 1225000,
  });

  const [showPoModal, setShowPoModal] = useState(false);
  const [newPo, setNewPo] = useState({
    supplierId: '',
    supplierName: '',
    purity: PurityGrade.K24,
    weightGrams: 100,
    ratePerGramPoisha: 1225000,
    paymentReference: '',
  });

  const [showVaultModal, setShowVaultModal] = useState(false);
  const [newVaultBar, setNewVaultBar] = useState({
    barSerialNumber: '',
    purity: PurityGrade.K24,
    weightGrams: 100,
    vaultLocation: 'Gulshan-2 Depository, Dhaka',
    depositoryPartner: 'SecureVault Bangladesh Ltd.',
    assayCertificateNumber: '',
    notes: '',
  });

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [newApproval, setNewApproval] = useState({
    operationType: DualApprovalOperation.EMERGENCY_KILLSWITCH,
    payloadKey: 'HALT_ALL_TRADING',
    payloadValue: true,
    reason: '',
  });

  const [showCmsModal, setShowCmsModal] = useState(false);
  const [newCms, setNewCms] = useState({
    slug: '',
    contentType: CmsContentType.ANNOUNCEMENT,
    titleEn: '',
    titleBn: '',
    bodyEn: '',
    bodyBn: '',
    priorityOrder: 1,
  });

  // Load all platform data
  const loadAllData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);
      setError(null);

      const [
        ovRes,
        marRes,
        supRes,
        poRes,
        vltRes,
        usrRes,
        appRes,
        cmsRes,
        aiRes,
        setRes,
      ] = await Promise.all([
        apiRequest<{ success: boolean; data: any }>('/admin/overview').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/admin/margins').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/admin/suppliers').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/admin/purchase-orders').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/admin/vault-custody').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/admin/users').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/admin/dual-approvals').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/admin/cms').catch(() => null),
        apiRequest<{ success: boolean; data: any }>('/admin/ai/config').catch(() => null),
        apiRequest<{ success: boolean; data: any[] }>('/admin/settings').catch(() => null),
      ]);

      if (ovRes?.success) setOverview(ovRes.data);
      if (marRes?.success && Array.isArray(marRes.data)) setMargins(marRes.data);
      if (supRes?.success && Array.isArray(supRes.data)) setSuppliers(supRes.data);
      if (poRes?.success && Array.isArray(poRes.data)) setPurchaseOrders(poRes.data);
      if (vltRes?.success && Array.isArray(vltRes.data)) setVaultRecords(vltRes.data);
      if (usrRes?.success && Array.isArray(usrRes.data)) setUsersList(usrRes.data);
      if (appRes?.success && Array.isArray(appRes.data)) setApprovals(appRes.data);
      if (cmsRes?.success && Array.isArray(cmsRes.data)) setCmsItems(cmsRes.data);
      if (aiRes?.success) setAiConfig(aiRes.data);

      if (setRes?.success && Array.isArray(setRes.data)) {
        setEmergencySettings(setRes.data);
      }
    } catch (err: any) {
      console.error('Super Admin Data Load Error:', err);
      setError('Unable to load authoritative Super Admin telemetry.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (
      !authLoading &&
      (!user || (user.role !== Role.SUPER_ADMIN && user.role !== Role.ADMIN))
    ) {
      router.push('/login');
      return;
    }
    if (user) loadAllData();
  }, [user, authLoading, router]);

  // Tab switching helper based on URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as AdminTab;
      if (
        [
          'overview',
          'margins',
          'suppliers',
          'vault',
          'users',
          'approvals',
          'ai',
          'cms',
          'emergency',
        ].includes(hash)
      ) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Action handlers
  const handleToggleUserStatus = async (targetUserId: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/admin/users/${targetUserId}/status`, {
        method: 'POST',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      setUsersList((prev) =>
        prev.map((u) => (u._id === targetUserId ? { ...u, isActive: !currentStatus } : u)),
      );
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleFreezeUser = async (targetUserId: string, currentFrozen: boolean) => {
    const reason = window.prompt(
      currentFrozen
        ? 'Enter reason for unfreezing customer account:'
        : 'Enter mandatory compliance/security reason for freezing customer account:',
      currentFrozen ? 'Audit cleared, unfreezing customer trading.' : 'AML Suspicion / Security Freeze',
    );
    if (!reason || !reason.trim()) return;

    try {
      await apiRequest(`/admin/users/${targetUserId}/freeze`, {
        method: 'POST',
        body: JSON.stringify({ isFrozen: !currentFrozen, reason: reason.trim() }),
      });
      setUsersList((prev) =>
        prev.map((u) =>
          u._id === targetUserId
            ? { ...u, isAccountFrozen: !currentFrozen, frozenReason: !currentFrozen ? reason : null }
            : u,
        ),
      );
    } catch (err: any) {
      alert(err.message || 'Account freeze modification failed');
    }
  };

  const handleUpdateRole = async (targetUserId: string, newRole: Role) => {
    if (!window.confirm(`Elevate/change user role to ${newRole}?`)) return;
    try {
      await apiRequest(`/admin/users/${targetUserId}/role`, {
        method: 'POST',
        body: JSON.stringify({ role: newRole }),
      });
      setUsersList((prev) =>
        prev.map((u) => (u._id === targetUserId ? { ...u, role: newRole } : u)),
      );
    } catch (err: any) {
      alert(err.message || 'Role update failed');
    }
  };

  const handleToggleSetting = async (key: string, currentValue: boolean) => {
    const reason = window.prompt(`Provide justification for altering killswitch [${key}]:`, 'Operational adjustment');
    if (reason === null) return;

    try {
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          key,
          value: !currentValue,
          description: `Super Admin toggle: ${reason}`,
        }),
      });
      setEmergencySettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value: !currentValue } : s)),
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update setting');
    }
  };

  const handleDecideApproval = async (requestId: string, decision: 'APPROVED' | 'REJECTED') => {
    const note = window.prompt(
      `Provide reviewer decision note for ${decision}:`,
      decision === 'APPROVED' ? 'Approved after reviewing compliance risk criteria.' : 'Rejected due to risk policy violation.',
    );
    if (!note || !note.trim()) return;

    try {
      await apiRequest(`/admin/dual-approvals/${requestId}/decide`, {
        method: 'POST',
        body: JSON.stringify({ decision, note: note.trim() }),
      });
      loadAllData(true);
    } catch (err: any) {
      alert(err.message || 'Dual approval decision failed');
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/suppliers', {
        method: 'POST',
        body: JSON.stringify(newSupplier),
      });
      setShowSupplierModal(false);
      loadAllData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to save supplier');
    }
  };

  const handleCreatePo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/purchase-orders', {
        method: 'POST',
        body: JSON.stringify(newPo),
      });
      setShowPoModal(false);
      loadAllData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to create PO');
    }
  };

  const handleAddVaultBar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/vault-custody', {
        method: 'POST',
        body: JSON.stringify(newVaultBar),
      });
      setShowVaultModal(false);
      loadAllData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to register vaulted bar');
    }
  };

  const handleCreateApprovalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/dual-approvals', {
        method: 'POST',
        body: JSON.stringify({
          operationType: newApproval.operationType,
          payload: { key: newApproval.payloadKey, value: newApproval.payloadValue },
          reason: newApproval.reason,
        }),
      });
      setShowApprovalModal(false);
      loadAllData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit dual-approval request');
    }
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/cms', {
        method: 'POST',
        body: JSON.stringify(newCms),
      });
      setShowCmsModal(false);
      loadAllData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to save CMS article');
    }
  };

  const handleSaveAiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/ai/config', {
        method: 'POST',
        body: JSON.stringify(aiConfig),
      });
      alert('AI Advisor parameters updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update AI config');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = usersList.filter((u) => {
    const matchesRole = !userRoleFilter || u.role === userRoleFilter;
    const q = userSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const filteredCms = cmsItems.filter((c) => !cmsFilter || c.contentType === cmsFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-aurum-border">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-aurum-gold font-bold">
              AurumSave Sovereign Command Center
            </span>
            <Badge variant="gold" size="sm">
              SUPER_ADMIN PRIVILEGED
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-aurum-text tracking-tight">
            Super Administrator Control Center
          </h1>
          <p className="text-sm text-aurum-text-muted mt-1 max-w-2xl">
            Authoritative fintech telemetry, physical vault reserve coverage, unit economics,
            four-eyes maker-checker workflows, and bilingual content management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadAllData(true)}
            disabled={isRefreshing}
            className="flex items-center space-x-2 border-aurum-border hover:border-aurum-gold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Live Refresh'}</span>
          </Button>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] font-mono text-aurum-text-dim uppercase tracking-wider">
              Vault Coverage Ratio
            </span>
            <span
              className={`text-sm font-mono font-bold ${
                (overview?.vaultCoverageRatio || 100) >= 100 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {overview?.vaultCoverageRatio || 100}% Backed
            </span>
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => loadAllData()} />}

      {/* Primary Tab Navigation */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-aurum-border/60">
        {[
          { id: 'overview', label: '1. Overview & Health', icon: Home },
          { id: 'margins', label: '2. Pricing & Margins', icon: TrendingUp },
          { id: 'suppliers', label: '3. Wholesale Suppliers & POs', icon: Building },
          { id: 'vault', label: '4. Physical Vault Custody', icon: Scale },
          { id: 'users', label: '5. Users & Restrictions', icon: Users },
          { id: 'approvals', label: '6. Dual Approval (4-Eyes)', icon: ShieldCheck, badge: overview?.pendingDualApprovalsCount },
          { id: 'ai', label: '7. AI Advisor Studio', icon: Sparkles },
          { id: 'cms', label: '8. Bilingual CMS Studio', icon: FileText },
          { id: 'emergency', label: '9. Kill-Switches & Flags', icon: Power },
          { id: 'commerce', label: '10. Dual Commerce & Marketplace', icon: ShoppingBag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                window.location.hash = tab.id;
              }}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-aurum-gold/15 text-aurum-gold border border-aurum-gold/40 shadow-sm'
                  : 'text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface/50 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ml-1">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & HEALTH METRICS */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card glow hoverLift>
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
                Physical Vault Stock
              </span>
              <div className="text-3xl font-bold font-mono text-aurum-gold">
                {formatGoldWeight(overview?.totalVaultPhysicalGrams || 0)}
              </div>
              <span className="text-xs text-emerald-400 mt-2 block font-mono font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                <span>Gulshan-2 Class-III Vault Deposited</span>
              </span>
            </Card>

            <Card hoverLift>
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
                Customer Gold Liabilities
              </span>
              <div className="text-3xl font-bold font-mono text-aurum-text">
                {formatGoldWeight(overview?.totalCustomerLiabilitiesGrams || 0)}
              </div>
              <span className="text-xs text-aurum-text-muted mt-2 block font-mono">
                Double-Entry Ledger Backed (1:1 Ratio)
              </span>
            </Card>

            <Card hoverLift>
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
                Gross Merchandise Value (GMV)
              </span>
              <div className="text-3xl font-bold font-mono text-emerald-400">
                {formatBDT(overview?.totalVolumeBdt || 0)}
              </div>
              <span className="text-xs text-aurum-text-dim mt-2 block font-mono">
                Buy: {formatBDT(overview?.totalBuyVolumeBdt || 0)} | Sell: {formatBDT(overview?.totalSellVolumeBdt || 0)}
              </span>
            </Card>

            <Card hoverLift>
              <span className="text-[10px] uppercase font-mono tracking-wider text-aurum-text-dim font-bold block mb-1">
                Platform Service Margin Revenue
              </span>
              <div className="text-3xl font-bold font-mono text-aurum-gold">
                {formatBDT(overview?.totalPlatformFeesBdt || 0)}
              </div>
              <span className="text-xs text-aurum-text-muted mt-2 block font-mono">
                0.50% Custody & Trading Spread Revenue
              </span>
            </Card>
          </div>

          {/* Reserve Health Banner */}
          <div
            className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              overview?.isVaultFullyBacked
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/30 border-rose-500/50'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  overview?.isVaultFullyBacked
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-aurum-text">
                  Vault Reserve Backing Status:{' '}
                  <span className={overview?.isVaultFullyBacked ? 'text-emerald-400' : 'text-rose-400'}>
                    {overview?.isVaultFullyBacked ? '100% Fully Backed & Verified' : 'CRITICAL DEFICIT DETECTED'}
                  </span>
                </h3>
                <p className="text-xs text-aurum-text-muted mt-1">
                  Physical Vault Inventory:{' '}
                  <strong className="text-aurum-gold font-mono">{overview?.totalVaultPhysicalGrams || 0}g</strong> vs
                  Customer Book Liabilities:{' '}
                  <strong className="text-aurum-text font-mono">{overview?.totalCustomerLiabilitiesGrams || 0}g</strong>.
                  Surplus Coverage:{' '}
                  <strong className="text-emerald-400 font-mono">
                    {Math.max(0, (overview?.totalVaultPhysicalGrams || 0) - (overview?.totalCustomerLiabilitiesGrams || 0)).toFixed(3)}g
                  </strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/staff/operations')}
                className="border-aurum-border hover:border-aurum-gold text-xs"
              >
                Inspect Ledger Reconciliation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: GOLD PRICING & MARGIN ANALYSIS */}
      {/* ========================================================= */}
      {activeTab === 'margins' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  Unit Economics & Sourcing Margin Calculator
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  Real-time comparison of retail selling price vs lowest registered wholesale refinery quote.
                </p>
              </div>
              <Badge variant="gold" size="sm">
                Live BAJUS & Refinery Sync
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                    <th className="py-3 px-4 font-bold">Purity Grade</th>
                    <th className="py-3 px-4 font-bold">Retail Sell Price (Customer Pays)</th>
                    <th className="py-3 px-4 font-bold">Best Supplier Sourcing Cost</th>
                    <th className="py-3 px-4 font-bold">Refinery Source</th>
                    <th className="py-3 px-4 font-bold">Gross Margin / g</th>
                    <th className="py-3 px-4 font-bold">Margin %</th>
                    <th className="py-3 px-4 font-bold">Net Margin (Post 1.5% MDR)</th>
                    <th className="py-3 px-4 font-bold text-right">Risk Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurum-border/60">
                  {margins.map((m) => (
                    <tr key={m.purity} className="hover:bg-aurum-surface/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-aurum-gold font-mono text-sm">
                        {m.purity} Gold
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-aurum-text">
                        ৳{m.retailSellPricePerGramBdt?.toLocaleString()} / g
                      </td>
                      <td className="py-3.5 px-4 font-mono text-aurum-text-muted">
                        ৳{m.sourcingCostPerGramBdt?.toLocaleString()} / g
                      </td>
                      <td className="py-3.5 px-4 text-aurum-text-dim">{m.bestSupplierName}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        +৳{m.grossMarginPerGramBdt}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {m.grossMarginPercentage}%
                      </td>
                      <td
                        className={`py-3.5 px-4 font-mono font-bold ${
                          m.netContributionMarginBdt >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        ৳{m.netContributionMarginBdt} / g
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge
                          variant={
                            m.marginHealth === 'HEALTHY'
                              ? 'emerald'
                              : m.marginHealth === 'TIGHT_SPREAD'
                              ? 'amber'
                              : 'rose'
                          }
                          size="sm"
                        >
                          {m.marginHealth}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: WHOLESALE SUPPLIERS & PURCHASE ORDERS */}
      {/* ========================================================= */}
      {activeTab === 'suppliers' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Suppliers Table */}
          <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  Licensed Bullion Refineries & Wholesale Vendors
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  Authoritative suppliers for wholesale inventory procurement and spot liquidity.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setShowSupplierModal(true)}
                  className="flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Supplier</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPoModal(true)}
                  className="flex items-center space-x-1.5 border-aurum-border hover:border-aurum-gold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Initiate PO</span>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                    <th className="py-3 px-4 font-bold">Supplier ID</th>
                    <th className="py-3 px-4 font-bold">Refinery / Partner Name</th>
                    <th className="py-3 px-4 font-bold">License #</th>
                    <th className="py-3 px-4 font-bold">Contact</th>
                    <th className="py-3 px-4 font-bold">Current Sourcing Quote (Ask)</th>
                    <th className="py-3 px-4 font-bold">Buyback Quote (Bid)</th>
                    <th className="py-3 px-4 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurum-border/60">
                  {suppliers.map((s) => (
                    <tr key={s.supplierId} className="hover:bg-aurum-surface/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-aurum-gold">
                        {s.supplierId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-aurum-text">{s.name}</td>
                      <td className="py-3.5 px-4 font-mono text-aurum-text-dim">{s.licenseNumber}</td>
                      <td className="py-3.5 px-4 text-aurum-text-muted">
                        <div>{s.contactPerson}</div>
                        <div className="font-mono text-[10px] text-aurum-text-dim">{s.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ৳{(s.currentAskQuotePoishaPerGram / 100).toLocaleString()} / g
                      </td>
                      <td className="py-3.5 px-4 font-mono text-aurum-text-dim">
                        ৳{(s.currentBidQuotePoishaPerGram / 100).toLocaleString()} / g
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge variant={s.isActive ? 'emerald' : 'slate'} size="sm">
                          {s.isActive ? 'ACTIVE' : 'SUSPENDED'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchase Orders Table */}
          <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  Wholesale Bullion Purchase Orders (POs)
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  Procurement history, refinery invoices, and settlement confirmation.
                </p>
              </div>
            </div>

            {purchaseOrders.length === 0 ? (
              <EmptyState
                icon={<Building className="w-7 h-7" />}
                title="No Purchase Orders"
                description="No wholesale purchase orders have been initiated yet."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                      <th className="py-3 px-4 font-bold">PO #</th>
                      <th className="py-3 px-4 font-bold">Supplier</th>
                      <th className="py-3 px-4 font-bold">Purity & Weight</th>
                      <th className="py-3 px-4 font-bold">Total Amount</th>
                      <th className="py-3 px-4 font-bold">Payment Reference</th>
                      <th className="py-3 px-4 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-aurum-border/60">
                    {purchaseOrders.map((p) => (
                      <tr key={p.poNumber} className="hover:bg-aurum-surface/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-aurum-gold">{p.poNumber}</td>
                        <td className="py-3.5 px-4 font-semibold text-aurum-text">{p.supplierName}</td>
                        <td className="py-3.5 px-4 font-mono text-aurum-text">
                          {p.weightGrams}g ({p.purity})
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          ৳{(p.totalPoisha / 100).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-aurum-text-dim">
                          {p.paymentReference || 'PENDING_BANK_TRF'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Badge
                            variant={p.status === 'SETTLED' ? 'emerald' : 'amber'}
                            size="sm"
                          >
                            {p.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PHYSICAL VAULT CUSTODY & BAR REGISTRY */}
      {/* ========================================================= */}
      {activeTab === 'vault' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  Physical Vault Bullion Registry & Assay Hallmark Records
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  Serialized bullion bars held in Class-III Gulshan vault depository backing client accounts.
                </p>
              </div>

              <Button
                variant="gold"
                size="sm"
                onClick={() => setShowVaultModal(true)}
                className="flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Bullion Bar</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                    <th className="py-3 px-4 font-bold">Bar Serial #</th>
                    <th className="py-3 px-4 font-bold">Purity & Weight</th>
                    <th className="py-3 px-4 font-bold">Assay Hallmark Cert #</th>
                    <th className="py-3 px-4 font-bold">Depository Vault Location</th>
                    <th className="py-3 px-4 font-bold">Custodian Partner</th>
                    <th className="py-3 px-4 font-bold text-right">Custody State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurum-border/60">
                  {vaultRecords.map((v) => (
                    <tr key={v.recordId} className="hover:bg-aurum-surface/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-aurum-gold">
                        {v.barSerialNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-aurum-text">
                        {v.weightGrams}g ({v.purity})
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400">
                        {v.assayCertificateNumber}
                      </td>
                      <td className="py-3.5 px-4 text-aurum-text-muted">{v.vaultLocation}</td>
                      <td className="py-3.5 px-4 text-aurum-text-dim">{v.depositoryPartner}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge variant="emerald" size="sm">
                          {v.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: USERS & RESTRICTIONS */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  Customer & Privilege Management
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  Audit identity records, execute emergency account freezes, or modify administrative roles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-aurum-text-dim" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 w-48 sm:w-64"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text font-semibold focus:outline-none focus:border-aurum-gold/60"
                >
                  <option value="">All Roles</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="KYC_OFFICER">KYC Officer</option>
                  <option value="FINANCE_OFFICER">Finance Officer</option>
                  <option value="SUPPORT_AGENT">Support Agent</option>
                  <option value="AUDITOR">Auditor</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                    <th className="py-3 px-4 font-bold">User</th>
                    <th className="py-3 px-4 font-bold">Email</th>
                    <th className="py-3 px-4 font-bold">Role</th>
                    <th className="py-3 px-4 font-bold">KYC Tier</th>
                    <th className="py-3 px-4 font-bold">Freeze Status</th>
                    <th className="py-3 px-4 font-bold">State</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurum-border/60">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-aurum-surface/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-aurum-text">{u.fullName}</td>
                      <td className="py-3.5 px-4 font-mono text-aurum-text-muted">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u._id, e.target.value as Role)}
                          disabled={user?.role !== Role.SUPER_ADMIN}
                          className="bg-aurum-surface border border-aurum-border text-xs rounded-lg px-2 py-1 text-aurum-text font-mono focus:outline-none"
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="KYC_OFFICER">KYC_OFFICER</option>
                          <option value="FINANCE_OFFICER">FINANCE_OFFICER</option>
                          <option value="SUPPORT_AGENT">SUPPORT_AGENT</option>
                          <option value="AUDITOR">AUDITOR</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={u.kycStatus === 'APPROVED' ? 'emerald' : u.kycStatus === 'PENDING_REVIEW' ? 'amber' : 'slate'}
                          size="sm"
                        >
                          {u.kycStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.isAccountFrozen ? (
                          <span className="inline-flex items-center space-x-1 text-rose-400 font-bold">
                            <Lock className="w-3.5 h-3.5" />
                            <span>FROZEN</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-emerald-400">
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Normal</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={u.isActive !== false ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {u.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleFreezeUser(u._id, Boolean(u.isAccountFrozen))}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                            u.isAccountFrozen
                              ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                              : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                          }`}
                        >
                          {u.isAccountFrozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                        {u.role !== Role.SUPER_ADMIN && (
                          <button
                            onClick={() => handleToggleUserStatus(u._id, u.isActive !== false)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                              u.isActive !== false
                                ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                                : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                          >
                            {u.isActive !== false ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: FOUR-EYES MAKER-CHECKER DUAL APPROVAL */}
      {/* ========================================================= */}
      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  Four-Eyes Maker-Checker Dual Approval Queue
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  High-risk operations (price overrides, account unfreezes, circuit breakers) require authorization from a distinct administrator.
                </p>
              </div>

              <Button
                variant="gold"
                size="sm"
                onClick={() => setShowApprovalModal(true)}
                className="flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit High-Risk Request</span>
              </Button>
            </div>

            {approvals.length === 0 ? (
              <EmptyState
                icon={<ShieldCheck className="w-7 h-7" />}
                title="No Dual-Approval Requests"
                description="All high-risk administrative workflows are currently cleared and verified."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-aurum-border text-aurum-text-dim uppercase font-mono tracking-wider">
                      <th className="py-3 px-4 font-bold">Request ID</th>
                      <th className="py-3 px-4 font-bold">Operation Type</th>
                      <th className="py-3 px-4 font-bold">Proposed Details</th>
                      <th className="py-3 px-4 font-bold">Maker (Initiator)</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Checker Decision</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-aurum-border/60">
                    {approvals.map((a) => {
                      const isPending = a.status === 'PENDING';
                      const isOwnRequest = a.makerId === user?.id;

                      return (
                        <tr key={a.requestId} className="hover:bg-aurum-surface/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-aurum-gold">{a.requestId}</td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-aurum-text">{a.operationType}</td>
                          <td className="py-3.5 px-4 text-aurum-text-muted max-w-xs truncate">
                            {JSON.stringify(a.payload)}
                            <div className="text-[10px] text-aurum-text-dim font-sans italic">Reason: {a.reason}</div>
                          </td>
                          <td className="py-3.5 px-4 text-aurum-text">
                            <div>{a.makerName || a.makerId}</div>
                            <div className="text-[10px] text-aurum-text-dim font-mono">{a.makerRole}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge
                              variant={a.status === 'APPROVED' ? 'emerald' : a.status === 'PENDING' ? 'amber' : 'rose'}
                              size="sm"
                            >
                              {a.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-aurum-text-dim text-[11px]">
                            {a.checkerName ? (
                              <div>
                                Decided by: <strong className="text-aurum-text">{a.checkerName}</strong>
                                {a.decisionNote && <div className="italic text-[10px]">{a.decisionNote}</div>}
                              </div>
                            ) : (
                              'Pending Checker Review'
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleDecideApproval(a.requestId, 'APPROVED')}
                                  disabled={isOwnRequest}
                                  title={isOwnRequest ? 'Segregation of duties: You cannot approve your own request' : 'Approve'}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                    isOwnRequest
                                      ? 'bg-aurum-surface text-aurum-text-dim border border-aurum-border cursor-not-allowed'
                                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                                  }`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleDecideApproval(a.requestId, 'REJECTED')}
                                  disabled={isOwnRequest}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                    isOwnRequest
                                      ? 'bg-aurum-surface text-aurum-text-dim border border-aurum-border cursor-not-allowed'
                                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                                  }`}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: AI ADVISOR STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'ai' && (
        <div className="space-y-6 animate-fadeIn">
          <form
            onSubmit={handleSaveAiConfig}
            className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-aurum-gold" />
                  <span>Grounded AI Bullion Advisor Configuration</span>
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  Tune model intelligence parameters, strict grounding constraints, and fallback behavior.
                </p>
              </div>

              <Button type="submit" variant="gold" size="sm">
                Save AI Parameters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-aurum-text block mb-1.5">Prompt Version Tag</label>
                <input
                  type="text"
                  value={aiConfig?.promptVersion || ''}
                  onChange={(e) => setAiConfig({ ...aiConfig, promptVersion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-aurum-text block mb-1.5">Model Engine</label>
                <input
                  type="text"
                  value={aiConfig?.modelEngine || 'gemini-1.5-pro'}
                  onChange={(e) => setAiConfig({ ...aiConfig, modelEngine: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-aurum-text block mb-1.5">
                  Temperature: {aiConfig?.temperature || 0.2}
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={aiConfig?.temperature || 0.2}
                  onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-aurum-gold"
                />
                <span className="text-[10px] text-aurum-text-dim block mt-1">
                  Low values (0.1 - 0.3) enforce strictly factual, grounded financial calculations.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-aurum-text block mb-1.5">
                  Risk Review Escalation Threshold ({aiConfig?.riskReviewThreshold || 0.85})
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={aiConfig?.riskReviewThreshold || 0.85}
                  onChange={(e) => setAiConfig({ ...aiConfig, riskReviewThreshold: parseFloat(e.target.value) })}
                  className="w-full accent-aurum-gold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-aurum-text block mb-1.5">
                  Fallback Guidance Message (English)
                </label>
                <textarea
                  rows={2}
                  value={aiConfig?.fallbackMessageEn || ''}
                  onChange={(e) => setAiConfig({ ...aiConfig, fallbackMessageEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-aurum-text block mb-1.5">
                  Fallback Guidance Message (Bengali)
                </label>
                <textarea
                  rows={2}
                  value={aiConfig?.fallbackMessageBn || ''}
                  onChange={(e) => setAiConfig({ ...aiConfig, fallbackMessageBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 8: BILINGUAL CMS STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'cms' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  Bilingual CMS Studio & Content Publishing
                </h3>
                <p className="text-xs text-aurum-text-muted mt-0.5">
                  Manage announcements, hero alerts, FAQs, and Gold Academy educational articles in English and Bengali.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={cmsFilter}
                  onChange={(e) => setCmsFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text font-semibold focus:outline-none"
                >
                  <option value="">All Content Types</option>
                  <option value="ANNOUNCEMENT">Announcements</option>
                  <option value="FAQ">FAQs</option>
                  <option value="ACADEMY_ARTICLE">Academy Articles</option>
                  <option value="BANNER">Hero Banners</option>
                </select>

                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setShowCmsModal(true)}
                  className="flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Content</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCms.map((item) => (
                <div
                  key={item.slug}
                  className="p-5 rounded-2xl bg-aurum-surface border border-aurum-border/80 flex flex-col justify-between space-y-4 hover:border-aurum-gold/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="gold" size="sm">
                        {item.contentType}
                      </Badge>
                      <span className="text-[10px] font-mono text-aurum-text-dim">
                        Priority: {item.priorityOrder}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-aurum-text line-clamp-1">{item.titleEn}</h4>
                    <h5 className="font-semibold text-xs text-aurum-gold line-clamp-1 mt-0.5">{item.titleBn}</h5>

                    <p className="text-xs text-aurum-text-muted line-clamp-3 mt-2 leading-relaxed">
                      {item.bodyEn}
                    </p>
                    <p className="text-xs text-aurum-text-dim line-clamp-2 mt-1 italic">
                      {item.bodyBn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-aurum-border/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-aurum-text-dim">{item.slug}</span>
                    <Badge variant={item.isPublished ? 'emerald' : 'slate'} size="sm">
                      {item.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 9: KILL-SWITCHES & EMERGENCY CONTROLS */}
      {/* ========================================================= */}
      {activeTab === 'emergency' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 shadow-card-luxury space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                    Emergency Circuit Breakers & Gateway Controls
                  </h3>
                  <p className="text-xs text-aurum-text-muted">
                    Immediate operational freezes during market volatility or payment provider outages.
                  </p>
                </div>
              </div>

              <Badge variant="rose" size="sm">
                IMMUTABLE AUDIT LOGGED
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencySettings.map((s) => (
                <div
                  key={s.key}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    s.value === true && (s.key.includes('PAUSE') || s.key.includes('HALT') || s.key.includes('MAINTENANCE'))
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                      : 'bg-aurum-surface border-aurum-border text-aurum-text'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block text-aurum-text">{s.key}</span>
                    <span className="text-xs text-aurum-text-muted mt-1 block leading-snug">
                      {s.description || 'Platform configuration switch'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-aurum-border/60">
                    <span className="text-[10px] font-mono text-aurum-text-dim">
                      Status: {String(s.value)}
                    </span>
                    <button
                      onClick={() => handleToggleSetting(s.key, Boolean(s.value))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        Boolean(s.value)
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                      }`}
                    >
                      {Boolean(s.value) ? 'SWITCH OFF' : 'SWITCH ON'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 10: DUAL COMMERCE & MARKETPLACE CONTROL CENTER */}
      {/* ========================================================= */}
      {activeTab === 'commerce' && (
        <div className="space-y-6 animate-fadeIn">
          <CommerceAdminControl />
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REGISTER SUPPLIER */}
      {/* ========================================================= */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSupplier}
            className="w-full max-w-lg rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Register Wholesale Bullion Supplier
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-aurum-text block mb-1">Company / Refinery Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangladesh Bullion Refinery Ltd."
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                  />
                </div>
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Trade License Number</label>
                  <input
                    type="text"
                    required
                    value={newSupplier.licenseNumber}
                    onChange={(e) => setNewSupplier({ ...newSupplier, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Sourcing Rate / g (BDT)</label>
                  <input
                    type="number"
                    required
                    value={newSupplier.currentAskQuotePoishaPerGram / 100}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        currentAskQuotePoishaPerGram: parseFloat(e.target.value) * 100,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Buyback Rate / g (BDT)</label>
                  <input
                    type="number"
                    required
                    value={newSupplier.currentBidQuotePoishaPerGram / 100}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        currentBidQuotePoishaPerGram: parseFloat(e.target.value) * 100,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-aurum-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowSupplierModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Save Supplier
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INITIATE PURCHASE ORDER */}
      {/* ========================================================= */}
      {showPoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePo}
            className="w-full max-w-lg rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Initiate Wholesale Purchase Order
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-aurum-text block mb-1">Select Bullion Supplier</label>
                <select
                  required
                  value={newPo.supplierId}
                  onChange={(e) => {
                    const sup = suppliers.find((s) => s.supplierId === e.target.value);
                    setNewPo({
                      ...newPo,
                      supplierId: e.target.value,
                      supplierName: sup ? sup.name : '',
                      ratePerGramPoisha: sup ? sup.currentAskQuotePoishaPerGram : 1225000,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s.supplierId} value={s.supplierId}>
                      {s.name} ({s.supplierId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Purity Grade</label>
                  <select
                    value={newPo.purity}
                    onChange={(e) => setNewPo({ ...newPo, purity: e.target.value as PurityGrade })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  >
                    <option value="24K">24K (99.9% Pure)</option>
                    <option value="22K">22K (91.6% Pure)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Procurement Weight (Grams)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={newPo.weightGrams}
                    onChange={(e) => setNewPo({ ...newPo, weightGrams: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Payment Reference / Bank RTGS</label>
                <input
                  type="text"
                  placeholder="e.g. CITYBANK-RTGS-2026-9901"
                  value={newPo.paymentReference}
                  onChange={(e) => setNewPo({ ...newPo, paymentReference: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-aurum-surface border border-aurum-border/60">
                <span className="text-[10px] uppercase font-mono text-aurum-text-dim block mb-1">
                  Estimated Total Outlay
                </span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  ৳{((newPo.weightGrams * (newPo.ratePerGramPoisha / 100)) || 0).toLocaleString()} BDT
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-aurum-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowPoModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Issue Purchase Order
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REGISTER VAULT BULLION BAR */}
      {/* ========================================================= */}
      {showVaultModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddVaultBar}
            className="w-full max-w-lg rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Register Physical Vault Bullion Bar
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-aurum-text block mb-1">Bar Serial Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PAMP-SUISSE-9999-90214"
                  value={newVaultBar.barSerialNumber}
                  onChange={(e) => setNewVaultBar({ ...newVaultBar, barSerialNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Purity Grade</label>
                  <select
                    value={newVaultBar.purity}
                    onChange={(e) => setNewVaultBar({ ...newVaultBar, purity: e.target.value as PurityGrade })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  >
                    <option value="24K">24K (99.9% Pure)</option>
                    <option value="22K">22K (91.6% Pure)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Weight (Grams)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={newVaultBar.weightGrams}
                    onChange={(e) => setNewVaultBar({ ...newVaultBar, weightGrams: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Assay Hallmark Certificate #</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSTI-HALLMARK-2026-8812"
                  value={newVaultBar.assayCertificateNumber}
                  onChange={(e) => setNewVaultBar({ ...newVaultBar, assayCertificateNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Vault Depository Location</label>
                <input
                  type="text"
                  value={newVaultBar.vaultLocation}
                  onChange={(e) => setNewVaultBar({ ...newVaultBar, vaultLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-aurum-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowVaultModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Commit to Vault Custody
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE DUAL APPROVAL REQUEST */}
      {/* ========================================================= */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateApprovalRequest}
            className="w-full max-w-lg rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Submit Dual-Approval High-Risk Request
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-aurum-text block mb-1">High-Risk Operation</label>
                <select
                  value={newApproval.operationType}
                  onChange={(e) =>
                    setNewApproval({ ...newApproval, operationType: e.target.value as DualApprovalOperation })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                >
                  <option value="EMERGENCY_KILLSWITCH">EMERGENCY_KILLSWITCH</option>
                  <option value="PRICE_OVERRIDE">PRICE_OVERRIDE</option>
                  <option value="ACCOUNT_UNFREEZE">ACCOUNT_UNFREEZE</option>
                  <option value="LEDGER_ADJUSTMENT">LEDGER_ADJUSTMENT</option>
                  <option value="TREASURY_TRANSFER">TREASURY_TRANSFER</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Target Key / Account Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HALT_ALL_TRADING or Target User ID"
                  value={newApproval.payloadKey}
                  onChange={(e) => setNewApproval({ ...newApproval, payloadKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Mandatory Justification Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this high-risk override is necessary..."
                  value={newApproval.reason}
                  onChange={(e) => setNewApproval({ ...newApproval, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-aurum-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Submit Request (Awaiting 2nd Key)
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE BILINGUAL CMS CONTENT */}
      {/* ========================================================= */}
      {showCmsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCms}
            className="w-full max-w-xl rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
              Publish Bilingual Content
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Content Type</label>
                  <select
                    value={newCms.contentType}
                    onChange={(e) => setNewCms({ ...newCms, contentType: e.target.value as CmsContentType })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  >
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="FAQ">FAQ</option>
                    <option value="ACADEMY_ARTICLE">ACADEMY_ARTICLE</option>
                    <option value="BANNER">BANNER</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-aurum-text block mb-1">Unique Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. eid-bullion-special"
                    value={newCms.slug}
                    onChange={(e) => setNewCms({ ...newCms, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={newCms.titleEn}
                  onChange={(e) => setNewCms({ ...newCms, titleEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                />
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Title (Bengali)</label>
                <input
                  type="text"
                  required
                  value={newCms.titleBn}
                  onChange={(e) => setNewCms({ ...newCms, titleBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                />
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Body Text (English)</label>
                <textarea
                  rows={3}
                  required
                  value={newCms.bodyEn}
                  onChange={(e) => setNewCms({ ...newCms, bodyEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                />
              </div>

              <div>
                <label className="font-bold text-aurum-text block mb-1">Body Text (Bengali)</label>
                <textarea
                  rows={3}
                  required
                  value={newCms.bodyBn}
                  onChange={(e) => setNewCms({ ...newCms, bodyBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-aurum-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCmsModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Publish to Live Platform
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
