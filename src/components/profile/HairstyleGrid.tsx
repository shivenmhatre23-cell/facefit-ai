'use client';

import React, { useState, useEffect } from 'react';
import { HairstyleRecommendation } from '@/lib/types';
import { BarberInstructionModal } from './BarberInstructionModal';
import { isHairstyleSaved, toggleSaveHairstyle } from '@/lib/savedStore';
import { getUserPreferences } from '@/lib/recommendations/preferencesStore';
import { getRankedHairstyles } from '@/lib/recommendations/scoringEngine';
import {
  Scissors,
  Clock,
  Bookmark,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface HairstyleGridProps {
  hairstyles?: HairstyleRecommendation[];
  faceShape?: string;
  onOpenPreferences?: () => void;
}

export function HairstyleGrid({
  hairstyles,
  faceShape = 'Oval',
  onOpenPreferences,
}: HairstyleGridProps) {
  const [selectedHair, setSelectedHair] = useState<HairstyleRecommendation | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [rankedList, setRankedList] = useState<any[]>([]);

  const recalculateRanking = () => {
    const prefs = getUserPreferences();
    const scored = getRankedHairstyles({ shape: faceShape, confidence: 'high', proportionsSummary: '', featuresNotes: [] }, prefs);
    setRankedList(scored);

    const map: Record<string, boolean> = {};
    scored.forEach((item) => {
      map[item.hair.id] = isHairstyleSaved(item.hair.id);
    });
    setSavedIds(map);
  };

  useEffect(() => {
    recalculateRanking();
    window.addEventListener('facefit_preferences_changed', recalculateRanking);
    window.addEventListener('facefit_saved_changed', recalculateRanking);
    return () => {
      window.removeEventListener('facefit_preferences_changed', recalculateRanking);
      window.removeEventListener('facefit_saved_changed', recalculateRanking);
    };
  }, [faceShape]);

  const handleToggleSave = (hair: HairstyleRecommendation) => {
    const isNowSaved = toggleSaveHairstyle(hair);
    setSavedIds((prev) => ({ ...prev, [hair.id]: isNowSaved }));
  };

  const maintenanceColors: Record<string, string> = {
    Low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    High: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  const displayList = rankedList.slice(0, 6);

  return (
    <section id="hairstyles-section" className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
            Hair Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-neutral-900">
            Scored Hairstyle Recommendations
          </h2>
          <span className="text-xs text-neutral-500">
            Ranked by your maintenance preference, face shape balance, and preferred hair tags.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayList.map((item, idx) => {
          const hair = item.hair;
          const match = item.match;
          const isSaved = Boolean(savedIds[hair.id]);

          // Adapter for barber modal
          const hairForModal: HairstyleRecommendation = {
            id: hair.id,
            name: hair.name,
            explanation: hair.baseExplanation,
            whyItWorks: hair.whyItWorksBase,
            maintenanceLevel: hair.maintenanceLevel,
            stylingEffortMinutes: hair.stylingEffortMinutes,
            suitableProducts: hair.suitableProducts,
            barberInstructions: hair.barberInstructions,
          };

          return (
            <div
              key={hair.id}
              className="luxury-card rounded-2xl overflow-hidden bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between group"
            >
              {/* Visual Frame */}
              <div className="relative w-full h-44 bg-gradient-to-br from-neutral-100 via-stone-100 to-neutral-200 flex items-center justify-center overflow-hidden border-b border-neutral-100">
                <div className="w-20 h-20 rounded-full bg-white/80 border border-neutral-300/60 shadow-xs flex items-center justify-center text-neutral-700 group-hover:scale-105 transition-transform">
                  <Scissors className="w-8 h-8 text-amber-800/80" />
                </div>

                {/* Score Match Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold">
                  <span className="text-amber-400">★</span>
                  <span>{match.score}% Match</span>
                </div>

                {/* Save Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSave(hairForModal);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all cursor-pointer shadow-xs ${
                    isSaved
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-950'
                  }`}
                  title={isSaved ? 'Remove from Saved' : 'Save Hairstyle'}
                  aria-label={isSaved ? 'Unsave' : 'Save'}
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
                      ~{hair.stylingEffortMinutes} mins daily
                    </span>
                  </div>

                  <h3 className="text-base font-serif-editorial font-bold text-neutral-900 mb-1.5">
                    {hair.name}
                  </h3>

                  <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                    {hair.baseExplanation}
                  </p>

                  {/* TRANSPARENT "WHY RECOMMENDED" BOX */}
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 mb-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                      <Info className="w-3 h-3 text-amber-700" /> Why this was recommended
                    </span>
                    <p className="text-[11px] text-amber-950 leading-relaxed">
                      {match.rationale}
                    </p>
                    {match.matchTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {match.matchTags.map((t: string, i: number) => (
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
                </div>

                {/* Barber Card Trigger */}
                <button
                  onClick={() => setSelectedHair(hairForModal)}
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
