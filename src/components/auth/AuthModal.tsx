'use client';

import React, { useState, useEffect } from 'react';
import { authenticateUser, createGuestSession, AuthSession } from '@/lib/auth/authStore';
import { Lock, Mail, User, X, Check, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onSuccess?: (session: AuthSession) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  title = 'Sign In to FaceFit AI',
  subtitle = 'Access your personal style dossiers, saved cuts, and sync recommendations.',
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await authenticateUser(email, password);
      if (!res.success || !res.session) {
        setErrorMsg(res.error || 'Authentication failed. Please verify your details.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg(`Welcome back, ${res.session.user.name}!`);
      setTimeout(() => {
        setIsLoading(false);
        if (onSuccess) onSuccess(res.session!);
        onClose();
      }, 700);
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const session = createGuestSession();
    if (onSuccess) onSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-2xl p-6 sm:p-8 animate-scaleUp text-neutral-900"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
              FaceFit AI Membership
            </span>
            <h3 id="auth-modal-title" className="text-xl font-serif-editorial font-bold text-neutral-900">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          {subtitle}
        </p>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Remember session</span>
            </label>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-2"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already registered? Sign in'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{mode === 'signin' ? 'Sign In & Restore Looks' : 'Create Stylist Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Guest Session Bypass */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-col items-center gap-2 text-center">
          <span className="text-[11px] text-neutral-400">Or continue without signing in:</span>
          <button
            type="button"
            onClick={handleGuestLogin}
            className="text-xs text-neutral-700 hover:text-neutral-950 font-semibold hover:underline cursor-pointer"
          >
            Explore as Guest (Local Storage Mode)
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted TLS • Zero Biometric Face Storage Guarantee</span>
        </div>
      </div>
    </div>
  );
}
