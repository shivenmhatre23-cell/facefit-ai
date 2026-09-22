'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  ShieldCheck,
  Trash2,
  Check,
  EyeOff,
  User,
  LogOut,
  KeyRound,
  Server,
} from 'lucide-react';
import { getActiveSession, clearAuthSession, AuthSession } from '@/lib/auth/authStore';
import { AuthModal } from '@/components/auth/AuthModal';

export function SettingsContent() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [clearedSuccess, setClearedSuccess] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadSession = () => {
    setSession(getActiveSession());
  };

  useEffect(() => {
    loadSession();
    window.addEventListener('facefit_auth_changed', loadSession);
    return () => window.removeEventListener('facefit_auth_changed', loadSession);
  }, []);

  const handleSignOut = () => {
    clearAuthSession();
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear your saved Style Profile and bookmarks?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('facefit_active_profile');
        localStorage.removeItem('facefit_saved_hairstyles');
        localStorage.removeItem('facefit_saved_outfits');
        sessionStorage.removeItem('facefit_preview_image');
        window.dispatchEvent(new Event('facefit_saved_changed'));
        setClearedSuccess(true);
        setTimeout(() => setClearedSuccess(false), 2500);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Page Header */}
        <div className="pb-8 border-b border-neutral-200 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block mb-1">
            Preferences & Security
          </span>
          <h1 className="text-3xl font-serif-editorial font-bold text-neutral-900">
            Settings & Privacy
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review FaceFit AI's ephemeral data architecture and manage your active account session.
          </p>
        </div>

        <div className="space-y-8">
          {/* Account & Session Management */}
          <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-serif-editorial font-bold text-neutral-900">
                    Active Session & Identity
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {session && session.user.role === 'member'
                      ? 'Authenticated Stylist Member'
                      : 'Guest Explorer Session'}
                  </span>
                </div>
              </div>

              {session && session.user.role === 'member' ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Signed In
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200">
                  Guest Mode
                </span>
              )}
            </div>

            {session && session.user.role === 'member' ? (
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                      Member Account
                    </span>
                    <span className="font-semibold text-neutral-900">{session.user.name} ({session.user.email})</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-neutral-600 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <p className="text-neutral-600">
                  You are exploring in guest mode. Sign in to sync your lookbook and style parameters across multiple devices.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>

          {/* Privacy & Ephemeral Data Section */}
          <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif-editorial font-bold text-neutral-900">
                  Ephemeral Photo Privacy Architecture
                </h3>
                <span className="text-xs text-neutral-500">Zero Biometric Storage Guarantee</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              FaceFit AI processes photos strictly in-memory over an encrypted TLS connection. When your photo is analyzed by the multimodal vision pipeline, it is never saved to our disks, databases, or training datasets.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70">
                <span className="font-bold text-neutral-800 block mb-1">Zero Server Image Logging</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  Your raw portrait exists only for the duration of inference (~3 seconds) and is immediately discarded from memory.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70">
                <span className="font-bold text-neutral-800 block mb-1">Server-Side Key Isolation</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  All AI vision and stylist provider API keys reside strictly on backend environment variables, never accessible to client browser bundles.
                </p>
              </div>
            </div>
          </div>

          {/* Ethical AI Charter Policy */}
          <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif-editorial font-bold text-neutral-900">
                  Ethical AI Standards
                </h3>
                <span className="text-xs text-neutral-500">Objective Harmony, Never Judgment</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>
                  <strong>No Attractiveness Scoring:</strong> FaceFit AI does not grade symmetry or attractiveness out of 10. We evaluate optical balance to curate flattering silhouettes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>
                  <strong>Approximate Age Brackets:</strong> Age estimation is strictly represented as an approximate range with a confidence indicator and clearly labeled as an AI estimate.
                </span>
              </li>
            </ul>
          </div>

          {/* Local Data Management */}
          <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif-editorial font-bold text-neutral-900">
                    Local Device Storage
                  </h3>
                  <span className="text-xs text-neutral-500">Manage data stored in your browser</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed mb-6">
              Clearing local data will wipe your active Style Profile, saved haircuts, and bookmarked outfits from this device.
            </p>

            {clearedSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Local styling data cleared successfully!</span>
              </div>
            )}

            <button
              onClick={handleClearAllData}
              className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Local Profile & Saved Looks
            </button>
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}
