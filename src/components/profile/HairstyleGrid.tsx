'use client';

import React, { useState, useEffect } from 'react';
import { HairstyleRecommendation } from '@/lib/types';
import { BarberInstructionModal } from './BarberInstructionModal';
import { isHairstyleSaved, toggleSaveHairstyle } from '@/lib/savedStore';
import {
  Scissors,
  Clock,
  Bookmark,
  ChevronRight,
  Sparkles,
  Check,
} from 'lucide-react';

interface HairstyleGridProps {
  hairstyles: HairstyleRecommendation[];
}

export function HairstyleGrid({ hairstyles }: HairstyleGridProps) {
  const [selectedHair, setSelectedHair] = useState<HairstyleRecommendation | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const map: Record<string, boolean> = {};
    hairstyles.forEach((h) => {
      map[h.id] = isHairstyleSaved(h.id);
    });
    setSavedIds(map);
  }, [hairstyles]);

  const handleToggleSave = (hair: HairstyleRecommendation) => {
    const isNowSaved = toggleSaveHairstyle(hair);
    setSavedIds((prev) => ({ ...prev, [hair.id]: isNowSaved }));
  };

  const maintenanceColors = {
    Low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    High: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <section id="hairstyles-section" className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
            Hair Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-neutral-900">
            Hairstyle Recommendations
          </h2>
        </div>
        <span className="text-xs text-neutral-500">
          Tailored to your facial balance & hair volume
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hairstyles.map((hair, idx) => {
          const isSaved = Boolean(savedIds[hair.id]);

          return (
            <div
              key={hair.id}
              className="luxury-card rounded-2xl overflow-hidden bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between group"
            >
              {/* Visual Placeholder / Image Area */}
              <div className="relative w-full h-44 bg-gradient-to-br from-neutral-100 via-stone-100 to-neutral-200 flex items-center justify-center overflow-hidden border-b border-neutral-100">
                {/* Stylized haircut silhouette graphic */}
                <div className="w-20 h-20 rounded-full bg-white/70 border border-neutral-300/60 shadow-xs flex items-center justify-center text-neutral-700 group-hover:scale-105 transition-transform">
                  <Scissors className="w-8 h-8 text-amber-800/80" />
                </div>

                {/* Aesthetic number tag */}
                <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                  LOOK 0{idx + 1}
                </span>

                {/* Save Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSave(hair);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all cursor-pointer shadow-xs ${
                    isSaved
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-950'
                  }`}
                  title={isSaved ? 'Remove from Saved Looks' : 'Save this Hairstyle'}
                  aria-label={isSaved ? 'Unsave hairstyle' : 'Save hairstyle'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                        maintenanceColors[hair.maintenanceLevel] || maintenanceColors.Low
                      }`}
                    >
                      {hair.maintenanceLevel} Maintenance
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      ~{hair.stylingEffortMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-base font-serif-editorial font-bold text-neutral-900 mb-1.5">
                    {hair.name}
                  </h3>

                  <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                    {hair.explanation}
                  </p>

                  {/* Suitability Explanation */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Suitability & Proportion
                    </span>
                    <p className="text-[11px] text-neutral-700 leading-relaxed">
                      {hair.whyItWorks}
                    </p>
                  </div>
                </div>

                {/* Barber Card Trigger */}
                <button
                  onClick={() => setSelectedHair(hair)}
                  className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
                >
                  <Scissors className="w-3.5 h-3.5 text-amber-700 group-hover/btn:text-amber-400 transition-colors" />
                  Barber Instructions Card
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-white transition-colors" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <BarberInstructionModal
        hairstyle={selectedHair}
        onClose={() => setSelectedHair(null)}
      />
    </section>
  );
}
