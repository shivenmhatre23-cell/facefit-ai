'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HairstyleRecommendation, OutfitCombination, SavedLookRecord } from '@/lib/types';
import {
  getSavedHairstyles,
  getSavedOutfits,
  toggleSaveHairstyle,
  toggleSaveOutfit,
} from '@/lib/savedStore';
import {
  getSavedLookRecords,
  deleteLookRecord,
  renameLookRecord,
  duplicateLookRecord,
} from '@/lib/saved/looksStore';
import { getActiveSession, AuthSession } from '@/lib/auth/authStore';
import { BarberInstructionModal } from '@/components/profile/BarberInstructionModal';
import { LookPreviewModal } from '@/components/preview/LookPreviewModal';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  Bookmark,
  Scissors,
  Shirt,
  Trash2,
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Layers,
  Copy,
  Edit2,
  Check,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<'complete_looks' | 'hairstyles' | 'outfits'>('complete_looks');
  const [savedLooks, setSavedLooks] = useState<SavedLookRecord[]>([]);
  const [savedHairstyles, setSavedHairstyles] = useState<HairstyleRecommendation[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<OutfitCombination[]>([]);
  const [selectedHair, setSelectedHair] = useState<HairstyleRecommendation | null>(null);
  const [previewTarget, setPreviewTarget] = useState<any | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');

  const loadSaved = () => {
    setSavedLooks(getSavedLookRecords());
    setSavedHairstyles(getSavedHairstyles());
    setSavedOutfits(getSavedOutfits());
    setSession(getActiveSession());
  };

  useEffect(() => {
    loadSaved();
    window.addEventListener('facefit_saved_changed', loadSaved);
    window.addEventListener('facefit_auth_changed', loadSaved);
    return () => {
      window.removeEventListener('facefit_saved_changed', loadSaved);
      window.removeEventListener('facefit_auth_changed', loadSaved);
    };
  }, []);

  const handleRemoveHairstyle = (hair: HairstyleRecommendation) => {
    toggleSaveHairstyle(hair);
  };

  const handleRemoveOutfit = (outfit: OutfitCombination) => {
    toggleSaveOutfit(outfit);
  };

  const handleDeleteLook = (id: string) => {
    deleteLookRecord(id);
  };

  const handleDuplicateLook = (id: string) => {
    duplicateLookRecord(id);
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setRenameValue(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (renameValue.trim()) {
      renameLookRecord(id, renameValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-neutral-200 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
              <Bookmark className="w-3.5 h-3.5" />
              Personal Lookbook
            </div>
            <h1 className="text-3xl font-serif-editorial font-bold text-neutral-900">
              Saved Looks & Formulas
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Your bookmarked complete looks, haircuts, barber instruction cards, and wardrobe combinations.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200 self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('complete_looks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'complete_looks'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Complete Looks ({savedLooks.length})
            </button>
            <button
              onClick={() => setActiveTab('hairstyles')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'hairstyles'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              Hairstyles ({savedHairstyles.length})
            </button>
            <button
              onClick={() => setActiveTab('outfits')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'outfits'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              Outfits ({savedOutfits.length})
            </button>
          </div>
        </div>

        {/* Unauthorized / Guest Sync Banner */}
        {(!session || session.user.role === 'guest') && (
          <div className="p-4 mb-8 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Viewing Local Guest Lookbook:</strong> Items are saved in your current browser memory. Sign in to cloud-sync your lookbook across mobile and desktop.
              </span>
            </div>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold self-start sm:self-auto transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Sign In to Sync
            </button>
          </div>
        )}

        {/* TAB: COMPLETE LOOKS */}
        {activeTab === 'complete_looks' && (
          <div>
            {savedLooks.length === 0 ? (
              <div className="luxury-card rounded-3xl p-12 text-center bg-white border border-neutral-200 max-w-lg mx-auto my-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif-editorial font-bold text-neutral-900">
                  No Complete Looks Saved Yet
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Build a custom look in Look Builder or save curated formulas from Occasion and Budget Stylists.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition"
                  >
                    Open Look Builder
                  </Link>
                  <Link
                    href="/occasions"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-800 text-xs font-medium hover:bg-neutral-50 transition"
                  >
                    Browse Occasions
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedLooks.map((look) => (
                  <div
                    key={look.id}
                    className="p-6 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      {/* Top Meta */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                          {look.type.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-neutral-400">{look.dateSaved}</span>
                      </div>

                      {/* Name & Rename form */}
                      {editingId === look.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="w-full text-sm font-semibold px-2 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(look.id)}
                            className="p-1 rounded-lg bg-neutral-900 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group/title">
                          <h3 className="font-serif-editorial text-lg font-bold text-neutral-900">
                            {look.name}
                          </h3>
                          <button
                            onClick={() => handleStartRename(look.id, look.name)}
                            className="opacity-0 group-hover/title:opacity-100 text-neutral-400 hover:text-neutral-800 transition p-1"
                            title="Rename"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <p className="text-xs text-neutral-500">
                        Occasion: <span className="font-medium text-neutral-800">{look.occasion}</span> • Style: {look.style}
                      </p>

                      {/* Colors */}
                      {look.colors && look.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          {look.colors.slice(0, 5).map((col, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] text-neutral-600 font-medium truncate max-w-[80px]"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDuplicateLook(look.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition"
                          title="Duplicate Look"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLook(look.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Look"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          setPreviewTarget({
                            type: look.type,
                            name: look.name,
                            details: look.details,
                          })
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Try Look
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Hairstyles */}
        {activeTab === 'hairstyles' && (
          <div>
            {savedHairstyles.length === 0 ? (
              <div className="luxury-card rounded-3xl p-12 text-center bg-white border border-neutral-200 max-w-lg mx-auto my-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
                  <Scissors className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif-editorial font-bold text-neutral-900">
                  No Saved Hairstyles Yet
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Bookmark cuts from your profile or the Hairstyle catalog to keep your barber instructions ready.
                </p>
                <Link
                  href="/hairstyles"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Explore Hairstyles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedHairstyles.map((hair) => (
                  <div
                    key={hair.name}
                    className="p-6 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-2">
                        <span className="bg-neutral-100 text-neutral-700 font-semibold px-2 py-0.5 rounded-md uppercase">
                          {hair.barberInstructions?.topLength || 'Medium'}
                        </span>
                        <span>{hair.maintenanceLevel} Maintenance</span>
                      </div>
                      <h3 className="text-lg font-serif-editorial font-bold text-neutral-900 mb-1">
                        {hair.name}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                        {hair.whyItWorks}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedHair(hair)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-medium transition"
                        >
                          Barber Card
                        </button>
                        <button
                          onClick={() =>
                            setPreviewTarget({
                              type: 'hairstyle',
                              name: hair.name,
                              details: {
                                style: hair.suitableProducts?.join(', ') || 'Matte clay',
                                maintenance: `${hair.maintenanceLevel} Maintenance`,
                              },
                            })
                          }
                          className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs transition"
                          title="Try This Look Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveHairstyle(hair)}
                        className="p-1.5 rounded-xl text-neutral-300 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Outfits */}
        {activeTab === 'outfits' && (
          <div>
            {savedOutfits.length === 0 ? (
              <div className="luxury-card rounded-3xl p-12 text-center bg-white border border-neutral-200 max-w-lg mx-auto my-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
                  <Shirt className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif-editorial font-bold text-neutral-900">
                  No Saved Outfits Yet
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Save outfits from your personalized profile to build a ready-to-wear rotation.
                </p>
                <Link
                  href="/outfits"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Explore Outfits <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedOutfits.map((outfit) => (
                  <div
                    key={outfit.id || outfit.title}
                    className="p-6 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-2">
                        <span className="bg-neutral-100 text-neutral-700 font-semibold px-2 py-0.5 rounded-md uppercase">
                          {outfit.occasion}
                        </span>
                        <span>{outfit.aesthetic}</span>
                      </div>

                      <h3 className="text-base font-semibold text-neutral-900 mb-2">
                        {outfit.title}
                      </h3>

                      <div className="space-y-1 text-xs text-neutral-600">
                        {outfit.pieces?.map((piece, idx) => (
                          <div key={idx}>
                            <strong>{piece.item}:</strong> {piece.color}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <button
                        onClick={() =>
                          setPreviewTarget({
                            type: 'outfit',
                            name: outfit.title,
                            details: {
                              style: outfit.aesthetic,
                              pieces: outfit.pieces?.map((p) => ({ item: p.item, color: p.color })) || [],
                            },
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Try Look
                      </button>

                      <button
                        onClick={() => handleRemoveOutfit(outfit)}
                        className="p-1.5 rounded-xl text-neutral-300 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Barber Card Modal */}
      <BarberInstructionModal
        hairstyle={selectedHair}
        onClose={() => setSelectedHair(null)}
      />

      {/* Look Preview Modal */}
      {previewTarget && (
        <LookPreviewModal
          isOpen={!!previewTarget}
          onClose={() => setPreviewTarget(null)}
          target={previewTarget}
        />
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
