'use client';

import React, { useState } from 'react';
import { StyleProfile } from '@/lib/types';
import { X, Copy, Check, Printer, Sparkles, Share2 } from 'lucide-react';

interface ShareModalProps {
  profile: StyleProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ profile, isOpen, onClose }: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySummaryText = () => {
    const text = `FACFIT AI - PERSONAL STYLE CARD
Aesthetic: ${profile.suggestedAesthetics[0] || 'Contemporary'}
Face Shape: ${profile.faceGeometry.shape}
AI Age Bracket: ${profile.estimatedAge.range} (${profile.estimatedAge.confidence} confidence)
Color Palette: ${profile.colorPalette.seasonName}
Top Hairstyle: ${profile.hairstyles[0]?.name}
Barber Instructions: ${profile.hairstyles[0]?.barberInstructions?.sidesAndBack}
Generated via FaceFit AI`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-2xl p-6 sm:p-8 animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
            Export & Share
          </span>
          <h3 className="text-xl font-serif-editorial font-bold text-neutral-900">
            Your Style Dossier
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Save or share your personalized styling parameters.
          </p>
        </div>

        {/* Mini Preview Card */}
        <div className="p-4 rounded-xl bg-[#FAFAFA] border border-neutral-200/90 mb-6 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
              FaceFit AI Dossier
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 block">Face Shape</span>
              <span className="font-semibold text-neutral-900">{profile.faceGeometry.shape}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">AI Age Estimate</span>
              <span className="font-semibold text-neutral-900">{profile.estimatedAge.range}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">Color Season</span>
              <span className="font-semibold text-neutral-900">{profile.colorPalette.seasonName}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">Recommended Hair</span>
              <span className="font-semibold text-neutral-900 truncate block">
                {profile.hairstyles[0]?.name}
              </span>
            </div>
          </div>

          {/* Palette preview dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {profile.colorPalette.swatches.slice(0, 6).map((s, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                style={{ backgroundColor: s.hex }}
                title={s.name}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleCopySummaryText}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Dossier Text Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Full Text Summary
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              {copiedLink ? 'Link Copied' : 'Copy Page Link'}
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
