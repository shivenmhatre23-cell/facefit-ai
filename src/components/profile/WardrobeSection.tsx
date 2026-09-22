import React from 'react';
import { StyleProfile } from '@/lib/types';
import { OutfitFormulaCard } from './OutfitFormulaCard';
import { Shirt, CheckCircle2, Sparkles } from 'lucide-react';

interface WardrobeSectionProps {
  profile: StyleProfile;
}

export function WardrobeSection({ profile }: WardrobeSectionProps) {
  const { outfitCombinations, clothingRecommendations } = profile;

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
            Wardrobe Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-neutral-900">
            Curated Outfit Formulas
          </h2>
        </div>
        <span className="text-xs text-neutral-500 hidden sm:inline-block">
          Optimized for college, presentations, and social events
        </span>
      </div>

      {/* 3 Outfit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {outfitCombinations.map((outfit) => (
          <OutfitFormulaCard key={outfit.id} outfit={outfit} />
        ))}
      </div>

      {/* Individual Fit Guidance Cards */}
      <div className="luxury-card rounded-2xl p-6 sm:p-7 bg-white border border-neutral-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-editorial">
            Structural Fit Guidance by Garment Category
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clothingRecommendations.map((item, idx) => (
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
