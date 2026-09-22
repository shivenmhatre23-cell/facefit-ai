'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  Cpu,
  Dna,
  Scissors,
  Shirt,
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { BeforeAfterSlider } from '../preview/BeforeAfterSlider';

const DEMO_STEPS = [
  {
    id: 1,
    title: '01 Upload Selfie',
    label: 'Privacy-First Ingestion',
    icon: Camera,
    headline: 'Secure In-Memory Portrait Upload',
    description:
      'Upload a front-facing portrait. Images are verified locally in-memory, stripped of metadata, and never shared or sold.',
  },
  {
    id: 2,
    title: '02 AI Facial Scanning',
    label: 'Optical Geometry & Palette',
    icon: Cpu,
    headline: 'Neutral Facial Geometry & Color Temperature',
    description:
      'The ethical vision engine detects face shape, hair density, and skin undertone without predicting sensitive traits or attractiveness.',
  },
  {
    id: 3,
    title: '03 Style DNA Profile',
    label: 'Aesthetic Breakdown',
    icon: Dna,
    headline: 'Personalized Style DNA & Silhouettes',
    description:
      'Generates an individualized Style DNA (84% Minimal, 78% Smart Casual) mapping ideal cuts, collar types, and harmonizing colors.',
  },
  {
    id: 4,
    title: '04 Barber-Ready Spec',
    label: 'Grooming Blueprint',
    icon: Scissors,
    headline: 'Precise Barber Spec & Clipper Guard Directives',
    description:
      'Get practical instructions for your stylist: clipper guard numbers, fade transitions, crown volume, and daily styling effort.',
  },
  {
    id: 5,
    title: '05 Try This Look Preview',
    label: 'Identity-Preserving Visualizer',
    icon: Shirt,
    headline: 'Interactive Before/After Style Synthesis',
    description:
      'Preview hairstyles and coordinated outfits directly on your silhouette with our draggable comparison slider.',
  },
];

export function InteractiveProductDemo() {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = DEMO_STEPS.find((s) => s.id === activeStep) || DEMO_STEPS[0];

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl overflow-hidden p-6 md:p-10 space-y-8">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Product Walkthrough
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-neutral-100 mt-1">
            How FaceFit AI Transforms Your Style
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Experience the 5-step journey from uploaded selfie to cohesive wardrobe blueprint
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Demo' : 'Autoplay Demo'}
          </button>
        </div>
      </div>

      {/* 5 Step Progress Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {DEMO_STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(step.id);
                setIsPlaying(false);
              }}
              className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-neutral-800 border-neutral-600 shadow-inner'
                  : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-800/40 text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-neutral-500'}`} />
                <span className="text-[10px] font-mono text-neutral-500">0{step.id}</span>
              </div>
              <div>
                <div className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                  {step.title.replace(/^[0-9]+\s/, '')}
                </div>
                <div className="text-[10px] text-neutral-500 truncate">{step.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Stage Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Left Column: Explanations & Step Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-medium border border-amber-400/20">
            Step 0{currentStep.id} of 05
          </div>
          <h4 className="font-serif text-2xl font-bold text-white leading-tight">
            {currentStep.headline}
          </h4>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-950 font-medium text-xs hover:bg-neutral-200 transition shadow-sm"
            >
              Experience Live on Your Photo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Simulation Stage */}
        <div className="lg:col-span-7 bg-neutral-950/80 rounded-2xl border border-neutral-800 p-6 min-h-[360px] flex items-center justify-center">
          {/* STEP 1: Upload Simulation */}
          {activeStep === 1 && (
            <div className="w-full max-w-sm p-6 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/60 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white">Drag & Drop Portrait</div>
                <div className="text-xs text-neutral-400">JPG or PNG • Max 10MB</div>
              </div>
              <div className="text-[11px] text-emerald-400 bg-emerald-950/40 py-1 px-3 rounded-full inline-block border border-emerald-800/40">
                ✓ Ephemeral In-Memory Processing
              </div>
            </div>
          )}

          {/* STEP 2: Scanning Simulation */}
          {activeStep === 2 && (
            <div className="w-full max-w-sm space-y-4">
              <div className="relative w-48 h-56 mx-auto rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-900 flex items-center justify-center">
                <div className="text-neutral-600 text-xs">Simulated Geometry Mesh</div>
                {/* Horizontal scanner beam */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />
              </div>
              <div className="space-y-1.5 text-xs text-neutral-400 text-center">
                <div className="flex justify-between px-6">
                  <span>Detected Geometry:</span>
                  <span className="font-semibold text-white">Oval / Soft Angular</span>
                </div>
                <div className="flex justify-between px-6">
                  <span>Underlying Undertone:</span>
                  <span className="font-semibold text-amber-300">Warm Autumn Neutral</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Style DNA Simulation */}
          {activeStep === 3 && (
            <div className="w-full max-w-sm space-y-3">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-neutral-800">
                <span className="font-semibold text-white">Style DNA Affinity Breakdown</span>
                <span className="text-amber-400 text-[11px]">84% Match</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Minimalist Modern', pct: 86, color: 'bg-amber-400' },
                  { name: 'Smart Casual', pct: 79, color: 'bg-indigo-400' },
                  { name: 'Modern Streetwear', pct: 64, color: 'bg-emerald-400' },
                  { name: 'Classic Tailored', pct: 58, color: 'bg-neutral-400' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-300">{item.name}</span>
                      <span className="text-neutral-400">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
                Aesthetic: <span className="font-semibold text-white">Clean Minimal Smart Casual</span> with structured drop-shoulders and straight-leg trousers.
              </div>
            </div>
          )}

          {/* STEP 4: Barber Card Simulation */}
          {activeStep === 4 && (
            <div className="w-full max-w-sm p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-semibold text-white">Barber-Ready Spec</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                  Medium Maintenance
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-neutral-200">Textured Low Taper Crop</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Sides: #2 guard taper down to #1 at neckline. Top: 2.5 inches scissor cut with point-texturing to reduce bulk.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-800 text-[10px] text-neutral-400">
                <span>Styling: Sea salt spray + matte paste</span>
                <span>•</span>
                <span>Effort: 4 mins</span>
              </div>
            </div>
          )}

          {/* STEP 5: Visual Before/After Preview */}
          {activeStep === 5 && (
            <div className="w-full max-w-xs space-y-3">
              <BeforeAfterSlider
                currentImageUrl="/sample-portrait.jpg"
                suggestedImageUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%231e293b'/%3E%3Cpath d='M100 240 Q200 130 300 240 T200 480 Z' fill='%230f172a'/%3E%3Ccircle cx='200' cy='200' r='80' fill='%23d4a373'/%3E%3Cpath d='M120 180 Q200 110 280 180' stroke='%23111' stroke-width='30' fill='none' stroke-linecap='round'/%3E%3Ctext x='200' y='360' font-family='sans-serif' font-size='16' fill='%23e2e8f0' text-anchor='middle'%3ESuggested Look Preview%3C/text%3E%3C/svg%3E"
                currentLabel="Current"
                suggestedLabel="Suggested"
              />
              <div className="text-[10px] text-center text-neutral-400">
                Drag the slider to compare Current vs Suggested styling
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
