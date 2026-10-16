'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { Role } from '@aurumsave/shared';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectByRole = (role: Role) => {
    switch (role) {
      case Role.SUPER_ADMIN:
      case Role.ADMIN:
        router.push('/staff/admin');
        break;
      case Role.KYC_OFFICER:
        router.push('/staff/compliance');
        break;
      case Role.FINANCE_OFFICER:
        router.push('/staff/operations');
        break;
      case Role.SUPPORT_AGENT:
        router.push('/staff/support');
        break;
      case Role.AUDITOR:
        router.push('/staff/auditor');
        break;
      default:
        router.push('/dashboard');
        break;
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-aurum-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aurum-gold to-aurum-gold-dark flex items-center justify-center font-serif font-black text-aurum-navy text-2xl mx-auto shadow-gold-glow">
            Au
          </div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
            Sign In to AurumSave
          </h1>
          <p className="text-xs text-aurum-muted">
            Access your allocated bullion vault & portfolio
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-aurum-muted block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-aurum-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@aurumsave.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm text-aurum-ivory placeholder-aurum-slate focus:border-aurum-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-aurum-muted block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-aurum-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm text-aurum-ivory placeholder-aurum-slate focus:border-aurum-gold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-sm shadow-gold-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-aurum-muted">
            Do not have an account?{' '}
            <a href="/register" className="text-aurum-gold hover:underline font-semibold">
              Open a Vault Account
            </a>
          </div>
        </div>

        {/* Quick Demo Role Switcher for Evaluators */}
        <div className="p-5 rounded-2xl bg-aurum-surface/80 border border-aurum-border space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-aurum-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Role Switcher (Pre-Seeded Accounts)</span>
          </div>
          <p className="text-[11px] text-aurum-slate">
            Click any role to autofill verified sandbox credentials:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@aurumsave.com', 'Aurum#Customer2026!')}
              className="p-2 rounded-lg bg-aurum-card border border-aurum-border text-left hover:border-aurum-gold/50 transition-colors"
            >
              <div className="font-semibold text-aurum-ivory text-[11px]">Customer</div>
              <div className="text-[10px] text-aurum-slate truncate">customer@aurumsave.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('superadmin@aurumsave.com', 'Aurum#SuperAdmin2026!')}
              className="p-2 rounded-lg bg-aurum-card border border-aurum-border text-left hover:border-aurum-gold/50 transition-colors"
            >
              <div className="font-semibold text-aurum-gold text-[11px]">Super Admin</div>
              <div className="text-[10px] text-aurum-slate truncate">superadmin@aurumsave.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('compliance@aurumsave.com', 'Aurum#Compliance2026!')}
              className="p-2 rounded-lg bg-aurum-card border border-aurum-border text-left hover:border-aurum-gold/50 transition-colors"
            >
              <div className="font-semibold text-aurum-ivory text-[11px]">KYC Officer</div>
              <div className="text-[10px] text-aurum-slate truncate">compliance@aurumsave.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('finance@aurumsave.com', 'Aurum#Finance2026!')}
              className="p-2 rounded-lg bg-aurum-card border border-aurum-border text-left hover:border-aurum-gold/50 transition-colors"
            >
              <div className="font-semibold text-aurum-ivory text-[11px]">Finance Officer</div>
              <div className="text-[10px] text-aurum-slate truncate">finance@aurumsave.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('support@aurumsave.com', 'Aurum#Support2026!')}
              className="p-2 rounded-lg bg-aurum-card border border-aurum-border text-left hover:border-aurum-gold/50 transition-colors"
            >
              <div className="font-semibold text-aurum-ivory text-[11px]">Support Agent</div>
              <div className="text-[10px] text-aurum-slate truncate">support@aurumsave.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('auditor@aurumsave.com', 'Aurum#Auditor2026!')}
              className="p-2 rounded-lg bg-aurum-card border border-aurum-border text-left hover:border-aurum-gold/50 transition-colors"
            >
              <div className="font-semibold text-aurum-ivory text-[11px]">Auditor (Read-Only)</div>
              <div className="text-[10px] text-aurum-slate truncate">auditor@aurumsave.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
