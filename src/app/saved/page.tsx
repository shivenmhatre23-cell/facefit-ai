'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HairstyleRecommendation, OutfitCombination } from '@/lib/types';
import {
  getSavedHairstyles,
  getSavedOutfits,
  toggleSaveHairstyle,
  toggleSaveOutfit,
} from '@/lib/savedStore';
import { BarberInstructionModal } from '@/components/profile/BarberInstructionModal';
import {
  Bookmark,
  Scissors,
  Shirt,
  Trash2,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<'hairstyles' | 'outfits'>('hairstyles');
  const [savedHairstyles, setSavedHairstyles] = useState<HairstyleRecommendation[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<OutfitCombination[]>([]);
  const [selectedHair, setSelectedHair] = useState<HairstyleRecommendation | null>(null);

  const loadSaved = () => {
    setSavedHairstyles(getSavedHairstyles());
    setSavedOutfits(getSavedOutfits());
  };

  useEffect(() => {
    loadSaved();
    window.addEventListener('facefit_saved_changed', loadSaved);
    return () => window.removeEventListener('facefit_saved_changed', loadSaved);
  }, []);

  const handleRemoveHairstyle = (hair: HairstyleRecommendation) => {
    toggleSaveHairstyle(hair);
  };

  const handleRemoveOutfit = (outfit: OutfitCombination) => {
    toggleSaveOutfit(outfit);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-neutral-200 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
              <Bookmark className="w-3.5 h-3.5" />
              Personal Lookbook
            </div>
            <h1 className="text-3xl font-serif-editorial font-bold text-neutral-900">
              Saved Looks & Formulas
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Your bookmarked haircuts, barber instruction cards, and wardrobe combinations.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('hairstyles')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

        {/* Tab 1: Saved Hairstyles */}
        {activeTab === 'hairstyles' && (
          <div>
            {savedHairstyles.length === 0 ? (
              /* Empty State */
              <div className="luxury-card rounded-3xl p-12 text-center bg-white border border-neutral-200 max-w-lg mx-auto my-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-800">
                  <Scissors className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif-editorial font-bold text-neutral-900 mb-1">
                  No Saved Hairstyles Yet
                </h3>
                <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto">
                  Bookmark cuts from your profile or the Hairstyle catalog to keep your barber instructions ready.
                </p>
                <Link
                  href="/hairstyles"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Explore Hairstyle Recommendations
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedHairstyles.map((hair) => (
                  <div
                    key={hair.id}
                    className="luxury-card rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200">
                          {hair.maintenanceLevel} Maintenance
                        </span>
                        <button
                          onClick={() => handleRemoveHairstyle(hair)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-base font-serif-editorial font-bold text-neutral-900 mb-1">
                        {hair.name}
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                        {hair.explanation}
                      </p>

                      <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                          Barber Specification
                        </span>
                        <p className="text-[11px] text-neutral-700 font-medium">
                          {hair.barberInstructions.sidesAndBack}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-50/70 border-t border-neutral-100">
                      <button
                        onClick={() => setSelectedHair(hair)}
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-900 hover:text-white border border-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <Scissors className="w-3.5 h-3.5 text-amber-700" />
                        Open Barber Card
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Outfits */}
        {activeTab === 'outfits' && (
          <div>
            {savedOutfits.length === 0 ? (
              /* Empty State */
              <div className="luxury-card rounded-3xl p-12 text-center bg-white border border-neutral-200 max-w-lg mx-auto my-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-800">
                  <Shirt className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif-editorial font-bold text-neutral-900 mb-1">
                  No Saved Outfits Yet
                </h3>
                <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto">
                  Save combinations from your profile to reference when shopping or planning what to wear tomorrow.
                </p>
                <Link
                  href="/outfits"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Explore Curated Outfits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="luxury-card rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          {outfit.aesthetic}
                        </span>
                        <button
                          onClick={() => handleRemoveOutfit(outfit)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-base font-serif-editorial font-bold text-neutral-900 mb-1">
                        {outfit.title}
                      </h3>
                      <span className="text-[11px] text-neutral-400 block mb-4">
                        Occasion: {outfit.occasion}
                      </span>

                      <div className="space-y-2 mb-2">
                        {outfit.pieces.map((piece, i) => (
                          <div key={i} className="p-2 rounded-lg bg-neutral-50 text-xs">
                            <span className="font-semibold text-neutral-800 text-[11px] block truncate">
                              {piece.item}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              Color: {piece.color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] font-semibold text-neutral-700">
                        {outfit.budgetTier}
                      </span>
                      <Link
                        href="/stylist"
                        className="text-amber-800 hover:text-amber-900 font-semibold inline-flex items-center gap-1 text-[11px]"
                      >
                        Ask Stylist <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <BarberInstructionModal
          hairstyle={selectedHair}
          onClose={() => setSelectedHair(null)}
        />
      </main>

      <Footer />
    </div>
  );
}
