'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Scissors,
  Shirt,
  Footprints,
  Watch,
  Palette,
  Bookmark,
  Check,
  RotateCcw,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { BUILDER_OPTIONS, DEFAULT_LOOK } from '@/lib/lookBuilder/builderStore';
import { CustomLook } from '@/lib/types';
import { saveLookRecord } from '@/lib/saved/looksStore';
import { LookPreviewModal } from '@/components/preview/LookPreviewModal';

export default function LookBuilderPage() {
  const [currentLook, setCurrentLook] = useState<CustomLook>(DEFAULT_LOOK);
  const [activeTab, setActiveTab] = useState<'hair' | 'top' | 'bottom' | 'shoes' | 'accessory' | 'colors'>('top');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const handleSelectHair = (hair: (typeof BUILDER_OPTIONS.hairstyles)[0]) => {
    setCurrentLook((prev) => ({
      ...prev,
      hair: {
        style: hair.name,
        length: hair.length,
        maintenance: `${hair.maintenance} Maintenance`,
      },
    }));
  };

  const handleSelectTop = (top: (typeof BUILDER_OPTIONS.tops)[0]) => {
    setCurrentLook((prev) => ({
      ...prev,
      top: {
        item: top.name,
        color: top.defaultColor,
        fit: 'Tailored drape',
      },
    }));
  };

  const handleSelectBottom = (bottom: (typeof BUILDER_OPTIONS.bottoms)[0]) => {
    setCurrentLook((prev) => ({
      ...prev,
      bottom: {
        item: bottom.name,
        color: bottom.defaultColor,
        fit: 'Straight leg cut',
      },
    }));
  };

  const handleSelectShoes = (shoe: (typeof BUILDER_OPTIONS.shoes)[0]) => {
    setCurrentLook((prev) => ({
      ...prev,
      shoes: {
        item: shoe.name,
        color: shoe.defaultColor,
      },
    }));
  };

  const handleSelectAccessory = (acc: (typeof BUILDER_OPTIONS.accessories)[0]) => {
    setCurrentLook((prev) => ({
      ...prev,
      accessory: {
        item: acc.name,
        color: acc.defaultColor,
      },
    }));
  };

  const handleSelectTheme = (theme: (typeof BUILDER_OPTIONS.colorThemes)[0]) => {
    setCurrentLook((prev) => ({
      ...prev,
      dominantColors: theme.colors,
      name: `${theme.name} Ensemble`,
    }));
  };

  const handleSaveToLookbook = () => {
    saveLookRecord({
      name: currentLook.name || 'Custom Curated Look',
      type: 'complete_look',
      occasion: currentLook.occasion || 'Everyday / Casual',
      style: 'Custom Coordinated',
      colors: currentLook.dominantColors,
      details: currentLook,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <Layers className="w-4 h-4" />
              Interactive Look Builder
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Build & Coordinate Your Look
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Mix and match modular garments, hairstyle proportions, and balanced color themes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentLook(DEFAULT_LOOK)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-medium text-neutral-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleSaveToLookbook}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {savedSuccess ? 'Saved to Lookbook' : 'Save Ensemble'}
            </button>
          </div>
        </div>

        {/* Builder Studio: Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Component Picker Navigation & Options */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200 scrollbar-none">
              {[
                { id: 'top', label: 'Tops', icon: Shirt },
                { id: 'bottom', label: 'Bottoms', icon: Layers },
                { id: 'shoes', label: 'Footwear', icon: Footprints },
                { id: 'hair', label: 'Hairstyle', icon: Scissors },
                { id: 'accessory', label: 'Accessories', icon: Watch },
                { id: 'colors', label: 'Palette', icon: Palette },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Panes */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
              {/* TOPS */}
              {activeTab === 'top' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Select Upper Body Garment
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUILDER_OPTIONS.tops.map((top) => {
                      const selected = currentLook.top.item === top.name;
                      return (
                        <button
                          key={top.name}
                          onClick={() => handleSelectTop(top)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            selected
                              ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                          }`}
                        >
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase">{top.category}</span>
                          <h4 className="text-sm font-semibold text-neutral-900 mt-0.5">{top.name}</h4>
                          <p className="text-xs text-neutral-500 mt-1">Tone: {top.defaultColor}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BOTTOMS */}
              {activeTab === 'bottom' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Select Trousers / Jeans
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUILDER_OPTIONS.bottoms.map((b) => {
                      const selected = currentLook.bottom.item === b.name;
                      return (
                        <button
                          key={b.name}
                          onClick={() => handleSelectBottom(b)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            selected
                              ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                          }`}
                        >
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase">{b.category}</span>
                          <h4 className="text-sm font-semibold text-neutral-900 mt-0.5">{b.name}</h4>
                          <p className="text-xs text-neutral-500 mt-1">Tone: {b.defaultColor}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FOOTWEAR */}
              {activeTab === 'shoes' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Select Footwear
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUILDER_OPTIONS.shoes.map((sh) => {
                      const selected = currentLook.shoes.item === sh.name;
                      return (
                        <button
                          key={sh.name}
                          onClick={() => handleSelectShoes(sh)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            selected
                              ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                          }`}
                        >
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase">{sh.category}</span>
                          <h4 className="text-sm font-semibold text-neutral-900 mt-0.5">{sh.name}</h4>
                          <p className="text-xs text-neutral-500 mt-1">Tone: {sh.defaultColor}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* HAIRSTYLE */}
              {activeTab === 'hair' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Coordinate Hairstyle Silhouette
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUILDER_OPTIONS.hairstyles.map((hair) => {
                      const selected = currentLook.hair.style === hair.name;
                      return (
                        <button
                          key={hair.name}
                          onClick={() => handleSelectHair(hair)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            selected
                              ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                          }`}
                        >
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                            {hair.length} • {hair.maintenance} Maint.
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-900 mt-0.5">{hair.name}</h4>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACCESSORIES */}
              {activeTab === 'accessory' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Accent Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUILDER_OPTIONS.accessories.map((acc) => {
                      const selected = currentLook.accessory?.item === acc.name;
                      return (
                        <button
                          key={acc.name}
                          onClick={() => handleSelectAccessory(acc)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            selected
                              ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                          }`}
                        >
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase">{acc.category}</span>
                          <h4 className="text-sm font-semibold text-neutral-900 mt-0.5">{acc.name}</h4>
                          <p className="text-xs text-neutral-500 mt-1">Finish: {acc.defaultColor}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PALETTE THEMES */}
              {activeTab === 'colors' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Harmonizing Color Schemes
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUILDER_OPTIONS.colorThemes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => handleSelectTheme(theme)}
                        className="p-4 rounded-2xl border border-neutral-200 hover:border-neutral-400 text-left transition-all space-y-2.5 bg-neutral-50/50"
                      >
                        <span className="text-xs font-semibold text-neutral-900">{theme.name}</span>
                        <div className="flex items-center gap-1.5">
                          {theme.colors.map((hex, idx) => (
                            <span
                              key={idx}
                              className="w-7 h-7 rounded-lg border border-black/10 shadow-xs"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Ensemble Stage & Actions */}
          <div className="lg:col-span-5 space-y-5 sticky top-24">
            <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 text-white shadow-xl border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                    COORDINATION STAGE
                  </span>
                  <h3 className="font-serif text-xl font-bold text-neutral-100">{currentLook.name}</h3>
                </div>
                <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Coordinated Garment List */}
              <div className="space-y-3 text-xs">
                {/* Hairstyle */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-amber-300" />
                    <div>
                      <span className="text-neutral-400 block text-[10px]">HAIRSTYLE</span>
                      <span className="font-medium text-neutral-100">{currentLook.hair.style}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400">{currentLook.hair.maintenance}</span>
                </div>

                {/* Top */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-indigo-300" />
                    <div>
                      <span className="text-neutral-400 block text-[10px]">TOP</span>
                      <span className="font-medium text-neutral-100">{currentLook.top.item}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400">{currentLook.top.color}</span>
                </div>

                {/* Bottom */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-300" />
                    <div>
                      <span className="text-neutral-400 block text-[10px]">BOTTOM</span>
                      <span className="font-medium text-neutral-100">{currentLook.bottom.item}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400">{currentLook.bottom.color}</span>
                </div>

                {/* Footwear */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-neutral-400 block text-[10px]">FOOTWEAR</span>
                      <span className="font-medium text-neutral-100">{currentLook.shoes.item}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400">{currentLook.shoes.color}</span>
                </div>

                {/* Accessory */}
                {currentLook.accessory && (
                  <div className="flex items-start justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                    <div className="flex items-center gap-2">
                      <Watch className="w-4 h-4 text-neutral-300" />
                      <div>
                        <span className="text-neutral-400 block text-[10px]">ACCESSORY</span>
                        <span className="font-medium text-neutral-100">{currentLook.accessory.item}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400">{currentLook.accessory.color}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => setPreviewModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 transition shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  Try This Look (AI Visual Preview)
                </button>
                <button
                  onClick={handleSaveToLookbook}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition border border-neutral-700"
                >
                  <Bookmark className="w-4 h-4" />
                  Save Look to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Look Preview Modal */}
      <LookPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        target={{
          type: 'complete_look',
          name: currentLook.name,
          details: {
            style: 'Balanced Contemporary',
            occasion: currentLook.occasion,
            pieces: [
              { item: currentLook.top.item, color: currentLook.top.color },
              { item: currentLook.bottom.item, color: currentLook.bottom.color },
              { item: currentLook.shoes.item, color: currentLook.shoes.color },
            ],
          },
        }}
      />
    </div>
  );
}
