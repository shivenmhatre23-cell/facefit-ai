'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StyleProfile } from '@/lib/types';
import { AgeEstimateBadge } from './AgeEstimateBadge';
import { Sparkles, Share2, RefreshCw, MessageSquare, Sliders, User } from 'lucide-react';

interface ProfileHeaderProps {
  profile: StyleProfile;
  onOpenStylist: () => void;
  onOpenShare: () => void;
  onOpenPreferences?: () => void;
  onAgeUpdate?: (newRange: string) => void;
}

export function ProfileHeader({
  profile,
  onOpenStylist,
  onOpenShare,
  onOpenPreferences,
  onAgeUpdate,
}: ProfileHeaderProps) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ephemeralImg = sessionStorage.getItem('facefit_preview_image');
      if (ephemeralImg) {
        setPreviewImg(ephemeralImg);
      }
    }
  }, []);

  const faceShape = profile?.faceGeometry?.shape || 'Oval';
  const confidence = profile?.faceGeometry?.confidence || 'medium';
  const hairLength = profile?.hairAnalysis?.length || 'Medium';
  const hairTexture = profile?.hairAnalysis?.texture || 'Natural';
  const hairVolume = profile?.hairAnalysis?.volume || 'Natural Density';
  const aesthetics = profile?.suggestedAesthetics || ['Modern Tailoring', 'Casual Contemporary'];
  const palette = profile?.colorPalette;
  const swatches = palette?.swatches || [];

  return (
    <div className="luxury-card rounded-3xl p-6 sm:p-9 bg-white border border-neutral-200 shadow-xs mb-10">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          {previewImg ? (
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-neutral-300 shadow-xs shrink-0">
              <img src={previewImg} alt="Ephemeral Portrait" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
              Personal Sartorial Blueprint
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-neutral-900 tracking-tight">
              Your Style Profile
            </h1>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenPreferences && (
            <button
              onClick={onOpenPreferences}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Adjust your lifestyle, budget, and maintenance parameters"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              Tune Preferences
            </button>
          )}

          <button
            onClick={onOpenStylist}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            Ask AI Stylist
          </button>

          <button
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            title="Export Profile Card"
          >
            <Share2 className="w-3.5 h-3.5" />
            Export
          </button>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-500 hover:text-neutral-900 text-xs font-medium transition-colors"
            title="Analyze another photo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-upload
          </Link>
        </div>
      </div>

      {/* 5 Visible Characteristics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
        {/* 1. Estimated Age Range */}
        <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">
            Approx. Age Range
          </span>
          <AgeEstimateBadge age={profile?.estimatedAge} onAgeUpdate={onAgeUpdate} />
        </div>

        {/* 2. Face Shape */}
        <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">
            Face Shape
          </span>
          <div>
            <div className="text-base font-serif-editorial font-bold text-neutral-900">
              {faceShape}
            </div>
            <span className="text-[10px] text-neutral-500 font-medium">
              {confidence} confidence
            </span>
          </div>
        </div>

        {/* 3. Hair Characteristics */}
        <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">
            Hair Characteristics
          </span>
          <div>
            <div className="text-xs font-bold text-neutral-900">
              {hairLength} • {hairTexture}
            </div>
            <span className="text-[10px] text-neutral-500">
              {hairVolume}
            </span>
          </div>
        </div>

        {/* 4. Style Direction */}
        <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">
            Style Direction
          </span>
          <div>
            <div className="text-xs font-bold text-neutral-900 truncate">
              {aesthetics[0] || 'Modern Tailoring'}
            </div>
            <span className="text-[10px] text-amber-800 font-medium">
              {aesthetics[1] || 'Casual Contemporary'}
            </span>
          </div>
        </div>

        {/* 5. Recommended Color Palette */}
        <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">
            Color Palette
          </span>
          <div>
            <div className="text-xs font-bold text-neutral-900 truncate">
              {palette?.seasonName || 'Warm Harmonized'}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {swatches.slice(0, 5).map((s, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: s.hex }}
                  title={s.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
