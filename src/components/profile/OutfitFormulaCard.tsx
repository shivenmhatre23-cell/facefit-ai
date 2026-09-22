import React from 'react';
import { OutfitCombination } from '@/lib/types';
import { Shirt, Tag, Sparkles } from 'lucide-react';

interface OutfitFormulaCardProps {
  outfit: OutfitCombination;
}

export function OutfitFormulaCard({ outfit }: OutfitFormulaCardProps) {
  const budgetBadgeStyles = {
    'Budget (Under ₹3000)': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Mid-range (₹3000-₹6000)': 'bg-amber-50 text-amber-800 border-amber-200',
    Premium: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  return (
    <div className="luxury-card rounded-2xl p-6 bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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

        <span className="text-[11px] text-neutral-400 block mb-4">
          Occasion: {outfit.occasion}
        </span>

        {/* Pieces Breakdown */}
        <div className="space-y-2.5 mb-5">
          {outfit.pieces.map((piece, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200/60 text-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-neutral-900 text-[11px] truncate max-w-[190px]">
                  {piece.item}
                </span>
                {piece.estimatedBudgetINR && (
                  <span className="text-[10px] font-mono font-medium text-amber-800 shrink-0">
                    {piece.estimatedBudgetINR}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-500">
                <span>Color: {piece.color}</span>
              </div>
              <p className="text-[10px] text-neutral-600 mt-1 italic leading-snug">
                {piece.stylingTip}
              </p>
            </div>
          ))}
        </div>
      </div>

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
  );
}
