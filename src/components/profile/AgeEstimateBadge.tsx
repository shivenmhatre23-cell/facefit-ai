import React, { useState } from 'react';
import { AgeEstimate } from '@/lib/types';
import { Info } from 'lucide-react';

interface AgeEstimateBadgeProps {
  age: AgeEstimate;
}

export function AgeEstimateBadge({ age }: AgeEstimateBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const confidenceStyles = {
    high: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    low: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  return (
    <div className="relative inline-flex items-center">
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200/90 text-xs font-medium cursor-help select-none group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((prev) => !prev)}
      >
        <span className="text-neutral-400 font-normal">AI Age Bracket:</span>
        <span className="font-semibold text-neutral-900">{age.range}</span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
            confidenceStyles[age.confidence] || confidenceStyles.medium
          }`}
        >
          {age.confidence} confidence
        </span>
        <Info className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
      </div>

      {showTooltip && (
        <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-neutral-900 text-white text-[11px] leading-relaxed rounded-xl shadow-xl z-50 animate-fadeIn border border-neutral-800">
          <p className="font-semibold text-amber-400 mb-1">Ethical AI Estimate Notice</p>
          <p className="text-neutral-300">
            {age.disclaimer ||
              'Approximate AI visual estimate for aesthetic, silhouette proportion, and color curation only. Never presented as exact biometric fact.'}
          </p>
        </div>
      )}
    </div>
  );
}
