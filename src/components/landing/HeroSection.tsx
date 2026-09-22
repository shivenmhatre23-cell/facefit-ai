import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Camera, Shield, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F4]">
      {/* Subtle background ambient accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-100/40 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/90 text-[11px] font-medium tracking-wider text-neutral-800 uppercase mb-8 shadow-xs">
          <span className="flex h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
          The Algorithmic Wardrobe & Barber Director
        </div>

        {/* Editorial Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-editorial tracking-tight text-neutral-900 leading-[1.08] max-w-4xl mx-auto mb-6">
          Your visible features. <br />
          <span className="italic font-normal text-amber-800">Bespoke styling</span> with precision.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal mb-10">
          Upload a simple selfie to discover the hairstyles, color palettes, collar cuts, and wardrobe formulas mathematically calibrated to your facial geometry and undertones.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold tracking-wide text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            Analyze Your Style Profile
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>
          <Link
            href="/profile?sample=true"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-full transition-all shadow-xs"
          >
            Explore Sample Style Profile
          </Link>
        </div>

        {/* Value Badges */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-neutral-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700" /> Exact Barber Instructions
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700" /> 6-Swatch Seasonal Palette
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700" /> Budget & Occasion Outfits
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" /> Zero Attractiveness Rating
          </span>
        </div>
      </div>
    </section>
  );
}
