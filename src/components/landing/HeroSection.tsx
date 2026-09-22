import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F4]">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-amber-100/35 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/90 text-[11px] font-semibold tracking-wider text-neutral-800 uppercase mb-8 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Algorithmic Grooming & Wardrobe Direction
        </div>

        {/* Hero Headline - Exactly as requested */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-editorial tracking-tight text-neutral-900 leading-[1.08] max-w-4xl mx-auto mb-6">
          Meet your AI Style Assistant.
        </h1>

        {/* Supporting text - Explaining photo & preferences analysis for hairstyle, clothing, grooming, and outfits */}
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal mb-10">
          FaceFit AI analyzes your photo and preferences to provide personalized hairstyle, clothing, grooming, and outfit recommendations—engineered for individual confidence, never judgment.
        </p>

        {/* Primary & Secondary CTAs - Exactly as requested */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold tracking-wide text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Create My Style Profile
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-full transition-all shadow-xs"
          >
            See How It Works
          </a>
        </div>

        {/* Reassurance Badges */}
        <div className="flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs text-neutral-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> 6-Swatch Palette
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> Barber Consultation Cards
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> College & Presentation Fits
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Zero Attractiveness Rating
          </span>
        </div>
      </div>
    </section>
  );
}
