'use client';

import React, { useState, useEffect } from 'react';
import { HairstyleRecommendation } from '@/lib/types';
import { Scissors, X, Copy, Check } from 'lucide-react';

interface BarberInstructionModalProps {
  hairstyle: HairstyleRecommendation | null;
  onClose: () => void;
}

export function BarberInstructionModal({ hairstyle, onClose }: BarberInstructionModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && hairstyle) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hairstyle, onClose]);

  if (!hairstyle) return null;

  const instructions = hairstyle.barberInstructions || {
    fadeOrTaperType: 'Low Taper Fade',
    sidesAndBack: 'Clean taper fade on sides, blended to natural texture',
    topLength: '2 to 2.5 inches scissor-textured',
    stylingFinish: 'Natural matte finish',
  };

  const products = Array.isArray(hairstyle.suitableProducts) && hairstyle.suitableProducts.length > 0
    ? hairstyle.suitableProducts
    : ['Matte Styling Clay', 'Texture Spray'];

  const handleCopy = () => {
    const text = `FACEFIT AI - BARBER CONSULTATION CARD
Cut: ${hairstyle.name}
Fade/Taper: ${instructions.fadeOrTaperType}
Sides & Back: ${instructions.sidesAndBack}
Top Length & Cut: ${instructions.topLength}
Styling Finish: ${instructions.stylingFinish}
Styling Products: ${products.join(', ')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="barber-modal-title"
        className="relative w-full max-w-lg bg-white rounded-2xl border border-neutral-200 shadow-2xl p-6 sm:p-8 animate-scaleUp text-neutral-900"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
              Official Barber Instruction Card
            </span>
            <h3 id="barber-modal-title" className="text-xl font-serif-editorial font-bold text-neutral-900">
              {hairstyle.name}
            </h3>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-6">
          Show this card directly to your barber or hair stylist. It provides exact clipper guard numbers, scissor techniques, and blending instructions.
        </p>

        {/* The Instructions Grid */}
        <div className="space-y-3.5 mb-6 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
              Sides & Back Execution
            </span>
            <p className="font-semibold text-neutral-900 leading-relaxed break-words">
              {instructions.sidesAndBack}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
              Top Length & Texture
            </span>
            <p className="font-semibold text-neutral-900 leading-relaxed break-words">
              {instructions.topLength}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
                Taper / Fade Style
              </span>
              <p className="font-medium text-neutral-800 break-words">
                {instructions.fadeOrTaperType}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
                Styling Finish
              </span>
              <p className="font-medium text-neutral-800 break-words">
                {instructions.stylingFinish}
              </p>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="mb-6 pt-3 border-t border-neutral-100">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-2">
            Recommended Daily Styling Products
          </span>
          <div className="flex flex-wrap gap-2">
            {products.map((p, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Full Barber Card
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
