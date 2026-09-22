'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { OutfitFormulaCard } from '@/components/profile/OutfitFormulaCard';
import { StyleProfile } from '@/lib/types';
import { SAMPLE_STYLE_PROFILE } from '@/lib/mockData';
import { Shirt, Sparkles, Filter, Tag } from 'lucide-react';
import Link from 'next/link';

export default function OutfitsPage() {
  const [profile, setProfile] = useState<StyleProfile>(SAMPLE_STYLE_PROFILE);
  const [filterOccasion, setFilterOccasion] = useState<string>('All');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('facefit_active_profile');
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const occasions = ['All', 'College', 'Presentation', 'Social'];

  const filteredOutfits = profile.outfitCombinations.filter((outfit) => {
    if (filterOccasion === 'All') return true;
    return (
      outfit.occasion.toLowerCase().includes(filterOccasion.toLowerCase()) ||
      outfit.title.toLowerCase().includes(filterOccasion.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
              <Shirt className="w-3.5 h-3.5" />
              Wardrobe Architecture
            </div>
            <h1 className="text-3xl font-serif-editorial font-bold text-neutral-900">
              Curated Outfit Combinations
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-xl">
              Engineered for your <strong className="text-neutral-800">{profile.colorPalette.seasonName}</strong> palette and <strong className="text-neutral-800">{profile.suggestedAesthetics[0]}</strong> aesthetic direction.
            </p>
          </div>

          {/* Occasion Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200 self-start md:self-auto">
            <span className="text-[10px] text-neutral-400 font-bold uppercase px-2">Occasion:</span>
            {occasions.map((occ) => (
              <button
                key={occ}
                onClick={() => setFilterOccasion(occ)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterOccasion === occ
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Outfit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {filteredOutfits.map((outfit, idx) => (
            <OutfitFormulaCard key={outfit.id} outfit={outfit} index={idx} />
          ))}
        </div>

        {/* Garment Fit Guidance Box */}
        <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-editorial">
              Structural Garment Fit Protocol
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.clothingRecommendations.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                  {item.category}
                </span>
                <h4 className="font-bold text-neutral-900 mb-1">{item.clothingType}</h4>
                <p className="text-[11px] text-neutral-600 leading-snug mb-2">
                  {item.fitGuidance}
                </p>
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
                  <span className="font-medium text-amber-800">{item.aesthetic}</span>
                  <span>{item.occasion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
