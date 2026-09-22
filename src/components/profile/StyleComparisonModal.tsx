'use client';

import React from 'react';
import { X, Scale, Sparkles, Check, Clock, Calendar, AlertCircle } from 'lucide-react';
import { StyleComparisonCandidate } from '@/lib/types';

interface StyleComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateA: StyleComparisonCandidate;
  candidateB: StyleComparisonCandidate;
}

export function StyleComparisonModal({
  isOpen,
  onClose,
  candidateA,
  candidateB,
}: StyleComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <Scale className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 text-base">Neutral Style Comparison</h3>
              <p className="text-xs text-neutral-500">
                Objective side-by-side overview • No forced &quot;winner&quot;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ethical comparison banner */}
        <div className="bg-neutral-50 px-6 py-2.5 border-b border-neutral-100 text-xs text-neutral-500">
          Comparing balance, maintenance, and contextual suitability. Style is personal—choose what fits your routine.
        </div>

        {/* Comparison Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          {/* Candidate A */}
          <div className="space-y-5 md:pr-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Option A • {candidateA.category}
              </span>
              <h4 className="font-serif text-xl font-bold text-neutral-900">{candidateA.name}</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidateA.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full bg-neutral-100 text-[11px] text-neutral-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Maintenance</span>
                <span className="font-medium text-neutral-800">{candidateA.maintenanceLevel}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Styling Effort</span>
                <span className="font-medium text-neutral-800">{candidateA.stylingEffort}</span>
              </div>
            </div>

            {/* Why it works */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Aesthetic Harmony
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-3 rounded-xl border border-neutral-100">
                {candidateA.whyItMayWork}
              </p>
            </div>

            {/* Best Occasions */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                Ideal Settings
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidateA.suitableOccasions.map((occ, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100/80 text-xs text-neutral-700 font-medium"
                  >
                    {occ}
                  </span>
                ))}
              </div>
            </div>

            {/* Trade-offs */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                Practical Considerations
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-3 rounded-xl border border-neutral-100">
                {candidateA.potentialDrawbacks}
              </p>
            </div>
          </div>

          {/* Candidate B */}
          <div className="space-y-5 pt-6 md:pt-0 md:pl-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Option B • {candidateB.category}
              </span>
              <h4 className="font-serif text-xl font-bold text-neutral-900">{candidateB.name}</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidateB.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full bg-neutral-100 text-[11px] text-neutral-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Maintenance</span>
                <span className="font-medium text-neutral-800">{candidateB.maintenanceLevel}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Styling Effort</span>
                <span className="font-medium text-neutral-800">{candidateB.stylingEffort}</span>
              </div>
            </div>

            {/* Why it works */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Aesthetic Harmony
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-3 rounded-xl border border-neutral-100">
                {candidateB.whyItMayWork}
              </p>
            </div>

            {/* Best Occasions */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                Ideal Settings
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidateB.suitableOccasions.map((occ, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100/80 text-xs text-neutral-700 font-medium"
                  >
                    {occ}
                  </span>
                ))}
              </div>
            </div>

            {/* Trade-offs */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                Practical Considerations
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-3 rounded-xl border border-neutral-100">
                {candidateB.potentialDrawbacks}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}
