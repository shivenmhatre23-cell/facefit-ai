import React from 'react';
import Link from 'next/link';
import { StyleProfile } from '@/lib/types';
import { AgeEstimateBadge } from './AgeEstimateBadge';
import { Sparkles, Share2, RefreshCw, MessageSquare } from 'lucide-react';

interface ProfileHeaderProps {
  profile: StyleProfile;
  onOpenStylist: () => void;
  onOpenShare: () => void;
}

export function ProfileHeader({ profile, onOpenStylist, onOpenShare }: ProfileHeaderProps) {
  return (
    <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200/90 mb-8 shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Avatar & Identity Details */}
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative w-18 h-22 sm:w-20 sm:h-26 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 shadow-inner">
            {profile.userSelfiePreviewUrl ? (
              <img
                src={profile.userSelfiePreviewUrl}
                alt="Analyzed portrait preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 font-serif-editorial text-2xl font-bold bg-gradient-to-br from-amber-50 to-neutral-100">
                {profile.faceGeometry.shape.charAt(0)}
              </div>
            )}
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] text-white font-mono">
              Live
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif-editorial font-bold text-neutral-900 tracking-tight">
                {profile.suggestedAesthetics[0] || 'Modern Contemporary Profile'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                {profile.colorPalette.seasonName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <AgeEstimateBadge age={profile.estimatedAge} />

              <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                <span className="text-neutral-400">Shape:</span>
                <span className="font-semibold text-neutral-900">{profile.faceGeometry.shape}</span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                <span className="text-neutral-400">Undertone:</span>
                <span className="font-semibold text-neutral-900">{profile.observations.apparentUndertone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
          <button
            onClick={onOpenStylist}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            Chat with AI Stylist
          </button>

          <button
            onClick={onOpenShare}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            title="Share or Export Summary"
          >
            <Share2 className="w-3.5 h-3.5" />
            Export Card
          </button>

          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-500 hover:text-neutral-900 text-xs font-medium transition-colors"
            title="Analyze Another Portrait"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New
          </Link>
        </div>
      </div>
    </div>
  );
}
