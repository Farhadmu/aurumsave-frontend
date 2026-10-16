'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { Role } from '../../shared';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Key,
} from 'lucide-react';

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-aurum-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aurum-gold via-aurum-gold-light to-aurum-gold-dark flex items-center justify-center font-serif-luxury font-black text-aurum-midnight text-2xl mx-auto shadow-gold-glow">
            Au
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-aurum-text">
            Sign In to AurumSave
          </h1>
          <p className="text-xs text-aurum-text-muted">
            Access your sovereign bullion vault & allocated portfolio
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border-gold shadow-card-luxury space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-aurum-text-muted block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-aurum-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@aurumsave.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 focus:ring-1 focus:ring-aurum-gold/40 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-aurum-text-muted block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-aurum-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 focus:ring-1 focus:ring-aurum-gold/40 transition-all font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate & Unlock Vault
            </Button>
          </form>

          <div className="text-center text-xs text-aurum-text-muted pt-2 border-t border-aurum-border">
            Don&apos;t have a bullion account yet?{' '}
            <a href="/register" className="text-aurum-gold hover:underline font-semibold ml-1">
              Register Free
            </a>
          </div>
        </div>

        {/* Fast Role Switcher (Development & Staging Testing Only - Strictly Hidden in Production) */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="p-5 rounded-2xl bg-aurum-card/80 border border-aurum-border space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-aurum-text">
              <Key className="w-3.5 h-3.5 text-aurum-gold" />
              <span>One-Click Role Switcher (Evaluation Accounts)</span>
            </div>
            <p className="text-[11px] text-aurum-text-muted">
              Click any role to autofill test credentials:
            </p>

            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('customer@aurumsave.com', 'Aurum#Customer2026!')
                }
                className="p-2.5 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-left transition-all"
              >
                <span className="text-xs font-bold text-aurum-text block">Demo Customer</span>
                <span className="text-[10px] font-mono text-aurum-gold block">
                  customer@aurumsave.com
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('superadmin@aurumsave.com', 'Aurum#SuperAdmin2026!')
                }
                className="p-2.5 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-left transition-all"
              >
                <span className="text-xs font-bold text-aurum-text block">Super Administrator</span>
                <span className="text-[10px] font-mono text-aurum-gold block">
                  superadmin@aurumsave.com
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('compliance@aurumsave.com', 'Aurum#Compliance2026!')
                }
                className="p-2.5 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-left transition-all"
              >
                <span className="text-xs font-bold text-aurum-text block">KYC Compliance</span>
                <span className="text-[10px] font-mono text-aurum-gold block">
                  compliance@aurumsave.com
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('finance@aurumsave.com', 'Aurum#Finance2026!')
                }
                className="p-2.5 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-left transition-all"
              >
                <span className="text-xs font-bold text-aurum-text block">Finance & Treasury</span>
                <span className="text-[10px] font-mono text-aurum-gold block">
                  finance@aurumsave.com
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('support@aurumsave.com', 'Aurum#Support2026!')
                }
                className="p-2.5 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-left transition-all"
              >
                <span className="text-xs font-bold text-aurum-text block">Customer Concierge</span>
                <span className="text-[10px] font-mono text-aurum-gold block">
                  support@aurumsave.com
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('auditor@aurumsave.com', 'Aurum#Auditor2026!')
                }
                className="p-2.5 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/50 text-left transition-all"
              >
                <span className="text-xs font-bold text-aurum-text block">External Auditor</span>
                <span className="text-[10px] font-mono text-aurum-gold block">
                  auditor@aurumsave.com
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
