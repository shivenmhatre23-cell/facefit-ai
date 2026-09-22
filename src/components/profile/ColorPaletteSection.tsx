'use client';

import React, { useState } from 'react';
import { ColorPalette } from '@/lib/types';
import { Palette, Copy, Check, Sparkles, XCircle, CheckCircle2 } from 'lucide-react';

interface ColorPaletteSectionProps {
  palette: ColorPalette;
}

export function ColorPaletteSection({ palette }: ColorPaletteSectionProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="luxury-card rounded-2xl p-6 sm:p-7 bg-white border border-neutral-200/90 shadow-2xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <Palette className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Color Architecture
              </span>
              <h3 className="text-base font-serif-editorial font-bold text-neutral-900">
                {palette.seasonName}
              </h3>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            {palette.contrastLevel}
          </span>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed mb-5">
          {palette.description}
        </p>

        {/* 6 Interactive Swatches */}
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2.5">
            Personal Palette Swatches (Click to copy Hex)
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {palette.swatches.map((swatch, idx) => (
              <button
                key={idx}
                onClick={() => handleCopyHex(swatch.hex)}
                className="group relative flex flex-col items-center p-2 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-neutral-400 transition-all text-left cursor-pointer"
                title={`Click to copy ${swatch.hex}`}
              >
                <div
                  className="w-full h-10 rounded-lg mb-1.5 shadow-inner border border-black/5 relative overflow-hidden"
                  style={{ backgroundColor: swatch.hex }}
                >
                  {copiedHex === swatch.hex && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-neutral-900 truncate w-full text-center">
                  {swatch.name}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 group-hover:text-amber-800 transition-colors">
                  {swatch.hex}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colors to wear & Sidestep */}
      <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Best Shades to Wear
          </span>
          <p className="text-emerald-900 text-[11px] leading-snug">
            {palette.colorsToWear.slice(0, 5).join(', ')}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-500" /> Shades to Sidestep
          </span>
          <p className="text-neutral-600 text-[11px] leading-snug">
            {palette.colorsToAvoid.slice(0, 4).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
