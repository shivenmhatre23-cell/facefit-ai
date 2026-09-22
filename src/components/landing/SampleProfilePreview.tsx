'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SAMPLE_STYLE_PROFILE } from '@/lib/mockData';
import { Sparkles, Scissors, Palette, Shirt, ArrowUpRight, Copy, Check } from 'lucide-react';

export function SampleProfilePreview() {
  const [activeTab, setActiveTab] = useState<'hair' | 'color' | 'outfit'>('hair');
  const [copiedInstruction, setCopiedInstruction] = useState(false);

  const sampleHair = SAMPLE_STYLE_PROFILE.hairstyles[0];
  const sampleOutfit = SAMPLE_STYLE_PROFILE.outfitCombinations[0];

  const handleCopyBarberCard = () => {
    const text = `BARBER INSTRUCTIONS:
Hairstyle: ${sampleHair.name}
Sides & Back: ${sampleHair.barberInstructions.sidesAndBack}
Top Length: ${sampleHair.barberInstructions.topLength}
Fade/Taper: ${sampleHair.barberInstructions.fadeOrTaperType}
Finish: ${sampleHair.barberInstructions.stylingFinish}`;
    navigator.clipboard.writeText(text);
    setCopiedInstruction(true);
    setTimeout(() => setCopiedInstruction(false), 2000);
  };

  return (
    <section className="py-16 bg-white border-y border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-700">
            Interactive Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-editorial text-neutral-900 mt-1 mb-2">
            Inside a Generated Style Profile
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Click through the sample outputs below to see the depth of personalized grooming and fashion intelligence FaceFit AI generates.
          </p>
        </div>

        {/* The Card Container */}
        <div className="luxury-card rounded-2xl overflow-hidden border border-neutral-200 bg-white max-w-4xl mx-auto shadow-sm">
          {/* Top Profile Summary Bar */}
          <div className="bg-neutral-50/70 border-b border-neutral-200/90 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800 font-serif-editorial font-bold text-lg">
                F
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Profile: Contemporary Classic
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500">
                  <span>Shape: <strong>Oval</strong></span>
                  <span>•</span>
                  <span>AI Age Est: <strong>21–25 yrs</strong></span>
                  <span>•</span>
                  <span>Palette: <strong>Deep Warm Autumn</strong></span>
                </div>
              </div>
            </div>

            <Link
              href="/profile?sample=true"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-amber-800 transition-colors"
            >
              Open Full Profile <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Tabs */}
          <div className="flex border-b border-neutral-200 bg-white px-6 gap-6">
            <button
              onClick={() => setActiveTab('hair')}
              className={`py-3.5 text-xs font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'hair'
                  ? 'border-neutral-900 text-neutral-950 font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              Hairstyle & Barber Card
            </button>
            <button
              onClick={() => setActiveTab('color')}
              className={`py-3.5 text-xs font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'color'
                  ? 'border-neutral-900 text-neutral-950 font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Color Harmony
            </button>
            <button
              onClick={() => setActiveTab('outfit')}
              className={`py-3.5 text-xs font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'outfit'
                  ? 'border-neutral-900 text-neutral-950 font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              Wardrobe Formula
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 sm:p-8 min-h-[300px]">
            {activeTab === 'hair' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-serif-editorial font-bold text-neutral-900">
                      {sampleHair.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">
                      {sampleHair.explanation}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                      Effort: ~{sampleHair.stylingEffortMinutes} mins
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      {sampleHair.maintenanceLevel} Maintenance
                    </span>
                  </div>
                </div>

                {/* The Barber Card Box */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-800 flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-amber-700" />
                      Direct Barber Instructions (Hand to your stylist)
                    </span>
                    <button
                      onClick={handleCopyBarberCard}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 transition-colors shadow-2xs"
                    >
                      {copiedInstruction ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-neutral-400" /> Copy Card
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-neutral-200/60">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5">Sides & Back</span>
                      <p className="text-neutral-700 text-[12px]">{sampleHair.barberInstructions.sidesAndBack}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-neutral-200/60">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5">Top Length & Technique</span>
                      <p className="text-neutral-700 text-[12px]">{sampleHair.barberInstructions.topLength}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'color' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h4 className="text-lg font-serif-editorial font-bold text-neutral-900">
                    {SAMPLE_STYLE_PROFILE.colorPalette.seasonName}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">
                    {SAMPLE_STYLE_PROFILE.colorPalette.description}
                  </p>
                </div>

                {/* Swatch Grid */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-600 block mb-2.5">
                    Curated 6-Color Swatch Set
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {SAMPLE_STYLE_PROFILE.colorPalette.swatches.map((swatch, idx) => (
                      <div key={idx} className="group flex flex-col rounded-xl overflow-hidden border border-neutral-200 bg-white p-2">
                        <div
                          className="w-full h-12 rounded-lg shadow-inner mb-2 border border-black/5"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-xs font-semibold text-neutral-900 truncate">
                          {swatch.name}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {swatch.hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <span className="font-semibold text-emerald-900 block mb-1">Recommended Contrast</span>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      {SAMPLE_STYLE_PROFILE.colorPalette.colorsToWear.join(' • ')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold text-neutral-800 block mb-1">Complementary Metals</span>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      {SAMPLE_STYLE_PROFILE.colorPalette.metalsRecommended.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'outfit' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-serif-editorial font-bold text-neutral-900">
                      {sampleOutfit.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Occasion: {sampleOutfit.occasion}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white w-fit">
                    {sampleOutfit.budgetTier}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sampleOutfit.pieces.map((piece, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          Piece 0{i + 1}
                        </span>
                        {piece.estimatedBudgetINR && (
                          <span className="text-[11px] font-semibold text-neutral-700 font-mono">
                            {piece.estimatedBudgetINR}
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-neutral-900">{piece.item}</h5>
                      <span className="text-[11px] text-neutral-500 block mb-1.5">Color: {piece.color}</span>
                      <p className="text-[11px] text-neutral-600 leading-snug">{piece.stylingTip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
