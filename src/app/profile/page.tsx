'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StyleDnaCard } from '@/components/profile/StyleDnaCard';
import { FaceShapeCard } from '@/components/profile/FaceShapeCard';
import { ColorPaletteSection } from '@/components/profile/ColorPaletteSection';
import { HairstyleGrid } from '@/components/profile/HairstyleGrid';
import { WardrobeSection } from '@/components/profile/WardrobeSection';
import { GroomingAndAccessories } from '@/components/profile/GroomingAndAccessories';
import { StylistDrawer } from '@/components/stylist/StylistDrawer';
import { ShareModal } from '@/components/profile/ShareModal';
import { ShareableStyleCard } from '@/components/profile/ShareableStyleCard';
import { PersonalStyleQuizModal } from '@/components/quiz/PersonalStyleQuizModal';
import { StylePreferencesModal } from '@/components/preferences/StylePreferencesModal';
import { SAMPLE_STYLE_PROFILE } from '@/lib/mockData';
import { StyleProfile } from '@/lib/types';
import { MessageSquare, Sparkles, ShieldCheck, Dna } from 'lucide-react';
import confetti from 'canvas-confetti';

function ProfileContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<StyleProfile>(SAMPLE_STYLE_PROFILE);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const isSample = searchParams.get('sample') === 'true';

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('facefit_active_profile');
      if (stored && !isSample) {
        try {
          const parsed = JSON.parse(stored) as StyleProfile;
          setProfile(parsed);
        } catch (e) {
          console.error('Failed to parse stored profile:', e);
          setProfile(SAMPLE_STYLE_PROFILE);
        }
      } else {
        setProfile(SAMPLE_STYLE_PROFILE);
      }
    }
    setIsLoaded(true);

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.2 },
        colors: ['#d97706', '#b45309', '#171717', '#e2e8f0'],
      });
    } catch {
      // Ignored if canvas unsupported
    }
  }, [searchParams]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          Loading your style dossier...
        </div>
      </div>
    );
  }

  const faceShape = profile?.faceGeometry?.shape || 'Oval';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Profile Header Card */}
        <ProfileHeader
          profile={profile}
          onOpenStylist={() => setIsStylistOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenPreferences={() => setIsPreferencesOpen(true)}
        />

        {/* Style DNA Affinity Card */}
        <StyleDnaCard
          profile={profile}
          onRetakeQuiz={() => setIsQuizOpen(true)}
          onShare={() => setIsShareCardOpen(true)}
        />

        {/* 2-Column Geometry & Color Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FaceShapeCard profile={profile} />
          <ColorPaletteSection palette={profile?.colorPalette} />
        </div>

        {/* Hairstyle Recommendations with Barber Card & Transparency */}
        <HairstyleGrid
          hairstyles={profile?.hairstyles}
          faceShape={faceShape}
          onOpenPreferences={() => setIsPreferencesOpen(true)}
        />

        {/* Wardrobe & Outfits with Scored INR Budgets */}
        <WardrobeSection
          profile={profile}
          onOpenPreferences={() => setIsPreferencesOpen(true)}
        />

        {/* Grooming Protocol & Accessories */}
        <GroomingAndAccessories profile={profile} />

        {/* Ethical Guarantee Ribbon */}
        <div className="p-4 rounded-2xl bg-neutral-100/80 border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            FaceFit AI scores recommendations based on your preferences, climate, and visible geometry. We never judge attractiveness.
          </span>
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Adjust Parameters
          </button>
        </div>
      </main>

      {/* Floating Stylist Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsStylistOpen(true)}
          className="group flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all border border-neutral-700 cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="text-xs font-semibold tracking-wide">
            Ask AI Stylist
          </span>
        </button>
      </div>

      {/* Slide-over Stylist Drawer */}
      <StylistDrawer
        profile={profile}
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
      />

      {/* Share / Export Modal */}
      <ShareModal
        profile={profile}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Shareable Style Identity Card */}
      <ShareableStyleCard
        profile={profile}
        isOpen={isShareCardOpen}
        onClose={() => setIsShareCardOpen(false)}
      />

      {/* Personal Style Quiz Modal */}
      <PersonalStyleQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      {/* Style Preferences Tuning Modal */}
      <StylePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
            Loading style parameters...
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
