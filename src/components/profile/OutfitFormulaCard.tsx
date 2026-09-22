'use client';

import React, { useState, useEffect } from 'react';
import { OutfitCombination } from '@/lib/types';
import { isOutfitSaved, toggleSaveOutfit } from '@/lib/savedStore';
import { RecommendationMatch } from '@/lib/recommendations/types';
import { Shirt, Bookmark, Info, Check, Sparkles, Tag } from 'lucide-react';

interface OutfitFormulaCardProps {
  outfit: OutfitCombination;
  index?: number;
  match?: RecommendationMatch;
  ownedPiecesUsed?: string[];
  effectiveCostINR?: number;
}

export function OutfitFormulaCard({
  outfit,
  index = 0,
  match,
  ownedPiecesUsed = [],
  effectiveCostINR,
}: OutfitFormulaCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isOutfitSaved(outfit.id));
  }, [outfit.id]);

  const handleToggleSave = () => {
    const saved = toggleSaveOutfit(outfit);
    setIsSaved(saved);
  };

  const budgetBadgeStyles = {
    'Budget (Under ₹3000)': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Mid-range (₹3000-₹6000)': 'bg-amber-50 text-amber-800 border-amber-200',
    Premium: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  return (
    <div className="luxury-card rounded-2xl overflow-hidden bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between group">
      {/* Outfit Visual Frame */}
      <div className="relative w-full h-44 bg-gradient-to-br from-stone-100 via-neutral-100 to-amber-50/40 flex items-center justify-center overflow-hidden border-b border-neutral-100">
        <div className="w-20 h-20 rounded-2xl bg-white/80 border border-neutral-300/60 shadow-xs flex items-center justify-center text-neutral-700 group-hover:scale-105 transition-transform">
          <Shirt className="w-8 h-8 text-amber-800/80" />
        </div>

        {/* Score Match Badge or Look counter */}
        {match ? (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold">
            <span className="text-amber-400">★</span>
            <span>{match.score}% Match</span>
          </div>
        ) : (
          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
            OUTFIT 0{index + 1}
          </span>
        )}

        {/* Save Button */}
        <button
          onClick={handleToggleSave}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all cursor-pointer shadow-xs ${
            isSaved
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-950'
          }`}
          title={isSaved ? 'Remove from Saved Outfits' : 'Save this Outfit'}
          aria-label={isSaved ? 'Unsave outfit' : 'Save outfit'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              {outfit.aesthetic}
            </span>
            {outfit.budgetTier && (
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  budgetBadgeStyles[outfit.budgetTier] || 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                {outfit.budgetTier}
              </span>
            )}
          </div>

          <h3 className="text-base font-serif-editorial font-bold text-neutral-900 mb-1">
            {outfit.title}
          </h3>

          <span className="text-[11px] text-neutral-500 block mb-3">
            Occasion: <strong className="text-neutral-700">{outfit.occasion}</strong>
          </span>

          {/* TRANSPARENT "WHY RECOMMENDED" BOX */}
          {match && (
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 mb-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-700" /> Why this was recommended
              </span>
              <p className="text-[11px] text-amber-950 leading-relaxed">
                {match.rationale}
              </p>
              {match.matchTags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {match.matchTags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[9px] font-bold bg-white text-amber-900 border border-amber-200"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clothing Pieces Breakdown */}
          <div className="space-y-2 mb-4">
            {outfit.pieces.map((piece, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200/60 text-xs"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-neutral-900 text-[11px] truncate max-w-[190px]">
                    {piece.item}
                  </span>
                  {piece.estimatedBudgetINR && (
                    <span className="text-[10px] font-mono font-medium text-amber-800 shrink-0">
                      {piece.estimatedBudgetINR}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-500 mb-0.5">
                  Color: <span className="font-medium text-neutral-700">{piece.color}</span>
                </div>
                <p className="text-[10px] text-neutral-600 italic leading-snug">
                  {piece.stylingTip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Owned Wardrobe Savings Badge */}
        {ownedPiecesUsed.length > 0 && (
          <div className="mb-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Reuses your owned: <strong>{ownedPiecesUsed.join(', ')}</strong></span>
          </div>
        )}

        {/* Total Vibe Summary */}
        <div className="pt-3 border-t border-neutral-100">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-0.5">
            Stylist Vibe Note
          </span>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            {outfit.totalVibe}
          </p>
        </div>
      </div>
    </div>
  );
}
