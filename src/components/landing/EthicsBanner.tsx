import React from 'react';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export function EthicsBanner() {
  return (
    <section id="ethics" className="py-16 bg-neutral-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-8 sm:p-10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-neutral-800">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ethical AI Charter
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-editorial text-white">
                Our Promise: Style Discovery, Not Judgment
              </h3>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              FaceFit AI is engineered from the ground up to empower personal presentation and confidence. We adhere to rigorous ethical AI guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-300">
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="font-semibold text-white block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Zero Attractiveness Scoring
              </span>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                We do not rate your beauty or give scores out of 10. We identify geometric harmony and color balance to help you choose flattering cuts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="font-semibold text-white block mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Approximate Age Estimates Only
              </span>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Age is never stated as a definitive fact. It is presented exclusively as an approximate bracket with a clear confidence indicator and AI estimation tag.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="font-semibold text-white block mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ephemeral Image Privacy
              </span>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Your photo is processed in temporary memory for real-time inference and never saved to a database or disk. Your privacy is paramount.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
