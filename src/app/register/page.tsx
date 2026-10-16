'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { Role } from '@aurumsave/shared';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
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
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aurum-gold to-aurum-gold-dark flex items-center justify-center font-serif font-black text-aurum-navy text-2xl mx-auto shadow-gold-glow">
            Au
          </div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
            Open Your Gold Vault
          </h1>
          <p className="text-xs text-aurum-muted">
            Start micro-saving in 24K and 22K allocated bullion
          </p>
        </div>

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
                Full Name (As per NID)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-aurum-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mohammad Rahim"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm text-aurum-ivory placeholder-aurum-slate focus:border-aurum-gold focus:outline-none"
                />
              </div>
            </div>

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
                  placeholder="rahim@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm text-aurum-ivory placeholder-aurum-slate focus:border-aurum-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-aurum-muted block mb-1.5">
                Mobile Number (bKash/Nagad)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-aurum-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801712345678"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm text-aurum-ivory placeholder-aurum-slate focus:border-aurum-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-aurum-muted block mb-1.5">
                Vault Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-aurum-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm text-aurum-ivory placeholder-aurum-slate focus:border-aurum-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-aurum-muted block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-aurum-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-aurum-navy border border-aurum-border text-sm text-aurum-ivory placeholder-aurum-slate focus:border-aurum-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-aurum-surface text-[11px] text-aurum-muted space-y-1">
              <div className="flex items-center space-x-1.5 text-aurum-ivory font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Account Opening or Annual Maintenance Fees</span>
              </div>
              <p>
                By registering, you agree to AurumSave Terms of Custody & AML/KYC Verification.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-aurum-gold to-aurum-gold-light hover:brightness-110 text-aurum-navy font-bold text-sm shadow-gold-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating Vault Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-aurum-muted">
            Already have an account?{' '}
            <a href="/login" className="text-aurum-gold hover:underline font-semibold">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
