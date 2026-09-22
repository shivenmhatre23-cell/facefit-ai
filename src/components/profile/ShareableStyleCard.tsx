'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, QrCode, ShieldCheck, Sparkles, Download } from 'lucide-react';
import { StyleProfile } from '@/lib/types';
import { computeStyleDna } from '@/lib/styleDna/dnaEngine';

interface ShareableStyleCardProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: StyleProfile;
}

export function ShareableStyleCard({ isOpen, onClose, profile }: ShareableStyleCardProps) {
  const [copied, setCopied] = useState(false);
  const dna = computeStyleDna(profile);

  if (!isOpen) return null;

  const handleCopyShareText = () => {
    const text = [
      `✨ My FaceFit AI Style Identity`,
      `Signature Style: ${dna.signatureStyle}`,
      `DNA Breakdown: Minimalist (${dna.breakdown.minimal}%), Smart Casual (${dna.breakdown.smartCasual}%), Streetwear (${dna.breakdown.streetwear}%)`,
      `Best Palettes: ${dna.preferredColors.join(', ')}`,
      `Explore your personalized style: https://facefit-ai.app`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-neutral-800" />
            <span className="text-xs font-semibold text-neutral-900">Share Style Identity</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body - The Shareable Visual */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div
            id="shareable-card"
            className="relative p-6 rounded-3xl bg-neutral-950 text-white shadow-xl border border-neutral-800 overflow-hidden space-y-5"
          >
            {/* Background ambient accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Brand Card Header */}
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-mono">
                  STYLE PASSPORT
                </span>
                <h4 className="font-serif text-lg font-bold text-white tracking-wide">FACEFIT AI</h4>
              </div>
              <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center bg-neutral-900 text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Identity Details */}
            <div className="space-y-1">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Aesthetic Archetype</div>
              <div className="text-xl font-serif font-bold text-neutral-100">{dna.signatureStyle}</div>
              <div className="flex items-center gap-2 pt-1 text-xs text-neutral-300">
                <span>{profile?.faceGeometry?.shape || 'Geometric'} Symmetry</span>
                <span>•</span>
                <span>{profile?.colorPalette?.seasonName || 'Warm Neutral'} Palette</span>
              </div>
            </div>

            {/* Style DNA Metrics */}
            <div className="space-y-2 py-1">
              <div className="flex justify-between text-[11px] text-neutral-400 uppercase">
                <span>Resonance Distribution</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-sm font-bold text-white">{dna.breakdown.minimal}%</div>
                  <div className="text-[10px] text-neutral-400">Minimalist</div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-sm font-bold text-white">{dna.breakdown.smartCasual}%</div>
                  <div className="text-[10px] text-neutral-400">Smart Casual</div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-sm font-bold text-white">{dna.breakdown.streetwear}%</div>
                  <div className="text-[10px] text-neutral-400">Streetwear</div>
                </div>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Signature Harmonizing Tones</div>
              <div className="flex items-center gap-2">
                {dna.preferredColors.slice(0, 4).map((color, idx) => (
                  <div
                    key={idx}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] text-center text-neutral-300 truncate"
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer QR & Privacy Seal */}
            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-neutral-400" />
                <div className="text-[9px] text-neutral-400 leading-tight">
                  <div className="font-semibold text-neutral-300">PRIVACY VERIFIED</div>
                  <div>Zero raw facial data exposed</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-1 rounded-full border border-emerald-800/40">
                <ShieldCheck className="w-3 h-3" />
                Encrypted Profile
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCopyShareText}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Summary' : 'Copy Share Text'}
          </button>
        </div>
      </div>
    </div>
  );
}
