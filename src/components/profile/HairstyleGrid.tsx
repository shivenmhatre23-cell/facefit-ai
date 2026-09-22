'use client';

import React, { useState, useEffect } from 'react';
import { HairstyleRecommendation, StyleComparisonCandidate } from '@/lib/types';
import { BarberInstructionModal } from './BarberInstructionModal';
import { LookPreviewModal } from '@/components/preview/LookPreviewModal';
import { StyleComparisonModal } from './StyleComparisonModal';
import { StyleFeedbackWidget } from './StyleFeedbackWidget';
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
  Scale,
  Eye,
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
  const [previewTarget, setPreviewTarget] = useState<any | null>(null);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [rankedList, setRankedList] = useState<any[]>([]);

  const recalculateRanking = () => {
    const prefs = getUserPreferences();
    const scored = getRankedHairstyles(
      { shape: faceShape, confidence: 'high', proportionsSummary: '', featuresNotes: [] },
      prefs
    );
    setRankedList(scored || []);

    const map: Record<string, boolean> = {};
    (scored || []).forEach((item) => {
      if (item?.hair?.id) {
        map[item.hair.id] = isHairstyleSaved(item.hair.id);
      }
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

  const topTwo = rankedList.slice(0, 2);
  const comparisonCandidateA: StyleComparisonCandidate | null = topTwo[0]
    ? {
        id: topTwo[0].hair.id || 'cut-1',
        name: topTwo[0].hair.name,
        category: 'Hairstyle',
        maintenanceLevel: `${topTwo[0].hair.maintenanceLevel} Maintenance`,
        stylingEffort: `~${topTwo[0].hair.stylingEffortMinutes || 5} mins daily`,
        suitableOccasions: ['Everyday', 'College', 'Social Events'],
        whyItMayWork: topTwo[0].rationale || topTwo[0].hair.baseExplanation,
        potentialDrawbacks:
          topTwo[0].hair.maintenanceLevel === 'High'
            ? 'Requires blow drying and clay styling every morning.'
            : 'Needs a perimeter taper cleanup every 3 weeks to prevent bulk.',
        tags: topTwo[0].matchTags || ['Proportion Balanced'],
      }
    : null;

  const comparisonCandidateB: StyleComparisonCandidate | null = topTwo[1]
    ? {
        id: topTwo[1].hair.id || 'cut-2',
        name: topTwo[1].hair.name,
        category: 'Hairstyle',
        maintenanceLevel: `${topTwo[1].hair.maintenanceLevel} Maintenance`,
        stylingEffort: `~${topTwo[1].hair.stylingEffortMinutes || 5} mins daily`,
        suitableOccasions: ['Professional', 'Interviews', 'Evenings'],
        whyItMayWork: topTwo[1].rationale || topTwo[1].hair.baseExplanation,
        potentialDrawbacks:
          topTwo[1].hair.maintenanceLevel === 'High'
            ? 'High dependence on pomade or styling paste for structure.'
            : 'Fades naturally soft; requires intentional combing.',
        tags: topTwo[1].matchTags || ['Clean Contrast'],
      }
    : null;

  return (
    <section className="mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
            Grooming & Silhouette
          </span>
          <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-neutral-900">
            Tailored Hairstyles for {faceShape} Geometry
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cuts scored dynamically according to your face geometry, maintenance tolerance, and style feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {topTwo.length >= 2 && (
            <button
              onClick={() => setComparisonOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition flex items-center gap-1.5 shadow-xs"
            >
              <Scale className="w-3.5 h-3.5 text-neutral-600" />
              Compare Top 2
            </button>
          )}

          {onOpenPreferences && (
            <button
              onClick={onOpenPreferences}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition shadow-xs"
            >
              Filter Styles
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {rankedList.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center text-xs text-neutral-500">
          No hairstyles match your strict filter parameters. Try expanding your maintenance tolerance.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedList.map((match) => {
            const hair = match.hair;
            const isSaved = !!savedIds[hair.id];

            const hairForModal: HairstyleRecommendation = {
              id: hair.id || 'hair-' + Math.random(),
              name: hair.name,
              explanation: hair.baseExplanation || '',
              whyItWorks: hair.baseExplanation || '',
              maintenanceLevel: hair.maintenanceLevel || 'Medium',
              stylingEffortMinutes: hair.stylingEffortMinutes || 5,
              suitableProducts: [hair.stylingProduct || 'Matte clay'],
              barberInstructions: {
                fadeOrTaperType: hair.fadeOrTaperType || 'Low Taper Fade',
                sidesAndBack: hair.sidesAndBack || 'Taper fade blended softly into neckline',
                topLength: hair.topLength || '2.5 inches point textured',
                stylingFinish: hair.stylingFinish || 'Matte natural finish',
              },
            };

            return (
              <div
                key={hair.id || Math.random()}
                className="luxury-card rounded-3xl overflow-hidden bg-white border border-neutral-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
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
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                          maintenanceColors[hair.maintenanceLevel] || maintenanceColors.Low
                        }`}
                      >
                        {hair.maintenanceLevel || 'Medium'} Maintenance
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        ~{hair.stylingEffortMinutes || 5} mins daily
                      </span>
                    </div>

                    <h3 className="text-base font-serif-editorial font-bold text-neutral-900 mb-1 break-words">
                      {hair.name}
                    </h3>

                    <p className="text-xs text-neutral-500 leading-relaxed mb-3 break-words">
                      {hair.baseExplanation}
                    </p>

                    {/* Transparent "Why Recommended" Box */}
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                        <Info className="w-3 h-3 text-amber-700" /> Why this was recommended
                      </span>
                      <p className="text-[11px] text-amber-950 leading-relaxed break-words">
                        {match.rationale}
                      </p>
                      {Array.isArray(match.matchTags) && match.matchTags.length > 0 && (
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

                  {/* Feedback Loop Widget */}
                  <StyleFeedbackWidget itemId={hair.id || hair.name} itemType="hairstyle" />

                  {/* Action Buttons: Try This Look Preview + Barber Card */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() =>
                        setPreviewTarget({
                          type: 'hairstyle',
                          name: hair.name,
                          details: {
                            style: hair.suitableProducts?.[0] || 'Textured natural',
                            maintenance: `${hair.maintenanceLevel} Maintenance`,
                            barberNotes: hair.barberInstructions?.sidesAndBack || hair.whyItWorksBase,
                            sidesAndBack: hair.barberInstructions?.sidesAndBack,
                            topLength: hair.barberInstructions?.topLength,
                            fadeType: hair.barberInstructions?.fadeOrTaperType,
                            stylingProduct: hair.suitableProducts?.join(', '),
                            faceShape: faceShape,
                          },
                        })
                      }
                      className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      Try Look
                    </button>

                    <button
                      onClick={() => setSelectedHair(hairForModal)}
                      className="py-2.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Scissors className="w-3.5 h-3.5 text-amber-800" />
                      Barber Card
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Barber Instruction Modal */}
      <BarberInstructionModal
        hairstyle={selectedHair}
        onClose={() => setSelectedHair(null)}
      />

      {/* Try This Look Preview Modal */}
      {previewTarget && (
        <LookPreviewModal
          isOpen={!!previewTarget}
          onClose={() => setPreviewTarget(null)}
          target={previewTarget}
        />
      )}

      {/* Style Comparison Modal */}
      {comparisonCandidateA && comparisonCandidateB && (
        <StyleComparisonModal
          isOpen={comparisonOpen}
          onClose={() => setComparisonOpen(false)}
          candidateA={comparisonCandidateA}
          candidateB={comparisonCandidateB}
        />
      )}
    </section>
  );
}
