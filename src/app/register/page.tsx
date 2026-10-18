'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { Role } from '../../shared';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t('register.errPasswordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('register.errPasswordShort'));
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email,
        password,
        fullName,
        phone,
        role: Role.CUSTOMER,
      });
      router.push('/kyc?onboarding=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-aurum-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aurum-gold via-aurum-gold-light to-aurum-gold-dark flex items-center justify-center font-serif-luxury font-black text-aurum-midnight text-2xl mx-auto shadow-gold-glow">
            Au
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-aurum-text tracking-tight">
            {t('register.title')}
          </h1>
          <p className="text-xs text-aurum-text-muted">
            {t('register.subtitle')}
          </p>
        </div>

        {/* Register Card */}
        <div className="p-8 rounded-3xl bg-aurum-card border border-aurum-border-gold shadow-card-luxury space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-aurum-text-muted block mb-1.5">
                {t('register.fullName')} <span className="text-aurum-gold">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-aurum-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mohammad Rahim"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 focus:ring-1 focus:ring-aurum-gold/40 transition-all font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-aurum-text-muted block mb-1.5">
                  {t('register.email')} <span className="text-aurum-gold">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-aurum-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahim@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 focus:ring-1 focus:ring-aurum-gold/40 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-aurum-text-muted block mb-1.5">
                  {t('register.phone')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-aurum-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 focus:ring-1 focus:ring-aurum-gold/40 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-aurum-text-muted block mb-1.5">
                  {t('register.password')} <span className="text-aurum-gold">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-aurum-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 focus:ring-1 focus:ring-aurum-gold/40 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-aurum-text-dim hover:text-aurum-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-aurum-text-muted block mb-1.5">
                  {t('register.confirmPassword')} <span className="text-aurum-gold">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-aurum-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-dim focus:outline-none focus:border-aurum-gold/60 focus:ring-1 focus:ring-aurum-gold/40 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-aurum-text-muted">{t('register.strength')}</span>
                  <span
                    className={`font-bold ${
                      strength <= 50
                        ? 'text-rose-400'
                        : strength <= 75
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {strength <= 50 ? t('register.strengthWeak') : strength <= 75 ? t('register.strengthModerate') : t('register.strengthStrong')}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-aurum-surface rounded-full overflow-hidden border border-aurum-border">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 50
                        ? 'bg-rose-500'
                        : strength <= 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
            )}

            {/* Trust and Compliance Guarantee */}
            <div className="p-3.5 rounded-2xl bg-aurum-surface/60 border border-aurum-border text-[11px] text-aurum-text-muted space-y-1.5">
              <div className="flex items-center space-x-2 text-aurum-text font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('register.complianceTitle')}</span>
              </div>
              <p className="leading-relaxed">
                {t('register.complianceTerms')}
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('register.submit')}
            </Button>
          </form>

          <div className="text-center text-xs text-aurum-text-muted pt-2 border-t border-aurum-border">
            {t('register.alreadyHave')}{' '}
            <a href="/login" className="text-aurum-gold hover:underline font-semibold ml-1">
              {t('register.signIn')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
