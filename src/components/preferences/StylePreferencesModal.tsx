'use client';

import React, { useState, useEffect } from 'react';
import {
  UserStylePreferences,
  ClothingStyleCategory,
  HairstyleCategory,
  OccasionType,
  ClimateType,
  BudgetTier,
} from '@/lib/recommendations/types';
import { getUserPreferences, saveUserPreferences } from '@/lib/recommendations/preferencesStore';
import { Sliders, X, Check, Sparkles, Tag, ShieldCheck, Shirt, Scissors, CloudSun, IndianRupee } from 'lucide-react';

interface StylePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesUpdated?: () => void;
}

const CLOTHING_STYLES: ClothingStyleCategory[] = [
  'Minimal',
  'Smart casual',
  'Streetwear',
  'Formal',
  'Casual',
  'Sporty',
  'Traditional/fusion',
];

const OCCASIONS: OccasionType[] = [
  'College',
  'Internship',
  'Interview',
  'Presentation',
  'Date/social event',
  'Wedding/festival',
  'Everyday',
];

const CLIMATES: ClimateType[] = [
  'Hot / Humid',
  'Mild / Temperate',
  'Cold / Winter',
  'Monsoon / Rainy',
];

const POPULAR_OWNED_ITEMS = [
  'Plain white tee',
  'Dark indigo denim',
  'White minimalist sneakers',
  'Black cotton overshirt',
  'Olive chinos',
  'Navy blazer',
  'Suede loafers',
];

const DISLIKED_OPTIONS = [
  'Skinny jeans',
  'Loud graphic logos',
  'High skin fade',
  'Harsh neon colors',
  'Extreme formal ties',
  'Heavy polyester fabrics',
];

export function StylePreferencesModal({
  isOpen,
  onClose,
  onPreferencesUpdated,
}: StylePreferencesModalProps) {
  const [prefs, setPrefs] = useState<UserStylePreferences>(getUserPreferences());
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPrefs(getUserPreferences());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleStyle = (style: ClothingStyleCategory) => {
    setPrefs((prev) => {
      const exists = prev.preferredStyles.includes(style);
      return {
        ...prev,
        preferredStyles: exists
          ? prev.preferredStyles.filter((s) => s !== style)
          : [...prev.preferredStyles, style],
      };
    });
  };

  const toggleOwnedItem = (item: string) => {
    setPrefs((prev) => {
      const exists = prev.ownedWardrobe.includes(item);
      return {
        ...prev,
        ownedWardrobe: exists
          ? prev.ownedWardrobe.filter((i) => i !== item)
          : [...prev.ownedWardrobe, item],
      };
    });
  };

  const toggleDisliked = (dislike: string) => {
    setPrefs((prev) => {
      const exists = prev.dislikedStyles.includes(dislike);
      return {
        ...prev,
        dislikedStyles: exists
          ? prev.dislikedStyles.filter((d) => d !== dislike)
          : [...prev.dislikedStyles, dislike],
      };
    });
  };

  const handleSave = () => {
    saveUserPreferences(prefs);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
      if (onPreferencesUpdated) onPreferencesUpdated();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          aria-label="Close preferences modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
              Recommendation Engine
            </span>
            <h2 className="text-xl font-serif-editorial font-bold text-neutral-900">
              Tune Your Style Parameters
            </h2>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          FaceFit AI does not generate generic advice. Adjust your lifestyle parameters below to re-score every haircut and outfit recommendation live.
        </p>

        <div className="space-y-6 text-xs">
          {/* 1. Occasion & Clothing Style Preference */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-2 flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-amber-700" />
              1. Preferred Clothing Aesthetics (Select multiple)
            </label>
            <div className="flex flex-wrap gap-2">
              {CLOTHING_STYLES.map((cat) => {
                const isSelected = prefs.preferredStyles.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleStyle(cat)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Primary Occasion */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              2. Target Occasion
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => {
                const isSelected = prefs.primaryOccasion === occ;
                return (
                  <button
                    key={occ}
                    onClick={() => setPrefs((prev) => ({ ...prev, primaryOccasion: occ }))}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-800 text-white border-amber-800 shadow-2xs'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Hairstyle Maintenance Preference */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-2 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-700" />
              3. Hairstyle Maintenance Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low maintenance', 'Medium maintenance', 'High styling'] as const).map((m) => {
                const isSelected = prefs.hairMaintenance === m;
                return (
                  <button
                    key={m}
                    onClick={() => setPrefs((prev) => ({ ...prev, hairMaintenance: m }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Budget & Climate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-2 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-amber-700" />
                4. Clothing Budget Tier
              </label>
              <select
                value={prefs.budgetTier}
                onChange={(e) => {
                  const bTier = e.target.value as BudgetTier;
                  const max = bTier === 'Budget (Under ₹3000)' ? 3000 : bTier === 'Mid-range (₹3000-₹6000)' ? 6000 : 12000;
                  setPrefs((prev) => ({ ...prev, budgetTier: bTier, maxBudgetINR: max }));
                }}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
              >
                <option value="Budget (Under ₹3000)">Budget (Under ₹3000)</option>
                <option value="Mid-range (₹3000-₹6000)">Mid-range (₹3000-₹6000)</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-2 flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-amber-700" />
                5. Local Climate
              </label>
              <select
                value={prefs.climate}
                onChange={(e) => setPrefs((prev) => ({ ...prev, climate: e.target.value as ClimateType }))}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
              >
                {CLIMATES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Wardrobe You Already Own */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              6. Clothing You Already Own (Enables smart budget substitutions)
            </label>
            <span className="text-[10px] text-neutral-400 block mb-2">
              Select items you own so the engine suggests formulas that reuse what's in your closet.
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_OWNED_ITEMS.map((item) => {
                const isSelected = prefs.ownedWardrobe.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleOwnedItem(item)}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Styles You Dislike */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1 flex items-center gap-1.5">
              <X className="w-3.5 h-3.5 text-rose-600" />
              7. Styles You Dislike (Hard filters)
            </label>
            <span className="text-[10px] text-neutral-400 block mb-2">
              The engine will automatically penalize or filter out these cuts and silhouettes.
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DISLIKED_OPTIONS.map((dislike) => {
                const isSelected = prefs.dislikedStyles.includes(dislike);
                return (
                  <button
                    key={dislike}
                    onClick={() => toggleDisliked(dislike)}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {isSelected ? '✕ ' : ''}
                    {dislike}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-5 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Preferences saved privately in your local browser storage.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-2.5 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              {isSavedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Recalculated!
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Apply & Recalculate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
