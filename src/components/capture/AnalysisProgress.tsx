'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

const STAGES = [
  { label: 'Analyzing image', sub: 'Calibrating illumination, sharpness, and framing' },
  { label: 'Identifying visible features', sub: 'Mapping face geometry, hairline, and undertones' },
  { label: 'Building style profile', sub: 'Harmonizing proportions with 6-color seasonal palette' },
  { label: 'Generating recommendations', sub: 'Curating tailored haircuts, barber cards & outfits' },
];

interface AnalysisProgressProps {
  imagePreview: string;
}

export function AnalysisProgress({ imagePreview }: AnalysisProgressProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 max-w-md mx-auto text-center animate-fadeIn">
      {/* Visual Scanning Frame */}
      <div className="relative w-44 h-56 rounded-2xl overflow-hidden border border-neutral-300 shadow-md mb-6 bg-neutral-900">
        <img
          src={imagePreview}
          alt="Portrait under analysis"
          className="w-full h-full object-cover opacity-90"
        />
        {/* Animated Scanner Laser */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce" />
        <div className="absolute inset-0 bg-amber-900/10 pointer-events-none" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-3">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
        AI Style Engine Active
      </div>

      <h3 className="text-xl font-serif-editorial font-bold text-neutral-900 mb-1">
        Synthesizing Your Style Dossier
      </h3>

      <p className="text-xs text-neutral-500 mb-6 max-w-xs">
        Calculating optical harmony and silhouette balance.
      </p>

      {/* Progress Checklist - Exact stages as requested */}
      <div className="w-full space-y-3 text-left bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs mb-6">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 transition-opacity ${
                isDone
                  ? 'text-neutral-900'
                  : isCurrent
                  ? 'text-amber-800'
                  : 'text-neutral-400 opacity-50'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-neutral-300" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">{stage.label}</span>
                <span className="text-[11px] text-neutral-400">{stage.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explicit Ethical AI Guarantee */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 max-w-xs text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>FaceFit AI evaluates optical balance and proportions—never beauty or attractiveness.</span>
      </div>
    </div>
  );
}
