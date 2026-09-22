'use client';

import React, { useState, useEffect } from 'react';
import { StyleProfile, OutfitCombination } from '@/lib/types';
import { OutfitFormulaCard } from './OutfitFormulaCard';
import { getUserPreferences } from '@/lib/recommendations/preferencesStore';
import { getRankedOutfits, ScoredOutfit } from '@/lib/recommendations/scoringEngine';
import { Shirt, Sparkles } from 'lucide-react';

interface WardrobeSectionProps {
  profile: StyleProfile;
  onOpenPreferences?: () => void;
}

export function WardrobeSection({ profile, onOpenPreferences }: WardrobeSectionProps) {
  const [rankedOutfits, setRankedOutfits] = useState<ScoredOutfit[]>([]);

  const recalculate = () => {
    const prefs = getUserPreferences();
    const scored = getRankedOutfits(prefs);
    setRankedOutfits(scored);
  };

  useEffect(() => {
    recalculate();
    window.addEventListener('facefit_preferences_changed', recalculate);
    return () => window.removeEventListener('facefit_preferences_changed', recalculate);
  }, []);

  const displayList = rankedOutfits.slice(0, 3);

  return (
    <div className="mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
            Wardrobe Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-neutral-900">
            Scored Outfit Combinations
          </h2>
          <span className="text-xs text-neutral-500">
            Scored by occasion, climate, budget limits, and owned wardrobe substitutions.
          </span>
        </div>

        {onOpenPreferences && (
          <button
            onClick={onOpenPreferences}
            className="self-start sm:self-auto px-4 py-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Tune Parameters
          </button>
        )}
      </div>

      {/* 3 Outfit Cards with Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {displayList.map((item, idx) => {
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

      {/* Structural Garment Fit Protocol */}
      <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-editorial">
            Structural Fit Guidance by Garment Category
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.clothingRecommendations.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-neutral-50/70 border border-neutral-200/60 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                {item.category}
              </span>
              <h4 className="font-bold text-neutral-900 mb-1">{item.clothingType}</h4>
              <p className="text-[11px] text-neutral-600 leading-snug mb-2">
                {item.fitGuidance}
              </p>
              <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[10px] text-neutral-500">
                <span className="font-medium text-amber-800">{item.aesthetic}</span>
                <span>{item.occasion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
