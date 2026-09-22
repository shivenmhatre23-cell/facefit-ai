'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HairstyleGrid } from '@/components/profile/HairstyleGrid';
import { StyleProfile } from '@/lib/types';
import { SAMPLE_STYLE_PROFILE } from '@/lib/mockData';
import { Scissors, Sparkles, Filter } from 'lucide-react';
import Link from 'next/link';

export default function HairstylesPage() {
  const [profile, setProfile] = useState<StyleProfile>(SAMPLE_STYLE_PROFILE);
  const [filterLevel, setFilterLevel] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

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

  const filteredHairstyles = profile.hairstyles.filter((h) => {
    if (filterLevel === 'All') return true;
    return h.maintenanceLevel === filterLevel;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
              <Scissors className="w-3.5 h-3.5" />
              Hair Architecture Studio
            </div>
            <h1 className="text-3xl font-serif-editorial font-bold text-neutral-900">
              Hairstyle Recommendations
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-xl">
              Cuts specifically tailored to your <strong className="text-neutral-800">{profile.faceGeometry.shape}</strong> facial geometry, hairline density, and natural <strong className="text-neutral-800">{profile.hairAnalysis.texture}</strong> wave texture.
            </p>
          </div>

          {/* Maintenance Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200 self-start md:self-auto">
            <span className="text-[10px] text-neutral-400 font-bold uppercase px-2">Filter:</span>
            {(['All', 'Low', 'Medium', 'High'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterLevel === lvl
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Hairstyle Cards Grid */}
        <HairstyleGrid hairstyles={filteredHairstyles} />

        {/* Barber Consultation Banner */}
        <div className="p-6 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
          <div>
            <h3 className="text-base font-serif-editorial font-bold text-white mb-1">
              Visiting your barber this week?
            </h3>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Every hairstyle card includes an official Barber Consultation Card with exact guard lengths and scissor blending notes to eliminate haircut surprises.
            </p>
          </div>
          <Link
            href="/profile"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-semibold transition-colors shrink-0"
          >
            View Complete Profile
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
