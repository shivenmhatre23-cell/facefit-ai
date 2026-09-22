'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-widest text-neutral-900 uppercase">
              FaceFit <span className="text-amber-700 font-normal">AI</span>
            </span>
            <span className="text-[10px] tracking-wider text-neutral-400 uppercase -mt-1 font-medium">
              Sartorial Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider text-neutral-600 font-medium">
          <Link href="/#how-it-works" className="hover:text-neutral-950 transition-colors">
            Methodology
          </Link>
          <Link href="/#features" className="hover:text-neutral-950 transition-colors">
            Analysis Pillars
          </Link>
          <Link href="/#ethics" className="hover:text-neutral-950 transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Ethical Guarantee
          </Link>
          <Link href="/profile?sample=true" className="hover:text-amber-800 text-amber-700 transition-colors flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Sample Profile
          </Link>
        </nav>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Styling
          </Link>
        </div>
      </div>
    </header>
  );
}
