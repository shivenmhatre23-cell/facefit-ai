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
  Brain,
  Sparkles,
  RotateCcw,
  Sliders,
  Database,
  Lock,
} from 'lucide-react';
import { getActiveSession, clearAuthSession, AuthSession } from '@/lib/auth/authStore';
import { AuthModal } from '@/components/auth/AuthModal';
import { getStylistMemory, resetStylistMemory, updateStylistMemory } from '@/lib/stylist/memoryStore';
import { StylistMemory } from '@/lib/types';
import { clearStyleHistory } from '@/lib/history/historyStore';

export default function SettingsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [clearedSuccess, setClearedSuccess] = useState(false);
  const [memoryResetSuccess, setMemoryResetSuccess] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [stylistMemory, setStylistMemory] = useState<StylistMemory | null>(null);

  const loadAll = () => {
    setSession(getActiveSession());
    setStylistMemory(getStylistMemory());
  };

  useEffect(() => {
    loadAll();
    window.addEventListener('facefit_auth_changed', loadAll);
    window.addEventListener('facefit_memory_changed', loadAll);
    return () => {
      window.removeEventListener('facefit_auth_changed', loadAll);
      window.removeEventListener('facefit_memory_changed', loadAll);
    };
  }, []);

  const handleSignOut = () => {
    clearAuthSession();
  };

  const handleResetMemory = () => {
    if (confirm('Reset AI Stylist memory back to default preferences?')) {
      resetStylistMemory();
      setStylistMemory(getStylistMemory());
      setMemoryResetSuccess(true);
      setTimeout(() => setMemoryResetSuccess(false), 2500);
    }
  };

  const handleClearAllData = () => {
    if (
      confirm(
        'Are you sure you want to permanently delete ALL your local Style Profiles, Saved Looks, Wardrobe inventory, Quiz answers, and AI memory?'
      )
    ) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('facefit_active_profile');
        localStorage.removeItem('facefit_saved_hairstyles');
        localStorage.removeItem('facefit_saved_outfits');
        localStorage.removeItem('facefit_saved_looks_unified');
        localStorage.removeItem('facefit_user_wardrobe_items');
        localStorage.removeItem('facefit_style_quiz_answers');
        localStorage.removeItem('facefit_stylist_memory');
        localStorage.removeItem('facefit_user_feedback_history');
        localStorage.removeItem('facefit_style_history_timeline');
        sessionStorage.removeItem('facefit_preview_image');

        window.dispatchEvent(new Event('facefit_saved_changed'));
        window.dispatchEvent(new Event('facefit_wardrobe_changed'));
        window.dispatchEvent(new Event('facefit_memory_changed'));
        window.dispatchEvent(new Event('facefit_history_changed'));
        window.dispatchEvent(new Event('facefit_quiz_changed'));

        setClearedSuccess(true);
        setTimeout(() => setClearedSuccess(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        {/* Page Header */}
        <div className="pb-6 border-b border-neutral-200">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block mb-1">
            Privacy & Governance
          </span>
          <h1 className="text-3xl font-serif-editorial font-bold text-neutral-900">
            Settings & Privacy Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review FaceFit AI’s biometric privacy safeguards, manage AI Stylist memory, and control your local storage.
          </p>
        </div>

        {/* SECTION 1: AI STYLIST MEMORY MANAGEMENT */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="font-serif-editorial text-lg font-bold text-neutral-900">
                  AI Stylist Memory & Knowledge
                </h2>
                <p className="text-xs text-neutral-500">
                  Preferences and constraints retained to personalize chat and look generation
                </p>
              </div>
            </div>

            <button
              onClick={handleResetMemory}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-medium text-neutral-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {memoryResetSuccess ? 'Memory Reset!' : 'Reset Memory'}
            </button>
          </div>

          {stylistMemory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Preferred Styles */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                <span className="font-semibold text-neutral-700 uppercase text-[10px] tracking-wider block">
                  Preferred Aesthetics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stylistMemory.preferredStyles.map((st, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 font-medium text-neutral-800">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Excluded Styles */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                <span className="font-semibold text-rose-800 uppercase text-[10px] tracking-wider block">
                  Excluded / Disliked Elements
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stylistMemory.dislikedStyles.map((st, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 font-medium text-rose-900">
                      ✕ {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Budget & Maintenance Preferences */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                <span className="font-semibold text-neutral-700 uppercase text-[10px] tracking-wider block">
                  Budget & Grooming Limits
                </span>
                <div className="text-neutral-600 space-y-0.5">
                  <div>Budget Tier: <strong>{stylistMemory.budgetTier}</strong></div>
                  <div>Hair Styling Effort: <strong>{stylistMemory.hairMaintenanceTolerance}</strong></div>
                  <div>Wardrobe Inventory: <strong>{stylistMemory.wardrobePieceCount} cataloged pieces</strong></div>
                </div>
              </div>

              {/* Dynamic Learned Notes */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                <span className="font-semibold text-neutral-700 uppercase text-[10px] tracking-wider block">
                  Recent Adaptation Notes
                </span>
                <ul className="space-y-1 text-neutral-600">
                  {stylistMemory.learnedNotes.slice(0, 3).map((note, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: PRIVACY & DATA SOVEREIGNTY */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-lg font-bold text-neutral-900">
                Biometric Privacy Guarantees
              </h2>
              <p className="text-xs text-neutral-500">
                How FaceFit AI handles your facial images and sensitive personal data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-neutral-900">
                <EyeOff className="w-4 h-4 text-emerald-600" />
                Zero Facial Storage
              </div>
              <p className="text-neutral-500 leading-relaxed">
                Portraits are analyzed strictly in-memory during synthesis. No face images are permanently stored, archived, or shared.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-neutral-900">
                <Lock className="w-4 h-4 text-emerald-600" />
                Ethical Safeguards
              </div>
              <p className="text-neutral-500 leading-relaxed">
                The AI never infers race, ethnicity, religion, attractiveness, or medical attributes from facial appearance.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-neutral-900">
                <Server className="w-4 h-4 text-emerald-600" />
                Server-Side Key Protection
              </div>
              <p className="text-neutral-500 leading-relaxed">
                All vision and language model calls happen via protected backend routes. API credentials never touch browser clients.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-neutral-900">
                <Database className="w-4 h-4 text-emerald-600" />
                Local Storage Sovereign
              </div>
              <p className="text-neutral-500 leading-relaxed">
                Profiles, wardrobe lists, and saved looks reside in your browser localStorage, giving you full 1-click purge control.
              </p>
            </div>
          </div>

          {/* 1-Click Complete Data Purge */}
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-rose-950 text-sm">Purge All Local Style Data</h4>
              <p className="text-xs text-rose-800/80">
                Permanently clears your Style Profile, wardrobe, quiz answers, saved looks, and stylist memory from this browser.
              </p>
            </div>
            <button
              onClick={handleClearAllData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition shrink-0 shadow-xs"
            >
              {clearedSuccess ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
              {clearedSuccess ? 'All Data Purged' : 'Purge Everything'}
            </button>
          </div>
        </div>

        {/* SECTION 3: SESSION & AUTH */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-editorial text-lg font-bold text-neutral-900">Account & Cloud Sync</h2>
                <p className="text-xs text-neutral-500">
                  Current Session: <strong>{session?.user?.name || 'Local Guest'}</strong> ({session?.user?.role || 'guest'})
                </p>
              </div>
            </div>

            {session && session.user.role === 'member' ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-medium text-rose-600 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition shadow-xs"
              >
                Sign In to Sync
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
