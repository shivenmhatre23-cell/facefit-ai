'use client';

import React, { useState, useEffect } from 'react';
import { Dna, Sparkles, Share2, HelpCircle, Layers, Check, ArrowRight } from 'lucide-react';
import { StyleProfile, StyleDnaProfile } from '@/lib/types';
import { computeStyleDna } from '@/lib/styleDna/dnaEngine';

interface StyleDnaCardProps {
  profile?: StyleProfile;
  onRetakeQuiz?: () => void;
  onShare?: () => void;
}

export function StyleDnaCard({ profile, onRetakeQuiz, onShare }: StyleDnaCardProps) {
  const [dna, setDna] = useState<StyleDnaProfile | null>(null);

  useEffect(() => {
    const calculated = computeStyleDna(profile);
    setDna(calculated);

    const handleUpdate = () => {
      setDna(computeStyleDna(profile));
    };

    window.addEventListener('facefit_quiz_changed', handleUpdate);
    window.addEventListener('facefit_preferences_changed', handleUpdate);
    return () => {
      window.removeEventListener('facefit_quiz_changed', handleUpdate);
      window.removeEventListener('facefit_preferences_changed', handleUpdate);
    };
  }, [profile]);

  if (!dna) return null;

  const categories = [
    { name: 'Minimalist', score: dna.breakdown.minimal, color: 'bg-neutral-900' },
    { name: 'Smart Casual', score: dna.breakdown.smartCasual, color: 'bg-indigo-600' },
    { name: 'Modern Streetwear', score: dna.breakdown.streetwear, color: 'bg-amber-600' },
    { name: 'Classic Tailored', score: dna.breakdown.classic, color: 'bg-slate-700' },
    { name: 'Traditional / Fusion', score: dna.breakdown.traditionalFusion, color: 'bg-emerald-700' },
  ];

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white via-neutral-50/50 to-neutral-100/30 border border-neutral-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-sm">
            <Dna className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-neutral-900">Your Style DNA</h3>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700">
                Aesthetic Affinity
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Harmonizing optical balance, silhouettes, and wardrobe lifestyle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onRetakeQuiz && (
            <button
              onClick={onRetakeQuiz}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/60 text-xs font-medium text-neutral-700 transition"
            >
              Update Quiz
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Card
            </button>
          )}
        </div>
      </div>

      {/* Philosophy Callout */}
      <p className="text-xs text-neutral-600 bg-white/80 p-3.5 rounded-2xl border border-neutral-200/50 leading-relaxed">
        <span className="font-semibold text-neutral-800">Ethical Aesthetic Principle:</span> Style DNA
        measures your stylistic resonance and wardrobe proportions. It does not evaluate physical attractiveness or
        assign rigid beauty labels.
      </p>

      {/* Style Breakdown Bars */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Aesthetic Distribution</div>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-neutral-800">{cat.name}</span>
                <span className="text-neutral-500">{cat.score}% affinity</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-200/80 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${cat.color}`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Statement */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Core Archetype: <span className="text-neutral-900 font-bold">{dna.signatureStyle}</span>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">{dna.statement}</p>
      </div>

      {/* Traits & Silhouette Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Cuts */}
        <div className="p-4 rounded-2xl bg-neutral-50/60 border border-neutral-200/50 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
            <Layers className="w-3.5 h-3.5 text-neutral-600" />
            Flattering Silhouettes
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-600">
            {dna.recommendedFits.map((fit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{fit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Color Palette Resonances */}
        <div className="p-4 rounded-2xl bg-neutral-50/60 border border-neutral-200/50 space-y-2.5">
          <div className="text-xs font-semibold text-neutral-800">Key Palettes & Occasions</div>
          <div className="flex flex-wrap gap-1.5">
            {dna.preferredColors.map((color, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-[11px] font-medium text-neutral-700 shadow-xs"
              >
                {color}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-200/60 flex flex-wrap gap-1.5">
            {dna.styleKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full bg-neutral-200/60 text-[10px] font-medium text-neutral-600"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
