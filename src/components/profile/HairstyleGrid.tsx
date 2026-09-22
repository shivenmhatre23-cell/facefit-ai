'use client';

import React, { useState } from 'react';
import { HairstyleRecommendation } from '@/lib/types';
import { BarberInstructionModal } from './BarberInstructionModal';
import { Scissors, Clock, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';

interface HairstyleGridProps {
  hairstyles: HairstyleRecommendation[];
}

export function HairstyleGrid({ hairstyles }: HairstyleGridProps) {
  const [selectedHair, setSelectedHair] = useState<HairstyleRecommendation | null>(null);

  const maintenanceColors = {
    Low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    High: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
            Hair Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-neutral-900">
            Tailored Hairstyle Recommendations
          </h2>
        </div>
        <span className="text-xs text-neutral-500 hidden sm:inline-block">
          Calibrated to jawline angles & hair volume
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hairstyles.map((hair) => (
          <div
            key={hair.id}
            className="luxury-card rounded-2xl p-6 bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
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

              {/* Hairstyle Name */}
              <h3 className="text-base font-serif-editorial font-bold text-neutral-900 mb-2">
                {hair.name}
              </h3>

              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                {hair.explanation}
              </p>

              {/* Why It Works Box */}
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 mb-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Why It Complements Your Proportions
                </span>
                <p className="text-[11px] text-neutral-700 leading-relaxed">
                  {hair.whyItWorks}
                </p>
              </div>
            </div>

            {/* Barber Card Trigger Button */}
            <button
              onClick={() => setSelectedHair(hair)}
              className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-700 group-hover:text-amber-400 transition-colors" />
              View Barber Instructions Card
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        ))}
      </div>

      {/* Barber Instruction Modal */}
      <BarberInstructionModal
        hairstyle={selectedHair}
        onClose={() => setSelectedHair(null)}
      />
    </div>
  );
}
