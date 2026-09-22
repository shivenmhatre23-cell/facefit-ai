import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveProductDemo } from '@/components/landing/InteractiveProductDemo';
import { SampleProfilePreview } from '@/components/landing/SampleProfilePreview';
import { HowItWorks } from '@/components/landing/HowItWorks';
import {
  Layers,
  Shirt,
  Calendar,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-1 space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <HeroSection />

        {/* 5-Step Interactive Product Demo in Hero Flow */}
        <section className="px-4 sm:px-6 lg:px-8 -mt-6">
          <InteractiveProductDemo />
        </section>

        {/* 4 Feature Exploration Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
              EXPANDED CAPABILITIES
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-neutral-900">
              Beyond Generic Advice
            </h2>
            <p className="text-sm text-neutral-500 max-w-xl mx-auto">
              Engineered modular tools designed for every dimension of personal grooming and styling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Look Builder */}
            <Link
              href="/builder"
              className="p-6 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="font-serif-editorial text-lg font-bold text-neutral-900">Look Builder</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Mix and match hairstyles, tops, bottoms, footwear, and coordinated palettes into custom ensembles.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-neutral-900">
                <span>Build a Look</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* My Wardrobe */}
            <Link
              href="/wardrobe"
              className="p-6 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Shirt className="w-6 h-6 text-indigo-300" />
                </div>
                <h3 className="font-serif-editorial text-lg font-bold text-neutral-900">My Wardrobe</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Catalog your owned clothing. Synthesize cohesive outfits using only garments currently in your closet.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-neutral-900">
                <span>Catalog Wardrobe</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Occasion Stylist */}
            <Link
              href="/occasions"
              className="p-6 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="font-serif-editorial text-lg font-bold text-neutral-900">Occasion Stylist</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  10 life settings: College, Interview, Internship, Weddings, Festivals, Travel, and Formal Black-Tie.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-neutral-900">
                <span>View Occasions</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Budget Stylist */}
            <Link
              href="/budget"
              className="p-6 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IndianRupee className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-serif-editorial text-lg font-bold text-neutral-900">Budget Stylist</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Itemized pricing tiers from ₹1,000 to ₹10,000+ with 70/30 investment guidance on where to spend vs save.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-neutral-900">
                <span>Explore Budgets</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* Existing Sample Profile & How It Works */}
        <SampleProfilePreview />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
