'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { OutfitFormulaCard } from '@/components/profile/OutfitFormulaCard';
import { StylePreferencesModal } from '@/components/preferences/StylePreferencesModal';
import { StyleProfile, OutfitCombination } from '@/lib/types';
import { SAMPLE_STYLE_PROFILE } from '@/lib/mockData';
import { getUserPreferences } from '@/lib/recommendations/preferencesStore';
import { getRankedOutfits, ScoredOutfit } from '@/lib/recommendations/scoringEngine';
import { Shirt, Sparkles, Sliders } from 'lucide-react';
import Link from 'next/link';

export default function OutfitsPage() {
  const [profile, setProfile] = useState<StyleProfile>(SAMPLE_STYLE_PROFILE);
  const [rankedOutfits, setRankedOutfits] = useState<ScoredOutfit[]>([]);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const recalculate = () => {
    const prefs = getUserPreferences();
    const scored = getRankedOutfits(prefs);
    setRankedOutfits(scored);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('facefit_active_profile');
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
    recalculate();
    window.addEventListener('facefit_preferences_changed', recalculate);
    return () => window.removeEventListener('facefit_preferences_changed', recalculate);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
              <Shirt className="w-3.5 h-3.5" />
              Wardrobe Architecture
            </div>
            <h1 className="text-3xl font-serif-editorial font-bold text-neutral-900">
              Scored Outfit Combinations
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-xl">
              Ranked dynamically by your target occasion, local climate, budget cap, and clothes you already own.
            </p>
          </div>

          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="self-start md:self-auto px-4 py-2.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-700" />
            Tune Parameters
          </button>
        </div>

        {/* Outfit Cards Grid with Scoring and Transparency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {rankedOutfits.map((item, idx) => {
            const outfitAdapter: OutfitCombination = {
              id: item.outfit.id,
              title: item.outfit.title,
              aesthetic: item.outfit.styleCategory,
              occasion: item.outfit.primaryOccasion,
              pieces: item.outfit.pieces,
              totalVibe: item.outfit.totalVibe,
              budgetTier: item.outfit.budgetTier,
            };

            return (
              <OutfitFormulaCard
                key={item.outfit.id}
                outfit={outfitAdapter}
                index={idx}
                match={item.match}
                ownedPiecesUsed={item.ownedPiecesUsed}
                effectiveCostINR={item.finalCostWithOwnedINR}
              />
            );
          })}
        </div>

        {/* Structural Garment Fit Protocol Guide */}
        <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-editorial">
              Structural Garment Fit Protocol
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.clothingRecommendations.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                  {item.category}
                </span>
                <h4 className="font-bold text-neutral-900 mb-1">{item.clothingType}</h4>
                <p className="text-[11px] text-neutral-600 leading-snug mb-2">
                  {item.fitGuidance}
                </p>
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
                  <span className="font-medium text-amber-800">{item.aesthetic}</span>
                  <span>{item.occasion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <StylePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      <Footer />
    </div>
  );
}
