import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-sm font-semibold tracking-widest text-neutral-900 uppercase">
                FaceFit AI
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
              A bespoke algorithmic personal stylist bridging optical facial geometry, seasonal color theory, and modern barber craft. Designed to inspire individual self-discovery—not judge attractiveness.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Zero photo retention policy: portraits are analyzed in-memory and instantly discarded.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-900 mb-3">
              Styling Architecture
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li><Link href="/analyze" className="hover:text-neutral-900">Geometric Face Analysis</Link></li>
              <li><Link href="/analyze" className="hover:text-neutral-900">Seasonal Color Harmonization</Link></li>
              <li><Link href="/profile?sample=true" className="hover:text-neutral-900">Barber Instruction Cards</Link></li>
              <li><Link href="/profile?sample=true" className="hover:text-neutral-900">Conversational AI Stylist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-900 mb-3">
              Ethical Standards
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>No Attractiveness Scoring</li>
              <li>Approximate Age Estimates Only</li>
              <li>Zero Biometric Storage</li>
              <li>Inclusive Aesthetic Diversity</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} FaceFit AI. Crafted for modern personal confidence.</p>
          <p className="flex items-center gap-1">
            Built with care for self-discovery <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
