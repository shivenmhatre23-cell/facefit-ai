'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

const STAGES = [
  'Detecting facial geometric landmarks & proportions...',
  'Evaluating jawline taper & face shape classification...',
  'Analyzing hair texture, density, and hairline contours...',
  'Calculating skin undertone & 6-swatch color palette...',
  'Synthesizing barber card instructions & curated wardrobe...',
];

interface AnalysisProgressProps {
  imagePreview: string;
}

export function AnalysisProgress({ imagePreview }: AnalysisProgressProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
      {/* Visual Scanning Animation Box */}
      <div className="relative w-44 h-56 rounded-2xl overflow-hidden border border-neutral-300 shadow-md mb-8 bg-neutral-900">
        <img
          src={imagePreview}
          alt="Selfie under analysis"
          className="w-full h-full object-cover opacity-85"
        />
        {/* Animated Laser Scan Bar */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce" />
        <div className="absolute inset-0 bg-amber-900/10 pointer-events-none" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium mb-3">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
        Multimodal Analysis Active
      </div>

      <h3 className="text-xl font-serif-editorial font-bold text-neutral-900 mb-2">
        Curating Your Style Profile
      </h3>

      <p className="text-xs text-neutral-500 mb-6 max-w-xs">
        Our vision algorithms are analyzing optical harmony to construct your personalized grooming and sartorial guide.
      </p>

      {/* Progress Checklist */}
      <div className="w-full space-y-2 text-left bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 text-xs transition-opacity ${
                isDone
                  ? 'text-neutral-900 font-medium'
                  : isCurrent
                  ? 'text-amber-800 font-semibold'
                  : 'text-neutral-400 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" />
              )}
              <span className="truncate">{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
