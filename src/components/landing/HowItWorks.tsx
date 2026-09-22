import React from 'react';
import { Upload, Sparkles, Compass } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload',
      desc: 'Snap a front-facing selfie or upload a clear portrait. The image is processed in temporary memory with zero biometric storage.',
      icon: Upload,
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'Our optical pipeline extracts facial geometry, hair characteristics, visible beard profile, and skin undertones.',
      icon: Sparkles,
    },
    {
      num: '03',
      title: 'Discover Your Style',
      desc: 'Receive your personalized Style Profile: barber instruction cards, a 6-color palette, wardrobe formulas, and interactive AI stylist.',
      icon: Compass,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-neutral-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-700">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-editorial text-neutral-900 mt-1 mb-2">
            Three Steps to Style Discovery
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            From raw portrait to complete sartorial blueprint in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="luxury-card rounded-2xl p-7 bg-white border border-neutral-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-serif-editorial font-bold text-neutral-300">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-serif-editorial font-bold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
